class HealthScreeningSerializer < ActiveModel::Serializer
  attributes :id, :kind, :species, :renewal_interval, :last_updated, :status
  belongs_to :pet
end
