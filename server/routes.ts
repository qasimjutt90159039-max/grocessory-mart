import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './database.js';

export const apiRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'multan_mart_secret_key_2026_production';

// Auth Middleware
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'customer';
    name: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin authorization required' });
  }
  next();
};

// --- AUTH ROUTES ---
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Account with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = db.createUser({
      id: 'usr_' + Date.now().toString(36),
      name,
      email,
      phone: phone || '',
      passwordHash,
      role: 'customer',
      addresses: [],
      createdAt: new Date().toISOString(),
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        addresses: newUser.addresses,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

apiRouter.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      addresses: user.addresses || [],
    },
  });
});

apiRouter.post('/auth/address', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { title, street, area, city, postalCode, isDefault } = req.body;
    const user = db.getUserById(req.user!.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newAddr = {
      id: 'addr_' + Date.now().toString(36),
      title: title || 'Home',
      street: street || '',
      area: area || '',
      city: city || 'Multan',
      postalCode: postalCode || '60000',
      isDefault: isDefault ?? false,
    };

    const addresses = user.addresses ? [...user.addresses] : [];
    if (newAddr.isDefault) {
      addresses.forEach((a) => (a.isDefault = false));
    }
    addresses.push(newAddr);

    db.updateUser(user.id, { addresses });
    res.status(201).json(addresses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/auth/address/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const addresses = (user.addresses || []).filter((a) => a.id !== req.params.id);
  db.updateUser(user.id, { addresses });
  res.json(addresses);
});

// --- PRODUCTS ---
apiRouter.get('/products', (req: Request, res: Response) => {
  let products = db.getProducts();
  const { category, subcategory, brand, search, isFeatured, isBestSeller, isDeal, minPrice, maxPrice, sort } = req.query;

  if (category && category !== 'all') {
    products = products.filter((p) => p.category === category || p.category === category.toString().toLowerCase());
  }

  if (subcategory && subcategory !== 'all') {
    products = products.filter((p) => p.subcategory?.toLowerCase() === subcategory.toString().toLowerCase());
  }

  if (brand && brand !== 'all') {
    products = products.filter((p) => p.brand.toLowerCase() === brand.toString().toLowerCase());
  }

  if (isFeatured === 'true') {
    products = products.filter((p) => p.isFeatured);
  }

  if (isBestSeller === 'true') {
    products = products.filter((p) => p.isBestSeller);
  }

  if (isDeal === 'true') {
    products = products.filter((p) => p.isDeal);
  }

  if (minPrice) {
    products = products.filter((p) => (p.salePrice || p.price) >= Number(minPrice));
  }

  if (maxPrice) {
    products = products.filter((p) => (p.salePrice || p.price) <= Number(maxPrice));
  }

  if (search) {
    const q = search.toString().toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sort === 'price-high') {
    products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    // Default: featured first, then bestsellers
    products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  res.json(products);
});

apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const product = db.getProductBySlug(req.params.slug) || db.getProductById(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

apiRouter.post('/products', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const body = req.body;
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct = db.createProduct({
      ...body,
      id: 'prod_' + Date.now().toString(36),
      productId: 'MM-' + Math.floor(1000 + Math.random() * 9000),
      slug,
      currency: 'PKR',
      rating: body.rating || 5.0,
      reviewCount: body.reviewCount || 0,
      stockStatus: body.stock > 0 ? (body.stock < 10 ? 'low_stock' : 'in_stock') : 'out_of_stock',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.put('/products/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

apiRouter.delete('/products/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ message: 'Product deleted successfully' });
});

// --- CATEGORIES & BRANDS ---
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

apiRouter.get('/brands', (_req: Request, res: Response) => {
  res.json(db.getBrands());
});

// --- COUPONS ---
apiRouter.get('/coupons', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getCoupons());
});

apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required' });

  const coupon = db.getCouponByCode(code);
  if (!coupon) {
    return res.status(400).json({ valid: false, error: 'Invalid or expired coupon code' });
  }

  const subtotal = Number(cartTotal) || 0;
  if (subtotal < coupon.minimumOrder) {
    return res.status(400).json({
      valid: false,
      error: `Minimum order of PKR ${coupon.minimumOrder.toLocaleString()} required for this coupon`,
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    valid: true,
    couponCode: coupon.couponCode,
    discount: Math.round(discount),
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    message: `Coupon applied: PKR ${Math.round(discount).toLocaleString()} saved!`,
  });
});

apiRouter.post('/coupons', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const newCoupon = db.createCoupon({
    ...req.body,
    id: 'cp_' + Date.now().toString(36),
    usedCount: 0,
    isActive: true,
  });
  res.status(201).json(newCoupon);
});

apiRouter.delete('/coupons/:id', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteCoupon(req.params.id);
  res.json({ success });
});

// --- ORDERS ---
apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const { customer, delivery, items, couponCode } = req.body;
    if (!customer?.fullName || !customer?.phone || !delivery?.address || !items?.length) {
      return res.status(400).json({ error: 'Customer details, delivery address, and items are required' });
    }

    let subtotal = 0;
    for (const item of items) {
      subtotal += (item.price || 0) * (item.quantity || 1);
    }

    let discount = 0;
    if (couponCode) {
      const coupon = db.getCouponByCode(couponCode);
      if (coupon && subtotal >= coupon.minimumOrder) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
            discount = coupon.maximumDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const settings = db.getSiteSettings();
    const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    // Optional user ID from token
    let userId: string | undefined = undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userId = decoded.id;
      } catch (e) {
        // guest
      }
    }

    const orderNumber = `MM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = db.createOrder({
      id: 'ord_' + Date.now().toString(36),
      orderNumber,
      userId,
      customer,
      delivery,
      items,
      subtotal,
      discount: Math.round(discount),
      couponCode,
      deliveryFee,
      total: Math.round(total),
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
      paymentStatus: 'Unpaid',
      deliveryStatus: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Order placed successfully! Cash on delivery confirmed.',
      orderNumber: newOrder.orderNumber,
      order: newOrder,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/orders', authenticateToken, (req: AuthRequest, res: Response) => {
  if (req.user?.role === 'admin') {
    return res.json(db.getOrders());
  }
  res.json(db.getOrdersByUserId(req.user!.id));
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

apiRouter.put('/orders/:id/status', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { status, deliveryStatus, paymentStatus } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status, deliveryStatus, paymentStatus);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(updated);
});

// --- REVIEWS ---
apiRouter.get('/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  if (productId) {
    res.json(db.getReviewsByProduct(productId as string));
  } else {
    res.json(db.getReviews());
  }
});

apiRouter.post('/reviews', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { productId, productName, rating, review } = req.body;
    if (!productId || !rating || !review) {
      return res.status(400).json({ error: 'Product ID, rating and review text are required' });
    }

    const newRev = db.createReview({
      id: 'rev_' + Date.now().toString(36),
      productId,
      productName: productName || 'Multan Mart Item',
      userId: req.user!.id,
      userName: req.user!.name,
      rating: Number(rating),
      review,
      status: 'approved',
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Review submitted successfully', review: newRev });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- CONTACT INQUIRY ---
apiRouter.post('/contact', (req: Request, res: Response) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone and message are required' });
    }

    const msg = db.createContactMessage({
      id: 'msg_' + Date.now().toString(36),
      name,
      phone,
      email: email || '',
      message,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Inquiry received. Multan Mart customer team will contact you shortly.',
      id: msg.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/contact', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getContactMessages());
});

// --- STORE SETTINGS & ANALYTICS ---
apiRouter.get('/settings', (_req: Request, res: Response) => {
  res.json(db.getSiteSettings());
});

apiRouter.get('/admin/analytics', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  const orders = db.getOrders();
  const products = db.getProducts();
  const users = db.getUsers();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockProducts = products.filter((p) => p.stockStatus === 'low_stock' || p.stock < 10);

  res.json({
    totalRevenue,
    totalOrders,
    pendingOrders,
    totalProducts: products.length,
    totalCustomers: users.filter((u) => u.role === 'customer').length,
    lowStockCount: lowStockProducts.length,
    recentOrders: orders.slice(0, 5),
    lowStockProducts: lowStockProducts.slice(0, 6),
  });
});

apiRouter.get('/users', authenticateToken, requireAdmin, (_req: Request, res: Response) => {
  const safeUsers = db.getUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    addresses: u.addresses,
    createdAt: u.createdAt,
  }));
  res.json(safeUsers);
});
