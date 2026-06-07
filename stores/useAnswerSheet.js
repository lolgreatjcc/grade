import { create } from "zustand";
// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla'


export const defaultInitState = {
  answerSheetImageArr: null,
}

export const createAnswerSheetStore = (
  initState = defaultInitState,
) => {
  return createStore()((set) => ({
    ...initState,
    setAnswerSheetImageArr: (answerSheetImageArr) => set((state) => ({ answerSheetImageArr: answerSheetImageArr })),
    resetAnswerSheetImageArr: () => set((state) => ({ answerSheetImageArr: null })),
  }))
}