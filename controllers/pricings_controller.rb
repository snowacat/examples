class PricingsController < ApplicationController
  before_action :load_services, :check_child

  def index
    @service = Service.find_by url_slug: @url_slug
    @pricings = @service.pricings

    breadcrumbs
  end


  protected
    def load_services
      @services = Service.includes(:children).order(:item_number).all
    end

    def breadcrumbs
      add_crumb 'Услуги и цены', services_path, link_html_options: { title: 'Услуги и цены', rel: 'nofollow' }
      breadcrumbs_services
      add_crumb 'Цены'
    end
end
