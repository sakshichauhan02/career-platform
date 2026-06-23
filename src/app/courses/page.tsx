'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Clock,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  BookOpen,
  Tag,
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { PREDEFINED_COURSES } from '@/services/recommendationEngine';

interface EnhancedCourse {
  id: string;
  name: string;
  description: string;
  durationYears: number;
  difficultyLevel: string;
  tags: string[];
  semanticKeywords: string[];
}

// Enrich course data with auto-tagging and semantic keywords structure
function enrichCourse(c: any): EnhancedCourse {
  const name = c.name || '';
  const desc = c.description || '';
  const nameLower = name.toLowerCase();
  const descLower = desc.toLowerCase();
  
  // 1. Auto-tagging based on keywords
  const tags: string[] = [];
  
  const techKeywords = ['ai', 'software', 'programming', 'coding', 'data', 'computer', 'cloud', 'cybersecurity', 'developer', 'network', 'web', 'tech', 'astrophysics', 'space', 'algorithmic', 'quantitative', 'engineering', 'infrastructure', 'forensics', 'systems'];
  const healthKeywords = ['medicine', 'healthcare', 'biology', 'clinical', 'mbbs', 'pharma', 'genetics', 'biotech', 'anatomy', 'psychology', 'therapy', 'counseling', 'biological', 'biomedical'];
  const businessKeywords = ['business', 'admin', 'mba', 'startup', 'management', 'entrepreneur', 'marketing', 'pr', 'commerce', 'finance', 'economics', 'accounting', 'audit', 'wealth', 'investment', 'banking', 'esg', 'corporate'];
  const lawKeywords = ['law', 'civil', 'legal', 'policy', 'advocate', 'corporate counsel', 'llb', 'humanities', 'regulation', 'compliance', 'justice'];
  const designKeywords = ['design', 'art', 'ui/ux', 'creative', 'media', 'writing', 'journalism', 'sketch', 'sculpt', 'photography', 'videography', 'blogging', 'storytelling', 'aesthetics', 'broadcasting'];

  if (techKeywords.some(k => nameLower.includes(k) || descLower.includes(k))) {
    tags.push('Technology');
  }
  if (healthKeywords.some(k => nameLower.includes(k) || descLower.includes(k))) {
    tags.push('Healthcare & Sciences');
  }
  if (businessKeywords.some(k => nameLower.includes(k) || descLower.includes(k))) {
    tags.push('Business & Finance');
  }
  if (lawKeywords.some(k => nameLower.includes(k) || descLower.includes(k))) {
    tags.push('Law & Humanities');
  }
  if (designKeywords.some(k => nameLower.includes(k) || descLower.includes(k))) {
    tags.push('Design & Media');
  }
  
  if (tags.length === 0) {
    tags.push('General');
  }

  // 2. Semantic keywords generation for future vector/semantic search indexing
  const semanticKeywordsSet = new Set<string>();
  
  // Tokenize and clean name/description
  const words = `${name} ${desc}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  words.forEach(w => semanticKeywordsSet.add(w));
  
  // Add conceptual synonyms/related terms
  if (tags.includes('Technology')) {
    ['digital', 'automation', 'computers', 'computation', 'systems', 'information-technology', 'ml', 'ai-models', 'engineering', 'infrastructure', 'cloud-computing', 'security', 'networks'].forEach(s => semanticKeywordsSet.add(s));
  }
  if (tags.includes('Healthcare & Sciences')) {
    ['medical', 'doctor', 'treatment', 'health', 'bioscience', 'clinical-research', 'therapeutics', 'patient-care', 'well-being', 'genomics', 'molecular', 'pharma'].forEach(s => semanticKeywordsSet.add(s));
  }
  if (tags.includes('Business & Finance')) {
    ['corporate', 'administration', 'strategy', 'leadership', 'economics', 'financial-markets', 'accounting', 'investment-strategy', 'venture-capital', 'enterprise', 'management', 'marketing', 'valuation'].forEach(s => semanticKeywordsSet.add(s));
  }
  if (tags.includes('Law & Humanities')) {
    ['jurisprudence', 'legal-frameworks', 'public-policy', 'advocacy', 'regulation', 'compliance', 'justice', 'social-sciences', 'constitution', 'litigation'].forEach(s => semanticKeywordsSet.add(s));
  }
  if (tags.includes('Design & Media')) {
    ['creative-arts', 'usability', 'user-experience', 'graphic-design', 'communication', 'broadcasting', 'content-creation', 'aesthetics', 'interaction', 'journalism', 'multimedia'].forEach(s => semanticKeywordsSet.add(s));
  }

  return {
    id: c.id,
    name,
    description: desc,
    durationYears: Number(c.durationYears || c.duration_years || 3),
    difficultyLevel: c.difficultyLevel || c.difficulty_level || 'Beginner',
    tags,
    semanticKeywords: Array.from(semanticKeywordsSet),
  };
}

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<EnhancedCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const coursesPerPage = 9;

  const categories = [
    'All',
    'Technology',
    'Healthcare & Sciences',
    'Business & Finance',
    'Law & Humanities',
    'Design & Media',
    'General',
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Fetch custom courses from Supabase
        const { data: dbCourses } = await supabase.from('courses').select('*');

        // Map local predefined courses
        const localCourses = PREDEFINED_COURSES.map((c) => enrichCourse(c));

        if (dbCourses && dbCourses.length > 0) {
          const mappedDb = dbCourses.map((c: any) => enrichCourse(c));

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
        setCourses(PREDEFINED_COURSES.map((c) => enrichCourse(c)));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on category, difficulty, duration, and optimized search query
  const filteredCourses = courses.filter((c) => {
    // 1. Category Filter
    const matchesCategory =
      selectedCategory === 'All' || c.tags.includes(selectedCategory);

    // 2. Difficulty Filter
    const matchesDifficulty =
      selectedDifficulty === 'All' ||
      c.difficultyLevel.toLowerCase() === selectedDifficulty.toLowerCase();

    // 3. Duration Filter
    const matchesDuration =
      selectedDuration === 'All' ||
      c.durationYears.toString() === selectedDuration;

    // 4. Optimized Search Query (Matches name, description, tags, and semantic keywords)
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.tags.some((t) => t.toLowerCase().includes(query)) ||
      c.semanticKeywords.some((k) => k.includes(query)) ||
      c.difficultyLevel.toLowerCase().includes(query);

    return matchesCategory && matchesDifficulty && matchesDuration && matchesSearch;
  });

  // Reset to page 1 when any filter changes to prevent page index overflow
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedDuration]);

  // Calculate pagination values (Support for 500+ courses)
  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Technology':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Healthcare & Sciences':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Business & Finance':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Law & Humanities':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Design & Media':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col justify-between overflow-x-hidden font-sans">
      <Navbar />

      <main className="relative flex-grow px-4 pt-28 pb-20">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute top-12 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-24 h-96 w-96 translate-x-1/2 rounded-full bg-blue-500/5 blur-[150px]" />

        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header section */}
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Academic Courses Catalog
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Browse through our premium courses curriculum, eligibility requirements, entrance
              exams, and college options. Support for advanced filtering, semantic-keyword search, and 500+ records.
            </p>
          </div>

          {/* Search, Filter Toggle, and Category Scroll */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses by name, description, tags, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-border w-full rounded-xl border bg-white py-3 pr-4 pl-11 text-xs text-slate-950 placeholder-slate-400 transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Filter toggle button */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 rounded-xl border px-4 py-3 text-xs font-bold transition-all shadow-sm ${
                  showFilters
                    ? 'bg-primary text-white border-primary hover:bg-primary/90'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>

            {/* Advanced Filters Drawer */}
            {showFilters && (
              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
                {/* Difficulty Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Difficulty Level
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-primary"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Duration Filter */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Study Duration (Years)
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-primary"
                  >
                    <option value="All">All Durations</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                  </select>
                </div>
              </div>
            )}

            {/* Category horizontal scroll tabs */}
            <div className="no-scrollbar -mx-4 flex overflow-x-auto px-4 py-1 gap-2 md:mx-0 md:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all shadow-sm ${
                    selectedCategory === cat
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'All' ? 'All Pathways' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Found <strong>{totalCourses}</strong> courses{' '}
              {selectedCategory !== 'All' && (
                <span>
                  in <strong>{selectedCategory}</strong>
                </span>
              )}
            </span>
            {totalPages > 1 && (
              <span>
                Showing <strong>{indexOfFirstCourse + 1}</strong> -{' '}
                <strong>{Math.min(indexOfLastCourse, totalCourses)}</strong>
              </span>
            )}
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="animate-pulse text-xs font-bold text-slate-400">
                Loading optimized directory...
              </span>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentCourses.length === 0 ? (
                  <div className="border-border col-span-full rounded-3xl border bg-white p-12 text-center text-slate-550 shadow-sm">
                    No courses found matching your active filters. Try resetting search query or filters.
                  </div>
                ) : (
                  currentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="group border-border flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 rounded bg-primary/5 px-2.5 py-1 text-[10px] font-bold text-primary">
                            <Clock className="mr-0.5 h-3 w-3" />
                            {course.durationYears} Years
                          </span>
                          <span className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase">
                            {course.difficultyLevel}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-2">
                          <h3 className="text-base font-extrabold text-slate-950 transition-colors group-hover:text-primary">
                            {course.name}
                          </h3>
                          <p className="line-clamp-2 text-xs leading-normal font-medium text-slate-500">
                            {course.description}
                          </p>
                        </div>

                        {/* Auto-generated Category Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {course.tags.map((t) => (
                            <span
                              key={t}
                              className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold transition-colors ${getTagColor(
                                t
                              )}`}
                            >
                              <Tag className="h-2 w-2" />
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Button */}
                      <div className="pt-6">
                        <Link href={`/courses/${course.id}`}>
                          <Button className="flex w-full items-center justify-center gap-1 rounded-full bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-primary hover:text-white hover:shadow-md">
                            View Syllabus & Details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls (Support 500+ Courses) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Only show first page, last page, current page, and surrounding pages if many pages exist
                    if (
                      totalPages > 5 &&
                      page !== 1 &&
                      page !== totalPages &&
                      Math.abs(page - currentPage) > 1
                    ) {
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={`dots-${page}`} className="px-1.5 text-xs text-slate-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          currentPage === page
                            ? 'bg-primary text-white shadow-sm'
                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
