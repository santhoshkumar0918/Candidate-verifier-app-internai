import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Clock } from "lucide-react";
import { useVerificationStore } from "@/lib/store";
import { InputData } from "@/lib/types";

export const DataInput: React.FC = () => {
  const { setInputData } = useVerificationStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [available, setAvailable] = useState<
    "Y" | "N" | "Yes" | "No" | "yes" | "no"
  >("Yes");
  const [skills, setSkills] = useState("");

  // Default questions with third one as required
  const defaultAdditionalQuestions: {
    id: string;
    questionText: string;
    type: "text" | "number" | "options" | "yesno";
    required: boolean;
    options?: string[];
  }[] = [
    {
      id: "noticePeriod",
      questionText: "What is your notice period?",
      type: "text",
      required: true,
    },
    {
      id: "experience",
      questionText: "How many years of experience do you have?",
      type: "number",
      required: false,
    },
    {
      id: "preferredLocation",
      questionText: "Which location do you prefer to work from?",
      type: "text",
      required: true, // Made required
    },
  ];

  const handleStartVerification = () => {
    const inputData: InputData = {
      sessionId: `session_${Date.now()}`,
      fields: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        available,
        skills: skills.trim(),
      },
      additionalQuestions: defaultAdditionalQuestions,
    };

    setInputData(inputData);
  };

  const loadSampleData = () => {
    setName("Santhosh kumar");
    setEmail("santhosh@gmail.com");
    setPhone("1234567890");
    setAvailable("Yes");
    setSkills("React, TypeScript, Node.js");
  };

  const isFormValid = name.trim() && email.trim() && phone.trim();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          Setup Candidate Verification
        </h2>
        <p className="text-muted-foreground text-lg">
          Enter candidate details to begin the verification process
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="available">Availability</Label>
              <Select
                value={available}
                onValueChange={(value) =>
                  setAvailable(value as typeof available)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Available</SelectItem>
                  <SelectItem value="No">Not Available</SelectItem>
                  <SelectItem value="Y">Y</SelectItem>
                  <SelectItem value="N">N</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="skills">Skills (Optional)</Label>
            <Textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, TypeScript, Node.js, Python..."
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Questions Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Additional Questions Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg space-y-3">
            <p className="font-medium text-sm text-blue-900">
              These questions will be asked during verification:
            </p>
            <div className="space-y-2">
              {defaultAdditionalQuestions.map((question, index) => (
                <div key={question.id} className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-gray-800 font-medium">
                      {question.questionText}
                    </span>
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        question.required
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {question.required ? "Required" : "Optional"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-6">
        <Button onClick={loadSampleData} variant="outline" size="lg">
          Load Sample Data
        </Button>
        <Button
          onClick={handleStartVerification}
          disabled={!isFormValid}
          size="lg"
          className="px-8"
        >
          Start Verification Process →
        </Button>
      </div>

      {!isFormValid && (
        <p className="text-sm text-muted-foreground text-center">
          Please fill in all required fields (marked with *)
        </p>
      )}
    </div>
  );
};
