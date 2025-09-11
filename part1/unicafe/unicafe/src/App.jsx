import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}

const Button = ({ onClick, name }) => {
  return (
    <>
      <button onClick={onClick}>{name}</button>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodOnClick = () => setGood(good + 1)
  const neutralOnClick = () => setNeutral(neutral + 1)
  const badOnClick = () => setBad(bad + 1)

  if (good !== 0 || bad !== 0 || neutral !== 0) {
    return (
      <>
      <h1>give feedback</h1>
      <Button onClick={goodOnClick} name='good'></Button>
      <Button onClick={neutralOnClick} name='neutral'></Button>
      <Button onClick={badOnClick} name='bad'></Button>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text='good' value={good}/>
          <StatisticLine text='neutral' value={neutral}/>
          <StatisticLine text='bad' value={bad}/>
          <StatisticLine text='all' value={good+neutral+bad}/>
          <StatisticLine text='average' value={(good-bad) / (good+neutral+bad)}/>
          <StatisticLine text='positive' value={good/(good+neutral+bad)*100 + ' %'}/>
        </tbody>
      </table>
      </>
    )
  } else {
    return (
      <>
      <h1>give feedback</h1>
      <Button onClick={goodOnClick} name='good'></Button>
      <Button onClick={neutralOnClick} name='neutral'></Button>
      <Button onClick={badOnClick} name='bad'></Button>
      <h1>statistics</h1>
      No feedback given
      </>
    )
  }
}

export default App