'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Search, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]" />
      
      <div className="relative">
        <Card className="w-full max-w-lg mx-4 shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative">
                <h1 className="text-8xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-bounce">
                  404
                </h1>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                <h2 className="text-2xl font-semibold text-foreground">Oops! Page Not Found</h2>
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The page you're looking for seems to have wandered off into the digital void.
                Let's get you back on track!
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => router.back()}
                  variant="outline"
                  className="group transition-all hover:scale-105 hover:shadow-lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </Button>
                
                <Button 
                  asChild
                  className="group transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                    Home
                  </Link>
                </Button>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <Button 
                  asChild
                  variant="ghost"
                  className="group text-sm hover:bg-accent/20 transition-all"
                >
                  <Link href="/dashboard">
                    <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Explore Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
