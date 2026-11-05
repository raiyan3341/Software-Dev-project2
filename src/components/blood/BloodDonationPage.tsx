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
    fulfillBloodRequest,
    deleteBloodRequest,
    toggleDonorAvailability,
    deleteDonor,
    respondToDonorRequest,
  } = useMediStockStore();

  // Primary Tabs: 'requests' (রক্তের প্রয়োজন), 'donors' (রক্তদাতা তালিকা), 'my-activity' (আমার এক্টিভিটি)
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

  const requestsIAccepted = useMemo(() => {
    if (!currentUser) return [];
    return bloodRequests.filter((r) => r.acceptedById === currentUser.id);
  }, [bloodRequests, currentUser]);

  const totalMyActivityCount = myRequests.length + requestsSentToMe.length + requestsIAccepted.length;

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
              <span>জরুরি রক্তদান ও সন্ধান সেবা • Emergency Blood Network</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              জীবন বাঁচাতে রক্তের সন্ধান কিংবা রক্তদান — এক প্ল্যাটফর্মে
            </h1>

            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-2xl">
              সহজেই আপনার বা রোগীর রক্তের প্রয়োজনে পোস্ট করুন, অথবা রক্তদাতা হিসেবে প্রস্তুত হয়ে মানুষের পাশে দাঁড়ান।
              কোনো জটিলতা ছাড়াই সরাসরি যোগাযোগ করুন।
            </p>

            {/* Main Action CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsCreateRequestModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>রক্তের প্রয়োজন পোস্ট করুন</span>
              </button>

              <button
                onClick={() => setIsRegisterDonorModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                <span>{myDonorProfile ? 'ডোনার প্রোফাইল দেখুন/আপডেট' : 'রক্ত দিতে প্রস্তুত (Join as Donor)'}</span>
              </button>
            </div>
          </div>
        </div>

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
              <span>রক্তের প্রয়োজন (Requests)</span>
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
              <span>রক্ত দিতে প্রস্তুত (Donors)</span>
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
              <span>আমার এক্টিভিটি (My Activity)</span>
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
            <span>লাইভ কমিউনিটি নেটওয়ার্ক</span>
          </div>
        </div>

        {/* Filter Bar (Visible in Requests and Donors tabs) */}
        {activeTab !== 'my-activity' && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            {/* Blood Group Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">গ্রুপ:</span>
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
                  {bg === 'All' ? 'সকল গ্রুপ (All)' : bg}
                </button>
              ))}
            </div>

            {/* City Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 border-t border-slate-100">
              <div className="sm:col-span-4">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white"
                >
                  <option value="All">সকল শহর / বিভাগ (All Locations)</option>
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                  <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                  <option value="Khulna">Khulna (খুলনা)</option>
                  <option value="Barisal">Barisal (বরিশাল)</option>
                  <option value="Rangpur">Rangpur (রংপুর)</option>
                  <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                  <option value="Comilla">Comilla (কুমিল্লা)</option>
                </select>
              </div>

              <div className="sm:col-span-8 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="হাসপাতাল, এলাকা বা ব্যক্তির নাম দিয়ে সার্চ করুন..."
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
                  <span>জরুরি রক্তের পোস্টসমূহ (Live Blood Requests)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    {filteredRequests.length} টি পোস্ট
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  যেকোনো পোস্ট দেখে আপনি সরাসরি রক্তদানে সম্মতি (Accept) জানাতে পারেন।
                </p>
              </div>

              <button
                onClick={() => setIsCreateRequestModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন পোস্ট</span>
              </button>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
                  <Droplet className="w-8 h-8 fill-rose-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">বর্তমানে কোনো রক্তের রিকুয়েস্ট নেই</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  আপনার বা আপনার পরিচিত কারও রক্তের প্রয়োজন হলে এখনই পোস্ট করুন। রক্তদাতারা সাথে সাথে দেখতে পাবেন।
                </p>
                <button
                  onClick={() => setIsCreateRequestModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  রক্তের জন্য পোস্ট করুন
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
                          <div className="flex items-center gap-2">
                            <span className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-rose-600/30 shrink-0">
                              {req.bloodGroup}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">
                                {req.unitsNeeded} ব্যাগ প্রয়োজন
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                তারিখ: {req.dateNeeded}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${urgencyStyles[req.urgency] || 'bg-slate-100'}`}>
                              {req.urgency}
                            </span>
                            {isMyPost && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                                আপনার পোস্ট
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
                          <span>পোস্টকারী: <strong className="text-slate-800">{req.requesterName}</strong></span>
                          <span>মোবাইল: <strong className="text-slate-800">{req.contactPhone}</strong></span>
                        </div>

                        {/* Accepted Status Banner */}
                        {req.status === 'Accepted' && (
                          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>রক্তদাতা পাওয়া গেছে!</span>
                            </div>
                            <p className="text-[11px] text-emerald-700">
                              দাতা: <strong>{req.acceptedByName}</strong> ({req.acceptedByPhone})
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
                          <span className="w-full text-center py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs">
                            রক্ত পাওয়া সম্পন্ন হয়েছে ✓
                          </span>
                        ) : isMyPost ? (
                          // Owner of the post
                          <div className="w-full flex items-center gap-2">
                            <button
                              onClick={() => fulfillBloodRequest(req.id)}
                              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              রক্ত পেয়েছি (Complete)
                            </button>
                            <button
                              onClick={() => deleteBloodRequest(req.id)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Delete Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : req.status === 'Accepted' ? (
                          <span className="w-full text-center py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                            দানকারী নিশ্চিত করেছেন (In Progress)
                          </span>
                        ) : (
                          // Another user viewing the open post
                          <div className="w-full flex items-center gap-2">
                            <button
                              onClick={() => setSelectedRequestForAccept(req)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Heart className="w-3.5 h-3.5 fill-white" />
                              <span>দান করতে রাজি (Accept)</span>
                            </button>
                            <a
                              href={`tel:${req.contactPhone}`}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center"
                              title="Call Contact"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
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
                  <span>রক্ত দিতে প্রস্তুত (Available Donors Feed)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                    {filteredDonors.length} জন রক্তদাতা
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  নিবন্ধিত রক্তদাতাদের তালিকা। রোগীর প্রয়োজনে সরাসরি রক্তদাতার কাছে অনুরোধ পাঠান।
                </p>
              </div>

              <button
                onClick={() => setIsRegisterDonorModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{myDonorProfile ? 'আমার ডোনার তথ্য' : '+ রক্তদাতা হন'}</span>
              </button>
            </div>

            {filteredDonors.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">কোনো রক্তদাতা পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  আপনার রক্তের গ্রুপ বা শহর নির্বাচন করে ফিল্টার বদলান অথবা প্রথম রক্তদাতা হিসেবে যুক্ত হন।
                </p>
                <button
                  onClick={() => setIsRegisterDonorModalOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  রক্তদাতা হিসেবে যুক্ত হন
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
                                    আপনি
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
                          <span className="text-slate-400">স্ট্যাটাস:</span>
                          {donor.isAvailable ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              রক্তদানে প্রস্তুত (Available)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">
                              আপাতত অপ্রস্তুত
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
                              {donor.isAvailable ? 'অপ্রস্তুত করুন' : 'প্রস্তুত করুন'}
                            </button>
                            <button
                              onClick={() => setIsRegisterDonorModalOpen(true)}
                              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                            >
                              এডিট
                            </button>
                            <button
                              onClick={() => deleteDonor(donor.id)}
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
                              <span>রক্তের অনুরোধ পাঠান (Request)</span>
                            </button>
                            <a
                              href={`tel:${donor.phone}`}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center"
                              title="Call Donor"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
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
                <h4 className="font-bold text-slate-900 text-lg">আপনার এক্টিভিটি দেখতে লগইন করুন</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  আপনার করা রক্তের রিকুয়েস্ট, রক্তদাতা হিসেবে প্রাপ্ত অনুরোধ এবং আপনার গ্রহণের হিস্ট্রি দেখতে অনুগ্রহ করে সাইন ইন করুন।
                </p>
                <button
                  onClick={onOpenLogin}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  লগইন / সাইন আপ করুন
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
                        <span>আমার রক্তের পোস্টসমূহ ({myRequests.length})</span>
                      </h4>
                      <p className="text-xs text-slate-500">আপনার তৈরি করা রক্তের রিকুয়েস্ট এবং সেগুলোর লাইভ স্ট্যাটাস</p>
                    </div>

                    <button
                      onClick={() => setIsCreateRequestModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>নতুন পোস্ট</span>
                    </button>
                  </div>

                  {myRequests.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      আপনি এখনও কোনো রক্তের রিকুয়েস্ট পোস্ট করেননি।
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
                                <span className="text-xs text-slate-500">{req.location} • {req.unitsNeeded} ব্যাগ • তারিখ: {req.dateNeeded}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {req.status === 'Accepted' && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                  দানকারী পাওয়া গেছে!
                                </span>
                              )}
                              {req.status === 'Fulfilled' && (
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                  সম্পন্ন হয়েছে ✓
                                </span>
                              )}
                              {req.status === 'Open' && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                  রক্তদাতার অপেক্ষায়...
                                </span>
                              )}

                              {req.status !== 'Fulfilled' && (
                                <button
                                  onClick={() => fulfillBloodRequest(req.id)}
                                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                                >
                                  রক্ত পেয়েছি
                                </button>
                              )}

                              <button
                                onClick={() => deleteBloodRequest(req.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Delete"
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
                                  {req.acceptedByName} রক্ত দিতে সম্মতি জানিয়েছেন!
                                </p>
                                <p className="text-emerald-700 text-[11px]">
                                  মেসেজ: "{req.donorMessage}"
                                </p>
                              </div>
                              <a
                                href={`tel:${req.acceptedByPhone}`}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>কল করুন: {req.acceptedByPhone}</span>
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
                          <span>রক্তদাতা হিসেবে আমাকে করা অনুরোধসমূহ ({requestsSentToMe.length})</span>
                        </h4>
                        <p className="text-xs text-slate-500">অন্যান্য ব্যবহারকারীরা সরাসরি আপনার প্রোফাইলে যে অনুরোধ পাঠিয়েছেন</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        myDonorProfile.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {myDonorProfile.isAvailable ? 'সক্রিয় রক্তদাতা' : 'অপ্রস্তুত'}
                      </span>
                    </div>

                    {requestsSentToMe.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        এখনও কেউ আপনাকে সরাসরি রক্তের অনুরোধ পাঠায়নি।
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {requestsSentToMe.map((req) => (
                          <div key={req.id} className="py-4 space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <p className="font-bold text-slate-900 text-sm">
                                  {req.requesterName} • {req.hospital} ({req.unitsNeeded} ব্যাগ {req.bloodGroup})
                                </p>
                                <span className="text-xs text-slate-500">প্রয়োজনের তারিখ: {req.dateNeeded} • ফোন: {req.requesterPhone}</span>
                                {req.notes && <p className="text-xs text-slate-600 italic mt-1">"{req.notes}"</p>}
                              </div>

                              <div className="flex items-center gap-2">
                                {req.status === 'Pending' ? (
                                  <>
                                    <button
                                      onClick={() => respondToDonorRequest(req.id, 'Accepted')}
                                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer"
                                    >
                                      সম্মত (Accept)
                                    </button>
                                    <button
                                      onClick={() => respondToDonorRequest(req.id, 'Declined')}
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                                    >
                                      অপারগ (Decline)
                                    </button>
                                  </>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {req.status === 'Accepted' ? 'আপনি সম্মত হয়েছেন ✓' : 'প্রত্যাখ্যান করা হয়েছে'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Requests I Accepted to Donate */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                      <span>আমি যেসব রিকুয়েস্টে দান করতে সম্মত হয়েছি ({requestsIAccepted.length})</span>
                    </h4>
                    <p className="text-xs text-slate-500">যেসব রোগীর রক্তদানের দায়িত্ব আপনি গ্রহণ করেছেন</p>
                  </div>

                  {requestsIAccepted.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      আপনি এখনও কোনো রিকুয়েস্টে রক্তদানে সম্মত হননি।
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
                              <p className="text-xs text-slate-500">রোগীর স্বজন: {req.requesterName} • ফোন: {req.contactPhone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${req.contactPhone}`}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>কল করুন</span>
                            </a>
                            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                              {req.status === 'Fulfilled' ? 'সম্পন্ন ✓' : 'চলমান'}
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
            <span>চিকিৎসাগত নিরাপত্তা ও রক্তদান সংক্রান্ত তথ্য</span>
          </p>
          <p className="text-[11px] leading-relaxed text-slate-600">
            রক্তদান একটি মহৎ মানবিক কাজ। রক্তগ্রহণের পূর্বে অবশ্যই অনুমোদিত হাসপাতাল বা প্যাথলজি ল্যাবে ক্রস-ম্যাচিং ও স্ক্রিনিং টেস্ট নিশ্চিত করুন। রক্তদানের জন্য কোনো আর্থিক লেনদেন করবেন না।
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
