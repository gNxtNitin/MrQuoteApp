import { ImageSourcePropType } from 'react-native';

export interface Estimate {
  id: string;
  customerName: string;
  address: string;
  date: string;
  status: 'provided' | 'accepted' | 'requested' | 'completed' | 'revised' | 'cancelled';
  phone: string;
  email: string;
  houseImage: ImageSourcePropType;
}
