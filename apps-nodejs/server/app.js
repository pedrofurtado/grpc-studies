const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const gRPC = require('grpc')
const productsProto = gRPC.load('/proto/products.proto')
const gRPCServer = new gRPC.Server()
gRPCServer.bind('0.0.0.0:5000', gRPC.ServerCredentials.createInsecure())

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    app: 'GRPC studies - Apps NodeJS - Server - Homepage'
  })
})

function generateProductsForFakeDatabaseInMemory(numberOfProducts) {
  const products = []

  for (let i = 1; i <= numberOfProducts; i++) {
    products.push({
      id: i,
      name: `Product ${i} from NodeJS`,
      description: `Description ${i} from NodeJS`
    })
  }

  return products
}

const DBInMemory = generateProductsForFakeDatabaseInMemory(4)

gRPCServer.addService(productsProto.ProductService.service, {
  listAll: (_, callback) => {
    callback(null, {
      status: productsProto.RpcStatusCode.SUCCESS,
      message: 'done',
      results: DBInMemory
    })
  },

  get: (call, callback) => {
    const productId = call.request.id
    let product = DBInMemory.find((p) => p.id == productId)

    if (product) {
      callback(null, product)
    }
    else {
      callback({
        code: gRPC.status.NOT_FOUND, // All available gRPC status: https://grpc.github.io/grpc/core/md_doc_statuscodes.html
        details: `Product with id=${productId} not found for get | NodeJS`
      })
    }
  },

  insert: (call, callback) => {
    const product = call.request
    product.id = Math.max(...DBInMemory.map(p => p.id)) + 1
    DBInMemory.push(product)
    callback(null, product)
  },

  update: (call, callback) => {
    const productId = call.request.id
    const existingProduct = DBInMemory.find((p) => p.id == productId)

    if (existingProduct) {
      existingProduct.name = call.request.name
      existingProduct.description = call.request.description
      callback(null, existingProduct)
    }
    else {
      callback({
        code: gRPC.status.NOT_FOUND,
        details: `Product with id=${productId} not found for update | NodeJS`
      })
    }
  },

  delete: (call, callback) => {
    const productId = call.request.id
    const existingProductIndex = DBInMemory.findIndex((p) => p.id == productId)

    if (existingProductIndex != -1) {
      DBInMemory.splice(existingProductIndex, 1)
      callback(null, {})
    }
    else {
      callback({
        code: gRPC.status.NOT_FOUND,
        details: `Product with id=${productId} not found for delete | NodeJS`
      })
    }
  }
})

app.listen(3000, () => {
  console.log('GRPC studies - Apps NodeJS - Server - Web App started')

  console.log('GRPC studies - Apps NodeJS - Server - GRPC App started')
  gRPCServer.start()
})
