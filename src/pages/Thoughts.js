import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Thoughts = () => {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    // Fetch thoughts from backend
    const fetchThoughts = async () => {
      try {
        const response = await axios.get('/api/thoughts');
        setThoughts(response.data);
      } catch (error) {
        console.error('Error fetching thoughts:', error);
      }
    };
    fetchThoughts();
  }, []);

  const handleAddThought = async () => {
    if (newThought.trim()) {
      const tags = generateTags(newThought);
      try {
        const response = await axios.post('/api/thoughts', { content: newThought, tags });
        setThoughts([...thoughts, response.data]);
        setNewThought('');
      } catch (error) {
        console.error('Error adding thought:', error);
      }
    }
  };

  const handleEditThought = (index) => {
    setNewThought(thoughts[index].content);
    setEditIndex(index);
  };

  const handleSaveEdit = async () => {
    if (newThought.trim() && editIndex !== null) {
      const updatedThought = { ...thoughts[editIndex], content: newThought };
      try {
        await axios.put(`/api/thoughts/${updatedThought.id}`, updatedThought);
        const updatedThoughts = thoughts.map((thought, index) =>
          index === editIndex ? updatedThought : thought
        );
        setThoughts(updatedThoughts);
        setNewThought('');
        setEditIndex(null);
      } catch (error) {
        console.error('Error updating thought:', error);
      }
    }
  };

  const handleDeleteThought = async (index) => {
    const thoughtToDelete = thoughts[index];
    try {
      await axios.delete(`/api/thoughts/${thoughtToDelete.id}`);
      setThoughts(thoughts.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting thought:', error);
    }
  };

  const generateTags = (content) => {
    const keywords = ['important', 'urgent', 'idea'];
    return keywords.filter(keyword => content.toLowerCase().includes(keyword));
  };

  const filteredThoughts = filterTag
    ? thoughts.filter(thought => thought.tags.includes(filterTag))
    : thoughts;

  return (
    <div className="thoughts-page max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6">Thoughts</h1>
      <input
        type="text"
        placeholder="Enter your thought"
        value={newThought}
        onChange={(e) => setNewThought(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      {editIndex !== null ? (
        <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded mb-4">Save Edit</button>
      ) : (
        <button onClick={handleAddThought} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Thought</button>
      )}
      <div className="mb-4">
        <label className="mr-2">Filter by tag:</label>
        <select onChange={(e) => setFilterTag(e.target.value)} className="border rounded p-2">
          <option value="">All</option>
          <option value="important">Important</option>
          <option value="urgent">Urgent</option>
          <option value="idea">Idea</option>
        </select>
      </div>
      <ul className="list-disc pl-5">
        {filteredThoughts.map((thought, index) => (
          <li key={index} className="mb-2">
            {thought.content} <span className="text-sm text-gray-500">[{thought.tags.join(', ')}]</span>
            <button onClick={() => handleEditThought(index)} className="ml-2 text-blue-500">Edit</button>
            <button onClick={() => handleDeleteThought(index)} className="ml-2 text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Thoughts;
