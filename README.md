# NOC Email System

A comprehensive email notification system for Network Operations Center (NOC) alerts and incidents.

## Features

- **Multi-step Form**: User-friendly 3-step form for creating incident reports
- **Recipient Groups**: Pre-configured email groups for different departments and systems
- **Email Templates**: Professional HTML email templates with company branding
- **Authentication**: Secure JWT-based authentication system
- **Real-time Preview**: Live preview of emails before sending
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- React DatePicker
- CSS3 with responsive design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email sending
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Email SMTP credentials

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/noc-email-system
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Step 1**: Select recipient group and basic incident details
3. **Step 2**: Set event date and time
4. **Step 3**: Add detailed description and host information
5. **Preview**: Review the email before sending
6. **Send**: Confirm and send the email

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Email
- `GET /api/email/groups` - Get all recipient groups
- `GET /api/email/groups/:groupName` - Get specific group details
- `POST /api/email/send` - Send email notification

## Configuration

### Recipient Groups
Recipient groups are automatically initialized with the following categories:
- Access Switches (various departments)
- Core Switches (different companies)
- Firewalls (security systems)
- Backup Systems (Avamar, VCenter)
- Test Groups

### Email Template
The system uses a professional HTML email template with:
- Company branding
- Incident details
- Host information
- Responsive design
- Professional styling

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Environment variable protection

## Error Handling

- Comprehensive error messages
- Input validation
- Network error handling
- Graceful fallbacks

## Development

### Project Structure
```
├── Backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── Frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for internal use only.

## Support

For technical support, contact the NOC team at noc@groupit.hayleys.com
