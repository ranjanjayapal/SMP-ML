import { Component, OnInit } from '@angular/core';
import {ServerService} from '../home/home.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {

  companyName = '';
  closingValue = '';
  predictedValue = '';
  constructor(private data: ServerService) { }

  ngOnInit() {
    this.data.prediction_message.subscribe(predictionMessage => {
      this.companyName = predictionMessage['CompanyName'];
      this.closingValue = predictionMessage['ClosingPrice'];
      this.predictedValue = predictionMessage['predictedValue'];
      console.log('PredictedValue: ' + predictionMessage['predictedValue']);
      console.log('CompanyName: ' + predictionMessage['CompanyName']);
      console.log('ClosingPrice: ' + predictionMessage['ClosingPrice']);
    } );
  }

}
