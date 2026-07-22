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
        <span className="select-none ms-3 text-sm font-medium text-heading mr-3">{text}</span>
        <div className="relative w-9 h-5 bg-black peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft 
        dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
        peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full 
        after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2A1F13]"></div>
    </label>
  )

}


