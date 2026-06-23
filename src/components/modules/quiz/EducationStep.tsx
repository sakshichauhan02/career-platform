'use client';

import { School, GraduationCap, Award, BookOpen } from 'lucide-react';
import { type EducationLevel } from '@/types/assessment';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';
import { SingleSelect, type SingleSelectOption } from '@/components/ui/single-select';

const options: SingleSelectOption<EducationLevel>[] = [
  {
    value: 'school_10th',
    label: 'Class 10th or Below',
    desc: 'Exploring streams and basic subject selection',
    icon: School,
  },
  {
    value: 'school_11th',
    label: 'Class 11th',
    desc: 'Validating stream choice and core subject focus',
    icon: BookOpen,
  },
  {
    value: 'school_12th_pcm',
    label: 'Class 12th (PCM)',
    desc: 'Physics, Chemistry, and Mathematics focus',
    icon: GraduationCap,
  },
  {
    value: 'school_12th_pcb',
    label: 'Class 12th (PCB)',
    desc: 'Physics, Chemistry, and Biology focus',
    icon: GraduationCap,
  },
  {
    value: 'school_12th_commerce',
    label: 'Class 12th (Commerce)',
    desc: 'Accountancy, Business Studies, Economics focus',
    icon: GraduationCap,
  },
  {
    value: 'school_12th_arts',
    label: 'Class 12th (Arts/Humanities)',
    desc: 'History, Political Science, Psychology focus',
    icon: GraduationCap,
  },
  {
    value: 'graduate',
    label: 'College / Graduate',
    desc: 'Exploring career shifts, PG courses, or job tracks',
    icon: Award,
  },
];

interface EducationStepProps {
  onSelect?: () => void;
}

export default function EducationStep({ onSelect }: EducationStepProps) {
  const { data, updateStepData } = useAssessmentStore();

  return (
    <QuestionCard
      title="What is your current education level?"
      description="Select the option that best describes your current studies."
    >
      <SingleSelect
        options={options}
        selectedValue={data.educationLevel || null}
        onChange={(value) => {
          let newStream = data.stream;
          if (value === 'school_12th_pcm') newStream = 'pcm';
          else if (value === 'school_12th_pcb') newStream = 'pcb';
          else if (value === 'school_12th_commerce') newStream = 'commerce';
          else if (value === 'school_12th_arts') newStream = 'arts';
          else if (value === 'school_10th') newStream = 'undecided';

          updateStepData({
            educationLevel: value,
            stream: newStream,
          });

          if (onSelect) {
            setTimeout(onSelect, 250);
          }
        }}
        columns={2}
      />
    </QuestionCard>
  );
}
