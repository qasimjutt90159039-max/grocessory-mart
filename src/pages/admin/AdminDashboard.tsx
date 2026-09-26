import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Wrench,
  Users,
  Boxes,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Search,
  Check,
  X
} from 'lucide-react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Product, Order, QuoteRequest, RepairRequest, User, ContactMessage } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'quotes' | 'repairs' | 'inventory' | 'messages' | 'customers'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Product Add / Edit modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Inventory adjustment modal
  const [adjustingStock, setAdjustingStock] = useState<{ product: Product; newStock: number; reason: string } | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadAllAdminData();
  }, [user, navigate]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [s, p, o, q, r, c, m] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getOrders(),
        api.getQuotes(),
        api.getRepairs(),
        api.getUsers(),
        api.getMessages()
      ]);
      setStats(s);
      setProducts(p);
      setOrders(o);
      setQuotes(q);
      setRepairs(r);
      setCustomers(c);
      setMessages(m);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
    } catch (err: any) {
      alert(err.message || 'Error updating order');
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, status: string, internalNotes?: string) => {
    try {
      await api.updateQuoteStatus(quoteId, status, internalNotes);
      setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: status as any, internalNotes: internalNotes ?? q.internalNotes } : q));
    } catch (err: any) {
      alert(err.message || 'Error updating quote');
    }
  };

  const handleUpdateRepairStatus = async (repairId: string, status: string, technicianNotes?: string) => {
    try {
      await api.updateRepairStatus(repairId, status, technicianNotes);
      setRepairs(prev => prev.map(r => r.id === repairId ? { ...r, status: status as any, technicianNotes: technicianNotes ?? r.technicianNotes } : r));
    } catch (err: any) {
      alert(err.message || 'Error updating repair');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this equipment product?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      if (editingProduct.id) {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await api.createProduct({
          ...editingProduct,
          slug: editingProduct.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `item-${Date.now()}`,
          images: editingProduct.images?.length ? editingProduct.images : ['/assets/tcs_platform.svg'],
          currency: 'PKR',
          stockStatus: (editingProduct.stock || 0) > 0 ? 'in_stock' : 'out_of_stock',
          isVerifiedItem: true,
          demoNotice: 'DEMO RECORD — VERIFY BEFORE LAUNCH',
          specifications: editingProduct.specifications || [],
          applications: editingProduct.applications || [],
          features: editingProduct.features || []
        });
        setProducts(prev => [created, ...prev]);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingStock) return;
    try {
      const updated = await api.updateStock(adjustingStock.product.id, adjustingStock.newStock, adjustingStock.reason);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setAdjustingStock(null);
    } catch (err: any) {
      alert(err.message || 'Error updating stock');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Admin Bar */}
      <header className="bg-[#111827] text-white border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#31AAA9] text-white flex items-center justify-center font-bold">
            ATS
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm text-white">
              AALIYAN TRADER'S SCALES — MANAGEMENT DESK
            </h1>
            <span className="text-[10px] font-mono text-slate-400">
              Chowk Shaheedan Akbar Road, Multan · Store Operations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded font-medium"
          >
            View Live Store
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'quotes', label: `Quotes (${quotes.length})`, icon: FileText },
            { id: 'repairs', label: `Repairs (${repairs.length})`, icon: Wrench },
            { id: 'inventory', label: 'Inventory', icon: Boxes },
            { id: 'messages', label: `Messages (${messages.length})`, icon: MessageSquare },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#16706F] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-mono">TOTAL REVENUE (COD)</span>
                  <DollarSign className="w-4 h-4 text-[#16706F]" />
                </div>
                <div className="font-heading font-extrabold text-2xl text-slate-900 font-mono-numbers">
                  PKR {stats?.totalRevenue?.toLocaleString() || 0}
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  From {stats?.totalOrders || 0} customer orders
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-mono">B2B QUOTE REQUESTS</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="font-heading font-extrabold text-2xl text-slate-900 font-mono-numbers">
                  {stats?.quoteCount || 0}
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Commercial inquiries logged
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-mono">SCALE REPAIR TICKETS</span>
                  <Wrench className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-heading font-extrabold text-2xl text-slate-900 font-mono-numbers">
                  {stats?.repairCount || 0}
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Chowk Shaheedan workshop desk
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-mono">REGISTERED CUSTOMERS</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="font-heading font-extrabold text-2xl text-slate-900 font-mono-numbers">
                  {stats?.customerCount || 0}
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Retail &amp; wholesale accounts
                </span>
              </div>
            </div>

            {/* Quick summaries grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-heading font-bold text-sm text-slate-900">
                    Recent Customer Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#16706F] hover:underline font-mono">
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {orders.slice(0, 4).map(o => (
                    <div key={o.id} className="p-3 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{o.orderNumber}</span>
                        <span className="text-[11px] text-slate-500">{o.customer.fullName} · {o.items.length} item(s)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#16706F] block">PKR {o.total.toLocaleString()}</span>
                        <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Quotes */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-heading font-bold text-sm text-slate-900">
                    Recent B2B Quotations
                  </h3>
                  <button onClick={() => setActiveTab('quotes')} className="text-xs text-[#16706F] hover:underline font-mono">
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {quotes.slice(0, 4).map(q => (
                    <div key={q.id} className="p-3 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{q.quoteNumber}</span>
                        <span className="text-[11px] text-slate-500">{q.fullName} · {q.productName} (Qty: {q.quantity})</span>
                      </div>
                      <span className="text-[10px] font-bold bg-[#DDF6F5] text-[#16706F] px-2 py-0.5 rounded">
                        {q.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-heading font-bold text-base text-slate-900">
                  Equipment Product Catalog ({products.length})
                </h2>
                <span className="text-xs font-mono text-slate-500">
                  TCS &amp; ACS Scales, Power Tools, Hardware
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    category: 'scales',
                    subcategory: 'TCS Weighing Scales',
                    sku: `ATS-${Date.now().toString().slice(-4)}`,
                    price: 0,
                    priceType: 'verified',
                    stock: 10,
                    shortDescription: '',
                    description: '',
                    specifications: [],
                    applications: [],
                    features: [],
                    images: ['/assets/tcs_platform.svg']
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#31AAA9] hover:bg-[#16706F] rounded flex items-center gap-1.5 self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add Equipment Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-left">
                    <th className="p-3">Image</th>
                    <th className="p-3">Product Name &amp; SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="w-10 h-10 bg-slate-50 border rounded p-1 flex items-center justify-center">
                          <img src={prod.images[0] || '/assets/tcs_platform.svg'} alt="" className="max-h-full max-w-full object-contain" />
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{prod.name}</span>
                        <span className="text-slate-400 text-[10px]">SKU: {prod.sku}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-[#16706F] block">{prod.subcategory || prod.category}</span>
                      </td>
                      <td className="p-3">
                        {prod.priceType === 'verified' && prod.price ? (
                          <span className="font-bold text-slate-900">PKR {prod.price.toLocaleString()}</span>
                        ) : (
                          <span className="text-amber-700 font-semibold">Request Price</span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setAdjustingStock({ product: prod, newStock: prod.stock, reason: 'Stock count calibration' })}
                          className="hover:underline font-bold text-slate-800"
                        >
                          {prod.stock} units
                        </button>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1 text-slate-600 hover:text-[#16706F]"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 font-mono text-xs">
            <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Customer Orders Management ({orders.length})
            </h2>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-bold text-base text-slate-900">{order.orderNumber}</span>
                      <span className="text-slate-400 ml-3">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Status:</span>
                      <select
                        value={order.status}
                        onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-xs"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                    <div>
                      <span className="font-bold block text-slate-900">Customer:</span>
                      {order.customer.fullName} · {order.customer.phone} · {order.customer.email}
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900">Delivery Address:</span>
                      {order.delivery.address}, {order.delivery.city} {order.delivery.postalCode}
                      {order.delivery.deliveryNotes && (
                        <span className="text-amber-800 block text-[11px]">Note: {order.delivery.deliveryNotes}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900">Order Items:</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-600">
                        <span>{item.quantity}x {item.productName}</span>
                        <span className="font-bold">PKR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-1 flex justify-between font-bold text-slate-900">
                      <span>Total Amount (COD):</span>
                      <span className="text-[#16706F]">PKR {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: QUOTES */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 font-mono text-xs">
            <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Commercial B2B Quotations ({quotes.length})
            </h2>

            <div className="space-y-4">
              {quotes.map(q => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-bold text-base text-slate-900">{q.quoteNumber}</span>
                      <span className="text-slate-400 ml-3">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Status:</span>
                      <select
                        value={q.status}
                        onChange={e => handleUpdateQuoteStatus(q.id, e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-xs"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="font-bold block text-slate-900">Customer / Business:</span>
                      {q.fullName} {q.companyName ? `(${q.companyName})` : ''} · Tel: {q.phone} · {q.email}
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900">Product &amp; Volume:</span>
                      {q.productName} · Quantity: <strong>{q.quantity} units</strong>
                    </div>
                  </div>

                  {q.requirements && (
                    <div className="p-2.5 bg-white rounded border border-slate-200">
                      <span className="font-bold block text-slate-800">Requirements:</span>
                      {q.requirements}
                    </div>
                  )}

                  {q.internalNotes && (
                    <div className="text-[11px] text-amber-800">
                      <strong>Internal Note:</strong> {q.internalNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: REPAIRS */}
        {activeTab === 'repairs' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 font-mono text-xs">
            <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Weighing Scale Repair Tickets ({repairs.length})
            </h2>

            <div className="space-y-4">
              {repairs.map(r => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-bold text-base text-slate-900">{r.repairNumber}</span>
                      <span className="text-slate-400 ml-3">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Status:</span>
                      <select
                        value={r.status}
                        onChange={e => handleUpdateRepairStatus(r.id, e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-xs"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Repairing">Repairing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="font-bold block text-slate-900">Customer &amp; Location:</span>
                      {r.customerName} · Tel: {r.phone} · Area: {r.location} {r.preferredContactMethod ? `(Preferred: ${r.preferredContactMethod.toUpperCase()})` : ''}
                    </div>
                    <div>
                      <span className="font-bold block text-slate-900">Scale Type &amp; Diagnosis:</span>
                      {r.scaleType}
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded border border-slate-200 text-rose-700">
                    <span className="font-bold block text-slate-800">Problem Description:</span>
                    {r.problem}
                  </div>

                  {r.technicianNotes && (
                    <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-800">
                      <span className="font-bold block text-slate-800">Technician Workshop Notes:</span>
                      {r.technicianNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 font-mono text-xs">
            <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Stock Calibration &amp; Inventory Audit
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-left">
                    <th className="p-3">SKU</th>
                    <th className="p-3">Equipment Item</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3 text-right">Stock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{p.sku}</td>
                      <td className="p-3">{p.name}</td>
                      <td className="p-3 text-[#16706F]">{p.subcategory || p.category}</td>
                      <td className="p-3 font-bold">{p.stock} units</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setAdjustingStock({ product: p, newStock: p.stock, reason: 'Manual audit at Multan depot' })}
                          className="px-2.5 py-1 text-xs text-white bg-[#111827] rounded hover:bg-black"
                        >
                          Adjust Count
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 font-mono text-xs">
            <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Contact &amp; Inquiry Messages ({messages.length})
            </h2>

            <div className="space-y-3">
              {messages.map(m => (
                <div key={m.id} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-900">{m.name} · Tel: {m.phone}</span>
                    <span className="text-[10px] text-slate-400">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{m.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 font-mono text-xs">
            <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Registered Accounts ({customers.length})
            </h2>

            <div className="space-y-3">
              {customers.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">{c.name} ({c.email})</span>
                    <span className="text-[11px] text-slate-500">Phone: {c.phone || 'N/A'} · Company: {c.companyName || 'Retail Customer'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.role === 'admin' ? 'bg-[#DDF6F5] text-[#16706F]' : 'bg-slate-200 text-slate-700'}`}>
                    {c.role.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 z-10 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {editingProduct.id ? 'Edit Equipment Record' : 'Add New Equipment Record'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">SKU *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Category *</label>
                  <select
                    value={editingProduct.category || 'scales'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="scales">Weighing Scales</option>
                    <option value="power-tools">Power Tools</option>
                    <option value="hardware">Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Subcategory</label>
                  <input
                    type="text"
                    value={editingProduct.subcategory || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Price Type</label>
                  <select
                    value={editingProduct.priceType || 'verified'}
                    onChange={e => setEditingProduct({ ...editingProduct, priceType: e.target.value as any })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="verified">Verified Listed Price</option>
                    <option value="request_price">Quotation on Request</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Current Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Capacity (Scales)</label>
                  <input
                    type="text"
                    value={editingProduct.capacity || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, capacity: e.target.value })}
                    placeholder="e.g. 150 kg / 300 kg"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">Accuracy / Division</label>
                  <input
                    type="text"
                    value={editingProduct.accuracy || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, accuracy: e.target.value })}
                    placeholder="e.g. 20 g / 50 g"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1 font-semibold">Full Description</label>
                <textarea
                  rows={4}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2 text-slate-700 bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-white bg-[#31AAA9] hover:bg-[#16706F] font-bold rounded"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setAdjustingStock(null)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-5 z-10 border border-slate-200 font-mono text-xs">
            <h3 className="font-heading font-bold text-sm text-slate-900 mb-1">
              Adjust Stock Count
            </h3>
            <p className="text-slate-500 mb-3">{adjustingStock.product.name}</p>

            <form onSubmit={handleSaveStock} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1">New Stock Level</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={adjustingStock.newStock}
                  onChange={e => setAdjustingStock({ ...adjustingStock, newStock: Number(e.target.value) })}
                  className="w-full p-2 border rounded font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Audit Reason</label>
                <input
                  type="text"
                  required
                  value={adjustingStock.reason}
                  onChange={e => setAdjustingStock({ ...adjustingStock, reason: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingStock(null)}
                  className="flex-1 py-1.5 bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#16706F] text-white rounded font-bold"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
