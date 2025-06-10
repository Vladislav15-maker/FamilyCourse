
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Word } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Check, RefreshCw, Send, Volume2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function TestRoundPage() {
  const params = useParams();
  const router = useRouter();
  const { getRoundWords, getUnitById, addStudentProgress } = useData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const unitId = Array.isArray(params.unitId) ? params.unitId[0] : params.unitId;
  const roundId = Array.isArray(params.roundId) ? params.roundId[0] : params.roundId;

  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswerInput, setCurrentAnswerInput] = useState('');
  const [feedback, setFeedback] = useState<Record<string, { type: 'correct' | 'incorrect', message: string }>>({});
  const [isCurrentAnswerChecked, setIsCurrentAnswerChecked] = useState(false);
  
  const [score, setScore] = useState<number | null>(null);
  const [incorrectlyAnsweredWordsData, setIncorrectlyAnsweredWordsData] = useState<Word[]>([]);
  
  const [unitName, setUnitName] = useState('');
  const [roundName, setRoundName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const playAudio = (text: string, lang: string = 'en-US') => {
    if (speechSynthesis && text) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  const generateQuestions = useCallback(() => {
    setLoading(true);
    const roundWords = getRoundWords(unitId, roundId);
    const unit = getUnitById(unitId);
    setUnitName(unit?.name || '');
    setRoundName(unit?.rounds.find(r => r.id === roundId)?.name || '');

    if (roundWords.length === 0) {
      setLoading(false);
      return;
    }
    
    setQuestions(shuffleArray(roundWords));
    setCurrentQuestionIndex(0);
    setCurrentAnswerInput('');
    setFeedback({});
    setIsCurrentAnswerChecked(false);
    setScore(null);
    setIncorrectlyAnsweredWordsData([]);
    setLoading(false);
  }, [unitId, roundId, getRoundWords, getUnitById]);

  useEffect(() => {
    if (unitId && roundId) {
      generateQuestions();
    }
  }, [unitId, roundId, generateQuestions]);

  const handleCheckAnswer = () => {
    if (questions.length === 0) return;
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.english.trim().toLowerCase();
    const userAnswer = currentAnswerInput.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setFeedback(prev => ({
        ...prev,
        [currentQuestion.id]: { type: 'correct', message: 'Правильно!' }
      }));
    } else {
      setFeedback(prev => ({
        ...prev,
        [currentQuestion.id]: { type: 'incorrect', message: `Неправильно. Верный ответ: ${currentQuestion.english}` }
      }));
    }
    setIsCurrentAnswerChecked(true);
  };

  const handleSubmitTest = () => {
    setIsSubmitting(true);
    let correctAnswers = 0;
    const incorrectWordsForRecord: string[] = [];
    const incorrectWordsForDisplay: Word[] = [];

    questions.forEach(q => {
      if (feedback[q.id]?.type === 'correct') {
        correctAnswers++;
      } else {
        incorrectWordsForRecord.push(q.id);
        incorrectWordsForDisplay.push(q);
      }
    });

    const calculatedScore = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
    setScore(calculatedScore);
    setIncorrectlyAnsweredWordsData(incorrectWordsForDisplay);

    if (currentUser) {
      addStudentProgress({
        studentId: currentUser.id,
        unitId,
        roundId,
        score: calculatedScore,
        incorrectWords: incorrectWordsForRecord,
      });
    }
    toast({
      title: "Тест завершен!",
      description: `Ваш результат: ${calculatedScore}%`,
    });
    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    if (!isCurrentAnswerChecked) return; // Must check answer before proceeding

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswerInput('');
      setIsCurrentAnswerChecked(false);
    } else {
      // This was the last question, submit the test
      handleSubmitTest();
    }
  };
  
  const restartTest = () => {
    generateQuestions();
  };

  if (loading) {
    return (
      <div className="space-y-6 flex flex-col items-center">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-6" />
        <Card className="w-full max-w-2xl">
          <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-1/3 mt-2"/>
          </CardContent>
        </Card>
        <Skeleton className="h-12 w-1/3 mt-6" />
      </div>
    );
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">Нет вопросов для этого теста.</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к обучению
        </Button>
      </div>
    );
  }

  if (score !== null) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Тест завершен!</CardTitle>
          <CardDescription>Раздел: {unitName} - Раунд: {roundName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-5xl font-bold text-accent">{score}%</p>
          <p className="text-lg">Вы правильно ответили на {questions.length - incorrectlyAnsweredWordsData.length} из {questions.length} вопросов.</p>
          {incorrectlyAnsweredWordsData.length > 0 && (
            <div>
              <h3 className="font-semibold mt-4 mb-2 text-left">Слова для повторения:</h3>
              <ul className="list-disc list-inside text-left text-sm space-y-1">
                {incorrectlyAnsweredWordsData.map(word => (
                  <li key={word.id}>{word.russian} ({word.phonetic}) - {word.english}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button onClick={restartTest} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Начать тест заново
          </Button>
          <Button onClick={() => router.push('/student/dashboard')}>
            <Check className="mr-2 h-4 w-4" /> К панели ученика
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentFeedback = feedback[currentQuestion.id];

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center">
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">Тест: {unitName} - {roundName}</h1>
          <Progress value={progressPercentage} className="w-full mt-4 h-3" />
          <p className="text-sm text-muted-foreground mt-1">Вопрос {currentQuestionIndex + 1} из {questions.length}</p>
      </div>
      
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-headline">
              Переведите слово: <strong className="text-primary">{currentQuestion.russian}</strong>
            </CardTitle>
            <div className="flex items-center space-x-2">
                 <Button variant="ghost" size="icon" onClick={() => playAudio(currentQuestion.russian, 'ru-RU')} aria-label={`Прослушать ${currentQuestion.russian}`} disabled={!speechSynthesis}>
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Аудио RU</span>
                 </Button>
                 {isCurrentAnswerChecked && currentFeedback?.type === 'incorrect' && (
                    <Button variant="ghost" size="icon" onClick={() => playAudio(currentQuestion.english, 'en-US')} aria-label={`Прослушать ${currentQuestion.english}`} disabled={!speechSynthesis}>
                        <Volume2 className="h-5 w-5 text-primary" />
                        <span className="sr-only">Аудио EN (правильный ответ)</span>
                    </Button>
                 )}
            </div>
          </div>
          {/* Phonetic transcription removed from here */}
          {/* <CardDescription className="text-md pt-1">
            Фонетика (RU): <span className="font-mono bg-muted p-1 rounded-sm">{currentQuestion.phonetic}</span>
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Введите перевод на английском"
            value={currentAnswerInput}
            onChange={(e) => setCurrentAnswerInput(e.target.value)}
            disabled={isCurrentAnswerChecked}
            className="text-base"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isCurrentAnswerChecked && currentAnswerInput.trim() !== '') {
                handleCheckAnswer();
              } else if (e.key === 'Enter' && isCurrentAnswerChecked) {
                handleNextQuestion();
              }
            }}
          />
          {isCurrentAnswerChecked && currentFeedback && (
            <div className={`flex items-center p-3 rounded-md text-sm ${currentFeedback.type === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {currentFeedback.type === 'correct' ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              {currentFeedback.message}
              {currentFeedback.type === 'incorrect' && <span className="ml-1 italic">({currentQuestion.phonetic})</span>}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button 
          onClick={handleCheckAnswer} 
          disabled={isCurrentAnswerChecked || currentAnswerInput.trim() === ''}
          size="lg"
          variant="outline"
        >
          Проверить
        </Button>
        <Button 
          onClick={handleNextQuestion} 
          disabled={!isCurrentAnswerChecked || isSubmitting}
          size="lg"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Следующее слово' : (isSubmitting ? 'Завершение...' : 'Завершить тест')}
          {(currentQuestionIndex === questions.length - 1 && !isSubmitting) && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
