"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert, Users as UsersIcon } from 'lucide-react';
import { UserRow } from './_components/user-row';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminPage() {
    const { user: currentUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const adminEmail = "jeandedieuishimwe109@gmail.com";
    const isAuthorized = currentUser?.email === adminEmail;

    useEffect(() => {
        if (authLoading) return;
        if (!currentUser || !isAuthorized) {
            // Redirect or show access denied. Showing access denied is better.
            setIsLoading(false);
            return;
        }

        if (!isFirebaseConfigured || !db) {
            setIsLoading(false);
            return;
        }

        const usersColRef = collection(db, 'users');
        const q = query(usersColRef);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedUsers: User[] = [];
            querySnapshot.forEach((doc) => {
                fetchedUsers.push({
                    uid: doc.id,
                    ...doc.data()
                } as User);
            });
            setUsers(fetchedUsers);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser, authLoading, isAuthorized, router]);

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto max-w-4xl py-6 px-4 space-y-8">
                <Skeleton className="h-10 w-48" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (!isAuthorized) {
        return (
             <div className="container mx-auto max-w-4xl py-6 px-4">
                <Alert variant="destructive" className="flex flex-col items-center text-center p-8">
                    <ShieldAlert className="h-12 w-12 mb-4" />
                    <AlertTitle className="text-xl font-bold">Access Denied</AlertTitle>
                    <AlertDescription>You do not have permission to view this page.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-6 px-4 space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Admin Dashboard
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UsersIcon /> User Management
                    </CardTitle>
                    <CardDescription>View and manage all registered users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Avatar</TableHead>
                                <TableHead>User Details</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <UserRow key={user.uid} user={user} currentUserId={currentUser.uid} />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
