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

    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([0, height]);

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

//https://bl.ocks.org/mbostock/4063582

    var root = d3.hierarchy(formatted_data)
        .eachBefore(function (d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
        .sum(function(d) { return d.children ? 0 : 1; })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    treeMap(root);

    var node = root;

        var cell = svg.selectAll("g")
            .data(root.children)
            .enter().append("svg:g")
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
            .attr("class", "cell")
            .on("click",function (d) { return zoom(node == d.parent ? d : d.parent);});

        cell.append("rect")
            .attr("id", function(d,i) { return d.data.id; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d,i) { return color(d.data.id); })
            .on("mouseover", function(d) {
                d3.select(this).style('stroke', 'black');
            })
            .on("mouseout", function (d) {
                d3.select(this).style('stroke', 'none');
            });


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




    var test = d3.select(window);
    //console.log(test);


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

    function zoom(value)//Modified http://bl.ocks.org/masakick/04ad1502068302abbbcb
    {
        var dx = (value.x1 - value.x0), dy = (value.y1 - value.y0), kx = width/dx, ky = height/dy;
        x.domain([value.x0, value.x1]);
        y.domain([value.y0, value.y1]);
    console.log(value);

        var t = svg.selectAll("g.cell").transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.y0) + ")"; });

        t.select("rect")
            .attr("width", function(d) { return kx * (d.x1 - d.x0) - 1; })
            .attr("height", function(d) { return ky * (d.y1 - d.y0) - 1; });

        t.select("text")
            .attr("x", function(d) { return kx * (d.x1 - d.x0) / 2; })
            .attr("y", function(d) { return ky * (d.y1 - d.y0) / 2; })
            //.style("opacity", function(d) { return kx * (d.x1 - d.x0) > d.width ? 1 : 0; });


        /*d3.select("svg").append("svg:image")
            .attr("xlink:href", "https://i.ytimg.com/vi/gHZ1Qz0KiKM/default.jpg")
            .attr("width", 200)
            .attr("height",150);*/

        node = value;

        d3.event.stopPropagation();

    }


};

