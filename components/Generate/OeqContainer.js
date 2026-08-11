import OeqQuestion from "./OeqQuestion";
import styles from "./Options.module.css";

export default function OeqContainer({numberOfMcqs, questionArr, editProperty, addQuestion, removeQuestion}) {

    return (
        <div className={`pl-5`}>
            <div className={``}>
                {questionArr.map((questionObj, index) => {
                return <OeqQuestion 
                    questionNumber={index + 1 + numberOfMcqs}
                    subIndex={undefined}
                    level={1}
                    numberOfMcqs={numberOfMcqs}
                    editProperty={editProperty}
                    addQuestion={addQuestion}
                    questionObj={questionObj}
                    removeQuestion={removeQuestion}
                    key={index}
                />
            })}
            </div>
            
        </div>
    )
}