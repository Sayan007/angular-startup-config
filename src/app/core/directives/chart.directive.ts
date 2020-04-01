import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import * as d3 from 'd3';
interface Config {
  height: number,
    width: number,
    top ? : number,
    right ? : number,
    bottom ? : number,
    left ? : number,
    innerRadius ? : number,
    length ? : number,
    transitionSpeed ? : number,
    lineOpacity ? : number,
    lineOpacityHover ? : number,
    lineStroke ? : string,
    lineStrokeHover ? : string,
    otherLinesOpacityHover ? : number,
    circleOpacity ? : number,
    circleOpacityOnLineHover ? : number,
    circleRadius ? : number,
    circleRadiusHover ? : number

}

@Directive({
  selector: '[charts]'
  /*,
    host: {
      '[style.div.toolTip.background-color]': '"yellow"',
    }*/
})
export class ChartDirective implements OnInit {
  /**
   * @param type            String          Type of chart 
   * @param config          Config Object   Chart configuration includes dimensions
   * @param data            Array           Chart data
   * @param color           Array           Chart color
   * @param fontcolor       String          Chart font color
   * @param fontsize        String          Chart font size
   * @param drillthrough    Boolean         Drillthrough is applicable or not
   * @param tooltip         Boolean         Want tooltip or not
   * @param tooltipstyle    Object          Tooltip css
   * @param label           Array           x-Axis labels array for data array
   * @param value           String          y-Axis for data array
   * @param displaylabel    Array           Display name array in tooltip for x-Axis
   * @param displayvalue    String          Display name in tooltip for y-Axis
   * @param showX           Boolean         Show X-Axis or not
   * @param showY           Boolean         show Y-Axis or not
   * @param onDrillthrough  EventEmitter    Sends data to parent component
   */
  @Input('type') type: string;
  @Input('config') config: Config;
  @Input('data') data: Array < any > = [];
  @Input('color') color: Array < string > = [];
  @Input('fontcolor') fontcolor: string;
  @Input('fontsize') fontsize: any;
  @Input('drillthrough') drillthrough: Boolean = false;
  @Input('tooltip') tooltip: Boolean = false;
  @Input('tooltipstyle') tooltipstyle: Boolean = false;
  @Input('label') label: Array < string > = [];
  @Input('value') value: Array < string > = [];
  @Input('displaylabel') displaylabel: Array < string > = [];
  @Input('displayvalue') displayvalue: Array < string > = [];
  @Input('showX') showX: Boolean = false;
  @Input('showY') showY: Boolean = false;
  @Input('numberOfDonut') numberOfDonut: number;
  @Input('space') space: number;
  @Input('name') name: string = '';
  @Input('donutSerialNo') donutSerialNo: any;
  @Input('totalValue') totalValue: number = 0;
  @Input('isError') isError: boolean = false;
  @Input('errorText') errorText: string = '';
  @Input('noDataText') noDataText: string = '';
  @Output() onDrillthrough = new EventEmitter();
  @Output() onRefreshed = new EventEmitter();
  _current: any;
  isIEOrEdge: boolean = false;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    switch (this.type) {
      case 'donut':
        if(this.totalValue == 0){
          this.disabledDonutChart(this.config);
        } else {
          this.donutChart(this.config);
        }
        break;
      default:
        throw new Error('Invalid chart type');
    }
  }

  /**
   * For Donut Chart
   */
  donutChart(config: Config) {
    const self = this;
    const color = d3.scaleOrdinal(this.color);
    
    if(this.numberOfDonut > 1){
      // console.log(this.donutSerialNo + ' - ' + this.el.nativeElement.parentNode.offsetWidth);
      let containerWidth = this.el.nativeElement.parentNode.offsetWidth;
      var totalSpace = (containerWidth * (this.space / 100)) - 50;
      let totalUsed = containerWidth * ((100 - this.space) / 100);
      let eachDonutDiameter = totalUsed / this.numberOfDonut;

      let containerHeight = this.el.nativeElement.parentNode.offsetHeight;
      var eachDonutMarginTop = ((containerHeight - eachDonutDiameter) / 5) + 15;
      var tooltip = this.toolTip();
      var width = eachDonutDiameter + 5, // - this.config.left - this.config.right,
        height = eachDonutDiameter + 5, // - this.config.top - this.config.bottom,
        radius = Math.min(width-10, height-10) / 2;
    } else {
      if(this.isIEOrEdge){
        var totalSpace = width;
        var tooltip = this.toolTip();

        var width = self.config.width-6, // - this.config.left - this.config.right,
          height = self.config.height-6, // - this.config.top - this.config.bottom,
          radius = Math.min(width-10, height-10) / 2;
      } else {
        var totalSpace = width;
        var tooltip = this.toolTip();

        var width = self.config.width, // - this.config.left - this.config.right,
          height = self.config.height, // - this.config.top - this.config.bottom,
          radius = Math.min(width-10, height-10) / 2;
      }
    }
    
    var svg = undefined;
    var svgLegend = undefined;
    if(this.donutSerialNo == 1){
      svgLegend = d3.select(this.el.nativeElement).append("svg")
        .attr("width", 50)
        .attr("height", height + 40)
        .attr("style", "margin-left:" + ((totalSpace / (this.numberOfDonut + 1))-25) + "px; margin-top: " + (eachDonutMarginTop - 5) + "px")
        // .style("margin-top", eachDonutMarginTop - 5)
        .append("g")
        .attr("transform", "translate(0," + height / 4 + ")");
      svgLegend.append("path")
        .attr("d", "M0 0, L10 0, L10 10, L0 10Z")
        .style("fill", this.color[0]);
      svgLegend.append("text")
        .attr("transform", "translate(15, 10)")
        .text("P1")
        .style('fill', this.fontcolor);
      svgLegend.append("path")
        .attr("d", "M0 20, L10 20, L10 30, L0 30Z")
        .style("fill", this.color[1]);
      svgLegend.append("text")
        .attr("transform", "translate(15, 30)")
        .text("P2")
        .style('fill', this.fontcolor);
      svgLegend.append("path")
        .attr("d", "M0 40, L10 40, L10 50, L0 50Z")
        .style("fill", this.color[2]);
      svgLegend.append("text")
        .attr("transform", "translate(15, 50)")
        .text("P3")
        .style('fill', this.fontcolor);
      svgLegend.append("path")
        .attr("d", "M0 60, L10 60, L10 70, L0 70Z")
        .style("fill", this.color[3]);
      svgLegend.append("text")
        .attr("transform", "translate(15, 70)")
        .text("P4")
        .style('fill', this.fontcolor);
      svg = d3.select(this.el.nativeElement).append("svg")
        .attr("width", width)
        .attr("height", height + 40)
        .attr("style", "margin-top: " + (eachDonutMarginTop - 5) + "px")
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + height / 2 + ")");
    } else {
      svg = d3.select(this.el.nativeElement).append("svg")
        .attr("width", width )
        .attr("height", height + 40)
        .attr("style", "margin-left:" + (totalSpace / (this.numberOfDonut + 1)) + "px; margin-top: " + (eachDonutMarginTop - 5) + "px")
        // .style("margin-top", eachDonutMarginTop - 5)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    }
         
    if(this.numberOfDonut == 1 && this.isIEOrEdge){
      var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius / 1.8);
    } else {
      var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius / 2);
    }
    

    var pie = d3.pie()
      .sort(null)
      .value(function (d) {
        return d["value"];
      });

    var wrap = function (text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    }

    var g = svg.selectAll(".arc")
      .data(pie(self.data))
      .enter().append("g")
      .attr('class', 'innerArc')
      .attr("id",(d) =>{
        return d.data[self.label[0]].replace(" ","").replace(",","") +self.donutSerialNo
      })
      .on("click", function (d) {
        // alert(d.data.count);
        tooltip.style("display", "none");
        if (self.drillthrough) {
          self.onDrillthrough.emit(d.data);
        }
      })
      .on("mousemove", function (d) {
        if (self.tooltip) {
          d3.select("#"+d.data[self.label[0]].replace(" ","").replace(",","") +self.donutSerialNo)
            .style("transform", "scale(1.1)")
            .style("-ms-transform", "scale(1.1)")
          tooltip.style("left", d3.event.pageX + 10 + "px");
          tooltip.style("top", d3.event.pageY - 25 + "px");
          tooltip.style("display", "block");
          if (self.displaylabel.length > 0) {
            tooltip.html(self.displaylabel[0] + ": " + (d.data[self.label[0]]) + "<br>" + self.displayvalue[0] + ": " + (d.data[self.value[0]]));
          } else {
            tooltip.html(self.label[0] + ": " + (d.data[self.label[0]]) + "<br>" + self.value[0] + ": " + (d.data[self.value[0]]));
          }
        }
      })
      .on("mouseout", function (d) {
        if (self.tooltip) {
          d3.select("#"+d.data[self.label[0]].replace(" ","").replace(",","") +self.donutSerialNo)
            .style("transform", "scale(1)")
          tooltip.style("display", "none");
        }
      })
      .style('cursor',(d) => {
        if(self.donutSerialNo > 4)
          return '';
        else
          return 'pointer';
      }).style("fill", "white");

    g.append("path").transition().delay(function (d, i) {
        return i * 100;
    })
    //@ts-ignore
    .attr("d", arc)
    .style("fill", (d, i) => {
      return color(i);
    });
    
    const fontcolor = this.fontcolor;
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.68em")
      .attr("x", 0)
      .attr("y", (d) => {
        if(self.numberOfDonut == 1) {
          if(self.isIEOrEdge){
            return 45;
          } else {
            return 55;
          }
        } else {
          return 68;
        }
      })
      .text(this.name)
      .style("font-size", (d)=>{
        if(self.numberOfDonut == 1){
          return "13px";
        } else {
          return "16px";
        }
      })
      .style("font-weight", (d) => {
        if(self.isIEOrEdge){
          return "normal";
        } else {
          return "bold";
        }
      })
      .style("fill", fontcolor)
      .call(wrap, width-20);

    if(this.donutSerialNo > 4){
      // console.log(this.donutSerialNo);
      svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0em")
      .attr("x", 0)
      .attr("y", (d) => {
        if(self.isIEOrEdge){
          return -15;
        } else {
          return -3;
        }
      })
      .text("Coming Soon")
      .style("font-size", "14px")
      .style("font-weight", (d) => {
        if(self.isIEOrEdge){
          return "normal";
        } else {
          return "bold";
        }
      })
      .style("fill", fontcolor)
      .call(wrap, radius / 1.5);
    }

    if(this.numberOfDonut == 1){
      svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0em")
        .attr("x", 0)
        .attr("y", 5)
        .text(this.totalValue)
        .style("font-size", "16px")
        .style("font-weight",(d) => {
          if(self.isIEOrEdge){
            return "normal";
          } else {
            return "bold";
          }
        })
        .style("fill", fontcolor)
        .call(wrap, radius / 1.5);
      // totalValue
    }

    /*if(this.donutSerialNo <= 4){
      svg.append("g")
        .attr("class", "lines");
      svg.select('.lines')
        .selectAll('polyline')
        .data(pie(self.data), (d)=>{
          return d.data.value;
        })
        .enter().append('polyline')
        .attr('points', function(d) {
          // see label transform function for explanations of these three lines.
          var pos = arc.centroid(d);
          pos[0] = radius * 0.95 * (self.midAngle(d) < Math.PI ? 1 : -1);
          return [arc.centroid(d), arc.centroid(d), pos]
        })
        .style('opacity', '0.3')
        .style('stroke', 'black')
        .style('stroke-width', '2px')
        .style('fill', 'none');
      svg.selectAll(".lines").data(pie(self.data))
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function(d){
          var pos = arc.centroid(d);
          pos[0] = radius * (self.midAngle(d) < Math.PI ? 1 : -1);
          return "translate("+ pos +")";
        })
        .text(function(d) {
          return d.data.value;
        });
    }*/
    

    // d3.select(this.el.nativeElement).append("svg")
    //   .attr("width", eachDonutDiameter)
    //   .attr("height", containerHeight - eachDonutDiameter - eachDonutMarginTop*2)
    //   .style("margin-left", totalSpace/(this.numberOfDonut+1)) 
    //   .append("text")
    //   // .attr("x", 0)
    //   .attr("y", 20)
    //   .text(this.name)
    //   .style("font-size",12)
    //   .style("font-weight","bold")
    //   .style("text-align", " center");



    /*g.append("text")
    	.attr("transform", function(d) {
        var _d = arc.centroid(d);
        _d[0] *= 0.75;	//multiply by a constant factor
        _d[1] *= 1.5;	//multiply by a constant factor
        return "translate(" + _d + ")";
      })
      .attr("dy", "-.10em")
      .style("text-anchor", "middle")
      .style("font-size", 8)
      .text(function(d) {
        if(d.data.value < 8) {
          return '';
        }
        return d.data.value;
      });*/
  }

  /**
   * For Disabled Donut Chart
   */
  disabledDonutChart(config: Config) {
    const self = this;
    const color = '#9D9375';
    self.data = [{'name': '','value':1}];

    if(this.numberOfDonut > 1){
      // console.log(this.donutSerialNo + ' - ' + this.el.nativeElement.parentNode.offsetWidth);
      let containerWidth = this.el.nativeElement.parentNode.offsetWidth;
      var totalSpace = (containerWidth * (this.space / 100)) - 50;
      let totalUsed = containerWidth * ((100 - this.space) / 100);
      let eachDonutDiameter = totalUsed / this.numberOfDonut;

      let containerHeight = this.el.nativeElement.parentNode.offsetHeight;
      var eachDonutMarginTop = ((containerHeight - eachDonutDiameter) / 5) + 15;
      var tooltip = this.toolTip();
      var width = eachDonutDiameter + 5, // - this.config.left - this.config.right,
        height = eachDonutDiameter + 5, // - this.config.top - this.config.bottom,
        radius = Math.min(width-10, height-10) / 2;
    } else {
      if(this.isIEOrEdge){
        var totalSpace = width;
        var tooltip = this.toolTip();

        var width = self.config.width-6, // - this.config.left - this.config.right,
          height = self.config.height-6, // - this.config.top - this.config.bottom,
          radius = Math.min(width-10, height-10) / 2;
      } else {
        var totalSpace = width;
        var tooltip = this.toolTip();

        var width = self.config.width, // - this.config.left - this.config.right,
          height = self.config.height, // - this.config.top - this.config.bottom,
          radius = Math.min(width-10, height-10) / 2;
      }
    }
    
    var svg = undefined;
    var svgLegend = undefined;
    if(this.donutSerialNo == 1){
      svgLegend = d3.select(this.el.nativeElement).append("svg")
        .attr("width", 50)
        .attr("height", height + 40)
        .attr("style", "margin-left:" + ((totalSpace / (this.numberOfDonut + 1))-25) + "px; margin-top: " + (eachDonutMarginTop - 5) + "px")
        // .style("margin-top", eachDonutMarginTop - 5)
        .append("g")
        .attr("transform", "translate(0," + height / 4 + ")");
      svgLegend.append("path")
        .attr("d", "M0 0, L10 0, L10 10, L0 10Z")
        .style("fill", this.color[0]);
      svgLegend.append("text")
        .attr("transform", "translate(15, 10)")
        .text("P1")
        .style('fill', this.fontcolor);
      svgLegend.append("path")
        .attr("d", "M0 20, L10 20, L10 30, L0 30Z")
        .style("fill", this.color[1]);
      svgLegend.append("text")
        .attr("transform", "translate(15, 30)")
        .text("P2")
        .style('fill', this.fontcolor);
      svgLegend.append("path")
        .attr("d", "M0 40, L10 40, L10 50, L0 50Z")
        .style("fill", this.color[2]);
      svgLegend.append("text")
        .attr("transform", "translate(15, 50)")
        .text("P3")
        .style('fill', this.fontcolor);
      svgLegend.append("path")
        .attr("d", "M0 60, L10 60, L10 70, L0 70Z")
        .style("fill", this.color[3]);
      svgLegend.append("text")
        .attr("transform", "translate(15, 70)")
        .text("P4")
        .style('fill', this.fontcolor);
      svg = d3.select(this.el.nativeElement).append("svg")
        .attr("width", width)
        .attr("height", height + 40)
        .attr("style", "margin-top: " + (eachDonutMarginTop - 5) + "px")
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + height / 2 + ")");
    } else {
      svg = d3.select(this.el.nativeElement).append("svg")
        .attr("width", width )
        .attr("height", height + 40)
        .attr("style", "margin-left:" + (totalSpace / (this.numberOfDonut + 1)) + "px; margin-top: " + (eachDonutMarginTop - 5) + "px")
        // .style("margin-top", eachDonutMarginTop - 5)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    }
         
    if(this.numberOfDonut == 1 && this.isIEOrEdge){
      var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius / 1.8);
    } else {
      var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius / 2);
    }
    
    // var svg = d3.select(this.el.nativeElement).append("svg")
    //   .attr("width", width )
    //   .attr("height", height + 40)
    //   .attr("style", "margin-left:" + (totalSpace / (this.numberOfDonut + 1)) + "px; margin-top: " + (eachDonutMarginTop - 5) + "px")
    //   // .style("margin-top", eachDonutMarginTop - 5)
    //   .append("g")
    //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      
    var arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius / 1.5);

    var pie = d3.pie()
      .sort(null)
      .value(function (d) {
        return d["value"];
      });

    var wrap = function (text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    }

    var g = svg.selectAll(".arc")
      .data(pie(self.data))
      .enter().append("g")
      .attr("id",(d) =>{
        return d.data[self.label[0]].replace(" ","").replace(",","") +self.donutSerialNo
      });
      

    g.append("path")
      //@ts-ignore
      .attr("d", arc)
      .style("fill", color);

    const fontcolor = this.fontcolor;
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.68em")
      .attr("x", 0)
      .attr("y", (d) => {
        if(self.numberOfDonut == 1) {
          if(self.isIEOrEdge){
            return 45;
          } else {
            return 55;
          }
        } else {
          return 68;
        }
      })
      .text(this.name)
      .style("font-size", (d)=>{
        if(self.numberOfDonut == 1){
          return "13px";
        } else {
          return "16px";
        }
      })
      .style("font-weight", (d) => {
        if(self.isIEOrEdge){
          return "normal";
        } else {
          return "bold";
        }
      })
      .style("fill", fontcolor)
      .call(wrap, width-20);
    if(this.isError){
      svg.append('text')
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", (d)=>{
          if(self.numberOfDonut == 1){
            return -7;
          } else {
            return -7;
          }
        })
        .attr("y", (d)=>{
          if(self.numberOfDonut == 1){
            if(self.isIEOrEdge){
              return -5;
            } else {
              return -7;
            }
          } else {
            return -5;
          }
        })
        .attr("class", "fa")
        .attr("fill", "#0091DA")
        .attr("font-size", '20px')
        .text("\uf071")
        .on("mousemove", (d)=>{
          tooltip.style("left", d3.event.pageX + 10 + "px");
          tooltip.style("top", d3.event.pageY - 25 + "px");
          tooltip.style("display", "block");
          tooltip.html(self.errorText);
        })
        .on("mouseout", (d) =>{
          tooltip.style("display", "none");
        })
        .style("cursor", "pointer");

      svg.append('text')
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", (d) => {
          if(self.numberOfDonut == 1){
            return -7;
          } else {
            return -6.5;
          }
        })
        .attr("y", (d) => {
          if(self.numberOfDonut == 1){
            return 15;
          } else {
            return 19;
          }
        })
        .attr("class", "fa")
        .attr("fill", "#0091DA")
        .attr("font-size", '20px')
        .text("\uf021")
        .on("mousemove", (d)=>{
          tooltip.style("left", d3.event.pageX + 10 + "px");
          tooltip.style("top", d3.event.pageY - 25 + "px");
          tooltip.style("display", "block");
          tooltip.html('Retry');
        })
        .on("mouseout", (d) =>{
          tooltip.style("display", "none");
        })
        .on("click", (d) =>{
          tooltip.style("display", "none");
          self.onRefreshed.emit(self.donutSerialNo);
        })
        .style("cursor", "pointer");

    } else {
      svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0em")
        .attr("x", 0)
        .attr("y", -5)
        .text(self.noDataText)
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", fontcolor)
        .call(wrap, radius / 1.5);
    }
    
  }

  midAngle(d) { 
    return d.startAngle + (d.endAngle - d.startAngle) / 2; 
  } 

  /**
   * ARC Tween fror Pie Chart
   */
  private arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => d3.arc()
      .innerRadius(0)
      .outerRadius(i(t));
  }

  /**
   * Tooltip
   */
  private toolTip() {
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    for (let key in this.tooltipstyle) {
      tooltip.style(key, this.tooltipstyle[key]);
    }
    return tooltip;
  }
}