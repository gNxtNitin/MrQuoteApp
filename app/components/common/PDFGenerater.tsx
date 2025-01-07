import React from "react";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "./Button";

type FormData = Record<string, any>;

interface PdfGeneratorProps {
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

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ formData }) => {
  const handleGeneratePdf = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const { width, height } = page.getSize();
      const fontSize = 12;

      let cursorY = height - 40; // Start near the top of the page

      const addTextToPage = (text: string) => {
        if (cursorY < 40) {
          const newPage = pdfDoc.addPage([width, height]);
          cursorY = height - 40;
        }
        page.drawText(text, {
          x: 40,
          y: cursorY,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        cursorY -= 20;
      };

      const processData = async (key: string, value: any) => {
        if (value === null || value === undefined) {
          addTextToPage(`${key}: N/A`);
          return;
        }
      
        if (typeof value === "string") {
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
            const maxImageSize = 200;
            const imageDims = image.scale(1);
      
            const scaledWidth =
              imageDims.width > maxImageSize ? maxImageSize : imageDims.width;
            const scaledHeight =
              imageDims.height > maxImageSize ? maxImageSize : imageDims.height;
      
            if (cursorY - scaledHeight < 40) {
              const newPage = pdfDoc.addPage([width, height]);
              cursorY = height - 40;
            }
      
            page.drawImage(image, {
              x: 40,
              y: cursorY - scaledHeight,
              width: scaledWidth,
              height: scaledHeight,
            });
      
            cursorY -= scaledHeight + 20;
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
            await processData("Item", item);
          }
        } else if (typeof value === "object") {
          addTextToPage(`${key}: {Object}`);
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            await processData(nestedKey, nestedValue);
          }
        } else {
          addTextToPage(`${key}: ${value || "N/A"}`);
        }
      };
      

      for (const [key, value] of Object.entries(formData)) {
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
    }
  };

  return (
    <>
      <Button
        label="View Page"
        onPress={handleGeneratePdf}
        variant="primary"
        size="medium"
      />
    </>
  );
};

export default PdfGenerator;
