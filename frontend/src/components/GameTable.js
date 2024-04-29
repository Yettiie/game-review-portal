import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Checkbox, Card } from 'antd';
import { SearchOutlined, FilterFilled, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import './css/GameTable.css';

const GameTable = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [selectedGame, setSelectedGame] = useState(null);

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

  const handleRowClick = (record) => {
    setSelectedGame(record);
  };

  const handleEditGame = () => {
  };

  const handleDeleteGame = () => {
  };

  const closeCard = () => {
    setSelectedGame(null);
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
    <>
      <Table
        dataSource={games}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
        onChange={handleChange}
        onRow={(record) => ({
          onClick: () => handleRowClick(record)
        })}
      />
      {selectedGame && (
        <div className="modal">
          <GameCard
            game={selectedGame}
            onEdit={handleEditGame}
            onClose={closeCard}
          />
        </div>
      )}
    </>
  );
};

const GameCard = ({ game, onEdit, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
  
    useEffect(() => {
      fetchReviews();
    }, [game]);
  
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews?appName=${game.name}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    const handleAddReview = async () => {
      try {
        await axios.post('http://localhost:5000/api/reviews', {
          appName: game.name,
          review: newReview
        });
        fetchReviews();
        setNewReview('');
      } catch (error) {
        console.error('Error adding review:', error);
      }
    };
  
    const handleDeleteReview = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${id}`);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    };
  
    return (
      <div className="custom-card">
        <div className="card-header">
          <h2>{game.name}</h2>
          <button className="close-button" onClick={onClose}><CloseOutlined/></button>
        </div>
        <div className="card-flex">
          <div className="card-body">
            <p>Rank: {game.rank}</p>
            <p>Platform: {game.platform}</p>
            <p>Year: {game.year}</p>
            <p>Genre: {game.genre}</p>
            <p>Publisher: {game.publisher}</p>
            <p>NA Sales: {game.na_sales}</p>
            <p>EU Sales: {game.eu_sales}</p>
            <p>JP Sales: {game.jp_sales}</p>
            <p>Other Sales: {game.other_sales}</p>
            <p>Global Sales: {game.global_sales}</p>
            <Button className="edit-button" onClick={onEdit}>Edit</Button>
          </div>
          <div className="card-footer">
            <h3>Reviews:</h3>
            <div className='review-content'>
              {reviews.map(review => (
                <div key={review.app_id}>
                  <p>{review.review_text}</p>
                  <Button onClick={() => handleDeleteReview(review.app_id)}>Delete</Button>
                </div>
              ))}
            </div>
            <Input
              value={newReview}
              onChange={e => setNewReview(e.target.value)}
              placeholder="Add a review"
            />
            <Button onClick={handleAddReview}>Add Review</Button>
          </div>
        </div>
      </div>
    );
  };

export default GameTable;