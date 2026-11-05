import React, { useState } from 'react';
import {
  Building2,
  Store,
  User,
  Heart,
  Droplet,
  ShieldCheck,
  Truck,
  FileText,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  FileCheck,
  AlertCircle,
  PhoneCall,
  Activity,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (view: string, categoryFilter?: string) => void;
  onOpenLogin?: () => void;
}

type PersonaKey = 'hospital' | 'pharmacy' | 'patient' | 'blood';

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate, onOpenLogin }) => {
  const [activePersona, setActivePersona] = useState<PersonaKey>('hospital');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const personas = [
    {
      id: 'hospital' as PersonaKey,
      label: 'Hospitals & Clinics',
      badge: 'Institutional B2B',
      icon: Building2,
      color: 'teal',
      accentBg: 'bg-teal-50 text-teal-700 border-teal-200',
      activeTabClass: 'bg-teal-600 text-white shadow-lg shadow-teal-600/25',
    },
    {
      id: 'pharmacy' as PersonaKey,
      label: 'Retail Pharmacies',
      badge: 'Wholesale Restock',
      icon: Store,
      color: 'blue',
      accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
      activeTabClass: 'bg-blue-600 text-white shadow-lg shadow-blue-600/25',
    },
    {
      id: 'patient' as PersonaKey,
      label: 'Patients & Citizens',
      badge: 'Home Healthcare',
      icon: User,
      color: 'indigo',
      accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      activeTabClass: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25',
    },
    {
      id: 'blood' as PersonaKey,
      label: 'Blood Donors & Seekers',
      badge: 'Emergency Network',
      icon: Droplet,
      color: 'rose',
      accentBg: 'bg-rose-50 text-rose-700 border-rose-200',
      activeTabClass: 'bg-rose-600 text-white shadow-lg shadow-rose-600/25',
    },
  ];

  const personaWorkflows: Record<
    PersonaKey,
    {
      title: string;
      description: string;
      ctaText: string;
      ctaAction: () => void;
      steps: {
        stepNum: string;
        title: string;
        desc: string;
        highlight: string;
        icon: any;
      }[];
    }
  > = {
    hospital: {
      title: 'Institutional Procurement Workflow for Hospitals & Medical Clinics',
      description:
        'Designed specifically for chief pharmacists, inventory officers, and medical directors requiring bulk DGHS-certified medications, IV fluids, and surgical supplies with batch transparency.',
      ctaText: 'Register Hospital / Clinic Now',
      ctaAction: () => onNavigate('register-org'),
      steps: [
        {
          stepNum: '01',
          title: 'Organization Registration & License Verification',
          desc: 'Submit your hospital or clinical diagnostic facility information along with DGHS license number and location. Our admin desk verifies credentials within 2 hours.',
          highlight: 'Official DGHS Clinical Verification',
          icon: ShieldCheck,
        },
        {
          stepNum: '02',
          title: 'Direct Wholesale Sourcing & Dynamic Demand',
          desc: 'Access institutional wholesale pricing across branded medicines, emergency injectables, and surgical kits. If a rare oncology or cardiac drug is out of stock, submit a Product Demand Request directly.',
          highlight: 'Batch Numbers & Expiry Guarantee',
          icon: Search,
        },
        {
          stepNum: '03',
          title: 'Cold-Chain Monitored Logistics Dispatch',
          desc: 'Sensitive pharmaceuticals (insulin, vaccines, biologics) are dispatched under strict 2°C–8°C thermal monitoring with real-time delivery status updates.',
          highlight: 'Certified Temperature Control',
          icon: Truck,
        },
        {
          stepNum: '04',
          title: 'Printable Tax Invoices & Delivery Challans',
          desc: 'Automated computerized invoice generation with VAT breakdown and official digital challans for internal hospital audits and accounting.',
          highlight: 'Complete Regulatory Audit Trail',
          icon: FileCheck,
        },
      ],
    },
    pharmacy: {
      title: 'Wholesale Restocking Workflow for Community Drugstores',
      description:
        'Eliminate multi-tiered broker markups, counterfeit drug hazards, and sudden inventory shortages. Restock fast with guaranteed authentic supplies.',
      ctaText: 'Onboard Your Pharmacy',
      ctaAction: () => onNavigate('register-org'),
      steps: [
        {
          stepNum: '01',
          title: 'Fast Trade License Onboarding',
          desc: 'Register your retail dispensary with your pharmacy trade license. Receive institutional purchasing approval to access wholesale catalog tiers.',
          highlight: 'Quick Commercial Onboarding',
          icon: Store,
        },
        {
          stepNum: '02',
          title: 'Transparent Pricing & Bulk Margins',
          desc: 'Procure high-demand OTC medications, antibiotics, inhalers, and diagnostic equipment directly from verified manufacturing distributors.',
          highlight: 'Regulated Wholesale Pricing',
          icon: Package,
        },
        {
          stepNum: '03',
          title: 'Real-Time Inventory & Auto-Sync Cart',
          desc: 'Live stock quantities mean zero ghost inventory. Build reorder lists, track orders in real time, and receive alerts when critical items restock.',
          highlight: 'Zero Ghost Inventory',
          icon: Activity,
        },
        {
          stepNum: '04',
          title: 'Direct Doorstep Delivery & Challan',
          desc: 'Reliable warehouse-to-pharmacy courier dispatch with signed delivery verification and digital invoice archiving.',
          highlight: 'Fast Restocking Cycle',
          icon: CheckCircle2,
        },
      ],
    },
    patient: {
      title: 'Patient & Family Medical Ordering Workflow',
      description:
        'Access 100% genuine prescriptions, essential chronic medications, and personal medical devices delivered securely with full quality guarantees.',
      ctaText: 'Browse Genuine Medicines',
      ctaAction: () => onNavigate('products'),
      steps: [
        {
          stepNum: '01',
          title: 'Free Instant Account Creation',
          desc: 'Sign up securely using your email or Google account in under 10 seconds. No complicated forms or hidden subscription fees.',
          highlight: 'Free & Safe Account Access',
          icon: User,
        },
        {
          stepNum: '02',
          title: 'Smart Search & Category Filtering',
          desc: 'Locate genuine medicines instantly with our real-time smart filter. Filter by symptoms (fever, cough, first aid) or clinical categories.',
          highlight: 'Real-Time Dynamic Search',
          icon: Search,
        },
        {
          stepNum: '03',
          title: 'Instant Cart & Secure Checkout',
          desc: 'Add items with one click, adjust quantities effortlessly in the live cart drawer, and review transparent pricing with Cash-on-Delivery support.',
          highlight: 'Real-time Synchronized Cart',
          icon: Package,
        },
        {
          stepNum: '04',
          title: 'Live Order Tracking & Profile Sync',
          desc: 'Monitor your order from Confirmed to Dispatched. View complete purchase history and download digital receipts from your personal dashboard.',
          highlight: 'Track Every Milestone',
          icon: Clock,
        },
      ],
    },
    blood: {
      title: 'Community Emergency Blood Donation & Coordination',
      description:
        'A life-saving, zero-cost humanitarian network bridging hospitalized patients with voluntary blood donors across all 64 districts of Bangladesh.',
      ctaText: 'Open Blood Network',
      ctaAction: () => onNavigate('blood'),
      steps: [
        {
          stepNum: '01',
          title: 'Post Emergency Blood Request in 30 Seconds',
          desc: 'Specify the required blood group (A+, B+, O+, AB-, etc.), hospital location, units needed, and urgency level (Critical, Urgent, Normal).',
          highlight: 'Instant Community Broadcast',
          icon: Droplet,
        },
        {
          stepNum: '02',
          title: 'Volunteer Donors Step Forward',
          desc: 'Registered volunteer donors browse live emergency requests or receive direct patient requests and click "I Want to Donate" with a personal message.',
          highlight: 'Direct Voluntary Response',
          icon: Heart,
        },
        {
          stepNum: '03',
          title: 'Direct Phone Coordination & Hospital Match',
          desc: 'The requester and confirmed donor can call directly to arrange the clinical cross-matching and transfusion at the certified hospital facility.',
          highlight: 'No Middleman / Completely Free',
          icon: PhoneCall,
        },
        {
          stepNum: '04',
          title: 'Mark Fulfilled & Free Database Storage',
          desc: 'Once transfusion is complete, mark the request as Fulfilled or delete it with 1 click to keep the active feed clean and optimize database space.',
          highlight: 'Clean Real-Time Management',
          icon: CheckCircle2,
        },
      ],
    },
  };

  const faqs = [
    {
      q: 'How does hospital and pharmacy verification work on MediStock?',
      a: 'Healthcare establishments submit their official DGHS clinical registration or municipal pharmacy trade license number during registration. Our compliance desk validates the documentation against official records before approving wholesale B2B procurement privileges.',
    },
    {
      q: 'Are all medicines guaranteed genuine and DGHS-compliant?',
      a: 'Yes, 100%. MediStock directly partners with licensed pharmaceutical manufacturers in Bangladesh including Square, Beximco, Incepta, Renata, ACME, and Eskayef. Every batch includes manufacturer lot numbers, manufacturing dates, and verified expiry dates.',
    },
    {
      q: 'How does temperature-controlled cold-chain delivery operate?',
      a: 'Temperature-sensitive products like Insulin, Vaccines, and Biologics are packed in insulated thermal boxes with calibrated ice packs and temperature indicator tags, maintaining a strict 2°C to 8°C environment throughout transit.',
    },
    {
      q: 'Is the Blood Donation network completely free of charge?',
      a: 'Absolutely. Voluntary blood donation is a vital humanitarian service. MediStock never charges any fees for posting requests, registering as a donor, or connecting parties. Commercial blood trade is strictly prohibited.',
    },
    {
      q: 'What is the "Product Demand Request" feature for organizations?',
      a: 'If a specialized medicine, rare injectable, or high-volume surgical supply is temporarily unlisted or out of stock, verified organizations can submit a formal demand request specifying quantity and clinical need. Admins review and fulfill via manufacturer direct allocation.',
    },
    {
      q: 'Can ordinary patients purchase medicines directly for home use?',
      a: 'Yes. Regular citizens can create a free account, browse over-the-counter and general healthcare supplies, add them to their real-time cart, and receive home delivery with cash-on-delivery or verified digital payment.',
    },
  ];

  const currentWorkflow = personaWorkflows[activePersona];

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Digital Healthcare Supply & Emergency Coordination</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How MediStock Works
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From verified pharmaceutical manufacturing to hospital bedside delivery and emergency volunteer blood matching — explore our streamlined, transparent healthcare workflow.
          </p>
        </div>

        {/* Persona Tabs Navigation */}
        <div className="bg-white rounded-3xl p-2.5 border border-slate-200/90 shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {personas.map((p) => {
              const Icon = p.icon;
              const isActive = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p.id)}
                  className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? p.activeTabClass
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-center leading-tight">{p.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {p.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Workflow Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{currentWorkflow.title}</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                {currentWorkflow.description}
              </p>
            </div>

            <button
              onClick={currentWorkflow.ctaAction}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 self-start md:self-auto"
            >
              <span>{currentWorkflow.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Step Visual Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {currentWorkflow.steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 hover:border-teal-500 transition-all hover:shadow-md flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-teal-600/20">
                        {step.stepNum}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <StepIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{step.highlight}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Core Pillars of MediStock */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Healthcare Leaders Rely on MediStock
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              We eliminate the traditional bottlenecks, counterfeits, and delays of clinical procurement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">100% Genuine DGHS Drugs</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct manufacturer-backed inventory with verified lot numbers and verifiable expiry dates.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Cold-Chain Temperature Assurance</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Insulated logistics preserving biologic integrity at 2°C–8°C from warehouse to clinical dispensary.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Printable Tax Invoices</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant computerized VAT invoices, official challans, and real-time ledger accounting for audits.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Zero-Fee Blood Network</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Empowering patients and voluntary blood donors to save lives without brokers or commercial exploitation.
              </p>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-500">
                Common questions about accounts, verification, quality standards, and logistics.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action Hero Card */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center space-y-6">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Upgrade Your Healthcare Supply Chain?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join leading hospitals, clinics, diagnostic centers, and voluntary blood donors registered across Bangladesh.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('register-org')}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
              >
                Register Organization
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer"
              >
                Explore Medicine Catalog
              </button>
              <button
                onClick={() => onNavigate('blood')}
                className="px-6 py-3 rounded-2xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Emergency Blood Network
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

