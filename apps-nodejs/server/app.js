const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    app: 'GRPC studies - Apps NodeJS - Server'
  })
})

function generateProductsForFakeDatabaseInMemory(numberOfProducts) {
  const products = []

  for (let i = 1; i <= numberOfProducts; i++) {
    products.push({
      id: i,
      name: `Product ${i}`,
      description: `Description ${i}`
    })
  }

  return products
}

const DBInMemory = generateProductsForFakeDatabaseInMemory(4)

const gRPC = require('grpc')
const productsProto = gRPC.load('/proto/products.proto')
const gRPCServer = new gRPC.Server()

gRPCServer.bind('0.0.0.0:5000', gRPC.ServerCredentials.createInsecure())

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
    let product = DBInMemory.find((n) => n.id == productId)

    if (product) {
      callback(null, product)
    }
    else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: `Product with id=${productId} not found`
      })
    }
  },

  insert: (call, callback) => {
    let note = call.request
    note.id = uuidv1()
    notes.push(note)
    callback(null, note)
  },

  update: (call, callback) => {
    let existingNote = notes.find((n) => n.id == call.request.id)
    if (existingNote) {
        existingNote.title = call.request.title
        existingNote.content = call.request.content
        callback(null, existingNote)
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found"
        })
    }
  },

  delete: (call, callback) => {
    let existingNoteIndex = notes.findIndex((n) => n.id == call.request.id)
    if (existingNoteIndex != -1) {
        notes.splice(existingNoteIndex, 1)
        callback(null, {})
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            details: "Not found"
        })
    }
  }
})

app.listen(3000, () => {
  console.log('GRPC studies - Apps NodeJS - Server - Web App started')

  console.log('GRPC studies - Apps NodeJS - Server - GRPC App started')
  gRPCServer.start()
})
