import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISystemSettings } from '../../interfaces/ISystemSettings';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {

  private getUrl = environment.baseUrl + 'api/v1/web/system-settings/get-system-settings';
  private updateUrl = environment.baseUrl + 'api/v1/web/system-settings/update-system-settings';

  constructor(private http: HttpClient) { }

  getSystemSettings(): Observable<any> {
    return this.http.get<any>(this.getUrl);
  }

  updateSystemSettings(payload: ISystemSettings): Observable<any> {
    return this.http.put<any>(this.updateUrl, payload);
  }
}
