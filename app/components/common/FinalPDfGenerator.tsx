import React from "react";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ActionButton } from "./ActionButton";

type FormData = Record<string, any>;

interface FinalPdfGeneratorProps {
  formData: FormData;
}

const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const FinalPdfGenerator: React.FC<FinalPdfGeneratorProps> = ({ formData }) => {
    
  const handleGeneratePdf = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
  
      // Standard A4 dimensions
      const width = 595.28;
      const height = 841.89;
  
      const processData = async (data: FormData, page: any) => {
        let cursorY = height - 40; // Starting Y position for the text
  
        const addTextToPage = (text: string) => {
          if (cursorY < 40) {
            // If there's no more space on the current page, create a new one
            const newPage = pdfDoc.addPage([width, height]);
            cursorY = height - 40; // Reset cursorY for the new page
            page = newPage;
          }
          page.drawText(text, {
            x: 40,
            y: cursorY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
          cursorY -= 20; // Move cursor down for the next line of text
        };
  
        for (const [key, value] of Object.entries(data)) {
          if (value === null || value === undefined) {
            addTextToPage(`${key}: N/A`);
          } else if (typeof value === "string") {
            addTextToPage(`${key}: ${value}`);
          } else if (value?.mimeType?.includes("image")) {
            try {
              const imageBytes = await FileSystem.readAsStringAsync(value.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              const imageBuffer = Uint8Array.from(atob(imageBytes), (c) =>
                c.charCodeAt(0)
              );
              const image = await pdfDoc.embedJpg(imageBuffer);
              const scaledImage = image.scaleToFit(200, 200);
  
              if (cursorY - scaledImage.height < 40) {
                // Create a new page if there's not enough space for the image
                const newPage = pdfDoc.addPage([width, height]);
                cursorY = height - 40; // Reset cursorY
                page = newPage;
              }
  
              page.drawImage(image, {
                x: 40,
                y: cursorY - scaledImage.height,
                width: scaledImage.width,
                height: scaledImage.height,
              });
              cursorY -= scaledImage.height + 20; // Adjust cursorY after drawing the image
            } catch (error) {
              console.error(`Failed to process image for key: ${key}`, error);
            }
          } else if (value?.mimeType?.includes("pdf")) {
            try {
              const pdfBytes = await FileSystem.readAsStringAsync(value.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              const embeddedPdf = await PDFDocument.load(pdfBytes);
              const pdfPages = await pdfDoc.copyPages(
                embeddedPdf,
                embeddedPdf.getPageIndices()
              );
  
              pdfPages.forEach((pdfPage) => pdfDoc.addPage(pdfPage));
            } catch (error) {
              console.error(`Failed to process PDF for key: ${key}`, error);
            }
          } else if (Array.isArray(value)) {
            addTextToPage(`${key}: [Array]`);
            for (const item of value) {
              await processData(item, page);
            }
          } else if (typeof value === "object") {
            addTextToPage(`${key}: {Object}`);
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
              await processData({ [nestedKey]: nestedValue }, page);
            }
          } else {
            addTextToPage(`${key}: ${value}`);
          }
        }
      };
  
      for (const [pageKey, pageData] of Object.entries(formData)) {
        const page = pdfDoc.addPage([width, height]);
        page.drawText(`Page: ${pageKey}`, {
          x: 40,
          y: height - 20,
          size: fontSize + 2,
          font,
          color: rgb(0.2, 0.2, 0.8),
        });
        await processData(pageData, page);
      }
  
      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = uint8ArrayToBase64(pdfBytes);
      const pdfUri = `${FileSystem.documentDirectory}FinalReport.pdf`;
  
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
    }
  };
  
  return (
    <ActionButton
      icon="visibility"
      label="View Estimate"
      onPress={handleGeneratePdf}
    />
  );
};

export default FinalPdfGenerator;
