
"use client";
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { users as allUsers } from '@/lib/data'; // All users for student list
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Presentation, Users, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherDashboardPage() {
  const { units, getOverallUnitScore, studentProgress } = useData(); // studentProgress for detailed view
  const [openStudentId, setOpenStudentId] = useState<string | null>(null);

  const students = allUsers.filter(user => user.role === 'student');

  if (students.length === 0) {
     return (
       <div className="space-y-6">
        <Skeleton className="h-10 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-6" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-64">
             <Users className="h-16 w-16 text-muted-foreground mb-4" />
             <p className="text-xl text-muted-foreground">No students found.</p>
          </CardContent>
        </Card>
      </div>
     );
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary flex items-center">
          <Presentation className="mr-3 h-8 w-8" /> Student Progress Overview
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Monitor your students' performance across all units.
        </p>
      </div>

      {students.map(student => {
        const studentUnitProgress = units.map(unit => ({
          unitId: unit.id,
          unitName: unit.name,
          score: getOverallUnitScore(student.id, unit.id),
        }));
        
        const overallStudentProgress = studentUnitProgress.length > 0 
          ? Math.round(studentUnitProgress.reduce((sum, up) => sum + up.score, 0) / studentUnitProgress.length)
          : 0;

        return (
          <Collapsible
            key={student.id}
            open={openStudentId === student.id}
            onOpenChange={() => setOpenStudentId(prev => prev === student.id ? null : student.id)}
            className="space-y-2"
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer" onClick={() => setOpenStudentId(prev => prev === student.id ? null : student.id)}>
                <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-xl font-headline">{student.name}</CardTitle>
                        <CardDescription>Overall Progress: {overallStudentProgress}%</CardDescription>
                    </div>
                </div>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        {openStudentId === student.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
              </CardHeader>
              <Progress value={overallStudentProgress} className="h-1 rounded-none" />
              
              <CollapsibleContent>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%] pl-4">Unit</TableHead>
                        <TableHead className="text-center">Progress (%)</TableHead>
                        <TableHead className="text-right pr-4">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentUnitProgress.map(up => (
                        <TableRow key={up.unitId}>
                          <TableCell className="font-medium pl-4">{up.unitName}</TableCell>
                          <TableCell className="text-center">
                             <Badge variant={up.score >= 70 ? "default" : up.score >= 50 ? "secondary" : "outline"} className="text-sm">
                                {up.score}%
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Button variant="link" size="sm" asChild>
                              <Link href={`/teacher/student/${student.id}/unit/${up.unitId}/details`}>
                                View Details
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}
