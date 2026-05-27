export interface WeatherInfo {
  temp: string;
  status: string;
  icon: 'sun' | 'rain' | 'wind' | 'moon' | 'cloud-sun';
  description: string;
}

export interface AppleEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'demo' | 'lab' | 'workshop' | 'keynote';
  date: string;
  timeSlots: string[];
  duration: string;
  location: string;
  spotsLeft: number;
  maxSpots: number;
  imageUrl: string;
  pricing: string;
  features: string[];
  googleMapEmbedUrl: string;
  weather: WeatherInfo;
  greeting: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

export interface Ticket {
  id: string;
  event: AppleEvent;
  timeSlot: string;
  seatNumber: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  selectedAddOns?: AddOnItem[];
  isCheckedIn?: boolean;
}
