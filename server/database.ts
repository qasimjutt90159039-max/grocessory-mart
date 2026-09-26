import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Product,
  Category,
  Brand,
  Coupon,
  Order,
  Review,
  ContactMessage,
  InventoryHistory,
} from './models.js';

interface DatabaseData {
  users: User[];
  products: Product[];
  categories: Category[];
  brands: Brand[];
  coupons: Coupon[];
  orders: Order[];
  reviews: Review[];
  contactMessages: ContactMessage[];
  inventoryHistory: InventoryHistory[];
  siteSettings: {
    businessName: string;
    category: string;
    phone: string;
    address: string;
    currency: string;
    announcement: string;
    freeDeliveryThreshold: number;
    standardDeliveryFee: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class DatabaseStore {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadData();
    this.ensureInitialData();
  }

  private loadData(): DatabaseData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.siteSettings?.businessName === 'Multan Mart' && parsed.products?.length >= 35) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading database file, resetting to fresh Multan Mart store data', e);
    }

    return {
      users: [],
      products: [],
      categories: [],
      brands: [],
      coupons: [],
      orders: [],
      reviews: [],
      contactMessages: [],
      inventoryHistory: [],
      siteSettings: {
        businessName: 'Multan Mart',
        category: 'Grocery Store / General Store / Daily Essentials',
        phone: '+92 303 0034443',
        address: 'A 31, Commercial Market, Thana Chowk, A Block, Shah Rukn E Alam Housing Scheme, Multan, Punjab, Pakistan',
        currency: 'PKR',
        announcement: 'Fresh Groceries & Everyday Essentials • Fast Local Delivery Across Multan',
        freeDeliveryThreshold: 2500,
        standardDeliveryFee: 150,
      },
    };
  }

  public save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error persisting database:', e);
    }
  }

  private ensureInitialData(): void {
    // 1. Seed Users
    if (this.data.users.length === 0) {
      const adminSalt = bcrypt.genSaltSync(10);
      const adminHash = bcrypt.hashSync('admin12345', adminSalt);
      const custHash = bcrypt.hashSync('customer12345', adminSalt);

      this.data.users = [
        {
          id: 'usr_admin_01',
          name: 'Store Manager',
          email: 'admin@multanmart.com',
          phone: '+92 303 0034443',
          passwordHash: adminHash,
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'usr_cust_01',
          name: 'Muhammad Usman',
          email: 'customer@test.com',
          phone: '+92 300 7865432',
          passwordHash: custHash,
          role: 'customer',
          addresses: [
            {
              id: 'addr_01',
              title: 'Home',
              street: 'House #12, Street 4, New Multan Colony',
              area: 'Shah Rukn E Alam Housing Scheme',
              city: 'Multan',
              postalCode: '60000',
              isDefault: true,
            },
            {
              id: 'addr_02',
              title: 'Office',
              street: 'Shop #8, Main Commercial Market, Thana Chowk',
              area: 'Shah Rukn E Alam Colony',
              city: 'Multan',
              postalCode: '60000',
              isDefault: false,
            },
          ],
          createdAt: new Date().toISOString(),
        },
      ];
    }

    // 2. Seed Categories
    this.data.categories = [
      {
        id: 'cat_grocery',
        slug: 'grocery',
        name: 'Grocery & Staples',
        description: 'Premium basmati rice, fine wheat atta flour, aromatic spices, pure cooking oils, daal pulses, and seasonings.',
        productCount: 12,
        iconName: 'ShoppingBag',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        subcategories: ['Rice', 'Flour', 'Pulses', 'Sugar & Salt', 'Spices', 'Oil & Ghee'],
      },
      {
        id: 'cat_beverages',
        slug: 'beverages',
        name: 'Beverages & Drinks',
        description: 'Authentic black tea blends, aromatic green tea, rich coffee, pure fruit juices, and chilled mineral water.',
        productCount: 8,
        iconName: 'Coffee',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
        subcategories: ['Tea', 'Coffee', 'Juices', 'Soft Drinks', 'Mineral Water'],
      },
      {
        id: 'cat_dairy_breakfast',
        slug: 'dairy-breakfast',
        name: 'Dairy & Breakfast',
        description: 'Fresh farm eggs, pure whole milk, butter, gourmet cheese, breakfast spreads, jams, and natural honey.',
        productCount: 8,
        iconName: 'Egg',
        image: 'https://images.unsplash.com/photo-1528732263440-4dd1a18a4cc2?auto=format&fit=crop&w=600&q=80',
        subcategories: ['Milk', 'Butter', 'Cheese', 'Eggs', 'Jam & Honey'],
      },
      {
        id: 'cat_snacks_packaged',
        slug: 'snacks-packaged',
        name: 'Snacks & Packaged Food',
        description: 'Crisp bakery biscuits, potato chips, instant cup noodles, breakfast cereals, snacks, and chocolate delights.',
        productCount: 8,
        iconName: 'Cookie',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
        subcategories: ['Biscuits', 'Chips', 'Noodles', 'Cereals', 'Chocolates'],
      },
      {
        id: 'cat_household',
        slug: 'household',
        name: 'Household Essentials',
        description: 'High-efficiency laundry detergents, antibacterial dishwashing gels, disinfectant cleaners, and facial tissues.',
        productCount: 8,
        iconName: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
        subcategories: ['Detergents', 'Cleaners', 'Dishwash', 'Paper & Tissues', 'Insect Control'],
      },
      {
        id: 'cat_personal_care',
        slug: 'personal-care',
        name: 'Personal Care',
        description: 'Gentle beauty soaps, botanical shampoos, whitening toothpaste, soft lotions, and grooming essentials.',
        productCount: 6,
        iconName: 'HeartHandshake',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        subcategories: ['Soaps', 'Shampoos', 'Oral Care', 'Skin Care', 'Hair Care'],
      },
      {
        id: 'cat_baby_care',
        slug: 'baby-care',
        name: 'Baby Care',
        description: 'Ultra-absorbent baby diapers, dermatologically tested sensitive baby wipes, and nutritious baby cereals.',
        productCount: 4,
        iconName: 'Baby',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
        subcategories: ['Baby Food', 'Diapers', 'Wipes'],
      },
    ];

    // 3. Seed Brands
    this.data.brands = [
      { id: 'b_guard', name: 'Guard', slug: 'guard', productCount: 4 },
      { id: 'b_dalda', name: 'Dalda', slug: 'dalda', productCount: 4 },
      { id: 'b_national', name: 'National Foods', slug: 'national-foods', productCount: 6 },
      { id: 'b_shan', name: 'Shan', slug: 'shan', productCount: 5 },
      { id: 'b_olpers', name: "Olper's", slug: 'olpers', productCount: 4 },
      { id: 'b_nestle', name: 'Nestlé', slug: 'nestle', productCount: 5 },
      { id: 'b_tapal', name: 'Tapal', slug: 'tapal', productCount: 3 },
      { id: 'b_lipton', name: 'Lipton', slug: 'lipton', productCount: 2 },
      { id: 'b_surf', name: 'Surf Excel', slug: 'surf-excel', productCount: 3 },
      { id: 'b_dettol', name: 'Dettol', slug: 'dettol', productCount: 3 },
      { id: 'b_pampers', name: 'Pampers', slug: 'pampers', productCount: 2 },
      { id: 'b_mitchells', name: "Mitchell's", slug: 'mitchells', productCount: 3 },
    ];

    // 4. Seed Coupons
    this.data.coupons = [
      {
        id: 'cp_welcome',
        couponCode: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrder: 1500,
        maximumDiscount: 500,
        expiryDate: '2027-12-31',
        usageLimit: 500,
        usedCount: 28,
        isActive: true,
      },
      {
        id: 'cp_multan',
        couponCode: 'MULTANFRESH',
        discountType: 'fixed',
        discountValue: 200,
        minimumOrder: 2000,
        expiryDate: '2027-12-31',
        usageLimit: 300,
        usedCount: 15,
        isActive: true,
      },
      {
        id: 'cp_super',
        couponCode: 'SUPERMART15',
        discountType: 'percentage',
        discountValue: 15,
        minimumOrder: 3000,
        maximumDiscount: 750,
        expiryDate: '2027-12-31',
        usageLimit: 200,
        usedCount: 12,
        isActive: true,
      },
    ];

    // 5. Seed Comprehensive Grocery Products (40+ real items with authentic images)
    if (this.data.products.length < 35) {
      this.data.products = [
        // --- GROCERY & STAPLES ---
        {
          id: 'prod_groc_01',
          productId: 'MM-GRC-001',
          name: 'Guard Super Kernel Basmati Rice (5kg)',
          slug: 'guard-super-kernel-basmati-rice-5kg',
          brand: 'Guard',
          category: 'grocery',
          subcategory: 'Rice',
          description: 'Finest extra-long grain aged basmati rice with distinctive floral aroma and tender pearly grains upon cooking. Sourced from the fertile Punjab plains.',
          shortDescription: 'Premium aged long-grain fragrant Basmati rice, ideal for biryani and pulao.',
          images: [
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
          ],
          price: 2150,
          salePrice: 1980,
          currency: 'PKR',
          sku: 'GRD-RIC-5KG',
          barcode: '8964000112211',
          weight: '5 kg',
          unit: 'Bag',
          ingredients: ['100% Pure Super Kernel Basmati Rice'],
          nutrition: {
            servingSize: '100g',
            calories: '356 kcal',
            protein: '7.5g',
            fat: '0.6g',
            carbs: '78g',
            sugar: '0g',
            sodium: '2mg',
          },
          storageInstructions: 'Store in a cool dry pantry away from direct moisture.',
          stock: 45,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 38,
          tags: ['rice', 'basmati', 'biryani', 'staples', 'guard'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_02',
          productId: 'MM-GRC-002',
          name: 'Sunridge Whole Wheat Chakki Atta (10kg)',
          slug: 'sunridge-whole-wheat-chakki-atta-10kg',
          brand: 'National Foods',
          category: 'grocery',
          subcategory: 'Flour',
          description: 'Stone ground whole wheat flour processed with all natural bran, germ and fiber retained. Produces soft, fluffy rotis with rich natural sweetness.',
          shortDescription: '100% pure whole wheat chakki-ground flour for nutritious soft rotis.',
          images: [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
          ],
          price: 1480,
          salePrice: 1390,
          currency: 'PKR',
          sku: 'SNR-ATT-10K',
          barcode: '8964000223322',
          weight: '10 kg',
          unit: 'Bag',
          ingredients: ['100% Whole Wheat Grain'],
          nutrition: {
            servingSize: '100g',
            calories: '340 kcal',
            protein: '12g',
            fat: '1.9g',
            carbs: '71g',
            sugar: '0.4g',
            sodium: '3mg',
          },
          storageInstructions: 'Keep in an airtight container in a cool, dry place.',
          stock: 60,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 42,
          tags: ['flour', 'atta', 'wheat', 'chakki', 'roti'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_03',
          productId: 'MM-GRC-003',
          name: 'Dalda Premium Pure Cooking Oil (5 Litre Tin)',
          slug: 'dalda-premium-pure-cooking-oil-5l-tin',
          brand: 'Dalda',
          category: 'grocery',
          subcategory: 'Oil & Ghee',
          description: 'Triple refined high-purity cooking oil enriched with Vitamins A, D, and E. Low in saturated fat, perfect for everyday home cooking and deep frying.',
          shortDescription: 'Triple-refined healthy cooking oil with Vitamins A & D in 5L tin.',
          images: [
            'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
          ],
          price: 2950,
          salePrice: 2790,
          currency: 'PKR',
          sku: 'DLD-OIL-5LT',
          barcode: '8964000334433',
          weight: '5 Litres',
          unit: 'Tin',
          ingredients: ['Refined Canola Oil', 'Soybean Oil', 'Vitamin A', 'Vitamin D3'],
          nutrition: {
            servingSize: '15ml',
            calories: '120 kcal',
            protein: '0g',
            fat: '14g',
            carbs: '0g',
            sugar: '0g',
            sodium: '0mg',
          },
          storageInstructions: 'Store at room temperature out of direct sunlight.',
          stock: 35,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 51,
          tags: ['oil', 'cooking oil', 'dalda', 'ghee', 'vitamins'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_04',
          productId: 'MM-GRC-004',
          name: 'Dalda Pure Banaspati Ghee (1kg Pouch)',
          slug: 'dalda-pure-banaspati-ghee-1kg-pouch',
          brand: 'Dalda',
          category: 'grocery',
          subcategory: 'Oil & Ghee',
          description: 'Aromatic traditional Banaspati Ghee formulated with genuine grain structure and enhanced aroma for traditional sweet halwas, parathas, and curries.',
          shortDescription: 'Classic aromatic banaspati ghee for rich parathas and sweets.',
          images: [
            'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
          ],
          price: 590,
          currency: 'PKR',
          sku: 'DLD-GHE-1KP',
          barcode: '8964000445544',
          weight: '1 kg',
          unit: 'Pouch',
          ingredients: ['Partially Hydrogenated Edible Vegetable Oils', 'Vitamin A', 'Vitamin D'],
          stock: 50,
          stockStatus: 'in_stock',
          rating: 4.7,
          reviewCount: 29,
          tags: ['ghee', 'banaspati', 'dalda', 'paratha', 'halwa'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_05',
          productId: 'MM-GRC-005',
          name: 'Premium Daal Chana Washed (1kg)',
          slug: 'premium-daal-chana-washed-1kg',
          brand: 'Guard',
          category: 'grocery',
          subcategory: 'Pulses',
          description: 'Machine cleaned and polished yellow gram split pulse (Daal Chana). Fast cooking, high in plant protein and dietary fiber.',
          shortDescription: 'Cleaned, polished golden split gram pulse high in plant protein.',
          images: [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          ],
          price: 320,
          currency: 'PKR',
          sku: 'PUL-CHN-1KG',
          barcode: '8964000556655',
          weight: '1 kg',
          unit: 'Pack',
          ingredients: ['100% Split Chickpeas'],
          nutrition: {
            servingSize: '100g',
            calories: '364 kcal',
            protein: '22g',
            fat: '5g',
            carbs: '60g',
          },
          stock: 80,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 22,
          tags: ['daal', 'pulses', 'chana', 'protein', 'grocery'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_06',
          productId: 'MM-GRC-006',
          name: 'Premium Daal Moong Washed (1kg)',
          slug: 'premium-daal-moong-washed-1kg',
          brand: 'Guard',
          category: 'grocery',
          subcategory: 'Pulses',
          description: 'Hulled yellow petite split lentils. Exceptionally gentle on digestion, quick cooking, and rich in folate and vital minerals.',
          shortDescription: 'Naturally golden petite yellow lentils for wholesome comfort soups & daals.',
          images: [
            'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
          ],
          price: 340,
          currency: 'PKR',
          sku: 'PUL-MNG-1KG',
          barcode: '8964000667766',
          weight: '1 kg',
          unit: 'Pack',
          ingredients: ['100% Yellow Split Moong Lentils'],
          stock: 65,
          stockStatus: 'in_stock',
          rating: 4.7,
          reviewCount: 19,
          tags: ['moong', 'daal', 'lentils', 'pulses'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_07',
          productId: 'MM-GRC-007',
          name: 'National Refined Crystal White Sugar (5kg)',
          slug: 'national-refined-crystal-white-sugar-5kg',
          brand: 'National Foods',
          category: 'grocery',
          subcategory: 'Sugar & Salt',
          description: 'Hygienically refined fine sucrose crystals. 100% sulfur-free, sparkling white, and fast dissolving in tea, coffee, and dessert preparations.',
          shortDescription: 'Ultra-pure sulfur-free white crystal sugar in sturdy 5kg pack.',
          images: [
            'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=800&q=80',
          ],
          price: 760,
          salePrice: 720,
          currency: 'PKR',
          sku: 'SGR-WHT-5KG',
          barcode: '8964000778877',
          weight: '5 kg',
          unit: 'Bag',
          ingredients: ['Refined Cane Sugar'],
          stock: 90,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 34,
          tags: ['sugar', 'sweets', 'tea', 'baking', 'staple'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_08',
          productId: 'MM-GRC-008',
          name: 'National Pure Himalayan Pink Salt (800g Standup Pouch)',
          slug: 'national-pure-himalayan-pink-salt-800g',
          brand: 'National Foods',
          category: 'grocery',
          subcategory: 'Sugar & Salt',
          description: 'Natural mineral-rich pink rock salt sourced straight from the pristine Khewra salt range. Packed with 84 essential trace minerals.',
          shortDescription: 'Mineral-rich unrefined Khewra pink rock salt in zip pouch.',
          images: [
            'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
          ],
          price: 130,
          currency: 'PKR',
          sku: 'SLT-HIM-800',
          barcode: '8964000889988',
          weight: '800 g',
          unit: 'Pouch',
          ingredients: ['100% Natural Himalayan Pink Rock Salt'],
          stock: 120,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 28,
          tags: ['salt', 'pink salt', 'himalayan', 'minerals', 'khewra'],
          isFeatured: false,
          isNew: true,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_09',
          productId: 'MM-GRC-009',
          name: 'Shan Bombay Biryani Recipe Masala (50g x 2 Pack)',
          slug: 'shan-bombay-biryani-recipe-masala-pack-of-2',
          brand: 'Shan',
          category: 'grocery',
          subcategory: 'Spices',
          description: 'Aromatic spice blend crafted for rich, spicy Bombay-style layered chicken or beef biryani with dried plums and fragrant whole spices.',
          shortDescription: 'Iconic master blend of spices and dried plums for rich biryani.',
          images: [
            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
          ],
          price: 240,
          currency: 'PKR',
          sku: 'SHN-BRY-100',
          barcode: '8964000990099',
          weight: '100 g',
          unit: 'Box',
          ingredients: ['Red Chilli', 'Dried Plums', 'Coriander', 'Cinnamon', 'Cardamom', 'Clove', 'Salt', 'Garlic'],
          stock: 85,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 47,
          tags: ['shan', 'biryani', 'masala', 'spices'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_10',
          productId: 'MM-GRC-010',
          name: 'National Pure Red Chilli Powder (200g Jar)',
          slug: 'national-pure-red-chilli-powder-200g-jar',
          brand: 'National Foods',
          category: 'grocery',
          subcategory: 'Spices',
          description: 'Sun-dried premium red chillies stone ground to perfection. Imparts a bright fiery crimson color and balanced authentic pungency to curries.',
          shortDescription: 'Naturally fiery red chilli powder in airtight reusable shaker jar.',
          images: [
            'https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=800&q=80',
          ],
          price: 260,
          currency: 'PKR',
          sku: 'NAT-CHI-200',
          barcode: '8964001001100',
          weight: '200 g',
          unit: 'Jar',
          ingredients: ['100% Ground Red Chillies'],
          stock: 70,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 31,
          tags: ['chilli', 'spices', 'national', 'cooking'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_11',
          productId: 'MM-GRC-011',
          name: 'National Pure Turmeric Powder / Haldi (200g)',
          slug: 'national-pure-turmeric-powder-haldi-200g',
          brand: 'National Foods',
          category: 'grocery',
          subcategory: 'Spices',
          description: 'High-curcumin golden turmeric root powder with vibrant natural yellow tint and deep earthy aromatic profile. Certified additive-free.',
          shortDescription: 'Pure golden turmeric powder with high natural curcumin content.',
          images: [
            'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
          ],
          price: 210,
          currency: 'PKR',
          sku: 'NAT-HLD-200',
          barcode: '8964001112211',
          weight: '200 g',
          unit: 'Pouch',
          ingredients: ['100% Pure Curcuma Longa Powder'],
          stock: 65,
          stockStatus: 'in_stock',
          rating: 4.7,
          reviewCount: 24,
          tags: ['turmeric', 'haldi', 'curcumin', 'spices'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_groc_12',
          productId: 'MM-GRC-012',
          name: 'Daal Masoor Washed Red Split Lentils (1kg)',
          slug: 'daal-masoor-washed-red-split-lentils-1kg',
          brand: 'Guard',
          category: 'grocery',
          subcategory: 'Pulses',
          description: 'Tender red split masoor lentils that break down effortlessly into creamy, comforting tadka daal. Ready in under 20 minutes.',
          shortDescription: 'Quick-cooking split red masoor lentils rich in iron and protein.',
          images: [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          ],
          price: 360,
          currency: 'PKR',
          sku: 'PUL-MSR-1KG',
          barcode: '8964001223322',
          weight: '1 kg',
          unit: 'Pack',
          ingredients: ['100% Red Split Lentils'],
          stock: 55,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 16,
          tags: ['masoor', 'daal', 'lentils', 'staples'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // --- BEVERAGES & DRINKS ---
        {
          id: 'prod_bev_01',
          productId: 'MM-BEV-001',
          name: 'Tapal Danedar Black Tea (950g Economy Pack)',
          slug: 'tapal-danedar-black-tea-950g',
          brand: 'Tapal',
          category: 'beverages',
          subcategory: 'Tea',
          description: 'Distinctive granulated tea blend offering an irresistible brisk aroma, deep golden liquor, and signature robust flavour loved across Pakistan.',
          shortDescription: 'Signature granulated black tea blend for rich karak chai.',
          images: [
            'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
          ],
          price: 1550,
          salePrice: 1440,
          currency: 'PKR',
          sku: 'TPL-DAN-950',
          barcode: '8964002001100',
          weight: '950 g',
          unit: 'Pouch',
          ingredients: ['100% Kenyan and East African Black Tea Leaves'],
          stock: 60,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 65,
          tags: ['tea', 'tapal', 'chai', 'danedar', 'karak'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_bev_02',
          productId: 'MM-BEV-002',
          name: 'Lipton Yellow Label Black Tea Bags (100 Foil Envelopes)',
          slug: 'lipton-yellow-label-black-tea-bags-100',
          brand: 'Lipton',
          category: 'beverages',
          subcategory: 'Tea',
          description: 'Carefully picked tea leaves sun-ripened and sealed in individual foil envelopes to preserve uplifting freshness and aromatic tea essence.',
          shortDescription: '100 individually wrapped foil envelopes for brisk morning tea.',
          images: [
            'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80',
          ],
          price: 880,
          currency: 'PKR',
          sku: 'LIP-YLW-100',
          barcode: '8964002112211',
          weight: '200 g',
          unit: 'Box',
          ingredients: ['Selected Black Tea Leaves'],
          stock: 40,
          stockStatus: 'in_stock',
          rating: 4.7,
          reviewCount: 33,
          tags: ['lipton', 'tea bags', 'black tea'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_bev_03',
          productId: 'MM-BEV-003',
          name: 'Nescafé Classic Instant Coffee Glass Jar (100g)',
          slug: 'nescafe-classic-instant-coffee-100g-jar',
          brand: 'Nestlé',
          category: 'beverages',
          subcategory: 'Coffee',
          description: '100% pure natural coffee beans roasted to perfection to deliver unmistakable aroma and unmistakable bold, smooth taste with every spoonful.',
          shortDescription: 'Medium-dark roast instant coffee granules in glass jar.',
          images: [
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
          ],
          price: 920,
          salePrice: 850,
          currency: 'PKR',
          sku: 'NES-CLS-100',
          barcode: '8964002223322',
          weight: '100 g',
          unit: 'Jar',
          ingredients: ['100% Pure Coffee Beans'],
          stock: 35,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 29,
          tags: ['coffee', 'nescafe', 'instant coffee', 'caffeine'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_bev_04',
          productId: 'MM-BEV-004',
          name: "Nestlé Fruita Vitals Chaunsa Mango Nectar (1 Litre)",
          slug: 'nestle-fruita-vitals-chaunsa-mango-nectar-1l',
          brand: 'Nestlé',
          category: 'beverages',
          subcategory: 'Juices',
          description: 'Crafted with ripe, fragrant Multani Chaunsa mangoes delivering authentic summer sweetness and rich velvety pulpy texture in every sip.',
          shortDescription: 'Rich Multani Chaunsa mango nectar with real fruit pulp in 1L Tetra Pak.',
          images: [
            'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
          ],
          price: 295,
          currency: 'PKR',
          sku: 'NST-MNG-1LT',
          barcode: '8964002334433',
          weight: '1 Litre',
          unit: 'Tetra Pak',
          ingredients: ['Chaunsa Mango Pulp', 'Purified Water', 'Sugar', 'Citric Acid', 'Vitamin C'],
          stock: 50,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 42,
          tags: ['juice', 'mango', 'chaunsa', 'multan', 'nestle'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_bev_05',
          productId: 'MM-BEV-005',
          name: "Nestlé Pure Life Natural Mineral Water (1.5 Litre x 6 Bottles Case)",
          slug: 'nestle-pure-life-mineral-water-1-5l-case-of-6',
          brand: 'Nestlé',
          category: 'beverages',
          subcategory: 'Mineral Water',
          description: 'Multi-stage filtered pure drinking water balanced with essential minerals for optimal hydration, crisp clean taste, and peace of mind.',
          shortDescription: 'Case of 6 x 1.5L bottles of crisp, certified mineral water.',
          images: [
            'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
          ],
          price: 540,
          currency: 'PKR',
          sku: 'NST-WTR-6PK',
          barcode: '8964002445544',
          weight: '9 kg (6x 1.5L)',
          unit: 'Case',
          ingredients: ['Purified Water', 'Calcium Chloride', 'Magnesium Sulfate', 'Sodium Bicarbonate'],
          stock: 45,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 30,
          tags: ['water', 'mineral water', 'nestle', 'hydration'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_bev_06',
          productId: 'MM-BEV-006',
          name: 'Tapal Green Tea Jasmine Blossom (30 Tea Bags)',
          slug: 'tapal-green-tea-jasmine-blossom-30-bags',
          brand: 'Tapal',
          category: 'beverages',
          subcategory: 'Tea',
          description: 'Light, soothing whole leaf green tea infused with natural fragrant jasmine blossom aroma. Rich in beneficial catechins and antioxidants.',
          shortDescription: 'Antioxidant-rich soothing green tea with delicate jasmine florals.',
          images: [
            'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80',
          ],
          price: 360,
          currency: 'PKR',
          sku: 'TPL-GRN-30B',
          barcode: '8964002556655',
          weight: '50 g',
          unit: 'Box',
          ingredients: ['Green Tea Leaves', 'Natural Jasmine Flavouring'],
          stock: 30,
          stockStatus: 'in_stock',
          rating: 4.7,
          reviewCount: 18,
          tags: ['green tea', 'tapal', 'detox', 'antioxidant', 'jasmine'],
          isFeatured: false,
          isNew: true,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_bev_07',
          productId: 'MM-BEV-007',
          name: 'Pakola Ice Cream Soda (1.5 Litre Bottle)',
          slug: 'pakola-ice-cream-soda-1-5l',
          brand: 'Mitchell\'s',
          category: 'beverages',
          subcategory: 'Soft Drinks',
          description: 'The nostalgic, vibrant emerald green ice cream soda with creamy vanilla notes. Pakistan’s iconic carbonated soft drink refreshingly served chilled.',
          shortDescription: 'The national emerald soda with beloved creamy vanilla essence.',
          images: [
            'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
          ],
          price: 160,
          currency: 'PKR',
          sku: 'PKL-SDA-15L',
          barcode: '8964002667766',
          weight: '1.5 Litres',
          unit: 'Bottle',
          ingredients: ['Carbonated Water', 'Sugar', 'Citric Acid', 'Flavouring', 'Permitted Colours'],
          stock: 40,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 27,
          tags: ['pakola', 'soda', 'cold drink', 'soft drinks'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // --- DAIRY & BREAKFAST ---
        {
          id: 'prod_dry_01',
          productId: 'MM-DRY-001',
          name: "Olper's UHT Pure Full Cream Milk (1 Litre x 12 Pack Carton)",
          slug: 'olpers-uht-pure-full-cream-milk-1l-carton-12',
          brand: "Olper's",
          category: 'dairy-breakfast',
          subcategory: 'Milk',
          description: '100% pure preservative-free homogenized full cream milk packed through 7-layer sterile aseptic cartons. Naturally rich in calcium, protein, and creamy goodness.',
          shortDescription: 'Full cream UHT homogenized milk carton (12 x 1 Litre).',
          images: [
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1528732263440-4dd1a18a4cc2?auto=format&fit=crop&w=800&q=80',
          ],
          price: 3350,
          salePrice: 3180,
          currency: 'PKR',
          sku: 'OLP-MLK-12C',
          barcode: '8964003001100',
          weight: '12 Litres',
          unit: 'Carton',
          ingredients: ['100% Pure Fresh Cow and Buffalo Milk', 'Calcium', 'Vitamins'],
          nutrition: {
            servingSize: '250ml',
            calories: '150 kcal',
            protein: '8g',
            fat: '8.5g',
            carbs: '12g',
          },
          stock: 30,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 58,
          tags: ['milk', 'olpers', 'dairy', 'breakfast', 'full cream'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_dry_02',
          productId: 'MM-DRY-002',
          name: "Olper's UHT Pure Full Cream Milk Single (1 Litre)",
          slug: 'olpers-uht-pure-full-cream-milk-1l-single',
          brand: "Olper's",
          category: 'dairy-breakfast',
          subcategory: 'Milk',
          description: 'Daily single 1 Litre Tetra Pak of rich, preservative-free full cream milk for tea, cereal, or drinking chilled.',
          shortDescription: 'Single 1 Litre pack of creamy, farm-fresh UHT milk.',
          images: [
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
          ],
          price: 285,
          currency: 'PKR',
          sku: 'OLP-MLK-1LT',
          barcode: '8964003112211',
          weight: '1 Litre',
          unit: 'Tetra Pak',
          ingredients: ['100% Pure Fresh Milk'],
          stock: 75,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 40,
          tags: ['milk', 'olpers', 'dairy'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_dry_03',
          productId: 'MM-DRY-003',
          name: 'Farm Fresh Golden Yolks Brown Eggs (Crate of 30)',
          slug: 'farm-fresh-golden-yolks-brown-eggs-30-crate',
          brand: 'Guard',
          category: 'dairy-breakfast',
          subcategory: 'Eggs',
          description: 'Nutritious farm fresh graded large brown eggs with rich golden yolks. Carefully inspected and hygienically packed in protective shock-absorbing trays.',
          shortDescription: 'Tray of 30 large fresh brown eggs packed with high-grade protein.',
          images: [
            'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
          ],
          price: 880,
          salePrice: 820,
          currency: 'PKR',
          sku: 'FRM-EGG-30T',
          barcode: '8964003223322',
          weight: '30 Eggs',
          unit: 'Tray',
          ingredients: ['Grade A Fresh Hen Eggs'],
          stock: 40,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 36,
          tags: ['eggs', 'breakfast', 'protein', 'fresh', 'farm'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_dry_04',
          productId: 'MM-DRY-004',
          name: "Lurpak Salted Premium Butter Block (200g)",
          slug: 'lurpak-salted-premium-butter-block-200g',
          brand: 'National Foods',
          category: 'dairy-breakfast',
          subcategory: 'Butter',
          description: 'Legendary churned lactic butter crafted from pure fresh cream. Melts decadently over warm crusty toast and delivers golden richness to gourmet baking.',
          shortDescription: 'Pure cultured cream butter block for gourmet toast and baking.',
          images: [
            'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
          ],
          price: 780,
          currency: 'PKR',
          sku: 'LUR-BTR-200',
          barcode: '8964003334433',
          weight: '200 g',
          unit: 'Block',
          ingredients: ['Butter (Milk)', 'Lactic Culture', 'Salt (1.2%)'],
          stock: 25,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 21,
          tags: ['butter', 'lurpak', 'breakfast', 'baking', 'dairy'],
          isFeatured: false,
          isNew: true,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_dry_05',
          productId: 'MM-DRY-005',
          name: "Mitchell's Golden Apple Jam (450g Glass Jar)",
          slug: 'mitchells-golden-apple-jam-450g',
          brand: "Mitchell's",
          category: 'dairy-breakfast',
          subcategory: 'Jam & Honey',
          description: 'Simmered with ripe orchard-grown apples to create a glossy, aromatic golden breakfast jam bursting with natural fruit pectin and sweet tartness.',
          shortDescription: 'Real orchard apple breakfast spread in classic 450g jar.',
          images: [
            'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
          ],
          price: 360,
          currency: 'PKR',
          sku: 'MTC-JAM-450',
          barcode: '8964003445544',
          weight: '450 g',
          unit: 'Jar',
          ingredients: ['Apples', 'Sugar', 'Pectin', 'Citric Acid'],
          stock: 35,
          stockStatus: 'in_stock',
          rating: 4.7,
          reviewCount: 15,
          tags: ['jam', 'mitchells', 'breakfast', 'apple'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_dry_06',
          productId: 'MM-DRY-006',
          name: 'Natural Sidr Wildflower Honey (500g Glass Jar)',
          slug: 'natural-sidr-wildflower-honey-500g',
          brand: 'National Foods',
          category: 'dairy-breakfast',
          subcategory: 'Jam & Honey',
          description: 'Pure, unpasteurized wild Sidr blossom honey with deep amber hue, velvety thick texture, and antibacterial wellness properties.',
          shortDescription: '100% pure raw unpasteurized wild Sidr blossom honey.',
          images: [
            'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
          ],
          price: 1150,
          salePrice: 990,
          currency: 'PKR',
          sku: 'HNY-SDR-500',
          barcode: '8964003556655',
          weight: '500 g',
          unit: 'Jar',
          ingredients: ['100% Pure Raw Honey'],
          stock: 20,
          stockStatus: 'in_stock',
          rating: 5.0,
          reviewCount: 33,
          tags: ['honey', 'sidr', 'natural', 'immunity', 'organic'],
          isFeatured: true,
          isNew: true,
          isBestSeller: false,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // --- SNACKS & PACKAGED FOOD ---
        {
          id: 'prod_snk_01',
          productId: 'MM-SNK-001',
          name: 'LU Wheatable Whole Wheat Biscuits (Pack of 6 Rolls)',
          slug: 'lu-wheatable-whole-wheat-biscuits-6-pack',
          brand: 'National Foods',
          category: 'snacks-packaged',
          subcategory: 'Biscuits',
          description: 'Crunchy high-fiber biscuits baked with hearty wheat bran. The ideal light tea-time snack providing long-lasting fullness without heaviness.',
          shortDescription: 'Multi-pack of 6 high-fiber digestive whole wheat biscuit rolls.',
          images: [
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
          ],
          price: 360,
          currency: 'PKR',
          sku: 'LU-WHT-6PK',
          barcode: '8964004001100',
          weight: '450 g',
          unit: 'Pack',
          ingredients: ['Wheat Flour', 'Wheat Bran', 'Vegetable Fat', 'Sugar', 'Malt Extract'],
          stock: 50,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 25,
          tags: ['biscuits', 'wheatable', 'chai', 'snacks'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_snk_02',
          productId: 'MM-SNK-002',
          name: "Lay's French Cheese Flavoured Potato Chips Family Pack (90g)",
          slug: 'lays-french-cheese-potato-chips-family-pack',
          brand: 'National Foods',
          category: 'snacks-packaged',
          subcategory: 'Chips',
          description: 'Thinly sliced farm-grown golden potatoes crisped to perfection and seasoned with rich, savory French cheddar cheese seasoning.',
          shortDescription: 'Savory French cheese flavoured crispy potato chips in family size pack.',
          images: [
            'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
          ],
          price: 150,
          currency: 'PKR',
          sku: 'LYS-FCH-90G',
          barcode: '8964004112211',
          weight: '90 g',
          unit: 'Pack',
          ingredients: ['Selected Potatoes', 'Palm Olein', 'French Cheese Seasoning', 'Milk Solids'],
          stock: 70,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 44,
          tags: ['chips', 'lays', 'snacks', 'potato chips', 'cheese'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_snk_03',
          productId: 'MM-SNK-003',
          name: 'Knorr Chatpatta Instant Noodles Family Pack (6 x 66g)',
          slug: 'knorr-chatpatta-instant-noodles-family-pack-6',
          brand: 'National Foods',
          category: 'snacks-packaged',
          subcategory: 'Noodles',
          description: 'Fast, mouthwatering instant noodles infused with tangy tamarind, zesty spices, and chilli kick. Ready in 2 quick minutes.',
          shortDescription: '6-pack of tangy Chatpatta flavour quick-cooking instant noodles.',
          images: [
            'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
          ],
          price: 330,
          currency: 'PKR',
          sku: 'KNR-CHT-6PK',
          barcode: '8964004223322',
          weight: '396 g',
          unit: 'Pack',
          ingredients: ['Wheat Flour', 'Palm Oil', 'Chatpatta Taste Maker Spices', 'Salt'],
          stock: 60,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 39,
          tags: ['noodles', 'knorr', 'chatpatta', 'quick meal'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_snk_04',
          productId: 'MM-SNK-004',
          name: 'Cadbury Dairy Milk Silk Chocolate Bar (150g)',
          slug: 'cadbury-dairy-milk-silk-chocolate-bar-150g',
          brand: 'National Foods',
          category: 'snacks-packaged',
          subcategory: 'Chocolates',
          description: 'Irresistibly silky, melt-in-your-mouth milk chocolate crafted with a glass and a half of pure dairy milk and smooth cocoa butter.',
          shortDescription: 'Rich and velvety melt-in-the-mouth premium milk chocolate.',
          images: [
            'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
          ],
          price: 490,
          salePrice: 440,
          currency: 'PKR',
          sku: 'CDB-SLK-150',
          barcode: '8964004334433',
          weight: '150 g',
          unit: 'Bar',
          ingredients: ['Milk Solids', 'Sugar', 'Cocoa Butter', 'Cocoa Solids'],
          stock: 40,
          stockStatus: 'in_stock',
          rating: 5.0,
          reviewCount: 52,
          tags: ['chocolate', 'cadbury', 'silk', 'sweets', 'dessert'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // --- HOUSEHOLD ESSENTIALS ---
        {
          id: 'prod_hsh_01',
          productId: 'MM-HSH-001',
          name: 'Surf Excel Easy Wash Detergent Powder (3kg Bag)',
          slug: 'surf-excel-easy-wash-detergent-powder-3kg',
          brand: 'Surf Excel',
          category: 'household',
          subcategory: 'Detergents',
          description: 'Advanced stain-removing power with engineered active enzyme granules that target tough oil, grease, tea, and mud stains in just 1 wash.',
          shortDescription: 'Tough stain removing laundry detergent powder with fresh floral scent.',
          images: [
            'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
          ],
          price: 1390,
          salePrice: 1280,
          currency: 'PKR',
          sku: 'SRF-EZW-3KG',
          barcode: '8964005001100',
          weight: '3 kg',
          unit: 'Bag',
          ingredients: ['Anionic Surfactants', 'Enzymes', 'Optical Brighteners', 'Perfume'],
          stock: 40,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 46,
          tags: ['surf excel', 'detergent', 'laundry', 'cleaner'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_hsh_02',
          productId: 'MM-HSH-002',
          name: 'Vim Lemon Dishwash Gel Concentrate with Degreaser (1 Litre Bottle)',
          slug: 'vim-lemon-dishwash-gel-concentrate-1l',
          brand: 'Surf Excel',
          category: 'household',
          subcategory: 'Dishwash',
          description: 'Harnesses real lemon power to cut through oily grease, ghee residue, and burnt crusts on stainless steel pots and glass without scratching.',
          shortDescription: 'Heavy-duty degreasing dishwash gel with uplifting lemon freshness.',
          images: [
            'https://images.unsplash.com/photo-1585670270608-b424214c721f?auto=format&fit=crop&w=800&q=80',
          ],
          price: 490,
          currency: 'PKR',
          sku: 'VIM-LMN-1LT',
          barcode: '8964005112211',
          weight: '1 Litre',
          unit: 'Bottle',
          ingredients: ['Anionic Surfactants', 'Real Lemon Extract', 'Water Softeners'],
          stock: 55,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 33,
          tags: ['dishwash', 'vim', 'kitchen', 'cleaning'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_hsh_03',
          productId: 'MM-HSH-003',
          name: 'Dettol Disinfectant Multi-Surface Floor Cleaner Citrus (1.5 Litre)',
          slug: 'dettol-disinfectant-floor-cleaner-citrus-1-5l',
          brand: 'Dettol',
          category: 'household',
          subcategory: 'Cleaners',
          description: 'Kills 99.9% of bacteria and household germs while eliminating tough stains, grime, and footprints across tile, marble, and hardwood floors.',
          shortDescription: '99.9% germ protection citrus liquid floor cleaner in 1.5L jug.',
          images: [
            'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=800&q=80',
          ],
          price: 790,
          salePrice: 720,
          currency: 'PKR',
          sku: 'DTL-FLR-15L',
          barcode: '8964005223322',
          weight: '1.5 Litres',
          unit: 'Bottle',
          ingredients: ['Benzalkonium Chloride', 'Non-ionic Surfactants', 'Citrus Fragrance'],
          stock: 45,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 38,
          tags: ['dettol', 'cleaner', 'disinfectant', 'floor cleaner'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_hsh_04',
          productId: 'MM-HSH-004',
          name: 'Rose Petal Maxob Extra Soft Facial Tissues (Pack of 4 Boxes)',
          slug: 'rose-petal-maxob-extra-soft-facial-tissues-4-pack',
          brand: 'National Foods',
          category: 'household',
          subcategory: 'Paper & Tissues',
          description: 'Velvety 2-ply 100% virgin pulp facial tissues. Hypoallergenic, ultra-absorbent, and soothingly gentle on delicate skin and allergies.',
          shortDescription: 'Bundle of 4 premium 2-ply soft facial tissue pop-up boxes.',
          images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
          ],
          price: 680,
          currency: 'PKR',
          sku: 'RSP-TIS-4BX',
          barcode: '8964005334433',
          weight: '4 x 150 Sheets',
          unit: 'Pack',
          ingredients: ['100% Virgin Wood Pulp'],
          stock: 50,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 22,
          tags: ['tissues', 'rose petal', 'household', 'hygiene'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // --- PERSONAL CARE ---
        {
          id: 'prod_prs_01',
          productId: 'MM-PRS-001',
          name: 'Dettol Original Germ Protection Bar Soap (135g x 3 Family Pack)',
          slug: 'dettol-original-germ-protection-soap-3-pack',
          brand: 'Dettol',
          category: 'personal-care',
          subcategory: 'Soaps',
          description: 'Clinically proven pine fragrance soap that provides 100% better protection against everyday disease-causing germs and body odor.',
          shortDescription: 'Classic antibacterial pine formula family bar soap (3 x 135g).',
          images: [
            'https://images.unsplash.com/photo-1607006314633-8a9d16a5b6b1?auto=format&fit=crop&w=800&q=80',
          ],
          price: 480,
          currency: 'PKR',
          sku: 'DTL-SOP-3PK',
          barcode: '8964006001100',
          weight: '405 g (3x 135g)',
          unit: 'Pack',
          ingredients: ['Sodium Palmate', 'Chloroxylenol (PCMX)', 'Pine Oil Fragrance'],
          stock: 65,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 37,
          tags: ['dettol', 'soap', 'germ protection', 'hygiene'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_prs_02',
          productId: 'MM-PRS-002',
          name: 'Sunsilk Black Shine Shampoo with Amla Pearl Complex (370ml)',
          slug: 'sunsilk-black-shine-shampoo-370ml',
          brand: 'National Foods',
          category: 'personal-care',
          subcategory: 'Shampoos',
          description: 'Co-created with hair specialists, enriched with Amla and pearl complex to nourish locks from root to tip for lasting radiant black shine.',
          shortDescription: 'Deep nourishing shampoo for healthy, lustrous black hair.',
          images: [
            'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
          ],
          price: 640,
          currency: 'PKR',
          sku: 'SNS-BLK-370',
          barcode: '8964006112211',
          weight: '370 ml',
          unit: 'Bottle',
          ingredients: ['Sodium Laureth Sulfate', 'Amla Fruit Extract', 'Pearl Powder', 'Fragrance'],
          stock: 45,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 29,
          tags: ['shampoo', 'sunsilk', 'hair care', 'shine'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_prs_03',
          productId: 'MM-PRS-003',
          name: 'Colgate Total 12 Pro Gum Health Toothpaste (140g)',
          slug: 'colgate-total-12-pro-gum-health-toothpaste-140g',
          brand: 'National Foods',
          category: 'personal-care',
          subcategory: 'Oral Care',
          description: 'Pro-active dual-zinc and arginine formula that defends against plaque, tartar, cavities, bad breath, and sensitive gums for 12 hours non-stop.',
          shortDescription: '12-hour antibacterial whole mouth defense toothpaste.',
          images: [
            'https://images.unsplash.com/photo-1559591937-e1032b4f9814?auto=format&fit=crop&w=800&q=80',
          ],
          price: 360,
          currency: 'PKR',
          sku: 'CLG-TOT-140',
          barcode: '8964006223322',
          weight: '140 g',
          unit: 'Tube',
          ingredients: ['Sodium Fluoride', 'Zinc Oxide', 'Hydrated Silica', 'Fresh Mint'],
          stock: 55,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 31,
          tags: ['toothpaste', 'colgate', 'oral care', 'mint'],
          isFeatured: false,
          isNew: true,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },

        // --- BABY CARE ---
        {
          id: 'prod_bby_01',
          productId: 'MM-BBY-001',
          name: 'Pampers Baby-Dry Pants Diapers Size 4 Maxi (52 Diaper Jumbo Pack)',
          slug: 'pampers-baby-dry-pants-size-4-52-jumbo-pack',
          brand: 'Pampers',
          category: 'baby-care',
          subcategory: 'Diapers',
          description: '360-degree stretch waistband with 3 absorbing channels that lock wetness away for up to 12 hours of uninterrupted peaceful sleep and active play.',
          shortDescription: '12-hour leakage defense pull-up diaper pants for 9-14 kg babies.',
          images: [
            'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
          ],
          price: 2650,
          salePrice: 2480,
          currency: 'PKR',
          sku: 'PMP-BDP-SZ4',
          barcode: '8964007001100',
          weight: '52 Diapers',
          unit: 'Jumbo Pack',
          ingredients: ['Super Absorbent Polymer', 'Cellulose Pulp', 'Polypropylene Topsheet'],
          stock: 30,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 45,
          tags: ['pampers', 'diapers', 'baby care', 'baby dry'],
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isDeal: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_bby_02',
          productId: 'MM-BBY-002',
          name: 'Pampers Sensitive Fragrance-Free Baby Wipes (64 Wipes Pack)',
          slug: 'pampers-sensitive-fragrance-free-baby-wipes-64',
          brand: 'Pampers',
          category: 'baby-care',
          subcategory: 'Wipes',
          description: 'Dermatologically tested soft wipes made with 99% pure water and pH-balancing formula to protect delicate newborn skin against diaper rash.',
          shortDescription: 'Gentle pH-balanced pure water baby wipes for delicate sensitive skin.',
          images: [
            'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          ],
          price: 490,
          currency: 'PKR',
          sku: 'PMP-WIP-64P',
          barcode: '8964007112211',
          weight: '64 Wipes',
          unit: 'Pack',
          ingredients: ['99% Purified Water', 'Citric Acid', 'Aloe Vera Leaf Extract'],
          stock: 50,
          stockStatus: 'in_stock',
          rating: 4.9,
          reviewCount: 26,
          tags: ['wipes', 'pampers', 'baby care', 'sensitive'],
          isFeatured: false,
          isNew: false,
          isBestSeller: true,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prod_bby_03',
          productId: 'MM-BBY-003',
          name: 'Nestlé Cerelac Wheat & 3 Fruits Baby Cereal (175g Bib)',
          slug: 'nestle-cerelac-wheat-3-fruits-baby-cereal-175g',
          brand: 'Nestlé',
          category: 'baby-care',
          subcategory: 'Baby Food',
          description: 'Fortified complementary infant cereal with iron, zinc, calcium, vitamin C and Bifidus BL probiotics for healthy growth and cognitive development.',
          shortDescription: 'Iron-fortified wholesome baby cereal with apple, banana & orange.',
          images: [
            'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=800&q=80',
          ],
          price: 480,
          currency: 'PKR',
          sku: 'NST-CRL-175',
          barcode: '8964007223322',
          weight: '175 g',
          unit: 'Box',
          ingredients: ['Wheat Flour', 'Skimmed Milk Powder', 'Dried Fruits', 'Essential Minerals', 'Vitamins'],
          stock: 40,
          stockStatus: 'in_stock',
          rating: 4.8,
          reviewCount: 32,
          tags: ['cerelac', 'nestle', 'baby food', 'nutrition'],
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isDeal: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    // 6. Seed Sample Orders
    if (this.data.orders.length === 0) {
      this.data.orders = [
        {
          id: 'ord_001',
          orderNumber: 'MM-2026-8812',
          userId: 'usr_cust_01',
          customer: {
            fullName: 'Muhammad Usman',
            phone: '+92 300 7865432',
            email: 'customer@test.com',
          },
          delivery: {
            address: 'House #12, Street 4, New Multan Colony',
            area: 'Shah Rukn E Alam Housing Scheme',
            city: 'Multan',
            postalCode: '60000',
            orderNotes: 'Please ring the doorbell, payment in exact cash.',
          },
          items: [
            {
              productId: 'prod_groc_01',
              productName: 'Guard Super Kernel Basmati Rice (5kg)',
              slug: 'guard-super-kernel-basmati-rice-5kg',
              price: 1980,
              quantity: 1,
              weight: '5 kg',
              image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
            },
            {
              productId: 'prod_dry_01',
              productName: "Olper's UHT Pure Full Cream Milk (1 Litre x 12 Pack Carton)",
              slug: 'olpers-uht-pure-full-cream-milk-1l-carton-12',
              price: 3180,
              quantity: 1,
              weight: '12 Litres',
              image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
            },
          ],
          subtotal: 5160,
          discount: 200,
          couponCode: 'MULTANFRESH',
          deliveryFee: 0,
          total: 4960,
          paymentMethod: 'Cash on Delivery',
          status: 'Delivered',
          paymentStatus: 'Paid',
          deliveryStatus: 'Delivered',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'ord_002',
          orderNumber: 'MM-2026-8849',
          userId: 'usr_cust_01',
          customer: {
            fullName: 'Muhammad Usman',
            phone: '+92 300 7865432',
            email: 'customer@test.com',
          },
          delivery: {
            address: 'Shop #8, Main Commercial Market, Thana Chowk',
            area: 'Shah Rukn E Alam Colony',
            city: 'Multan',
            postalCode: '60000',
          },
          items: [
            {
              productId: 'prod_bev_01',
              productName: 'Tapal Danedar Black Tea (950g Economy Pack)',
              slug: 'tapal-danedar-black-tea-950g',
              price: 1440,
              quantity: 2,
              weight: '950 g',
              image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
            },
            {
              productId: 'prod_dry_03',
              productName: 'Farm Fresh Golden Yolks Brown Eggs (Crate of 30)',
              slug: 'farm-fresh-golden-yolks-brown-eggs-30-crate',
              price: 820,
              quantity: 1,
              weight: '30 Eggs',
              image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
            },
          ],
          subtotal: 3700,
          discount: 0,
          deliveryFee: 0,
          total: 3700,
          paymentMethod: 'Cash on Delivery',
          status: 'Processing',
          paymentStatus: 'Unpaid',
          deliveryStatus: 'Out for Delivery',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    // 7. Seed Reviews
    if (this.data.reviews.length === 0) {
      this.data.reviews = [
        {
          id: 'rev_01',
          productId: 'prod_groc_01',
          productName: 'Guard Super Kernel Basmati Rice (5kg)',
          userId: 'usr_cust_01',
          userName: 'Muhammad Usman',
          rating: 5,
          review: 'Outstanding quality Basmati rice! Grains cooked so long and fragrant. Delighted with the fast delivery to Shah Rukn E Alam.',
          status: 'approved',
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 'rev_02',
          productId: 'prod_dry_01',
          productName: "Olper's UHT Pure Full Cream Milk (1 Litre x 12 Pack Carton)",
          userId: 'usr_cust_01',
          userName: 'Farhan Tariq',
          rating: 5,
          review: 'Fresh carton delivered in pristine condition. Best price in Multan, truly authentic grocery store experience.',
          status: 'approved',
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ];
    }

    this.save();
  }

  // --- CRUD Getters & Setters ---

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id || p.productId === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  public createProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initial = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initial) {
      this.save();
      return true;
    }
    return false;
  }

  public getCategories(): Category[] {
    return this.data.categories;
  }

  public getBrands(): Brand[] {
    return this.data.brands;
  }

  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public getCouponByCode(code: string): Coupon | undefined {
    return this.data.coupons.find((c) => c.couponCode.toUpperCase() === code.toUpperCase() && c.isActive);
  }

  public createCoupon(coupon: Coupon): Coupon {
    this.data.coupons.push(coupon);
    this.save();
    return coupon;
  }

  public updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const idx = this.data.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.coupons[idx] = { ...this.data.coupons[idx], ...updates };
    this.save();
    return this.data.coupons[idx];
  }

  public deleteCoupon(id: string): boolean {
    const initial = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter((c) => c.id !== id);
    if (this.data.coupons.length !== initial) {
      this.save();
      return true;
    }
    return false;
  }

  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public getOrdersByUserId(userId: string): Order[] {
    return this.data.orders.filter((o) => o.userId === userId);
  }

  public createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    // Decrease stock for ordered items
    for (const item of order.items) {
      const prod = this.data.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (prod.stock === 0) {
          prod.stockStatus = 'out_of_stock';
        } else if (prod.stock < 10) {
          prod.stockStatus = 'low_stock';
        }
      }
    }
    this.save();
    return order;
  }

  public updateOrderStatus(
    id: string,
    status: Order['status'],
    deliveryStatus?: Order['deliveryStatus'],
    paymentStatus?: Order['paymentStatus']
  ): Order | null {
    const idx = this.data.orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    this.data.orders[idx].status = status;
    if (deliveryStatus) this.data.orders[idx].deliveryStatus = deliveryStatus;
    if (paymentStatus) this.data.orders[idx].paymentStatus = paymentStatus;
    this.data.orders[idx].updatedAt = new Date().toISOString();
    this.save();
    return this.data.orders[idx];
  }

  public getReviews(): Review[] {
    return this.data.reviews;
  }

  public getReviewsByProduct(productId: string): Review[] {
    return this.data.reviews.filter((r) => r.productId === productId && r.status === 'approved');
  }

  public createReview(review: Review): Review {
    this.data.reviews.unshift(review);
    this.save();
    return review;
  }

  public updateReviewStatus(id: string, status: Review['status']): Review | null {
    const idx = this.data.reviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.reviews[idx].status = status;
    this.save();
    return this.data.reviews[idx];
  }

  public getContactMessages(): ContactMessage[] {
    return this.data.contactMessages;
  }

  public createContactMessage(msg: ContactMessage): ContactMessage {
    this.data.contactMessages.unshift(msg);
    this.save();
    return msg;
  }

  public getSiteSettings() {
    return this.data.siteSettings;
  }

  public updateSiteSettings(settings: Partial<DatabaseData['siteSettings']>) {
    this.data.siteSettings = { ...this.data.siteSettings, ...settings };
    this.save();
    return this.data.siteSettings;
  }
}

export const db = new DatabaseStore();
