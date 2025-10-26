import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const Profile = () => {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(
        `${API_URL}/users/me`,
        { name, email },
        { withCredentials: true }
      );
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Profile</h1>
          <p className="text-gray-600 mb-6">Manage your account settings and preferences</p>

          {success && (
            <Alert
              variant="success"
              message={success}
              onDismiss={() => setSuccess(null)}
              className="mb-4"
            />
          )}

          {error && (
            <Alert
              variant="error"
              message={error}
              onDismiss={() => setError(null)}
              className="mb-4"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Info */}
            <Card title="Profile Information">
              <div className="space-y-4">
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing || loading}
                  placeholder="Your name"
                />

                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing || loading}
                  placeholder="your@email.com"
                />

                {user && (
                  <div>
                    <p className="text-sm text-gray-600">
                      Member since: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        loading={loading}
                        disabled={loading}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setName(user.name || '');
                            setEmail(user.email || '');
                          }
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Account Actions */}
            <Card title="Account Actions">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Session</h3>
                  <Button variant="secondary" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Once you delete your account, there is no going back.
                  </p>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        // Handle account deletion
                        console.log('Delete account');
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
