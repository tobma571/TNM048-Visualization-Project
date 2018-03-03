queue()
  .defer(d3.json,'static/data/youtube-new/US_category_id.json')
  .defer(d3.json,'static/data/youtube-new/CA_category_id.json')
  .defer(d3.json,'static/data/youtube-new/GB_category_id.json')
  .await(readData);

var USvideos, CAvideos, GBvideos;
var US_category, CA_category, GB_category;
var dataRead = false;
var twoweekclick = false;
var monthclick = false;
var threemonthclick = false;
var USvids = false;
var CAvids = false;
var GBvids = false;

function readData(error, 
	US_category_id, CA_category_id, GB_category_id){
if(error){ console.log(error)};

		d3.csv('static/data/youtube-new/USvideos.csv', function(data) {
			USvideos = transformData(data);
			dataRead = true;
      USvids = true;
			draw(US_category_id, CA_category_id, GB_category_id);
	});

	d3.csv('static/data/youtube-new/CAvideos.csv', function(data) {
			CAvideos = transformData(data);
	});

		d3.csv('static/data/youtube-new/GBvideos.csv', function(data) {
			GBvideos = transformData(data);
	});
}

function draw(US_category_id, CA_category_id, GB_category_id){

	US_category = US_category_id;
	CA_category = CA_category_id;
	GB_category = GB_category_id;

	if(dataRead == true) {
      var USfiltered = filterData(USvideos, twoweekclick, monthclick, threemonthclick);
			wordcloud = new wordCloud(USfiltered, US_category_id);
			tm = new tm(USvideos,US_category_id);
			dataRead = false;
	}
}

// add a measure of popularity in data
function transformData(data){
	data.forEach(function(d){
		d.rating = Math.log2(d.views) + Math.log(d.likes/d.dislikes)
				+ Math.log(d.comment_count); 
	})
	return data;
}
// filter data by time
function filterData(data, twoweekclick, monthclick, threemonthclick){
    // time formatting 
    var filterData = [];
    var format = d3.timeParse("%Y.%d.%m"); // year-day-month date formatting
    var cutoffDate = new Date(format(data[data.length-1].trending_date)); // most recent date 

    var threeMonths = new Date(cutoffDate.setDate(cutoffDate.getDate() - 90));
    cutoffDate = new Date(format(data[data.length-1].trending_date));
    var oneMonth = new Date(cutoffDate.setDate(cutoffDate.getDate() - 30));
    cutoffDate = new Date(format(data[data.length-1].trending_date));
    var twoWeeks = new Date(cutoffDate.setDate(cutoffDate.getDate() - 14));
    cutoffDate = new Date(format(data[data.length-1].trending_date));
    var oneWeek = new Date(cutoffDate.setDate(cutoffDate.getDate() - 7));

    if(twoweekclick){
        filterData = data.filter(function(d) { // filter data with date constraints
            return format(d.trending_date) > twoWeeks;
        });
    }
    else if(monthclick){
        filterData = data.filter(function(d) { // filter data with date constraints
            return format(d.trending_date) > oneMonth;
        });
    }
    else if(threemonthclick){
        filterData = data.filter(function(d) { // filter data with date constraints
            return format(d.trending_date) > threeMonths;
        });
    }
    else{ // default is data for one week 
        filterData = data.filter(function(d) { // filter data with date constraints
            return format(d.trending_date) > oneWeek;
        });
    }
    return filterData;
}

function reDraw(){

  if(!document.getElementById('wcSVG') != null) {
    document.getElementById('wcSVG').remove();
  }
  // check which dataset is selected right now
    if(USvids){
      var USfiltered = filterData(USvideos, twoweekclick, monthclick, threemonthclick);
      wordcloud = new wordCloud(USfiltered, US_category);
     // tm = new tm(USvideos,US_category_id);
    }
    if(CAvids){
      var CAfiltered = filterData(CAvideos, twoweekclick, monthclick, threemonthclick);
      wordcloud = new wordCloud(CAfiltered, CA_category);
      // tm = new tm(CAvideos,CA_category_id);
    }
    if(GBvids){
      var GBfiltered = filterData(GBvideos, twoweekclick, monthclick, threemonthclick);
      wordcloud = new wordCloud(GBfiltered, GB_category);
      // tm = new tm(GBvideos,GB_category_id);
    }
}

function clickUS() {

    USvids = true;
    CAvids = false;
    GBvids = false;
    reDraw();
}

function clickCA() {

    USvids = false;
    CAvids = true;
    GBvids = false;
    reDraw();
}
function clickGB() {

    USvids = false;
    CAvids = false;
    GBvids = true;
    reDraw();
}

function clickTime1() {

    twoweekclick = false;
    monthclick = false;
    threemonthclick = false;
    reDraw();
}
function clickTime2() {

    twoweekclick = true;
    monthclick = false;
    threemonthclick = false;
    reDraw();
}
function clickTime3() {

    twoweekclick = false;
    monthclick = true;
    threemonthclick = false;
    reDraw();
}
function clickTime4() {

    twoweekclick = false;
    monthclick = false;
    threemonthclick = true;
    reDraw();
}

