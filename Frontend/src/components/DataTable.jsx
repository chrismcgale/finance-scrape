import React, { useEffect, useState } from 'react';
import axios from '../services/Api';


const DataTable = () => {
    const [companyData, setCompanyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const tableHeaders = [];

    useEffect(() => {
        const getCompanyData = async () => {
            try {
                const { data: dataSet } = await axios.get('/companies');
                setCompanyData(dataSet);
                setIsLoading(false);
            }
        };

        getCompanyData();
    })

    return (
        <div className='table-container'>
            <table>
                {tableHeaders.map((header) => <th>{header}</th>).join('')}
                {isLoading ? (
                    <LoadingIcon />
                ) : (
                        companyData.map(({_id, Name, Symbol}) => {
                            <tr id={comp._id}>
                                <td>{Name}</td>
                                <td>{Symbol}</td>
                            </tr>
                        }
                ).join('') 
            )}
        </table>
        </div>
    )
};

export default DataTable;