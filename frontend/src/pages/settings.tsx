import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('edusync_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTheme(settings.theme || 'light');
      setNotifications(settings.notifications ?? true);
      setAnalytics(settings.analytics ?? true);
    }
  }, []);

  const handleSave = () => {
    const settings = { theme, notifications, analytics };
    localStorage.setItem('edusync_settings', JSON.stringify(settings));
    setSuccess('Settings saved successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Settings</h1>
          <p className="text-gray-600 mb-6">Manage your application preferences</p>

          {success && (
            <Alert
              variant="success"
              message={success}
              onDismiss={() => setSuccess(null)}
              className="mb-4"
            />
          )}

          <div className="space-y-6">
            {/* Preferences */}
            <Card title="Preferences">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`px-4 py-2 border rounded ${
                        theme === 'light'
                          ? 'bg-[#2c3e50] text-white border-[#2c3e50]'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`px-4 py-2 border rounded ${
                        theme === 'dark'
                          ? 'bg-[#2c3e50] text-white border-[#2c3e50]'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Dark theme support coming soon
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-xs text-gray-500">
                      Receive updates about your account
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-[#2c3e50]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>

            {/* Privacy */}
            <Card title="Privacy">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Show Analytics
                    </label>
                    <p className="text-xs text-gray-500">
                      Display analytics data on dashboard
                    </p>
                  </div>
                  <button
                    onClick={() => setAnalytics(!analytics)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      analytics ? 'bg-[#2c3e50]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card title="About">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">2025</span>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Settings;
