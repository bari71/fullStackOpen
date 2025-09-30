import axios from "axios";
const baseUrl = 'http://localhost:3001/persons'

const getPersons = () => {
    return axios.get(baseUrl)
}

const addPerson = nameObj => {
    return axios.post(baseUrl, nameObj)
}

const deletePerson = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updatePerson = (id, newPersonObj) => {
    return axios.put(`${baseUrl}/${id}`, newPersonObj)
}

export default { addPerson, deletePerson, getPersons, updatePerson }