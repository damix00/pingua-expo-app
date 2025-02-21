import { Question } from "@/types/course";
import { TaskTitle } from "./task";
import { useTranslation } from "react-i18next";

export default function TranslateTask({
    data,
    onComplete,
}: {
    data: Question;
    onComplete: (mistake: boolean) => any;
}) {
    const { t } = useTranslation();

    return (
        <TaskTitle
            title={t("lesson.questions.translate_task")}
            question={data.question}
        />
    );
}
