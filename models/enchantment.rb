class Enchantment
  include ActiveModel::Validations
  include ActiveModel::Conversion
  extend ActiveModel::Naming

  attr_accessor :level

  validates_numericality_of :level, only_integer: true, allow_nil: true,
                            greater_than_or_equal_to: 0,
                            less_than_or_equal_to: 7,
                            message: "0 - 7"

  def initialize(attributes = {})
    attributes.each do |name, value|
      send("#{name}=", value)
    end
  end

  def persisted?
    false
  end

  def object_empty?
    email.blank? && phone_number.blank?
  end
end
