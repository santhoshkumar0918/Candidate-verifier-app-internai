import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Edit } from "lucide-react";
import { useVerificationStore } from "@/lib/store";
import { validateField } from "@/lib/validation";
import { FieldStatus } from "@/lib/types";

export const FieldVerification: React.FC = () => {
  const { fieldStatuses, updateFieldStatus, nextStep } = useVerificationStore();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const fields = Object.values(fieldStatuses) as FieldStatus[];
  const allFieldsValid = fields.every((field) => field.isValid);

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValue(currentValue?.toString() || "");
  };

  const handleSaveEdit = (field: string) => {
    const validation = validateField(field, editValue);
    updateFieldStatus(field, {
      value: editValue,
      isValid: validation.isValid,
      errors: validation.errors,
    });
    setEditingField(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleConfirmAll = () => {
    fields.forEach((field) => {
      if (field.isValid) {
        updateFieldStatus(field.field, { isConfirmed: true });
      }
    });
    nextStep();
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify Your Details</h2>
        <p className="text-muted-foreground mt-2">
          Please review and correct the following information if needed
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((fieldStatus) => (
          <Card key={fieldStatus.field} className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getFieldLabel(fieldStatus.field)}
                {fieldStatus.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingField === fieldStatus.field ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={fieldStatus.field}>
                      Enter correct{" "}
                      {getFieldLabel(fieldStatus.field).toLowerCase()}
                    </Label>
                    <Input
                      id={fieldStatus.field}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder={`Enter ${getFieldLabel(
                        fieldStatus.field
                      ).toLowerCase()}`}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(fieldStatus.field)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {fieldStatus.value || "Not provided"}
                      </p>
                      {fieldStatus.errors.length > 0 && (
                        <p className="text-sm text-red-500 mt-1">
                          {fieldStatus.errors.join(", ")}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleEdit(fieldStatus.field, fieldStatus.value)
                      }
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Single confirmation section */}
      <div className="border-t pt-6">
        {allFieldsValid ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">All fields are valid!</span>
            </div>
            <Button
              onClick={handleConfirmAll}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm All Details & Continue →
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">
                Please correct the errors above before continuing
              </span>
            </div>
            <Button disabled size="lg" variant="outline">
              Fix Errors to Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
