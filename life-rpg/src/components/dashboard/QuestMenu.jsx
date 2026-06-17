import React, { useState, useEffect } from 'react';
import './QuestMenu.css';

function QuestMenu({ user, notify }) {
    const [quests, setQuests] = useState([]);
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('Favor'); // Favor, Project, Special
    const [skillTarget, setSkillTarget] = useState('sleep');
    const [modalStatus, setModalStatus] = useState('closed');

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

    const handleCloseModal = () => {
        setModalStatus('exiting'); // 1. Swap classes to trigger CSS keyframes immediately
        
        setTimeout(() => {
            setModalStatus('closed'); // 2. Physically remove from DOM after animation completes
        }, 200); // Must match your CSS animation duration (0.2s)
    };

    // Handle Form submission
    const handleAddQuest = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        fetch(`http://localhost:5000/api/user/${user.id}/quests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, difficulty, skill_target: skillTarget })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to save quest");
            return res.json();
        })
        .then(data => {
            setQuests((prev) => [data.quest, ...prev]); 
            setTitle(''); // Reset text box
            handleCloseModal(); // Use the smooth exit close here!
            if (notify) notify("⚔️ New Quest posted to the bulletin board!", "success");
        })
        .catch(err => {
            console.error(err);
            if (notify) notify("❌ Failed to register quest on the guild board.", "error");
        });
    };

    return (
        <div className="quests-container fade-in">
            <div className="quests-header">
                <div>
                    <h2>⚔️ Adventurer's Guild Bulletin</h2>
                    <p className="subtitle">Track your habits as cozy quests. Click the plus button to sign a new contract!</p>
                </div>
                
                {/* FLOATING + BUTTON TO OPEN NEW PANEL */}
                
            </div>

            {/* INTERACTIVE OVERLAY MODAL PANEL */}
            {modalStatus !== 'closed' && (
                <div 
                    className={`modal-overlay ${modalStatus === 'exiting' ? 'fade-out-bg' : ''}`} 
                    onClick={handleCloseModal}
                >
                    <form 
                        onSubmit={handleAddQuest} 
                        className={`quest-form modal-panel-content ${modalStatus === 'exiting' ? 'slide-up-exit' : ''}`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>📜 Post a New Quest</h3>
                            <button type="button" className="close-panel-btn" onClick={handleCloseModal}>×</button>
                        </div>
                        
                        <div className="form-group">
                            <label>Quest Objective</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Target Life Skill</label>
                                <select value={skillTarget} onChange={(e) => setSkillTarget(e.target.value)}>
                                    <option value="sleep">Sleep</option>
                                    <option value="food">Food & Diet</option>
                                    <option value="cooking">Cooking</option>
                                    <option value="fitness">Fitness & Training</option>
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
                        <button type="submit" className="post-quest-btn">Accept Assignment</button>
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
                        {quests.map((quest) => (
                            <div key={quest.id} className={`quest-card rank-${quest.difficulty.toLowerCase()}`}>
                                <div className="quest-meta">
                                    <span className="quest-badge-skill">{quest.skill_target}</span>
                                    <span className="quest-badge-rank">{quest.difficulty}</span>
                                </div>
                                <h4 className="quest-title">{quest.title}</h4>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button className="add-quest-trigger-btn" onClick={() => setModalStatus('open')} title="Post a New Quest">+</button>
        </div>
    );
}

export default QuestMenu;