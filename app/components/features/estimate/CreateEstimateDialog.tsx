import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Colors } from "@/app/constants/colors";
import { Card } from "@/app/components/common/Card";
import { useEffect, useState } from "react";
import { useTheme } from "../../providers/ThemeProvider";
import { Estimate } from "@/app/database/models/Estimate";
import {
  EstimateDetail,
  EstimateDetailData,
} from "@/app/database/models/EstimateDetail";
import { useAuth } from "@/app/hooks/useAuth";
import { generateRandom10DigitNumber } from "../../common/Utils";

interface CreateEstimateDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  companyId: number;
}

interface EstimateFormData {
  projectName: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export function CreateEstimateDialog({
  visible,
  onClose,
  onSave,
  companyId,
}: CreateEstimateDialogProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState<EstimateFormData>({
    projectName: "",
    firstName: "",
    lastName: "",
    companyName: "",
    phoneNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (visible) {
      setFormData({
        projectName: "",
        firstName: "",
        lastName: "",
        companyName: "",
        phoneNumber: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
      });
      setErrors({});
    }
  }, [visible]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // if (!formData.projectName.trim()) {
    //   newErrors.projectName = 'Project name is required';
    // }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // if (!formData.lastName.trim()) {
    //   newErrors.lastName = 'Last name is required';
    // }

    // if (!formData.companyName.trim()) {
    //   newErrors.companyName = 'Company name is required';
    // }

    // if (!formData.phoneNumber.trim()) {
    //   newErrors.phoneNumber = 'Phone number is required';
    // } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
    //   newErrors.phoneNumber = 'Invalid phone number format';
    // }

    // if (!formData.email.trim()) {
    //   newErrors.email = 'Email is required';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = 'Invalid email format';
    // }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    // if (!formData.city.trim()) {
    //   newErrors.city = 'City is required';
    // }

    // if (!formData.state.trim()) {
    //   newErrors.state = 'State is required';
    // }

    // if (!formData.zipCode.trim()) {
    //   newErrors.zipCode = 'ZIP code is required';
    // } else if (!/^\d{6}$/.test(formData.zipCode)) {
    //   newErrors.zipCode = 'Invalid ZIP code format. It must be a 6-digit number.';
    // }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // console.log.log("Validation errors:", newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please check the form for errors");
      return;
    }

    try {
      if (!user?.id) {
        throw new Error("User not found");
      }

      // Create estimate record
      const estimateData = {
        company_id: companyId,
        user_id: user.id,
        estimate_name: formData.projectName,
        description: `Estimate for ${formData.firstName} ${formData.lastName}`,
        estimate_status: "NEW",
        is_active: true,
        created_by: user.id,
        modified_by: user.id,
      };

      const estimateId = await Estimate.insert(estimateData);
      // const estimateId: number = await Estimate.getLastInsertedId();

      if (!estimateId) {
        throw new Error("Failed to get estimate ID");
      }

      // Create estimate detail record
      const estimateDetailData: EstimateDetailData = {
        estimate_id: estimateId,
        estimate_number: generateRandom10DigitNumber(),
        sales_person: `${formData.firstName || ""} ${
          formData.lastName || ""
        }`.trim(),
        estimate_revenue: "0",
        email: formData.email,
        phone: formData.phoneNumber,
        next_call_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days from now
        image_url: "house-1.jpg",
        address: `${formData.addressLine1}${
          formData.addressLine2 ? ` ${formData.addressLine2}` : ""
        }, ${formData.city}`,
        state: formData.state,
        zip_code: formData.zipCode,
        is_active: true,
        created_by: user.id,
        modified_by: user.id,
      };
      // console.log.log("Estimate detail data:", estimateDetailData);

      await EstimateDetail.insert(estimateDetailData);

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving estimate:", error);
      Alert.alert("Error", "Failed to save estimate. Please try again.");
    }
  };

  const handleChange = (field: keyof EstimateFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Card style={{ backgroundColor: theme.background }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Create New Estimate
              </Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text
                  style={[
                    styles.closeButtonText,
                    { color: theme.textSecondary },
                  ]}
                >
                  ✕
                </Text>
              </Pressable>
            </View>
            <View
              style={[styles.divider, { backgroundColor: theme.placeholder }]}
            />

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    Project Name <Text style={styles.required}></Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.projectName
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter project name"
                    placeholderTextColor={theme.placeholder}
                    value={formData.projectName}
                    onChangeText={(value) => handleChange("projectName", value)}
                  />
                  {errors.projectName && (
                    <Text style={styles.errorText}>{errors.projectName}</Text>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    First name <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.firstName
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter first name"
                    placeholderTextColor={theme.placeholder}
                    value={formData.firstName}
                    onChangeText={(value) => handleChange("firstName", value)}
                  />
                  {errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    Last name <Text style={styles.required}></Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.lastName
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter last name"
                    placeholderTextColor={theme.placeholder}
                    value={formData.lastName}
                    onChangeText={(value) => handleChange("lastName", value)}
                  />
                  {errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    Company name <Text style={styles.required}></Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.companyName
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter company name"
                    placeholderTextColor={theme.placeholder}
                    value={formData.companyName}
                    onChangeText={(value) => handleChange("companyName", value)}
                  />
                  {errors.companyName && (
                    <Text style={styles.errorText}>{errors.companyName}</Text>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    Phone number <Text style={styles.required}></Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.phoneNumber
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter phone number"
                    placeholderTextColor={theme.placeholder}
                    keyboardType="phone-pad"
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleChange("phoneNumber", value)}
                  />
                  {errors.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    Email <Text style={styles.required}></Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.email
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter email"
                    placeholderTextColor={theme.placeholder}
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(value) => handleChange("email", value)}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    Address line 1 <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.addressLine1
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter address"
                    placeholderTextColor={theme.placeholder}
                    value={formData.addressLine1}
                    onChangeText={(value) =>
                      handleChange("addressLine1", value)
                    }
                  />
                  {errors.addressLine1 && (
                    <Text style={styles.errorText}>{errors.addressLine1}</Text>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    Address line 2
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.addressLine2
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter address"
                    placeholderTextColor={theme.placeholder}
                    value={formData.addressLine2}
                    onChangeText={(value) =>
                      handleChange("addressLine2", value)
                    }
                  />
                  {errors.addressLine2 && (
                    <Text style={styles.errorText}>{errors.addressLine2}</Text>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    City <Text style={styles.required}></Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.city
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter city"
                    placeholderTextColor={theme.placeholder}
                    value={formData.city}
                    onChangeText={(value) => handleChange("city", value)}
                  />
                  {errors.city && (
                    <Text style={styles.errorText}>{errors.city}</Text>
                  )}
                </View>
              </View>

              <View style={[styles.row, styles.lastRow]}>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    State/Province <Text style={styles.required}></Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.state
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter state"
                    placeholderTextColor={theme.placeholder}
                    value={formData.state}
                    onChangeText={(value) => handleChange("state", value)}
                  />
                  {errors.state && (
                    <Text style={styles.errorText}>{errors.state}</Text>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>
                    Zip code/Postal code <Text style={styles.required}></Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.zipCode
                          ? Colors.error
                          : theme.placeholder,
                        backgroundColor: theme.background,
                        color: theme.textSecondary,
                      },
                    ]}
                    placeholder="Enter zip code"
                    placeholderTextColor={theme.placeholder}
                    keyboardType="numeric"
                    value={formData.zipCode}
                    onChangeText={(value) => handleChange("zipCode", value)}
                  />
                  {errors.zipCode && (
                    <Text style={styles.errorText}>{errors.zipCode}</Text>
                  )}
                </View>
                <View style={styles.field} />
              </View>
            </View>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.cancelButton,
                  { borderColor: theme.textPrimary },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: theme.textPrimary },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>SAVE</Text>
              </Pressable>
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
  },
  container: {
    // backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    // color: '#666',
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  lastRow: {
    marginBottom: 24,
  },
  field: {
    flex: 1,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    // color: '#000',
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
    fontSize: 12,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: Colors.primary,
  },
  cancelButtonText: {
    // color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 24,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 2,
  },
});
