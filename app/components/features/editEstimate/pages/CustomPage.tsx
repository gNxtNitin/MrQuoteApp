import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Card } from '../../../common/Card';
import { Colors } from '@/app/constants/colors';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Input } from '../../../common/Input';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../common/Button';
import { FileUploader } from '@/app/components/common/FileUploader';
import { useEstimatePageStore } from '@/app/stores/estimatePageStore';
import { useTheme } from '@/app/components/providers/ThemeProvider';

interface CustomPageProps {
  title: string;
}

const TOKENS = [
  { label: 'Customer Name', value: '{{CUSTOMER_NAME}}' },
  { label: 'Project Address', value: '{{PROJECT_ADDRESS}}' },
  { label: 'Quote Date', value: '{{QUOTE_DATE}}' },
  { label: 'Quote Number', value: '{{QUOTE_NUMBER}}' },
  { label: 'Total Amount', value: '{{TOTAL_AMOUNT}}' },
];

const PDFContent = ({ title, pageId }: { title: string; pageId: number }) => {
  const { customPages, updateCustomPage } = useEstimatePageStore();
  const pageData = customPages.find(page => page.id === pageId);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle PDF specific content updates
  const handleFileSelection = (files: string[]) => {
    if (pageData) {
      updateCustomPage(pageId, {
        content: {
          ...pageData.content,
          myPDFs: {
            ...pageData.content?.myPDFs,
            selectedFiles: files
          }
        }
      });
    }
  };

  return (
    <View style={styles.pdfContent}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      {/* Combined Search and Files Area */}
      <View style={styles.searchArea}>
        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search files and folders"
            placeholderTextColor={Colors.gray[400]}
          />
        </View>

        {/* Files Section */}
        <View style={styles.filesSection}>
          <Text style={styles.filesSectionTitle}>Files /</Text>
          <View style={styles.foldersContainer}>
            <TouchableOpacity style={styles.folderCard}>
              <View style={styles.folderIcon}>
                <Feather name="folder" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.folderName}>New Folder (0)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.folderCard}>
              <View style={styles.folderIcon}>
                <Feather name="folder" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.folderName}>New Folder (3)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const SharedPDFsContent = ({ title, pageId }: { title: string; pageId: number }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.pdfContent}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      {/* Combined Search and Files Area */}
      <View style={styles.searchArea}>
        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search files and folders"
            placeholderTextColor={Colors.gray[400]}
          />
        </View>

        {/* Files Section */}
        <View style={styles.filesSection}>
          <Text style={styles.filesSectionTitle}>Files /</Text>
          <View style={styles.foldersContainer}>
            <TouchableOpacity style={styles.folderCard}>
              <View style={styles.folderIcon}>
                <Feather name="folder" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.folderName}>New Folder (0)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.folderCard}>
              <View style={styles.folderIcon}>
                <Feather name="folder" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.folderName}>New Folder (3)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const SingleUsePDFContent = ({ title, pageId }: { title: string; pageId: number }) => {
  return (
    <View style={styles.pdfContent}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FileUploader
        accept="pdf"
        height={300}
        subtitle="Drag and drop your file here or click to browse"
        variant="dashed"
        onUpload={() => console.log('Upload PDF')}
      />
    </View>
  );
};

const TextPageContent = ({ title, pageId }: { title: string; pageId: number }) => {
  const { customPages, updateCustomPage } = useEstimatePageStore();
  const pageData = customPages.find(page => page.id === pageId);
  
  const [editorContent, setEditorContent] = useState('');
  const [showTokens, setShowTokens] = useState(false);
  const editorRef = React.useRef<RichEditor>(null);
  const tokenButtonRef = React.useRef<View>(null);
  const contentRef = React.useRef(editorContent);

  // Initialize editor content when page changes
  useEffect(() => {
    const content = pageData?.content?.textPage || '';
    setEditorContent(content);
    contentRef.current = content;
  }, [pageId]);

  // Debounced update to store
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pageData && contentRef.current !== editorContent) {
        contentRef.current = editorContent;
        updateCustomPage(pageId, {
          content: {
            ...pageData.content,
            textPage: editorContent
          }
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [editorContent, pageId, pageData]);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const insertToken = (token: string) => {
    editorRef.current?.insertHTML(token);
    setShowTokens(false);
  };

  return (
    <View style={styles.pdfContent}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      <View style={styles.editorContainer}>
        <View style={styles.toolbarContainer}>
          <View style={styles.tokenContainer} ref={tokenButtonRef}>
            <TouchableOpacity 
              style={styles.tokenButton}
              onPress={() => setShowTokens(!showTokens)}
            >
              <MaterialIcons 
                name={showTokens ? "expand-less" : "expand-more"} 
                size={24} 
                color={Colors.black} 
              />
              <Text style={styles.tokenButtonText}>Insert Token</Text>
            </TouchableOpacity>
            {showTokens && (
              <View style={styles.tokenDropdown}>
                {TOKENS.map((token, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tokenItem}
                    onPress={() => insertToken(token.value)}
                  >
                    <Text style={styles.tokenText}>{token.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <RichToolbar
            editor={editorRef}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.setStrikethrough,
              actions.blockquote
            ]}
            style={styles.toolbar}
            iconTint={Colors.black}
            selectedIconTint={Colors.primary}
            iconContainerStyle={styles.toolbarIcon}
          />
        </View>
        <View style={styles.editorContent}>
          <RichEditor
            key={`editor-${pageId}`}
            ref={editorRef}
            onChange={handleEditorChange}
            placeholder="Start typing..."
            style={styles.editor}
            initialHeight={400}
            initialContentHTML={editorContent}
          />
        </View>
      </View>
    </View>
  );
};

export function CustomPage({ title }: CustomPageProps) {
  const { customPages, updateCustomPage } = useEstimatePageStore();
  const pageData = customPages.find(page => page.title === title);
  const theme = useTheme();

  // Combine all state into a single object to reduce state updates
  const [pageState, setPageState] = useState({
    requireAcknowledge: false,
    selectedType: 'myPDFs' as 'myPDFs' | 'sharedPDFs' | 'singleUsePDFs' | 'textPage',
    isEditingTitle: false,
    pageTitle: title
  });

  // Initialize state from store data only once when component mounts or title changes
  useEffect(() => {
    if (pageData) {
      setPageState(prev => ({
        ...prev,
        requireAcknowledge: pageData.requireAcknowledge || false,
        selectedType: pageData.type || 'myPDFs',
        pageTitle: pageData.title || title
      }));
    }
  }, [title]); // Only depend on title changes

  // Debounced update to store
  useEffect(() => {
    if (!pageData) return;

    const timeoutId = setTimeout(() => {
      updateCustomPage(pageData.id, {
        requireAcknowledge: pageState.requireAcknowledge,
        type: pageState.selectedType,
        title: pageState.pageTitle,
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [pageState, pageData?.id]); // Only update when pageState or pageData.id changes

  const handleStateChange = (key: keyof typeof pageState, value: any) => {
    setPageState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update your handlers to use the new state management
  const handleSave = () => {
    if (pageData) {
      updateCustomPage(pageData.id, {
        requireAcknowledge: pageState.requireAcknowledge,
        type: pageState.selectedType,
        title: pageState.pageTitle,
      });
    }
  };

  const renderPDFContent = () => {
    if (!pageData) return null;
    
    switch (pageState.selectedType) {
      case 'myPDFs':
        return <PDFContent key={`pdf-${pageData.id}`} title="My PDFs" pageId={pageData.id} />;
      case 'sharedPDFs':
        return <SharedPDFsContent key={`shared-${pageData.id}`} title="Shared PDFs" pageId={pageData.id} />;
      case 'singleUsePDFs':
        return <SingleUsePDFContent key={`single-${pageData.id}`} title="Single Use PDFs" pageId={pageData.id} />;
      case 'textPage':
        return <TextPageContent key={`text-${pageData.id}`} title="Text Page" pageId={pageData.id} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {pageState.isEditingTitle ? (
              <Input
                value={pageState.pageTitle}
                onChangeText={(value) => handleStateChange('pageTitle', value)}
                onBlur={() => handleStateChange('isEditingTitle', false)}
                autoFocus
                style={styles.titleInput}
              />
            ) : (
              <>
                <Text style={styles.title}>{pageState.pageTitle}</Text>
                <TouchableOpacity onPress={() => handleStateChange('isEditingTitle', true)}>
                  <Feather name="edit-2" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Acknowledge Switch */}
        <View style={styles.acknowledgeContainer}>
          <View style={styles.acknowledgeContent}>
            <Text style={styles.acknowledgeTitle}>
              Require customers to acknowledge this page
            </Text>
            <Text style={styles.acknowledgeSubtitle}>
              They will be asked during the signing process
            </Text>
          </View>
          <Switch
            value={pageState.requireAcknowledge}
            onValueChange={(value) => handleStateChange('requireAcknowledge', value)}
            trackColor={{ false: Colors.gray[200], true: Colors.primary }}
            thumbColor="white"
          />
        </View>

        {/* Type Selection */}
        <View style={styles.typeContainer}>
          <TouchableOpacity 
            style={[styles.typeButton, pageState.selectedType === 'myPDFs' && styles.selectedType]}
            onPress={() => handleStateChange('selectedType', 'myPDFs')}
          >
            <View style={[styles.radio, pageState.selectedType === 'myPDFs' && styles.selectedRadio]}>
              <View style={pageState.selectedType === 'myPDFs' ? styles.radioInner : undefined} />
            </View>
            <Text style={[styles.typeText, pageState.selectedType === 'myPDFs' && styles.selectedTypeText]}>
              My PDFs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.typeButton, pageState.selectedType === 'sharedPDFs' && styles.selectedType]}
            onPress={() => handleStateChange('selectedType', 'sharedPDFs')}
          >
            <View style={[styles.radio, pageState.selectedType === 'sharedPDFs' && styles.selectedRadio]}>
              <View style={pageState.selectedType === 'sharedPDFs' ? styles.radioInner : undefined} />
            </View>
            <Text style={[styles.typeText, pageState.selectedType === 'sharedPDFs' && styles.selectedTypeText]}>
              Shared PDFs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.typeButton, pageState.selectedType === 'singleUsePDFs' && styles.selectedType]}
            onPress={() => handleStateChange('selectedType', 'singleUsePDFs')}
          >
            <View style={[styles.radio, pageState.selectedType === 'singleUsePDFs' && styles.selectedRadio]}>
              <View style={pageState.selectedType === 'singleUsePDFs' ? styles.radioInner : undefined} />
            </View>
            <Text style={[styles.typeText, pageState.selectedType === 'singleUsePDFs' && styles.selectedTypeText]}>
              Single Use PDFs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.typeButton, pageState.selectedType === 'textPage' && styles.selectedType]}
            onPress={() => handleStateChange('selectedType', 'textPage')}
          >
            <View style={[styles.radio, pageState.selectedType === 'textPage' && styles.selectedRadio]}>
              <View style={pageState.selectedType === 'textPage' ? styles.radioInner : undefined} />
            </View>
            <Text style={[styles.typeText, pageState.selectedType === 'textPage' && styles.selectedTypeText]}>
              Text Page
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render PDF content based on selected type */}
        {renderPDFContent()}

        {/* Add Save Button */}
        <View style={styles.buttonContainer}>
          <Button 
            label="Save Changes"
            onPress={handleSave}
            variant="primary"
            size="small"
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
  },
  acknowledgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    marginBottom: 24,
  },
  acknowledgeContent: {
    flex: 1,
    marginRight: 16,
  },
  acknowledgeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 4,
  },
  acknowledgeSubtitle: {
    fontSize: 14,
    color: Colors.gray[500],
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    backgroundColor: 'white',
    minWidth: 120,
  },
  selectedType: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray[400],
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  typeText: {
    fontSize: 14,
    color: Colors.gray[500],
  },
  selectedTypeText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  pdfContent: {
    marginTop: 24,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
  },
  searchArea: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    marginBottom: 24,
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.black,
    height: '100%',
  },
  filesSection: {
    flex: 1,
  },
  filesSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 16,
  },
  foldersContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  folderCard: {
    width: 140,
    padding: 12,
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    alignItems: 'center',
  },
  folderIcon: {
    marginBottom: 8,
  },
  folderName: {
    fontSize: 14,
    color: Colors.black,
    textAlign: 'center',
  },
  uploadContainer: {
    flex: 1,
    padding: 24,
  },
  uploadBox: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.gray[200],
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 16,
    textAlign: 'center',
  },
  browseButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 16,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  uploadLimit: {
    fontSize: 12,
    color: Colors.gray[400],
  },
  editorContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    backgroundColor: 'white',
  },
  toolbarContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  toolbar: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
  },
  toolbarIcon: {
    justifyContent: 'flex-start',
  },
  tokenContainer: {
    borderRightWidth: 1,
    borderRightColor: Colors.gray[200],
    position: 'relative',
  },
  tokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  tokenButtonText: {
    color: Colors.black,
    fontSize: 14,
  },
  tokenDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 4,
    width: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tokenItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  tokenText: {
    fontSize: 14,
    color: Colors.black,
  },
  editorContent: {
    flex: 1,
  },
  editor: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});