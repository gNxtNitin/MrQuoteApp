import { ImageSourcePropType } from 'react-native';

export interface Estimate {
  id: string;
  customerName: string;
  estimateNumber: string;
  address: string;
  date: string;
  estimateStatus: 'provided' | 'accepted' | 'requested' | 'completed' | 'revised' | 'cancelled';
  phone: string;
  email: string;
  houseImage: ImageSourcePropType;
}
