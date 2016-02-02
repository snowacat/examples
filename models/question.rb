class Question < ActiveRecord::Base
	belongs_to :service
  has_many :answers, dependent: :destroy
  accepts_nested_attributes_for :answers, allow_destroy: true

  after_create :send_notifications
  after_update :send_email_to_author

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i

  validates :asker, presence: true, length: 2..15
  validates :asker_email, presence: true, format: { with: VALID_EMAIL_REGEX }
  validates :body, presence: true, length: 0..1000

  scope :with_published_answers, -> { where(published: 'true', answered: 'true').includes(:answers).order(created_at: :desc) }


  private
    def send_email_to_author
      return unless self.answered && self.published

      UserMailer.answer_email(self).deliver
    rescue => e
      Rails.logger.error "Could not send email to author. Error: '#{e}'"
    end

    def send_notifications
      admins = AdminUser.where(notify: true)
      admins.each do |admin|
        UserMailer.send_notification(admin.email, 'Пользователь задал новый вопрос', self.body).deliver
      end
    rescue => e
      Rails.logger.error "Could not send email to admins. Error: '#{e}'"
    end
end
