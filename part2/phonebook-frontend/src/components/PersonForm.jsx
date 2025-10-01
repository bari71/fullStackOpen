const PersonForm = ({ nameValue, nameEventHandler, numberValue, numberEventHandler, addEventHandler }) => {
    return (
        <>
        <form>
            <div>
            name: <input value={nameValue} onChange={nameEventHandler}/>
            </div>
            <div>
            number: <input value={numberValue} onChange={numberEventHandler}/>
            </div>
            <div>
            <button type="submit" onClick={addEventHandler}>add</button>
            </div>
        </form>
        </>
    )
}

export default PersonForm