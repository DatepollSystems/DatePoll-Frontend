export class ServerInfoModel {
  public version = '';
  public version_number = 1;
  public application_url = '';

  public community_name = '';
  public community_url = '';
  public community_description = '';
  public community_imprint = '';
  public community_privacy_policy = '';

  public broadcasts_enabled = false;
  public broadcasts_process_incoming_mails_enabled = false;
  public broadcasts_process_incoming_mails_forwarding_enabled = false;
  public broadcasts_count = 1;
  public broadcasts_sent_count = 1;

  public events_enabled = false;
  public events_count = 1;
  public event_votes_count = 1;
  public event_decisions_count = 1;
  public event_dates_count = 1;

  public cinema_enabled = false;
  public movies_count = 1;
  public movies_tickets_count = 1;
  public movies_workers_count = 1;

  public users_count = 1;
  public user_email_addresses_count = 1;
  public user_phone_numbers_count = 1;

  public performance_badges_count = 1;
}
