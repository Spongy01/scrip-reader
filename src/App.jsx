import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Input from './components/Input';
const App = () => {
  const [excelData, setExcelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [inputs, setInputs] = useState({
    'BSE?NSE': '',
    'Instrument Name (optidx)': 'OPTIDX',
    'Instrument Custom Symbol': '',
    'Month': '',
    'Date' : '',
    'Strike' : '',

  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data =event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_row_object_array(firstSheet);
      console.log("JSON SIZE : " + jsonData.length)
      console.log("JSON OBJECT : " + jsonData)
      setExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleFilter = () => {
    

    const filtered = excelData.filter(row => {
      const semCustomSymbol = row['SEM_CUSTOM_SYMBOL'] ? row['SEM_CUSTOM_SYMBOL'].split(' ') : [];
      return (
      
        (!inputs["BSE?NSE"] || (row['SEM_EXM_EXCH_ID'] && row['SEM_EXM_EXCH_ID'].toString().toLowerCase().includes(inputs["BSE?NSE"].toLowerCase()))) &&
        (!inputs["Instrument Name (optidx)"]|| (row['SEM_INSTRUMENT_NAME'] && row['SEM_INSTRUMENT_NAME'].toString().toLowerCase().includes(inputs["Instrument Name (optidx)"].toLowerCase()))) &&
        (!inputs['Instrument Custom Symbol'] || (semCustomSymbol[0] && semCustomSymbol[0].toString().toLowerCase().includes(inputs['Instrument Custom Symbol'].toLowerCase()))) &&
        (!inputs['Month'] || (semCustomSymbol[2] && semCustomSymbol[2].toString().toLowerCase().includes(inputs['Month'].toLowerCase()))) &&
        (!inputs['Date'] || (semCustomSymbol[1] && semCustomSymbol[1].toString().toLowerCase().includes(inputs['Date'].toLowerCase()))) &&
        (!inputs['Strike'] || (semCustomSymbol[3] && semCustomSymbol[3].toString().toLowerCase().includes(inputs['Strike'].toLowerCase())))
      );
    });
    setFilteredData(filtered);
    console.log("Filtered the data")
    console.log("Filtered Size : " + filtered.length)
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied to clipboard: ${text}`);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      <h1>Fetch Scrips</h1>
      <input type="file" onChange={handleFileUpload} />
      <div>
        <Input
          name="BSE?NSE"
          value={inputs["BSE?NSE"]}
          onChange={handleInputChange}
          placeholder="BSE?NSE"
        />
        <Input
          name="Instrument Name (optidx)"
          value={inputs["Instrument Name (optidx)"]}
          onChange={handleInputChange}
          placeholder="Instrument Name (optidx)"
        />
        <Input
          name="Instrument Custom Symbol"
          value={inputs["Instrument Custom Symbol"]}
          onChange={handleInputChange}
          placeholder="Instrument Custom Symbol"
        />
        <Input
          name="Month"
          value={inputs["Month"]}
          onChange={handleInputChange}
          placeholder="Month"
        />
        <Input
          name="Date"
          value={inputs["Date"]}
          onChange={handleInputChange}
          placeholder="Date"
        />
        <Input
          name="Strike"
          value={inputs["Strike"]}
          onChange={handleInputChange}
          placeholder="Strike"
        />
        <button onClick={handleFilter}>Filter</button>
      </div>
      <div>
        <h2>Filtered Results:  <span>Count {filteredData.length  }</span> </h2>
        <ul>
          {currentItems.map((row, index) => (
            <li key={index}>
              <span
                onClick={() => copyToClipboard(row['Watchlist Item'])} style={{ cursor: 'pointer' }}
              >{row['Watchlist Item']}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span> Page {currentPage} </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={endIndex >= filteredData.length}
          >
            Next
          </button>
        </div>


    </div>
  );
};

export default App;
