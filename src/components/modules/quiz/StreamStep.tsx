'use client';

import { Atom, CircleDollarSign, Palette, Sparkles, HelpCircle } from 'lucide-react';
import { type StreamType } from '@/types/assessment';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';
import { SingleSelect, type SingleSelectOption } from '@/components/ui/single-select';

const streamOptions: SingleSelectOption<StreamType>[] = [
  {
    value: 'pcm',
    label: 'Science (PCM)',
    desc: 'Engineering, Technology, Mathematics, Architecture',
    icon: Atom,
  },
  {
    value: 'pcb',
    label: 'Science (PCB)',
    desc: 'Medicine, Biology, Biotech, Healthcare',
    icon: Atom,
  },
  {
    value: 'commerce',
    label: 'Commerce',
    desc: 'Business, Accountancy, Economics, Finance',
    icon: CircleDollarSign,
  },
  {
    value: 'arts',
    label: 'Arts / Humanities',
    desc: 'Literature, Psychology, Law, Design, Social Work',
    icon: Palette,
  },
  {
    value: 'general',
    label: 'General / Other',
    desc: 'Alternative courses, vocational training, general studies',
    icon: Sparkles,
  },
  {
    value: 'undecided',
    label: 'Undecided / Exploring',
    desc: 'Looking for direction and recommendations',
    icon: HelpCircle,
  },
];

interface StreamStepProps {
  onSelect?: () => void;
}

export default function StreamStep({ onSelect }: StreamStepProps) {
  const { data, updateStepData } = useAssessmentStore();

  return (
    <QuestionCard
      title="Choose your stream"
      description="This helps us recommend stream-specific courses and career pathways."
    >
      <SingleSelect
        options={streamOptions}
        selectedValue={data.stream || null}
        onChange={(value) => {
          updateStepData({ stream: value });
          if (onSelect) {
            setTimeout(onSelect, 250);
          }
        }}
        columns={2}
      />
    </QuestionCard>
  );
}
