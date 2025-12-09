// src/pages/Student/feedback.tsx
import React, { useState, useEffect } from 'react';

interface Feedback {
  id: number;
  title: string;
  message: string;
  date: string;
  status: string;
  category: string;
  lastEdited?: string;
}

const Feedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState({ 
    title: '', 
    message: '', 
    category: 'general' 
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFeedback, setEditFeedback] = useState({ 
    title: '', 
    message: '', 
    category: 'general' 
  });

  // Load saved feedback on component mount
  useEffect(() => {
    const savedFeedback = localStorage.getItem('studentFeedback');
    if (savedFeedback) {
      setFeedbackList(JSON.parse(savedFeedback));
    }
  }, []);

  // Save feedback to localStorage whenever feedbackList changes
  useEffect(() => {
    localStorage.setItem('studentFeedback', JSON.stringify(feedbackList));
  }, [feedbackList]);

  const handleSubmitFeedback = () => {
    if (newFeedback.title && newFeedback.message) {
      const feedback: Feedback = {
        id: Date.now(),
        title: newFeedback.title,
        message: newFeedback.message,
        date: new Date().toLocaleDateString(),
        status: 'submitted',
        category: newFeedback.category
      };
      setFeedbackList([feedback, ...feedbackList]);
      setNewFeedback({ title: '', message: '', category: 'general' });
      
      // Show success message
      alert('Feedback submitted successfully!');
    }
  };

  const handleEditFeedback = (id: number) => {
    const feedbackToEdit = feedbackList.find(feedback => feedback.id === id);
    if (feedbackToEdit) {
      setEditingId(id);
      setEditFeedback({
        title: feedbackToEdit.title,
        message: feedbackToEdit.message,
        category: feedbackToEdit.category
      });
    }
  };

  const handleUpdateFeedback = () => {
    if (editFeedback.title && editFeedback.message && editingId) {
      setFeedbackList(feedbackList.map(feedback => 
        feedback.id === editingId 
          ? {
              ...feedback,
              title: editFeedback.title,
              message: editFeedback.message,
              category: editFeedback.category,
              lastEdited: new Date().toLocaleDateString(),
              status: 'updated'
            }
          : feedback
      ));
      
      setEditingId(null);
      setEditFeedback({ title: '', message: '', category: 'general' });
      alert('Feedback updated successfully!');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFeedback({ title: '', message: '', category: 'general' });
  };

  const handleDeleteFeedback = (id: number) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      setFeedbackList(feedbackList.filter(feedback => feedback.id !== id));
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Write/Edit Feedback Form */}
      <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {editingId ? 'Edit Feedback' : 'Write Feedback'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Category</label>
            <select
              value={editingId ? editFeedback.category : newFeedback.category}
              onChange={(e) => editingId 
                ? setEditFeedback({...editFeedback, category: e.target.value})
                : setNewFeedback({...newFeedback, category: e.target.value})
              }
              className="w-full bg-slate-600/50 border border-slate-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            >
              <option value="general">General Feedback</option>
              <option value="academic">Academic</option>
              <option value="faculty">Faculty</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="timetable">Timetable</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Title</label>
            <input
              type="text"
              value={editingId ? editFeedback.title : newFeedback.title}
              onChange={(e) => editingId 
                ? setEditFeedback({...editFeedback, title: e.target.value})
                : setNewFeedback({...newFeedback, title: e.target.value})
              }
              className="w-full bg-slate-600/50 border border-slate-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
              placeholder="Enter feedback title"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Message</label>
            <textarea
              value={editingId ? editFeedback.message : newFeedback.message}
              onChange={(e) => editingId 
                ? setEditFeedback({...editFeedback, message: e.target.value})
                : setNewFeedback({...newFeedback, message: e.target.value})
              }
              rows={4}
              className="w-full bg-slate-600/50 border border-slate-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
              placeholder="Enter your detailed feedback..."
            />
          </div>
          
          {editingId ? (
            <div className="flex gap-3">
              <button
                onClick={handleUpdateFeedback}
                disabled={!editFeedback.title || !editFeedback.message}
                className="flex-1 bg-blue-600/50 hover:bg-blue-600/70 disabled:bg-slate-600/30 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Feedback
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-slate-600/50 hover:bg-slate-600/70 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmitFeedback}
              disabled={!newFeedback.title || !newFeedback.message}
              className="w-full bg-green-600/50 hover:bg-green-600/70 disabled:bg-slate-600/30 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit Feedback
            </button>
          )}
        </div>
      </div>

      {/* Previous Feedback */}
      <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Your Feedback History</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {feedbackList.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p>No feedback submitted yet</p>
            </div>
          ) : (
            feedbackList.map(feedback => (
              <div key={feedback.id} className="bg-slate-600/30 rounded-lg p-4 border border-slate-500/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-semibold">{feedback.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      feedback.category === 'general' ? 'bg-blue-500/20 text-blue-300' :
                      feedback.category === 'academic' ? 'bg-green-500/20 text-green-300' :
                      feedback.category === 'faculty' ? 'bg-orange-500/20 text-orange-300' :
                      feedback.category === 'infrastructure' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {feedback.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditFeedback(feedback.id)}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                      title="Edit feedback"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(feedback.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Delete feedback"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-2">{feedback.message}</p>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>Submitted: {feedback.date}</span>
                    {feedback.lastEdited && (
                      <span className="text-orange-400">• Edited: {feedback.lastEdited}</span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded ${
                    feedback.status === 'submitted' ? 'bg-green-500/20 text-green-300' : 
                    feedback.status === 'updated' ? 'bg-blue-500/20 text-blue-300' : 
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {feedback.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;