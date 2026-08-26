import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LogOut, Package, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export default function MyAccountPage() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    orderService
      .myOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-[#5C574F] text-sm">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(val || 0));

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#B8945A]/10 border border-[#B8945A] text-[#B8945A] flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-[#1E1C1A]">
              {user.first_name || 'Welcome'} {user.last_name}
            </h1>
            <p className="text-xs text-[#5C574F]">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-[#1E1C1A] text-xs uppercase tracking-wider font-medium hover:bg-[#1E1C1A] hover:text-white transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Package className="w-4 h-4 text-[#B8945A]" />
        <h2 className="font-serif text-xl text-[#1E1C1A]">Order History</h2>
      </div>

      {ordersLoading ? (
        <p className="text-sm text-[#5C574F]">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-[#FFFDF9] border border-[#E8DDCD]">
          <p className="text-sm text-[#5C574F] mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-[#1E1C1A] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B8945A] transition-colors"
          >
            Discover Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.order_number}
              to={`/order-tracking?order=${order.order_number}`}
              className="block p-4 bg-[#FFFDF9] border border-[#E8DDCD] hover:border-[#B8945A] transition-colors"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-serif text-base text-[#1E1C1A]">#{order.order_number}</span>
                  <span className="text-xs text-[#5C574F] ml-3">{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#B8945A]">{order.status_display}</span>
                  <span className="text-sm font-semibold text-[#1E1C1A]">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
