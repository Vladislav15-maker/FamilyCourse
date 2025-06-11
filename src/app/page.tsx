import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

export default function HomePage() {
  console.log('--- HomePage (src/app/page.tsx) IS RENDERING ON SERVER ---'); // Keep for diagnostics

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/30 via-background to-accent/30 p-6 text-center">
      <div className="bg-card/90 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-2xl max-w-2xl w-full border">
        <GraduationCap className="h-20 w-20 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
          Welcome to FamilyCourse!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your personalized journey to mastering new languages, together as a family.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">
              Get Started / Login
            </Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-10 pt-4 border-t border-border">
          If you see this page, the basic Next.js page rendering is working.
          If you still see a 404 error in your browser, please check the Vercel runtime logs.
        </p>
      </div>
    </div>
  );
}