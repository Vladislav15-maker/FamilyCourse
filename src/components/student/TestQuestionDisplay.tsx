
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { Volume2 } from 'lucide-react';

interface TestQuestionDisplayProps {
  questionNumber: number;
  totalQuestions: number;
  wordToTranslate: string; // English word
  options: string[]; // Russian translations
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
  onPlayAudio: () => void;
  isAudioAvailable: boolean;
}

const TestQuestionDisplay: React.FC<TestQuestionDisplayProps> = ({
  questionNumber,
  totalQuestions,
  wordToTranslate,
  options,
  selectedOption,
  onOptionSelect,
  onPlayAudio,
  isAudioAvailable
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-headline">Question {questionNumber} of {totalQuestions}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onPlayAudio} aria-label={`Listen to ${wordToTranslate}`} disabled={!isAudioAvailable}>
            <Volume2 className="h-6 w-6 text-primary" />
          </Button>
        </div>
        <CardDescription className="text-lg pt-2">
          Translate the word: <strong className="text-primary font-semibold text-xl">{wordToTranslate}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption || ''}
          onValueChange={onOptionSelect}
          className="space-y-3"
        >
          {options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                ${selectedOption === option 
                  ? 'bg-primary/10 border-primary ring-2 ring-primary' 
                  : 'hover:bg-secondary/80'
                }`}
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <span className="text-base">{option}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TestQuestionDisplay;
