class Gift < ApplicationController

  # Send gift for random user
  def self.send
    begin
      # Get random item from shop
      item = Item.order("RAND()").first

      # Get random player
      player = UserPlayer.order("RAND()").first

      return if item.nil? || player.nil?

      count_items = rand(1..3)

      Shopcart.create(
          player: player.user_name,
          item: item.item_id,
          amount: count_items
      )

      HistoryGift.create(
          title: item.title,
          user_player_id: player.id,
          count: count_items,
          coast: item.coast
      )
    rescue => e
      gift_logger.error("Gift error. Reason: #{e.message}")
    end
  end


  private
    def self.gift_logger
      @@gift_logger ||= Logger.new("#{Rails.root}/log/gift_logger.log")
    end
end
