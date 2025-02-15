export enum Character {
    Penguin = "penguin",
    Fujio = "fujio",
    Jaxon = "jaxon",
    Sara = "sara",
}

export const characterNames = {
    penguin: "Pingua",
    fujio: "Fujio",
    jaxon: "Jaxon",
    sara: "Sara",
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
