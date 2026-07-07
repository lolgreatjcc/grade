import { create } from 'zustand';

const useFileStore = create((set) => ({
  answerSheet: null,
  setAnswerSheet: (newAnswerSheet) => set({ answerSheet: newAnswerSheet}),


  answerKey: null,
  setAnswerKey: (newAnswerKey) => set({ answerKey: newAnswerKey})
}))

export default useFileStore;