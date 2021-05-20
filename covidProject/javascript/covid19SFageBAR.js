//selects the body of the html and appends svg with certain width and height
let svg = d3.select("body").append("svg")
	.attr("width", 1440)
	.attr("height", 750);

//store the width and height for later
let width = +svg.attr("width");
let height = +svg.attr("height");

//render the data
function render(data) {

	let xVal = d => d.cumulativeCases; //gets the cumulative cases
	let yVal = d => d.ageGroup; //gets the race

	//set the margins
	let margin = {
		top: 100,
		right: 100,
		bottom: 100,
		left: 200
	};

	let innerWidth = width - margin.left - margin.right; //these get the width and height of the inner actual chart
	let innerHeight = height - margin.top - margin.bottom;

	let scaleX = d3.scaleLinear() //sets up how bars will scale
		.domain([0, d3.max(data, xVal)]).nice()
		.range([0, innerWidth]); //the pixel space

	let xAxis = d3.axisBottom(scaleX) //the bottom axis is connected to the scaleX now
		.tickSize(-innerHeight);

	let scaleY = d3.scaleBand() //sets up how the races appear, spaced out
		.domain(data.map(yVal))
		.range([0, innerHeight])
		.padding(0.25);

	let yAxis = d3.axisLeft(scaleY); //left axis is connected to the scaleY now

	let g = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`); //moves the chart out into clear space

	g.append("g") //adds a grouping of the race names
		.call(yAxis)
		.attr("font-size", 20); //size of major labels
	
	let xG = g.append("g") //adds another axis grouping for the x axis, sets up labels and ticks
		.call(xAxis)
		.attr("transform", `translate(0, ${innerHeight})`) //moves the number labels to bottom
		.attr("font-size", 20);

	xG.append("text") //add the x axis name below x axis
		.attr("font-size", 24)
		.attr("fill", "black")
		.text("Cumulative Number of Cases")
		.attr("y", 50)
		.attr("x", innerWidth / 2);

	g.append("text") //adds another grouping for the name of the bar chart
		.attr("font-family", "sans-serif")
		.text("SF COVID-19 Cumulative Cases by Age Group, as of " + desiredDate)
		.attr("font-size", 28)
		.attr("text-anchor", "middle")
		.attr("y", -20)
		.attr("x", innerWidth / 2);
	
	let rects = g.selectAll("rect").data(data); //selects rects and binds them to the data

	rects.enter().append("rect")
		.attr("y", d => scaleY(yVal(d))) //the y scales to the right value with the y val of d
		.attr("width", d => scaleX(xVal(d))) //the width scales to the right value with bar length of d
		.attr("height", scaleY.bandwidth()) //sets up the bars with the right bandwidth for each bar
		.attr("fill", "blue") //make the bar blue
		.attr("count", d => xVal(d)) //set the bar to store the cases count
		.on("mouseover", function(d) {        
			d3.select(this)
				.transition()
				.attr("fill", "orange"); //fill the bar with orange when hovering over it

			var attrs = d.srcElement.attributes;
        	let count = attrs['count'].value; //get the cases count for the bar

        	//tooltip from the book
        	//https://learning.oreilly.com/library/view/interactive-data-visualization/9781491921296/ch10.html#interactivity

			var xPos = parseFloat(d3.select(this).attr("width")) + 30; //determine where the tooltip's text x pos will be based on bar
			var yPos = parseFloat(d3.select(this).attr("y")) + scaleY.bandwidth() / 2 + 5; //do the same but for th y pos

			//puts the text to the right of the end of the bar
			g.append("text")
				.attr("id", "tooltip")
				.attr("x", xPos)
				.attr("y", yPos)
				.attr("text-anchor", "middle")
				.attr("font-family", "sans-serif")
				.attr("font-size", 20)
				.attr("fill", "black")
				.text(count);
		})
		.on("mouseout", function() { //when done hovering, make the bar blue again and remove the tooltip
			d3.select(this)
				.transition()
				.attr("fill", "blue");

			d3.select("#tooltip").remove();
		});

	/*

	DATA SOURCE

	*/

	let sourcePage = "https://data.sfgov.org/COVID-19/COVID-19-Cases-Summarized-by-Age-Group/sunc-2t3k";

	g.append("text") //adds another grouping for the data source
		.attr("font-family", "sans-serif")
		.text("Source: DataSF")
		.attr("text-anchor", "middle")
		.attr("font-size", 16)
		.attr("fill", "gray")
		.attr("y", innerHeight + 80)
		.attr("x", innerWidth / 2)
		.on("click", function() {
			window.open(sourcePage);
		});
}

let desiredDate = "2021/05/04"; //the date that will be used to get the case count

//data source: https://data.sfgov.org/COVID-19/COVID-19-Cases-Summarized-by-Age-Group/sunc-2t3k
//https://data.sfgov.org/api/views/sunc-2t3k/rows.csv?accessType=DOWNLOAD is the data source, directly downloads the data
d3.csv("https://data.sfgov.org/api/views/sunc-2t3k/rows.csv?accessType=DOWNLOAD", function(d) { //for each entry
	//if the day is the most recent day
	if (d["Specimen Collection Date"] == desiredDate) {
		return { //return the race and the cumulative cases
			ageGroup: d["Age Group"],
			cumulativeCases: +d["Cumulative Confirmed Cases"]
		};
	}
}).then(function(data) {
	data.sort(function(x,y) {
		return d3.descending(x.cumulativeCases, y.cumulativeCases); //sorts the function so in bar chart, highest will be at top
	});

	render(data); //then render the data as it has been fully processed
});
