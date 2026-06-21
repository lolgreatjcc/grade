import OecQuestion from "./OecQuestion";

const constructInitialData = (index, subpart) => {
    return {
        "index": index,
        "subpart": [],
        "isSubpart": subpart || false,
        "type": 2,
        "size": 0,
    }

}

const editOecData = (oldNumber, newNumber, oldData, subpart) => {
    if (newNumber < 0) {
        return [];
    } 
    if (oldData.length === 0) {
        const tempArr = [];
        for (let i = 0; i < newNumber; i++) tempArr.push(constructInitialData(i, subpart));
        return tempArr;
    } else if (newNumber > oldNumber) {
        const tempArr = [...oldData];
        for (let i = oldNumber; i < newNumber; i++) tempArr.push(constructInitialData(i, subpart));
        return tempArr;
    } else {
        return oldData.slice(0, newNumber);
    }
}

export default function Oec({numberOfMcqs, numberOfOec, setNumberOfOec, oecData, setOecData, constructInitialData}) {

    const handleNumberOfOec = (numberOfOec, newNumberOfOec, oecData, subpart) => {
        if (newNumberOfOec < 0) {
            setOecData([]);
            setNumberOfOec(0);
        } else {
            setOecData(editOecData(numberOfOec, newNumberOfOec, oecData, subpart));
            setNumberOfOec(newNumberOfOec); 
        }
    }

    return (
        <div className={`h-full max-h-full`}>
            <h1 className={`text-2xl font-bold pb-2 pt-5 text-white`}>Part B</h1>
            <div className={`flex h-min`}>
                <h1 className={`text-2xl mr-5 text-white`}>Number of Questions</h1>
                <input defaultValue={0} min={0} className={`text-2xl w-20 focus:outline-hidden border-white border-b-3 text-white text-center`} 
                onBlur={(event) => handleNumberOfOec(numberOfOec, event.target.valueAsNumber, oecData, false)} 
                type="number"></input>
            </div>
            <div className={``}>
                <OecQuestion
                numberOfMcqs={numberOfMcqs}
                numberOfOec={numberOfOec}
                oecData={oecData}
                setOecData={setOecData}
                editOecData={editOecData}
                isSubpart={false}
                />
            </div>
           
        </div>
    )
}