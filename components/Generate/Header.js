export default function Header({institution, setInstitution, subject, setSubject, year, setYear, duration, setDuration}) {
    const handleInstitutionUpdate = (event) => {
        const value = event.target.value;
        setInstitution(value);
    };

    const handleSubjectUpdate = (event) => {
        const value = event.target.value;
        setSubject(value);
    }

    const handleYearUpdate = (event) => {
        const value = event.target.value;
        setYear(value);
    }

    const handleDurationUpdate = (event) => {
        const value = event.target.value;
        setDuration(value);
    }

    return (
        <div className={`h-auto pr-4 text-[#FFFFFFCC]`}>
            <h1 className={`text-2xl font-bold pb-2`}>Headers</h1>
            <div className={`grid grid-cols-10 pb-2`}>
                <h1 className={`pr-5 text-2xl  col-span-4`}>Name of Institution</h1>
                <input defaultValue={institution} className={`text-2xl focus:outline-hidden border-b-3 text-center col-span-6`} onChange={handleInstitutionUpdate} type="text"/>
            </div>
            <div className={`grid grid-cols-10 py-2`}>
                <h1 className={`pr-5 text-2xl  col-span-4`}>Subject</h1>
                <input defaultValue={subject} className={`text-2xl focus:outline-hidden border-b-3 text-center col-span-6`} onChange={handleSubjectUpdate} type="text"/>
            </div>
            <div className={`grid grid-cols-10 py-2`}>
                <h1 className={`pr-5 text-2xl  col-span-4`}>Year of Paper</h1>
                <input defaultValue={year} className={`text-2xl focus:outline-hidden border-b-3 text-center col-span-6`} onChange={handleYearUpdate} type="text"/>
            </div>
            <div className={`grid grid-cols-10 pt-2 pb-12`}>
                <h1 className={`pr-5 text-2xl  col-span-4`}>Duration</h1>
                <input defaultValue={duration} className={`text-2xl focus:outline-hidden border-b-3 text-center col-span-6`} onChange={handleDurationUpdate} type="text"/>
            </div>
        </div>
    )
}