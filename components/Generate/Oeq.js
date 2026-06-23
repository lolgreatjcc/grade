import OeqQuestion from "./OeqQuestion";

// questions are using a level system
// level 1: main question
// level 2: sub question (part a, b, c)
// level 3: sub part (i, ii, iii)
// initial data for each question (subpart or not)
const constructInitialData = (index, level) => {
    return {
        "index": index,
        "subpart": [],
        "level": level,
        "type": 2,
        "size": 0,
    }
}

// editing question data
const editOeqData = (oldNumber, newNumber, oldData, level) => {
    // invalid number of question
    if (newNumber < 0) {
        return [];
    } 
    if (oldData.length === 0) { // if there were no questions to begin with
        const tempArr = [];
        for (let i = 0; i < newNumber; i++) tempArr.push(constructInitialData(i, level));
        return tempArr;
    } else if (newNumber > oldNumber) { // if there were existing questions
        const tempArr = [...oldData];
        for (let i = oldNumber; i < newNumber; i++) tempArr.push(constructInitialData(i, level));
        return tempArr;
    } else { // removing questions
        return oldData.slice(0, newNumber);
    }
}

export default function Oeq({numberOfMcqs, numberOfOeq, setNumberOfOeq, oeqData, setOeqData, constructInitialData}) {


    const handleNumberOfOeq = (numberOfOeq, newNumberOfOeq, oeqData, level) => {
        // invalid number of questions, reset all
        if (newNumberOfOeq < 0) {
            setOeqData([]);
            setNumberOfOeq(0);
        } else {
            // update question array data and number of open ended questions
            setOeqData(editOeqData(numberOfOeq, newNumberOfOeq, oeqData, level));
            setNumberOfOeq(newNumberOfOeq); 
        }
    }

    return (
        <div className={`h-full max-h-full`}>
            <h1 className={`text-2xl font-bold pb-2 pt-5 text-white`}>Part B</h1>
            <div className={`flex h-min`}>
                <h1 className={`text-2xl mr-5 text-white`}>Number of Questions</h1>
                <input defaultValue={0} min={0} className={`text-2xl w-20 focus:outline-hidden border-white border-b-3 text-white text-center`} 
                onBlur={(event) => handleNumberOfOeq(numberOfOeq, event.target.valueAsNumber, oeqData, 1)} 
                type="number"></input>
            </div>
            <div className={``}>
                <OeqQuestion
                numberOfMcqs={numberOfMcqs}
                numberOfOeq={numberOfOeq}
                oeqData={oeqData}
                setOeqData={setOeqData}
                editOeqData={editOeqData}
                level={1}
                />
            </div>
           
        </div>
    )
}