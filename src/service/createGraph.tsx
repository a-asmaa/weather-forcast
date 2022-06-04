import * as d3 from 'd3';


export const createGraph = (data: any[]) => {
    // read from csv and format variables
    //  let data = await d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv')
    // let parseTime = d3.timeParse("%Y-%m-%d");
    // console.log(data)

    // data.forEach((d: any) => {

    //     d.date = parseTime(d.date);
    //     d.temp = +d.temp;
    // });
    console.log(data)

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // const svg = d3.select(d3Ref.current!)
    const svg = d3.create("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis and Y axis
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    x.domain(d3.extent(data, function (d: any) { return d.date }) as [Date, Date]);

    const max = d3.max(data, function (d: any) { return d.temp })


    y.domain([0, max]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    svg.append("g")
        .call(d3.axisLeft(y));


    // add the Line
    var valueLine: any = d3.line()
        .x((d: any) => { return x(d.date); })
        .y((d: any) => { return y(d.temp); });

    svg.append("path")
        .datum([data])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", valueLine)


    return svg.node()

}
