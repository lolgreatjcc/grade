import styles from "./Options.module.css";

const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
const convertIntToRoman = (num) => {
    if (num >= 1&& num <= 10) return roman[num - 1];
    else return roman[0];
}

export default function OecQuestion({numberOfMcqs, numberOfOec, oecData, setOecData, editOecData, isSubpart, parentIndex, parentData}) {
    const handleSizeUpdate = (index, event) => {
        const tempArr = isSubpart ? [...parentData] : [...oecData];
        if (isSubpart) tempArr[parentIndex].subpart[index].size = parseInt(event.target.value);
        else tempArr[index].size = parseInt(event.target.value);
        setOecData(tempArr);
    };

    const handleTypeUpdate = (index, type) => {
        const tempArr =  isSubpart ? [...parentData] : [...oecData];
        if (isSubpart) tempArr[parentIndex].subpart[index].type = type;
        else tempArr[index].type = type;
        setOecData(tempArr);
    }

    const addSubPart = (parentIndex) => {
        const subpartLength = oecData[parentIndex].subpart.length;
        if (subpartLength < 10) {
            const tempArr =  isSubpart ? [...parentData] : [...oecData];
            tempArr[parentIndex].subpart = editOecData(subpartLength, subpartLength + 1, oecData[parentIndex].subpart, true);
            setOecData(tempArr)
        }
    }

    const oecQuestions = (index, questionData) => {
        const questionNumber = numberOfMcqs + 1 + (isSubpart ? parentIndex : index) ;
        const subpartNumber = index + 1;

        return (
            <div className={`text-white ${isSubpart && (subpartNumber !== 1) && "pt-10"}`} key={`${questionNumber}${isSubpart && "." + subpartNumber}`}>
                {!isSubpart && <h1>Q{questionNumber}</h1>}
            {questionData.subpart.length === 0 ?  <div className={`grid grid-cols-10 gap-1`}>
                <div className="col-span-4">
                    <h1 className={`text-xl`}>Type for Q{questionNumber}{isSubpart && `(${convertIntToRoman(subpartNumber)})`}</h1>
                </div>
                <div className={`col-span-3 flex`}>
                    <h1 className={`text-xl cursor-pointer pr-2 
                        ${questionData.type !== 1 ? styles.option : ""}`}
                        onClick={() => {handleTypeUpdate(questionData.index, 1)}}
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
                parentIndex={index}
                parentData={oecData}
                isSubpart={true}
                /> 
                }

                {!isSubpart && <div className={`col-span-4 justify-center flex mt-5`}>
                    <div className={`w-3/4 text-center px-2 py-3 rounded border-1 ${questionData.subpart.length < 10 ? "cursor-pointer" : "cursor-not-allowed text-stone-400"} hover:text-stone-400`} onClick={() => addSubPart(index)}>
                        <h1 className={`text-xl mr-5`}>+ Sub-Section for Q{questionNumber}</h1>
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