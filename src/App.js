import React, { useState, useEffect } from "react";
import CardVisual from "./components/CardVisual";
import BarChartVisual from "./components/BarChartVisual";
import TableVisual from "./components/TableVisual";
import { dataSet } from "./utlis/dataSet";
import Select from "react-select";
import './css/app.css'

const App = () => {
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState(dataSet);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const applyFilters = (filterType, filterValue) => {
    if (filterType === "resourceIds") {
      setSelectedResourceIds(filterValue);
    } else if (filterType === "date") {
      setSelectedDate(filterValue);
    }
  };

  const handleResourceIdChange = (selectedOptions) => {
    setSelectedResourceIds(selectedOptions.map((option) => option.value));
  };

  const handleDateChange = (selectedOption) => {
    setSelectedDate(selectedOption ? selectedOption.value : null);
  };

  const handleVisualClick = (value, type) => {
    console.log("Clicked value:", value); 

    let newFilteredData = dataSet.filter((item) => {
      if (type === "barChart") {
        return (
          item["Days"] === value &&
          (selectedResourceIds.length === 0 ||
            selectedResourceIds.includes(item["Resource ID"])) &&
          (!selectedDate || item["Days"] === selectedDate)
        );
      } else if (type === "table") {
        return (
          item["Resource ID"] === value["Resource ID"] &&
          (!selectedDate || item["Days"] === selectedDate)
        );
      } else if (type === "card") {
        return (
          item === value &&
          (selectedResourceIds.length === 0 ||
            selectedResourceIds.includes(item["Resource ID"])) &&
          (!selectedDate || item["Days"] === selectedDate)
        );
      }
      return true;
    });
    setData(newFilteredData);
    if (type === "barChart") {
      const tableFilteredData = dataSet.filter(
        (item) => item["Resource ID"] === value["Resource ID"]
      );
      setTableData(tableFilteredData);
    }
  };

  return (
    <div>
      <div className="filter-container">
        <label htmlFor="resourceIdFilter">Filter by Resource ID:</label>
        <Select
          id="resourceIdFilter"
          isMulti
          options={dataSet.map((data) => ({
            value: data["Resource ID"],
            label: data["Resource ID"],
          }))}
          onChange={handleResourceIdChange}
        />
      </div>
      <br/>
      <div className="filter-container">
        <label htmlFor="dateFilter">Filter by Date:</label>
        <Select
          id="dateFilter"
          options={dataSet.map((data) => ({
            value: data["Days"],
            label: data["Days"],
          }))}
          onChange={handleDateChange}
          isClearable={true}
        />
      </div>
      <CardVisual
        data={data}
        onFilter={applyFilters}
        selectedResourceIds={selectedResourceIds}
        selectedDate={selectedDate}
        onVisualClick={(value) => handleVisualClick(value, "card")}
      />
      <BarChartVisual
        data={data}
        onFilter={applyFilters}
        selectedResourceIds={selectedResourceIds}
        selectedDate={selectedDate}
        onVisualClick={(value) => handleVisualClick(value, "barChart")}
      />
      <TableVisual
        data={tableData}
        selectedResourceIds={selectedResourceIds}
        selectedDate={selectedDate}
        onVisualClick={(value) => handleVisualClick(value, "table")}
      />
    </div>
  );
};

export default App;
