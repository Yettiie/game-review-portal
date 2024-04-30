import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Popconfirm, message, Checkbox, Space, Modal } from 'antd';
import { CloseOutlined, EditOutlined, DeleteOutlined, FilterFilled, SearchOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import axios from 'axios';
import './css/GameTable.css';

const GameCard = ({ game, onEdit, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState('');
  const [editedReviewLiked, setEditedReviewLiked] = useState(false);
  const [editedGameDetails, setEditedGameDetails] = useState({
    name: game.name,
    platform: game.platform,
    year: game.year,
    genre: game.genre,
    publisher: game.publisher,
    na_sales: game.na_sales,
    eu_sales: game.eu_sales,
    jp_sales: game.jp_sales,
    other_sales: game.other_sales,
    global_sales: game.global_sales
  });
  const [editGameModalVisible, setEditGameModalVisible] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [game]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews?appName=${game.name}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      message.error('Failed to fetch reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/reviews', {
        appName: game.name,
        review: newReview,
        review_score: liked ? 1 : -1
      });
      fetchReviews();
      setNewReview('');
      message.success('Review added successfully.');
      if(liked){
        setLiked(!liked);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      message.error('Failed to add review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      fetchReviews();
      message.success('Review deleted successfully.');
    } catch (error) {
      console.error('Error deleting review:', error);
      message.error('Failed to delete review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditedReviewText(review.review_text);
    setEditedReviewLiked(review.review_score === 1);
    setEditModalVisible(true);
  };

  const saveEditedReview = async () => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/reviews/${editingReview.id}`, {
        review_text: editedReviewText,
        review_score: editedReviewLiked ? 1 : -1
      });
      fetchReviews();
      setEditModalVisible(false);
      message.success('Review updated successfully.');
    } catch (error) {
      console.error('Error updating review:', error);
      message.error('Failed to update review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGame = async () => {
    // Validate input fields
    if (
      !editedGameDetails.name ||
      !editedGameDetails.platform ||
      !editedGameDetails.year ||
      !editedGameDetails.genre ||
      !editedGameDetails.publisher ||
      !editedGameDetails.na_sales ||
      !editedGameDetails.eu_sales ||
      !editedGameDetails.jp_sales ||
      !editedGameDetails.other_sales ||
      !editedGameDetails.global_sales
    ) {
      message.error('All fields are required.');
      return;
    }


    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/api/data/${game.rank}`, {
        name: editedGameDetails.name,
        platform: editedGameDetails.platform,
        year: editedGameDetails.year,
        genre: editedGameDetails.genre,
        publisher: editedGameDetails.publisher,
        na_sales: editedGameDetails.na_sales,
        eu_sales: editedGameDetails.eu_sales,
        jp_sales: editedGameDetails.jp_sales,
        other_sales: editedGameDetails.other_sales,
        global_sales: editedGameDetails.global_sales,
      });
      message.success('Game details updated successfully.');
      onClose(); // Close the game card
      onEdit(); // Fetch game table again
    } catch (error) {
      console.error('Error updating game:', error);
      message.error('Failed to update game details. Please try again.');
    } finally {
      setLoading(false);
    }
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
    onFilter: (value, record) => {
      if (dataIndex !== 'review_score' && dataIndex !== 'review_votes') { // because they are numbers
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
      }
      return record[dataIndex].toString().includes(value);
    }
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
        <div style={{ height: 'auto', maxHeight: 290,  overflow: 'auto' }}>
            {reviews.map(record => record[dataIndex]).filter((value, index, self) => self.indexOf(value) === index).map(value => (
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      ...getColumnSearchProps('id')
    },
    {
      title: 'App ID',
      dataIndex: 'app_id',
      key: 'app_id',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: 'App Name',
      dataIndex: 'app_name',
      key: 'app_name'
    },
    {
      title: 'Review Text',
      dataIndex: 'review_text',
      key: 'review_text'
    },
    {
      title: 'Review Score',
      dataIndex: 'review_score',
      key: 'review_score',
      sorter: (a, b) => a.review_score - b.review_score,
      ...getColumnSearchProps('review_score'),
      ...getColumnFilterProps('review_score'),
    },
    {
      title: 'Review Votes',
      dataIndex: 'review_votes',
      key: 'review_votes',
      sorter: (a, b) => a.review_notes - b.review_votes,
      ...getColumnSearchProps('review_votes'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => handleEditReview(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this review?"
            onConfirm={() => handleDeleteReview(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>Delete</Button>
          </Popconfirm>
        </span>
      )
    }
  ];

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
          <Button className="edit-button" onClick={() => setEditGameModalVisible(true)}>Edit</Button>
          <Modal
            title="Edit Game Details"
            visible={editGameModalVisible}
            onOk={handleEditGame}
            onCancel={() => setEditGameModalVisible(false)}
            confirmLoading={loading}
          >
            <Input
              value={editedGameDetails.name}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, name: e.target.value })}
              placeholder="Game Name"
            />
            <Input
              value={editedGameDetails.platform}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, platform: e.target.value })}
              placeholder="Platform"
            />
            <Input
              value={editedGameDetails.year}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, year: e.target.value })}
              placeholder="Year"
            />
            <Input
              value={editedGameDetails.genre}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, genre: e.target.value })}
              placeholder="Genre"
            />
            <Input
              value={editedGameDetails.publisher}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, publisher: e.target.value })}
              placeholder="Publisher"
            />
            <Input
              value={editedGameDetails.na_sales}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, na_sales: e.target.value })}
              placeholder="NA Sales"
            />
            <Input
              value={editedGameDetails.eu_sales}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, eu_sales: e.target.value })}
              placeholder="EU Sales"
            />
            <Input
              value={editedGameDetails.jp_sales}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, jp_sales: e.target.value })}
              placeholder="JP Sales"
            />
            <Input
              value={editedGameDetails.other_sales}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, other_sales: e.target.value })}
              placeholder="Other Sales"
            />
            <Input
              value={editedGameDetails.global_sales}
              onChange={(e) => setEditedGameDetails({ ...editedGameDetails, global_sales: e.target.value })}
              placeholder="Global Sales"
            />
          </Modal>
        </div>
        <div className="card-footer">
          <h3>Reviews:</h3>
          <div className='review-content'>
            <Table
              dataSource={reviews}
              columns={columns}
              pagination={{ pageSize: 2 }}
              loading={loading}
              rowKey="id"
              scroll={{ y: 240 }}
            />
          </div>
          <Input
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
            placeholder="Add a review"
          />
          <Button onClick={handleAddReview} loading={loading}>Add Review</Button>
          <Button
            icon={liked ? <LikeFilled /> : <LikeOutlined />}
            onClick={() => setLiked(!liked)}
            style={{ marginLeft: '8px' }}
          >
            {liked ? 'Liked!' : 'Like'}
          </Button>
        </div>
      <Modal
        title="Edit Review"
        visible={editModalVisible}
        onOk={saveEditedReview}
        onCancel={() => setEditModalVisible(false)}
        confirmLoading={loading}
      >
        <Input.TextArea
          value={editedReviewText}
          onChange={e => setEditedReviewText(e.target.value)}
          placeholder="Edit review text"
        />
        <Button
          icon={editedReviewLiked ? <LikeFilled /> : <LikeOutlined />}
          onClick={() => setEditedReviewLiked(!editedReviewLiked)}
          style={{ marginTop: '8px' }}
        >
          {editedReviewLiked ? 'Liked!' : 'Like'}
        </Button>
      </Modal>
      </div>
    </div>
  );
};

export default GameCard;