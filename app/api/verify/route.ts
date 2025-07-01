import { NextRequest, NextResponse } from "next/server";
import { inputDataSchema, outputDataSchema } from "@/lib/types";
import { validateField, validateAdditionalAnswer } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const inputData = inputDataSchema.parse(body);

    // Process and validate all fields
    const correctedData: Record<string, any> = {};
    const fieldErrors: Record<string, string[]> = {};

    // Validate existing fields
    Object.entries(inputData.fields).forEach(([field, value]) => {
      const validation = validateField(field, value);
      if (validation.isValid) {
        correctedData[field] = value;
      } else {
        fieldErrors[field] = validation.errors;
      }
    });

    // Validate additional questions if provided
    if (body.additionalAnswers) {
      Object.entries(body.additionalAnswers).forEach(([questionId, answer]) => {
        const question = inputData.additionalQuestions.find(
          (q) => q.id === questionId
        );
        if (question) {
          const validation = validateAdditionalAnswer(question, answer);
          if (validation.isValid) {
            correctedData[questionId] = answer;
          } else {
            fieldErrors[questionId] = validation.errors;
          }
        }
      });
    }

    // Check if there are any validation errors
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors: fieldErrors,
          message: "Validation failed for some fields",
        },
        { status: 400 }
      );
    }

    // Generate output
    const outputData = {
      sessionId: inputData.sessionId,
      verified: true,
      correctedData,
      timestamp: new Date().toISOString(),
    };

    // Validate output data
    const validatedOutput = outputDataSchema.parse(outputData);

    return NextResponse.json({
      success: true,
      data: validatedOutput,
      message: "Verification completed successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          error: "Validation failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Candidate Detail Verifier API",
    version: "1.0.0",
    endpoints: {
      "POST /api/verify": "Verify candidate data",
    },
    status: "active",
  });
}
