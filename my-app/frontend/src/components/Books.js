import { useQuery } from '@apollo/client'
import { ALL_GENRES } from '../queries'
import { useState } from 'react'
import BooksInGenre from './BooksInGenre'


const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if(result.loading) return <div>loading...</div>

  const genres = result.data.allGenres

  return (
    <div>
      <h2>books</h2>
      {genre ? <p>in genre <strong>{genre}</strong></p> : <strong>all genres</strong>}
      <BooksInGenre genre={genre}/>
      {genres.map(genre => 
        <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
      )}<button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
