const Filter = ({ value, eventHandler }) => {
    return (
        <>
            filter shown with <input value={value} onChange={eventHandler}/>
        </>
    )
}

export default Filter