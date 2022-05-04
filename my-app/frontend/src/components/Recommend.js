import { useQuery } from '@apollo/client'
import { CURRENT_USER } from '../queries'
import BooksInGenre from './BooksInGenre'

const Recommend = (props) => {
  const result = useQuery(CURRENT_USER)

  if(!props.show) return null

  if(result.loading) return <div>loading...</div>

  const user = result.data.me

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your facorite genre <strong>{user.favoriteGenre}</strong></p>
      <BooksInGenre genre={user.favoriteGenre} />
    </div>
  )
}

export default Recommend