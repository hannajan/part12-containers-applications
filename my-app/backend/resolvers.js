const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let allBooks = await Book.find({}).populate('author')
      if (!args.author && !args.genre) return allBooks

      if (args.author) {
        allBooks = allBooks.filter((b) => b.author.name === args.author)
      }
      if (args.genre) {
        allBooks = allBooks.filter((b) => b.genres.includes(args.genre))
      }
      return allBooks
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors
    },
    allGenres: async () => {
      const books = await Book.find({})
      const genres = books.reduce((genres, book) => {
        book.genres.forEach((genre) => {
          if (!genres.includes(genre)) genres.push(genre)
        })
        return genres
      }, [])
      return genres
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      return root.books.length
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      if (!args.author) {
        throw new UserInputError('Author required')
      }

      let author = await Author.findOne({
        name: args.author,
      })

      if (!author) {
        newAuthor = new Author({ name: args.author })
        author = await newAuthor.save()
      }
      const book = new Book({ ...args, author })

      try {
        await book.save()
        author.books = author.books.concat(book)
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      if (!args.name) {
        throw new UserInputError('Author name required')
      }
      const author = await Author.findOne({ name: args.name })

      if (!author) return null

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
