import { create } from "zustand";

const useGradeStore = create((set) => ({
  markedData: null,
  setMarkedData: (newMarkedData) => set({ markedData: newMarkedData }),
  resetMarkedData: () => set({ markedData: null }),

  markedDataImages: null,
  setMarkedDataImages: (newMarkedDataImages) => set({ markedDataImages: newMarkedDataImages }),
  resetMarkedDataImages: () => set({ markedDataImages: null })
}))

export default useGradeStore;