import React, { useState, useEffect } from 'react';
import './QuestMenu.css';

function QuestMenu({ user, notify }) {
    const [quests, setQuests] = useState([]);
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('Favor'); // Favor, Project, Special
    const [skillTarget, setSkillTarget] = useState('sleep');
    const [modalStatus, setModalStatus] = useState('closed');
    const [editingQuest, setEditingQuest] = useState(null);

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

    const handleOpenCreateModal = () => {
        setEditingQuest(null);
        setTitle('');
        setDifficulty('Favor');
        setSkillTarget('sleep');
        setModalStatus('open');
    };

    const handleOpenEditModal = (quest) => {
        setEditingQuest(quest);
        setTitle(quest.title);
        setDifficulty(quest.difficulty);
        setSkillTarget(quest.skill_target);
        setModalStatus('open');
    };

    const handleCloseModal = () => {
        setModalStatus('exiting');   
        setTimeout(() => {
            setModalStatus('closed');
            setEditingQuest(null);
        }, 200);
    };

    // Handle Form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const isEditing = !!editingQuest;
        const url = isEditing ? `http://localhost:5000/api/quests/${editingQuest.id}` : `http://localhost:5000/api/user/${user.id}/quests`

        const method = isEditing ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, difficulty, skill_target: skillTarget })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to save quest");
            return res.json();
        })
        .then(data => {
            if(isEditing){
                setQuests(prev => prev.map(q => q.id === editingQuest.id ? data.quest : q));
                if (notify) notify ("📝 Quest contract modified successfully!", "success");
            } else{
                setQuests(prev => [data.quest, ...prev]); 
                if (notify) notify("⚔️ New Quest posted to the bulletin board!", "success");
            }
            handleCloseModal(); // Use the smooth exit close here!
        })
        .catch(err => {
            console.error(err);
            if (notify) notify("❌ Failed to register quest on the guild board.", "error");
        })
    };

    const handleDeleteQuest = () => {
        if (!editingQuest) return;
        fetch(`http://localhost:5000/api/quests/${editingQuest.id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if(!res.ok) throw new Error();
            setQuests(prev => prev.filter(q => q.id !== editingQuest.id));
            handleCloseModal();
            if (notify) notify("🗑️ Quest contract shredded and removed.", "success");
        })
        .catch(err => {
            console.error(err);
            if (notify) notify("❌ Failed to delete quest assignment.", "error");
        });
    };

    return (
        <div className="quests-container fade-in">
            <h2>⚔️ Adventurer's Guild Bulletin</h2>
            <p className="subtitle">Track your habits as cozy quests. Click the plus button to sign a new contract!</p>

            {/* INTERACTIVE OVERLAY MODAL PANEL */}
            {modalStatus !== 'closed' && (
                <div 
                    className={`modal-overlay ${modalStatus === 'exiting' ? 'fade-out-bg' : ''}`} 
                    onClick={handleCloseModal}
                >
                    <form 
                        onSubmit={handleFormSubmit} 
                        className={`quest-form modal-panel-content ${modalStatus === 'exiting' ? 'slide-up-exit' : ''}`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>{editingQuest ? "📝 Edit Quest Details" : "📜 Post a New Quest"}</h3>
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

                        {/* RENDER MODAL ACTION CONTROLS */}
                        <div className="modal-actions-row">
                            {editingQuest && (
                                <button type="button" className="delete-quest-btn" onClick={handleDeleteQuest}>
                                    🗑️ Fail Quest
                                </button>
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
                        {quests.map((quest) => (
                            <div key={quest.id} className={`quest-card rank-${quest.difficulty.toLowerCase()}`}>
                                <div className="quest-meta">
                                    <span className="quest-badge-skill">{quest.skill_target}</span>
                                    <div className="quest-meta-right">
                                        <span className="quest-badge-rank">{quest.difficulty}</span>
                                        {/* HOVER PEN EDIT BUTTON */}
                                        <button 
                                            className="edit-quest-card-btn" 
                                            onClick={() => handleOpenEditModal(quest)}
                                            title="Edit Quest Details"
                                        >
                                            ✏️
                                        </button>
                                    </div>
                                </div>
                                <h4 className="quest-title">{quest.title}</h4>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button className="add-quest-trigger-btn" onClick={handleOpenCreateModal} title="Post a New Quest">+</button>
        </div>
    );
}

export default QuestMenu;