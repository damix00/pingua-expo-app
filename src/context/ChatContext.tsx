import { Character } from "@/types/course";
import { createContext, useContext } from "react";

export enum AttachmentType {
    IMAGE = "IMAGE",
    VOICE = "VOICE",
}

export type Attachment = {
    id: string;
    type: AttachmentType;
    url: string;
};

export type Message = {
    id: string;
    chatId: string;
    userMessage: boolean;
    attachments: Attachment[];
    content: string;
    createdAt: Date;
};

export type Memory = {
    id: string;
    content: string;
    expiresAt: Date;
};

export type Chat = {
    id: string;
    character: Character;
    messages: Message[];
    memories: Memory[];
    lastMessage: Message | null;
};

export type ChatContextType = {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    updateChat: (chat: Chat) => void;
};

export const ChatContext = createContext<ChatContextType>({
    chats: [],
    setChats: () => {},
    updateChat: () => {},
});

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

export function useChats() {
    const chats = useContext(ChatContext);

    if (!chats) {
        throw new Error("useChats must be used within a ChatProvider");
    }

    return chats;
}

export function useChat(character: string) {
    const { chats } = useChats();

    return chats.find((chat) => chat.character == character);
}
