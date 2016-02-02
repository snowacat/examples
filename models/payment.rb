class Payment < ActiveRecord::Base
  STATUSES = [DEFAULT = 0, PAID = 1]

  belongs_to :user
  validates :amount, numericality: { greater_than: 0 }

  STATUS = [DEFAULT = nil, NONE = 0, REFUNDED = 1, PAID = 2]

  def self.payments_for_author(author_id)
    query = <<-SQL
      SELECT payments.event_id, payments.amount, payments.id FROM payments

      LEFT JOIN events ON payments.event_id = events.id

      LEFT JOIN payments_transactions ON events.user_id = payments_transactions.user_id
      AND payments_transactions.created_at =
      (
        SELECT MAX(created_at)
        FROM payments_transactions
        WHERE payments_transactions.user_id = events.user_id
      )
      WHERE events.user_id = ?
      AND (payments.status != 1 AND payments.status != 2 OR payments.status IS NULL)
      AND events.end_date < (current_timestamp at time zone 'utc') - interval '#{GlobalConstants::TIME_EVENT_PASSED}'
    SQL

    request = [query, author_id]
    self.find_by_sql request
  end
end
