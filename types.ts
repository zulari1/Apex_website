import { LucideIcon } from 'lucide-react';

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  notIncluded?: string[]; // New field for excluded features
  cta: string;
  highlight?: boolean;
  badge?: string;
  header?: string; // For scarcity text
}

export interface Testimonial {
  before: string;
  after: string;
  name: string;
  role: string;
  company: string;
  result: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  icon: LucideIcon;
  headline: string;
  description: string;
  stats: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon?: LucideIcon;
}