'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Users,
  FileText,
  UserCheck,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Shield,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Assessment Lead' | 'Report Lead' | 'Mentor Lead';
  details: string;
  created_at: string;
  status: 'New' | 'Contacted' | 'Interested' | 'Converted' | 'Lost';
  notes: string;
}

const MOCK_LEADS: Lead[] = [
  {
    id: 'l-mock-1',
    name: 'Saksham Gupta',
    email: 'saksham@gmail.com',
    phone: '+91 98765 43210',
    type: 'Mentor Lead',
    details: 'Booked 1:1 Advising call on 2026-06-25 at 10:00 AM',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Contacted',
    notes: 'Called on 18th June. He is interested in engineering options.',
  },
  {
    id: 'l-mock-2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 99999 88888',
    type: 'Report Lead',
    details: 'Unlocked Premium Report. PDF Downloaded 2 times.',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    status: 'New',
    notes: '',
  },
  {
    id: 'l-mock-3',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+91 88888 77777',
    type: 'Assessment Lead',
    details: 'Completed Quiz: 12th PCB (Biology/Chemistry stream)',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'Interested',
    notes: 'Highly interested in medical design tools. Schedule call next week.',
  },
  {
    id: 'l-mock-4',
    name: 'Aman Sharma',
    email: 'aman.sharma@example.com',
    phone: '+91 77777 55555',
    type: 'Assessment Lead',
    details: 'Completed Quiz: 12th PCM (Maths/Physics stream)',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'New',
    notes: '',
  },
  {
    id: 'l-mock-5',
    name: 'Rohan Verma',
    email: 'rohan.v@example.com',
    phone: '+91 91111 22222',
    type: 'Report Lead',
    details: 'Unlocked Premium Report. Stored to Cloud Vault.',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'Lost',
    notes: 'Not interested in further advice.',
  },
];

export default function LeadCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'Assessment Lead' | 'Report Lead' | 'Mentor Lead'
  >('all');
  const [editingNotesLead, setEditingNotesLead] = useState<Lead | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSimulatingAdmin, setIsSimulatingAdmin] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  // Verify Admin Role on Mount
  useEffect(() => {
    setIsLocal(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

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

  const fetchLeadsData = async () => {
    setIsLoading(true);
    try {
      const mergedLeads: Lead[] = [];

      // 1. Fetch Follow-up states from Supabase
      const followupMap = new Map<string, { status: any; notes: string }>();
      try {
        const { data: followups } = await supabase
          .from('lead_followups')
          .select('lead_id, status, notes');
        if (followups) {
          followups.forEach((f: any) => {
            followupMap.set(f.lead_id, { status: f.status, notes: f.notes || '' });
          });
        }
      } catch (dbErr) {
        console.error('Failed to query lead_followups table:', dbErr);
      }

      // 2. Fetch local storage fallbacks for followups
      let localFollowups: Record<string, { status?: string; notes?: string }> = {};
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('lead_followups');
        if (local) {
          try {
            localFollowups = JSON.parse(local);
          } catch (_) {}
        }
      }

      const getFollowup = (leadId: string) => {
        const dbVal = followupMap.get(leadId);
        const localVal = localFollowups[leadId];
        return {
          status: (dbVal?.status || localVal?.status || 'New') as any,
          notes: dbVal?.notes || localVal?.notes || '',
        };
      };

      // 3. Fetch Assessment Leads
      const { data: assessments } = await supabase
        .from('assessment_responses')
        .select('id, completed_at, responses, profiles(email, full_name)');

      if (assessments) {
        assessments.forEach((a: any) => {
          const grade = a.responses?.grade || 'N/A';
          const { status, notes } = getFollowup(a.id);
          mergedLeads.push({
            id: a.id,
            name: a.profiles?.full_name || 'Student Guest',
            email: a.profiles?.email || 'N/A',
            phone: 'N/A', // phone not in profiles table
            type: 'Assessment Lead',
            details: `Completed Quiz: ${grade.replace('school_', '').replace('_', ' ').toUpperCase()}`,
            created_at: a.completed_at,
            status,
            notes,
          });
        });
      }

      // 4. Fetch Report Leads
      const { data: reports } = await supabase
        .from('report_downloads')
        .select('id, created_at, download_count, profiles(email, full_name)');

      if (reports) {
        reports.forEach((r: any) => {
          const { status, notes } = getFollowup(r.id);
          mergedLeads.push({
            id: r.id,
            name: r.profiles?.full_name || 'Student Guest',
            email: r.profiles?.email || 'N/A',
            phone: 'N/A',
            type: 'Report Lead',
            details: `Unlocked Premium PDF. Downloaded ${r.download_count || 0} times.`,
            created_at: r.created_at,
            status,
            notes,
          });
        });
      }

      // 5. Fetch Mentor Leads
      const { data: bookings } = await supabase
        .from('mentor_bookings')
        .select(
          'id, created_at, student_name, student_email, student_phone, booking_date, time_slot, profiles(email, full_name)'
        );

      if (bookings) {
        bookings.forEach((b: any) => {
          const { status, notes } = getFollowup(b.id);
          mergedLeads.push({
            id: b.id,
            name: b.student_name || b.profiles?.full_name || 'Guest Student',
            email: b.student_email || b.profiles?.email || 'N/A',
            phone: b.student_phone || 'N/A',
            type: 'Mentor Lead',
            details: `Booked 1:1 call on ${b.booking_date || 'N/A'} at ${b.time_slot || 'N/A'}`,
            created_at: b.created_at,
            status,
            notes,
          });
        });
      }

      if (mergedLeads.length > 0) {
        // Sort by created_at descending
        mergedLeads.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setLeads(mergedLeads);
      } else {
        // Hydrate mock data status/notes from localStorage if any
        const hydratedMock = MOCK_LEADS.map((l) => {
          const { status, notes } = getFollowup(l.id);
          return {
            ...l,
            status: status !== 'New' ? status : l.status,
            notes: notes !== '' ? notes : l.notes,
          };
        });
        setLeads(hydratedMock);
      }
    } catch (err) {
      console.error('Error fetching leads details:', err);
      // Fallback
      const hydratedMock = MOCK_LEADS.map((l) => {
        let localStatus = 'New';
        let localNotes = '';
        if (typeof window !== 'undefined') {
          const local = localStorage.getItem('lead_followups');
          if (local) {
            try {
              const parse = JSON.parse(local);
              if (parse[l.id]) {
                localStatus = parse[l.id].status || 'New';
                localNotes = parse[l.id].notes || '';
              }
            } catch (_) {}
          }
        }
        return {
          ...l,
          status: localStatus !== 'New' ? (localStatus as any) : l.status,
          notes: localNotes !== '' ? localNotes : l.notes,
        };
      });
      setLeads(hydratedMock);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, []);

  const handleUpdateStatus = async (
    leadId: string,
    newStatus: 'New' | 'Contacted' | 'Interested' | 'Converted' | 'Lost'
  ) => {
    // 1. Local state update
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));

    // 2. LocalStorage sync
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lead_followups');
      const data = local ? JSON.parse(local) : {};
      data[leadId] = { ...(data[leadId] || { notes: '' }), status: newStatus };
      localStorage.setItem('lead_followups', JSON.stringify(data));
    }

    // 3. Supabase upsert
    try {
      await supabase.from('lead_followups').upsert(
        {
          lead_id: leadId,
          status: newStatus,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'lead_id' }
      );
    } catch (err) {
      console.error('Failed to upsert status to Supabase:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotesLead) return;
    const leadId = editingNotesLead.id;

    // 1. Local state update
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, notes: tempNotes } : l)));

    // 2. LocalStorage sync
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lead_followups');
      const data = local ? JSON.parse(local) : {};
      data[leadId] = { ...(data[leadId] || { status: 'New' }), notes: tempNotes };
      localStorage.setItem('lead_followups', JSON.stringify(data));
    }

    // 3. Supabase upsert
    try {
      await supabase.from('lead_followups').upsert(
        {
          lead_id: leadId,
          notes: tempNotes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'lead_id' }
      );
    } catch (err) {
      console.error('Failed to upsert notes to Supabase:', err);
    }

    setEditingNotesLead(null);
  };

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = lead.name.toLowerCase().includes(query);
    const emailMatch = lead.email.toLowerCase().includes(query);
    const phoneMatch = lead.phone.includes(query);
    const detailsMatch = lead.details.toLowerCase().includes(query);
    const notesMatch = lead.notes.toLowerCase().includes(query);

    const typeMatch = typeFilter === 'all' || lead.type === typeFilter;

    return (nameMatch || emailMatch || phoneMatch || detailsMatch || notesMatch) && typeMatch;
  });

  const handleExportCSV = () => {
    // Generate CSV headers and rows
    const headers = [
      'Lead ID',
      'Student Name',
      'Email',
      'Phone',
      'Lead Type',
      'Details',
      'Follow-up Status',
      'Notes',
      'Created At',
    ];
    const rows = filteredLeads.map((l) => [
      l.id,
      l.name,
      l.email,
      l.phone,
      l.type,
      l.details.replace(/,/g, ';'), // prevent comma break issues in CSV
      l.status,
      l.notes.replace(/,/g, ';').replace(/\n/g, ' '),
      l.created_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PathwayAI_Leads_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const stats = {
    total: leads.length,
    assessments: leads.filter((l) => l.type === 'Assessment Lead').length,
    reports: leads.filter((l) => l.type === 'Report Lead').length,
    mentors: leads.filter((l) => l.type === 'Mentor Lead').length,
  };

  return (
    <div className="bg-background text-foreground selection:bg-primary/10 min-h-screen">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 pt-28 pb-12">
        {/* Top authorization simulation bar */}
        <div className="border-border bg-card mb-6 flex items-center justify-between rounded-2xl border p-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            {isAdmin || (isSimulatingAdmin && isLocal) ? (
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
          {!isAdmin && isLocal && (
            <button
              onClick={() => setIsSimulatingAdmin(!isSimulatingAdmin)}
              className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                isSimulatingAdmin
                  ? 'border border-rose-200 bg-rose-50 text-rose-700'
                  : 'bg-primary hover:bg-primary/95 text-white'
              }`}
            >
              {isSimulatingAdmin ? 'Disable Bypass' : 'Simulate Access'}
            </button>
          )}
        </div>

        {!isAdmin && !(isSimulatingAdmin && isLocal) ? (
          <div className="border-border bg-card mx-auto max-w-md rounded-3xl border p-8 text-center shadow-sm">
            <Shield className="text-muted-foreground/60 mx-auto mb-4 h-12 w-12 animate-pulse" />
            <h3 className="text-foreground mb-2 text-lg font-bold">
              Administrator access required
            </h3>
            <p className="text-muted-foreground mb-6 text-xs leading-relaxed">
              {isLocal ? (
                "You must be logged in as an administrator to access the Lead CRM. Use the simulation bypass toggle above to evaluate the dashboard."
              ) : (
                "You must be logged in as an administrator to access the Lead CRM."
              )}
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/95 w-full rounded-full text-white">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <Link
                  href="/admin"
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-medium"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Admin Console
                </Link>
                <h1 className="text-foreground text-3xl font-black tracking-tight">
                  Lead CRM Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">
                  Track conversion funnels. Monitor quiz submissions, report purchases, and advising
                  scheduler registrations.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-muted rounded-full text-xs font-semibold"
                >
                  <Download className="mr-1 h-3.5 w-3.5" /> Export filtered (CSV)
                </Button>
                <Button
                  onClick={fetchLeadsData}
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-muted rounded-full text-xs font-semibold"
                >
                  <RefreshCw className="mr-1 h-3.5 w-3.5" /> Refresh CRM
                </Button>
              </div>
            </div>

            {/* Stats Summary Panel */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
                <div className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  Total Leads
                </div>
                <div className="text-foreground mt-1 text-2xl font-black">{stats.total}</div>
              </div>
              <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
                <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-amber-600 uppercase">
                  <Users className="h-3 w-3" /> Assessment Leads
                </div>
                <div className="mt-1 text-2xl font-black text-amber-600">{stats.assessments}</div>
              </div>
              <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
                <div className="text-primary flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
                  <FileText className="h-3 w-3" /> Report Leads
                </div>
                <div className="text-primary mt-1 text-2xl font-black">{stats.reports}</div>
              </div>
              <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
                <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                  <UserCheck className="h-3 w-3" /> Mentor Leads
                </div>
                <div className="mt-1 text-2xl font-black text-emerald-600">{stats.mentors}</div>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="border-border bg-card mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm">
              <div className="relative flex w-full max-w-sm items-center gap-2">
                <Search className="text-muted-foreground absolute left-3.5 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by student name, email, phone, details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-border bg-background text-foreground placeholder-muted-foreground/60 focus:border-primary focus:ring-primary/10 w-full rounded-full border py-2 pr-4 pl-10 text-xs transition-all outline-none focus:ring-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-3.5 w-3.5" />
                <label className="text-muted-foreground text-xs font-medium">Lead Type:</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/10 rounded-full border px-3 py-2 text-xs outline-none focus:ring-2"
                >
                  <option value="all">All Lead Funnels</option>
                  <option value="Assessment Lead">Assessment Leads</option>
                  <option value="Report Lead">Report Leads (Purchased)</option>
                  <option value="Mentor Lead">Mentor Leads (Booked)</option>
                </select>
              </div>
            </div>

            {/* Lead Table */}
            <div className="border-border bg-card mb-8 overflow-hidden rounded-2xl border shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-border bg-muted/30 text-muted-foreground border-b text-[10px] font-bold tracking-wider uppercase">
                      <th className="p-4">Student Info</th>
                      <th className="p-4">Lead Funnel</th>
                      <th className="p-4">Conversion Details</th>
                      <th className="p-4">Acquired Date</th>
                      <th className="p-4">Follow-up Status</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border text-foreground divide-y">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                            <span className="text-muted-foreground text-xs font-medium">
                              Loading Lead Database...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-muted-foreground p-12 text-center">
                          No leads found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((l) => {
                        const formattedDate =
                          new Date(l.created_at).toLocaleDateString('en-US', {
                            dateStyle: 'medium',
                          }) +
                          ' ' +
                          new Date(l.created_at).toLocaleTimeString('en-US', {
                            timeStyle: 'short',
                          });

                        return (
                          <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                            {/* Name / Email / Phone */}
                            <td className="space-y-1 p-4">
                              <div className="text-foreground flex items-center gap-1.5 font-bold">
                                {l.name}
                              </div>
                              <div className="text-muted-foreground space-y-0.5 text-[10px]">
                                <div className="flex items-center gap-1.5">
                                  <Mail className="text-muted-foreground h-3 w-3" />
                                  {l.email}
                                </div>
                                {l.phone !== 'N/A' && (
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="text-muted-foreground h-3 w-3" />
                                    {l.phone}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Lead Type Badge */}
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                  l.type === 'Assessment Lead'
                                    ? 'border border-amber-500/20 bg-amber-50 text-amber-700'
                                    : l.type === 'Report Lead'
                                      ? 'border-primary/20 bg-primary/5 text-primary border'
                                      : 'border border-emerald-500/20 bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {l.type === 'Assessment Lead' && <Users className="h-3 w-3" />}
                                {l.type === 'Report Lead' && <FileText className="h-3 w-3" />}
                                {l.type === 'Mentor Lead' && <UserCheck className="h-3 w-3" />}
                                {l.type}
                              </span>
                            </td>

                            {/* Details */}
                            <td className="text-muted-foreground max-w-sm p-4">{l.details}</td>

                            {/* Created At */}
                            <td className="text-muted-foreground p-4">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                                {formattedDate}
                              </div>
                            </td>

                            {/* Follow-up Status Dropdown */}
                            <td className="p-4">
                              <select
                                value={l.status || 'New'}
                                onChange={(e) => handleUpdateStatus(l.id, e.target.value as any)}
                                className={`bg-background rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-colors outline-none ${
                                  l.status === 'New'
                                    ? 'border-blue-200 text-blue-700 focus:border-blue-500'
                                    : l.status === 'Contacted'
                                      ? 'border-amber-200 text-amber-700 focus:border-amber-500'
                                      : l.status === 'Interested'
                                        ? 'border-purple-200 text-purple-700 focus:border-purple-500'
                                        : l.status === 'Converted'
                                          ? 'border-emerald-200 text-emerald-700 focus:border-emerald-500'
                                          : 'border-slate-200 text-slate-600 focus:border-slate-500'
                                }`}
                              >
                                <option
                                  value="New"
                                  className="bg-background font-semibold text-blue-700"
                                >
                                  New
                                </option>
                                <option
                                  value="Contacted"
                                  className="bg-background font-semibold text-amber-700"
                                >
                                  Contacted
                                </option>
                                <option
                                  value="Interested"
                                  className="bg-background font-semibold text-purple-700"
                                >
                                  Interested
                                </option>
                                <option
                                  value="Converted"
                                  className="bg-background font-semibold text-emerald-700"
                                >
                                  Converted
                                </option>
                                <option
                                  value="Lost"
                                  className="bg-background font-semibold text-slate-600"
                                >
                                  Lost
                                </option>
                              </select>
                            </td>

                            {/* Notes Button & Text */}
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingNotesLead(l);
                                    setTempNotes(l.notes || '');
                                  }}
                                  className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-7 w-7 rounded-full border p-0"
                                  title="Edit Notes"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </Button>
                                <span
                                  className="text-muted-foreground max-w-[120px] truncate text-[10px] italic"
                                  title={l.notes || 'No notes added'}
                                >
                                  {l.notes || 'No notes...'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Notes Editor Modal */}
      {editingNotesLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="border-border bg-card w-full max-w-md rounded-3xl border p-5 shadow-2xl">
            <h3 className="text-foreground mb-2 text-sm font-bold">
              Edit Notes for {editingNotesLead.name}
            </h3>
            <p className="text-muted-foreground mb-4 text-[10px]">
              Lead ID: {editingNotesLead.id} ({editingNotesLead.type})
            </p>
            <textarea
              className="border-border bg-background text-foreground placeholder-muted-foreground/60 focus:border-primary focus:ring-primary/10 h-32 w-full rounded-2xl border p-3 text-xs outline-none focus:ring-2"
              placeholder="Enter notes about phone calls, emails, or status details..."
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border text-foreground hover:bg-muted rounded-full text-xs"
                onClick={() => setEditingNotesLead(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/95 rounded-full text-xs font-semibold text-white"
                onClick={handleSaveNotes}
              >
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
