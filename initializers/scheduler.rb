if Rails.env.production?
  require 'rufus-scheduler'

  scheduler = Rufus::Scheduler.new lockfile: '.rufus-scheduler.lock'

  unless scheduler.down?
    scheduler.every '5m' do
      Cleaner.clean
    end

    # Send payments for paid events 12:00 pm
    scheduler.cron '00 12 * * *' do
      Rails.logger.info "#{Time.now.utc.to_s(:db)} AutoGift(12:00) started by scheduler. Scheduler #{scheduler.object_id}"
      GiftSender.send
    end

    # Midnight 00:00
    scheduler.cron '00 00 * * *' do
      Rails.logger.info "#{Time.now.utc.to_s(:db)} AutoGift(00:00) started by scheduler. Scheduler #{scheduler.object_id}"
      GiftSender.send
    end
  end
end
