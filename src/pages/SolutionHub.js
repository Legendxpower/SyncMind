import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SolutionHub = () => {
  const [contentFeed, setContentFeed] = useState([]);
  const [chatbotResponse, setChatbotResponse] = useState('');
  const [userQuery, setUserQuery] = useState('');

  useEffect(() => {
    // Fetch content from backend
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content');
        setContentFeed(response.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    fetchContent();
  }, []);

  const handleBookmark = (id) => {
    // Logic to bookmark content
    console.log(`Bookmarked content with id: ${id}`);
  };

  const handleChatbotQuery = async () => {
    if (userQuery.trim()) {
      try {
        const response = await axios.post('/api/chatbot', { query: userQuery });
        setChatbotResponse(response.data.response);
        setUserQuery('');
      } catch (error) {
        console.error('Error with chatbot query:', error);
      }
    }
  };

  return (
    <div className="solution-hub-page max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6">AI Solution Hub</h1>
      <div className="content-feed">
        {contentFeed.map(item => (
          <div key={item.id} className="content-item mb-4 p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p>{item.content}</p>
            <button onClick={() => handleBookmark(item.id)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Bookmark</button>
          </div>
        ))}
      </div>
      <div className="chatbot mt-6 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold">AI Chatbot</h2>
        <input
          type="text"
          placeholder="Ask the AI..."
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <button onClick={handleChatbotQuery} className="bg-green-500 text-white px-4 py-2 rounded">Ask</button>
        <p className="mt-4">{chatbotResponse}</p>
      </div>
    </div>
  );
};

export default SolutionHub;
