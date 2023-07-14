/* eslint-disable react-hooks/rules-of-hooks */
// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  console.log(key)
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    } else {
      return defaultValue
    }
  })

  const previousKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = previousKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(previousKeyRef)
    }
    previousKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}
function Greeting({initialName = ''}) {
  let [name, setName] = useLocalStorage('name', initialName)
  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
