

function wordCloud(USvideos, CAvideos, GBvideos, 
	US_category_id, CA_category_id ,GB_category_id) {

var div = '#word-cloud';

var cloud = d3.layout.cloud();

var tagFreqResult = tagFreq(USvideos);
var tagMap = tagFreqResult[0];
var tagKeys = tagFreqResult[1];
var Warray = [];
var wordSizes = [];
var wordTranslations = [];

for (var i = 0; i < 20; i++) {

  Warray[i] = tagKeys[i];
  wordSizes[i] = tagMap[tagKeys[i]]/tagMap[tagKeys[0]]*100;

    if(i > 0)
        wordTranslations[i] = wordTranslations[i-1] + wordSizes[i];
    else
        wordTranslations[i] = -wordSizes[i];
}

var fill = d3.scaleOrdinal(d3.schemeCategory20);

    var layout = cloud
        .size([500, 500])
        .words(Warray.map(function(d) {
     // return {text: d, size: 10 + Math.random() * 90, test: "haha"};
        return {text: d, size: 100, test: "haha"};
        }))
        .padding(5)
     // .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d,i) { return wordSizes[i]; }) // prev: d.size
        .on("end", draw);

    layout.start();

    function draw(words) {

        d3.select(div).append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
      // .style("fill", 'red' )
        .attr("text-anchor", "middle")
        .attr("transform", function(d,i) {
           // return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
       //    return "translate(" + [d.x, d.y] + ")";
        return "translate(" +  [0, wordTranslations[i]] + ")";
        })
        .text(function(d) { return d.text; });
    }

    // Function to calculate frequency of tags
    function tagFreq(tagData) {
        
        tagArray = [];
        noSamples = 2000;

        // Concatinates the tags of chosen number of samples into a single string.
        for(let j = 0; j < noSamples; j++) {
            var cliptags = tagData[j].tags.split('"|"');
            tagArray = tagArray.concat(cliptags);
        }

        var freqMap = {}; // Hashmap for tags
        var keys = []; // Array to store keys to most frequent tags in descending order.

        for(let i = 0; i < tagArray.length; i++) {

            var word = tagArray[i];

                if(freqMap[word] === undefined) {
                    freqMap[word] = 1;
                    keys.push(word);
                }
                else {
                    freqMap[word]++;

                }         
        }
        keys.sort(function(a, b) {
            return (freqMap[b] - freqMap[a]);
        });

        return [freqMap, keys];

    }


}