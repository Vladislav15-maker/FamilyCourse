
"use client";
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { users as allUsers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookOpenCheck, UserCheck, Save, Edit, Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherGradesPage() {
  const { currentUser } = useAuth();
  const { units, offlineGrades, addOfflineGrade, getOfflineGradeForUnit } = useData();
  const { toast } = useToast();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>(''); // Store as string for Select
  
  const students = allUsers.filter(user => user.role === 'student');

  if (!currentUser) {
    return (
       <div className="space-y-6">
        <Skeleton className="h-10 w-1/2 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-6" />
        <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
      </div>
    );
  }

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedUnitId || !selectedGrade) {
      toast({ title: "Incomplete Form", description: "Please select student, unit, and grade.", variant: "destructive" });
      return;
    }
    addOfflineGrade({
      studentId: selectedStudentId,
      unitId: selectedUnitId,
      grade: parseInt(selectedGrade),
    }, currentUser.id);

    toast({ title: "Grade Submitted", description: `Grade ${selectedGrade} for unit ${units.find(u=>u.id === selectedUnitId)?.name.split(':')[0]} submitted for ${students.find(s=>s.id === selectedStudentId)?.name}.` });
    // Optionally reset form:
    // setSelectedStudentId('');
    // setSelectedUnitId('');
    // setSelectedGrade('');
  };
  
  const getGradeColor = (grade: number | null) => {
    if (grade === null) return "secondary";
    if (grade >= 4) return "default";
    if (grade === 3) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary flex items-center">
          <BookOpenCheck className="mr-3 h-8 w-8" /> Offline Test Grading
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Input and manage offline test grades for your students.
        </p>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center"><Edit className="mr-2 h-6 w-6 text-accent" /> Submit New Grade</CardTitle>
          <CardDescription>Select student, unit, and enter the grade.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitGrade} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="student">Student</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger id="student"><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="unit">Unit</Label>
              <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                <SelectTrigger id="unit"><SelectValue placeholder="Select unit" /></SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <Label htmlFor="grade">Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger id="grade"><SelectValue placeholder="Select grade" /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2].map(grade => (
                    <SelectItem key={grade} value={String(grade)}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full md:col-span-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Save className="mr-2 h-4 w-4" /> Submit Grade
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center"><UserCheck className="mr-2 h-6 w-6 text-primary" /> Submitted Grades Overview</CardTitle>
          <CardDescription>View all offline grades recorded.</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length > 0 && units.length > 0 ? (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Student</TableHead>
                  {units.map(unit => (
                    <TableHead key={unit.id} className="text-center min-w-[120px]">{unit.name.split(':')[0]}</TableHead> // Shorten unit name
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    {units.map(unit => {
                      const gradeEntry = getOfflineGradeForUnit(student.id, unit.id);
                      return (
                        <TableCell key={unit.id} className="text-center">
                          {gradeEntry ? (
                            <Badge variant={getGradeColor(gradeEntry.grade)} className="text-sm">
                              {gradeEntry.grade} <Star className="ml-1 h-3 w-3 fill-current"/>
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No students or units available to display grades.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
