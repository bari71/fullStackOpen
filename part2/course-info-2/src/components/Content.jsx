import Part from "./Part"

const Content = ({ parts }) => {
    const total = parts.reduce((accumulator, currNum) => accumulator + currNum.exercises, 0)
    return (
    <>
        {parts.map((part, index) => <Part key={index} partObj={part}/>)}
        <strong>total of {total} exercises</strong>
    </>
  )
}

export default Content