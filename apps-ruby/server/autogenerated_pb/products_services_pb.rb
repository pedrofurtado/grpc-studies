# Generated by the protocol buffer compiler.  DO NOT EDIT!
# Source: products.proto for package ''

require 'grpc'
require 'products_pb'

module ProductService
  class Service

    include ::GRPC::GenericService

    self.marshal_class_method = :encode
    self.unmarshal_class_method = :decode
    self.service_name = 'ProductService'

    rpc :ListAll, ::Empty, ::ProductListAllResponse
    rpc :Get, ::ProductRequestId, ::Product
    rpc :Insert, ::Product, ::Product
    rpc :Update, ::Product, ::Product
    rpc :Delete, ::ProductRequestId, ::Empty
  end

  Stub = Service.rpc_stub_class
end
