class User < ActiveRecord::Base
  before_create :create_role

  has_many :posts
  has_many :users_roles
  has_many :user_players
  has_many :recalls
  has_many :player_votes
  has_many :post_votes
  has_many :shop_baskets
  has_many :shop_histories
  has_many :roles, through: :users_roles
  has_many :payments

  validates :email, presence: true, uniqueness: true

  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  def role?(role)
    return !!self.roles.find_by_name(role)
  end

  private
    def create_role
      self.roles << Role.find_by_name(:user)
    end
end
