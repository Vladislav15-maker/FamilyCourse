
"use client";
import React from 'react';
import { useData } from '@/contexts/DataContext';
import UnitCard from '@/components/student/UnitCard';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboardPage() {
  const { units } = useData();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          Welcome, {currentUser.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Choose a unit to start learning or review your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}
