import axios from "axios"
import personService from '../services/persons'

const Persons = ({ matchedPersons, allPersons, setAllPersons }) => {
    const handleDeletePerson = (id, name) => {
        if (window.confirm(`Delete ${name}`)) {
            personService
                .deletePerson(id)
                .then(response => {
                    personService
                        .getPersons()
                        .then(response => {
                            setAllPersons(response.data)
                        })
                })
        }
    }

    return (
        <>
            {matchedPersons.map(function(person, index) {
                return <span key={index}>{person.name} {person.number}<button onClick={() => handleDeletePerson(person.id, person.name)}>delete</button><br /></span>
            })}
        </>
    )
}

export default Persons