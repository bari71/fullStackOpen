import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/notes'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorType, setErrorType] = useState('error')

  useEffect(() => {
    personService
      .getPersons()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const matchedPersons = persons.filter(function(person, index) {
    return person.name.toLowerCase().includes(filter.toLowerCase())
  })

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilter = (event) => setFilter(event.target.value)
  const displayNotifications = (message, type) => {
    setErrorMessage(message)
    setErrorType(type)
    setTimeout(() => {
    setErrorMessage('')
    }, 5000)
  }
  const completePersonAddition = () => {
    let nameObj = { name: newName, number: newNumber }
    personService
      .addPerson(nameObj)
      .then(res1 => {
        return personService.getPersons()
      })
      .then(res2 => {
        setPersons(res2.data)
        displayNotifications(`Added ${newName}`, 'success')
      })
      .catch(error => {
        setErrorMessage(`Information about ${newName} has already been removed from the server`)
      })
  }

  const completePersonUpdate = (id) => {
    let nameObj = { name: newName, number: newNumber }
    personService
      .updatePerson(id, nameObj)
      .then(res1 => {
        return personService.getPersons()
      })
      .then(res2 => {
        setPersons(res2.data)
        displayNotifications(`Updated ${newName}'s number to ${newNumber}`, 'success')
      })
      .catch(error => {
        displayNotifications(`Information about ${newName} has already been removed from the server`, 'error')
      })
  }

  const handleAddClick = (event) => {
    event.preventDefault()
    const nameExists = persons.find((person) => newName === person.name)
    if (nameExists) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        completePersonUpdate(nameExists.id)
      }
    } else {
      completePersonAddition()
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={errorType}/>
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
      <Persons matchedPersons={matchedPersons} allPersons={persons} setAllPersons={setPersons}/>
    </div>
  )
}

export default App