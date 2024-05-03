const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const gRPC = require('grpc')
const productProto = gRPC.load('/proto/products.proto')
const productProtoClient = new productProto.ProductService(process.env.GRPC_SERVER, gRPC.credentials.createInsecure())

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    app: 'GRPC studies - Apps NodeJS - Client - Homepage'
  })
})

app.get('/api/products', (req, res) => {
  productProtoClient.listAll({}, (error, data) => {
    res.json({
      app: 'GRPC studies - Apps NodeJS - Client - GET /api/products (GRPC ListAll)',
      error: error,
      data: data
    })
  })
})

app.get('/api/products/:id', (req, res) => {
  const getProductParams = { id: req.params.id }

  productProtoClient.get(getProductParams, (error, data) => {
    res.json({
      app: 'GRPC studies - Apps NodeJS - Client - GET /api/products/:id (GRPC Get)',
      error: error,
      data: data
    })
  })
})

app.post('/api/products', (req, res) => {
  productProtoClient.insert(req.body, (error, data) => {
    res.json({
      app: 'GRPC studies - Apps NodeJS - Client - POST /api/products (GRPC Insert)',
      error: error,
      data: data
    })
  })
})

app.put('/api/products/:id', (req, res) => {
  const updateProductParams = {
    id: req.params.id,
    name: req.body.name,
    description: req.body.description
  }

  productProtoClient.update(updateProductParams, (error, data) => {
    res.json({
      app: 'GRPC studies - Apps NodeJS - Client - PUT /api/products/:id (GRPC Update)',
      error: error,
      data: data
    })
  })
})

app.delete('/api/products/:id', (req, res) => {
  const deleteProductParams = { id: req.params.id }

  productProtoClient.delete(deleteProductParams, (error, data) => {
    res.json({
      app: 'GRPC studies - Apps NodeJS - Client - DELETE /api/products/:id (GRPC Delete)',
      error: error,
      data: data
    })
  })
})

app.listen(3000, () => {
  console.log('GRPC studies - Apps NodeJS - Client - App started')
})
