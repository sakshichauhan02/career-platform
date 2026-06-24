const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../app/api/colleges/mockColleges.ts');

const statesAndCities = [
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Navi Mumbai'] },
  { state: 'Delhi', cities: ['New Delhi'] },
  { state: 'Karnataka', cities: ['Bengaluru', 'Mysore', 'Mangalore'] },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Vellore', 'Trichy'] },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Gandhinagar', 'Surat'] },
  { state: 'Telangana', cities: ['Hyderabad'] },
  { state: 'West Bengal', cities: ['Kolkata', 'Kharagpur'] },
  { state: 'Uttar Pradesh', cities: ['Noida', 'Kanpur', 'Lucknow', 'Greater Noida'] },
  { state: 'Rajasthan', cities: ['Jaipur', 'Pilani', 'Jodhpur'] },
  { state: 'Haryana', cities: ['Gurugram', 'Sonepat', 'Faridabad'] },
  { state: 'Kerala', cities: ['Kochi', 'Trivandrum', 'Calicut'] },
  { state: 'Punjab', cities: ['Chandigarh', 'Amritsar', 'Ludhiana'] },
];

const collegeTypes = ['Government', 'Private'];

// Mapped courses matching actual courses in our system
const techCourses = [
  'Computer Science & Artificial Intelligence',
  'Software Engineering & Distributed Systems',
  'Robotics & Automation Engineering',
  'Internet of Things (IoT) & Embedded Systems',
  'DevOps & Cloud Site Reliability',
  'Game Development & Graphics Programming',
  'Cybersecurity Analyst',
  'Cloud Architect',
  'Prompt Engineer',
];

const medicalCourses = [
  'Medicine & Healthcare (MBBS)',
  'Cardiology & Cardiovascular Sciences',
  'Neurology & Brain Sciences',
  'Pediatrics & Child Healthcare',
  'Nursing & Patient Care Sciences',
  'Pharmacy & Pharmaceutical Chemistry',
  'Biotechnology',
  'Bioinformatics Analyst',
];

const businessCourses = [
  'Business Administration & Management',
  'Corporate Finance & Treasury Management',
  'Human Resources & Talent Management',
  'International Business & Global Trade',
  'Fintech & Digital Banking Systems',
  'AI Product Manager',
  'Business Intelligence & Data Analytics',
];

const lawCourses = [
  'Corporate & Civil Law (BA LLB)',
  'Clinical Psychology & Therapy',
  'Sustainability Consultant',
  'Law & Civil Services',
];

const designCourses = [
  'Product Design & UI/UX',
  'UX Researcher',
  'Visual Effects (VFX) & Compositing',
  'Advertising Design & Creative Copywriting',
];

const collegeNameTemplates = [
  { prefix: 'Institute of Technology (IIT)', type: 'Government', streams: ['tech'] },
  { prefix: 'National Institute of Technology (NIT)', type: 'Government', streams: ['tech'] },
  { prefix: 'Institute of Medical Sciences (AIIMS)', type: 'Government', streams: ['medical'] },
  { prefix: 'National Law School (NLS)', type: 'Government', streams: ['law'] },
  { prefix: 'Institute of Management (IIM)', type: 'Government', streams: ['business'] },
  {
    prefix: 'Birla Institute of Technology and Science (BITS)',
    type: 'Private',
    streams: ['tech'],
  },
  { prefix: 'Vellore Institute of Technology (VIT)', type: 'Private', streams: ['tech'] },
  { prefix: 'Academy of Higher Education', type: 'Private', streams: ['medical', 'tech'] },
  { prefix: 'Symbiosis International University', type: 'Private', streams: ['business', 'law'] },
  { prefix: 'Christ University', type: 'Private', streams: ['business', 'design'] },
  {
    prefix: 'SRM Institute of Science and Technology',
    type: 'Private',
    streams: ['tech', 'medical'],
  },
  { prefix: 'Amity University', type: 'Private', streams: ['tech', 'business', 'design'] },
  { prefix: 'Delhi University (DU) College of', type: 'Government', streams: ['business', 'law'] },
  { prefix: 'National Institute of Design (NID)', type: 'Government', streams: ['design'] },
  { prefix: 'Lovely Professional University', type: 'Private', streams: ['tech', 'business'] },
  { prefix: 'St. Xavier College of', type: 'Private', streams: ['business', 'law'] },
  {
    prefix: 'Jawaharlal Nehru University (JNU) School of',
    type: 'Government',
    streams: ['law', 'medical'],
  },
  { prefix: 'Thapar Institute of Engineering', type: 'Private', streams: ['tech'] },
  { prefix: 'Dhirubhai Ambani Institute of ICT', type: 'Private', streams: ['tech'] },
  { prefix: 'ICFAI Business School', type: 'Private', streams: ['business'] },
];

function generateColleges() {
  const colleges = [];

  // 1. Seed our 6 existing high-fidelity colleges first to preserve continuity
  colleges.push(
    {
      id: 'mc-1',
      name: 'IIT Bombay',
      location: 'Mumbai',
      state: 'Maharashtra',
      ranking: 1,
      fees_annual: 220000,
      type: 'Government',
      entrance_exams: ['JEE Main', 'JEE Advanced'],
      admission_criteria: 'JEE Entrance Examination',
      website_url: 'https://www.iitb.ac.in',
      courses_offered: [
        {
          specialization: 'Computer Science & AI',
          course_name: 'Computer Science & Artificial Intelligence',
        },
        { specialization: 'Aerospace Engineering', course_name: 'Space Science & Astrophysics' },
      ],
    },
    {
      id: 'mc-2',
      name: 'AIIMS New Delhi',
      location: 'Delhi',
      state: 'Delhi',
      ranking: 2,
      fees_annual: 1628,
      type: 'Government',
      entrance_exams: ['NEET UG'],
      admission_criteria: 'NEET Merit List',
      website_url: 'https://www.aiims.edu',
      courses_offered: [
        { specialization: 'General Surgery & MBBS', course_name: 'Medicine & Healthcare (MBBS)' },
      ],
    },
    {
      id: 'mc-3',
      name: 'NID Ahmedabad',
      location: 'Ahmedabad',
      state: 'Gujarat',
      ranking: 5,
      fees_annual: 180000,
      type: 'Government',
      entrance_exams: ['NID DAT'],
      admission_criteria: 'DAT Entrance Exam',
      website_url: 'https://www.nid.edu',
      courses_offered: [
        { specialization: 'Interaction Design', course_name: 'Product Design & UI/UX' },
      ],
    },
    {
      id: 'mc-4',
      name: 'SRCC Delhi',
      location: 'Delhi',
      state: 'Delhi',
      ranking: 10,
      fees_annual: 35000,
      type: 'Government',
      entrance_exams: ['CUET UG'],
      admission_criteria: 'CUET Marks Cutoff',
      website_url: 'https://www.srcc.edu',
      courses_offered: [
        { specialization: 'Financial Accounting', course_name: 'Chartered Accountancy (CA)' },
      ],
    },
    {
      id: 'mc-5',
      name: 'IIM Ahmedabad',
      location: 'Ahmedabad',
      state: 'Gujarat',
      ranking: 1,
      fees_annual: 2300000,
      type: 'Government',
      entrance_exams: ['CAT', 'GMAT'],
      admission_criteria: 'CAT Entrance Score',
      website_url: 'https://www.iima.ac.in',
      courses_offered: [
        {
          specialization: 'Post Graduate Program',
          course_name: 'Business Administration & Management',
        },
      ],
    },
    {
      id: 'mc-6',
      name: 'Ashoka University',
      location: 'Sonepat',
      state: 'Haryana',
      ranking: 15,
      fees_annual: 950000,
      type: 'Private',
      entrance_exams: ['AAT', 'SAT'],
      admission_criteria: 'AAT & Aptitude Interview',
      website_url: 'https://www.ashoka.edu.in',
      courses_offered: [
        {
          specialization: 'Cognitive Science & Psychology',
          course_name: 'Clinical Psychology & Therapy',
        },
      ],
    }
  );

  // 2. Generate 94 more colleges to reach exactly 100 records
  let rankCounter = 16;
  for (let i = 7; i <= 100; i++) {
    // Select location
    const locGroup = statesAndCities[i % statesAndCities.length];
    const city = locGroup.cities[i % locGroup.cities.length];
    const state = locGroup.state;

    // Select name template
    const template = collegeNameTemplates[i % collegeNameTemplates.length];
    const name = `${template.prefix} ${city}`;

    // Determine type, ranking, and fees
    const type = template.type;
    const ranking = rankCounter++;

    let fees_annual = 0;
    if (type === 'Government') {
      // Government fees: ₹10,000 to ₹1,80,000
      fees_annual = Math.round((10000 + ((i * 1729) % 170000)) / 1000) * 1000;
    } else {
      // Private fees: ₹2,50,000 to ₹18,00,000
      fees_annual = Math.round((250000 + ((i * 19283) % 1550000)) / 10000) * 10000;
    }

    // Determine entrance exams
    const entrance_exams = [];
    const mainStream = template.streams[0];
    let admission_criteria = 'Merit List';

    if (mainStream === 'tech') {
      entrance_exams.push('JEE Main');
      if (type === 'Government' && i % 3 === 0) entrance_exams.push('JEE Advanced');
      else if (type === 'Private') entrance_exams.push('BITS AT', 'VIT EEE');
      admission_criteria = 'Engineering Entrance Exam Score';
    } else if (mainStream === 'medical') {
      entrance_exams.push('NEET UG');
      admission_criteria = 'NEET Counseling Cutoff';
    } else if (mainStream === 'business') {
      if (type === 'Government') {
        entrance_exams.push('CAT');
        admission_criteria = 'CAT Percentile Merit';
      } else {
        entrance_exams.push('MAT', 'GMAT');
        admission_criteria = 'Management Aptitude Score';
      }
    } else if (mainStream === 'law') {
      entrance_exams.push('CLAT');
      admission_criteria = 'CLAT Score Cutoff';
    } else if (mainStream === 'design') {
      entrance_exams.push('UCEED', 'NID DAT');
      admission_criteria = 'Design Portfolio Interview';
    }

    if (entrance_exams.length === 0) {
      entrance_exams.push('Direct Admission / CUET');
      admission_criteria = 'Class 12 Marks Cutoff';
    }

    // Map courses offered based on template streams
    const courses_offered = [];
    template.streams.forEach((str) => {
      if (str === 'tech') {
        const c1 = techCourses[i % techCourses.length];
        const c2 = techCourses[(i + 3) % techCourses.length];
        courses_offered.push(
          { specialization: c1.split(' & ')[0] + ' Tech', course_name: c1 },
          { specialization: c2.split(' & ')[0] + ' Engineering', course_name: c2 }
        );
      } else if (str === 'medical') {
        const c1 = medicalCourses[i % medicalCourses.length];
        courses_offered.push({ specialization: c1.replace(' & ', ' '), course_name: c1 });
      } else if (str === 'business') {
        const c1 = businessCourses[i % businessCourses.length];
        courses_offered.push({ specialization: 'General MBA', course_name: c1 });
      } else if (str === 'law') {
        const c1 = lawCourses[i % lawCourses.length];
        courses_offered.push({ specialization: 'Integrated LLB', course_name: c1 });
      } else if (str === 'design') {
        const c1 = designCourses[i % designCourses.length];
        courses_offered.push({ specialization: 'Creative Studies', course_name: c1 });
      }
    });

    const webSafeName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const website_url = `https://www.${webSafeName.slice(0, 15)}.edu.in`;

    colleges.push({
      id: `mc-${i}`,
      name,
      location: city,
      state,
      ranking,
      fees_annual,
      type,
      entrance_exams,
      admission_criteria,
      website_url,
      courses_offered,
    });
  }

  // Write file contents in TypeScript format
  const tsContent = `// Programmatically generated database of 100 high-fidelity Indian colleges
export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  ranking: number | null;
  fees_annual: number;
  type: string;
  entrance_exams: string[];
  admission_criteria?: string;
  website_url: string | null;
  courses_offered: { specialization: string; course_name: string }[];
}

export const MOCK_COLLEGES: College[] = ${JSON.stringify(colleges, null, 2)};
`;

  try {
    fs.writeFileSync(targetFilePath, tsContent, 'utf8');
    console.log(
      `Successfully generated and wrote 100 highly detailed colleges to ${targetFilePath}.`
    );
  } catch (err) {
    console.error('Failed to write mockColleges.ts:', err);
    process.exit(1);
  }
}

generateColleges();
