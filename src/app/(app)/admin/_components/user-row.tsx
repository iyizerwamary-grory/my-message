"use client";

import { useState } from 'react';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Trash2, Shield } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from 'next/link';

interface UserRowProps {
  user: User;
  currentUserId: string;
}

export function UserRow({ user, currentUserId }: UserRowProps) {
  const isCurrentUser = user.uid === currentUserId;
  const fallback = user.displayName ? user.displayName.substring(0, 2).toUpperCase() : (user.email ? user.email.substring(0,1).toUpperCase() : 'U');

  return (
    <TableRow>
      <TableCell>
        <Avatar>
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} data-ai-hint="user avatar" />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        <div className="font-medium">{user.displayName || 'Unnamed User'}</div>
        <div className="text-sm text-muted-foreground">{user.email}</div>
        <div className="text-xs text-muted-foreground font-mono">{user.uid}</div>
      </TableCell>
      <TableCell className="text-right">
        {isCurrentUser ? (
          <span className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            This is you
          </span>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone from the app. Deleting a user is a sensitive operation that requires manual steps in the Firebase Console to ensure all data is removed correctly.
                  <br /><br />
                  To proceed, you must go to the Firebase Console, find this user in the <strong>Authentication</strong> tab, and delete them from there. This will permanently remove their account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Link href="https://console.firebase.google.com/u/0/project/ripplechat-mtir3/authentication/users" target="_blank" rel="noopener noreferrer">
                    Open Firebase Console
                  </Link>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}
