'use client'

import { ReactNode, createContext, useState, useContext } from 'react'
import { useStore } from 'zustand'

import { createAnswerSheetStore } from '../stores/useAnswerSheet'

export const AnswerSheetStoreContext = createContext(undefined,)

export const AnswerSheetStoreProvider = ({ children, }) => {
  const [store] = useState(() => createAnswerSheetStore())
  return (
    <AnswerSheetStoreContext.Provider value={store}>
      {children}
    </AnswerSheetStoreContext.Provider>
  )
}

export const useAnswerSheetStore = (selector) => {
  const answerSheetStoreContext = useContext(AnswerSheetStoreContext)
  if (!answerSheetStoreContext) {
    throw new Error(`useAnswerSheetStore must be used within AnswerSheetStoreProvider`)
  }

  return useStore(answerSheetStoreContext, selector)
}
