import { create } from 'zustand';
import { EstimateData } from '../database/models/Estimate';
import { EstimateDetailData } from '../database/models/EstimateDetail';
import { Report, ReportData } from '../database/models/Report';

interface EstimateState {
  selectedEstimateId: number | null;
  selectedEstimate: EstimateData | null;
  selectedEstimateDetail: EstimateDetailData | null;
  selectedLayoutId: number | null;
  setSelectedEstimate: (estimate: EstimateData, detail: EstimateDetailData) => Promise<void>;
  clearSelectedEstimate: () => void;
  fetchAndSetLayout: (estimateId: number) => Promise<void>;
}

export const useEstimateStore = create<EstimateState>((set) => ({
  selectedEstimateId: null,
  selectedEstimate: null,
  selectedEstimateDetail: null,
  selectedLayoutId: null,

  setSelectedEstimate: async (estimate: EstimateData, detail: EstimateDetailData) => {
    set({
      selectedEstimateId: estimate.id || null,
      selectedEstimate: estimate,
      selectedEstimateDetail: detail,
    });

    // If we have an estimate ID, fetch the layout
    if (estimate.id) {
      const report: ReportData[] = await Report.getByEstimateId(estimate.id);
      if (report && report[0].layout_id) {
        set({ selectedLayoutId: report[0].layout_id });
      } else {
        set({ selectedLayoutId: null });
      }
    }
  },

  clearSelectedEstimate: () => 
    set({
      selectedEstimateId: null,
      selectedEstimate: null,
      selectedEstimateDetail: null,
      selectedLayoutId: null,
    }),

  fetchAndSetLayout: async (estimateId: number) => {
    try {
      const report = await Report.getByEstimateId(estimateId);
      if (report && report[0].layout_id) {
        set({ selectedLayoutId: report[0].layout_id });
      } else {
        set({ selectedLayoutId: null });
      }
    } catch (error) {
      console.error('Error fetching layout:', error);
      set({ selectedLayoutId: null });
    }
  },
})); 