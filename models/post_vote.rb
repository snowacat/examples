class PostVote < ActiveRecord::Base
  TYPE_VOTE = [ UP = 0, DOWN = 1 ]

  belongs_to :user
end
