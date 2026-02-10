import { LucideIcon } from 'lucide-react';

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  metric: string;
}

export interface FeatureTab {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  checklist: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StatItem {
  value: string;
  label: string;
}
