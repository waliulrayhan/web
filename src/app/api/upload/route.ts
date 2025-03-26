import { NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobDescription = formData.get("jobDescription") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const cvFiles = formData.getAll("cvFiles") as File[];

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "uploads");
    await createDirIfNotExists(uploadDir);

    // Save job description
    const jdPath = join(uploadDir, `jd-${Date.now()}-${jobDescription.name}`);
    await writeFile(jdPath, Buffer.from(await jobDescription.arrayBuffer()));

    // Create screening session
    const session = await prisma.screeningSession.create({
      data: {
        jobTitle,
        jobDescription: jdPath,
      },
    });

    // Save CV files and create candidate entries
    for (const cvFile of cvFiles) {
      const cvPath = join(uploadDir, `cv-${Date.now()}-${cvFile.name}`);
      await writeFile(cvPath, Buffer.from(await cvFile.arrayBuffer()));
      
      await prisma.candidate.create({
        data: {
          cvFile: cvPath,
          sessionId: session.id,
        },
      });
    }

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
} 