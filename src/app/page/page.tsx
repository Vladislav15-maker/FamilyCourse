"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GenericPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-file-question mb-6 text-primary"
        data-ai-hint="question mark document"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <path d="M10 10.3c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2" />
        <path d="M12 17h.01" />
      </svg>
      <h1 className="text-3xl font-bold font-headline mb-4 text-primary">FamilyCourse - Page Not Intentionally Created</h1>
      <p className="text-lg text-muted-foreground mb-3">
        You've reached the <code className="bg-muted px-1 py-0.5 rounded-sm text-sm">/page</code> route.
      </p>
      <p className="text-muted-foreground mb-6">
        This is a placeholder. If you landed here by mistake, please navigate using the main application links.
      </p>
      <Button asChild>
        <Link href="/">Go to Home Page</Link>
      </Button>
    </div>
  );
}
