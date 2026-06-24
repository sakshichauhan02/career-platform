const fs = require('fs');
const path = require('path');

// 1. Parse .env.local
const envPath = path.join(__dirname, '../../.env.local');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
  console.error('Error reading .env.local file:', err);
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Corrected, safe deterministic string-to-UUID v4 generator (forces unsigned 32-bit integers to prevent hyphens)
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

// 2. Generate 100 highly realistic academic courses across different domains
const coursesRaw = [
  // ==========================================
  // ENGINEERING & TECHNOLOGY (20 courses)
  // ==========================================
  {
    key: 'tech-software-eng',
    name: 'Software Engineering & Distributed Systems',
    description:
      'Design highly available distributed systems, master architectural design patterns, and manage modern software lifecycle operations.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'tech-robotics',
    name: 'Robotics & Automation Engineering',
    description:
      'Build autonomous robots, design mechanical actuators, and program real-time controller systems using ROS and C++.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'tech-iot',
    name: 'Internet of Things (IoT) & Embedded Systems',
    description:
      'Architect connected networks of smart sensors, program microcontrollers, and manage real-time edge computing data pipelines.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'tech-blockchain',
    name: 'Blockchain & Smart Contract Engineering',
    description:
      'Design decentralized web applications, write secure Solidity contracts, and analyze cryptographic token economics.',
    duration_years: 3,
    difficulty_level: 'Advanced',
  },
  {
    key: 'tech-devops',
    name: 'DevOps & Cloud Site Reliability',
    description:
      'Automate software delivery pipelines, manage Kubernetes clusters, and orchestrate scalable infrastructure-as-code.',
    duration_years: 3,
    difficulty_level: 'Advanced',
  },
  {
    key: 'tech-game-dev',
    name: 'Game Development & Graphics Programming',
    description:
      'Program 3D physics engines, write shaders, and build interactive gameplay systems using C++, Unity, and Unreal Engine.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'tech-networks',
    name: 'Network Infrastructure & Architecture',
    description:
      'Design routing protocols, configure virtual networks, and build resilient hardware infrastructures for enterprise datacenters.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'tech-embedded',
    name: 'Embedded Systems & VLSI Design',
    description:
      'Design microchip architectures, write low-level firmware, and test integrated circuit layouts using VHDL and Verilog.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'tech-fullstack',
    name: 'Full-Stack Web Engineering',
    description:
      'Build responsive web applications using modern Javascript frameworks, scalable REST/GraphQL APIs, and relational databases.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'tech-mobile-apps',
    name: 'Mobile Application Engineering',
    description:
      'Design and develop native iOS and Android apps alongside cross-platform systems using Swift, Kotlin, and React Native.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'tech-hpc',
    name: 'High-Performance Computing & Clusters',
    description:
      'Configure supercomputer architectures, write parallel algorithms, and manage large-scale computational grids.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'tech-database-admin',
    name: 'Database Administration & Big Data Systems',
    description:
      'Optimize high-throughput SQL and NoSQL database clusters, manage data lakes, and configure Hadoop/Spark analytics environments.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'tech-vr-ar',
    name: 'Virtual & Augmented Reality Engineering',
    description:
      'Build immersive spatial computing software, configure tracking systems, and program interactive VR/AR environments.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'tech-comp-vision',
    name: 'Computer Vision & Image Processing',
    description:
      'Implement object recognition systems, program spatial camera calibration algorithms, and deploy optical tracking models.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'tech-natural-lang',
    name: 'Natural Language Processing & Speech Tech',
    description:
      'Train neural language models, build speech recognition engines, and design dialogue agents using deep learning frameworks.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'tech-quantum-computing',
    name: 'Quantum Software & Algorithms',
    description:
      'Master quantum mechanics fundamentals, write quantum gates circuits, and program quantum algorithms on real quantum hardware.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'tech-gis',
    name: 'Geographic Information Systems (GIS) Technology',
    description:
      'Analyze spatial mapping data, build interactive cartographic models, and manage geographical databases.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'tech-human-robot',
    name: 'Human-Robot Interaction & Social Robotics',
    description:
      'Design responsive robot behaviors, study human cognitive mechanics, and build collaborative robotic assistants.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'tech-digital-twins',
    name: 'Digital Twin & Industrial IoT Systems',
    description:
      'Model real-time physical systems in software, integrate industrial sensor telemetry, and build predictive maintenance simulations.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'tech-edge-ai',
    name: 'Edge AI & TinyML Systems',
    description:
      'Optimize and deploy deep learning models on low-power, resource-constrained microcontroller hardware.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },

  // ==========================================
  // MEDICAL & HEALTHCARE (20 courses)
  // ==========================================
  {
    key: 'med-cardiology',
    name: 'Cardiology & Cardiovascular Sciences',
    description:
      'Study cardiovascular pathologies, analyze diagnostic ECG recordings, and assist in clinical heart surgery procedures.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-neurology',
    name: 'Neurology & Brain Sciences',
    description:
      'Investigate nervous system pathologies, analyze electroencephalograms, and treat neurological disorders.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-pediatrics',
    name: 'Pediatrics & Child Healthcare',
    description:
      'Master child developmental milestones, diagnose pediatric illnesses, and manage neonatal clinical care units.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-nursing',
    name: 'Nursing & Patient Care Sciences',
    description:
      'Deliver critical patient care, manage ward operations, administer clinical medications, and assist doctors in procedures.',
    duration_years: 4,
    difficulty_level: 'Beginner',
  },
  {
    key: 'med-dentistry',
    name: 'Dentistry & Oral Health (BDS)',
    description:
      'Diagnose oral pathologies, perform orthodontic corrections, and deliver specialized dental healthcare treatments.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-pharmacy',
    name: 'Pharmacy & Pharmaceutical Chemistry',
    description:
      'Master drug compositions, study biochemical pharmacology, and manage commercial pharmaceutical distribution.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'med-physiotherapy',
    name: 'Physiotherapy & Rehabilitation (BPT)',
    description:
      'Design orthopedic recovery routines, treat sports injuries, and deliver muscular-skeletal rehabilitation treatments.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'med-biomedical',
    name: 'Biomedical Engineering & Medical Devices',
    description:
      'Design advanced medical scanners, construct prosthetic limbs, and calibrate clinical diagnostic electronics.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-nutrition',
    name: 'Nutrition, Dietetics & Metabolic Health',
    description:
      'Analyze nutritional deficiencies, formulate metabolic diet charts, and manage community health wellness programs.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'med-epidemiology',
    name: 'Epidemiology & Public Health Administration',
    description:
      'Model contagious disease spread patterns, analyze public health statistics, and manage healthcare policy campaigns.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'med-pathology',
    name: 'Clinical Pathology & Diagnostics',
    description:
      'Analyze blood smears, process biopsy tissue slides, and run clinical diagnostic lab equipment.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'med-genetics',
    name: 'Medical Genetics & Counseling',
    description:
      'Analyze genetic mutation screenings, counsel families on hereditary risks, and study gene-therapy models.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-radiology',
    name: 'Radiology & Medical Imaging Technology',
    description:
      'Operate advanced MRI, CT, and X-ray scanners, manage radiation safety, and catalog medical imaging records.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'med-oncology',
    name: 'Oncology & Cancer Biology Sciences',
    description:
      'Study cellular mutation pathways, analyze chemotherapy protocols, and participate in clinical cancer research studies.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-immunology',
    name: 'Immunology & Vaccine Development',
    description:
      'Investigate lymphatic immune responses, study autoimmune diseases, and research biochemical vaccine formulations.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-sports-medicine',
    name: 'Sports Medicine & Athletic Performance',
    description:
      'Study human biokinetics, manage athletic recovery plans, and treat muscular-skeletal sports trauma.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'med-toxicology',
    name: 'Clinical Pharmacology & Toxicology',
    description:
      'Analyze chemical poisoning vectors, study pharmaceutical drug interactions, and run forensic toxicology assays.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'med-geriatrics',
    name: 'Geriatric Healthcare & Aging Sciences',
    description:
      'Study age-related cognitive and physical decline, and manage specialized medical care programs for senior citizens.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'med-optometry',
    name: 'Optometry & Ophthalmic Sciences',
    description:
      'Conduct visual acuity examinations, diagnose refractive errors, and manage clinical vision correction therapies.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'med-hospital-admin',
    name: 'Hospital Operations & Healthcare Mgmt',
    description:
      'Manage clinical staffing networks, audit healthcare compliance regulations, and optimize emergency ward workflows.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },

  // ==========================================
  // BUSINESS & FINANCE (20 courses)
  // ==========================================
  {
    key: 'bus-corporate-finance',
    name: 'Corporate Finance & Treasury Management',
    description:
      'Analyze capital budgeting, manage corporate cash flow liquidity, and evaluate merger and acquisition transactions.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-human-resources',
    name: 'Human Resources & Talent Management',
    description:
      'Design corporate recruitment strategies, manage labor relations, and optimize employee training pipelines.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'bus-supply-chain',
    name: 'Supply Chain & Logistics Engineering',
    description:
      'Optimize global shipping routes, manage inventory warehouses, and negotiate vendor procurement contracts.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-international',
    name: 'International Business & Global Trade',
    description:
      'Study import-export custom regulations, analyze foreign exchange fluctuations, and manage multinational ventures.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-fintech',
    name: 'Fintech & Digital Banking Systems',
    description:
      'Analyze digital payment architectures, evaluate peer-to-peer lending platforms, and understand mobile banking security.',
    duration_years: 3,
    difficulty_level: 'Advanced',
  },
  {
    key: 'bus-real-estate',
    name: 'Real Estate Development & Finance',
    description:
      'Evaluate commercial property values, manage real estate investment trusts (REITs), and study urban zoning laws.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-hospitality',
    name: 'Hospitality & Luxury Tourism Management',
    description:
      'Manage 5-star resort operations, coordinate global luxury travel events, and optimize customer experience metrics.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'bus-ecommerce',
    name: 'E-Commerce & Digital Retail Operations',
    description:
      'Manage online digital storefronts, optimize digital conversion funnels, and coordinate retail shipping logistics.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'bus-actuarial',
    name: 'Actuarial Science & Risk Valuation',
    description:
      'Apply probability models, design insurance policies, and calculate long-term financial liabilities.',
    duration_years: 3,
    difficulty_level: 'Advanced',
  },
  {
    key: 'bus-brand-strategy',
    name: 'Brand Strategy & Public Relations',
    description:
      'Orchestrate media communication campaigns, design corporate identities, and manage public crisis communications.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'bus-sales',
    name: 'Enterprise Sales & Business Development',
    description:
      'Master B2B negotiation techniques, manage sales CRM software pipelines, and pitch corporate proposals.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'bus-wealth-mgmt',
    name: 'Wealth Management & Private Banking',
    description:
      'Formulate private client investment strategies, analyze tax shelters, and manage high-net-worth portfolios.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-sustainability-mgmt',
    name: 'Sustainability Management & Green Business',
    description:
      'Audit corporate carbon emissions, implement ESG recycling circularity, and design green product packaging.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-data-analytics',
    name: 'Business Intelligence & Data Analytics',
    description:
      'Configure corporate BI dashboard analytics, write SQL queries, and build corporate trend forecasting models.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-venture-capital',
    name: 'Venture Capital & Private Equity',
    description:
      'Evaluate early-stage startup business models, structure term sheets, and conduct corporate due diligence valuations.',
    duration_years: 3,
    difficulty_level: 'Advanced',
  },
  {
    key: 'bus-behavioral-econ',
    name: 'Behavioral Economics & Market Psychology',
    description:
      'Study cognitive biases in spending, design corporate nudges, and analyze market pricing models.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-agribusiness',
    name: 'Agribusiness & Food Supply Chains',
    description:
      'Manage agricultural commodity trading, optimize cold storage networks, and evaluate farming technology investments.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'bus-operations',
    name: 'Operations Research & Lean Six Sigma',
    description:
      'Optimize corporate manufacturing throughput, map lean value streams, and eliminate operational waste.',
    duration_years: 3,
    difficulty_level: 'Advanced',
  },
  {
    key: 'bus-product-marketing',
    name: 'Product Marketing & Growth Hacking',
    description:
      'Orchestrate software product launches, run digital user acquisition tests, and analyze product retention cohorts.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'bus-franchise',
    name: 'Franchise Operations & Retail Expansion',
    description:
      'Structure franchise operating models, evaluate retail site selections, and audit multi-location standards.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },

  // ==========================================
  // LAW & HUMANITIES (20 courses)
  // ==========================================
  {
    key: 'law-intellectual-property',
    name: 'Intellectual Property & Patent Law',
    description:
      'Study international trademark filings, draft patent claims, and analyze copyright infringement case law.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'law-international',
    name: 'International Law & Global Treaties',
    description:
      'Analyze UN charters, study international maritime boundaries, and evaluate cross-border dispute resolutions.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'law-public-policy',
    name: 'Public Policy & Legislative Studies',
    description:
      'Evaluate social policy cost-benefits, draft legislative frameworks, and analyze public administration dynamics.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'hum-political-science',
    name: 'Political Science & Comparative Politics',
    description:
      'Study classic political philosophies, analyze voting patterns, and evaluate national governance models.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'hum-sociology',
    name: 'Sociology & Social Anthropology',
    description:
      'Study community demographic shifts, analyze class struggles, and conduct ethnographical field studies.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'hum-history',
    name: 'World History & Archival Research',
    description:
      'Analyze historical primary source texts, study archaeological histories, and manage institutional museum archives.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'hum-philosophy',
    name: 'Philosophy, Logic & Cognitive Ethics',
    description:
      'Master formal logical reasoning, study epistemology theories, and analyze contemporary applied bioethics.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'hum-literature',
    name: 'English Literature & Comparative Texts',
    description:
      'Analyze classical and post-colonial literary canons, study narrative structures, and write critical essays.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'hum-criminology',
    name: 'Criminology & Criminal Justice System',
    description:
      'Study psychological criminal profiling, evaluate penitentiary correction models, and analyze crime statistics.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'law-environmental',
    name: 'Environmental Law & Climate Treaties',
    description:
      'Analyze national forestry conservation laws, study global climate accords, and litigate pollution liability cases.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'law-constitutional',
    name: 'Constitutional Law & Civil Rights',
    description:
      'Master fundamental constitutional amendments, study landmark civil liberty judgments, and draft writ petitions.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'law-cyber',
    name: 'Cyber Law & Digital Privacy Regulations',
    description:
      'Analyze national IT acts, study global data privacy regulations (GDPR), and evaluate cybercrime prosecution guidelines.',
    duration_years: 5,
    difficulty_level: 'Advanced',
  },
  {
    key: 'hum-international-relations',
    name: 'International Relations & Diplomacy',
    description:
      'Analyze foreign embassy relations, study bilateral trade negotiations, and evaluate global geopolitical conflicts.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'hum-archaeology',
    name: 'Archaeology & Cultural Heritage Preservation',
    description:
      'Conduct archaeological excavation digs, utilize carbon-dating equipment, and conserve historical monument sites.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'hum-linguistics',
    name: 'Linguistics & Phonetics Analysis',
    description:
      'Study syntax structures, analyze phonetic speech patterns, and research evolutionary historical linguistics.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'hum-geography',
    name: 'Human Geography & Urban Demographics',
    description:
      'Study urban migration patterns, analyze resources distributions, and build geographic demographic models.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'hum-economics',
    name: 'Macroeconomics & Global Development',
    description:
      'Study monetary banking policies, evaluate international development metrics, and model financial inflation.',
    duration_years: 3,
    difficulty_level: 'Advanced',
  },
  {
    key: 'hum-gender-studies',
    name: 'Gender Studies & Inclusive Advocacy',
    description:
      'Study feminist theories, analyze gender representations, and design workplace diversity policy frameworks.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'hum-art-history',
    name: 'Art History & Curatorial Practices',
    description:
      'Trace global art movements, evaluate historical paintings, and curate contemporary art gallery exhibitions.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'law-family',
    name: 'Family Law & Domestic Mediations',
    description:
      'Analyze marriage dissolution codes, manage custody disputes, and coordinate domestic mediation arbitrations.',
    duration_years: 5,
    difficulty_level: 'Intermediate',
  },

  // ==========================================
  // DESIGN & MEDIA (20 courses)
  // ==========================================
  {
    key: 'des-graphic-design',
    name: 'Graphic Design & Visual Branding',
    description:
      'Master typographic systems, design corporate visual brand books, and configure digital publishing vector layouts.',
    duration_years: 4,
    difficulty_level: 'Beginner',
  },
  {
    key: 'des-fashion',
    name: 'Fashion Design & Textile Technology',
    description:
      'Draft garment pattern layouts, analyze textile fabric mechanics, and choreograph seasonal runway fashion shows.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'des-interior',
    name: 'Interior Architecture & Spatial Design',
    description:
      'Construct 3D CAD spatial blueprints, analyze interior lighting optics, and select sustainable building finishes.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'des-fine-arts',
    name: 'Fine Arts & Studio Painting',
    description:
      'Master oil painting textures, study anatomical sketching proportions, and curate public studio art exhibitions.',
    duration_years: 4,
    difficulty_level: 'Beginner',
  },
  {
    key: 'des-creative-writing',
    name: 'Creative Writing & Screenwriting',
    description:
      'Master fictional plot arcs, write character dialogue scripts, and draft manuscripts for novel publishing houses.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'des-film-production',
    name: 'Film Production & Cinema Studies',
    description:
      'Choreograph camera lighting angles, direct dramatic actors, and edit sound timelines using Premiere Pro.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'des-animation',
    name: '3D Animation & Character Rigging',
    description:
      'Model 3D characters, build complex motion rigging skeletons, and animate cinematic sequences using Maya and Blender.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'des-game-design',
    name: 'Game Design & Interactive Mechanics',
    description:
      'Draft comprehensive game design documents, prototype level mechanics, and analyze player engagement telemetry.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'des-photography',
    name: 'Photography & Commercial Photojournalism',
    description:
      'Master camera lens exposures, coordinate studio lighting setups, and edit high-resolution digital image portfolios.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'des-industrial',
    name: 'Industrial & Hardware Product Design',
    description:
      'Sculpt physical product mockups, analyze ergonomic grip metrics, and design hardware casings for manufacturing.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
  {
    key: 'des-illustration',
    name: 'Digital Illustration & Concept Art',
    description:
      'Paint digital fantasy landscape backdrops, draw anatomical character concepts, and configure Photoshop brushes.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'des-typography',
    name: 'Typography & Typeface Design',
    description:
      'Study letterform anatomies, design custom digital font families, and configure font hinting kerning algorithms.',
    duration_years: 3,
    difficulty_level: 'Advanced',
  },
  {
    key: 'des-sound-engineering',
    name: 'Audio Tech & Music Production',
    description:
      'Mix multi-track studio recordings, configure synthesizer filters, and master digital audio files using Pro Tools.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'des-fashion-styling',
    name: 'Fashion Styling & Creative Direction',
    description:
      'Curate catalog outfits, direct model photographic editorials, and consult brands on seasonal fashion trends.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'des-jewelry',
    name: 'Jewelry Design & Gemology',
    description:
      'Sketch luxury jewelry settings, evaluate gemstone clarities (4Cs), and operate metal casting tools.',
    duration_years: 3,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'des-ceramics',
    name: 'Ceramic Design & Studio Pottery',
    description:
      'Throw clay vessels on pottery wheels, master mineral glaze chemical firings, and operate kiln ovens.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'des-exhibition',
    name: 'Exhibition & Museum Space Design',
    description:
      'Design interactive corporate trade stalls, configure museum pathways, and set up gallery display structures.',
    duration_years: 4,
    difficulty_level: 'Intermediate',
  },
  {
    key: 'des-broadcasting',
    name: 'Broadcast Journalism & News Production',
    description:
      'Anchor live digital news broadcasts, write teleprompter scripts, and coordinate studio control boards.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'des-advertising',
    name: 'Advertising Design & Creative Copywriting',
    description:
      'Write print advertising headlines, design storyboard video concepts, and manage agency client pitches.',
    duration_years: 3,
    difficulty_level: 'Beginner',
  },
  {
    key: 'des-vfx',
    name: 'Visual Effects (VFX) & Compositing',
    description:
      'Choreograph green screen compositing keys, track camera motions, and integrate CGI models using Nuke.',
    duration_years: 4,
    difficulty_level: 'Advanced',
  },
];

// Map deterministic UUIDs to each course for database compatibility
const courses = coursesRaw.map((c) => {
  const identifier = c.key || c.id || c.name;
  return {
    id: stringToUUID(identifier),
    name: c.name,
    description: c.description,
    duration_years: c.duration_years,
    difficulty_level: c.difficulty_level,
  };
});

// 3. Insert into Supabase table "courses" via PostgREST REST API
async function seedDatabase() {
  console.log(`Starting to seed ${courses.length} courses to ${supabaseUrl}...`);

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/courses`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates', // Performs upsert based on primary key "id"
      },
      body: JSON.stringify(courses),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log('Success! Successfully seeded 100 highly realistic academic courses.');
    console.log(
      'The catalog is now fully populated and ready for scalability, search, and pagination testing.'
    );
  } catch (error) {
    console.error('Failed to seed courses to database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
