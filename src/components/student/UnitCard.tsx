
"use client";
import React from 'react';
import Link from 'next/link';
import type { Unit } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

interface UnitCardProps {
  unit: Unit;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  const { currentUser } = useAuth();
  const { getOverallUnitScore, getHighestRoundScore } = useData();
  
  const unitScore = currentUser ? getOverallUnitScore(currentUser.id, unit.id) : 0;
  const Icon = unit.icon || BookOpen;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <CardTitle className="text-xl font-headline">{unit.name}</CardTitle>
          <CardDescription>{unit.rounds.length} rounds</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 mb-4">
          {unit.rounds.map((round) => {
            const roundScore = currentUser ? getHighestRoundScore(currentUser.id, unit.id, round.id) : 0;
            return (
              <Link 
                key={round.id} 
                href={`/student/unit/${unit.id}/round/${round.id}/learn`}
                className="block p-3 rounded-md hover:bg-secondary transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{round.name}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-muted-foreground">{round.words.length} words</p>
                    {currentUser && (
                        <Badge variant={roundScore >= 70 ? "default" : roundScore >= 50 ? "secondary" : "outline"} className="text-xs">
                         {roundScore}%
                        </Badge>
                    )}
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 border-t pt-4">
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1">
            <span>Overall Unit Progress</span>
            <span className="font-semibold text-primary">{unitScore}%</span>
          </div>
          <Progress value={unitScore} aria-label={`${unit.name} progress ${unitScore}%`} className="h-2" />
        </div>
        <Button variant="outline" className="w-full mt-2" asChild>
           <Link href={`/student/practice?unitId=${unit.id}`}>
            Personalized Practice for this Unit
           </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UnitCard;
