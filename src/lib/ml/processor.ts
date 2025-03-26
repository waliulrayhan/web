interface ProcessedCV {
  name: string;
  score: number;
  skillMatch: number;
  experience: number;
  explanation: string;
}

export async function processCV(
  cvPath: string,
  jobDescription: string
): Promise<ProcessedCV> {
  try {
    // Call your Python ML script here
    const response = await fetch("/api/ml/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cvPath,
        jobDescription,
      }),
    });

    if (!response.ok) {
      throw new Error("ML processing failed");
    }

    return await response.json();
  } catch (error) {
    console.error("CV processing error:", error);
    return {
      name: "Unknown",
      score: 0,
      skillMatch: 0,
      experience: 0,
      explanation: "Failed to process CV",
    };
  }
} 