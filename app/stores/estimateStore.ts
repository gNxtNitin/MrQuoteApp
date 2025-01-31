import { create } from 'zustand';
import { EstimateData } from '../database/models/Estimate';
import { EstimateDetailData } from '../database/models/EstimateDetail';
import { Report, ReportData } from '../database/models/Report';
import { ReportPages } from '../database/models/ReportPages';

interface EstimateState {
  selectedEstimateId: number | null;
  selectedEstimate: EstimateData | null;
  selectedEstimateDetail: EstimateDetailData | null;
  selectedLayoutId: number | null;
  selectedPageId: number | null;
  setSelectedEstimate: (estimate: EstimateData, detail: EstimateDetailData) => void;
  clearSelectedEstimate: () => void;
  fetchAndSetLayout: (estimateId: number) => Promise<void>;
}

export const useEstimateStore = create<EstimateState>((set) => ({
  selectedEstimateId: null,
  selectedEstimate: null,
  selectedEstimateDetail: null,
  selectedLayoutId: null,
  selectedPageId: null,

  setSelectedEstimate: async (estimate: EstimateData, detail: EstimateDetailData) => {
    set({
      selectedEstimateId: estimate.id || null,
      selectedEstimate: estimate,
      selectedEstimateDetail: detail,
    });

    // If we have an estimate ID, fetch the layout and page
    if (estimate.id) {
      const report: ReportData[] = await Report.getByEstimateId(estimate.id);
      if (report && report[0]) {
        // Set layout ID
        if (report[0].layout_id) {
          set({ selectedLayoutId: report[0].layout_id });
        }

        // Fetch and set page ID
        const pages = await ReportPages.getByReportId(report[0].id!);
        if (pages && pages.length > 0) {
          // console.log.log('selectedPageId', pages[0].page_id);
          set({ selectedPageId: pages[0].page_id || null });
        } else {
          set({ selectedPageId: null });
        }
      } else {
        set({ 
          selectedLayoutId: null,
          selectedPageId: null
        });
      }
    }
  },

  clearSelectedEstimate: () => 
    set({
      selectedEstimateId: null,
      selectedEstimate: null,
      selectedEstimateDetail: null,
      selectedLayoutId: null,
      selectedPageId: null,
    }),

  fetchAndSetLayout: async (estimateId: number) => {
    try {
      const report = await Report.getByEstimateId(estimateId);
      if (report && report[0]) {
        // Set layout ID
        if (report[0].layout_id) {
          set({ selectedLayoutId: report[0].layout_id });
        }

        // Fetch and set page ID
        const pages = await ReportPages.getByReportId(report[0].id!);
        if (pages && pages.length > 0) {
          // console.log.log('selectedPageId', pages[0].page_id);
          set({ selectedPageId: pages[0].page_id || null });
        } else {
          set({ selectedPageId: null });
        }
      } else {
        set({ 
          selectedLayoutId: null,
          selectedPageId: null
        });
      }
    } catch (error) {
      console.error('Error fetching layout:', error);
      set({ 
        selectedLayoutId: null,
        selectedPageId: null
      });
    }
  },
})); 