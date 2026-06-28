import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ProfileCard from './ProfileCard';
import SkillList from './SkillList';
import SkillsSummary from './SkillSummary';
import QuestMenu from './QuestMenu';
import "./DashboardLayout.css";

// 1. Import your API methods
import { fetchSkills, createCustomSkill, deleteCustomSkill } from '../../services/skillManagement';

function CharacterDashboard({ user, onLogout, notify }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [userSkills, setUserSkills] = useState(null);

    // 2. Load skills via abstracted service wrapper
    useEffect(() => {
        if (!user || !user.id) return;
        
        fetchSkills(user.id)
            .then(data => setUserSkills(data))
            .catch(err => {
                console.error(err);
                if (notify) notify("Could not load skill data from backend server.");
            });
    }, [user, notify]);

    // 3. Simple action trigger updating UI state reactively on success
    const handleAddSkill = async (skillData) => {
        try {
            const newSkill = await createCustomSkill(user.id, skillData);
            setUserSkills(prev => [...prev, newSkill]);
            if (notify) notify(`✨ Successfully forged discipline: ${newSkill.name}!`);
        } catch (err) {
            console.error(err);
            if (notify) notify(err.message);
        }
    };

    // 4. Clean deletion dispatcher
    const handleRemoveSkill = async (skillId) => {
        try {
            await deleteCustomSkill(skillId);
            setUserSkills(prev => prev.filter(skill => skill.id !== skillId));
            if (notify) notify("🗑️ Skill record struck from your active ledger.");
        } catch (err) {
            console.error(err);
            if (notify) notify(err.message);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
            
            <main className="dashboard-content">
                {activeTab === 'profile' && (
                    <div className="tab-heading fade-in">
                        <h2>📜 Character Profile</h2>
                        <div className="profile">
                            <ProfileCard user={user} notify={notify} />
                            <SkillsSummary userSkills={userSkills}/>
                        </div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="tab-view fade-in">
                        {/* Pass down the handlers right here */}
                        <SkillList 
                            userSkills={userSkills} 
                            onAddSkill={handleAddSkill} 
                            onRemoveSkill={handleRemoveSkill} 
                        />
                    </div>
                )}
                
                {activeTab === 'quests' && (
                    <QuestMenu user={user} userSkills={userSkills} notify={notify} />
                )}
            </main>
        </div>
    );
}

export default CharacterDashboard;