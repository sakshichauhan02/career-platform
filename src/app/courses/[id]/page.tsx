'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  Clock,
  Compass,
  CheckCircle,
  FileText,
  DollarSign,
  Briefcase,
  Building2,
  GraduationCap,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { PREDEFINED_COURSES } from '@/services/recommendationEngine';
import { COURSE_DETAILS_MAP, CourseDetailSections } from '@/config/courseDetailsData';

interface CollegeSpecialization {
  id: string;
  specialization_name: string;
  seats_available: number;
  colleges: {
    id: string;
    name: string;
    location: string;
    state: string;
  };
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // States
  const [course, setCourse] = useState<any>(null);
  const [details, setDetails] = useState<CourseDetailSections | null>(null);
  const [collegesList, setCollegesList] = useState<CollegeSpecialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    const loadCourseDetails = async () => {
      setLoading(true);
      try {
        // 1. Find course from predefined repository
        let matched = PREDEFINED_COURSES.find(
          (c) =>
            c.id.toLowerCase() === id.toLowerCase() ||
            c.name.toLowerCase() === decodeURIComponent(id).toLowerCase()
        );

        let courseData = matched
          ? {
              id: matched.id,
              name: matched.name,
              description: matched.description,
              durationYears: matched.durationYears,
              difficultyLevel: matched.difficultyLevel,
            }
          : null;

        // 2. Fallback to Supabase if not found in predefined
        if (!courseData) {
          const { data: dbCourse } = await supabase
            .from('courses')
            .select('*')
            .or(`id.eq.${id},name.eq.${decodeURIComponent(id)}`)
            .maybeSingle();

          if (dbCourse) {
            courseData = {
              id: dbCourse.id,
              name: dbCourse.name,
              description: dbCourse.description,
              durationYears: dbCourse.duration_years,
              difficultyLevel: dbCourse.difficulty_level,
            };
          }
        }

        if (courseData) {
          setCourse(courseData);

          // 3. Map details sections
          const detailMeta = COURSE_DETAILS_MAP[courseData.id] || {
            overview: courseData.description,
            eligibility: `10+2 with relevant subjects matching ${courseData.difficultyLevel} levels.`,
            exams: ['Direct College Evaluation', 'State Level Entrance'],
            subjects: [
              'Core Domain Fundamentals',
              'Advanced Methodologies',
              'Elective Focus',
              'Internship & Project Work',
            ],
            specializations: ['General Analytics', 'Corporate Integrations'],
            careerScope: [`Professional in ${courseData.name}`, 'Researcher', 'Consultant'],
            salary: { starting: '₹4 - 7 LPA', mid: '₹8 - 14 LPA', top: '₹22+ LPA' },
            recruiters: ['Leading Enterprises', 'Tech Startups'],
          };
          setDetails(detailMeta);

          // 4. Fetch colleges offering this course
          const { data: specs } = await supabase
            .from('specializations')
            .select('id, specialization_name, seats_available, colleges(id, name, location, state)')
            .eq('course_id', courseData.id);

          if (specs && specs.length > 0) {
            setCollegesList(specs as unknown as CollegeSpecialization[]);
          } else {
            // Fallback mock colleges if database mappings are blank
            const fallbackSpecs: CollegeSpecialization[] = [
              {
                id: 'mock-spec-1',
                specialization_name: detailMeta.specializations[0] || 'General Analytics',
                seats_available: 60,
                colleges: {
                  id: 'mc-1',
                  name: 'IIT Bombay',
                  location: 'Mumbai',
                  state: 'Maharashtra',
                },
              },
              {
                id: 'mock-spec-2',
                specialization_name: detailMeta.specializations[1] || 'Corporate Research',
                seats_available: 40,
                colleges: {
                  id: 'mc-5',
                  name: 'IIM Ahmedabad',
                  location: 'Ahmedabad',
                  state: 'Gujarat',
                },
              },
            ];
            setCollegesList(fallbackSpecs);
          }
        }
      } catch (err) {
        console.error('Error fetching course detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetails();
  }, [id]);

  const scrollToColleges = () => {
    setActiveTab('specializations');
    setTimeout(() => {
      const element = document.getElementById('specializations-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    }, 200);
  };

  if (loading) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col justify-between font-sans">
        <Navbar />
        <main className="flex flex-grow items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="animate-pulse text-sm font-bold text-slate-400">
              Fetching program curriculum...
            </span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course || !details) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col justify-between font-sans">
        <Navbar />
        <main className="flex flex-grow flex-col items-center justify-center space-y-4 px-4 text-center">
          <h2 className="text-2xl font-extrabold text-red-500">Course Catalog Entry Not Found</h2>
          <p className="max-w-md text-xs font-medium text-slate-500">
            The requested course could not be located in our catalog. It may have been renamed or
            removed by an administrator.
          </p>
          <Link href="/">
            <Button className="rounded-full bg-primary px-6 text-white hover:bg-primary/95">
              Return to Portal
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
    { id: 'exams', label: 'Entrance Exams', icon: FileText },
    { id: 'subjects', label: 'Curriculum Subjects', icon: Compass },
    { id: 'specializations', label: 'Specializations & Colleges', icon: GraduationCap },
    { id: 'careerScope', label: 'Career Scope', icon: Briefcase },
    { id: 'salary', label: 'Salary Scales', icon: DollarSign },
    { id: 'recruiters', label: 'Top Recruiters', icon: Building2 },
  ];

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col justify-between overflow-x-hidden font-sans">
      <Navbar />

      <main className="relative flex-grow px-4 pt-28 pb-24">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute top-12 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-24 h-96 w-96 translate-x-1/2 rounded-full bg-blue-500/5 blur-[150px]" />

        <div className="mx-auto max-w-7xl space-y-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Link>

          {/* Banner Hero */}
          <div className="border-border rounded-3xl border bg-white p-6 shadow-sm md:p-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-primary">
                  <Clock className="h-3.5 w-3.5" />
                  {course.durationYears} Years Program
                </span>
                <span className="border-border inline-flex items-center gap-1 rounded-full border bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  {course.difficultyLevel} Level
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                {course.name}
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed font-medium text-slate-500">
                {course.description}
              </p>
            </div>
          </div>

          {/* Two Column details container */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar navigation */}
            <div className="space-y-2 lg:col-span-1">
              <div className="border-border sticky top-28 space-y-1 rounded-3xl border bg-white p-3 shadow-sm">
                <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Menu Sections
                </p>
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveTab(sec.id);
                        if (sec.id === 'specializations') {
                          scrollToColleges();
                        } else {
                          const el = document.getElementById('details-content');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all ${
                        activeTab === sec.id
                          ? 'bg-primary text-white shadow-md'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-955'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {sec.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Pane */}
            <div id="details-content" className="space-y-8 lg:col-span-3">
              {/* Render dynamic section contents based on active tab */}
              <div className="border-border space-y-6 rounded-3xl border bg-white p-6 shadow-sm md:p-8">
                {/* 1. OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                      <BookOpen className="text-primary/90 h-5 w-5" />
                      Domain Overview & Curricula
                    </h3>
                    <p className="text-sm leading-relaxed font-medium text-slate-500">
                      {details.overview}
                    </p>
                    <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                      <div className="border-border rounded-2xl border bg-slate-50 p-4">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Core Methodology
                        </span>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          Focused on combining academic research, simulation environments, and
                          client casework to align with industry expectations.
                        </p>
                      </div>
                      <div className="border-border rounded-2xl border bg-slate-50 p-4">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Global Mobility
                        </span>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          This degree conforms to international accreditation frameworks, unlocking
                          research fellowships and jobs worldwide.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ELIGIBILITY */}
                {activeTab === 'eligibility' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                      <CheckCircle className="text-primary/90 h-5 w-5" />
                      Admission Eligibility Criteria
                    </h3>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                      <p className="text-sm font-semibold text-slate-800">{details.eligibility}</p>
                    </div>
                    <ul className="list-disc space-y-2 pl-5 text-xs font-medium text-slate-500">
                      <li>Must satisfy age limits matching university statutes on admission.</li>
                      <li>
                        Foreign credentials must have equivalent evaluations from the Association of
                        Indian Universities (AIU).
                      </li>
                      <li>
                        Reserved category quotas apply matching Central/State guidelines.
                      </li>
                    </ul>
                  </div>
                )}

                {/* 3. EXAMS */}
                {activeTab === 'exams' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                      <FileText className="text-primary/90 h-5 w-5" />
                      Top Entrance Examinations
                    </h3>
                    <p className="text-xs text-slate-400">
                      Admission into major institutes offering this degree is governed by
                      competitive entry tests:
                    </p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {details.exams.map((exam, i) => (
                        <div
                          key={i}
                          className="border-border flex items-center justify-between rounded-xl border bg-slate-50 p-4"
                        >
                          <span className="text-xs font-bold text-slate-900">{exam}</span>
                          <span className="text-[9px] font-bold text-primary uppercase">
                            National Level
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. SUBJECTS */}
                {activeTab === 'subjects' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                      <Compass className="text-primary/90 h-5 w-5" />
                      Curriculum Core Subjects
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sample core subjects outline during this course of study:
                    </p>
                    <div className="space-y-2">
                      {details.subjects.map((sub, i) => (
                        <div
                          key={i}
                          className="border-border flex items-center gap-3 rounded-xl border bg-slate-50 p-3.5"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/5 text-[10px] font-bold text-primary">
                            0{i + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. SPECIALIZATIONS */}
                {activeTab === 'specializations' && (
                  <div id="specializations-section" className="scroll-mt-28 space-y-6">
                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                        <GraduationCap className="text-primary/90 h-5 w-5" />
                        Specializations & Colleges
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">
                        Target tracks and programs linked to specific colleges offering this
                        curriculum:
                      </p>
                    </div>

                    {/* Predefined Specializations badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {details.specializations.map((spec, i) => (
                        <span
                          key={i}
                          className="border-border rounded-full border bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Colleges Listing */}
                    <div className="border-border space-y-3 border-t pt-4">
                      <h4 className="text-sm font-bold text-slate-900">
                        Institutes Mapping ({collegesList.length} Found)
                      </h4>
                      {collegesList.length === 0 ? (
                        <div className="border-border rounded-3xl border bg-slate-50 p-8 text-center text-xs font-medium text-slate-500">
                          No universities mapped in the database for this course. Access the Admin
                          CMS Panel to register colleges.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {collegesList.map((item) => (
                            <div
                              key={item.id}
                              className="border-border space-y-3 rounded-3xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                              <div>
                                <span className="text-[8px] font-bold tracking-wider text-blue-600 uppercase">
                                  Affiliated University
                                </span>
                                <h5 className="text-sm font-bold text-slate-900">
                                  {item.colleges?.name || 'Unknown'}
                                </h5>
                                <span className="text-[10px] font-semibold text-slate-400">
                                  {item.colleges?.location}, {item.colleges?.state}
                                </span>
                              </div>
                              <div className="border-border flex items-center justify-between border-t pt-2 text-[10px]">
                                <span className="font-semibold text-slate-500">
                                  Spec: {item.specialization_name}
                                </span>
                                <span className="font-bold text-primary">
                                  {item.seats_available} Seats
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. CAREER SCOPE */}
                {activeTab === 'careerScope' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                      <Briefcase className="text-primary/90 h-5 w-5" />
                      Professional Career Outlook
                    </h3>
                    <p className="text-xs text-slate-400">
                      Primary professions and job profiles you can enter immediately upon
                      graduation:
                    </p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {details.careerScope.map((role, i) => (
                        <div
                          key={i}
                          className="border-border flex items-center gap-3 rounded-xl border bg-slate-50 p-4"
                        >
                          <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-800">{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. SALARY SCALES */}
                {activeTab === 'salary' && (
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                      <DollarSign className="text-primary/90 h-5 w-5" />
                      Compensation & Salary Scales
                    </h3>
                    <p className="text-xs text-slate-400">
                      Approximate annual remuneration packages offered to professionals in this
                      domain:
                    </p>

                    <div className="border-border space-y-4 rounded-3xl border bg-slate-50 p-6">
                      {/* Starting */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Starting Packages (0-2 Yrs)</span>
                          <span className="font-bold text-primary">{details.salary.starting}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full w-1/3 rounded-full bg-primary" />
                        </div>
                      </div>

                      {/* Mid Level */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Mid Level (3-6 Yrs)</span>
                          <span className="font-bold text-primary">{details.salary.mid}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full w-3/5 rounded-full bg-primary" />
                        </div>
                      </div>

                      {/* Executive / Top */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Executive & Lead Roles</span>
                          <span className="font-bold text-primary">{details.salary.top}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-primary to-primary/80" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. RECRUITERS */}
                {activeTab === 'recruiters' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                      <Building2 className="text-primary/90 h-5 w-5" />
                      Top Sector Recruiters
                    </h3>
                    <p className="text-xs text-slate-400">
                      Preeminent corporations, consulting networks, and industry firms hiring
                      graduates:
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {details.recruiters.map((rec, i) => (
                        <div
                          key={i}
                          className="border-border flex items-center gap-2 rounded-xl border bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700"
                        >
                          <TrendingUp className="h-3.5 w-3.5 text-primary" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STICKY FOOTER CTA BAR */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-40 border-t bg-white/80 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Exploring Course Details
            </span>
            <p className="max-w-sm truncate text-xs font-bold text-slate-900">{course.name}</p>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <Link href="/" className="flex-1 sm:flex-initial">
              <Button
                variant="outline"
                className="w-full rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>
            </Link>
            <Button
              onClick={scrollToColleges}
              className="flex flex-grow items-center gap-2 rounded-full bg-primary font-bold text-white shadow-md shadow-primary/10 transition-all hover:bg-primary/95 sm:flex-initial"
            >
              <GraduationCap className="h-4.5 w-4.5" />
              Explore Colleges
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
