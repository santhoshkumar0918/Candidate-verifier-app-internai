import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, RotateCcw } from "lucide-react";
import { useVerificationStore } from "@/lib/store";

export const CompleteScreen: React.FC = () => {
  const { outputData, reset } = useVerificationStore();

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

  const handleStartOver = () => {
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          Verification Complete!
        </h2>
        <p className="text-muted-foreground text-lg">
          Your candidate details have been successfully verified and saved.
        </p>
      </div>

      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="text-lg text-green-700">
            Verification Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session ID:</span>
              <span className="font-medium">{outputData?.sessionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-green-600">Verified ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completion Time:</span>
              <span className="font-medium">
                {outputData?.timestamp
                  ? new Date(outputData.timestamp).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fields Verified:</span>
              <span className="font-medium">
                {outputData?.correctedData
                  ? Object.keys(outputData.correctedData).length
                  : 0}{" "}
                fields
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                1
              </div>
              <p>
                Your verified data has been processed and is ready for download
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                2
              </div>
              <p>Download the JSON file for your records or integration</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5">
                3
              </div>
              <p>You can start a new verification process anytime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
        <Button
          onClick={downloadOutput}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Verification Results
        </Button>
        <Button variant="outline" onClick={handleStartOver} size="lg">
          <RotateCcw className="h-4 w-4 mr-2" />
          Start New Verification
        </Button>
      </div>

      {/* Optional: Show output preview */}
      {outputData && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Output Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-60 overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(outputData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
