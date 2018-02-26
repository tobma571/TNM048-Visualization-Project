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
	US_category_id, CA_category_id, GB_category_id){
if(error){ console.log(error); }

	USvideos = transformData(USvideos);
	CAvideos = transformData(CAvideos);
	GBvideos = transformData(GBvideos);

	wordCloud = new wordCloud(USvideos, CAvideos, GBvideos, 
	US_category_id, CA_category_id, GB_category_id);

	tm = new tm();

}

// add a measure of popularity in data
function transformData(data){
	var dim = Object.keys(data[0]); // features/dimensions of dataset
	data.forEach(function(d){
		d.rating = Math.log2(d.views) + Math.log(d.likes/d.dislikes)
				+ Math.log(d.comment_count); 
	})
	return data;
}