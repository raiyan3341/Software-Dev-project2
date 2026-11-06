import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Building2, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import { useMediStockStore } from '../../data/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onOpenLogin: (mode?: 'signin' | 'signup', redirect?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigate, onOpenLogin }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder, activeRole, currentUser, currentUserOrg, organizations } = useMediStockStore();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const userOrg = currentUserOrg || (currentUser?.organizationId
    ? organizations.find(o => o.id === currentUser.organizationId)
    : (currentUser?.email ? organizations.find(o => o.email.toLowerCase() === currentUser.email.toLowerCase()) : null));

  const isApprovedOrg = (activeRole === 'organization' || userOrg?.verificationStatus === 'Approved') && userOrg?.verificationStatus === 'Approved';
  const isPendingOrg = userOrg?.verificationStatus === 'Pending';
  const isRejectedOrg = userOrg?.verificationStatus === 'Rejected';

  const handleCheckout = () => {
    if (!currentUser) {
      onClose();
      onOpenLogin('signup', 'register-org');
      return;
    }

    if (isPendingOrg) {
      alert('Your organization application is currently PENDING review by DGHS Admin. Restock orders can only be placed once verified.');
      onClose();
      onNavigate('org-dashboard');
      return;
    }

    if (isRejectedOrg) {
      alert(`Your organization registration was rejected: ${userOrg?.rejectionReason || 'Please re-apply with valid trade license.'}`);
      onClose();
      onNavigate('register-org');
      return;
    }

    if (isApprovedOrg && userOrg) {
      try {
        const order = placeOrder(userOrg.id);
        if (order) {
          onClose();
          onNavigate('org-dashboard');
        }
      } catch (err: any) {
        alert(err.message || 'Failed to place order.');
      }
      return;
    }

    // Normal logged-in user without organization registered yet
    onClose();
    onNavigate('register-org');
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

              {/* Role & Verification Status Banner */}
              {!currentUser ? (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                  <User className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Sign In or Sign Up Required</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Create an account or sign in with your password to register your hospital or pharmacy and place orders.
                    </p>
                  </div>
                </div>
              ) : isPendingOrg ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Organization Verification Pending</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Your credentials are under DGHS Admin review. Bulk restock ordering unlocks as soon as your facility is approved.
                    </p>
                  </div>
                </div>
              ) : isRejectedOrg ? (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Organization Registration Rejected</p>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      {userOrg?.rejectionReason || 'License verification could not be completed.'} Please re-apply.
                    </p>
                  </div>
                </div>
              ) : !userOrg ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Healthcare Facility Registration Required</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Bulk pharmaceutical procurement is strictly restricted to licensed hospitals and pharmacies.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Verified Healthcare Organization: {userOrg.name}</span>
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
                  disabled={isPendingOrg}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isPendingOrg
                      ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed shadow-none'
                      : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white hover:shadow-teal-600/25'
                  }`}
                >
                  {!currentUser ? (
                    <>
                      <User className="w-4 h-4" />
                      <span>Sign In / Sign Up to Order</span>
                    </>
                  ) : isPendingOrg ? (
                    <>
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Approval Pending (Orders Locked)</span>
                    </>
                  ) : isRejectedOrg ? (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Re-Apply Organization</span>
                    </>
                  ) : isApprovedOrg ? (
                    <>
                      <span>Submit Restock Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Register Healthcare Facility</span>
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

