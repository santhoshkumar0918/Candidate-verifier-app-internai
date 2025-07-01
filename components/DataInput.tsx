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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Code,
  Clock,
} from "lucide-react";
import { useVerificationStore } from "@/lib/store";
import { InputData, AdditionalQuestion } from "@/lib/types";

export const DataInput: React.FC = () => {
  const { setInputData } = useVerificationStore();

  // Basic fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [available, setAvailable] = useState<
    "Y" | "N" | "Yes" | "No" | "yes" | "no"
  >("Yes");
  const [skills, setSkills] = useState("");

  // Additional questions
  const [additionalQuestions, setAdditionalQuestions] = useState<
    AdditionalQuestion[]
  >([
    {
      id: "noticePeriod",
      questionText: "What is your notice period?",
      type: "text",
      required: true,
    },
  ]);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const addQuestion = () => {
    const newQuestion: AdditionalQuestion = {
      id: `question_${Date.now()}`,
      questionText: "",
      type: "text",
      required: false,
    };
    setAdditionalQuestions([...additionalQuestions, newQuestion]);
  };

  const updateQuestion = (
    index: number,
    updates: Partial<AdditionalQuestion>
  ) => {
    const updated = [...additionalQuestions];
    updated[index] = { ...updated[index], ...updates };
    setAdditionalQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setAdditionalQuestions(additionalQuestions.filter((_, i) => i !== index));
  };

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
      additionalQuestions: additionalQuestions.filter(
        (q) => q.questionText.trim() !== ""
      ),
    };

    setInputData(inputData);
  };

  const loadSampleData = () => {
    setName("John Doe");
    setEmail("john@example.com");
    setPhone("1234567890");
    setAvailable("Yes");
    setSkills("React, TypeScript, Node.js");

    setAdditionalQuestions([
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
        required: false,
      },
    ]);
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

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <Button onClick={loadSampleData} variant="outline">
          Load Sample Data
        </Button>
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outline"
        >
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </Button>
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

      {/* Additional Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Additional Questions
            </div>
            <Button onClick={addQuestion} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {additionalQuestions.map((question, index) => (
            <Card key={question.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Question {index + 1}</Badge>
                  {additionalQuestions.length > 1 && (
                    <Button
                      onClick={() => removeQuestion(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Question Text</Label>
                  <Input
                    value={question.questionText}
                    onChange={(e) =>
                      updateQuestion(index, { questionText: e.target.value })
                    }
                    placeholder="Enter your question"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Answer Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value: any) =>
                        updateQuestion(index, { type: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="yesno">Yes/No</SelectItem>
                        <SelectItem value="options">Multiple Choice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      checked={question.required}
                      onCheckedChange={(checked) =>
                        updateQuestion(index, { required: checked })
                      }
                    />
                    <Label>Required</Label>
                  </div>
                </div>

                {question.type === "options" && (
                  <div>
                    <Label>Options (comma-separated)</Label>
                    <Input
                      value={question.options?.join(", ") || ""}
                      onChange={(e) =>
                        updateQuestion(index, {
                          options: e.target.value
                            .split(",")
                            .map((opt) => opt.trim())
                            .filter((opt) => opt),
                        })
                      }
                      placeholder="Option 1, Option 2, Option 3"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Start Verification */}
      <div className="text-center pt-6">
        <Button
          onClick={handleStartVerification}
          disabled={!isFormValid}
          size="lg"
          className="px-8"
        >
          Start Verification Process →
        </Button>
        {!isFormValid && (
          <p className="text-sm text-muted-foreground mt-2">
            Please fill in all required fields (marked with *)
          </p>
        )}
      </div>
    </div>
  );
};
