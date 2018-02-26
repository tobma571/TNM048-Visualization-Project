function tm(data)
{

    var div = '#treemap';

    var parentWidth = $(div).parent().width();
    var margin = {top: 0, right: 0, bottom: 0, left: 500},
        width = parentWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height);
};