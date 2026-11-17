import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  GraduationCap,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Shield,
  Save,
  Lock,
  UserX,
  UserCheck,
  X
} from 'lucide-react';
import { User, ReportItem } from '../types';

export const AdminSection: React.FC<{ initialSubView?: string }> = ({ initialSubView }) => {
  const {
    currentUser,
    users,
    reports,
    updateReport,
    addFaculty,
    updateUserStatus,
    navigateTo
  } = useApp();

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'reports' | 'users' | 'faculty'>(
    (initialSubView as any) || 'dashboard'
  );

  // Selected detail item states
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);

  // Reports filters (Figure 37)
  const [reportSearch, setReportSearch] = useState('');
  const [reportStatus, setReportStatus] = useState('All');
  const [reportType, setReportType] = useState('All');

  // Users filters (Figure 39)
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userAdminFilter, setUserAdminFilter] = useState('All');

  // Faculty filters (Figure 41)
  const [facultySearch, setFacultySearch] = useState('');
  const [facultyAdminFilter, setFacultyAdminFilter] = useState('All');

  // Add Faculty Form State (Figure 43)
  const [addFacultyFirst, setAddFacultyFirst] = useState('');
  const [addFacultyLast, setAddFacultyLast] = useState('');
  const [addFacultyEmail, setAddFacultyEmail] = useState('');
  const [addFacultyIsAdmin, setAddFacultyIsAdmin] = useState(false);
  const [addFacultyError, setAddFacultyError] = useState('');

  // Selected report edit state (Figure 38)
  const selectedReport = reports.find(r => r.id === selectedReportId);
  const [reportAdminAction, setReportAdminAction] = useState<any>(selectedReport?.adminAction || 'No Action / Dismiss');
  const [reportAdminNotes, setReportAdminNotes] = useState(selectedReport?.adminNotes || '');
  const [reportStatusEdit, setReportStatusEdit] = useState(selectedReport?.status || 'Open');

  // Selected user edit state (Figure 40)
  const selectedUser = users.find(u => u.id === selectedUserId);
  const [userAdminToggle, setUserAdminToggle] = useState(selectedUser?.isAdmin || false);
  const [userStatusToggle, setUserStatusToggle] = useState(selectedUser?.status || 'Active');

  // Selected faculty edit state (Figure 42)
  const selectedFaculty = users.find(u => u.id === selectedFacultyId);
  const [facultyAdminToggle, setFacultyAdminToggle] = useState(selectedFaculty?.isAdmin || false);

  // Open counts for Dashboard (Figure 36)
  const openReportsCount = reports.filter(r => r.status === 'Open' || r.status === 'Under Review').length;
  const facultyList = users.filter(u => u.classification === 'Faculty');

  // Filtered reports
  const filteredReports = useMemo(() => {
    let list = [...reports];
    if (reportStatus !== 'All') list = list.filter(r => r.status === reportStatus);
    if (reportType !== 'All') list = list.filter(r => r.targetType === reportType);
    if (reportSearch.trim()) {
      const q = reportSearch.toLowerCase();
      list = list.filter(r =>
        r.targetEntityName.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reports, reportStatus, reportType, reportSearch]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
      );
    }
    if (userRoleFilter === 'Both') {
      list = list.filter(u => u.roles.includes('Performer') && u.roles.includes('Director'));
    } else if (userRoleFilter === 'Performer' || userRoleFilter === 'Director') {
      list = list.filter(u => u.roles.includes(userRoleFilter as any));
    } else if (userRoleFilter === 'Neither/Unassigned') {
      list = list.filter(u => u.roles.length === 0);
    }

    if (userAdminFilter === 'Administrators') {
      list = list.filter(u => u.isAdmin);
    } else if (userAdminFilter === 'Non-Administrators') {
      list = list.filter(u => !u.isAdmin);
    }
    return list;
  }, [users, userSearch, userRoleFilter, userAdminFilter]);

  // Filtered faculty
  const filteredFaculty = useMemo(() => {
    let list = users.filter(u => u.classification === 'Faculty');
    if (facultySearch.trim()) {
      const q = facultySearch.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (facultyAdminFilter === 'Administrators') {
      list = list.filter(u => u.isAdmin);
    } else if (facultyAdminFilter === 'Non-Administrators') {
      list = list.filter(u => !u.isAdmin);
    }
    return list;
  }, [users, facultySearch, facultyAdminFilter]);

  // Check admin authorization
  if (!currentUser?.isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Access Restricted</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Access to administrative controls requires verified ECU faculty administration permissions. Please switch to an Administrator persona (e.g. Prof. Austin Jones) from the top demo bar.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
        >
          Return to Platform
        </button>
      </div>
    );
  }

  // Handle Save Report Details (Figure 38)
  const handleSaveReportDetails = () => {
    if (!selectedReport) return;
    updateReport(selectedReport.id, {
      adminAction: reportAdminAction,
      adminNotes: reportAdminNotes,
      status: reportStatusEdit,
    });
    setSelectedReportId(null);
  };

  // Handle Save User Details (Figure 40)
  const handleSaveUserDetails = () => {
    if (!selectedUser) return;
    updateUserStatus(selectedUser.id, {
      isAdmin: userAdminToggle,
      status: userStatusToggle,
    });
    setSelectedUserId(null);
  };

  // Handle Save Faculty Details (Figure 42)
  const handleSaveFacultyDetails = () => {
    if (!selectedFaculty) return;
    updateUserStatus(selectedFaculty.id, {
      isAdmin: facultyAdminToggle,
    });
    setSelectedFacultyId(null);
  };

  // Handle Add Faculty Submit (Figure 43)
  const handleAddFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFacultyError('');

    const cleanEmail = addFacultyEmail.trim().toLowerCase();
    if (!cleanEmail.endsWith('@ecu.edu')) {
      setAddFacultyError('Validation error: Faculty email address must end with @ecu.edu');
      return;
    }

    addFaculty({
      firstName: addFacultyFirst,
      lastName: addFacultyLast,
      email: cleanEmail,
      isAdmin: addFacultyIsAdmin,
    });

    setIsAddFacultyOpen(false);
    setAddFacultyFirst('');
    setAddFacultyLast('');
    setAddFacultyEmail('');
    setAddFacultyIsAdmin(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Figure 36 Label #1: Admin Navigation Sidebar */}
        <div className="w-full lg:w-64 bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 flex-shrink-0">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Admin Center</span>
            </h2>
            <p className="text-[11px] text-slate-500">ECU School of Theatre & Dance</p>
          </div>

          <button
            onClick={() => {
              setCurrentTab('dashboard');
              setSelectedReportId(null);
              setSelectedUserId(null);
              setSelectedFacultyId(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              currentTab === 'dashboard'
                ? 'btn-primary shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('reports');
              setSelectedReportId(null);
              setSelectedUserId(null);
              setSelectedFacultyId(null);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              currentTab === 'reports'
                ? 'btn-primary shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4" />
              <span>Reports</span>
            </div>
            {openReportsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {openReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentTab('users');
              setSelectedReportId(null);
              setSelectedUserId(null);
              setSelectedFacultyId(null);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              currentTab === 'users'
                ? 'btn-primary shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">{users.length}</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('faculty');
              setSelectedReportId(null);
              setSelectedUserId(null);
              setSelectedFacultyId(null);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
              currentTab === 'faculty'
                ? 'btn-primary shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4" />
              <span>Faculty</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">{facultyList.length}</span>
          </button>
        </div>

        {/* Main Admin Content Body */}
        <div className="flex-1 w-full space-y-6">
          {/* --- VIEW 1: DASHBOARD (Figure 36) --- */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>

              {/* Cards Grid: Open Reports Card, Users Card, Faculty Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Figure 36 Label #2: Open Reports Card */}
                <div
                  onClick={() => setCurrentTab('reports')}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group hover:border-rose-400"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Reports</span>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 transition">
                    {openReportsCount}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Pending moderation review</p>
                </div>

                {/* Figure 36 Label #3: Users Card */}
                <div
                  onClick={() => setCurrentTab('users')}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group hover:border-[var(--color-primary)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-[var(--color-primary)] transition">
                    {users.length}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Students & faculty registered</p>
                </div>

                {/* Figure 36 Label #4: Faculty Card */}
                <div
                  onClick={() => setCurrentTab('faculty')}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition cursor-pointer group hover:border-amber-400"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty Members</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition">
                    {facultyList.length}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">School of Theatre and Dance</p>
                </div>
              </div>

              {/* Inactivity & Data Retention Policy Notice (SRS 4.5 & 4.6) */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span>Automated University Account Retention Engine</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Active
                  </span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  • <strong>6-Month Rule (Requirement 4.6):</strong> Accounts with zero login activity in 180 days are marked <em>Inactive</em> and suppressed from casting directories until re-authenticated.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  • <strong>12-Month Rule (Requirement 4.5):</strong> Accounts inactive for 365 days or 12 months after student graduation date are queued for permanent deletion and GDPR/FERPA compliance purge.
                </p>
              </div>
            </div>
          )}

          {/* --- VIEW 2: REPORTS (Figures 37 & 38) --- */}
          {currentTab === 'reports' && !selectedReportId && (
            <div className="space-y-4 animate-in fade-in">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Reports</h1>

              {/* Filters (Figure 37 Labels #1, #2, #3) */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Search Reports:</label>
                  <input
                    type="text"
                    value={reportSearch}
                    onChange={e => setReportSearch(e.target.value)}
                    placeholder="Search user, content, or reporter..."
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Status:</label>
                  <select
                    value={reportStatus}
                    onChange={e => setReportStatus(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Type:</label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="All">All Types</option>
                    <option value="User/Profile">User/Profile</option>
                    <option value="Casting Call">Casting Call</option>
                    <option value="Message">Message</option>
                    <option value="Other Content">Other Content</option>
                  </select>
                </div>
              </div>

              {/* Figure 37 Label #4: Report List Table */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Reported Subject</th>
                        <th className="py-3.5 px-4">Report By</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredReports.length > 0 ? (
                        filteredReports.map(rep => (
                          <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                            <td className="py-3.5 px-4 font-mono text-slate-500">{rep.date}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                                {rep.targetType}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{rep.targetEntityName}</td>
                            <td className="py-3.5 px-4 text-slate-500">{rep.reporterName}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full font-bold ${
                                rep.status === 'Open'
                                  ? 'bg-rose-100 text-rose-800'
                                  : rep.status === 'Under Review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {rep.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedReportId(rep.id);
                                  setReportAdminAction(rep.adminAction || 'No Action / Dismiss');
                                  setReportAdminNotes(rep.adminNotes || '');
                                  setReportStatusEdit(rep.status);
                                }}
                                className="px-3 py-1.5 rounded-lg btn-primary font-semibold shadow-xs"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">
                            No moderation reports matching criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Figure 38: Admin Report Details View */}
          {currentTab === 'reports' && selectedReport && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <button
                    onClick={() => setSelectedReportId(null)}
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline mb-1"
                  >
                    ← Back to Reports List
                  </button>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Report Details #{selectedReport.id}
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  reportStatusEdit === 'Open' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Status: {reportStatusEdit}
                </span>
              </div>

              {/* Label #1: Report Details Grid */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <p><strong>Reported Content:</strong> {selectedReport.targetEntityName}</p>
                <p><strong>Report Type:</strong> {selectedReport.targetType}</p>
                <p><strong>Reported By:</strong> {selectedReport.reporterName}</p>
                <p><strong>Incident Date:</strong> {selectedReport.date}</p>
                <p className="sm:col-span-2"><strong>Reason for Report:</strong> {selectedReport.reason}</p>
              </div>

              {/* Label #2: Report Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description from Report Form:
                </h3>
                <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {/* Label #3: Attachment List */}
              {selectedReport.attachmentName && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Supporting Evidence:
                  </h3>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 inline-flex items-center gap-2 text-xs font-mono text-[var(--color-primary)] font-semibold">
                    <span>{selectedReport.attachmentName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Label #4: Admin Action Dropdown & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Admin Action:
                  </label>
                  <select
                    value={reportAdminAction}
                    onChange={e => setReportAdminAction(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="No Action / Dismiss">No Action / Dismiss</option>
                    <option value="Request More Information">Request More Information</option>
                    <option value="Warn User">Warn User</option>
                    <option value="Restrict Account">Restrict Account</option>
                    <option value="Escalate">Escalate to ECU Dean of Students</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Update Report Status:
                  </label>
                  <select
                    value={reportStatusEdit}
                    onChange={e => setReportStatusEdit(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Open">Open</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                </div>
              </div>

              {/* Label #5: Admin Notes Text Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Resolution Notes:
                </label>
                <textarea
                  rows={3}
                  value={reportAdminNotes}
                  onChange={e => setReportAdminNotes(e.target.value)}
                  placeholder="Record moderation notes, action details, or investigation results..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary"
                />
              </div>

              {/* Label #6: Save Button */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedReportId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReportDetails}
                  className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Report Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* --- VIEW 3: USERS (Figures 39 & 40) --- */}
          {currentTab === 'users' && !selectedUserId && (
            <div className="space-y-4 animate-in fade-in">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Users</h1>

              {/* Figure 39 Filters */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Search Users:</label>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search name, email, or campus..."
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Role Filter:</label>
                  <select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="All">All Roles</option>
                    <option value="Performer">Performer</option>
                    <option value="Director">Director</option>
                    <option value="Both">Both</option>
                    <option value="Neither/Unassigned">Neither / Unassigned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Admin Status:</label>
                  <select
                    value={userAdminFilter}
                    onChange={e => setUserAdminFilter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="All">All Users</option>
                    <option value="Administrators">Administrators Only</option>
                    <option value="Non-Administrators">Non-Administrators</option>
                  </select>
                </div>
              </div>

              {/* Figure 39 Label #4: List of Users Table */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Role(s)</th>
                        <th className="py-3.5 px-4">Admin?</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img src={u.headshot} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                                <span className="text-[10px] text-slate-400">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">{u.classification}</td>
                          <td className="py-3 px-4">
                            <span className="text-slate-700 dark:text-slate-300">{u.roles.join(', ')}</span>
                          </td>
                          <td className="py-3 px-4">
                            {u.isAdmin ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Yes</span>
                            ) : (
                              <span className="text-[10px] text-slate-400">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedUserId(u.id);
                                setUserAdminToggle(u.isAdmin);
                                setUserStatusToggle(u.status);
                              }}
                              className="px-3 py-1.5 rounded-lg btn-primary font-semibold shadow-xs"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Figure 40: Admin User Details View */}
          {currentTab === 'users' && selectedUser && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline mb-1"
                  >
                    ← Back to Users List
                  </button>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    User Details: {selectedUser.name}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700">
                  Status: {userStatusToggle}
                </span>
              </div>

              {/* Label #1: Account Information */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 text-xs block">Email Address</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedUser.email}</span>
                </div>
                <div>
                  {/* Label #2: Category */}
                  <span className="text-slate-400 text-xs block">User Category</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedUser.classification}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Enrolled Date</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedUser.enrolledDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Expected Graduation</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedUser.graduationDate || 'N/A (Faculty)'}</span>
                </div>
              </div>

              {/* Label #3: Profile Roles (Display of roles a user can have; cannot be edited by admin) */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Assigned Profile Roles (Self-selected by user):
                </span>
                <div className="flex gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <label className="flex items-center gap-1.5 opacity-80 cursor-not-allowed">
                    <input type="checkbox" disabled checked={selectedUser.roles.includes('Performer')} />
                    <span>Performer</span>
                  </label>
                  <label className="flex items-center gap-1.5 opacity-80 cursor-not-allowed">
                    <input type="checkbox" disabled checked={selectedUser.roles.includes('Director')} />
                    <span>Director</span>
                  </label>
                </div>
              </div>

              {/* Label #4: Admin Access Checkbox & Suspension */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                  <input
                    type="checkbox"
                    checked={userAdminToggle}
                    onChange={e => setUserAdminToggle(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-primary)]"
                  />
                  <span>Grant Administrator Privileges (Access to moderation, reports, and faculty roster)</span>
                </label>

                <div className="pt-2 border-t border-amber-200 dark:border-amber-900/40 flex items-center justify-between text-xs">
                  <span>Account Status Action:</span>
                  <button
                    type="button"
                    onClick={() => setUserStatusToggle(userStatusToggle === 'Active' ? 'Suspended' : 'Active')}
                    className={`px-3 py-1 rounded-lg font-bold ${
                      userStatusToggle === 'Active'
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {userStatusToggle === 'Active' ? 'Suspend User Account' : 'Reactivate User Account'}
                  </button>
                </div>
              </div>

              {/* Label #5: Save Button */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedUserId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUserDetails}
                  className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save User Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* --- VIEW 4: FACULTY (Figures 41, 42, 43) --- */}
          {currentTab === 'faculty' && !selectedFacultyId && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Faculty</h1>
                {/* Figure 41 Label #3: Add Faculty Button */}
                <button
                  onClick={() => setIsAddFacultyOpen(true)}
                  className="px-4 py-2 rounded-xl btn-primary text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Faculty</span>
                </button>
              </div>

              {/* Figure 41 Filters */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Search Faculty:</label>
                  <input
                    type="text"
                    value={facultySearch}
                    onChange={e => setFacultySearch(e.target.value)}
                    placeholder="Search by faculty name or email..."
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Admin Status:</label>
                  <select
                    value={facultyAdminFilter}
                    onChange={e => setFacultyAdminFilter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="All">All Faculty</option>
                    <option value="Administrators">Administrators Only</option>
                    <option value="Non-Administrators">Non-Administrators</option>
                  </select>
                </div>
              </div>

              {/* Figure 41 Label #4: Faculty List Table */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">Name</th>
                        <th className="py-3.5 px-4">Email</th>
                        <th className="py-3.5 px-4">Admin</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredFaculty.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{f.name}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">{f.email}</td>
                          <td className="py-3.5 px-4">
                            {f.isAdmin ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Yes</span>
                            ) : (
                              <span className="text-[10px] text-slate-400">No</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedFacultyId(f.id);
                                setFacultyAdminToggle(f.isAdmin);
                              }}
                              className="px-3 py-1.5 rounded-lg btn-primary font-semibold shadow-xs"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Figure 42: Admin Faculty Details */}
          {currentTab === 'faculty' && selectedFaculty && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <button
                    onClick={() => setSelectedFacultyId(null)}
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline mb-1"
                  >
                    ← Back to Faculty List
                  </button>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Faculty Details: {selectedFaculty.name}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700">
                  Status: {selectedFaculty.status}
                </span>
              </div>

              {/* Figure 42 Label #1: Account Information */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 text-xs block">Official Email</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedFaculty.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Category</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedFaculty.classification}</span>
                </div>
              </div>

              {/* Figure 42 Label #2: Admin Access Checkbox */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                  <input
                    type="checkbox"
                    checked={facultyAdminToggle}
                    onChange={e => setFacultyAdminToggle(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-primary)]"
                  />
                  <span>Administrator Access Privileges</span>
                </label>
              </div>

              {/* Figure 42 Label #3: Save Button */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedFacultyId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFacultyDetails}
                  className="px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Faculty Record</span>
                </button>
              </div>
            </div>
          )}

          {/* Figure 43: Admin Add Faculty Modal */}
          {isAddFacultyOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                <button
                  onClick={() => setIsAddFacultyOpen(false)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Add Faculty</h2>
                <p className="text-xs text-slate-500 mb-4">Register an ECU School of Theatre and Dance faculty instructor.</p>

                {addFacultyError && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs">
                    {addFacultyError}
                  </div>
                )}

                <form onSubmit={handleAddFacultySubmit} className="space-y-4">
                  {/* Figure 43 Label #1: First Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name:</label>
                    <input
                      type="text"
                      required
                      value={addFacultyFirst}
                      onChange={e => setAddFacultyFirst(e.target.value)}
                      placeholder="e.g. Austin"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Figure 43 Label #2: Last Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name:</label>
                    <input
                      type="text"
                      required
                      value={addFacultyLast}
                      onChange={e => setAddFacultyLast(e.target.value)}
                      placeholder="e.g. Jones"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Figure 43 Label #3: Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email:</label>
                    <input
                      type="email"
                      required
                      value={addFacultyEmail}
                      onChange={e => setAddFacultyEmail(e.target.value)}
                      placeholder="e.g. jonesau@ecu.edu"
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Must be an official @ecu.edu faculty address.</span>
                  </div>

                  {/* Figure 43 Label #4: Admin Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={addFacultyIsAdmin}
                        onChange={e => setAddFacultyIsAdmin(e.target.checked)}
                        className="rounded text-[var(--color-primary)]"
                      />
                      <span>Grant Administrator Rights</span>
                    </label>
                  </div>

                  {/* Figure 43 Label #5 & #6: Cancel and Add Faculty Buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setIsAddFacultyOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold shadow-md"
                    >
                      Add Faculty
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
