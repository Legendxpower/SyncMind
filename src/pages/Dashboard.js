import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [thoughts, setThoughts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [moodInsights, setMoodInsights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const thoughtsResponse = await fetch('/api/thoughts');
        const tasksResponse = await fetch('/api/tasks');
        const moodResponse = await fetch('/api/mood');
        const thoughtsData = await thoughtsResponse.json();
        const tasksData = await tasksResponse.json();
        const moodData = await moodResponse.json();
        setThoughts(thoughtsData);
        setTasks(tasksData);
        setMoodInsights(moodData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleQuickAdd = () => {
    setShowModal(true);
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      // Simple logic to determine if the item is a thought or task
      if (newItem.toLowerCase().includes('task')) {
        setTasks([...tasks, newItem]);
      } else {
        setThoughts([...thoughts, newItem]);
      }
      setNewItem('');
    }
    setShowModal(false);
  };

  return (
    <div className="dashboard max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="summary-card p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">Thoughts</h2>
          <p>{thoughts.length} recent thoughts</p>
        </div>
        <div className="summary-card p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <p>{tasks.length} tasks</p>
        </div>
        <div className="summary-card p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">Mood Insights</h2>
          <p>{moodInsights.length} mood insights</p>
        </div>
      </div>
      <button onClick={handleQuickAdd} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">Quick Add</button>

      {showModal && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <input
              type="text"
              placeholder="Enter new thought or task"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="w-full p-2 mb-3 border rounded"
            />
            <button onClick={handleAddItem} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
