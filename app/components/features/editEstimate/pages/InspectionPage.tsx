import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from '../../../common/Card';
import { Input } from '../../../common/Input';
import { Colors } from '@/app/constants/colors';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../common/Button';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

export function InspectionPage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('Inspection');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sections, setSections] = useState([
    {
      id: '1',
      title: 'Section 1',
      items: [{ id: '1', description: '', images: [] }]
    }
  ]);

  const editorRefs = useRef<{[key: string]: React.RefObject<RichEditor>}>({});
  const [editorContents, setEditorContents] = useState<{[key: string]: string}>({});

  // Initialize refs for each item
  useEffect(() => {
    sections.forEach(section => {
      section.items.forEach(item => {
        if (!editorRefs.current[item.id]) {
          editorRefs.current[item.id] = React.createRef<RichEditor>();
        }
      });
    });
  }, [sections]);

  const addSection = () => {
    const newSectionNumber = sections.length + 1;
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title: `Section ${newSectionNumber}`,
        items: [{ id: Date.now().toString(), description: '', images: [] }]
      }
    ]);
  };

  const addItem = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newItemId = Date.now().toString();
        editorRefs.current[newItemId] = React.createRef<RichEditor>();
        return {
          ...section,
          items: [...section.items, { id: newItemId, description: '', images: [] }]
        };
      }
      return section;
    }));
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          title: newTitle
        };
      }
      return section;
    }));
  };

  const handleEditorChange = (itemId: string, content: string) => {
    setEditorContents(prev => ({
      ...prev,
      [itemId]: content
    }));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    }));
  };

  const handleSaveChanges = () => {
    // Implement save changes logic
    console.log('Saving changes:', {
      title,
      sections,
      editorContents
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChangeText={setTitle}
                  onBlur={() => setIsEditingTitle(false)}
                  autoFocus
                  style={styles.titleInput}
                />
              ) : (
                <>
                  <Text style={styles.title}>{title}</Text>
                  <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                    <Feather name="edit-2" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Style Selector */}
          <View style={styles.styleSection}>
            <Text style={styles.label}>Style:</Text>
            <Text style={styles.styleText}>Standard</Text>
            <TouchableOpacity>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Sections */}
          {sections.map((section, sectionIndex) => (
            <View key={section.id} style={styles.itemsContainer}>
              <View style={styles.titleRow}>
                {editingSectionId === section.id ? (
                  <Input
                    value={section.title}
                    onChangeText={(newTitle) => updateSectionTitle(section.id, newTitle)}
                    onBlur={() => setEditingSectionId(null)}
                    autoFocus
                    style={styles.sectionTitle}
                  />
                ) : (
                  <>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <TouchableOpacity onPress={() => setEditingSectionId(section.id)}>
                      <Feather name="edit-2" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => deleteSection(section.id)}>
                      <MaterialIcons name="delete" size={18} color={Colors.red[500]} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
              
              {section.items.map((item) => (
                <Card key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <TouchableOpacity 
                      style={styles.deleteIcon}
                      onPress={() => deleteItem(section.id, item.id)}
                    >
                      <MaterialIcons name="delete" size={18} color={Colors.red[500]} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardContainer}>
                    {/* Left Side - Upload Section */}
                    <View style={[styles.leftSection, styles.sectionBorder]}>
                      <Text style={styles.sectionHeader}>Upload Files</Text>
                      <TouchableOpacity style={styles.uploadSection}>
                        <MaterialIcons name="file-upload" size={24} color={Colors.gray[500]} />
                        <Text style={styles.uploadText}>Upload Images</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Right Side - Description Section */}
                    <View style={[styles.rightSection, styles.sectionBorder]}>
                      <Text style={styles.sectionHeader}>Description</Text>
                      <View style={styles.editorSection}>
                        <RichToolbar
                          editor={editorRefs.current[item.id]}
                          actions={[
                            actions.setBold,
                            actions.setItalic,
                            actions.setUnderline,
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                            actions.setStrikethrough,
                            actions.blockquote,
                            actions.undo,
                            actions.redo
                          ]}
                          selectedIconTint={Colors.primary}
                          disabledIconTint={Colors.black}
                          iconTint={Colors.black}
                          style={[styles.editorTools]}
                          iconSize={18}
                        />
                        <RichEditor
                          ref={editorRefs.current[item.id]}
                          onChange={(content) => handleEditorChange(item.id, content)}
                          placeholder="Enter description..."
                          style={styles.editorContent}
                          initialHeight={200}
                          useContainer={true}
                          initialFocus={false}
                          editorStyle={{
                            backgroundColor: Colors.white,
                            contentCSSText: `
                              font-size: 16px;
                              min-height: 200px;
                              padding: 12px;
                            `
                          }}
                          scrollEnabled={true}
                          containerStyle={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: Colors.gray[200],
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Card>
              ))}

              <View style={styles.buttonContainer}>
                <Button
                  label="+ Add Item"
                  onPress={() => addItem(section.id)}
                  variant="outline"
                  size="medium"
                />
              </View>
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <Button
              label="+ Add Section"
              onPress={addSection}
              variant="primary"
              size="medium"
            />
          </View>

          <View style={[styles.buttonContainer, styles.saveButtonContainer]}>
            <Button
              label="Save Changes"
              onPress={handleSaveChanges}
              variant="primary"
              size="small"
            />
          </View>
        </ScrollView>
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
  mainCard: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  styleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.black,
  },
  styleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
  },
  changeLink: {
    color: Colors.primary,
    fontSize: 14,
  },
  itemsContainer: {
    gap: 16,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  itemCard: {
    padding: 24,
  },
  itemHeader: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  deleteIcon: {
    padding: 4,
  },
  cardContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  leftSection: {
    width: '40%',
  },
  rightSection: {
    flex: 1,
  },
  sectionBorder: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
  },
  uploadSection: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.gray[300],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    flex: 1,
    minHeight: 200,
    padding: 16
  },
  uploadText: {
    color: Colors.gray[500],
    marginTop: 8,
  },
  editorSection: {
    gap: 8,
  },
  editorTools: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 8,
    alignItems: 'flex-start',
  },
  editorContent: {
    minHeight: 200,
    backgroundColor: Colors.white,
  },
  buttonContainer: {
    alignItems: 'flex-start',
  },
  saveButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  addSectionButton: {
    marginTop: 24,
  },
});