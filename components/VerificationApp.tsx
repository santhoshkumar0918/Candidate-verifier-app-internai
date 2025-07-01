import React from "react";
import { Progress } from "@/components/ui/progress";
import { useVerificationStore } from "@/lib/store";
import { DataInput } from "./DataInput";
import { FieldVerification } from "./FieldVerification";
import { AdditionalQuestions } from "./AdditionalQuestions";
import { SummaryScreen } from "./SummaryScreen";
import { CompleteScreen } from "./CompleteScreen";

export const VerificationApp: React.FC = () => {
  const { step } = useVerificationStore();

  const getStepProgress = () => {
    switch (step) {
      case "loading":
        return 0;
      case "field-verification":
        return 25;
      case "additional-questions":
        return 50;
      case "summary":
        return 75;
      case "complete":
        return 100;
      default:
        return 0;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "loading":
        return "Load Data";
      case "field-verification":
        return "Verify Fields";
      case "additional-questions":
        return "Additional Questions";
      case "summary":
        return "Review Summary";
      case "complete":
        return "Complete";
      default:
        return "";
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case "loading":
        return <DataInput />;
      case "field-verification":
        return <FieldVerification />;
      case "additional-questions":
        return <AdditionalQuestions />;
      case "summary":
        return <SummaryScreen />;
      case "complete":
        return <CompleteScreen />;
      default:
        return <DataInput />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Header */}
        {step !== "loading" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-sm font-medium text-muted-foreground">
                Step {getStepProgress() / 25} of 4
              </h1>
              <span className="text-sm font-medium text-muted-foreground">
                {getStepTitle()}
              </span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">{renderCurrentStep()}</div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Candidate Detail Verifier</p>
        </footer>
      </div>
    </div>
  );
};
