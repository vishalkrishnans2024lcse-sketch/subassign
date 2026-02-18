import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assignmentAPI, submissionAPI } from '../utils/api';
import Loading from '../components/Loading';

const SubmitAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    file: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const fetchAssignment = useCallback(async () => {
    try {
      const response = await assignmentAPI.getAll();
      const assignment = response.data.find(a => a._id === id);
      setAssignment(assignment);
    } catch (error) {
      console.error('Error fetching assignment:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
    
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview({ type: 'image', url: e.target.result });
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreview({ type: 'pdf', name: file.name });
      } else {
        setPreview({ type: 'file', name: file.name });
      }
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError('Please enter submission content');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('assignment', id);
      submitData.append('content', formData.content);
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      await submissionAPI.create(submitData);
      navigate('/assignments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-red-400 text-lg">Assignment not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Submit Assignment</h1>
        
        <div className="glass-card rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">{assignment.title}</h2>
          <p className="text-white/80 mb-4">{assignment.description}</p>
          <div className="flex items-center text-white/70">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due: {new Date(assignment.dueDate).toLocaleString()}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Submission Content *
              </label>
              <textarea
                required
                rows={8}
                className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder-white/60"
                placeholder="Enter your submission content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <p className="text-white/60 text-sm mt-2">
                {formData.content.length} characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Upload File (Optional)
              </label>
              <div className="glass border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-white/50 transition-all">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <svg className="w-16 h-16 text-white/60 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-white font-semibold text-lg">Click to upload file</span>
                  <span className="text-white/60 text-sm mt-2">
                    Images, PDF, DOC, TXT (Max 10MB)
                  </span>
                </label>
              </div>
              
              {preview && (
                <div className="mt-4 glass p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">File Preview:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, file: null });
                        setPreview(null);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                  
                  {preview.type === 'image' && (
                    <img
                      src={preview.url}
                      alt="Preview"
                      className="max-w-full h-64 object-cover rounded-lg border-2 border-white/20"
                    />
                  )}
                  
                  {preview.type === 'pdf' && (
                    <div className="flex items-center p-4 bg-white/10 rounded-lg">
                      <svg className="w-12 h-12 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                      </svg>
                      <span className="text-white">{preview.name}</span>
                    </div>
                  )}
                  
                  {preview.type === 'file' && (
                    <div className="flex items-center p-4 bg-white/10 rounded-lg">
                      <svg className="w-12 h-12 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-white">{preview.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/assignments')}
              className="px-6 py-3 glass rounded-lg text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-green-500/80 text-white rounded-lg hover:bg-green-600/80 disabled:opacity-50 flex items-center font-semibold"
            >
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignment;