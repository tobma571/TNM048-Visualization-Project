function tm(data,data_category)
{

    var div = '#treemap';

    var smaller_data = data.slice(0,10);

    var parentWidth = $(div).width();
    var parentHeight = $(div).height();

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

    for(var i = 0; i < data_category.items.length; i++)
    {
        var sum = 0;
        for(var j = 0; j < smaller_data.length; j++)
        {
            if(data_category.items[i].id == smaller_data[j].category_id)
                sum++;
        }
        cat_rate.push(sum);
    }


    var categories = data_category.items.map(function (value, i) {
        return {"id": value.id, "title": value.snippet.title, "rate": cat_rate[i]};
    });


    var stratify = d3.stratify()
        .parentId(function (d) {
            return d.title;
        })

    var root = stratify(categories)
        .sum(function(d) { return d.rate; })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

};