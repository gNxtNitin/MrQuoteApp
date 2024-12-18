import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from '../../../common/Card';
import { Input } from '../../../common/Input';
import { Colors } from '@/app/constants/colors';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../common/Button';

export function InspectionPage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('Inspection');

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

          {/* Inspection Items */}
          <View style={styles.itemsContainer}>
            <Card style={styles.itemCard}>
              <View style={styles.uploadSection}>
                <MaterialIcons name="upload-file" size={24} color={Colors.gray[400]} />
                <Text style={styles.uploadText}>Upload</Text>
              </View>
              
              <View style={styles.editorSection}>
                <View style={styles.editorTools}>
                  <TouchableOpacity style={styles.toolButton}>
                    <Text style={styles.toolText}>B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolButton}>
                    <Text style={styles.toolText}>I</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolButton}>
                    <Text style={styles.toolText}>U</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolButton}>
                    <MaterialIcons name="format-list-bulleted" size={20} color={Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolButton}>
                    <MaterialIcons name="format-list-numbered" size={20} color={Colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolButton}>
                    <MaterialIcons name="link" size={20} color={Colors.black} />
                  </TouchableOpacity>
                </View>
                <View style={styles.editorContent}>
                  {/* Editor content will go here */}
                </View>
              </View>
            </Card>

            <TouchableOpacity style={styles.addItemButton}>
              <Text style={styles.addItemText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          <Button
            label="ADD SECTION"
            onPress={() => {}}
            variant="primary"
          />
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
  },
  itemCard: {
    padding: 16,
    gap: 16,
  },
  uploadSection: {
    height: 200,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.gray[300],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
  },
  uploadText: {
    color: Colors.gray[500],
    marginTop: 8,
  },
  editorSection: {
    gap: 8,
  },
  editorTools: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  toolButton: {
    padding: 4,
    borderRadius: 4,
  },
  toolText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  editorContent: {
    minHeight: 100,
  },
  addItemButton: {
    paddingVertical: 8,
  },
  addItemText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  addSectionButton: {
    marginTop: 24,
  },
}); 