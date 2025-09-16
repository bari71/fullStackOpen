import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const matchedPersons = persons.filter(function(person, index) {
    return person.name.toLowerCase().includes(filter.toLowerCase())
  })

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilter = (event) => setFilter(event.target.value)

  const handleAddClick = (event) => {
    event.preventDefault()
    const nameExists = persons.find((person) => newName === person.name)
    if (nameExists) {
      alert(`${newName} is already added to the phonebook`)
    } else {
      const nameObj = { name: newName, number: newNumber }
      const personsArr = [...persons, nameObj]
      setPersons(personsArr)
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} eventHandler={handleFilter}/>
      <h2>add a new</h2>
      <PersonForm
        nameValue={newName}
        nameEventHandler={handleNameChange}
        numberValue={newNumber}
        numberEventHandler={handleNumberChange}
        addEventHandler={handleAddClick}
      />
      <h2>Numbers</h2>
      <Persons matchedPersons={matchedPersons}/>
    </div>
  )
}

export default App