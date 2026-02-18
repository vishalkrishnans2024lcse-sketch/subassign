import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { assignmentAPI, submissionAPI } from '../utils/api';
import Loading from '../components/Loading';

const Submissions = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        assignmentAPI.getAll(),
        submissionAPI.getByAssignment(id)
      ]);
      
      const assignment = assignmentRes.data.find(a => a._id === id);
      setAssignment(assignment);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId, grade, feedback) => {
    try {
      await submissionAPI.grade(submissionId, { grade, feedback });
      setSubmissions(submissions.map(s => 
        s._id === submissionId 
          ? { ...s, grade, feedback }
          : s
      ));
      setGrading({ ...grading, [submissionId]: false });
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Submissions for: {assignment?.title}
      </h1>
      
      {submissions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <div key={submission._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Student: {submission.student?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  {submission.grade ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Grade: {submission.grade}
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Not Graded
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Content:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {submission.content}
                </p>
              </div>
              
              {submission.filePath && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">File:</h4>
                  <a
                    href={submission.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Download File
                  </a>
                </div>
              )}
              
              {grading[submission._id] ? (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Grade Submission:</h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleGrade(
                        submission._id,
                        formData.get('grade'),
                        formData.get('feedback')
                      );
                    }}
                    className="space-y-3"
                  >
                    <div className="flex space-x-4">
                      <input
                        name="grade"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Grade (0-100)"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Submit Grade
                      </button>
                      <button
                        type="button"
                        onClick={() => setGrading({ ...grading, [submission._id]: false })}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      name="feedback"
                      placeholder="Feedback (optional)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </form>
                </div>
              ) : (
                <div className="border-t pt-4">
                  {submission.feedback && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Feedback:</h4>
                      <p className="text-gray-700">{submission.feedback}</p>
                    </div>
                  )}
                  {!submission.grade && (
                    <button
                      onClick={() => setGrading({ ...grading, [submission._id]: true })}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Grade Submission
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Submissions;