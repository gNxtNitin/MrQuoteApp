import { View, Text, StyleSheet, Animated, Pressable, Alert, ScrollView } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useEstimatePageStore } from '@/app/stores/estimatePageStore';
import { useTheme } from '../../providers/ThemeProvider';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: number;
  title: string;
  isCustom?: boolean;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const { setCurrentPage, customPages, addCustomPage, currentPage } = useEstimatePageStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, title: 'Title' },
    { id: 2, title: 'Introduction' },
    { id: 3, title: 'Inspection' },
    { id: 4, title: 'Layout' },
    { id: 5, title: 'Quote Details' },
    { id: 6, title: 'Authorize Page' },
    { id: 7, title: 'Terms and Conditions' },
    // { id: 8, title: 'Warranty' },
  ]);

  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<number>(1);
  
  useEffect(() => {
    const currentMenuItem = menuItems.find(item => item.title === currentPage);
    if (currentMenuItem) {
      setSelectedItem(currentMenuItem.id);
    }
  }, [currentPage, menuItems]);

  useEffect(() => {
    const updatedMenuItems = [
      ...menuItems.filter(item => !item.isCustom),
      ...customPages.map(cp => ({
        id: cp.id,
        title: cp.title,
        isCustom: true,
      })),
    ];
    setMenuItems(updatedMenuItems);
  }, [customPages]);

  const handleHomePress = () => {
    router.replace('/home');
    onClose();
  };

  const handleMenuItemPress = (id: number, title: string) => {
    setSelectedItem(id);
    setCurrentPage(title);
    onClose();
  };

  const handleCheckboxToggle = (id: number, event: any) => {
    event.stopPropagation();
    setCheckedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleAddCustomPage = () => {
    const newId = Math.max(...menuItems.map(item => item.id)) + 1;
    const customPageCount = customPages.length + 1;
    const newTitle = `Custom Page ${customPageCount}`;
    
    addCustomPage({
      id: newId,
      title: newTitle,
      type: 'myPDFs',
      requireAcknowledge: false,
    });
    
    setSelectedItem(newId);
    setCurrentPage(newTitle);
  };

  return (
    <>
      {isOpen && (
        <View style={styles.container}>
          <Pressable style={styles.overlay} onPress={onClose}>
            <View style={[styles.sidebar, { backgroundColor: theme.background }]}>
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <Pressable onPress={handleHomePress} style={styles.homeButton}>
                    <View style={styles.iconBox}>
                      <MaterialIcons name="home" size={24} color={Colors.primary} />
                    </View>
                  </Pressable>
                  <Text style={styles.title}>Menu</Text>
                </View>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color={Colors.primary} />
                </Pressable>
              </View>
              
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {menuItems.map((item) => {
                  const isSelected = selectedItem === item.id;
                  return (
                    <Pressable 
                      key={item.id}
                      style={[
                        styles.menuItem,
                        isSelected && styles.menuItemSelected
                      ]}
                      onPress={() => handleMenuItemPress(item.id, item.title)}
                    >
                      <View style={styles.menuItemContent}>
                        <Pressable 
                          onPress={(event) => handleCheckboxToggle(item.id, event)}
                          style={styles.checkboxContainer}
                        >
                          <Feather
                            name={checkedItems.includes(item.id) ? "check-square" : "square"}
                            size={20}
                            color={isSelected ? Colors.white : theme.textPrimary}
                          />
                        </Pressable>
                        <Text style={[
                          [styles.menuItemText, { color: theme.textPrimary }],
                          isSelected && styles.menuItemTextSelected
                        ]}>
                          {item.title}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.footer}>
                <Pressable 
                  style={styles.addButton}
                  onPress={handleAddCustomPage}
                >
                  <MaterialIcons name="add" size={24} color={Colors.white} />
                  <Text style={styles.addButtonText}>Add Custom Page</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[500],
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeButton: {
    padding: 8,
  },
  homeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemSelected: {
    backgroundColor: Colors.primary,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
    // fontWeight: '400',
  },
  menuItemTextSelected: {
    color: Colors.white,
    fontSize:17,
    fontWeight:'700'
  },
  menuItemTextContainer: {
    flex: 1,
    borderRadius: 8,
  },
  menuItemTextContainerSelected: {
    backgroundColor: 'transparent',
  },
  checkboxContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[500],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
}); 