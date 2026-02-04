import { useState, useEffect } from 'react';
import './Admin.css';

function Admin({ onBack }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // --- DATA STATES ---
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('staffData');
    return saved ? JSON.parse(saved) : [];
  });

  const [scheduleList, setScheduleList] = useState(() => {
    const saved = localStorage.getItem('scheduleData');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('systemNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  // --- LOG STATE ---
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('systemLogs');
    return saved ? JSON.parse(saved) : [];
  });

  // --- FORM STATES ---
  const [staffForm, setStaffForm] = useState({ id: '', name: '', contact: '', occupation: '', username: '', password: '' });
  const [schForm, setSchForm] = useState({ id: '', staffId: '', date: '', time: '' });
  const [noteForm, setNoteForm] = useState({ message: '', type: 'Info' });
  const [removeId, setRemoveId] = useState('');

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('staffData', JSON.stringify(staffList)); }, [staffList]);
  useEffect(() => { localStorage.setItem('scheduleData', JSON.stringify(scheduleList)); }, [scheduleList]);
  useEffect(() => { localStorage.setItem('systemNotifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('systemLogs', JSON.stringify(logs)); }, [logs]);

  // --- LOGGER FUNCTION ---
  const addLog = (action) => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      user: 'Admin', // In the future, this can be the logged-in user's name
      action: action,
      timestamp: new Date().toLocaleString()
    };
    setLogs([newLog, ...logs]);
  };

  // --- HANDLERS ---
  const handleAddData = () => {
    if (activeTab === 'staff') {
      if (!staffForm.id || !staffForm.name) return alert("Fill ID and Name");
      setStaffList([...staffList, staffForm]);
      addLog(`Added Staff: ${staffForm.name} (${staffForm.id})`);
      setStaffForm({ id: '', name: '', contact: '', occupation: '', username: '', password: '' });
    } 
    else if (activeTab === 'schedule') {
      if (!schForm.id || !schForm.staffId) return alert("Fill Sched ID and Staff ID");
      setScheduleList([...scheduleList, schForm]);
      addLog(`Added Schedule: ${schForm.id} for Staff ${schForm.staffId}`);
      setSchForm({ id: '', staffId: '', date: '', time: '' });
    } 
    else if (activeTab === 'notifications') {
      if (!noteForm.message) return alert("Please enter a message");
      const newNote = { id: Date.now(), ...noteForm, timestamp: new Date().toLocaleString() };
      setNotifications([newNote, ...notifications]);
      addLog(`Posted Notification: ${noteForm.type}`);
      setNoteForm({ message: '', type: 'Info' });
    }
    setShowAddModal(false);
  };

  const handleRemoveData = () => {
    if (!removeId) return alert("Please enter an ID");
    
    if (activeTab === 'staff') {
      setStaffList(staffList.filter(s => s.id !== removeId));
      addLog(`Removed Staff ID: ${removeId}`);
    } else if (activeTab === 'schedule') {
      setScheduleList(scheduleList.filter(s => s.id !== removeId));
      addLog(`Removed Schedule ID: ${removeId}`);
    } else if (activeTab === 'notifications') {
      setNotifications(notifications.filter(n => n.id.toString() !== removeId));
      addLog(`Removed Notification ID: ${removeId}`);
    }
    
    setRemoveId('');
    setShowRemoveModal(false);
  };

  const renderAddFields = () => {
    if (activeTab === 'staff') {
      return (
        <>
          <div className="modal-row"><label>Staff ID</label><input className="modal-pill" value={staffForm.id} onChange={e => setStaffForm({...staffForm, id: e.target.value})} placeholder="S-001" /></div>
          <div className="modal-row"><label>Name</label><input className="modal-pill" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} placeholder="Full Name" /></div>
          <div className="modal-row"><label>Occupation</label><input className="modal-pill" value={staffForm.occupation} onChange={e => setStaffForm({...staffForm, occupation: e.target.value})} placeholder="Admin/Storekeeper/Staff" /></div>
          <div className="modal-row"><label>Username</label><input className="modal-pill" value={staffForm.username} onChange={e => setStaffForm({...staffForm, username: e.target.value})} placeholder="Set Login Username" /></div>
          <div className="modal-row"><label>Password</label><input className="modal-pill" type="password" value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} placeholder="Set Login Password" /></div>
        </>
      );
    } else if (activeTab === 'schedule') {
      return (
        <>
          <div className="modal-row"><label>Sched ID</label><input className="modal-pill" value={schForm.id} onChange={e => setSchForm({...schForm, id: e.target.value})} placeholder="SCH-01" /></div>
          <div className="modal-row"><label>Staff ID</label><input className="modal-pill" value={schForm.staffId} onChange={e => setSchForm({...schForm, staffId: e.target.value})} placeholder="S-001" /></div>
          <div className="modal-row"><label>Date</label><input className="modal-pill" type="date" value={schForm.date} onChange={e => setSchForm({...schForm, date: e.target.value})} /></div>
          <div className="modal-row"><label>Time Slot</label><input className="modal-pill" value={schForm.time} onChange={e => setSchForm({...schForm, time: e.target.value})} placeholder="08:00 - 16:00" /></div>
        </>
      );
    } else if (activeTab === 'notifications') {
      return (
        <>
          <div className="modal-row"><label>Level</label>
            <select className="modal-pill" value={noteForm.type} onChange={e => setNoteForm({...noteForm, type: e.target.value})}>
              <option value="Info">ℹ️ Info</option>
              <option value="Warning">⚠️ Warning</option>
              <option value="Urgent">🚨 Urgent</option>
            </select>
          </div>
          <div className="modal-row"><label>Message</label>
            <textarea className="modal-pill" value={noteForm.message} onChange={e => setNoteForm({...noteForm, message: e.target.value})} style={{height: '80px', paddingTop: '10px'}} />
          </div>
        </>
      );
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h2 className="admin-title">Admin Page / {activeTab.toUpperCase()}</h2>
        <button onClick={onBack} className="back-btn-admin">Back to Dashboard</button>
      </header>

      <div className="admin-content">
        <aside className="admin-sidebar">
          <div className="nav-group">
            <p className="nav-label">Navigation :</p>
            <button className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>👤 Staff</button>
            <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>🕒 Schedule</button>
            <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>🔔 Notifications</button>
            <button className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>📝 Logs</button>
          </div>

          {activeTab !== 'logs' && (
            <div className="action-group">
              <button className="admin-action-btn" onClick={() => setShowAddModal(true)}>Add {activeTab}</button>
              <button className="admin-action-btn" onClick={() => setShowRemoveModal(true)}>Remove {activeTab}</button>
            </div>
          )}
        </aside>

        <main className="admin-main-area">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              {activeTab === 'staff' ? (
                <>
                  <thead><tr><th>Staff ID</th><th>Name</th><th>Occupation</th><th>Username</th></tr></thead>
                  <tbody>{staffList.map((s, i) => (<tr key={i}><td>{s.id}</td><td>{s.name}</td><td>{s.occupation}</td><td>{s.username}</td></tr>))}</tbody>
                </>
              ) : activeTab === 'schedule' ? (
                <>
                  <thead><tr><th>Sched ID</th><th>Staff ID</th><th>Date</th><th>Time Slot</th></tr></thead>
                  <tbody>{scheduleList.map((sch, i) => (<tr key={i}><td>{sch.id}</td><td>{sch.staffId}</td><td>{sch.date}</td><td>{sch.time}</td></tr>))}</tbody>
                </>
              ) : activeTab === 'notifications' ? (
                <>
                  <thead><tr><th>ID</th><th>Type</th><th>Message</th><th>Timestamp</th></tr></thead>
                  <tbody>{notifications.map((n, i) => (<tr key={i}><td>{n.id}</td><td>{n.type}</td><td>{n.message}</td><td>{n.timestamp}</td></tr>))}</tbody>
                </>
              ) : (
                <>
                  <thead><tr><th>Log ID</th><th>User</th><th>Action</th><th>Timestamp</th></tr></thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td style={{fontWeight: 'bold'}}>{log.user}</td>
                        <td>{log.action}</td>
                        <td style={{fontSize: '0.8rem'}}>{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Add {activeTab}</h3>
              <button className="close-x" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {renderAddFields()}
              <button className="modal-submit-btn" onClick={handleAddData}>+ Confirm Add</button>
            </div>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="modal-overlay">
          <div className="modal-box remove-box">
            <div className="modal-header">
              <h3 className="modal-title">Remove {activeTab}</h3>
              <button className="close-x" onClick={() => setShowRemoveModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="remove-warning">Enter ID to delete from {activeTab}:</p>
              <div className="modal-row">
                <input className="modal-pill" value={removeId} onChange={e => setRemoveId(e.target.value)} placeholder="Enter ID here" />
              </div>
              <button className="modal-submit-btn remove-confirm" onClick={handleRemoveData}>Confirm Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;