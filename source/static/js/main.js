queue()
  .defer(d3.csv,'static/data/youtube-new/USvideos.csv')
  .defer(d3.csv,'static/data/youtube-new/CAvideos.csv')
  .defer(d3.csv,'static/data/youtube-new/GBvideos.csv')
  .defer(d3.json,'static/data/youtube-new/US_category_id.json')
  .defer(d3.json,'static/data/youtube-new/CA_category_id.json')
  .defer(d3.json,'static/data/youtube-new/GB_category_id.json')
  .await(draw);

// var wordcloud;
// var tm;
// var time, country;
 var USvideos, CAvideos, GBvideos;
 var US_category, CA_category, GB_category;




function draw(error, USvideos, CAvideos, GBvideos, 
	US_category_id, CA_category_id, GB_category_id){
if(error){ console.log(error)};

	USvideos = transformData(USvideos);
	CAvideos = transformData(CAvideos);
	GBvideos = transformData(GBvideos);
	US_category = US_category_id;
	CA_category = CA_category_id;
	GB_category = GB_category_id;

  	wordcloud = new wordCloud(USvideos, US_category_id);
	//tm = new tm(USvideos,US_category_id);

}

// add a measure of popularity in data
function transformData(data){
	data.forEach(function(d){
		d.rating = Math.log2(d.views) + Math.log(d.likes/d.dislikes)
				+ Math.log(d.comment_count); 
	})
	return data;
}

function filterData() {

}

function clickUS() {

  	// if svg element is not empty, remove()
  	if(!document.getElementById('wcSVG') != null) {
  		document.getElementById('wcSVG').remove();
  	}
 	d3.csv("static/data/youtube-new/USvideos.csv", function(data) {
	  	USvideos = new transformData(data);
	  	wordcloud = new wordCloud(USvideos, US_category);
	});
}

function clickCA() {

  	// if svg element is not empty, remove()
  	if(!document.getElementById('wcSVG') != null) {
  		document.getElementById('wcSVG').remove();
  	}
   	d3.csv("static/data/youtube-new/CAvideos.csv", function(data) {
	  	CAvideos = new transformData(data);
	  	wordcloud = new wordCloud(CAvideos, CA_category);
  });
}
function clickGB() {

    // if svg element is not empty, remove()
  	if(!document.getElementById('wcSVG') != null) {
  		document.getElementById('wcSVG').remove();
  	}
	d3.csv("static/data/youtube-new/GBvideos.csv", function(data) {
		GBvideos = new transformData(data);
		wordcloud = new wordCloud(GBvideos, GB_category);
	});
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


