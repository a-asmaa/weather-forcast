import React, { useEffect, useRef } from 'react'
import { Chart } from '../module/chart';
import * as d3 from 'd3';
//import _data from '../module/aapl.json'


type Datum = { x: number, y: number }

export default function LineChart(props: { data: Chart[], type: string }) {

    const d3Ref = useRef<SVGSVGElement>(null)

    const data = props.data
    // [
    //     {
    //         "date": "2022-06-01",
    //         "temp": 28
    //     },
    //     {
    //         "date": "2022-06-02",
    //         "temp": 28
    //     },
    //     {
    //         "date": "2022-06-03",
    //         "temp": 30
    //     },
    //     {
    //         "date": "2022-06-04",
    //         "temp": 30
    //     },
    //     {
    //         "date": "2022-06-05",
    //         "temp": 29
    //     },
    //     {
    //         "date": "2022-06-06",
    //         "temp": 28
    //     },
    //     {
    //         "date": "2022-06-07",
    //         "temp": 27
    //     }
    // ]


    useEffect(() => {
        console.log('data', data);

        const createGraph = async () => {
            // read from csv and format variables
            //  let data = await d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv')

            let parseTime = props.type === "hour" ? d3.timeParse("%I %p%I:%M") : props.type === "month" ? d3.timeParse("%B") : d3.timeParse("%Y-%m-%d")

            data.forEach((d: any) => {

                d.date = parseTime(d.date);
                d.temp = +d.temp;
            });
            console.log(data)

            // set the dimensions and margins of the graph
            var margin = { top: 20, right: 20, bottom: 50, left: 70 },
                width = 760 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            const svg = d3.select(d3Ref.current!)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
            // .on("pointerenter pointermove", pointermoved)
            // .on("pointerleave", pointerleft)
            // .on("touchstart", event => event.preventDefault());
            // Add X axis and Y axis
            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);
            x.domain(d3.extent(data, function (d: any) { return d.date }) as [Date, Date]);

            const max = d3.max(data, function (d: any) { return d.temp })

            y.domain([20, max + 2]);
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
                .data([data])
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .attr("d", valueLine)


        }

        if (props.data) {
            //setup chart 
            // const margin = { top: 20, right: 30, bottom: 30, left: 30 }
            // const width = 700
            // const height = 500

            // const innerHeight = height - margin.top - margin.bottom
            // const innerWidth = width - margin.left - margin.right
            // // // // Set up chart
            // const svg = d3.select(d3Ref.current!)
            //     .attr('width', width + margin.left + margin.right)
            //     .attr('height', height + margin.top + margin.bottom)
            //     .append('g')
            //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // // // // x axis scale 
            // const max2 = d3.max(data, function (d) { return d.x })

            // // // y axis scale 
            // const x = d3.scaleLinear()
            //     .domain([0, max2 ?? 0])
            //     .range([innerWidth, 0])


            // svg.append('g')
            //     .attr('transform', 'translate(0,' + height + ')')
            //     .call(d3.axisBottom(x))

            // // Get the max value of counts
            // const max = d3.max(data, function (d) { return d.y })

            // // // y axis scale 
            // const y = d3.scaleLinear()
            //     .domain([0, max ?? 0])
            //     .range([innerHeight, 0])

            // // console.log(y.ticks());


            // svg.append('g')
            //     .call(d3.axisLeft(y))

            // // const lineGenerator = d3.line<Datum>()
            // //     .x((d: any) => d.x)
            // //     .y((d: any) => d.y)

            // // // Draw line
            // // svg.append('path')
            // //     .datum(data)
            // //     .attr('fill', 'none')
            // //     .attr('stroke', 'red')
            // //     .attr('stroke-width', 3)
            // //     .attr('d', lineGenerator)

            // // .attr('d', d3.line()
            // //     .x(function (d) { return x(d.date) })
            // //     .y(function (d) { return y(d.temp) })
            // // )

            createGraph();
        }

    }, [])


    return (
        <div className='d3demo'>
            <svg ref={d3Ref} ></svg>
        </div>
    )
}
