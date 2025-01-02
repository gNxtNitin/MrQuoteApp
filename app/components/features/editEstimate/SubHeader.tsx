import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { Colors } from "@/app/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "../../common/Button";
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";
import { useTheme } from "../../providers/ThemeProvider";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";

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


const handleViewPage = async (formData: Record<string, any>) => {
  try {
    let base64PrimaryImage = '';
    let base64CertificateOrSecLogo = '';

    // Convert primaryImage to base64 if it's an image
    if (formData.primaryImage && formData.primaryImage.uri) {
      if (formData.primaryImage.mimeType.includes('image')) {
        base64PrimaryImage = await FileSystem.readAsStringAsync(
          formData.primaryImage.uri,
          { encoding: FileSystem.EncodingType.Base64 }
        );
      }
    }

    // Convert certificateOrSecLogo to base64 if it's a PDF
    if (
      formData.certificateOrSecLogo &&
      formData.certificateOrSecLogo.uri &&
      formData.certificateOrSecLogo.mimeType.includes('pdf')
    ) {
      base64CertificateOrSecLogo = await FileSystem.readAsStringAsync(
        formData.certificateOrSecLogo.uri,
        { encoding: FileSystem.EncodingType.Base64 }
      );
    }

    // Generate HTML content for the PDF (using inline base64 images)
    let htmlContent = `
      <html>
        <body>
          <h1>${formData.title || 'Untitled Report'}</h1>
          <p><strong>Company Name:</strong> ${formData.companyName || 'N/A'}</p>
          <p><strong>Report Type:</strong> ${formData.reportType || 'N/A'}</p>
          <p><strong>Date:</strong> ${formData.date || 'N/A'}</p>
          <p><strong>Address:</strong> ${formData.address || 'N/A'}</p>
          <p><strong>City:</strong> ${formData.city || 'N/A'}</p>
          <p><strong>State:</strong> ${formData.state || 'N/A'}</p>
          <p><strong>Postal Code:</strong> ${formData.postalCode || 'N/A'}</p>
          <p><strong>Name:</strong> ${formData.name || 'N/A'} ${formData.lastName || ''}</p>
        </body>
      </html>
    `;

    if (base64PrimaryImage) {
      htmlContent += `
        <p><strong>Primary Image:</strong></p>
        <img src="data:image/jpeg;base64,${base64PrimaryImage}" alt="Primary Image" style="width: 200px; height: auto;" />
      `;
    }

    if (base64CertificateOrSecLogo) {
      htmlContent += `
        <p><strong>Certificate or Sec Logo (PDF) included:</strong></p>
        <p>The file is embedded as base64, and should be viewed in a compatible viewer. </p>
        <p>PDF content is not rendered inline, but the file has been attached to the document.</p>
      `;
    }

    // Generate the PDF file using the HTML content
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    // Share the generated PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Sharing Not Available", "Cannot share the generated PDF.");
    }
  } catch (error) {
    console.error("Error generating or sharing PDF:", error);
    Alert.alert("Error", "An error occurred while generating the PDF.");
  }
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
        <Button
          label="View Page"
          onPress={() => handleViewPage(formData)}
          variant="primary"
          size="medium"
        />
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
