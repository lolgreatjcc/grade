import { create } from 'zustand';

const useFileStore = create((set) => ({
  answerSheet: null,
  setAnswerSheet: (newAnswerSheet) => set({ answerSheet: newAnswerSheet }),
  resetAnswerSheet: () => set({ answerSheet: null }),


  answerKey: null,
  setAnswerKey: (newAnswerKey) => set({ answerKey: newAnswerKey }),
  resetAnswerKey: () => set({ answerKey: null })
}))

export default useFileStore;