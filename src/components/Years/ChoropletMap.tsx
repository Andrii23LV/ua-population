'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Map } from 'immutable';

export interface RegionData {
  region: string;
  amount: number;
}

interface ChoroplethMapProps {
  data: { _id: string; region: string; amount: number }[];
}


const ChoroplethMap: React.FC<ChoroplethMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    if (data.length === 0) {
      svg.selectAll("*").remove();
      return;
    }

    svg.selectAll("*").remove();

    const projection = d3.geoMercator().scale(2200).center([0, 50]).rotate([-33, 0, 0]);

    const ua = require('@/mock/ua.json');
    const regions = topojson.feature(ua, ua.objects.regions) as any;

    const dataMap = new (Map as any)(
      Object.entries(
        regions.features.reduce((acc: any, d: any) => {
          const regionData = data.find((item) => item.region === d.properties.name);
          return {
            ...acc,
            [d.properties.name]: {
              ...d.properties,
              ...(regionData && { amount: regionData.amount }),
            },
          };
        }, {})
      )
    );

    const amounts = Array.from(dataMap.values(), (d: { [key: string]: any }) => d.amount);

    const currentColor: string[] = Array.from(d3.schemeBlues[7], (color) => color);

    const colorScale = d3
      .scaleQuantize<string>()
      .domain([Math.min(...amounts), Math.max(...amounts)])
      .range(currentColor);

    const path = d3.geoPath().projection(projection);

    const format = (d: number) => `${d}`;

    svg
      .append('g')
      .selectAll('path')
      .data(regions.features)
      .join('path')
      .attr('fill', (d: any) => {
        const regionData = dataMap.get(d.properties.name);
        return regionData ? colorScale(regionData.amount) : '#ccc';
      })
      .attr('d', (d: any) => path(d))
      .append('title')
      .text((d: any) => `${d.properties.name}\n${format(dataMap.get(d.properties.name)?.amount)}`);


    // Add tooltip div element
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', '0')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('background-color', 'white')
      .style('padding', '6px 16px')
      .style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.3)')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('font-size', '14px');


    svg.append('g')
      .selectAll('path')
      .data(regions.features)
      .join('path')
      .attr('fill', (d: any) => colorScale(dataMap.get(d.properties.name)?.amount))
      .attr('d', (d: any) => path(d))
      .attr('stroke', 'none') // Set initial stroke to none
      .on('mouseover', (event, d: any) => {
        // Show tooltip on mouseover
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            `${d.properties.name}<br>${format(
              dataMap.get(d.properties.name)?.amount
            )}`
          )
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');
        d3.select(event.currentTarget).attr('stroke', 'grey'); // Add black border on hover
      })
      .on('mouseout', (event, d) => {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style('opacity', 0);
        d3.select(event.currentTarget).attr('stroke', 'none'); // Clear border on mouse leave
      })

    svg.append('path')
      .datum(topojson.mesh(ua, ua.objects.regions, (a, b) => a !== b))
      .attr('fill', 'none')
      .attr('stroke', 'grey')
      .attr('stroke-linejoin', 'round')
      .attr('d', path);

    const legendContainer = svg.append('g')
      .attr('transform', `translate(20, 520)`); // Adjust position as needed

    const legend = legendContainer.selectAll('.legend-item')
      .data(colorScale.range())
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(${i * 120}, 55)`); // Adjust spacing as needed

    legend.append('rect')
      .attr('width', 40) // Adjust size as needed
      .attr('height', 10) // Adjust size as needed
      .style('fill', (d) => d);

    legend.append('text')
      .attr('x', 20) // Adjust position as needed
      .attr('y', 25) // Adjust position as needed
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .text((d, i) => {
        const extent = colorScale.invertExtent(d);
        if (i === 0) {
          return `<= ${format(Math.round(extent[1]))}`;
        } else if (i === colorScale.range().length - 1) {
          return `>= ${format(Math.round(extent[0]))}`;
        } else {
          return `${format(Math.round(extent[0]))} - ${format(Math.round(extent[1]))}`;
        }
      });


  }, [data]);

  return (
    <svg ref={svgRef} width={800} height={655} className='flex items-center m-auto'>
      <rect width={800} height={500} fill='transparent' />
    </svg>
  );
};

export default ChoroplethMap;
