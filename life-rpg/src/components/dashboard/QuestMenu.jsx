import React, { useState, useEffect } from 'react';
import './QuestMenu.css';
import { useQuestModal } from '../../hooks/useQuestModal';

const getQuestRewards = (difficulty) => {
    switch (difficulty){
        case 'Favor':
            return { xp: 15, skillXp: 25, coins: 5 };
        case 'Project':
            return { xp: 30, skillXp: 45, coins: 15 };
        case 'Special':
            return { xp: 50, skillXp: 60, coins: 30};
    }
}

function QuestMenu({ user, userSkills, notify }) {
    const [quests, setQuests] = useState([]);
    
    // Fetch quests from database on component mount
    useEffect(() => {
        if (!user || !user.id) return;
        
        fetch(`http://localhost:5000/api/user/${user.id}/quests`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setQuests(data);
            })
            .catch(err => console.error("Error loading quests:", err));
    }, [user]);

   const {
    modalStatus,
    editingQuest,
    title,
    difficulty,
    skillTarget,
    setTitle,
    setDifficulty,
    setSkillTarget,
    manageModal,
    handleFormSubmit,
    handleDeleteQuest,
    handleCompleteQuest
   } = useQuestModal();

   useEffect(() => {
       if (Array.isArray(userSkills) && userSkills.length > 0 && !skillTarget) {
           const firstSkill = userSkills[0].skill_key || userSkills[0].name?.toLowerCase() || userSkills[0].id;
           setSkillTarget(firstSkill);
       }
   }, [userSkills, skillTarget, setSkillTarget]);

    return (
        <div className="quests-container fade-in">
            <h2>⚔️ Adventurer's Guild Bulletin</h2>
            <p className="subtitle">Track your habits as cozy quests. Click the plus button to sign a new contract!</p>

            {modalStatus !== 'closed' && (
                <div 
                    className={`modal-overlay ${modalStatus === 'exiting' ? 'fade-out-bg' : ''}`} 
                    onClick={() => manageModal('close')}
                >
                    <form 
                        onSubmit={(e) => handleFormSubmit(e, { user, setQuests, notify })}
                        className={`quest-form modal-panel-content ${modalStatus === 'exiting' ? 'slide-up-exit' : ''}`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>{editingQuest ? "📝 Edit Quest Details" : "📜 Post a New Quest"}</h3>
                            <button type="button" className="close-panel-btn" onClick={() => manageModal('close')}>×</button>
                        </div>
                        
                        <div className="form-group">
                            <label>Quest Objective</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Target Life Skill</label>
                                <select value={skillTarget} onChange={(e) => setSkillTarget(e.target.value)}>
                                {/* Safe Array Verification Wrapper */}
                                {!Array.isArray(userSkills) || userSkills.length === 0 ? (
                                    <option value="">Loading skills...</option>
                                ) : (
                                    userSkills.map((skill) => {
                                        const skillValue = skill.skill_key || skill.name?.toLowerCase() || skill.id;
                                        const skillDisplay = skill.name || skill.skill_key;
                                        return (
                                            <option key={skill.id || skillValue} value={skillValue}>
                                                {skillDisplay}
                                            </option>
                                        );
                                    })
                                )}
                            </select>
                            </div>
                            <div className="form-group">
                                <label>Rank Difficulty</label>
                                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                                    <option value="Favor">🌱 Daily Favor</option>
                                    <option value="Project">🪵 Community Project</option>
                                    <option value="Special">👑 Special Order</option>
                                </select>
                            </div>
                        </div>

                        {/* RENDER MODAL ACTION CONTROLS */}
                        <div className="modal-actions-row">
                            {editingQuest && (
                                <>
                                    <button type="button" className="delete-quest-btn" onClick={() => handleDeleteQuest({ setQuests, notify})}>
                                        🗑️ Abandon
                                    </button>
                                </>
                            )}
                            <button type="submit" className="post-quest-btn">
                                {editingQuest ? "Save Adjustments" : "Accept Assignment"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ACTIVE QUEST LIST */}
            <div className="active-quests-section">
                <h3>Active Guild Contracts ({quests.length})</h3>
                {quests.length === 0 ? (
                    <p className="empty-msg">The bulletin board is completely clear. Click the green button above to post a habit task!</p>
                ) : (
                    <div className="quests-grid">
                        {quests.map((quest) => {
                            // Calculate rewards for this specific quest card
                            const rewards = getQuestRewards(quest.difficulty);

                            return (
                                <div key={quest.id} className={`quest-card rank-${quest.difficulty.toLowerCase()}`}>
                                    <div className="quest-meta">
                                        <span className="quest-badge-skill">{quest.skill_target}</span>
                                        <span className="quest-badge-rank">{quest.difficulty}</span>
                                        <div className="quest-meta-right">
                                            <button 
                                                className="quick-complete-card-btn"
                                                onClick={() => handleCompleteQuest({ setQuests, notify }, quest)}
                                                title="Complete Quest"
                                            >
                                                ✨
                                            </button>
                                            <button 
                                                className="edit-quest-card-btn" 
                                                onClick={() => manageModal('edit', quest)}
                                                title="Edit Quest Details"
                                            >
                                                ✏️
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="quest-title">{quest.title}</h4>

                                    {/* NEW: REWARDS FOOTER PANEL */}
                                    <div className="quest-rewards-panel">
                                        <span className="reward-title">Rewards:</span>
                                        <div className="reward-badges">
                                            <span title="Player XP">✨ {rewards.xp}XP</span>
                                            <span title={`${quest.skill_target.toUpperCase()} XP`}>🧬 {rewards.skillXp}XP</span>
                                            <span title="Gold Coins">💰 {rewards.coins}g</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <button className="add-quest-trigger-btn" onClick={() => manageModal('open')} title="Post a New Quest">+</button>
        </div>
    );
}

export default QuestMenu;