import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { QuizContainer } from '@/components/modules/quiz/QuizContainer';

export const metadata = {
  title: 'Career Discovery Assessment',
  description:
    'Complete our 5-minute career assessment quiz to find the best subjects, streams, colleges, and career pathways tailored to your aptitude.',
};

export default function QuizPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between overflow-x-hidden bg-slate-950 font-sans text-white">
      <Navbar />

      <main className="relative flex flex-grow items-center justify-center px-4 pt-24 pb-12">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute top-1/4 left-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />

        <QuizContainer />
      </main>

      <Footer />
    </div>
  );
}
