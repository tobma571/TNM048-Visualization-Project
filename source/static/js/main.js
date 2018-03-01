queue()
  .defer(d3.json,'static/data/youtube-new/US_category_id.json')
  .defer(d3.json,'static/data/youtube-new/CA_category_id.json')
  .defer(d3.json,'static/data/youtube-new/GB_category_id.json')
  .await(readData);

// var wordcloud;
// var tm;
// var time, country;
 var USvideos, CAvideos, GBvideos;
 var US_category, CA_category, GB_category;
 var dataRead = false;

function readData(error, 
	US_category_id, CA_category_id, GB_category_id){
if(error){ console.log(error)};

		d3.csv('static/data/youtube-new/USvideos.csv', function(data) {
			USvideos = transformData(data);
			dataRead = true;
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
			wordcloud = new wordCloud(USvideos, US_category_id);
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

function clickUS() {

  	// if svg element is not empty, remove()
  	if(!document.getElementById('wcSVG') != null) {
  		document.getElementById('wcSVG').remove();
  	}
	  	wordcloud = new wordCloud(USvideos, US_category);
}

function clickCA() {

  	// if svg element is not empty, remove()
  	if(!document.getElementById('wcSVG') != null) {
  		document.getElementById('wcSVG').remove();
  	}
	  	wordcloud = new wordCloud(CAvideos, CA_category);
}
function clickGB() {

    // if svg element is not empty, remove()
  	if(!document.getElementById('wcSVG') != null) {
  		document.getElementById('wcSVG').remove();
  	}
		wordcloud = new wordCloud(GBvideos, GB_category);

}

function clickTime1() {
  time = document.getElementById('1week').getAttribute('value');
  console.log(time);
}
function clickTime2() {
  time = document.getElementById('2week').getAttribute('value');
  console.log(time);
}
function clickTime3() {
  time = document.getElementById('1month').getAttribute('value');
  console.log(time);
}
function clickTime4() {
  time = document.getElementById('3month').getAttribute('value');
  console.log(time);
}


