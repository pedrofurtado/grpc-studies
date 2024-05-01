require 'sinatra'
require 'sinatra/reloader'

configure do
  enable :reloader
  set :strict_paths, false
end

get '/' do
  content_type :json
  {
    app: 'GRPC studies - Apps Ruby - Client'
  }.to_json
end
