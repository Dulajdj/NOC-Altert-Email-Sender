import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import EmailPreview from './components/EmailPreview';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient_group: '',
    severity: 'High',
    trigger_name: '',
    event_date: new Date().toISOString().split('T')[0],
    event_start_time: '00:00',
    trigger_description: '',
    host_name: '',
    host_ip: ''
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchGroups();
    } else {
      setLoading(false);
    }
  }, [token]);

const fetchGroups = async () => {
  setLoading(true);
  setError('');
  try {
    const res = await axios.get('/api/email/groups');
    console.log('Fetched groups:', res.data);
    // Sort groups alphabetically
    const sortedGroups = res.data.sort((a, b) => a.localeCompare(b));
    setGroups(sortedGroups);
  } catch (err) {
    console.error('Groups fetch error:', err);
    if (err.response && err.response.status === 401) {
      // Token invalid or expired, log out user and show message
      localStorage.removeItem('token');
      setToken(null);
      setError('Session expired or unauthorized. Please log in again.');
    } else {
      setError('Failed to load groups. Check backend.');
    }
  } finally {
    setLoading(false);
  }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1 && !formData.recipient_group) {
      setError('Please select a recipient group.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const generateEmailTemplate = (data) => {
    const { severity, trigger_name, event_date, event_start_time, trigger_description, host_name, host_ip } = data;
    const description = (trigger_description || '').replace(/\n/g, '<br>');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #ffffffff, #ff0000ff); padding: 20px; display: flex; align-items: center; border-bottom: 1px solid #e9ecef; }
            .header .logo { flex: 0 0 auto; margin: 0 20px; }
            .header .logo img { max-width: 120px; height: auto; display: block; }
            .header .header-content { flex: 1; color: #ffffff; margin-right: 20px; }
            .header h1 { font-size: 24px; margin: 0; font-weight: 600; }
            .header p { font-size: 16px; margin: 5px 0 0; opacity: 0.9; }
            .content { padding: 20px 30px; }
            .section { margin-bottom: 20px; }
            .section h2 { font-size: 18px; color: #007bff; margin: 0 0 10px; border-bottom: 2px solid #e9ecef; padding-bottom: 5px; }
            .info-row { display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 14px; }
            .info-row label { font-weight: 600; color: #495057; width: 120px; min-width: 120px; margin-right: 15px; }
            .info-row span { color: #212529; flex: 1; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; }
            @media (max-width: 600px) { .container { margin: 10px; } .header { flex-direction: column; text-align: center; } .header .logo { margin: 0 0 15px 0; } .header .header-content { margin-right: 0; } .info-row { flex-direction: column; } .info-row label { width: auto; margin-bottom: 5px; margin-right: 0; } }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="https://i.imgur.com/wK7GbuP.png" alt="NOC Logo" style="max-width: 120px; height: auto;">
                </div>
                <div class="header-content">
                    <h1 style="color: black;">Network Operation Center</h1>
                    <p style="color: red; font-weight: bold;">Alert Detected!</p>
                </div>
            </div>
            <div class="content">
                <div class="section">
                    <h2> Trigger Information</h2>
                    <div class="info-row"><label>Problem:</label><span>${trigger_name || 'N/A'}</span></div>
                    <div class="info-row"><label>Problem Started:</label><span>at ${event_start_time || 'N/A'} on ${event_date || 'N/A'}</span></div>
                    <div class="info-row"><label>Severity:</label><span>${severity || 'N/A'}</span></div>
                    <div class="info-row"><label>Description:</label><span>${description || 'N/A'}</span></div>
                </div>
                <div class="section">
                    <h2>Host Information</h2>
                    <div class="info-row"><label>Host Name:</label><span>${host_name || 'N/A'}</span></div>
                    <div class="info-row"><label>Host IP:</label><span>${host_ip || 'N/A'}</span></div>
                </div>
            </div>
            <div class="footer">
                <p>This message was sent by the FIT NOC team.</p>
                <p>Monitoring System - Confidential</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  const handlePreview = () => {
    if (!formData.trigger_name || !formData.host_name || !formData.host_ip) {
      setError('Trigger name, host name, and host IP are required.');
      return;
    }
    setError('');
    
    // Generate email template and open in new tab
    const emailTemplate = generateEmailTemplate(formData);
    const newWindow = window.open('', '_blank');
    newWindow.document.write(emailTemplate);
    newWindow.document.close();
    
    setShowPreview(true);
  };

  const handleSend = async () => {
    console.log('Sending with token:', localStorage.getItem('token'));
    console.log('Form data:', formData);
    try {
      await axios.post('/api/email/send', formData);
      alert('Email sent!');
      setShowPreview(false);
      setFormData({
        recipient_group: '',
        severity: 'High',
        trigger_name: '',
        event_date: new Date().toISOString().split('T')[0],
        event_start_time: '00:00',
        trigger_description: '',
        host_name: '',
        host_ip: ''
      });
      setStep(1);
    } catch (err) {
      console.error('Send error:', err);
      alert(err.response?.data?.error || 'Error sending email');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: '#dc3545', textAlign: 'center' }}>{error}</p>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/" element={token ? (
          <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>NOC Email Sender</h1>
            <progress value={step} max="3" style={{ width: '100%' }} />
            {step === 1 && <Step1 formData={formData} handleChange={handleChange} groups={groups} nextStep={nextStep} setFormData={setFormData} />}
            {step === 2 && <Step2 formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
            {step === 3 && <Step3 formData={formData} handleChange={handleChange} prevStep={prevStep} handlePreview={handlePreview} />}
            {showPreview && <EmailPreview data={formData} onClose={() => setShowPreview(false)} onSend={handleSend} />}
          </div>
        ) : <Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default App;