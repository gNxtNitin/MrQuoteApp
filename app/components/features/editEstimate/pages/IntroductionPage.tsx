import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/app/constants/colors";
import { Input } from "../../../common/Input";
import { Button } from "@/app/components/common/Button";
import { Card } from "../../../common/Card";
import { ViewTemplatesDialog } from "./ViewTemplatesDialog";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";
import { IntroductionPageContent } from "@/app/database/models/IntroductionPageContent";
import { useEstimateStore } from "@/app/stores/estimateStore";

interface Template {
  id: string;
  content: string;
  title: string;
}

const TOKENS = [
  { label: "Customer Name", value: "{{CUSTOMER_NAME}}" },
  { label: "Project Address", value: "{{PROJECT_ADDRESS}}" },
  { label: "Quote Date", value: "{{QUOTE_DATE}}" },
  { label: "Quote Number", value: "{{QUOTE_NUMBER}}" },
  { label: "Total Amount", value: "{{TOTAL_AMOUNT}}" },
];

export function IntroductionPage() {
  const [editorContent, setEditorContent] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [introTitle, setIntroTitle] = useState("Introduction");
  const [showTokens, setShowTokens] = useState(false);
  const editorRef = useRef<RichEditor>(null);
  const tokenButtonRef = useRef<View>(null);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const theme = useTheme();
  const { selectedPageId } = useEstimateStore();
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await IntroductionPageContent.getIdByPageId(selectedPageId!);
        setId(id);  
        console.log("ID Intro Page: ", id);
        const data = await IntroductionPageContent.getById(id!);
        if (data) {
          console.log("Fetched Introduction Data: ", data);
          setEditorContent(data.introduction_content || "");
          setIntroTitle(data.introduction_name || "Introduction");
        }
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleSaveTemplate = async () => {
    // Implement save template logic
    if (editorContent) {
      const cleanedContent = editorContent.replace(/<\/?div>/g, "");
      const newTemplate: Template = {
        id: Date.now().toString(),
        content: cleanedContent,
        title: `Template ${Date.now()}`,
      };

      console.log("Saving template:", newTemplate);
      useEstimatePageStore.getState().setFormData("Introduction", newTemplate);
    }
    try {
      await IntroductionPageContent.update(id!, {
        introduction_content: editorContent,
        introduction_name: introTitle,
      });
      console.log("Data updated successfully.");
    } catch (error) {
      console.log("Error updating content", error);
    }
  };

  const handleViewTemplates = () => {
    setShowTemplatesDialog(true);
  };

  const handleCloseTemplatesDialog = () => {
    setShowTemplatesDialog(false);
  };

  const handleSelectTemplate = (template: string) => {
    // Handle template selection
    console.log("Selected template:", template);
    setShowTemplatesDialog(false);
  };

  const insertToken = (token: string) => {
    editorRef.current?.insertHTML(token);
    setShowTokens(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
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
                  <Text
                    style={[styles.titleText, { color: theme.textSecondary }]}
                  >
                    {introTitle}
                  </Text>
                  <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                    <Feather
                      name="edit-2"
                      size={16}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.templatesRow}>
            <Text style={{ color: theme.textSecondary }}>
              You have saved templates.
            </Text>
            <TouchableOpacity onPress={handleViewTemplates}>
              <Text style={styles.link}>View templates</Text>
            </TouchableOpacity>
          </View>

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
                    color={theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.tokenButtonText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Insert Token
                  </Text>
                </TouchableOpacity>
                {showTokens && (
                  <View style={styles.tokenDropdown}>
                    {TOKENS.map((token, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.tokenItem,
                          { backgroundColor: theme.card },
                        ]}
                        onPress={() => insertToken(token.value)}
                      >
                        <Text
                          style={[
                            styles.tokenText,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {token.label}
                        </Text>
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
                  actions.blockquote,
                ]}
                selectedIconTint={Colors.primary}
                disabledTextTint={theme.textSecondary}
                iconTint={theme.textSecondary}
                style={styles.toolbar}
                iconContainerStyle={styles.toolbarIcon}
              />
            </View>

            <RichEditor
              ref={editorRef}
              onChange={setEditorContent}
              initialContentHTML={editorContent}
              placeholder="Start typing your introduction..."
              style={styles.editor}
              initialFocus={false}
              useContainer={true}
              initialHeight={400}
              editorStyle={{
                color: theme.textSecondary,
                backgroundColor: theme.card,
                contentCSSText: "font-size: 16px; min-height: 200px;",
                placeholderColor: theme.placeholder,
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
        </ScrollView>
      </Card>

      <ViewTemplatesDialog
        visible={showTemplatesDialog}
        onClose={handleCloseTemplatesDialog}
        onSelect={handleSelectTemplate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
  },
  mainCard: {
    padding: 24,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  templatesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  link: {
    color: Colors.primary,
  },
  editorContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  toolbarContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  toolbar: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "flex-start",
  },
  toolbarIcon: {
    justifyContent: "flex-start",
  },
  tokenContainer: {
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    position: "relative",
  },
  tokenButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 4,
  },
  tokenButtonText: {
    fontSize: 14,
  },
  tokenDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    width: 200,
    zIndex: 1000,
    shadowColor: "#000",
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
    borderBottomColor: "#e5e7eb",
  },
  tokenText: {
    fontSize: 14,
  },
  editor: {
    flex: 1,
    padding: 12,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
