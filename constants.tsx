import { 
  Target, 
  MailOpen, 
  CalendarCheck, 
  MessageSquare, 
  BarChart3 
} from 'lucide-react';
import { PricingTier, Testimonial, FeatureTab, FAQItem, StatItem } from './types';

export const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'ROI', href: '#roi' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO_COPY = {
  headline: "The Autonomous Revenue Infrastructure",
  subheadline: "Replace fragmented tools and SDR churn with a single, self-correcting system. Apex engineers your revenue pipeline from data to closed-won.",
  badge: "Join 100+ companies replacing their SDR teams"
};

export const PROBLEM_CARDS = [
  {
    icon: "clock",
    stat: "6 hours/day",
    desc: "Wasted on manual prospecting that goes nowhere."
  },
  {
    icon: "moon",
    stat: "0 Leads",
    desc: "Generated while your team sleeps. Human limitations cap your growth."
  },
  {
    icon: "trend-down",
    stat: "80% Drop-off",
    desc: "Deals die because humans give up after 2 touchpoints."
  }
];

export const CAPABILITY_TABS: FeatureTab[] = [
  {
    id: 'lead-gen',
    title: 'Lead Gen OS',
    icon: Target,
    description: "Connects to over 50 global data providers, verifying emails in real-time. We don't just find emails; we find intent.",
    checklist: ["250M+ verified contacts", "Real-time waterfall enrichment", "Intent-based triggering"]
  },
  {
    id: 'inbox-ai',
    title: 'Sales Inbox AI',
    icon: MailOpen,
    description: "Manage thousands of conversations without lifting a finger. The AI triages replies, handles objections, and forwards hot leads.",
    checklist: ["Auto-categorization (Interested, OOO, Not Interested)", "Sentiment analysis", "Objection handling loops"]
  },
  {
    id: 'setter',
    title: 'AI Appt Setter',
    icon: CalendarCheck,
    description: "The system negotiates time slots and books meetings directly to your calendar. No back-and-forth email tag.",
    checklist: ["Calendar integration", "Natural language scheduling", "Timezone intelligence"]
  },
  {
    id: 'chatbot',
    title: 'Multi-Channel',
    icon: MessageSquare,
    description: "Orchestrate complex sequences across Email, LinkedIn, and WhatsApp. Meet your prospects where they are.",
    checklist: ["Omnichannel sequencing", "LinkedIn automation", "Unified conversation view"]
  },
  {
    id: 'intelligence',
    title: 'Rev Intelligence',
    icon: BarChart3,
    description: "Full visibility into what's working. The system self-optimizes based on reply rates and meeting bookings.",
    checklist: ["A/B testing at scale", "Campaign performance heatmaps", "Revenue attribution"]
  }
];

export const STATS: StatItem[] = [
  { value: "2,400+", label: "Leads Processed Daily" },
  { value: "850+", label: "Meetings Booked" },
  { value: "98%", label: "Client Retention" }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Our SDR team costs $180k. Apex costs $72k. You save 60% and book 2x more meetings.",
    name: "Alex Hormozi",
    role: "Founder",
    company: "Acquisition.com",
    metric: "Replaced 3 SDRs"
  },
  {
    quote: "I didn't believe the 'meeting intelligence' claim until I saw the AI handle a reschedule request perfectly.",
    name: "Sarah Jenkins",
    role: "VP of Sales",
    company: "TechFlow",
    metric: "47 Qualified Calls in Month 1"
  },
  {
    quote: "The only system that actually feels like infrastructure, not just another tool I have to manage.",
    name: "David Chen",
    role: "CEO",
    company: "ScaleUp Agency",
    metric: "$2.4M Pipeline Generated"
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Pipeline Starter",
    price: "$2,497",
    period: "/mo",
    description: "Foundational outbound AI for lean teams.",
    features: [
      "1,000 Verified Leads",
      "Email Orchestration Only",
      "Basic AI Personalization",
      "CRM Integration",
      "Weekly Reporting"
    ],
    cta: "Deploy Core Node",
    highlight: false
  },
  {
    name: "Revenue Engine",
    price: "$5,997",
    period: "/mo",
    description: "Full revenue infrastructure for scaling companies.",
    features: [
      "5,000 Verified Leads",
      "Multi-channel (Email + LinkedIn)",
      "Meeting Intelligence",
      "Custom RAG Training",
      "Priority Support",
      "A/B Testing Engine"
    ],
    cta: "Activate Growth Grid",
    highlight: true
  },
  {
    name: "Enterprise Command",
    price: "$12,997",
    period: "/mo",
    description: "Omnichannel dominance with white-glove management.",
    features: [
      "Unlimited Leads",
      "White-label Options",
      "API Access",
      "Dedicated CSM",
      "Custom Engineering",
      "Slack Connect Channel"
    ],
    cta: "Contact Systems Architect",
    highlight: false
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How is this different from Clay/Instantly/11x.ai?",
    answer: "Those are tools—you configure them. Revenue OS is infrastructure—we run everything. We are the only system with end-to-end meeting intelligence and custom RAG training."
  },
  {
    question: "Do I need to provide the leads?",
    answer: "No. Our Lead Gen OS connects to over 50 data providers to source and verify your ideal customer profile automatically."
  },
  {
    question: "What if the AI sends a bad email?",
    answer: "Our system uses a 'Glass-Box' approach. You can set approval loops, and the AI is trained on your specific brand voice via RAG before it ever sends a message."
  },
  {
    question: "How long until I see results?",
    answer: "Setup takes 7 days. Most clients see their first AI-booked meetings within 14 days of launch."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. All plans are monthly subscriptions. We believe in earning your business with results, not lock-in contracts."
  }
];
