import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us. Our enterprise team will get back to you shortly.');
    navigate('/landing');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display flex flex-col items-center justify-center p-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/landing')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="font-bold">Back to Home</span>
      </button>

      <div className="w-full max-w-2xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 border border-primary/30">
            <span className="material-symbols-outlined text-4xl">corporate_fare</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Contact Enterprise Sales</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Secure your organization with high-integrity storage. Our security architects are ready to help.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300" htmlFor="name">Full Name</label>
              <input 
                required
                type="text" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300" htmlFor="email">Work Email</label>
              <input 
                required
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300" htmlFor="phone">Phone Number</label>
            <input 
              required
              type="tel" 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300" htmlFor="message">Message</label>
            <textarea 
              required
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your organization's storage needs..."
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-background-dark font-black rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
          >
            Submit Inquiry
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            <span className="text-primary mr-2">●</span> Fully Encrypted Communication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
