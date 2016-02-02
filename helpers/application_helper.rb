module ApplicationHelper
  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  # Method for include JavaScripts for different pages.
  def javascript(*files)
    content_for(:head) { javascript_include_tag(*files) }
  end

  # Render title
  def title(page_title)
    content_for :title, page_title.to_s
  end
end
