const update=function(data){
    var margin = {top: 80, right: 50, bottom: 90, left: 150};
var width = 1300 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

// Create svg object
var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);



var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

// draw line callback function using d3.line helper passing in x and y coordinates
var line = d3.line()
  .x(d => xScale(d.time))
  .y(d => yScale(d.speed))
  



// Set the x and y scales to the data ranges x based on min and max date range (d3.extent()) and y based on 0 to max value
xScale.domain(d3.extent(data, d => d.time));
yScale.domain(d3.extent(data, d => d.speed));

// Draw the line svg by appending the data to a new svg path giving a class of line and d value based on the d3.line callback
svg.append('path')
  .data([data])
  .attr('class', 'line')
  .attr('d', line)

  

  

// Add the axis 
var xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.timeFormat('%d-%b'))
  

svg.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(xAxis);

svg.append('g')
  .call(d3.axisLeft(yScale));


    
  svg.append('text')
  .attr('x', 400)
  .attr('y', 490)
  .attr('text-anchor', 'middle')
  .text('Time Period')
  .attr("font-weight", "bold") 
  .attr("font-size","1.2em")

  svg.append('text')
  .attr('x', -60)
  .attr('y', 250)
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90 -60 250)')
  .text('Speed')
  .attr("font-weight", "bold") 
  .attr("font-size","1.2em")

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
  
  
  const formatTime = d3.timeFormat('%e-%b-%Y    %H:%M');

var formatSpeed=d3.format('.3r')


var formatDir=d3.format('.5r')
 /*tooltip.append("rect")
    .attr("width", 200)
    .attr("height", 20)
    .attr("fill", "orange")
    .style("opacity", 1)
    .style("allign", "center")*/
  
  






  svg.selectAll("image")
  .data(data)
  .enter()
  .append("image")
    .attr('xlink:href', '01north_arrow.svg')
    .attr('width', 20)
    .attr('height', 20)
    .attr("transform", function(d){ return "rotate("+ d.dir+"," + xScale(d.time) + "," + yScale(d.speed) + ")"})
    .attr("x", function(d) { return xScale(d.time)-10 })
    .attr("y", function(d) { return yScale(d.speed)-10 })
    .on("mouseover", function(d) {		
        div.transition()		
            .duration(200)		
            .style("opacity", .8);		
         div.html('<table><tr>'+ formatTime(d.time)+'</tr><tr ><th style=\'border: 1px solid white;padding: 2px 2px;\'>Speed :</th><td style=\'border: 1px solid white;padding: 2px 2px;\'>'+formatSpeed(d.speed)+ '  '+'m/s'+'</td></tr> <tr><th style=\'border: 1px solid white;padding: 2px 2px;\'>Direction :</th><td style=\'border: 1px solid white;padding: 2px 2px;\'>'+formatDir(d.dir) + '  '+'degree'+'</td></tr>  ')
         .style("left", (d3.event.pageX) + "px")		
         .style("top", (d3.event.pageY - 28) + "px");	
        })					
    .on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
    });
   
    

  


  svg.selectAll("myCircles")
  .data(data)
  .enter()
  .append("circle")
    .attr("fill", "red")
    .attr("stroke", "none")
    .attr("cx", function(d) { return xScale(d.time) })
    .attr("cy", function(d) { return yScale(d.speed) })
    .attr("r", 3);




    

  

}
    


  





d3.json("current.json").then(function(data) {
    var output = [];
    var objTime;
    $.each(data,function(time, value){
        objTime ={
            "time": time,
            "speed" : value[0],
            "dir" : value[1]
        };
        output.push(objTime);
    });
    output.forEach(function(d){ 
        d.time = new Date(d.time * 1000)
        
        
    });
    update(output)
    console.log(output);

})