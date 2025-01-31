import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "@/app/constants/colors";
import { SubHeader } from "./SubHeader";
import { EmptyState } from "./EmptyState";
import { EstimatesList } from "./EstimatesList";
import { CreateEstimateDialog } from "../estimate/CreateEstimateDialog";
import { ScreenLayout } from "@/app/components/common/ScreenLayout";
import { useTheme } from "@/app/components/providers/ThemeProvider";
import { Estimate, EstimateData } from "@/app/database/models/Estimate";
import {
  EstimateDetail,
  EstimateDetailData,
} from "@/app/database/models/EstimateDetail";
import { useAuth } from "@/app/hooks/useAuth";
import { useHeaderStore } from "@/app/stores/headerStore";

interface EstimateWithDetails {
  estimate: EstimateData;
  detail: EstimateDetailData;
}

export function HomeScreen() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [estimates, setEstimates] = useState<EstimateWithDetails[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // Track which dropdown is open
  const theme = useTheme();
  const { user } = useAuth();
  const { selectedCompany } = useHeaderStore();

  const handleOutsidePress = () => {
    setActiveDropdown(null);
    Keyboard.dismiss();
  };

  const loadEstimates = async () => {
    try {
      if (user?.id && selectedCompany) {
        // Get all estimates for the selected company and logged-in user
        const estimatesData = await Estimate.getByUserAndCompanyId(
          user.id,
          selectedCompany
        );
        // console.log.log("Estimates Data:", estimatesData);
        // Get details for each estimate
        const estimatesWithDetails = await Promise.all(
          estimatesData.map(async (estimate) => {
            // console.log.log("Estimate ID:", estimate.id);
            const estimateDetailData: EstimateDetailData | null =
              await EstimateDetail.getByEstimateId(estimate.id!);
            // console.log.log("Estimate Detail Data:", estimateDetailData);
            if (!estimateDetailData) {
              // If no detail exists, create a default detail object
              return {
                estimate,
                detail: {
                  estimate_id: estimate.id,
                  estimate_number: estimateDetailData!.estimate_number,
                  sales_person: estimateDetailData!.sales_person,
                  estimate_revenue: estimateDetailData!.estimate_revenue,
                  email: estimateDetailData!.email,
                  phone: estimateDetailData!.phone,
                  is_active: true,
                  created_by: user.id,
                  modified_by: user.id,
                },
              };
            }
            return {
              estimate,
              detail: estimateDetailData,
            };
          })
        );

        // console.log.log("Loaded User Estimates:", estimatesWithDetails);
        setEstimates(estimatesWithDetails);
      }
    } catch (error) {
      console.error("Error loading estimates:", error);
      setEstimates([]);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, [selectedCompany, user?.id]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      loadEstimates();
    }, 2000);
  };

  const handleCreate = () => {
    setShowCreateDialog(true);
  };

  const handleSaveEstimate = async () => {
    await loadEstimates();
    setShowCreateDialog(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress} accessible={false}>
      <ScreenLayout
        subHeader={<SubHeader onSync={handleSync} onCreate={handleCreate} />}
      >
        <View
          style={[
            styles.contentContainer,
            { backgroundColor: theme.background },
          ]}
        >
          {estimates.length > 0 ? (
            <EstimatesList
              estimates={estimates}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          ) : (
            <EmptyState isSyncing={isSyncing} />
          )}
        </View>

        <CreateEstimateDialog
          visible={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSave={handleSaveEstimate}
          companyId={selectedCompany}
        />
      </ScreenLayout>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
