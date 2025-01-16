export enum Character {
    Penguin = "penguin",
    Glorp = "glorp",
    Fujio = "fujio",
    Jaxon = "jaxon",
    Sara = "sara",
}

export type DialogueLine = {
    id: string;
    character: Character;
    text: string;
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
