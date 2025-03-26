"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Candidate {
  id: string;
  name: string;
  score: number;
  skillMatch: number;
  experience: number;
  explanation: string;
  cvPath: string;
}

export default function ResultsPage() {
  const { id } = useParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minSkillMatch: 0,
    minExperience: 0,
    minScore: 0,
  });
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/results/${id}`);
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.skillMatch >= filters.minSkillMatch &&
      candidate.experience >= filters.minExperience &&
      candidate.score >= filters.minScore
  );

  const downloadCV = async (cvPath: string) => {
    try {
      const response = await fetch(`/api/download?path=${cvPath}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = cvPath.split("/").pop() || "cv.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download CV:", error);
    }
  };

  const exportResults = () => {
    const csv = [
      ["Name", "Score", "Skill Match", "Experience", "Explanation"],
      ...filteredCandidates.map((c) => [
        c.name,
        c.score,
        c.skillMatch,
        c.experience,
        c.explanation,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv-screening-results.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading results...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Screening Results</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">
            Minimum Skill Match: {filters.minSkillMatch}%
          </label>
          <Slider
            value={[filters.minSkillMatch]}
            onValueChange={(value: number[]) =>
              setFilters({ ...filters, minSkillMatch: value[0] })
            }
            max={100}
            step={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Minimum Experience: {filters.minExperience} years
          </label>
          <Slider
            value={[filters.minExperience]}
            onValueChange={(value: number[]) =>
              setFilters({ ...filters, minExperience: value[0] })
            }
            max={20}
            step={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Minimum Score: {filters.minScore}%
          </label>
          <Slider
            value={[filters.minScore]}
            onValueChange={(value: number[]) =>
              setFilters({ ...filters, minScore: value[0] })
            }
            max={100}
            step={1}
          />
        </div>
      </div>

      {/* Export Button */}
      <Button onClick={exportResults} className="mb-6">
        Export Results (CSV)
      </Button>

      {/* Results Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Skill Match</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>{candidate.name}</TableCell>
              <TableCell>{candidate.score.toFixed(2)}%</TableCell>
              <TableCell>{candidate.skillMatch}%</TableCell>
              <TableCell>{candidate.experience} years</TableCell>
              <TableCell>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    Explain
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadCV(candidate.cvPath)}
                  >
                    Download CV
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Explanation Dialog */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={() => setSelectedCandidate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Score Explanation</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="font-medium mb-2">{selectedCandidate?.name}</h3>
            <p className="text-sm text-gray-600">
              {selectedCandidate?.explanation}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 