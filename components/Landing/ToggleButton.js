import styles from "./LandingButtons.module.css"
import { useState } from "react";

export default function ToggleButton({setState, text}) {

  const handleCheckbox = (event) => {
    const checked = event.target.checked;
    setState(checked);
  }

  return (
    <label className="inline-flex items-center cursor-pointer my-4">
        <input type="checkbox" value="" className="sr-only peer" onChange={handleCheckbox}/>
        <span className="select-none ms-3 text-sm text-heading mr-3 text-[#EFE7D9]">{text}</span>
        <div className={` ${styles.supplementBackground} relative w-9 h-5 rounded-full peer peer-checked:after:translate-x-full 
        rtl:peer-checked:after:-translate-x-full 
        peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#FFFFFFCC] after:rounded-full 
        after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1c150d]`}></div>
    </label>
  )

}


