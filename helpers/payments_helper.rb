module PaymentsHelper
  def self.create_transfer(user, total)
    begin
      Stripe.api_key = GlobalConstants::STRIPE_SECRET_KEY
      Stripe::Transfer.create(
          amount: total.to_i,
          currency: "usd",
          recipient: user.recipient_id,
          description: "Transfer for #{user.email}"
      )
    rescue => e
      Rails.logger.error "Could not pay user. User id: #{user.id}. Error: '#{e.message}'"
      return false
    end

    return true
  end

  def self.get_tax(total)
    return total - GlobalConstants::TAX * total / 100 - GlobalConstants::FEE
  end

  def self.add_transaction_history(user, total)
    PaymentsTransaction.create(
        user_id: user.id,
        amount: total
    )
  end
end
