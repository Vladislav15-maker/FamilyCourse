
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import WordDisplayCard from '@/components/student/WordDisplayCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function LearnRoundPage() {
  const params = useParams();
  const router = useRouter();
  const { getRoundWords, getUnitById } = useData();

  const unitId = Array.isArray(params.unitId) ? params.unitId[0] : params.unitId;
  const roundId = Array.isArray(params.roundId) ? params.roundId[0] : params.roundId;

  const [words, setWords] = useState<import('@/lib/types').Word[]>([]);
  const [unitName, setUnitName] = useState('');
  const [roundName, setRoundName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (unitId && roundId) {
      const roundWords = getRoundWords(unitId, roundId);
      const unit = getUnitById(unitId);
      const round = unit?.rounds.find(r => r.id === roundId);

      setWords(roundWords);
      setUnitName(unit?.name || '');
      setRoundName(round?.name || '');
      setLoading(false);
    }
  }, [unitId, roundId, getRoundWords, getUnitById]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}
        </div>
        <Skeleton className="h-12 w-1/3" />
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold">No words found for this round.</h2>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button onClick={() => router.push(`/student/dashboard`)} variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary flex items-center">
          <BookOpen className="mr-3 h-8 w-8" /> Learning: {unitName} - {roundName}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Study these words, their translations, and pronunciations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word) => (
          <WordDisplayCard key={word.id} word={word} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/student/unit/${unitId}/round/${roundId}/test`}>
            <CheckCircle className="mr-2 h-5 w-5" /> Start Test
          </Link>
        </Button>
      </div>
    </div>
  );
}
