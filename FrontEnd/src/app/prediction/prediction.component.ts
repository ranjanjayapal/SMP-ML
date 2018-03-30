import { Component, OnInit } from '@angular/core';
import {ServerService} from '../home/home.service';
import * as d31 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent implements OnInit {
  // public loading = true;
  public val = 0;
  companyName = '';
  closingValue = '';
  predictedValue = '';
  predictedYear = '';
  predictedGraph = '';
  graph = '';
  constructor(private data: ServerService) { }
  y_axis_ticks_line1 = [];
  y_axis_ticks_line2 = [];
  x_axis_ticks = [];
  arr_data_fig1 = [];
  data_object_fig1: any;
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
  ngOnInit() {
    this.data.prediction_message.subscribe(predictionMessage => {
      if (predictionMessage['CompanyName']) {
        // this.loading = false;
        this.val = 1;
      }
      this.companyName = predictionMessage['CompanyName'];
      this.closingValue = predictionMessage['ClosingPrice'];
      this.predictedValue = predictionMessage['predictedValue'];
      this.predictedYear = predictionMessage['yearPredicted'];
      this.graph = predictionMessage['predictionGraph'];
      // this.predictedGraph = predictionMessage['predictionGraph'];
      console.log('PredictedValue: ' + predictionMessage['predictedValue']);
      console.log('CompanyName: ' + predictionMessage['CompanyName']);
      console.log('ClosingPrice: ' + predictionMessage['ClosingPrice']);
      console.log(predictionMessage['predictionGraph']);
      // if (this.predictedValue !== '') {
      //   this.loading = false;
      // }
    } );
  }
  clear() {
    console.log('Inside Clear');
    this.data.changePredictionMessage('');
    // this.loading = true;
    this.val = 0;
    this.companyName = '';
    this.closingValue = '';
    this.predictedValue = '';
    this.predictedYear = '';
    this.graph = '';
  }
  showgraph() {
    this.prepare_fig1();
    this.initSvg_fig1();
    this.initAxis_fig1();
    this.drawAxis_fig1();
    this.drawLine_fig1();
  }
  private initSvg_fig1() {
    d3.selectAll("svg > *").remove();
    this.svg = d3.select("svg")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  }

  private prepare_fig1() {
    const json_string = JSON.stringify(this.graph);
    // console.log(json_string);
    const json_rep = JSON.parse(json_string);
    // console.log(json_rep.axes[0].axes[0].tickformat);
    // this.x_axis_ticks = json_rep.axes[0].axes[0].tickformat;
    console.log(json_rep.data.data01);
    for (let i = 0; i < json_rep.data.data01.length; i++) {
      this.x_axis_ticks[i] = json_rep.data.data01[i][0];
      this.y_axis_ticks_line1[i] = json_rep.data.data01[i][1];
      this.y_axis_ticks_line2[i] = json_rep.data.data01[i][2];
      // console.log(json_rep.data.data01[i][1]);
    }
    // const parseTime = d31.timeParse("%Y-%m-%d");
    console.log(this.y_axis_ticks_line1);
    console.log(this.y_axis_ticks_line2);
    console.log(this.x_axis_ticks);
    for (let i = 0; i < json_rep.data.data01.length; i++) {
      this.arr_data_fig1[i] = [this.x_axis_ticks[i], this.y_axis_ticks_line1[i], this.y_axis_ticks_line2[i]];
    }
    console.log(this.arr_data_fig1);
    this.data_object_fig1 = this.arr_data_fig1.map(function(d) {
      return {
        date: d[0],
        value1: d[1],
        value2: d[2]
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
      .y( (d: any) => this.y(d.value1) );

    this.line2 = d3Shape.line()
      .x( (d: any) => this.x(d.date) )
      .y( (d: any) => this.y(d.value2) );

    this.svg.append("path")
      .datum(this.data_object_fig1)
      .attr("class", "line")
      .attr("d", this.line)
      .attr("class", "line")
      .attr("d", this.line2);
  }
}
