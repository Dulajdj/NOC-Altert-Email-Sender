import React from 'react';

const Step1 = ({ formData, handleChange, groups, nextStep, setFormData }) => (
  <div>
    <style>
      {`
        .step-container {
          margin-top: 20px;
          padding: 20px;
          background-color: #ffffff;
          border: 1px solid #ecf0f1;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .step-title {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #34495e;
          margin-bottom: 5px;
        }
        select, input {
          width: 100%;
          padding: 10px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }
        select:focus, input:focus {
          border-color: #3498db;
          outline: none;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .btn-next {
          background-color: #3498db;
          color: white;
        }
        .btn-next:hover {
          background-color: #2980b9;
        }
        @media (max-width: 600px) {
          .step-container { padding: 15px; }
          .step-title { font-size: 20px; }
          .btn { padding: 8px 16px; }
        }
      `}
    </style>
    <div className="step-container">
      <h2 className="step-title">Step 1: Incident Details</h2>
      {groups.length === 0 && <p style={{ color: '#e74c3c', marginBottom: '15px' }}>No recipient groups available.</p>}
      <div className="form-group">
        <label className="form-label">Recipient Group:</label>
        <select
          name="recipient_group"
          value={formData.recipient_group}
          onChange={handleChange}
        >
          <option value="">Select</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Severity:</label>
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Trigger Name:</label>
        <input
          name="trigger_name"
          value={formData.trigger_name}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={nextStep}
        className="btn btn-next"
      >
        Next
      </button>
    </div>
  </div>
);

export default Step1;