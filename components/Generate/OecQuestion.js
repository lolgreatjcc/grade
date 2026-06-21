import styles from "./Options.module.css";

const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
const subOption = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

const convertIntToRoman = (num) => {
    if (num >= 1&& num <= 10) return roman[num - 1];
    else return roman[0];
}

const convertIntToSubpart = (num) => {
    if (num >= 1&& num <= 10) return subOption[num - 1];
    else return subOption[0];
}

const isSubQuestion = (level) => {
    if (level === 2) return true;
    else return false;
}

const isSubPart = (level) => {
    if (level === 3) return true;
    else return false;
}

const isQuestion = (level) => {
    if (level === 1) return true;
    else return false;
}

export default function OecQuestion({numberOfMcqs, numberOfOec, oecData, setOecData, editOecData, level, questionIndex, subQuestionIndex, parentData}) {
    const handleSizeUpdate = (index, event) => {
        const tempArr = isSubQuestion(level)|| isSubPart(level) ? [...parentData] : [...oecData];
        const newSize = parseInt(event.target.value);

        if (isSubQuestion(level)) tempArr[questionIndex].subpart[index].size = newSize;
        else if (isSubPart(level)) tempArr[questionIndex].subpart[subQuestionIndex].subpart[index].size = newSize; 
        else tempArr[index].size = newSize;
        setOecData(tempArr);
    };

    const handleTypeUpdate = (index, type) => {
        const tempArr =  !isQuestion(level) ? [...parentData] : [...oecData];
        
        if (isSubQuestion(level)) tempArr[questionIndex].subpart[index].type = type;
        else if (isSubPart(level)) tempArr[questionIndex].subpart[subQuestionIndex].subpart[index].type = type; 
        else tempArr[index].type = type;
        setOecData(tempArr);
    }

    const addSubQuestion = (questionIndex) => {
        const subpartLength = oecData[questionIndex].subpart.length;
        if (subpartLength < 10) {
            const tempArr =  isSubQuestion(level) ? [...parentData] : [...oecData];
            tempArr[questionIndex].subpart = editOecData(subpartLength, subpartLength + 1, oecData[questionIndex].subpart, 2);
            setOecData(tempArr)
        }
    }

    const addSubPart = (index) => {
        const subpartLength = parentData[questionIndex].subpart[index].subpart.length;

        if (subpartLength < 10) {
            const tempArr =  [...parentData];
            console.log(tempArr[questionIndex].subpart[index]);
            tempArr[questionIndex].subpart[index].subpart = editOecData(subpartLength, subpartLength + 1, tempArr[questionIndex].subpart[index].subpart, 3);
            setOecData(tempArr)
        }
    }

    const oecQuestions = (index, questionData) => {
        const questionNumber = numberOfMcqs + 1 + (!isQuestion(level) ? questionIndex : index) ;
        const subpartNumber = index + 1;
        return (
            <div className={`text-white ${isSubQuestion(level) && (subpartNumber !== 1) && "pt-10"}`} key={`${questionNumber}${isSubQuestion(level) && "." + subpartNumber}${isSubPart(level) && "." + subpartNumber}`}>
                {isQuestion(level) && <h1>Q{questionNumber}</h1>}
            {questionData.subpart.length === 0 ?  <div className={`grid grid-cols-10 gap-1 mb-4`}>
                <div className="col-span-4">
                    <h1 className={`text-xl`}>Type for Q{questionNumber}
                        {isSubQuestion(level) && `(${convertIntToSubpart(subpartNumber)})`}
                        {isSubPart(level) && `(${convertIntToSubpart(subQuestionIndex + 1)})(${convertIntToRoman(subpartNumber)})`}</h1>
                </div>
                <div className={`col-span-3 flex`}>
                    <h1 className={`text-xl cursor-pointer pr-2 
                        ${questionData.type !== 1 ? styles.option : ""}`}
                        onClick={() => {handleTypeUpdate(questionData.index, 1, )}}
                        >Lines</h1> 
                    <h1 className={`text-xl cursor-progress`}>|</h1> 
                    <h1 className={`text-xl cursor-pointer pl-2 
                        ${questionData.type !== 2 ? styles.option : ""}`}
                        onClick={() => {handleTypeUpdate(questionData.index, 2)}}
                        >Box</h1>
                </div>
                    
                <div className={`col-span-3 flex`}>
                    <h1 className={`text-xl mr-5`}>Size</h1>
                    <select name="box-size" className={`focus:outline-hidden border-white-600 border-b-3`} 
                    defaultValue={questionData.size}
                    onChange={(event) => handleSizeUpdate(questionData.index, event)}
                    >
                        <option value="0">XS</option>
                        <option value="1">S</option>
                        <option value="2">M</option>
                        <option value="3">L</option>
                    </select>
                </div>
                </div> 
                : <OecQuestion 
                numberOfMcqs={numberOfMcqs}
                numberOfOec={questionData.subpart.length}
                oecData={questionData.subpart}
                setOecData={setOecData}
                editOecData={editOecData}
                questionIndex={isQuestion(level) ? index : questionIndex}
                subQuestionIndex={index}
                parentData={parentData || oecData}
                level={level + 1}
                /> 
                }

                {level < 3 && <div className={`col-span-4 justify-center flex mt-5`}>
                    <div className={`w-3/4 text-center px-2 py-3 rounded border-1 ${questionData.subpart.length < 10 ? "cursor-pointer" : "cursor-not-allowed text-stone-400"} hover:text-stone-400`} 
                    onClick={() => isSubQuestion(level) ? addSubPart(index) : addSubQuestion(index)}>
                        {level == 1 && <h1 className={`text-xl mr-5`}>+ Sub-Question for Q{questionNumber}</h1>}
                        {level == 2 && <h1 className={`text-xl mr-5`}>+ Sub-Part for Q{questionNumber}({convertIntToSubpart(subpartNumber)})</h1>}
                    </div>
                    
                </div>}
                
            </div>
        );
    };

    return (
        <div className={`pl-5`}>
            <div className={``}>
                {oecData.map((questionData, index) => {
                return (
                    oecQuestions(index, questionData)
                )
            })}
            </div>
            
        </div>
    )
}