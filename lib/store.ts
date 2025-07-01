import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  VerificationState,
  VerificationActions,
  InputData,
  FieldStatus,
} from "./types";
import { validateField } from "./validation";

type VerificationStore = VerificationState & VerificationActions;

export const useVerificationStore = create<VerificationStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      step: "loading",
      inputData: null,
      fieldStatuses: {},
      additionalAnswers: {},
      outputData: null,
      currentFieldIndex: 0,
      currentQuestionIndex: 0,

      // Actions
      setInputData: (data: InputData) => {
        const fieldStatuses: Record<string, FieldStatus> = {};

        // Initialize field statuses with validation
        Object.entries(data.fields).forEach(([field, value]) => {
          const validation = validateField(field, value);
          fieldStatuses[field] = {
            field,
            value,
            isValid: validation.isValid,
            isConfirmed: false,
            errors: validation.errors,
          };
        });

        set({
          inputData: data,
          fieldStatuses,
          step: "field-verification",
        });
      },

      updateFieldStatus: (field: string, status: Partial<FieldStatus>) => {
        set((state) => ({
          fieldStatuses: {
            ...state.fieldStatuses,
            [field]: {
              ...state.fieldStatuses[field],
              ...status,
            },
          },
        }));
      },

      setAdditionalAnswer: (questionId: string, answer: any) => {
        set((state) => ({
          additionalAnswers: {
            ...state.additionalAnswers,
            [questionId]: answer,
          },
        }));
      },

      nextStep: () => {
        const state = get();
        switch (state.step) {
          case "loading":
            set({ step: "field-verification" });
            break;
          case "field-verification":
            set({ step: "additional-questions" });
            break;
          case "additional-questions":
            set({ step: "summary" });
            break;
          case "summary":
            get().generateOutput();
            set({ step: "complete" });
            break;
        }
      },

      prevStep: () => {
        const state = get();
        switch (state.step) {
          case "field-verification":
            set({ step: "loading" });
            break;
          case "additional-questions":
            set({ step: "field-verification" });
            break;
          case "summary":
            set({ step: "additional-questions" });
            break;
          case "complete":
            set({ step: "summary" });
            break;
        }
      },

      goToStep: (step) => {
        set({ step });
      },

      generateOutput: () => {
        const state = get();
        if (!state.inputData) return;

        const correctedData: Record<string, any> = {};

        // Add corrected field data
        Object.entries(state.fieldStatuses).forEach(([field, status]) => {
          correctedData[field] = status.value;
        });

        // Add additional answers
        Object.entries(state.additionalAnswers).forEach(
          ([questionId, answer]) => {
            correctedData[questionId] = answer;
          }
        );

        const outputData = {
          sessionId: state.inputData.sessionId,
          verified: true,
          correctedData,
          timestamp: new Date().toISOString(),
        };

        set({ outputData });
      },

      reset: () => {
        set({
          step: "loading",
          inputData: null,
          fieldStatuses: {},
          additionalAnswers: {},
          outputData: null,
          currentFieldIndex: 0,
          currentQuestionIndex: 0,
        });
      },
    }),
    {
      name: "verification-store",
    }
  )
);
