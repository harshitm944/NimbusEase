import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const Admin = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('security/dashboard');
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load security metrics. Please ensure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async (type) => {
    try {
      setSimulating(true);
      const response = await apiClient.post(`security/simulate/${type}`);
      console.log(`Simulation ${type} response:`, response.data);
      // Refresh data after starting simulation
      setTimeout(fetchDashboardData, 2000);
    } catch (err) {
      console.error('Failed to run simulation:', err);
      setError('Failed to initiate security simulation. Ensure you have network connectivity and admin rights.');
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-mono animate-pulse uppercase tracking-widest text-xs">Initializing Secure Connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-primary/10 flex flex-col bg-background-light dark:bg-background-dark">
          <div className="p-6 flex items-center gap-3">
            <div className="size-8 bg-primary rounded flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined font-bold">shield</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">NimbusEase</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-medium">Overview</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">security_update_good</span>
              <span className="font-medium">Simulations</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">description</span>
              <span className="font-medium">Threat Logs</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-medium">Config</span>
            </a>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-primary/10">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
              </div>
              <div>
                <p className="text-sm font-semibold">Admin Ops</p>
                <p className="text-xs text-slate-500">Security Lead</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="h-16 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between px-8 bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold">Security Command Center</h1>
              <span className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider animate-pulse">Live</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">notifications</span>
                {dashboardData?.active_threats > 0 && (
                   <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full ring-2 ring-background-dark"></span>
                )}
              </div>
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-primary/10 pl-6">
                <span className="text-xs text-slate-500">System Time:</span>
                <span className="text-xs font-mono text-primary">{new Date().toISOString().replace('T', ' ').split('.')[0]} UTC</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-background-light dark:bg-primary/5 border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">System Health</p>
                  <span className={`material-symbols-outlined ${dashboardData?.status === 'OPERATIONAL' ? 'text-primary' : 'text-red-500'}`}>
                    {dashboardData?.status === 'OPERATIONAL' ? 'monitor_heart' : 'heart_broken'}
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-bold">{dashboardData?.status}</h3>
                </div>
                <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${dashboardData?.status === 'OPERATIONAL' ? 'bg-primary' : 'bg-red-500'}`} 
                       style={{width: dashboardData?.status === 'OPERATIONAL' ? '100%' : '30%'}}></div>
                </div>
              </div>
              <div className="bg-background-light dark:bg-primary/5 border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Mitigations</p>
                  <span className="material-symbols-outlined text-red-400">warning</span>
                </div>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-bold">{dashboardData?.active_threats}</h3>
                  <p className="text-slate-500 text-xs mb-1">Active Blocks</p>
                </div>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${i < dashboardData?.active_threats ? 'bg-red-400' : 'bg-slate-700'}`}></div>
                  ))}
                </div>
              </div>
              <div className="bg-background-light dark:bg-primary/5 border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Security Events</p>
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-bold">{dashboardData?.threat_count}</h3>
                  <p className="text-primary text-sm font-medium mb-1">Detections</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Monitoring Activity</span>
                  <div className="flex gap-0.5">
                    <div className="size-1 bg-primary rounded-full animate-bounce"></div>
                    <div className="size-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="size-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Activity Feed */}
              <div className="lg:col-span-2 bg-background-light dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">history</span>
                    Recent System Activity
                  </h2>
                </div>
                <div className="p-0 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-background-light dark:bg-[#0a1616] z-10">
                      <tr className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-primary/10">
                        <th className="px-6 py-3">Action</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Severity</th>
                        <th className="px-6 py-3">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-primary/10 text-xs">
                      {dashboardData?.recent_activities.map((log) => (
                        <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-primary">{log.action}</td>
                          <td className="px-6 py-4 text-slate-400">{log.userId.substring(0, 8)}...</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.severity === 'ERROR' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              log.severity === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-primary/10 text-primary border border-primary/20'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                      {dashboardData?.recent_activities.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-slate-500 italic">No recent activity detected.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mitigation Status */}
              <div className="bg-background-light dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-primary/10">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">security</span>
                    Mitigation Center
                  </h2>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Blocked IPs</h3>
                    <div className="space-y-2">
                      {dashboardData?.mitigations.blocked_ips.map((ip, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-red-500/10 border border-red-500/20">
                          <span className="text-xs font-mono text-red-400">{ip}</span>
                          <span className="text-[10px] bg-red-500 text-white px-1.5 rounded font-bold">BLOCKED</span>
                        </div>
                      ))}
                      {dashboardData?.mitigations.blocked_ips.length === 0 && (
                        <p className="text-xs text-slate-500 italic text-center py-2">No active IP blocks.</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Revoked Users</h3>
                    <div className="space-y-2">
                      {dashboardData?.mitigations.revoked_users.map((userId, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                          <span className="text-xs font-mono text-yellow-400">{userId.substring(0, 12)}...</span>
                          <span className="text-[10px] bg-yellow-500 text-black px-1.5 rounded font-bold">REVOKED</span>
                        </div>
                      ))}
                      {dashboardData?.mitigations.revoked_users.length === 0 && (
                        <p className="text-xs text-slate-500 italic text-center py-2">No users revoked.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold">Storage Freeze Status</span>
                      <span className={`size-3 rounded-full ${dashboardData?.mitigations.storage_frozen ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {dashboardData?.mitigations.storage_frozen 
                        ? '🛑 CIRCUIT BREAKER TRIPPED: All write operations are suspended.' 
                        : '✅ Storage layer is fully operational.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulations and Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Simulation Controls */}
              <div className="bg-background-light dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-primary/10">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">rebase_edit</span>
                    Simulation Engine
                  </h2>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <button 
                    disabled={simulating}
                    onClick={() => runSimulation('threats')}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-primary text-background-dark font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(13,242,242,0.3)] disabled:opacity-50"
                  >
                    <span>{simulating ? 'Simulating...' : 'Run CacheHawkeye Sim'}</span>
                    <span className="material-symbols-outlined">play_arrow</span>
                  </button>
                  <button 
                    disabled={simulating}
                    onClick={() => runSimulation('advanced')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-red-500/50 text-red-400 font-bold hover:bg-red-500/10 transition-all disabled:opacity-50"
                  >
                    <span>Trigger Advanced Threat Sim</span>
                    <span className="material-symbols-outlined">emergency_home</span>
                  </button>
                  <button 
                    disabled={simulating}
                    onClick={() => runSimulation('all')}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-yellow-500/50 text-yellow-500 font-bold hover:bg-yellow-500/10 transition-all disabled:opacity-50"
                  >
                    <span>Simulate Full Scale Attack</span>
                    <span className="material-symbols-outlined">flash_on</span>
                  </button>
                </div>
              </div>

              {/* Security Alert Feed (Threats) */}
              <div className="lg:col-span-2 bg-background-light dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">notifications_active</span>
                    Security Alert Feed
                  </h2>
                </div>
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-background-light dark:bg-[#0a1616] z-10">
                      <tr className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-primary/10">
                        <th className="px-6 py-3">Severity</th>
                        <th className="px-6 py-3">Threat Type</th>
                        <th className="px-6 py-3">Source IP</th>
                        <th className="px-6 py-3">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-primary/10 text-xs">
                      {dashboardData?.security_threats.map((log) => (
                        <tr key={log.id} className="hover:bg-red-500/5 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.severity === 'ERROR' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold">{log.attackType}</td>
                          <td className="px-6 py-4 font-mono text-slate-400 text-[10px]">{log.metadata?.ip || 'Internal'}</td>
                          <td className="px-6 py-4 text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</td>
                        </tr>
                      ))}
                      {dashboardData?.security_threats.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-slate-500 italic">No security threats detected.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Vulnerable Files / Malicious Attempts */}
            <div className="bg-background-light dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400">tab_close</span>
                  Vulnerable Files & Malicious Uploads
                </h2>
                <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 uppercase tracking-widest">
                  Threat Neutralized
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-primary/5 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">File Name</th>
                      <th className="px-6 py-4">Detected Malware</th>
                      <th className="px-6 py-4">Scanning Engine</th>
                      <th className="px-6 py-4">Source User</th>
                      <th className="px-6 py-4">Detection Time</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-primary/10 text-xs">
                    {dashboardData?.vulnerable_files.map((file, idx) => (
                      <tr key={idx} className="hover:bg-red-500/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-300">{file.fileName}</td>
                        <td className="px-6 py-4">
                          <span className="text-red-400 font-bold">{file.malwareType}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-400">{file.engine}</td>
                        <td className="px-6 py-4 text-slate-500">{file.userId.substring(0, 8)}...</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(file.detectedAt).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-emerald-500 font-bold flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            BLOCKED
                          </span>
                        </td>
                      </tr>
                    ))}
                    {dashboardData?.vulnerable_files.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                          No malicious files detected in the recent scanning cycle.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
