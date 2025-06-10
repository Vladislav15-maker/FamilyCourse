
"use client";
import React, { useState, useEffect } from 'react';
import type { Word } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WordDisplayCardProps {
  word: Word;
}

const WordDisplayCard: React.FC<WordDisplayCardProps> = ({ word }) => {
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const playAudio = () => {
    if (speechSynthesis && word.english) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US'; // Set language for better pronunciation
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-headline text-primary flex items-center justify-between">
          {word.english}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={playAudio} aria-label={`Listen to ${word.english}`} disabled={!speechSynthesis}>
                  <Volume2 className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Listen to pronunciation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Russian Translation:</p>
          <p className="text-lg font-semibold">{word.russian}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phonetic (RU):</p>
          <p className="text-lg font-mono bg-muted p-2 rounded-md inline-block">{word.phonetic}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordDisplayCard;
