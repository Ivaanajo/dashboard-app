import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const CardVisual = ({ data, selectedResourceIds, selectedDate, onVisualClick }) => {
    const svgRef1 = useRef();
    const svgRef2 = useRef();
    const svgRef3 = useRef();
    const svgRef4 = useRef();
    const [filteredData, setFilteredData] = useState(data);
    const [totalResources, setTotalResources] = useState(0);
    const [dailyAverageMetrics, setDailyAverageMetrics] = useState(0);
    const [allocatedResources, setAllocatedResources] = useState(0);
    const [yetToAllocate, setYetToAllocate] = useState(0);

    useEffect(() => {
        let filtered = data;
        if (selectedResourceIds.length > 0) {
            filtered = filtered.filter(data => selectedResourceIds.includes(data['Resource ID']));
        }
        if (selectedDate) {
            filtered = filtered.filter(data => data['Days'] === selectedDate);
        }
        setFilteredData(filtered);
    }, [data, selectedResourceIds, selectedDate]);

    useEffect(() => {
        const totalResourcesCount = filteredData.length;
        const totalMetrics = filteredData.reduce((acc, cur) => acc + cur.Metrics, 0);
        const averageMetrics = totalMetrics / totalResourcesCount;
        const allocatedResourcesCount = filteredData.filter(data => data.Status === 'Allocated').length;
        const yetToAllocateCount = filteredData.filter(data => data.Status === 'Yet2Allocate').length;
        setTotalResources(totalResourcesCount);
        setDailyAverageMetrics(Math.round(averageMetrics));
        setAllocatedResources(allocatedResourcesCount);
        setYetToAllocate(yetToAllocateCount);
    }, [filteredData]);

    useEffect(() => {
        const drawCardVisual = (svgRef, title, value) => {
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();
            const width = 200;
            const height = 150;
            svg.append('rect')
                .attr('x', 10)
                .attr('y', 10)
                .attr('width', width - 20)
                .attr('height', height - 20)
                .attr('fill', 'lightblue')
                .attr('stroke', 'black')
                .attr('rx', 10)
                .attr('ry', 10);
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height / 2 - 10)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .text(title)
                .style('font-size', '16px');
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height / 2 + 20)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .text(value)
                .style('font-size', '24px');
        };
        drawCardVisual(svgRef1, 'Total Resources', totalResources);
        drawCardVisual(svgRef2, 'Daily Average Metrics', dailyAverageMetrics);
        drawCardVisual(svgRef3, 'Allocated Resources', allocatedResources);
        drawCardVisual(svgRef4, 'Yet to Allocate', yetToAllocate);
    }, [totalResources, dailyAverageMetrics, allocatedResources, yetToAllocate]);

    const handleValueClick = (item) => {
        onVisualClick(item, 'card');
    };

    return (
        <div>
            {filteredData.map((item, index) => (
                <div key={index} onClick={() => handleValueClick(item)}>
                    <div> {item['Total Resources']}</div>
                    <div> {item['Daily Average Metrics']}</div>
                    <div> {item['Allocated Resources']}</div>
                    <div> {item['Yet to Allocate']}</div>
                </div>
            ))}
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
