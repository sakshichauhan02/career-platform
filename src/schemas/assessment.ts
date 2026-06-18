import { z } from 'zod';

export const educationSchema = z.object({
  educationLevel: z.enum(
    [
      'school_10th',
      'school_11th',
      'school_12th_pcm',
      'school_12th_pcb',
      'school_12th_commerce',
      'school_12th_arts',
      'graduate',
    ],
    {
      required_error: 'Please select your current education level.',
      invalid_type_error: 'Please select your current education level.',
    }
  ),
});

export const streamSchema = z.object({
  stream: z.enum(['pcm', 'pcb', 'commerce', 'arts', 'general', 'undecided'], {
    required_error: 'Please select your stream preference.',
    invalid_type_error: 'Please select your stream preference.',
  }),
});

export const subjectsSchema = z.object({
  subjects: z
    .array(z.string())
    .min(1, { message: 'Please select at least 1 favorite or strong subject.' }),
});

export const interestsSchema = z.object({
  interests: z.array(z.string()).min(1, { message: 'Please select at least 1 interest field.' }),
});

export const hobbiesSchema = z.object({
  hobbies: z.array(z.string()).min(1, { message: 'Please select at least 1 hobby.' }),
});

export const workStyleSchema = z.object({
  workStyle: z.object({
    collaboration: z.number().min(1).max(5),
    workplace: z.number().min(1).max(5),
    structure: z.number().min(1).max(5),
  }),
});

export const prioritiesSchema = z.object({
  priorities: z.array(z.string()).min(1, { message: 'Please rank or select your priorities.' }),
});

export const budgetSchema = z.object({
  budget: z.string().min(1, { message: 'Please select your annual study budget preference.' }),
});

export const additionalNotesSchema = z.object({
  additionalNotes: z
    .string()
    .max(500, { message: 'Additional notes cannot exceed 500 characters.' }),
});

// Map step indexes (1-indexed) to their respective validation schemas
export const getStepSchema = (step: number) => {
  switch (step) {
    case 1:
      return educationSchema;
    case 2:
      return streamSchema;
    case 3:
      return subjectsSchema;
    case 4:
      return interestsSchema;
    case 5:
      return hobbiesSchema;
    case 6:
      return workStyleSchema;
    case 7:
      return prioritiesSchema;
    case 8:
      return budgetSchema;
    case 9:
      return additionalNotesSchema;
    default:
      return z.any();
  }
};
