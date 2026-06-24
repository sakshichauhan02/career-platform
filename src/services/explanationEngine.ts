import { AssessmentData } from '@/types/assessment';
import type { Course } from '@/services/recommendationEngine';

export interface CareerOutlook {
  salaryRange: string;
  growthRate: string;
  demandLevel: 'Critically High' | 'Very High' | 'High' | 'Moderate' | 'Stable';
  topRoles: string[];
  outlookDescription: string;
  topColleges: string[];
}

export interface CourseExplanation {
  whyThisCourseFits: string;
  strengthAnalysis: string;
  interestAnalysis: string;
  careerFitAnalysis: string;
  careerOutlook: CareerOutlook;
}

export const CAREER_OUTLOOKS: Record<string, CareerOutlook> = {
  'cse-ai': {
    salaryRange: '₹12L - ₹35L / $115,000 - $180,000',
    growthRate: '22% (Much faster than average)',
    demandLevel: 'Critically High',
    topRoles: ['AI Engineer', 'Machine Learning Engineer', 'Software Architect', 'Data Scientist'],
    outlookDescription:
      'The exponential rise of AI integration across industries ensures that computer science and machine learning specialists will remain in critical demand for the foreseeable future.',
    topColleges: ['IIT Bombay', 'IISc Bangalore', 'MIT', 'Stanford University', 'CMU'],
  },
  'medicine-mbbs': {
    salaryRange: '₹9L - ₹30L / $200,000 - $350,000',
    growthRate: '7% (Stable & Growing)',
    demandLevel: 'High',
    topRoles: [
      'General Physician',
      'Specialist Surgeon',
      'Clinical Researcher',
      'Hospital Administrator',
    ],
    outlookDescription:
      'Healthcare careers are fundamentally recess-proof. The growing global population and emerging medical technologies ensure steady demand for qualified medical professionals.',
    topColleges: ['AIIMS New Delhi', 'CMC Vellore', 'Harvard Medical School', 'Oxford University'],
  },
  'uiux-product-design': {
    salaryRange: '₹6L - ₹18L / $85,000 - $140,000',
    growthRate: '16% (Very High)',
    demandLevel: 'Very High',
    topRoles: ['UI/UX Designer', 'Product Designer', 'UX Researcher', 'Interaction Designer'],
    outlookDescription:
      'With every business transitioning to digital-first storefronts, the demand for designers who can create beautiful, intuitive user experiences has sky-rocketed.',
    topColleges: [
      'NID Ahmedabad',
      'IDC IIT Bombay',
      'Rhode Island School of Design',
      'Parsons School of Design',
    ],
  },
  'chartered-accountancy': {
    salaryRange: '₹8L - ₹25L / $70,000 - $120,000',
    growthRate: '4% (Steady Growth)',
    demandLevel: 'Very High',
    topRoles: [
      'Statutory Auditor',
      'Tax Consultant',
      'Financial Controller',
      'Chief Financial Officer (CFO)',
    ],
    outlookDescription:
      'Chartered Accountants are the financial backbone of corporate enterprise. Strict compliance regulations and corporate expansions make CAs highly sought after.',
    topColleges: ['ICAI', 'SRCC Delhi', 'London School of Economics'],
  },
  'business-admin-mba': {
    salaryRange: '₹7L - ₹22L / $90,000 - $150,000',
    growthRate: '10% (Steady)',
    demandLevel: 'High',
    topRoles: [
      'Business Development Manager',
      'Operations Manager',
      'Management Consultant',
      'Entrepreneur',
    ],
    outlookDescription:
      'Global markets require leadership that can navigate complexity, manage diverse teams, and scale businesses in dynamic economic climates.',
    topColleges: [
      'IIM Ahmedabad',
      'ISB Hyderabad',
      'Wharton School',
      'INSEAD',
      'Harvard Business School',
    ],
  },
  'law-llb': {
    salaryRange: '₹6L - ₹20L / $95,000 - $160,000',
    growthRate: '9% (Faster than average)',
    demandLevel: 'High',
    topRoles: [
      'Corporate Counsel',
      'Associate Attorney',
      'Legal Advisor',
      'Civil Services Officer',
    ],
    outlookDescription:
      'Corporate restructuring, regulatory compliance, and litigation demand analytical minds capable of advocating and drafting complex legal framework.',
    topColleges: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'Yale Law School', 'Harvard Law School'],
  },
  'space-astrophysics': {
    salaryRange: '₹6L - ₹18L / $80,000 - $130,000',
    growthRate: '8% (Aviation & Space Tech)',
    demandLevel: 'Stable',
    topRoles: ['Astrophysicist', 'Research Scientist', 'Satellite Engineer', 'Data Analyst'],
    outlookDescription:
      'The privatization of space exploration and increased government funding for satellite networks has opened new research and engineering pathways.',
    topColleges: [
      'IIST Thiruvananthapuram',
      'IISER Pune',
      'Caltech',
      'Princeton University',
      'Cambridge University',
    ],
  },
  'digital-marketing': {
    salaryRange: '₹4L - ₹12L / $60,000 - $110,000',
    growthRate: '19% (Very High)',
    demandLevel: 'Very High',
    topRoles: [
      'SEO Specialist',
      'Content Strategist',
      'Brand Manager',
      'Public Relations Specialist',
    ],
    outlookDescription:
      'Traditional advertising has migrated completely online. Brands require digital marketing strategies to target and convert customers in a crowded social marketplace.',
    topColleges: ['MICA Ahmedabad', 'FMS Delhi', 'NYU Stern', 'Northwestern Medill'],
  },
  biotechnology: {
    salaryRange: '₹5L - ₹15L / $85,000 - $135,000',
    growthRate: '15% (Accelerating)',
    demandLevel: 'High',
    topRoles: ['Biotechnologist', 'Research Associate', 'Geneticist', 'Quality Control Analyst'],
    outlookDescription:
      'Gene-editing technologies, personalized medicine, and sustainable agriculture are driving massive capital investments into biotech R&D centers.',
    topColleges: [
      'IIT Madras',
      'BITS Pilani',
      'Johns Hopkins University',
      'UC Berkeley',
      'ETH Zurich',
    ],
  },
  'journalism-media': {
    salaryRange: '₹4L - ₹10L / $50,000 - $90,000',
    growthRate: '6% (Evolving to Digital)',
    demandLevel: 'Stable',
    topRoles: ['News Reporter', 'Content Editor', 'Digital Producer', 'Broadcast Journalist'],
    outlookDescription:
      'While print media declines, digital media, podcasts, and video documentary production are growing rapidly, creating opportunities for skilled storytellers.',
    topColleges: ['IIMC New Delhi', 'ACJ Chennai', 'Columbia Journalism School', 'UC Berkeley'],
  },
  'clinical-psychology': {
    salaryRange: '₹5L - ₹12L / $75,000 - $115,000',
    growthRate: '12% (Higher than average)',
    demandLevel: 'Very High',
    topRoles: ['Clinical Psychologist', 'Mental Health Counselor', 'Therapist', 'HR Specialist'],
    outlookDescription:
      'A heightened global focus on mental wellness in schools, corporates, and clinics ensures a strong and growing demand for certified counseling professionals.',
    topColleges: [
      'TISS Mumbai',
      'NIMHANS Bangalore',
      'Stanford University',
      'University College London',
    ],
  },
  'finance-investment-banking': {
    salaryRange: '₹10L - ₹30L / $110,000 - $200,000',
    growthRate: '11% (High Demand)',
    demandLevel: 'Very High',
    topRoles: [
      'Investment Banking Analyst',
      'Portfolio Manager',
      'Financial Engineer',
      'Risk Analyst',
    ],
    outlookDescription:
      'Capital management, mergers and acquisitions, and quantitative algorithmic trading require high-level analytical skills that command premium compensation.',
    topColleges: [
      'JBIMS Mumbai',
      'IIM Calcutta',
      'London Business School',
      'NYU Stern',
      'Wharton School',
    ],
  },
  'prompt-engineer': {
    salaryRange: '₹8L - ₹22L / $90,000 - $145,000',
    growthRate: '28% (Explosive Growth)',
    demandLevel: 'Very High',
    topRoles: [
      'Prompt Engineer',
      'AI Interaction Designer',
      'NLP Specialist',
      'Generative AI Developer',
    ],
    outlookDescription:
      'As generative AI models become core operating infrastructure for enterprises, the ability to instruct and orchestrate these models with high precision is becoming a crucial professional skill set.',
    topColleges: [
      'Stanford University',
      'IIT Hyderabad',
      'MIT',
      'CMU',
      'Online Micro-credentials (OpenAI/Google)',
    ],
  },
  'ai-product-manager': {
    salaryRange: '₹14L - ₹38L / $120,000 - $190,000',
    growthRate: '24% (Very Fast)',
    demandLevel: 'Critically High',
    topRoles: [
      'AI Product Manager',
      'Product Owner - ML Systems',
      'Director of AI Products',
      'Technical PM',
    ],
    outlookDescription:
      'Building commercial AI products requires a unique blend of business acumen and machine learning literacy. Companies are actively hiring leaders who can translate model metrics into business value.',
    topColleges: [
      'IIM Bangalore',
      'Wharton School',
      'UC Berkeley Haas',
      'ISB Hyderabad',
      'Stanford GSB',
    ],
  },
  'ux-researcher': {
    salaryRange: '₹5L - ₹15L / $75,000 - $125,000',
    growthRate: '14% (Faster than average)',
    demandLevel: 'High',
    topRoles: ['UX Researcher', 'Behavioral Analyst', 'Usability Engineer', 'Design Researcher'],
    outlookDescription:
      'Designing intuitive products requires empirical research. Companies invest heavily in research professionals who can validate design assumptions, conduct behavioral studies, and reduce user churn.',
    topColleges: [
      'NID Bangalore',
      'IDC IIT Bombay',
      'Georgia Tech',
      'Carnegie Mellon University',
      'University of Washington',
    ],
  },
  'data-scientist': {
    salaryRange: '₹10L - ₹28L / $105,000 - $165,000',
    growthRate: '21% (Exceptional Growth)',
    demandLevel: 'Critically High',
    topRoles: [
      'Data Scientist',
      'Machine Learning Engineer',
      'Quantitative Analyst',
      'Data Science Consultant',
    ],
    outlookDescription:
      'Data is the new corporate currency. Organizations across finance, e-commerce, healthcare, and tech require advanced predictive modeling to make data-driven decisions and automate workflows.',
    topColleges: [
      'IIT Kharagpur',
      'ISI Kolkata',
      'Stanford University',
      'MIT',
      'University of California, Berkeley',
    ],
  },
  'bioinformatics-analyst': {
    salaryRange: '₹6L - ₹18L / $80,000 - $135,000',
    growthRate: '17% (Rapid Expansion)',
    demandLevel: 'High',
    topRoles: [
      'Bioinformatics Analyst',
      'Computational Biologist',
      'Genomics Data Scientist',
      'Biostatistics Specialist',
    ],
    outlookDescription:
      'The fusion of genomics, personalized cancer therapy, and pharmaceutical development has created massive datasets that require advanced computational analysis, placing bioinformatics at the heart of biotechnology.',
    topColleges: [
      'IIT Delhi',
      'IBAB Bangalore',
      'Johns Hopkins University',
      'University of Oxford',
      'Harvard University',
    ],
  },
  'sustainability-consultant': {
    salaryRange: '₹5L - ₹16L / $70,000 - $120,000',
    growthRate: '13% (Steady Increase)',
    demandLevel: 'High',
    topRoles: [
      'Sustainability Consultant',
      'ESG Analyst',
      'Environmental Consultant',
      'Chief Sustainability Officer (CSO)',
    ],
    outlookDescription:
      'With global net-zero goals, carbon taxation, and strict ESG compliance mandates, corporations are hiring green consultants to audit supply chains, design sustainability programs, and optimize resource usage.',
    topColleges: [
      'TISS Mumbai',
      'IIT Bombay (CESE)',
      'Yale School of the Environment',
      'London School of Economics',
      'Oxford Smith School',
    ],
  },
  'cybersecurity-analyst': {
    salaryRange: '₹8L - ₹24L / $95,000 - $160,000',
    growthRate: '26% (Very Fast)',
    demandLevel: 'Critically High',
    topRoles: [
      'Cybersecurity Analyst',
      'Penetration Tester',
      'Information Security Officer',
      'Security Architect',
    ],
    outlookDescription:
      'As cyber threats become highly sophisticated and destructive, digital asset protection is a top corporate priority. Certified security specialists are critical to guarding networks, clouds, and database architectures.',
    topColleges: [
      'IIT Madras',
      'IIIT Allahabad',
      'Georgia Tech',
      'Purdue University',
      'SANS Technology Institute',
    ],
  },
  'cloud-architect': {
    salaryRange: '₹12L - ₹32L / $115,000 - $175,000',
    growthRate: '18% (High Demand)',
    demandLevel: 'Very High',
    topRoles: [
      'Cloud Architect',
      'DevOps Engineer',
      'Cloud Infrastructure Engineer',
      'Solutions Architect',
    ],
    outlookDescription:
      'The corporate migration to AWS, Microsoft Azure, and Google Cloud is universal. Cloud architects are in high demand to design secure, highly-available, and cost-effective cloud system layouts.',
    topColleges: [
      'BITS Pilani',
      'IIT Roorkee',
      'CMU',
      'University of Texas at Austin',
      'Cloud Provider Certifications (AWS/Azure/GCP)',
    ],
  },
};

export const defaultOutlook: CareerOutlook = {
  salaryRange: '₹6L - ₹15L / $70,000 - $120,000',
  growthRate: '8% (Steady Growth)',
  demandLevel: 'High',
  topRoles: ['Specialist Consultant', 'Industry Analyst', 'Project Manager'],
  outlookDescription:
    'This field offers solid professional growth with stable career pathways and versatile opportunities across multiple sectors.',
  topColleges: ['Top National Universities', 'Global Accredited Colleges'],
};

// Map interest keys to human-readable names
const INTEREST_LABELS: Record<string, string> = {
  tech_ai: 'Software, Coding & Artificial Intelligence',
  medicine_bio: 'Medicine & Biological Sciences',
  business_ent: 'Business & Entrepreneurship',
  design_arts: 'UI/UX, Design & Fine Arts',
  marketing_pr: 'Marketing & Public Relations',
  education_social: 'Education & Social Support',
  law_civil: 'Law & Civil Services',
  finance_econ: 'Finance & Economics',
  space_research: 'Space & Scientific Research',
  media_writing: 'Media, Writing & Journalism',
};

// Map hobbies to cognitive/vocational strengths
const HOBBY_STRENGTHS: Record<string, { trait: string; explanation: string }> = {
  'video gaming': {
    trait: 'spatial reasoning and rapid decision-making',
    explanation:
      'indicates high cognitive flexibility, strategic foresight, and spatial problem-solving skills.',
  },
  'creative writing / blogging': {
    trait: 'verbal reasoning and narrative framing',
    explanation:
      'reflects strong communication skills, verbal synthesis, and the ability to articulate complex thoughts clearly.',
  },
  'painting / sketching / sculpting': {
    trait: 'creative visualization and spatial aesthetics',
    explanation:
      'shows exceptional design sensibilities, creative imagination, and visual attention to detail.',
  },
  'playing sports / fitness': {
    trait: 'discipline and kinesthetic coordination',
    explanation:
      'suggests strong resilience, team collaboration dynamics, goal orientation, and physical stamina.',
  },
  'playing musical instruments': {
    trait: 'pattern recognition and focused attention',
    explanation:
      'demonstrates strong cognitive discipline, auditory-mathematical processing, and fine motor skills.',
  },
  'coding / side projects': {
    trait: 'logical analysis and structured building',
    explanation:
      'highlights strong computational thinking, systems architecture design, and a self-driven learning attitude.',
  },
  'reading / podcasts': {
    trait: 'intellectual curiosity and conceptual synthesis',
    explanation:
      'indicates a broad knowledge retention capacity, willingness to absorb new perspectives, and high text comprehension.',
  },
  'photography / videography': {
    trait: 'visual composition and storytelling',
    explanation:
      'suggests an eye for framing, media capture techniques, digital edit orchestration, and aesthetic balance.',
  },
  'debating / public speaking': {
    trait: 'persuasion and rapid logical formulation',
    explanation:
      'signifies high verbal execution speeds, critical argument evaluation, self-confidence, and public leadership.',
  },
  'tinkering with gadgets': {
    trait: 'hardware troubleshooting and hands-on analysis',
    explanation:
      'proves high mechanical reasoning, technological curiosity, and logical systems analysis.',
  },
  'solving puzzles / chess': {
    trait: 'strategic formulation and mathematical execution',
    explanation:
      'displays strong pattern recognition, foresight planning, working memory, and numerical logic.',
  },
  'gardening / cooking': {
    trait: 'process execution and creative composition',
    explanation:
      'reflects patience, systemic process adherence, sensory appreciation, and organic attention to detail.',
  },
};

// Generate: Why this course fits (Direct, conversational, starting with "You enjoy...")
function getWhyItFits(data: AssessmentData, course: Course): string {
  let reasoning = (course.reasoningTemplate || 'analytical problem solving and innovation')
    .trim()
    .replace(/\.$/, '');

  // Convert starting "Matches your" or "Matches" to fit grammatically after "You enjoy"
  let cleanedReasoning = reasoning.toLowerCase();
  if (cleanedReasoning.startsWith('matches your')) {
    cleanedReasoning = cleanedReasoning.replace(/^matches your/, 'exploring your');
  } else if (cleanedReasoning.startsWith('matches')) {
    cleanedReasoning = cleanedReasoning.replace(/^matches/, 'focusing on');
  }

  // Format matching interest keywords
  const interestsText = course.interests
    .slice(0, 2)
    .map((i) => {
      if (i === 'tech_ai') return 'technology and AI';
      if (i === 'finance_econ') return 'finance and economics';
      if (i === 'business_ent') return 'business and entrepreneurship';
      if (i === 'design_arts') return 'creative design and product aesthetics';
      if (i === 'marketing_pr') return 'marketing and public communication';
      if (i === 'law_civil') return 'legal systems and public policy';
      if (i === 'media_writing') return 'writing and digital storytelling';
      return INTEREST_LABELS[i] || i;
    })
    .join(', ');

  return `You enjoy ${cleanedReasoning} and applying your skills in ${interestsText}.`;
}

// Generate: Strength Analysis (Directly connects hobbies/activities to course strengths)
function getStrengthAnalysis(data: AssessmentData, course: Course): string {
  if (!data.hobbies || data.hobbies.length === 0) {
    return `Your natural academic strengths align perfectly with the core intellectual and structural demands of this career path.`;
  }

  const matchingHobbies = data.hobbies.filter((hobby) =>
    course.hobbies.some((ch) => ch.toLowerCase().trim() === hobby.toLowerCase().trim())
  );

  const primaryHobby = matchingHobbies[0] || data.hobbies[0];
  const normalizedHobby = primaryHobby.toLowerCase().trim();
  const strengthDetails = HOBBY_STRENGTHS[normalizedHobby];

  if (strengthDetails) {
    return `Your hobby of "${primaryHobby}" highlights your strength in ${strengthDetails.trait}. This skill directly translates into the core analytical, design, or execution capabilities required in ${course.name}.`;
  }

  return `Your active participation in hobbies like ${data.hobbies.slice(0, 2).join(' and ')} shows hands-on execution skills, creative thinking, and a disciplined focus that will help you excel in this field.`;
}

// Generate: Interest Analysis (Connects declared interests directly to curriculum)
function getInterestAnalysis(data: AssessmentData, course: Course): string {
  const matchedInterests = data.interests.filter((interest) => course.interests.includes(interest));

  if (matchedInterests.length === 0) {
    if (data.interests.length > 0) {
      const firstInterest = INTEREST_LABELS[data.interests[0]] || data.interests[0];
      return `While your primary interest is in "${firstInterest}", exploring this path offers a valuable interdisciplinary way to apply your skills in a new, high-value domain.`;
    }
    return `This field provides an excellent opportunity to expand your knowledge and discover new academic passions.`;
  }

  const interestNames = matchedInterests.map((key) => INTEREST_LABELS[key] || key);
  return `Your interest in ${interestNames.slice(0, 2).join(' & ')} directly matches the core subjects of this field. This natural curiosity will make learning these complex topics engaging and motivating for you.`;
}

// Generate: Career Fit Analysis / Matching Work Style
function getCareerFitAnalysis(data: AssessmentData, course: Course): string {
  const analysisParts: string[] = [];

  // Evaluate Collaboration
  const diffCollab = Math.abs(data.workStyle.collaboration - course.workStyle.collaboration);
  if (diffCollab <= 1) {
    if (course.workStyle.collaboration >= 4) {
      analysisParts.push(
        `Your preference for team collaboration fits the highly interactive group dynamics here.`
      );
    } else if (course.workStyle.collaboration <= 2) {
      analysisParts.push(
        `Your focus on independent execution matches the deep solo concentration required in this domain.`
      );
    }
  }

  // Evaluate Workplace
  const diffWorkplace = Math.abs(data.workStyle.workplace - course.workStyle.workplace);
  if (diffWorkplace <= 1) {
    if (course.workStyle.workplace >= 4) {
      analysisParts.push(
        `Your love for active, outdoor work fits the operational environment of this track.`
      );
    } else if (course.workStyle.workplace <= 2) {
      analysisParts.push(
        `Your preference for indoor settings fits the studio, desk, or lab environments of this field.`
      );
    }
  }

  // Evaluate Structure
  const diffStructure = Math.abs(data.workStyle.structure - course.workStyle.structure);
  if (diffStructure <= 1) {
    if (course.workStyle.structure >= 4) {
      analysisParts.push(
        `Your desire for creative freedom matches the dynamic, open-ended problem solving in this role.`
      );
    } else if (course.workStyle.structure <= 2) {
      analysisParts.push(
        `Your preference for structured guidelines aligns with the organized processes of this career.`
      );
    }
  }

  // Evaluate Priorities
  if (data.priorities && data.priorities.length > 0) {
    const matchedPriorities = data.priorities.filter((p) => course.priorities.includes(p));
    if (matchedPriorities.length > 0) {
      const topPriority = matchedPriorities[0].split('_').join(' ');
      analysisParts.push(
        `This career also directly supports your goal of achieving a "${topPriority}" profile.`
      );
    }
  }

  if (analysisParts.length === 0) {
    return `This career matches a balanced professional profile, offering a stable environment and solid long-term career growth.`;
  }

  return analysisParts.join(' ');
}

// Main Explanation Generator Function
export function generateExplanation(data: AssessmentData, course: Course): CourseExplanation {
  const safeData: AssessmentData = {
    educationLevel: data?.educationLevel || '',
    stream: data?.stream || 'undecided',
    subjects: data?.subjects || [],
    interests: data?.interests || [],
    hobbies: data?.hobbies || [],
    workStyle: data?.workStyle || { collaboration: 3, workplace: 3, structure: 3 },
    priorities: data?.priorities || [],
    budget: data?.budget || '',
    additionalNotes: data?.additionalNotes || '',
  };

  return {
    whyThisCourseFits: getWhyItFits(safeData, course),
    strengthAnalysis: getStrengthAnalysis(safeData, course),
    interestAnalysis: getInterestAnalysis(safeData, course),
    careerFitAnalysis: getCareerFitAnalysis(safeData, course),
    careerOutlook: CAREER_OUTLOOKS[course.id] || defaultOutlook,
  };
}
