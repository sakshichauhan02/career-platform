import { Navbar } from '@/components/common/Navbar';
import { Hero } from '@/components/modules/landing/Hero';
import { HowItWorks } from '@/components/modules/landing/HowItWorks';
import { Benefits } from '@/components/modules/landing/Benefits';
import { Categories } from '@/components/modules/landing/Categories';
import { Testimonials } from '@/components/modules/landing/Testimonials';
import { MentorSection } from '@/components/modules/landing/MentorSection';
import { ReportPreview } from '@/components/modules/landing/ReportPreview';
import { Faq } from '@/components/modules/landing/Faq';
import { Footer } from '@/components/common/Footer';

export default function Home() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col justify-between overflow-x-hidden font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Categories />
        <Testimonials />
        <MentorSection />
        <ReportPreview />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
