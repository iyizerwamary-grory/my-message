
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { storage, isFirebaseConfigured } from '@/lib/firebase';
import { ref, listAll, getDownloadURL, getMetadata, StorageReference } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, FolderOpen } from 'lucide-react';
import { FileCard, FileDetails } from './_components/file-card';
import { useRouter } from 'next/navigation';

export default function FilesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [files, setFiles] = useState<FileDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace('/login?redirect=/files');
            return;
        }

        if (!isFirebaseConfigured || !storage) {
            toast({
                title: "Storage Not Configured",
                description: "Cannot fetch files because Firebase Storage is not set up.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
        
        const fetchFiles = async () => {
            setIsLoading(true);
            try {
                const storageRef = ref(storage);
                const results = await listAll(storageRef);
                
                const allFolders = results.prefixes;
                
                const filePromises = allFolders.flatMap(folderRef => 
                    listAll(folderRef).then(folderResult => 
                        folderResult.items.map(async itemRef => {
                            const [url, metadata] = await Promise.all([
                                getDownloadURL(itemRef),
                                getMetadata(itemRef)
                            ]);
                            return {
                                name: metadata.name,
                                path: metadata.fullPath,
                                url: url,
                                size: metadata.size,
                                type: metadata.contentType || 'application/octet-stream',
                                created: metadata.timeCreated,
                            };
                        })
                    )
                );

                const settledPromises = await Promise.allSettled(filePromises.flat());
                
                const fetchedFiles = settledPromises
                    .filter(p => p.status === 'fulfilled')
                    .map(p => (p as PromiseFulfilledResult<FileDetails>).value)
                    .sort((a,b) => new Date(b.created).getTime() - new Date(a.created).getTime());
                
                setFiles(fetchedFiles);

            } catch (error: any) {
                console.error("Error fetching files:", error);
                 toast({
                    title: "Could not fetch files",
                    description: error.message || "An unknown error occurred.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, [user, authLoading, toast, router]);

    const storyFiles = useMemo(() => files.filter(f => f.path.startsWith('stories/')), [files]);
    const chatFiles = useMemo(() => files.filter(f => f.path.startsWith('chat-attachments/')), [files]);

    const renderFileGrid = (fileList: FileDetails[]) => {
        if (!fileList.length) {
            return (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-center">
                    <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">No files found</p>
                    <p className="text-sm text-muted-foreground">Upload some files in chats or stories to see them here.</p>
                </div>
            )
        }
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {fileList.map((file) => <FileCard key={file.path} file={file} />)}
            </div>
        );
    }

    if (authLoading || (!user && !isFirebaseConfigured)) {
        return (
             <div className="container mx-auto max-w-7xl py-6 px-4 space-y-8">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array.from({length: 12}).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
                </div>
            </div>
        );
    }
    
    if (!isFirebaseConfigured) {
        return (
            <div className="container mx-auto max-w-7xl py-6 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AlertTriangle/>Mock Mode</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The file browser is not available in mock mode as it requires a connection to Firebase Storage.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-7xl py-6 px-4 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6">
                File Storage
            </h1>

            <Tabs defaultValue="all">
                 <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
                    <TabsTrigger value="all">All Files</TabsTrigger>
                    <TabsTrigger value="chat">Chat Attachments</TabsTrigger>
                    <TabsTrigger value="stories">Stories</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Uploaded Files</CardTitle>
                            <CardDescription>All media from chats and stories, sorted by most recent.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                     {Array.from({length: 12}).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
                                </div>
                            ) : renderFileGrid(files)}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="chat">
                     <Card>
                        <CardHeader>
                            <CardTitle>Chat Attachments</CardTitle>
                            <CardDescription>All media files sent in conversations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {isLoading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                     {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
                                </div>
                            ) : renderFileGrid(chatFiles)}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="stories">
                     <Card>
                        <CardHeader>
                            <CardTitle>Story Media</CardTitle>
                            <CardDescription>All images and videos uploaded as stories.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {isLoading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                     {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
                                </div>
                            ) : renderFileGrid(storyFiles)}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
