'use client';

import {
  Code,
  Stethoscope,
  Building,
  Paintbrush,
  Megaphone,
  GraduationCap,
  Scale,
  TrendingUp,
  Globe,
  PenTool,
} from 'lucide-react';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';

const interestOptions: MultiSelectOption<string>[] = [
  {
    value: 'tech_ai',
    label: 'Software, Coding & AI',
    desc: 'Building websites, coding, training AI, mobile apps',
    icon: Code,
  },
  {
    value: 'medicine_bio',
    label: 'Medicine & Biological Sciences',
    desc: 'Healthcare, surgical sciences, genetics, pharma research',
    icon: Stethoscope,
  },
  {
    value: 'business_ent',
    label: 'Business & Entrepreneurship',
    desc: 'Creating startups, managing teams, commercial operations',
    icon: Building,
  },
  {
    value: 'design_arts',
    label: 'UI/UX, Design & Fine Arts',
    desc: 'Designing layouts, digital illustrations, styling interfaces',
    icon: Paintbrush,
  },
  {
    value: 'marketing_pr',
    label: 'Marketing & Public Relations',
    desc: 'Running ads, social media strategies, public branding',
    icon: Megaphone,
  },
  {
    value: 'education_social',
    label: 'Education & Social Support',
    desc: 'Teaching courses, guidance counseling, charity programs',
    icon: GraduationCap,
  },
  {
    value: 'law_civil',
    label: 'Law & Civil Services',
    desc: 'Legal systems, policy analysis, administrative services',
    icon: Scale,
  },
  {
    value: 'finance_econ',
    label: 'Finance & Economics',
    desc: 'Stock trading, tax accounting, economic models, portfolios',
    icon: TrendingUp,
  },
  {
    value: 'space_research',
    label: 'Space & Scientific Research',
    desc: 'Quantum physics experiments, astronomy, climate research',
    icon: Globe,
  },
  {
    value: 'media_writing',
    label: 'Media, Writing & Journalism',
    desc: 'Blogging, shooting documentaries, creative scriptwriting',
    icon: PenTool,
  },
];

export default function InterestsStep() {
  const { data, updateStepData } = useAssessmentStore();

  return (
    <QuestionCard
      title="What fields interest you?"
      description="Select one or more areas that spark your curiosity."
    >
      <MultiSelect
        options={interestOptions}
        selectedValues={data.interests}
        onChange={(values) => updateStepData({ interests: values })}
        columns={2}
      />
    </QuestionCard>
  );
}
