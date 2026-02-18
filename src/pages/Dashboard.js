import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI, submissionAPI } from '../utils/api';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        assignmentAPI.getAll(),
        submissionAPI.getAll()
      ]);
      
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);
      
      if (user.role === 'admin') {
        setStats({
          totalAssignments: assignmentsRes.data.length,
          totalSubmissions: submissionsRes.data.length,
          pendingGrading: submissionsRes.data.filter(s => !s.grade).length
        });
      } else {
        const userSubmissions = submissionsRes.data.filter(s => s.student === user.id);
        setStats({
          totalAssignments: assignmentsRes.data.length,
          submitted: userSubmissions.length,
          pending: assignmentsRes.data.length - userSubmissions.length,
          graded: userSubmissions.filter(s => s.grade).length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Welcome, {user.name}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {user.role === 'admin' ? (
          <>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white/90">Total Assignments</h3>
              <p className="text-4xl font-bold text-white mt-2">{stats.totalAssignments}</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white/90">Total Submissions</h3>
              <p className="text-4xl font-bold text-white mt-2">{stats.totalSubmissions}</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white/90">Pending Grading</h3>
              <p className="text-4xl font-bold text-white mt-2">{stats.pendingGrading}</p>
            </div>
          </>
        ) : (
          <>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white/90">Total Assignments</h3>
              <p className="text-4xl font-bold text-white mt-2">{stats.totalAssignments}</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white/90">Submitted</h3>
              <p className="text-4xl font-bold text-white mt-2">{stats.submitted}</p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white/90">Pending</h3>
              <p className="text-4xl font-bold text-white mt-2">{stats.pending}</p>
            </div>
          </>
        )}
      </div>

      {/* Recent Assignments */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Recent Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-white/70">No assignments available.</p>
        ) : (
          <div className="space-y-4">
            {assignments.slice(0, 5).map((assignment) => (
              <div key={assignment._id} className="glass p-4 rounded-lg border-l-4 border-white/50">
                <h3 className="font-semibold text-white text-lg">{assignment.title}</h3>
                <p className="text-white/80 text-sm mt-1">{assignment.description}</p>
                <p className="text-sm text-white/60 mt-2">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;