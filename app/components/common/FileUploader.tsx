import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // Import DocumentPicker
import { Colors } from "@/app/constants/colors"; // Custom colors (if any)
import { Card } from "./Card";
import { MaterialIcons, Feather } from "@expo/vector-icons";

export function FileUploader({
  label,
  accept = "both",
  height = 180,
  onUpload,
}: {
  label?: string;
  accept?: "image" | "pdf" | "both";
  height?: number;
  onUpload?: (file: any) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  const pickFile = async () => {
    try {
      if (accept === "pdf" || accept === "both") {
        const pdfResult = await DocumentPicker.getDocumentAsync({
          type: "*/*",
        });

        // Check if the user successfully selected a PDF
        if (pdfResult.assets && pdfResult.assets[0]?.uri) {
          setSelectedFile(pdfResult.assets[0]);
          onUpload?.(pdfResult.assets[0]);
        }
      }
    } catch (err) {
      console.error("Error picking file:", err);
    }
  };

  const deleteFile = () => {
    setSelectedFile(null);
    onUpload?.(null);
  };

  const getIcon = () => {
    if (accept === "pdf") {
      return (
        <MaterialIcons name="picture-as-pdf" size={24} color={Colors.primary} />
      );
    }
    return <Feather name="upload-cloud" size={24} color={Colors.primary} />;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {selectedFile ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            {selectedFile.name || "File uploaded"}
          </Text>
          <MaterialIcons name="check-circle" size={24} color={Colors.green} />;
          <TouchableOpacity onPress={deleteFile} style={styles.deleteBtn}>
            <MaterialIcons name="delete" size={35} color={Colors.gray[500]} />;
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={pickFile} style={styles.touchable}>
          <View style={[styles.uploadContainer, { height }]}>
            <Card
              variant="outlined"
              style={[styles.uploadCard, styles.dashedCard]}
            >
              {getIcon()}
              <Text style={styles.uploadText}>
                {accept === "pdf" ? "Upload PDF" : "Upload File"}
              </Text>
            </Card>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  touchable: {
    flex: 1,
  },
  uploadContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
  },
  uploadCard: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dashedCard: {
    borderStyle: "dashed",
    borderColor: Colors.primary,
  },
  uploadText: {
    color: "#666",
    fontSize: 14,
    marginTop: 8,
  },
  successContainer: {
    height: 100,
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    position: "relative",
    alignItems: "center",
    gap: 20,
  },
  successText: {
    fontSize: 16,
    color: Colors.black,
    marginLeft: 10,
  },
  deleteBtn: {
    position: "absolute",
    backgroundColor: Colors.white,
    top: 10,
    right: 10,
    borderRadius:35,
    padding:5,
    shadowColor:Colors.gray[500],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
