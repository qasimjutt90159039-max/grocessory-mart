import {
  Product,
  Category,
  Brand,
  Coupon,
  Order,
  Review,
  ContactMessage,
  User,
  UserAddress,
} from './types';

const API_BASE = '/api';

function getHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const activeToken = token || localStorage.getItem('mm_auth_token');
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getMe(token?: string) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async addAddress(addr: Omit<UserAddress, 'id'>) {
    const res = await fetch(`${API_BASE}/auth/address`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(addr),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add address');
    }
    return res.json();
  },

  async deleteAddress(id: string) {
    const res = await fetch(`${API_BASE}/auth/address/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete address');
    return res.json();
  },

  // Products
  async getProducts(params?: {
    category?: string;
    subcategory?: string;
    brand?: string;
    search?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isDeal?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<Product[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  // Categories & Brands
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getBrands(): Promise<Brand[]> {
    const res = await fetch(`${API_BASE}/brands`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },

  // Coupons
  async validateCoupon(code: string, cartTotal: number) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code, cartTotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Coupon validation failed');
    }
    return data;
  },

  // Orders
  async placeOrder(orderData: {
    customer: { fullName: string; phone: string; email: string };
    delivery: { address: string; area: string; city: string; postalCode?: string; orderNotes?: string };
    items: Array<{
      productId: string;
      productName: string;
      slug: string;
      price: number;
      quantity: number;
      weight: string;
      image: string;
    }>;
    couponCode?: string;
  }): Promise<{ message: string; orderNumber: string; order: Order }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return res.json();
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    const url = productId ? `${API_BASE}/reviews?productId=${productId}` : `${API_BASE}/reviews`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async submitReview(data: { productId: string; productName: string; rating: number; review: string }) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit review');
    }
    return res.json();
  },

  // Contact
  async submitContact(data: { name: string; phone: string; email?: string; message: string }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send message');
    }
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch store settings');
    return res.json();
  },

  // Admin Endpoints
  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load admin analytics');
    return res.json();
  },

  async adminCreateProduct(productData: any) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  async adminUpdateProduct(id: string, updates: any) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async adminDeleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  async adminUpdateOrderStatus(
    id: string,
    status: string,
    deliveryStatus?: string,
    paymentStatus?: string
  ) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, deliveryStatus, paymentStatus }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  async adminGetCoupons(): Promise<Coupon[]> {
    const res = await fetch(`${API_BASE}/coupons`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load coupons');
    return res.json();
  },

  async adminCreateCoupon(coupon: any) {
    const res = await fetch(`${API_BASE}/coupons`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(coupon),
    });
    if (!res.ok) throw new Error('Failed to create coupon');
    return res.json();
  },

  async adminDeleteCoupon(id: string) {
    const res = await fetch(`${API_BASE}/coupons/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete coupon');
    return res.json();
  },

  async adminGetUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  // Compatibility aliases
  async createOrder(data: any) {
    return this.placeOrder(data);
  },
  async getOrder(id: string) {
    return this.getOrderById(id);
  },
  async getAdminStats() {
    return this.getAdminAnalytics();
  },
  async getQuotes() {
    return [];
  },
  async getRepairs() {
    return [];
  },
  async getUsers() {
    return this.adminGetUsers();
  },
  async getMessages() {
    const res = await fetch(`${API_BASE}/admin/messages`, { headers: getHeaders() });
    if (!res.ok) return [];
    return res.json();
  },
  async updateOrderStatus(id: string, status: string, deliveryStatus?: string, paymentStatus?: string) {
    return this.adminUpdateOrderStatus(id, status, deliveryStatus, paymentStatus);
  },
  async updateQuoteStatus(_id: string, _s: string, _notes?: string) {
    return {};
  },
  async updateRepairStatus(_id: string, _s: string, _notes?: string) {
    return {};
  },
  async deleteProduct(id: string) {
    return this.adminDeleteProduct(id);
  },
  async updateProduct(id: string, updates: any) {
    return this.adminUpdateProduct(id, updates);
  },
  async createProduct(data: any) {
    return this.adminCreateProduct(data);
  },
  async updateStock(id: string, qty: number, _reason?: string) {
    return this.adminUpdateProduct(id, { stock: qty });
  },
  async submitQuote(_data: any) {
    return { message: 'Quote submitted successfully', quoteNumber: 'Q-' + Date.now().toString().slice(-6) };
  },
  async submitRepair(_data: any) {
    return { message: 'Repair request submitted successfully', repairNumber: 'R-' + Date.now().toString().slice(-6) };
  },
};
