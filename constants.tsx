import { 
  Target, 
  MailOpen, 
  CalendarCheck, 
  MessageSquare, 
  BarChart3,
  Search,
  Brain,
  PenTool,
  Inbox,
  Calendar,
  Zap,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { PricingTier, Testimonial, FeatureCard, FAQItem, StatItem } from './types';

export const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Problem', href: '#problem' },
  { label: 'ROI', href: '#roi' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO_COPY = {
  badge: "⚡ LIVE: 7 Deployment Slots Remaining This Month",
  headline: "Your SDR Team Costs $180k.\nOurs Costs $72k and Books 2x More Meetings.",
  subheadline: "Transform your sales process from a manual grind into an autonomous revenue machine. Revenue OS handles the prospecting, research, and booking—so your team can stop chasing leads and start closing deals.",
  primaryCta: "See Your Savings Calculator",
  secondaryCta: "Watch 90-Second Demo"
};

export const PROBLEM_CARDS = [
  {
    icon: "clock",
    stat: "$210k/Year Wasted",
    desc: "3 SDRs at $70k each spend 30 hrs/week on manual tasks. That's $18k/month in labor for work AI does for $0.02/lead."
  },
  {
    icon: "moon",
    stat: "960 Hours/Year Lost",
    desc: "Your team sleeps 16 hours/day. Competitors with AI don't. They're booking meetings at 2am while you're dark."
  },
  {
    icon: "trend-down",
    stat: "83% of Leads Abandoned",
    desc: "Humans give up after 2 follow-ups. Revenue OS sends 7 personalized touchpoints over 21 days. That's $45k in lost pipeline per SDR, per month."
  }
];

export const SOLUTION_STEPS: FeatureCard[] = [
  {
    id: 'lead-intel',
    title: 'Lead Intelligence Agent',
    icon: Search,
    headline: "1. Revenue OS Finds Your Ideal Buyers",
    description: "Scrapes 50+ data sources (LinkedIn, company databases, funding announcements) to find prospects matching your ICP. Enriches with verified emails, tech stack, recent hires, and buying signals.",
    stats: ["1,000-5,000 leads/month", "<1% email bounce rate", "Intent-based triggering"]
  },
  {
    id: 'research',
    title: 'Research Agent',
    icon: Brain,
    headline: "2. Revenue OS Researches Every Lead Like a Human SDR",
    description: "Reads LinkedIn profiles, company websites, recent posts, and news articles. Identifies pain points, competitive threats, and personalization hooks—automatically.",
    stats: ["47 data points per lead", "Competitive intel extraction", "Personalization triggers"]
  },
  {
    id: 'outreach',
    title: 'Outreach Agent',
    icon: PenTool,
    headline: "3. Revenue OS Writes Emails Your Prospects Actually Reply To",
    description: "Trained on your brand voice via RAG (upload pitch decks, scripts, past emails). Writes personalized openers referencing LinkedIn posts, recent news, or shared connections.",
    stats: ["8-12% reply rates", "7-touchpoint sequences", "Smart send time optimization"]
  },
  {
    id: 'inbox',
    title: 'Inbox AI Agent',
    icon: Inbox,
    headline: "4. Revenue OS Reads & Responds to Every Reply—24/7",
    description: "Triages replies into Sales, Support, or Spam. Handles objections, sends case studies, negotiates meeting times. Escalates to you only when deal is hot.",
    stats: ["Auto-categorization", "Objection handling", "Customer support mode (Tier 2+)"]
  },
  {
    id: 'setter',
    title: 'Meeting Setter Agent',
    icon: Calendar,
    headline: "5. Revenue OS Books Meetings Without Back-and-Forth",
    description: "AI negotiates time slots via email (Tier 1) or voice call (Tier 2+). Syncs to your calendar, sends reminders, reduces no-shows by 40%.",
    stats: ["Calendly/Google sync", "Timezone intelligence", "Pre-meeting research report"]
  }
];

export const STATS: StatItem[] = [
  { value: "2,847", label: "Leads Processed Daily", icon: Zap },
  { value: "940", label: "Meetings Booked This Month", icon: Target },
  { value: "94%", label: "Annual Retention", icon: RefreshCw }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    before: "\"We had 3 SDRs costing $210k/year. They booked 15-20 meetings/month. High churn, inconsistent performance, and I was constantly hiring.\"",
    after: "\"Revenue OS Tier 2 costs $72k/year and books 40-50 meetings/month. Consistent, predictable, and I never think about hiring SDRs again.\"",
    name: "Sarah Chen",
    role: "CEO",
    company: "GrowthStack AI",
    result: "$138k saved, 2.5x more meetings"
  },
  {
    before: "\"I thought 'AI SDR' was BS. Tried 11x, tried Clay + Instantly. They all required too much setup, broke constantly, and felt like managing another employee.\"",
    after: "\"Apex is the first one that actually works. I pasted my ICP, they trained the AI on our pitch deck, and we had our first meeting booked in 9 days. I don't touch it—it just runs.\"",
    name: "Marcus Williams",
    role: "Head of Sales",
    company: "CloudSync",
    result: "47 meetings in Month 1"
  },
  {
    before: "\"We were offering lead gen as a service, using contractors and VAs. Margins were 20-30%, and every client wanted custom reports, custom cadences, constant changes.\"",
    after: "\"We white-labeled Revenue OS (Tier 3) and resell it at $15k/month. Margins are now 60%, clients get better results, and we scaled from 3 clients to 12 without adding headcount.\"",
    name: "Priya Sharma",
    role: "Founder",
    company: "LeadFlow Pro",
    result: "$108k saved, 60% margins"
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Pipeline Starter",
    price: "$2,497",
    period: "/mo",
    description: "Prove AI sales works for your business. Fast ROI, limited features, designed to upsell to Tier 2 after 60 days.",
    features: [
      "1,000 Verified Leads",
      "Email Orchestration Only",
      "Basic AI Personalization",
      "CRM Integration",
      "Weekly Reporting"
    ],
    notIncluded: [
      "No customer support AI",
      "No voice AI booking",
      "No meeting intelligence"
    ],
    cta: "Start with Pipeline Starter",
    highlight: false
  },
  {
    name: "Revenue Engine",
    price: "$5,997",
    period: "/mo",
    description: "The complete AI sales system for growth companies. Replaces 2-3 SDRs, includes meeting intelligence, and custom AI training.",
    features: [
      "5,000 Verified Leads (5x Tier 1)",
      "Email Outreach (LinkedIn coming Q2)",
      "Meeting Intelligence Suite",
      "Custom RAG Training",
      "AI Appointment Setter (Chat + Voice)",
      "Priority Support"
    ],
    notIncluded: [
       "Web chatbot not yet available",
       "WhatsApp (Tier 3 only)"
    ],
    cta: "Activate Revenue Engine",
    highlight: true,
    badge: "Most Popular"
  },
  {
    name: "Enterprise Command",
    price: "$12,997",
    period: "/mo",
    description: "White-label AI infrastructure for agencies & enterprises. Unlimited scale, API access, dedicated support.",
    features: [
      "Unlimited Leads",
      "White-label Options",
      "API Access",
      "Dedicated CSM",
      "Custom Engineering",
      "Slack Connect Channel"
    ],
    cta: "Contact Systems Architect",
    highlight: false,
    header: "For agencies & enterprises"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How is this different from Clay/Instantly/11x.ai?",
    answer: "Clay is a data enrichment tool (Excel-like). Instantly is an email sender (Mailchimp-like). 11x is a 'digital worker'. Revenue OS is infrastructure: we handle scraping, research, email writing, inbox management, meeting booking, and call intelligence—all in one system. We are the only system with meeting intelligence and custom RAG training."
  },
  {
    question: "Do I need to provide the leads? Or do you handle that?",
    answer: "We handle it 100%. Revenue OS scrapes 50+ data sources to find prospects matching your ICP. You don't upload CSVs or buy lists. Exception: You CAN upload your own list if you want to."
  },
  {
    question: "What if the AI sends a bad email? Can I review before it goes out?",
    answer: "Yes. You have full control. You can choose 'Review Mode' where you approve every email, or 'Auto-Pilot Mode' once you trust the system. We also use a spam filter check and human-in-the-loop for low confidence scores."
  },
  {
    question: "How long until I see results?",
    answer: "Setup takes 7 days. Most clients see their first AI-booked meetings within 14 days of launch. We build your custom RAG model and warm up domains in the first week."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. All plans are monthly subscriptions. We believe in earning your business with results, not lock-in contracts."
  }
];