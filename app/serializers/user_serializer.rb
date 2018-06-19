class UserSerializer < ActiveModel::Serializer
  attributes :id, :type, :first_name, :last_name, :email
end
