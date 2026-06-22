import McqOptions from "./McqOptions";

export default function Mcq({numberOfMcqs, setNumberOfMcqs, numberOfOptions, setNumberOfOptions}) {
    const options = [2,3,4,5];
    const min = 0;
    const max = 40;

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
                <input min={0} max={40} defaultValue={0} className={`text-2xl w-20 focus:outline-hidden border-white border-b-3 text-white text-center`} onBlur={handleNumberOfMcqs} type="number"></input>
            </div>
            <McqOptions
            numberOfOptions = {numberOfOptions}
            setNumberOfOptions = {setNumberOfOptions}
            options = {options}
            />
        </div>
        
    );
}