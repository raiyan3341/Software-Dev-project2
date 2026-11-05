import React from 'react';
import { Pill, Shield, Sparkles, Activity, HeartHandshake } from 'lucide-react';

interface QuickCategoryCardsProps {
  onSelectCategory: (categorySlug: string) => void;
  onNavigateBlood: () => void;
}

export const QuickCategoryCards: React.FC<QuickCategoryCardsProps> = ({
  onSelectCategory,
  onNavigateBlood,
}) => {
  const cards = [
    {
      id: 'medicines',
      title: 'Medicines',
      subtitle: 'Tablets, Syrups, Capsules',
      icon: Pill,
      iconBg: 'bg-blue-50 text-blue-600',
      action: () => onSelectCategory('tablets-capsules'),
    },
    {
      id: 'supplies',
      title: 'Medical Supplies',
      subtitle: 'Masks, Gloves, Equipment',
      icon: Shield,
      iconBg: 'bg-cyan-50 text-cyan-600',
      action: () => onSelectCategory('masks'),
    },
    {
      id: 'care',
      title: 'Personal Care',
      subtitle: 'Creams, Hygiene, etc',
      icon: Sparkles,
      iconBg: 'bg-amber-50 text-amber-600',
      action: () => onSelectCategory('creams-ointments'),
    },
    {
      id: 'devices',
      title: 'Health Devices',
      subtitle: 'Thermometers, BP Monitor',
      icon: Activity,
      iconBg: 'bg-indigo-50 text-indigo-600',
      action: () => onSelectCategory('medical-equipment'),
    },
    {
      id: 'blood',
      title: 'Blood Donation',
      subtitle: 'Donate or Find Donors',
      icon: HeartHandshake,
      iconBg: 'bg-rose-50 text-rose-600',
      action: onNavigateBlood,
      isSpecial: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.action}
              className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-1 ${
                card.isSpecial ? 'hover:border-rose-300' : 'hover:border-teal-400'
              }`}
            >
              <div className="flex flex-col items-start gap-2 sm:gap-3">
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${card.iconBg} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-teal-700 transition-colors leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-snug line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

