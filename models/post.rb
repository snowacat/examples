class Post < ActiveRecord::Base
  belongs_to :user
  has_many :post_votes, dependent: :destroy

  validates :title, :content, presence: true
end
