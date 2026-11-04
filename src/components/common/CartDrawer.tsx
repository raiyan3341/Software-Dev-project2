import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Building2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMediStockStore } from '../../data/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder, activeRole, currentUser } = useMediStockStore();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (activeRole === 'organization' && currentUser?.organizationId) {
      const order = placeOrder(currentUser.organizationId);
      if (order) {
        onClose();
        onNavigate('org-dashboard');
      }
    } else {
      // Direct user to register or log in as organization
      onClose();
      onNavigate('register-org');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Restock Shopping Cart</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-700 text-base">Your cart is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Browse the medical catalog and add medicines or healthcare supplies to place a restocking order.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('products');
                  }}
                  className="mt-4 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  Browse Product Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{item.product.unit}</p>
                    <p className="text-xs font-bold text-teal-700 mt-1">৳ {item.product.price} each</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-slate-800 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900 ml-auto">
                        ৳ {item.product.price * item.quantity}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">৳ {subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Supply Tax (Exempt / Healthcare)</span>
                  <span className="font-semibold text-emerald-700">৳ 0.00</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-teal-700 font-black">৳ {subtotal}</span>
                </div>
              </div>

              {/* Role Check Warning/Banner */}
              {activeRole !== 'organization' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Hospital / Pharmacy Login Required</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Submitting medical supply orders is restricted to verified healthcare organizations.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 border border-slate-300 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                >
                  Clear
                </button>

                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm shadow-md hover:shadow-teal-600/25 transition-all flex items-center justify-center gap-2"
                >
                  {activeRole === 'organization' ? (
                    <>
                      <span>Submit Restock Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Register / Login Org to Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

