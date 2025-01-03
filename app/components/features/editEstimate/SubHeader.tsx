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
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';


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
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};

// Utility function to convert a base64 string to a Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const handleViewPage = async (formData: Record<string, any>) => {
  try {
    let base64PrimaryFile = '';
    let base64CertificateOrSecLogo = '';

    // Convert primaryImage to base64
    if (formData.primaryImage && formData.primaryImage.uri) {
      base64PrimaryFile = await FileSystem.readAsStringAsync(
        formData.primaryImage.uri,
        { encoding: FileSystem.EncodingType.Base64 }
      );
    }

    // Convert certificateOrSecLogo to base64
    if (formData.certificateOrSecLogo && formData.certificateOrSecLogo.uri) {
      base64CertificateOrSecLogo = await FileSystem.readAsStringAsync(
        formData.certificateOrSecLogo.uri,
        { encoding: FileSystem.EncodingType.Base64 }
      );
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    let yOffset = height - 50;
    const lineHeight = 20;

    // Add text content to the PDF
    page.drawText(formData.title || 'Untitled Report', {
      x: 50,
      y: yOffset,
      size: 18,
      color: rgb(0, 0, 0),
    });
    yOffset -= lineHeight * 2;

    const textFields = [
      { label: 'Company Name', value: formData.companyName || 'N/A' },
      { label: 'Report Type', value: formData.reportType || 'N/A' },
      { label: 'Date', value: formData.date || 'N/A' },
      { label: 'Address', value: formData.address || 'N/A' },
      { label: 'City', value: formData.city || 'N/A' },
      { label: 'State', value: formData.state || 'N/A' },
      { label: 'Postal Code', value: formData.postalCode || 'N/A' },
      { label: 'Name', value: `${formData.name || 'N/A'} ${formData.lastName || ''}` },
    ];

    textFields.forEach(({ label, value }) => {
      page.drawText(`${label}: ${value}`, {
        x: 50,
        y: yOffset,
        size: 12,
        color: rgb(0, 0, 0),
      });
      yOffset -= lineHeight;
    });

    // Handle Primary File (Image or PDF)
    if (base64PrimaryFile) {
      const primaryBytes = base64ToUint8Array(base64PrimaryFile);

      if (formData.primaryImage.mimeType.includes('image')) {
        const primaryImage = await pdfDoc.embedJpg(primaryBytes);
        const imageDims = primaryImage.scale(0.25);
        page.drawImage(primaryImage, {
          x: 50,
          y: yOffset - imageDims.height,
          width: imageDims.width,
          height: imageDims.height,
        });
        yOffset -= imageDims.height + lineHeight;
      } else if (formData.primaryImage.mimeType.includes('pdf')) {
        const primaryPdfDoc = await PDFDocument.load(primaryBytes);
        const primaryPages = await pdfDoc.copyPages(primaryPdfDoc, primaryPdfDoc.getPageIndices());
        primaryPages.forEach((p) => pdfDoc.addPage(p));
      }
    }

    // Handle Certificate/Logo File (Image or PDF)
    if (base64CertificateOrSecLogo) {
      const certBytes = base64ToUint8Array(base64CertificateOrSecLogo);

      if (formData.certificateOrSecLogo.mimeType.includes('image')) {
        const certImage = await pdfDoc.embedJpg(certBytes);
        const imageDims = certImage.scale(0.25);
        page.drawImage(certImage, {
          x: 50,
          y: yOffset - imageDims.height,
          width: imageDims.width,
          height: imageDims.height,
        });
        yOffset -= imageDims.height + lineHeight;
      } else if (formData.certificateOrSecLogo.mimeType.includes('pdf')) {
        const certPdfDoc = await PDFDocument.load(certBytes);
        const certPages = await pdfDoc.copyPages(certPdfDoc, certPdfDoc.getPageIndices());
        certPages.forEach((p) => pdfDoc.addPage(p));
      }
    }

    // Save the PDF document
    const pdfBytes = await pdfDoc.save();
    const base64Pdf = uint8ArrayToBase64(pdfBytes);
    const pdfUri = FileSystem.documentDirectory + 'generated_report.pdf';

    // Write the PDF file to the file system
    await FileSystem.writeAsStringAsync(pdfUri, base64Pdf, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share the generated PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri);
    } else {
      Alert.alert('Sharing Not Available', 'Cannot share the generated PDF.');
    }
  } catch (error) {
    console.error('Error generating or sharing PDF:', error);
    Alert.alert('Error', 'An error occurred while generating the PDF.');
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
