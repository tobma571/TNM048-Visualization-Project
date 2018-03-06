
function wordCloud(data, 
	category_id, category) {

    var div = '#word-cloud';

    var cloud = d3.layout.cloud();

    var parentWidth = $(div).width();
    var parentHeight = $(div).height();

    var tagFreqResult = tagFreq(data, category_id, category);
    var tagMap = tagFreqResult[0];
    var tagKeys = tagFreqResult[1];
    var Warray = [];
    var wordSizes = [];
    var wordTranslations = [];
    var wordTranslationsY = [];

    let totTextHeight = 0;
    let totWordRow = 0;
    let nrOfWords = 90;
    let MaxSize = 100;

    var margin = {top: 0, right: 3, bottom: 0, left: 0},
        parentwidth = parentWidth - margin.left - margin.right,
        parentheight = parentHeight - margin.top - margin.bottom;

    // Set sizes for all words
    for (var j = 0; j < nrOfWords; j++) {

            Warray[j] = tagKeys[j];
            wordSizes[j] = tagMap[tagKeys[j]]/tagMap[tagKeys[0]]*MaxSize;
        }


    // Set arrays for translating words
    for (var i = 0; i < nrOfWords; i++) {

        if(totWordRow < parentWidth) {


                if(i > 0){
                    wordTranslations[i] = wordTranslations[i-1] + getTextWidth(tagKeys[i-1], wordSizes[i-1] , 'Impact');   
                    wordTranslationsY[i] = wordTranslationsY[i-1];
                }    
                else{
                    wordTranslations[i] = 0;
                    wordTranslationsY[i] = 0;  
                }
                totWordRow += getTextWidth(tagKeys[i], wordSizes[i] , 'Impact') + getTextWidth(tagKeys[i+1], wordSizes[i+1] , 'Impact');          
        }
        else {
            totWordRow = getTextWidth(tagKeys[i], wordSizes[i] , 'Impact');
            wordTranslations[i] = 0;
            totTextHeight = wordTranslationsY[i-1];
            wordTranslationsY[i] = wordSizes[i] + totTextHeight;

            if(wordTranslationsY[i] > 350) {
                Warray.splice(i, Warray.length-i);
                wordSizes.splice(i, wordSizes.length-i);
                break;
            }         
        }
    }

    // Return width of a single word
    function getTextWidth(text, fontSize, fontFace) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = fontSize + 'px ' + fontFace;
        return context.measureText(text).width;
    } 

    var fill = d3.scaleOrdinal(d3.schemeCategory20);

    var layout = cloud
        .size([parentWidth, parentHeight])
        // .words(Warray)
        .words(Warray.map(function(d) {
        return {text: d, size: 5, test: "haha"};
        }))
        .padding(5)
     // .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .rotate( function(d){ return 0; })
        .font("Impact")
        .text(function(d){ return d.text; })
        .fontSize(function(d,i) { return wordSizes[i]; })
        .on("end", draw);

    layout.start();

    function draw(words) {

        d3.select(div).append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .attr("id", "wcSVG")
        .append("g")
        .attr("transform", "translate(" + 80 + "," + MaxSize/0.6 + ")") // prev: 1.2
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "start")
        .attr("transform", function(d,i) {
        return "translate(" +  wordTranslations[i] + "," + wordTranslationsY[i] + ")";

        })
        .text(function(d) { return d.text; });
    }

    // Function to calculate frequency of tags
    function tagFreq(tagData, category_id, category) {
        
        tagArray = [];
       // noSamples = 1000;
       // console.log(category_id.items[1].snippet.title);
       var catID = category;

       category_id.items.forEach(function(d){
            if(d.snippet.title == category){
                catID = d.id;
            } 
       })

        // Concatinates the tags of chosen number of samples into a single string.
        for(let j = 0; j < tagData.length; j++) {
             if((category == "categories" || tagData[j].category_id == catID)
                && tagData[j].tags.split('"|"') != "[none]"){
                var cliptags = tagData[j].tags.split('"|"');
                tagArray = tagArray.concat(cliptags);
             }
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


