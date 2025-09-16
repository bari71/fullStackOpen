const Persons = ({ matchedPersons }) => {
    return (
        <>
            {matchedPersons.map(function(person, index) {
                return <span key={index}>{person.name} {person.number}<br /></span>
            })}
        </>
    )
}

export default Persons