'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Clock, Award, ArrowRight, Grid, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { PREDEFINED_COURSES } from '@/services/recommendationEngine';

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Fetch custom courses from Supabase
        const { data: dbCourses } = await supabase.from('courses').select('*');

        // Map predefined courses
        const localCourses = PREDEFINED_COURSES.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          durationYears: c.durationYears,
          difficultyLevel: c.difficultyLevel,
        }));

        if (dbCourses && dbCourses.length > 0) {
          const mappedDb = dbCourses.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            durationYears: c.duration_years,
            difficultyLevel: c.difficulty_level,
          }));

          // Merge lists avoiding duplicates by name
          const merged = [...mappedDb];
          localCourses.forEach((lc) => {
            if (!merged.some((mc) => mc.name.toLowerCase() === lc.name.toLowerCase())) {
              merged.push(lc);
            }
          });
          setCourses(merged);
        } else {
          setCourses(localCourses);
        }
      } catch (err) {
        console.error('Error fetching courses list:', err);
        // Fallback to local
        setCourses(
          PREDEFINED_COURSES.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            durationYears: c.durationYears,
            difficultyLevel: c.difficultyLevel,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col justify-between overflow-x-hidden bg-slate-950 font-sans text-white">
      <Navbar />

      <main className="relative flex-grow px-4 pt-28 pb-20">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute top-12 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-24 h-96 w-96 translate-x-1/2 rounded-full bg-purple-500/10 blur-[150px]" />

        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header section */}
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Academic Courses Catalog
            </h1>
            <p className="text-sm text-slate-400">
              Browse through our premium courses curriculum, eligibility requirements, entrance
              exams, and college options.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mx-auto max-w-md md:mx-0">
            <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses (e.g. Computer Science, MBBS...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/30 py-3 pr-4 pl-11 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <span className="animate-pulse text-xs text-slate-500">
                Loading courses directory...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.length === 0 ? (
                <div className="border-slate-850 col-span-full rounded-2xl border bg-slate-900/10 p-12 text-center text-slate-500">
                  No courses found matching your search query. Try another keyword.
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/10 p-6 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/20"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-indigo-400">
                          <Clock className="mr-0.5 h-3 w-3" />
                          {course.durationYears} Years
                        </span>
                        <span className="text-[9px] font-extrabold tracking-wider text-slate-500 uppercase">
                          {course.difficultyLevel}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-white transition-colors group-hover:text-indigo-400">
                          {course.name}
                        </h3>
                        <p className="line-clamp-2 text-xs leading-normal text-slate-400">
                          {course.description}
                        </p>
                      </div>
                    </div>
                    <div className="pt-6">
                      <Link href={`/courses/${course.id}`}>
                        <Button className="flex w-full items-center justify-center gap-1 bg-slate-900 text-xs font-bold text-slate-300 transition-all hover:bg-indigo-600 hover:text-white">
                          View Syllabus & Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
