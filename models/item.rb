class Item < ActiveRecord::Base
  has_many :shop_baskets, dependent: :destroy

  validates :title, length: {maximum: 20}, presence: true
  validates :image_url, length: {maximum: 2048}
  validates :coast, presence: true
  validates :item_id, presence: true
  validates :description, length: {maximum: 2048}
end