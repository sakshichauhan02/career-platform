/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { ScoredCourse } from '@/services/recommendationEngine';

// Mapping dictionaries for user profile summary display
const INTEREST_LABELS: Record<string, string> = {
  tech_ai: 'Tech & AI',
  medicine_bio: 'Medicine & Biology',
  business_ent: 'Business & Entrepreneurship',
  design_arts: 'Design & Arts',
  marketing_pr: 'Marketing & PR',
  education_social: 'Education & Social Support',
  law_civil: 'Law & Civil Services',
  finance_econ: 'Finance & Economics',
  space_research: 'Space Research',
  media_writing: 'Media & Writing',
};

const PRIORITY_LABELS: Record<string, string> = {
  high_salary: 'High Salary',
  stability_security: 'Stability & Security',
  prestige_status: 'Prestige & Status',
  creative_freedom: 'Creative Freedom',
  social_impact: 'Social Impact',
  global_mobility: 'Global Mobility',
  work_life_balance: 'Work-Life Balance',
};

const EDUCATION_LABELS: Record<string, string> = {
  school_10th: '10th Standard',
  school_11th: '11th Standard',
  school_12th_pcm: '12th (PCM)',
  school_12th_pcb: '12th (PCB)',
  school_12th_commerce: '12th (Commerce)',
  school_12th_arts: '12th (Arts)',
  graduate: 'Graduate',
};

const MENTORS_BY_COURSE: Record<
  string,
  {
    name: string;
    role: string;
    company: string;
    rating: string;
    experience: string;
  }
> = {
  'cse-ai': {
    name: 'Dr. Aarav Mehta',
    role: 'Principal AI Researcher',
    company: 'Google DeepMind',
    rating: '4.9',
    experience: '12 years',
  },
  'medicine-mbbs': {
    name: 'Dr. Sarah Jenkins',
    role: 'Chief Surgeon & Professor',
    company: 'Johns Hopkins Medicine',
    rating: '5.0',
    experience: '15 years',
  },
  'uiux-product-design': {
    name: 'Elena Rostova',
    role: 'VP of Design',
    company: 'Airbnb',
    rating: '4.9',
    experience: '10 years',
  },
  'chartered-accountancy': {
    name: 'Rajesh Singhania',
    role: 'Senior Audit Partner',
    company: 'EY (Ernst & Young)',
    rating: '4.8',
    experience: '18 years',
  },
  'business-admin-mba': {
    name: 'Marcus Vance',
    role: 'Management Consultant & Founder',
    company: 'McKinsey & Co. / Startups',
    rating: '4.9',
    experience: '14 years',
  },
  'law-llb': {
    name: 'Advocate Advait Roy',
    role: 'Senior Corporate Counsel',
    company: 'Shardul Amarchand Mangaldas',
    rating: '4.9',
    experience: '11 years',
  },
  'space-astrophysics': {
    name: 'Dr. Neil Tyson Cooper',
    role: 'Research Scientist',
    company: 'NASA Jet Propulsion Lab',
    rating: '5.0',
    experience: '16 years',
  },
  'digital-marketing': {
    name: 'Sophia Chen',
    role: 'Director of Growth Marketing',
    company: 'HubSpot',
    rating: '4.8',
    experience: '9 years',
  },
  biotechnology: {
    name: 'Dr. Clara Oswald',
    role: 'Head of Genomic R&D',
    company: 'Pfizer',
    rating: '4.9',
    experience: '13 years',
  },
  'journalism-media': {
    name: 'David Remnick Miller',
    role: 'Investigative Editor',
    company: 'The New York Times',
    rating: '4.7',
    experience: '20 years',
  },
  'clinical-psychology': {
    name: 'Dr. Anjali Sen',
    role: 'Licensed Therapist & Author',
    company: 'MindCare Clinic',
    rating: '4.9',
    experience: '14 years',
  },
  'finance-investment-banking': {
    name: 'Alexander Sterling',
    role: 'Managing Director',
    company: 'Goldman Sachs',
    rating: '5.0',
    experience: '15 years',
  },
};

const defaultMentor = {
  name: 'Jane Doe',
  role: 'Senior Academic Advisor',
  company: 'PathWayAI',
  rating: '4.9',
  experience: '10 years',
};

const COLLEGES_DB = [
  {
    name: 'IIT Bombay',
    location: 'Mumbai, Maharashtra',
    type: 'Government',
    entrance_exams: 'JEE Main, JEE Advanced',
    admission_criteria: 'Rank-based cutoff',
    fees_annual: '₹2.2 Lakhs',
    website_url: 'www.iitb.ac.in',
    course_name: 'Computer Science & Artificial Intelligence',
  },
  {
    name: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    type: 'Private',
    entrance_exams: 'BITSAT',
    admission_criteria: 'BITSAT Score',
    fees_annual: '₹4.5 Lakhs',
    website_url: 'www.bits-pilani.ac.in',
    course_name: 'Computer Science & Artificial Intelligence',
  },
  {
    name: 'AIIMS New Delhi',
    location: 'New Delhi, Delhi',
    type: 'Government',
    entrance_exams: 'NEET UG',
    admission_criteria: 'NEET Rank cutoff',
    fees_annual: '₹1,628',
    website_url: 'www.aiims.edu',
    course_name: 'Medicine & Healthcare (MBBS)',
  },
  {
    name: 'CMC Vellore',
    location: 'Vellore, Tamil Nadu',
    type: 'Private / Trust',
    entrance_exams: 'NEET UG',
    admission_criteria: 'NEET Score + Interview',
    fees_annual: '₹52,000',
    website_url: 'www.cmch-vulore.edu',
    course_name: 'Medicine & Healthcare (MBBS)',
  },
  {
    name: 'NID Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    type: 'Government',
    entrance_exams: 'NID DAT',
    admission_criteria: 'DAT Prelims & Mains',
    fees_annual: '₹1.8 Lakhs',
    website_url: 'www.nid.edu',
    course_name: 'Product Design & UI/UX',
  },
  {
    name: 'IDC School of Design, IIT Bombay',
    location: 'Mumbai, Maharashtra',
    type: 'Government',
    entrance_exams: 'UCEED',
    admission_criteria: 'UCEED Rank cutoff',
    fees_annual: '₹2.2 Lakhs',
    website_url: 'www.idc.iitb.ac.in',
    course_name: 'Product Design & UI/UX',
  },
  {
    name: 'SRCC Delhi',
    location: 'New Delhi, Delhi',
    type: 'Government',
    entrance_exams: 'CUET UG',
    admission_criteria: 'CUET Cutoff Percentile',
    fees_annual: '₹35,000',
    website_url: 'www.srcc.edu',
    course_name: 'Chartered Accountancy (CA)',
  },
  {
    name: 'IIM Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    type: 'Government',
    entrance_exams: 'CAT',
    admission_criteria: 'CAT Percentile + AWT/PI',
    fees_annual: '₹23 Lakhs (Postgrad)',
    website_url: 'www.iima.ac.in',
    course_name: 'Business Administration & Management',
  },
  {
    name: 'NLSIU Bangalore',
    location: 'Bengaluru, Karnataka',
    type: 'Government',
    entrance_exams: 'CLAT',
    admission_criteria: 'CLAT Rank Cutoff',
    fees_annual: '₹2.6 Lakhs',
    website_url: 'www.nls.ac.in',
    course_name: 'Corporate & Civil Law (BA LLB)',
  },
  {
    name: 'IIST Thiruvananthapuram',
    location: 'Valiamala, Kerala',
    type: 'Government',
    entrance_exams: 'JEE Advanced',
    admission_criteria: 'JEE Advanced Rank Cutoff',
    fees_annual: '₹1.4 Lakhs',
    website_url: 'www.iist.ac.in',
    course_name: 'Space Science & Astrophysics',
  },
  {
    name: 'MICA Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    type: 'Private',
    entrance_exams: 'CAT / XAT + MICAT',
    admission_criteria: 'Entrance Score + GE/PI',
    fees_annual: '₹11 Lakhs',
    website_url: 'www.mica.ac.in',
    course_name: 'Digital Marketing & PR',
  },
  {
    name: 'IIT Madras (Biotech Dept)',
    location: 'Chennai, Tamil Nadu',
    type: 'Government',
    entrance_exams: 'JEE Advanced',
    admission_criteria: 'JEE Advanced Rank Cutoff',
    fees_annual: '₹2.2 Lakhs',
    website_url: 'www.iitm.ac.in',
    course_name: 'Biotechnology & Genetics',
  },
  {
    name: 'FMS Delhi',
    location: 'New Delhi, Delhi',
    type: 'Government',
    entrance_exams: 'CAT',
    admission_criteria: 'CAT Score + PI',
    fees_annual: '₹10,000',
    website_url: 'www.fms.edu',
    course_name: 'Business Administration & Management',
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-key';
const getSupabaseClient = () => createClient(supabaseUrl, supabaseKey);

async function sendReportEmail(emailAddress: string, pdfBuffer: Buffer, studentName: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || 'PathWayAI <noreply@pathwayai.co>';

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: emailAddress,
      subject: `Your Personalized Career Pathways Report - ${studentName}`,
      text: `Hello ${studentName},\n\nPlease find attached your personalized 10-page Career Pathways Report.\n\nBest regards,\nPathWayAI Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Your Career Pathways Report is Ready!</h2>
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>Thank you for completing your assessment with PathWayAI. We have generated your comprehensive 10-page career report detailing your academic profile, recommended specializations, salary outlooks, college suggestions, and action plan.</p>
          <p>Please find the generated report attached directly to this email as a PDF.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">If you did not request this report, please ignore this email.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'Career_Pathway_Report.pdf',
          content: pdfBuffer,
        },
      ],
    });
    return { sent: true, mode: 'SMTP' };
  } else {
    try {
      const mockMailDir = path.join(process.cwd(), 'public', 'mock-emails');
      if (!fs.existsSync(mockMailDir)) {
        fs.mkdirSync(mockMailDir, { recursive: true });
      }
      const mailId = `mail_${Date.now()}`;
      const mockMailPath = path.join(mockMailDir, `${mailId}.json`);

      fs.writeFileSync(
        mockMailPath,
        JSON.stringify(
          {
            id: mailId,
            to: emailAddress,
            from: fromEmail,
            subject: `Your Personalized Career Pathways Report - ${studentName}`,
            timestamp: new Date().toISOString(),
            status: 'MOCK_DELIVERED',
            note: 'Configure SMTP environment variables in your .env.local to send real emails.',
          },
          null,
          2
        )
      );
      return { sent: true, mode: 'MOCK', mockPath: `/mock-emails/${mailId}.json` };
    } catch (writeErr: any) {
      console.warn('Failed to write mock email to read-only filesystem:', writeErr.message);
      console.info('Simulated Report Email details:', {
        to: emailAddress,
        from: fromEmail,
        subject: `Your Personalized Career Pathways Report - ${studentName}`,
      });
      return { sent: true, mode: 'LOGGED', note: 'SMTP variables missing and filesystem is read-only. Logged to console.' };
    }
  }
}

export const maxDuration = 60; // Set function timeout to 60 seconds

async function getBrowserInstance() {
  const isLocal = process.env.NODE_ENV === 'development' || !process.env.VERCEL;

  if (isLocal) {
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } else {
    // Auto-fetch correct executable matching version of sparticuz/chromium-min
    const executablePath = await chromium.executablePath();

    return await puppeteerCore.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: (chromium as any).defaultViewport,
      executablePath: executablePath,
      headless: (chromium as any).headless,
      ignoreHTTPSErrors: true,
    } as any);
  }
}

export async function POST(req: NextRequest) {
  let htmlContent = '';
  try {
    const { profile, recommendations, email, userId } = await req.json();

    if (!profile || !recommendations || recommendations.length < 3) {
      return NextResponse.json(
        { error: 'Insufficient data for a complete 10-page report' },
        { status: 400 }
      );
    }

    const top3: ScoredCourse[] = recommendations.slice(0, 3);
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const mentors = top3.map((rec) => MENTORS_BY_COURSE[rec.course.id] || defaultMentor);

    const suggestedColleges = COLLEGES_DB.filter((col) =>
      top3.some(
        (rec) =>
          rec.course.name.toLowerCase().includes(col.course_name.toLowerCase()) ||
          col.course_name.toLowerCase().includes(rec.course.name.toLowerCase())
      )
    ).slice(0, 5);

    if (suggestedColleges.length === 0) {
      suggestedColleges.push(...COLLEGES_DB.slice(0, 5));
    }

    const actionPlanPhases = [
      {
        phase: 'Phase 1: Foundation & Baseline Skills (Months 0 - 12)',
        items: [
          `Develop deep conceptual understanding of core subjects: ${profile.subjects?.join(', ') || 'selected academic fields'}.`,
          `Enroll in foundational online courses related to ${top3[0].course.name}.`,
          'Engage in hobby-level side projects or research papers to build context.',
          'Identify key programming languages or tools used in the industry and achieve basic proficiency.',
        ],
      },
      {
        phase: 'Phase 2: Project Portfolios & Applied Learning (Months 12 - 24)',
        items: [
          `Build 2-3 medium-sized personal projects related specifically to ${top3[0].course.name} and ${top3[1].course.name}.`,
          'Publish your findings, codebase, or design portfolios publicly (GitHub, Behance, or Personal Blog).',
          'Participate in academic contests, hackathons, or student club committees.',
          'Start practicing entrance examinations or tracking eligibility requirements for top colleges.',
        ],
      },
      {
        phase: 'Phase 3: Internships & Professional Connections (Months 24 - 36)',
        items: [
          'Optimize your LinkedIn profile and resume to highlight your applied project portfolio.',
          'Seek 1-2 small freelance assignments, volunteer roles, or summer internships in your field.',
          'Attend local meetups, conferences, or online workshops to network with working professionals.',
          `Connect with your assigned mentor ${mentors[0].name} to refine your specialized career direction.`,
        ],
      },
      {
        phase: 'Phase 4: Specialization & Selection (Months 36+)',
        items: [
          'Choose a specific niche or subdomain to build deep expertise in.',
          'Submit applications to target premium institutions (e.g., colleges listed in Section 8).',
          'Practice comprehensive technical assessment rounds and mock behavioral interviews.',
          'Secure final year Capstone projects or industry sponsorships to guarantee immediate placement.',
        ],
      },
    ];

    htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Personalized Career Pathways Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
    }
    body {
      font-family: 'Inter', sans-serif;
      color: #0f172a;
      background-color: #ffffff;
    }

    @media print {
      @page {
        size: A4;
        margin: 0;
      }
    }
    
    .page {
      width: 210mm;
      height: 297mm;
      padding: 22mm 20mm;
      background-color: #ffffff;
      page-break-after: always;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    .page:last-child {
      page-break-after: avoid !important;
    }
    
    .cover {
      background: radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 60%, #020617 100%);
      color: #ffffff;
      padding: 35mm 24mm 24mm 24mm;
      justify-content: space-between;
    }
    .cover-brand {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 5px;
      color: #818cf8;
      text-transform: uppercase;
      margin-bottom: 25mm;
      display: flex;
      align-items: center;
      gap: 2mm;
    }
    .cover-brand::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #f472b6;
      border-radius: 50%;
    }
    .cover-main {
      margin-bottom: auto;
    }
    .cover-title {
      font-family: 'Outfit', sans-serif;
      font-size: 46px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -1.5px;
      margin-bottom: 8mm;
      background: linear-gradient(135deg, #ffffff 30%, #c7d2fe 70%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cover-subtitle {
      font-size: 17px;
      font-weight: 400;
      color: #94a3b8;
      line-height: 1.6;
      max-width: 520px;
    }
    .cover-details {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 12mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .cover-student h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }
    .cover-student p {
      font-size: 13px;
      color: #a5b4fc;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .cover-meta {
      text-align: right;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .cover-meta strong {
      color: #94a3b8;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid #f1f5f9;
      padding-bottom: 4mm;
      margin-bottom: 8mm;
    }
    .header-tag {
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .header-logo {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 1px;
    }
    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1.5px solid #f1f5f9;
      padding-top: 4mm;
      font-size: 10px;
      color: #94a3b8;
      font-weight: 600;
    }
    
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.75px;
      margin-bottom: 1.5mm;
    }
    .section-desc {
      font-size: 13.5px;
      color: #64748b;
      margin-bottom: 7mm;
      line-height: 1.5;
    }
    
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 5.5mm;
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .card-dark {
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
    }
    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #334155;
      margin-bottom: 4mm;
      border-left: 3px solid #6366f1;
      padding-left: 2.5mm;
    }
    
    .badge-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 2mm;
    }
    .badge {
      font-size: 11px;
      font-weight: 600;
      padding: 1.5mm 3.5mm;
      border-radius: 30px;
      background-color: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    }
    .badge-primary {
      background-color: #eef2ff;
      color: #4f46e5;
      border: 1px solid #e0e7ff;
    }
    .badge-accent {
      background-color: #fdf2f8;
      color: #db2777;
      border: 1px solid #fce7f3;
    }
    .badge-highlight {
      background-color: #fffbeb;
      color: #d97706;
      border: 1px solid #fef3c7;
    }
    
    .scale-box {
      margin-bottom: 4.5mm;
    }
    .scale-box:last-child {
      margin-bottom: 0;
    }
    .scale-meta {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 2mm;
    }
    .scale-track {
      height: 8px;
      background-color: #e2e8f0;
      border-radius: 4px;
      position: relative;
    }
    .scale-bar {
      height: 100%;
      background: linear-gradient(to right, #6366f1, #a855f7);
      border-radius: 4px;
    }
    .scale-indicator {
      width: 14px;
      height: 14px;
      background-color: #ffffff;
      border: 3px solid #6366f1;
      border-radius: 50%;
      position: absolute;
      top: -3px;
      box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
    }
    
    .match-row {
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 6.5mm;
      margin-bottom: 5mm;
      background: #ffffff;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .match-row-featured {
      border: 2px solid #6366f1;
      background: linear-gradient(180deg, #ffffff 0%, #fafaff 100%);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.04);
    }
    .match-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3.5mm;
    }
    .match-index {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 800;
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .match-percentage {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 800;
      background-color: #eef2ff;
      color: #4f46e5;
      padding: 1.5mm 4mm;
      border-radius: 40px;
      border: 1px solid #cbd5e1;
    }
    .match-row-featured .match-percentage {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      border: none;
    }
    .match-name {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 3mm;
    }
    .match-text {
      font-size: 13px;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 4mm;
    }
    
    .sub-section {
      margin-bottom: 6mm;
    }
    .sub-section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 0.75px;
      margin-bottom: 2mm;
      display: flex;
      align-items: center;
      gap: 2mm;
    }
    .sub-section-title::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #818cf8;
      border-radius: 50%;
    }
    .sub-section-body {
      font-size: 13.5px;
      color: #334155;
      line-height: 1.65;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 3mm;
    }
    th {
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #475569;
      background-color: #f8fafc;
      text-align: left;
      padding: 4.5mm 5mm;
      border-bottom: 2px solid #e2e8f0;
    }
    td {
      font-size: 12.5px;
      color: #334155;
      padding: 4.5mm 5mm;
      border-bottom: 1.5px solid #f1f5f9;
      line-height: 1.55;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:nth-child(even) td {
      background-color: #fafbfc;
    }
    
    .timeline {
      margin-top: 2mm;
    }
    .timeline-node {
      position: relative;
      padding-left: 9mm;
      border-left: 2px solid #e2e8f0;
      padding-bottom: 7mm;
    }
    .timeline-node:last-child {
      border-left: none;
      padding-bottom: 0;
    }
    .timeline-marker {
      width: 16px;
      height: 16px;
      background-color: #ffffff;
      border: 4px solid #6366f1;
      border-radius: 50%;
      position: absolute;
      left: -9px;
      top: 1mm;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
    }
    .timeline-node:nth-child(even) .timeline-marker {
      border-color: #a855f7;
      box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.15);
    }
    .timeline-header {
      font-family: 'Outfit', sans-serif;
      font-size: 14.5px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 3mm;
    }
    .timeline-bullets {
      list-style: none;
    }
    .timeline-bullet {
      font-size: 13px;
      color: #475569;
      margin-bottom: 2mm;
      line-height: 1.6;
      display: flex;
      align-items: flex-start;
    }
    .timeline-bullet::before {
      content: "→";
      color: #6366f1;
      font-weight: 800;
      margin-right: 2.5mm;
      line-height: 1.2;
    }
    
    .mentor-profile {
      border: 1.5px solid #e2e8f0;
      border-radius: 20px;
      padding: 8.5mm;
      background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
      display: flex;
      align-items: center;
      gap: 8mm;
      margin-top: 3mm;
      margin-bottom: 8mm;
    }
    .mentor-details {
      flex: 1;
    }
    .mentor-header {
      margin-bottom: 4mm;
    }
    .mentor-fullname {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 1mm;
    }
    .mentor-designation {
      font-size: 14px;
      font-weight: 600;
      color: #6366f1;
      margin-bottom: 1.5mm;
    }
    .mentor-org {
      font-size: 13px;
      color: #64748b;
    }
    .mentor-metrics {
      display: flex;
      gap: 8mm;
      border-top: 1px solid #e2e8f0;
      padding-top: 4mm;
    }
    .mentor-metric {
      font-size: 12.5px;
      color: #475569;
    }
    .mentor-metric strong {
      color: #0f172a;
      font-size: 14.5px;
      font-family: 'Outfit', sans-serif;
    }
    .callout-box {
      border: 1.5px dashed #a5b4fc;
      background-color: #fafaff;
      border-radius: 16px;
      padding: 7mm;
      text-align: center;
    }
    .callout-title {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: #1e1b4b;
      margin-bottom: 2mm;
    }
    .callout-description {
      font-size: 12.5px;
      color: #4338ca;
      line-height: 1.6;
      margin-bottom: 5mm;
    }
    .callout-action-btn {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 13.5px;
      padding: 3mm 8mm;
      border-radius: 10px;
      text-decoration: none;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER -->
  <div class="page cover">
    <div class="cover-brand">PathWayAI</div>
    <div class="cover-main">
      <h1 class="cover-title">PERSONALIZED<br>CAREER PATHWAYS<br>REPORT</h1>
      <p class="cover-subtitle">A comprehensive, multi-dimensional alignment analysis mapping academic foundations, psychological work styles, and long-term career outlooks.</p>
    </div>
    <div class="cover-details">
      <div class="cover-student">
        <h2>${profile.name || 'Aspiring Professional'}</h2>
        <p>Education Stage: ${EDUCATION_LABELS[profile.educationLevel] || profile.educationLevel || 'Not Specified'}</p>
      </div>
      <div class="cover-meta">
        <strong>Date Generated:</strong> ${dateStr}<br>
        <strong>Report Status:</strong> Premium Tier Profile<br>
        <strong>Reference Token:</strong> PRIVATE-ID-${Math.floor(100000 + Math.random() * 900000)}
      </div>
    </div>
  </div>

  <!-- PAGE 2: PROFILE SUMMARY -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">02. Academic & Personal Profile</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <h2 class="section-title">Profile Dimensions</h2>
      <p class="section-desc">A deep review of your parsed background parameters and core competencies evaluated for career alignment.</p>
      
      <div class="grid-2">
        <div class="card card-dark">
          <h3 class="card-title">Academic Foundation</h3>
          <p style="font-size: 13.5px; margin-bottom: 3mm;"><strong>Academic Stage:</strong> ${EDUCATION_LABELS[profile.educationLevel] || 'Not specified'}</p>
          <p style="font-size: 13.5px; margin-bottom: 5mm;"><strong>Preferred Stream:</strong> ${profile.stream ? profile.stream.toUpperCase() : 'Not Specified'}</p>
          
          <h4 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 2mm; letter-spacing: 0.5px;">Core Focus Subjects</h4>
          <div class="badge-wrap">
            ${profile.subjects?.map((sub: string) => `<span class="badge badge-primary">${sub}</span>`).join('') || '<span class="badge">General</span>'}
          </div>
        </div>

        <div class="card card-dark">
          <h3 class="card-title">Priorities & Budget</h3>
          <div class="badge-wrap" style="margin-bottom: 5mm;">
            ${profile.priorities?.map((prio: string) => `<span class="badge badge-highlight">${PRIORITY_LABELS[prio] || prio}</span>`).join('') || '<span class="badge">General</span>'}
          </div>
          
          <h3 class="card-title" style="margin-top: 2mm; margin-bottom: 2mm; border: none; padding-left: 0;">Financial Scope</h3>
          <p style="font-size: 13.5px;"><strong>Annual Budget Limit:</strong> ${profile.budget || 'Not specified'}</p>
        </div>
      </div>

      <div class="card" style="margin-top: 6mm;">
        <h3 class="card-title">Personal Affinities & Interests</h3>
        <div class="grid-2">
          <div>
            <h4 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 2.5mm; letter-spacing: 0.5px;">Primary Interests</h4>
            <div class="badge-wrap">
              ${profile.interests?.map((int: string) => `<span class="badge badge-accent">${INTEREST_LABELS[int] || int}</span>`).join('') || '<span class="badge">General</span>'}
            </div>
          </div>
          <div>
            <h4 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 2.5mm; letter-spacing: 0.5px;">Hobbies & Extracurriculars</h4>
            <div class="badge-wrap">
              ${profile.hobbies?.map((hob: string) => `<span class="badge">${hob}</span>`).join('') || '<span class="badge">None</span>'}
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top: 6mm;">
        <h3 class="card-title">Psychological Work Style Preference</h3>
        
        <div class="scale-box">
          <div class="scale-meta">
            <span>Independent Execution</span>
            <span>Collaborative Teamwork</span>
          </div>
          <div class="scale-track">
            <div class="scale-bar" style="width: 100%;"></div>
            <div class="scale-indicator" style="left: ${((profile.workStyle?.collaboration || 3) - 1) * 25}%;"></div>
          </div>
        </div>
        
        <div class="scale-box">
          <div class="scale-meta">
            <span>Structured Desk / Office Setting</span>
            <span>Dynamic Field / Outdoor Setting</span>
          </div>
          <div class="scale-track">
            <div class="scale-bar" style="width: 100%;"></div>
            <div class="scale-indicator" style="left: ${((profile.workStyle?.workplace || 3) - 1) * 25}%;"></div>
          </div>
        </div>

        <div class="scale-box">
          <div class="scale-meta">
            <span>Structured Task Execution</span>
            <span>Flexible / Creative Problem-Solving</span>
          </div>
          <div class="scale-track">
            <div class="scale-bar" style="width: 100%;"></div>
            <div class="scale-indicator" style="left: ${((profile.workStyle?.structure || 3) - 1) * 25}%;"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 2 of 10</span>
    </div>
  </div>

  <!-- PAGE 3: TOP MATCHES -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">03. Career Match Overview</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <h2 class="section-title">Top Suggested Careers</h2>
      <p class="section-desc">Based on our advanced multi-dimensional matching algorithms, here are your top 3 recommended pathways.</p>
      
      ${top3
        .map(
          (item, index) => `
        <div class="match-row ${index === 0 ? 'match-row-featured' : ''}">
          <div class="match-top">
            <span class="match-index">${index === 0 ? '🏆 Primary Specialization' : index === 1 ? '🥈 Secondary Specialization' : '🥉 Alternative Track'}</span>
            <span class="match-percentage">${Math.round(item.score * 100)}% Match</span>
          </div>
          <h3 class="match-name">${item.course.name}</h3>
          <p class="match-text">${item.course.description}</p>
          <div class="badge-wrap">
            <span class="badge badge-primary">Course Duration: ${item.course.durationYears} Years</span>
            <span class="badge badge-accent">Curriculum Level: ${item.course.difficultyLevel}</span>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 3 of 10</span>
    </div>
  </div>

  <!-- PAGE 4: COURSE 1 DETAILS -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">04. Primary Recommendation</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2mm;">
        <h2 class="section-title" style="margin-bottom: 0;">${top3[0].course.name}</h2>
        <span class="match-percentage" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; border: none;">
          ${Math.round(top3[0].score * 100)}% Match
        </span>
      </div>
      <div class="badge badge-primary" style="display: inline-block; margin-bottom: 6mm; font-size: 11.5px; font-weight: 700; text-transform: uppercase;">
        Primary Academic Pathway
      </div>
      
      <div class="sub-section">
        <h3 class="sub-section-title">Why This Career Fits</h3>
        <p class="sub-section-body">${top3[0].explanation?.whyThisCourseFits || top3[0].course.reasoningTemplate}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Academic Strength Alignment</h3>
        <p class="sub-section-body">${top3[0].explanation?.strengthAnalysis || 'Strong indicators map your subjects directly to the problem-solving and rigorous analytical curriculum required in this discipline.'}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Interests & Hobbies Synergy</h3>
        <p class="sub-section-body">${top3[0].explanation?.interestAnalysis || 'Your hobbies and extracurricular passions align with the practical applications, design cycles, or communication requirements of this industry.'}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Workplace Culture Fit</h3>
        <p class="sub-section-body">${top3[0].explanation?.careerFitAnalysis || 'The day-to-day office expectations, collaboration parameters, and task structures perfectly fit your evaluated work style index.'}</p>
      </div>
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 4 of 10</span>
    </div>
  </div>

  <!-- PAGE 5: COURSE 2 DETAILS -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">05. Secondary Recommendation</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2mm;">
        <h2 class="section-title" style="margin-bottom: 0;">${top3[1].course.name}</h2>
        <span class="match-percentage">${Math.round(top3[1].score * 100)}% Match</span>
      </div>
      <div class="badge badge-accent" style="display: inline-block; margin-bottom: 6mm; font-size: 11.5px; font-weight: 700; text-transform: uppercase;">
        Secondary Academic Pathway
      </div>
      
      <div class="sub-section">
        <h3 class="sub-section-title">Why This Career Fits</h3>
        <p class="sub-section-body">${top3[1].explanation?.whyThisCourseFits || top3[1].course.reasoningTemplate}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Academic Strength Alignment</h3>
        <p class="sub-section-body">${top3[1].explanation?.strengthAnalysis || 'Evaluated parameters demonstrate secondary indicators matching your subjects to the analytical curriculum required.'}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Interests & Hobbies Synergy</h3>
        <p class="sub-section-body">${top3[1].explanation?.interestAnalysis || 'Your creative affinities and active hobbies match the problem-solving and secondary design tasks of this path.'}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Workplace Culture Fit</h3>
        <p class="sub-section-body">${top3[1].explanation?.careerFitAnalysis || 'Offers balanced work structure matching your collaboration preferences and workspace targets.'}</p>
      </div>
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 5 of 10</span>
    </div>
  </div>

  <!-- PAGE 6: COURSE 3 DETAILS -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">06. Tertiary Recommendation</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2mm;">
        <h2 class="section-title" style="margin-bottom: 0;">${top3[2].course.name}</h2>
        <span class="match-percentage">${Math.round(top3[2].score * 100)}% Match</span>
      </div>
      <div class="badge badge-highlight" style="display: inline-block; margin-bottom: 6mm; font-size: 11.5px; font-weight: 700; text-transform: uppercase;">
        Alternative Career Pathway
      </div>
      
      <div class="sub-section">
        <h3 class="sub-section-title">Why This Career Fits</h3>
        <p class="sub-section-body">${top3[2].explanation?.whyThisCourseFits || top3[2].course.reasoningTemplate}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Academic Strength Alignment</h3>
        <p class="sub-section-body">${top3[2].explanation?.strengthAnalysis || 'This alternate pathway makes leverage of your existing core subjects while branching into a fresh field of practice.'}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Interests & Hobbies Synergy</h3>
        <p class="sub-section-body">${top3[2].explanation?.interestAnalysis || 'Your hobbies indicate strong background skills that will make adapting to the specialized demands of this field much easier.'}</p>
      </div>

      <div class="sub-section">
        <h3 class="sub-section-title">Workplace Culture Fit</h3>
        <p class="sub-section-body">${top3[2].explanation?.careerFitAnalysis || 'An alternate layout format that aligns well with your flexibility needs and desk or field preferences.'}</p>
      </div>
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 6 of 10</span>
    </div>
  </div>

  <!-- PAGE 7: CAREER INSIGHTS -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">07. Long-Term Career Insights</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <h2 class="section-title">Industry Projections & Compensation</h2>
      <p class="section-desc">Comprehensive projections detailing current market demand indicators, salaries, and future growth trajectories.</p>
      
      <table style="border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1;">
        <thead>
          <tr>
            <th width="35%">Specialized Career</th>
            <th width="28%">Est. Salary Range (Global/INR)</th>
            <th width="20%">Growth Rate</th>
            <th width="17%">Demand Index</th>
          </tr>
        </thead>
        <tbody>
          ${top3
            .map(
              (item) => `
            <tr>
              <td><strong>${item.course.name}</strong></td>
              <td>${item.explanation?.careerOutlook?.salaryRange || '₹6L - ₹18L / $80K - $130K'}</td>
              <td>${item.explanation?.careerOutlook?.growthRate || '12% average'}</td>
              <td>
                <span class="badge" style="background-color: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-size: 10px; font-weight: 700;">
                  ${item.explanation?.careerOutlook?.demandLevel || 'High'}
                </span>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div style="margin-top: 8mm;">
        ${top3
          .map(
            (item, index) => `
          <div class="card card-dark" style="margin-bottom: 4mm;">
            <h4 style="font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 1mm;">
              ${index + 1}. Typical Roles & Career Tracks in ${item.course.name}
            </h4>
            <p style="font-size: 12.5px; color: #4f46e5; font-weight: 700; margin-bottom: 2mm;">
              ${item.explanation?.careerOutlook?.topRoles?.join(' • ') || 'Lead Strategist • Analyst • Consultant'}
            </p>
            <p style="font-size: 12px; color: #475569; line-height: 1.6;">
              ${item.explanation?.careerOutlook?.outlookDescription || 'Growth continues to be catalyzed by macro-economic changes, digital tooling adoption, and evolving consumer requirements.'}
            </p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 7 of 10</span>
    </div>
  </div>

  <!-- PAGE 8: COLLEGE SUGGESTIONS -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">08. Academic Institution Roadmap</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <h2 class="section-title">Top Suggested Colleges</h2>
      <p class="section-desc">Target premium institutions aligned to your selected programs, factoring in global ranks and exam parameters.</p>
      
      <table style="border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1;">
        <thead>
          <tr>
            <th width="32%">Institution Name</th>
            <th width="24%">Location</th>
            <th width="24%">Entrance Exams</th>
            <th width="20%">Fees (Annual)</th>
          </tr>
        </thead>
        <tbody>
          ${suggestedColleges
            .map(
              (col) => `
            <tr>
              <td>
                <strong>${col.name}</strong><br>
                <span style="font-size: 10px; color: #64748b;">Specialization: ${col.course_name}</span>
              </td>
              <td>${col.location}</td>
              <td><span class="badge" style="font-size: 10.5px; font-weight: 600;">${col.entrance_exams}</span></td>
              <td><strong>${col.fees_annual}</strong></td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="card" style="margin-top: 7mm;">
        <h3 class="card-title">Admission Prep Advice</h3>
        <ul style="list-style-type: none; font-size: 12.5px; color: #475569; line-height: 1.65;">
          <li style="margin-bottom: 2.5mm; display: flex; align-items: flex-start;">
            <span style="color: #6366f1; margin-right: 3mm; font-weight: 900; font-size: 14px;">✔</span>
            Initiate entrance exam preparation early (ideally 12-18 months prior to academic deadlines).
          </li>
          <li style="margin-bottom: 2.5mm; display: flex; align-items: flex-start;">
            <span style="color: #6366f1; margin-right: 3mm; font-weight: 900; font-size: 14px;">✔</span>
            Establish direct networks with alumni at these target universities to understand campus cultures.
          </li>
          <li style="display: flex; align-items: flex-start;">
            <span style="color: #6366f1; margin-right: 3mm; font-weight: 900; font-size: 14px;">✔</span>
            Monitor key administrative deadlines and cutoff parameters directly on the institutional portals.
          </li>
        </ul>
      </div>
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 8 of 10</span>
    </div>
  </div>

  <!-- PAGE 9: ACTION PLAN -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">09. Strategic Action Plan</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <h2 class="section-title">Execution Timelines & Roadmap</h2>
      <p class="section-desc">Your structured milestone checklist designed to bridge academic stages into industry success.</p>
      
      <div class="timeline">
        ${actionPlanPhases
          .map(
            (phase) => `
          <div class="timeline-node">
            <div class="timeline-marker"></div>
            <h3 class="timeline-header">${phase.phase}</h3>
            <ul class="timeline-bullets">
              ${phase.items
                .map(
                  (item) => `
                <li class="timeline-bullet">${item}</li>
              `
                )
                .join('')}
            </ul>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 9 of 10</span>
    </div>
  </div>

  <!-- PAGE 10: MENTOR CTA -->
  <div class="page">
    <div>
      <div class="page-header">
        <span class="header-tag">10. Personal Mentorship</span>
        <span class="header-logo">PathWayAI</span>
      </div>
      <h2 class="section-title">Assigned Career Advisor</h2>
      <p class="section-desc">Connect with a seasoned industry practitioner to review recommendations and outline college applications.</p>
      
      <div class="mentor-profile">
        <div class="mentor-details">
          <div class="mentor-header">
            <div class="mentor-fullname">${mentors[0].name}</div>
            <div class="mentor-designation">${mentors[0].role}</div>
            <div class="mentor-org">${mentors[0].company}</div>
          </div>
          <div class="mentor-metrics">
            <div class="mentor-metric">Industrial Experience: <strong>${mentors[0].experience}</strong></div>
            <div class="mentor-metric">Voucher Rating: <strong>${mentors[0].rating} ★</strong></div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 7mm;">
        <h3 class="card-title">Scope of your virtual consultation:</h3>
        <ul style="list-style-type: none; font-size: 13px; color: #475569; line-height: 1.65;">
          <li style="margin-bottom: 2.5mm; display: flex; align-items: flex-start;">
            <span style="color: #10b981; margin-right: 3mm; font-weight: 900; font-size: 14px;">✦</span>
            Conduct a deep review of your evaluated 10-page pathways document.
          </li>
          <li style="margin-bottom: 2.5mm; display: flex; align-items: flex-start;">
            <span style="color: #10b981; margin-right: 3mm; font-weight: 900; font-size: 14px;">✦</span>
            Streamline college selections, target cutoffs, and entrance exam tips.
          </li>
          <li style="margin-bottom: 2.5mm; display: flex; align-items: flex-start;">
            <span style="color: #10b981; margin-right: 3mm; font-weight: 900; font-size: 14px;">✦</span>
            Gain industrial context regarding day-to-day corporate expectations.
          </li>
          <li style="display: flex; align-items: flex-start;">
            <span style="color: #10b981; margin-right: 3mm; font-weight: 900; font-size: 14px;">✦</span>
            Identify certifications, project repositories, and portfolio shortcuts.
          </li>
        </ul>
      </div>

      <div class="callout-box">
        <h3 class="callout-title">Schedule Academic Consultation</h3>
        <p class="callout-description">Apply your premium pass token (included in this report package) to book a complimentary 1:1 counseling video session.</p>
        <a href="#" class="callout-action-btn">Book Live Session</a>
      </div>
    </div>
    <div class="page-footer">
      <span>Confidential Evaluation Report</span>
      <span>Page 10 of 10</span>
    </div>
  </div>

</body>
<script>
  window.onload = function() {
    window.print();
    setTimeout(function() {
      window.close();
    }, 500);
  };
</script>
</html>
`;

    // 1. Generate PDF
    const browser = await getBrowserInstance();

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' as any });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
      },
    });

    await browser.close();

    // 2. Store PDF
    const cleanUserId = userId || '00000000-0000-0000-0000-000000000000';
    const timestamp = Date.now();
    const filename = `report_${cleanUserId}_${timestamp}.pdf`;
    let fileLocation = '';
    let storageMode = 'LOCAL';

    // Try Supabase Storage first
    const supabase = getSupabaseClient();
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('career-reports')
        .upload(filename, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (!uploadError && uploadData) {
        fileLocation = uploadData.path;
        storageMode = 'SUPABASE';
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to local files:', err);
    }

    // Fallback to local files if Supabase upload didn't succeed
    if (!fileLocation) {
      const localDir = path.join(process.cwd(), 'public', 'reports');
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      const localFilePath = path.join(localDir, filename);
      fs.writeFileSync(localFilePath, pdfBuffer);
      fileLocation = `/reports/${filename}`;
    }

    // 3. Track in Database (report_downloads table)
    let reportId = '';
    try {
      const { data: dbData, error: dbError } = await supabase
        .from('report_downloads')
        .insert({
          user_id: cleanUserId,
          file_path: fileLocation,
          download_count: 0,
        })
        .select('id')
        .maybeSingle();

      if (dbData && !dbError) {
        reportId = dbData.id;
      }
    } catch (dbErr) {
      console.error('Database logging failed, mock ID fallback:', dbErr);
    }

    if (!reportId) {
      reportId = `mock-id-${timestamp}`;
    }

    // 4. Email report
    const targetEmail = email || profile.email || 'student@pathwayai.co';
    const emailResult = await sendReportEmail(
      targetEmail,
      Buffer.from(pdfBuffer),
      profile.name || 'Student'
    );

    // 5. Allow Download (Return the PDF buffer directly)
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Career_Pathway_Report.pdf"',
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    // Fallback: If Puppeteer/PDF generation fails (common on Vercel serverless environment),
    // return the HTML so the frontend can display/print it.
    return NextResponse.json(
      {
        error: 'Failed to generate PDF on server',
        details: error.message,
        fallbackHtml: typeof htmlContent !== 'undefined' ? htmlContent : null,
      },
      { status: 200 }
    );
  }
}
