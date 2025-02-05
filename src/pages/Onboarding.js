import React, { useState } from 'react';

const Onboarding = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        alert('Registration successful!');
      } else {
        alert('Registration failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        alert('Login successful! Token: ' + data.token);
      } else {
        alert('Login failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="onboarding max-w-md mx-auto mt-10 p-5 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Welcome to MindSync</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      <div className="flex justify-between">
        <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
        <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
      </div>
    </div>
  );
};

export default Onboarding;
