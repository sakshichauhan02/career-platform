import { AssessmentData, StreamType, WorkStyleData } from '@/types/assessment';
import { CourseExplanation } from '@/services/explanationEngine';

export interface Course {
  id: string;
  name: string;
  description: string;
  durationYears: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  streams: StreamType[];
  interests: string[];
  hobbies: string[];
  workStyle: WorkStyleData;
  priorities: string[];
  reasoningTemplate: string;
}

export interface ScoreBreakdown {
  streamScore: number;
  interestScore: number;
  hobbyScore: number;
  workStyleScore: number;
  priorityScore: number;
  totalScore: number;
}

export interface ScoredCourse {
  course: Course;
  score: number;
  breakdown: ScoreBreakdown;
  matchReasons: string[];
  explanation?: CourseExplanation;
}

// Predefined repository of 12 distinct premium courses
export const PREDEFINED_COURSES: Course[] = [
  {
    id: 'cse-ai',
    name: 'Computer Science & Artificial Intelligence',
    description:
      'Design software systems, write algorithms, and train machine learning models to solve complex real-world problems.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai'],
    hobbies: [
      'Coding / Side Projects',
      'Video Gaming',
      'Tinkering with gadgets',
      'Solving Puzzles / Chess',
    ],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 }, // Desk/Office, Flexible/Creative
    priorities: ['high_salary', 'creative_freedom', 'global_mobility'],
    reasoningTemplate:
      'Highly aligns with your interests in software, AI development, and creative problem-solving.',
  },
  {
    id: 'medicine-mbbs',
    name: 'Medicine & Healthcare (MBBS)',
    description:
      'Diagnose illnesses, perform surgeries, and provide medical care to patients in clinical and hospital settings.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio'],
    hobbies: ['Reading / Podcasts', 'Gardening / Cooking', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 4, workplace: 4, structure: 2 }, // Hospital setting, structured
    priorities: ['stability_security', 'social_impact', 'prestige_status'],
    reasoningTemplate:
      'Matches your biological interests and aspiration to make a high social impact in healthcare.',
  },
  {
    id: 'uiux-product-design',
    name: 'Product Design & UI/UX',
    description:
      'Create beautiful, user-centered digital interfaces, mobile app mockups, and physical product layouts.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'pcm', 'general'],
    interests: ['design_arts', 'tech_ai'],
    hobbies: ['Painting / Sketching / Sculpting', 'Photography / Videography', 'Video Gaming'],
    workStyle: { collaboration: 4, workplace: 1, structure: 5 }, // Desk, highly flexible/creative
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Perfect fit for your artistic flair and interest in digital design and usability.',
  },
  {
    id: 'chartered-accountancy',
    name: 'Chartered Accountancy (CA)',
    description:
      'Master taxation, financial audits, corporate accounting, and portfolio investments for corporate enterprises.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['commerce', 'general'],
    interests: ['finance_econ', 'business_ent'],
    hobbies: ['Solving Puzzles / Chess', 'Reading / Podcasts'],
    workStyle: { collaboration: 2, workplace: 1, structure: 1 }, // Desk, highly structured/independent
    priorities: ['high_salary', 'stability_security', 'prestige_status'],
    reasoningTemplate:
      'Strongly aligns with your finance interests and preference for a structured, analytical domain.',
  },
  {
    id: 'business-admin-mba',
    name: 'Business Administration & Management',
    description:
      'Lead commercial operations, coordinate cross-functional teams, design strategies, and launch startups.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'arts', 'pcm', 'pcb', 'general'],
    interests: ['business_ent', 'marketing_pr'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 5, workplace: 2, structure: 3 }, // Highly collaborative, mixed workspace
    priorities: ['high_salary', 'prestige_status', 'global_mobility'],
    reasoningTemplate: 'Matches your entrepreneurial ambition and collaborative work style.',
  },
  {
    id: 'law-llb',
    name: 'Corporate & Civil Law (BA LLB)',
    description:
      'Study legal systems, analyze public policy, drafts contracts, and advocate for corporate or individual clients.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['arts', 'commerce', 'general'],
    interests: ['law_civil', 'media_writing'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 3, structure: 2 }, // Structured, mixed desk and court
    priorities: ['prestige_status', 'stability_security', 'social_impact'],
    reasoningTemplate:
      'Aligns with your legal interest, public speaking hobby, and high status priority.',
  },
  {
    id: 'space-astrophysics',
    name: 'Space Science & Astrophysics',
    description:
      'Analyze stellar phenomena, study quantum physics models, and participate in astronomical space research.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['space_research', 'tech_ai'],
    hobbies: ['Tinkering with gadgets', 'Solving Puzzles / Chess', 'Reading / Podcasts'],
    workStyle: { collaboration: 2, workplace: 2, structure: 3 }, // Scientific research environment
    priorities: ['creative_freedom', 'global_mobility', 'stability_security'],
    reasoningTemplate:
      'Tailored for your scientific curiosity, space interest, and independent research style.',
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing & PR',
    description:
      'Manage brand marketing campaigns, run search ads, configure social media hooks, and execute PR strategies.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['commerce', 'arts', 'general'],
    interests: ['marketing_pr', 'media_writing'],
    hobbies: ['Creative Writing / Blogging', 'Photography / Videography', 'Video Gaming'],
    workStyle: { collaboration: 4, workplace: 1, structure: 4 }, // Desk, highly collaborative
    priorities: ['creative_freedom', 'work_life_balance', 'high_salary'],
    reasoningTemplate: 'Combines your interest in marketing, creative writing, and digital media.',
  },
  {
    id: 'biotechnology',
    name: 'Biotechnology & Genetics',
    description:
      'Synthesize biological products, analyze genetic sequences, and conduct laboratory pharma research.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'pcm', 'general'],
    interests: ['medicine_bio', 'space_research'],
    hobbies: ['Tinkering with gadgets', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 }, // Lab environment
    priorities: ['stability_security', 'global_mobility'],
    reasoningTemplate:
      'Matches your interest in healthcare innovation and scientific experimentation.',
  },
  {
    id: 'journalism-media',
    name: 'Journalism & Media Communications',
    description:
      'Report news, write columns, shoot documentaries, and work in digital broadcast environments.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['media_writing', 'marketing_pr', 'education_social'],
    hobbies: [
      'Creative Writing / Blogging',
      'Photography / Videography',
      'Debating / Public Speaking',
    ],
    workStyle: { collaboration: 3, workplace: 3, structure: 5 }, // Field/Studio work, highly flexible
    priorities: ['creative_freedom', 'work_life_balance', 'social_impact'],
    reasoningTemplate:
      'Suits your creative writing inclination, debating hobby, and desire to impact society.',
  },
  {
    id: 'clinical-psychology',
    name: 'Clinical Psychology & Therapy',
    description:
      'Study human behavior, counsel patients, and help resolve psychological challenges in medical or private practice.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'pcb', 'general'],
    interests: ['education_social', 'medicine_bio'],
    hobbies: ['Reading / Podcasts', 'Debating / Public Speaking'],
    workStyle: { collaboration: 3, workplace: 1, structure: 3 }, // Office counselling
    priorities: ['social_impact', 'work_life_balance', 'stability_security'],
    reasoningTemplate:
      'Perfect for your social support interests and your preference for human-centered counseling work.',
  },
  {
    id: 'finance-investment-banking',
    name: 'Financial Engineering & Investment Banking',
    description:
      'Analyze capital markets, model asset valuation, execute stock options, and manage venture portfolios.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['commerce', 'pcm', 'general'],
    interests: ['finance_econ', 'business_ent'],
    hobbies: ['Solving Puzzles / Chess', 'Reading / Podcasts', 'Video Gaming'],
    workStyle: { collaboration: 4, workplace: 1, structure: 2 }, // Structured corporate finance desk
    priorities: ['high_salary', 'prestige_status', 'global_mobility'],
    reasoningTemplate:
      'Matches your interest in economics, stock markets, and high earning potential.',
  },
];

// Utility: Stream matching score (Weight: 30)
export function scoreStream(userStream: string, courseStreams: StreamType[]): number {
  if (!userStream || userStream === 'undecided' || userStream === 'general') {
    return 30; // Wildcard match
  }
  const isMatch = courseStreams.includes(userStream as StreamType);
  return isMatch ? 30 : 0;
}

// Utility: Interest matching score (Weight: 30)
export function scoreInterests(userInterests: string[], courseInterests: string[]): number {
  if (!userInterests || userInterests.length === 0) return 0;

  // Find intersection
  const matches = userInterests.filter((interest) => courseInterests.includes(interest));
  if (matches.length === 0) return 0;

  // Proportional match based on course interest tags
  const ratio = matches.length / courseInterests.length;
  return Math.min(ratio * 30, 30);
}

// Utility: Hobby matching score (Weight: 15)
export function scoreHobbies(userHobbies: string[], courseHobbies: string[]): number {
  if (!userHobbies || userHobbies.length === 0) return 0;

  const matches = userHobbies.filter((hobby) => {
    // Normalise casing and check exact matches or substrings
    const normHobby = hobby.toLowerCase().trim();
    return courseHobbies.some((ch) => ch.toLowerCase().trim() === normHobby);
  });

  if (matches.length === 0) return 0;

  const ratio = matches.length / courseHobbies.length;
  return Math.min(ratio * 15, 15);
}

// Utility: Work Style matching score (Weight: 15)
// Uses absolute distance across 3 axes. Max total diff is 12.
export function scoreWorkStyle(
  userWorkStyle: WorkStyleData,
  courseWorkStyle: WorkStyleData
): number {
  if (!userWorkStyle) return 0;

  const diffCollab = Math.abs(userWorkStyle.collaboration - courseWorkStyle.collaboration);
  const diffWorkplace = Math.abs(userWorkStyle.workplace - courseWorkStyle.workplace);
  const diffStructure = Math.abs(userWorkStyle.structure - courseWorkStyle.structure);

  const totalDiff = diffCollab + diffWorkplace + diffStructure;
  const ratio = 1 - totalDiff / 12;

  return ratio * 15;
}

// Utility: Priorities matching score (Weight: 10)
// Ranked matches: #1 = 5pts, #2 = 3pts, #3 = 2pts, others = 1pt
export function scorePriorities(userPriorities: string[], coursePriorities: string[]): number {
  if (!userPriorities || userPriorities.length === 0) return 0;

  let points = 0;
  userPriorities.forEach((priorityId, index) => {
    if (coursePriorities.includes(priorityId)) {
      if (index === 0) points += 5;
      else if (index === 1) points += 3;
      else if (index === 2) points += 2;
      else points += 1;
    }
  });

  return Math.min(points, 10);
}

// Main Scoring Service
export function scoreCourses(data: AssessmentData): ScoredCourse[] {
  const safeData = {
    stream: data?.stream || 'undecided',
    interests: data?.interests || [],
    hobbies: data?.hobbies || [],
    workStyle: data?.workStyle || { collaboration: 3, workplace: 3, structure: 3 },
    priorities: data?.priorities || [],
  };

  const scored = PREDEFINED_COURSES.map((course) => {
    const streamScore = scoreStream(safeData.stream, course.streams);
    const interestScore = scoreInterests(safeData.interests, course.interests);
    const hobbyScore = scoreHobbies(safeData.hobbies, course.hobbies);
    const workStyleScore = scoreWorkStyle(safeData.workStyle, course.workStyle);
    const priorityScore = scorePriorities(safeData.priorities, course.priorities);

    const totalScore = Math.round(
      streamScore + interestScore + hobbyScore + workStyleScore + priorityScore
    );

    // Build reasons for matching UI
    const matchReasons: string[] = [];
    if (streamScore > 0) {
      matchReasons.push(
        `Fits your ${safeData.stream ? safeData.stream.toUpperCase() : 'selected'} stream preference.`
      );
    }
    const matchingInterests = safeData.interests.filter((i) => course.interests.includes(i));
    if (matchingInterests.length > 0) {
      matchReasons.push(
        'Matches interest area: ' +
          matchingInterests
            .map((i) =>
              i
                .split('_')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')
            )
            .join(', ')
      );
    }
    const matchingHobbies = safeData.hobbies.filter((h) =>
      course.hobbies.some((ch) => ch.toLowerCase().trim() === h.toLowerCase().trim())
    );
    if (matchingHobbies.length > 0) {
      matchReasons.push(`Matches hobbies: ${matchingHobbies.join(', ')}.`);
    }
    if (workStyleScore >= 12) {
      matchReasons.push('Strongly matches your work environment preferences.');
    }
    const matchingPriorities = safeData.priorities.filter((p) => course.priorities.includes(p));
    if (matchingPriorities.length > 0 && course.priorities.includes(safeData.priorities[0])) {
      matchReasons.push(
        `Aligns directly with your #1 priority: ${safeData.priorities[0].split('_').join(' ')}.`
      );
    }

    return {
      course,
      score: totalScore,
      breakdown: {
        streamScore,
        interestScore,
        hobbyScore,
        workStyleScore,
        priorityScore,
        totalScore,
      },
      matchReasons,
    };
  });

  // Sort descending by score, then name
  return scored.sort((a, b) => b.score - a.score || a.course.name.localeCompare(b.course.name));
}
