require 'sinatra'
require 'sinatra/reloader'

this_dir = File.expand_path(File.dirname(__FILE__))
autogenerated_pb_dir = File.join(this_dir, 'autogenerated_pb')
$LOAD_PATH.unshift(autogenerated_pb_dir) unless $LOAD_PATH.include?(autogenerated_pb_dir)

require 'grpc'
require 'products_services_pb'

DBInMemory = []
4.times do |i|
  n = i + 1
  DBInMemory << Product.new(id: n, name: "Product #{n}", description: "Description #{n}")
end

configure do
  enable :reloader
  set :strict_paths, false
end

get '/' do
  content_type :json
  {
    app: 'GRPC studies - Apps Ruby - Server'
  }.to_json
end

class ProductsGRPCServer < ProductService::Service
  # list_all implements the ListAll rpc method.
  def list_all(req, _unused_call)
    puts "ProductsGRPCServer - ListAll rpc method"
    ::ProductListAllResponse.new(status: "SUCCESS", message: "done", results: DBInMemory)
  end

  def get(req, _unused_call)
    # https://stackoverflow.com/questions/48671754/how-can-i-return-an-error-from-a-grpc-service
    # https://www.rubydoc.info/gems/grpc/GRPC/NotFound
    DBInMemory.find { |p| p.id == req.id } || (raise GRPC::NotFound.new("Product with id=#{req.id} not found for get"))
  end
end

def run_gRPC_server
  puts "gRPC Server running"
  s = GRPC::RpcServer.new
  s.add_http2_port('0.0.0.0:5000', :this_port_is_insecure)
  s.handle(ProductsGRPCServer)
  s.run_till_terminated_or_interrupted([1, 'int', 'SIGTERM'])
end

Thread.new do
  run_gRPC_server
end
