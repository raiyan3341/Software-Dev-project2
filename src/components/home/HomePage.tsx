import React from 'react';
import { HeroSection } from './HeroSection';
import { QuickCategoryCards } from './QuickCategoryCards';
import { PopularCategories } from './PopularCategories';
import { FeaturedProductsPreview } from './FeaturedProductsPreview';
import { RestockWorkflowSection } from './RestockWorkflowSection';
import { BloodCTASection } from './BloodCTASection';
import { BenefitsSection } from './BenefitsSection';
import { Product } from '../../types';

interface HomePageProps {
  onNavigate: (view: string, categoryFilter?: string) => void;
  onOpenProductModal: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenProductModal }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section matching Project.png */}
      <HeroSection
        onShopNow={() => onNavigate('products')}
        onLearnMore={() => onNavigate('how-it-works')}
      />

      {/* 2. 5 Quick Category Feature Cards matching Project.png */}
      <QuickCategoryCards
        onSelectCategory={(slug) => onNavigate('products', slug)}
        onNavigateBlood={() => onNavigate('blood')}
      />

      {/* 3. Popular Categories (8 circular icon cards) matching Project.png */}
      <PopularCategories
        onSelectCategory={(slug) => onNavigate('products', slug)}
        onViewAll={() => onNavigate('products')}
      />

      {/* 4. Featured Healthcare Products (Paracetamol, N95 Mask, Vitamin C, Thermometer) */}
      <FeaturedProductsPreview
        onViewAll={() => onNavigate('products')}
        onOpenProductModal={onOpenProductModal}
      />

      {/* 5. How Hospitals and Pharmacies Restock */}
      <RestockWorkflowSection
        onRegisterOrg={() => onNavigate('register-org')}
      />

      {/* 6. Blood Donation Humanitarian CTA */}
      <BloodCTASection
        onFindDonors={() => onNavigate('blood')}
        onRegisterDonor={() => onNavigate('blood')}
      />

      {/* 7. Institutional Benefits & Verification Standards */}
      <BenefitsSection />
    </div>
  );
};

