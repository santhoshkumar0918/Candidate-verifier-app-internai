import { z } from "zod";

export const fieldValidationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  available: z.enum(["Y", "N", "Yes", "No", "yes", "no"]),
  skills: z.string().optional(),
});

export const additionalQuestionSchema = z.object({
  id: z.string(),
  questionText: z.string(),
  type: z.enum(["text", "number", "yesno", "options"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

export const inputDataSchema = z.object({
  sessionId: z.string(),
  fields: fieldValidationSchema,
  additionalQuestions: z.array(additionalQuestionSchema),
});

export const outputDataSchema = z.object({
  sessionId: z.string(),
  verified: z.boolean(),
  correctedData: z.record(z.any()),
  timestamp: z.string(),
});

export type FieldData = z.infer<typeof fieldValidationSchema>;
export type AdditionalQuestion = z.infer<typeof additionalQuestionSchema>;
export type InputData = z.infer<typeof inputDataSchema>;
export type OutputData = z.infer<typeof outputDataSchema>;

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type FieldStatus = {
  field: string;
  value: any;
  isValid: boolean;
  isConfirmed: boolean;
  errors: string[];
};

export type VerificationStep =
  | "loading"
  | "field-verification"
  | "additional-questions"
  | "summary"
  | "complete";

export interface VerificationState {
  step: VerificationStep;
  inputData: InputData | null;
  fieldStatuses: Record<string, FieldStatus>;
  additionalAnswers: Record<string, any>;
  outputData: OutputData | null;
  currentFieldIndex: number;
  currentQuestionIndex: number;
}

export interface VerificationActions {
  setInputData: (data: InputData) => void;
  updateFieldStatus: (field: string, status: Partial<FieldStatus>) => void;
  setAdditionalAnswer: (questionId: string, answer: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: VerificationStep) => void;
  generateOutput: () => void;
  reset: () => void;
}
