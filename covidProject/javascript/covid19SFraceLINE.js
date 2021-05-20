//selects the body of the html and appends svg with certain width and height
let svg = d3.select("body").append("svg")
	.attr("width", 1440)
	.attr("height", 750);

//store the width and height for later
let width = +svg.attr("width");
let height = +svg.attr("height");

//render the data
function render(data) {

	let xVal = d => d.date; //gets the date for each entry
	let yVal = d => d.cumulativeCases; //gets the cumulative cases
	let zVal = d => d.race; //gets the race

	//set the margins
	let margin = {
		top: 100,
		right: 100,
		bottom: 100,
		left: 500
	};

	//these get the width and height of the inner actual chart
	let innerWidth = width - margin.left - margin.right;
	let innerHeight = height - margin.top - margin.bottom;

	/*

	SET UP SCALES

	*/

	let unparsedLatestDate = "2021/05/04"; //latest date before parsing
	let latestDate = d3.timeParse("%Y/%m/%d")(unparsedLatestDate); //parse the date for the scale

	let scaleX = d3.scaleTime() //sets up how dates will scale
		.domain([d3.min(data, xVal), latestDate]) //the data space, with the last date being the latestDate
		.range([0, innerWidth]); //the pixel space

	let xAxis = d3.axisBottom(scaleX) //the bottom axis is connected to the scaleX now
		.tickSize(5)
		.tickPadding(20)
		.ticks(5)
		.tickFormat(d3.timeFormat("%b %Y"));

	let scaleY = d3.scaleLinear() //sets up how cases, y axis values will scale
		.domain([0, d3.max(data, yVal)]).nice()
		.range([innerHeight, 0])

	let yAxis = d3.axisLeft(scaleY) //left axis is connected to the scaleY now
		.tickPadding(20)
		.tickSize(5);

	let color = d3.scaleOrdinal()
  		.domain(data.map(zVal))
  		.range(d3.schemeCategory10)

  	let legend = d3.legendColor() //make legend using Susie Lu's library
		.ascending(false)
		.title("Race Color Legend, races sorted from most cases to least")
		.titleWidth(150)
		.scale(color);

	svg.append("g") //draw legend on page
		.attr("font-family", "sans-serif")
		.attr("transform", "translate(60, 70)")
		.call(legend);

	let g = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`); //moves the chart out into clear space

	let yG = g.append("g") //adds a grouping for the cases, y axis
		.call(yAxis)
		.attr("font-size", 16); //size of number of cases labels

	yG.append("text") //add the y axis label
		.attr("font-size", 22)
		.attr("fill", "black")
		.text("Cumulative Cases")
		.attr("y", innerHeight / 2)
		.attr("x", -90);
	
	let xG = g.append("g") //adds another axis grouping for the x axis, sets up labels and ticks
		.call(xAxis)
		.attr("transform", `translate(0, ${innerHeight})`) //moves the dates to bottom
		.attr("font-size", 16);

	g.append("text") //adds another grouping for the name of the line chart
		.attr("font-family", "sans-serif")
		.text("SF COVID-19 Cumulative Cases by Race as of " + unparsedLatestDate)
		.attr("text-anchor", "middle")
		.attr("font-size", 26)
		.attr("y", -20)
		.attr("x", innerWidth / 2);

	/*

	DRAW THE LINES

	*/

	data = d3.groups(data, d => d.race) //group the data by race

	let line = d3.line() //defines the x and y of the line
		.x(d => scaleX(xVal(d)))
		.y(d => scaleY(yVal(d)));

	g.selectAll("path").select("path")
		.data(data)
		.enter().append("path")	//append a path for each line
			.attr("class", "line")
			.datum(function(d) {
				return d[1]; //select the data for the race
			})
			.attr("fill", "none")
			.attr("stroke", d => color(d[0].race))
			.attr("stroke-width", 2)
			.attr("stroke-linejoin", "round") //smooths line a bit
			.attr("stroke-linecap", "round") //smooths line a bit
			.attr("id", d => d[0].race) //get the race from first data element
			.attr("d", line); //call line to draw line

	/*

	DATA SOURCE

	*/

	let sourcePage = "https://data.sfgov.org/COVID-19/COVID-19-Cases-Summarized-by-Race-and-Ethnicity/vqqm-nsqg";

	g.append("text") //adds another grouping for the data source
		.attr("font-family", "sans-serif")
		.text("Source: DataSF")
		.attr("text-anchor", "middle")
		.attr("font-size", 16)
		.attr("fill", "gray")
		.attr("y", innerHeight + 70)
		.attr("x", innerWidth / 2)
		.on("click", function() {
			window.open(sourcePage);
		});
}

//data source: https://data.sfgov.org/COVID-19/COVID-19-Cases-Summarized-by-Race-and-Ethnicity/vqqm-nsqg
//directly downloads the data
d3.csv("https://data.sfgov.org/api/views/vqqm-nsqg/rows.csv?accessType=DOWNLOAD", function(d) { //for each entry
	return { //return the race and the cumulative cases
		date: d3.timeParse("%Y/%m/%d")(d["Specimen Collection Date"]),
		race: d["Race/Ethnicity"],
		cumulativeCases: +d["Cumulative Confirmed Cases"]
	};
}).then(function(data) {
	data.sort(function(x,y) {
		return d3.descending(x.cumulativeCases, y.cumulativeCases); //sorts the function so in line chart, highest will be at top
	});

	render(data); //then render the data as it has been fully processed
});