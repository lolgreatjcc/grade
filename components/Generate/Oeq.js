import OeqContainer from "./OeqContainer";
import { v4 as uuidv4 } from 'uuid';
// questions are using a level system
// level 1: main question
// level 2: sub question (part a, b, c)
// level 3: sub part (i, ii, iii)
// initial data for each question (subpart or not)

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

export default function Oeq({numberOfMcqs, numberOfOeq, setNumberOfOeq, oeqData, setOeqData}) {
    const constructInitialData = (parentId = undefined) => {
        const questionId = uuidv4();
        return {
            "questionId": questionId,
            "parentId": parentId,
            "subpart": [],
            "type": 2,
            "size": 0,
        }
    }


    const handleNumberOfOeq = (numberOfOeq, newNumberOfOeq) => {
        // invalid number of questions, reset all
        if (newNumberOfOeq < 0) {
            setOeqData([]);
            setNumberOfOeq(0);
        } else if (newNumberOfOeq > numberOfOeq) {
            const tempOeq = [...oeqData];
            for (let i = numberOfOeq; i < newNumberOfOeq; i++) tempOeq.push(constructInitialData());
            setOeqData(tempOeq);
            setNumberOfOeq(newNumberOfOeq); 
        } else if (newNumberOfOeq < numberOfOeq) {
            setOeqData(oeqData.slice(0, newNumberOfOeq));
            setNumberOfOeq(newNumberOfOeq);
        }
    }

    const addInitialData = (array, parentId = undefined) => {
        const tempOeq = [...array];
        tempOeq.push(constructInitialData(parentId));
        return tempOeq;
    }

    const recursionAddQuestion = (array, parentId) => {
        const tempOeq = [...array];
        let found = false;
        for (let i = 0; i < tempOeq.length; i++) {
            if (tempOeq[i].questionId == parentId) {
                tempOeq[i].subpart = addInitialData(tempOeq[i].subpart, parentId);
                found = true;
                break;
            } else if (tempOeq[i].subpart.length > 0) {
                const subQuestions = recursionAddQuestion(tempOeq[i].subpart, parentId);
                if (subQuestions !== false) {
                    tempOeq[i].subpart = subQuestions;
                    found = true;
                    break;
                }
            }
        }

        if (found) return tempOeq;
        else return false;
    }

    const addQuestion = (parentId = undefined) => {
        if (parentId == undefined) setOeqData(addInitialData(oeqData));
        else {
            const recursionAddResult = recursionAddQuestion(oeqData, parentId);
            if (recursionAddResult !== false) {
                setOeqData(recursionAddResult);
                setNumberOfOeq(recursionAddResult.length);
            }
        }
    }

    const recursionSearchEdit = (array, questionId, property, value) => {
        const tempOeq = [...array];
        let found = false;
        for (let i = 0; i < tempOeq.length; i++) {
            if (tempOeq[i].questionId == questionId) {
                tempOeq[i][property] = value;
                found = true;
                break;
            } else if (tempOeq[i].subpart.length > 0) {
                const subQuestions = recursionSearchEdit(tempOeq[i].subpart, questionId, property, value);
                if (subQuestions !== false) {
                    tempOeq[i].subpart = subQuestions;
                    found = true;
                    break;
                }
            }
        }

        if (found) return tempOeq;
        else return false;
    }

    const editProperty = (questionId, property, value) => {
        const editedResult = recursionSearchEdit(oeqData, questionId, property, value);
        if (editedResult !== false) setOeqData(editedResult);
    }

    const recursionRemoveQuestion = (array, questionId) => {
        const tempOeq = [...array];
        let found = false;
        for (let i = 0; i < tempOeq.length; i++) {
            if (tempOeq[i].questionId == questionId) {
                tempOeq.splice(i, 1);
                found = true;
                break;
            } else if (tempOeq[i].subpart.length > 0) {
                const subQuestions = recursionRemoveQuestion(tempOeq[i].subpart, questionId);
                if (subQuestions !== false) {
                    tempOeq[i].subpart = subQuestions;
                    found = true;
                    break;
                }
            }
        }

        if (found) {
            return tempOeq;
        }
        else { 
            return false;
        }
    }

    const removeQuestion = (questionId) => {
        const editedResult = recursionRemoveQuestion(oeqData, questionId);
        if (editedResult !== false) {
            setOeqData(editedResult);
            setNumberOfOeq(editedResult.length);
        }
    }



    return (
        <div className={`h-full max-h-full text-[#FFFFFFCC]`}>
            <h1 className={`text-2xl font-bold pb-2 pt-5`}>Part B</h1>
            <div className={`flex h-min`}>
                <h1 className={`text-2xl mr-5`}>Number of Questions</h1>
                <input value={numberOfOeq} min={0} className={`text-2xl w-20 focus:outline-hidden border-b-3 text-center`} 
                onChange={(event) => handleNumberOfOeq(numberOfOeq, event.target.valueAsNumber, oeqData, 1)} 
                type="number"></input>
            </div>
            <div className={``}>
                <OeqContainer
                numberOfMcqs={numberOfMcqs}
                questionArr={oeqData}
                editProperty={editProperty}
                addQuestion={addQuestion}
                removeQuestion={removeQuestion}
                />
            </div>
           
        </div>
    )
}