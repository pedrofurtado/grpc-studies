const express = require('express')
const app = express()
const os = require('os')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  const gRPC = require('grpc')
  const ProductService = gRPC.load('/proto/products.proto').ProductService

  const client = new ProductService('server_nodejs:5000', gRPC.credentials.createInsecure())

  client.list({}, (error, products) => {
    res.json({
      error: error,
      data_from_grpc: products
    })
  })

  // res.json({
  //   app: 'GRPC studies - Apps NodeJS - Client'
  // })
})

app.listen(3000, () => {
  console.log('GRPC studies - Apps NodeJS - Client - App started')
})
