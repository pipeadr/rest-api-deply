const express = require('express')
const cryptho = require('node:crypto')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./shemas/movies_shema')

const movies = require('./movies.json')


const app = express()
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))


app.use(express.json())
app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.json({message: 'Todas mienten' })
})

app.get('/movies', (req, res) => {
  // const origin = req.header('origin')
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }
  
    // res.status(201).json(req.body)
    const { genre } = req.query
    if (genre) {
        const filtros = movies.filter(
            movie  => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
       return res.json(filtros) 
    }
    res.json(movies)
  })
  
  app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'ERROR' })
  }) 


  app.post('/movies', (req, res) => {
    // const { title, year, director, duration, rate, poster } = req.body
    const result = validateMovie(req.body)

    if (result.error) {
      // res.status(422).json.parse(({ error: result.error.message }))
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
      id: cryptho.randomUUID(),
      ...result.data
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
  })


  app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)
  
    if (!result.success) {
      return res.status(404).json({ message: 'Movie not found'})
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex < 0) return res.status(404).json({ message: 'Movie not found'})

    const updateMovie = {
      ...movies[movieIndex],
      ...result.data
    }
    movies[movieIndex] = updateMovie

    return res.json(updateMovie)
  })


  // app.options('/movies/:id', (req, res) => {
  //   const origin = req.header('origin')
  //   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //     res.header('Access-Control-Allow-Origin', origin)
  //     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  //     res.status(204).end() // Respondemos con un estado 204
  //   } else {
  //     res.status(403).send("Forbidden") // En caso de no estar en la lista de orígenes permitidos
  //   }
  // })
  

  app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
      return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted' })
  })




  const PORT = process.env.PORT ?? 1234
  
app.listen(PORT, () => {
    console.log(`El servidor esta escuhando en el puerto http://localhost:${PORT}`)
  })
  