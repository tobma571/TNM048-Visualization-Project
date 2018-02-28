function tm(data,data_category)
{

    var div = '#treemap';

    var smaller_data = data.slice(0,1000);
    var categories = data_category.items;

    var parentWidth = $(div).width();
    var parentHeight = $(div).height();

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var margin = {top: 0, right: 3, bottom: 0, left: 0},
        width = parentWidth - margin.left - margin.right,
        height = parentHeight - margin.top - margin.bottom;

    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height);

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var treeMap = d3.treemap()
        .tile(d3.treemapResquarify.ratio(1))
        .size([width,height])
        .paddingInner(1)
        .round(true);

    var cat_rate = [];

    var formatted_data = {"name": "categories", "children": treeFormat(smaller_data, categories)};


    /*for(var i = 0; i < categories.items.length; i++)
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

    }*/




    var root = d3.hierarchy(formatted_data)
        .eachBefore(function (d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
        .sum(function(d) { return d.children ? 0 : 1; })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });


    treeMap(root);
    //console.log(root.children[2].data.name.split(/(?=[A-Z][^A-Z])/g));

        var cell = svg.selectAll("g")
            .data(root.children)
            .enter().append("svg:g")
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

        cell.append("rect")
            .attr("id", function(d,i) { return d.data.id; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d,i) { return color(d.data.id); });

        cell.append("clipPath")
            .attr("id", function(d) { return "clip-" + d.data.id; })
            .append("use")
            .attr("xlink:href", function(d) { return "#" + d.data.id; });

        cell.append("text")
            .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
            .selectAll("tspan")
            .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
            .enter().append("tspan")
            .attr("x", 4)
            .attr("y", function(d, i) { return 13 + i * 10; })
            .text(function(d) { return d; });

        cell.append("title")
            .text(function(d) { return d.data.name; });

    function treeFormat(array, cats) {

        var sort = [];
        var data = [];


        for (var i = 0; i < cats.length; i++)
        {
          sort.push(array.filter(function (d) {
              return cats[i].id == d.category_id;
          }));
        }

        for(var i = 0; i < sort.length; i++)
        {
            data.push({
                "name": cats[i].snippet.title,
                "children": sort[i]
            });

        }
        return data;

    }


};

