import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChartVisual = ({ data, selectedResourceIds, selectedDate, onVisualClick }) => {
    const svgRef = useRef();

    useEffect(() => {
        const drawBarChart = () => {
            d3.select(svgRef.current).selectAll('*').remove();
            const width = 400;
            const height = 300;
            const margin = { top: 20, right: 20, bottom: 30, left: 100 };
            const chartWidth = width - margin.left - margin.right;
            const chartHeight = height - margin.top - margin.bottom;
            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height);
            const chart = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);
            let filteredData = data; // Use the data prop passed to the component
            if (selectedResourceIds.length > 0) {
                filteredData = filteredData.filter(data => selectedResourceIds.includes(data['Resource ID']));
            }
            if (selectedDate) {
                filteredData = filteredData.filter(data => data['Days'] === selectedDate);
            }
            const groupedData = d3.group(filteredData, d => d['Days']);
            const aggregatedData = Array.from(groupedData, ([key, value]) => ({
                day: key,
                totalMetrics: d3.sum(value, d => d['Metrics'])
            }));
            const xScale = d3.scaleBand()
                .domain(aggregatedData.map(d => d.day))
                .range([0, chartWidth])
                .padding(0.1);
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(aggregatedData, d => d.totalMetrics)])
                .nice()
                .range([chartHeight, 0]);
            chart.selectAll('.bar')
                .data(aggregatedData)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => xScale(d.day))
                .attr('y', d => yScale(d.totalMetrics))
                .attr('width', xScale.bandwidth())
                .attr('height', d => chartHeight - yScale(d.totalMetrics))
                .attr('fill', 'steelblue')
                .on('click', d => {
                    // Ensure that d.day is defined and not null or undefined before passing it to onVisualClick
                    if (d && d.day) {
                      onVisualClick(d.day);
                    }
                  });
                  
            chart.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${chartHeight})`)
                .call(d3.axisBottom(xScale));
            chart.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(yScale));
        };
        drawBarChart();
    }, [data, selectedResourceIds, selectedDate, onVisualClick]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default BarChartVisual;
