import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const dataSet = [
    { "Resource ID": 12111, "Days": "Monday", "Metrics": 25000, "Allocation ID": 141312 },
    { "Resource ID": 12112, "Days": "Tuesday", "Metrics": 500000, "Allocation ID": 141313 },
    { "Resource ID": 12113, "Days": "Wednesday", "Metrics": 15000, "Allocation ID": 141314 },
    { "Resource ID": 12114, "Days": "Thursday", "Metrics": 65000, "Allocation ID": 141315 },
    { "Resource ID": 12115, "Days": "Friday", "Metrics": 50000, "Allocation ID": 141316 },
    { "Resource ID": 12116, "Days": "Saturday", "Metrics": 10000, "Allocation ID": 141317 }
];

const CardVisual = () => {
    const svgRef1 = useRef();
    const svgRef2 = useRef();
    const svgRef3 = useRef();
    const svgRef4 = useRef();
    const [filteredData, setFilteredData] = useState(dataSet);

    useEffect(() => {
        const drawCardVisual = (svgRef, data) => {
            const svg = d3.select(svgRef.current);

            // Clear previous drawings
            svg.selectAll('*').remove();

            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 200 - margin.left - margin.right;
            const height = 150 - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .rangeRound([height, 0]);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            x.domain(data.map(d => d['Days']));
            y.domain([0, d3.max(data, d => d['Metrics'])]);

            g.append('g')
                .attr('class', 'axis axis-x')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            g.append('g')
                .attr('class', 'axis axis-y')
                .call(d3.axisLeft(y).ticks(5));

            g.selectAll('.bar')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d['Days']))
                .attr('y', d => y(d['Metrics']))
                .attr('width', x.bandwidth())
                .attr('height', d => height - y(d['Metrics']))
                .attr('fill', 'steelblue');
        };

        drawCardVisual(svgRef1, filteredData);
        drawCardVisual(svgRef2, filteredData);
        drawCardVisual(svgRef3, filteredData);
        drawCardVisual(svgRef4, filteredData);
    }, [filteredData]);

    const handleFilter = (filterDay) => {
        const filtered = dataSet.filter(d => d['Days'] === filterDay);
        setFilteredData(filtered);
    };

    return (
        <div>
            <button onClick={() => handleFilter('Monday')}>Monday</button>
            <button onClick={() => handleFilter('Tuesday')}>Tuesday</button>
            <button onClick={() => handleFilter('Wednesday')}>Wednesday</button>
            <button onClick={() => handleFilter('Thursday')}>Thursday</button>
            <button onClick={() => handleFilter('Friday')}>Friday</button>
            <button onClick={() => handleFilter('Saturday')}>Saturday</button>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <svg ref={svgRef1} width={200} height={150}></svg>
                <svg ref={svgRef2} width={200} height={150}></svg>
                <svg ref={svgRef3} width={200} height={150}></svg>
                <svg ref={svgRef4} width={200} height={150}></svg>
            </div>
        </div>
    );
};

export default CardVisual;
