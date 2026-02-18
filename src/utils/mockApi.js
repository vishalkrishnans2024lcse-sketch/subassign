// Mock API for testing frontend without backend
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@test.com',
    password: 'student123',
    role: 'student'
  }
];

const mockAssignments = [
  {
    _id: '1',
    title: 'Math Assignment 1',
    description: 'Complete exercises 1-10 from chapter 3',
    dueDate: '2024-02-15T23:59:00Z',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Science Project',
    description: 'Create a presentation on renewable energy',
    dueDate: '2024-02-20T23:59:00Z',
    createdAt: '2024-01-20T10:00:00Z'
  }
];

const mockSubmissions = [
  {
    _id: '1',
    assignment: '1',
    student: { name: 'Student User' },
    content: 'Here is my completed assignment...',
    submittedAt: '2024-01-16T14:30:00Z',
    grade: 85,
    feedback: 'Good work! Could improve on problem 7.'
  }
];

// Mock API functions
export const mockAuthAPI = {
  login: (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => 
          u.email === credentials.email && u.password === credentials.password
        );
        
        if (user) {
          resolve({
            data: {
              user: { id: user.id, name: user.name, email: user.email, role: user.role },
              token: 'mock-jwt-token'
            }
          });
        } else {
          reject({ response: { data: { message: 'Invalid credentials' } } });
        }
      }, 1000);
    });
  },
  
  register: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Registration successful' } });
      }, 1000);
    });
  }
};

export const mockAssignmentAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockAssignments });
      }, 500);
    });
  },
  
  create: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { ...data, _id: Date.now().toString() } });
      }, 1000);
    });
  },
  
  delete: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Assignment deleted' } });
      }, 500);
    });
  }
};

export const mockSubmissionAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockSubmissions });
      }, 500);
    });
  },
  
  getByAssignment: (assignmentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockSubmissions.filter(s => s.assignment === assignmentId);
        resolve({ data: filtered });
      }, 500);
    });
  },
  
  create: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Submission created successfully' } });
      }, 1000);
    });
  },
  
  grade: (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Submission graded successfully' } });
      }, 500);
    });
  }
};