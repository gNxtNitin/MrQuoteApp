import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Card } from "../../common/Card";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { Colors } from "@/app/constants/colors";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Header } from "../home/Header";
import { ScreenLayout } from "../../common/ScreenLayout";


interface ReviewAndShareScreenProps {
  onReviewAndShare: () => void;
  isDarkMode: boolean;
}

interface OptionData {
  option: string;
  value: string;
}

const DATA: OptionData[] = [
  { option: "Option A", value: "$67436534" },
  { option: "Option B", value: "$67456432" },
  { option: "Option C", value: "$87456342" },
  { option: "Option D", value: "$34564321" },
  { option: "Option E", value: "$74654323" },
  { option: "Option F", value: "$45764234" },
  { option: "Option G", value: "$74562344" },
  { option: "Option H", value: "$34523456" },
  { option: "Option I", value: "$46523467" },
  { option: "Option J", value: "$76452345" },
];

const ProtectionData: OptionData[] = [
  { option: "LeafPro Gutter Protection", value: "$4353" },
  { option: "Forever Clean Gutter Protection (Aluminum)", value: "$6745" },
  { option: "Textured Forever Clean Gutter Protection", value: "$8745" },
  { option: "Special Color", value: "$34564" },
];

const OptionCard = ({
  item,
  isSelected,
  onSelect,
}: {
  item: OptionData;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <TouchableOpacity
    style={[
      styles.optionCard,
      isSelected && { backgroundColor: Colors.primary },
    ]}
    onPress={onSelect}
  >
    <Text style={[styles.option, isSelected && { color: Colors.white }]}>
      {item.option}
    </Text>
    <Text style={[styles.value2, isSelected && { color: Colors.white }]}>
      {item.value}
    </Text>
  </TouchableOpacity>
);

const OptionList = ({ data }: { data: OptionData[] }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <View style={styles.optionListContainer}>
      {data.map((item, index) => (
        <OptionCard
          key={`${item.option}-${index}`}
          item={item}
          isSelected={selectedOption === item.option}
          onSelect={() => setSelectedOption(item.option)}
        />
      ))}
    </View>
  );
};

export function ReviewAndShareScreen({
  onReviewAndShare,
  isDarkMode,
}: ReviewAndShareScreenProps) {
  const theme = useTheme();
    const router = useRouter();

  const handleBack = () => router.back();


  return (
    <ScreenLayout>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Pressable style={styles.backButton} onPress={handleBack}>
                  <MaterialIcons name="arrow-back" size={20} color={theme.primary} />
                  <Text style={[styles.backText, { color: theme.primary }]}>Back</Text>
                </Pressable>
        <Card style={styles.detailCard}>
          <View style={styles.logoContainer}>
            <Text style={styles.mrQuote}>Mr Quote</Text>
            <Text style={styles.desc}>
              Residential & Commercial Gutter Experts
            </Text>
          </View>
          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.key}>Customer Name:</Text>
              <Text style={styles.name}>Robert Sled</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.key}>Address:</Text>
              <Text style={styles.value}>75 South Street Granby, MA 01033</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.key}>Project No.:</Text>
              <Text style={styles.value}>1045643019</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.belowCard}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            <View>
              <Text style={styles.heading}>Select one of the options below</Text>
              <OptionList data={DATA} />

              <Text style={styles.heading}>
                Choose from the following options upgrades
              </Text>
              <View>
                <Text style={styles.leaf}>Leaf Protection</Text>
                <OptionList data={ProtectionData} />
              </View>
            </View>

            <View style={styles.addOns}>
              <View style={styles.customAddOns}>
                <Text style={styles.heading}>Details</Text>
                <Text style={styles.leaf}>Gutter Color</Text>
                <Input placeholder="Please Select a color" />

                <View style={styles.quoteSummary}>
                  <Text style={styles.subHeading}>Quote Summary</Text>
                  <View style={styles.row}>
                    <Text style={styles.blackKey}>Quote subtotal</Text>
                    <Text style={styles.valueBlack}>$0.00</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.blackKey}>Options</Text>
                    <Text style={styles.valueBlack}>$0.00</Text>
                  </View>
                  <View style={styles.line}></View>
                  <View style={styles.row}>
                    <Text style={styles.blackKey}>Toatal</Text>
                    <Text style={styles.valueBlack}>$0.00</Text>
                  </View>
                  <View style={styles.row}>
                    <Button
                      label="Save and Sign"
                      variant="primary"
                      size="medium"
                    />

                    <Button label="Save" variant="outline" />
                  </View>
                  <Pressable
                    style={[
                      styles.actionButton,
                      {
                        borderColor: theme.textPrimary,
                        backgroundColor: theme.background,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="download-for-offline"
                      size={16}
                      color={theme.textPrimary}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: theme.textPrimary },
                      ]}
                    >
                      Download Quote
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.customAddOns}>
                <Text style={styles.subHeading}>Notes</Text>
                <Input placeholder="Notes..." />
              </View>
            </View>
          </ScrollView>
        </Card>
      </View>
      </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    gap: 20,
  },
  detailCard: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  logoContainer: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  mrQuote: {
    color: Colors.black,
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  desc: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: "center",
  },
  details: {
    width: "45%",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  key: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  value: {
    color: Colors.black,
    fontSize: 16,
    flex: 2,
  },
  name: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "500",
    flex: 2,
  },
  scroll: {
    padding: 20,
  },
  belowCard: {
    flex: 1,
  },
  heading: {
    color: Colors.black,
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  optionListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionCard: {
    width: "48%",
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
  },
  option: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  value2: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  leaf: {
    color: Colors.black,
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  addOns: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 50,
    justifyContent:'space-between',
  },
  customAddOns: {
    width: "48%",
    gap:10
  },
  quoteSummary: {
    marginTop: 25,
    gap: 15,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
  },
  blackKey: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  valueBlack: {
    fontSize: 16,
    color: Colors.black,
  },
  line: {
    backgroundColor: Colors.gray[400],
    height: 0.8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  actionButtonText: { fontSize: 14, fontWeight: "600", color: Colors.primary },

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
});

