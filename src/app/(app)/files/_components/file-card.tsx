
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, File, Film, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export interface FileDetails {
    name: string;
    path: string;
    url: string;
    size: number;
    type: string;
    created: string;
}

interface FileCardProps {
    file: FileDetails;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const renderMediaPreview = (file: FileDetails) => {
    if (file.type.startsWith('image/')) {
        return <Image src={file.url} alt={file.name} layout="fill" objectFit="cover" className="rounded-t-lg" />;
    }
    if (file.type.startsWith('video/')) {
        return (
            <div className="w-full h-full bg-black flex items-center justify-center">
                <Film className="w-10 h-10 text-white/80" />
            </div>
        )
    }
    if (file.type.startsWith('audio/')) {
        return (
             <div className="w-full h-full bg-muted flex items-center justify-center">
                <Music className="w-10 h-10 text-muted-foreground" />
            </div>
        )
    }
    return (
        <div className="w-full h-full bg-muted flex items-center justify-center">
            <File className="w-10 h-10 text-muted-foreground" />
        </div>
    )
}

const getFileTypeIcon = (type: string) => {
    if (type.startsWith('image/')) return null;
    if (type.startsWith('video/')) return <Film className="w-4 h-4 text-muted-foreground" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4 text-muted-foreground" />;
    return <File className="w-4 h-4 text-muted-foreground" />;
}

export function FileCard({ file }: FileCardProps) {
    
    return (
        <TooltipProvider>
            <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
                <CardHeader className="p-0 h-32 relative">
                   {renderMediaPreview(file)}
                    <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="w-4 h-4" />
                            <span className="sr-only">Download</span>
                        </Button>
                    </a>
                </CardHeader>
                <CardContent className="p-3">
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="font-semibold text-sm truncate">{file.name}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{file.name}</p>
                        </TooltipContent>
                    </Tooltip>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1.5">
                            {getFileTypeIcon(file.type)}
                            <span>{formatBytes(file.size)}</span>
                        </div>
                        <Tooltip>
                            <TooltipTrigger>
                                <time dateTime={file.created}>
                                    {format(new Date(file.created), 'MMM d, yyyy')}
                                </time>
                            </TooltipTrigger>
                             <TooltipContent>
                                <p>{format(new Date(file.created), 'PPpp')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}

