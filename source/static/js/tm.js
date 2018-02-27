function tm(data,data_category)
{

    var div = '#treemap';

    var smaller_data = data.slice(0,10);
    var categories = data_category;

    var parentWidth = $(div).width();
    var parentHeight = $(div).height();

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var margin = {top: 0, right: 3, bottom: 0, left: 0},
        width = parentWidth - margin.left - margin.right,
        height = parentHeight - margin.top - margin.bottom;

    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height);

    var treeMap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width,height]);

    var cat_rate = [];


    for(var i = 0; i < categories.items.length; i++)
    {
        var sum = 0;
        for(var j = 0; j < smaller_data.length; j++)
        {
            if(categories.items[i].id == smaller_data[j].category_id) {
                sum++;
                //smaller_data[j].category = data_category.items[i].snippet.title;
            }
        }
        categories.items[i].occurence = sum;

    }



    /*var categories = data_category.items.map(function (value, i) {
        return {"id": value.id, "title": value.snippet.title, "rate": cat_rate[i]};
    });*/



    /*var stratify = d3.stratify()
        .parentId(function (d) {
            return d.category_id;
        });
*/
console.log(categories);
    var root = d3.hierarchy(categories)
        .sum(function(d) { return d.items.occurence; })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    treeMap(root);
    console.log(root.leaves());

        var cell = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

        cell.append("rect")
            .attr("id", function(d,i) { return d.data.items.id; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d,i) { return color(d.data.items.id); });
/*

        .attr("class", "node")
        .attr("title", function(d,i) { return d.data.items[i].snippet.title; })
        .style("left", function(d) { return d.x0 + "px"; })
        .style("top", function(d) { return d.y0 + "px"; })
        .style("width", function(d) { return d.x1 - d.x0 + "px"; })
        .style("height", function(d) { return d.y1 - d.y0 + "px"; })
        .style("background", function(d) { return color(d.data.items.id); })
        .append("div")
        .attr("class", "node-label")
        .text(function(d,i) { return d.data.items[i].snippet.title; })
        .append("div")
        .attr("class", "node-value")
        .text(function(d,i) { return d.data.items[i].snippet.occurence; });*/

};

