
"use client";

import type { Message, User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from 'next/image';
import { File, Download, Music } from "lucide-react";
import { Button } from "../ui/button";

interface ChatMessageItemProps {
  message: Message;
  currentUser: User; 
}

const isImage = (type?: string) => type?.startsWith('image/');
const isVideo = (type?: string) => type?.startsWith('video/');
const isAudio = (type?: string) => type?.startsWith('audio/');

const AttachmentPreview = ({ message }: { message: Message }) => {
    if (!message.attachmentUrl) return null;

    if (isImage(message.attachmentType)) {
        return (
            <div className="relative mt-2 h-48 w-64 max-w-full cursor-pointer overflow-hidden rounded-lg border">
                <Image
                    src={message.attachmentUrl}
                    alt={message.attachmentName || "Uploaded image"}
                    fill
                    objectFit="cover"
                    onClick={() => window.open(message.attachmentUrl, '_blank')}
                />
            </div>
        );
    }
    
    if (isVideo(message.attachmentType)) {
        return (
            <div className="relative mt-2 w-full max-w-xs overflow-hidden rounded-lg border">
                <video
                    src={message.attachmentUrl}
                    controls
                    className="w-full aspect-video"
                />
            </div>
        )
    }

    if (isAudio(message.attachmentType)) {
        return (
            <div className="mt-2 flex w-64 max-w-full items-center gap-2 rounded-lg border bg-muted/50 p-2">
                 <Music className="h-7 w-7 text-muted-foreground shrink-0" />
                <audio
                    src={message.attachmentUrl}
                    controls
                    className="w-full"
                />
            </div>
        )
    }


    // Fallback for other file types
    return (
        <a 
          href={message.attachmentUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          download={message.attachmentName}
          className="mt-2 flex items-center rounded-lg border bg-muted/50 p-2 max-w-xs hover:bg-muted/80 transition-colors"
        >
            <File className="h-7 w-7 text-muted-foreground mr-2 shrink-0" />
            <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{message.attachmentName || "Attachment"}</p>
                <p className="text-xs text-muted-foreground">Click to download</p>
            </div>
             <Download className="h-5 w-5 ml-2 shrink-0" />
        </a>
    )
}

export function ChatMessageItem({ message, currentUser }: ChatMessageItemProps) {
  const isOwnMessage = message.senderId === currentUser.uid;

  const senderName = isOwnMessage ? (currentUser.displayName || "Me") : (message.senderName || "User");
  
  const senderAvatarUrl = isOwnMessage 
    ? (currentUser.photoURL || `https://placehold.co/100x100.png?text=${senderName.substring(0,1)}`)
    : (message.senderPhotoURL || `https://placehold.co/100x100.png?text=${senderName.substring(0,1)}`); // Assuming senderPhotoURL might be on message
  
  const avatarFallback = senderName ? senderName.substring(0, 2).toUpperCase() : "U";

  return (
    <div
      className={cn(
        "flex items-end gap-2 group",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 self-start border shrink-0">
          <AvatarImage src={senderAvatarUrl} alt={senderName} data-ai-hint="user avatar"/>
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex flex-col", isOwnMessage ? "items-end" : "items-start")}>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "max-w-xs sm:max-w-md md:max-w-lg rounded-xl px-3 py-2 shadow-md relative",
                  isOwnMessage
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-card-foreground border rounded-bl-none",
                  // No padding if the message is only an attachment with no text
                  message.attachmentUrl && !message.text && 'p-1 bg-transparent border-0 shadow-none'
                )}
              >
                {!isOwnMessage && message.text && (
                   <p className={cn("text-xs font-medium mb-0.5 text-muted-foreground", message.attachmentUrl && !message.text && 'px-2 pt-1' )}>{senderName}</p>
                )}
                {message.text && <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>}
                {message.attachmentUrl && <AttachmentPreview message={message} />}
              </div>
            </TooltipTrigger>
            <TooltipContent side={isOwnMessage ? "left" : "right"} className="text-xs">
              {message.timestamp ? format(new Date(message.timestamp), "Pp") : "Sending..."}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className={cn("flex items-center gap-1 mt-1", isOwnMessage ? "mr-1 justify-end" : "ml-1 justify-start")}>
          <span className="text-xs text-muted-foreground">
            {message.timestamp ? format(new Date(message.timestamp), "p") : ""}
          </span>
        </div>
      </div>
       {isOwnMessage && (
        <Avatar className="h-8 w-8 self-start border shrink-0">
          <AvatarImage src={senderAvatarUrl} alt={currentUser.displayName || "Me"} data-ai-hint="user avatar"/>
          <AvatarFallback>{currentUser.displayName ? currentUser.displayName.substring(0, 2).toUpperCase() : "ME"}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

    