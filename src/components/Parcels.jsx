import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Typography, Alert } from 'antd';
import axios from 'axios';

const { Text } = Typography;

function Parcels() {
  const [parcels, setParcels] = useState([]);
  const [searchTrackingNumber, setSearchTrackingNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8083/api/parcels')
      .then(response => setParcels(response.data))
      .catch(error => console.error('Error fetching parcels:', error));
  }, []);

  const handleSearch = () => {
    if (!searchTrackingNumber) {
      alert('Please enter a tracking number to search.');
      return;
    }

    axios.get(`http://localhost:8083/api/parcels/findByTrackingNumber/${searchTrackingNumber}`)
      .then(response => setSearchResult(response.data))
      .catch(error => {
        console.error('Error searching by tracking number:', error);
        setSearchResult(null);
      });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tracking Number', dataIndex: 'trackingNumber', key: 'trackingNumber' },
    {
      title: 'Owner',
      dataIndex: 'user',
      key: 'owner',
      render: user => user && user.username,
    },
    {
      title: 'Location History',
      dataIndex: 'locationHistory',
      key: 'locationHistory',
      render: (locations) => (
        <ul>
          {locations.map(location => (
            <li key={location.id}>
              {location.locationDescription} - {location.timestamp}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
      render: deliveryStatus => <Text strong>{deliveryStatus}</Text>,
    }
    ,
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => <Text strong>{status}</Text>,
    }
  ];

  return (
    <div style={{ margin: '20px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <label htmlFor="trackingNumberInput" style={{ marginRight: '10px' }}>Search by Tracking Number:</label>
        <Input
          type="text"
          id="trackingNumberInput"
          value={searchTrackingNumber}
          onChange={(e) => setSearchTrackingNumber(e.target.value)}
        />
        <Button type="primary" onClick={handleSearch}>Search</Button>
      </div>

      {searchResult ? (
        <Table
          dataSource={[searchResult]}
          columns={columns}
          pagination={false}
          bordered
        />
      ) : (
        <Alert message="No result found." type="error" showIcon />
      )}

      
    </div>
  );
}

export default Parcels;
