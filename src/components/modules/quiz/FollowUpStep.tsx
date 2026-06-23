'use client';

import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';
import { SingleSelect, type SingleSelectOption } from '@/components/ui/single-select';
import { Briefcase, Paintbrush, Atom, Coins, Landmark, BookOpen, Scale, Sparkles, HeartPulse } from 'lucide-react';

interface FollowUpStepProps {
  onSelect?: () => void;
}

const commerceOptions: SingleSelectOption<string>[] = [
  {
    value: 'corp_finance',
    label: 'Corporate Finance & Accounts',
    desc: 'Chartered Accountancy, Auditing, Corporate Tax, and Financial Auditing.',
    icon: Landmark,
  },
  {
    value: 'business_mgmt',
    label: 'Business Management & Startups',
    desc: 'Business development, entrepreneurship, marketing, and team leadership.',
    icon: Briefcase,
  },
  {
    value: 'econ_finance',
    label: 'Economics & Investment Banking',
    desc: 'Stock markets, investment analysis, banking, wealth management, and policy.',
    icon: Coins,
  },
];

const artsOptions: SingleSelectOption<string>[] = [
  {
    value: 'creative_media',
    label: 'Creative Arts, Design & Media',
    desc: 'UI/UX design, digital illustrations, journalism, writing, and filmmaking.',
    icon: Paintbrush,
  },
  {
    value: 'social_sciences',
    label: 'Social Sciences & Psychology',
    desc: 'Human behavior studies, counseling, teaching, and NGO/social work.',
    icon: BookOpen,
  },
  {
    value: 'public_policy',
    label: 'Law & Civil Services',
    desc: 'Public policy, legal advisory, judiciary tracks, and administrative service.',
    icon: Scale,
  },
];

const scienceOptions: SingleSelectOption<string>[] = [
  {
    value: 'applied_tech',
    label: 'Applied Tech & Engineering',
    desc: 'Software development, AI/Machine Learning, robotics, and physical architectures.',
    icon: Atom,
  },
  {
    value: 'medical_life',
    label: 'Healthcare & Life Sciences',
    desc: 'Clinical medicine, biotechnology research, pharmacy, and nursing tracks.',
    icon: HeartPulse,
  },
  {
    value: 'pure_sciences',
    label: 'Pure Sciences & Research',
    desc: 'Quantum physics, chemical research, astronomy, and climate sciences.',
    icon: Sparkles,
  },
];

export default function FollowUpStep({ onSelect }: FollowUpStepProps) {
  const { data, updateStepData } = useAssessmentStore();
  const activeStream = data.stream || 'general';

  // Get current selected pathway from notes
  const getSelectedValue = (): string | null => {
    const notes = data.additionalNotes || '';
    const match = notes.match(/^\[Career Pathway Focus: ([^\]]+)\]/);
    if (!match) return null;

    const label = match[1];
    const allOptions = [...commerceOptions, ...artsOptions, ...scienceOptions];
    const found = allOptions.find((o) => o.label === label);
    return found ? found.value : null;
  };

  const handleSelection = (val: string) => {
    const allOptions = [...commerceOptions, ...artsOptions, ...scienceOptions];
    const selectedOpt = allOptions.find((o) => o.value === val);
    if (!selectedOpt) return;

    let currentNotes = data.additionalNotes || '';
    // Remove old header
    currentNotes = currentNotes.replace(/^\[Career Pathway Focus: [^\]]+\]\s*\n?/, '');
    // Insert new header
    const newNotes = `[Career Pathway Focus: ${selectedOpt.label}]\n${currentNotes}`.trim();

    updateStepData({ additionalNotes: newNotes });

    if (onSelect) {
      setTimeout(onSelect, 250);
    }
  };

  // Determine which options to show
  let options: SingleSelectOption<string>[] = [];
  let title = 'Your Pathway Focus';
  let desc = 'Help us narrow down your career options.';

  if (activeStream === 'commerce') {
    options = commerceOptions;
    title = 'Choose your business focus area';
    desc = 'Commerce offers diverse roles. Let\'s align on what excites you most.';
  } else if (activeStream === 'arts') {
    options = artsOptions;
    title = 'Choose your creative or social focus area';
    desc = 'Arts opens up beautiful avenues. Which track fits your natural style?';
  } else {
    options = scienceOptions;
    title = 'Choose your science focus area';
    desc = 'Science spans engineering to biology. Let\'s specify your interest focus.';
  }

  return (
    <QuestionCard title={title} description={desc}>
      <SingleSelect
        options={options}
        selectedValue={getSelectedValue()}
        onChange={handleSelection}
        columns={1}
      />
    </QuestionCard>
  );
}
