
"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import type { User, UserStatus } from '@/lib/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { PresenceIndicator } from './presence-indicator';

export function ChatList() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !isFirebaseConfigured) {
      if (!isFirebaseConfigured) {
        setLoading(false);
        setUsers([{
            uid: 'mock_user_1',
            displayName: 'Jane Doe',
            email: 'jane@example.com',
            status: 'online'
        }, {
            uid: 'mock_user_2',
            displayName: 'John Smith',
            email: 'john@example.com',
            status: 'offline'
        }]);
      }
      return;
    }
    
    if (!currentUser) {
        setUsers([]);
        setLoading(false);
        return;
    }

    const usersColRef = collection(db, 'users');
    // Query all users except the current one.
    const q = query(usersColRef, where("uid", "!=", currentUser.uid));


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers: User[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({
          uid: doc.id,
          ...doc.data()
        } as User);
      });
      setUsers(fetchedUsers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, authLoading]);

  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const createChatId = (otherUserUid: string) => {
    if (!currentUser) return '';
    return [currentUser.uid, otherUserUid].sort().join('_');
  };

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold tracking-tight">Conversations</h2>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
            <h3 className="px-2 pt-2 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Users</h3>

            {(loading || authLoading) ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md p-2">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))
            ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                    const chatId = createChatId(user.uid);
                    const fallback = user.displayName ? user.displayName.substring(0, 2).toUpperCase() : '??';
                    return (
                        <Link href={`/chat/${chatId}`} key={user.uid} legacyBehavior>
                            <a className={cn(
                                "flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted",
                                pathname === `/chat/${chatId}` ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                            )}>
                                <div className="relative">
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} data-ai-hint="user avatar" />
                                        <AvatarFallback>{fallback}</AvatarFallback>
                                    </Avatar>
                                    <PresenceIndicator status={user.status || 'offline'} className="absolute bottom-0 right-0" />
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="font-semibold">{user.displayName}</p>
                                    <p className="text-xs capitalize">{user.status || 'Offline'}</p>
                                </div>
                            </a>
                        </Link>
                    )
                })
            ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">No other users found.</p>
            )}
        </nav>
      </ScrollArea>
    </div>
  );
}
