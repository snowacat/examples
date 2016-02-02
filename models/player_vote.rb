class PlayerVote < ActiveRecord::Base
  belongs_to :user
  belongs_to :user_player
end
