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
import { WarrantyPageContent } from '@/app/database/models/WarrantyPageContent';
import { useEstimateStore } from '@/app/stores/estimateStore';
import { WarrantyPageContentData } from '@/app/database/models/WarrantyPageContent';
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";
import { showToast } from "@/app/utils/ToastService";

export function WarrantyPage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFormSaved, setIsFormSaved] = useState(false);
  const [showWarrantyDatePicker, setShowWarrantyDatePicker] = useState(false);
  const [showCompletionDatePicker, setShowCompletionDatePicker] =
    useState(false);
  const [warrantyDate, setWarrantyDate] = useState<Date | null>(null);
  const [completionDate, setCompletionDate] = useState<Date | null>(null);
  const { selectedPageId } = useEstimateStore();
  
  const [formData, setFormData] = useState({
    id: 0,
    title: "Warranty",
    warrantyStartDate: "",
    completionDate: "",
    customerName: "",
    address: "",
    warrantyDetails: "",
    thankYouNote: "",
  });
  
  const [sign, setSign] = useState<string | null>(null);
  const [signeeName, setSigneeName] = useState("");
  const [signeeTitle, setSigneeTitle] = useState("");

  const theme = useTheme();
  const items = [{ id: "editor1" }]; // Replace with actual data

  const editorRefs = useRef<{ [key: string]: React.RefObject<RichEditor> }>({});
  const [editorContents, setEditorContents] = useState<{
    [key: string]: string;
  }>({
    "editor1": ""
  });

  // Update editor refs and content state
  const warrantyEditorRef = useRef<RichEditor>(null);
  const thankyouEditorRef = useRef<RichEditor>(null);
  const [warrantyDetails, setWarrantyDetails] = useState("");
  const [thankyouNote, setThankyouNote] = useState("");

  useEffect(() => {
    items.forEach((item) => {
      if (!editorRefs.current[item.id]) {
        editorRefs.current[item.id] = React.createRef();
      }
    });
  }, [items]);

  // Fetch warranty data on component mount
  useEffect(() => {
    const fetchWarrantyData = async () => {
      try {
        const warrantyData = await WarrantyPageContent.getByPageId(1);
        console.log('warrantyData', warrantyData);
        
        if (warrantyData) {
          // Set form data
          setFormData({
            id: warrantyData.id || 0,
            title: warrantyData.warranty_page_title || "Warranty",
            warrantyStartDate: warrantyData.warranty_start_date || "",
            completionDate: warrantyData.completion_date || "",
            customerName: warrantyData.customer_name || "",
            address: warrantyData.address || "",
            warrantyDetails: warrantyData.warranty_details || "",
            thankYouNote: warrantyData.thank_you_note || "",
          });

          // Set dates if they exist
          if (warrantyData.warranty_start_date) {
            setWarrantyDate(new Date(warrantyData.warranty_start_date));
          }
          if (warrantyData.completion_date) {
            setCompletionDate(new Date(warrantyData.completion_date));
          }

          // Set signature and signee info
          setSign(warrantyData.signature || null);
          setSigneeName(warrantyData.signee_name || "");
          setSigneeTitle(warrantyData.signee_title || "");
          
          // Set editor contents
          setWarrantyDetails(warrantyData.warranty_details || "");
          setThankyouNote(warrantyData.thank_you_note || "");
        }
      } catch (error) {
        console.error('Error fetching warranty data:', error);
      }
    };

    fetchWarrantyData();
  }, []);

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
      console.log('warranty Start Date', formData.warrantyStartDate);
      console.log('completion Date', formData.completionDate);
      const warrantyData: Partial<WarrantyPageContentData> = {
        warranty_page_title: formData.title,
        warranty_details: warrantyDetails,
        warranty_start_date: formData.warrantyStartDate,
        completion_date: formData.completionDate,
        customer_name: formData.customerName,
        address: formData.address,
        thank_you_note: thankyouNote,
        signature: sign || "",
        signee_name: signeeName,
        signee_title: signeeTitle,
        is_active: true,
        modified_by: 1,
        modified_date: new Date().toISOString()
      };

      if (formData.id) {
        console.log('formData.id', formData.id);
        console.log('warrantyData in Update', warrantyData);
        // Update existing record
        await WarrantyPageContent.update(1, warrantyData);
      } else {
        console.log('formData.id', formData.id);
        console.log('warrantyData in Insert', warrantyData);
        // Insert new record
        await WarrantyPageContent.insert({
          ...warrantyData,
          page_id: selectedPageId,
          created_by: 1, // Replace with actual user ID
          created_date: new Date().toISOString()
        } as WarrantyPageContentData);
      }
      useEstimatePageStore.getState().setFormData("Warranty", formData);
      showToast("success", "Data updated successfully.");
      setIsFormSaved(true);
      setIsEditingTitle(false);
      Alert.alert("Success", "Warranty information saved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save warranty information. Please try again.");
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
              date={warrantyDate || new Date()}
              onConfirm={(date) => handleDateChange(date, "warrantyStartDate")}
              title="Select Warranty Start Date"
            />

            <Text
              style={[styles.sectionHeader, { color: theme.textSecondary }]}
            >
              Warranty details:
            </Text>
            <View style={styles.editorSection}>
              <RichToolbar
                editor={warrantyEditorRef}
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
              />
              <RichEditor
                ref={warrantyEditorRef}
                onChange={setWarrantyDetails}
                initialContentHTML={warrantyDetails}
                placeholder="Enter warranty details..."
                style={styles.editor}
                initialHeight={200}
                editorStyle={{
                  backgroundColor: theme.card,
                  color: theme.textSecondary,
                  placeholderColor: theme.placeholder,
                  contentCSSText: 'font-size: 16px;'
                }}
              />
            </View>

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
                  date={completionDate || new Date()}
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
                    Thank you note:
                  </Text>

                  <View style={styles.editorSection}>
                    <RichToolbar
                      editor={thankyouEditorRef}
                      actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                      ]}
                      selectedIconTint={Colors.primary}
                      disabledTextTint={theme.textSecondary}
                      iconTint={theme.textSecondary}
                      style={styles.toolbar}
                    />
                    <RichEditor
                      ref={thankyouEditorRef}
                      onChange={setThankyouNote}
                      initialContentHTML={thankyouNote}
                      placeholder="Enter thank you note..."
                      style={styles.editor}
                      initialHeight={200}
                      editorStyle={{
                        backgroundColor: theme.card,
                        color: theme.textSecondary,
                        placeholderColor: theme.placeholder,
                        contentCSSText: 'font-size: 16px;'
                      }}
                    />
                  </View>
                </View>

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
    marginTop: 16,
    gap: 8,
  },
  toolbar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    padding: 8,
    alignItems: "flex-start",
  },
  editor: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 8,
    minHeight: 200,
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
