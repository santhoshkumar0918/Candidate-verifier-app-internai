import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useVerificationStore } from "@/lib/store";
import {
  validateAdditionalAnswer,
  normalizeYesNo,
  normalizeNumber,
} from "@/lib/validation";
import { AdditionalQuestion } from "@/lib/types";

export const AdditionalQuestions: React.FC = () => {
  const {
    inputData,
    additionalAnswers,
    setAdditionalAnswer,
    nextStep,
    prevStep,
  } = useVerificationStore();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  if (!inputData?.additionalQuestions) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">No Additional Questions</h2>
        <Button onClick={nextStep}>Continue to Summary →</Button>
      </div>
    );
  }

  const questions = inputData.additionalQuestions;

  const handleAnswerChange = (
    questionId: string,
    answer: any,
    question: AdditionalQuestion
  ) => {
    let processedAnswer = answer;

    // Process answer based on type
    if (question.type === "yesno") {
      processedAnswer = normalizeYesNo(answer);
    } else if (question.type === "number") {
      processedAnswer = normalizeNumber(answer);
    }

    setAdditionalAnswer(questionId, processedAnswer);

    const validation = validateAdditionalAnswer(question, processedAnswer);
    setErrors((prev) => ({
      ...prev,
      [questionId]: validation.errors,
    }));
  };

  const handleContinue = () => {
    const newErrors: Record<string, string[]> = {};
    let hasErrors = false;

    questions.forEach((question) => {
      const answer = additionalAnswers[question.id];
      const validation = validateAdditionalAnswer(question, answer);
      if (!validation.isValid) {
        newErrors[question.id] = validation.errors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      nextStep();
    }
  };

  const renderQuestionInput = (question: AdditionalQuestion) => {
    const currentAnswer = additionalAnswers[question.id] || "";
    const questionErrors = errors[question.id] || [];

    switch (question.type) {
      case "number":
        return (
          <Input
            type="number"
            value={currentAnswer}
            onChange={(e) =>
              handleAnswerChange(question.id, e.target.value, question)
            }
            placeholder="Enter a number"
            className={questionErrors.length > 0 ? "border-red-500" : ""}
          />
        );

      case "yesno":
        return (
          <RadioGroup
            value={currentAnswer}
            onValueChange={(value) =>
              handleAnswerChange(question.id, value, question)
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        );

      case "options":
        if (!question.options) {
          return (
            <Input
              value={currentAnswer}
              onChange={(e) =>
                handleAnswerChange(question.id, e.target.value, question)
              }
              placeholder="Enter your answer"
              className={questionErrors.length > 0 ? "border-red-500" : ""}
            />
          );
        }
        return (
          <RadioGroup
            value={currentAnswer}
            onValueChange={(value) =>
              handleAnswerChange(question.id, value, question)
            }
          >
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`${question.id}-${option}`}
                />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return (
          <Input
            value={currentAnswer}
            onChange={(e) =>
              handleAnswerChange(question.id, e.target.value, question)
            }
            placeholder="Enter your answer"
            className={questionErrors.length > 0 ? "border-red-500" : ""}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Additional Questions</h2>
        <p className="text-muted-foreground mt-2">
          Please answer the following questions to complete your profile
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                {question.questionText}
                {question.required && (
                  <span className="text-red-500 text-sm">*</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {renderQuestionInput(question)}
                {errors[question.id] && errors[question.id].length > 0 && (
                  <div className="text-sm text-red-500">
                    {errors[question.id].map((error, idx) => (
                      <p key={idx}>{error}</p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep}>
          ← Back to Field Verification
        </Button>
        <Button onClick={handleContinue}>Continue to Summary →</Button>
      </div>
    </div>
  );
};
