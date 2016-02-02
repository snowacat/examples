class ContactEmailsController < ApplicationController

  def create
    @contact_email = ContactEmail.new(contact_email_params)

    if @contact_email.save
      render json: answer(0, 'Спасибо! Ваше сообщение отправлено!')
    else
      Rails.logger.error "Could not create contact email. Error: '#{@contact_email.errors.messages}'"
      render json: answer(1, 'Что-то пошло не так! Но мы все еще любим Вас!')
    end
  end

  private
    def contact_email_params
      params.require(:contact_email).permit(:name, :phone, :body)
    end

    def answer error, message
      answer = {
        error: error,
        message: message
      }
    end
end
