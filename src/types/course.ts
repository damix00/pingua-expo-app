export enum Character {
    Penguin = "penguin",
    Fujio = "fujio",
    Jaxon = "jaxon",
    Sara = "sara",
    MrWilliams = "mr-williams",
}

export const characterNames = {
    penguin: "Pingua",
    fujio: "Fujio",
    jaxon: "Jaxon",
    sara: "Sara",
    "mr-williams": "Mr. Williams",
};

export type DialogueLine = {
    id: string;
    character: Character | "narrator" | "user";
    text: string;
    text_app_language?: string;
    audio?: string;
    answers: {
        id: string;
        text: string;
        correct: boolean;
    }[];
};

export type Story = {
    id: string;
    title: string;
    dialogue: DialogueLine[];
};

export type Question = {
    id: string;
    type: string;
    question: string;
    audio: string;
    answers?: {
        answer: string;
        correct: boolean;
    }[];
    correctAnswer?: string;
};
