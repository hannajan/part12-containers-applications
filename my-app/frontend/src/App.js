import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import Notification from './components/Notification'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [notification , setNotification] = useState(null)
  const client = useApolloClient()

  const notify = ({ text, style }) => {
    setNotification({ text, style })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
        notify({text: `New book '${addedBook.title}' added`, style:'success'})
    },
  })

  const logout = () => {
    setToken(null)
    setPage('authors')
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <button onClick={() => setPage('add')}>add book</button>
        ) : null}
        {token ? (
          <button onClick={() => setPage('recommend')}>recommend</button>
        ) : null}
        {token ? (
          <button onClick={logout}>logout</button>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Notification message={notification} />

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setPage={setPage} token={token} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />

      <Recommend show={page === 'recommend'} />
    </div>
  )
}

export default App
