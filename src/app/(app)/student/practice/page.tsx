
"use client";
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, ArrowLeft, Check, RefreshCw, Send } from 'lucide-react';
import TestQuestionDisplay from '@/components/student/TestQuestionDisplay';
import type { TestQuestionItem, PersonalizedTest } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';


interface AIPracticeTestQuestion {
  wordToTranslate: string; // English word
  correctTranslation: string; // Correct Russian translation
  options: string[]; // Russian options
}

export default function PersonalizedPracticePage() {
  const { currentUser } = useAuth();
  const { units, generateAndStorePersonalizedTest, getPersonalizedTest, isLoadingPersonalizedTest: isGeneratingTest, studentProgress } = useData();
  const { toast } = useToast();

  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [weakWordsInput, setWeakWordsInput] = useState<string>('');
  
  const [currentTest, setCurrentTest] = useState<PersonalizedTest | null>(null);
  const [testQuestions, setTestQuestions] = useState<AIPracticeTestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // { englishWord: selectedRussianOption }
  const [score, setScore] = useState<number | null>(null);
  const [incorrectlyAnsweredItems, setIncorrectlyAnsweredItems] = useState<AIPracticeTestQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isLoadingExistingTest, setIsLoadingExistingTest] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const playAudio = (text: string) => {
    if (speechSynthesis && text) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const deriveWeakWords = (unitId: string): string[] => {
    if (!currentUser) return [];
    const progressForUnit = studentProgress.filter(p => p.studentId === currentUser.id && p.unitId === unitId);
    const allIncorrectWordIds = new Set<string>();
    progressForUnit.forEach(p => {
      p.incorrectWords?.forEach(id => allIncorrectWordIds.add(id));
    });

    // Find the English names of these weak words
    const unitData = units.find(u => u.id === unitId);
    if (!unitData) return [];
    const weakEnglishWords = Array.from(allIncorrectWordIds).map(id => {
      for (const round of unitData.rounds) {
        const word = round.words.find(w => w.id === id);
        if (word) return word.english;
      }
      return null;
    }).filter(Boolean) as string[];
    
    return Array.from(new Set(weakEnglishWords)); // Unique weak English words
  };
  
  useEffect(() => {
    if (selectedUnitId && currentUser) {
      const autoWeakWords = deriveWeakWords(selectedUnitId);
      setWeakWordsInput(autoWeakWords.join(', '));

      // Attempt to load existing test
      setIsLoadingExistingTest(true);
      const existingTest = getPersonalizedTest(currentUser.id, selectedUnitId);
      if (existingTest) {
        setCurrentTest(existingTest);
        const formattedQuestions = existingTest.questions.map(q => ({
            wordToTranslate: q.word,
            correctTranslation: q.translation,
            options: q.options,
        }));
        setTestQuestions(formattedQuestions);
        resetTestState();
      } else {
        setCurrentTest(null);
        setTestQuestions([]);
      }
      setIsLoadingExistingTest(false);
    }
  }, [selectedUnitId, currentUser, getPersonalizedTest, studentProgress, units]);


  const handleGenerateTest = async () => {
    if (!currentUser || !selectedUnitId) {
      toast({ title: "Error", description: "Please select a unit and ensure you are logged in.", variant: "destructive" });
      return;
    }
    const wordsArray = weakWordsInput.split(',').map(w => w.trim()).filter(w => w.length > 0);
    if (wordsArray.length === 0) {
      toast({ title: "No Weak Words", description: "Please provide some weak words or complete unit tests to auto-detect them.", variant: "destructive" });
      return;
    }

    const generatedTest = await generateAndStorePersonalizedTest(currentUser.id, selectedUnitId, wordsArray);
    if (generatedTest && generatedTest.questions) {
      setCurrentTest(generatedTest);
      const formattedQuestions = generatedTest.questions.map(q => ({
        wordToTranslate: q.word,
        correctTranslation: q.translation,
        options: q.options,
      }));
      setTestQuestions(formattedQuestions);
      resetTestState();
      toast({ title: "Test Generated!", description: "Your personalized practice test is ready." });
    } else {
      toast({ title: "Generation Failed", description: "Could not generate a test. Please try again.", variant: "destructive" });
    }
  };
  
  const resetTestState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
    setIncorrectlyAnsweredItems([]);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [testQuestions[currentQuestionIndex].wordToTranslate]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowConfirmDialog(true);
    }
  };

  const handleSubmitTest = () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    let correctCount = 0;
    const incorrectItems: AIPracticeTestQuestion[] = [];
    testQuestions.forEach(q => {
      if (selectedAnswers[q.wordToTranslate] === q.correctTranslation) {
        correctCount++;
      } else {
        incorrectItems.push(q);
      }
    });
    const calculatedScore = testQuestions.length > 0 ? Math.round((correctCount / testQuestions.length) * 100) : 0;
    setScore(calculatedScore);
    setIncorrectlyAnsweredItems(incorrectItems);
    toast({
      title: "Practice Test Submitted!",
      description: `Your score: ${calculatedScore}%`,
    });
    setIsSubmitting(false);
  };

  const restartTest = () => {
     if (currentTest) { // Restart current AI test
        const formattedQuestions = currentTest.questions.map(q => ({
            wordToTranslate: q.word,
            correctTranslation: q.translation,
            options: q.options,
        }));
        setTestQuestions(formattedQuestions);
        resetTestState();
     }
  };

  if (!currentUser) return <p>Loading...</p>;


  if (score !== null) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Practice Test Completed!</CardTitle>
          <CardDescription>Unit: {units.find(u => u.id === selectedUnitId)?.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-5xl font-bold text-accent">{score}%</p>
          <p className="text-lg">You answered {testQuestions.length - incorrectlyAnsweredItems.length} out of {testQuestions.length} questions correctly.</p>
          {incorrectlyAnsweredItems.length > 0 && (
            <div>
              <h3 className="font-semibold mt-4 mb-2 text-left">Words to review:</h3>
              <ul className="list-disc list-inside text-left text-sm space-y-1">
                {incorrectlyAnsweredItems.map(item => (
                  <li key={item.wordToTranslate}>{item.wordToTranslate} - {item.correctTranslation}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button onClick={restartTest} variant="outline" disabled={!currentTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Restart This Practice
          </Button>
          <Button onClick={() => { setCurrentTest(null); setTestQuestions([]); resetTestState(); setSelectedUnitId(''); setWeakWordsInput('');}}>
            <ArrowLeft className="mr-2 h-4 w-4" /> New Practice Test
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (testQuestions.length > 0) {
    const currentQ = testQuestions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / testQuestions.length) * 100;
    return (
      <div className="space-y-6 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center">
            <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">Personalized Practice: {units.find(u => u.id === selectedUnitId)?.name}</h1>
            <Progress value={progressPercentage} className="w-full mt-4 h-3" />
            <p className="text-sm text-muted-foreground mt-1">{currentQuestionIndex + 1} of {testQuestions.length} questions</p>
        </div>
        
        <TestQuestionDisplay
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={testQuestions.length}
          wordToTranslate={currentQ.wordToTranslate}
          options={currentQ.options}
          selectedOption={selectedAnswers[currentQ.wordToTranslate] || null}
          onOptionSelect={handleOptionSelect}
          onPlayAudio={() => playAudio(currentQ.wordToTranslate)}
          isAudioAvailable={!!speechSynthesis}
        />

        <Button 
          onClick={handleNext} 
          disabled={!selectedAnswers[currentQ.wordToTranslate] || isSubmitting}
          size="lg"
          className="min-w-[150px]"
        >
          {currentQuestionIndex < testQuestions.length - 1 ? 'Next Question' : (isSubmitting ? 'Submitting...' : 'Submit Test')}
          {currentQuestionIndex === testQuestions.length - 1 && <Send className="ml-2 h-4 w-4" />}
        </Button>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                <AlertDialogDescription>
                Are you sure you want to submit your answers?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitTest} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary flex items-center">
          <Wand2 className="mr-3 h-8 w-8" /> Personalized Practice Test
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Generate a custom test based on words you find challenging or load a previously generated one.
        </p>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Configure Your Practice Test</CardTitle>
          <CardDescription>Select a unit and list the words you want to focus on. Weak words are auto-suggested based on your test history.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="unit-select">Unit</Label>
            <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
              <SelectTrigger id="unit-select">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="weak-words">Weak Words (comma-separated)</Label>
            <Textarea
              id="weak-words"
              value={weakWordsInput}
              onChange={(e) => setWeakWordsInput(e.target.value)}
              placeholder="e.g., hello, goodbye, mother. These are auto-filled if you have previous test data for the selected unit."
              rows={3}
            />
             <p className="text-xs text-muted-foreground mt-1">
              Words you previously got wrong in this unit are pre-filled. You can edit this list.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateTest} disabled={isGeneratingTest || isLoadingExistingTest || !selectedUnitId}>
            {(isGeneratingTest || isLoadingExistingTest) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoadingExistingTest ? 'Loading Test...' : (isGeneratingTest ? 'Generating Test...' : 'Generate/Load Practice Test')}
          </Button>
        </CardFooter>
      </Card>
      {isLoadingExistingTest && 
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading existing practice test if available...</p>
        </div>
      }
    </div>
  );
}
