import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class ServerService {
  constructor (private http: Http) {}

  private messageSource = new BehaviorSubject<any>({});
  private prediction_Server_Source = new BehaviorSubject<any>({});
  currentMessage = this.messageSource.asObservable();
  prediction_message = this.prediction_Server_Source.asObservable();
  changeMessage(message: any) {
    this.messageSource.next(message);
  }
  changePredictionMessage(prediction: any) {
    this.prediction_Server_Source.next(prediction);
  }
  storeServers(servers: any) {
    return this.http.post('http://127.0.0.1:8000/webapp/', servers);
  }
  predictionServers(prediction: any) {
    return this.http.post('http://127.0.0.1:8000/predictionapp/', prediction);
  }
}
