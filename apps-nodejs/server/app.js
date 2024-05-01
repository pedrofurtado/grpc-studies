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

const gRPC = require('grpc')
const productsProto = gRPC.load('/proto/products.proto')
const gRPCServer = new gRPC.Server()

gRPCServer.bind('0.0.0.0:5000', gRPC.ServerCredentials.createInsecure())

gRPCServer.addService(productsProto.ProductService.service, {
  list: (_, callback) => {
    const products = [
      { id: '10', name: 'Product 10', description: 'Description 10' },
      { id: '20', name: 'Product 20', description: 'Description 20' }
    ]
    callback(null, products)
  },
})

app.listen(3000, () => {
  console.log('GRPC studies - Apps NodeJS - Server - Web App started')

  console.log('GRPC studies - Apps NodeJS - Server - GRPC App started')
  gRPCServer.start()
})
