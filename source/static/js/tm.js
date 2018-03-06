function tm(data,data_category)
{

    var div = '#treemap';

    var smaller_data = data.sort(function(a,b){ return a.views - b.views; });
        smaller_data = smaller_data.slice(0,200);
    
        for(let i = 0; i < smaller_data.length; i++){
            console.log(smaller_data[i].video_id);
        }

    var categories = data_category.items;

    var parentWidth = $(div).width();
    var parentHeight = $(div).height();

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var margin = {top: 0, right: 3, bottom: 0, left: 0},
        width = parentWidth - margin.left - margin.right,
        height = parentHeight - margin.top - margin.bottom;

    //used for zooming
    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([0, height]);

    //create an SVG to draw the treemap on
    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "tmSVG");

    //create a treemap variable with tiling of 1:1 ratio
    var treeMap = d3.treemap()
        .tile(d3.treemapResquarify.ratio(1))
        .size([width,height])
        .paddingInner(1)
        .round(true);

    //the data needs to be formatted for the treemap
    var formatted_data = {"name": "categories", "children": treeFormat(smaller_data, categories)};

//https://bl.ocks.org/mbostock/4063582

    //create the root of the treemap where each item gets an id.
    var root = d3.hierarchy(formatted_data)
        .eachBefore(function (d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
        .sum(sumChildren)
        //.sum(function(d) { return d.children ? 0 : 1; })            //The area of the treemap rectangles is set to number of children
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    //calculates the rectangles' dimensions based on the root
    treeMap(root);


    var node = root;

    //create a class that represents all the leaves of the tree i.e. the videos
    var parent = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("svg:g")
            .attr("class", "parent")
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
            .on("click",function (d) {
                d3.selectAll("g.grandparent").raise();
                return zoom(node == d.parent && d.depth != 2 ? d : d.parent.parent);})
            .on("mouseover", function(d) {
                d3.select(this).style('stroke', 'black');
            })
            .on("mouseout", function (d) {
                d3.select(this).style('stroke', 'none');
            });

    //creates a rectangle for each video with dimensions specified by the treemap
        parent.append("rect")
            .attr("id",function(d,i) { return d.data.id; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("fill", function(d,i) { return color(d.parent.data.id); });
/*            .on("mouseover", function(d) {
                d3.select(this).style('stroke', 'black');
            })
            .on("mouseout", function (d) {
                d3.select(this).style('stroke', 'none');
            });*/

    //what to be displayed in the mouseover "tooltip"
        parent.append("title")
            .text(function(d) { return d.parent.data.name; });

        //apply thumbnail on each video object
        parent.append("g:image")
                .attr("xlink:href", function(d){return d.data.thumbnail_link})
                .attr("width", function(d){ return (d.x1 - d.x0) -1 ;})
                .attr("height",function(d){ return (d.y1 - d.y0) -1 ;});
                //.attr("opacity",0);

    //create a new class to cover the videos att the start
    //size based on number of children in each category
    var grandparent = svg.selectAll("svg")
            .data(root.children).enter().append("svg:g")
            .attr("class", "grandparent")
            .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
            .on("click",function (d) {
                d3.select(this).lower();
                zoom(node == d.parent ? d : d.parent);
                /*treeMap(root.sum(sumSize));*/})

            .on("mouseover", function(d) {
                d3.select(this).select("rect").style('stroke', 'black');
            })

            .on("mouseout", function (d) {
                d3.select(this).select("rect").style('stroke', 'none');
            });

    //creates a rectangle for each category
    grandparent.append("rect")
        .attr("id",function(d,i) { return d.data.id; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill", function(d,i) { return color(d.data.id); });
        /*.on("click",function (d) {return zoom(node == d.parent ? d : d.parent);})
        .on("mouseover", function(d) {
            d3.select(this).style('stroke', 'black');
        })
        .on("mouseout", function (d) {
            d3.select(this).style('stroke', 'none');
        });*/

    grandparent.append("title")
        .text(function(d) { return d.data.name; });


    grandparent.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.data.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.data.id; });

    //writes the category name on each rectangle
    grandparent.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
        .selectAll("tspan")
        .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
        .attr("x", 4)
        .attr("y", function(d, i) { return 13 + i * 10; })
        .text(function(d) { return d; });



    //finds all the videos for each category and make them children
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

    //zooms in on selected category
    function zoom(value)//Modified http://bl.ocks.org/masakick/04ad1502068302abbbcb
    {
        var dx = (value.x1 - value.x0), dy = (value.y1 - value.y0), kx = width/dx, ky = height/dy;
        x.domain([value.x0, value.x1]);
        y.domain([value.y0, value.y1]);

        //console.log(value);

        getCategory(value.data.name);

        //select all the videos
        var t = svg.selectAll("g.parent").transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.y0) + ")"; });

        //scale the video rectangles
        t.select("rect")
            .attr("width", function(d) { return kx * (d.x1 - d.x0) - 1; })
            .attr("height", function(d) { return ky * (d.y1 - d.y0) - 1; });

        //scale text
        t.select("text")
            .attr("x", function(d) { return kx * (d.x1 - d.x0) / 2; })
            .attr("y", function(d) { return ky * (d.y1 - d.y0) / 2; });

        //scale the thumbnails
        t.select("image")
            .attr("width", function(d) { return kx * (d.x1 - d.x0) - 1; })
            .attr("height", function(d) { return ky * (d.y1 - d.y0) - 1; });
            //.attr("opacity",1);
            //.style("opacity", function(d) { return kx * (d.x1 - d.x0) > d.width ? 1 : 0; });

        t.select("title")
            .text(function(d) { return d.data.title; });



        //select all grandparents
        var t2 = svg.selectAll("g.grandparent").transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.y0) + ")"; });

        //scale all the grandparents and set opacity to 0
            t2.select("rect")
                .attr("width", function(d) { return kx * (d.x1 - d.x0) - 1; })
                .attr("height", function(d) { return ky * (d.y1 - d.y0) - 1; })
                .attr("opacity",value.depth == 0 ? 1: 0);


        //value.depth == 1 ? d3.selectAll("g.parent").raise(): d3.selectAll("g.grandparent").raise();
            //Kod för att visa bild
           /* d3.selectAll("g.parent")
                .append("svg:image")
                .attr("xlink:href", "https://i.ytimg.com/vi/gHZ1Qz0KiKM/default.jpg")
                .attr("width", function(d){ return kx * (d.x1 - d.x0) -1 ;})
                .attr("height",function(d){ return ky * (d.y1 - d.y0) -1 ;});*/

        //sets which level of the tree that is active
        node = value;

        d3.event.stopPropagation();

    }

    function changed(sum) {

        //treeMap(root.sum(sum));

        /*var c = svg.selectAll("g.parent").transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.y0) + ")"; });

            c.select("rect")
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("height", function(d) { return d.y1 - d.y0; });*/
    }


    function sumChildren(d)
    {
        return d.children ? 0 : 1;
    }

    function sumSize(d)
    {
        return d.dislikes;
    }


};

