class DoctorsController < ApplicationController

  def index
    @doctors = Doctor.includes(:certificates).order(:item_number).all
    add_crumb 'Наши врачи'
  end


  protected
    def load_doctor
      @doctor = Doctor.find(params[:id])
    end
end
