import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const DailyPlanner = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleSelectSlot = async ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      try {
        const response = await axios.post('/api/events', { start, end, title });
        setEvents([...events, response.data]);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const handleSelectEvent = async (event) => {
    const newTitle = window.prompt('Edit Event name', event.title);
    if (newTitle) {
      try {
        const updatedEvent = { ...event, title: newTitle };
        await axios.put(`/api/events/${event.id}`, updatedEvent);
        setEvents(events.map(e => (e.id === event.id ? updatedEvent : e)));
      } catch (error) {
        console.error('Error updating event:', error);
      }
    } else if (window.confirm('Delete this event?')) {
      try {
        await axios.delete(`/api/events/${event.id}`);
        setEvents(events.filter(e => e.id !== event.id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="daily-planner-page max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6">Daily Planner</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default DailyPlanner;
