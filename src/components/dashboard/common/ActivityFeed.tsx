import React from 'react';

export interface Activity {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, limit }) => {
  const items = limit ? activities.slice(0, limit) : activities;

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {items.map((act) => (
          <li key={act.id} className="flex items-start space-x-3">
            <div className="text-gray-400 text-xs">
              {new Date(act.timestamp).toLocaleString()}
            </div>
            <div>
              <p className="text-sm font-medium">{act.title}</p>
              {act.description && (
                <p className="text-xs text-gray-500">{act.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
