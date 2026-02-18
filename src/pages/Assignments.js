import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assignmentAPI } from '../utils/api';
import Loading from '../components/Loading';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [searchTerm, filterStatus, assignments]);

  const fetchAssignments = async () => {
    try {
      const response = await assignmentAPI.getAll();
      setAssignments(response.data);
      setFilteredAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus === 'upcoming') {
      filtered = filtered.filter(a => new Date(a.dueDate) > new Date());
    } else if (filterStatus === 'overdue') {
      filtered = filtered.filter(a => new Date(a.dueDate) < new Date());
    }

    setFilteredAssignments(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentAPI.delete(id);
        setAssignments(assignments.filter(a => a._id !== id));
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-white">Assignments</h1>
        {user.role === 'admin' && (
          <Link
            to="/assignments/create"
            className="bg-blue-500/80 text-white px-6 py-3 rounded-lg hover:bg-blue-600/80 transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Assignment
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="🔍 Search assignments..."
              className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-white/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="glass-input w-full px-4 py-3 rounded-lg text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all" className="bg-purple-900">All Assignments</option>
              <option value="upcoming" className="bg-purple-900">Upcoming</option>
              <option value="overdue" className="bg-purple-900">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-white/70 text-lg">No assignments found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAssignments.map((assignment) => {
            const isOverdue = new Date(assignment.dueDate) < new Date();
            return (
              <div key={assignment._id} className="glass-card rounded-xl p-6 hover:scale-[1.02] transition-transform">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-semibold text-white">{assignment.title}</h2>
                      {isOverdue && (
                        <span className="bg-red-500/80 text-white text-xs px-3 py-1 rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 mb-4">{assignment.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Created: {new Date(assignment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {user.role === 'student' ? (
                      <Link
                        to={`/assignments/${assignment._id}/submit`}
                        className="bg-green-500/80 text-white px-5 py-2 rounded-lg hover:bg-green-600/80 transition flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Submit
                      </Link>
                    ) : (
                      <>
                        <Link
                          to={`/assignments/${assignment._id}/submissions`}
                          className="bg-blue-500/80 text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 transition"
                        >
                          View Submissions
                        </Link>
                        <button
                          onClick={() => handleDelete(assignment._id)}
                          className="bg-red-500/80 text-white px-4 py-2 rounded-lg hover:bg-red-600/80 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;