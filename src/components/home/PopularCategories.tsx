import React from 'react';
import { 
  Wind, 
  Flame, 
  Activity, 
  HeartPulse, 
  PlusSquare, 
  Sparkles, 
  Shield, 
  Thermometer, 
  ArrowRight 
} from 'lucide-react';

interface PopularCategoriesProps {
  onSelectCategory: (slug: string) => void;
  onViewAll: () => void;
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({
  onSelectCategory,
  onViewAll,
}) => {
  const categories = [
    { name: 'Cold & Cough', slug: 'cold-cough', icon: Wind, color: 'text-sky-600 bg-sky-50 hover:bg-sky-100 border-sky-100' },
    { name: 'Gastric & Digestive', slug: 'gastric-digestive', icon: Flame, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-100' },
    { name: 'Blood Pressure', slug: 'blood-pressure', icon: Activity, color: 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-100' },
    { name: 'Diabetes', slug: 'diabetes', icon: HeartPulse, color: 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border-cyan-100' },
    { name: 'First Aid', slug: 'first-aid', icon: PlusSquare, color: 'text-red-600 bg-red-50 hover:bg-red-100 border-red-100' },
    { name: 'Creams & Ointments', slug: 'creams-ointments', icon: Sparkles, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-100' },
    { name: 'Masks', slug: 'masks', icon: Shield, color: 'text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-100' },
    { name: 'Thermometer', slug: 'thermometers', icon: Thermometer, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-100' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching Project.png */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Quick access to high-demand clinical categories
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 8 Category Icon Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs hover:shadow-md transition-all group hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-1.5 sm:mb-3 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-800 text-center leading-tight group-hover:text-teal-700">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

