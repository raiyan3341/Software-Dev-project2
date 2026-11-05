import React, { useState, useMemo } from 'react';
import {
  Droplet,
  Heart,
  HeartHandshake,
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  UserCheck,
  UserX,
  Trash2,
  Clock,
  Send,
  Check,
  X,
  Sparkles,
  ArrowRight,
  User,
  Users,
  Activity,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { BloodGroup, BloodDonor, BloodRequest, DonorDirectRequest } from '../../types';
import { CreateBloodRequestModal } from './CreateBloodRequestModal';
import { RegisterDonorModal } from './RegisterDonorModal';
import { AcceptBloodRequestModal } from './AcceptBloodRequestModal';
import { RequestDonorModal } from './RequestDonorModal';

interface BloodDonationPageProps {
  onNavigate: (view: string) => void;
  onOpenLogin?: () => void;
}

const BLOOD_GROUPS: (BloodGroup | 'All')[] = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BloodDonationPage: React.FC<BloodDonationPageProps> = ({ onNavigate, onOpenLogin }) => {
  const {
    donors,
    bloodRequests,
    donorRequests,
    currentUser,
    activeRole,
    fulfillBloodRequest,
    deleteBloodRequest,
    clearAllBloodRequests,
    clearFulfilledBloodRequests,
    toggleDonorAvailability,
    deleteDonor,
    clearAllDonors,
    respondToDonorRequest,
    deleteDonorRequest,
    clearAllDonorRequests,
  } = useMediStockStore();

  const isAdminOrOwner =
    activeRole === 'admin' ||
    activeRole === 'owner' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'owner';

  const canDeleteRequest = (req: BloodRequest) => {
    if (isAdminOrOwner) return true;
    return !!(currentUser && req.requesterId === currentUser.id);
  };

  const canDeleteDonor = (donor: BloodDonor) => {
    if (isAdminOrOwner) return true;
    return !!(currentUser && (donor.userId === currentUser.id || donor.email === currentUser.email));
  };

  // Primary Tabs: 'requests' (Blood Requests), 'donors' (Available Donors), 'my-activity' (My Activity)
  const [activeTab, setActiveTab] = useState<'requests' | 'donors' | 'my-activity'>('requests');

  // Filters
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [isRegisterDonorModalOpen, setIsRegisterDonorModalOpen] = useState(false);
  const [selectedRequestForAccept, setSelectedRequestForAccept] = useState<BloodRequest | null>(null);
  const [selectedDonorForDirectRequest, setSelectedDonorForDirectRequest] = useState<BloodDonor | null>(null);

  // Filtered Blood Requests
  const filteredRequests = useMemo(() => {
    return bloodRequests.filter((req) => {
      const matchGroup = selectedBloodGroup === 'All' || req.bloodGroup === selectedBloodGroup;
      const matchLocation = selectedLocation === 'All' || req.location === selectedLocation;
      const matchSearch =
        searchQuery.trim() === '' ||
        req.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGroup && matchLocation && matchSearch;
    });
  }, [bloodRequests, selectedBloodGroup, selectedLocation, searchQuery]);

  // Filtered Donors
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchGroup = selectedBloodGroup === 'All' || d.bloodGroup === selectedBloodGroup;
      const matchLocation = selectedLocation === 'All' || d.location === selectedLocation;
      const matchSearch =
        searchQuery.trim() === '' ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.notes && d.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchGroup && matchLocation && matchSearch;
    });
  }, [donors, selectedBloodGroup, selectedLocation, searchQuery]);

  // My Personal Data (Isolated to Current User)
  const myRequests = useMemo(() => {
    if (!currentUser) return [];
    return bloodRequests.filter((r) => r.requesterId === currentUser.id);
  }, [bloodRequests, currentUser]);

  const myDonorProfile = useMemo(() => {
    if (!currentUser) return null;
    return donors.find((d) => d.userId === currentUser.id || d.email === currentUser.email) || null;
  }, [donors, currentUser]);

  const requestsSentToMe = useMemo(() => {
    if (!currentUser || !myDonorProfile) return [];
    return donorRequests.filter((r) => r.donorUserId === currentUser.id || r.donorId === myDonorProfile.id);
  }, [donorRequests, currentUser, myDonorProfile]);

  const requestsSentByMe = useMemo(() => {
    if (!currentUser) return [];
    return donorRequests.filter((r) => r.requesterId === currentUser.id);
  }, [donorRequests, currentUser]);

  const requestsIAccepted = useMemo(() => {
    if (!currentUser) return [];
    return bloodRequests.filter((r) => r.acceptedById === currentUser.id);
  }, [bloodRequests, currentUser]);

  const totalMyActivityCount =
    myRequests.length + requestsSentToMe.length + requestsSentByMe.length + requestsIAccepted.length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-20 top-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-500/30">
              <Droplet className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
              <span>Emergency Blood Network • 24/7 Community Support</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Connecting Blood Donors & Patients Across Bangladesh
            </h1>

            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-2xl">
              Post emergency blood requirements or register as a voluntary blood donor.
              Life-saving coordination made simple, direct, and completely transparent.
            </p>

            {/* Main Action CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsCreateRequestModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Post Blood Request</span>
              </button>

              <button
                onClick={() => setIsRegisterDonorModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                <span>{myDonorProfile ? 'View / Update Donor Profile' : 'Register as Blood Donor'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin & Owner Rapid Database Management Toolbar */}
        {isAdminOrOwner && (
          <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-5 text-white border border-rose-500/30 shadow-xl space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-rose-600/30 border border-rose-500/40 text-rose-400">
                  <Database className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                    <span>Admin & Owner Database Control</span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-xs">
                      {activeRole === 'owner' ? 'Owner Master Access' : 'Admin Privileges'}
                    </span>
                  </h4>
                  <p className="text-xs text-rose-200/80">
                    Clean obsolete records in 1-click to optimize database storage and keep the community active.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-300 font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                Live Records: {bloodRequests.length} requests • {donors.length} donors • {donorRequests.length} direct
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  if (window.confirm('Delete all Fulfilled and Completed blood requests to free database space?')) {
                    clearFulfilledBloodRequests();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1-Click: Clear Fulfilled Requests</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete ALL blood requests? This action cannot be undone.')) {
                    clearAllBloodRequests();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>1-Click: Clear All Requests ({bloodRequests.length})</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete ALL registered donors from the database?')) {
                    clearAllDonors();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>1-Click: Clear All Donors ({donors.length})</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Delete ALL direct donor requests history?')) {
                    clearAllDonorRequests();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>1-Click: Clear Direct Requests ({donorRequests.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Tab 1: Blood Requests Feed */}
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Droplet className={`w-4 h-4 ${activeTab === 'requests' ? 'fill-white' : 'text-rose-600'}`} />
              <span>Blood Requests</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'requests' ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {bloodRequests.length}
              </span>
            </button>

            {/* Tab 2: Available Donors Feed */}
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'donors'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Available Donors</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'donors' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {donors.length}
              </span>
            </button>

            {/* Tab 3: My Activity Dashboard */}
            <button
              onClick={() => setActiveTab('my-activity')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'my-activity'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>My Activity</span>
              {totalMyActivityCount > 0 && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'my-activity' ? 'bg-slate-800 text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  {totalMyActivityCount}
                </span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 pr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Community Feed</span>
          </div>
        </div>

        {/* Filter Bar (Visible in Requests and Donors tabs) */}
        {activeTab !== 'my-activity' && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            {/* Blood Group Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Blood Group:</span>
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                    selectedBloodGroup === bg
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {bg === 'All' ? 'All Groups' : bg}
                </button>
              ))}
            </div>

            {/* City Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 border-t border-slate-100">
              <div className="sm:col-span-4">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white cursor-pointer"
                >
                  <option value="All">All Locations & Divisions</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                  <option value="Comilla">Comilla</option>
                </select>
              </div>

              <div className="sm:col-span-8 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by hospital, location, notes, or patient name..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: BLOOD REQUESTS FEED */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <span>Live Emergency Blood Requests</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    {filteredRequests.length} Active Posts
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review active blood requirements and volunteer directly to save a life.
                </p>
              </div>

              <button
                onClick={() => setIsCreateRequestModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Request</span>
              </button>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                  <Droplet className="w-8 h-8 fill-rose-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">No Active Blood Requests Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  If you or someone in your care needs blood, create an emergency post now. Matching donors will be notified immediately.
                </p>
                <button
                  onClick={() => setIsCreateRequestModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  Post Blood Request
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRequests.map((req) => {
                  const isMyPost = currentUser && req.requesterId === currentUser.id;
                  const urgencyStyles: Record<string, string> = {
                    Critical: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
                    Urgent: 'bg-amber-100 text-amber-800 border-amber-300',
                    Normal: 'bg-blue-100 text-blue-800 border-blue-300',
                  };

                  return (
                    <div
                      key={req.id}
                      className={`bg-white rounded-3xl p-5 border shadow-xs space-y-4 flex flex-col justify-between transition-all hover:shadow-md ${
                        req.status === 'Accepted'
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : req.status === 'Fulfilled'
                          ? 'border-slate-200 bg-slate-50/60 opacity-80'
                          : 'border-slate-200/90 hover:border-rose-400'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top Meta: Blood Group Badge + Urgency + Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-rose-600/30 shrink-0">
                              {req.bloodGroup}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">
                                {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Bag' : 'Bags'} Needed
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                Date: {req.dateNeeded}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${urgencyStyles[req.urgency] || 'bg-slate-100'}`}>
                              {req.urgency}
                            </span>
                            {isMyPost && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                                Your Post
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Hospital & Location */}
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                            {req.hospital}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{req.location} Division</span>
                          </p>
                        </div>

                        {/* Medical Note */}
                        {req.notes && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                            "{req.notes}"
                          </p>
                        )}

                        {/* Requester Info */}
                        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span>Requester: <strong className="text-slate-800">{req.requesterName}</strong></span>
                          <span>Contact: <strong className="text-slate-800">{req.contactPhone}</strong></span>
                        </div>

                        {/* Accepted Status Banner */}
                        {req.status === 'Accepted' && (
                          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Donor Assigned!</span>
                            </div>
                            <p className="text-[11px] text-emerald-700">
                              Donor: <strong>{req.acceptedByName}</strong> ({req.acceptedByPhone})
                            </p>
                            {req.donorMessage && (
                              <p className="text-[11px] italic text-emerald-900">"{req.donorMessage}"</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        {req.status === 'Fulfilled' ? (
                          <div className="w-full flex items-center gap-2">
                            <span className="flex-1 text-center py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs">
                              Blood Donation Completed ✓
                            </span>
                            {canDeleteRequest(req) && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Delete this completed blood request to free database storage?')) {
                                    deleteBloodRequest(req.id);
                                  }
                                }}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Delete Completed Request"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : isMyPost ? (
                          // Owner of the post
                          <div className="w-full flex items-center gap-2">
                            <button
                              onClick={() => fulfillBloodRequest(req.id)}
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Mark Fulfilled ✓
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete your blood request?')) {
                                  deleteBloodRequest(req.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Delete Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : req.status === 'Accepted' ? (
                          <div className="w-full flex items-center gap-2">
                            <span className="flex-1 text-center py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                              Donor Confirmed (In Progress)
                            </span>
                            {canDeleteRequest(req) && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete blood request for ${req.hospital}?`)) {
                                    deleteBloodRequest(req.id);
                                  }
                                }}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors cursor-pointer"
                                title="Delete Request"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          // Another user viewing the open post
                          <div className="w-full flex items-center gap-2">
                            <button
                              onClick={() => setSelectedRequestForAccept(req)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Heart className="w-3.5 h-3.5 fill-white" />
                              <span>I Want to Donate (Accept)</span>
                            </button>
                            <a
                              href={`tel:${req.contactPhone}`}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center"
                              title="Call Contact"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            {isAdminOrOwner && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Admin/Owner action: Delete blood request for ${req.hospital}?`)) {
                                    deleteBloodRequest(req.id);
                                  }
                                }}
                                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                title="Admin Delete Request"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AVAILABLE DONORS FEED */}
        {activeTab === 'donors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span>Available Blood Donors</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                    {filteredDonors.length} Registered Donors
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified volunteer donors ready to respond. Request blood directly for hospitalized patients.
                </p>
              </div>

              <button
                onClick={() => setIsRegisterDonorModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{myDonorProfile ? 'My Donor Profile' : '+ Register as Donor'}</span>
              </button>
            </div>

            {filteredDonors.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">No Donors Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Adjust your blood group or location filters, or be the first voluntary donor to register in this area.
                </p>
                <button
                  onClick={() => setIsRegisterDonorModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  Register as Blood Donor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDonors.map((donor) => {
                  const isMe = currentUser && (donor.userId === currentUser.id || donor.email === currentUser.email);

                  return (
                    <div
                      key={donor.id}
                      className={`bg-white rounded-3xl p-5 border shadow-xs space-y-4 flex flex-col justify-between transition-all hover:shadow-md ${
                        isMe ? 'border-teal-400 bg-teal-50/20' : 'border-slate-200/90 hover:border-teal-400'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Donor Top Bar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={donor.avatar}
                              alt={donor.name}
                              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-slate-900 text-sm leading-tight">{donor.name}</h4>
                                {isMe && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{donor.location} Division</span>
                              </p>
                            </div>
                          </div>

                          <span className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center shrink-0">
                            {donor.bloodGroup}
                          </span>
                        </div>

                        {/* Availability Status */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-400">Status:</span>
                          {donor.isAvailable ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Ready to Donate (Available)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                              Currently Unavailable
                            </span>
                          )}
                        </div>

                        {/* Donor Note */}
                        {donor.notes && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            "{donor.notes}"
                          </p>
                        )}
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {isMe ? (
                          <div className="w-full flex items-center gap-2">
                            <button
                              onClick={() => toggleDonorAvailability(donor.id)}
                              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                                donor.isAvailable
                                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {donor.isAvailable ? 'Set Unavailable' : 'Set Available'}
                            </button>
                            <button
                              onClick={() => setIsRegisterDonorModalOpen(true)}
                              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                            >
                              Edit Profile
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to remove your donor profile from the directory?')) {
                                  deleteDonor(donor.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Delete Donor Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full flex items-center gap-2">
                            <button
                              onClick={() => setSelectedDonorForDirectRequest(donor)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Request Blood</span>
                            </button>
                            <a
                              href={`tel:${donor.phone}`}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center"
                              title="Call Donor"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            {isAdminOrOwner && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Admin/Owner action: Delete donor profile for "${donor.name}"?`)) {
                                    deleteDonor(donor.id);
                                  }
                                }}
                                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                title="Admin Delete Donor Profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY PERSONAL ACTIVITY DASHBOARD */}
        {activeTab === 'my-activity' && (
          <div className="space-y-6">
            {!currentUser ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">Sign In to View Your Blood Activity</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Sign in to manage your blood requests, view voluntary donor commitments, and track incoming donation requests.
                </p>
                <button
                  onClick={onOpenLogin}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  Sign In / Register
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 1. My Blood Requests Posted by Me */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
                        <span>My Blood Requests ({myRequests.length})</span>
                      </h4>
                      <p className="text-xs text-slate-500">Emergency requests created by you and their real-time fulfillment status</p>
                    </div>

                    <button
                      onClick={() => setIsCreateRequestModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>New Request</span>
                    </button>
                  </div>

                  {myRequests.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      You have not posted any blood requests yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {myRequests.map((req) => (
                        <div key={req.id} className="py-4 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                                {req.bloodGroup}
                              </span>
                              <div>
                                <h5 className="font-bold text-slate-900 text-sm">{req.hospital}</h5>
                                <span className="text-xs text-slate-500">{req.location} • {req.unitsNeeded} Bag(s) • Needed: {req.dateNeeded}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {req.status === 'Accepted' && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                  Donor Confirmed!
                                </span>
                              )}
                              {req.status === 'Fulfilled' && (
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                  Completed ✓
                                </span>
                              )}
                              {req.status === 'Open' && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                  Awaiting Donors...
                                </span>
                              )}

                              {req.status !== 'Fulfilled' && (
                                <button
                                  onClick={() => fulfillBloodRequest(req.id)}
                                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                                >
                                  Mark Fulfilled ✓
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete your blood request?')) {
                                    deleteBloodRequest(req.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete Post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* If someone accepted my post, show donor details */}
                          {req.status === 'Accepted' && (
                            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <p className="font-bold text-emerald-900">
                                  {req.acceptedByName} volunteered to donate blood!
                                </p>
                                <p className="text-emerald-700 text-[11px]">
                                  Message: "{req.donorMessage}"
                                </p>
                              </div>
                              <a
                                href={`tel:${req.acceptedByPhone}`}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call Donor: {req.acceptedByPhone}</span>
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Direct Requests Sent to Me as a Donor */}
                {myDonorProfile && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                          <HeartHandshake className="w-5 h-5 text-teal-600" />
                          <span>Direct Requests Received as Donor ({requestsSentToMe.length})</span>
                        </h4>
                        <p className="text-xs text-slate-500">Patients and attendants who requested blood directly from your profile</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        myDonorProfile.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {myDonorProfile.isAvailable ? 'Active Voluntary Donor' : 'Currently Unavailable'}
                      </span>
                    </div>

                    {requestsSentToMe.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No direct blood donation requests received yet.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {requestsSentToMe.map((req) => (
                          <div key={req.id} className="py-4 space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <p className="font-bold text-slate-900 text-sm">
                                  {req.requesterName} • {req.hospital} ({req.unitsNeeded} Bag(s) {req.bloodGroup})
                                </p>
                                <span className="text-xs text-slate-500">Needed by: {req.dateNeeded} • Contact: {req.requesterPhone}</span>
                                {req.notes && <p className="text-xs text-slate-600 italic mt-1">"{req.notes}"</p>}
                              </div>

                              <div className="flex items-center gap-2">
                                {req.status === 'Pending' ? (
                                  <>
                                    <button
                                      onClick={() => respondToDonorRequest(req.id, 'Accepted')}
                                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer"
                                    >
                                      Accept & Volunteer
                                    </button>
                                    <button
                                      onClick={() => respondToDonorRequest(req.id, 'Declined')}
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                  </>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {req.status === 'Accepted' ? 'You Accepted ✓' : 'Declined'}
                                  </span>
                                )}

                                <button
                                  onClick={() => {
                                    if (window.confirm('Delete this direct request record?')) {
                                      deleteDonorRequest(req.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                  title="Delete Direct Request Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Direct Requests Sent by Me to Donors */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                      <Send className="w-5 h-5 text-teal-600" />
                      <span>Direct Requests Sent by Me ({requestsSentByMe.length})</span>
                    </h4>
                    <p className="text-xs text-slate-500">Voluntary donors you directly contacted and their response status</p>
                  </div>

                  {requestsSentByMe.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      You have not sent direct requests to any donors yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {requestsSentByMe.map((req) => (
                        <div key={req.id} className="py-4 space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                Requested Donor: <strong className="text-teal-700">{req.donorName}</strong> ({req.bloodGroup} • {req.unitsNeeded} Bag(s))
                              </p>
                              <span className="text-xs text-slate-500">
                                Hospital: {req.hospital} • Needed by: {req.dateNeeded}
                              </span>
                              {req.notes && <p className="text-xs text-slate-600 italic mt-1">"{req.notes}"</p>}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                req.status === 'Accepted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : req.status === 'Declined'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {req.status === 'Accepted'
                                  ? 'Donor Accepted ✓'
                                  : req.status === 'Declined'
                                  ? 'Donor Declined'
                                  : 'Awaiting Donor Response'}
                              </span>

                              <button
                                onClick={() => {
                                  if (window.confirm('Delete this request record to free space?')) {
                                    deleteDonorRequest(req.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete Request Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Requests I Accepted to Donate */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                      <span>Requests I Committed to Donate ({requestsIAccepted.length})</span>
                    </h4>
                    <p className="text-xs text-slate-500">Patients and emergency requests you have volunteered to fulfill</p>
                  </div>

                  {requestsIAccepted.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      You have not volunteered for any blood requests yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {requestsIAccepted.map((req) => (
                        <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                              {req.bloodGroup}
                            </span>
                            <div>
                              <h5 className="font-bold text-slate-900 text-sm">{req.hospital} ({req.location})</h5>
                              <p className="text-xs text-slate-500">Attendant: {req.requesterName} • Contact: {req.contactPhone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${req.contactPhone}`}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Attendant</span>
                            </a>
                            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                              {req.status === 'Fulfilled' ? 'Completed ✓' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {/* Safety Disclaimer Banner */}
        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-teal-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Clinical Safety & Blood Transfusion Advisory</span>
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Voluntary blood donation is a vital humanitarian service. Prior to any blood transfusion, ensure mandatory laboratory cross-matching, antibody screening, and compatibility testing at certified clinical hospital facilities. Commercial trade or financial exchange for blood is strictly prohibited.
          </p>
        </div>

      </div>

      {/* Modals */}
      <CreateBloodRequestModal
        isOpen={isCreateRequestModalOpen}
        onClose={() => setIsCreateRequestModalOpen(false)}
        onOpenLogin={onOpenLogin}
      />

      <RegisterDonorModal
        isOpen={isRegisterDonorModalOpen}
        onClose={() => setIsRegisterDonorModalOpen(false)}
        onOpenLogin={onOpenLogin}
      />

      <AcceptBloodRequestModal
        request={selectedRequestForAccept}
        isOpen={!!selectedRequestForAccept}
        onClose={() => setSelectedRequestForAccept(null)}
        onOpenLogin={onOpenLogin}
      />

      <RequestDonorModal
        donor={selectedDonorForDirectRequest}
        onClose={() => setSelectedDonorForDirectRequest(null)}
        onOpenLogin={onOpenLogin}
      />
    </div>
  );
};
