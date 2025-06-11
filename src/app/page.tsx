"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  // КРИТИЧЕСКИ ВАЖНО: Проверьте это сообщение в Runtime логах Vercel при загрузке главной страницы
  console.log('--- HomePage (src/app/page.tsx) IS RENDERING ON SERVER ---');

  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      if (currentUser.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }
  }, [currentUser, loading, router]);

  if (loading || currentUser) {
    // Display a simple loading state or null while checking auth/redirecting
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <GraduationCap className="h-16 w-16 text-primary mb-6 animate-pulse" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 text-center">
      <div className="mb-8">
        <GraduationCap className="h-24 w-24 text-primary mx-auto" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
        Welcome to FamilyCourse!
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        Your personalized journey to mastering new vocabulary starts here. Log in to continue learning.
      </p>
      <p className="text-sm text-muted-foreground mb-3 mt-4">
        (Diagnostic Message: Please check Vercel Runtime Logs for a message starting with "--- HomePage...")
      </p>
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href="/login">
          <LogIn className="mr-2 h-5 w-5" /> Go to Login
        </Link>
      </Button>
    </div>
  );
}
