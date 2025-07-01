import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download } from "lucide-react";
import { useVerificationStore } from "@/lib/store";

export const SummaryScreen: React.FC = () => {
  const {
    inputData,
    fieldStatuses,
    additionalAnswers,
    outputData,
    nextStep,
    prevStep,
    generateOutput,
  } = useVerificationStore();

  React.useEffect(() => {
    generateOutput();
  }, [generateOutput]);

  const downloadOutput = () => {
    if (!outputData) return;

    const dataStr = JSON.stringify(outputData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `candidate-verification-${outputData.sessionId}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      available: "Availability",
      skills: "Skills",
    };
    return labels[field] || field;
  };

  const getQuestionLabel = (questionId: string): string => {
    const question = inputData?.additionalQuestions?.find(
      (q) => q.id === questionId
    );
    return question?.questionText || questionId;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <h2 className="text-2xl font-bold">Verification Summary</h2>
        </div>
        <p className="text-muted-foreground">
          Please review your information before finalizing
        </p>
      </div>

      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Session ID</p>
              <p className="font-medium">{inputData?.sessionId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verified Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(fieldStatuses).map(([field, status]) => (
              <div
                key={field}
                className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{getFieldLabel(field)}</p>
                  <p className="text-sm text-muted-foreground">
                    {status.value}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Answers */}
      {Object.keys(additionalAnswers).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(additionalAnswers).map(([questionId, answer]) => (
                <div
                  key={questionId}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {getQuestionLabel(questionId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {answer?.toString() || "Not provided"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-600"
                  >
                    Answered
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Output Preview */}
      {outputData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Output Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(outputData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep}>
          ← Back to Questions
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={downloadOutput}>
            <Download className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
          <Button
            onClick={nextStep}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete Verification →
          </Button>
        </div>
      </div>
    </div>
  );
};
