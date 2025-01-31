import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { Card } from "../../../common/Card";
import { Colors } from "@/app/constants/colors";
import { Input } from "../../../common/Input";
import { Button } from "../../../common/Button";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { FileUploader } from "@/app/components/common/FileUploader";
import { CustomInputRow } from "@/app/components/common/CustomRowInput";
import { useEstimateStore } from "@/app/stores/estimateStore";
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";
import { showToast } from "@/app/utils/ToastService";

export function WarrantyPage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFormSaved, setIsFormSaved] = useState(false);
  const [showWarrantyDatePicker, setShowWarrantyDatePicker] = useState(false);
  const [showCompletionDatePicker, setShowCompletionDatePicker] =
    useState(false);
  const [warrantyDate, setWarrantyDate] = useState(new Date());
  const [completionDate, setCompletionDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "Warranty",
    warrantyStartDate: "",
    completionDate: "",
    customerName: "Insurance Sample", // This would come from props/state in real app
    address: "123 Sample Ave NW, Calgary, AB, T2T 2T2", // This would come from props/state
  });
  const [sign, setSign] = useState<File | null>(null);
  const [signeeName, setSigneeName] = useState("");
  const [signeeTitle, setSigneeTitle] = useState("");

  const theme = useTheme();
  const items = [{ id: "editor1" }]; // Replace with actual data

  const editorRefs = useRef<{ [key: string]: React.RefObject<RichEditor> }>({});
  const [editorContents, setEditorContents] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    items.forEach((item) => {
      if (!editorRefs.current[item.id]) {
        editorRefs.current[item.id] = React.createRef();
      }
    });
  }, [items]);

  const handleInputChange = (field: string, value: string) => {
    if (isFormSaved) return; // Prevent changes if form is saved
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (selectedDate: Date | undefined, field: string) => {
    if (selectedDate) {
      if (field === "warrantyStartDate") {
        setWarrantyDate(selectedDate);
        handleInputChange(field, selectedDate.toLocaleDateString());
      } else {
        setCompletionDate(selectedDate);
        handleInputChange(field, selectedDate.toLocaleDateString());
      }
    }
  };

  const handleEditorChange = (itemId: string, content: string) => {
    setEditorContents((prev) => ({
      ...prev,
      [itemId]: content,
    }));
  };

  const validateForm = () => {
    const { warrantyStartDate, completionDate } = formData;

    if (!warrantyStartDate) {
      Alert.alert("Error", "Please select a warranty start date");
      return false;
    }

    if (!completionDate) {
      Alert.alert("Error", "Please select a completion date");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Here you would typically make an API call to save the data
      console.log("Saving warranty data:", formData);
      useEstimatePageStore.getState().setFormData("Warranty", formData);
      showToast("success", "Data updated successfully.");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsFormSaved(true); // Disable editing after successful save
      setIsEditingTitle(false); // Close title editing if open
      Alert.alert("Success", "Warranty information saved successfully");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to save warranty information. Please try again."
      );
      console.error("Error saving warranty data:", error);
    }
  };

  const handleLayoutPress = () => {
    // Handle layout navigation/action here
    console.log("Navigate to layouts");
  };

  const DatePickerModal = ({
    visible,
    onClose,
    date,
    onConfirm,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    date: Date;
    onConfirm: (date: Date) => void;
    title: string;
  }) => {
    const [selectedDate, setSelectedDate] = useState(date);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.textSecondary }]}>
              {title}
            </Text>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(_, date) => date && setSelectedDate(date)}
              style={styles.datePicker}
            />
            <View style={styles.modalButtons}>
              <Button
                label="Cancel"
                onPress={onClose}
                variant="outline"
                size="small"
              />
              <Button
                label="Confirm"
                onPress={() => {
                  onConfirm(selectedDate);
                  onClose();
                }}
                variant="primary"
                size="small"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              {isEditingTitle && !isFormSaved ? (
                <Input
                  value={formData.title}
                  onChangeText={(value) => handleInputChange("title", value)}
                  onBlur={() => setIsEditingTitle(false)}
                  autoFocus
                  style={styles.titleInput}
                />
              ) : (
                <>
                  <Text style={[styles.title, { color: theme.textPrimary }]}>
                    {formData.title}
                  </Text>
                  {!isFormSaved && (
                    <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                      <Feather
                        name="edit-2"
                        size={16}
                        color={theme.textPrimary}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            {/* <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>
              Warranty content can be edited in your
            </Text>
            <TouchableOpacity onPress={handleLayoutPress}>
              <Text style={styles.link}>Layouts</Text>
            </TouchableOpacity>
          </View> */}
          </View>

          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              Select the warranty start date:
            </Text>
            <TouchableOpacity
              onPress={() => !isFormSaved && setShowWarrantyDatePicker(true)}
              disabled={isFormSaved}
            >
              <Input
                placeholder="Select date"
                style={[styles.dateInput, isFormSaved && styles.disabledInput]}
                value={formData.warrantyStartDate}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            <DatePickerModal
              visible={showWarrantyDatePicker}
              onClose={() => setShowWarrantyDatePicker(false)}
              date={warrantyDate}
              onConfirm={(date) => handleDateChange(date, "warrantyStartDate")}
              title="Select Warranty Start Date"
            />

            <Text
              style={[styles.sectionHeader, { color: theme.textSecondary }]}
            >
              Warranty details:
            </Text>
            {items.map((item) => {
              const editorRef = editorRefs.current[item.id];
              return (
                <View key={item.id} style={styles.editorSection}>
                  {editorRef?.current && (
                    <RichToolbar
                      editor={editorRef.current}
                      actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        actions.setStrikethrough,
                        actions.blockquote,
                        actions.undo,
                        actions.redo,
                      ]}
                      selectedIconTint={Colors.primary}
                      disabledIconTint={theme.textSecondary}
                      iconTint={theme.textSecondary}
                      style={styles.editorTools}
                      iconSize={18}
                    />
                  )}
                  <RichEditor
                    ref={editorRef}
                    onChange={(content) => handleEditorChange(item.id, content)}
                    placeholder="Enter description..."
                    style={styles.editorContent}
                    initialHeight={200}
                    useContainer={true}
                    initialFocus={false}
                    editorStyle={{
                      backgroundColor: theme.card,
                      contentCSSText: `
                  font-size: 16px;
                  min-height: 200px;
                  padding: 12px;
                `,
                      color: theme.textSecondary,
                      placeholderColor: theme.placeholder,
                    }}
                    scrollEnabled={true}
                    containerStyle={{
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: Colors.gray[200],
                    }}
                  />
                </View>
              );
            })}

            <View style={styles.infoSection}>
              <View style={styles.infoGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Customer name
                </Text>
                <Text style={[styles.value, { color: theme.textSecondary }]}>
                  {formData.customerName}
                </Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Address
                </Text>
                <Text style={[styles.value, { color: theme.textSecondary }]}>
                  {formData.address}
                </Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Date project completed
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    !isFormSaved && setShowCompletionDatePicker(true)
                  }
                  disabled={isFormSaved}
                >
                  <Input
                    placeholder="Select completion date"
                    style={[
                      styles.dateInput,
                      isFormSaved && styles.disabledInput,
                    ]}
                    value={formData.completionDate}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>

                <DatePickerModal
                  visible={showCompletionDatePicker}
                  onClose={() => setShowCompletionDatePicker(false)}
                  date={completionDate}
                  onConfirm={(date) => handleDateChange(date, "completionDate")}
                  title="Select Completion Date"
                />

                <View style={styles.thankyouNoteConatiner}>
                  <Text
                    style={[
                      styles.sectionHeader,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Thankyou note:
                  </Text>

                  {items.map((item) => {
                    const editorRef = editorRefs.current[item.id]; // Ensure reference exists
                    return (
                      <View key={item.id} style={styles.editorSection}>
                        {editorRef?.current && (
                          <RichToolbar
                            editor={editorRef.current}
                            actions={[
                              actions.setBold,
                              actions.setItalic,
                              actions.setUnderline,
                              actions.insertBulletsList,
                              actions.insertOrderedList,
                              actions.setStrikethrough,
                              actions.blockquote,
                              actions.undo,
                              actions.redo,
                            ]}
                            selectedIconTint={Colors.primary}
                            disabledIconTint={theme.textSecondary}
                            iconTint={theme.textSecondary}
                            style={styles.editorTools}
                            iconSize={18}
                          />
                        )}
                        <RichEditor
                          ref={editorRef}
                          onChange={(content) =>
                            handleEditorChange(item.id, content)
                          }
                          placeholder="Enter description..."
                          style={styles.editorContent}
                          initialHeight={200}
                          useContainer={true}
                          initialFocus={false}
                          editorStyle={{
                            backgroundColor: theme.card,
                            contentCSSText: `
                  font-size: 16px;
                  min-height: 200px;
                  padding: 12px;
                `,
                            color: theme.textSecondary,
                            placeholderColor: theme.placeholder,
                          }}
                          scrollEnabled={true}
                          containerStyle={{
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: Colors.gray[200],
                          }}
                        />
                      </View>
                    );
                  })}
                  <View style={styles.signeeBox}>
                    <FileUploader
                      label="Signature:"
                      accept="both"
                      onUpload={(file) => setSign(file || null)}
                    />
                  </View>
                </View>

                <View style={styles.signeeBox}>
                  <CustomInputRow
                    label={"Signee's Name"}
                    placeholder={""}
                    value={signeeName}
                    onChangeText={setSigneeName}
                    inputMode={"text"}
                  />
                  <CustomInputRow
                    label={"Signee's Title"}
                    placeholder={"eg. Managing Director"}
                    value={signeeTitle}
                    onChangeText={setSigneeTitle}
                    inputMode={"text"}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              label={isFormSaved ? "Saved" : "Save Changes"}
              onPress={handleSave}
              variant="primary"
              size="small"
              disabled={isFormSaved}
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
    // backgroundColor: "#f5f5f5",
  },
  mainCard: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    // color: Colors.black,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.black,
  },
  link: {
    fontSize: 14,
    color: Colors.primary,
  },
  content: {
    flex: 1,
    gap: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    // color: Colors.black,
  },
  dateInput: {
    // backgroundColor: Colors.white,
  },
  disabledInput: {
    // backgroundColor: "#f5f5f5",
    opacity: 0.7,
  },
  infoSection: {
    gap: 24,
    // backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    // color: Colors.black,
  },
  value: {
    fontSize: 14,
    // color: Colors.black,
  },
  footer: {
    marginTop: 24,
    alignItems: "flex-end",
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    // backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 16,
  },
  datePicker: {
    width: "100%",
  },
  editorSection: {
    gap: 8,
  },
  editorTools: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 8,
    alignItems: "flex-start",
  },
  editorContent: {
    minHeight: 200,
    // backgroundColor: Colors.white,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
  },
  thankyouNoteConatiner: {
    marginTop: 20,
    gap: 10,
  },
  signeeBox: {
    marginTop: 20,
  },
});
