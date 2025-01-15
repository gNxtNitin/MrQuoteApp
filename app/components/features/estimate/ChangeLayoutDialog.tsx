import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import { Layouts } from '@/app/database/models/Layouts';
import { useHeaderStore } from '@/app/stores/headerStore';
import { useEstimateStore } from '@/app/stores/estimateStore';
import { duplicateDefaultLayout } from '@/app/database/models/Estimate';
import { openDatabase } from '@/app/services/database/init';
import { useAuth } from '@/app/hooks/useAuth';
import { Report } from '@/app/database/models/Report';

interface ChangeLayoutDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

type TabType = 'my' | 'shared';

interface LayoutItem {
  id: number;
  layout_name: string;
  is_active: boolean;
  is_default?: boolean;
}

export function ChangeLayoutDialog({ visible, onClose, onSave }: ChangeLayoutDialogProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const selectedCompanyId = useHeaderStore(state => state.selectedCompany);
  const companyLayouts = useHeaderStore(state => state.companyLayouts);
  const selectedLayoutId = useEstimateStore(state => state.selectedLayoutId);
  const selectedEstimate = useEstimateStore(state => state.selectedEstimate);
  const setCompanyLayout = useHeaderStore(state => state.setCompanyLayout);
  const fetchAndSetLayout = useEstimateStore(state => state.fetchAndSetLayout);
  
  const [activeTab, setActiveTab] = useState<TabType>('my');
  const [selectedLayout, setSelectedLayout] = useState<LayoutItem | null>(null);
  const [myLayouts, setMyLayouts] = useState<LayoutItem[]>([]);
  const [sharedLayouts, setSharedLayouts] = useState<LayoutItem[]>([]);
  const [defaultLayout, setDefaultLayout] = useState<LayoutItem | null>(null);

  useEffect(() => {
    loadLayouts();
  }, [selectedCompanyId]);

  const loadLayouts = async () => {
    try {
      const layouts = await Layouts.getByCompanyId(selectedCompanyId);
      
      // Filter active layouts and separate into my and shared
      const activeLayouts = layouts.filter(layout => layout.is_active);
      
      const myLayoutsList = activeLayouts
        .filter(layout => !layout.is_shared)
        .map(layout => ({
          id: layout.id!,
          layout_name: layout.layout_name!,
          is_active: layout.is_active!,
          is_default: layout.is_default || false
        }));

      const sharedLayoutsList = activeLayouts
        .filter(layout => layout.is_shared)
        .map(layout => ({
          id: layout.id!,
          layout_name: layout.layout_name!,
          is_active: layout.is_active!,
          is_default: layout.is_default || false
        }));

      setMyLayouts(myLayoutsList);
      setSharedLayouts(sharedLayoutsList);

      // Find and set default layout
      const defaultLayout = [...myLayoutsList, ...sharedLayoutsList].find(l => l.is_default);
      setDefaultLayout(defaultLayout || null);

      // Set selected layout based on stored company layout or default
      if (selectedLayoutId) {
        const layoutToSelect = [...myLayoutsList, ...sharedLayoutsList]
          .find(l => l.id === selectedLayoutId);
        if (layoutToSelect) {
          setSelectedLayout(layoutToSelect);
          setActiveTab(myLayoutsList.some(l => l.id === layoutToSelect.id) ? 'my' : 'shared');
        }
      } else if (defaultLayout) {
        setSelectedLayout(defaultLayout);
        setActiveTab(myLayoutsList.some(l => l.id === defaultLayout.id) ? 'my' : 'shared');
      }
    } catch (error) {
      console.error('Error loading layouts:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedLayout || !user?.id || !selectedEstimate?.id || !selectedEstimate.estimate_name) {
        console.error('Missing required data for save operation');
        return;
      }

      const db = openDatabase();

      // 1. Duplicate the layout
      const newPageId = await duplicateDefaultLayout(
        selectedCompanyId,
        selectedEstimate.estimate_name,
        user.id,
        {
          id: selectedLayout.id,
          layout_name: selectedLayout.layout_name,
          is_active: selectedLayout.is_active
        },
        db
      );

      if (!newPageId) {
        console.error('Failed to duplicate layout');
        return;
      }

      // 2. Update the report with the new layout ID
      const reports = await Report.getByEstimateId(selectedEstimate.id);
      if (reports && reports.length > 0) {
        await Report.update(reports[0].id!, {
          layout_id: selectedLayout.id,
          modified_by: user.id,
          modified_date: new Date().toISOString()
        });
      } else {
        console.error('No report found for estimate:', selectedEstimate.id);
        return;
      }

      // 3. Fetch and update the layout in estimate store
      await fetchAndSetLayout(selectedEstimate.id);

      // 4. Call the onSave prop
      onSave();
      
      // 5. Close the dialog
      onClose();

    } catch (error) {
      console.error('Error saving layout:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleLayoutSelect = (layout: LayoutItem) => {
    setSelectedLayout(layout);
    setCompanyLayout(selectedCompanyId, layout.id, layout.layout_name);
  };

  const renderLayoutItem = (layout: LayoutItem) => (
    <Pressable
      key={layout.id}
      style={[
        styles.layoutItem,
        selectedLayout?.id === layout.id && styles.selectedLayout
      ]}
      onPress={() => handleLayoutSelect(layout)}
    >
      <View style={styles.layoutItemContent}>
        <Text style={styles.layoutName}>{layout.layout_name}</Text>
        {layout.is_default && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      {selectedLayout?.id === layout.id && (
        <MaterialIcons name="check" size={24} color={Colors.primary} />
      )}
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { 
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border
        }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>Change Layout</Text>
              <Text style={[styles.subtitle, { color: theme.colors.text }]}>
                Configure layout for this report
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <View style={styles.tabsContainer}>
            <Pressable
              style={[styles.tab, activeTab === 'my' && styles.activeTab]}
              onPress={() => setActiveTab('my')}
            >
              <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
                My Layouts {defaultLayout && myLayouts.some(l => l.id === defaultLayout.id) && '(Default)'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'shared' && styles.activeTab]}
              onPress={() => setActiveTab('shared')}
            >
              <Text style={[styles.tabText, activeTab === 'shared' && styles.activeTabText]}>
                Shared Layouts {defaultLayout && sharedLayouts.some(l => l.id === defaultLayout.id) && '(Default)'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.layoutList}>
            {activeTab === 'my' ? 
              myLayouts.map(renderLayoutItem) :
              sharedLayouts.map(renderLayoutItem)
            }
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={onClose}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.saveBtn,
                (!selectedLayout || !selectedEstimate?.id) && styles.saveBtnDisabled
              ]}
              onPress={handleSave}
              disabled={!selectedLayout || !selectedEstimate?.id}
            >
              <Text style={styles.saveBtnText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 600,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[500],
  },
  closeButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.gray[500],
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  layoutList: {
    gap: 12,
    marginBottom: 24,
  },
  layoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  selectedLayout: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08', // 3% opacity
  },
  layoutName: {
    fontSize: 16,
    color: Colors.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  closeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  closeBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  layoutItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
}); 