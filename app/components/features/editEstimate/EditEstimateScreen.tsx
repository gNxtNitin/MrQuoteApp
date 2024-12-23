import { View } from 'react-native';
import { ScreenLayout } from '@/app/components/common/ScreenLayout';
import { SubHeader } from '@/app/components/features/editEstimate/SubHeader';
import { TitlePage } from './pages/TitlePage';
import { IntroductionPage } from './pages/IntroductionPage';
import { InspectionPage } from './pages/InspectionPage';
import { LayoutPage } from './pages/LayoutPage';
import { QuoteDetailsPage } from './pages/QuoteDetailsPage';
import { AuthorizePage } from './pages/AuthorizePage';
import { TermsPage } from './pages/TermsPage';
import { WarrantyPage } from './pages/WarrantyPage';
import { CustomPage } from './pages/CustomPage';
import { useEstimatePageStore } from '@/app/stores/estimatePageStore';

export default function EditEstimateScreen() {
  const { currentPage } = useEstimatePageStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'Title':
        return <TitlePage />;
      case 'Introduction':
        return <IntroductionPage />;
      case 'Inspection':
        return <InspectionPage />;
      case 'Layout':
        return <LayoutPage />;
      case 'Quote Details':
        return <QuoteDetailsPage />;
      case 'Authorize Page':
        return <AuthorizePage />;
      case 'Terms and Conditions':
        return <TermsPage />;
      case 'Warranty':
        return <WarrantyPage />;
      default:
        if (currentPage.startsWith('Custom Page')) {
          return <CustomPage title={currentPage} />;
        }
        return <TitlePage />;
    }
  };

  return (
    <ScreenLayout>
      <SubHeader />
      <View style={{ flex: 1 }}>
        {renderPage()}
      </View>
    </ScreenLayout>
  );
} 