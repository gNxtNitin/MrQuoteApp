import { View, Text, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/app/constants/colors';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../common/Button';
import { useEstimatePageStore } from '@/app/stores/estimatePageStore';
import { useTheme } from '../../providers/ThemeProvider';

const DEFAULT_PAGES = [
  'Title',
  'Introduction',
  'Inspection',
  'Layout',
  'Quote Details',
  'Authorize Page',
  'Terms and Conditions',
  'Warranty'
];

export function SubHeader() {
  const { currentPage, removeCustomPage, customPages, setCurrentPage } = useEstimatePageStore();
  const handleBack = () => router.back();
  const theme = useTheme();
  const handleViewPage = () => {
    // Handle view page action
  };

  const isCustomPage = currentPage.startsWith('Custom Page');
  const currentCustomPage = isCustomPage ? 
    customPages.find(page => page.title === currentPage) : null;

  const handleDeletePage = () => {
    if (currentCustomPage) {
      Alert.alert(
        "Delete Custom Page",
        `Are you sure you want to delete "${currentCustomPage.title}"?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: () => {
              // Get all pages in order
              const allPages = [
                ...DEFAULT_PAGES,
                ...customPages.map(cp => cp.title)
              ];
              
              // Find current page index
              const currentIndex = allPages.indexOf(currentPage);
              
              // Remove the page
              removeCustomPage(currentCustomPage.id);
              
              // Navigate to next page or previous if it's the last page
              const nextPage = allPages[currentIndex + 1] || allPages[currentIndex - 1] || 'Title';
              setCurrentPage(nextPage);
            },
            style: "destructive"
          }
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.leftSection}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={20} color={theme.primary} />
          <Text style={[styles.backText, { color: theme.primary }]}>Back</Text>
        </Pressable>
        <View style={styles.estimateInfo}>
          <Text style={[styles.estimateName, { color: theme.primary }]}>Estimate #1234</Text>
          <Text style={[styles.layoutText, { color: theme.textSecondary }]}>Layout: Default Layout</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {isCustomPage && (
          <View style={{ marginRight: 16 }}>
          <Button 
            label="Delete Page"
            onPress={handleDeletePage}
            variant="delete"
            size="medium"
          />
          </View>
        )}
        <Button 
          label="View Page"
          onPress={handleViewPage}
          variant="primary"
          size="medium"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    gap: 8,
  },
  estimateInfo: {
    marginTop: 4,
  },
  estimateName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  layoutText: {
    fontSize: 14,
    color: Colors.black,
    opacity: 0.7,
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  backText: { 
    fontSize: 16, 
    color: Colors.primary, 
    fontWeight: '600' 
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 