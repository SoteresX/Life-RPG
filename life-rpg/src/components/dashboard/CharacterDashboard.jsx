import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProfileCard from './ProfileCard';
import SkillList from './SkillList';
import './CharacterDashboard.css';

function CharacterDashboard({ user, onLogout }){
    const [activeTab, setActiveTab] = useState('profile');

    return(
        <div className="dashboard-layout">
        {/* Pinned Left Sidebar Menu Panel */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={onLogout} 
            />
        {/* Main Content Area Panel (Fills the right side) */}
            <main className="dashboard-content">
                {activeTab === 'profile' && (
                <div className="tab-view fade-in">
                    <h2>📜 Character Profile</h2>
                    <ProfileCard user={user} />
                </div>
                )}

                {activeTab === 'skills' && (
                <div className="tab-view fade-in">
                    <SkillList />
                </div>
                )}
            </main>
        </div>
    );
}

export default CharacterDashboard;