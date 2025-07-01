import { z } from "zod";
import { ValidationResult, AdditionalQuestion } from "./types";

const validationSchemas = {
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^\d{10,}$/, "Phone number must contain at least 10 digits"),
  available: z
    .string()
    .refine(
      (val) => ["Y", "N", "Yes", "No", "yes", "no"].includes(val),
      "Must be Yes/No or Y/N"
    ),
  skills: z.string().optional(),
};

export const validateField = (field: string, value: any): ValidationResult => {
  try {
    const schema = validationSchemas[field as keyof typeof validationSchemas];
    if (!schema) {
      return { isValid: true, errors: [] };
    }

    schema.parse(value);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((e) => e.message),
      };
    }
    return { isValid: false, errors: ["Invalid value"] };
  }
};

export const validateAdditionalAnswer = (
  question: AdditionalQuestion,
  answer: any
): ValidationResult => {
  try {
    if (question.required && (!answer || answer.toString().trim() === "")) {
      return { isValid: false, errors: ["This field is required"] };
    }

    if (!question.required && (!answer || answer.toString().trim() === "")) {
      return { isValid: true, errors: [] };
    }

    switch (question.type) {
      case "text":
        z.string().min(3, "Text must be at least 3 characters").parse(answer);
        break;

      case "number":
        z.number()
          .or(z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid number"))
          .parse(answer);
        break;

      case "yesno":
        z.string()
          .refine(
            (val) => ["Yes", "No", "yes", "no", "Y", "N"].includes(val),
            "Must be Yes/No"
          )
          .parse(answer);
        break;

      case "options":
        if (question.options) {
          z.enum(question.options as [string, ...string[]]).parse(answer);
        }
        break;

      default:
        z.string().parse(answer);
    }

    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((e) => e.message),
      };
    }
    return { isValid: false, errors: ["Invalid value"] };
  }
};

export const normalizeYesNo = (value: string): string => {
  const lower = value.toLowerCase();
  if (["y", "yes"].includes(lower)) return "Yes";
  if (["n", "no"].includes(lower)) return "No";
  return value;
};

export const normalizeNumber = (value: string): number | string => {
  const num = parseFloat(value);
  return isNaN(num) ? value : num;
};
