import {Component, OnInit, Sanitizer, SecurityContext} from '@angular/core';
import {BrowserModule, DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript} from '@angular/platform-browser';
// import {DataService} from '../data.service';
import {ServerService} from '../home/home.service';
import * as d31 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public loading = false;
  clicked_company_name = '';
  clickedCompanyNameIndex;
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
  dataFrames = [];
  html_string = [];
  stock_price_date = [];
  show_current_stock_closing_price = '';
  show_current_stock_opening_price = '';
  show_current_stock_highest_price = '';
  show_current_stock_lowest_price = '';
  show_current_stock_volume = '';
  show_current_stock_intraday = '';
  show_current_stock_daily = '';
  show_current_stock_sector = '';
  dataFrame = '';
  show_current_date = '';
  dict_rep_fig1 = [];
  show_dict_rep_fig1 = '';
  dict_rep_fig2 = [];
  show_dict_rep_fig2 = '';
  dict_rep_fig3 = [];
  show_dict_rep_fig3 = '';
  y_axis_ticks_fig1 = [];
  x_axis_ticks_fig1 = [];
  arr_data_fig1 = [];
  data_object_fig1: any;
  y_axis_ticks_fig2 = [];
  x_axis_ticks_fig2 = [];
  arr_data_fig2 = [];
  data_object_fig2: any;
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private x2: any;
  private y: any;
  private y2: any;
  public svg: any;
  public dv: any;
  private line: d3Shape.Line<[number, number]>;
  private line2: d3Shape.Line<[number, number]>;
  constructor(private data: ServerService, private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.loading = true;
    this.data.currentMessage.subscribe(message => {this.messages = message;
    // this.showSpinner = false;
      for (let i of message){
        this.loading = false;
        this.company_names.push(i['company_name']);
        this.stock_closing_price.push(i['closing_price']);
        this.stock_opening_price.push(i['opening_price']);
        this.stock_highest_price.push(i['high']);
        this.stock_lowest_price.push(i['low']);
        this.stock_volume.push(i['volume']);
        this.stock_intraday.push(i['intra_day_image']);
        this.stock_daily.push(i['daily_image']);
        this.stock_sector.push(i['sector_image']);
        this.dict_rep_fig1.push(i['dict_rep']);
        this.dataFrames.push(i['dataFrame']);
        // this.dict_rep_fig2.push(i['dict_rep_fig2']);
        // this.dict_rep_fig3.push(i['dict_rep_fig3']);
        // this.stock_price_date.push(i['date']);
      }});
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }
  show_stockprice(index) {
    this.clicked_company_name = this.company_names[index];
    this.clickedCompanyNameIndex = index;
    this.show_current_stock_closing_price = this.stock_closing_price[index];
    this.show_current_stock_opening_price = this.stock_opening_price[index];
    this.show_current_stock_highest_price = this.stock_highest_price[index];
    this.show_current_stock_lowest_price = this.stock_lowest_price[index];
    this.show_current_stock_volume = this.stock_volume[index];
    this.show_current_stock_intraday = this.stock_intraday[index];
    this.show_current_stock_daily = this.stock_daily[index];
    this.show_current_stock_sector = this.stock_sector[index];
    // this.html_code = this.sanitizer.bypassSecurityTrustHtml(this.show_html_string);
    // this.show_current_date = this.stock_price_date[index];
    this.show_dict_rep_fig1 = this.dict_rep_fig1[index];
    // this.show_dict_rep_fig2 = this.dict_rep_fig2[index];
    // this.show_dict_rep_fig3 = this.dict_rep_fig3[index];
    // console.log(this.show_dict_rep);
    this.prepare_fig1();
    this.initSvg_fig1();
    this.initAxis_fig1();
    this.drawAxis_fig1();
    this.drawLine_fig1();
    // this.prepare_fig2();
    // this.initSvg_fig2();
    // this.initAxis_fig2();
    // this.drawAxis_fig2();
    // this.drawLine_fig2();
    // this.prepare_fig3();
    // this.initSvg_fig3();
    // this.initAxis_fig3();
    // this.drawAxis_fig3();
    // this.drawLine_fig3();
  }
  private initSvg_fig1() {
    d3.selectAll("svg > *").remove();
    this.svg = d3.select("svg")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private prepare_fig1() {
    const json_string = JSON.stringify(this.show_dict_rep_fig1);
    // console.log(json_string);
    const json_rep = JSON.parse(json_string);
    // console.log(json_rep.axes[0].axes[0].tickformat);
    this.x_axis_ticks_fig1 = json_rep.axes[0].axes[0].tickformat;
    // console.log(json_rep.data.data01);
    for (let i = 0; i < json_rep.data.data01.length; i++) {
      this.y_axis_ticks_fig1[i] = json_rep.data.data01[i][1];
      // console.log(json_rep.data.data01[i][1]);
    }
    const parseTime = d31.timeParse("%Y-%m-%d");
    console.log(this.y_axis_ticks_fig1);
    console.log(this.x_axis_ticks_fig1);
    for (let i = 0; i < json_rep.data.data01.length; i++) {
      this.arr_data_fig1[i] = [this.x_axis_ticks_fig1[i], this.y_axis_ticks_fig1[i]];
    }
    console.log(this.arr_data_fig1);
    this.data_object_fig1 = this.arr_data_fig1.map(function(d) {
      return {
        date: parseTime(d[0]),
        value: d[1]
      };
    });
  }
  private initAxis_fig1() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.data_object_fig1, (d: any) => d.date ));
    this.y.domain(d3Array.extent(this.data_object_fig1, (d: any) => d.value ));
  }

  private drawAxis_fig1() {

    this.svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x));

    this.svg.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");
  }

  private drawLine_fig1() {
    this.line = d3Shape.line()
      .x( (d: any) => this.x(d.date) )
      .y( (d: any) => this.y(d.value) );

    this.svg.append("path")
      .datum(this.data_object_fig1)
      .attr("class", "line")
      .attr("d", this.line);
  }

  private initSvg_fig2() {
    this.dv = d3.select("#qwerty")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private prepare_fig2() {
    const json_string = JSON.stringify(this.show_dict_rep_fig2);
    // console.log(json_string);
    const json_rep = JSON.parse(json_string);
    // console.log(json_rep.axes[0].axes[0].tickformat);
    // console.log(json_rep);
    this.x_axis_ticks_fig2 = json_rep.axes[0].axes[0].tickformat;
    // console.log(json_rep.data.data01);
    for (let i = 0; i < json_rep.data.data01.length; i++) {
      this.y_axis_ticks_fig2[i] = json_rep.data.data01[i][1];
      // console.log(json_rep.data.data01[i][1]);
    }
    const parseTime = d31.timeParse("%Y-%m-%d %H:%M:%S");
    console.log(this.y_axis_ticks_fig2);
    console.log(this.x_axis_ticks_fig2);
    for (let i = 0; i < json_rep.data.data01.length; i++) {
      this.arr_data_fig2[i] = [this.x_axis_ticks_fig2[i], this.y_axis_ticks_fig2[i]];
    }
    console.log(this.arr_data_fig2);
    this.data_object_fig2 = this.arr_data_fig2.map(function(d) {
      return {
        date: parseTime(d[0]),
        value: d[1]
      };
    });
    console.log(this.data_object_fig2);
  }
  private initAxis_fig2() {
    this.x2 = d3Scale.scaleTime().range([0, this.width]);
    this.y2 = d3Scale.scaleLinear().range([this.height, 0]);
    this.x2.domain(d3Array.extent(this.data_object_fig2, (d: any) => d.date ));
    this.y2.domain(d3Array.extent(this.data_object_fig2, (d: any) => d.value ));
  }

  private drawAxis_fig2() {

    this.dv.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x2));

    this.dv.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y2))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");
  }

  private drawLine_fig2() {
    this.line2 = d3Shape.line()
      .x( (d: any) => this.x2(d.date) )
      .y( (d: any) => this.y2(d.value) );

    this.dv.append("path")
      .datum(this.data_object_fig2)
      .attr("class", "line")
      .attr("d", this.line2);
  }
  pass_data_prediction() {
    this.data.predictionServers(this.dataFrames[this.clickedCompanyNameIndex]).subscribe(
      (response) => { console.log(response.json());
      const jsonResult = response.json();
      jsonResult['CompanyName'] = this.clicked_company_name;
      jsonResult['ClosingPrice'] = this.show_current_stock_closing_price;
      this.data.changePredictionMessage(jsonResult);
      },
      (error) => console.log(error)
      );
  }
}
