import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignmentAPI, submissionAPI } from '../utils/api';
import Loading from '../components/Loading';

const SubmitTask = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [formData, setFormData] = useState({
    content: '',
    file: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await assignmentAPI.getAll();
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
    
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) {
      setError('Please select an assignment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('assignment', selectedAssignment);
      submitData.append('content', formData.content);
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      await submissionAPI.create(submitData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Submit Assignment</h1>
        
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Assignment Selection */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Select Assignment *
              </label>
              <select
                required
                className="glass-input w-full px-4 py-3 rounded-lg text-white"
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
              >
                <option value="" className="bg-purple-900">Choose an assignment...</option>
                {assignments.map((assignment) => (
                  <option key={assignment._id} value={assignment._id} className="bg-purple-900">
                    {assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Assignment Details */}
            {selectedAssignment && (
              <div className="glass p-5 rounded-xl border border-white/30">
                {(() => {
                  const assignment = assignments.find(a => a._id === selectedAssignment);
                  return assignment ? (
                    <div>
                      <h3 className="font-semibold text-white text-lg">{assignment.title}</h3>
                      <p className="text-white/80 text-sm mt-2">{assignment.description}</p>
                      <p className="text-white/60 text-xs mt-3">
                        📅 Due: {new Date(assignment.dueDate).toLocaleString()}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
            
            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Submission Content *
              </label>
              <textarea
                required
                rows={6}
                className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-white/60"
                placeholder="Enter your submission content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Upload File or Photo
              </label>
              <div className="glass border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-white/50 transition-all cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-16 h-16 text-white/60 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-white font-semibold text-lg">Click to upload file</span>
                  <span className="text-white/60 text-sm mt-2">
                    Images, PDF, DOC, TXT (Max 10MB)
                  </span>
                </label>
              </div>
              
              {/* File Preview */}
              {formData.file && (
                <div className="mt-4 glass p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-white">{formData.file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, file: null });
                        setPreview(null);
                      }}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Image Preview */}
                  {preview && (
                    <div className="mt-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg border-2 border-white/20"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 glass rounded-lg text-white hover:bg-white/20 transition border border-white/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedAssignment}
              className="px-8 py-3 bg-green-500/80 text-white rounded-lg hover:bg-green-600/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold transition shadow-lg"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitTask;