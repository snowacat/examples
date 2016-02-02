class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_filter :get_callback_modal, :top_navigation_links, :show_callback

  add_crumb 'Главная', '/', link_html_options: { title: 'Главная страница Novadent', rel: 'nofollow' }

  def top_navigation_links
    @links = Service.includes(:children).where(parent_id: nil).order(:id)
  end

  def load_services
    @services = Service.includes(:children).order(:item_number).all
  end

  def breadcrumbs_services
    if @service.parent.present?
      add_crumb @service.parent.slug, service_path(@service.parent.url_slug), link_html_options: { rel: 'nofollow' }
      add_crumb @service.slug, service_child_path(@service.parent.url_slug, @service.url_slug), link_html_options: { rel: 'nofollow' }
    else
      add_crumb @service.slug, service_path(@service.url_slug), link_html_options: { rel: 'nofollow' }
    end
  end

  private
    def check_child
      @url_slug = params[:id].nil? ? params[:service_id] : params[:id]
    end
end
