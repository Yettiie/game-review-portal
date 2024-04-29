
import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Checkbox } from 'antd';
import { SearchOutlined, FilterFilled } from '@ant-design/icons';
import axios from 'axios';

const GameTable = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      if (!response.data) {
        throw new Error('No data received');
      }
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
      setLoading(false); 
    }
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          id={`${dataIndex}-search`}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
  });
  

  const getColumnFilterProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          id={`${dataIndex}-search`}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <div style={{ height: 300, overflow: 'auto' }}>
            {games.map(record => record[dataIndex]).filter((value, index, self) => self.indexOf(value) === index).map(value => (
            <div key={value} style={{ marginBottom: 8 }}>
                <Checkbox
                checked={selectedKeys.includes(value)}
                onChange={e => {
                    const nextSelectedKeys = selectedKeys.includes(value)
                    ? selectedKeys.filter(key => key !== value)
                    : [...selectedKeys, value];
                    setSelectedKeys(nextSelectedKeys);
                }}
                >
                {value}
                </Checkbox>
            </div>
            ))}
        </div>
        <Button
          type="primary"
          onClick={() => confirm()}
          size="small"
          style={{ width: '100%', marginTop: 8 }}
        >
          OK
        </Button>
        <Button onClick={() => clearFilters()} size="small" style={{ width: '100%', marginTop: 8 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilterDropdownOpenChange: (open) => {
      if (open) {
        const searchInput = document.getElementById(`${dataIndex}-search`);
        if (searchInput) {
          setTimeout(() => searchInput.select(), 100);
        }
      }
    },
  });

  
  
  
  const columns = [
    { 
      title: 'Rank', 
      dataIndex: 'rank', 
      sorter: (a, b) => a.rank - b.rank, 
      ...getColumnSearchProps('rank')
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      sorter: (a, b) => a.name.localeCompare(b.name), 
      ...getColumnSearchProps('name'),
    },
    { 
      title: 'Platform', 
      dataIndex: 'platform', 
      sorter: (a, b) => a.platform.localeCompare(b.platform), 
      ...getColumnSearchProps('platform'),
      ...getColumnFilterProps('platform')
    },
    { 
      title: 'Year', 
      dataIndex: 'year', 
      sorter: (a, b) => a.year - b.year, 
      ...getColumnSearchProps('year')
    },
    { 
      title: 'Genre', 
      dataIndex: 'genre', 
      sorter: (a, b) => a.genre.localeCompare(b.genre), 
      ...getColumnSearchProps('genre'),
      ...getColumnFilterProps('genre')
    },
    { 
        title: 'Publisher', 
        dataIndex: 'publisher', 
        sorter: (a, b) => a.publisher.localeCompare(b.publisher), 
        ...getColumnSearchProps('publisher'),
        ...getColumnFilterProps('publisher')
      },
      { 
        title: 'NA Sales', 
        dataIndex: 'na_sales', 
        sorter: (a, b) => parseFloat(a.na_sales) - parseFloat(b.na_sales), 
        ...getColumnSearchProps('na_sales')
      },
      { 
        title: 'EU Sales', 
        dataIndex: 'eu_sales', 
        sorter: (a, b) => parseFloat(a.eu_sales) - parseFloat(b.eu_sales), 
        ...getColumnSearchProps('eu_sales')
      },
      { 
        title: 'JP Sales', 
        dataIndex: 'jp_sales', 
        sorter: (a, b) => parseFloat(a.jp_sales) - parseFloat(b.jp_sales), 
        ...getColumnSearchProps('jp_sales')
      },
      { 
        title: 'Other Sales', 
        dataIndex: 'other_sales', 
        sorter: (a, b) => parseFloat(a.other_sales) - parseFloat(b.other_sales), 
        ...getColumnSearchProps('other_sales')
      },
      { 
        title: 'Global Sales', 
        dataIndex: 'global_sales', 
        sorter: (a, b) => parseFloat(a.global_sales) - parseFloat(b.global_sales), 
        ...getColumnSearchProps('global_sales')
      }
  ];

  return (
    <Table
      dataSource={games}
      columns={columns}
      loading={loading}
      pagination={{ pageSize: 10 }}
      onChange={handleChange}
    />
  );
};

export default GameTable;