
      /* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */
      
			////////////////////////////////////////////////////////////// 
			//////////////////////// Set-Up ////////////////////////////// 
			////////////////////////////////////////////////////////////// 

			var margin = {top: 20, right: 20, bottom: 20, left: 20},
				width = Math.min(1200, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(600, window.innerHeight - margin.top - margin.bottom - 20);
					
			////////////////////////////////////////////////////////////// 
			////////////////////////// Data ////////////////////////////// 
			////////////////////////////////////////////////////////////// 

			var data = [
					  [//USA
						{axis:"Manpower",value:0.20},
						{axis:"Air Power",value:0.99},
						{axis:"Army Strength",value:0.29},
						{axis:"Navy Strength",value:0.42},
						{axis:"Natural Resources",value:0.12},
						{axis:"Logistics",value:0.8},
						{axis:"Finance",value:0.99},
						{axis:"Geography",value:0.57}			
					  ],[//China
						{axis:"Manpower",value:0.99},
						{axis:"Air Power",value:0.21},
						{axis:"Army Strength",value:0.29},
						{axis:"Navy Strength",value:0.73},
						{axis:"Natural Resources",value:0.08},
						{axis:"Logistics",value:0.5},
						{axis:"Finance",value:0.28},
						{axis:"Geography",value:0.56}
					  ]
					];
			////////////////////////////////////////////////////////////// 
			//////////////////// Draw the Chart ////////////////////////// 
			////////////////////////////////////////////////////////////// 

			var color = d3.scaleOrdinal()
				.range(["#319ef7","#CC333F"]);
				
			var radarChartOptions = {
			  w: width,
			  h: height,
			  margin: margin,
			  maxValue: 0.5,
			  levels: 5,
			  roundStrokes: true,
			  color: color,
                	legend: { title: 'Countries', translateX: 10, btranslateY: 50 },
			};
			//Call function to draw the Radar chart
			RadarChart(".radarChart", data, radarChartOptions);
           // d3.selectAll(".legend").style("font-size", "16px");
            
            
            d3.selectAll(".legend").filter(function(d){
                return d == "Manpower"})
                .on("mouseover", function(d) { 
                d3.select(this)
                    .transition()
                    .style("font-size", "22px")
                    .style("fill", "#ff9900");
                noteshow("Man power: Military personnel drives a given military force, wars favor this manpower to give effort.");
        
      })
      .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .style("font-size", "18px")
                    .style("fill", "#242424");
                notenone();
         
      })
    .on("click", function(d) { resize(d); 
                              popbar(d);}) ;



d3.selectAll(".legend").filter(function(d){
                return d == "Finance"})
     .on("mouseover", function(d) { 
                d3.select(this)
                    .transition()
                    .style("font-size", "22px")
                    .style("fill", "#ff9900");
                noteshow("Finance: Wars rely heavily on financing effort as any one piece of hardware fielded.");
        
      })
      .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .style("font-size", "18px")
                    .style("fill", "#242424");
                notenone();
         
      })
    .on("click", function(d) { resize(d); 
                              finbar(d);});


d3.selectAll(".sliderbar").style("display","none");


function noteshow(text){
    var note= d3.select("svg").append("g")
    .attr("class","note");
    note.append("text")
        .text(text)
        .attr("x",850).attr("y", 450).attr("dy", "0.35em")
        .call(wrap, 350)
    ;
}

function notenone(){d3.selectAll(".note").transition()
               .duration(400)
               .style("opacity", 0)
                .on("end",function(){d3.selectAll(".note").remove()});}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}

    function finbar(){
        d3.select(".chartzone").remove();
        d3.selectAll(".sliderbar").style("display","none");
    d3.selectAll("#sliderFin").style("display","block");
        var svg = d3.select("svg"),
    margin = {top:60, right: 20, bottom: 60, left: 40},
    width = 650 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

//define scales
var x = d3.scaleLinear().rangeRound([0, width]),
    y = d3.scaleBand().rangeRound([150, 0]).padding(0.2),
    z = d3.scaleOrdinal()
    .range(["#319ef7","#CC333F"]);
    
var stack = d3.stack();
    var chartzone = d3.select("svg").append("g").attr("class","chartzone") ; 
    
var chart1 = d3.select(".chartzone")
.append("g")
.attr("class","chart1")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltipFin= d3.select("body").append("div")
    .attr("class", "tooltipFin")
    .style("opacity", 0);
    
var tooltipFin2 = d3.select("body").append("div")
    .attr("class", "tooltipFin2")
    .style("opacity", 0);
    
var on_count_change;
var on_kind_change;
    

	//load data
d3.csv("budgetRatio.csv",function (error, data) {
		if(error) throw error;
        var data_nest = d3.nest()
                      .key(function(d){
                          return d.Slider
                      })
                      .entries(data);

    data = data_nest.filter(function(d){ return d.key == 0})[0].values;
    
    var cat = ["ratio"];

	//define domains based on data
	x.domain([0, 0.1]);
	y.domain(data.map(function(d) { return d.country; }));
    z.domain(data.map(function(d) { return d.country; })); 
        
  

    chart1.append("g")
      .attr("class", "axis--x")
	  .attr("transform", "translate(0,"+height+")")				// New line
      .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("y", 2)												//     .attr("y", 2)
      .attr("x", x(x.ticks().pop()) + 0.5)						//     .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
	  .attr("transform", "translate("+ (-width) +",-10)"); // Newline
        
    chart1.append("g")
      .attr("class", "axis--y")
      .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x)

       
	//append rects to svg based on data
	chart1.selectAll(".bar")
		.data(stack.keys(cat)(data))
      .enter().append("g")
		.attr("class", "bar")
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
		.attr("y", function(d) { return y(d.data.country); })
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]);})
        .attr("height", y.bandwidth())
    .attr("fill", function(d) {return z(d.data.country); })
        .attr("fill-opacity",0.7)
      .on("mouseover", function(d) {
          tooltipFin.transition()
               .duration(200)
               .style("opacity", .9);
          tooltipFin.html(d.data.country + ":" + "<br/>" +d.data.ratio + "%" )
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltipFin.transition()
               .duration(500)
               .style("opacity", 0);
      });
        
        
    on_count_change = function changing(this_){
        var value = this_.value;
            
        chart1.selectAll(".bar")
		.data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
		.selectAll("rect")
        .data(function(d){return d;})
        .transition()
        .duration(500)
		.attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("y", function(d) { return y(d.data.country); })
        .attr("x", function(d) { return x(d[0]); });
            
        };
    
    });
        


	//define chart title to svg
var title = chart1.append("g")
		.attr("class", "title");
	title.append("text")
		.attr("x", (width/1.9))
			 .attr("y", 0)
			.attr("text-anchor", "middle")
			.style("font-size", "18px")
			.text("Defense budget accounts for GDP");

var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 650 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
    
var chart2 = d3.select(".chartzone").append("g").attr("class","chart2")
.attr("transform", "translate(" + margin.left + "," + (margin.top+300) + ")");

var y2 = d3.scaleBand()			// x = d3.scaleBand()	
    .rangeRound([0, height])	// .rangeRound([0, width])
    .padding(0.2);

var x2 = d3.scaleLinear()		// y = d3.scaleLinear()
    .rangeRound([0, width]);	// .rangeRound([height, 0]);

var z2 = d3.scaleOrdinal()
    .range(["#319ef7","#CC333F"]);

  var stack = d3.stack();

  d3.csv("budget.csv", function(error, data) {
    if (error) throw error;

    var data_nest = d3.nest()
                      .key(function(d){
                          return d.Slider
                      })
                      .entries(data);

    data = data_nest.filter(function(d){ return d.key == 0})[0].values;
    
    var cat = ["US","China"];

    y2.domain(data.map(function(d) { return d.kind; }));
    x2.domain([0, 30000]).nice();
    z2.domain(cat); 

    chart2.selectAll(".serie")
      .data(stack.keys(cat)(data))
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) {return z2(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("y", function(d) { return y2(d.data.kind); })
        .attr("x", function(d) { return x2(d[0]); })
        .attr("width", function(d) { return x2(d[1]) - x2(d[0]); })
        .attr("height", y2.bandwidth())
        .attr("fill-opacity",0.7)
      
      .on("mouseover", function(d) {
          tooltipFin2.transition()
               .duration(200)
               .style("opacity", .9);
          tooltipFin2.html(d.data.kind + "<br/>" + "US:" + d.data.US + " billion dollors" + "<br/>" + "China:" +d.data.China + " billion dollors" )
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltipFin2.transition()
               .duration(500)
               .style("opacity", 0);
    });

 chart2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(y2)).selectAll(".tick text").call(wrap, 40);									//   .call(d3.axisBottom(x));

  chart2.append("g")
      .attr("class", "axis")
	  .attr("transform", "translate(0,"+height+")")				// New line
      .call(d3.axisBottom(x2).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("y", 2)												//     .attr("y", 2)
      .attr("x", x(x.ticks().pop()) + 0.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
	  .attr("transform", "translate("+ (-width) +",-10)");   	// Newline
    

    d3.select("#sliderFin")
        .on("change", function () {on_count_change(this); on_kind_change(this);})
        .on("input", function () {on_count_change(this); on_kind_change(this);});

    on_kind_change = function changed(this_) {
      var value = this_.value;

      chart2.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .duration(500) 
        .delay(function(d,i){return i*100})     
        .attr("width", function(d) { return x2(d[1]) - x2(d[0]);})
        .attr("y", function(d) { return y2(d.data.kind); })
        .attr("x", function(d) { return x2(d[0]); })
  }
    
    var title = chart2.append("g")
		.attr("class", "title");
	title.append("text")
		.attr("x", (width/1.9))
			 .attr("y", 0)
			.attr("text-anchor", "middle")
			.style("font-size", "18px")
			.text("Defense budget and GDP of US and China");
    
  });
    
 var myData = ['2011', '2013', '2014', '2015', '2017'];

var linearScale = d3.scaleLinear()
	.domain([0, 4])
	.range([0, 600]);

var timeline = d3.select('.chartzone').append('g').attr("class","timeline").attr("transform", "translate(25,570)");
      
	d3.select(".timeline").selectAll('text')
	.data(myData)
	.enter()
	.append('text')
	.attr('x', function(d, i) {
		return linearScale(i);
	})
	.text(function(d) {
		return d;
	})
	.style('fill', "black")
    .style("font-size", "14px");
    
                     
                     }


            function resize(){ 
                d3.selectAll(".gelement").transition().duration(1000)
                .attr("transform","translate(1000, 240)scale(0.7)");
                sp= d3.selectAll("svg").append("rect")
                    .attr("x", 790)
                    .attr("y", 50)
                    .attr("width", 1)
                    .attr("height", 0)
                    .style("fill", "#242424").style("fill-opacity",0.5);
                sp.transition().duration(1000).delay(500).attr("height",500);
                
            }

function popbar(){
   d3.select(".chartzone").remove(); 
     d3.selectAll(".sliderbar").style("display","none");
    d3.selectAll("#sliderPOP").style("display","block");
    var svg = d3.select("svg"),
    margin = {top:60, right: 20, bottom: 60, left: 40},
    width = 650 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

//define scales
var x = d3.scaleLinear().rangeRound([0, width]),
    y = d3.scaleBand().rangeRound([150, 0]).padding(0.2),
    z = d3.scaleOrdinal()
    .range(["#319ef7","#CC333F"]);
    
var stack = d3.stack();
var chartzone = d3.select("svg").append("g").attr("class","chartzone") ;   
var chart1 = d3.select(".chartzone")
.append("g")
.attr("class","chart1")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltipPOP = d3.select("body").append("div")
    .attr("class", "tooltipPOP")
    .style("opacity", 0);
    
var tooltip2 = d3.select("body").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0);
    
var on_count_change;
var on_kind_change;
    

	//load data
d3.csv("totalPersonnel.csv",function (error, data) {
		if(error) throw error;
        var data_nest = d3.nest()
                      .key(function(d){
                          return d.Slider
                      })
                      .entries(data);

    data = data_nest.filter(function(d){ return d.key == 0})[0].values;
    
    var cat = ["number"];

	//define domains based on data
	x.domain([0, 3000]);
	y.domain(data.map(function(d) { return d.country; }));
    z.domain(data.map(function(d) { return d.country; })); 
        
  

    chart1.append("g")
      .attr("class", "axis--x")
	  .attr("transform", "translate(0,"+height+")")				// New line
      .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("y", 2)												//     .attr("y", 2)
      .attr("x", x(x.ticks().pop()) + 0.5)						//     .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
	  .attr("transform", "translate("+ (-width) +",-10)"); // Newline
        
    chart1.append("g")
      .attr("class", "axis--y")
      .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x)

       
	//append rects to svg based on data
	chart1.selectAll(".bar")
		.data(stack.keys(cat)(data))
      .enter().append("g")
		.attr("class", "bar")
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
		.attr("y", function(d) { return y(d.data.country); })
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]);})
        .attr("height", y.bandwidth())
    .attr("fill", function(d) {return z(d.data.country); })
        .attr("fill-opacity",0.7)
      .on("mouseover", function(d) {
          tooltipPOP.transition()
               .duration(200)
               .style("opacity", .9);
          tooltipPOP.html(d.data.country + ":" + "<br/>" +d.data.number + "K")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltipPOP.transition()
               .duration(500)
               .style("opacity", 0);
      });
        
        
    on_count_change = function changing(this_){
        var value = this_.value;
            
        chart1.selectAll(".bar")
		.data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
		.selectAll("rect")
        .data(function(d){return d;})
        .transition()
        .duration(500)
		.attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("y", function(d) { return y(d.data.country); })
        .attr("x", function(d) { return x(d[0]); });
            
        };
    
    });
        


	//define chart title to svg
var title = chart1.append("g")
		.attr("class", "title");
	title.append("text")
		.attr("x", (width/1.9))
			 .attr("y", 0)
			.attr("text-anchor", "middle")
			.style("font-size", "18px")
			.text("Active Personnel of China and U.S.");

var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 650 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
    
var chart2 = d3.select(".chartzone").append("g").attr("class","chart2")
.attr("transform", "translate(" + margin.left + "," + (margin.top+300) + ")");

var y2 = d3.scaleBand()			// x = d3.scaleBand()	
    .rangeRound([0, height])	// .rangeRound([0, width])
    .padding(0.2);

var x2 = d3.scaleLinear()		// y = d3.scaleLinear()
    .rangeRound([0, width]);	// .rangeRound([height, 0]);

var z2 = d3.scaleOrdinal()
    .range(["#319ef7","#CC333F"]);

  var stack = d3.stack();

  d3.csv("detailedPersonnel17.csv", function(error, data) {
    if (error) throw error;

    var data_nest = d3.nest()
                      .key(function(d){
                          return d.Slider
                      })
                      .entries(data);

    data = data_nest.filter(function(d){ return d.key == 0})[0].values;
    
    var cat = ["US","China"];

    y2.domain(data.map(function(d) { return d.kind; }));
    x2.domain([0, 2400]).nice();
    z2.domain(cat); 

    chart2.selectAll(".serie")
      .data(stack.keys(cat)(data))
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) {return z2(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("y", function(d) { return y2(d.data.kind); })
        .attr("x", function(d) { return x2(d[0]); })
        .attr("width", function(d) { return x2(d[1]) - x2(d[0]); })
        .attr("height", y2.bandwidth())
        .attr("fill-opacity",0.7)
      
      .on("mouseover", function(d) {
          tooltip2.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip2.html(d.data.kind + "<br/>" + "US:" + d.data.US + " K" + "<br/>" + "China:" +d.data.China + " K" )
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip2.transition()
               .duration(500)
               .style("opacity", 0);
    });

 chart2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(y2));									//   .call(d3.axisBottom(x));

  chart2.append("g")
      .attr("class", "axis")
	  .attr("transform", "translate(0,"+height+")")				// New line
      .call(d3.axisBottom(x2).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("y", 2)												//     .attr("y", 2)
      .attr("x", x(x.ticks().pop()) + 0.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
      .attr("fill", "#000")
      .style("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
	  .attr("transform", "translate("+ (-width) +",-10)");   	// Newline
    

    d3.select("#sliderPOP")
        .on("change", function () {on_count_change(this); on_kind_change(this);})
        .on("input", function () {on_count_change(this); on_kind_change(this);});

    on_kind_change = function changed(this_) {
      var value = this_.value;

      chart2.selectAll(".serie")
        .data(stack.keys(cat)(data_nest.filter(function(d){return +d.key == value})[0].values))
        .selectAll("rect")
        .data(function(d) { return d; })
        .transition()
        .duration(500) 
        .delay(function(d,i){return i*100})     
        .attr("width", function(d) { return x2(d[1]) - x2(d[0]);})
        .attr("y", function(d) { return y2(d.data.kind); })
        .attr("x", function(d) { return x2(d[0]); })
  }
    
    var title = chart2.append("g")
		.attr("class", "title");
	title.append("text")
		.attr("x", (width/1.9))
			 .attr("y", 0)
			.attr("text-anchor", "middle")
			.style("font-size", "18px")
			.text("Specific Personnel of China and U.S.");
    
  });
    
     var myData = ['2011', '2013', '2014', '2015', '2017'];

var linearScale = d3.scaleLinear()
	.domain([0, 4])
	.range([0, 600]);

var timeline = d3.select('.chartzone').append('g').attr("class","timeline").attr("transform", "translate(25,580)");
      
	d3.select(".timeline").selectAll('text')
	.data(myData)
	.enter()
	.append('text')
	.attr('x', function(d, i) {
		return linearScale(i);
	})
	.text(function(d) {
		return d;
	})
	.style('fill', "black")
    .style("font-size", "14px");
 }