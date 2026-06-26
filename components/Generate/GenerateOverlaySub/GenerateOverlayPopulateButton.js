

import { Ponomar } from "next/font/google"


import { useState } from "react";
import styles from "./GenerateOverlayPopulateButton.module.css";

export default function GenerateOverlayPopulateButton({ populateQnNumbers }) {




  return (
    <div onClick={populateQnNumbers} className={`${styles.populateButton} px-20 py-4 rounded-sm self-end `}>
      <h2 className={`text-2xl ${styles.populateButtonText}`}>Populate</h2>
    </div>
  )
}