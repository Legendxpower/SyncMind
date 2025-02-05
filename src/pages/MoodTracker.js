import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const MoodTracker = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [newMood, setNewMood] = useState('');
  const [insights, setInsights] = useState('');

  useEffect(() => {
    // Fetch mood entries from backend
    const fetchMoodEntries = async () => {
      try {
        const response = await axios.get('/api/mood');
        setMoodEntries(response.data);
      } catch (error) {
        console.error('Error fetching mood entries:', error);
      }
    };
    fetchMoodEntries();
  }, []);

  const handleAddMood = async () => {
    if (newMood.trim()) {
      const date = new Date().toLocaleDateString();
      try {
        const response = await axios.post('/api/mood', { date, mood: newMood });
        setMoodEntries([...moodEntries, response.data]);
        setNewMood('');
        generateInsights();
      } catch (error) {
        console.error('Error adding mood:', error);
      }
    }
  };

  const generateInsights = () => {
    // Simple AI-generated insights based on mood data
    const moodCount = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    const mostFrequentMood = Object.keys(moodCount).reduce((a, b) => (moodCount[a] > moodCount[b] ? a : b));
    setInsights(`Your most frequent mood is ${mostFrequentMood}.`);
  };

  const moodData = {
    labels: moodEntries.map(entry => entry.date),
    datasets: [
      {
        label: 'Mood Over Time',
        data: moodEntries.map(entry => entry.mood),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="mood-tracker-page max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6">Mood Tracker</h1>
      <input
        type="text"
        placeholder="Enter your mood"
        value={newMood}
        onChange={(e) => setNewMood(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      <button onClick={handleAddMood} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Mood</button>
      <Line data={moodData} />
      <div className="mt-4 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold">AI Insights</h2>
        <p>{insights}</p>
      </div>
    </div>
  );
};

export default MoodTracker;
