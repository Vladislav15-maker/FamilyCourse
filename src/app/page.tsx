"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        if (currentUser.role === 'teacher') {
          router.replace('/teacher/dashboard');
        } else {
          router.replace('/student/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    );
  }

  return <></>; // Changed from return null;
}
