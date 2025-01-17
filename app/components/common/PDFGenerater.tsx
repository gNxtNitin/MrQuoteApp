import React, { useState } from "react";
import { Alert, ActivityIndicator, View, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "./Button";
import { Colors } from "@/app/constants/colors";

type FormData = Record<string, any>;

interface PdfGeneratorProps {
  formData: FormData;
  pageKey: string; // The key to extract data for the specific page
}

const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ formData, pageKey }) => {

  const [isLoading, setIsLoading] = useState(false); 

  const handleGeneratePdf = async () => {
    setIsLoading(true); // Start the loader

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pageWidth = 595.28; // A4 width
      const pageHeight = 841.89; // A4 height
      const fontSize = 12;
      const margin = 40;
      const maxImageSize = 200; // Max image dimension in pixels
      let cursorY = pageHeight - margin;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);

      const addTextToPage = (text: string) => {
        if (cursorY < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          cursorY = pageHeight - margin;
        }
        page.drawText(text, {
          x: margin,
          y: cursorY,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        cursorY -= 20;
      };

      const compressImage = async (uri: string): Promise<Uint8Array | null> => {
        try {
          const compressedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: maxImageSize, height: maxImageSize } }],
            { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
          );

          const imageBytes = await FileSystem.readAsStringAsync(
            compressedImage.uri,
            { encoding: FileSystem.EncodingType.Base64 }
          );

          return Uint8Array.from(atob(imageBytes), (c) => c.charCodeAt(0));
        } catch (error) {
          console.error("Error compressing image:", error);
          return null;
        }
      };

      const addCompressedImageToPage = async (uri: string) => {
        try {
          const compressedImageBytes = await compressImage(uri);
          if (!compressedImageBytes) return;

          const image = await pdfDoc.embedJpg(compressedImageBytes);
          const { width: originalWidth, height: originalHeight } = image.scale(1);

          const scaleFactor = Math.min(
            maxImageSize / originalWidth,
            maxImageSize / originalHeight,
            1
          );
          const scaledWidth = originalWidth * scaleFactor;
          const scaledHeight = originalHeight * scaleFactor;

          if (cursorY - scaledHeight < margin) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            cursorY = pageHeight - margin;
          }

          page.drawImage(image, {
            x: margin,
            y: cursorY - scaledHeight,
            width: scaledWidth,
            height: scaledHeight,
          });
          cursorY -= scaledHeight + 20;
        } catch (error) {
          console.error("Error embedding compressed image:", error);
        }
      };

      const addPdfToPage = async (uri: string) => {
        try {
          const pdfBytes = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const embeddedPdf = await PDFDocument.load(pdfBytes);
          const pdfPages = await pdfDoc.copyPages(
            embeddedPdf,
            embeddedPdf.getPageIndices()
          );

          pdfPages.forEach((pdfPage) => pdfDoc.addPage(pdfPage));
        } catch (error) {
          console.error("Error embedding PDF:", error);
        }
      };

      const processData = async (key: string, value: any) => {
        if (value === null || value === undefined) {
          addTextToPage(`${key}: N/A`);
          return;
        }

        if (typeof value === "string") {
          // Check if the string is a valid URI pointing to an image
          if (value.startsWith("file://") && /\.(jpg|jpeg|png|gif)$/i.test(value)) {
            await addCompressedImageToPage(value);
          } else if (value.startsWith("file://") && /\.(pdf)$/i.test(value)) {
            await addPdfToPage(value); // Embed the PDF
          } else {
            addTextToPage(`${key}: ${value}`);
          }
        } else if (value?.mimeType?.includes("image")) {
          await addCompressedImageToPage(value.uri);
        } else if (value?.mimeType?.includes("pdf")) {
          await addPdfToPage(value.uri); // Embed the PDF
        } else if (Array.isArray(value)) {
          addTextToPage(`${key}: [Array]`);
          for (const item of value) {
            await processData("Item", item);
          }
        } else if (typeof value === "object") {
          addTextToPage(`${key}: {Object}`);
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            await processData(nestedKey, nestedValue);
          }
        } else {
          addTextToPage(`${key}: ${value}`);
        }
      };

      const pageData = formData[pageKey]; 
      if (!pageData) {
        Alert.alert("Error", `No data found for page: ${pageKey}`);
        return;
      }

      for (const [key, value] of Object.entries(pageData)) {
        await processData(key, value);
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = uint8ArrayToBase64(pdfBytes);
      const pdfUri = `${FileSystem.documentDirectory}generated_report.pdf`;
      await FileSystem.writeAsStringAsync(pdfUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert("Sharing not available", "Cannot share the generated PDF.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "An error occurred while generating the PDF.");
    } finally {
      setIsLoading(false); // Stop the loader
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <Button
          label="View Page"
          onPress={handleGeneratePdf}
          variant="primary"
          size="medium"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default PdfGenerator;
