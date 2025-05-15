'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { 
  RiDashboardLine, 
  RiTeamLine, 
  RiArchiveLine, 
  RiSettings4Line,
  RiDeleteBinLine,
  RiLogoutBoxRLine,
  RiMenuLine,
  RiUserLine
} from 'react-icons/ri';
import { Poppins } from 'next/font/google';
import AdminTeam from '@/components/AdminTeam';
import AdminArchive from '@/components/AdminArchive'; 
import AdminTrash from '@/components/AdminTrash';
import AdminSettings from '@/components/AdminSettings';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const themeColors = {
  primary: '#0c4000',
  secondary: '#1a8c00', 
  accent: '#43e794',
  light: '#cdf1d8',
  dark: '#072500',
  white: '#ffffff',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [equalizerHeights, setEqualizerHeights] = useState([]);
  const [popularPages, setPopularPages] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);


  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success) setPopularPages(data.pages);
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    setEqualizerHeights([15, 20, 25, 18, 22]);
    const animationInterval = setInterval(() => {
      setEqualizerHeights(prevHeights => 
        prevHeights.map(() => Math.floor(Math.random() * 15) + 10)
      );
    }, 800);
    return () => clearInterval(animationInterval);
  }, []);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/admin/login');
    } else {
      user.reload().then(() => {
        setCurrentUser(auth.currentUser); // pull latest profile
        setLoading(false);
      });
    }
  });

  return () => unsubscribe();
}, [router]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) {
        const { team, archive } = json.stats;
        setStatsData([
          { title: 'Team Members', value: team.total, change: team.change, icon: <RiTeamLine size={24} /> },
          { title: 'Archive Items', value: archive.total, change: archive.change, icon: <RiArchiveLine size={24} /> },
        ]);
      }
    };
    fetchStats();
  }, []);

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'added a new team member', time: '2 hours ago' },
    { id: 3, user: 'Mark Johnson', action: 'updated site settings', time: 'Yesterday' },
    { id: 4, user: 'Sarah Parker', action: 'archived old content', time: '3 days ago' },
  ];

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${poppins.className}`} style={{ background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.dark} 100%)` }}>
        <div className="flex flex-col items-center">
          <div className="flex items-end justify-center space-x-1 mb-4 h-8">
            {[1,2,3,4,5].map((_, i) => (
              <div key={i} className="w-1 rounded-full bg-green-300/70 animate-pulse transition-all duration-300" style={{ height: `${Math.floor(Math.random() * 15) + 10}px`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { icon: <RiDashboardLine size={20} />, label: 'Dashboard', id: 'dashboard' },
    { icon: <RiArchiveLine size={20} />, label: 'Archive', id: 'archive' },
    { icon: <RiTeamLine size={20} />, label: 'Team', id: 'team' },
    { icon: <RiDeleteBinLine size={20} />, label: 'Trash', id: 'trash' },
    { icon: <RiSettings4Line size={20} />, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className={`flex min-h-screen bg-gray-50 ${poppins.className}`}>
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`} style={{ background: `linear-gradient(180deg, ${themeColors.primary} 0%, ${themeColors.dark} 100%)` }}>
        <div className={`p-6 flex ${sidebarOpen ? 'justify-between' : 'justify-center'} items-center border-b border-green-700/30`}>
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-green-300/30">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            {sidebarOpen && <h2 className="ml-3 text-white font-semibold text-lg">Studio</h2>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:bg-white/10 p-1 rounded-md transition-colors">
            <RiMenuLine size={18} />
          </button>
        </div>

        <nav className="flex-1 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-6' : 'justify-center'} py-3 hover:bg-white/10 transition-colors ${activePage === item.id ? 'bg-white/10 relative' : ''}`}
                >
                  {activePage === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r" style={{ backgroundColor: themeColors.accent }}></div>}
                  <span className="text-white">{item.icon}</span>
                  {sidebarOpen && <span className={`ml-3 text-white ${activePage === item.id ? 'font-medium' : ''}`}>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`p-4 border-t border-green-700/30 ${sidebarOpen ? 'px-6' : 'flex justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex flex-col">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <RiUserLine className="text-white" size={16} />
                </div>
                <div className="ml-3">
<p className="text-white text-sm font-medium">
  {currentUser?.displayName || 'Admin User'}
</p>
                  <p className="text-green-200/70 text-xs">{currentUser?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center justify-center w-full py-2 mt-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white text-sm">
                <RiLogoutBoxRLine size={16} className="mr-2" /> Logout
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white" title="Logout">
              <RiLogoutBoxRLine size={18} />
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
<header className="h-16 border-b flex items-center justify-between px-6" style={{ borderColor: '#e2e8f0' }}>
  <h1 className="text-lg font-medium" style={{ color: themeColors.primary }}>
    {navItems.find(item => item.id === activePage)?.label}
  </h1>

  {/* Profile dropdown */}
  <div className="relative">
    <button
      onClick={() => setShowDropdown(prev => !prev)}
      className="w-8 h-8 rounded-full flex items-center justify-center focus:outline-none"
      style={{ backgroundColor: themeColors.light }}
    >
      <span className="text-sm font-medium" style={{ color: themeColors.primary }}>
        {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'A'}
      </span>
    </button>

    {showDropdown && (
      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
        <button
          onClick={() => {
            setActivePage('settings');
            setShowDropdown(false);
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    )}
  </div>
</header>


        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activePage === 'dashboard' && (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-semibold" style={{ color: themeColors.primary }}>{stat.value}</h3>
                      <p className="text-xs" style={{ color: themeColors.secondary }}>{stat.change} this month</p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: themeColors.light }}
                    >
                      <div className="text-green-700">{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold" style={{ color: themeColors.primary }}>Recent Activities</h2>
                    <button 
                      className="text-sm"
                      style={{ color: themeColors.secondary }}
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                          style={{ backgroundColor: themeColors.light, color: themeColors.primary }}
                        >
                          {activity.user.split(' ').map(name => name[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold mb-6" style={{ color: themeColors.primary }}>Quick Actions</h2>
                  <div className="space-y-3">
{[
  { label: 'View Team Member', icon: <RiTeamLine size={18} />, page: 'team' },
  { 
    label: 'Add Project In Archives', 
    icon: <RiArchiveLine size={18} />, 
    action: () => {
      setActivePage('archive');
      setArchiveModalOpen(true);
    }
  },
  { label: 'System Settings', icon: <RiSettings4Line size={18} />, page: 'settings' }
].map((action, index) => (
  <button 
    key={index}
    onClick={() => action.action ? action.action() : setActivePage(action.page)}
    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
  >
    <span className="flex items-center">
      <span 
        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
        style={{ backgroundColor: themeColors.light }}
      >
        <span style={{ color: themeColors.primary }}>{action.icon}</span>
      </span>
      <span className="text-sm font-medium" style={{ color: themeColors.dark }}>
        {action.label}
      </span>
    </span>
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
))
}


                  </div>
                </div>

                {/* Popular Pages Analytics */}
<div className="mt-10 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.primary }}>Popular Pages (Last 30 Days)</h2>
  <ul className="space-y-2">
    {popularPages.map((page, i) => (
      <li key={i} className="flex justify-between text-sm border-b pb-2">
        <span className="text-gray-700">{page.path}</span>
        <span className="text-gray-500">{page.views} views</span>
      </li>
    ))}
  </ul>
</div>

              </div>
            </>
          )}

          {/* Placeholder pages for other nav items */}
{activePage === 'team' && <AdminTeam />}
{activePage === 'archive' && (<AdminArchive modalOpen={archiveModalOpen} setModalOpen={setArchiveModalOpen} />)}
{activePage === 'trash' && <AdminTrash />}
{activePage === 'settings' && <AdminSettings />}






        </main>
      </div>
      
    </div>
    
  );
}