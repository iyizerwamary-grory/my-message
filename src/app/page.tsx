"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, ShieldCheck } from 'lucide-react';

const LandingHeader = () => (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xl font-bold text-primary-foreground">R</div>
          <span className="hidden sm:inline-block">RippleChat</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    </header>
);


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                    Seamless Communication, Always Connected
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    RippleChat is a modern, real-time chat application designed for fast, secure, and engaging conversations. Share messages, images, and stories instantly.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                     <Link href="/signup">
                      Sign Up for Free
                    </Link>
                  </Button>
                   <Button asChild variant="outline" size="lg">
                     <Link href="/login">
                      Go to Chat
                    </Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400/64B5F6/FFFFFF/png?text=RippleChat"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                data-ai-hint="app screenshot"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Connect</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From real-time messaging to sharing media, RippleChat is packed with features to keep you in touch.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center p-4 rounded-lg hover:bg-card transition-colors">
                <MessageSquare className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Real-time Chat</h3>
                <p className="text-muted-foreground">
                  Instantly send and receive messages with our low-latency infrastructure powered by Firebase.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center p-4 rounded-lg hover:bg-card transition-colors">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Ephemeral Stories</h3>
                <p className="text-muted-foreground">
                  Share moments from your day with photos and videos that disappear after 24 hours.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center p-4 rounded-lg hover:bg-card transition-colors">
                <ShieldCheck className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Secure and Private</h3>
                <p className="text-muted-foreground">
                  Your conversations are your own. Built with Firebase Authentication and security rules.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-card/50">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Start Rippling?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create an account in seconds and join the conversation. It's completely free.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
                <Button asChild size="lg" className="w-full">
                    <Link href="/signup">
                    Sign Up Now
                    </Link>
                </Button>
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline underline-offset-2">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 RippleChat. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
