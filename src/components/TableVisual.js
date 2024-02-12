import React, { useEffect, useState } from 'react';
import '../css/table.css'

const TableVisual = ({ data, selectedResourceIds, selectedDate, onVisualClick }) => {
    const [filteredData, setFilteredData] = useState([]);

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

    const handleValueClick = (value) => {
        onVisualClick(value, 'table');
    };

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Resource ID</th>
                        <th>Days</th>
                        <th>Metrics</th>
                        <th>Allocation ID</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index} onClick={() => handleValueClick(item)}>
                            <td>{item['Resource ID']}</td>
                            <td>{item['Days']}</td>
                            <td>{item['Metrics']}</td>
                            <td>{item['Allocation ID']}</td>
                            <td>{item['Status']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableVisual;
