import { AssessmentData, StreamType, WorkStyleData } from '@/types/assessment';
import type { CourseExplanation } from '@/services/explanationEngine';

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
  {
    id: 'prompt-engineer',
    name: 'Prompt Engineering & Generative AI',
    description:
      'Craft precise text prompts and design context frameworks to guide generative AI systems in producing high-quality content, code, and creative outputs.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'commerce', 'arts', 'general'],
    interests: ['tech_ai', 'media_writing'],
    hobbies: [
      'Coding / Side Projects',
      'Creative Writing / Blogging',
      'Video Gaming',
      'Reading / Podcasts',
    ],
    workStyle: { collaboration: 2, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'high_salary', 'global_mobility'],
    reasoningTemplate:
      'Perfect for your interest in AI, natural language, creative writing, and independent digital problem-solving.',
  },
  {
    id: 'ai-product-manager',
    name: 'AI Product Management',
    description:
      'Bridge the gap between AI engineering, business strategy, and user experience to design, launch, and scale intelligence-driven software products.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'commerce', 'general'],
    interests: ['tech_ai', 'business_ent', 'marketing_pr'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 5, workplace: 1, structure: 3 },
    priorities: ['high_salary', 'prestige_status', 'creative_freedom'],
    reasoningTemplate:
      'Strongly matches your business ambition, interest in cutting-edge AI technologies, and collaborative leadership style.',
  },
  {
    id: 'ux-researcher',
    name: 'UX Research & Cognitive Design',
    description:
      'Conduct user interviews, analyze behavioral analytics, and perform usability audits to guide intuitive, empathetic digital product designs.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'pcm', 'general'],
    interests: ['design_arts', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Photography / Videography', 'Debating / Public Speaking'],
    workStyle: { collaboration: 4, workplace: 1, structure: 4 },
    priorities: ['work_life_balance', 'social_impact', 'creative_freedom'],
    reasoningTemplate:
      'Aligns with your empathy-driven social support interests, cognitive curiosity, and appreciation for digital product usability.',
  },
  {
    id: 'data-scientist',
    name: 'Data Science & Analytics',
    description:
      'Extract insights from large structured and unstructured datasets using statistical modeling, machine learning pipelines, and predictive algorithms.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'finance_econ'],
    hobbies: ['Solving Puzzles / Chess', 'Coding / Side Projects', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'stability_security', 'global_mobility'],
    reasoningTemplate:
      'Highly aligns with your mathematical background, coding projects, and analytical interest in business or finance data.',
  },
  {
    id: 'bioinformatics-analyst',
    name: 'Bioinformatics & Computational Biology',
    description:
      'Apply computational tools, statistical models, and algorithms to analyze massive biological datasets like genomic sequences and protein structures.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'pcm', 'general'],
    interests: ['medicine_bio', 'tech_ai', 'space_research'],
    hobbies: ['Coding / Side Projects', 'Solving Puzzles / Chess', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['stability_security', 'social_impact', 'global_mobility'],
    reasoningTemplate:
      'A stellar combination of your interest in biological sciences, medical innovation, and computational programming.',
  },
  {
    id: 'sustainability-consultant',
    name: 'Sustainability & Green Consulting',
    description:
      'Advise businesses and public institutions on environmental impact mitigation, green energy transition, resource conservation, and ESG compliance.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'pcm', 'pcb', 'general'],
    interests: ['education_social', 'business_ent', 'space_research'],
    hobbies: ['Reading / Podcasts', 'Debating / Public Speaking', 'Gardening / Cooking'],
    workStyle: { collaboration: 4, workplace: 3, structure: 3 },
    priorities: ['social_impact', 'creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Matches your environmental stewardship interests, counseling/consulting desire, and vision for long-term global impact.',
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity & Digital Forensics',
    description:
      'Defend digital infrastructure, run penetration tests, audit network systems, and trace cyber threat vectors to protect corporate and national security.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'law_civil'],
    hobbies: [
      'Tinkering with gadgets',
      'Coding / Side Projects',
      'Video Gaming',
      'Solving Puzzles / Chess',
    ],
    workStyle: { collaboration: 2, workplace: 1, structure: 1 },
    priorities: ['stability_security', 'high_salary', 'prestige_status'],
    reasoningTemplate:
      'Perfect for your system troubleshooting skills, coding projects, and interest in legal/security regulatory frameworks.',
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Architecture & Infrastructure',
    description:
      'Design, build, and manage scalable, secure, and highly available cloud computing networks and enterprise system architectures.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'business_ent'],
    hobbies: ['Coding / Side Projects', 'Tinkering with gadgets', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'global_mobility', 'stability_security'],
    reasoningTemplate:
      'Matches your logical systems analytical skills, passion for programming, and desire for high-prestige technology leadership.',
  },

  {
    id: '507a676e-1671-4e30-a746-0b8469107063',
    name: 'Software Engineering & Distributed Systems',
    description:
      'Design highly available distributed systems, master architectural design patterns, and manage modern software lifecycle operations.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'general'],
    interests: ['tech_ai'],
    hobbies: ['Coding / Side Projects', 'Tinkering with gadgets', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 3 },
    priorities: ['high_salary', 'creative_freedom', 'global_mobility'],
    reasoningTemplate:
      'Highly aligns with your interests in technology, systems programming, and digital innovation.',
  },
  {
    id: 'fb0d171e-6af4-4d2d-ae91-f9c5c06a0412',
    name: 'Robotics & Automation Engineering',
    description:
      'Build autonomous robots, design mechanical actuators, and program real-time controller systems using ROS and C++.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'space_research'],
    hobbies: ['Tinkering with gadgets', 'Coding / Side Projects', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['creative_freedom', 'high_salary'],
    reasoningTemplate:
      'Matches your mechanical curiosity, programming background, and interest in automated robotics systems.',
  },
  {
    id: 'c78fdf66-2b71-4381-a3ec-fee775030118',
    name: 'Internet of Things (IoT) & Embedded Systems',
    description:
      'Architect connected networks of smart sensors, program microcontrollers, and manage real-time edge computing data pipelines.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'general'],
    interests: ['tech_ai'],
    hobbies: ['Tinkering with gadgets', 'Coding / Side Projects', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['stability_security', 'creative_freedom'],
    reasoningTemplate:
      'Perfect for your hardware tinkering skills, systems thinking, and interest in smart networks.',
  },
  {
    id: 'b2a36ace-bcfe-4a36-a20e-5dc9acb0a222',
    name: 'Blockchain & Smart Contract Engineering',
    description:
      'Design decentralized web applications, write secure Solidity contracts, and analyze cryptographic token economics.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'commerce', 'general'],
    interests: ['tech_ai', 'finance_econ'],
    hobbies: ['Coding / Side Projects', 'Solving Puzzles / Chess', 'Video Gaming'],
    workStyle: { collaboration: 2, workplace: 1, structure: 4 },
    priorities: ['high_salary', 'global_mobility', 'creative_freedom'],
    reasoningTemplate:
      'Aligns with your coding strengths, strategic logic, and interest in decentralized finance systems.',
  },
  {
    id: '21c39373-bdc4-4306-a89c-07a31b21c010',
    name: 'DevOps & Cloud Site Reliability',
    description:
      'Automate software delivery pipelines, manage Kubernetes clusters, and orchestrate scalable infrastructure-as-code.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai'],
    hobbies: ['Coding / Side Projects', 'Tinkering with gadgets', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['stability_security', 'high_salary', 'global_mobility'],
    reasoningTemplate:
      'Combines your interest in cloud architecture, system automation, and high-security operations.',
  },
  {
    id: 'bd821578-5ced-4f03-a1e1-6fe5491c8010',
    name: 'Game Development & Graphics Programming',
    description:
      'Program 3D physics engines, write shaders, and build interactive gameplay systems using C++, Unity, and Unreal Engine.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'design_arts'],
    hobbies: ['Video Gaming', 'Coding / Side Projects', 'Painting / Sketching / Sculpting'],
    workStyle: { collaboration: 4, workplace: 1, structure: 5 },
    priorities: ['creative_freedom', 'global_mobility'],
    reasoningTemplate:
      'Combines your software engineering skills, creative design flair, and gaming hobbies.',
  },
  {
    id: '8c70cd32-4557-415a-afc9-27d89d045005',
    name: 'Network Infrastructure & Architecture',
    description:
      'Design routing protocols, configure virtual networks, and build resilient hardware infrastructures for enterprise datacenters.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'general'],
    interests: ['tech_ai'],
    hobbies: ['Tinkering with gadgets', 'Coding / Side Projects', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['stability_security', 'high_salary'],
    reasoningTemplate:
      'Perfect for your logical troubleshooting skills and interest in hardware and network setups.',
  },
  {
    id: '7a51223e-13a4-4e94-ac69-f5cb72120020',
    name: 'Embedded Systems & VLSI Design',
    description:
      'Design microchip architectures, write low-level firmware, and test integrated circuit layouts using VHDL and Verilog.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'space_research'],
    hobbies: ['Tinkering with gadgets', 'Coding / Side Projects', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 2, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'stability_security'],
    reasoningTemplate:
      'Matches your deep hardware engineering curiosity, logical puzzles hobby, and academic focus.',
  },
  {
    id: '7faefa9a-6f86-4385-a310-28c2c96f8638',
    name: 'Full-Stack Web Engineering',
    description:
      'Build responsive web applications using modern Javascript frameworks, scalable REST/GraphQL APIs, and relational databases.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['pcm', 'commerce', 'arts', 'general'],
    interests: ['tech_ai', 'design_arts'],
    hobbies: ['Coding / Side Projects', 'Creative Writing / Blogging', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'high_salary', 'work_life_balance'],
    reasoningTemplate:
      'Ideal for your creative building interest, coding background, and preference for user-facing applications.',
  },
  {
    id: '23b1d0dc-8e8d-403d-a0ad-3cd30c028100',
    name: 'Mobile Application Engineering',
    description:
      'Design and develop native iOS and Android apps alongside cross-platform systems using Swift, Kotlin, and React Native.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['pcm', 'commerce', 'arts', 'general'],
    interests: ['tech_ai', 'design_arts'],
    hobbies: ['Coding / Side Projects', 'Tinkering with gadgets', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['high_salary', 'global_mobility', 'work_life_balance'],
    reasoningTemplate:
      'Strongly matches your app development interests, coding side projects, and focus on clean mobile UX.',
  },
  {
    id: '128e3696-79a9-4870-a06b-27b196108806',
    name: 'High-Performance Computing & Clusters',
    description:
      'Configure supercomputer architectures, write parallel algorithms, and manage large-scale computational grids.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'space_research'],
    hobbies: ['Coding / Side Projects', 'Solving Puzzles / Chess', 'Tinkering with gadgets'],
    workStyle: { collaboration: 2, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'prestige_status'],
    reasoningTemplate:
      'Perfect for your mathematical problem solving, systems architecture interest, and academic focus.',
  },
  {
    id: 'e99b6e80-0aeb-47a9-aee3-70141e088b6a',
    name: 'Database Administration & Big Data Systems',
    description:
      'Optimize high-throughput SQL and NoSQL database clusters, manage data lakes, and configure Hadoop/Spark analytics environments.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'commerce', 'general'],
    interests: ['tech_ai', 'finance_econ'],
    hobbies: ['Solving Puzzles / Chess', 'Coding / Side Projects', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['stability_security', 'high_salary'],
    reasoningTemplate:
      'Aligns with your logical data organizing strengths, coding projects, and focus on analytical systems.',
  },
  {
    id: '8e01fca3-e5dc-482a-ae6b-dd7e0d840080',
    name: 'Virtual & Augmented Reality Engineering',
    description:
      'Build immersive spatial computing software, configure tracking systems, and program interactive VR/AR environments.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'arts', 'general'],
    interests: ['tech_ai', 'design_arts'],
    hobbies: ['Video Gaming', 'Coding / Side Projects', 'Photography / Videography'],
    workStyle: { collaboration: 4, workplace: 1, structure: 5 },
    priorities: ['creative_freedom', 'global_mobility'],
    reasoningTemplate:
      'Perfect fit for your interest in virtual worlds, spatial computing, and digital design.',
  },
  {
    id: '13850cfc-7e88-42aa-a36d-0d265f128008',
    name: 'Computer Vision & Image Processing',
    description:
      'Implement object recognition systems, program spatial camera calibration algorithms, and deploy optical tracking models.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'space_research'],
    hobbies: ['Coding / Side Projects', 'Solving Puzzles / Chess', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 3 },
    priorities: ['high_salary', 'global_mobility'],
    reasoningTemplate:
      'Aligns with your advanced mathematical skills, interest in camera systems, and coding background.',
  },
  {
    id: '4d3708bf-f08a-4dd1-abbd-bdd5a4400208',
    name: 'Natural Language Processing & Speech Tech',
    description:
      'Train neural language models, build speech recognition engines, and design dialogue agents using deep learning frameworks.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'media_writing'],
    hobbies: ['Coding / Side Projects', 'Reading / Podcasts', 'Creative Writing / Blogging'],
    workStyle: { collaboration: 3, workplace: 1, structure: 3 },
    priorities: ['high_salary', 'creative_freedom'],
    reasoningTemplate:
      'Strongly matches your natural language focus, deep learning coding interest, and writing hobbies.',
  },
  {
    id: 'e306f68e-da15-4878-a939-137107c20486',
    name: 'Quantum Software & Algorithms',
    description:
      'Master quantum mechanics fundamentals, write quantum gates circuits, and program quantum algorithms on real quantum hardware.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'space_research'],
    hobbies: ['Solving Puzzles / Chess', 'Tinkering with gadgets', 'Reading / Podcasts'],
    workStyle: { collaboration: 2, workplace: 1, structure: 3 },
    priorities: ['creative_freedom', 'prestige_status', 'global_mobility'],
    reasoningTemplate:
      'Designed for your deep theoretical physics curiosity, strategic chess puzzles hobby, and research focus.',
  },
  {
    id: '544dce95-2921-4974-aa7d-6c59df000186',
    name: 'Geographic Information Systems (GIS) Technology',
    description:
      'Analyze spatial mapping data, build interactive cartographic models, and manage geographical databases.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['pcm', 'arts', 'general'],
    interests: ['tech_ai', 'space_research'],
    hobbies: ['Tinkering with gadgets', 'Reading / Podcasts', 'Photography / Videography'],
    workStyle: { collaboration: 3, workplace: 2, structure: 3 },
    priorities: ['stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Matches your mapping interest, spatial technology curiosity, and preference for structured systems.',
  },
  {
    id: '59e6f631-5f1a-4caf-a506-fc3cc45902c2',
    name: 'Human-Robot Interaction & Social Robotics',
    description:
      'Design responsive robot behaviors, study human cognitive mechanics, and build collaborative robotic assistants.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'education_social'],
    hobbies: ['Tinkering with gadgets', 'Coding / Side Projects', 'Reading / Podcasts'],
    workStyle: { collaboration: 4, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'social_impact'],
    reasoningTemplate:
      'A stellar combination of your technological coding interests and human social support goals.',
  },
  {
    id: 'b9b05beb-1787-4df6-abae-37848011805b',
    name: 'Digital Twin & Industrial IoT Systems',
    description:
      'Model real-time physical systems in software, integrate industrial sensor telemetry, and build predictive maintenance simulations.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'general'],
    interests: ['tech_ai', 'business_ent'],
    hobbies: ['Tinkering with gadgets', 'Coding / Side Projects', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'stability_security'],
    reasoningTemplate:
      'Matches your system modeling interest, coding projects, and industrial systems curiosity.',
  },
  {
    id: '5662572e-c798-4807-ab91-fad755460000',
    name: 'Edge AI & TinyML Systems',
    description:
      'Optimize and deploy deep learning models on low-power, resource-constrained microcontroller hardware.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['tech_ai'],
    hobbies: ['Coding / Side Projects', 'Tinkering with gadgets', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'creative_freedom', 'global_mobility'],
    reasoningTemplate:
      'Perfect for your micro-hardware interests, deep learning models focus, and systems programming.',
  },
  {
    id: 'f1d6ba14-115c-4cc0-a6e0-8a7612115488',
    name: 'Cardiology & Cardiovascular Sciences',
    description:
      'Study cardiovascular pathologies, analyze diagnostic ECG recordings, and assist in clinical heart surgery procedures.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio'],
    hobbies: ['Reading / Podcasts', 'Playing Sports / Fitness', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 4, workplace: 2, structure: 2 },
    priorities: ['stability_security', 'social_impact', 'prestige_status'],
    reasoningTemplate:
      'Perfect for your medical care goals, deep biological interests, and high prestige priority.',
  },
  {
    id: '24bd45f4-64d9-4edf-ae40-64a80a249945',
    name: 'Neurology & Brain Sciences',
    description:
      'Investigate nervous system pathologies, analyze electroencephalograms, and treat neurological disorders.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'space_research'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Tinkering with gadgets'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['prestige_status', 'stability_security', 'social_impact'],
    reasoningTemplate:
      'Matches your deep neurological sciences curiosity, logical diagnostics interest, and clinical goals.',
  },
  {
    id: '7c318b1c-75fd-4f1d-a609-cc7aca743181',
    name: 'Pediatrics & Child Healthcare',
    description:
      'Master child developmental milestones, diagnose pediatric illnesses, and manage neonatal clinical care units.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Gardening / Cooking', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 4, workplace: 4, structure: 2 },
    priorities: ['social_impact', 'stability_security'],
    reasoningTemplate:
      'Aligns with your empathetic children education focus, pediatric medical care goals, and clinical interest.',
  },
  {
    id: '1582a5f7-af92-4e99-a9ba-104c6e0582a1',
    name: 'Nursing & Patient Care Sciences',
    description:
      'Deliver critical patient care, manage ward operations, administer clinical medications, and assist doctors in procedures.',
    durationYears: 4,
    difficultyLevel: 'Beginner',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Playing Sports / Fitness', 'Gardening / Cooking'],
    workStyle: { collaboration: 5, workplace: 4, structure: 2 },
    priorities: ['social_impact', 'stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Ideal for your patient support goals, cooperative medical care style, and clinical environment interest.',
  },
  {
    id: 'a4d2ed2f-cf52-4c79-a76b-802ab88452c5',
    name: 'Dentistry & Oral Health (BDS)',
    description:
      'Diagnose oral pathologies, perform orthodontic corrections, and deliver specialized dental healthcare treatments.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'design_arts'],
    hobbies: ['Painting / Sketching / Sculpting', 'Tinkering with gadgets', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['stability_security', 'prestige_status', 'work_life_balance'],
    reasoningTemplate:
      'Combines your orthopedic dental care goals, fine manual sketching hobbies, and stable career priority.',
  },
  {
    id: 'd9b0ab41-658e-4f9a-abbc-3e52ea4180a9',
    name: 'Pharmacy & Pharmaceutical Chemistry',
    description:
      'Master drug compositions, study biochemical pharmacology, and manage commercial pharmaceutical distribution.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcb', 'pcm', 'general'],
    interests: ['medicine_bio', 'business_ent'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Gardening / Cooking'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['stability_security', 'high_salary'],
    reasoningTemplate:
      'Matches your interest in biochemical drug compositions, pharmaceutical economics, and stable research.',
  },
  {
    id: 'cec9178f-b2e7-42b0-ae7c-2e3c8182c103',
    name: 'Physiotherapy & Rehabilitation (BPT)',
    description:
      'Design orthopedic recovery routines, treat sports injuries, and deliver muscular-skeletal rehabilitation treatments.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'education_social'],
    hobbies: ['Playing Sports / Fitness', 'Reading / Podcasts', 'Playing musical instruments'],
    workStyle: { collaboration: 4, workplace: 4, structure: 3 },
    priorities: ['social_impact', 'work_life_balance', 'stability_security'],
    reasoningTemplate:
      'Perfect for your orthopedic recovery interests, active physical fitness style, and patient counseling goals.',
  },
  {
    id: '8da75801-c8cc-4d72-a645-6b8f27888450',
    name: 'Biomedical Engineering & Medical Devices',
    description:
      'Design advanced medical scanners, construct prosthetic limbs, and calibrate clinical diagnostic electronics.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'pcb', 'general'],
    interests: ['medicine_bio', 'tech_ai'],
    hobbies: ['Tinkering with gadgets', 'Coding / Side Projects', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['high_salary', 'global_mobility', 'creative_freedom'],
    reasoningTemplate:
      'Aligns with your medical scanner engineering interests, electronic tinkering skills, and high salary priority.',
  },
  {
    id: '1da7db4a-ed97-4c37-a3f0-3018390d87c3',
    name: 'Nutrition, Dietetics & Metabolic Health',
    description:
      'Analyze nutritional deficiencies, formulate metabolic diet charts, and manage community health wellness programs.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'education_social'],
    hobbies: ['Gardening / Cooking', 'Reading / Podcasts', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 4, workplace: 1, structure: 3 },
    priorities: ['social_impact', 'work_life_balance'],
    reasoningTemplate:
      'Perfect for your metabolic diet interests, home cooking hobbies, and family support goals.',
  },
  {
    id: '0afef8df-6702-4b36-a26d-fc4bbd0202b0',
    name: 'Epidemiology & Public Health Administration',
    description:
      'Model contagious disease spread patterns, analyze public health statistics, and manage healthcare policy campaigns.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcb', 'pcm', 'general'],
    interests: ['medicine_bio', 'law_civil'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Debating / Public Speaking'],
    workStyle: { collaboration: 4, workplace: 2, structure: 2 },
    priorities: ['social_impact', 'stability_security', 'prestige_status'],
    reasoningTemplate:
      'Matches your public health statistics interests, logical reasoning, and social policy goals.',
  },
  {
    id: '2d65d3e2-56e1-4c1b-ad7b-84125f0461c1',
    name: 'Clinical Pathology & Diagnostics',
    description:
      'Analyze blood smears, process biopsy tissue slides, and run clinical diagnostic lab equipment.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Tinkering with gadgets'],
    workStyle: { collaboration: 2, workplace: 2, structure: 1 },
    priorities: ['stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Ideal for your independent diagnostic research style, high structured preference, and clinical focus.',
  },
  {
    id: '116102dd-bf00-4a5c-a0ae-61a71d110000',
    name: 'Medical Genetics & Counseling',
    description:
      'Analyze genetic mutation screenings, counsel families on hereditary risks, and study gene-therapy models.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Coding / Side Projects'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['stability_security', 'social_impact', 'global_mobility'],
    reasoningTemplate:
      'Matches your genetic mutation interest, scientific research focus, and family support goals.',
  },
  {
    id: '023db7f3-3b76-4833-aa39-4b34c9023483',
    name: 'Radiology & Medical Imaging Technology',
    description:
      'Operate advanced MRI, CT, and X-ray scanners, manage radiation safety, and catalog medical imaging records.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcb', 'pcm', 'general'],
    interests: ['medicine_bio', 'tech_ai'],
    hobbies: ['Tinkering with gadgets', 'Video Gaming', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Matches your scanner operations interest, electronic troubleshooting skills, and stable career goals.',
  },
  {
    id: '5f407d57-1d16-451e-a342-562cb41d0051',
    name: 'Oncology & Cancer Biology Sciences',
    description:
      'Study cellular mutation pathways, analyze chemotherapy protocols, and participate in clinical cancer research studies.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'space_research'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Coding / Side Projects'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['prestige_status', 'social_impact', 'stability_security'],
    reasoningTemplate:
      'Perfect for your deep cancer biology interest, clinical cancer research goals, and high status priority.',
  },
  {
    id: '99bfb46b-0ab1-4422-a793-0ef64c08b100',
    name: 'Immunology & Vaccine Development',
    description:
      'Investigate lymphatic immune responses, study autoimmune diseases, and research biochemical vaccine formulations.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'space_research'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Tinkering with gadgets'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['stability_security', 'global_mobility', 'social_impact'],
    reasoningTemplate:
      'Aligns with your vaccine development interests, deep laboratory research style, and global impact priority.',
  },
  {
    id: 'c7ed826d-ef29-4384-a728-c4ba2ac72900',
    name: 'Sports Medicine & Athletic Performance',
    description:
      'Study human biokinetics, manage athletic recovery plans, and treat muscular-skeletal sports trauma.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'education_social'],
    hobbies: ['Playing Sports / Fitness', 'Reading / Podcasts', 'Playing musical instruments'],
    workStyle: { collaboration: 4, workplace: 4, structure: 3 },
    priorities: ['social_impact', 'work_life_balance'],
    reasoningTemplate:
      'Perfect for your biokinetics recovery focus, active sports fitness style, and patient coaching goals.',
  },
  {
    id: 'c9b7a004-2a59-431a-a9e3-ee91ad081120',
    name: 'Clinical Pharmacology & Toxicology',
    description:
      'Analyze chemical poisoning vectors, study pharmaceutical drug interactions, and run forensic toxicology assays.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcb', 'pcm', 'general'],
    interests: ['medicine_bio', 'law_civil'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Tinkering with gadgets'],
    workStyle: { collaboration: 2, workplace: 2, structure: 2 },
    priorities: ['stability_security', 'high_salary'],
    reasoningTemplate:
      'Aligns with your chemical toxicology interests, independent laboratory focus, and stable career priority.',
  },
  {
    id: '7cf5c0a9-73f4-4138-a90f-01d32070f400',
    name: 'Geriatric Healthcare & Aging Sciences',
    description:
      'Study age-related cognitive and physical decline, and manage specialized medical care programs for senior citizens.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Gardening / Cooking', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 4, workplace: 4, structure: 2 },
    priorities: ['social_impact', 'stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Matches your elderly care interests, patient support goals, and empathetic clinical focus.',
  },
  {
    id: '0659267d-ed28-49a3-afeb-71bc42040802',
    name: 'Optometry & Ophthalmic Sciences',
    description:
      'Conduct visual acuity examinations, diagnose refractive errors, and manage clinical vision correction therapies.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['pcb', 'general'],
    interests: ['medicine_bio'],
    hobbies: ['Reading / Podcasts', 'Tinkering with gadgets', 'Gardening / Cooking'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Matches your clinical eye examination focus, independent desk style, and stable career priority.',
  },
  {
    id: '0b70cf7b-9ccf-45b4-a097-bf943b08404b',
    name: 'Hospital Operations & Healthcare Mgmt',
    description:
      'Manage clinical staffing networks, audit healthcare compliance regulations, and optimize emergency ward workflows.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcb', 'commerce', 'general'],
    interests: ['medicine_bio', 'business_ent'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 5, workplace: 2, structure: 3 },
    priorities: ['stability_security', 'high_salary', 'prestige_status'],
    reasoningTemplate:
      'Perfect for your hospital operations interest, cooperative management style, and stable administrative goals.',
  },
  {
    id: 'e6022e10-e5b5-444b-ad03-b76aade40004',
    name: 'Corporate Finance & Treasury Management',
    description:
      'Analyze capital budgeting, manage corporate cash flow liquidity, and evaluate merger and acquisition transactions.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'pcm', 'general'],
    interests: ['finance_econ', 'business_ent'],
    hobbies: ['Solving Puzzles / Chess', 'Reading / Podcasts', 'Video Gaming'],
    workStyle: { collaboration: 4, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'prestige_status', 'global_mobility'],
    reasoningTemplate:
      'Highly aligns with your corporate finance interest, corporate cash liquidity focus, and investment goals.',
  },
  {
    id: '29efcd97-ba72-4035-aa93-9dcecd286201',
    name: 'Human Resources & Talent Management',
    description:
      'Design corporate recruitment strategies, manage labor relations, and optimize employee training pipelines.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['commerce', 'arts', 'general'],
    interests: ['business_ent', 'education_social'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Gardening / Cooking'],
    workStyle: { collaboration: 4, workplace: 1, structure: 3 },
    priorities: ['work_life_balance', 'social_impact', 'stability_security'],
    reasoningTemplate:
      'Perfect for your corporate staffing interests, people coaching goals, and stable administration priority.',
  },
  {
    id: '4689c370-e774-4859-a5a1-fd46e5460081',
    name: 'Supply Chain & Logistics Engineering',
    description:
      'Optimize global shipping routes, manage inventory warehouses, and negotiate vendor procurement contracts.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'pcm', 'general'],
    interests: ['business_ent', 'finance_econ'],
    hobbies: ['Solving Puzzles / Chess', 'Reading / Podcasts', 'Tinkering with gadgets'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['high_salary', 'stability_security', 'global_mobility'],
    reasoningTemplate:
      'Matches your shipping logistics interests, warehouse efficiency focus, and global trade career goals.',
  },
  {
    id: 'b73f210e-cbe9-4e3c-a77c-d6c2c9832921',
    name: 'International Business & Global Trade',
    description:
      'Study import-export custom regulations, analyze foreign exchange fluctuations, and manage multinational ventures.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'arts', 'general'],
    interests: ['business_ent', 'finance_econ'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 4, workplace: 1, structure: 3 },
    priorities: ['global_mobility', 'high_salary', 'prestige_status'],
    reasoningTemplate:
      'Aligns with your multinational operations focus, currency markets interest, and high prestige goals.',
  },
  {
    id: '104f431c-d8fb-41f2-aec8-b45c32104b03',
    name: 'Fintech & Digital Banking Systems',
    description:
      'Analyze digital payment architectures, evaluate peer-to-peer lending platforms, and understand mobile banking security.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['commerce', 'pcm', 'general'],
    interests: ['finance_econ', 'tech_ai', 'business_ent'],
    hobbies: ['Coding / Side Projects', 'Solving Puzzles / Chess', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 3 },
    priorities: ['high_salary', 'creative_freedom', 'global_mobility'],
    reasoningTemplate:
      'A stellar combination of your digital payments interest, software coding projects, and financial tech goals.',
  },
  {
    id: '81109276-834d-452d-a802-5dc0ae810012',
    name: 'Real Estate Development & Finance',
    description:
      'Evaluate commercial property values, manage real estate investment trusts (REITs), and study urban zoning laws.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'general'],
    interests: ['business_ent', 'finance_econ'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Debating / Public Speaking'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['high_salary', 'prestige_status'],
    reasoningTemplate:
      'Perfect for your property valuation interests, asset management focus, and wealth building goals.',
  },
  {
    id: '6a2cbd0a-2021-43e4-a04a-0d834a20203c',
    name: 'Hospitality & Luxury Tourism Management',
    description:
      'Manage 5-star resort operations, coordinate global luxury travel events, and optimize customer experience metrics.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['commerce', 'arts', 'general'],
    interests: ['business_ent', 'marketing_pr'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Gardening / Cooking'],
    workStyle: { collaboration: 5, workplace: 3, structure: 3 },
    priorities: ['global_mobility', 'work_life_balance', 'prestige_status'],
    reasoningTemplate:
      'Ideal for your hotel operations focus, customer service style, and global luxury career goals.',
  },
  {
    id: '1c2e4fe0-194c-4335-a805-627cb8180c03',
    name: 'E-Commerce & Digital Retail Operations',
    description:
      'Manage online digital storefronts, optimize digital conversion funnels, and coordinate retail shipping logistics.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['commerce', 'arts', 'general'],
    interests: ['business_ent', 'marketing_pr'],
    hobbies: ['Creative Writing / Blogging', 'Photography / Videography', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'high_salary', 'work_life_balance'],
    reasoningTemplate:
      'Matches your online retail interests, customer acquisition focus, and digital business goals.',
  },
  {
    id: '6b341a41-bc9d-48e4-a3d7-a9940228140a',
    name: 'Actuarial Science & Risk Valuation',
    description:
      'Apply probability models, design insurance policies, and calculate long-term financial liabilities.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['commerce', 'pcm', 'general'],
    interests: ['finance_econ', 'space_research'],
    hobbies: ['Solving Puzzles / Chess', 'Reading / Podcasts', 'Coding / Side Projects'],
    workStyle: { collaboration: 2, workplace: 1, structure: 1 },
    priorities: ['stability_security', 'high_salary', 'prestige_status'],
    reasoningTemplate:
      'Aligns with your probability modeling strengths, deep quantitative focus, and stable career priority.',
  },
  {
    id: '440ac686-4b57-4d1c-a50f-5d17434002c0',
    name: 'Brand Strategy & Public Relations',
    description:
      'Orchestrate media communication campaigns, design corporate identities, and manage public crisis communications.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['commerce', 'arts', 'general'],
    interests: ['marketing_pr', 'media_writing'],
    hobbies: [
      'Creative Writing / Blogging',
      'Debating / Public Speaking',
      'Photography / Videography',
    ],
    workStyle: { collaboration: 4, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'prestige_status', 'work_life_balance'],
    reasoningTemplate:
      'Matches your brand messaging focus, corporate PR style, and media relations goals.',
  },
  {
    id: '701a3975-074a-4df9-ac77-50e6e9000a19',
    name: 'Enterprise Sales & Business Development',
    description:
      'Master B2B negotiation techniques, manage sales CRM software pipelines, and pitch corporate proposals.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['commerce', 'arts', 'general'],
    interests: ['business_ent', 'marketing_pr'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 4, workplace: 2, structure: 3 },
    priorities: ['high_salary', 'global_mobility'],
    reasoningTemplate:
      'Perfect for your corporate B2B sales focus, active negotiation style, and high commission priority.',
  },
  {
    id: 'bb4315c4-cd48-493a-a176-0b8665894011',
    name: 'Wealth Management & Private Banking',
    description:
      'Formulate private client investment strategies, analyze tax shelters, and manage high-net-worth portfolios.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'general'],
    interests: ['finance_econ', 'business_ent'],
    hobbies: ['Solving Puzzles / Chess', 'Reading / Podcasts', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'prestige_status', 'stability_security'],
    reasoningTemplate:
      'Aligns with your portfolio management interests, private banking style, and wealth protection goals.',
  },
  {
    id: '51d8b66b-1e0d-424e-ac4f-d59287100824',
    name: 'Sustainability Management & Green Business',
    description:
      'Audit corporate carbon emissions, implement ESG recycling circularity, and design green product packaging.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'arts', 'pcm', 'general'],
    interests: ['business_ent', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Gardening / Cooking', 'Debating / Public Speaking'],
    workStyle: { collaboration: 4, workplace: 1, structure: 3 },
    priorities: ['social_impact', 'work_life_balance', 'creative_freedom'],
    reasoningTemplate:
      'Matches your corporate environmental interests, carbon metrics focus, and global stewardship goals.',
  },
  {
    id: 'f807c8da-3814-4226-a0c0-13eaba380400',
    name: 'Business Intelligence & Data Analytics',
    description:
      'Configure corporate BI dashboard analytics, write SQL queries, and build corporate trend forecasting models.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'pcm', 'general'],
    interests: ['finance_econ', 'tech_ai'],
    hobbies: ['Solving Puzzles / Chess', 'Coding / Side Projects', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'stability_security', 'global_mobility'],
    reasoningTemplate:
      'Matches your corporate data analytics interest, coding projects, and corporate forecasting goals.',
  },
  {
    id: '50ecf1a5-f463-40dd-a8a4-8ffc7d506001',
    name: 'Venture Capital & Private Equity',
    description:
      'Evaluate early-stage startup business models, structure term sheets, and conduct corporate due diligence valuations.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['commerce', 'pcm', 'general'],
    interests: ['business_ent', 'finance_econ'],
    hobbies: ['Solving Puzzles / Chess', 'Reading / Podcasts', 'Debating / Public Speaking'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'prestige_status', 'global_mobility'],
    reasoningTemplate:
      'Matches your startup valuation interests, term sheet structures, and venture capital goals.',
  },
  {
    id: 'ee86281f-b7e4-41f8-a959-623796a68408',
    name: 'Behavioral Economics & Market Psychology',
    description:
      'Study cognitive biases in spending, design corporate nudges, and analyze market pricing models.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'arts', 'general'],
    interests: ['finance_econ', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Debating / Public Speaking'],
    workStyle: { collaboration: 3, workplace: 1, structure: 3 },
    priorities: ['social_impact', 'creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Perfect for your behavioral economics interests, spending psychology focus, and market nudges goals.',
  },
  {
    id: '69773905-1c66-430a-a775-1109a2086630',
    name: 'Agribusiness & Food Supply Chains',
    description:
      'Manage agricultural commodity trading, optimize cold storage networks, and evaluate farming technology investments.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['commerce', 'pcb', 'general'],
    interests: ['business_ent', 'medicine_bio'],
    hobbies: ['Gardening / Cooking', 'Reading / Podcasts', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 3, workplace: 3, structure: 3 },
    priorities: ['stability_security', 'social_impact', 'work_life_balance'],
    reasoningTemplate:
      'Matches your commodity trading interests, cold chain logistics focus, and agricultural tech goals.',
  },
  {
    id: 'a437f081-ebcd-4bbd-ab4f-fa4b5aa005b0',
    name: 'Operations Research & Lean Six Sigma',
    description:
      'Optimize corporate manufacturing throughput, map lean value streams, and eliminate operational waste.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['commerce', 'pcm', 'general'],
    interests: ['business_ent', 'tech_ai'],
    hobbies: ['Solving Puzzles / Chess', 'Tinkering with gadgets', 'Coding / Side Projects'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['high_salary', 'stability_security', 'global_mobility'],
    reasoningTemplate:
      'Matches your factory optimization focus, manufacturing metrics interest, and lean processes goals.',
  },
  {
    id: '164af15d-f963-4da7-abef-292b261042d0',
    name: 'Product Marketing & Growth Hacking',
    description:
      'Orchestrate software product launches, run digital user acquisition tests, and analyze product retention cohorts.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['commerce', 'arts', 'general'],
    interests: ['marketing_pr', 'business_ent'],
    hobbies: [
      'Creative Writing / Blogging',
      'Photography / Videography',
      'Debating / Public Speaking',
    ],
    workStyle: { collaboration: 4, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'high_salary', 'global_mobility'],
    reasoningTemplate:
      'Matches your software launch interest, user acquisition campaigns, and product marketing goals.',
  },
  {
    id: 'af222a43-8431-4348-a12b-131ec2842020',
    name: 'Franchise Operations & Retail Expansion',
    description:
      'Structure franchise operating models, evaluate retail site selections, and audit multi-location standards.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['commerce', 'general'],
    interests: ['business_ent'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 4, workplace: 2, structure: 2 },
    priorities: ['high_salary', 'stability_security'],
    reasoningTemplate:
      'Matches your retail franchise interest, store expansion layouts, and multi-location standards.',
  },
  {
    id: '5f6e1e06-d48b-4cad-af8b-e5d4d9540a0a',
    name: 'Intellectual Property & Patent Law',
    description:
      'Study international trademark filings, draft patent claims, and analyze copyright infringement case law.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['arts', 'commerce', 'pcm', 'general'],
    interests: ['law_civil', 'tech_ai'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Coding / Side Projects'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'prestige_status', 'global_mobility'],
    reasoningTemplate:
      'Perfect for your intellectual property interests, patent filings focus, and high prestige priority.',
  },
  {
    id: 'dd93051f-184d-485d-a2c5-de80cd180105',
    name: 'International Law & Global Treaties',
    description:
      'Analyze UN charters, study international maritime boundaries, and evaluate cross-border dispute resolutions.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['arts', 'commerce', 'general'],
    interests: ['law_civil', 'space_research'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['prestige_status', 'global_mobility', 'social_impact'],
    reasoningTemplate:
      'Matches your global treaty interests, cross-border dispute focus, and international advocacy goals.',
  },
  {
    id: 'ea68baaf-1243-438d-a5f8-2b827a024038',
    name: 'Public Policy & Legislative Studies',
    description:
      'Evaluate social policy cost-benefits, draft legislative frameworks, and analyze public administration dynamics.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'general'],
    interests: ['law_civil', 'education_social'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Creative Writing / Blogging'],
    workStyle: { collaboration: 4, workplace: 1, structure: 3 },
    priorities: ['social_impact', 'stability_security', 'prestige_status'],
    reasoningTemplate:
      'Aligns with your social policy interests, legislative draft focus, and public administration goals.',
  },
  {
    id: 'a3db8d5a-acc8-4039-a60f-138ecca0c801',
    name: 'Political Science & Comparative Politics',
    description:
      'Study classic political philosophies, analyze voting patterns, and evaluate national governance models.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['law_civil'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Creative Writing / Blogging'],
    workStyle: { collaboration: 3, workplace: 1, structure: 3 },
    priorities: ['social_impact', 'prestige_status', 'stability_security'],
    reasoningTemplate:
      'Matches your political philosophy interest, governance models focus, and public leadership goals.',
  },
  {
    id: 'dc1d4e1b-88c6-48ea-af54-dbc0b488040e',
    name: 'Sociology & Social Anthropology',
    description:
      'Study community demographic shifts, analyze class struggles, and conduct ethnographical field studies.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['education_social', 'law_civil'],
    hobbies: ['Reading / Podcasts', 'Debating / Public Speaking', 'Photography / Videography'],
    workStyle: { collaboration: 3, workplace: 3, structure: 4 },
    priorities: ['social_impact', 'work_life_balance'],
    reasoningTemplate:
      'Perfect for your community social studies focus, empathetic research style, and social advocacy goals.',
  },
  {
    id: '8093e936-b002-470b-ae30-919988800260',
    name: 'World History & Archival Research',
    description:
      'Analyze historical primary source texts, study archaeological histories, and manage institutional museum archives.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['education_social', 'space_research'],
    hobbies: ['Reading / Podcasts', 'Photography / Videography', 'Gardening / Cooking'],
    workStyle: { collaboration: 2, workplace: 1, structure: 3 },
    priorities: ['stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Matches your world history interest, archival research focus, and stable museum goals.',
  },
  {
    id: 'a33e96bf-49de-42e4-a4ea-e0b8fb011e06',
    name: 'Philosophy, Logic & Cognitive Ethics',
    description:
      'Master formal logical reasoning, study epistemology theories, and analyze contemporary applied bioethics.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'general'],
    interests: ['education_social', 'law_civil'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Debating / Public Speaking'],
    workStyle: { collaboration: 2, workplace: 1, structure: 3 },
    priorities: ['creative_freedom', 'social_impact', 'work_life_balance'],
    reasoningTemplate:
      'Perfect for your logical ethics focus, theoretical philosophy interest, and academic goals.',
  },
  {
    id: '79c14fda-b50f-40c4-accc-ce439631010c',
    name: 'English Literature & Comparative Texts',
    description:
      'Analyze classical and post-colonial literary canons, study narrative structures, and write critical essays.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['media_writing', 'education_social'],
    hobbies: ['Creative Writing / Blogging', 'Reading / Podcasts', 'Debating / Public Speaking'],
    workStyle: { collaboration: 2, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Ideal for your literary analysis focus, writing creativity, and publishing industry goals.',
  },
  {
    id: '5f0c3047-55a3-42f5-a10a-af1f16550020',
    name: 'Criminology & Criminal Justice System',
    description:
      'Study psychological criminal profiling, evaluate penitentiary correction models, and analyze crime statistics.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'general'],
    interests: ['law_civil', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Solving Puzzles / Chess', 'Debating / Public Speaking'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['social_impact', 'stability_security', 'prestige_status'],
    reasoningTemplate:
      'Matches your criminal psychology focus, judicial systems interest, and public safety goals.',
  },
  {
    id: '6bf11dbf-1835-4f91-a073-c4e4af083119',
    name: 'Environmental Law & Climate Treaties',
    description:
      'Analyze national forestry conservation laws, study global climate accords, and litigate pollution liability cases.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['arts', 'commerce', 'pcm', 'general'],
    interests: ['law_civil', 'space_research'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Gardening / Cooking'],
    workStyle: { collaboration: 3, workplace: 2, structure: 2 },
    priorities: ['social_impact', 'global_mobility', 'prestige_status'],
    reasoningTemplate:
      'Perfect for your environmental protection interests, carbon accords focus, and green litigation goals.',
  },
  {
    id: 'd93e1e35-73c7-4c5d-aaaa-f9dbef510604',
    name: 'Constitutional Law & Civil Rights',
    description:
      'Master fundamental constitutional amendments, study landmark civil liberty judgments, and draft writ petitions.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['arts', 'commerce', 'general'],
    interests: ['law_civil'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['prestige_status', 'social_impact', 'stability_security'],
    reasoningTemplate:
      'Matches your constitutional rights interest, judicial precedent focus, and civil rights litigation.',
  },
  {
    id: '62c6ffda-d0ec-4976-a3b2-2a68b940c497',
    name: 'Cyber Law & Digital Privacy Regulations',
    description:
      'Analyze national IT acts, study global data privacy regulations (GDPR), and evaluate cybercrime prosecution guidelines.',
    durationYears: 5,
    difficultyLevel: 'Advanced',
    streams: ['arts', 'commerce', 'pcm', 'general'],
    interests: ['law_civil', 'tech_ai'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Coding / Side Projects'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'stability_security', 'global_mobility'],
    reasoningTemplate:
      'Perfect for your digital privacy interests, cybersecurity laws focus, and tech compliance priority.',
  },
  {
    id: '84f06cb6-d9a0-4625-a55d-500ee380a060',
    name: 'International Relations & Diplomacy',
    description:
      'Analyze foreign embassy relations, study bilateral trade negotiations, and evaluate global geopolitical conflicts.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'general'],
    interests: ['law_civil', 'business_ent'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 4, workplace: 1, structure: 3 },
    priorities: ['global_mobility', 'prestige_status', 'social_impact'],
    reasoningTemplate:
      'Matches your embassy diplomacy focus, foreign policy interest, and international relations goals.',
  },
  {
    id: 'cc4b475f-318a-4ee7-a3fd-c1a92c000a46',
    name: 'Archaeology & Cultural Heritage Preservation',
    description:
      'Conduct archaeological excavation digs, utilize carbon-dating equipment, and conserve historical monument sites.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'general'],
    interests: ['space_research', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Photography / Videography', 'Playing Sports / Fitness'],
    workStyle: { collaboration: 3, workplace: 4, structure: 3 },
    priorities: ['stability_security', 'creative_freedom'],
    reasoningTemplate:
      'Matches your excavation dig interests, historical preservation focus, and physical fieldwork style.',
  },
  {
    id: 'b90cdf56-fc5c-4d62-aa45-50097cb80cd6',
    name: 'Linguistics & Phonetics Analysis',
    description:
      'Study syntax structures, analyze phonetic speech patterns, and research evolutionary historical linguistics.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'general'],
    interests: ['media_writing', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Playing musical instruments', 'Creative Writing / Blogging'],
    workStyle: { collaboration: 2, workplace: 1, structure: 3 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Aligns with your phonetic speech focus, grammatical logic, and structural linguistics research.',
  },
  {
    id: '62051e7c-c856-40e9-a9aa-5310e540040e',
    name: 'Human Geography & Urban Demographics',
    description:
      'Study urban migration patterns, analyze resources distributions, and build geographic demographic models.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['space_research', 'education_social'],
    hobbies: ['Reading / Podcasts', 'Photography / Videography', 'Tinkering with gadgets'],
    workStyle: { collaboration: 3, workplace: 2, structure: 3 },
    priorities: ['stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Matches your demographic mapping interest, urban migration focus, and stable analytical goals.',
  },
  {
    id: 'e544e32d-8c05-4307-a369-41d35e840420',
    name: 'Macroeconomics & Global Development',
    description:
      'Study monetary banking policies, evaluate international development metrics, and model financial inflation.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['commerce', 'pcm', 'arts', 'general'],
    interests: ['finance_econ', 'law_civil'],
    hobbies: ['Solving Puzzles / Chess', 'Reading / Podcasts', 'Debating / Public Speaking'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'prestige_status', 'global_mobility'],
    reasoningTemplate:
      'Matches your banking monetary interest, inflation forecasting models, and macroeconomics goals.',
  },
  {
    id: '7d36d01a-8f3e-4740-aaf2-08a4100d3650',
    name: 'Gender Studies & Inclusive Advocacy',
    description:
      'Study feminist theories, analyze gender representations, and design workplace diversity policy frameworks.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['education_social', 'law_civil'],
    hobbies: ['Reading / Podcasts', 'Debating / Public Speaking', 'Creative Writing / Blogging'],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['social_impact', 'creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Perfect for your workplace inclusion focus, gender equality advocacy, and social policy goals.',
  },
  {
    id: 'c74a589f-dc1e-4891-a51b-54d18ac40a08',
    name: 'Art History & Curatorial Practices',
    description:
      'Trace global art movements, evaluate historical paintings, and curate contemporary art gallery exhibitions.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['design_arts', 'education_social'],
    hobbies: [
      'Painting / Sketching / Sculpting',
      'Reading / Podcasts',
      'Photography / Videography',
    ],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Matches your historical art movements focus, museum cataloging style, and gallery curation goals.',
  },
  {
    id: 'dcf9df5b-d7e1-44f0-a90b-189052d4e14f',
    name: 'Family Law & Domestic Mediations',
    description:
      'Analyze marriage dissolution codes, manage custody disputes, and coordinate domestic mediation arbitrations.',
    durationYears: 5,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'general'],
    interests: ['law_civil', 'education_social'],
    hobbies: ['Debating / Public Speaking', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['social_impact', 'stability_security', 'work_life_balance'],
    reasoningTemplate:
      'Matches your custody dispute mediation interest, domestic counseling focus, and judicial family law.',
  },
  {
    id: '8b0b437a-2a37-423c-a1a1-3c60bb0a0303',
    name: 'Graphic Design & Visual Branding',
    description:
      'Master typographic systems, design corporate visual brand books, and configure digital publishing vector layouts.',
    durationYears: 4,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'commerce', 'general'],
    interests: ['design_arts'],
    hobbies: ['Painting / Sketching / Sculpting', 'Photography / Videography', 'Video Gaming'],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Perfect for your typographic layout interests, brand identity design, and visual styling.',
  },
  {
    id: 'bec50dd3-4c90-416b-a1f2-551b620c8004',
    name: 'Fashion Design & Textile Technology',
    description:
      'Draft garment pattern layouts, analyze textile fabric mechanics, and choreograph seasonal runway fashion shows.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'general'],
    interests: ['design_arts', 'business_ent'],
    hobbies: [
      'Painting / Sketching / Sculpting',
      'Photography / Videography',
      'Gardening / Cooking',
    ],
    workStyle: { collaboration: 4, workplace: 3, structure: 3 },
    priorities: ['creative_freedom', 'prestige_status', 'global_mobility'],
    reasoningTemplate:
      'Matches your garment pattern layout interest, runway styling focus, and global apparel career.',
  },
  {
    id: '194de232-aadc-4190-afb3-91fb3d084c00',
    name: 'Interior Architecture & Spatial Design',
    description:
      'Construct 3D CAD spatial blueprints, analyze interior lighting optics, and select sustainable building finishes.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'pcm', 'general'],
    interests: ['design_arts', 'tech_ai'],
    hobbies: [
      'Painting / Sketching / Sculpting',
      'Tinkering with gadgets',
      'Photography / Videography',
    ],
    workStyle: { collaboration: 4, workplace: 3, structure: 3 },
    priorities: ['creative_freedom', 'high_salary', 'work_life_balance'],
    reasoningTemplate:
      'Matches your spatial design CAD interest, lighting fixtures focus, and structural styling goals.',
  },
  {
    id: 'b45cd710-7984-40b7-a0cd-d8dc60300403',
    name: 'Fine Arts & Studio Painting',
    description:
      'Master oil painting textures, study anatomical sketching proportions, and curate public studio art exhibitions.',
    durationYears: 4,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['design_arts'],
    hobbies: [
      'Painting / Sketching / Sculpting',
      'Photography / Videography',
      'Reading / Podcasts',
    ],
    workStyle: { collaboration: 2, workplace: 1, structure: 5 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Perfect for your oil painting textures focus, studio sketching hobbies, and fine arts curator goals.',
  },
  {
    id: '9f927618-4a1e-4af0-a9d5-8cd9110a1226',
    name: 'Creative Writing & Screenwriting',
    description:
      'Master fictional plot arcs, write character dialogue scripts, and draft manuscripts for novel publishing houses.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['media_writing', 'education_social'],
    hobbies: ['Creative Writing / Blogging', 'Reading / Podcasts', 'Debating / Public Speaking'],
    workStyle: { collaboration: 2, workplace: 1, structure: 5 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Ideal for your screenwriting dialogue focus, novel manuscript publishing, and creative writing.',
  },
  {
    id: '56fe229d-e6b3-4446-aab0-4d66f746b200',
    name: 'Film Production & Cinema Studies',
    description:
      'Choreograph camera lighting angles, direct dramatic actors, and edit sound timelines using Premiere Pro.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'general'],
    interests: ['design_arts', 'media_writing'],
    hobbies: [
      'Photography / Videography',
      'Creative Writing / Blogging',
      'Playing musical instruments',
    ],
    workStyle: { collaboration: 4, workplace: 3, structure: 4 },
    priorities: ['creative_freedom', 'global_mobility', 'prestige_status'],
    reasoningTemplate:
      'Matches your camera angles choreographing, video editing focus, and dramatic film directing.',
  },
  {
    id: '121eaf7a-0826-40c7-a11a-38a30b00060c',
    name: '3D Animation & Character Rigging',
    description:
      'Model 3D characters, build complex motion rigging skeletons, and animate cinematic sequences using Maya and Blender.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'arts', 'general'],
    interests: ['design_arts', 'tech_ai'],
    hobbies: ['Video Gaming', 'Coding / Side Projects', 'Painting / Sketching / Sculpting'],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'high_salary', 'global_mobility'],
    reasoningTemplate:
      'Combines your 3D character modeling focus, skeletal motion rigging, and digital animation goals.',
  },
  {
    id: '0eb20c5e-fb19-432a-acf5-ab3ef20a1000',
    name: 'Game Design & Interactive Mechanics',
    description:
      'Draft comprehensive game design documents, prototype level mechanics, and analyze player engagement telemetry.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'commerce', 'arts', 'general'],
    interests: ['design_arts', 'tech_ai'],
    hobbies: ['Video Gaming', 'Coding / Side Projects', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 4, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'high_salary', 'global_mobility'],
    reasoningTemplate:
      'Matches your gameplay mechanics design, interactive level prototyping, and player analytics.',
  },
  {
    id: '7e5c87a4-a385-459c-afdd-d9de6b220401',
    name: 'Photography & Commercial Photojournalism',
    description:
      'Master camera lens exposures, coordinate studio lighting setups, and edit high-resolution digital image portfolios.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['design_arts', 'media_writing'],
    hobbies: ['Photography / Videography', 'Creative Writing / Blogging', 'Reading / Podcasts'],
    workStyle: { collaboration: 3, workplace: 2, structure: 4 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Matches your camera lens exposures interest, studio lighting setups, and photojournalism portfolio.',
  },
  {
    id: '03ee8380-b059-45c0-acb3-b7df8c004800',
    name: 'Industrial & Hardware Product Design',
    description:
      'Sculpt physical product mockups, analyze ergonomic grip metrics, and design hardware casings for manufacturing.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'general'],
    interests: ['design_arts', 'tech_ai'],
    hobbies: [
      'Tinkering with gadgets',
      'Painting / Sketching / Sculpting',
      'Coding / Side Projects',
    ],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['high_salary', 'creative_freedom', 'stability_security'],
    reasoningTemplate:
      'Matches your physical product modeling, ergonomic manufacturing metrics, and hardware casings design.',
  },
  {
    id: '36719122-a238-47d9-af94-49ecbd223011',
    name: 'Digital Illustration & Concept Art',
    description:
      'Paint digital fantasy landscape backdrops, draw anatomical character concepts, and configure Photoshop brushes.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'general'],
    interests: ['design_arts'],
    hobbies: ['Painting / Sketching / Sculpting', 'Video Gaming', 'Photography / Videography'],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Matches your digital fantasy layouts, digital sketching brushes, and concept art portfolio.',
  },
  {
    id: '4efdc96a-b34e-41c6-aafd-b3d500024c08',
    name: 'Typography & Typeface Design',
    description:
      'Study letterform anatomies, design custom digital font families, and configure font hinting kerning algorithms.',
    durationYears: 3,
    difficultyLevel: 'Advanced',
    streams: ['arts', 'general'],
    interests: ['design_arts', 'media_writing'],
    hobbies: ['Painting / Sketching / Sculpting', 'Reading / Podcasts', 'Solving Puzzles / Chess'],
    workStyle: { collaboration: 2, workplace: 1, structure: 3 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Matches your custom letterform design, digital font files development, and type kerning algorithms.',
  },
  {
    id: '62b0088f-7117-47ee-ac13-a77663601008',
    name: 'Audio Tech & Music Production',
    description:
      'Mix multi-track studio recordings, configure synthesizer filters, and master digital audio files using Pro Tools.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['pcm', 'general'],
    interests: ['design_arts', 'tech_ai'],
    hobbies: ['Playing musical instruments', 'Tinkering with gadgets', 'Coding / Side Projects'],
    workStyle: { collaboration: 3, workplace: 1, structure: 3 },
    priorities: ['creative_freedom', 'high_salary', 'work_life_balance'],
    reasoningTemplate:
      'Matches your multi-track studio mixing, synthesizer filters configuring, and audio mastering.',
  },
  {
    id: '57d4f8f8-df7e-4902-af88-aa68d7575490',
    name: 'Fashion Styling & Creative Direction',
    description:
      'Curate catalog outfits, direct model photographic editorials, and consult brands on seasonal fashion trends.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['design_arts', 'business_ent'],
    hobbies: [
      'Photography / Videography',
      'Painting / Sketching / Sculpting',
      'Reading / Podcasts',
    ],
    workStyle: { collaboration: 4, workplace: 2, structure: 4 },
    priorities: ['creative_freedom', 'global_mobility', 'prestige_status'],
    reasoningTemplate:
      'Matches your fashion catalog curating, creative photoshoots directing, and trend consulting.',
  },
  {
    id: '74160e13-0039-4564-a974-2f585a001006',
    name: 'Jewelry Design & Gemology',
    description:
      'Sketch luxury jewelry settings, evaluate gemstone clarities (4Cs), and operate metal casting tools.',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'general'],
    interests: ['design_arts', 'business_ent'],
    hobbies: ['Painting / Sketching / Sculpting', 'Tinkering with gadgets', 'Gardening / Cooking'],
    workStyle: { collaboration: 3, workplace: 1, structure: 2 },
    priorities: ['creative_freedom', 'stability_security', 'high_salary'],
    reasoningTemplate:
      'Matches your luxury ornament sketching, gemstone clarities evaluation, and metal castings.',
  },
  {
    id: 'a1398fb3-2362-4a9a-a482-5b2617212089',
    name: 'Ceramic Design & Studio Pottery',
    description:
      'Throw clay vessels on pottery wheels, master mineral glaze chemical firings, and operate kiln ovens.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['design_arts'],
    hobbies: [
      'Painting / Sketching / Sculpting',
      'Gardening / Cooking',
      'Playing Sports / Fitness',
    ],
    workStyle: { collaboration: 2, workplace: 1, structure: 5 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Matches your hand-crafted clay throwing, mineral glaze firings, and kiln oven operations.',
  },
  {
    id: '7daa0c82-0c64-486d-ae71-ce8a5c0c2004',
    name: 'Exhibition & Museum Space Design',
    description:
      'Design interactive corporate trade stalls, configure museum pathways, and set up gallery display structures.',
    durationYears: 4,
    difficultyLevel: 'Intermediate',
    streams: ['arts', 'commerce', 'general'],
    interests: ['design_arts', 'education_social'],
    hobbies: [
      'Painting / Sketching / Sculpting',
      'Photography / Videography',
      'Tinkering with gadgets',
    ],
    workStyle: { collaboration: 4, workplace: 3, structure: 3 },
    priorities: ['creative_freedom', 'work_life_balance'],
    reasoningTemplate:
      'Matches your trade show booth layouts, museum navigation setups, and gallery display architecture.',
  },
  {
    id: '05979b11-59ae-4c62-a35c-395d32018682',
    name: 'Broadcast Journalism & News Production',
    description:
      'Anchor live digital news broadcasts, write teleprompter scripts, and coordinate studio control boards.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'general'],
    interests: ['media_writing', 'marketing_pr'],
    hobbies: [
      'Debating / Public Speaking',
      'Creative Writing / Blogging',
      'Photography / Videography',
    ],
    workStyle: { collaboration: 4, workplace: 1, structure: 4 },
    priorities: ['prestige_status', 'work_life_balance', 'creative_freedom'],
    reasoningTemplate:
      'Matches your news teleprompter writing, camera anchor anchoring, and live control room directing.',
  },
  {
    id: '44e6aa7d-79e9-41e3-af3d-0fb44240e00a',
    name: 'Advertising Design & Creative Copywriting',
    description:
      'Write print advertising headlines, design storyboard video concepts, and manage agency client pitches.',
    durationYears: 3,
    difficultyLevel: 'Beginner',
    streams: ['arts', 'commerce', 'general'],
    interests: ['marketing_pr', 'media_writing'],
    hobbies: [
      'Creative Writing / Blogging',
      'Debating / Public Speaking',
      'Photography / Videography',
    ],
    workStyle: { collaboration: 4, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'high_salary', 'work_life_balance'],
    reasoningTemplate:
      'Matches your print headline copywriting, creative storyboards design, and corporate client pitches.',
  },
  {
    id: 'e0e6a0a9-ecba-46f4-a50c-5ccfece0a220',
    name: 'Visual Effects (VFX) & Compositing',
    description:
      'Choreograph green screen compositing keys, track camera motions, and integrate CGI models using Nuke.',
    durationYears: 4,
    difficultyLevel: 'Advanced',
    streams: ['pcm', 'arts', 'general'],
    interests: ['design_arts', 'tech_ai'],
    hobbies: ['Video Gaming', 'Coding / Side Projects', 'Photography / Videography'],
    workStyle: { collaboration: 3, workplace: 1, structure: 4 },
    priorities: ['creative_freedom', 'high_salary', 'global_mobility'],
    reasoningTemplate:
      'Matches your green screen compositing, camera motion tracking, and CGI software integration.',
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
