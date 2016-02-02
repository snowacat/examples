class Cleaner < ActiveRecord::Base

  def self.clean
    time_start = Time.now
    cleaner_logger.info('Cleaning started: ' + time_start.to_s)

    # Remove status
    begin
      # Remove old status
      hash_names = PermissionsInheritance.find_by_sql("SELECT child FROM permissions_inheritance WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH) AND clean = 1")
      hash_names.each do |hash|
        Permission.where(name: hash.child).delete_all
        PermissionsEntity.where(name: hash.child).delete_all
        PermissionsInheritance.where(child: hash.child).delete_all
      end
    rescue => e
      cleaner_logger.error("Cleaning failed. Reason: #{e.message}")
    end

    # Statistics
    cleaner_logger.info('Cleaning finished: ' + Time.now.to_s)
    cleaner_logger.info('Total clearing time: ' + (Time.now - time_start).to_s + 's')
  end


  private
    def self.cleaner_logger
      @@cleaner_logger ||= Logger.new("#{Rails.root}/log/cleaner_logger.log")
    end
end