import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/app/constants/colors";
import { Input } from "../../../common/Input";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { Card } from "../../../common/Card";
import { Button } from "../../../common/Button";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { FileUploader } from "@/app/components/common/FileUploader";
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";

export function TermsPage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("Terms and Conditions");
  const [requireAcknowledgment, setRequireAcknowledgment] = useState(false);
  const [editorContent, setEditorContent] = useState(
    'You may cancel this contract from the day you enter into the contract until 10 days after you receive a copy of the contract. You do not need a reason to cancel. If you do not receive the goods or services within 30 days of the date stated in the contract, you may cancel this contract within one year of the contract date..."'
  );
  const [uploadedPdf, setUploadedPdf] = useState<
    { uri: string } | string | null
  >(null);

  const editorRef = React.useRef<RichEditor>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const theme = useTheme();
  const handleLayoutsPress = () => {
    // TODO: Implement navigation to Layouts
    console.log("Navigate to Layouts");
  };

  const handleSave = () => {
    const termsData = {
      title,
      editorContent,
      requireAcknowledgment,
      uploadedPdf,
    };

    console.log("Saving changes...", termsData);
    useEstimatePageStore
      .getState()
      .setFormData("Terms and Conditions", termsData);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={styles.mainCard}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
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

          {/* Acknowledgment Toggle */}
          <View style={styles.acknowledgmentContainer}>
            <View style={styles.acknowledgmentContent}>
              <View>
                <Text style={styles.acknowledgmentTitle}>
                  Require customers to acknowledge this page
                </Text>
                <Text style={styles.acknowledgmentSubtitle}>
                  They will be asked during the signing process
                </Text>
              </View>
              <Switch
                value={requireAcknowledgment}
                onValueChange={setRequireAcknowledgment}
                trackColor={{ false: "#E5E7EB", true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>

          {/* Tabs Section */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "summary" && styles.activeTab]}
              onPress={() => setActiveTab("summary")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "summary" && styles.activeTabText,
                ]}
              >
                Use Summary
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "pdf" && styles.activeTab]}
              onPress={() => setActiveTab("pdf")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "pdf" && styles.activeTabText,
                ]}
              >
                Use PDF
              </Text>
            </TouchableOpacity>
          </View>

          {/* Editor Section */}
          {activeTab === "summary" && (
            <View style={styles.editorContainer}>
              <RichToolbar
                editor={editorRef}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.removeFormat,
                  actions.setStrikethrough,
                  actions.fontSize,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.blockquote,
                  actions.code,
                ]}
                style={styles.toolbarContainer}
                iconTint="#666"
                selectedIconTint={Colors.primary}
              />
              <View style={styles.editorContent}>
                <RichEditor
                  ref={editorRef}
                  onChange={setEditorContent}
                  initialContentHTML="You may cancel this contract from the day you enter into the contract until 10 days after you receive a copy of the contract. You do not need a reason to cancel. If you do not receive the goods or services within 30 days of the date stated in the contract, you may cancel this contract within one year of the contract date..."
                  style={styles.editor}
                  placeholder="Start typing..."
                />
              </View>
            </View>
          )}

          {/* PDF Upload Section */}
          {activeTab === "pdf" && (
            <View style={styles.pdfContainer}>
              {/* <TouchableOpacity style={styles.uploadContainer}>
                <MaterialIcons
                  name="upload-file"
                  size={48}
                  color={Colors.primary}
                />
                <Text style={styles.uploadTitle}>Upload PDF</Text>
                <Text style={styles.uploadSubtitle}>
                  Click to browse or drag and drop your PDF file
                </Text>
              </TouchableOpacity> */}

              <FileUploader
                label="Upload Pdf"
                accept="pdf"
                onUpload={(file) => {
                  setUploadedPdf(file || null);
                }}
              />
            </View>
          )}

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button
              label="Save Changes"
              onPress={handleSave}
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
    backgroundColor: "#f5f5f5",
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
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.black,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  descriptionRow: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.black,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  toolbarContainer: {
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flex: 1,
    alignItems: "flex-start",
  },
  editor: {
    flex: 1,
  },
  acknowledgmentContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
  },
  acknowledgmentContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  acknowledgmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 4,
  },
  acknowledgmentSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  editorContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  pdfContainer: {
    marginTop: 20,
    borderWidth: 1,
    padding: 10,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  uploadContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginTop: 12,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  fontControls: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 12,
  },
  fontSelect: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
  },
  fontSelectText: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  formattingToolbar: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    gap: 12,
  },
  toolbarButton: {
    padding: 6,
  },
  toolbarButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  italicText: {
    fontStyle: "italic",
  },
  underlineText: {
    textDecorationLine: "underline",
  },
  contentArea: {
    padding: 16,
    minHeight: 300,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  editorContent: {
    flex: 1,
    height: 375,
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginTop: 24,
  },
});
