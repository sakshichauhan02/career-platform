'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Trophy,
  MapPin,
  Building2,
  Ticket,
  DollarSign,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Sliders,
  Sparkles,
  Lock,
  Brain,
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { AssessmentData } from '@/types/assessment';
import { ScoredCourse } from '@/services/recommendationEngine';

interface College {
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

export default function CollegesCatalogPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [coursesList, setCoursesList] = useState<string[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Quiz results state for AI Match Scoring
  const [profile, setProfile] = useState<(AssessmentData & { id?: string; name?: string; email?: string }) | null>(null);
  const [recommendations, setRecommendations] = useState<ScoredCourse[]>([]);
  const [hasQuizResults, setHasQuizResults] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [maxBudget, setMaxBudget] = useState<number>(2500000);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Sorting (Add fitScore)
  const [sortBy, setSortBy] = useState<'feesAsc' | 'feesDesc' | 'ranking' | 'relevance' | 'fitScore'>('ranking');

  // Mobile Filter Panel Toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load quiz results client-side on mount
  useEffect(() => {
    const localData = localStorage.getItem('pathway_latest_results');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.profile) {
          setProfile(parsed.profile);
          setHasQuizResults(true);
          setSortBy('fitScore'); // Automatically sort by AI Fit Match Score if results exist!
        }
        if (parsed.recommendations) {
          setRecommendations(parsed.recommendations);
        }
      } catch (err) {
        console.error('Error loading quiz results in colleges explorer:', err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCollegesData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/colleges');
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data as College[];
          setColleges(data);

          // Extract unique filters
          const courses = new Set<string>();
          const states = new Set<string>();
          const cities = new Set<string>();

          data.forEach((col) => {
            if (col.state) states.add(col.state);
            if (col.location) cities.add(col.location);
            if (col.courses_offered) {
              col.courses_offered.forEach((c) => {
                courses.add(c.course_name);
              });
            }
          });

          setCoursesList(Array.from(courses).sort());
          setStatesList(Array.from(states).sort());
          setCitiesList(Array.from(cities).sort());
        }
      } catch (err) {
        console.error('Error fetching colleges listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegesData();
  }, []);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCourse('All');
    setMaxBudget(2500000);
    setSelectedState('All');
    setSelectedCity('All');
    setSelectedType('All');
    setSortBy('ranking');
  };

  // Dynamic personalized AI Fit Match Score calculation (0% to 100%)
  const calculateFitScore = (col: College): number => {
    // 1. Budget Match (25% Weight)
    let budgetScore = 100;
    let targetBudget = maxBudget;
    
    if (profile?.budget) {
      const b = profile.budget;
      if (b === 'under_1l') targetBudget = 100000;
      else if (b === '1l_3l') targetBudget = 300000;
      else if (b === '3l_5l') targetBudget = 500000;
      else if (b === '5l_10l') targetBudget = 1000000;
      else if (b === 'above_10l') targetBudget = 2500000;
    }

    if (col.fees_annual <= targetBudget) {
      budgetScore = 100;
    } else {
      const overBudget = col.fees_annual - targetBudget;
      budgetScore = Math.max(0, 100 - (overBudget / targetBudget) * 100);
    }

    // 2. Location Match (25% Weight)
    let locationScore = 100;
    const targetState = selectedState;
    const targetCity = selectedCity;

    if (targetState !== 'All' || targetCity !== 'All') {
      let stateMatch = true;
      let cityMatch = true;

      if (targetState !== 'All') {
        stateMatch = col.state.toLowerCase() === targetState.toLowerCase();
      }
      if (targetCity !== 'All') {
        cityMatch = col.location.toLowerCase() === targetCity.toLowerCase();
      }

      if (stateMatch && cityMatch) {
        locationScore = 100;
      } else if (stateMatch) {
        locationScore = 70;
      } else {
        locationScore = 20;
      }
    } else {
      locationScore = 100;
    }

    // 3. Recommended Course Match (30% Weight)
    let courseScore = 0;
    
    if (hasQuizResults && recommendations.length > 0) {
      const topRecommendations = recommendations.map((r) => r.course.name.toLowerCase());
      const offeredNames = col.courses_offered.map((co) => co.course_name.toLowerCase());
      
      let bestMatchIdx = -1;
      for (let i = 0; i < topRecommendations.length; i++) {
        if (offeredNames.some((o) => o.includes(topRecommendations[i]) || topRecommendations[i].includes(o))) {
          bestMatchIdx = i;
          break;
        }
      }

      if (bestMatchIdx === 0) {
        courseScore = 100;
      } else if (bestMatchIdx === 1) {
        courseScore = 85;
      } else if (bestMatchIdx === 2) {
        courseScore = 70;
      } else {
        const stream = profile?.stream || 'general';
        const streamKeywords: Record<string, string[]> = {
          pcm: ['computer science', 'engineering', 'technology', 'physics', 'astrophysics', 'mathematics'],
          pcb: ['medicine', 'healthcare', 'biology', 'clinical', 'pharmacy', 'biotechnology', 'nursing'],
          commerce: ['chartered accountancy', 'accounting', 'finance', 'economics', 'business', 'management'],
          arts: ['design', 'art', 'ui/ux', 'media', 'writing', 'psychology', 'law', 'civil services'],
        };

        const keywords = streamKeywords[stream as string] || [];
        const hasStreamMatch = col.courses_offered.some((co) => 
          keywords.some((kw) => co.course_name.toLowerCase().includes(kw) || co.specialization.toLowerCase().includes(kw))
        );

        if (hasStreamMatch) {
          courseScore = 50;
        } else {
          courseScore = 20;
        }
      }
    } else {
      if (selectedCourse !== 'All') {
        const matches = col.courses_offered.some((c) => c.course_name === selectedCourse);
        courseScore = matches ? 100 : 20;
      } else {
        courseScore = 100;
      }
    }

    // 4. Student Priorities Match (20% Weight)
    let priorityScore = 100;
    if (profile?.priorities && profile.priorities.length > 0) {
      let totalPriorityMatch = 0;
      profile.priorities.forEach((p) => {
        let match = 50;
        if (p === 'prestige_status') {
          match = col.ranking ? (col.ranking <= 5 ? 100 : col.ranking <= 15 ? 80 : 50) : 40;
        } else if (p === 'stability_security') {
          match = col.type === 'Government' ? 100 : 50;
        } else if (p === 'high_salary') {
          match = col.ranking ? (col.ranking <= 10 ? 100 : col.ranking <= 25 ? 85 : 60) : 50;
        } else if (p === 'social_impact') {
          const hasImpact = col.courses_offered.some((co) => 
            co.course_name.toLowerCase().includes('medicine') || 
            co.course_name.toLowerCase().includes('healthcare') || 
            co.course_name.toLowerCase().includes('public policy') || 
            co.course_name.toLowerCase().includes('social')
          );
          match = hasImpact ? 100 : 50;
        } else if (p === 'global_mobility') {
          const hasGlobalExams = col.entrance_exams.some((exam) => 
            ['SAT', 'GMAT', 'GRE', 'TOEFL', 'IELTS'].includes(exam.toUpperCase())
          );
          match = (hasGlobalExams || (col.ranking && col.ranking <= 5)) ? 100 : 50;
        } else if (p === 'creative_freedom') {
          const hasCreative = col.courses_offered.some((co) => 
            co.course_name.toLowerCase().includes('design') || 
            co.course_name.toLowerCase().includes('art') || 
            co.course_name.toLowerCase().includes('creative') || 
            co.course_name.toLowerCase().includes('media')
          );
          match = hasCreative ? 100 : 50;
        }
        totalPriorityMatch += match;
      });
      priorityScore = totalPriorityMatch / profile.priorities.length;
    }

    return Math.round(
      budgetScore * 0.25 +
      locationScore * 0.25 +
      courseScore * 0.30 +
      priorityScore * 0.20
    );
  };

  const filteredAndSortedColleges = colleges
    .filter((col) => {
      // 1. Search Query
      const matchesSearch =
        col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.state.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Course Offered
      const matchesCourse =
        selectedCourse === 'All' ||
        (col.courses_offered && col.courses_offered.some((c) => c.course_name === selectedCourse));

      // 3. Annual Budget
      const matchesBudget = col.fees_annual <= maxBudget;

      // 4. State
      const matchesState = selectedState === 'All' || col.state === selectedState;

      // 5. City
      const matchesCity = selectedCity === 'All' || col.location === selectedCity;

      // 6. College Type
      const matchesType = selectedType === 'All' || col.type === selectedType;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesBudget &&
        matchesState &&
        matchesCity &&
        matchesType
      );
    })
    .sort((a, b) => {
      if (sortBy === 'fitScore') {
        const scoreA = calculateFitScore(a);
        const scoreB = calculateFitScore(b);
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }
        return (a.ranking || 9999) - (b.ranking || 9999);
      }
      if (sortBy === 'feesAsc') {
        return a.fees_annual - b.fees_annual;
      }
      if (sortBy === 'feesDesc') {
        return b.fees_annual - a.fees_annual;
      }
      if (sortBy === 'ranking') {
        const rankA = a.ranking || 9999;
        const rankB = b.ranking || 9999;
        return rankA - rankB;
      }
      if (sortBy === 'relevance') {
        const query = searchQuery.toLowerCase();
        if (!query) return (a.ranking || 9999) - (b.ranking || 9999);
        const aScore =
          (a.name.toLowerCase().includes(query) ? 3 : 0) +
          (a.location.toLowerCase().includes(query) ? 1 : 0);
        const bScore =
          (b.name.toLowerCase().includes(query) ? 3 : 0) +
          (b.location.toLowerCase().includes(query) ? 1 : 0);
        return bScore - aScore;
      }
      return 0;
    });

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col justify-between overflow-x-hidden font-sans">
      <Navbar />

      <main className="relative flex-grow px-4 pt-28 pb-20">
        {/* Glows */}
        <div className="pointer-events-none absolute top-12 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-24 h-96 w-96 translate-x-1/2 rounded-full bg-blue-500/5 blur-[150px]" />

        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-2 text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                College Explorer
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Filter and sort colleges dynamically to find the perfect campus within your budget
                and target course stream.
              </p>
            </div>

            {/* Reset Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-1.5 self-start rounded-full border-slate-200 bg-white text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 md:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset All Filters
            </Button>
          </div>

          {/* Main Workspace */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* 1. Left Sidebar Filters (Desktop View) */}
            <div className="border-border hidden h-fit space-y-5 rounded-3xl border bg-white p-5 shadow-sm lg:col-span-1 lg:block">
              <div className="border-border flex items-center gap-2 border-b pb-3 text-sm font-bold text-slate-900">
                <Filter className="h-4.5 w-4.5 text-primary" />
                Filter Controls
              </div>

              {/* AI Fit Personalization Widget */}
              {hasQuizResults ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2.5 shadow-inner">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-extrabold tracking-wider text-emerald-850 uppercase">
                      AI Fit Active
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-emerald-900 font-medium">
                    <p className="line-clamp-2">🎯 <strong className="font-bold">Target Course:</strong> {recommendations[0]?.course.name}</p>
                    <p>💰 <strong className="font-bold">Budget Tiers:</strong> {profile?.budget.replace('_', ' ').replace('under ', '< ').replace('above ', '> ')}</p>
                  </div>
                  <Link href="/quiz" className="block">
                    <Button variant="outline" className="w-full h-8 rounded-xl border-emerald-200 bg-white hover:bg-emerald-50 text-[10px] font-bold text-emerald-700 transition-colors">
                      Retake Career Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2.5 shadow-inner">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4.5 w-4.5 text-primary animate-pulse" />
                    <span className="text-[10px] font-extrabold tracking-wider text-primary uppercase">
                      AI Fit Match Locked
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                    Unlock personalized match scoring based on your budget, location, and recommended pathways.
                  </p>
                  <Link href="/quiz" className="block">
                    <Button className="w-full h-8 rounded-xl bg-primary hover:bg-primary/90 text-[10px] font-bold text-white shadow-sm transition-all hover:shadow-md">
                      Take 5-Min Career Quiz
                    </Button>
                  </Link>
                </div>
              )}

              {/* Course Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold tracking-wider text-slate-400 uppercase">
                  Courses Offered
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="border-border w-full rounded-xl border bg-slate-50 p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Courses</option>
                  {coursesList.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Slider */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold tracking-wider uppercase">
                  <span className="text-slate-400">Max Annual Fees</span>
                  <span className="text-primary">₹{(maxBudget / 100000).toFixed(1)} L</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={2500000}
                  step={20000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary"
                />
              </div>

              {/* State Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold tracking-wider text-slate-400 uppercase">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="border-border w-full rounded-xl border bg-slate-50 p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All States</option>
                  {statesList.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold tracking-wider text-slate-400 uppercase">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="border-border w-full rounded-xl border bg-slate-50 p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Cities</option>
                  {citiesList.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* College Type Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold tracking-wider text-slate-400 uppercase">
                  College Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border-border w-full rounded-xl border bg-slate-50 p-2.5 text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Types</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>

            {/* 2. Colleges Display Area (Right Pane) */}
            <div className="space-y-6 lg:col-span-3">
              {/* Search, Sort and Mobile Filter Toggles Toolbar */}
              <div className="border-border flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                {/* Search Bar */}
                <div className="relative max-w-md flex-grow">
                  <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by college name, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-border w-full rounded-xl border bg-white py-2.5 pr-4 pl-11 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {/* Sorting controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Sort By:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="border-border rounded-xl border bg-white p-2 text-xs text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {hasQuizResults && (
                        <option value="fitScore">✨ AI Fit Match Score</option>
                      )}
                      <option value="ranking">Best Ranking First</option>
                      <option value="feesAsc">Fees: Low to High</option>
                      <option value="feesDesc">Fees: High to Low</option>
                      <option value="relevance">Search Relevance</option>
                    </select>
                  </div>

                  {/* Mobile Filters Toggle Button */}
                  <Button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="border-border flex items-center gap-1.5 rounded-xl border bg-white text-xs text-slate-600 shadow-sm hover:bg-slate-50 lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Mobile Collapsible Filter Panel */}
              {showMobileFilters && (
                <div className="animate-in fade-in slide-in-from-top border-border space-y-4 rounded-3xl border bg-white p-5 shadow-lg duration-300 lg:hidden">
                  <div className="border-border flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Mobile Filter Panel
                    </span>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-xs text-slate-400 hover:text-slate-900"
                    >
                      Close
                    </button>
                  </div>

                  {/* Mobile AI Fit Personalization Widget */}
                  {hasQuizResults ? (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2.5 shadow-inner">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-extrabold tracking-wider text-emerald-850 uppercase">
                          AI Fit Active
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] text-emerald-900 font-medium">
                        <p className="line-clamp-2">🎯 <strong className="font-bold">Target Course:</strong> {recommendations[0]?.course.name}</p>
                        <p>💰 <strong className="font-bold">Budget Tiers:</strong> {profile?.budget.replace('_', ' ').replace('under ', '< ').replace('above ', '> ')}</p>
                      </div>
                      <Link href="/quiz" className="block">
                        <Button variant="outline" className="w-full h-8 rounded-xl border-emerald-200 bg-white hover:bg-emerald-50 text-[10px] font-bold text-emerald-700 transition-colors">
                          Retake Career Quiz
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2.5 shadow-inner">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4.5 w-4.5 text-primary animate-pulse" />
                        <span className="text-[10px] font-extrabold tracking-wider text-primary uppercase">
                          AI Fit Match Locked
                        </span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-slate-600 font-medium">
                        Unlock personalized match scoring based on your budget, location, and recommended pathways.
                      </p>
                      <Link href="/quiz" className="block">
                        <Button className="w-full h-8 rounded-xl bg-primary hover:bg-primary/90 text-[10px] font-bold text-white shadow-sm transition-all hover:shadow-md">
                          Take 5-Min Career Quiz
                    </Button>
                      </Link>
                    </div>
                  )}

                  {/* Course */}
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-400 uppercase">Courses</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="border-border w-full rounded-xl border bg-slate-50 p-2 text-slate-900 outline-none focus:border-primary"
                    >
                      <option value="All">All Courses</option>
                      {coursesList.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-400">Max Fees</span>
                      <span className="text-primary">₹{(maxBudget / 100000).toFixed(1)} Lakh</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={2500000}
                      step={20000}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-400 uppercase">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="border-border w-full rounded-xl border bg-slate-50 p-2 text-slate-900 outline-none focus:border-primary"
                    >
                      <option value="All">All States</option>
                      {statesList.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-400 uppercase">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="border-border w-full rounded-xl border bg-slate-50 p-2 text-slate-900 outline-none focus:border-primary"
                    >
                      <option value="All">All Cities</option>
                      {citiesList.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-400 uppercase">College Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="border-border w-full rounded-xl border bg-slate-50 p-2 text-slate-900 outline-none focus:border-primary"
                    >
                      <option value="All">All Types</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Loader */}
              {loading ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <span className="animate-pulse text-xs font-bold text-slate-400">
                    Loading listings...
                  </span>
                </div>
              ) : (
                /* Grid listing of colleges */
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredAndSortedColleges.length === 0 ? (
                    <div className="border-border col-span-full rounded-3xl border bg-white p-12 text-center text-slate-500">
                      No colleges found matching the active explorer filters.
                      <button
                        onClick={resetFilters}
                        className="mx-auto mt-3 block text-xs font-bold text-primary hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  ) : (
                    filteredAndSortedColleges.map((col) => {
                      const fitScore = calculateFitScore(col);
                      return (
                        <div
                          key={col.id}
                          className="group border-border flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold ${
                                  col.type === 'Government'
                                    ? 'border border-emerald-100 bg-emerald-50 text-emerald-600'
                                    : 'border border-blue-100 bg-blue-50 text-primary'
                                }`}
                              >
                                {col.type}
                              </span>
                              
                              {/* Personalized AI Fit Match Score Badge */}
                              {hasQuizResults ? (
                                <span
                                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border shadow-sm ${
                                    fitScore >= 85
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                      : fitScore >= 70
                                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                                      : 'bg-slate-50 text-slate-600 border-slate-100'
                                  }`}
                                >
                                  <Sparkles className="h-3 w-3 text-amber-500" />
                                  {fitScore}% Match
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                  <Lock className="h-2.5 w-2.5" />
                                  {fitScore}% Fit (Est.)
                                </span>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <h3 className="text-base font-extrabold text-slate-950 transition-colors group-hover:text-primary">
                                {col.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                  {col.location}, {col.state}
                                </span>
                                {col.ranking && (
                                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 border-l border-slate-200 pl-3">
                                    <Trophy className="h-3 w-3 text-amber-500/85" />
                                    National Rank: #{col.ranking}
                                  </span>
                                )}
                              </div>
                            </div>

                          <div className="border-border grid grid-cols-2 gap-3 border-y py-3 text-[10px]">
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1 font-bold text-slate-400 uppercase">
                                <DollarSign className="h-3 w-3 text-primary" />
                                Annual Fees
                              </span>
                              <span className="font-bold text-slate-700">
                                ₹{col.fees_annual.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1 font-bold text-slate-400 uppercase">
                                <Ticket className="h-3 w-3 text-primary" />
                                Entrance Exams
                              </span>
                              <span className="block truncate font-bold text-slate-700">
                                {col.entrance_exams.length > 0
                                  ? col.entrance_exams.join(', ')
                                  : 'Direct Entry'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="flex items-center gap-1 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                              <Building2 className="text-primary/90 h-3 w-3" />
                              Offered Programs
                            </span>
                            <div className="flex max-h-[50px] flex-wrap gap-1 overflow-y-auto">
                              {col.courses_offered && col.courses_offered.length > 0 ? (
                                col.courses_offered.map((spec, i) => (
                                  <span
                                    key={i}
                                    className="border-border rounded border bg-slate-50 px-2 py-0.5 text-[8px] font-semibold text-slate-600"
                                  >
                                    {spec.specialization} ({spec.course_name})
                                  </span>
                                ))
                              ) : (
                                <span className="text-[9px] text-slate-400 italic">
                                  No courses mapped.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          {col.website_url ? (
                            <a href={col.website_url} target="_blank" rel="noopener noreferrer">
                              <Button className="flex w-full items-center justify-center gap-1 rounded-full bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-primary hover:text-white hover:shadow-md">
                                Visit Website
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                          ) : (
                            <Button
                              disabled
                              className="border-border w-full rounded-full border bg-slate-100 text-xs font-bold text-slate-400"
                            >
                              Website Offline
                            </Button>
                          )}
                        </div>
                      </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
