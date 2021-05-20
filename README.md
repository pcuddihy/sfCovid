# How COVID-19 Affected San Francisco 

## Background and Motivation

I’m interested in seeing the breakdown of COVID-19 in San Francisco because I think that San Francisco is a city that still has a lot of inequality and disparity between its people. It has some of the richest people in the world, as well as a massive population of homeless people. It also has a wide diversity of people across age, race, and neighborhood lines. The goal of this project is to show how those groups have been affected by COVID-19, to highlight the most affected groups.

## Libraries Used

d3 v6 - https://d3js.org

d3-legend v4 - https://d3-legend.susielu.com

d3-annotation v2.5.1 - https://d3-annotation.susielu.com

## Code and Data

The data for a chart is found inside the code for that chart. The code directly downloads the data, meaning that no data files have to be downloaded when looking at each chart. The HTML and JavaScript files for each chart are the only things that are downloaded to run the project. The libraries used are already included in each HTML file, so they don't have to be downloaded either. This makes the setup of the project rather straightforward.

## Setup

With the "covidProject" folder downloaded, the "html" folder can be found which contains each HTML file for each chart. Each HTML file in that folder connects to a JavaScript file in the "javascript" folder. With the terminal open, navigate through the command line to inside the folder "covidProject", wherever it is stored on your system. Start a server on your system with the command "python3 -m http.server 8000 --bind 127.0.0.1". Open up a window on a web browser of your choice and go to the URL: "http://127.0.0.1:8000". When that page loads, open up the "html" folder. On that page, each HTML file can be opened up to view the corresponding chart. For whatever chart you want to work on or change, the corresponding JavaScript file needs to be opened up on your system. So, if you want to change the chart that comes from "covid19SFageBar.html", open up the "javascript" folder on your system and open "covid19SFageBar.js" in your preferred IDE. Edit it at your leisure and save it. When the web page is reloaded, whatever changes were made will be reflected in the chart. Whenever you're done making changes, enter control C to terminate the server.
