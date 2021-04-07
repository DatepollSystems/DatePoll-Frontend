export class Permissions {
  public static ROOT_ADMINISTRATION = 'root.administration';

  public static CINEMA_MOVIE_ADMINISTRATION = 'cinema.*';

  public static EVENTS_ADMINISTRATION = 'events.*';
  public static EVENTS_VIEW_DETAILS = 'events.details';

  public static FILES_ADMINISTRATION = 'files.*';

  public static BROADCASTS_ADMINISTRATION = 'broadcasts.*';
  public static BROADCASTS_DELETE_EXTRA = 'broadcasts.delete';

  public static SEATRESERVATION_ADMINISTRATION = 'seatReservation.*';

  public static MANAGEMENT_ADMINISTRATION = 'management.*';
  public static MANAGEMENT_USER_VIEW = 'management.user.view';
  public static MANAGEMENT_EXTRA_USER_PERMISSIONS = 'management.user.permissions';
  public static MANAGEMENT_EXTRA_USER_DELETE = 'management.user.delete';

  public static SETTINGS_ADMINISTRATION = 'settings.*';

  public static SYSTEM_ADMINISTRATION = 'system.*';
  public static SYSTEM_JOBS_ADMINISTRATION = 'system.jobs.*';
  public static SYSTEM_LOGS_ADMINISTRATION = 'system.logs.*';

  public static getAll(): string[] {
    return [
      this.ROOT_ADMINISTRATION,
      this.CINEMA_MOVIE_ADMINISTRATION,
      this.EVENTS_ADMINISTRATION,
      this.EVENTS_VIEW_DETAILS,
      this.BROADCASTS_ADMINISTRATION,
      this.BROADCASTS_DELETE_EXTRA,
      this.SEATRESERVATION_ADMINISTRATION,
      this.MANAGEMENT_ADMINISTRATION,
      this.MANAGEMENT_USER_VIEW,
      this.MANAGEMENT_EXTRA_USER_DELETE,
      this.MANAGEMENT_EXTRA_USER_PERMISSIONS,
      this.SETTINGS_ADMINISTRATION,
      this.SYSTEM_ADMINISTRATION,
      this.SYSTEM_JOBS_ADMINISTRATION,
      this.SYSTEM_LOGS_ADMINISTRATION,
    ];
  }
}
