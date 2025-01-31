import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card } from "../../../common/Card";
import { Colors } from "@/app/constants/colors";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Button } from "../../../common/Button";
import { Input } from "@/app/components/common/Input";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";
import { showToast } from "@/app/utils/ToastService";

const DotPattern = () => (
  <View style={styles.dotPattern}>
    {Array.from({ length: 1000 }).map((_, index) => (
      <View key={index} style={styles.dot} />
    ))}
  </View>
);

export function LayoutPage() {
  const router = useRouter();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("Layout");
  const [description, setDescription] = useState("");
  const theme = useTheme();

  const handleSave = () => {
    const LayoutData = {
      title,
      description,
    };
    console.log("Saving Layout Page...", LayoutData);
    useEstimatePageStore.getState().setFormData("Layout", LayoutData);
    showToast("success","Data updated successfully.")
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={[styles.mainCard, { backgroundColor: theme.card }]}>
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
                <Text style={[styles.title, { color: theme.textSecondary }]}>
                  {title}
                </Text>
                <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                  <Feather name="edit-2" size={16} color={theme.textPrimary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {/* <View style={styles.diagramsContainer}>
            <View style={styles.diagramRow}>
              <View style={[styles.diagramCard, { flex: 1 }]}>
                <View style={styles.diagramHeader}>
                  <Text style={styles.diagramTitle}>First Floor</Text>
                  <TouchableOpacity style={styles.uploadButton}>
                    <MaterialIcons name="file-upload" size={16} color={Colors.primary} />
                    <Text style={styles.uploadText}>Upload</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.imageWrapper}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={require('@/assets/images/floor-plan-1.png')}
                      style={styles.diagramImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.diagramCard, { flex: 1 }]}>
                <View style={styles.diagramHeader}>
                  <Text style={styles.diagramTitle}>Second Floor</Text>
                  <TouchableOpacity style={styles.uploadButton}>
                    <MaterialIcons name="file-upload" size={16} color={Colors.primary} />
                    <Text style={styles.uploadText}>Upload</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.imageWrapper}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={require('@/assets/images/floor-plan-2.png')}
                      style={styles.diagramImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View> */}

          <View style={styles.drawingSection}>
            <Text
              style={[
                styles.drawingSectionTitle,
                { color: theme.textSecondary },
              ]}
            >
              Draw here
            </Text>
            <View style={styles.drawingContainer}>
              <TouchableOpacity
                style={styles.drawingArea}
                onPress={() => router.push("/switch-and-canvas")}
              >
                <DotPattern />
                <View style={styles.drawingPlaceholderContainer}>
                  <MaterialIcons
                    name="open-in-full"
                    size={20}
                    color={Colors.black}
                  />
                  <Text style={styles.drawingPlaceholder}>
                    Tap to open Canvas
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={[
                  styles.descriptionsCard,
                  { backgroundColor: theme.card },
                ]}
              >
                <Text
                  style={[
                    styles.descriptionsTitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  Descriptions
                </Text>
                <Input
                  placeholder="Description"
                  placeholderTextColor={theme.placeholder}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  style={[
                    styles.descriptionInput,
                    { color: theme.textSecondary },
                  ]}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Save Changes"
            onPress={handleSave}
            variant="primary"
            size="small"
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  mainCard: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
  },
  diagramsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  diagramRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    height: 380, // Increased height
  },
  diagramCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  diagramCardSmall: {
    width: "25%",
  },
  diagramCardLarge: {},
  diagramHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  diagramTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    padding: 4,
    borderRadius: 4,
    backgroundColor: Colors.primary + "10",
  },
  uploadText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
  imageWrapper: {
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  diagramImage: {
    width: "100%",
    height: "100%",
  },
  footer: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  scrollContainer: {
    flex: 1,
  },
  drawingSection: {
    marginTop: 16,
  },
  drawingSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  drawingContainer: {
    flexDirection: "row",
    gap: 16,
  },
  drawingArea: {
    flex: 2,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  drawingPlaceholderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 2,
  },
  drawingPlaceholder: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: "600",
    zIndex: 2,
  },
  descriptionsCard: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  descriptionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
  },
  descriptionInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dotPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.8,
    zIndex: 1,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.black + "50",
    margin: 10,
  },
});
