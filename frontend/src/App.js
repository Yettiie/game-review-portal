import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      if (!response.data) {
        throw new Error('No data received');
      }
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Reviews</h1>
        {error && <p>Error fetching data: {error}</p>}
        <table>
          <thead>
            <tr>
              <th>name</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={index}>
                <td>{review.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
