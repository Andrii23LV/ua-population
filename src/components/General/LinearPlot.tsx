'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PlotProps {
    data: { year: number; population: number }[];
}

const LinearPlot: React.FC<PlotProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current || !data || data.length === 0) return;

        const svg = d3.select(svgRef.current);

        // Clear previous contents
        svg.selectAll('*').remove();

        // Set up the plot dimensions and margins
        const width = 700;
        const height = 300;
        const margin = { top: 0, right: 10, bottom: 30, left: 70 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create x and y scales
        const xScale = d3
            .scaleLinear()
            .domain([d3.min(data, (d) => d.year) || 0, d3.max(data, (d) => d.year) || 0]).nice()
            .range([margin.left, innerWidth + margin.left]);

        const minPopulation = Math.min(...data.map((d) => d.population));

        const yScale = d3
            .scaleLinear()
            .domain([minPopulation, d3.max(data, (d) => d.population) || 0])
            .range([innerHeight, 0]);

        // Create x and y axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(data.length);
        const yAxis = d3.axisLeft(yScale);

        // Append the axes to the SVG
        svg
            .append('g')
            .attr('transform', `translate(0, ${innerHeight + margin.top})`)
            .call(xAxis);

        svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);

        // Create the line generator
        const line = d3
            .line<{ year: number; population: number }>()
            .x((d) => xScale(d.year))
            .y((d) => yScale(d.population));

        // Append the line to the SVG
        const path = svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('d', line);


        const gradient = svg
            .append('linearGradient')
            .attr('id', 'line-gradient')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', yScale(yScale.domain()[0]))
            .attr('x2', 0)
            .attr('y2', yScale(yScale.domain()[1]));

        gradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'blue');

        gradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'red');

        // Apply the gradient to the line
        path.attr('stroke', 'url(#line-gradient)');

        svg
            .selectAll('.vertical-line')
            .data(data)
            .enter()
            .append('line')
            .attr('class', 'vertical-line')
            .attr('x1', (d) => xScale(d.year))
            .attr('y1', innerHeight + margin.top)
            .attr('x2', (d) => xScale(d.year))
            .attr('y2', (d) => yScale(d.population))
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3');
    }, [data]);

    return <svg ref={svgRef} width={700} height={300} />;
};

export default LinearPlot;
