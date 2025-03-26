import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { processCV } from "@/lib/ml/processor";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.screeningSession.findUnique({
      where: { id: params.id },
      include: { candidates: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Screening session not found" },
        { status: 404 }
      );
    }

    // Process candidates using ML model
    const processedCandidates = await Promise.all(
      session.candidates.map(async (candidate) => {
        const result = await processCV(
          candidate.cvFile,
          session.jobDescription
        );

        return {
          id: candidate.id,
          name: result.name,
          score: result.score,
          skillMatch: result.skillMatch,
          experience: result.experience,
          explanation: result.explanation,
          cvPath: candidate.cvFile,
        };
      })
    );

    return NextResponse.json({
      candidates: processedCandidates.sort((a, b) => b.score - a.score),
    });
  } catch (error) {
    console.error("Failed to fetch results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
} 