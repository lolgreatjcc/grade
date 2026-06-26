import McqOptions from "./McqOptions";
import { useEffect } from "react";

export default function Mcq({numberOfMcqs, setNumberOfMcqs, numberOfOptions, setNumberOfOptions}) {
    const options = [2,3,4,5,6,7];
    const min = 0;
    const max = numberOfOptions > 5 ? 30 : 40;

    const handleNumberOfMcqs = (event) => {
        const newNumberOfMcqs = event.target.valueAsNumber;
        if (newNumberOfMcqs > max) setNumberOfMcqs(max);
        else if (newNumberOfMcqs < min) setNumberOfMcqs(min);
        else setNumberOfMcqs(newNumberOfMcqs);
    }

    return (
        <div className={`h-auto`}>
            <h1 className={`text-2xl font-bold pb-2 text-white`}>Part A</h1>
            <div className={`flex`}>
                <h1 className={`pr-5 text-2xl text-white`}>Number of MCQs</h1>
                <input min={0} max={numberOfOptions > 5 ? 30 : 40} defaultValue={0} className={`text-2xl w-20 focus:outline-hidden border-white border-b-3 text-white text-center`} onChange={handleNumberOfMcqs} value={numberOfMcqs} type="number"></input>
            </div>
            <McqOptions
            numberOfOptions = {numberOfOptions}
            setNumberOfOptions = {setNumberOfOptions}
            options = {options}
            numberOfMcqs = {numberOfMcqs}
            setNumberOfMcqs={setNumberOfMcqs}
            />
        </div>
        
    );
}