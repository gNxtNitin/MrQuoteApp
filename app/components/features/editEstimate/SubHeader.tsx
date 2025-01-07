import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { Colors } from "@/app/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../../common/Button";
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";
import { useTheme } from "../../providers/ThemeProvider";
import { useRouter } from "expo-router";
import PdfGenerator from "../../common/PDFGenerater";

const DEFAULT_PAGES = [
  "Title",
  "Introduction",
  "Inspection",
  "Layout",
  "Quote Details",
  "Authorize Page",
  "Terms and Conditions",
  "Warranty",
];

// Utility function to convert a Uint8Array to a base64 string
const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  let binary = "";
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};

export function SubHeader() {
  const router = useRouter();
  const formData = useEstimatePageStore((state) => state.formData);
  const { currentPage, removeCustomPage, customPages, setCurrentPage } =
    useEstimatePageStore();
  const theme = useTheme();
  const handleBack = () => router.back();
  const isCustomPage = currentPage.startsWith("Custom Page");
  const currentCustomPage = isCustomPage
    ? customPages.find((page) => page.title === currentPage)
    : null;

  const handleDeletePage = () => {
    if (currentCustomPage) {
      Alert.alert(
        "Delete Custom Page",
        `Are you sure you want to delete "${currentCustomPage.title}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              // Get all pages in order
              const allPages = [
                ...DEFAULT_PAGES,
                ...customPages.map((cp) => cp.title),
              ];

              const currentIndex = allPages.indexOf(currentPage);

              removeCustomPage(currentCustomPage.id);

              const nextPage =
                allPages[currentIndex + 1] ||
                allPages[currentIndex - 1] ||
                "Title";
              setCurrentPage(nextPage);
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.leftSection}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={20} color={theme.primary} />
          <Text style={[styles.backText, { color: theme.primary }]}>Back</Text>
        </Pressable>
        <View style={styles.estimateInfo}>
          <Text style={[styles.estimateName, { color: theme.primary }]}>
            Estimate #1234
          </Text>
          <Text style={[styles.layoutText, { color: theme.textSecondary }]}>
            Layout: Default Layout
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {isCustomPage && (
          <View style={{ marginRight: 16 }}>
            <Button
              label="Delete Page"
              onPress={handleDeletePage}
              variant="delete"
              size="medium"
            />
          </View>
        )}
        <PdfGenerator formData={formData} pageKey={currentPage} />
        <Pressable
          style={[
            styles.actionButton,
            {
              borderColor: theme.textPrimary,
              backgroundColor: theme.background,
            },
          ]}
          onPress={() => {
            router.push("/reviewandshare");
          }}
        >
          <MaterialIcons name="ios-share" size={16} color={theme.textPrimary} />
          <Text style={[styles.actionButtonText, { color: theme.textPrimary }]}>
            Review & Share
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
    gap: 8,
  },
  estimateInfo: {
    marginTop: 4,
  },
  estimateName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  layoutText: {
    fontSize: 14,
    color: Colors.black,
    opacity: 0.7,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  actionButtonText: { fontSize: 14, fontWeight: "600", color: Colors.primary },
});
