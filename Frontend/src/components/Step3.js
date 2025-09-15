import React from 'react';

const Step3 = ({ formData, handleChange, prevStep, handlePreview }) => (
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
        textarea, input {
          width: 100%;
          padding: 10px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }
        textarea:focus, input:focus {
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
        .btn-prev {
          background-color: #7f8c8d;
          color: white;
        }
        .btn-prev:hover {
          background-color: #6c757d;
        }
        .btn-preview {
          background-color: #3498db;
          color: white;
        }
        .btn-preview:hover {
          background-color: #2980b9;
        }
        .btn-group {
          display: flex;
          gap: 10px;
        }
        @media (max-width: 600px) {
          .step-container { padding: 15px; }
          .step-title { font-size: 20px; }
          .btn { padding: 8px 16px; }
          .btn-group { flex-direction: column; gap: 8px; }
        }
      `}
    </style>
    <div className="step-container">
      <h2 className="step-title">Step 3: Additional Details</h2>
      <div className="form-group">
        <label className="form-label">Trigger Description:</label>
        <textarea
          name="trigger_description"
          value={formData.trigger_description}
          onChange={handleChange}
          style={{ minHeight: '100px' }}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Host Name:</label>
        <input
          name="host_name"
          value={formData.host_name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Host IP:</label>
        <input
          name="host_ip"
          value={formData.host_ip}
          onChange={handleChange}
        />
      </div>
      <div className="btn-group">
        <button onClick={prevStep} className="btn btn-prev">Previous</button>
        <button
          onClick={handlePreview}
          className="btn btn-preview"
        >
          Preview & Send
        </button>
      </div>
    </div>
  </div>
);

export default Step3;