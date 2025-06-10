
"use client";
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpenCheck, FileText, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentGradesPage() {
  const { currentUser } = useAuth();
  const { units, getOfflineGradeForUnit, getOverallUnitScore } = useData();

  if (!currentUser) {
    return (
       <div className="space-y-6">
        <Skeleton className="h-10 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-6" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const gradesData = units.map(unit => {
    const offlineGrade = getOfflineGradeForUnit(currentUser.id, unit.id);
    const onlineProgress = getOverallUnitScore(currentUser.id, unit.id);
    return {
      unitName: unit.name,
      onlineProgress: onlineProgress,
      offlineGrade: offlineGrade ? offlineGrade.grade : null,
      gradedAt: offlineGrade ? new Date(offlineGrade.gradedAt).toLocaleDateString() : null,
    };
  });

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return "secondary";
    if (grade >= 4) return "default"; // Shadcn primary is default for Badge
    if (grade === 3) return "secondary"; // Yellowish/Orange often works for 'ok'
    return "destructive";
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary flex items-center">
          <BookOpenCheck className="mr-3 h-8 w-8" /> My Grades & Progress
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Track your online progress and view grades for offline tests.
        </p>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Performance Summary</CardTitle>
          <CardDescription>Overview of your scores across all units.</CardDescription>
        </CardHeader>
        <CardContent>
          {gradesData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Unit</TableHead>
                  <TableHead className="text-center">Online Progress (%)</TableHead>
                  <TableHead className="text-center">Offline Test Grade</TableHead>
                  <TableHead className="text-right">Graded On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradesData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.unitName}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.onlineProgress >= 70 ? "default" : item.onlineProgress >= 50 ? "secondary" : "outline"} className="text-sm px-3 py-1">
                        {item.onlineProgress}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.offlineGrade !== null ? (
                         <Badge variant={getGradeColor(item.offlineGrade)} className="text-sm px-3 py-1">
                           {item.offlineGrade} <Star className="ml-1 h-3 w-3 fill-current" />
                         </Badge>
                      ) : (
                        <Badge variant="outline" className="text-sm">Not Graded</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.gradedAt || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">No grades or progress information available yet.</p>
              <p>Complete some units and tests to see your performance here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
