class ServicesController < ApplicationController
  before_action :load_services, only: [:index, :show]
  before_action :load_service, only: :show

  def index
    add_crumb 'Услуги и цены'
  end

  def show
    add_crumb 'Услуги и цены', services_path, link_html_options: { rel: 'nofollow' }
    add_crumb @service.parent.slug, service_path(@service.parent.url_slug), link_html_options: { rel: 'nofollow' } if @service.parent.present?
    add_crumb @service.slug
  end

  protected
    def load_service
      @service = Service.includes(:children).find_by url_slug: params[:id]
    end
end
