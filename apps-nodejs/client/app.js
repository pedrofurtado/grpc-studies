const express = require('express')
const app = express()
const os = require('os')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  const gRPC = require('grpc')
  const productProto = gRPC.load('/proto/products.proto')

  const client = new productProto.ProductService(process.env.GRPC_SERVER, gRPC.credentials.createInsecure())

  client.listAll({}, (error, data) => {
    res.json({
      service: 'listAll',
      error: error,
      data: data
    })
  })

  // res.json({
  //   app: 'GRPC studies - Apps NodeJS - Client'
  // })
})

app.listen(3000, () => {
  console.log('GRPC studies - Apps NodeJS - Client - App started')
})
