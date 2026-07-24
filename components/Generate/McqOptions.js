import styles from './Options.module.css'

export default function McqOptions({numberOfOptions, setNumberOfOptions, options, numberOfMcqs, setNumberOfMcqs,
    max67, threshold
}) {
    
    const handleOptionSelect = (option) => {
        if (numberOfMcqs > max67 && option > threshold) setNumberOfMcqs(max67);
        setNumberOfOptions(option);
    }

    const checkLastOption = (index) => {
        if (index !== options.length - 1) {
            return '|';
        }
    }

    return (
        <div className={`flex py-5`}>
            <h1 className={`pr-5 text-2xl`}>Number of Options</h1>
            {options.map((option, index) => {
                return <div className={`px-2 flex`}
                onClick={() => handleOptionSelect(option)}
                key={index}
                >
                    <h1 className={`text-2xl cursor-pointer ${option !== numberOfOptions ? styles.option : ''}`}>{option} &nbsp;</h1>
                    <h1 className={`text-2xl cursor-progress`}>{checkLastOption(index)}</h1>
                </div>
            })}    
        </div>
           
    );
}