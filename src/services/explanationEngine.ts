import { AssessmentData } from '@/types/assessment';
import { Course } from '@/services/recommendationEngine';

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

// Generate: Why this course fits
function getWhyItFits(data: AssessmentData, course: Course): string {
  const streamText = data.stream
    ? `Fits directly with your ${data.stream.toUpperCase()} background requirements.`
    : 'Aligns with your general academic background.';
  return `${course.reasoningTemplate} ${streamText} This course forms a strategic bridge matching your profile parameters, giving you a strong foundation to excel.`;
}

// Generate: Strength Analysis
function getStrengthAnalysis(data: AssessmentData, course: Course): string {
  if (!data.hobbies || data.hobbies.length === 0) {
    return `Your baseline academic profile indicates a strong potential for the structural demands of ${course.name}.`;
  }

  // Find overlapping strengths based on user's hobbies
  const matchingHobbies = data.hobbies.filter((hobby) =>
    course.hobbies.some((ch) => ch.toLowerCase().trim() === hobby.toLowerCase().trim())
  );

  const primaryHobby = matchingHobbies[0] || data.hobbies[0];
  const normalizedHobby = primaryHobby.toLowerCase().trim();
  const strengthDetails = HOBBY_STRENGTHS[normalizedHobby];

  if (strengthDetails) {
    return `Your hobby of "${primaryHobby}" which utilizes ${strengthDetails.trait}, ${strengthDetails.explanation} This directly translates into the core analytical, design, or execution strengths required in ${course.name}.`;
  }

  return `Your active participation in hobbies like ${data.hobbies.slice(0, 2).join(' and ')} shows balanced cognitive development. These extracurricular pursuits indicate hands-on execution skills and project discipline that will support your academic load in this field.`;
}

// Generate: Interest Analysis
function getInterestAnalysis(data: AssessmentData, course: Course): string {
  const matchedInterests = data.interests.filter((interest) => course.interests.includes(interest));

  if (matchedInterests.length === 0) {
    if (data.interests.length > 0) {
      const firstInterest = INTEREST_LABELS[data.interests[0]] || data.interests[0];
      return `While your primary interest is in "${firstInterest}", exploring ${course.name} offers a valuable interdisciplinary pathway to apply your analytical skills in a new context.`;
    }
    return `This course provides a comprehensive introduction to fields related to ${course.name}, helping you discover new subjects and academic passions.`;
  }

  const interestNames = matchedInterests.map((key) => INTEREST_LABELS[key] || key);
  return `You have a declared interest in ${interestNames.join(' & ')}. In ${course.name}, these topics form the absolute backbone of the curriculum. Your interest acts as natural motivation to master the complex subjects in this path.`;
}

// Generate: Career Fit Analysis
function getCareerFitAnalysis(data: AssessmentData, course: Course): string {
  const analysisParts: string[] = [];

  // 1. Evaluate Work Style Sliders
  // Collaboration
  const diffCollab = Math.abs(data.workStyle.collaboration - course.workStyle.collaboration);
  if (diffCollab <= 1) {
    if (course.workStyle.collaboration >= 4) {
      analysisParts.push(
        `Your preference for team collaboration matches the highly interactive group dynamics of this career.`
      );
    } else if (course.workStyle.collaboration <= 2) {
      analysisParts.push(
        `Your focus on independent execution aligns with the solo concentration and research focus of this domain.`
      );
    }
  }

  // Workplace
  const diffWorkplace = Math.abs(data.workStyle.workplace - course.workStyle.workplace);
  if (diffWorkplace <= 1) {
    if (course.workStyle.workplace >= 4) {
      analysisParts.push(
        `Your desire for outdoor, active, or field work fits the operational environment of this track.`
      );
    } else if (course.workStyle.workplace <= 2) {
      analysisParts.push(
        `Your preference for indoor settings fits the studio, desk, or lab environments of this field.`
      );
    }
  }

  // Structure
  const diffStructure = Math.abs(data.workStyle.structure - course.workStyle.structure);
  if (diffStructure <= 1) {
    if (course.workStyle.structure >= 4) {
      analysisParts.push(
        `The dynamic, open-ended, and highly creative problems in this role will satisfy your creative freedom goals.`
      );
    } else if (course.workStyle.structure <= 2) {
      analysisParts.push(
        `Your preference for clear guidelines matches the organized processes and structural rules of this career.`
      );
    }
  }

  // 2. Evaluate Priorities
  if (data.priorities && data.priorities.length > 0) {
    const matchedPriorities = data.priorities.filter((p) => course.priorities.includes(p));
    if (matchedPriorities.length > 0) {
      const topPriority = matchedPriorities[0].split('_').join(' ');
      analysisParts.push(
        `Furthermore, this career path matches your priority of achieving a "${topPriority}" profile.`
      );
    }
  }

  if (analysisParts.length === 0) {
    return `This career matches a balanced professional profile, offering solid long-term growth and stable work structures.`;
  }

  return analysisParts.join(' ');
}

// Main Explanation Generator Function
export function generateExplanation(data: AssessmentData, course: Course): CourseExplanation {
  const safeData = {
    stream: data?.stream || 'undecided',
    interests: data?.interests || [],
    hobbies: data?.hobbies || [],
    workStyle: data?.workStyle || { collaboration: 3, workplace: 3, structure: 3 },
    priorities: data?.priorities || [],
  };

  return {
    whyThisCourseFits: getWhyItFits(safeData, course),
    strengthAnalysis: getStrengthAnalysis(safeData, course),
    interestAnalysis: getInterestAnalysis(safeData, course),
    careerFitAnalysis: getCareerFitAnalysis(safeData, course),
    careerOutlook: CAREER_OUTLOOKS[course.id] || defaultOutlook,
  };
}
