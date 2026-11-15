import React from 'react';
import { Hero } from '../components/Hero';
import { Ecosystem } from '../components/Ecosystem';
import { BentoShowcase } from '../components/BentoShowcase';
import { Benefits } from '../components/Benefits';
import { Pricing } from '../components/Pricing';

interface HomePageProps {
  onOpenDemo: (planName?: string) => void;
  onOpenComparison: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenDemo, onOpenComparison }) => {
  return (
    <>
      <Hero onOpenDemo={() => onOpenDemo()} />
      <Ecosystem />
      <BentoShowcase />
      <Benefits />
      <Pricing
        onOpenDemo={onOpenDemo}
        onOpenComparison={onOpenComparison}
      />
    </>
  );
};
