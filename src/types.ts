export interface ProductVariant {
  id: string;
  name: string;
  weight: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
}

export interface NutritionFacts {
  servingSize?: string;
  calories?: string;
  protein?: string;
  fat?: string;
  carbs?: string;
  sugar?: string;
  sodium?: string;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  salePrice?: number;
  currency: 'PKR';
  sku: string;
  barcode: string;
  weight: string;
  unit: string;
  dimensions?: string;
  ingredients?: string[];
  nutrition?: NutritionFacts;
  storageInstructions?: string;
  variants?: ProductVariant[];
  stock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isDeal: boolean;
  dealExpiry?: string;
  demoNotice?: string;
  priceType?: string;
  capacity?: string;
  accuracy?: string;
  specifications?: Record<string, string> | any;
  applications?: string[];
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
  iconName: string;
  image: string;
  subcategories: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface Coupon {
  id: string;
  couponCode: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface UserAddress {
  id: string;
  title: string;
  street: string;
  area: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  address?: {
    street?: string;
    city?: string;
    area?: string;
    postalCode?: string;
  } | string | any;
  city?: string;
  area?: string;
  postalCode?: string;
  role: 'admin' | 'customer';
  addresses?: UserAddress[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  slug: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  weight: string;
  variantId?: string;
  variantName?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  delivery: {
    address: string;
    area: string;
    city: string;
    postalCode: string;
    orderNotes?: string;
    deliveryNotes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Paid';
  deliveryStatus: 'Pending' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  status: 'approved' | 'pending' | 'hidden';
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface InventoryHistory {
  id: string;
  productId: string;
  productName: string;
  type: 'addition' | 'reduction' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: string;
}

export interface QuoteRequest {
  id: string;
  quoteNumber?: string;
  name?: string;
  fullName?: string;
  companyName?: string;
  email: string;
  phone: string;
  product?: string;
  productName?: string;
  quantity?: number;
  requirements?: string;
  internalNotes?: string;
  message?: string;
  status: string;
  createdAt: string;
}

export interface RepairRequest {
  id: string;
  repairNumber?: string;
  name?: string;
  customerName?: string;
  location?: string;
  preferredContactMethod?: string;
  email: string;
  phone: string;
  equipmentType?: string;
  scaleType?: string;
  problem?: string;
  issueDescription?: string;
  technicianNotes?: string;
  status: string;
  createdAt: string;
}
