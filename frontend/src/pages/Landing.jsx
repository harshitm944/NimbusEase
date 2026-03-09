import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary text-2xl">cloud_done</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">NimbusEase</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#architecture">Architecture</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#process">Process</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold hover:text-primary transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 hero-gradient">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                System Online: v4.2.0
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter">
                The Vault That <br/><span className="text-primary">Never Trusts</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Secure your data with the Notary Architecture: High-integrity storage powered by Blockchain Proofs and AI-driven Threat Mitigation.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-slate-200 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 px-8 py-4 rounded-lg font-bold text-lg transition-all">
                  View Documentation
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30"></div>
              <div className="relative bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-2xl aspect-video">
                <div className="p-4 border-b border-slate-700 flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/20"></div>
                  <div className="size-3 rounded-full bg-yellow-500/20"></div>
                  <div className="size-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="p-8 flex flex-col gap-6">
                  <div className="h-2 w-1/3 bg-primary/20 rounded"></div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-24 bg-primary/5 rounded border border-primary/10"></div>
                    <div className="h-24 bg-primary/10 rounded border border-primary/20"></div>
                    <div className="h-24 bg-primary/5 rounded border border-primary/10"></div>
                    <div className="h-24 bg-primary/5 rounded border border-primary/10"></div>
                  </div>
                  <div className="h-32 bg-slate-800/50 rounded flex items-center justify-center border border-dashed border-slate-700">
                    <span className="text-xs text-slate-500 font-mono">ENCRYPTED_DATA_STREAM_ID: 9823-XA-11</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Visualization */}
        <section className="py-24 bg-slate-50 dark:bg-[#0a1a1a]" id="architecture">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">The Notary Architecture</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our tri-layer defense system ensures your data remains immutable, verified, and protected around the clock.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-px border-t border-dashed border-primary/30 -translate-y-1/2 z-0"></div>
              {/* Card 1 */}
              <div className="relative z-10 flex flex-col items-center text-center p-8 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl feature-card">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner">
                  <span className="material-symbols-outlined text-4xl">database</span>
                </div>
                <h3 className="text-xl font-bold mb-3">The Warehouse</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Military-grade storage built on AWS S3, featuring regional redundancy and end-to-end shard encryption.</p>
              </div>
              {/* Card 2 */}
              <div className="relative z-10 flex flex-col items-center text-center p-8 bg-background-light dark:bg-background-dark border border-primary/40 rounded-xl feature-card shadow-[0_0_20px_rgba(13,242,242,0.1)]">
                <div className="size-16 rounded-2xl bg-primary flex items-center justify-center mb-6 text-background-dark">
                  <span className="material-symbols-outlined text-4xl">link</span>
                </div>
                <h3 className="text-xl font-bold mb-3">The Notary</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">The heart of integrity. A blockchain-based verification layer that creates an immutable finger-print for every file.</p>
              </div>
              {/* Card 3 */}
              <div className="relative z-10 flex flex-col items-center text-center p-8 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl feature-card">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner">
                  <span className="material-symbols-outlined text-4xl">shield_person</span>
                </div>
                <h3 className="text-xl font-bold mb-3">The Guard</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI-driven sentinel monitoring access patterns in real-time, instantly isolating threats before they escalate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24" id="process">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Zero-Trust Flow</h2>
                <div className="space-y-12">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-primary">01</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Secure Upload</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Files are encrypted locally before transmission using AES-256-GCM. Your keys never leave your machine.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-primary">02</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Integrity Verification</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Notary generates a cryptographic hash and records it on the ledger. Instant proof of non-tampering.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 size-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-primary">03</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Attack Mitigation</h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">AI monitors every read/write request. Anomalous behavior triggers an immediate cryptographic lockout.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-slate-100 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="bg-background-dark rounded-xl p-8 aspect-square flex flex-col gap-4 overflow-hidden relative">
                  <div className="flex justify-between items-center mb-8">
                    <div className="size-8 rounded bg-primary/20 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">laptop</span></div>
                    <div className="h-px bg-slate-700 flex-1 mx-4 relative overflow-hidden">
                      <div className="absolute h-full w-1/4 bg-primary animate-pulse"></div>
                    </div>
                    <div className="size-8 rounded bg-primary/20 flex items-center justify-center"><span className="material-symbols-outlined text-primary text-sm">storage</span></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-10 bg-slate-800 rounded flex items-center px-4 gap-3">
                      <span className="material-symbols-outlined text-xs text-green-500">check_circle</span>
                      <span className="text-[10px] font-mono text-slate-400">SHA-256: 0x82...f9e1 verified</span>
                    </div>
                    <div className="h-10 bg-slate-800 rounded flex items-center px-4 gap-3">
                      <span className="material-symbols-outlined text-xs text-green-500">check_circle</span>
                      <span className="text-[10px] font-mono text-slate-400">Guard: Access pattern normal</span>
                    </div>
                    <div className="h-20 border border-primary/20 bg-primary/5 rounded p-4 flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase font-bold text-primary">Live Protection</span>
                        <span className="text-[10px] text-slate-500">99.99% Secure</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-50 dark:bg-background-dark/50 border-y border-slate-200 dark:border-slate-800" id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <span className="material-symbols-outlined text-4xl text-primary">visibility_off</span>
                <h3 className="text-2xl font-bold">Zero-Knowledge Privacy</h3>
                <p className="text-slate-600 dark:text-slate-400">Even we can't see your data. Our architecture ensures that only the data owner holds the decryption keys.</p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="material-symbols-outlined text-4xl text-primary">neurology</span>
                <h3 className="text-2xl font-bold">AI Anomaly Detection</h3>
                <p className="text-slate-600 dark:text-slate-400">Predictive defense mechanisms that learn from global threat patterns to secure your local environment.</p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="material-symbols-outlined text-4xl text-primary">history_edu</span>
                <h3 className="text-2xl font-bold">Immutable Truth Log</h3>
                <p className="text-slate-600 dark:text-slate-400">Every interaction is logged on an immutable chain, providing a clear audit trail for compliance and forensic analysis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-primary rounded-2xl p-12 text-center flex flex-col items-center gap-6 shadow-2xl shadow-primary/20">
              <h2 className="text-3xl md:text-5xl font-black text-background-dark">Ready for Total Integrity?</h2>
              <p className="text-background-dark/80 text-lg max-w-xl font-medium">Join the security architects moving to the future of zero-trust storage. Deploy your instance in under 5 minutes.</p>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-transparent border-2 border-background-dark/20 text-background-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-background-dark/5 transition-colors"
                >
                  Contact Enterprise
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-[#081212] py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="size-8 bg-primary/20 rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">cloud_done</span>
                </div>
                <span className="text-lg font-bold tracking-tight">NimbusEase</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">The future of secure, decentralized, and intelligent cloud storage architecture.</p>
            </div>
            <div>
              <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary">Product</h5>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Security Audit</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">API Docs</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary">Company</h5>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Our Labs</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-primary">Status</h5>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="size-2 rounded-full bg-green-500"></div>
                All systems operational
              </div>
              <div className="mt-4 flex gap-4">
                <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">terminal</span></a>
                <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
                <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">code</span></a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">© 2024 NimbusEase Technologies Inc. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-slate-500">
              <a className="hover:text-primary" href="#">Privacy Policy</a>
              <a className="hover:text-primary" href="#">Terms of Service</a>
              <a className="hover:text-primary" href="#">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
