import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Space, Button, Input, notification, Modal, Form, DatePicker } from 'antd';

const { Search } = Input;

const baseUrl = 'http://localhost:8083';

const ParcelManagement = () => {
  const [parcels, setParcels] = useState([]);
  const [newParcel, setNewParcel] = useState({
    trackingNumber: '',
    destination: '',
    status: '',
    userEmail: '', // Updated field name
  });
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const formRef = useRef();

  const showModal = (parcel) => {
    setSelectedParcel(parcel);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleUpdateStatus = (parcelId, newStatus) => {
    // Send a PUT request to update the status of a parcel
    axios.put(`${baseUrl}/api/parcels/${parcelId}/updateStatus`, { status: newStatus })
      .then(response => {
        // Find the updated parcel in the list and update its status
        setParcels(prevParcels => prevParcels.map(parcel => 
          parcel.id === parcelId ? { ...parcel, status: newStatus } : parcel
        ));
        notification.success({
          message: 'Status Updated',
          description: 'Parcel status has been successfully updated.',
        });
      })
      .catch(error => {
        console.error('Error updating status:', error);
        notification.error({
          message: 'Error',
          description: 'An error occurred while updating the parcel status. Please try again.',
        });
      });
  };

  const handleAddLocation = (values) => {
    // Create an object with the expected structure of the request body
    const locationData = {
      locationDescription: values.locationDescription,
      timestamp: values.timestamp.format(), // Assuming timestamp is a string in the required format
    };
  
    // Send a POST request to add a location entry
    axios.post(`${baseUrl}/api/locations?parcelId=${selectedParcel.id}`, locationData)
      .then(response => {
         // Update the location history of the selected parcel immediately
         setSelectedParcel(prevParcel => ({
          ...prevParcel,
          locationHistory: [...prevParcel.locationHistory, response.data],
        }));
        notification.success({
          message: 'Location Added',
          description: 'Location entry has been successfully added.',
        });
        
        formRef.current.resetFields(); // Clear the form fields
        
      })
      .catch(error => {
        console.error('Error adding location:', error);
        notification.error({
          message: 'Error',
          description: 'An error occurred while adding the location entry. Please try again.',
        });
      });
  };
  

  const handleDeleteLocation = (locationId) => {
    // Send a DELETE request to remove a location entry
    axios.delete(`${baseUrl}/api/locations/${locationId}`)
      .then(() => {
        // Update the location history of the selected parcel immediately
        setSelectedParcel(prevParcel => ({
          ...prevParcel,
          locationHistory: prevParcel.locationHistory.filter(location => location.id !== locationId),
        }))
   
        notification.success({
          message: 'Location Deleted',
          description: 'Location entry has been successfully deleted.',
        });
      })
      .catch(error => {
        console.error('Error deleting location:', error);
        notification.error({
          message: 'Error',
          description: 'An error occurred while deleting the location entry. Please try again.',
        });
      });
  };

  const fetchParcelLocationHistory = (parcelId) => {
    // Fetch the LocationHistory for the selected parcel
    axios.get(`${baseUrl}/api/parcels/${parcelId}/locationHistory`)
      .then(response => {
        // Update the LocationHistory for the selected parcel
        setSelectedParcel(prevParcel => ({ ...prevParcel, locationHistory: response.data }));
      })
      .catch(error => {
        console.error('Error fetching location history:', error);
      });
  };

  useEffect(() => {
    // Fetch the list of parcels from the backend API
    axios.get(`${baseUrl}/api/parcels`)
      .then(response => {
        setParcels(response.data);
      })
      .catch(error => {
        console.error('Error fetching parcels:', error);
      });

    // Fetch the list of users from the auth API
    axios.get(`${baseUrl}/api/v1/auth`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParcel(prevParcel => ({ ...prevParcel, [name]: value }));
  };

  const handleAddParcel = () => {
    // Find the user based on the provided email
    const selectedUser = users.find(user => user.email === newParcel.userEmail);

    if (!selectedUser) {
      notification.error({
        message: 'User Not Found',
        description: `No user found with email ${newParcel.userEmail}.`,
      });
      return;
    }

    // Build the new parcel object with only the user id and role
    const newParcelWithUser = {
      trackingNumber: newParcel.trackingNumber,
      destination: newParcel.destination,
      status: newParcel.status,
      user: {
        id: selectedUser.id,
        role: selectedUser.role,
      },
    };

    // Send a POST request to create a new parcel
    axios.post(`${baseUrl}/api/parcels/save`, newParcelWithUser)
      .then(response => {
        setParcels(prevParcels => [...prevParcels, response.data]);
        setNewParcel({
          trackingNumber: '',
          destination: '',
          status: '',
          userEmail: '', // Clear the userEmail
        }); // Clear the form
        notification.success({
          message: 'Parcel Added',
          description: 'Parcel has been successfully added.',
        });
      })
      .catch(error => {
        console.error('Error adding parcel:', error);
        notification.error({
          message: 'Error',
          description: 'An error occurred while adding the parcel. Please try again.',
        });
      });
  };

  const handleDeleteParcel = (parcelId) => {
    // Send a DELETE request to remove a parcel
    axios.delete(`${baseUrl}/api/parcels/${parcelId}`)
      .then(() => {
        setParcels(prevParcels => prevParcels.filter(parcel => parcel.id !== parcelId));
      })
      .catch(error => {
        console.error('Error deleting parcel:', error);
        notification.error({
          message: 'Error',
          description: 'An error occurred while deleting the parcel. Please try again.',
        });
      });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tracking Number',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Parcel Owner',
      dataIndex: 'user',
      key: 'owner',
      render: user => user && user.username,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleUpdateStatus(record.id, 'In Progress')}>Set In Progress</Button>
          <Button onClick={() => handleUpdateStatus(record.id, 'Done')}>Set Done</Button>
          <Button onClick={() => showModal(record)}>View Location History</Button>
          <Button onClick={() => handleDeleteParcel(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const filteredParcels = parcels.filter(parcel =>
    parcel.trackingNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <h1>Parcel Management</h1>

      {/* Form to add a new parcel */}
      <div style={{ marginBottom: '16px' }}>
        <h2>Add New Parcel</h2>
        <Input
          placeholder="Tracking Number"
          name="trackingNumber"
          value={newParcel.trackingNumber || ''}
          onChange={handleInputChange}
          style={{ marginRight: '8px' }}
          required
        />
        <Input
          placeholder="Destination"
          name="destination"
          value={newParcel.destination || ''}
          onChange={handleInputChange}
          style={{ marginRight: '8px' }}
          required
        />
        <Input
          placeholder="Status"
          name="status"
          value={newParcel.status || ''}
          onChange={handleInputChange}
          style={{ marginRight: '8px' }}
          required
        />
        <Input
          placeholder="User Email"
          name="userEmail"
          value={newParcel.userEmail || ''}
          onChange={handleInputChange}
          style={{ marginRight: '8px', width: '200px' }}
          required
        />
        <Button type="primary" onClick={handleAddParcel}>Add Parcel</Button>
      </div>

      {/* Search bar */}
      <Search
        placeholder="Search by Tracking Number"
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      {/* List of parcels */}
      <Table columns={columns} dataSource={filteredParcels} rowKey="id" />

      {/* Location History Modal */}
      <Modal
        title="Location History"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {selectedParcel && (
          <>
            <h3>Parcel ID: {selectedParcel.id}</h3>
            <h3>Tracking Number: {selectedParcel.trackingNumber}</h3>
            <h3>Location History:</h3>
            <ul>
              {selectedParcel.locationHistory.map(location => (
                <li key={location.id}>
                 {location.id} - {location.locationDescription} - {location.timestamp}
                  <Button onClick={() => handleDeleteLocation(location.id)}>Delete</Button>
                </li>
              ))}
            </ul>
            {/* Form to add a new location entry */}
            <Form
              onFinish={handleAddLocation}
              ref={formRef}
              style={{ marginTop: '16px' }}
            >
              <Form.Item
                label="Location Description"
                name="locationDescription"
                rules={[{ required: true, message: 'Please enter the location description' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Timestamp"
                name="timestamp"
                rules={[{ required: true, message: 'Please select the timestamp' }]}
              >
                <DatePicker showTime />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Location
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ParcelManagement;
