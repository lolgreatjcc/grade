import { create } from "zustand";

export const useAnswerSheet = create((set) => ({
    answerSheetImageArr: null,
    updateAnswerSheetImageArr: (data) => set({ answerSheetImageArr: data }),
    resetAnswerSheetImageArr: () => set({ answerSheetImageArr: null })
}))