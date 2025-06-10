
"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, UserCircle, LayoutDashboard, BookOpenCheck, GraduationCap, Presentation, Edit3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={currentUser.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-primary">FamilyCourse</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4">
            {currentUser.role === 'student' && (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/student/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/student/grades">My Grades</Link>
                </Button>
                 <Button variant="ghost" asChild>
                  <Link href="/student/practice">Personalized Practice</Link>
                </Button>
              </>
            )}
            {currentUser.role === 'teacher' && (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/teacher/dashboard">Student Progress</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/teacher/grades">Offline Grading</Link>
                </Button>
              </>
            )}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  {/* Placeholder image, can be replaced with actual user avatars */}
                  <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(currentUser.name)}`} alt={currentUser.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="md:hidden"> {/* Mobile navigation items */}
                {currentUser.role === 'student' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/student/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/student/grades"><BookOpenCheck className="mr-2 h-4 w-4" />My Grades</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/student/practice"><Edit3 className="mr-2 h-4 w-4" />Personalized Practice</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {currentUser.role === 'teacher' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/teacher/dashboard"><Presentation className="mr-2 h-4 w-4" />Student Progress</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/teacher/grades"><BookOpenCheck className="mr-2 h-4 w-4" />Offline Grading</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
