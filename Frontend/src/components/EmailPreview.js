import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmailPreview = ({ data, onClose, onSend, isLoading }) => {
  console.log('Received Preview Data:', data);
  const [recipientDetails, setRecipientDetails] = useState({ to: '', cc: '' });
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (data && data.recipient_group) {
      fetchRecipientDetails(data.recipient_group);
    }
  }, [data]);

  const fetchRecipientDetails = async (groupName) => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(`/api/email/groups/${groupName}`);
      setRecipientDetails({
        to: response.data.to || '',
        cc: response.data.cc || ''
      });
    } catch (error) {
      console.error('Error fetching recipient details:', error);
      setRecipientDetails({ to: '', cc: '' });
      // You could also set an error state here if needed
    } finally {
      setLoadingDetails(false);
    }
  };

  const hasError = !isLoading && !loadingDetails && (!data || !data.recipient_group || !recipientDetails.to);

  const openEmailClient = () => {
    if (!data || !recipientDetails.to) {
      alert('Email details not available');
      return;
    }

    // Create email body content
    const emailBody = `
Incident Notification - ${data.trigger_name || 'N/A'}

INCIDENT DETAILS:
- Severity: ${data.severity || 'N/A'}
- Trigger Name: ${data.trigger_name || 'N/A'}
- Event Date: ${data.event_date || 'N/A'}
- Event Time: ${data.event_start_time || 'N/A'}
- Description: ${data.trigger_description || 'N/A'}

HOST INFORMATION:
- Host Name: ${data.host_name || 'N/A'}
- Host IP: ${data.host_ip || 'N/A'}

This is an automated alert from the Network Operations Center.
Please review and edit this email before sending.

---
Sent via NOC Email Sender - ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true })}
Contact support at noc@groupit.hayleys.com for assistance.
    `.trim();

    // Create mailto link
    const subject = encodeURIComponent(`[${data.severity || 'ALERT'}] ${data.trigger_name || 'Incident Report'}`);
    const body = encodeURIComponent(emailBody);
    const to = encodeURIComponent(recipientDetails.to);
    const cc = recipientDetails.cc ? encodeURIComponent(recipientDetails.cc) : '';
    
    let mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;
    if (cc) {
      mailtoLink += `&cc=${cc}`;
    }

    // Open email client
    window.open(mailtoLink);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Email Preview</h2>
      {(isLoading || loadingDetails) && <p>Loading preview data...</p>}
      {hasError && (
        <p style={{ color: '#dc3545' }}>
          Error: Recipient group or email details not available. Please select a valid group or check the server connection.
        </p>
      )}
      {!isLoading && !loadingDetails && !hasError && (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
          <h3>Incident Notification</h3>
          <p><strong>Recipient Group:</strong> {data.recipient_group || 'N/A'}</p>
          <p><strong>To:</strong> {recipientDetails.to || 'N/A'}</p>
          <p><strong>CC:</strong> {recipientDetails.cc || 'N/A'}</p>
          <p><strong>Severity:</strong> {data.severity || 'N/A'}</p>
          <p><strong>Trigger Name:</strong> {data.trigger_name || 'N/A'}</p>
          <p><strong>Event Date:</strong> {data.event_date || 'N/A'}</p>
          <p><strong>Event Start Time:</strong> {data.event_start_time || 'N/A'}</p>
          <p><strong>Description:</strong> {data.trigger_description || 'N/A'}</p>
          <p><strong>Host Name:</strong> {data.host_name || 'N/A'}</p>
          <p><strong>Host IP:</strong> {data.host_ip || 'N/A'}</p>
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={openEmailClient} disabled={isLoading || loadingDetails || hasError} style={{ padding: '10px 20px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}>
          Open in Email Client
        </button>
        <button onClick={onSend} disabled={isLoading || loadingDetails || hasError} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Confirm Send
        </button>
        <button onClick={onClose} disabled={isLoading || loadingDetails} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EmailPreview;