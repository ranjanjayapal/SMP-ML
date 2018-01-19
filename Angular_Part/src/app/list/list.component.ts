import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import {ServerService} from '../home/home.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  messages: any;
  company_names = [];
  stock_closing_price = [];
  stock_opening_price = [];
  stock_highest_price = [];
  stock_lowest_price = [];
  stock_volume = [];
  stock_intraday = [];
  stock_daily = [];
  stock_sector = [];
  stock_price_date = [];
  show_current_stock_closing_price = '';
  show_current_stock_opening_price = '';
  show_current_stock_highest_price = '';
  show_current_stock_lowest_price = '';
  show_current_stock_volume = '';
  show_current_stock_intraday = '';
  show_current_stock_daily = '';
  show_current_stock_sector = '';
  show_current_date = '';
  constructor(private data: ServerService) { }
  ngOnInit() {
    this.data.currentMessage.subscribe(message => {this.messages = message;
    for (let i of message){
      this.company_names.push(i['company_name']);
      this.stock_closing_price.push(i['closing_price']);
      this.stock_opening_price.push(i['opening_price']);
      this.stock_highest_price.push(i['high']);
      this.stock_lowest_price.push(i['low']);
      this.stock_volume.push(i['volume']);
      this.stock_intraday.push(i['intra_day_image']);
      this.stock_daily.push(i['daily_image']);
      this.stock_sector.push(i['sector_image']);
      // this.stock_price_date.push(i['date']);
    }});
    // this.company_names = message['company_name'];
    // this.stock_price = message['stock_price'];
  }
  show_stockprice(index) {
    this.show_current_stock_closing_price = this.stock_closing_price[index];
    this.show_current_stock_opening_price = this.stock_opening_price[index];
    this.show_current_stock_highest_price = this.stock_highest_price[index];
    this.show_current_stock_lowest_price = this.stock_lowest_price[index];
    this.show_current_stock_volume = this.stock_volume[index];
    this.show_current_stock_intraday = this.stock_intraday[index];
    this.show_current_stock_daily = this.stock_daily[index];
    this.show_current_stock_sector = this.stock_sector[index];
    // this.show_current_date = this.stock_price_date[index];
    console.log(this.show_current_stock_closing_price);
  }
}
