'use client';

import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';

export interface Data {
    region: string;
    amount: number;
}

interface Props {
    data: Data[];
}

const CircularBarplot: React.FC<Props> = ({ data }) => {
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [hoveredAmount, setHoveredAmount] = useState<number | null>(null);

    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (data.length === 0) {
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        }

        d3.select(svgRef.current).selectAll("*").remove();

        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const width = 400 - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;
        const innerRadius = 70;
        const outerRadius = Math.min(width, height) / 2.75;

        const svg = d3
            .select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

        const x = d3
            .scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(data.map((d) => d.region));

        const y = d3
            .scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, d3.max(data, (d) => d.amount) || 0]);

        const onMouseOver = (event: MouseEvent, d: Data) => {
            const path = event.target as SVGPathElement;
            const originalRadius = y(d.amount) as number;
            const increasedRadius = originalRadius + 5;
            const originalFill = d3.select(path).attr('fill');

            d3.select(path)
                .attr('fill', 'grey')
                .attr('d', (d: any) => {
                    const startAngle = x(d.region) as number;
                    const endAngle = x(d.region) as number + x.bandwidth() as number;
                    const arcGenerator = d3.arc<Data>()
                        .innerRadius(innerRadius)
                        .outerRadius(increasedRadius)
                        .padAngle(0.04)
                        .padRadius(innerRadius);

                    return arcGenerator({ startAngle, endAngle } as any) as string;
                });

            setHoveredRegion(d.region);
            setHoveredAmount(d.amount);
        };

        const onMouseLeave = (event: MouseEvent, d: Data) => {
            const path = event.target as SVGPathElement;

            d3.select(path)
                .attr('fill', '#3e3e59')
                .attr('d', (d: any) => {
                    const startAngle = x(d.region) as number;
                    const endAngle = x(d.region) as number + x.bandwidth() as number;
                    const arcGenerator = d3.arc<Data>()
                        .innerRadius(innerRadius)
                        .outerRadius(y(d.amount) as number)
                        .padAngle(0.04)
                        .padRadius(innerRadius);

                    return arcGenerator({ startAngle, endAngle } as any) as string;
                });

            setHoveredRegion(null);
            setHoveredAmount(null);
        };

        svg.selectAll('path')
            .data<Data>(data)
            .enter()
            .append('path')
            .attr('fill', '#3e3e59')
            .attr('d', (d: any) => {
                const startAngle = x(d.region) as number;
                const endAngle = x(d.region) as number + x.bandwidth() as number;
                const arcGenerator = d3.arc<Data>()
                    .innerRadius(innerRadius
                    )
                    .outerRadius(y(d.amount) as number)
                    .padAngle(0.04)
                    .padRadius(innerRadius);
                return arcGenerator({ startAngle, endAngle } as any) as string;
            })
            .on('mouseover', onMouseOver)
            .on('mouseleave', onMouseLeave);


        svg.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('text-anchor', (d: any) => {
                const xValue = x(d.region);
                if (d.region !== undefined && xValue !== undefined) {
                    return (xValue + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? 'end' : 'start';
                }
                return 'start';
            })
            .attr('transform', (d: any) => {
                const xValue = x(d.region);
                if (d.region !== undefined && xValue !== undefined) {
                    const barAngle = xValue + x.bandwidth() / 2;
                    const turnLabelUpsideDown = (barAngle + Math.PI) % (2 * Math.PI) < Math.PI;
                    const labelRotation = (barAngle * 180) / Math.PI - 90 + (turnLabelUpsideDown ? 180 : 0);
                    const labelXTranslation = (turnLabelUpsideDown ? -1 : 1) * (y(d.amount) + 10);
                    return `rotate(${labelRotation}), translate(${labelXTranslation}, 0)`;
                }
                return '';
            })
            .text((d: any) => {
                if (d.region !== undefined) {
                    return d.region;
                }
                return '';
            })
            .style('font-size', '12px')
            .attr('alignment-baseline', 'middle');

    }, [data]);

    const width = 460;
    const height = 460;

    return <svg ref={svgRef} width={width} height={height}>
        {hoveredRegion && (
            <text
                x={width / 2 - 30}
                y={height / 2 - 50}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24px"
            >
                {hoveredAmount}
            </text>
        )}
    </svg>;
};

export default CircularBarplot;
