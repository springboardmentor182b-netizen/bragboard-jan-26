import React from 'react';
import { User, Mail, Briefcase, Calendar } from 'lucide-react';

const ProfilePage = ({ user }) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
        <p className="text-accent1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2 text-center">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-secondary">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-primary">{user?.name}</h2>
            <p className="text-accent1">{user?.role}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-md border-2 border-accent2">
            <h3 className="text-lg font-bold text-primary mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-accent1" />
                <div>
                  <p className="text-sm text-accent1">Full Name</p>
                  <p className="font-medium text-primary">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent1" />
                <div>
                  <p className="text-sm text-accent1">Email</p>
                  <p className="font-medium text-primary">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-accent1" />
                <div>
                  <p className="text-sm text-accent1">Department</p>
                  <p className="font-medium text-primary">{user?.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-accent1" />
                <div>
                  <p className="text-sm text-accent1">Joined</p>
                  <p className="font-medium text-primary">
                    {user?.joined_at ? new Date(user.joined_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full bg-primary text-secondary py-3 px-6 rounded-lg hover:bg-accent1 transition-colors font-semibold">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
