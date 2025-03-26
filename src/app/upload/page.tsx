"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || cvFiles.length === 0) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("jobTitle", jobTitle);
    cvFiles.forEach((file) => formData.append("cvFiles", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { id } = await response.json();
        router.push(`/results/${id}`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Documents</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., Senior Data Scientist"
            />
          </div>

          {/* Job Description Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Description (PDF/DOCX)
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setJobDescription(e.target.files?.[0] || null)}
                className="w-full"
              />
              {jobDescription && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {jobDescription.name}
                </p>
              )}
            </div>
          </div>

          {/* CV Files Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              CV Files (PDF/DOCX)
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.docx"
                multiple
                onChange={(e) => setCvFiles(Array.from(e.target.files || []))}
                className="w-full"
              />
              {cvFiles.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {cvFiles.length} file(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !jobDescription || cvFiles.length === 0}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium
                     hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Analyze CVs"}
          </button>
        </form>
      </div>
    </div>
  );
} 