import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'User Management' },
  { to: '/admin/shoutouts', label: 'Shoutouts' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/activity', label: 'User Activity' },
  { to: '/admin/moderation', label: 'Moderation' },
];

export default function Sidebar() {
  return (
    <aside className='w-64 bg-gradient-to-b from-black to-gray-900 text-white p-6'>
      <h1 className='text-xl font-bold mb-6'>Admin Panel</h1>
      <nav className='space-y-2'>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              isActive
                ? 'block bg-blue-600 rounded px-4 py-2'
                : 'block hover:bg-gray-800 rounded px-4 py-2'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
