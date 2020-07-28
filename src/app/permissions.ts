export class Permissions {
  public static getAll(): string[] {
    return [
      this.ROOT_ADMINISTRATION,
      this.PERMISSION_ADMINISTRATION,
      this.CINEMA_MOVIE_ADMINISTRATION,
      this.EVENTS_ADMINISTRATION,
      this.EVENTS_VIEW_DETAILS,
      this.BROADCASTS_ADMINISTRATION,
      this.FILES_ADMINISTRATION,
      this.MANAGEMENT_ADMINISTRATION,
      this.SETTINGS_ADMINISTRATION,
      this.SYSTEM_LOGS_ADMINISTRATION
    ];
  }

  public static ROOT_ADMINISTRATION = 'root.administration';

  public static PERMISSION_ADMINISTRATION = 'permission.*';

  public static CINEMA_MOVIE_ADMINISTRATION = 'cinema.*';

  public static EVENTS_ADMINISTRATION = 'events.*';
  public static EVENTS_VIEW_DETAILS = 'events.details';

  public static FILES_ADMINISTRATION = 'files.*';

  public static BROADCASTS_ADMINISTRATION = 'broadcasts.*';

  public static MANAGEMENT_ADMINISTRATION = 'management.*';

  public static SETTINGS_ADMINISTRATION = 'settings.*';

  public static SYSTEM_ADMINISTRATION = 'system.*';
  public static SYSTEM_JOBS_ADMINISTRATION = 'system.jobs.*';
  public static SYSTEM_LOGS_ADMINISTRATION = 'system.logs.*';
}
