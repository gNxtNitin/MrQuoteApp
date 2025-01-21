import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Input } from "../../../common/Input";
import { Card } from "../../../common/Card";
import { Button } from "../../../common/Button";
import { Colors } from "@/app/constants/colors";
import { Feather } from "@expo/vector-icons";
import { FileUploader } from "@/app/components/common/FileUploader";
import {
  TitlePageContent,
  TitlePageContentData,
} from "@/app/database/models/TitlePageContent";
import { openDatabase } from "@/app/services/database/init";

const db = openDatabase();

export function TitlePage() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("Title");
  const [reportType, setReportType] = useState("");
  const [date, setDate] = useState("");
  const [primaryImage, setPrimaryImage] = useState<
    { uri: string } | string | null | undefined
  >(null);
  const [certificateOrSecLogo, setCertificateOrSecLogo] = useState<
    { uri: string } | string | null | undefined
  >(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await TitlePageContent.getById(1);
        if (data) {
          console.log("Fetched Data:", data);
          setTitle(data.title_name || "Title");
          setReportType(data.report_type || "");
          setDate(data.date ? new Date(data.date).toLocaleDateString() : "");
          setPrimaryImage(data.primary_image || null);
          setCertificateOrSecLogo(data.certification_logo || null);
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setCompanyName(data.company_name || "");
          setAddress(data.address || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPostalCode(data.zip_code || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const formData = {
      title_name: title,
      report_type: reportType,
      date: date,
      primary_image:
        typeof primaryImage === "object" && primaryImage !== null
          ? primaryImage.uri
          : primaryImage,
      certification_logo:
        typeof certificateOrSecLogo === "object" &&
        certificateOrSecLogo !== null
          ? certificateOrSecLogo.uri
          : certificateOrSecLogo,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      address: address,
      city: city,
      state: state,
      zip_code: postalCode,
    };
    try {
      await TitlePageContent.update(1, formData);
      console.log("Data updated successfully.");
    } catch (error) {
      console.error("Error updating data:", error);
    }
    console.log("Saving changes...", formData);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Title Section */}
            <View style={styles.titleContainer}>
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
                    <Text style={styles.titleText}>{title}</Text>
                    <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                      <Feather name="edit-2" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* Report Type and Date Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Report type</Text>
                <Input
                  value={reportType}
                  placeholder="Select report type"
                  onChangeText={setReportType}
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Date</Text>
                <Input
                  placeholder="Select date"
                  onChangeText={setDate}
                  value={date}
                />
              </View>
            </View>

            {/* Image Upload Row */}
            <View style={styles.row}>
              <FileUploader
                label="Primary Image"
                accept="both"
                onUpload={(file) => {
                  setPrimaryImage(file || null);
                }}
                height={180}
              />

              <FileUploader
                label="Certification/Secondary Logo"
                accept="both"
                onUpload={(file) => {
                  setCertificateOrSecLogo(file || null);
                }}
                height={180}
              />
            </View>

            {/* Name Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>First name</Text>
                <Input
                  placeholder="Enter first name"
                  onChangeText={setFirstName}
                  value={firstName}
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Last name</Text>
                <Input
                  placeholder="Enter last name"
                  onChangeText={setLastName}
                  value={lastName}
                />
              </View>
            </View>

            {/* Company and Address Row */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Company name</Text>
                <Input
                  placeholder="Enter company name"
                  onChangeText={setCompanyName}
                  value={companyName}
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Address</Text>
                <Input
                  placeholder="Enter address"
                  onChangeText={setAddress}
                  value={address}
                />
              </View>
            </View>

            {/* Location Row */}
            <View style={styles.row}>
              <View style={[styles.column, { flex: 0.5 }]}>
                <Text style={styles.label}>City</Text>
                <Input
                  placeholder="Enter city"
                  onChangeText={setCity}
                  value={city}
                />
              </View>
              <View style={[styles.column, { flex: 0.5 }]}>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.label}>State/Province</Text>
                    <Input
                      placeholder="Enter state/province"
                      onChangeText={setState}
                      value={state}
                    />
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.label}>Zip code/Postal code</Text>
                    <Input
                      placeholder="Enter zip/postal code"
                      onChangeText={setPostalCode}
                      value={postalCode}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Save Button at the end */}
            <View style={styles.buttonContainer}>
              <Button
                label="Save Changes"
                onPress={handleSave}
                variant="primary"
                size="small"
              />
            </View>
          </View>
        </ScrollView>
      </Card>
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
  formContainer: {
    gap: 24,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.black,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  uploadCard: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderStyle: "dashed",
    borderColor: Colors.primary,
  },
  uploadContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gradientPrimary + "40", // 20 is hex for 12% opacity
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderStyle: "solid",
  },
  uploadText: {
    color: "#666",
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
});
