import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  Search,
  Droplet,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  User,
  Heart,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { BloodGroup, BloodDonor } from '../../types';
import { CreateBloodRequestModal } from './CreateBloodRequestModal';
import { RequestDonorModal } from './RequestDonorModal';

interface BloodDonationPageProps {
  onNavigate: (view: string) => void;
}

export const BloodDonationPage: React.FC<BloodDonationPageProps> = ({ onNavigate }) => {
  const { donors, setDonors, bloodRequests, setBloodRequests, currentUser } = useMediStockStore();

  const [activeTab, setActiveTab] = useState<'find' | 'requests' | 'my-donations' | 'profile'>('find');

  // Filters matching Project.png Screen 8
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('All Groups');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('Any');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDonorForRequest, setSelectedDonorForRequest] = useState<BloodDonor | null>(null);

  // Filtered Donors list
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      if (selectedBloodGroup !== 'All Groups' && d.bloodGroup !== selectedBloodGroup) {
        return false;
      }
      if (selectedLocation !== 'All' && d.location !== selectedLocation) {
        return false;
      }
      if (selectedAvailability === 'Available' && !d.isAvailable) {
        return false;
      }
      if (selectedAvailability === 'Not Available' && d.isAvailable) {
        return false;
      }
      return true;
    });
  }, [donors, selectedBloodGroup, selectedLocation, selectedAvailability]);

  // Toggle user's own donor availability
  const isCurrentUserDonor = donors.some(d => d.email === currentUser?.email);

  const handleToggleMyDonorStatus = () => {
    if (isCurrentUserDonor) {
      setDonors(donors.map(d => d.email === currentUser?.email ? { ...d, isAvailable: !d.isAvailable } : d));
    } else if (currentUser) {
      const newDonor: BloodDonor = {
        id: `donor-${Date.now()}`,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || '+880 1718 223344',
        avatar: currentUser.avatar,
        bloodGroup: 'B+',
        location: 'Dhaka',
        isAvailable: true,
        lastDonationDate: new Date().toISOString().split('T')[0],
      };
      setDonors([newDonor, ...donors]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">
        
        {/* Left Sub-nav matching Project.png Screen 8 */}
        <aside className="w-full lg:w-60 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm shrink-0 space-y-4">
          <div className="flex items-center gap-2.5 p-2 bg-rose-50 rounded-2xl border border-rose-100 text-rose-700">
            <Droplet className="w-5 h-5 fill-rose-600" />
            <h3 className="font-extrabold text-sm tracking-tight">Blood Donation</h3>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('find')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'find'
                  ? 'bg-rose-50 text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-rose-600" />
              <span>Find Donors</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'requests'
                  ? 'bg-rose-50 text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                <span>My Requests</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                {bloodRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('my-donations')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'my-donations'
                  ? 'bg-rose-50 text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-600" />
              <span>My Donations</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-rose-50 text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-rose-600" />
              <span>Donor Profile</span>
            </button>
          </nav>

          {/* Quick Action: Post Blood Request */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Blood Request</span>
            </button>
          </div>

          {/* Donor Volunteer Card */}
          <div className="pt-2">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-800 block">Volunteer Status</span>
              <p className="text-[11px] text-slate-500 leading-tight">
                {isCurrentUserDonor ? 'You are registered as an active donor.' : `Join ${donors.length}+ registered blood donors.`}
              </p>
              <button
                onClick={handleToggleMyDonorStatus}
                className="w-full py-1.5 rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs font-semibold transition-colors"
              >
                {isCurrentUserDonor ? 'Toggle Availability' : 'Register as Donor'}
              </button>
            </div>
          </div>

        </aside>

        {/* Right Main Content matching Project.png Screen 8 */}
        <main className="flex-1 w-full space-y-6">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Find Blood Donors
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified community blood network across Bangladesh
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Droplet className="w-4 h-4 fill-white" />
              <span>Post Emergency Request</span>
            </button>
          </div>

          {/* Tab 1: Find Donors (Default - Screen 8) */}
          {activeTab === 'find' && (
            <div className="space-y-6">
              
              {/* Filter Bar matching Project.png Screen 8 */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  
                  {/* Blood Group Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Blood Group
                    </label>
                    <select
                      value={selectedBloodGroup}
                      onChange={(e) => setSelectedBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 outline-none cursor-pointer"
                    >
                      <option value="All Groups">All Groups</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  {/* Location Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 outline-none cursor-pointer"
                    >
                      <option value="All">Select Location (All)</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                    </select>
                  </div>

                  {/* Availability Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Availability
                    </label>
                    <select
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 outline-none cursor-pointer"
                    >
                      <option value="Any">Any</option>
                      <option value="Available">Available</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                  </div>

                  {/* Search Action Button */}
                  <div>
                    <button
                      onClick={() => {}}
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Data Table matching Project.png Screen 8 */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Donor</th>
                        <th className="py-3.5 px-4">Blood Group</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Availability</th>
                        <th className="py-3.5 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {filteredDonors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-slate-400">
                            No blood donors matched the selected blood group or division.
                          </td>
                        </tr>
                      ) : (
                        filteredDonors.map((donor) => (
                          <tr key={donor.id} className="hover:bg-slate-50/70 transition-colors">
                            
                            {/* Donor: Avatar + Name + Email matching Project.png */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={donor.avatar}
                                  alt={donor.name}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 leading-tight">
                                    {donor.name}
                                  </p>
                                  <span className="text-xs text-slate-400 leading-none">
                                    {donor.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Blood Group Badge matching Project.png */}
                            <td className="py-4 px-4">
                              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-extrabold text-xs">
                                {donor.bloodGroup}
                              </span>
                            </td>

                            {/* Location */}
                            <td className="py-4 px-4 text-slate-700 font-medium">
                              {donor.location}
                            </td>

                            {/* Availability matching Project.png */}
                            <td className="py-4 px-4">
                              {donor.isAvailable ? (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  Available
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                  Not Available
                                </span>
                              )}
                            </td>

                            {/* Action: Request button matching Project.png */}
                            <td className="py-4 px-5 text-right">
                              <button
                                onClick={() => setSelectedDonorForRequest(donor)}
                                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-all hover:shadow-teal-600/20"
                              >
                                Request
                              </button>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Disclaimer Notice required by Section 6 of Requirments.md */}
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-teal-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Medical Disclaimer & Blood Safety Advisory
                </p>
                <p className="text-[11px] leading-relaxed">
                  MediStock connects potential voluntary donors and recipients. It does not perform clinical compatibility tests or guarantee donor health suitability. All transfusions must undergo official laboratory cross-matching and screening at certified clinical facilities.
                </p>
              </div>

            </div>
          )}

          {/* Tab 2: My Requests */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">Active Emergency Blood Requests</h3>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
                >
                  + New Request
                </button>
              </div>

              {bloodRequests.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                    <Droplet className="w-8 h-8 fill-rose-600" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">No Emergency Blood Requests</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    There are currently no active blood requests in the system. Click "+ New Request" to create one.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                  >
                    Post Emergency Request
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bloodRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
                          {req.bloodGroup} • {req.unitsNeeded} Unit(s)
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                          {req.urgency}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{req.hospital}</h4>
                        <p className="text-xs text-slate-500">{req.location} • Needed by {req.dateNeeded}</p>
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{req.notes}"
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="text-slate-400">Attendant: {req.contactPhone}</span>
                        <div className="flex items-center gap-2">
                          {req.status === 'Open' ? (
                            <>
                              <button
                                onClick={() => alert(`Thank you! Your willingness to donate for ${req.hospital} has been dispatched to the attendant at ${req.contactPhone}.`)}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px]"
                              >
                                Volunteer
                              </button>
                              <button
                                onClick={() => {
                                  const updated = bloodRequests.map(r => r.id === req.id ? { ...r, status: 'Fulfilled' as const } : r);
                                  setBloodRequests(updated);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px]"
                              >
                                Mark Fulfilled
                              </button>
                            </>
                          ) : (
                            <span className="font-bold text-emerald-700">Fulfilled ✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: My Donations */}
          {activeTab === 'my-donations' && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 fill-rose-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Your Donation Impact</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You have contributed to 2 emergency hospital requests in the past year. Keep your availability status up to date!
              </p>
            </div>
          )}

          {/* Tab 4: Donor Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-xl space-y-5">
              <h3 className="font-bold text-slate-900 text-lg">Donor Profile & Consent Settings</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Donor Display Name</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.name || 'Rahim Ahmed'}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Registered Blood Group</label>
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold inline-block">
                    B+ (Positive)
                  </span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Privacy Consent</label>
                  <p className="text-slate-500">
                    Your contact number is kept confidential and only shared with hospitals upon explicit request approval.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Modals */}
      <CreateBloodRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <RequestDonorModal
        donor={selectedDonorForRequest}
        onClose={() => setSelectedDonorForRequest(null)}
      />
    </div>
  );
};

