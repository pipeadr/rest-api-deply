app.post('/movies', (req, res) => {
    const { title, year, director, duration, rate, poster } = req.body
    const newMovie = {
      id: cryptho.randomUUID(),
      title,
      year,
      director,
      duration,
      rate: rate ?? 0,
      poster
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
  })
