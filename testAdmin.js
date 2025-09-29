import React, { useState } from 'react';
import { LayoutDashboard, FileText, UserCheck, Users, Settings, LogOut, Menu, X, User, Clock, CheckCircle, Lock, AlertTriangle, KeyRound, Plus, Trash2, BookOpen, UserPlus } from 'lucide-react';

// Mock database for users (accessible globally within App)
const initialMockUsers = [
    { id: 1, name: 'Alice Smith', username: 'asmith', email: 'alice.s@uni.edu', password: 'password123', role: 'Student' },
    { id: 2, name: 'Dr. Zaini', username: 'zaini', email: 'zaini.d@uni.edu', password: 'securepass', role: 'Supervisor' },
    { id: 3, name: 'Ben Lee', username: 'blee', email: 'ben.l@uni.edu', password: 'benpass', role: 'Student' },
    { id: 4, name: 'Prof. Azman', username: 'azman', email: 'azman.p@uni.edu', password: 'profpass', role: 'Supervisor' },
    // Adding another Supervisor to act as an available examiner pool
    { id: 5, name: 'Dr. Chan', username: 'chan', email: 'chan.d@uni.edu', password: 'chanpass', role: 'Supervisor' },
];

// Mock database for projects/title assignments (updated to include Examiner fields)
const initialMockProjects = [
    { 
        id: 1, 
        title: 'Optimizing Neural Network Training', 
        studentId: 1, 
        studentName: 'Alice Smith', 
        studentEmail: 'alice.s@uni.edu', 
        supervisorId: 2, 
        supervisorName: 'Dr. Zaini', 
        supervisorEmail: 'zaini.d@uni.edu', 
        examinerId: null, // NEW: Examiner ID
        examinerName: null, // NEW: Examiner Name
        examinerEmail: null, // NEW: Examiner Email
    },
    { 
        id: 2, 
        title: 'IoT-based Smart Farming System', 
        studentId: 3, 
        studentName: 'Ben Lee', 
        studentEmail: 'ben.l@uni.edu', 
        supervisorId: 4, 
        supervisorName: 'Prof. Azman', 
        supervisorEmail: 'azman.p@uni.edu', 
        examinerId: null, 
        examinerName: null, 
        examinerEmail: null, 
    },
];


// Main App Component
const App = () => {
  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'Admin', 'Supervisor', 'Student', null
  const [mockUsers, setMockUsers] = useState(initialMockUsers);
  const [mockProjects, setMockProjects] = useState(initialMockProjects);

  // Admin Credentials State (Used for the mock Admin Login and Password Change)
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveMenu('Dashboard'); // Reset menu state on logout
  };

  // Helper function to update Admin credentials
  const setAdminCredentials = (newUsername, newPassword) => {
    setAdminUsername(newUsername);
    setAdminPassword(newPassword);
  };

  // All navigation items
  const allNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, link: '#' },
    { name: 'User Management', icon: Users, link: '#' }, 
    { name: 'Project Assignment', icon: BookOpen, link: '#' }, 
    { name: 'Examiner Assignment', icon: UserPlus, link: '#' },
    { name: 'Project Submission', icon: FileText, link: '#', roles: ['Student', 'Supervisor'] }, 
    { name: 'Supervisor Panel', icon: UserCheck, link: '#', roles: ['Supervisor'] }, 
    { name: 'Settings', icon: Settings, link: '#' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = (name) => {
    setActiveMenu(name);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // --- Start of Sub-Components Definitions ---

  const SettingsContent = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }

        // 1. Check if the old password matches the current state
        if (oldPassword !== adminPassword) {
            setMessage({ type: 'error', text: 'Old password is incorrect. Please check your current password.' });
            return;
        }

        // 2. Check if new passwords match
        if (newPassword !== confirmNewPassword) {
            setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
            return;
        }

        // 3. Simple validation (e.g., minimum length)
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
            return;
        }
        
        // 4. Mock successful update (updates state in the parent App component)
        setAdminCredentials(adminUsername, newPassword);

        // 5. Success message and reset form
        setMessage({ type: 'success', text: `Password updated successfully! Admin username: ${adminUsername}, new password: ${newPassword}.` });
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center border-b pb-2">
                    <Settings size={24} className="mr-2 text-indigo-600" /> 
                    Admin Account Settings
                </h2>
                
                {/* Change Password Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                        <Lock size={20} className="mr-2 text-red-600" />
                        Change Admin Password
                    </h3>

                    {message.text && (
                        <div className={`mb-4 p-3 flex items-start rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
                            <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <div>
                            <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">Old Password</label>
                            <input
                                id="old-password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="mt-1 w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                id="confirm-new-password"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="mt-1 w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                        >
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Other Settings Placeholder */}
                <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                        <Settings size={20} className="mr-2 text-blue-500" />
                        System Configuration
                    </h3>
                    <p className="text-gray-500 text-sm">Future settings like submission deadlines, email integration, and system defaults can be managed here.</p>
                </div>
            </div>
        </div>
    );
};


  const ExaminerAssignmentContent = () => {
    const supervisors = mockUsers.filter(u => u.role === 'Supervisor');

    const handleAssignExaminer = (projectId, examinerId) => {
        const examiner = supervisors.find(s => s.id === parseInt(examinerId));
        
        if (!examiner) return;

        // Check if the assigned examiner is the same as the supervisor
        const currentProject = mockProjects.find(p => p.id === projectId);
        if (currentProject && currentProject.supervisorId === examiner.id) {
            console.error("Examiner cannot be the same as the Supervisor.");
            // In a real app, use a modal or alert equivalent here.
            return;
        }

        setMockProjects(prevProjects => 
            prevProjects.map(project => 
                project.id === projectId
                    ? {
                        ...project,
                        examinerId: examiner.id,
                        examinerName: examiner.name,
                        examinerEmail: examiner.email,
                    }
                    : project
            )
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <UserPlus size={24} className="mr-2 text-indigo-600" /> 
                    Assign Examiners to Projects
                </h2>
                <p className="text-sm text-gray-600 mb-6">Select a lecturer/supervisor from the list to assign as the Examiner for the project. Note: The Examiner cannot be the same as the project's Supervisor.</p>
                
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Project & Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Supervisor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Current Examiner</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-indigo-700 uppercase tracking-wider">Assign New Examiner</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    {/* Project Title & Student Info */}
                                    <td className="px-6 py-4 max-w-sm">
                                        <p className="font-semibold text-gray-900">{project.title}</p>
                                        <p className="text-xs text-indigo-600 mt-1">
                                            Student: {project.studentName}
                                        </p>
                                    </td>
                                    
                                    {/* Supervisor Info */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                                        {project.supervisorName}
                                        <span className="block text-xs text-gray-500 font-normal">{project.supervisorEmail}</span>
                                    </td>

                                    {/* Current Examiner Status */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {project.examinerName ? (
                                            <div className="text-amber-700">
                                                {project.examinerName}
                                                <span className="block text-xs text-gray-500 font-normal">{project.examinerEmail}</span>
                                            </div>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Not Assigned
                                            </span>
                                        )}
                                    </td>

                                    {/* Assignment Dropdown */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <select
                                            value={project.examinerId || ''}
                                            onChange={(e) => handleAssignExaminer(project.id, e.target.value)}
                                            className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full max-w-[200px]"
                                        >
                                            <option value="" disabled>Select Examiner</option>
                                            {supervisors
                                                .filter(s => s.id !== project.supervisorId) // Cannot be the supervisor
                                                .map(s => (
                                                    <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {mockProjects.length === 0 && (
                    <p className="text-center py-6 text-gray-500">No projects are available for examiner assignment.</p>
                )}
            </div>
        </div>
    );
  };
  
  const ProjectAssignmentContent = () => {
    const [title, setTitle] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [formError, setFormError] = useState('');

    // Filter users for dropdowns
    const supervisors = mockUsers.filter(u => u.role === 'Supervisor');
    const students = mockUsers.filter(u => u.role === 'Student');

    const handleAssignProject = (e) => {
        e.preventDefault();
        setFormError('');

        if (!title || !selectedStudentId || !selectedSupervisorId) {
            setFormError('All fields must be filled out to assign a project.');
            return;
        }

        // Check if student is already assigned a project
        if (mockProjects.some(p => p.studentId === parseInt(selectedStudentId))) {
            setFormError('This student already has an assigned project.');
            return;
        }

        const student = students.find(s => s.id === parseInt(selectedStudentId));
        const supervisor = supervisors.find(s => s.id === parseInt(selectedSupervisorId));

        if (!student || !supervisor) {
            setFormError('Selected student or supervisor not found.');
            return;
        }

        // Added examiner fields (null initially)
        const newProject = {
            id: mockProjects.length + 1,
            title,
            studentId: student.id,
            studentName: student.name,
            studentEmail: student.email, 
            supervisorId: supervisor.id,
            supervisorName: supervisor.name,
            supervisorEmail: supervisor.email, 
            examinerId: null,
            examinerName: null,
            examinerEmail: null,
        };

        setMockProjects([...mockProjects, newProject]);
        setTitle('');
        setSelectedStudentId('');
        setSelectedSupervisorId('');
        setFormError('');
    };

    const handleDeleteProject = (id) => {
        setMockProjects(mockProjects.filter(project => project.id !== id));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* Project Assignment Form Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen size={24} className="mr-2 text-blue-600" /> 
                    Assign New Project Title
                </h2>
                
                {formError && (
                    <div className="mb-4 p-3 flex items-start bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                        <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                        {formError}
                    </div>
                )}

                <form onSubmit={handleAssignProject} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Project Title Name (e.g., Deep Learning for X)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1 md:col-span-2 lg:col-span-5"
                        required
                    />
                    
                    {/* Supervisor Selection */}
                    <select
                        value={selectedSupervisorId}
                        onChange={(e) => setSelectedSupervisorId(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1 md:col-span-1 lg:col-span-2"
                        required
                    >
                        <option value="" disabled>Select Supervisor</option>
                        {supervisors.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                        ))}
                    </select>

                    {/* Student Selection */}
                    <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1 md:col-span-1 lg:col-span-2"
                        required
                    >
                        <option value="" disabled>Select Student</option>
                        {students.filter(s => !mockProjects.some(p => p.studentId === s.id)).map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                        ))}
                        {/* Display students who are already assigned, but make them unselectable */}
                        {students.filter(s => mockProjects.some(p => p.studentId === s.id)).map(s => (
                            <option key={s.id} value={s.id} disabled className="bg-gray-200 text-gray-500">{s.name} (Assigned)</option>
                        ))}
                    </select>
                    
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
                        >
                            Assign Project
                        </button>
                    </div>
                </form>
            </div>

            {/* View All Assignments Table Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen size={24} className="mr-2 text-red-600" /> 
                    Current Project Assignments
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examiner</th> 
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.id}</td>
                                    <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700">{project.title}</td>
                                    {/* Display Student Name and Email */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">
                                        {project.studentName}
                                        <span className="block text-xs text-gray-500 font-normal">{project.studentEmail}</span>
                                    </td>
                                    {/* Display Supervisor Name and Email */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                                        {project.supervisorName}
                                        <span className="block text-xs text-gray-500 font-normal">{project.supervisorEmail}</span>
                                    </td>
                                    {/* Display Examiner Status/Name */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">
                                        {project.examinerName || 'N/A'}
                                        {project.examinerEmail && <span className="block text-xs text-gray-500 font-normal">{project.examinerEmail}</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button 
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {mockProjects.length === 0 && (
                    <p className="text-center py-6 text-gray-500">No projects currently assigned.</p>
                )}
            </div>
        </div>
    );
  };


  const UserManagementContent = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [formError, setFormError] = useState('');

    const handleCreateUser = (e) => {
      e.preventDefault();
      setFormError('');

      // Added email check
      if (!name || !username || !email || !password || !role) {
        setFormError('All fields must be filled out to create a new user.');
        return;
      }
      if (mockUsers.some(u => u.username === username)) {
        setFormError('Username already exists. Please choose a different one.');
        return;
      }

      const newUser = {
        id: mockUsers.length + 1,
        name,
        username,
        email, 
        password,
        role,
      };

      setMockUsers([...mockUsers, newUser]);
      setName('');
      setUsername('');
      setEmail(''); 
      setPassword('');
      setFormError('');
    };

    const handleDeleteUser = (id) => {
        // Also remove any assigned projects for this user
        setMockProjects(mockProjects.filter(p => p.studentId !== id && p.supervisorId !== id && p.examinerId !== id));
        setMockUsers(mockUsers.filter(user => user.id !== id));
    };

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Create New User Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Plus size={24} className="mr-2 text-green-600" /> 
                Create New User
            </h2>
            
            {formError && (
                <div className="mb-4 p-3 flex items-start bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                    <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                    {formError}
                </div>
            )}

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                    type="text"
                    placeholder="Full Name (e.g., Jane Doe)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                />
                <input
                    type="text"
                    placeholder="Username (e.g., jdoe)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                />
                <input
                    type="email"
                    placeholder="Email (e.g., jdoe@uni.edu)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                >
                    <option value="Student">Student</option>
                    <option value="Supervisor">Supervisor</option>
                </select>
                <div className="col-span-1 md:col-span-2 lg:col-span-5">
                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>

        {/* View All Users and Passwords Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <KeyRound size={24} className="mr-2 text-red-600" /> 
                User Accounts Overview (Admin View)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th> 
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Student' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">{user.email}</td> 
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono font-bold">{user.password}</td> 
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {mockUsers.length === 0 && (
                <p className="text-center py-6 text-gray-500">No users found. Create the first user above!</p>
            )}
        </div>
      </div>
    );
  };


  const LoginPage = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    // Admin login mock
    const mockLogin = (e) => {
      e.preventDefault();
      setError('');
      
      // Check for Admin credentials from state
      if (username === adminUsername && password === adminPassword) {
        handleLogin('Admin'); // Log in as Admin
      } else {
        // Mock failure and guide user
        setError(`Invalid Username or Password. Use "${adminUsername}" and the current admin password.`);
      }
    };
    
    return (
      <div className="min-h-screen flex flex-col items-center pt-16 pb-8 bg-gray-200 p-4 font-sans">
        
        {/* Top Header Text (outside the form card) */}
        <div className="text-center mb-6 max-w-md">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
                COMPUTER ENGINEERING
            </h1>
            <p className="text-xl font-bold text-gray-600 mt-1">(UR6523002)</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-300">
            
            {/* Banner Area - Using the static /fyp.png image as requested */}
            <div className="w-full h-auto">
                <img 
                    // Using process.env.PUBLIC_URL to represent the %PUBLIC_URL% convention in a React environment.
                    src={process.env.PUBLIC_URL + '/fyp.png'} 
                    alt="FYP Management System Banner" 
                    className="w-full h-auto object-cover" 
                />
            </div>

            <div className="p-8 space-y-6">
                <p className="text-center text-gray-600 text-base">Sign in to start your Admin session</p>

                {/* Error Message Box */}
                {error && (
                    <div className="mb-4 p-3 flex items-start bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                        <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}
        
                <form onSubmit={mockLogin} className="space-y-4">
                    
                    {/* Username Input */}
                    <div className="relative">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            placeholder={`Username (${adminUsername})`}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <User size={20} className="text-gray-400" />
                        </div>
                    </div>
        
                    {/* Password Input */}
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            placeholder="Password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Lock size={20} className="text-gray-400" /> 
                        </div>
                    </div>

                    {/* Button Row: Sign In (Green) and Register (Secondary) */}
                    <div className="flex space-x-2 pt-2">
                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                        >
                            Sign In
                        </button>
                        
                        {/* Register Button (Kept for design consistency) */}
                        <button
                            type="button"
                            className="py-2 px-4 border border-gray-300 rounded-lg shadow-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring-blue-500 transition duration-200 flex items-center"
                        >
                            Register
                            <span className="ml-1">▾</span>
                        </button>
                    </div>
                </form>

                {/* Forgot Password Link */}
                <div className="text-center pt-2">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
                        Forgot Your Password?
                    </a>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => {
    
    // Filter navigation items based on the user's role
    const filteredNavItems = allNavItems.filter(item => {
        // If the item has a 'roles' property, check if the current userRole is included.
        if (item.roles) {
            return item.roles.includes(userRole);
        }
        // If no 'roles' property is specified, show the item to all roles (Admin, Dashboard, User Management, etc.)
        return true; 
    });

    return (
        <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-800 text-white w-64 md:sticky md:top-0 md:h-screen p-4 flex flex-col shadow-2xl`}>
            <div className="flex justify-between items-center mb-8">
                <div className="text-xl font-bold flex items-center">
                <span className="p-2 bg-blue-600 rounded-lg mr-2">FTKEN</span>
                FYP Portal
                </div>
                <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={toggleSidebar}>
                <X size={24} />
                </button>
            </div>

            <nav className="flex-grow">
                <ul>
                {filteredNavItems.map((item) => (
                    <li key={item.name} className="mb-2">
                    <a
                        href={item.link}
                        onClick={() => handleNavClick(item.name)}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                        activeMenu === item.name
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <item.icon size={20} className="mr-3" />
                        {item.name}
                    </a>
                    </li>
                ))}
                </ul>
            </nav>

            <div className="pt-4 border-t border-gray-700">
                <button 
                    className="flex items-center p-3 w-full text-red-400 hover:bg-red-900/50 rounded-lg transition-all duration-200" 
                    onClick={handleLogout} 
                >
                <LogOut size={20} className="mr-3" />
                Logout
                </button>
            </div>
        </div>
    );
  };

  const Header = () => (
    <header className="sticky top-0 z-20 bg-white shadow-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-600 hover:text-blue-600" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 hidden md:block">{activeMenu}</h1>

        <div className="flex items-center space-x-4">
          {/* User Profile - Displays Role */}
          <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition">
            <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center text-red-800 font-medium text-sm">
              A
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{userRole}</span> 
            <User size={18} className="text-gray-500 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );

  // Reusing the Dashboard content for visual consistency
  const DashboardContent = () => (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Supervisors */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition duration-300">
          <p className="text-sm font-medium text-gray-500">Total Lecturers/Supervisors</p>
          <div className="flex items-center mt-2 justify-between">
            <p className="text-3xl font-bold text-gray-900">{mockUsers.filter(u => u.role === 'Supervisor').length}</p>
            <CheckCircle size={36} className="text-blue-500 bg-blue-100 p-2 rounded-full" />
          </div>
          <p className="text-sm text-gray-400 mt-1">Available for new students/examiners</p>
        </div>

        {/* Card 2: Active Students */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-emerald-500 hover:shadow-xl transition duration-300">
          <p className="text-sm font-medium text-gray-500">Active Students</p>
          <div className="flex items-center mt-2 justify-between">
            <p className="text-3xl font-bold text-gray-900">{mockUsers.filter(u => u.role === 'Student').length}</p>
            <FileText size={36} className="text-emerald-500 bg-emerald-100 p-2 rounded-full" />
          </div>
          <p className="text-sm text-gray-400 mt-1">All registered students</p>
        </div>

        {/* Card 3: Latest Grade */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500 hover:shadow-xl transition duration-300">
          <p className="text-sm font-medium text-gray-500">Total Projects Assigned</p>
          <div className="flex items-center mt-2 justify-between">
            <p className="text-3xl font-bold text-gray-900">{mockProjects.length}</p>
            <UserCheck size={36} className="text-amber-500 bg-amber-100 p-2 rounded-full" />
          </div>
          <p className="text-sm text-gray-400 mt-1">Current number of FYP titles</p>
        </div>
      </div>
    </div>
  );
  
  // --- End of Sub-Components Definitions ---

  // Conditional Rendering Logic: If not logged in, show the Login Page
  if (!isLoggedIn) {
    return <LoginPage />;
  }


  // If logged in, show the main dashboard layout
  return (
    <div className="min-h-screen bg-gray-100 antialiased">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area - Use 'flex-1 flex flex-col' to push footer to bottom */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col">
          {/* Header */}
          <Header />

          {/* Dynamic Content */}
          <div className="flex-1">
            {activeMenu === 'Dashboard' && <DashboardContent />}
            {activeMenu === 'User Management' && <UserManagementContent />}
            {activeMenu === 'Project Assignment' && <ProjectAssignmentContent />}
            {activeMenu === 'Examiner Assignment' && <ExaminerAssignmentContent />}
            {activeMenu === 'Settings' && <SettingsContent />}

            {activeMenu !== 'Dashboard' && activeMenu !== 'User Management' && activeMenu !== 'Project Assignment' && activeMenu !== 'Examiner Assignment' && activeMenu !== 'Settings' && (
              <div className="p-8">
                <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeMenu} Section</h2>
                  <p className="text-gray-500">
                    Content for the *{activeMenu}* page would go here. This provides the structure for a multi-page academic system.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Positioned relative to the main content area and aligned to the bottom */}
          <footer className="w-full bg-white border-t border-gray-200 mt-8">
            <div className="text-center text-sm text-gray-500 py-4 px-4">
              &copy; {new Date().getFullYear()} FTKEN FYP Management System. All rights reserved. | Universiti Malaysia Perlis (UniMAP)
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
//////

import React, { useState } from 'react';
import { LayoutDashboard, FileText, UserCheck, Users, Settings, LogOut, Menu, X, User, Clock, CheckCircle, Lock, AlertTriangle, KeyRound, Plus, Trash2, BookOpen, UserPlus } from 'lucide-react';

// Mock database for users (accessible globally within App)
const initialMockUsers = [
    { id: 1, name: 'Alice Smith', username: 'asmith', email: 'alice.s@uni.edu', password: 'password123', role: 'Student' },
    { id: 2, name: 'Dr. Zaini', username: 'zaini', email: 'zaini.d@uni.edu', password: 'securepass', role: 'Supervisor' },
    { id: 3, name: 'Ben Lee', username: 'blee', email: 'ben.l@uni.edu', password: 'benpass', role: 'Student' },
    { id: 4, name: 'Prof. Azman', username: 'azman', email: 'azman.p@uni.edu', password: 'profpass', role: 'Supervisor' },
    // Adding another Supervisor to act as an available examiner pool
    { id: 5, name: 'Dr. Chan', username: 'chan', email: 'chan.d@uni.edu', password: 'chanpass', role: 'Supervisor' },
];

// Mock database for projects/title assignments (updated to include Examiner fields)
const initialMockProjects = [
    { 
        id: 1, 
        title: 'Optimizing Neural Network Training', 
        studentId: 1, 
        studentName: 'Alice Smith', 
        studentEmail: 'alice.s@uni.edu', 
        supervisorId: 2, 
        supervisorName: 'Dr. Zaini', 
        supervisorEmail: 'zaini.d@uni.edu', 
        examinerId: null, // NEW: Examiner ID
        examinerName: null, // NEW: Examiner Name
        examinerEmail: null, // NEW: Examiner Email
    },
    { 
        id: 2, 
        title: 'IoT-based Smart Farming System', 
        studentId: 3, 
        studentName: 'Ben Lee', 
        studentEmail: 'ben.l@uni.edu', 
        supervisorId: 4, 
        supervisorName: 'Prof. Azman', 
        supervisorEmail: 'azman.p@uni.edu', 
        examinerId: null, 
        examinerName: null, 
        examinerEmail: null, 
    },
];


// Main App Component
const App = () => {
  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'Admin', 'Supervisor', 'Student', null
  // *** START: Added/Fixed User State Management ***
  const [currentUser, setCurrentUser] = useState(null); // NEW: Store the logged-in user's full data
  // *** END: Added/Fixed User State Management ***
  const [mockUsers, setMockUsers] = useState(initialMockUsers);
  const [mockProjects, setMockProjects] = useState(initialMockProjects);

  // Admin Credentials State (Used for the mock Admin Login and Password Change)
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin');

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // MODIFIED: handleLogin now accepts the entire user object
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserRole(user.role);
    setCurrentUser(user);
    // For non-Admin roles, redirect them to the first accessible menu item
    if (user.role !== 'Admin') {
        // Find the first menu item the user's role has access to
        const firstMenuItem = allNavItems.find(item => !item.roles || item.roles.includes(user.role));
        if (firstMenuItem) {
            setActiveMenu(firstMenuItem.name);
        }
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null); // Reset current user
    setActiveMenu('Dashboard'); // Reset menu state on logout
  };

  // Helper function to update Admin credentials
  const setAdminCredentials = (newUsername, newPassword) => {
    setAdminUsername(newUsername);
    setAdminPassword(newPassword);
  };

  // All navigation items
  // *** START MODIFIED CODE: Replaced generic 'Project Submission' with two specific report submissions ***
  const allNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, link: '#' },
    { name: 'User Management', icon: Users, link: '#' }, 
    { name: 'Project Assignment', icon: BookOpen, link: '#' }, 
    { name: 'Examiner Assignment', icon: UserPlus, link: '#' },
    // NEW ITEMS BASED ON USER REQUEST:
    { name: 'Progress Report Submission', icon: FileText, link: '#', roles: ['Student', 'Supervisor'] }, 
    { name: 'Logbook Report Submission', icon: FileText, link: '#', roles: ['Student', 'Supervisor'] }, 
    { name: 'Supervisor Panel', icon: UserCheck, link: '#', roles: ['Supervisor'] }, 
    { name: 'Settings', icon: Settings, link: '#' },
  ];
  // *** END MODIFIED CODE ***

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = (name) => {
    setActiveMenu(name);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // --- Start of Sub-Components Definitions ---

  // *** START NEW COMPONENT: ReportSubmissionContent ***
  const ReportSubmissionContent = ({ activeMenu, currentUser, mockProjects }) => {
    // Determine the report type based on the active menu name
    const reportType = activeMenu.replace(' Submission', ''); // "Progress Report" or "Logbook Report"
    
    // Safety check
    if (!currentUser) return null;

    // Find the current user's project (for Student view)
    const studentProject = currentUser.role === 'Student' 
        ? mockProjects.find(p => p.studentId === currentUser.id)
        : null;

    // Find projects supervised by the current user (for Supervisor view)
    const supervisedProjects = currentUser.role === 'Supervisor' 
        ? mockProjects.filter(p => p.supervisorId === currentUser.id)
        : [];

    // STUDENT VIEW
    const renderStudentView = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-blue-600 border-b pb-2">Student Submission: {reportType}</h3>
            {studentProject ? (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                    <p className="font-semibold text-lg text-gray-800">Project: {studentProject.title}</p>
                    <p className="text-sm text-gray-700">Supervisor: {studentProject.supervisorName}</p>
                    
                    <hr/>

                    {/* Mock Student Submission Form */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Upload Your {reportType} File (.pdf)</label>
                        <input type="file" className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                        />
                        <button
                            className="mt-3 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
                        >
                            Submit {reportType}
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Current Status: Not Submitted</p>
                    </div>
                </div>
            ) : (
                <p className="text-red-500 p-4 bg-red-100 rounded-lg">You do not have a project assigned yet. Cannot submit reports.</p>
            )}
        </div>
    );

    // SUPERVISOR VIEW
    const renderSupervisorView = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-green-600 border-b pb-2">Supervisor Review: {reportType}</h3>
            
            {supervisedProjects.length > 0 ? (
                <div className="space-y-4">
                    {supervisedProjects.map(project => (
                        <div key={project.id} className="p-5 bg-green-50 rounded-xl border border-green-200 shadow-sm">
                            <p className="font-bold text-gray-800">{project.title} (Student: {project.studentName})</p>
                            <p className="text-sm text-gray-600 mt-1 mb-3">Awaiting student's {reportType.toLowerCase()}.</p>
                            
                            {/* Supervisor Action Section - Fulfills the "upload corrected document" request */}
                            <div className="mt-4 pt-3 border-t border-green-300">
                                <h4 className="text-md font-semibold text-amber-700 mb-2">Review & Correction</h4>
                                
                                {/* Mock Upload Corrected Document Button */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Upload Corrected/Annotated Document</label>
                                    <input type="file" className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-amber-100 file:text-amber-800
                                        hover:file:bg-amber-200"
                                    />
                                    <button
                                        className="mt-3 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition duration-150 shadow-md"
                                    >
                                        Upload Corrected Document
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 p-4 bg-gray-100 rounded-lg">No projects are currently under your supervision.</p>
            )}
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-lg p-10 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <FileText size={24} className="mr-2 text-indigo-600" /> 
                    {reportType}
                </h2>
                {currentUser.role === 'Student' && renderStudentView()}
                {currentUser.role === 'Supervisor' && renderSupervisorView()}
                {currentUser.role === 'Admin' && (
                    <p className="text-red-500">Admins do not use this submission panel. Use User Management or Project Assignment.</p>
                )}
            </div>
        </div>
    );
  };
  // *** END NEW COMPONENT: ReportSubmissionContent ***

  const SettingsContent = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }

        // 1. Check if the old password matches the current state
        if (oldPassword !== adminPassword) {
            setMessage({ type: 'error', text: 'Old password is incorrect. Please check your current password.' });
            return;
        }

        // 2. Check if new passwords match
        if (newPassword !== confirmNewPassword) {
            setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
            return;
        }

        // 3. Simple validation (e.g., minimum length)
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
            return;
        }
        
        // 4. Mock successful update (updates state in the parent App component)
        setAdminCredentials(adminUsername, newPassword);

        // 5. Success message and reset form
        setMessage({ type: 'success', text: `Password updated successfully! Admin username: ${adminUsername}, new password: [REDACTED].` });
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center border-b pb-2">
                    <Settings size={24} className="mr-2 text-indigo-600" /> 
                    Admin Account Settings
                </h2>
                
                {/* Change Password Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                        <Lock size={20} className="mr-2 text-red-600" />
                        Change Admin Password
                    </h3>

                    {message.text && (
                        <div className={`mb-4 p-3 flex items-start rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
                            <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <div>
                            <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">Old Password</label>
                            <input
                                id="old-password"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="mt-1 w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                id="confirm-new-password"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="mt-1 w-full border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                        >
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Other Settings Placeholder */}
                <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                        <Settings size={20} className="mr-2 text-blue-500" />
                        System Configuration
                    </h3>
                    <p className="text-gray-500 text-sm">Future settings like submission deadlines, email integration, and system defaults can be managed here.</p>
                </div>
            </div>
        </div>
    );
};


  const ExaminerAssignmentContent = () => {
    const supervisors = mockUsers.filter(u => u.role === 'Supervisor');

    const handleAssignExaminer = (projectId, examinerId) => {
        const examiner = supervisors.find(s => s.id === parseInt(examinerId));
        
        if (!examiner) return;

        // Check if the assigned examiner is the same as the supervisor
        const currentProject = mockProjects.find(p => p.id === projectId);
        if (currentProject && currentProject.supervisorId === examiner.id) {
            console.error("Examiner cannot be the same as the Supervisor.");
            alert(`Error: ${examiner.name} is the current Supervisor for this project and cannot be assigned as the Examiner.`);
            return;
        }

        setMockProjects(prevProjects => 
            prevProjects.map(project => 
                project.id === projectId
                    ? {
                        ...project,
                        examinerId: examiner.id,
                        examinerName: examiner.name,
                        examinerEmail: examiner.email,
                    }
                    : project
            )
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <UserPlus size={24} className="mr-2 text-indigo-600" /> 
                    Assign Examiners to Projects
                </h2>
                <p className="text-sm text-gray-600 mb-6">Select a lecturer/supervisor from the list to assign as the Examiner for the project. Note: The Examiner cannot be the same as the project's Supervisor.</p>
                
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Project & Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Supervisor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Current Examiner</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-indigo-700 uppercase tracking-wider">Assign New Examiner</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    {/* Project Title & Student Info */}
                                    <td className="px-6 py-4 max-w-sm">
                                        <p className="font-semibold text-gray-900">{project.title}</p>
                                        <p className="text-xs text-indigo-600 mt-1">
                                            Student: {project.studentName}
                                        </p>
                                    </td>
                                    
                                    {/* Supervisor Info */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                                        {project.supervisorName}
                                        <span className="block text-xs text-gray-500 font-normal">{project.supervisorEmail}</span>
                                    </td>

                                    {/* Current Examiner Status */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {project.examinerName ? (
                                            <div className="text-amber-700">
                                                {project.examinerName}
                                                <span className="block text-xs text-gray-500 font-normal">{project.examinerEmail}</span>
                                            </div>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Not Assigned
                                            </span>
                                        )}
                                    </td>

                                    {/* Assignment Dropdown */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <select
                                            value={project.examinerId || ''}
                                            onChange={(e) => handleAssignExaminer(project.id, e.target.value)}
                                            className="border border-gray-300 p-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full max-w-[200px]"
                                        >
                                            <option value="" disabled>Select Examiner</option>
                                            {supervisors
                                                .filter(s => s.id !== project.supervisorId) // Cannot be the supervisor
                                                .map(s => (
                                                    <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {mockProjects.length === 0 && (
                    <p className="text-center py-6 text-gray-500">No projects are available for examiner assignment.</p>
                )}
            </div>
        </div>
    );
  };
  
  const ProjectAssignmentContent = () => {
    const [title, setTitle] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
    const [formError, setFormError] = useState('');

    // Filter users for dropdowns
    const supervisors = mockUsers.filter(u => u.role === 'Supervisor');
    const students = mockUsers.filter(u => u.role === 'Student');

    const handleAssignProject = (e) => {
        e.preventDefault();
        setFormError('');

        if (!title || !selectedStudentId || !selectedSupervisorId) {
            setFormError('All fields must be filled out to assign a project.');
            return;
        }

        // Check if student is already assigned a project
        if (mockProjects.some(p => p.studentId === parseInt(selectedStudentId))) {
            setFormError('This student already has an assigned project.');
            return;
        }

        const student = students.find(s => s.id === parseInt(selectedStudentId));
        const supervisor = supervisors.find(s => s.id === parseInt(selectedSupervisorId));

        if (!student || !supervisor) {
            setFormError('Selected student or supervisor not found.');
            return;
        }

        // Added examiner fields (null initially)
        const newProject = {
            id: mockProjects.length + 1,
            title,
            studentId: student.id,
            studentName: student.name,
            studentEmail: student.email, 
            supervisorId: supervisor.id,
            supervisorName: supervisor.name,
            supervisorEmail: supervisor.email, 
            examinerId: null,
            examinerName: null,
            examinerEmail: null,
        };

        setMockProjects([...mockProjects, newProject]);
        setTitle('');
        setSelectedStudentId('');
        setSelectedSupervisorId('');
        setFormError('');
    };

    const handleDeleteProject = (id) => {
        setMockProjects(mockProjects.filter(project => project.id !== id));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* Project Assignment Form Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen size={24} className="mr-2 text-blue-600" /> 
                    Assign New Project Title
                </h2>
                
                {formError && (
                    <div className="mb-4 p-3 flex items-start bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                        <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                        {formError}
                    </div>
                )}

                <form onSubmit={handleAssignProject} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Project Title Name (e.g., Deep Learning for X)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1 md:col-span-2 lg:col-span-5"
                        required
                    />
                    
                    {/* Supervisor Selection */}
                    <select
                        value={selectedSupervisorId}
                        onChange={(e) => setSelectedSupervisorId(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1 md:col-span-1 lg:col-span-2"
                        required
                    >
                        <option value="" disabled>Select Supervisor</option>
                        {supervisors.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                        ))}
                    </select>

                    {/* Student Selection */}
                    <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1 md:col-span-1 lg:col-span-2"
                        required
                    >
                        <option value="" disabled>Select Student</option>
                        {students.filter(s => !mockProjects.some(p => p.studentId === s.id)).map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                        ))}
                        {/* Display students who are already assigned, but make them unselectable */}
                        {students.filter(s => mockProjects.some(p => p.studentId === s.id)).map(s => (
                            <option key={s.id} value={s.id} disabled className="bg-gray-200 text-gray-500">{s.name} (Assigned)</option>
                        ))}
                    </select>
                    
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
                        >
                            Assign Project
                        </button>
                    </div>
                </form>
            </div>

            {/* View All Assignments Table Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen size={24} className="mr-2 text-red-600" /> 
                    Current Project Assignments
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examiner</th> 
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.id}</td>
                                    <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-700">{project.title}</td>
                                    {/* Display Student Name and Email */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">
                                        {project.studentName}
                                        <span className="block text-xs text-gray-500 font-normal">{project.studentEmail}</span>
                                    </td>
                                    {/* Display Supervisor Name and Email */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                                        {project.supervisorName}
                                        <span className="block text-xs text-gray-500 font-normal">{project.supervisorEmail}</span>
                                    </td>
                                    {/* Display Examiner Status/Name */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">
                                        {project.examinerName || 'N/A'}
                                        {project.examinerEmail && <span className="block text-xs text-gray-500 font-normal">{project.examinerEmail}</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button 
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {mockProjects.length === 0 && (
                    <p className="text-center py-6 text-gray-500">No projects currently assigned.</p>
                )}
            </div>
        </div>
    );
  };


  const UserManagementContent = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [formError, setFormError] = useState('');

    const handleCreateUser = (e) => {
      e.preventDefault();
      setFormError('');

      // Added email check
      if (!name || !username || !email || !password || !role) {
        setFormError('All fields must be filled out to create a new user.');
        return;
      }
      if (mockUsers.some(u => u.username === username)) {
        setFormError('Username already exists. Please choose a different one.');
        return;
      }

      const newUser = {
        id: mockUsers.length + 1,
        name,
        username,
        email, 
        password,
        role,
      };

      setMockUsers([...mockUsers, newUser]);
      setName('');
      setUsername('');
      setEmail(''); 
      setPassword('');
      setFormError('');
    };

    const handleDeleteUser = (id) => {
        // Also remove any assigned projects for this user
        setMockProjects(mockProjects.filter(p => p.studentId !== id && p.supervisorId !== id && p.examinerId !== id));
        setMockUsers(mockUsers.filter(user => user.id !== id));
    };

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Create New User Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Plus size={24} className="mr-2 text-green-600" /> 
                Create New User
            </h2>
            
            {formError && (
                <div className="mb-4 p-3 flex items-start bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                    <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                    {formError}
                </div>
            )}

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                    type="text"
                    placeholder="Full Name (e.g., Jane Doe)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                />
                <input
                    type="text"
                    placeholder="Username (e.g., jdoe)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                />
                <input
                    type="email"
                    placeholder="Email (e.g., jdoe@uni.edu)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 col-span-1"
                    required
                >
                    <option value="Student">Student</option>
                    <option value="Supervisor">Supervisor</option>
                </select>
                <div className="col-span-1 md:col-span-2 lg:col-span-5">
                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>

        {/* View All Users and Passwords Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <KeyRound size={24} className="mr-2 text-red-600" /> 
                User Accounts Overview (Admin View)
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th> 
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Student' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">{user.email}</td> 
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono font-bold">{user.password}</td> 
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {mockUsers.length === 0 && (
                <p className="text-center py-6 text-gray-500">No users found. Create the first user above!</p>
            )}
        </div>
      </div>
    );
  };

  // *** START ADDED COMPONENT: SupervisorPanelContent (Missing in user's file) ***
  const SupervisorPanelContent = () => {
    // Safety check
    if (!currentUser || currentUser.role !== 'Supervisor') {
        return <p className="p-8 text-center text-red-500">Access Denied: Only Supervisors can view this panel.</p>;
    }

    // Find projects where the current user is EITHER the Supervisor OR the Examiner
    const supervisedProjects = mockProjects.filter(p => p.supervisorId === currentUser.id);
    const examinedProjects = mockProjects.filter(p => p.examinerId === currentUser.id);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <UserCheck size={24} className="mr-2 text-green-600" /> 
                    {currentUser.role} Panel Overview
                </h2>

                {/* Supervision Projects */}
                <div className="mb-8 border-b pb-4">
                    <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                        <Users size={20} className="mr-2 text-blue-600" />
                        My Supervised Students ({supervisedProjects.length})
                    </h3>
                    <div className="space-y-2">
                        {supervisedProjects.length > 0 ? supervisedProjects.map(p => (
                            <div key={`sup-${p.id}`} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="font-semibold">{p.title}</p>
                                <p className="text-sm text-gray-700">Student: {p.studentName} ({p.studentEmail})</p>
                            </div>
                        )) : (
                            <p className="text-gray-500">You are not currently supervising any students.</p>
                        )}
                    </div>
                </div>

                {/* Examination Projects */}
                <div>
                    <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                        <KeyRound size={20} className="mr-2 text-amber-600" />
                        My Assigned Examinations ({examinedProjects.length})
                    </h3>
                    <div className="space-y-2">
                        {examinedProjects.length > 0 ? examinedProjects.map(p => (
                            <div key={`exam-${p.id}`} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="font-semibold">{p.title}</p>
                                <p className="text-sm text-gray-700">Student: {p.studentName} (Supervisor: {p.supervisorName})</p>
                            </div>
                        )) : (
                            <p className="text-gray-500">You have no projects assigned for examination.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  };
  // *** END ADDED COMPONENT: SupervisorPanelContent ***


  const LoginPage = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Admin'); // Default to Admin
    const [error, setError] = useState('');
    
    // Helper function to get role-specific username hint (without password)
    const getRoleExample = (selectedRole) => {
        if (selectedRole === 'Admin') {
            return `Admin: ${adminUsername} (Pass: [Current Password])`;
        } else if (selectedRole === 'Student') {
            const student = mockUsers.find(u => u.role === 'Student');
            return `Student: ${student ? student.username : 'N/A'} (Pass: [Current Password])`;
        } else if (selectedRole === 'Supervisor') {
            const supervisor = mockUsers.find(u => u.role === 'Supervisor');
            return `Supervisor: ${supervisor ? supervisor.username : 'N/A'} (Pass: [Current Password])`;
        }
        return '';
    };

    // MODIFIED: mockLogin now handles Admin, Student, and Supervisor roles
    const mockLogin = (e) => {
      e.preventDefault();
      setError('');
      
      let authenticatedUser = null;

      if (role === 'Admin') {
        // Check for Admin credentials
        if (username === adminUsername && password === adminPassword) {
            authenticatedUser = { 
                id: 0, // Mock ID for Admin
                name: 'System Admin', 
                username: adminUsername, 
                email: 'admin@uni.edu', 
                password: adminPassword, 
                role: 'Admin' 
            };
        }
      } else {
        // Check for Student/Supervisor credentials in mockUsers
        authenticatedUser = mockUsers.find(
            // Use mockUsers from state
            u => u.username === username && u.password === password && u.role === role
        );
      }
      
      if (authenticatedUser) {
        handleLogin(authenticatedUser); // Log in with the found user object
      } else {
        // SECURITY FIX: Do not reveal the correct password in the error message.
        setError(`Invalid credentials for a **${role}** login. Please try the example: ${getRoleExample(role)}`);
      }
    };
    
    return (
      <div className="min-h-screen flex flex-col items-center pt-16 pb-8 bg-gray-200 p-4 font-sans">
        
        {/* Top Header Text (outside the form card) */}
        <div className="text-center mb-6 max-w-md">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
                COMPUTER ENGINEERING
            </h1>
            <p className="text-xl font-bold text-gray-600 mt-1">(UR6523002)</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-300">
            
            {/* Banner Area - Using the static /fyp.png image as requested */}
            <div className="w-full h-auto">
                <img 
                    // Using process.env.PUBLIC_URL to represent the %PUBLIC_URL% convention in a React environment.
                    src={process.env.PUBLIC_URL + '/fyp.png'} 
                    alt="FYP Management System Banner" 
                    className="w-full h-auto object-cover" 
                />
            </div>

            <div className="p-8 space-y-6">
                <p className="text-center text-gray-600 text-base">Sign in to the FYP Portal</p>
                
                {/* Role Selection Tabs */}
                <div className="flex justify-between p-1 bg-gray-100 rounded-lg">
                    {['Admin', 'Student', 'Supervisor'].map((r) => (
                        <button
                            key={r}
                            onClick={() => { setRole(r); setError(''); setUsername(''); setPassword(''); }}
                            className={`flex-1 text-center py-2 px-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                                role === r ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Error Message Box */}
                {error && (
                    <div className="mb-4 p-3 flex items-start bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
                        <AlertTriangle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}
        
                <form onSubmit={mockLogin} className="space-y-4">
                    
                    {/* Username Input */}
                    <div className="relative">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            placeholder="Username"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <User size={20} className="text-gray-400" />
                        </div>
                    </div>
        
                    {/* Password Input */}
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            placeholder="Password"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Lock size={20} className="text-gray-400" /> 
                        </div>
                    </div>

                    {/* Login Hint */}
                    <div className="text-xs text-gray-500 italic pt-1 pb-2">
                        Hint: {getRoleExample(role)}
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                    >
                        Sign In as {role}
                    </button>
                </form>

                {/* Forgot Password Link */}
                <div className="text-center pt-2">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 text-sm">
                        Forgot Your Password?
                    </a>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => {
    
    // Filter navigation items based on the user's role
    const filteredNavItems = allNavItems.filter(item => {
        // If the item has a 'roles' property, check if the current userRole is included.
        if (item.roles) {
            return item.roles.includes(userRole);
        }
        // If no 'roles' property is specified, assume Admin access (or universal like Dashboard)
        return userRole === 'Admin' || item.name === 'Dashboard'; 
    });

    return (
        <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-800 text-white w-64 md:sticky md:top-0 md:h-screen p-4 flex flex-col shadow-2xl`}>
            <div className="flex justify-between items-center mb-8">
                <div className="text-xl font-bold flex items-center">
                <span className="p-2 bg-blue-600 rounded-lg mr-2">FTKEN</span>
                FYP Portal
                </div>
                <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={toggleSidebar}>
                <X size={24} />
                </button>
            </div>

            <nav className="flex-grow">
                <ul>
                {filteredNavItems.map((item) => (
                    <li key={item.name} className="mb-2">
                    <a
                        href={item.link}
                        onClick={() => handleNavClick(item.name)}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                        activeMenu === item.name
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <item.icon size={20} className="mr-3" />
                        {item.name}
                    </a>
                    </li>
                ))}
                </ul>
            </nav>

            <div className="pt-4 border-t border-gray-700">
                <button 
                    className="flex items-center p-3 w-full text-red-400 hover:bg-red-900/50 rounded-lg transition-all duration-200" 
                    onClick={handleLogout} 
                >
                <LogOut size={20} className="mr-3" />
                Logout
                </button>
            </div>
        </div>
    );
  };

  // *** START MODIFIED COMPONENT: Header to use currentUser ***
  const Header = () => (
    <header className="sticky top-0 z-20 bg-white shadow-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-gray-600 hover:text-blue-600" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 hidden md:block">{activeMenu}</h1>

        <div className="flex items-center space-x-4">
          {/* User Profile - Displays Name and Role */}
          <div className="flex items-center space-x-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition">
            <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center text-red-800 font-medium text-sm">
              {/* Display first letter of name or role */}
              {(currentUser?.name || userRole || 'U').charAt(0)}
            </div>
            {/* Display the full name or a fallback, hidden on small screens */}
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{currentUser?.name || userRole}</span> 
            {/* Always display the role, bolded */}
            <span className="text-sm font-bold text-indigo-600">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
  // *** END MODIFIED COMPONENT: Header ***


  // *** START MODIFIED COMPONENT: DashboardContent to use currentUser ***
  const DashboardContent = () => {
      // Role-specific stats for a richer dashboard experience
      let totalAssignedProjects = 0;
      let otherStat = null;
      
      // Safety check in case currentUser is somehow null, though it shouldn't be if isLoggedIn is true
      if (!currentUser) return null;

      if (currentUser.role === 'Admin') {
          totalAssignedProjects = mockProjects.length;
          otherStat = {
              label: 'Total Projects Assigned', 
              count: mockProjects.length, 
              icon: BookOpen,
              color: 'amber',
          };
      } else if (currentUser.role === 'Supervisor') {
          totalAssignedProjects = mockProjects.filter(p => p.supervisorId === currentUser.id).length;
          otherStat = {
              label: 'Projects to Examine',
              count: mockProjects.filter(p => p.examinerId === currentUser.id).length,
              icon: UserCheck,
              color: 'purple',
          };
      } else if (currentUser.role === 'Student') {
          // Find if the student has a project. The count is 1 or 0.
          totalAssignedProjects = mockProjects.filter(p => p.studentId === currentUser.id).length;
          otherStat = {
              label: 'Report Submission Status',
              count: totalAssignedProjects > 0 ? 'Pending' : 'N/A',
              icon: Clock,
              color: 'red',
          };
      } else {
        // Fallback for an unexpected role
        totalAssignedProjects = mockProjects.length;
        otherStat = { label: 'System Check', count: 'OK', icon: CheckCircle, color: 'blue' };
      }

      return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <h2 className="text-xl font-semibold text-gray-700">Welcome, {currentUser.name || currentUser.role}!</h2>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Supervisors/Lecturers */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition duration-300">
              <p className="text-sm font-medium text-gray-500">Total Lecturers/Supervisors</p>
              <div className="flex items-center mt-2 justify-between">
                <p className="text-3xl font-bold text-gray-900">{mockUsers.filter(u => u.role === 'Supervisor').length}</p>
                <Users size={36} className="text-blue-500 bg-blue-100 p-2 rounded-full" />
              </div>
              <p className="text-sm text-gray-400 mt-1">Available academic staff</p>
            </div>

            {/* Card 2: Students/Your Projects */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-emerald-500 hover:shadow-xl transition duration-300">
              <p className="text-sm font-medium text-gray-500">
                  {currentUser.role === 'Student' ? 'Your Assigned Projects' : 'Total Students'}
              </p>
              <div className="flex items-center mt-2 justify-between">
                <p className="text-3xl font-bold text-gray-900">
                    {currentUser.role === 'Student' ? totalAssignedProjects : mockUsers.filter(u => u.role === 'Student').length}
                </p>
                <FileText size={36} className="text-emerald-500 bg-emerald-100 p-2 rounded-full" />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                  {currentUser.role === 'Student' ? 'Your current FYP titles' : 'All registered students'}
              </p>
            </div>

            {/* Card 3: Role-Specific Stat */}
            <div className={`bg-white rounded-xl shadow-lg p-6 border-t-4 border-${otherStat.color}-500 hover:shadow-xl transition duration-300`}>
              <p className="text-sm font-medium text-gray-500">{otherStat.label}</p>
              <div className="flex items-center mt-2 justify-between">
                <p className="text-3xl font-bold text-gray-900">{otherStat.count}</p>
                <otherStat.icon size={36} className={`text-${otherStat.color}-500 bg-${otherStat.color}-100 p-2 rounded-full`} />
              </div>
              <p className="text-sm text-gray-400 mt-1">Role-specific key performance indicator</p>
            </div>
          </div>
        </div>
      );
  };
  // *** END MODIFIED COMPONENT: DashboardContent ***
  
  // --- End of Sub-Components Definitions ---

  // Conditional Rendering Logic: If not logged in, show the Login Page
  if (!isLoggedIn) {
    return <LoginPage />;
  }


  // If logged in, show the main dashboard layout
  return (
    <div className="min-h-screen bg-gray-100 antialiased">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area - Use 'flex-1 flex flex-col' to push footer to bottom */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col">
          {/* Header */}
          <Header />

          {/* Dynamic Content */}
          <div className="flex-1">
            {activeMenu === 'Dashboard' && <DashboardContent />}
            {activeMenu === 'User Management' && <UserManagementContent />}
            {activeMenu === 'Project Assignment' && <ProjectAssignmentContent />}
            {activeMenu === 'Examiner Assignment' && <ExaminerAssignmentContent />}
            {/* *** START MODIFIED CODE: Routes for new submission pages *** */}
            {(activeMenu === 'Progress Report Submission' || activeMenu === 'Logbook Report Submission') && (
                <ReportSubmissionContent activeMenu={activeMenu} currentUser={currentUser} mockProjects={mockProjects} />
            )}
            {activeMenu === 'Supervisor Panel' && <SupervisorPanelContent />}
            {activeMenu === 'Settings' && <SettingsContent />}

            {/* Old fallback block is now less cluttered */}
            {activeMenu !== 'Dashboard' && activeMenu !== 'User Management' && activeMenu !== 'Project Assignment' && activeMenu !== 'Examiner Assignment' && activeMenu !== 'Settings' && activeMenu !== 'Progress Report Submission' && activeMenu !== 'Logbook Report Submission' && activeMenu !== 'Supervisor Panel' && (
              <div className="p-8">
                <div className="bg-white rounded-xl shadow-lg p-10 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeMenu} Section</h2>
                  <p className="text-gray-500">
                    Content for the *{activeMenu}* page would go here. This provides the structure for a multi-page academic system.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Positioned relative to the main content area and aligned to the bottom */}
          <footer className="w-full bg-white border-t border-gray-200 mt-8">
            <div className="text-center text-sm text-gray-500 py-4 px-4">
              &copy; {new Date().getFullYear()} FTKEN FYP Management System. All rights reserved. | Universiti Malaysia Perlis (UniMAP)
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;