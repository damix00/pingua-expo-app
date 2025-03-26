import AudioBubble from "@/components/ui/AudioBubble";
import { createContext, useContext, useState } from "react";

export type AudioBubble = {
    audioUrl: string;
    setAudioUrl: (audioUrl: string) => void;
};

export const AudioBubbleContext = createContext<AudioBubble>({
    audioUrl: "",
    setAudioUrl: () => {},
});

export function AudioBubbleProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [audioUrl, setAudioUrl] = useState<string>("");

    return (
        <AudioBubbleContext.Provider
            value={{
                audioUrl,
                setAudioUrl,
            }}>
            {audioUrl && <AudioBubble key={audioUrl} uri={audioUrl} />}
            {children}
        </AudioBubbleContext.Provider>
    );
}

export function useAudioBubble() {
    const ctx = useContext(AudioBubbleContext);

    if (!ctx) {
        throw new Error(
            "useAudioBubble must be used within a AudioBubbleProvider"
        );
    }

    return ctx;
}
