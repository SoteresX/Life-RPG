import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ProfileCard from './ProfileCard';
import SkillList from './SkillList';
import "./DashboardLayout.css";
import SkillsSummary from './SkillSummary';

function CharacterDashboard({ user, onLogout, notify }){
    const [activeTab, setActiveTab] = useState('profile');
    const [userSkills, setUserSkills] = useState(null);

    useEffect(() => {
        if(!user || !user.id) return;
        fetch(`http://localhost:5000/api/user/${user.id}/skills`).then((res) => {
            if(!res.ok){
                throw new Error("Failed to fetch skills");
            }
            return res.json();
        }).then((data) => {
            setUserSkills(data);
        }).catch((err) =>{
            console.error("Error retrieving user skills:", err);
            if (notify) notify("Could not load skill data from backend server.");
        });
    }, [user, notify]);

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
                    <div className="profile">
                        <ProfileCard user={user} notify={notify} />
                        <SkillsSummary userSkills={userSkills}/>
                    </div>
                    
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