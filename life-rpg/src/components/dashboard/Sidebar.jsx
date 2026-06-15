import React from 'react';

function Sidebar({ activeTab, setActiveTab, onLogout}){
    const menuItems = [
        { id: 'profile', label: 'Profile'},
        { id: 'skills', label: "Life Skills"},
        { id: 'quests', label: 'Quests'}
    ];

    return(
        <div className="sidebar-panel">
            <div className="sidebar-header">
                <h3>MENU</h3>
            </div>
            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                <button
                    key={item.id}
                    className={`menu-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                >
                    {item.label}
                </button>
                ))}
            </nav>
            <button onClick={onLogout} className="logout-btn">
                🚪 Log Out
            </button>
        </div>
    );
}

export default Sidebar;