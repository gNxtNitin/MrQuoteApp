import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "@/app/constants/colors";
import { Estimate } from "@/app/types/estimate";
import { Card } from "@/app/components/common/Card";
import { ActionButton } from "@/app/components/common/ActionButton";
import { getHouseImage } from "@/app/utils/houseImages";
import { Dimensions } from "react-native";
import { useTheme } from "../../providers/ThemeProvider";
import { useEstimatePageStore } from "@/app/stores/estimatePageStore";
import FinalPdfGenerator from "../../common/FinalPDfGenerator";

interface EstimateDetailsProps {
  estimate: Estimate;
  onEdit?: () => void;
  onView?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function EstimateDetails({
  estimate,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
}: EstimateDetailsProps) {
  const theme = useTheme();
  const houseImage = getHouseImage(estimate.id);
  const finalEstimate = useEstimatePageStore((state) => state.formData);

  const handleViewEstimate = () => {
    console.log("Final Estimate", finalEstimate);
  };

  return (
    <View style={styles.container}>
      <Card style={{ backgroundColor: theme.background }}>
        <Image
          source={houseImage}
          style={styles.coverImage}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={`House image for ${estimate.customerName}'s estimate`}
        />

        <View
          style={[styles.contentContainer, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.estimateName, { color: theme.textPrimary }]}>
            {estimate.customerName}'s Estimate
          </Text>

          <View style={styles.buttonGrid}>
            <ActionButton icon="edit" label="Edit" onPress={onEdit} />

            {/* <ActionButton
              icon="visibility"
              label="View Estimate"
              onPress={handleViewEstimate}
            /> */}
            <FinalPdfGenerator formData={finalEstimate} />
            {/* <ActionButton
              icon="content-copy"
              label="Duplicate"
              onPress={onDuplicate}
            /> */}
            <ActionButton
              icon="delete"
              label="Delete"
              onPress={onDelete}
              variant="delete"
            />
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 50,
  },
  coverImage: {
    width: "100%",
    height: Dimensions.get("window").height * 0.35,
    minHeight: 300,
    maxHeight: 450,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  contentContainer: {
    padding: 32,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  estimateName: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 40,
  },
  buttonGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
});
