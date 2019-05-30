import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class WidgetService {

  constructor(
    private http: HttpClient
  ) { }

  public getWidget(id: number): Observable<any> {
    return this.http.get(`api/widget/${id}`);
  }

}
