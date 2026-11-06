import React, { useState } from 'react';
import {
  Building2,
  Check,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { OrganizationType } from '../../types';

interface OrganizationRegisterPageProps {
  onNavigate: (view: string) => void;
  onOpenLogin?: (mode?: 'signin' | 'signup', redirect?: string) => void;
}

export const OrganizationRegisterPage: React.FC<OrganizationRegisterPageProps> = ({ onNavigate, onOpenLogin }) => {
  const { registerOrganization, currentUser } = useMediStockStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields matching Project.png Screen 4
  const [name, setName] = useState('');
  const [type, setType] = useState<OrganizationType | ''>('');
  const [representative, setRepresentative] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');

  // Documents
  const [documents, setDocuments] = useState<Array<{ name: string; type: string; url: string; size: string }>>([
    { name: 'DGHS_Healthcare_License_2025.pdf', type: 'Official License', url: '#', size: '2.1 MB' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Errors & Submission
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdOrgId, setCreatedOrgId] = useState<string>('');

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Organization name is required';
    if (!type) newErrors.type = 'Please select an organization type';
    if (!representative.trim()) newErrors.representative = 'Authorized representative name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid business email is required';
    if (!phone.trim()) newErrors.phone = 'Contact phone number is required';
    if (!address.trim()) newErrors.address = 'Full address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setIsUploading(true);
      const file = files[0];
      setTimeout(() => {
        setDocuments(prev => [
          ...prev,
          {
            name: file.name,
            type: type === 'Pharmacy' ? 'Drug License' : 'Hospital Registration',
            url: '#',
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          }
        ]);
        setIsUploading(false);
      }, 500);
    }
  };

  const handleRemoveDoc = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = () => {
    const newOrg = registerOrganization({
      name,
      type: type as OrganizationType,
      representative,
      email,
      phone,
      address,
      city,
      documents,
    });

    setCreatedOrgId(newOrg.id);
    setIsSubmitted(true);
  };

  // If not logged in, require sign up / sign in with their own password first
  if (!currentUser) {
    return (
      <div className="min-h-[75vh] bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold uppercase tracking-wider border border-teal-200">
              Healthcare Facility Portal
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In or Sign Up Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To register a hospital, pharmacy, or clinic, please sign in or create an account with your own password first. This ensures you maintain full secure access to your organization dashboard.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onOpenLogin?.('signup', 'register-org')}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Create Account (Sign Up)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenLogin?.('signin', 'register-org')}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If successfully submitted, show verification pending confirmation
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
              Verification Status: Pending Review
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Submitted!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for registering <strong>{name}</strong>. Our medical compliance administration team will review your license and supporting documents within 24 hours.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Organization Name:</span>
              <span className="font-bold text-slate-800">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type:</span>
              <span className="font-bold text-slate-800">{type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Authorized Rep:</span>
              <span className="font-bold text-slate-800">{representative}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Documents Attached:</span>
              <span className="font-bold text-teal-700">{documents.length} verified file(s)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                onNavigate('org-dashboard');
              }}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
            >
              Go to Organization Portal
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all"
            >
              Browse Public Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Step Indicator Header matching Project.png Screen 4 */}
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                currentStep >= 1
                  ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}>
                {currentStep > 1 ? <Check className="w-5 h-5 stroke-[2.5]" /> : '1'}
              </div>
              <span className={`text-xs font-semibold mt-2 ${currentStep >= 1 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
                1. Basic Info
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                currentStep >= 2
                  ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}>
                {currentStep > 2 ? <Check className="w-5 h-5 stroke-[2.5]" /> : '2'}
              </div>
              <span className={`text-xs font-semibold mt-2 ${currentStep >= 2 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
                2. Documents
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                currentStep === 3
                  ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}>
                3
              </div>
              <span className={`text-xs font-semibold mt-2 ${currentStep === 3 ? 'text-teal-700 font-bold' : 'text-slate-400'}`}>
                3. Review
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Form Card + Right Why Register Card matching Project.png */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Card (7 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Register Your Organization
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Join MediStock and get access to quality healthcare supplies.
                  </p>
                </div>

                <form onSubmit={handleNextStep1} className="space-y-5">
                  <div className="border-t border-slate-100 pt-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Organization Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Organization Name */}
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Organization Name *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter hospital / pharmacy / clinic name"
                          className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                        />
                        {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                      </div>

                      {/* Organization Type */}
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Organization Type *
                        </label>
                        <select
                          value={type}
                          onChange={(e: any) => setType(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all cursor-pointer"
                        >
                          <option value="">Select type</option>
                          <option value="Pharmacy">Pharmacy</option>
                          <option value="Hospital">Hospital</option>
                          <option value="Clinic">Clinic</option>
                        </select>
                        {errors.type && <p className="text-[11px] text-rose-600 mt-1">{errors.type}</p>}
                      </div>

                      {/* Authorized Representative Name */}
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Authorized Representative Name *
                        </label>
                        <input
                          type="text"
                          value={representative}
                          onChange={(e) => setRepresentative(e.target.value)}
                          placeholder="Enter representative name"
                          className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                        />
                        {errors.representative && <p className="text-[11px] text-rose-600 mt-1">{errors.representative}</p>}
                      </div>

                      {/* Email Address */}
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                        />
                        {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                      </div>

                      {/* Phone Number */}
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                        />
                        {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                      </div>

                      {/* City */}
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          City / Division *
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all cursor-pointer"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barisal">Barisal</option>
                          <option value="Rangpur">Rangpur</option>
                          <option value="Mymensingh">Mymensingh</option>
                        </select>
                      </div>

                      {/* Full Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Address *
                        </label>
                        <textarea
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Full address (Street, Road, Area, Ward/Thana)"
                          className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                        />
                        {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons matching Project.png */}
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onNavigate('home')}
                      className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs sm:text-sm transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-7 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-teal-600/25 transition-all flex items-center gap-2"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Supporting Documents */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Upload Supporting Documents
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Upload trade license, pharmacy drug license, or DGHS clinical establishment permit.
                  </p>
                </div>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-teal-300 rounded-2xl p-8 bg-teal-50/30 text-center hover:bg-teal-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {isUploading ? 'Uploading Document...' : 'Click to upload regulatory documents'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    PDF, JPG, PNG up to 10MB (Drug license, Trade license, DGHS permit)
                  </p>
                  <label className="mt-4 inline-block px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer shadow-xs">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </label>
                </div>

                {/* Attached Documents List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Attached Verification Files ({documents.length})
                  </h4>
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800">{doc.name}</p>
                          <span className="text-[11px] text-slate-400">{doc.type} • {doc.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDoc(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Step 2 Actions */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-7 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2"
                  >
                    <span>Next: Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Review Application
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Please confirm your details before submitting to the administrator.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Organization Name:</span>
                      <strong className="text-slate-900 text-sm">{name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Type:</span>
                      <strong className="text-teal-700 text-sm">{type}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Authorized Representative:</span>
                      <span className="text-slate-800 font-semibold">{representative}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Business Email:</span>
                      <span className="text-slate-800 font-semibold">{email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Contact Phone:</span>
                      <span className="text-slate-800 font-semibold">{phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">City & Division:</span>
                      <span className="text-slate-800 font-semibold">{city}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Registered Physical Address:</span>
                      <span className="text-slate-800">{address}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-600 block mb-2">
                      Attached Documents ({documents.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {documents.map((d, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                          <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                          {d.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Declarations */}
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 text-xs text-slate-700 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-teal-600 mt-0.5" />
                    <span>
                      I hereby declare that I am the legal owner or authorized representative of this medical establishment. The documents submitted are authentic.
                    </span>
                  </label>
                </div>

                {/* Step 3 Actions */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Documents</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-600/25 transition-all flex items-center gap-2"
                  >
                    <span>Submit Official Application</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right "Why Register?" Info Card matching Project.png (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Why Register?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Benefits exclusively for verified pharmacies and hospitals:
              </p>
            </div>

            {/* Checklist matching Project.png */}
            <div className="space-y-4">
              {[
                { title: 'Access to bulk pricing', desc: 'Direct distributor rates on essential medicines.' },
                { title: 'Track your orders', desc: 'Real-time dispatch updates and delivery logs.' },
                { title: 'Manage inventory', desc: 'Batch number traceability and expiry date notifications.' },
                { title: 'Get product alerts', desc: 'Instant restock alerts on high-demand supplies.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Healthcare Facility Illustration matching Project.png */}
            <div className="pt-4 border-t border-slate-100">
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-6 border border-teal-100 text-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-md mx-auto flex items-center justify-center text-teal-600 mb-3 border border-teal-100">
                  <Building2 className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                  Licensed Medical Network
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Over 40+ hospitals, pharmacies and clinics verified nationwide.
                </p>
              </div>
            </div>

            {/* DGHS Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Registered under DGHS Bangladesh e-Healthcare directives.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

