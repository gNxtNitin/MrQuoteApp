import { View, Text, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

interface ChangeLayoutDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

type TabType = 'my' | 'shared';

const MY_LAYOUTS = [
  'Default Layout',
  'Residential Roofing Quote (Sample)',
  'Change Order',
  '(Sample) Insurance Contract',
];

const SHARED_LAYOUTS = [
  'Malarkey Roofing Quote(Sample)',
  '(Sample) James Hardie Siding',
  '(Sample) Residential Cement Board Siding',
  'Atlas Roofing Quote(Sample)',
];

export function ChangeLayoutDialog({ visible, onClose, onSave }: ChangeLayoutDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('my');
  const [selectedLayout, setSelectedLayout] = useState<string>('Default Layout');

  const layouts = activeTab === 'my' ? MY_LAYOUTS : SHARED_LAYOUTS;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Change Layout</Text>
              <Text style={styles.subtitle}>Configure layout for this report</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'my' && styles.activeTab]}
              onPress={() => setActiveTab('my')}
            >
              <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
                My Layouts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'shared' && styles.activeTab]}
              onPress={() => setActiveTab('shared')}
            >
              <Text style={[styles.tabText, activeTab === 'shared' && styles.activeTabText]}>
                Shared Layouts
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.layoutList}>
            {layouts.map((layout) => (
              <TouchableOpacity 
                key={layout}
                style={[
                  styles.layoutItem,
                  selectedLayout === layout && styles.selectedLayout
                ]}
                onPress={() => setSelectedLayout(layout)}
              >
                <Text style={styles.layoutName}>{layout}</Text>
                {selectedLayout === layout && (
                  <MaterialIcons name="check-circle" size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={onClose}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveBtn}
              onPress={onSave}
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
}); 