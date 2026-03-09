import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">cloud_done</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">NimbusEase</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Secure Storage</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors" href="#">
            <span className="material-symbols-outlined">folder_open</span>
            <span className="font-medium text-sm">My Files</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors" href="#">
            <span className="material-symbols-outlined">security</span>
            <span className="font-medium text-sm">Security Logs</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium text-sm">Settings</span>
          </a>
        </nav>
        <div className="p-4 mt-auto">
          <div className="rounded-xl bg-slate-100 dark:bg-primary/5 p-4 border border-slate-200 dark:border-primary/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Storage Plan</span>
              <span className="text-xs text-primary font-bold">60%</span>
            </div>
            <div className="w-full bg-slate-300 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{width: '60%'}}></div>
            </div>
            <p className="text-[10px] mt-2 text-slate-500 dark:text-slate-400 italic">0.8 TB of 2 TB remaining</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-primary/20 flex items-center justify-between px-6 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-primary/5 border-none rounded-lg focus:ring-1 focus:ring-primary text-sm placeholder-slate-500 dark:placeholder-slate-400" placeholder="Search files, logs, or hashes..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <span className="text-xs font-bold text-primary">Trust Score</span>
              <span className="text-sm font-black text-primary">98/100</span>
            </div>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-primary/20">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight">Alex Rivera</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pro Account</p>
              </div>
              <div className="size-10 rounded-full border-2 border-primary/40 p-0.5">
                <img className="w-full h-full rounded-full object-cover" alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeJf-X0rqHc43FwS88RBLwoBdWvdaawOWOFalDTCLG84Qjx3j3uLrOKccPbIBG5VmVylxmXvMb4f99c0e3WW0hz66J7kM3gzQS3ZgBS1npsyCGXRKjhV7yZdI5NV0r54qco3qvYLyrXXGH3MPdRCin4UDZya4_dbXtHgVqd97eCbvx75J5NezoaZ48h98qc5PBt-yQxVv6Buh2BigFoauSJiYtRsrt9FuWZsFQUo-uJkud79dbDW34pT7I0SPjD5O4LkSRZ4HtuQh7"/>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 flex items-center gap-4">
              <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <span className="material-symbols-outlined text-3xl">database</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Storage</p>
                <h3 className="text-2xl font-bold">1.2 TB <span className="text-sm font-normal text-slate-400">/ 2 TB</span></h3>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 flex items-center gap-4">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">description</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Number of Files</p>
                <h3 className="text-2xl font-bold">4,250</h3>
              </div>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 flex items-center gap-4">
              <div className="size-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 verified-glow">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last Integrity Check</p>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  Verified
                  <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* File Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Files Management</h2>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-bold transition-all">
                  <span className="material-symbols-outlined">upload</span>
                  Upload File
                </button>
              </div>
              <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-primary/10 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4">Upload Date</th>
                      <th className="px-6 py-4">Integrity</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                    <tr className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                          <span className="text-sm font-medium">financial_report_2024.pdf</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">4.2 MB</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 12, 2023</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-primary" title="Verified via Blockchain">
                          <span className="material-symbols-outlined text-lg">link</span>
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Chain-Verified</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">table_chart</span>
                          <span className="text-sm font-medium">client_database_v2.csv</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">12.8 MB</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 11, 2023</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-primary" title="Verified via Blockchain">
                          <span className="material-symbols-outlined text-lg">link</span>
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Chain-Verified</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">folder_zip</span>
                          <span className="text-sm font-medium">project_backup_oct.zip</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">245.5 MB</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 10, 2023</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-primary" title="Verified via Blockchain">
                          <span className="material-symbols-outlined text-lg">link</span>
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Chain-Verified</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">image</span>
                          <span className="text-sm font-medium">branding_assets.ai</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">18.2 MB</td>
                      <td className="px-6 py-4 text-sm text-slate-500">Oct 08, 2023</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-primary" title="Verified via Blockchain">
                          <span className="material-symbols-outlined text-lg">link</span>
                          <span className="text-[10px] font-bold uppercase tracking-tighter">Chain-Verified</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">download</span>
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Feed */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Recent Security Activity</h2>
              <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="size-2 rounded-full bg-primary verified-glow"></div>
                  </div>
                  <div className="flex-1 border-b border-slate-100 dark:border-primary/10 pb-3">
                    <p className="text-sm font-semibold">File SHA-256 Verified</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hash match confirmed for project_backup_oct.zip</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">14:20 PM • Blockchain Node #42</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="size-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="flex-1 border-b border-slate-100 dark:border-primary/10 pb-3">
                    <p className="text-sm font-semibold">Login from Trusted Device</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">MacBook Pro M2 - San Francisco, USA</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">12:05 PM • MFA Verified</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="size-2 rounded-full bg-primary verified-glow"></div>
                  </div>
                  <div className="flex-1 border-b border-slate-100 dark:border-primary/10 pb-3">
                    <p className="text-sm font-semibold">Encryption Key Rotation</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Periodic security update completed successfully</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">09:15 AM • Automated System</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="size-2 rounded-full bg-amber-400"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">API Access Granted</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Read-only token generated for Mobile App</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">Yesterday • User Action</p>
                  </div>
                </div>
                <button className="w-full py-2 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors mt-2">
                  View Full Audit Log
                </button>
              </div>

              {/* Blockchain Status */}
              <div className="rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 p-4">
                <div className="flex items-center gap-3 text-primary mb-3">
                  <span className="material-symbols-outlined">hub</span>
                  <span className="text-sm font-bold">Node Network Status</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-slate-400">Sync Strength</p>
                    <p className="text-lg font-black italic">OPTIMAL</p>
                  </div>
                  <div className="flex gap-1 items-end h-8">
                    <div className="w-1 bg-primary h-4 rounded-full"></div>
                    <div className="w-1 bg-primary h-6 rounded-full"></div>
                    <div className="w-1 bg-primary h-5 rounded-full"></div>
                    <div className="w-1 bg-primary h-8 rounded-full"></div>
                    <div className="w-1 bg-primary h-7 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
