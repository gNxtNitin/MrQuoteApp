import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Colors } from "@/app/constants/colors";
import { Card } from "./Card";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../providers/ThemeProvider";

export function FileUploader({
  label,
  accept = "both",
  height = 180,
  multiple = false,
  onUpload,
}: {
  label?: string;
  accept?: "image" | "pdf" | "both";
  height?: number;
  multiple?: boolean;
  onUpload?: (files: any | any[]) => void;
}) {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: multiple, // Allow multiple selection only if `multiple` is true
      });

      if (!result.canceled) {
        const files = result.assets || [result];

        if (multiple) {
          // For multiple files, append new files to the existing list
          const updatedFiles = [...selectedFiles, ...files];
          setSelectedFiles(updatedFiles);
          onUpload?.(updatedFiles);
        } else {
          // For single file, replace the current file
          const singleFile = files[0];
          setSelectedFiles([singleFile]);
          onUpload?.(singleFile);
        }
      }
    } catch (err) {
      console.error("Error picking file:", err);
    }
  };

  const deleteFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);

    if (multiple) {
      onUpload?.(updatedFiles);
    } else {
      onUpload?.(null); // Clear file when a single file is deleted
    }
  };

  const getIcon = () => {
    if (accept === "pdf") {
      return (
        <MaterialIcons
          name="picture-as-pdf"
          size={24}
          color={theme.textPrimary}
        />
      );
    }
    return <Feather name="upload-cloud" size={24} color={Colors.primary} />;
  };

  const renderFileItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.successContainer, { backgroundColor: theme.card }]}>
      <Text style={[styles.successText, { color: theme.textSecondary }]}>
        {item.name || "File uploaded"}
      </Text>
      <MaterialIcons name="check-circle" size={24} color={Colors.green} />
      <TouchableOpacity
        onPress={() => deleteFile(index)}
        style={styles.deleteBtn}
      >
        <MaterialIcons name="delete" size={24} color={Colors.red[500]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      )}

      {multiple || selectedFiles.length === 0 ? (
        <TouchableOpacity onPress={pickFile} style={styles.touchable}>
          <View
            style={[
              styles.uploadContainer,
              { height },
              { backgroundColor: theme.card },
            ]}
          >
            <Card
              variant="outlined"
              style={[
                styles.uploadCard,
                { backgroundColor: theme.card },
                styles.dashedCard,
                { borderColor: theme.textPrimary },
              ]}
            >
              {getIcon()}
              <Text style={[styles.uploadText, { color: theme.textPrimary }]}>
                {accept === "pdf" ? "Upload PDF" : "Upload File"}
              </Text>
            </Card>
          </View>
        </TouchableOpacity>
      ) : null}

      {multiple && selectedFiles.length > 0 && (
        <ScrollView horizontal={true} style={{ width: "100%" }}>
          <FlatList
            data={selectedFiles}
            renderItem={renderFileItem}
            keyExtractor={(item, index) => `${item.uri}-${index}`}
            contentContainerStyle={{ marginTop: 10 }}
          />
        </ScrollView>
      )}

      {!multiple && selectedFiles.length > 0 && (
        <View style={styles.successContainer}>
          <Text style={[styles.successText, { color: theme.textSecondary }]}>
            {selectedFiles[0].name || "File uploaded"}
          </Text>
          <MaterialIcons name="check-circle" size={24} color={Colors.green} />
          <TouchableOpacity
            onPress={() => deleteFile(0)}
            style={styles.deleteBtn}
          >
            <MaterialIcons name="delete" size={24} color={Colors.red[500]} />
          </TouchableOpacity>
        </View>
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
  },
  touchable: {
    flex: 1,
  },
  uploadContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  uploadCard: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  dashedCard: {
    borderStyle: "dashed",
  },
  uploadText: {
    fontSize: 14,
    marginTop: 8,
  },
  successContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    alignItems: "center",
    gap: 20,
  },
  successText: {
    fontSize: 16,
    width: "80%",
  },
  deleteBtn: {
    marginLeft: "auto",
    padding: 5,
  },
});
