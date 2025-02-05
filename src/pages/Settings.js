import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacySettings, setPrivacySettings] = useState({ shareData: false });
  const [integrations, setIntegrations] = useState({ googleCalendar: false, notion: false });

  useEffect(() => {
    // Fetch user preferences from backend
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/api/preferences');
        const { theme, notificationsEnabled, privacySettings, integrations } = response.data;
        setTheme(theme);
        setNotificationsEnabled(notificationsEnabled);
        setPrivacySettings(privacySettings);
        setIntegrations(integrations);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };
    fetchPreferences();
  }, []);

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    await savePreferences({ theme: newTheme });
  };

  const handleNotificationsToggle = async () => {
    const newNotificationsEnabled = !notificationsEnabled;
    setNotificationsEnabled(newNotificationsEnabled);
    await savePreferences({ notificationsEnabled: newNotificationsEnabled });
  };

  const handlePrivacyChange = async (e) => {
    const newPrivacySettings = { ...privacySettings, [e.target.name]: e.target.checked };
    setPrivacySettings(newPrivacySettings);
    await savePreferences({ privacySettings: newPrivacySettings });
  };

  const handleIntegrationToggle = async (service) => {
    const newIntegrations = { ...integrations, [service]: !integrations[service] };
    setIntegrations(newIntegrations);
    await savePreferences({ integrations: newIntegrations });
  };

  const savePreferences = async (updatedPreferences) => {
    try {
      await axios.put('/api/preferences', updatedPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="settings-page max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Theme</label>
        <select value={theme} onChange={handleThemeChange} className="border rounded p-2">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Notifications</label>
        <button onClick={handleNotificationsToggle} className="bg-blue-500 text-white px-4 py-2 rounded">
          {notificationsEnabled ? 'Disable' : 'Enable'} Notifications
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Privacy Settings</label>
        <div>
          <input
            type="checkbox"
            name="shareData"
            checked={privacySettings.shareData}
            onChange={handlePrivacyChange}
            className="mr-2"
          />
          <label>Share Data with Third Parties</label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Integrations</label>
        <div>
          <button onClick={() => handleIntegrationToggle('googleCalendar')} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            {integrations.googleCalendar ? 'Disconnect' : 'Connect'} Google Calendar
          </button>
          <button onClick={() => handleIntegrationToggle('notion')} className="bg-blue-500 text-white px-4 py-2 rounded">
            {integrations.notion ? 'Disconnect' : 'Connect'} Notion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
