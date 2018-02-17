import { Component, OnInit } from '@angular/core';
import {ServerService} from './home.service';
import * as d3 from 'd3';
import {any} from 'codelyzer/util/function';
// import {DataService} from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private serverService: ServerService) { }
  investment_limit = '';
  message: any;
  disable_button = false;
  // let company_names = '';
  ngOnInit() {
    this.serverService.currentMessage.subscribe(message => {this.message = message;
      console.log(message); });
    this.createChart();
  }
  createChart() {
    d3.select('p').style('color', 'red');
  }
  onSave() {
    this.serverService.storeServers(this.investment_limit).subscribe(
      (response) => {console.log(response.json());
        // const company_names = response.json()['company_name'];
        this.serverService.changeMessage(response.json());
      },
      (error) => console.log(error)
    );
  }
}
