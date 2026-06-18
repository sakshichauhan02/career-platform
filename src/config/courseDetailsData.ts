export interface CourseDetailSections {
  overview: string;
  eligibility: string;
  exams: string[];
  subjects: string[];
  specializations: string[];
  careerScope: string[];
  salary: {
    starting: string;
    mid: string;
    top: string;
  };
  recruiters: string[];
}

export const COURSE_DETAILS_MAP: Record<string, CourseDetailSections> = {
  'cse-ai': {
    overview:
      'This program blends core computer science fundamentals with advanced machine learning, neural networks, and intelligence modeling to build autonomous systems.',
    eligibility:
      '10+2 with PCM (Physics, Chemistry, Mathematics) with minimum 60% aggregate marks from a recognized board.',
    exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
    subjects: [
      'Data Structures & Algorithms',
      'Machine Learning Foundations',
      'Deep Learning & Neural Networks',
      'Natural Language Processing',
      'Computer Vision',
    ],
    specializations: [
      'Reinforcement Learning',
      'NLP & Generative AI',
      'Computer Vision Systems',
      'AI in Robotics',
      'Cyber Security & DevSecOps',
    ],
    careerScope: [
      'Machine Learning Engineer',
      'AI Research Scientist',
      'Data Scientist',
      'Software Architect',
      'NLP Engineer',
    ],
    salary: { starting: '₹8 - 15 LPA', mid: '₹18 - 30 LPA', top: '₹45+ LPA' },
    recruiters: ['Google', 'Microsoft', 'OpenAI', 'Amazon', 'NVIDIA'],
  },
  'medicine-mbbs': {
    overview:
      'MBBS covers detailed human anatomy, pharmacology, surgical basics, diagnostics, and clinical rotations to prepare qualified healthcare practitioners.',
    eligibility:
      '10+2 with PCB (Physics, Chemistry, Biology) and English, along with qualifying marks in NEET-UG entrance exam.',
    exams: ['NEET UG'],
    subjects: [
      'Human Anatomy',
      'Medical Physiology',
      'Pharmacology & Therapeutics',
      'Pathology & Microbiology',
      'General Surgery & Medicine',
    ],
    specializations: ['Cardiology', 'Neurology', 'Paediatrics', 'Orthopaedics', 'General Surgery'],
    careerScope: [
      'Resident Medical Officer',
      'General Practitioner',
      'Clinical Researcher',
      'Hospital Administrator',
      'Medical Consultant',
    ],
    salary: { starting: '₹9 - 12 LPA', mid: '₹16 - 25 LPA', top: '₹40+ LPA' },
    recruiters: ['Apollo Hospitals', 'Max Healthcare', 'Fortis Healthcare', 'AIIMS', 'Medanta'],
  },
  'uiux-product-design': {
    overview:
      'Product Design & UI/UX focuses on human-centered design principles, interactive wireframing, color theory, product layout, and usability analytics.',
    eligibility: '10+2 in any stream (Science, Commerce, Arts) with creative portfolio evaluation.',
    exams: ['UCEED', 'NID DAT', 'NIFT', 'NATA'],
    subjects: [
      'User Research Methods',
      'Visual Identity & Branding',
      'Information Architecture',
      'Interaction Design',
      'Usability Testing',
    ],
    specializations: [
      'Interaction Design',
      'Visual UI Design',
      'UX Research',
      'Motion Design',
      'AR/VR Product Design',
    ],
    careerScope: [
      'UI/UX Designer',
      'Interaction Designer',
      'Product Manager',
      'UX Researcher',
      'Information Architect',
    ],
    salary: { starting: '₹6 - 10 LPA', mid: '₹12 - 20 LPA', top: '₹35+ LPA' },
    recruiters: ['Adobe', 'Figma', 'Swiggy', 'Zomato', 'Meta'],
  },
  'chartered-accountancy': {
    overview:
      'Chartered Accountancy trains professionals in advanced audit techniques, corporate taxation, corporate law, financial consulting, and financial reporting.',
    eligibility:
      'Pass 10+2 in any stream (preferably Commerce) and qualify CA Foundation examination.',
    exams: ['CA Foundation', 'CA Intermediate', 'CA Final'],
    subjects: [
      'Advanced Auditing',
      'Direct & Indirect Taxes',
      'Financial Reporting',
      'Strategic Financial Management',
      'Corporate Laws',
    ],
    specializations: [
      'Forensic Audit',
      'International Taxation',
      'Corporate Finance',
      'Investment Consultancy',
      'Risk Advisory',
    ],
    careerScope: [
      'Statutory Auditor',
      'Tax Consultant',
      'Chief Financial Officer (CFO)',
      'Investment Analyst',
      'Financial Controller',
    ],
    salary: { starting: '₹8 - 12 LPA', mid: '₹15 - 25 LPA', top: '₹40+ LPA' },
    recruiters: ['Deloitte', 'EY', 'PwC', 'KPMG', 'ICICI Bank'],
  },
  'business-admin-mba': {
    overview:
      'Business Administration provides standard methodologies in corporate leadership, organizational psychology, finance modeling, operations, and strategic scaling.',
    eligibility: 'Bachelor degree in any stream with competitive entrance exam score.',
    exams: ['CAT', 'XAT', 'GMAT', 'SNAP', 'NMAT'],
    subjects: [
      'Marketing Management',
      'Corporate Finance',
      'Strategic Leadership',
      'Operations & Supply Chain',
      'Human Resource Management',
    ],
    specializations: [
      'Marketing',
      'Finance Management',
      'Operations & Supply Chain',
      'Human Resources',
      'Business Analytics',
    ],
    careerScope: [
      'Business Development Manager',
      'Management Consultant',
      'Brand Manager',
      'Operations Analyst',
      'Product Marketing Manager',
    ],
    salary: { starting: '₹10 - 18 LPA', mid: '₹22 - 35 LPA', top: '₹50+ LPA' },
    recruiters: ['McKinsey & Co', 'BCG', 'Goldman Sachs', 'HUL', 'Tata Group'],
  },
  'law-llb': {
    overview:
      'This program teaches constitutional structures, contract dynamics, criminal codes, corporate policy, and public advocacy procedures.',
    eligibility: '10+2 in any stream (Science, Commerce, Arts) with minimum 45% marks.',
    exams: ['CLAT', 'AILET', 'LSAT India', 'MH CET Law'],
    subjects: [
      'Constitutional Law',
      'Jurisprudence & Legal Theory',
      'Law of Contracts',
      'Criminal Law Codes',
      'Corporate & IP Law',
    ],
    specializations: [
      'Corporate Law',
      'Intellectual Property (IP)',
      'Cyber Law',
      'International Arbitration',
      'Criminal Law',
    ],
    careerScope: [
      'Corporate Legal Counsel',
      'Litigation Advocate',
      'Judicial Magistrate',
      'Legal Analyst',
      'Arbitrator',
    ],
    salary: { starting: '₹7 - 12 LPA', mid: '₹15 - 24 LPA', top: '₹35+ LPA' },
    recruiters: [
      'Shardul Amarchand Mangaldas',
      'Khaitan & Co',
      'AZB & Partners',
      'Trilegal',
      'HDFC Bank',
    ],
  },
  'space-astrophysics': {
    overview:
      'A high-level physics program analyzing quantum systems, thermodynamic structures, galaxy dynamics, and spacecraft orbit calculations.',
    eligibility:
      '10+2 with Physics and Mathematics as mandatory subjects with high aggregate marks.',
    exams: ['JEE Main', 'NEST', 'KVPY', 'JEST'],
    subjects: [
      'Classical Mechanics',
      'Electrodynamics',
      'Quantum Physics',
      'Stellar Astrophysics',
      'Orbital Mechanics & Propulsion',
    ],
    specializations: [
      'Stellar Astrophysics',
      'Cosmology',
      'Observational Astronomy',
      'Rocket Propulsion',
      'Satellite Communication',
    ],
    careerScope: [
      'Space Scientist',
      'Astrophysicist',
      'Aerospace Engineer',
      'Research Associate',
      'Data Analyst',
    ],
    salary: { starting: '₹6 - 11 LPA', mid: '₹14 - 22 LPA', top: '₹30+ LPA' },
    recruiters: ['ISRO', 'DRDO', 'NASA (via research)', 'SpaceX', 'Boeing'],
  },
  'digital-marketing': {
    overview:
      'Digital Marketing covers campaign configuration, brand strategy, search ads management, content hooks, and programmatic advertising.',
    eligibility: '10+2 in any stream (Science, Commerce, or Arts) from a recognized board.',
    exams: ['CAT (for MBA-DM)', 'MICA Admission Test (MICAT)', 'Direct College Tests'],
    subjects: [
      'Search Engine Optimization (SEO)',
      'Social Media Analytics',
      'Paid Search Advertising (PPC)',
      'Brand Storytelling',
      'Marketing Automation',
    ],
    specializations: [
      'Performance Marketing',
      'SEO Strategy',
      'Social Media Management',
      'Content Strategy',
      'Marketing Analytics',
    ],
    careerScope: [
      'Digital Marketing Lead',
      'SEO Consultant',
      'PPC Specialist',
      'Social Media Manager',
      'Brand Strategist',
    ],
    salary: { starting: '₹4 - 7 LPA', mid: '₹9 - 15 LPA', top: '₹25+ LPA' },
    recruiters: ['Dentsu', 'GroupM', 'Ogilvy', 'Publicis Groupe', 'Amazon'],
  },
  biotechnology: {
    overview:
      'Biotechnology combines biological insights with technical systems to optimize bio-products, genetic sequences, and therapeutics.',
    eligibility: '10+2 with PCB (Physics, Chemistry, Biology) or PCM with minimum 55% marks.',
    exams: ['JEE Main', 'GAT-B', 'VITEEE', 'CUET'],
    subjects: [
      'Cell Biology & Genetics',
      'Biochemistry & Enzymes',
      'Recombinant DNA Technology',
      'Immunology & Virology',
      'Bioprocess Engineering',
    ],
    specializations: [
      'Genetic Engineering',
      'Bioinformatics',
      'Pharmaceutical Biotech',
      'Industrial Biotech',
      'Plant Biotechnology',
    ],
    careerScope: [
      'Biotech Researcher',
      'Clinical Lab Scientist',
      'Bioinformatics Analyst',
      'Quality Control Executive',
      'Process Engineer',
    ],
    salary: { starting: '₹5 - 9 LPA', mid: '₹12 - 20 LPA', top: '₹30+ LPA' },
    recruiters: ['Biocon', 'Dr. Reddy Labs', 'Serum Institute of India', 'Novartis', 'Pfizer'],
  },
  'journalism-media': {
    overview:
      'Journalism prepares students to report news, shoot broadcast segments, edit copy, and analyze media ethics for modern print, television, and digital platforms.',
    eligibility: '10+2 in any stream (Science, Commerce, or Arts) with strong language skills.',
    exams: ['IIMC Entrance', 'ACJ Entrance', 'Symbiosis SET', 'CUET'],
    subjects: [
      'Reporting & Editing',
      'Mass Communication Theory',
      'Broadcast Journalism',
      'Digital Media Formats',
      'Media Laws & Ethics',
    ],
    specializations: [
      'Broadcast Journalism',
      'Investigative Reporting',
      'Photojournalism',
      'Digital & Social Media',
      'Political Journalism',
    ],
    careerScope: [
      'News Reporter',
      'Sub-Editor',
      'Anchor / Presenter',
      'Content Producer',
      'PR Executive',
    ],
    salary: { starting: '₹4 - 7 LPA', mid: '₹8 - 14 LPA', top: '₹22+ LPA' },
    recruiters: ['NDTV', 'Times Group', 'Republic TV', 'BBC India', 'Hindustan Times'],
  },
  'clinical-psychology': {
    overview:
      'Clinical Psychology details behavioral patterns, cognitive development, counseling procedures, and diagnostic metrics to assess patient health.',
    eligibility:
      '10+2 in any stream. Graduation in Psychology is required for advanced postgraduate degrees.',
    exams: ['CUET PG', 'M.Phil Clinical Psychology Entrance', 'Direct Institutional Exams'],
    subjects: [
      'General Psychology',
      'Developmental Psychopathology',
      'Cognitive Psychology',
      'Clinical Assessment Techniques',
      'Counseling Theories',
    ],
    specializations: [
      'Child Psychopathology',
      'Cognitive Behavioral Therapy',
      'Neuropsychology',
      'Family & Marriage Therapy',
      'Trauma Counseling',
    ],
    careerScope: [
      'Clinical Psychologist',
      'Counseling Therapist',
      'Mental Health Consultant',
      'School Counselor',
      'Rehabilitation Specialist',
    ],
    salary: { starting: '₹4 - 8 LPA', mid: '₹10 - 18 LPA', top: '₹26+ LPA' },
    recruiters: [
      'Fortis Mental Health',
      'VIMHANS',
      'Private Clinics',
      'NGOs',
      'Educational Institutions',
    ],
  },
  'finance-investment-banking': {
    overview:
      'Investment Banking teaches students portfolio modeling, stock valuations, asset pricing formulas, risk mitigation, and corporate advisory operations.',
    eligibility:
      '10+2 with Mathematics/Commerce as main subjects, followed by finance/economics degree.',
    exams: [
      'CAT',
      'CFA (Chartered Financial Analyst)',
      'FRM (Financial Risk Manager)',
      'Direct Executive Tests',
    ],
    subjects: [
      'Corporate Valuation',
      'Investment Banking Practices',
      'Derivatives & Portfolio Models',
      'Mergers & Acquisitions',
      'Financial Risk Analysis',
    ],
    specializations: [
      'M&A Advisory',
      'Equity Research',
      'Asset Management',
      'Structured Finance',
      'Venture Capital',
    ],
    careerScope: [
      'Investment Banking Analyst',
      'Equity Research Associate',
      'Portfolio Manager',
      'Financial Advisor',
      'Risk Specialist',
    ],
    salary: { starting: '₹9 - 16 LPA', mid: '₹20 - 35 LPA', top: '₹50+ LPA' },
    recruiters: ['J.P. Morgan', 'Goldman Sachs', 'Morgan Stanley', 'Citigroup', 'HDFC Bank'],
  },
};
