
"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { users as allUsers, units as allUnits } from '@/lib/data';
import type { User, Unit, Word, StudentProgress as StudentProgressType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle }
from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookUser, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentUnitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getStudentProgressForUnit, getUnitById, getRoundWords } = useData();

  const studentId = Array.isArray(params.studentId) ? params.studentId[0] : params.studentId;
  const unitId = Array.isArray(params.unitId) ? params.unitId[0] : params.unitId;

  const [student, setStudent] = useState<User | null>(null);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [progressDetails, setProgressDetails] = useState<StudentProgressType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId && unitId) {
      const currentStudent = allUsers.find(u => u.id === studentId) || null;
      const currentUnit = getUnitById(unitId) || null; // Use getUnitById from DataContext for consistency
      const studentProgress = getStudentProgressForUnit(studentId, unitId);
      
      setStudent(currentStudent);
      setUnit(currentUnit);
      setProgressDetails(studentProgress.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())); // Show most recent first
      setLoading(false);
    }
  }, [studentId, unitId, getStudentProgressForUnit, getUnitById]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-6" />
        <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (!student || !unit) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Student or Unit not found.</h2>
        <Button onClick={() => router.push('/teacher/dashboard')} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }
  
  const getWordById = (wordId: string): Word | undefined => {
    for (const round of unit.rounds) {
        const word = round.words.find(w => w.id === wordId);
        if (word) return word;
    }
    // Fallback: check all units if not found in current (should ideally not be needed)
    for (const u of allUnits) {
        for (const r of u.rounds) {
            const word = r.words.find(w => w.id === wordId);
            if (word) return word;
        }
    }
    return undefined;
  };

  return (
    <div className="space-y-8">
      <div>
        <Button onClick={() => router.push('/teacher/dashboard')} variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary flex items-center">
          <BookUser className="mr-3 h-8 w-8" /> Progress Details
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Student: <span className="font-semibold">{student.name}</span> | Unit: <span className="font-semibold">{unit.name}</span>
        </p>
      </div>

      {progressDetails.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No progress recorded for this student in this unit yet.
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-20rem)]"> {/* Adjust height as needed */}
          <div className="space-y-6 pr-4">
            {progressDetails.map((attempt, index) => {
              const round = unit.rounds.find(r => r.id === attempt.roundId);
              return (
                <Card key={index} className="shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl">
                            {round?.name || 'Unknown Round'} Test Attempt
                            </CardTitle>
                            <CardDescription>
                            Completed on: {new Date(attempt.completedAt).toLocaleString()}
                            </CardDescription>
                        </div>
                        <Badge variant={attempt.score >= 70 ? "default" : attempt.score >= 50 ? "secondary" : "destructive"} className="text-lg px-4 py-2">
                            {attempt.score}%
                        </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {attempt.incorrectWords && attempt.incorrectWords.length > 0 ? (
                      <div>
                        <h4 className="font-semibold mb-2 text-destructive">Incorrectly Answered Words:</h4>
                        <ul className="space-y-1 text-sm">
                          {attempt.incorrectWords.map(wordId => {
                            const word = getWordById(wordId);
                            return (
                              <li key={wordId} className="flex items-center">
                                <XCircle className="h-4 w-4 mr-2 text-destructive flex-shrink-0" />
                                <span>{word?.english || 'Unknown word'} - <span className="italic text-muted-foreground">{word?.russian || 'N/A'}</span></span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <p>All words answered correctly in this attempt!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
