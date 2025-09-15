// MultiStepForm.js
import React, { useState, useEffect } from 'react';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import EmailPreview from './components/EmailPreview';
import axios from 'axios';

const MultiStepForm = ({ token, setToken, setError }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient_group: '',
    to: '',
    cc: '',
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState({});

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchGroups();
    }
  }, [token]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/email/groups');
      setGroups(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load groups.');
      }
    } finally {
      setLoading(false);
    }
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

  const handlePreview = () => {
    if (!formData.trigger_name || !formData.host_name || !formData.host_ip) {
      setError('Trigger name, host name, and host IP are required.');
      return;
    }
    if (!formData.recipient_group) {
      setError('Please select a valid recipient group.');
      return;
    }
    setError('');
    setPreviewData({ ...formData });
    setShowPreview(true);
  };

  const handleSend = async () => {
    try {
      await axios.post('/api/email/send', formData);
      alert('Email sent!');
      setShowPreview(false);
      setFormData({
        recipient_group: '',
        to: '',
        cc: '',
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
      setError(err.response?.data?.error || 'Error sending email');
    }
  };

  const handleClose = () => {
    setShowPreview(false);
    setError('');
  };

  if (loading) return <p>Loading groups...</p>;

  return (
    <div>
      <progress value={step} max="3" style={{ width: '100%' }} />
      {step === 1 && (
        <Step1
          formData={formData}
          groups={groups}
          nextStep={nextStep}
          setFormData={setFormData}
        />
      )}
      {step === 2 && (
        <Step2
          formData={formData}
          handleChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <Step3
          formData={formData}
          handleChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          prevStep={prevStep}
          handlePreview={handlePreview}
        />
      )}
      {showPreview && (
        <EmailPreview
          data={previewData}
          onClose={handleClose}
          onSend={handleSend}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default MultiStepForm;
