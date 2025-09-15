import Part from "./Part"

const Content = ({ parts }) => {
    return (
    <>
        {parts.map((part, index) => <Part key={index} partObj={part}/>)}
    </>
  )
}

export default Content