import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Widget } from '../models/widget.model';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(
    private http: HttpClient
  ) { }

  public getWidget(id: number): Observable<Widget> {
    return this.http.get(`api/widget/${id}`).pipe(map(res => res as Widget));
  }

}
