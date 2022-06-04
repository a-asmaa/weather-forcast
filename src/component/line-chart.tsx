import React, { useEffect, useRef } from 'react'
import { Chart } from '../module/chart';
import * as d3 from 'd3';


type Datum = { x: number, y: number }

export default function LineChart(props: { data: Chart[], type: string }) {

    const d3Ref = useRef<SVGSVGElement>(null)
    const data = props.data

    useEffect(() => {

        const createGraph = async () => {

            let parseTime = props.type === "Daily" ? d3.timeParse("%H%M") : props.type === "Monthly" ? d3.timeParse("%B") : d3.timeParse("%Y-%m-%d")

            let _list: any[] = data.map((d: any) => {
                return {

                    date: parseTime(d.date),
                    temp: d.temp
                }
            })

            console.log(data, _list, props.type);

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
            x.domain(d3.extent(_list, function (d: any) { return d.date }) as [Date, Date]);

            const max = d3.max(_list, function (d: any) { return d.temp })

            y.domain([10, max + 2]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(g => g.append("text")
                    .attr("x", -50)
                    .attr("y", -height)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Temp"))
                .call(d3.axisBottom(x));
            svg.append("g")
                .call(d3.axisLeft(y));


            // add the Line
            var valueLine: any = d3.line()
                .x((d: any) => { return x(d.date); })
                .y((d: any) => { return y(d.temp); });

            svg.append("path")
                .data([_list])
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .attr("d", valueLine)


        }

        if (props.data.length !== 0) {

            console.log(props.data);
            createGraph();
        }

    }, [data])


    return (
        <div className='d3demo'>
            <svg ref={d3Ref} ></svg>
        </div>
    )
}
