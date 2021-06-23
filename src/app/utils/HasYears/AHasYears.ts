import {Subject} from 'rxjs';
import {HttpService} from '../http.service';

export abstract class AHasYears {
  protected _lastUsedYear: number;
  private _years: string[] = [];
  public yearsChange: Subject<string[]> = new Subject<string[]>();

  private _yearsUrl: string = null;

  protected constructor(protected httpService: HttpService, yearsUrl: string) {
    this._yearsUrl = yearsUrl;
  }

  public getYears(): string[] {
    this.fetchYears();
    return this._years.slice();
  }

  public setYears(years: string[]) {
    this._years = years;
    this.yearsChange.next(this._years.slice());
  }

  private fetchYears() {
    this.httpService.loggedInV1GETRequest(this._yearsUrl).subscribe(
      (response: any) => {
        console.log(response);
        const years = [];
        for (const year of response.years) {
          years.push(year.toString());
        }
        this.setYears(years);
      },
      (error) => console.log(error)
    );
  }
}
