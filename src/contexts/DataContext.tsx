
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { StudentProgress, OfflineGrade, Unit, Word, PersonalizedTest, TestQuestionItem } from '@/lib/types';
import { units as initialUnits, studentProgressData as initialStudentProgress, offlineGradesData as initialOfflineGrades, personalizedTestsData as initialPersonalizedTests } from '@/lib/data';
import { generatePersonalizedPracticeTest } from '@/ai/flows/personalized-practice-test';

interface DataContextType {
  units: Unit[];
  studentProgress: StudentProgress[];
  offlineGrades: OfflineGrade[];
  personalizedTests: PersonalizedTest[];
  getUnitById: (unitId: string) => Unit | undefined;
  getRoundWords: (unitId: string, roundId: string) => Word[];
  getStudentProgressForUnit: (studentId: string, unitId: string) => StudentProgress[];
  getOverallUnitScore: (studentId: string, unitId: string) => number; // Average score for the unit
  getHighestRoundScore: (studentId: string, unitId: string, roundId: string) => number; // Highest score for a specific round
  addStudentProgress: (progress: Omit<StudentProgress, 'completedAt'>) => void;
  getOfflineGradesForStudent: (studentId: string) => OfflineGrade[];
  getOfflineGradeForUnit: (studentId: string, unitId: string) => OfflineGrade | undefined;
  addOfflineGrade: (grade: Omit<OfflineGrade, 'gradedAt' | 'gradedBy'>, teacherId: string) => void;
  generateAndStorePersonalizedTest: (studentId: string, unitId: string, weakWords: string[]) => Promise<PersonalizedTest | null>;
  getPersonalizedTest: (studentId: string, unitId: string) => PersonalizedTest | undefined;
  isLoadingPersonalizedTest: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  STUDENT_PROGRESS: 'linguaLearnStudentProgress',
  OFFLINE_GRADES: 'linguaLearnOfflineGrades',
  PERSONALIZED_TESTS: 'linguaLearnPersonalizedTests',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>(initialStudentProgress);
  const [offlineGrades, setOfflineGrades] = useState<OfflineGrade[]>(initialOfflineGrades);
  const [personalizedTests, setPersonalizedTests] = useState<PersonalizedTest[]>(initialPersonalizedTests);
  const [isLoadingPersonalizedTest, setIsLoadingPersonalizedTest] = useState(false);

  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEYS.STUDENT_PROGRESS);
      if (storedProgress) setStudentProgress(JSON.parse(storedProgress).map((p: StudentProgress) => ({...p, completedAt: new Date(p.completedAt)})));
      
      const storedGrades = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFLINE_GRADES);
      if (storedGrades) setOfflineGrades(JSON.parse(storedGrades).map((g: OfflineGrade) => ({...g, gradedAt: new Date(g.gradedAt)})));

      const storedPersonalizedTests = localStorage.getItem(LOCAL_STORAGE_KEYS.PERSONALIZED_TESTS);
      if (storedPersonalizedTests) setPersonalizedTests(JSON.parse(storedPersonalizedTests).map((t: PersonalizedTest) => ({...t, createdAt: new Date(t.createdAt)})));
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  const saveDataToLocalStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, []);

  const getUnitById = useCallback((unitId: string) => units.find(u => u.id === unitId), [units]);

  const getRoundWords = useCallback((unitId: string, roundId: string) => {
    const unit = getUnitById(unitId);
    const round = unit?.rounds.find(r => r.id === roundId);
    return round?.words || [];
  }, [getUnitById]);

  const getStudentProgressForUnit = useCallback((studentId: string, unitId: string) => {
    return studentProgress.filter(p => p.studentId === studentId && p.unitId === unitId);
  }, [studentProgress]);
  
  const getHighestRoundScore = useCallback((studentId: string, unitId: string, roundId: string) => {
    const roundAttempts = studentProgress.filter(
      p => p.studentId === studentId && p.unitId === unitId && p.roundId === roundId
    );
    if (roundAttempts.length === 0) return 0;
    return Math.max(...roundAttempts.map(p => p.score));
  }, [studentProgress]);

  const getOverallUnitScore = useCallback((studentId: string, unitId: string) => {
    const unit = getUnitById(unitId);
    if (!unit) return 0;
    
    let totalHighestScoreSum = 0;
    let roundsWithProgress = 0;

    unit.rounds.forEach(round => {
      const highestRoundScore = getHighestRoundScore(studentId, unitId, round.id);
      totalHighestScoreSum += highestRoundScore;
      if (studentProgress.some(p => p.studentId === studentId && p.unitId === unitId && p.roundId === round.id)) {
        // This check ensures we only count rounds that have at least one attempt for averaging.
        // However, the getHighestRoundScore already returns 0 if no attempt.
        // The definition of "overall unit score" is average of highest scores for EACH round in the unit.
      }
    });
    
    if (unit.rounds.length === 0) return 0;
    return Math.round(totalHighestScoreSum / unit.rounds.length);

  }, [studentProgress, getUnitById, getHighestRoundScore]);


  const addStudentProgress = useCallback((progress: Omit<StudentProgress, 'completedAt'>) => {
    setStudentProgress(prev => {
      const newProgress = [...prev, { ...progress, completedAt: new Date() }];
      saveDataToLocalStorage(LOCAL_STORAGE_KEYS.STUDENT_PROGRESS, newProgress);
      return newProgress;
    });
  }, [saveDataToLocalStorage]);

  const getOfflineGradesForStudent = useCallback((studentId: string) => {
    return offlineGrades.filter(g => g.studentId === studentId);
  }, [offlineGrades]);

  const getOfflineGradeForUnit = useCallback((studentId: string, unitId: string) => {
    return offlineGrades.find(g => g.studentId === studentId && g.unitId === unitId);
  }, [offlineGrades]);

  const addOfflineGrade = useCallback((grade: Omit<OfflineGrade, 'gradedAt' | 'gradedBy'>, teacherId: string) => {
    setOfflineGrades(prev => {
      const existingGradeIndex = prev.findIndex(g => g.studentId === grade.studentId && g.unitId === grade.unitId);
      const newGradeEntry = { ...grade, gradedAt: new Date(), gradedBy: teacherId };
      let newGrades;
      if (existingGradeIndex !== -1) {
        newGrades = [...prev];
        newGrades[existingGradeIndex] = newGradeEntry;
      } else {
        newGrades = [...prev, newGradeEntry];
      }
      saveDataToLocalStorage(LOCAL_STORAGE_KEYS.OFFLINE_GRADES, newGrades);
      return newGrades;
    });
  }, [saveDataToLocalStorage]);

  const generateAndStorePersonalizedTest = useCallback(async (studentId: string, unitId: string, weakWords: string[]): Promise<PersonalizedTest | null> => {
    setIsLoadingPersonalizedTest(true);
    try {
      const unitNumber = parseInt(unitId.split('-')[1]);
      if (isNaN(unitNumber)) {
        console.error("Invalid unitId format for AI test generation");
        setIsLoadingPersonalizedTest(false);
        return null;
      }
      const result = await generatePersonalizedPracticeTest({ studentId, unit: unitNumber, weakWords });
      if (result && result.testQuestions) {
        const newTest: PersonalizedTest = {
          studentId,
          unitId,
          questions: result.testQuestions,
          createdAt: new Date(),
        };
        setPersonalizedTests(prev => {
          const updatedTests = [...prev.filter(t => !(t.studentId === studentId && t.unitId === unitId)), newTest];
          saveDataToLocalStorage(LOCAL_STORAGE_KEYS.PERSONALIZED_TESTS, updatedTests);
          return updatedTests;
        });
        setIsLoadingPersonalizedTest(false);
        return newTest;
      }
      setIsLoadingPersonalizedTest(false);
      return null;
    } catch (error) {
      console.error("Error generating personalized test:", error);
      setIsLoadingPersonalizedTest(false);
      return null;
    } finally {
      // Ensure loader is always turned off
       setIsLoadingPersonalizedTest(false);
    }
  }, [saveDataToLocalStorage]);

  const getPersonalizedTest = useCallback((studentId: string, unitId: string) => {
    return personalizedTests.find(t => t.studentId === studentId && t.unitId === unitId);
  }, [personalizedTests]);

  return (
    <DataContext.Provider value={{
      units,
      studentProgress,
      offlineGrades,
      personalizedTests,
      getUnitById,
      getRoundWords,
      getStudentProgressForUnit,
      getOverallUnitScore,
      getHighestRoundScore,
      addStudentProgress,
      getOfflineGradesForStudent,
      getOfflineGradeForUnit,
      addOfflineGrade,
      generateAndStorePersonalizedTest,
      getPersonalizedTest,
      isLoadingPersonalizedTest
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
