import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface Data {
    _id: string;
    region: string;
    amount: number;
}

interface BarChartProps {
    data: Data[];
}
const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const [sortedData, setSortedData] = useState(data);
    const svgRef = useRef<SVGSVGElement>(null);

    const updateChart = (data: BarChartProps['data']) => {
        const svg = d3.select(svgRef.current);
        if (data.length === 0) {
            svg.selectAll("*").remove();
            return;
        }

        svg.selectAll("*").remove();

        // Define chart dimensions
        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 40, bottom: 80, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create x and y scales
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.region))
            .range([0, innerWidth])
            .padding(0.21);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d: any) => d.amount)])
            .range([innerHeight, 0]);

        // Create x and y axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Append chart elements
        const g = svg
            .append('g')
            .attr('fill', '#69b3a2')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .style('font-size', '9px')
            .attr('dx', '-0.7em')
            .attr('dy', '0.15em')
            .attr('transform', 'rotate(-45)');

        g.append('g').attr('class', 'y-axis').call(yAxis);

        // Append bars
        g
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => xScale(d.region)!)
            .attr('y', (d) => yScale(d.amount))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => innerHeight - yScale(d.amount))
            .on('mouseover', function (event, d) {
                d3.select(this).attr('fill', 'grey');
                g.append('text')
                    .attr('class', 'hover-label')
                    .attr('x', xScale(d.region)! + xScale.bandwidth() / 2)
                    .attr('y', yScale(d.amount) - 5)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'black')
                    .text(d.amount);
                g.selectAll('.bar')
                    .filter((barData) => barData !== d)
                    .attr('opacity', 0.5);
            })
            .on('mouseout', function (event, d) {
                d3.select(this).attr('fill', '#69b3a2');
                g.selectAll('.hover-label').remove();
                g.selectAll('.bar').attr('opacity', 1);
            });
    };

    const handleSortDescending = () => {
        const sorted = [...sortedData].sort((a, b) => b.amount - a.amount);
        setSortedData(sorted);
    };

    const handleSortAlphabetic = () => {
        const sorted = [...sortedData].sort((a, b) =>
            a.region.localeCompare(b.region)
        );
        setSortedData(sorted);
    };

    const handleSortAscending = () => {
        const sorted = [...sortedData].sort((a, b) => a.amount - b.amount);
        setSortedData(sorted);
    };

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    useEffect(() => {
        updateChart(sortedData);
    }, [sortedData]);
    return (
        <div>
            <svg ref={svgRef} width={400} height={300} />
            <div className='flex justify-center gap-2'>
                <button onClick={handleSortDescending} className='blue_btn_l'>Descending</button>
                <button onClick={handleSortAscending} className='blue_btn_l'>Ascending</button>
                <button onClick={handleSortAlphabetic} className='blue_btn_l'>Alphabetic</button>
            </div>
        </div>
    );
};

export default BarChart;
