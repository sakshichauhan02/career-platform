'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2,
  Lock,
  Sparkles,
  Download,
  ArrowRight,
  Brain,
  AlertCircle,
  Compass,
  UserCheck,
} from 'lucide-react';

export default function ClaimReportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Claiming states
  const [claimStatus, setClaimStatus] = useState<'idle' | 'claiming' | 'success' | 'no-data' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [localResults, setLocalResults] = useState<any>(null);

  // PDF generation states
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState({
    generating: 'idle',
    storing: 'idle',
    emailing: 'idle',
    downloading: 'idle',
  });

  // 1. Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          setUser(session.user);
          
          // Load local storage data
          const localData = localStorage.getItem('pathway_latest_results');
          if (localData) {
            const parsed = JSON.parse(localData);
            if (parsed.recommendations && parsed.recommendations.length > 0) {
              setLocalResults(parsed);
              setClaimStatus('claiming');
              await claimReport(session.user, parsed);
            } else {
              setClaimStatus('no-data');
            }
          } else {
            // Check if they already have a payment and report (e.g., viewing on another device)
            const { data: payments } = await supabase
              .from('payments')
              .select('id')
              .eq('user_id', session.user.id)
              .eq('product_name', 'Career Report')
              .eq('status', 'success')
              .limit(1);
              
            if (payments && payments.length > 0) {
              setClaimStatus('success');
              localStorage.setItem('pathway_report_unlocked', 'true');
            } else {
              setClaimStatus('no-data');
            }
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setClaimStatus('error');
        setErrorMessage('Failed to verify authentication status.');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Claim Report: Save to Database
  const claimReport = async (currentUser: any, results: any) => {
    try {
      const { recommendations, profile } = results;
      const cleanProfile = {
        ...profile,
        id: currentUser.id,
        email: currentUser.email || profile.email,
        name: currentUser.user_metadata?.full_name || profile.name,
      };

      // A. Clear old recommendations
      await supabase
        .from('recommendations')
        .delete()
        .eq('user_id', currentUser.id);

      // B. Insert recommendations
      const insertRows = recommendations.map((scored: any) => ({
        user_id: currentUser.id,
        career_title: scored.course.name,
        match_score: scored.score,
        reasoning: scored.explanation?.whyThisCourseFits || scored.explanation || '',
        recommended_paths: scored.course.interests || [],
        created_at: new Date().toISOString(),
      }));
      
      const { error: recsError } = await supabase.from('recommendations').insert(insertRows);
      if (recsError) throw recsError;

      // C. Insert raw responses
      const { error: responseError } = await supabase.from('assessment_responses').insert({
        user_id: currentUser.id,
        responses: cleanProfile,
        completed_at: new Date().toISOString(),
      });
      if (responseError) throw responseError;

      // D. Insert payment record to mark as unlocked
      const { error: payError } = await supabase.from('payments').insert({
        user_id: currentUser.id,
        order_id: `topmate_${Date.now()}`,
        amount: 49.0,
        status: 'success',
        product_name: 'Career Report',
        created_at: new Date().toISOString(),
      });
      if (payError) throw payError;

      // E. Update local storage flags
      localStorage.setItem('pathway_report_unlocked', 'true');
      localStorage.setItem(
        'pathway_latest_results',
        JSON.stringify({
          ...results,
          profile: cleanProfile,
          claimedAt: new Date().toISOString(),
        })
      );

      setClaimStatus('success');
    } catch (dbErr: any) {
      console.error('Failed to claim report:', dbErr);
      setClaimStatus('error');
      setErrorMessage(dbErr.message || 'Database transaction failed while saving your report.');
    }
  };

  // 3. Generate and download PDF
  const handleDownloadPdf = async () => {
    let activeProfile = localResults?.profile;
    let activeRecommendations = localResults?.recommendations;

    // Fallback: If local storage is empty, fetch from database in real-time
    if (!activeProfile || !activeRecommendations) {
      try {
        setIsGeneratingPdf(true);
        const { data: dbResp } = await supabase
          .from('assessment_responses')
          .select('responses')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { data: dbRecs } = await supabase
          .from('recommendations')
          .select('*')
          .eq('user_id', user.id);

        if (dbResp?.responses && dbRecs && dbRecs.length > 0) {
          activeProfile = dbResp.responses;
          // Map DB rows back to mock recommendations format
          activeRecommendations = dbRecs.map((r) => ({
            score: r.match_score,
            course: {
              name: r.career_title,
              interests: r.recommended_paths || [],
            },
            explanation: r.reasoning,
          }));
        } else {
          alert('Could not locate report data to generate PDF.');
          setIsGeneratingPdf(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching report for PDF:', err);
        alert('Error preparing report data.');
        setIsGeneratingPdf(false);
        return;
      }
    }

    setIsGeneratingPdf(true);
    setDeliveryStatus({
      generating: 'loading',
      storing: 'loading',
      emailing: 'loading',
      downloading: 'idle',
    });

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: activeProfile,
          recommendations: activeRecommendations,
          email: user?.email || activeProfile.email || 'student@pathwayai.co',
          userId: user?.id || activeProfile.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.fallbackHtml) {
          setDeliveryStatus({
            generating: 'success',
            storing: 'success',
            emailing: 'success',
            downloading: 'success',
          });

          // Create dynamic iframe for printing
          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.right = '0';
          iframe.style.bottom = '0';
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.border = '0';
          document.body.appendChild(iframe);

          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(data.fallbackHtml);
            iframeDoc.close();

            setTimeout(() => {
              if (iframe.contentWindow) {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
              }
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 1000);
            }, 1000);
          } else {
            document.body.removeChild(iframe);
            alert('Failed to initialize print engine.');
          }
          setPdfSuccess(true);
          return;
        }
      }

      setDeliveryStatus((prev) => ({
        ...prev,
        generating: 'success',
        storing: 'success',
        emailing: 'success',
        downloading: 'loading',
      }));

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Career_Pathway_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setDeliveryStatus((prev) => ({
        ...prev,
        downloading: 'success',
      }));
      setPdfSuccess(true);
    } catch (err) {
      console.error('PDF delivery failed:', err);
      setDeliveryStatus({
        generating: 'error',
        storing: 'error',
        emailing: 'error',
        downloading: 'error',
      });
      alert('Error generating report PDF. Please try again.');
    }
  };

  return (
    <div className="bg-slate-50/50 text-slate-900 selection:bg-blue-50 min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="container mx-auto max-w-xl px-4 py-32 flex-grow flex flex-col justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm font-medium text-slate-500">Verifying secure payment session...</p>
          </div>
        ) : !isAuthenticated ? (
          /* Authentication Gate */
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">
                Payment Completed Successfully
              </span>
              <h1 className="text-2xl font-black text-slate-900 leading-snug">
                Claim Your Premium Report
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                To associate your premium career recommendations with a permanent account and generate your custom 15-page PDF report, please log in or sign up.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6 flex flex-col gap-3">
              <Link href="/login?redirect=/claim-report" className="w-full">
                <Button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 py-6 font-bold text-white shadow-sm hover:from-blue-700 hover:to-blue-600 active:scale-[0.99]">
                  Log In or Create Account
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-[10px] text-slate-400 font-medium">
                Your report data will automatically load once your account is ready.
              </p>
            </div>
          </div>
        ) : (
          /* Logged In Claims Flow */
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md text-center space-y-6">
            {claimStatus === 'claiming' && (
              <div className="space-y-4 py-8">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Claiming your Premium Report...</h3>
                  <p className="text-xs text-slate-400">Saving assessment results and unlocking premium access.</p>
                </div>
              </div>
            )}

            {claimStatus === 'success' && (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
                  <Sparkles className="h-7 w-7 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">
                    Report Claimed Successfully
                  </span>
                  <h1 className="text-2xl font-black text-slate-900 leading-snug">
                    Premium Toolkit Unlocked!
                  </h1>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Your report is now securely stored under your account **{user.email}**. You can download your customized PDF now or view detailed fit insights immediately.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3">
                  {/* PDF Download Action */}
                  {isGeneratingPdf ? (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>Generating customized PDF...</span>
                        <span className="animate-pulse text-blue-600 font-bold">Processing</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-infinite-loading" />
                      </div>
                      <p className="text-[9px] text-slate-400 text-left leading-normal">
                        This takes a moment as we compile curriculum tracks, salary ranges, and university matches.
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleDownloadPdf}
                      className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 py-6 font-bold text-white shadow-sm hover:from-emerald-700 hover:to-emerald-600 active:scale-[0.99] flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-4.5 w-4.5" />
                      {pdfSuccess ? 'Download PDF Again' : 'Download Premium PDF Report'}
                    </Button>
                  )}

                  <div className="flex gap-3">
                    <Link href="/results?unlocked=true" className="flex-1">
                      <Button variant="outline" className="w-full rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 py-5 text-xs font-bold">
                        View Unlocked Report
                      </Button>
                    </Link>
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="ghost" className="w-full rounded-full text-slate-500 hover:text-slate-900 py-5 text-xs font-bold">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}

            {claimStatus === 'no-data' && (
              <div className="space-y-6 py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">No Active Report Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    We could not detect any recent quiz results in this browser session. If you recently paid on Topmate, please make sure you are using the same device/browser or check your dashboard.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                  <Link href="/quiz">
                    <Button className="w-full rounded-full bg-primary py-5 text-xs font-bold">
                      Take Free Career Quiz
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full rounded-full border-slate-200 py-5 text-xs font-bold text-slate-600">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {claimStatus === 'error' && (
              <div className="space-y-6 py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">Claim Report Failed</h3>
                  <p className="text-xs text-rose-600 leading-relaxed max-w-sm mx-auto">
                    {errorMessage}
                  </p>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <Button
                    onClick={() => claimReport(user, localResults)}
                    className="flex-1 rounded-full bg-primary py-5 text-xs font-bold"
                  >
                    Retry Saving
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full rounded-full border-slate-200 py-5 text-xs font-bold text-slate-600">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
