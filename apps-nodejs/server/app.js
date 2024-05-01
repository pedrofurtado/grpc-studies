const express = require('express')
const app = express()
const os = require('os')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    app: 'GRPC studies - Apps NodeJS - Server'
  })
})

app.listen(3000, () => {
  console.log('GRPC studies - Apps NodeJS - Server - App started')
})
