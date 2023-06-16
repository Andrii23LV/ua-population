import React from 'react';
import * as d3 from 'd3';

interface LegendProps {
    colorScale: d3.ScaleQuantize<string>;
}

const LegendChoropletMap: React.FC<LegendProps> = ({ colorScale }) => {
    const colorDomain = colorScale.domain();

    return (
        <div className="legend">
            <div className="legend-items">
                {colorDomain.map((d: number, index: number) => (
                    <div key={index} className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: colorScale(d) }} />
                        <div className="legend-label">{d}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LegendChoropletMap;
