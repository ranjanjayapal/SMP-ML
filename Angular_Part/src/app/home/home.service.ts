import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class ServerService {
  constructor (private http: Http) {}

  private messageSource = new BehaviorSubject<any>({});
  currentMessage = this.messageSource.asObservable();
  changeMessage(message: any) {
    this.messageSource.next(message);
  }
  storeServers(servers: any) {
    return this.http.post('http://127.0.0.1:8000/webapp/', servers);
  }
}
