import React, { useState, useEffect } from 'react';
import { Input, Button} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import './css/GameTable.css';

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
        app_id: game.app_id,
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

export default GameCard;
