import { Character } from "@/types/course";
import {
    fujioAvatar,
    jaxonAvatar,
    mrWilliamsAvatar,
    saraAvatar,
} from "@/utils/cache/CachedImages";
import { createContext, useContext } from "react";

// Enum for different types of attachments
export enum AttachmentType {
    IMAGE = "IMAGE",
    VOICE = "VOICE",
}

// Type definition for an attachment
export type Attachment = {
    id: string;
    type: AttachmentType;
    url: string;
};

// Type definition for a message
export type Message = {
    id: string;
    chatId: string;
    userMessage: boolean;
    attachments: Attachment[];
    content: string;
    createdAt: Date;
};

// Type definition for a memory
export type Memory = {
    id: string;
    content: string;
    expiresAt: Date;
};

// Type definition for a chat
export type Chat = {
    id: string;
    character: Character;
    messages: Message[];
    memories: Memory[];
    lastMessage: Message | null;
};

// Type definition for the chat context
export type ChatContextType = {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    updateChat: (chat: Chat) => void;
};

// Create a context for chats with default values
export const ChatContext = createContext<ChatContextType>({
    chats: [],
    setChats: () => {},
    updateChat: () => {},
});

// Predefined list of chat characters with their avatars
export const chats: {
    character: Character;
    name: string;
    image: any;
}[] = [
    {
        character: Character.Fujio,
        name: "Fujio",
        image: fujioAvatar,
    },
    {
        character: Character.Jaxon,
        name: "Jaxon",
        image: jaxonAvatar,
    },
    {
        character: Character.Sara,
        name: "Sara",
        image: saraAvatar,
    },
    {
        character: Character.MrWilliams,
        name: "Mr. Williams",
        image: mrWilliamsAvatar,
    },
];

// Mapping of characters to their respective chat objects
export const chatCharacters = {
    [Character.Fujio]: chats[0],
    [Character.Jaxon]: chats[1],
    [Character.Sara]: chats[2],
    [Character.MrWilliams]: chats[3],
};

// ChatProvider component to provide chat context to its children
export function ChatProvider({
    chats,
    setChats,
    ...props
}: {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    children: React.ReactNode;
}) {
    return (
        <ChatContext.Provider
            value={{
                chats,
                setChats,
                updateChat: (chat) =>
                    setChats(chats.map((c) => (c.id == chat.id ? chat : c))),
            }}
            {...props}
        />
    );
}

// Custom hook to use chat context
export function useChats() {
    const chats = useContext(ChatContext);

    if (!chats) {
        throw new Error("useChats must be used within a ChatProvider");
    }

    return chats;
}

// Custom hook to use a specific chat by character
export function useChat(character: string) {
    const { chats, setChats } = useChats();

    const found = chats.find((chat) => chat.character == character);

    if (!found) {
        return null;
    }

    return {
        ...found,
        addMessage: (message: Message) => {
            setChats(
                chats.map((chat) =>
                    chat.character == character
                        ? {
                              ...chat,
                              messages: [...chat.messages, message],
                              lastMessage: message,
                          }
                        : chat
                )
            );
        },
    };
}
