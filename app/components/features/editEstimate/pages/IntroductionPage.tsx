import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/app/constants/colors';
import { Input } from '../../../common/Input';
import { Button } from '@/app/components/common/Button';

interface Template {
  id: string;
  content: string;
  title: string;
}

export function IntroductionPage() {
  const [editorContent, setEditorContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [introTitle, setIntroTitle] = useState('Introduction');
  const editorRef = React.useRef<RichEditor>(null);
  
  const handleSaveTemplate = () => {
    // Implement save template logic
    if (editorContent) {
      const newTemplate: Template = {
        id: Date.now().toString(),
        content: editorContent,
        title: `Template ${Date.now()}`
      };
      // Save to storage or state management
      console.log('Saving template:', newTemplate);
    }
  };

  const handleViewTemplates = () => {
    // Implement view templates logic
    console.log('Viewing templates');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {isEditingTitle ? (
            <Input
              value={introTitle}
              onChangeText={setIntroTitle}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
              style={styles.titleInput}
            />
          ) : (
            <>
              <Text style={styles.title}>{introTitle}</Text>
              <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                <Feather name="edit-2" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.templatesRow}>
        <Text style={styles.savedTemplatesText}>You have saved templates.</Text>
        <TouchableOpacity onPress={handleViewTemplates}>
          <Text style={styles.link}>View templates</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.editorContainer}>
        <RichToolbar
          editor={editorRef}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.setStrikethrough, 
          ]}
          selectedIconTint={Colors.primary}
          disabledTextTint={Colors.black}
          iconTint={Colors.black}
          style={styles.toolbar}
          iconContainerStyle={styles.toolbarIcon}
        />
        
        <RichEditor
          ref={editorRef}
          onChange={setEditorContent}
          placeholder="Start typing your introduction..."
          style={styles.editor}
          initialFocus={false}
          useContainer={true}
          initialHeight={400}
          editorStyle={{
            backgroundColor: '#fff',
            contentCSSText: 'font-size: 16px; min-height: 200px;'
          }}
          disabled={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          label="Save as template"
          onPress={handleSaveTemplate}
          variant="primary"
          size="small"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  templatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  savedTemplatesText: {
    color: Colors.black,
  },
  link: {
    color: '#6366f1',
  },
  editorContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolbar: {
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'flex-start',
  },
  toolbarIcon: {
    justifyContent: 'flex-start',
  },
  editor: {
    flex: 1,
    padding: 12,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});