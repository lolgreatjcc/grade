'use client'
import { create } from 'zustand';


const useHoveredQnStore = create((set) => ({
  hoveredQn: null,
  setHoveredQn: (newHoveredQn) => set({ hoveredQn: newHoveredQn }),
  clearHoveredQn: () => set({ hoveredQn: null })
}));

export default useHoveredQnStore;