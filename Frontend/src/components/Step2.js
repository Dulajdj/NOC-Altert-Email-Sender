import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Step2 = ({ formData, handleChange, nextStep, prevStep }) => {
  const handleDateChange = (date) => {
    handleChange({ target: { name: 'event_date', value: date.toISOString().split('T')[0] } });
  };

  return (
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
          select, input, .react-datepicker__input-container input {
            width: 100%;
            padding: 10px;
            border: 1px solid #bdc3c7;
            border-radius: 4px;
            font-size: 14px;
            transition: border-color 0.2s ease;
          }
          select:focus, input:focus, .react-datepicker__input-container input:focus {
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
          .btn-next {
            background-color: #3498db;
            color: white;
          }
          .btn-next:hover {
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
        <h2 className="step-title">Step 2: Event Details</h2>
        <div className="form-group">
          <label className="form-label">Event Date:</label>
          <DatePicker
            selected={new Date(formData.event_date)}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Event Start Time:</label>
          <input
            type="time"
            name="event_start_time"
            value={formData.event_start_time}
            onChange={handleChange}
          />
        </div>
        <div className="btn-group">
          <button onClick={prevStep} className="btn btn-prev">Previous</button>
          <button onClick={nextStep} className="btn btn-next">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Step2;