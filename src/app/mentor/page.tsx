'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  User,
  Phone,
  Mail,
  UserCheck,
  Clock,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Edit,
} from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

// Mapped options of mentors matching predefined routes
const MENTORS_LIST = [
  {
    id: 'm-1',
    name: 'Dr. Aarav Mehta',
    company: 'Google DeepMind',
    role: 'Principal AI Researcher',
  },
  {
    id: 'm-2',
    name: 'Dr. Sarah Jenkins',
    company: 'Johns Hopkins Medicine',
    role: 'Chief Surgeon',
  },
  { id: 'm-3', name: 'Elena Rostova', company: 'Airbnb', role: 'VP of Design' },
  { id: 'm-4', name: 'Rajesh Singhania', company: 'EY', role: 'Senior Audit Partner' },
  { id: 'm-5', name: 'Marcus Vance', company: 'McKinsey & Co.', role: 'Management Consultant' },
  {
    id: 'm-6',
    name: 'Advocate Advait Roy',
    company: 'Shardul Amarchand',
    role: 'Senior Corporate Counsel',
  },
  { id: 'm-7', name: 'Dr. Neil Tyson Cooper', company: 'NASA JPL', role: 'Research Scientist' },
  { id: 'm-8', name: 'Student Advisor', company: 'PathWayAI', role: 'Career Counselor' },
];

interface BookingDB {
  id: string;
  student_id: string | null;
  mentor_id: string;
  student_name: string | null;
  student_phone: string | null;
  student_email: string | null;
  booking_date: string | null;
  time_slot: string | null;
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled';
  created_at: string;
}

const MOCK_BOOKINGS: BookingDB[] = [
  {
    id: 'b-mock-1',
    student_id: 's-1',
    mentor_id: 'm-1',
    student_name: 'Saksham Gupta',
    student_phone: '+91 98765 43210',
    student_email: 'saksham@gmail.com',
    booking_date: '2026-06-25',
    time_slot: '10:00 AM',
    status: 'Scheduled',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-mock-2',
    student_id: 's-2',
    mentor_id: 'm-3',
    student_name: 'Priya Sharma',
    student_phone: '+91 88888 77777',
    student_email: 'priya.s@example.com',
    booking_date: '2026-06-26',
    time_slot: '02:00 PM',
    status: 'Pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-mock-3',
    student_id: 's-3',
    mentor_id: 'm-5',
    student_name: 'Amit Patel',
    student_phone: '+91 99999 88888',
    student_email: 'amit.patel@example.com',
    booking_date: '2026-06-20',
    time_slot: '11:30 AM',
    status: 'Completed',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'b-mock-4',
    student_id: 's-4',
    mentor_id: 'm-8',
    student_name: 'Neha Roy',
    student_phone: '+91 77777 66666',
    student_email: 'neha.roy@example.com',
    booking_date: '2026-06-19',
    time_slot: '04:30 PM',
    status: 'Cancelled',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export default function MentorDashboard() {
  const [bookings, setBookings] = useState<BookingDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled'
  >('all');
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Modals state
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    date: string;
    timeSlot: string;
  } | null>(null);

  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    mentorId: string;
  } | null>(null);

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mentor_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        // Map status casing if needed
        const mappedData = data.map((b: any) => {
          // Normalize status
          let status = 'Scheduled';
          if (b.status === 'pending' || b.status === 'Pending') status = 'Pending';
          else if (b.status === 'scheduled' || b.status === 'Scheduled') status = 'Scheduled';
          else if (b.status === 'completed' || b.status === 'Completed') status = 'Completed';
          else if (b.status === 'cancelled' || b.status === 'Cancelled') status = 'Cancelled';

          return {
            ...b,
            status,
          };
        });
        setBookings(mappedData);
      } else {
        setBookings(MOCK_BOOKINGS);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings(MOCK_BOOKINGS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const triggerNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 5000);
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      // Optimistic state update
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as any } : b))
      );

      if (bookingId.startsWith('b-mock-')) {
        triggerNotice('success', `Booking status updated to ${newStatus} (Local Simulation)`);
        return;
      }

      const res = await fetch('/api/mentor-bookings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      triggerNotice('success', `Booking status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      triggerNotice('error', 'Failed to update booking status.');
      fetchBookings();
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleModal) return;
    const { bookingId, date, timeSlot } = rescheduleModal;

    try {
      // Optimistic state update
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, booking_date: date, time_slot: timeSlot } : b
        )
      );
      setRescheduleModal(null);

      if (bookingId.startsWith('b-mock-')) {
        triggerNotice('success', 'Booking rescheduled successfully (Local Simulation)');
        return;
      }

      const res = await fetch('/api/mentor-bookings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, date, timeSlot }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      triggerNotice('success', 'Booking rescheduled successfully');
    } catch (err) {
      console.error(err);
      triggerNotice('error', 'Failed to reschedule booking.');
      fetchBookings();
    }
  };

  const handleAssignMentor = async () => {
    if (!assignModal) return;
    const { bookingId, mentorId } = assignModal;

    try {
      // Optimistic state update
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, mentor_id: mentorId } : b))
      );
      setAssignModal(null);

      if (bookingId.startsWith('b-mock-')) {
        triggerNotice('success', 'Mentor assigned successfully (Local Simulation)');
        return;
      }

      const res = await fetch('/api/mentor-bookings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, mentorId }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      triggerNotice('success', 'Mentor assigned successfully');
    } catch (err) {
      console.error(err);
      triggerNotice('error', 'Failed to assign mentor.');
      fetchBookings();
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = b.student_name?.toLowerCase().includes(query) || false;
    const emailMatch = b.student_email?.toLowerCase().includes(query) || false;
    const phoneMatch = b.student_phone?.includes(query) || false;

    // Status filter match
    const statusMatch = statusFilter === 'all' || b.status === statusFilter;

    return (nameMatch || emailMatch || phoneMatch) && statusMatch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'Pending').length,
    scheduled: bookings.filter((b) => b.status === 'Scheduled').length,
    completed: bookings.filter((b) => b.status === 'Completed').length,
    cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
  };

  return (
    <div className="bg-background text-foreground selection:bg-primary/10 min-h-screen">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-medium"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Admin Console
            </Link>
            <h1 className="text-foreground text-3xl font-black tracking-tight">Mentor Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Review consultations, manage slots, assign guides, and update booking timelines.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={fetchBookings}
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted rounded-full text-xs font-semibold"
            >
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Reload List
            </Button>
          </div>
        </div>

        {/* Global Notice Area */}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 text-sm ${
                notice.type === 'success'
                  ? 'border-emerald-500/20 bg-emerald-50/80 text-emerald-800'
                  : 'border-rose-500/20 bg-rose-50/80 text-rose-800'
              }`}
            >
              {notice.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              )}
              <span>{notice.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Total Calls
            </div>
            <div className="text-foreground mt-1 text-2xl font-black">{stats.total}</div>
          </div>
          <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
            <div className="text-[10px] font-bold tracking-wider text-amber-600 uppercase">
              Pending
            </div>
            <div className="mt-1 text-2xl font-black text-amber-600">{stats.pending}</div>
          </div>
          <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
            <div className="text-primary text-[10px] font-bold tracking-wider uppercase">
              Scheduled
            </div>
            <div className="text-primary mt-1 text-2xl font-black">{stats.scheduled}</div>
          </div>
          <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
            <div className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
              Completed
            </div>
            <div className="mt-1 text-2xl font-black text-emerald-600">{stats.completed}</div>
          </div>
          <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
            <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Cancelled
            </div>
            <div className="mt-1 text-2xl font-black text-slate-500">{stats.cancelled}</div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="border-border bg-card mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm">
          <div className="relative flex w-full max-w-sm items-center gap-2">
            <Search className="text-muted-foreground absolute left-3.5 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by student name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border bg-background text-foreground placeholder-muted-foreground/60 focus:border-primary focus:ring-primary/10 w-full rounded-full border py-2 pr-4 pl-10 text-xs transition-all outline-none focus:ring-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-3.5 w-3.5" />
            <label className="text-muted-foreground text-xs font-medium">Status Filter:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/10 rounded-full border px-3 py-2 text-xs outline-none focus:ring-2"
            >
              <option value="all">All Bookings</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings List Table */}
        <div className="border-border bg-card mb-8 overflow-hidden rounded-2xl border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-border bg-muted/30 text-muted-foreground border-b text-[10px] font-bold tracking-wider uppercase">
                  <th className="p-4">Student Details</th>
                  <th className="p-4">Call Schedule</th>
                  <th className="p-4">Assigned Mentor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border text-foreground divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                        <span className="text-muted-foreground text-xs font-medium">
                          Loading consultation records...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-muted-foreground p-12 text-center">
                      No bookings match your current filter preferences.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const assignedMentor =
                      MENTORS_LIST.find((m) => m.id === b.mentor_id) || MENTORS_LIST[7];

                    return (
                      <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                        {/* Student Info */}
                        <td className="space-y-1 p-4">
                          <div className="text-foreground flex items-center gap-1.5 font-bold">
                            <User className="text-primary h-3.5 w-3.5" />
                            {b.student_name || 'Guest Student'}
                          </div>
                          <div className="text-muted-foreground space-y-0.5 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <Mail className="text-muted-foreground h-3 w-3" />
                              {b.student_email || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="text-muted-foreground h-3 w-3" />
                              {b.student_phone || 'N/A'}
                            </div>
                          </div>
                        </td>

                        {/* Timings */}
                        <td className="space-y-1 p-4">
                          <div className="text-foreground flex items-center gap-1.5 font-bold">
                            <Calendar className="text-primary h-3.5 w-3.5" />
                            {b.booking_date || 'N/A'}
                          </div>
                          <div className="text-primary flex items-center gap-1.5 text-[10px] font-medium">
                            <Clock className="h-3 w-3" />
                            {b.time_slot || 'N/A'}
                          </div>
                          <button
                            onClick={() =>
                              setRescheduleModal({
                                isOpen: true,
                                bookingId: b.id,
                                date: b.booking_date || '',
                                timeSlot: b.time_slot || '',
                              })
                            }
                            className="text-primary hover:text-primary/80 mt-1 inline-flex items-center gap-1 text-[9px] font-semibold hover:underline"
                          >
                            <Edit className="h-2.5 w-2.5" /> Reschedule
                          </button>
                        </td>

                        {/* Mentor assigned */}
                        <td className="space-y-1 p-4">
                          <div className="text-foreground flex items-center gap-1.5 font-bold">
                            <UserCheck className="text-primary h-3.5 w-3.5" />
                            {assignedMentor.name}
                          </div>
                          <div className="text-muted-foreground text-[10px]">
                            {assignedMentor.role} ({assignedMentor.company})
                          </div>
                          <button
                            onClick={() =>
                              setAssignModal({
                                isOpen: true,
                                bookingId: b.id,
                                mentorId: b.mentor_id,
                              })
                            }
                            className="text-primary hover:text-primary/80 mt-1 inline-flex items-center gap-1 text-[9px] font-semibold hover:underline"
                          >
                            <Edit className="h-2.5 w-2.5" /> Reassign Mentor
                          </button>
                        </td>

                        {/* Status badge */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              b.status === 'Pending'
                                ? 'border border-amber-500/20 bg-amber-50 text-amber-700'
                                : b.status === 'Scheduled'
                                  ? 'border-primary/20 bg-primary/5 text-primary border'
                                  : b.status === 'Completed'
                                    ? 'border border-emerald-500/20 bg-emerald-50 text-emerald-700'
                                    : 'border border-slate-200 bg-slate-100 text-slate-600'
                            }`}
                          >
                            {b.status === 'Pending' && <Clock className="h-3 w-3" />}
                            {b.status === 'Scheduled' && <Calendar className="h-3 w-3" />}
                            {b.status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
                            {b.status === 'Cancelled' && <XCircle className="h-3 w-3" />}
                            {b.status}
                          </span>
                        </td>

                        {/* Dropdown status updater actions */}
                        <td className="relative p-4 text-right">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                            className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/10 max-w-[120px] rounded-full border p-1.5 text-[10px] outline-none focus:ring-2"
                          >
                            <option value="Pending">Set Pending</option>
                            <option value="Scheduled">Set Scheduled</option>
                            <option value="Completed">Set Completed</option>
                            <option value="Cancelled">Set Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 1. Reschedule Modal */}
      <AnimatePresence>
        {rescheduleModal && rescheduleModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="border-border bg-card w-full max-w-sm space-y-4 rounded-3xl border p-6 shadow-2xl"
            >
              <h3 className="text-foreground text-base font-bold">Reschedule Call</h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-muted-foreground text-[9px] font-bold uppercase">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleModal.date}
                    onChange={(e) =>
                      setRescheduleModal((prev) =>
                        prev ? { ...prev, date: e.target.value } : null
                      )
                    }
                    className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/10 w-full rounded-full border p-2.5 text-xs outline-none focus:ring-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground text-[9px] font-bold uppercase">
                    Select Slot
                  </label>
                  <select
                    value={rescheduleModal.timeSlot}
                    onChange={(e) =>
                      setRescheduleModal((prev) =>
                        prev ? { ...prev, timeSlot: e.target.value } : null
                      )
                    }
                    className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/10 w-full rounded-full border p-2.5 text-xs outline-none focus:ring-2"
                  >
                    <option value="10:00 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM">11:30 AM - 12:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 02:30 PM</option>
                    <option value="04:30 PM">04:30 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setRescheduleModal(null)}
                  className="border-border text-foreground hover:bg-muted flex-1 rounded-full text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReschedule}
                  className="bg-primary hover:bg-primary/95 flex-1 rounded-full text-xs font-bold text-white"
                >
                  Save Schedule
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Assign Mentor Modal */}
      <AnimatePresence>
        {assignModal && assignModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="border-border bg-card w-full max-w-sm space-y-4 rounded-3xl border p-6 shadow-2xl"
            >
              <h3 className="text-foreground text-base font-bold">Assign Mentor</h3>

              <div className="space-y-1 text-xs">
                <label className="text-muted-foreground text-[9px] font-bold uppercase">
                  Select Industry Mentor
                </label>
                <select
                  value={assignModal.mentorId}
                  onChange={(e) =>
                    setAssignModal((prev) => (prev ? { ...prev, mentorId: e.target.value } : null))
                  }
                  className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/10 w-full rounded-full border p-2.5 text-xs outline-none focus:ring-2"
                >
                  {MENTORS_LIST.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.company})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setAssignModal(null)}
                  className="border-border text-foreground hover:bg-muted flex-1 rounded-full text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignMentor}
                  className="bg-primary hover:bg-primary/95 flex-1 rounded-full text-xs font-bold text-white"
                >
                  Confirm Mentor
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
