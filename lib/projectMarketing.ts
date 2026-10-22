/**
 * Sales / marketing profile for individual project pages.
 *
 * Project data (title, screenshots, case study, tech stack) stays in the
 * database / admin. A profile only adds B2B positioning sections on top of it
 * and is matched by slug.
 *
 * Capability rules for copy in this file:
 *  - `status: 'available'` is only used for behaviour verified in the ProTrac
 *    codebase (production lines/scanners created from the admin, TV accounts
 *    assigned to any number of lines, hourly dashboards, QC, reports with
 *    Excel/PDF export, scheduled daily report email).
 *  - Anything else is `status: 'custom'` (available through customization,
 *    subject to technical assessment).
 *  - Never state unlimited capacity, multi-factory isolation, offline scanning
 *    or fixed price/ROI figures.
 *  - Real-implementation numbers (6 lines, 3 TVs) live only in
 *    `exampleImplementation` and are labelled as one deployment, not a limit.
 */

export type FeatureStatus = 'available' | 'custom'

export interface MarketingFeature {
  title: string
  description: string
  status: FeatureStatus
}

export interface MarketingFaq {
  question: string
  answer: string
}

export interface ProjectMarketingProfile {
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  heroTitle: string
  heroSubtitle: string
  highlights: { title: string; text: string }[]
  videoHeading: string
  videoCaption: string
  /** Optional separate walkthrough of the real software (YouTube / Vimeo / Loom / MP4). */
  walkthroughUrl?: string
  aboutParagraphs: string[]
  features: MarketingFeature[]
  benefitsHeading: string
  benefits: { title: string; text: string }[]
  exampleImplementation: { heading: string; text: string }
  productFlexibility: { heading: string; points: string[] }
  galleryNotice: string
  technical: {
    intro: string
    stack: string[]
    deployment: string[]
    notClaimed: string
  }
  pricing: { heading: string; text: string; cta: string }
  faq: MarketingFaq[]
}

const PROTRAC: ProjectMarketingProfile = {
  seoTitle: 'ProTrac | QR-Based Garment Production Tracking & Live Monitoring',
  seoDescription:
    'Discover ProTrac, a configurable QR-based garment production tracking system with real-time dashboards, WIP monitoring, quality control and production reports.',
  seoKeywords: [
    'garment production tracking software',
    'QR garment tracking',
    'real-time production monitoring',
    'garments WIP tracking',
    'sewing production dashboard',
    'garment factory management software Bangladesh',
  ],
  heroTitle: 'ProTrac — Smart Garment Production Tracking & Real-Time Monitoring System',
  heroSubtitle:
    "Track garment production from cutting to finishing with QR-based traceability, live production dashboards, work-in-progress monitoring, quality control and automated reporting — configured for your factory's operational needs.",
  highlights: [
    { title: 'Configurable Production Lines', text: 'Set up lines to match your floor layout.' },
    { title: 'Real-Time WIP Monitoring', text: 'See work-in-progress by line and by part.' },
    { title: 'QR-Based Garment Traceability', text: 'Follow bundles and garments through every stage.' },
    { title: 'Flexible TV Dashboards', text: 'Assign live dashboards to the lines each TV should show.' },
  ],
  videoHeading: 'See How ProTrac Tracks Production in Real Time',
  videoCaption:
    'Promotional concept video. A walkthrough of the actual software is shared during a live demo.',
  aboutParagraphs: [
    'ProTrac is a QR-based garment production tracking and monitoring solution designed to improve visibility across manufacturing operations. From cutting and bundle issuance to assembly, sewing quality control and finishing, ProTrac helps production teams monitor garment movement, work-in-progress, hourly output and quality performance in real time.',
    'The system can be configured according to factory requirements, allowing management to plan monitoring dashboards, production lines and scanning workflows based on operational needs.',
    'Through centralized dashboards and reporting, ProTrac helps management identify production bottlenecks, monitor quality and make faster, data-driven decisions.',
  ],
  features: [
    {
      title: 'QR-Based Production Tracking',
      description: 'Trace garments and bundles through configured production stages with QR labels and scan points.',
      status: 'available',
    },
    {
      title: 'Real-Time Production Monitoring',
      description: 'View live production activity, input, output and line status on auto-refreshing dashboards.',
      status: 'available',
    },
    {
      title: 'Work-in-Progress Monitoring',
      description: 'Track WIP per line and across production parts such as front, back and sleeve.',
      status: 'available',
    },
    {
      title: 'Hourly Production Dashboard',
      description: 'Compare hourly production targets with actual results for each line.',
      status: 'available',
    },
    {
      title: 'Sewing & Finishing Quality Control',
      description: 'Record inspection results as pass, fail or rework, with defect tracking and DHU.',
      status: 'available',
    },
    {
      title: 'Garment-Level Traceability',
      description: 'Identify the status and scan history of an individual garment, plus a garment status heatmap.',
      status: 'available',
    },
    {
      title: 'Live TV / Kiosk Dashboards',
      description:
        'Display live production on TVs. Each display account can be assigned the lines it should show. Sewing, finishing and heatmap views are available; other layouts through customization.',
      status: 'available',
    },
    {
      title: 'Production Reports & Analytics',
      description:
        'Daily production report with line, buyer, style, order, color and size filters, Excel / PDF export and a scheduled daily report email.',
      status: 'available',
    },
    {
      title: 'Flexible Factory Configuration',
      description:
        'Production lines, scan stations, daily targets and TV assignments are set up from the admin panel. Custom workflows and reports are available through customization.',
      status: 'available',
    },
  ],
  benefitsHeading: 'Why Choose ProTrac?',
  benefits: [
    { title: 'Less manual reporting', text: 'Production data is captured at the point of work by scanning, not collected by hand at the end of the day.' },
    { title: 'Clearer production progress', text: 'Management can see input, output and WIP as production happens.' },
    { title: 'Earlier bottleneck detection', text: 'Part-wise WIP and hourly output make slow stages visible sooner.' },
    { title: 'Better quality tracking', text: 'Pass, fail and rework results with defects are recorded per garment.' },
    { title: 'Faster line-wise data', text: 'Dashboards and reports give line-wise performance without waiting for manual summaries.' },
    { title: 'Coordination between stages', text: 'Cutting, sewing and finishing work from the same live data.' },
    { title: 'Centralized monitoring', text: 'One system for management, supervisors and shop-floor displays.' },
  ],
  exampleImplementation: {
    heading: 'Example Implementation',
    text: 'The case study below documents one factory deployment: 6 sewing lines, 3 TV dashboards and finishing scan points on two floors. These figures describe that deployment only. They are not limits of ProTrac.',
  },
  productFlexibility: {
    heading: 'Product Flexibility',
    points: [
      'Production lines and scan stations configured to each factory floor.',
      'TV dashboards assigned to the lines each display should show.',
      'Multiple styles, orders and buyers tracked together.',
      'Daily targets, working hours and workers set per line.',
      'Access accounts per scan point, display and responsibility.',
      'Custom reports and dashboard layouts through customization.',
    ],
  },
  galleryNotice:
    'Conceptual illustrations. They are not screenshots of the actual ProTrac interface. Real interface screens are shown during a live demo.',
  technical: {
    intro:
      'ProTrac is a web application with a REST API, a web client for scan stations and dashboards, and an admin panel.',
    stack: ['Django', 'Django REST Framework', 'PostgreSQL', 'Next.js', 'TypeScript', 'Docker', 'Nginx', 'GitHub Actions'],
    deployment: [
      'Runs in Docker containers (API, web app, database, reverse proxy).',
      'The reference deployment runs on the factory\'s internal network.',
      'JWT-based authentication with separate accounts per scan point and display.',
      'Automated deployment with database backup, health check and automatic rollback.',
      'OpenAPI-documented REST API.',
    ],
    notClaimed:
      'Hardware, network and capacity requirements are assessed per factory. Multi-factory (multi-tenant) isolation and offline scanning are not part of the current product and would be scoped as customization.',
  },
  pricing: {
    heading: 'Customized Solutions Based on Factory Requirements',
    text: 'Every garment factory has different production workflows, line arrangements and reporting requirements. Contact us to discuss the most suitable ProTrac implementation for your operations.',
    cta: 'Request a Custom Quotation',
  },
  faq: [
    {
      question: 'Can ProTrac be configured for different numbers of sewing lines?',
      answer:
        'Yes. Production lines are created from the admin panel, and scan stations are created automatically for each new line, so the setup follows your floor layout. The documented deployment used 6 sewing lines. That is one example, not a limit. Capacity for very large installations is confirmed during technical assessment.',
    },
    {
      question: 'Can we use multiple TV dashboards?',
      answer:
        'Yes. A TV logs in with its own display account that is assigned the lines it should show, and the number of lines per TV is not fixed. The documented deployment used 3 TVs showing 2 lines each.',
    },
    {
      question: 'Does ProTrac support QR-based garment tracking?',
      answer:
        'Yes. Bundles and garments get QR labels, and each stage (bundle issue, assembly, sewing QC, finishing QC) is recorded by scanning.',
    },
    {
      question: 'Can production managers monitor WIP and hourly output?',
      answer:
        'Yes. Dashboards show hourly target vs actual, input and output, and part-wise WIP, and the daily production report adds filters and Excel / PDF export.',
    },
    {
      question: 'Can the system be customized for our factory workflow?',
      answer:
        'Line setup, scan points, targets, TV assignments and user accounts are configurable today. Different workflows, extra scan stages, new dashboards or custom reports are available through customization after a requirements discussion.',
    },
    {
      question: 'What equipment is required?',
      answer:
        'A server for the application, a PC or terminal at each scan point with a scanner that enters the code like a keyboard (for example a USB QR / barcode scanner), a label printer for QR labels, TVs for dashboards and network access in the factory. Exact requirements depend on your layout and are confirmed during assessment.',
    },
    {
      question: 'Can ProTrac run on an internal factory network?',
      answer:
        'Yes. The reference deployment runs on the factory\'s internal network with Docker. Offline scanning without a network connection is not currently included.',
    },
    {
      question: 'How can we request a demonstration?',
      answer: 'Use the enquiry form on this page and choose "Live demo". You will get a reply within 24 hours to arrange a walkthrough.',
    },
    {
      question: 'How is implementation and support handled?',
      answer:
        'Implementation is planned around your floor layout and workflow: setup, user accounts, labels, dashboards and training. Support terms are agreed in the quotation.',
    },
    {
      question: 'How is software pricing determined?',
      answer:
        'Pricing is customized to your requirements, such as the production lines, dashboards, scan points and any custom features. Request a custom quotation and we will discuss the scope first.',
    },
  ],
}

const PROFILES: Record<string, ProjectMarketingProfile> = {
  'protrac-garments-production-tracking-live-dashboards': PROTRAC,
  'protrac-garments-production-tracking': PROTRAC,
}

export function getMarketingProfile(slug?: string): ProjectMarketingProfile | null {
  return (slug && PROFILES[slug]) || null
}
