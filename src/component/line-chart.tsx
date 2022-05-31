import React, { useEffect, useRef } from 'react'
import { Chart } from '../module/chart';
import * as d3 from 'd3';


type Datum = { x: number, y: number }


export default function LineChart(props: { data: Chart[] }) {

    const d3Ref = useRef<SVGSVGElement>(null)
    console.log(props.data);

    const data = //props.data
        [
            { x: 1, y: 5 },
            { x: 20, y: 20 },
            { x: 40, y: 10 },
            { x: 60, y: 40 },
            { x: 80, y: 5 },
            { x: 100, y: 60 },
        ]

    useEffect(() => {

        if (props.data) {
            //setup chart 
            const margin = { top: 20, right: 30, bottom: 30, left: 30 }
            const width = 800
            const height = 500


            const innerHeight = height - margin.top - margin.bottom
            const innerWidth = width - margin.left - margin.right
            // // Set up chart
            const svg = d3.select(d3Ref.current!)
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            // // // x axis scale 
            // // const x = d3.scaleTime()
            // //     .domain(d3.extent(data, function (d) { return d.x))
            // //     .range([0, width])

            // // svg.append('g')
            // //     .attr('transform', 'translate(0,' + height + ')')
            // //     .call(d3.axisBottom(x))

            // Get the max value of counts
            const max = d3.max(data, function (d) { return d.y })

            // y axis scale 
            const y = d3.scaleLinear()
                .domain([0, max ?? 0])
                .range([0, innerHeight])

            console.log(y.ticks());


            svg.append('g')
                .call(d3.axisLeft(y))

            // const lineGenerator = d3.line<Datum>()
            //     .x((d: any) => d.x)
            //     .y((d: any) => d.y)

            // // Draw line
            // svg.append('path')
            //     .datum(data)
            //     .attr('fill', 'none')
            //     .attr('stroke', 'red')
            //     .attr('stroke-width', 3)
            //     .attr('d', lineGenerator)

            // .attr('d', d3.line()
            //     .x(function (d) { return x(d.date) })
            //     .y(function (d) { return y(d.temp) })
            // )

        }



    }, [])


    return (
        <div className='d3demo'>

            <svg ref={d3Ref} ></svg>

        </div>
    )
}
