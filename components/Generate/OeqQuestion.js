import { useEffect } from "react";
import styles from "./Options.module.css";

const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
const subOption = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const subpartMax = 10;

// for sub question (level 2), converting number to roman
const convertIntToSubQuestion = (num) => {
    if (num >= 1 && num <= 10) return subOption[num - 1];
    else return subOption[0];
}

// for sub part (level 3), converting number to roman
const convertIntToRoman = (num) => {
    if (num >= 1 && num <= 10) return roman[num - 1];
    else return roman[0];
}

// check if question is a main question (level 1)
const isQuestion = (level) => {
    if (level === 1) return true;
    else return false;
}

// check if question is a sub question (level 2)
const isSubQuestion = (level) => {
    if (level === 2) return true;
    else return false;
}

// check if question is a sub part (level 3)
const isSubPart = (level) => {
    if (level === 3) return true;
    else return false;
}

export default function OeqQuestion({questionNumber, level, questionObj, editProperty, addQuestion, subIndex, subQuestionIndex, parentId = undefined, removeQuestion}) {
    const questionId = questionObj.questionId;

    // update size of question
    const handleSizeUpdate = (questionId, event) => {
        const newSize = parseInt(event.target.value);
        editProperty(questionId, 'size', newSize);
    };

    const handleTypeUpdate = (questionId, type) => {
        editProperty(questionId, 'type', type);
    }

    // function to add sub questions (a, b, c, ...)
    const addSubQuestion = (questionIndex) => {
        const subpartLength = oeqData[questionIndex].subpart.length;
        if (subpartLength < subpartMax) { // this limit can be changed or removed. for now I decided to limit
            const tempArr =  isSubQuestion(level) ? [...parentData] : [...oeqData]; // should always be subQuestion
            tempArr[questionIndex].subpart = editOeqData(subpartLength, subpartLength + 1, oeqData[questionIndex].subpart, 2);
            setOeqData(tempArr)
        }
    }

    // function to add sub part (a, b, c, ...)
    const addSubPart = (index) => {
        const subpartLength = parentData[questionIndex].subpart[index].subpart.length;
        if (subpartLength < subpartMax) { // this limit can be changed or removed. for now I decided to limit
            const tempArr =  [...parentData];
            console.log(tempArr[questionIndex].subpart[index]);
            tempArr[questionIndex].subpart[index].subpart = editOeqData(subpartLength, subpartLength + 1, tempArr[questionIndex].subpart[index].subpart, 3);
            setOeqData(tempArr)
        }
    }

    const handleRemoveQuestion = () => {
        console.log("removing question...")
        removeQuestion(questionId);
    }

    return (
        <div className={`${isSubQuestion(level) && (subIndex !== 0) && "pt-10"}`} key={questionId}>
            {isQuestion(level) && <h1>Q{questionNumber}</h1>}
                {questionObj.subpart.length === 0 ?  
                <div className={`grid grid-cols-11 gap-1 mb-4`}>
                    <div className="col-span-4">
                        <h1 className={`text-xl`}>Type for Q{questionNumber}
                            {isSubQuestion(level) && `(${convertIntToSubQuestion(subIndex + 1)})`}
                            {isSubPart(level) && `(${convertIntToSubQuestion(subIndex + 1)})(${convertIntToRoman(subQuestionIndex + 1)})`}
                        </h1>
                    </div>
                    <div className={`col-span-3 flex`}>
                        <h1 className={`text-xl cursor-pointer pr-2 
                            ${questionObj.type !== 1 ? styles.option : ""}`}
                            onClick={() => {handleTypeUpdate(questionId, 1,)}}
                            >Lines</h1> 
                        <h1 className={`text-xl cursor-progress`}>|</h1> 
                        <h1 className={`text-xl cursor-pointer pl-2 
                            ${questionObj.type !== 2 ? styles.option : ""}`}
                            onClick={() => {handleTypeUpdate(questionId, 2)}}>
                                Box
                        </h1>
                    </div>
                
                    <div className={`col-span-3 flex`}>
                        <h1 className={`text-xl mr-5`}>Size</h1>
                        <select name="box-size" className={`focus:outline-hidden border-white-600 border-b-3`} 
                        defaultValue={questionObj.size}
                        onChange={(event) => handleSizeUpdate(questionId, event)}
                        >
                            <option value="0">XS</option>
                            <option value="1">S</option>
                            <option value="2">M</option>
                            <option value="3">L</option>
                        </select>
                    </div>
                    <div className={`col-span-1 flex`}>
                        <h1 className={`text-xl rounded border-1 px-3 
                            cursor-pointer hover:text-stone-400`}
                            onClick={handleRemoveQuestion}>-</h1>
                    </div>
                </div> 
            : 
            <div>
                {questionObj.subpart.map((subQuestionObj, index) => {
                    return <OeqQuestion 
                     questionNumber={questionNumber}
                     subIndex={subIndex == undefined ? index : subIndex}
                     subQuestionIndex={index}
                     level={level + 1}
                     questionObj={subQuestionObj}
                     editProperty={editProperty}
                     addQuestion={addQuestion}
                     removeQuestion={removeQuestion}
                     key={`${questionId}.${index}`}
                    />
                })}
            </div>
            }

            {level < 3 && <div className={`col-span-4 justify-center flex mt-5`}>
                <div className={`w-3/4 text-center px-2 py-3 rounded border-1 ${questionObj.subpart.length < 10 ? "cursor-pointer" : "cursor-not-allowed text-stone-400"} hover:text-stone-400`} 
                onClick={() => addQuestion(questionId)}>
                    {level == 1 && <h1 className={`text-xl mr-5`}>+ Sub-Question for Q{questionNumber}</h1>}
                    {level == 2 && <h1 className={`text-xl mr-5`}>+ Sub-Part for Q{questionNumber}({convertIntToSubQuestion(subIndex + 1)})</h1>}
                </div>
                
            </div>}
            
        </div>
    );
};