queue()
  .defer(d3.json,'static/data/youtube-new/US_category_id.json')
  .defer(d3.json,'static/data/youtube-new/CA_category_id.json')
  .defer(d3.json,'static/data/youtube-new/GB_category_id.json')
  .await(readData);

var USvideos, CAvideos, GBvideos;
var US_category, CA_category, GB_category;
var cat = "categories";
var wordcloud, treeMap;
// booleans to determine how to filter data
var dataRead = false;
var janClick = false;
var decClick = false;
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
    var USfiltered = filterData(USvideos, janClick, decClick);
		wordcloud = new wordCloud(USfiltered, US_category_id, cat);
		treeMap = new tm(USfiltered,US_category_id);
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
// filter data by month
function filterData(data, janClick, decClick){
  // time formatting 
  var filterData = [];
  var format = d3.timeParse("%Y.%d.%m"); // year-day-month date formatting
  var cutoffDate = new Date(format(data[data.length-1].trending_date)); // most recent date, 28 feb
  var february = new Date(cutoffDate.setDate(cutoffDate.getDate() - 28)); // 31 jan
  var january = new Date(cutoffDate.setDate(cutoffDate.getDate() - 31)); // 31 dec
  var december = new Date(cutoffDate.setDate(cutoffDate.getDate() - 31)); // 30 nov

  if(janClick){
    filterData = data.filter(function(d) { // filter data with date constraints
      return format(d.trending_date) > january && format(d.trending_date) < february;
    });
  }
  else if(decClick){
    filterData = data.filter(function(d) { // filter data with date constraints
      return format(d.trending_date) > december && format(d.trending_date) < january;
    });
  }
  else{ // default is data from february 
    filterData = data.filter(function(d) { // filter data with date constraints
      return format(d.trending_date) > february;
    });
  }
  return filterData;
}

function reDraw(){

  if(!document.getElementById('wcSVG') != null) {
    document.getElementById('wcSVG').remove();
  }
  if(!document.getElementById('tmSVG') != null) {
    document.getElementById('tmSVG').remove();
  }
  // check which dataset is selected right now
  if(USvids){
    cat = "categories";
    var USfiltered = filterData(USvideos, janClick, decClick);
    wordcloud = new wordCloud(USfiltered, US_category, cat);
    treeMap = new tm(USfiltered,US_category);
  }
  if(CAvids){
    cat = "categories";
    var CAfiltered = filterData(CAvideos, janClick, decClick);
    wordcloud = new wordCloud(CAfiltered, CA_category, cat);
    treeMap = new tm(CAfiltered,CA_category);
  }
  if(GBvids){
    cat = "categories";
    var GBfiltered = filterData(GBvideos, janClick, decClick);
    wordcloud = new wordCloud(GBfiltered, GB_category, cat);
    treeMap = new tm(GBfiltered,GB_category);
  }
}

function reDrawWordCloud(category){

  if(!document.getElementById('wcSVG') != null) {
    document.getElementById('wcSVG').remove();
  }
  // check which dataset is selected right now
  if(USvids){
    var USfiltered = filterData(USvideos, janClick, decClick);
    wordcloud = new wordCloud(USfiltered, US_category, category);
  }
  if(CAvids){
    var CAfiltered = filterData(CAvideos, janClick, decClick);
    wordcloud = new wordCloud(CAfiltered, CA_category, category);
  }
  if(GBvids){
    var GBfiltered = filterData(GBvideos, janClick, decClick);
    wordcloud = new wordCloud(GBfiltered, GB_category, category);
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
  janClick = false;
  decClick = false;
  reDraw();
}
function clickTime2() {
  janClick = true;
  decClick = false;
  reDraw();
}
function clickTime3() {
  janClick = false;
  decClick = true;
  reDraw();
}

function getCategory(category){
  cat = category;
  reDrawWordCloud(category);
}

