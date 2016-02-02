class Server < ActiveRecord::Base
  has_many :server_descriptions, dependent: :delete_all

  validates :title, length: { maximum: 256 }, presence: true
  validates :image_url, length: { maximum: 256 }
  validates :description, length: { maximum: 4096 }, presence: true
end
