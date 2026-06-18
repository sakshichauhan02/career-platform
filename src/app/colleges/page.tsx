'use client';

import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  ranking: number | null;
  fees_annual: number;
  type: string;
  entrance_exams: string[];
  website_url: string | null;
  courses_offered: { specialization: string; course_name: string }[];
}

export default function CollegesCatalogPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [coursesList, setCoursesList] = useState<string[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [maxBudget, setMaxBudget] = useState<number>(2500000);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Sorting
  const [sortBy, setSortBy] = useState<'feesAsc' | 'feesDesc' | 'ranking' | 'relevance'>('ranking');

  // Mobile Filter Panel Toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    <div className="flex min-h-screen flex-col justify-between overflow-x-hidden bg-slate-950 font-sans text-white">
      <Navbar />

      <main className="relative flex-grow px-4 pt-28 pb-20">
        {/* Glows */}
        <div className="pointer-events-none absolute top-12 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-24 h-96 w-96 translate-x-1/2 rounded-full bg-purple-500/10 blur-[150px]" />

        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-2 text-left">
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                College Explorer
              </h1>
              <p className="text-sm text-slate-400">
                Filter and sort colleges dynamically to find the perfect campus within your budget
                and target course stream.
              </p>
            </div>

            {/* Reset Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-1.5 self-start border-slate-800 text-xs font-bold text-slate-400 hover:bg-slate-900 md:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset All Filters
            </Button>
          </div>

          {/* Main Workspace */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* 1. Left Sidebar Filters (Desktop View) */}
            <div className="border-slate-850 hidden h-fit space-y-5 rounded-2xl border bg-slate-900/10 p-5 backdrop-blur-sm lg:col-span-1 lg:block">
              <div className="border-slate-850 flex items-center gap-2 border-b pb-3 text-sm font-bold text-white">
                <Filter className="h-4.5 w-4.5 text-indigo-400" />
                Filter Controls
              </div>

              {/* Course Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold tracking-wider text-slate-500 uppercase">
                  Courses Offered
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-500"
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
                  <span className="text-slate-500">Max Annual Fees</span>
                  <span className="text-indigo-400">₹{(maxBudget / 100000).toFixed(1)} L</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={2500000}
                  step={20000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500"
                />
              </div>

              {/* State Selector */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold tracking-wider text-slate-500 uppercase">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-500"
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
                <label className="font-bold tracking-wider text-slate-500 uppercase">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-500"
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
                <label className="font-bold tracking-wider text-slate-500 uppercase">
                  College Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-white outline-none focus:border-indigo-500"
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
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                {/* Search Bar */}
                <div className="relative max-w-md flex-grow">
                  <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by college name, city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/30 py-2.5 pr-4 pl-11 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {/* Sorting controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                      Sort By:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="rounded-lg border border-slate-800 bg-slate-900/40 p-2 text-xs text-white outline-none focus:border-indigo-500"
                    >
                      <option value="ranking">Best Ranking First</option>
                      <option value="feesAsc">Fees: Low to High</option>
                      <option value="feesDesc">Fees: High to Low</option>
                      <option value="relevance">Search Relevance</option>
                    </select>
                  </div>

                  {/* Mobile Filters Toggle Button */}
                  <Button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center gap-1.5 border border-slate-800 bg-slate-900/30 text-xs text-slate-300 hover:bg-slate-900 lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Mobile Collapsible Filter Panel */}
              {showMobileFilters && (
                <div className="animate-in fade-in slide-in-from-top space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 duration-300 lg:hidden">
                  <div className="border-slate-850 flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-white uppercase">
                      Mobile Filter Panel
                    </span>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Close
                    </button>
                  </div>

                  {/* Course */}
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-500 uppercase">Courses</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-white"
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
                      <span className="text-slate-500">Max Fees</span>
                      <span className="text-indigo-400">
                        ₹{(maxBudget / 100000).toFixed(1)} Lakh
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={2500000}
                      step={20000}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-500 uppercase">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-white"
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
                    <label className="font-bold text-slate-500 uppercase">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-white"
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
                    <label className="font-bold text-slate-500 uppercase">College Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-white"
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
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                  <span className="animate-pulse text-xs text-slate-500">Loading listings...</span>
                </div>
              ) : (
                /* Grid listing of colleges */
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredAndSortedColleges.length === 0 ? (
                    <div className="border-slate-850 col-span-full rounded-2xl border bg-slate-900/10 p-12 text-center text-slate-500">
                      No colleges found matching the active explorer filters.
                      <button
                        onClick={resetFilters}
                        className="mx-auto mt-3 block text-xs font-bold text-indigo-400 hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  ) : (
                    filteredAndSortedColleges.map((col) => (
                      <div
                        key={col.id}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/10 p-6 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/20"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold ${
                                col.type === 'Government'
                                  ? 'border border-emerald-500/15 bg-emerald-500/10 text-emerald-400'
                                  : 'border border-indigo-500/15 bg-indigo-500/10 text-indigo-400'
                              }`}
                            >
                              {col.type}
                            </span>
                            {col.ranking && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                                <Trophy className="h-3 w-3" />
                                Rank #{col.ranking}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-white transition-colors group-hover:text-indigo-400">
                              {col.name}
                            </h3>
                            <p className="flex items-center gap-1 text-xs text-slate-400">
                              <MapPin className="h-3.5 w-3.5 text-slate-500" />
                              {col.location}, {col.state}
                            </p>
                          </div>

                          <div className="border-slate-850 grid grid-cols-2 gap-3 border-y py-3 text-[10px]">
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1 font-bold text-slate-500 uppercase">
                                <DollarSign className="h-3 w-3 text-indigo-400" />
                                Annual Fees
                              </span>
                              <span className="font-bold text-slate-200">
                                ₹{col.fees_annual.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1 font-bold text-slate-500 uppercase">
                                <Ticket className="h-3 w-3 text-indigo-400" />
                                Entrance Exams
                              </span>
                              <span className="block truncate font-bold text-slate-200">
                                {col.entrance_exams.length > 0
                                  ? col.entrance_exams.join(', ')
                                  : 'Direct Entry'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-slate-500 uppercase">
                              <Building2 className="h-3 w-3 text-indigo-400" />
                              Offered Programs
                            </span>
                            <div className="flex max-h-[50px] flex-wrap gap-1 overflow-y-auto">
                              {col.courses_offered && col.courses_offered.length > 0 ? (
                                col.courses_offered.map((spec, i) => (
                                  <span
                                    key={i}
                                    className="rounded border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-[8px] text-slate-400"
                                  >
                                    {spec.specialization} ({spec.course_name})
                                  </span>
                                ))
                              ) : (
                                <span className="text-[9px] text-slate-500 italic">
                                  No courses mapped.
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-6">
                          {col.website_url ? (
                            <a href={col.website_url} target="_blank" rel="noopener noreferrer">
                              <Button className="flex w-full items-center justify-center gap-1 bg-slate-900 text-xs font-bold text-slate-300 transition-all hover:bg-indigo-600 hover:text-white">
                                Visit Website
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                          ) : (
                            <Button
                              disabled
                              className="w-full border border-slate-800 bg-slate-900 text-xs font-bold text-slate-500"
                            >
                              Website Offline
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
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
