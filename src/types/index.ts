/**
 * 帝國型別定義中心
 */

export type Tab = "home" | "butler" | "plus" | "announcements" | "lounge";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  video: string;
  category: string;
  rating: number;
  distance: string;
  sales: string;
  queueTime: string;
  tags: string[];
  serviceMode: 'mixed' | 'order' | 'reserve';
  lat: number;
  lng: number;
  type: 'merchant' | 'user';
  isFriendly?: boolean;
  products?: Product[];
}

export interface OrderData {
  selfQuantity: number;
  giftQuantity: number;
  recipientType: 'family' | 'friend' | 'citizen' | 'id' | null;
  subRecipientType?: string;
  recipientId?: string;
  totalAmount: number;
}
