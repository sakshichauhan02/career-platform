const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../services/recommendationEngine.ts');
let engineContent = '';

try {
  engineContent = fs.readFileSync(targetFilePath, 'utf8');
} catch (err) {
  console.error('Error reading recommendationEngine.ts:', err);
  process.exit(1);
}

// Deterministic string-to-UUID v4 generator for database compatibility and idempotency
function stringToUUID(str) {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    h1 = Math.imul(h1 ^ str.charCodeAt(i), 2654435761);
    h2 = Math.imul(h2 ^ str.charCodeAt(i), 1597334677);
  }
  h1 = (Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)) >>> 0;
  h2 = (Math.imul(h2 ^ (h2 >>> 15), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 16), 3266489909)) >>> 0;

  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const part3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((h1 & h2) >>> 0).toString(16).padStart(8, '0');

  const hex = (part1 + part2 + part3 + part4).slice(0, 32);

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(12, 15)}-a${hex.slice(15, 18)}-${hex.slice(18, 30)}`;
}

// 1. Define the 100 courses with their full TypeScript structures matching the Course interface
const coursesRaw = [
  // ==========================================
  // ENGINEERING & TECHNOLOGY (20 courses)
  // ==========================================
  {
    key: 'tech-software-eng',
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
    key: 'tech-robotics',
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
    key: 'tech-iot',
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
    key: 'tech-blockchain',
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
    key: 'tech-devops',
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
    key: 'tech-game-dev',
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
    key: 'tech-networks',
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
    key: 'tech-embedded',
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
    key: 'tech-fullstack',
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
    key: 'tech-mobile-apps',
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
    key: 'tech-hpc',
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
    key: 'tech-database-admin',
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
    key: 'tech-vr-ar',
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
    key: 'tech-comp-vision',
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
    key: 'tech-natural-lang',
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
    key: 'tech-quantum-computing',
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
    key: 'tech-gis',
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
    key: 'tech-human-robot',
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
    key: 'tech-digital-twins',
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
    key: 'tech-edge-ai',
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

  // ==========================================
  // MEDICAL & HEALTHCARE (20 courses)
  // ==========================================
  {
    key: 'med-cardiology',
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
    key: 'med-neurology',
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
    key: 'med-pediatrics',
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
    key: 'med-nursing',
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
    key: 'med-dentistry',
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
    key: 'med-pharmacy',
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
    key: 'med-physiotherapy',
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
    key: 'med-biomedical',
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
    key: 'med-nutrition',
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
    key: 'med-epidemiology',
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
    key: 'med-pathology',
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
    key: 'med-genetics',
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
    key: 'med-radiology',
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
    key: 'med-oncology',
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
    key: 'med-immunology',
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
    key: 'med-sports-medicine',
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
    key: 'med-toxicology',
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
    id: 'med-geriatrics',
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
    key: 'med-optometry',
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
    key: 'med-hospital-admin',
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

  // ==========================================
  // BUSINESS & FINANCE (20 courses)
  // ==========================================
  {
    key: 'bus-corporate-finance',
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
    key: 'bus-human-resources',
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
    key: 'bus-supply-chain',
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
    key: 'bus-international',
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
    key: 'bus-fintech',
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
    key: 'bus-real-estate',
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
    key: 'bus-hospitality',
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
    key: 'bus-ecommerce',
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
    key: 'bus-actuarial',
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
    key: 'bus-brand-strategy',
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
    key: 'bus-sales',
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
    key: 'bus-wealth-mgmt',
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
    key: 'bus-sustainability-mgmt',
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
    key: 'bus-data-analytics',
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
    key: 'bus-venture-capital',
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
    key: 'bus-behavioral-econ',
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
    key: 'bus-agribusiness',
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
    key: 'bus-operations',
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
    key: 'bus-product-marketing',
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
    key: 'bus-franchise',
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

  // ==========================================
  // LAW & HUMANITIES (20 courses)
  // ==========================================
  {
    key: 'law-intellectual-property',
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
    key: 'law-international',
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
    key: 'law-public-policy',
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
    key: 'hum-political-science',
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
    key: 'hum-sociology',
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
    key: 'hum-history',
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
    key: 'hum-philosophy',
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
    key: 'hum-literature',
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
    key: 'hum-criminology',
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
    key: 'law-environmental',
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
    key: 'law-constitutional',
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
    key: 'law-cyber',
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
    key: 'hum-international-relations',
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
    key: 'hum-archaeology',
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
    key: 'hum-linguistics',
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
    key: 'hum-geography',
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
    key: 'hum-economics',
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
    key: 'hum-gender-studies',
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
    key: 'hum-art-history',
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
    key: 'law-family',
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

  // ==========================================
  // DESIGN & MEDIA (20 courses)
  // ==========================================
  {
    key: 'des-graphic-design',
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
    key: 'des-fashion',
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
    key: 'des-interior',
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
    key: 'des-fine-arts',
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
    key: 'des-creative-writing',
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
    key: 'des-film-production',
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
    key: 'des-animation',
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
    key: 'des-game-design',
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
    key: 'des-photography',
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
    key: 'des-industrial',
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
    key: 'des-illustration',
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
    key: 'des-typography',
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
    key: 'des-sound-engineering',
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
    key: 'des-fashion-styling',
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
    key: 'des-jewelry',
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
    key: 'des-ceramics',
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
    key: 'des-exhibition',
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
    key: 'des-broadcasting',
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
    key: 'des-advertising',
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
    key: 'des-vfx',
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

// Append new courses deterministically to the local PREDEFINED_COURSES list in recommendationEngine.ts for failsafe operation
async function seedLocalFile() {
  console.log(`Reading recommendationEngine.ts...`);

  // Transform courses to conform strictly to the TypeScript Course interface
  const formattedCourses = coursesRaw.map((c) => {
    const identifier = c.key || c.id || c.name;
    const uid = stringToUUID(identifier);

    // Fallbacks for Course interface compatibility
    const item = {
      id: uid,
      name: c.name,
      description: c.description,
      durationYears: Number(c.duration_years || c.durationYears || 3),
      difficultyLevel: c.difficulty_level || c.difficultyLevel || 'Beginner',
      streams: c.streams || ['general'],
      interests: c.interests || ['tech_ai'],
      hobbies: c.hobbies || ['Reading / Podcasts'],
      workStyle: c.workStyle || { collaboration: 3, workplace: 1, structure: 3 },
      priorities: c.priorities || ['high_salary'],
      reasoningTemplate: c.reasoningTemplate || `Highly aligns with your interests in ${c.name}.`,
    };

    return item;
  });

  // Verify the target array block inside the file
  const insertionMarker = 'export const PREDEFINED_COURSES: Course[] = [';
  const markerIndex = engineContent.indexOf(insertionMarker);
  if (markerIndex === -1) {
    console.error('Could not find PREDEFINED_COURSES array in recommendationEngine.ts');
    process.exit(1);
  }

  // Locate the closing bracket of the PREDEFINED_COURSES array (we search for the closing ];)
  // Let's find the closing bracket matching the array declaration
  const arrayStart = markerIndex + insertionMarker.length;

  // To avoid complex bracket matching, let's find the closing ]; at the end of the array.
  // In the file, the PREDEFINED_COURSES array is followed by some helper functions:
  // "// Utility: Stream matching score"
  const utilityMarker = '// Utility: Stream';
  const utilityIndex = engineContent.indexOf(utilityMarker);
  if (utilityIndex === -1) {
    console.error('Could not find Utility block marker in recommendationEngine.ts');
    process.exit(1);
  }

  // The closing ]; must be right before the utility block
  const arrayEndIndex = engineContent.lastIndexOf('];', utilityIndex);
  if (arrayEndIndex === -1 || arrayEndIndex < arrayStart) {
    console.error('Could not find the closing ]; of PREDEFINED_COURSES');
    process.exit(1);
  }

  // Construct the new array content string in TypeScript format
  const coursesTS = formattedCourses
    .map((c) => {
      return (
        `  {\n` +
        `    id: '${c.id}',\n` +
        `    name: '${c.name.replace(/'/g, "\\'")}',\n` +
        `    description: '${c.description.replace(/'/g, "\\'")}',\n` +
        `    durationYears: ${c.durationYears},\n` +
        `    difficultyLevel: '${c.difficultyLevel}',\n` +
        `    streams: [${c.streams.map((s) => `'${s}'`).join(', ')}],\n` +
        `    interests: [${c.interests.map((i) => `'${i}'`).join(', ')}],\n` +
        `    hobbies: [${c.hobbies.map((h) => `'${h.replace(/'/g, "\\'")}'`).join(', ')}],\n` +
        `    workStyle: { collaboration: ${c.workStyle.collaboration}, workplace: ${c.workStyle.workplace}, structure: ${c.workStyle.structure} },\n` +
        `    priorities: [${c.priorities.map((p) => `'${p}'`).join(', ')}],\n` +
        `    reasoningTemplate: '${c.reasoningTemplate.replace(/'/g, "\\'")}',\n` +
        `  }`
      );
    })
    .join(',\n');

  // Insert the 100 courses before the closing ]; of the array
  const beforeArrayEnd = engineContent.slice(0, arrayEndIndex);
  const afterArrayEnd = engineContent.slice(arrayEndIndex);

  // Check if there is already a trailing comma in the existing array
  const trimBefore = beforeArrayEnd.trim();
  const needsComma = !trimBefore.endsWith(',') && !trimBefore.endsWith('[');
  const commaConnector = needsComma ? ',\n' : '\n';

  const newContent = beforeArrayEnd + commaConnector + coursesTS + ',\n' + afterArrayEnd;

  try {
    fs.writeFileSync(targetFilePath, newContent, 'utf8');
    console.log(
      `Success! Appended ${formattedCourses.length} highly realistic, fully detailed courses to PREDEFINED_COURSES in recommendationEngine.ts.`
    );
    console.log('The local course repository is now fully populated with 120 total courses.');
  } catch (error) {
    console.error('Failed to write to recommendationEngine.ts:', error);
    process.exit(1);
  }
}

seedLocalFile();
