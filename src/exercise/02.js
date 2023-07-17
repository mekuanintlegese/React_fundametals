// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    } else {
      // return defaultValue
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  })

  const prevRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevRef.current = key
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
        <input
          value={name}
          placeholder="Enter your name"
          onChange={handleChange}
          id="name"
        />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
