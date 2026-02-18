# Assignment Portal Frontend

A React.js frontend for the Assignment and Daily Task Submission Website.

## Features

### Student Features
- Register/Login
- View assignments
- Submit tasks with file uploads
- View grades and feedback
- Dashboard with pending/completed tasks

### Admin (Teacher) Features
- Register/Login as admin
- Create assignments with due dates
- View all submissions
- Grade submissions
- Provide feedback
- Dashboard with statistics

## Tech Stack
- **React.js** - Frontend framework
- **React Router** - Navigation
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **Context API** - State management

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm start
```

The app will run on `http://localhost:3000`

## Project Structure
```
src/
├── components/
│   ├── Header.js          # Navigation header
│   ├── Loading.js         # Loading spinner
│   └── ProtectedRoute.js  # Route protection
├── context/
│   └── AuthContext.js     # Authentication context
├── pages/
│   ├── Login.js           # Login page
│   ├── Register.js        # Registration page
│   ├── Dashboard.js       # User dashboard
│   ├── Assignments.js     # Assignments list
│   ├── CreateAssignment.js # Create assignment (admin)
│   ├── SubmitAssignment.js # Submit assignment (student)
│   └── Submissions.js     # View submissions (admin)
├── utils/
│   └── api.js            # API utility functions
├── App.js                # Main app component
└── index.js              # Entry point
```

## Key Features

### Authentication
- JWT-based authentication
- Role-based access control (student/admin)
- Protected routes
- Persistent login state

### User Interface
- Responsive design with Tailwind CSS
- Loading states for better UX
- Form validation
- Error handling

### API Integration
- Axios interceptors for token management
- Centralized API functions
- File upload support

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

## Future Enhancements

### Multiple Classes
- Add class/course management
- Assign students to specific classes
- Filter assignments by class

### Notifications
- Real-time notifications for new assignments
- Email notifications for due dates
- Push notifications

### Real-time Updates
- Socket.io integration for live updates
- Real-time submission notifications
- Live grading updates

### Additional Features
- File preview functionality
- Bulk grading
- Assignment templates
- Analytics dashboard
- Mobile app version