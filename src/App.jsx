import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Upload, FileText, Sparkles, History, Settings, Download, Zap, Star, CheckCircle, AlertCircle, Brain, Target, Briefcase, MessageSquare, Users, TrendingUp, Eye, Loader, RefreshCw } from 'lucide-react';

// Use environment variable for backend URL, fallback to primary deployment
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://resume-analyzer-backend-nine.vercel.app';

// Memoize SettingsPanel to prevent unnecessary re-renders
const SettingsPanel = React.memo(({ targetRole, setTargetRole, userId, setUserId, tone, setTone, templateId, setTemplateId, generateCoverLetter, setGenerateCoverLetter, generateInterviewQuestions, setGenerateInterviewQuestions }) => (
  <div className="bg-gray-900 rounded-2xl p-6 border border-green-500/20 space-y-6">
    <div className="flex items-center space-x-3 mb-6">
      <Settings className="w-5 h-5 text-green-400" />
      <h3 className="text-lg font-semibold text-white">Settings</h3>
    </div>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Target Role</label>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          onFocus={() => console.log('Target Role input focused')}
          onBlur={() => console.log('Target Role input blurred')}
          placeholder="e.g., Software Engineer"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value || '')}
          onFocus={() => console.log('User ID input focused')}
          onBlur={() => console.log('User ID input blurred')}
          placeholder="Optional (leave empty for anonymous)"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
        >
          <option value="formal">Formal</option>
          <option value="friendly">Friendly</option>
          <option value="technical">Technical</option>
          <option value="casual">Casual</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Template</label>
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
        >
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
          <option value="professional">Professional</option>
        </select>
      </div>
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generateCoverLetter}
            onChange={(e) => setGenerateCoverLetter(e.target.checked)}
            className="w-5 h-5 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
          />
          <span className="text-gray-300">Generate Cover Letter</span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generateInterviewQuestions}
            onChange={(e) => setGenerateInterviewQuestions(e.target.checked)}
            className="w-5 h-5 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
          />
          <span className="text-gray-300">Generate Interview Questions</span>
        </label>
      </div>
    </div>
  </div>
));

// Memoize InputForm to prevent unnecessary re-renders
const InputForm = React.memo(({ jobDescription, setJobDescription, isLoading, resumeText, handleAnalyze, handleExportPDF, handleReset }) => (
  <div className="bg-gray-900 rounded-2xl p-6 border border-green-500/20 space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        onFocus={() => console.log('Job Description textarea focused')}
        onBlur={() => console.log('Job Description textarea blurred')}
        placeholder="Paste the job description here..."
        rows={8}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 resize-none"
      />
    </div>
    
    <div className="flex space-x-4">
      <button
        onClick={handleAnalyze}
        disabled={isLoading || !resumeText || !jobDescription}
        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-black font-medium rounded-lg hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader className="w-5 h-5 animate-spin inline mr-2" /> : <Brain className="w-5 h-5 inline mr-2" />}
        Analyze Resume
      </button>
      
      <button
        onClick={handleExportPDF}
        disabled={isLoading || !resumeText}
        className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300 border border-green-500/20 hover:border-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5 inline mr-2" />
        Export PDF
      </button>
      
      <button
        onClick={handleReset}
        disabled={isLoading}
        className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300 border border-green-500/20 hover:border-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className="w-5 h-5 inline mr-2" />
        Reset
      </button>
    </div>
  </div>
));

const ResumeAnalyzerPro = () => {
  const [activeTab, setActiveTab] = useState('analyze');
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [tone, setTone] = useState('formal');
  const [templateId, setTemplateId] = useState('modern');
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false);
  const [generateInterviewQuestions, setGenerateInterviewQuestions] = useState(false);
  const [userId, setUserId] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Debounced state setters with reduced delay
  const debouncedSetTargetRole = useCallback(debounce((value) => setTargetRole(value), 100), []);
  const debouncedSetUserId = useCallback(debounce((value) => setUserId(value || ''), 100), []);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(pdf|docx)$/i)) {
        showNotification('Please upload a PDF or DOCX file', 'error');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        showNotification('File size exceeds 10MB limit', 'error');
        return;
      }
      setFile(selectedFile);
      showNotification(`File "${selectedFile.name}" selected successfully!`);
    }
  };

  const handleExtractText = async () => {
    if (!file) {
      showNotification('Please select a file first', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${backendUrl}/extract-text`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!response.data.text) {
        throw new Error('No text extracted from file');
      }
      setResumeText(response.data.text);
      showNotification('Text extracted successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to extract text';
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      showNotification('Please provide both resume text and job description', 'error');
      return;
    }
    if (!targetRole.trim()) {
      showNotification('Please specify a target role', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/analyze`, {
        resume: resumeText,
        job_description: jobDescription,
        target_role: targetRole,
        tone,
        template_id: templateId,
        generate_cover_letter: generateCoverLetter,
        generate_interview_questions: generateInterviewQuestions,
        user_id: userId || 'anonymous', // Use 'anonymous' instead of '1'
      });
      console.log('Sent user_id:', userId || 'anonymous'); // Debug log
      setAnalysisResult(response.data.analysis);
      showNotification('Analysis completed successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Analysis failed';
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!resumeText) {
      showNotification('Please provide resume text to export', 'error');
      return;
    }
    if (generateCoverLetter && !jobDescription) {
      showNotification('Please provide a job description to generate a cover letter', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/export-pdf`,
        {
          resume: resumeText,
          job_description: jobDescription,
          tone,
          template_id: templateId,
          generate_cover_letter: generateCoverLetter,
          user_id: userId || 'anonymous',
        },
        { responseType: 'blob' }
      );

      console.log('Export PDF Response:', {
        status: response.status,
        headers: response.headers,
        blobSize: response.data.size,
        contentDisposition: response.headers['content-disposition'],
        contentType: response.headers['content-type'],
      });

      if (!response.data || response.data.size === 0) {
        throw new Error('Empty PDF response received');
      }

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      let filename = `resume_${templateId}_${Date.now()}.pdf`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification('PDF exported successfully!');
    } catch (err) {
      console.error('Export PDF Error:', err);
      let errorMsg = 'PDF export failed';
      if (err.response?.data) {
        try {
          const text = await err.response.data.text();
          errorMsg = text || errorMsg;
        } catch (textErr) {
          console.error('Error parsing response text:', textErr);
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResumeText('');
    setJobDescription('');
    setTargetRole('');
    setTone('formal');
    setTemplateId('modern');
    setGenerateCoverLetter(false);
    setGenerateInterviewQuestions(false);
    setAnalysisResult(null);
    setUserId('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    showNotification('Form reset successfully!');
  };

  const fetchHistory = async () => {
    if (!userId || userId === 'anonymous') {
      showNotification('Please provide a valid User ID to fetch history', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/history/${userId}`);
      setHistory(response.data.attempts);
      showNotification('History fetched successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to fetch history';
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId && userId !== 'anonymous') {
      const timer = setTimeout(fetchHistory, 100); // Debounce fetchHistory
      return () => clearTimeout(timer);
    }
  }, [userId]);

  // Notification Component
  const Notification = ({ message, type }) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
      type === 'success' ? 'bg-green-900 border-green-400 text-green-100' : 
      type === 'error' ? 'bg-red-900 border-red-400 text-red-100' : 
      'bg-yellow-900 border-yellow-400 text-yellow-100'
    } transform transition-all duration-300`}>
      <div className="flex items-center space-x-2">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );

  // Loading Overlay
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <Brain className="w-8 h-8 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-green-400 mt-4 font-medium">AI is analyzing your resume...</p>
      </div>
    </div>
  );

  // Navigation
  const Navigation = () => (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-green-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>ترقی</h1>
              <p className="text-green-400 text-sm">AI-powered career optimization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'analyze'
                  ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                  : 'text-green-400 hover:bg-green-500/10 hover:text-green-300'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Analyze
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'history'
                  ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                  : 'text-green-400 hover:bg-green-500/10 hover:text-green-300'
              }`}
            >
              <History className="w-4 h-4 inline mr-2" />
              History
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // File Upload Component
  const FileUploadComponent = () => (
    <div className="bg-gray-900 rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Upload className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Upload Resume</h3>
        <p className="text-gray-400 mb-6">Drag and drop your resume or click to browse</p>
        
        <div className="border-2 border-dashed border-green-500/30 rounded-xl p-8 hover:border-green-500/50 transition-all duration-300">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-black font-medium rounded-lg hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg shadow-green-500/25"
          >
            Choose File
          </button>
          {file && (
            <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-green-400 font-medium">{file.name}</p>
              <button
                onClick={handleExtractText}
                disabled={isLoading}
                className="mt-2 px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin inline mr-2" /> : <FileText className="w-4 h-4 inline mr-2" />}
                Extract Text
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Analysis Results
  const AnalysisResults = () => {
    if (!analysisResult) return null;

    return (
      <div className="bg-gray-900 rounded-2xl p-6 border border-green-500/20 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
        </div>
        
        {/* Match Percentage */}
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {analysisResult.match_percentage}%
            </div>
            <p className="text-gray-300">Match Score</p>
          </div>
        </div>
        
        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/10">
            <h4 className="text-green-400 font-medium mb-4 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Found Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysisResult.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-red-500/10">
            <h4 className="text-red-400 font-medium mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Missing Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysisResult.missing_skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Suggestions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-green-500/10">
          <h4 className="text-green-400 font-medium mb-4 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Suggestions
          </h4>
          <div className="space-y-3">
            {analysisResult.suggestions?.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Zap className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cover Letter */}
        {analysisResult.cover_letter && (
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/10">
            <h4 className="text-green-400 font-medium mb-4 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Generated Cover Letter
            </h4>
            <div className="bg-gray-900 rounded-lg p-4 text-gray-300 text-sm whitespace-pre-wrap">
              {analysisResult.cover_letter}
            </div>
          </div>
        )}
        
        {/* Interview Questions */}
        {analysisResult.interview_questions && (
          <div className="bg-gray-800 rounded-xl p-6 border border-green-500/10">
            <h4 className="text-green-400 font-medium mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Interview Questions
            </h4>
            <div className="space-y-3">
              {analysisResult.interview_questions.map((question, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-green-400 font-medium">{index + 1}.</span>
                  <p className="text-gray-300 text-sm">{question}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // History Component
  const HistoryComponent = () => (
    <div className="bg-gray-900 rounded-2xl p-6 border border-green-500/20">
      <div className="flex items-center space-x-3 mb-6">
        <History className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Analysis History</h3>
      </div>
      
      <button
        onClick={fetchHistory}
        disabled={isLoading || !userId || userId === 'anonymous'}
        className="mb-4 px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className="w-4 h-4 inline mr-2" />
        Refresh History
      </button>
      
      {history.length === 0 ? (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No analysis history found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((attempt, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-4 border border-green-500/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-medium">Analysis #{index + 1}</h4>
                <span className="text-green-400 text-sm">
                  {attempt.analysis_result?.match_percentage || 'N/A'}% match
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                {attempt.target_role || 'Unknown Role'} • {attempt.template_id} Template
              </p>
              <p className="text-gray-500 text-xs">
                {attempt.created_at ? new Date(attempt.created_at).toLocaleString() : 'Unknown Date'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay />}
      
      {/* Notification */}
      {notification && <Notification message={notification.message} type={notification.type} />}
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'analyze' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload & Form */}
            <div className="lg:col-span-2 space-y-8">
              <FileUploadComponent />
              <InputForm
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                isLoading={isLoading}
                resumeText={resumeText}
                handleAnalyze={handleAnalyze}
                handleExportPDF={handleExportPDF}
                handleReset={handleReset}
              />
              {analysisResult && <AnalysisResults />}
            </div>
            
            {/* Right Column - Settings */}
            <div className="space-y-8">
              <SettingsPanel
                targetRole={targetRole}
                setTargetRole={debouncedSetTargetRole}
                userId={userId}
                setUserId={debouncedSetUserId}
                tone={tone}
                setTone={setTone}
                templateId={templateId}
                setTemplateId={setTemplateId}
                generateCoverLetter={generateCoverLetter}
                setGenerateCoverLetter={setGenerateCoverLetter}
                generateInterviewQuestions={generateInterviewQuestions}
                setGenerateInterviewQuestions={setGenerateInterviewQuestions}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <HistoryComponent />
          </div>
        )}
        <footer className="bg-gray-900 mt-16 text-center py-4 text-white">
          <p>© 2025 All Rights Reserved</p>
        </footer>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPro;
