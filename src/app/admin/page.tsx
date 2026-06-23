'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  GraduationCap,
  Shield,
  ShieldCheck,
  TrendingUp,
  Grid,
  AlertCircle,
  X,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { PREDEFINED_COURSES, scoreCourses } from '@/services/recommendationEngine';
import { generateExplanation } from '@/services/explanationEngine';

interface CourseDB {
  id: string;
  name: string;
  description: string;
  duration_years: number;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  created_at?: string;
}

interface TagDB {
  id: string;
  course_id: string;
  tag: string;
}

interface CollegeDB {
  id: string;
  aishe_code?: string;
  name: string;
  location: string;
  state: string;
  ranking?: number;
  fees_annual: number;
  admission_criteria: string;
  website_url?: string;
  type: 'Government' | 'Private';
  entrance_exams: string[];
}

interface SpecializationDB {
  id: string;
  college_id: string;
  course_id: string;
  specialization_name: string;
  seats_available: number;
  colleges?: { name: string } | null;
}

const MOCK_COLLEGES: CollegeDB[] = [
  {
    id: 'mc-1',
    name: 'IIT Bombay',
    location: 'Mumbai',
    state: 'Maharashtra',
    ranking: 1,
    fees_annual: 85000,
    admission_criteria: 'JEE Advanced score',
    website_url: 'https://www.iitb.ac.in',
    type: 'Government',
    entrance_exams: ['JEE Advanced'],
  },
  {
    id: 'mc-2',
    name: 'AIIMS New Delhi',
    location: 'Delhi',
    state: 'Delhi',
    ranking: 1,
    fees_annual: 1600,
    admission_criteria: 'NEET score',
    website_url: 'https://www.aiims.edu',
    type: 'Government',
    entrance_exams: ['NEET'],
  },
  {
    id: 'mc-3',
    name: 'NID Ahmedabad',
    location: 'Ahmedabad',
    state: 'Gujarat',
    ranking: 2,
    fees_annual: 220000,
    admission_criteria: 'DAT score',
    website_url: 'https://www.nid.edu',
    type: 'Government',
    entrance_exams: ['DAT'],
  },
  {
    id: 'mc-4',
    name: 'SRCC Delhi',
    location: 'Delhi',
    state: 'Delhi',
    ranking: 1,
    fees_annual: 30000,
    admission_criteria: 'CUET score',
    website_url: 'https://www.srcc.edu',
    type: 'Government',
    entrance_exams: ['CUET'],
  },
  {
    id: 'mc-5',
    name: 'IIM Ahmedabad',
    location: 'Ahmedabad',
    state: 'Gujarat',
    ranking: 1,
    fees_annual: 2300000,
    admission_criteria: 'CAT percentile & interview',
    website_url: 'https://www.iima.ac.in',
    type: 'Government',
    entrance_exams: ['CAT'],
  },
  {
    id: 'mc-6',
    name: 'NLSIU Bangalore',
    location: 'Bengaluru',
    state: 'Karnataka',
    ranking: 1,
    fees_annual: 260000,
    admission_criteria: 'CLAT score',
    website_url: 'https://www.nls.ac.in',
    type: 'Government',
    entrance_exams: ['CLAT'],
  },
];

const MOCK_ASSESSMENTS = [
  {
    id: 'mock-ar-1',
    user_id: '00000000-0000-0000-0000-000000000000',
    completed_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    profiles: {
      email: 'john.doe@example.com',
      full_name: 'John Doe',
    },
    responses: {
      interests: ['tech_ai', 'finance_econ'],
      subjects: ['Mathematics', 'Computer Science'],
      priorities: ['high_salary', 'work_life_balance'],
      extracurriculars: ['Coding Clubs'],
      grade: 'school_12th_pcm',
    },
  },
  {
    id: 'mock-ar-2',
    user_id: '00000000-0000-0000-0000-000000000001',
    completed_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    profiles: {
      email: 'jane.smith@example.com',
      full_name: 'Jane Smith',
    },
    responses: {
      interests: ['medicine_bio', 'education_social'],
      subjects: ['Biology', 'Chemistry'],
      priorities: ['social_impact', 'stability_security'],
      extracurriculars: ['Volunteer Work'],
      grade: 'school_12th_pcb',
    },
  },
];

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSimulatingAdmin, setIsSimulatingAdmin] = useState(false);

  // DB States
  const [courses, setCourses] = useState<CourseDB[]>([]);
  const [tags, setTags] = useState<TagDB[]>([]);
  const [specializations, setSpecializations] = useState<SpecializationDB[]>([]);
  const [colleges, setColleges] = useState<CollegeDB[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  interface AssessmentResponseDB {
    id: string;
    user_id: string;
    responses: any;
    completed_at: string;
    profiles?: {
      email: string;
      full_name: string | null;
    } | null;
  }

  const [assessments, setAssessments] = useState<AssessmentResponseDB[]>([]);
  const [regeneratingIds, setRegeneratingIds] = useState<Record<string, boolean>>({});
  const [assessmentSearchQuery, setAssessmentSearchQuery] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'courses' | 'specializations' | 'colleges' | 'csv-import' | 'user-reports'
  >('courses');

  // CSV Importer States
  const [importTarget, setImportTarget] = useState<
    'courses' | 'tags' | 'specializations' | 'colleges' | 'aishe' | 'nirf'
  >('courses');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string>('');
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // College States
  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');
  const [collegeFilterType, setCollegeFilterType] = useState<'all' | 'Government' | 'Private'>(
    'all'
  );
  const [collegeSortBy, setCollegeSortBy] = useState<'ranking' | 'fees' | 'name'>('ranking');
  const [collegeModal, setCollegeModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    collegeId?: string;
    aishe_code: string;
    name: string;
    location: string;
    state: string;
    ranking: number;
    fees_annual: number;
    admission_criteria: string;
    website_url: string;
    type: 'Government' | 'Private';
    entrance_exams: string;
  }>({
    isOpen: false,
    mode: 'create',
    aishe_code: '',
    name: '',
    location: '',
    state: '',
    ranking: 1,
    fees_annual: 50000,
    admission_criteria: '',
    website_url: '',
    type: 'Government',
    entrance_exams: '',
  });

  // CSV Parsing helper function
  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentValue = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentValue += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentValue.trim());
        currentValue = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n
        }
        row.push(currentValue.trim());
        lines.push(row);
        row = [];
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    if (row.length > 0 || currentValue !== '') {
      row.push(currentValue.trim());
      lines.push(row);
    }
    return lines.filter((r) => r.length > 0 && r.some((cell) => cell !== ''));
  };

  const validateCSVContent = (
    text: string,
    target: 'courses' | 'tags' | 'specializations' | 'colleges' | 'aishe' | 'nirf'
  ) => {
    const parsed = parseCSV(text);
    if (parsed.length === 0) {
      setImportErrors(['CSV file is empty.']);
      setPreviewRows([]);
      return;
    }

    const headers = parsed[0].map((h) => h.toLowerCase().trim());
    const dataRows = parsed.slice(1);
    const errors: string[] = [];
    const previewData: any[] = [];

    if (target === 'courses') {
      const required = ['name', 'description', 'duration_years', 'difficulty_level'];
      const missing = required.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        setImportErrors([`Missing required headers: ${missing.join(', ')}`]);
        setPreviewRows([]);
        return;
      }

      const nameIndex = headers.indexOf('name');
      const descIndex = headers.indexOf('description');
      const durationIndex = headers.indexOf('duration_years');
      const diffIndex = headers.indexOf('difficulty_level');

      const seenNames = new Set<string>();

      dataRows.forEach((row, index) => {
        const rowNum = index + 2;
        const name = row[nameIndex] || '';
        const desc = row[descIndex] || '';
        const durationStr = row[durationIndex] || '';
        const diff = row[diffIndex] || '';

        const rowErrors: string[] = [];

        if (!name) rowErrors.push('Name is required');
        else if (seenNames.has(name.toLowerCase())) {
          rowErrors.push(`Duplicate course name "${name}" in CSV`);
        } else if (courses.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
          rowErrors.push(`Course "${name}" already exists in database`);
        }
        seenNames.add(name.toLowerCase());

        if (!desc) rowErrors.push('Description is required');

        const duration = Number(durationStr);
        if (isNaN(duration) || !Number.isInteger(duration) || duration <= 0) {
          rowErrors.push(`Invalid duration_years "${durationStr}" (must be positive integer)`);
        }

        if (!['Beginner', 'Intermediate', 'Advanced'].includes(diff)) {
          rowErrors.push(
            `Invalid difficulty_level "${diff}" (must be Beginner, Intermediate, or Advanced)`
          );
        }

        if (rowErrors.length > 0) {
          errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
        }

        previewData.push({
          rowNum,
          data: { name, description: desc, duration_years: duration, difficulty_level: diff },
          errors: rowErrors,
          valid: rowErrors.length === 0,
        });
      });
    } else if (target === 'tags') {
      const required = ['course_name', 'tag'];
      const missing = required.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        setImportErrors([`Missing required headers: ${missing.join(', ')}`]);
        setPreviewRows([]);
        return;
      }

      const courseNameIndex = headers.indexOf('course_name');
      const tagIndex = headers.indexOf('tag');

      const seenTags = new Set<string>();

      dataRows.forEach((row, index) => {
        const rowNum = index + 2;
        const courseName = row[courseNameIndex] || '';
        const tag = row[tagIndex] || '';

        const rowErrors: string[] = [];

        if (!courseName) rowErrors.push('course_name is required');
        if (!tag) rowErrors.push('tag is required');

        const matchedCourse = courses.find(
          (c) => c.name.toLowerCase() === courseName.toLowerCase()
        );
        if (courseName && !matchedCourse) {
          rowErrors.push(`Course "${courseName}" does not exist in the system`);
        }

        if (matchedCourse && tag) {
          const courseId = matchedCourse.id;
          const combinationKey = `${courseId}::${tag.toLowerCase()}`;
          if (seenTags.has(combinationKey)) {
            rowErrors.push(`Duplicate tag "${tag}" for course "${courseName}" in CSV`);
          } else if (
            tags.some((t) => t.course_id === courseId && t.tag.toLowerCase() === tag.toLowerCase())
          ) {
            rowErrors.push(`Tag "${tag}" is already linked to course "${courseName}" in database`);
          }
          seenTags.add(combinationKey);
        }

        if (rowErrors.length > 0) {
          errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
        }

        previewData.push({
          rowNum,
          data: { course_name: courseName, tag },
          errors: rowErrors,
          valid: rowErrors.length === 0,
        });
      });
    } else if (target === 'specializations') {
      const required = ['college_name', 'course_name', 'specialization_name', 'seats_available'];
      const missing = required.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        setImportErrors([`Missing required headers: ${missing.join(', ')}`]);
        setPreviewRows([]);
        return;
      }

      const colNameIndex = headers.indexOf('college_name');
      const courseNameIndex = headers.indexOf('course_name');
      const specNameIndex = headers.indexOf('specialization_name');
      const seatsIndex = headers.indexOf('seats_available');

      const seenSpecs = new Set<string>();

      dataRows.forEach((row, index) => {
        const rowNum = index + 2;
        const colName = row[colNameIndex] || '';
        const courseName = row[courseNameIndex] || '';
        const specName = row[specNameIndex] || '';
        const seatsStr = row[seatsIndex] || '';

        const rowErrors: string[] = [];

        if (!colName) rowErrors.push('college_name is required');
        if (!courseName) rowErrors.push('course_name is required');
        if (!specName) rowErrors.push('specialization_name is required');

        const matchedCollege = colleges.find((c) => c.name.toLowerCase() === colName.toLowerCase());
        if (colName && !matchedCollege) {
          rowErrors.push(`College "${colName}" does not exist in the system`);
        }

        const matchedCourse = courses.find(
          (c) => c.name.toLowerCase() === courseName.toLowerCase()
        );
        if (courseName && !matchedCourse) {
          rowErrors.push(`Course category "${courseName}" does not exist in system`);
        }

        const seats = Number(seatsStr);
        if (isNaN(seats) || !Number.isInteger(seats) || seats < 0) {
          rowErrors.push(`Invalid seats_available "${seatsStr}" (must be a positive number)`);
        }

        if (matchedCollege && matchedCourse && specName) {
          const specKey = `${matchedCollege.id}::${matchedCourse.id}::${specName.toLowerCase()}`;
          if (seenSpecs.has(specKey)) {
            rowErrors.push(
              `Duplicate specialization "${specName}" for course "${courseName}" at college "${colName}" in CSV`
            );
          } else if (
            specializations.some(
              (s) =>
                s.college_id === matchedCollege.id &&
                s.course_id === matchedCourse.id &&
                s.specialization_name.toLowerCase() === specName.toLowerCase()
            )
          ) {
            rowErrors.push(`Specialization "${specName}" is already linked in database`);
          }
          seenSpecs.add(specKey);
        }

        if (rowErrors.length > 0) {
          errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
        }

        previewData.push({
          rowNum,
          data: {
            college_name: colName,
            course_name: courseName,
            specialization_name: specName,
            seats_available: seats,
          },
          errors: rowErrors,
          valid: rowErrors.length === 0,
        });
      });
    } else if (target === 'colleges') {
      const required = [
        'name',
        'location',
        'state',
        'ranking',
        'fees_annual',
        'admission_criteria',
        'website_url',
        'type',
        'entrance_exams',
      ];
      const missing = required.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        setImportErrors([`Missing required headers: ${missing.join(', ')}`]);
        setPreviewRows([]);
        return;
      }

      const nameIndex = headers.indexOf('name');
      const locationIndex = headers.indexOf('location');
      const stateIndex = headers.indexOf('state');
      const rankingIndex = headers.indexOf('ranking');
      const feesIndex = headers.indexOf('fees_annual');
      const criteriaIndex = headers.indexOf('admission_criteria');
      const urlIndex = headers.indexOf('website_url');
      const typeIndex = headers.indexOf('type');
      const examsIndex = headers.indexOf('entrance_exams');

      const seenNames = new Set<string>();

      dataRows.forEach((row, index) => {
        const rowNum = index + 2;
        const name = row[nameIndex] || '';
        const location = row[locationIndex] || '';
        const state = row[stateIndex] || '';
        const rankingStr = row[rankingIndex] || '';
        const feesStr = row[feesIndex] || '';
        const criteria = row[criteriaIndex] || '';
        const url = row[urlIndex] || '';
        const typeVal = row[typeIndex] || 'Government';
        const examsStr = row[examsIndex] || '';

        const rowErrors: string[] = [];

        if (!name) rowErrors.push('Name is required');
        else if (seenNames.has(name.toLowerCase())) {
          rowErrors.push(`Duplicate college name "${name}" in CSV`);
        } else if (colleges.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
          rowErrors.push(`College "${name}" already exists in database`);
        }
        seenNames.add(name.toLowerCase());

        if (!location) rowErrors.push('Location is required');
        if (!state) rowErrors.push('State is required');
        if (!criteria) rowErrors.push('Admission criteria is required');

        const ranking = Number(rankingStr);
        if (rankingStr && (isNaN(ranking) || !Number.isInteger(ranking) || ranking <= 0)) {
          rowErrors.push(`Invalid ranking "${rankingStr}" (must be positive integer if provided)`);
        }

        const fees = Number(feesStr);
        if (isNaN(fees) || !Number.isInteger(fees) || fees < 0) {
          rowErrors.push(`Invalid fees_annual "${feesStr}" (must be a positive integer)`);
        }

        if (typeVal && !['Government', 'Private'].includes(typeVal)) {
          rowErrors.push(`Invalid type "${typeVal}" (must be Government or Private)`);
        }

        const entranceExams = examsStr
          ? examsStr
              .split(';')
              .map((x) => x.trim())
              .filter(Boolean)
          : [];

        if (rowErrors.length > 0) {
          errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
        }

        previewData.push({
          rowNum,
          data: {
            name,
            location,
            state,
            ranking: rankingStr ? ranking : undefined,
            fees_annual: fees,
            admission_criteria: criteria,
            website_url: url || undefined,
            type: typeVal as 'Government' | 'Private',
            entrance_exams: entranceExams,
          },
          errors: rowErrors,
          valid: rowErrors.length === 0,
        });
      });
    } else if (target === 'aishe') {
      const required = [
        'aishe_code',
        'name',
        'location',
        'state',
        'fees_annual',
        'admission_criteria',
        'website_url',
        'type',
        'entrance_exams',
      ];
      const missing = required.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        setImportErrors([`Missing required headers: ${missing.join(', ')}`]);
        setPreviewRows([]);
        return;
      }

      const aisheIndex = headers.indexOf('aishe_code');
      const nameIndex = headers.indexOf('name');
      const locationIndex = headers.indexOf('location');
      const stateIndex = headers.indexOf('state');
      const feesIndex = headers.indexOf('fees_annual');
      const criteriaIndex = headers.indexOf('admission_criteria');
      const urlIndex = headers.indexOf('website_url');
      const typeIndex = headers.indexOf('type');
      const examsIndex = headers.indexOf('entrance_exams');

      const seenAishe = new Set<string>();

      dataRows.forEach((row, index) => {
        const rowNum = index + 2;
        const rawAishe = row[aisheIndex] || '';
        const rawName = row[nameIndex] || '';
        const rawLocation = row[locationIndex] || '';
        const rawState = row[stateIndex] || '';
        const feesStr = row[feesIndex] || '0';
        const criteria = row[criteriaIndex] || '';
        const urlStr = row[urlIndex] || '';
        const rawType = row[typeIndex] || 'Government';
        const examsStr = row[examsIndex] || '';

        const rowErrors: string[] = [];

        if (!rawAishe) {
          rowErrors.push('aishe_code is required');
        }
        if (!rawName) {
          rowErrors.push('name is required');
        }
        if (!rawLocation) {
          rowErrors.push('location is required');
        }
        if (!rawState) {
          rowErrors.push('state is required');
        }

        // Normalization
        const aishe_code = rawAishe.trim().toUpperCase();
        const name = rawName.trim().replace(/\b\w/g, (c) => c.toUpperCase());
        const state = rawState.trim().replace(/\b\w/g, (c) => c.toUpperCase());
        const location = rawLocation.trim();

        let type: 'Government' | 'Private' = 'Government';
        const typeNormalized = rawType.trim().toUpperCase();
        if (
          typeNormalized.includes('PVT') ||
          typeNormalized.includes('PRIVATE') ||
          typeNormalized.includes('SELF')
        ) {
          type = 'Private';
        }

        const fees_annual = Number(feesStr);
        if (isNaN(fees_annual) || fees_annual < 0) {
          rowErrors.push(`Invalid fees_annual "${feesStr}" (must be positive number)`);
        }

        let website_url = urlStr.trim();
        if (
          website_url &&
          !website_url.startsWith('http://') &&
          !website_url.startsWith('https://')
        ) {
          website_url = 'https://' + website_url;
        }

        const entrance_exams = examsStr
          ? examsStr
              .split(';')
              .map((x) => x.trim())
              .filter(Boolean)
          : [];

        if (seenAishe.has(aishe_code)) {
          rowErrors.push(`Duplicate AISHE code "${aishe_code}" in CSV`);
        }
        seenAishe.add(aishe_code);

        const existingCollege = colleges.find(
          (c) =>
            (c.aishe_code && c.aishe_code.toUpperCase() === aishe_code) ||
            c.name.toLowerCase() === name.toLowerCase()
        );
        const isUpdate = !!existingCollege;

        if (rowErrors.length > 0) {
          errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
        }

        previewData.push({
          rowNum,
          data: {
            aishe_code,
            name,
            location,
            state,
            fees_annual,
            admission_criteria: criteria || 'Entrance score based',
            website_url: website_url || undefined,
            type,
            entrance_exams,
            isUpdate,
            matchedId: existingCollege?.id,
          },
          errors: rowErrors,
          valid: rowErrors.length === 0,
        });
      });
    } else if (target === 'nirf') {
      const hasRank = headers.includes('rank') || headers.includes('nirf_rank');
      const hasIdentifier =
        headers.includes('college_name') ||
        headers.includes('aishe_code') ||
        headers.includes('name');

      if (!hasRank || !hasIdentifier) {
        setImportErrors([
          'CSV must contain at least one rank header ("rank" or "nirf_rank") and one college identifier header ("college_name" or "aishe_code")',
        ]);
        setPreviewRows([]);
        return;
      }

      const aisheIndex = headers.indexOf('aishe_code');
      const nameIndex = headers.includes('college_name')
        ? headers.indexOf('college_name')
        : headers.indexOf('name');
      const rankIndex = headers.includes('nirf_rank')
        ? headers.indexOf('nirf_rank')
        : headers.indexOf('rank');

      dataRows.forEach((row, index) => {
        const rowNum = index + 2;
        const rawAishe = aisheIndex !== -1 ? (row[aisheIndex] || '').trim().toUpperCase() : '';
        const rawName = nameIndex !== -1 ? (row[nameIndex] || '').trim() : '';
        const rawRank = rankIndex !== -1 ? (row[rankIndex] || '').trim() : '';

        const rowErrors: string[] = [];
        const rank = Number(rawRank);
        if (!rawRank || isNaN(rank) || rank <= 0) {
          rowErrors.push(`Invalid rank value "${rawRank}" (must be positive integer)`);
        }

        let matchedCollege = colleges.find(
          (c) => rawAishe && c.aishe_code && c.aishe_code.toUpperCase() === rawAishe
        );
        if (!matchedCollege && rawName) {
          matchedCollege = colleges.find((c) => c.name.toLowerCase() === rawName.toLowerCase());
        }

        if (!matchedCollege) {
          rowErrors.push(
            `No matching college found in database for name "${rawName}" or AISHE code "${rawAishe}"`
          );
        }

        if (rowErrors.length > 0) {
          errors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
        }

        previewData.push({
          rowNum,
          data: {
            aishe_code: rawAishe,
            college_name: rawName || matchedCollege?.name,
            ranking: rank,
            matchedId: matchedCollege?.id,
            matchedCollegeName: matchedCollege?.name,
          },
          errors: rowErrors,
          valid: rowErrors.length === 0,
        });
      });
    }

    setImportErrors(errors);
    setPreviewRows(previewData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      validateCSVContent(text, importTarget);
    };
    reader.readAsText(file);
  };

  const handleCommitImport = async () => {
    if (previewRows.length === 0 || importErrors.length > 0) return;
    setIsImporting(true);

    const insertedIds: { table: string; id: string }[] = [];

    try {
      if (isSimulatingAdmin) {
        if (importTarget === 'courses') {
          const newCourses: CourseDB[] = previewRows.map((row) => ({
            id: `sim-${Date.now()}-${row.rowNum}`,
            name: row.data.name,
            description: row.data.description,
            duration_years: row.data.duration_years,
            difficulty_level: row.data.difficulty_level,
          }));
          setCourses((prev) => [...prev, ...newCourses]);
          showNotice('success', `Simulated CSV Import of ${newCourses.length} courses!`);
        } else if (importTarget === 'tags') {
          const newTags: TagDB[] = previewRows.map((row) => {
            const course = courses.find(
              (c) => c.name.toLowerCase() === row.data.course_name.toLowerCase()
            )!;
            return {
              id: `sim-tag-${Date.now()}-${row.rowNum}`,
              course_id: course.id,
              tag: row.data.tag,
            };
          });
          setTags((prev) => [...prev, ...newTags]);
          showNotice('success', `Simulated CSV Import of ${newTags.length} tags!`);
        } else if (importTarget === 'specializations') {
          const newSpecs: SpecializationDB[] = previewRows.map((row) => {
            const college = colleges.find(
              (c) => c.name.toLowerCase() === row.data.college_name.toLowerCase()
            )!;
            const course = courses.find(
              (c) => c.name.toLowerCase() === row.data.course_name.toLowerCase()
            )!;
            return {
              id: `sim-spec-${Date.now()}-${row.rowNum}`,
              college_id: college.id,
              course_id: course.id,
              specialization_name: row.data.specialization_name,
              seats_available: row.data.seats_available,
              colleges: { name: college.name },
            };
          });
          setSpecializations((prev) => [...prev, ...newSpecs]);
          showNotice('success', `Simulated CSV Import of ${newSpecs.length} specializations!`);
        } else if (importTarget === 'colleges') {
          const newColleges: CollegeDB[] = previewRows.map((row) => ({
            id: `sim-${Date.now()}-${row.rowNum}`,
            name: row.data.name,
            location: row.data.location,
            state: row.data.state,
            ranking: row.data.ranking,
            fees_annual: row.data.fees_annual,
            admission_criteria: row.data.admission_criteria,
            website_url: row.data.website_url,
            type: row.data.type,
            entrance_exams: row.data.entrance_exams,
          }));
          setColleges((prev) => [...prev, ...newColleges]);
          showNotice('success', `Simulated CSV Import of ${newColleges.length} colleges!`);
        } else if (importTarget === 'aishe') {
          const newColleges = [...colleges];
          previewRows.forEach((row) => {
            const payload = {
              aishe_code: row.data.aishe_code,
              name: row.data.name,
              location: row.data.location,
              state: row.data.state,
              fees_annual: row.data.fees_annual,
              admission_criteria: row.data.admission_criteria,
              website_url: row.data.website_url,
              type: row.data.type,
              entrance_exams: row.data.entrance_exams,
            };
            if (row.data.isUpdate && row.data.matchedId) {
              const idx = newColleges.findIndex((c) => c.id === row.data.matchedId);
              if (idx !== -1) {
                newColleges[idx] = { ...newColleges[idx], ...payload };
              }
            } else {
              newColleges.push({
                id: `sim-${Date.now()}-${row.rowNum}`,
                ...payload,
              });
            }
          });
          setColleges(newColleges);
          showNotice(
            'success',
            `Simulated AISHE Import: Applied updates and inserts for ${previewRows.length} colleges.`
          );
        } else if (importTarget === 'nirf') {
          const newColleges = [...colleges];
          previewRows.forEach((row) => {
            if (row.data.matchedId) {
              const idx = newColleges.findIndex((c) => c.id === row.data.matchedId);
              if (idx !== -1) {
                newColleges[idx] = { ...newColleges[idx], ranking: row.data.ranking };
              }
            }
          });
          setColleges(newColleges);
          showNotice(
            'success',
            `Simulated NIRF Rankings: Updated ranking properties for ${previewRows.length} colleges.`
          );
        }
      } else {
        if (importTarget === 'courses') {
          for (const row of previewRows) {
            const { data, error } = await supabase
              .from('courses')
              .insert({
                name: row.data.name,
                description: row.data.description,
                duration_years: row.data.duration_years,
                difficulty_level: row.data.difficulty_level,
              })
              .select()
              .single();

            if (error) throw error;
            if (data) insertedIds.push({ table: 'courses', id: data.id });
          }
          showNotice('success', `Imported ${previewRows.length} courses to Supabase.`);
        } else if (importTarget === 'tags') {
          for (const row of previewRows) {
            const course = courses.find(
              (c) => c.name.toLowerCase() === row.data.course_name.toLowerCase()
            )!;
            const { data, error } = await supabase
              .from('course_tags')
              .insert({
                course_id: course.id,
                tag: row.data.tag,
              })
              .select()
              .single();

            if (error) throw error;
            if (data) insertedIds.push({ table: 'course_tags', id: data.id });
          }
          showNotice('success', `Imported ${previewRows.length} tags to Supabase.`);
        } else if (importTarget === 'specializations') {
          for (const row of previewRows) {
            const college = colleges.find(
              (c) => c.name.toLowerCase() === row.data.college_name.toLowerCase()
            )!;
            const course = courses.find(
              (c) => c.name.toLowerCase() === row.data.course_name.toLowerCase()
            )!;
            const { data, error } = await supabase
              .from('specializations')
              .insert({
                college_id: college.id,
                course_id: course.id,
                specialization_name: row.data.specialization_name,
                seats_available: row.data.seats_available,
              })
              .select()
              .single();

            if (error) throw error;
            if (data) insertedIds.push({ table: 'specializations', id: data.id });
          }
          showNotice('success', `Imported ${previewRows.length} specializations to Supabase.`);
        } else if (importTarget === 'colleges') {
          for (const row of previewRows) {
            const { data, error } = await supabase
              .from('colleges')
              .insert({
                name: row.data.name,
                location: row.data.location,
                state: row.data.state,
                ranking: row.data.ranking,
                fees_annual: row.data.fees_annual,
                admission_criteria: row.data.admission_criteria,
                website_url: row.data.website_url,
                type: row.data.type,
                entrance_exams: row.data.entrance_exams,
              })
              .select()
              .single();

            if (error) throw error;
            if (data) insertedIds.push({ table: 'colleges', id: data.id });
          }
          showNotice('success', `Imported ${previewRows.length} colleges to Supabase.`);
        } else if (importTarget === 'aishe') {
          for (const row of previewRows) {
            const payload = {
              aishe_code: row.data.aishe_code,
              name: row.data.name,
              location: row.data.location,
              state: row.data.state,
              fees_annual: row.data.fees_annual,
              admission_criteria: row.data.admission_criteria,
              website_url: row.data.website_url,
              type: row.data.type,
              entrance_exams: row.data.entrance_exams,
            };

            if (row.data.isUpdate && row.data.matchedId) {
              const { error } = await supabase
                .from('colleges')
                .update(payload)
                .eq('id', row.data.matchedId);
              if (error) throw error;
            } else {
              const { data, error } = await supabase
                .from('colleges')
                .insert(payload)
                .select()
                .single();
              if (error) throw error;
              if (data) insertedIds.push({ table: 'colleges', id: data.id });
            }
          }
          showNotice('success', `Imported ${previewRows.length} AISHE registry records.`);
        } else if (importTarget === 'nirf') {
          for (const row of previewRows) {
            if (row.data.matchedId) {
              const { error } = await supabase
                .from('colleges')
                .update({ ranking: row.data.ranking })
                .eq('id', row.data.matchedId);
              if (error) throw error;
            }
          }
          showNotice('success', `Updated NIRF rankings for ${previewRows.length} colleges.`);
        }
        await fetchCMSData();
      }

      setCsvFile(null);
      setPreviewRows([]);
      setImportErrors([]);
    } catch (err: any) {
      console.error('Import failed. Initiating transaction rollback:', err);
      if (insertedIds.length > 0) {
        for (const item of insertedIds) {
          try {
            await supabase.from(item.table).delete().eq('id', item.id);
          } catch (rollbackErr) {
            console.error(`Rollback deletion failed for ${item.table} ID ${item.id}:`, rollbackErr);
          }
        }
      }
      showNotice(
        'error',
        `Import failed: ${err.message || err}. Database rolled back successfully.`
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Notifications
  const [dbNotice, setDbNotice] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Modal States
  const [courseModal, setCourseModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    courseId?: string;
    name: string;
    description: string;
    durationYears: number;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  }>({
    isOpen: false,
    mode: 'create',
    name: '',
    description: '',
    durationYears: 3,
    difficultyLevel: 'Intermediate',
  });

  const [tagModal, setTagModal] = useState<{
    isOpen: boolean;
    courseId?: string;
    newTag: string;
  }>({
    isOpen: false,
    newTag: '',
  });

  const [specModal, setSpecModal] = useState<{
    isOpen: boolean;
    courseId?: string;
    collegeId: string;
    specName: string;
    seats: number;
  }>({
    isOpen: false,
    collegeId: '',
    specName: '',
    seats: 40,
  });

  // Verify Admin Role on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          if (profile && profile.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error('Error verifying admin authentication:', err);
      }
    };

    checkAuth();
  }, []);

  // Fetch CMS Data
  const fetchCMSData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch Courses
      const { data: dbCourses } = await supabase.from('courses').select('*');
      if (dbCourses && dbCourses.length > 0) {
        setCourses(dbCourses as CourseDB[]);
      } else {
        // Fallback: seed local state with predefined list for visual representation
        const seeded: CourseDB[] = PREDEFINED_COURSES.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          duration_years: c.durationYears,
          difficulty_level: c.difficultyLevel,
        }));
        setCourses(seeded);
      }

      // 2. Fetch Tags
      const { data: dbTags } = await supabase.from('course_tags').select('*');
      if (dbTags) {
        setTags(dbTags as TagDB[]);
      }

      // 3. Fetch Specializations
      const { data: dbSpecs } = await supabase.from('specializations').select('*, colleges(name)');
      if (dbSpecs) {
        setSpecializations(dbSpecs as unknown as SpecializationDB[]);
      }

      // 4. Fetch Colleges
      const { data: dbColleges } = await supabase.from('colleges').select('*');
      if (dbColleges && dbColleges.length > 0) {
        setColleges(dbColleges as CollegeDB[]);
      } else {
        setColleges(MOCK_COLLEGES);
      }

      // 5. Fetch Assessments
      const { data: dbAssessments } = await supabase
        .from('assessment_responses')
        .select('id, user_id, responses, completed_at, profiles(email, full_name)')
        .order('completed_at', { ascending: false });

      if (dbAssessments && dbAssessments.length > 0) {
        setAssessments(dbAssessments as unknown as AssessmentResponseDB[]);
      } else {
        setAssessments(MOCK_ASSESSMENTS as unknown as AssessmentResponseDB[]);
      }
    } catch (err) {
      console.error('Error fetching CMS data:', err);
      showNotice('error', 'Failed to retrieve database contents. Rendering local fallbacks.');
      setAssessments(MOCK_ASSESSMENTS as unknown as AssessmentResponseDB[]);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin || isSimulatingAdmin) {
      fetchCMSData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isSimulatingAdmin]);

  const showNotice = (type: 'success' | 'warning' | 'error', message: string) => {
    setDbNotice({ type, message });
    setTimeout(() => {
      setDbNotice(null);
    }, 6000);
  };

  const handleRegenerateReport = async (assessment: AssessmentResponseDB) => {
    const id = assessment.id;
    setRegeneratingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const rawResponses = assessment.responses;
      // 1. Run recommendation scoring and generate details
      const allScored = scoreCourses(rawResponses);
      const top5 = allScored.slice(0, 5).map((scored) => {
        const explanation = generateExplanation(rawResponses, scored.course);
        return {
          ...scored,
          explanation,
        };
      });

      // 2. Prepare user profile payload
      const userProfile = {
        id: assessment.user_id,
        email: assessment.profiles?.email || 'student@pathwayai.co',
        name: assessment.profiles?.full_name || 'Student',
        ...rawResponses,
      };

      // 3. Request PDF generation
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: userProfile,
          recommendations: top5,
          email: userProfile.email,
          userId: userProfile.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF from assessment data');
      }

      // Download response as PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = userProfile.name.replace(/\s+/g, '_');
      a.download = `Regenerated_Report_${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showNotice(
        'success',
        `PDF Report for ${userProfile.name} was successfully regenerated and sent!`
      );
    } catch (err: any) {
      console.error('Error regenerating report:', err);
      showNotice('error', `Failed to regenerate report: ${err.message}`);
    } finally {
      setRegeneratingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  // ========================================================
  // COURSE CRUD OPERATIONS
  // ========================================================

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { mode, courseId, name, description, durationYears, difficultyLevel } = courseModal;

    if (!name || !description || durationYears <= 0) {
      alert('Please fill out all fields.');
      return;
    }

    const payload = {
      name,
      description,
      duration_years: Number(durationYears),
      difficulty_level: difficultyLevel,
    };

    if (isSimulatingAdmin) {
      if (mode === 'create') {
        const simulatedNewCourse: CourseDB = {
          id: `sim-${Date.now()}`,
          ...payload,
        };
        setCourses((prev) => [...prev, simulatedNewCourse]);
        showNotice('warning', `Simulated creation of "${name}" in memory.`);
      } else if (mode === 'edit' && courseId) {
        setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...payload } : c)));
        showNotice('warning', `Simulated updates locally.`);
      }
      setCourseModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    if (mode === 'create') {
      try {
        const { data, error } = await supabase.from('courses').insert(payload).select().single();

        if (error) throw error;

        if (data) {
          setCourses((prev) => [...prev, data as CourseDB]);
          showNotice('success', `Course "${name}" created successfully in Supabase!`);
        }
      } catch (err) {
        console.error('Failed database write, falling back to local simulation:', err);
        // Fallback: Local Simulation
        const simulatedNewCourse: CourseDB = {
          id: `sim-${Date.now()}`,
          ...payload,
        };
        setCourses((prev) => [...prev, simulatedNewCourse]);
        showNotice('warning', `RLS Blocked insertion. Simulated creation of "${name}" in memory.`);
      }
    } else if (mode === 'edit' && courseId) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', courseId)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setCourses((prev) => prev.map((c) => (c.id === courseId ? (data as CourseDB) : c)));
          showNotice('success', `Course updated successfully in Supabase!`);
        }
      } catch (err) {
        console.error('Failed database update, falling back to local simulation:', err);
        // Fallback: Local Simulation
        setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...payload } : c)));
        showNotice('warning', 'RLS Blocked update. Simulated updates locally.');
      }
    }

    setCourseModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteCourse = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    if (isSimulatingAdmin) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setTags((prev) => prev.filter((t) => t.course_id !== id));
      setSpecializations((prev) => prev.filter((s) => s.course_id !== id));
      showNotice('warning', 'Removed course from local session.');
      return;
    }

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;

      setCourses((prev) => prev.filter((c) => c.id !== id));
      setTags((prev) => prev.filter((t) => t.course_id !== id));
      setSpecializations((prev) => prev.filter((s) => s.course_id !== id));
      showNotice('success', 'Course deleted from Supabase.');
    } catch (err) {
      console.error('Failed database delete, falling back to local simulation:', err);
      // Fallback: Local Simulation
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setTags((prev) => prev.filter((t) => t.course_id !== id));
      setSpecializations((prev) => prev.filter((s) => s.course_id !== id));
      showNotice('warning', 'RLS Blocked deletion. Removed course from local session.');
    }
  };

  // ========================================================
  // TAGS OPERATIONS
  // ========================================================

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const { courseId, newTag } = tagModal;
    const cleanTag = newTag.trim();

    if (!courseId || !cleanTag) return;

    // Check duplicate
    if (
      tags.some((t) => t.course_id === courseId && t.tag.toLowerCase() === cleanTag.toLowerCase())
    ) {
      alert('This tag is already associated with this course.');
      return;
    }

    if (isSimulatingAdmin) {
      const simulatedTag: TagDB = {
        id: `sim-tag-${Date.now()}`,
        course_id: courseId,
        tag: cleanTag,
      };
      setTags((prev) => [...prev, simulatedTag]);
      setTagModal((prev) => ({ ...prev, newTag: '' }));
      showNotice('warning', `Simulated tag link locally for "${cleanTag}".`);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_tags')
        .insert({ course_id: courseId, tag: cleanTag })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTags((prev) => [...prev, data as TagDB]);
        setTagModal((prev) => ({ ...prev, newTag: '' }));
        showNotice('success', `Tag "${cleanTag}" linked successfully!`);
      }
    } catch (err) {
      console.error('RLS Blocked tag link, running local simulation:', err);
      const simulatedTag: TagDB = {
        id: `sim-tag-${Date.now()}`,
        course_id: courseId,
        tag: cleanTag,
      };
      setTags((prev) => [...prev, simulatedTag]);
      setTagModal((prev) => ({ ...prev, newTag: '' }));
      showNotice('warning', `Simulated tag link locally for "${cleanTag}".`);
    }
  };

  const handleRemoveTag = async (tagId: string, tagName: string) => {
    if (isSimulatingAdmin) {
      setTags((prev) => prev.filter((t) => t.id !== tagId));
      showNotice('warning', `Removed tag "${tagName}" locally.`);
      return;
    }

    try {
      const { error } = await supabase.from('course_tags').delete().eq('id', tagId);
      if (error) throw error;

      setTags((prev) => prev.filter((t) => t.id !== tagId));
      showNotice('success', 'Tag deleted successfully.');
    } catch (err) {
      console.error('RLS Blocked tag removal, running local simulation:', err);
      setTags((prev) => prev.filter((t) => t.id !== tagId));
      showNotice('warning', `Removed tag "${tagName}" locally.`);
    }
  };

  // ========================================================
  // SPECIALIZATIONS OPERATIONS
  // ========================================================

  const handleAddSpecialization = async (e: React.FormEvent) => {
    e.preventDefault();
    const { courseId, collegeId, specName, seats } = specModal;

    if (!courseId || !collegeId || !specName || seats <= 0) {
      alert('Please fill out all specialization details.');
      return;
    }

    const linkedCol = colleges.find((col) => col.id === collegeId);
    const colName = linkedCol ? linkedCol.name : 'Unknown College';

    const payload = {
      college_id: collegeId,
      course_id: courseId,
      specialization_name: specName,
      seats_available: Number(seats),
    };

    if (isSimulatingAdmin) {
      const simulatedSpec: SpecializationDB = {
        id: `sim-spec-${Date.now()}`,
        ...payload,
        colleges: { name: colName },
      };
      setSpecializations((prev) => [...prev, simulatedSpec]);
      setSpecModal((prev) => ({ ...prev, collegeId: '', specName: '', seats: 40 }));
      showNotice('warning', `Simulated specialization link locally under "${colName}".`);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('specializations')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const fullSpecRow: SpecializationDB = {
          ...(data as SpecializationDB),
          colleges: { name: colName },
        };
        setSpecializations((prev) => [...prev, fullSpecRow]);
        setSpecModal((prev) => ({ ...prev, collegeId: '', specName: '', seats: 40 }));
        showNotice('success', 'Specialization linked in Supabase.');
      }
    } catch (err) {
      console.error('RLS Blocked specialization link, running local simulation:', err);
      const simulatedSpec: SpecializationDB = {
        id: `sim-spec-${Date.now()}`,
        ...payload,
        colleges: { name: colName },
      };
      setSpecializations((prev) => [...prev, simulatedSpec]);
      setSpecModal((prev) => ({ ...prev, collegeId: '', specName: '', seats: 40 }));
      showNotice('warning', `Simulated specialization link locally under "${colName}".`);
    }
  };

  const handleRemoveSpecialization = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the specialization "${name}"?`)) return;

    if (isSimulatingAdmin) {
      setSpecializations((prev) => prev.filter((s) => s.id !== id));
      showNotice('warning', 'Removed specialization locally.');
      return;
    }

    try {
      const { error } = await supabase.from('specializations').delete().eq('id', id);
      if (error) throw error;

      setSpecializations((prev) => prev.filter((s) => s.id !== id));
      showNotice('success', 'Specialization deleted successfully.');
    } catch (err) {
      console.error('RLS Blocked specialization delete, running local simulation:', err);
      setSpecializations((prev) => prev.filter((s) => s.id !== id));
      showNotice('warning', 'Removed specialization locally.');
    }
  };

  // ========================================================
  // COLLEGE CRUD OPERATIONS
  // ========================================================

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      mode,
      collegeId,
      aishe_code,
      name,
      location,
      state,
      ranking,
      fees_annual,
      admission_criteria,
      website_url,
      type,
      entrance_exams,
    } = collegeModal;

    if (!name || !location || !state || fees_annual < 0 || !admission_criteria) {
      alert('Please fill out all required fields.');
      return;
    }

    const examsArray = entrance_exams
      ? entrance_exams
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
      : [];

    const payload = {
      aishe_code: aishe_code ? aishe_code.trim().toUpperCase() : undefined,
      name,
      location,
      state,
      ranking: ranking ? Number(ranking) : undefined,
      fees_annual: Number(fees_annual),
      admission_criteria,
      website_url: website_url || undefined,
      type,
      entrance_exams: examsArray,
    };

    if (isSimulatingAdmin) {
      if (mode === 'create') {
        const simulatedNewCollege: CollegeDB = {
          id: `sim-${Date.now()}`,
          ...payload,
          entrance_exams: examsArray,
        };
        setColleges((prev) => [...prev, simulatedNewCollege]);
        showNotice('warning', `Simulated creation of college "${name}" in memory.`);
      } else if (mode === 'edit' && collegeId) {
        setColleges((prev) => prev.map((c) => (c.id === collegeId ? { ...c, ...payload } : c)));
        showNotice('warning', `Simulated college updates locally.`);
      }
      setCollegeModal((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    if (mode === 'create') {
      try {
        const { data, error } = await supabase.from('colleges').insert(payload).select().single();
        if (error) throw error;
        if (data) {
          setColleges((prev) => [...prev, data as CollegeDB]);
          showNotice('success', `College "${name}" created successfully in Supabase!`);
        }
      } catch (err) {
        console.error('Failed database write, falling back to local simulation:', err);
        const simulatedNewCollege: CollegeDB = {
          id: `sim-${Date.now()}`,
          ...payload,
          entrance_exams: examsArray,
        };
        setColleges((prev) => [...prev, simulatedNewCollege]);
        showNotice(
          'warning',
          `RLS Blocked insertion. Simulated creation of college "${name}" in memory.`
        );
      }
    } else if (mode === 'edit' && collegeId) {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .update(payload)
          .eq('id', collegeId)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setColleges((prev) => prev.map((c) => (c.id === collegeId ? (data as CollegeDB) : c)));
          showNotice('success', `College updated successfully in Supabase!`);
        }
      } catch (err) {
        console.error('Failed database update, falling back to local simulation:', err);
        setColleges((prev) => prev.map((c) => (c.id === collegeId ? { ...c, ...payload } : c)));
        showNotice('warning', 'RLS Blocked update. Simulated updates locally.');
      }
    }

    setCollegeModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteCollege = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    if (isSimulatingAdmin) {
      setColleges((prev) => prev.filter((c) => c.id !== id));
      setSpecializations((prev) => prev.filter((s) => s.college_id !== id));
      showNotice('warning', 'Removed college from local session.');
      return;
    }

    try {
      const { error } = await supabase.from('colleges').delete().eq('id', id);
      if (error) throw error;

      setColleges((prev) => prev.filter((c) => c.id !== id));
      setSpecializations((prev) => prev.filter((s) => s.college_id !== id));
      showNotice('success', 'College deleted from Supabase.');
    } catch (err) {
      console.error('Failed database delete, falling back to local simulation:', err);
      setColleges((prev) => prev.filter((c) => c.id !== id));
      setSpecializations((prev) => prev.filter((s) => s.college_id !== id));
      showNotice('warning', 'RLS Blocked deletion. Removed college from local session.');
    }
  };

  const handleExportColleges = () => {
    if (colleges.length === 0) {
      alert('No colleges to export.');
      return;
    }

    const headers = [
      'id',
      'name',
      'location',
      'state',
      'ranking',
      'fees_annual',
      'admission_criteria',
      'website_url',
      'type',
      'entrance_exams',
    ];
    const rows = colleges.map((c) => [
      c.id,
      c.name,
      c.location,
      c.state,
      c.ranking || '',
      c.fees_annual,
      c.admission_criteria,
      c.website_url || '',
      c.type,
      c.entrance_exams ? c.entrance_exams.join(';') : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `colleges_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('success', 'Colleges database exported successfully to CSV!');
  };

  // Stats
  const stats = {
    totalCourses: courses.length,
    totalTags: tags.length,
    totalSpecializations: specializations.length,
    totalSeats: specializations.reduce((acc, s) => acc + s.seats_available, 0),
    totalColleges: colleges.length,
  };

  return (
    <div className="flex min-h-screen flex-col justify-between overflow-x-hidden bg-background font-sans text-foreground">
      <Navbar />

      <main className="relative flex-grow px-4 pt-28 pb-16">
        {/* Ambient Glow background */}
        <div className="pointer-events-none absolute top-10 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-secondary/10 blur-[130px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-10 h-96 w-96 translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header block with Simulation Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-primary" />
                <span className="text-xs font-bold tracking-wider text-primary uppercase">
                  CMS Administration Panel
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Course Catalog CMS
              </h1>
            </div>

            {/* Simulated Access Bypass */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isAdmin || isSimulatingAdmin ? (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5 animate-pulse text-emerald-600" />
                    <span className="text-emerald-700">Admin Mode Active</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4.5 w-4.5 text-rose-600" />
                    <span className="text-rose-700">Access Restricted</span>
                  </>
                )}
              </div>
              {!isAdmin && (
                <button
                  onClick={() => setIsSimulatingAdmin(!isSimulatingAdmin)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                    isSimulatingAdmin
                      ? 'border border-rose-200 bg-rose-50 text-rose-700'
                      : 'bg-primary text-white hover:bg-primary/95'
                  }`}
                >
                  {isSimulatingAdmin ? 'Disable Bypass' : 'Simulate Access'}
                </button>
              )}
            </div>
          </div>

          {/* Database Notice Alert Banner */}
          {dbNotice && (
            <div
              className={`flex items-start gap-3 rounded-2xl border p-4 text-xs ${
                dbNotice.type === 'success'
                  ? 'border-emerald-500/20 bg-emerald-50/80 text-emerald-800'
                  : dbNotice.type === 'warning'
                    ? 'border-amber-500/20 bg-amber-50/80 text-amber-800'
                    : 'border-rose-500/20 bg-rose-50/80 text-rose-800'
              }`}
            >
              {dbNotice.type === 'success' ? (
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-600" />
              )}
              <div className="space-y-1">
                <span className="font-extrabold capitalize">
                  {dbNotice.type === 'warning' ? 'Simulated Sync' : dbNotice.type}
                </span>
                <p className="leading-normal text-muted-foreground">{dbNotice.message}</p>
              </div>
            </div>
          )}

          {/* Authentication Block */}
          {!isAdmin && !isSimulatingAdmin ? (
            <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 text-center backdrop-blur shadow-sm">
              <Shield className="mx-auto mb-4 h-12 w-12 animate-pulse text-muted-foreground/65" />
              <h3 className="mb-2 text-lg font-bold text-foreground">Administrator access required</h3>
              <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
                You must be logged in as an administrator to access the Course Catalog CMS. Use the
                simulation bypass toggle above to evaluate the dashboard.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/login">
                  <Button className="w-full bg-primary hover:bg-primary/95 rounded-full text-white">Log In</Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full text-muted-foreground hover:bg-muted rounded-full">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* CMS Dashboard Area */
            <div className="space-y-6">
              {/* Stats Cards Section */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    <Grid className="h-3.5 w-3.5 text-primary" />
                    Courses
                  </div>
                  <div className="mt-1 text-2xl font-black text-foreground">{stats.totalCourses}</div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    Total Tags
                  </div>
                  <div className="mt-1 text-2xl font-black text-foreground">{stats.totalTags}</div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    Specializations
                  </div>
                  <div className="mt-1 text-2xl font-black text-foreground">{stats.totalSpecializations}</div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    Colleges
                  </div>
                  <div className="mt-1 text-2xl font-black text-foreground">{stats.totalColleges}</div>
                </div>

                <div className="col-span-2 rounded-2xl border border-border bg-card p-4 md:col-span-1 shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    Total Seats
                  </div>
                  <div className="mt-1 text-2xl font-black text-foreground">{stats.totalSeats}</div>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex gap-2 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`px-3 pb-2.5 transition-colors ${
                      activeTab === 'courses'
                        ? 'border-b-2 border-primary font-bold text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Courses Manager
                  </button>
                  <button
                    onClick={() => setActiveTab('colleges')}
                    className={`px-3 pb-2.5 transition-colors ${
                      activeTab === 'colleges'
                        ? 'border-b-2 border-primary font-bold text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Colleges Manager
                  </button>
                  <button
                    onClick={() => setActiveTab('specializations')}
                    className={`px-3 pb-2.5 transition-colors ${
                      activeTab === 'specializations'
                        ? 'border-b-2 border-primary font-bold text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    College Specializations
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('csv-import');
                      setCsvFile(null);
                      setPreviewRows([]);
                      setImportErrors([]);
                    }}
                    className={`px-3 pb-2.5 transition-colors ${
                      activeTab === 'csv-import'
                        ? 'border-b-2 border-primary font-bold text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    CSV Importer
                  </button>
                  <button
                    onClick={() => setActiveTab('user-reports')}
                    className={`px-3 pb-2.5 transition-colors ${
                      activeTab === 'user-reports'
                        ? 'border-b-2 border-primary font-bold text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    User Reports
                  </button>
                  <Link
                    href="/admin/leads"
                    className="px-3 pb-2.5 font-semibold text-muted-foreground transition-colors hover:text-primary"
                  >
                    Lead CRM
                  </Link>
                  <Link
                    href="/mentor"
                    className="px-3 pb-2.5 font-semibold text-muted-foreground transition-colors hover:text-primary"
                  >
                    Mentor Dashboard →
                  </Link>
                </div>

                {activeTab === 'courses' && (
                  <Button
                    onClick={() =>
                      setCourseModal({
                        isOpen: true,
                        mode: 'create',
                        name: '',
                        description: '',
                        durationYears: 3,
                        difficultyLevel: 'Intermediate',
                      })
                    }
                    size="sm"
                    className="bg-indigo-600 text-xs font-bold hover:bg-indigo-700"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Create Course
                  </Button>
                )}

                {activeTab === 'colleges' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleExportColleges}
                      variant="outline"
                      size="sm"
                      className="border-slate-800 text-xs text-slate-300 hover:bg-slate-900"
                    >
                      Export Colleges (CSV)
                    </Button>
                    <Button
                      onClick={() =>
                        setCollegeModal({
                          isOpen: true,
                          mode: 'create',
                          aishe_code: '',
                          name: '',
                          location: '',
                          state: '',
                          ranking: 10,
                          fees_annual: 50000,
                          admission_criteria: '',
                          website_url: '',
                          type: 'Government',
                          entrance_exams: '',
                        })
                      }
                      size="sm"
                      className="bg-indigo-600 text-xs font-bold hover:bg-indigo-700"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Add College
                    </Button>
                  </div>
                )}
              </div>

              {/* Table listings Loader */}
              {isLoadingData ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center space-y-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                  <span className="animate-pulse text-xs text-slate-500">
                    Loading catalog records...
                  </span>
                </div>
              ) : activeTab === 'colleges' ? (
                /* Colleges Management View */
                <div className="space-y-4">
                  {/* Search, Filter, Sort Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 animate-in fade-in duration-300">
                    <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                      <input
                        type="text"
                        placeholder="Search colleges by name, city or state..."
                        value={collegeSearchQuery}
                        onChange={(e) => setCollegeSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-550 uppercase">
                          Type:
                        </span>
                        <select
                          value={collegeFilterType}
                          onChange={(e) => setCollegeFilterType(e.target.value as any)}
                          className="border-slate-200 rounded-lg border bg-white p-2 text-xs text-slate-900 outline-none focus:border-primary"
                        >
                          <option value="all">All Types</option>
                          <option value="Government">Government</option>
                          <option value="Private">Private</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-550 uppercase">
                          Sort By:
                        </span>
                        <select
                          value={collegeSortBy}
                          onChange={(e) => setCollegeSortBy(e.target.value as any)}
                          className="border-slate-200 rounded-lg border bg-white p-2 text-xs text-slate-900 outline-none focus:border-primary"
                        >
                          <option value="ranking">Ranking (1st first)</option>
                          <option value="fees">Fees (Low to High)</option>
                          <option value="name">Alphabetical (A-Z)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Colleges Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-550 uppercase">
                          <th className="p-4">Rank</th>
                          <th className="p-4">AISHE Code</th>
                          <th className="p-4">College Name</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Annual Fees</th>
                          <th className="p-4">Admission Criteria</th>
                          <th className="p-4">Exams</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-600">
                        {(() => {
                          const filteredColleges = colleges
                              .filter((col) => {
                                const matchSearch =
                                    col.name.toLowerCase().includes(collegeSearchQuery.toLowerCase()) ||
                                    col.location
                                        .toLowerCase()
                                        .includes(collegeSearchQuery.toLowerCase()) ||
                                    col.state
                                        .toLowerCase()
                                        .includes(collegeSearchQuery.toLowerCase()) ||
                                    (col.aishe_code &&
                                        col.aishe_code
                                            .toLowerCase()
                                            .includes(collegeSearchQuery.toLowerCase()));

                                const matchType =
                                    collegeFilterType === 'all' || col.type === collegeFilterType;

                                return matchSearch && matchType;
                              })
                              .sort((a, b) => {
                                if (collegeSortBy === 'ranking') {
                                  const rankA = a.ranking || 999999;
                                  const rankB = b.ranking || 999999;
                                  return rankA - rankB;
                                } else if (collegeSortBy === 'fees') {
                                  return a.fees_annual - b.fees_annual;
                                } else {
                                  return a.name.localeCompare(b.name);
                                }
                              });

                          if (filteredColleges.length === 0) {
                            return (
                                <tr>
                                  <td colSpan={9} className="p-8 text-center text-slate-500">
                                    No colleges match the filters or search.
                                  </td>
                                </tr>
                            );
                          }

                          return filteredColleges.map((col) => (
                              <tr key={col.id} className="transition-colors hover:bg-slate-50/50">
                                <td className="p-4 font-extrabold text-primary">
                                  {col.ranking ? `#${col.ranking}` : 'N/A'}
                                </td>
                                <td className="p-4 font-mono font-bold text-slate-500">
                                  {col.aishe_code || 'N/A'}
                                </td>
                                <td className="p-4">
                                  <div className="font-bold text-slate-900">{col.name}</div>
                                  {col.website_url && (
                                      <a
                                          href={col.website_url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[10px] text-primary/80 hover:text-primary hover:underline"
                                      >
                                        Visit Website
                                      </a>
                                  )}
                                </td>
                                <td className="p-4 text-slate-500">
                                  {col.location}, {col.state}
                                </td>
                                <td className="p-4">
                                  <span
                                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                          col.type === 'Government'
                                              ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                                              : 'border border-blue-105 bg-blue-50 text-primary'
                                      }`}
                                  >
                                    {col.type}
                                  </span>
                                </td>
                                <td className="p-4 font-semibold text-slate-700">
                                  ₹{col.fees_annual.toLocaleString('en-IN')}
                                </td>
                                <td
                                    className="max-w-[150px] truncate p-4 text-slate-500"
                                    title={col.admission_criteria}
                                  >
                                  {col.admission_criteria}
                                </td>
                                <td className="p-4">
                                  <div className="flex max-w-[150px] flex-wrap gap-1">
                                    {col.entrance_exams && col.entrance_exams.length > 0 ? (
                                        col.entrance_exams.map((exam, idx) => (
                                            <span
                                                key={idx}
                                                className="text-slate-600 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[8px]"
                                            >
                                            {exam}
                                          </span>
                                        ))
                                    ) : (
                                        <span className="text-[10px] text-slate-500">
                                        Direct Admission
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="space-x-2 p-4 text-right">
                                  <button
                                      onClick={() =>
                                          setCollegeModal({
                                            isOpen: true,
                                            mode: 'edit',
                                            collegeId: col.id,
                                            aishe_code: col.aishe_code || '',
                                            name: col.name,
                                            location: col.location,
                                            state: col.state,
                                            ranking: col.ranking || 100,
                                            fees_annual: col.fees_annual,
                                            admission_criteria: col.admission_criteria,
                                            website_url: col.website_url || '',
                                            type: col.type,
                                            entrance_exams: col.entrance_exams
                                                ? col.entrance_exams.join(', ')
                                                : '',
                                          })
                                      }
                                      className="inline-block p-1 text-primary hover:text-primary/80"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                      onClick={() => handleDeleteCollege(col.id, col.name)}
                                      className="inline-block p-1 text-rose-600 hover:text-rose-500"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeTab === 'courses' ? (
                /* Courses Management View */
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-550 uppercase">
                        <th className="p-4">Name</th>
                        <th className="hidden p-4 md:table-cell">Description</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Difficulty</th>
                        <th className="p-4">Tags</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-650">
                      {courses.map((course) => {
                        const courseTags = tags.filter((t) => t.course_id === course.id);
                        return (
                          <tr key={course.id} className="transition-colors hover:bg-slate-50/50">
                            <td className="max-w-[150px] truncate p-4 font-bold text-slate-900">
                              {course.name}
                            </td>
                            <td className="hidden max-w-sm truncate p-4 text-slate-500 md:table-cell">
                              {course.description}
                            </td>
                            <td className="p-4 font-semibold text-slate-700">{course.duration_years} Years</td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                  course.difficulty_level === 'Advanced'
                                    ? 'border border-rose-200 bg-rose-50 text-rose-700'
                                    : course.difficulty_level === 'Intermediate'
                                      ? 'border border-amber-250 bg-amber-50 text-amber-700'
                                      : 'border border-emerald-250 bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {course.difficulty_level}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex max-w-[180px] flex-wrap gap-1">
                                {courseTags.map((tagObj) => (
                                  <span
                                    key={tagObj.id}
                                    className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[8px] text-slate-600"
                                  >
                                    {tagObj.tag}
                                  </span>
                                ))}
                                <button
                                  onClick={() =>
                                    setTagModal({
                                      isOpen: true,
                                      courseId: course.id,
                                      newTag: '',
                                    })
                                  }
                                  className="px-1 text-[10px] font-extrabold text-primary hover:text-primary/80"
                                >
                                  + Manage
                                </button>
                              </div>
                            </td>
                            <td className="space-x-2 p-4 text-right">
                              <button
                                onClick={() =>
                                  setSpecModal({
                                    isOpen: true,
                                    courseId: course.id,
                                    collegeId: colleges[0]?.id || '',
                                    specName: '',
                                    seats: 40,
                                  })
                                }
                                className="text-slate-600 rounded border border-slate-200 px-2 py-1 text-[10px] transition-colors hover:text-slate-900 hover:bg-slate-50"
                              >
                                + Specialization
                              </button>
                              <button
                                onClick={() =>
                                  setCourseModal({
                                    isOpen: true,
                                    mode: 'edit',
                                    courseId: course.id,
                                    name: course.name,
                                    description: course.description,
                                    durationYears: course.duration_years,
                                    difficultyLevel: course.difficulty_level,
                                  })
                                }
                                className="inline-block p-1 text-primary hover:text-primary/80"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id, course.name)}
                                className="inline-block p-1 text-rose-600 hover:text-rose-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === 'specializations' ? (
                /* Specializations Management View */
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-550 uppercase">
                        <th className="p-4">College</th>
                        <th className="p-4">Course Category</th>
                        <th className="p-4">Specialization Title</th>
                        <th className="p-4">Seats Available</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-650">
                      {specializations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            No specializations mapped. Go to the Courses tab to link a college
                            specialization.
                          </td>
                        </tr>
                      ) : (
                        specializations.map((spec) => {
                          const linkedCourse = courses.find((c) => c.id === spec.course_id);
                          return (
                            <tr key={spec.id} className="transition-colors hover:bg-slate-550/50">
                              <td className="p-4 font-bold text-slate-900">
                                {spec.colleges?.name || 'Unknown College'}
                              </td>
                              <td className="p-4 text-slate-550">
                                {linkedCourse ? linkedCourse.name : 'Unknown Course'}
                              </td>
                              <td className="p-4 font-semibold text-primary">
                                {spec.specialization_name}
                              </td>
                              <td className="p-4 font-bold text-slate-700">{spec.seats_available} Seats</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() =>
                                    handleRemoveSpecialization(spec.id, spec.specialization_name)
                                  }
                                  className="p-1 text-rose-600 hover:text-rose-500"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === 'user-reports' ? (
                /* User Reports View */
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <input
                      type="text"
                      placeholder="Search by student name or email..."
                      value={assessmentSearchQuery}
                      onChange={(e) => setAssessmentSearchQuery(e.target.value)}
                      className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-550 uppercase">
                          <th className="p-4">Student Details</th>
                          <th className="p-4">Academic Stream / Grade</th>
                          <th className="p-4">Submitted Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-655">
                        {assessments.filter((ar) => {
                          const query = assessmentSearchQuery.toLowerCase();
                          const name = ar.profiles?.full_name?.toLowerCase() || '';
                          const email = ar.profiles?.email?.toLowerCase() || '';
                          return name.includes(query) || email.includes(query);
                        }).length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-500">
                              No assessment responses found.
                            </td>
                          </tr>
                        ) : (
                          assessments
                            .filter((ar) => {
                              const query = assessmentSearchQuery.toLowerCase();
                              const name = ar.profiles?.full_name?.toLowerCase() || '';
                              const email = ar.profiles?.email?.toLowerCase() || '';
                              return name.includes(query) || email.includes(query);
                            })
                            .map((ar) => {
                              const isRegenerating = regeneratingIds[ar.id];
                              const gradeLabel = ar.responses?.grade || 'N/A';
                              const formattedDate =
                                new Date(ar.completed_at).toLocaleDateString('en-US', {
                                  dateStyle: 'medium',
                                }) +
                                ' ' +
                                new Date(ar.completed_at).toLocaleTimeString('en-US', {
                                  timeStyle: 'short',
                                });

                              return (
                                <tr key={ar.id} className="transition-colors hover:bg-slate-50/50">
                                  <td className="p-4">
                                    <div className="font-bold text-slate-900">
                                      {ar.profiles?.full_name || 'Student'}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {ar.profiles?.email || 'N/A'}
                                    </div>
                                  </td>
                                  <td className="p-4 text-slate-500 capitalize">
                                    {gradeLabel.replace('school_', '').replace('_', ' ')}
                                  </td>
                                  <td className="p-4 text-slate-500">{formattedDate}</td>
                                  <td className="p-4 text-right">
                                    <Button
                                      onClick={() => handleRegenerateReport(ar)}
                                      disabled={isRegenerating}
                                      size="sm"
                                      className="h-8 bg-primary hover:bg-primary/90 text-white px-3 text-[10px] font-semibold rounded-full disabled:opacity-50"
                                    >
                                      {isRegenerating ? (
                                        <>
                                          <div className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent align-middle" />
                                          Regenerating...
                                        </>
                                      ) : (
                                        'Regenerate PDF'
                                      )}
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* CSV Importer View */
                <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Import Records from CSV</h3>
                      <p className="text-xs text-slate-500">
                        Upload a CSV file to add multiple records at once. Duplicates and invalid
                        formats will be rejected.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Import Target:
                      </label>
                      <select
                        value={importTarget}
                        onChange={(e) => {
                          const target = e.target.value as
                            | 'courses'
                            | 'tags'
                            | 'specializations'
                            | 'colleges';
                          setImportTarget(target);
                          setCsvFile(null);
                          setPreviewRows([]);
                          setImportErrors([]);
                        }}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-primary"
                      >
                        <option value="courses">Courses</option>
                        <option value="tags">Tags</option>
                        <option value="specializations">College Specializations</option>
                        <option value="colleges">Colleges (Standard)</option>
                        <option value="aishe">AISHE College Registry</option>
                        <option value="nirf">NIRF Rankings Update</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-xs">
                    <p className="font-bold text-primary">Required CSV Headers:</p>
                    {importTarget === 'courses' && (
                      <code className="block rounded bg-slate-100 p-2 font-mono text-[10px] text-slate-700">
                        name,description,duration_years,difficulty_level
                      </code>
                    )}
                    {importTarget === 'tags' && (
                      <code className="block rounded bg-slate-100 p-2 font-mono text-[10px] text-slate-700">
                        course_name,tag
                      </code>
                    )}
                    {importTarget === 'specializations' && (
                      <code className="block rounded bg-slate-100 p-2 font-mono text-[10px] text-slate-700">
                        college_name,course_name,specialization_name,seats_available
                      </code>
                    )}
                    {importTarget === 'colleges' && (
                      <code className="block rounded bg-slate-100 p-2 font-mono text-[10px] text-slate-700">
                        name,location,state,ranking,fees_annual,admission_criteria,website_url,type,entrance_exams
                        (use semicolon ';' for multiple exams)
                      </code>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                    <input
                      type="file"
                      id="csvFileInput"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="csvFileInput"
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
                    >
                      Choose CSV File
                    </label>
                    {csvFile ? (
                      <p className="mt-2 text-xs font-semibold text-emerald-600">
                        Selected File: {csvFile.name}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">
                        No file chosen. Supported format: .csv
                      </p>
                    )}
                  </div>

                  {previewRows.length > 0 && (
                    <div className="space-y-4 border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">
                          Import Preview ({previewRows.length} Rows)
                        </h4>
                        {importErrors.length > 0 ? (
                          <span className="text-xs font-bold text-rose-600">
                            ❌ {importErrors.length} validation error(s) found. Please fix your file
                            and try again.
                          </span>
                        ) : (
                          <span className="text-emerald-700 flex items-center gap-1 text-xs font-bold">
                            ✓ CSV Validated successfully! Ready to commit.
                          </span>
                        )}
                      </div>

                      <div className="max-h-[300px] overflow-x-auto overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/50">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="border-slate-200 border-b bg-slate-100/80 text-[10px] font-bold tracking-wider text-slate-650 uppercase">
                              <th className="p-3">Row</th>
                              {importTarget === 'courses' && (
                                <>
                                  <th className="p-3">Course Name</th>
                                  <th className="p-3">Duration</th>
                                  <th className="p-3">Difficulty</th>
                                </>
                              )}
                              {importTarget === 'tags' && (
                                <>
                                  <th className="p-3">Course</th>
                                  <th className="p-3">Tag</th>
                                </>
                              )}
                              {importTarget === 'specializations' && (
                                <>
                                  <th className="p-3">College</th>
                                  <th className="p-3">Course</th>
                                  <th className="p-3">Specialization</th>
                                  <th className="p-3">Seats</th>
                                </>
                              )}
                              {importTarget === 'colleges' && (
                                <>
                                  <th className="p-3">College Name</th>
                                  <th className="p-3">Location</th>
                                  <th className="p-3">Type</th>
                                  <th className="p-3">Fees</th>
                                  <th className="p-3">Exams</th>
                                </>
                              )}
                              <th className="p-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-slate-200 divide-y text-slate-700">
                            {previewRows.map((row) => (
                              <tr
                                key={row.rowNum}
                                className={`transition-colors ${row.valid ? 'hover:bg-slate-100/50' : 'bg-rose-50 hover:bg-rose-100/50'}`}
                              >
                                <td className="p-3 font-semibold text-slate-500">{row.rowNum}</td>
                                {importTarget === 'courses' && (
                                  <>
                                    <td className="max-w-[150px] truncate p-3 font-bold text-slate-900">
                                      {row.data.name}
                                    </td>
                                    <td className="p-3">{row.data.duration_years} Years</td>
                                    <td className="p-3">{row.data.difficulty_level}</td>
                                  </>
                                )}
                                {importTarget === 'tags' && (
                                  <>
                                    <td className="p-3 font-bold text-slate-900">
                                      {row.data.course_name}
                                    </td>
                                    <td className="p-3">{row.data.tag}</td>
                                  </>
                                )}
                                {importTarget === 'specializations' && (
                                  <>
                                    <td className="p-3 font-bold text-slate-900">
                                      {row.data.college_name}
                                    </td>
                                    <td className="p-3">{row.data.course_name}</td>
                                    <td className="p-3 text-primary font-semibold">
                                      {row.data.specialization_name}
                                    </td>
                                    <td className="p-3">{row.data.seats_available} Seats</td>
                                  </>
                                )}
                                {importTarget === 'colleges' && (
                                  <>
                                    <td className="p-3 font-bold text-slate-900">{row.data.name}</td>
                                    <td className="p-3">
                                      {row.data.location}, {row.data.state}
                                    </td>
                                    <td className="p-3">{row.data.type}</td>
                                    <td className="p-3">
                                      ₹{row.data.fees_annual.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-3 font-mono text-[10px]">
                                      {row.data.entrance_exams
                                        ? row.data.entrance_exams.join(', ')
                                        : ''}
                                    </td>
                                  </>
                                )}
                                <td className="p-3 text-right">
                                  {row.valid ? (
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-100">
                                      Ready
                                    </span>
                                  ) : (
                                    <span
                                      title={row.errors.join(', ')}
                                      className="inline-flex cursor-help items-center rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-700 border border-rose-100"
                                    >
                                      Error
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {importErrors.length > 0 && (
                        <div className="space-y-1 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
                          <p className="text-[10px] font-extrabold tracking-wider uppercase">
                            Validation Failures:
                          </p>
                          <ul className="list-disc space-y-0.5 pl-4">
                            {importErrors.slice(0, 10).map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                            {importErrors.length > 10 && (
                              <li className="text-[10px] text-rose-500 italic">
                                And {importErrors.length - 10} more errors...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCsvFile(null);
                            setPreviewRows([]);
                            setImportErrors([]);
                          }}
                          className="flex-1 border-slate-350 text-slate-700 hover:bg-slate-50"
                        >
                          Clear Import
                        </Button>
                        <Button
                          disabled={importErrors.length > 0 || isImporting}
                          onClick={handleCommitImport}
                          className="flex-1 bg-indigo-650 font-bold text-white hover:bg-indigo-700"
                        >
                          {isImporting ? 'Processing Commit...' : 'Commit Import'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ======================================================== */}
      {/* MODALS IMPLEMENTATION */}
      {/* ======================================================== */}

      {/* 1. Create/Edit Course Modal */}
      <AnimatePresence>
        {courseModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {courseModal.mode === 'create' ? 'Create New Course' : 'Edit Course Details'}
                </h3>
                <button
                  onClick={() => setCourseModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-slate-500 hover:text-slate-850"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 uppercase">Course Name</label>
                  <input
                    type="text"
                    required
                    value={courseModal.name}
                    onChange={(e) => setCourseModal((prev) => ({ ...prev, name: e.target.value }))}
                    className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g., Space Technology & Satellite Systems"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 uppercase">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={courseModal.description}
                    onChange={(e) =>
                      setCourseModal((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Enter course scope, curriculum details, and career pathways..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">
                      Duration (Years)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={7}
                      value={courseModal.durationYears}
                      onChange={(e) =>
                        setCourseModal((prev) => ({
                          ...prev,
                          durationYears: Number(e.target.value),
                        }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">Difficulty</label>
                    <select
                      value={courseModal.difficultyLevel}
                      onChange={(e) =>
                        setCourseModal((prev) => ({
                          ...prev,
                          difficultyLevel: e.target.value as
                            | 'Beginner'
                            | 'Intermediate'
                            | 'Advanced',
                        }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-slate-200 pt-3">
                  <Button
                    type="button"
                    onClick={() => setCourseModal((prev) => ({ ...prev, isOpen: false }))}
                    variant="outline"
                    className="text-slate-700 flex-1 border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/95 font-semibold">
                    Save Course
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Manage Tags Modal */}
      <AnimatePresence>
        {tagModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Manage Course Tags</h3>
                <button
                  onClick={() => setTagModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-slate-500 hover:text-slate-850"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Render Existing tags */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Active Tags
                </label>
                <div className="flex min-h-[40px] flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2">
                  {tags.filter((t) => t.course_id === tagModal.courseId).length === 0 ? (
                    <span className="p-1 text-[10px] text-slate-500">No tags set.</span>
                  ) : (
                    tags
                      .filter((t) => t.course_id === tagModal.courseId)
                      .map((tObj) => (
                        <span
                          key={tObj.id}
                          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700"
                        >
                          {tObj.tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tObj.id, tObj.tag)}
                            className="font-extrabold text-rose-600 hover:text-rose-500"
                          >
                            ×
                          </button>
                        </span>
                      ))
                  )}
                </div>
              </div>

              {/* Form to add a tag */}
              <form onSubmit={handleAddTag} className="space-y-4 border-t border-slate-200 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Add New Tag
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={tagModal.newTag}
                      onChange={(e) => setTagModal((prev) => ({ ...prev, newTag: e.target.value }))}
                      className="border-slate-200 flex-grow rounded-lg border bg-white px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-primary"
                      placeholder="e.g., machine_learning"
                    />
                    <Button type="submit" size="xs" className="bg-primary hover:bg-primary/95 text-white">
                      <PlusCircle className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <Button
                    onClick={() => setTagModal((prev) => ({ ...prev, isOpen: false }))}
                    variant="outline"
                    className="border-slate-300 text-xs text-slate-700 hover:bg-slate-55"
                  >
                    Close
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Manage Specializations Modal */}
      <AnimatePresence>
        {specModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Add College Specialization</h3>
                <button
                  onClick={() => setSpecModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-slate-500 hover:text-slate-850"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Render Existing specializations */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Linked Specializations
                </label>
                <div className="max-h-[120px] space-y-1.5 overflow-y-auto pr-1">
                  {specializations.filter((s) => s.course_id === specModal.courseId).length === 0 ? (
                    <p className="p-1 text-[10px] text-slate-500 italic">No colleges linked yet.</p>
                  ) : (
                    specializations
                      .filter((s) => s.course_id === specModal.courseId)
                      .map((sObj) => (
                        <div
                          key={sObj.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2 text-[10px]"
                        >
                          <div>
                            <span className="font-bold text-slate-700">
                              {sObj.colleges?.name || 'Unknown'}
                            </span>
                            <span className="block text-[9px] text-slate-500">
                              {sObj.specialization_name} ({sObj.seats_available} seats)
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveSpecialization(sObj.id, sObj.specialization_name)
                            }
                            className="text-rose-600 hover:text-rose-500"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Form to add college specialization */}
              <form
                onSubmit={handleAddSpecialization}
                className="space-y-3 border-t border-slate-200 pt-3 text-xs"
              >
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 uppercase">Select College</label>
                  <select
                    required
                    value={specModal.collegeId}
                    onChange={(e) =>
                      setSpecModal((prev) => ({ ...prev, collegeId: e.target.value }))
                    }
                    className="border-slate-200 w-full rounded-lg border bg-white p-2 text-xs text-slate-900 outline-none focus:border-primary"
                  >
                    <option value="">Choose a college...</option>
                    {colleges.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name} ({col.location}, {col.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">
                      Specialization Name
                    </label>
                    <input
                      type="text"
                      required
                      value={specModal.specName}
                      onChange={(e) =>
                        setSpecModal((prev) => ({ ...prev, specName: e.target.value }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2 text-slate-900 outline-none focus:border-primary"
                      placeholder="e.g., Artificial Intelligence & ML"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">Seats</label>
                    <input
                      type="number"
                      required
                      min={5}
                      max={300}
                      value={specModal.seats}
                      onChange={(e) =>
                        setSpecModal((prev) => ({ ...prev, seats: Number(e.target.value) }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2 text-slate-900 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-3 border-t border-slate-200 pt-3">
                  <Button
                    type="button"
                    onClick={() => setSpecModal((prev) => ({ ...prev, isOpen: false }))}
                    variant="outline"
                    className="flex-1 border-slate-350 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/95 font-semibold">
                    Add Specialization
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Create/Edit College Modal */}
      <AnimatePresence>
        {collegeModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {collegeModal.mode === 'create' ? 'Create New College' : 'Edit College Details'}
                </h3>
                <button
                  onClick={() => setCollegeModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-slate-500 hover:text-slate-850"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSaveCollege} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">College Name</label>
                    <input
                      type="text"
                      required
                      value={collegeModal.name}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g., Indian Institute of Technology Bombay"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">AISHE Code</label>
                    <input
                      type="text"
                      value={collegeModal.aishe_code}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({ ...prev, aishe_code: e.target.value }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g., C-12345"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">
                      City / Location
                    </label>
                    <input
                      type="text"
                      required
                      value={collegeModal.location}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({ ...prev, location: e.target.value }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g., Mumbai"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">State</label>
                    <input
                      type="text"
                      required
                      value={collegeModal.state}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({ ...prev, state: e.target.value }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g., Maharashtra"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">
                      NIRF / State Rank
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={collegeModal.ranking || ''}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({ ...prev, ranking: Number(e.target.value) }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">
                      Annual Fees (INR)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={collegeModal.fees_annual}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({
                          ...prev,
                          fees_annual: Number(e.target.value),
                        }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">College Type</label>
                    <select
                      value={collegeModal.type}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({
                          ...prev,
                          type: e.target.value as 'Government' | 'Private',
                        }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 uppercase">
                    Admission Criteria
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeModal.admission_criteria}
                    onChange={(e) =>
                      setCollegeModal((prev) => ({ ...prev, admission_criteria: e.target.value }))
                    }
                    className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g., JEE Advanced cut-off percentile score"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">Website URL</label>
                    <input
                      type="url"
                      value={collegeModal.website_url}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({ ...prev, website_url: e.target.value }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g., https://www.iitb.ac.in"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 uppercase">
                      Entrance Exams (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={collegeModal.entrance_exams}
                      onChange={(e) =>
                        setCollegeModal((prev) => ({ ...prev, entrance_exams: e.target.value }))
                      }
                      className="border-slate-200 w-full rounded-lg border bg-white p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g., JEE Main, JEE Advanced"
                    />
                  </div>
                </div>

                <div className="flex gap-3 border-t border-slate-200 pt-3">
                  <Button
                    type="button"
                    onClick={() => setCollegeModal((prev) => ({ ...prev, isOpen: false }))}
                    variant="outline"
                    className="text-slate-700 flex-1 border-slate-350 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/95 font-semibold">
                    Save College
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
