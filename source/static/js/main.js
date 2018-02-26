queue()
  .defer(d3.csv,'static/data/youtube-new/USvideos.csv')
  .defer(d3.csv,'static/data/youtube-new/CAvideos.csv')
  .defer(d3.csv,'static/data/youtube-new/GBvideos.csv')
  .defer(d3.json,'static/data/youtube-new/US_category_id.json')
  .defer(d3.json,'static/data/youtube-new/CA_category_id.json')
  .defer(d3.json,'static/data/youtube-new/GB_category_id.json')
  .await(draw);

var wordCloud;
var tm;

function draw(error, USvideos, CAvideos, GBvideos, 
	US_category_id, CA_category_id ,GB_category_id){
if(error){ console.log(error); }

//console.log(USvideos[0]);
wordCloud = new wordCloud();
tm = new tm(USvideos,US_category_id);

}