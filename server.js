const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
const url = 'mongodb://localhost/urlShortener'

//const swaggerUI = require('swagger-ui-express')
//const YAML = require('yaml')
//const spec = YAML.load('./swagger.yml')

mongoose.connect(url)

/**
 * @param {String} shortUrls - Pegar o modelo do dado em models
 */

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.json(shortUrls)
})

app.get('/shortUrls/:urlId', async (req, res) => {
  const { urlId } = req.params
  const shortUrls = await ShortUrl.find()
  const url = shortUrls.find(u => u.id === urlId)
  if (!url) {
    return res.status(404).json({ message: 'Product not found' })
  }
  return res.json(url)
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)
  shortUrl.save()
  res.redirect(shortUrl.full)
})

// Iniciar o server
app.listen(process.env.PORT || 5000)
