'use client';

'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StackedBarChartProps {
    data: { year: number; population: number }[];
}

const VerticalStackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (chartRef.current && data) {
            // Create the chart
            createChart();
        }
    }, [data]);

    const createChart = () => {

        d3.select(chartRef.current).selectAll("*").remove();
        // Chart dimensions
        const width = 350;
        const height = 400;
        const margin = { top: 20, right: 50, bottom: 40, left: 60 };

        // Calculate the maximum population value
        const maxPopulation = d3.max(data, (d) => d.population) || 0;

        // Create the x-axis scale
        const xScale = d3
            .scaleLinear()
            .domain([0, maxPopulation])
            .range([margin.left, width - margin.right])

        // Create the y-axis scale
        const yScale = d3
            .scaleBand<number>()
            .domain(data.map((d) => d.year))
            .range([height - margin.bottom, margin.top])
            .padding(0.25);

        // Create the color scale
        const colorScale = d3.scaleOrdinal<string>(d3.schemeSet3);
        // Create the SVG chart
        const svg = d3.select(chartRef.current).attr('width', width).attr('height', height);

        // Create the bars
        svg
            .selectAll<SVGRectElement, { year: number; population: number }>('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', margin.left)
            .attr('y', (d) => yScale(d.year) || 0)
            .attr('width', (d) => xScale(d.population) - margin.left)
            .attr('height', yScale.bandwidth())
            .attr('fill', (d) => (colorScale(d.year.toString())));

        // Create the x-axis
        const xAxis = d3.axisBottom(xScale).tickFormat((d: any) => `${(d / 1000000).toLocaleString()}M`);
        svg
            .append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        // Create the y-axis
        const yAxis = d3.axisLeft(yScale);
        svg
            .append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis);

        // Create the population labels
        svg
            .selectAll<SVGTextElement, { year: number; population: number }>('.population-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'population-label')
            .attr('x', (d) => xScale(d.population) + 6)
            .attr('y', (d) => yScale(d.year) || 0)
            .attr('text-anchor', 'start')
            .style('font-size', '8px')
            .text((d) => d.population.toLocaleString());
    };

    return <svg ref={chartRef} />;
};

export default VerticalStackedBarChart;
