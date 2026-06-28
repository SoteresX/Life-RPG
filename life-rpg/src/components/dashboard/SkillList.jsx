import React, { useState } from 'react';
import "./SkillList.css";

const FIXED_MILESTONES = {
  sleep: {
    name: "Sleep",
    description: "Your biological clock consistency.",
    milestones: {
      1: "You sleep every night consistently, but hours are completely random.",
      2: "Night Owl: You fall asleep consistently around 3 AM to 5 AM.",
      3: "Improving: You managed to pull your schedule back to 1 AM or 2 AM.",
      4: "Disciplined: You wind down and sleep peacefully by midnight.",
      5: "Circadian Master: Perfect 8 hours, sleeping by 10:30 PM every night."
    }
  },
  food: {
    name: "Food & Diet",
    description: "Fueling your body with quality nutrition.",
    milestones: {
      1: "Survival Mode: You eat overall food just to not starve. Lots of junk.",
      2: "Aware: You notice what you eat and track basic calories.",
      3: "Home Cook: You make your own meals a few times a week.",
      4: "Clean Fuel: High protein, minimal processed sugars daily.",
      5: "Nutritional Sage: Consistent, perfectly healthy lifestyle diet."
    }
  },
  cooking: {
    name: "Cooking",
    description: "The art of self-sustenance.",
    milestones: {
      1: "Microwave King: You can heat pre-made foods and boil water.",
      2: "Recipe Follower: You can make basic eggs, pasta, or stir-fry safely.",
      3: "Kitchen Comfort: You cook multi-ingredient dishes without a guide.",
      4: "Meal Prep Master: You cook an entire week's healthy menu efficiently.",
      5: "Culinary Artist: You craft custom gourmet macro-balanced meals."
    }
  },
  fitness: {
    name: "Physical Health & Fitness",
    description: "Cardio, strength, and physical well-being.",
    milestones: {
      1: "Sedentary: Most days are spent sitting; stretching is rare.",
      2: "Stretcher: You take short walks and hit basic step goals.",
      3: "Active: You engage in dedicated workouts 2-3 times a week.",
      4: "Athlete: Regular heavy training, great stamina, and mobility.",
      5: "Peak Form: Optimized physical strength, conditioning, and recovery."
    }
  },
  house_chores: {
    name: "House Chores",
    description: "Taking care of house work.",
    milestones: {
      1: "Clueless Squire: The trash is overflowing, the bed is a pile of sheets...",
      2: "Apprentice Caretaker: You've learned the layout of the land...",
      3: "Domestic Sentinel: Maintenance has become a habit...",
      4: "Sovereign of Self-Care: Your environment actively works for you...",
      5: "Master of the Sanctuary: Your home is an impeccable canvas of peace..."
    }
  }
};



const getCustomMilestone = (name, level) => {
  const genericTitles = { 1: "Novice", 2: "Apprentice", 3: "Adept", 4: "Expert", 5: "Master" };
  return `${genericTitles[level] || "Novice"} of ${name}. Continuing your journey of dedicated mastery.`;
};

function SkillList({ userSkills, onAddSkill, onRemoveSkill }) {
  const [skillDescription, setSkillDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'remove'
  const [newSkillName, setNewSkillName] = useState('');

  const openManagementModal = () => {
    setNewSkillName('');       // Clear input fields
    setSkillDescription('');    // Clear input fields
    setModalMode('add');        // Reset tab view back to default
    setIsModalOpen(true);       // Open the modal container
  };

  if (!userSkills || !Array.isArray(userSkills)) {
    return (
      <div className="skills-container">
        <h2>⚔️ Life Skill Masteries</h2>
        <p className="loading-text">Inspecting guild registers...</p>
      </div>
    );
  }

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    onAddSkill({
      name: newSkillName.trim(),
      skill_key: newSkillName.trim().toLowerCase().replace(/\s+/g, '_'),
      description: skillDescription.trim()
    });
    setNewSkillName('');
    setIsModalOpen(false);
  };

  return (
    <div className="skills-container">
      <div className="skills-top-panel">
        <div className="tab-heading">
          <h2>⚔️ Life Skill Masteries</h2>
          <p className="subtitle">Each skill caps at Level 5. Unlock higher tiers to upgrade your life description!</p>
        </div>
        <button className="manage-skills-trigger-btn" onClick={openManagementModal}>
          ⚙️ Manage Skills
        </button>
      </div>

      {/* --- REUSABLE MODAL OVERLAY & CONTENT --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="quest-form modal-panel-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h3>✨ Guild Skill Registries</h3>
              <button type="button" className="close-panel-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            {/* Sub-navigation tabs inside the panel */}
            <div className="skill-modal-tabs">
              <button 
                className={`skill-tab-btn ${modalMode === 'add' ? 'active-tab' : ''}`}
                onClick={() => setModalMode('add')}
              >
                🔨 Forge New Skill
              </button>
              <button 
                className={`skill-tab-btn ${modalMode === 'remove' ? 'active-tab-delete' : ''}`}
                onClick={() => setModalMode('remove')}
              >
                🗑️ Remove Custom Skill
              </button>
            </div>

            {/* MODE 1: FORGE COMPONENT */}
            {modalMode === 'add' && (
              <form onSubmit={handleAddSubmit} className="skill-modal-body">
                <div className="form-group">
                  <label>Life Skill Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Web Development, Meditation..." 
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    maxLength={30}
                    required 
                  />
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Skill Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Building application ecosystems from scratch." 
                    value={skillDescription}
                    onChange={(e) => setSkillDescription(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <button type="submit" className="post-quest-btn" style={{ marginTop: '20px' }}>
                  Accept New Skill Discipline
                </button>
              </form>
            )}

            {/* MODE 2: REMOVE COMPONENT */}
            {modalMode === 'remove' && (
              <div className="skill-modal-body">
                <p className="modal-notice-text">Select a dynamic discipline to strike from your ledger. Core rules cannot be deleted.</p>
                <div className="custom-skills-removal-list">
                  {userSkills.filter(s => !Object.prototype.hasOwnProperty.call(FIXED_MILESTONES, s.skill_key) || s.skill_key === 'house_chores').length === 0 ? (
                    <p className="empty-msg">No custom skills available to delete.</p>
                  ) : (
                    userSkills
                      .filter(s => !Object.prototype.hasOwnProperty.call(FIXED_MILESTONES, s.skill_key) || s.skill_key === 'house_chores')
                      .map(skill => (
                        <div key={skill.id} className="removal-row-item">
                          <span>📜 {skill.name} (LVL {skill.current_level || 1})</span>
                          <button 
                            className="delete-quest-btn compact-delete"
                            onClick={() => {
                              onRemoveSkill(skill.id);
                              // Close modal safely if removing the last element
                              if (userSkills.filter(s => !Object.prototype.hasOwnProperty.call(FIXED_MILESTONES, s.skill_key) || s.skill_key === 'house_chores').length <= 1) {
                                setIsModalOpen(false);
                              }
                            }}
                          >
                            🗑️ Striking Out
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- MAIN DISPLAY GRID --- */}
      <div className="skill-grid-container">
        <div className="skills-grid">
            {userSkills.map((skill) => {
              const skillKey = skill.skill_key;
              const isCoreSkill = Object.prototype.hasOwnProperty.call(FIXED_MILESTONES, skillKey);
              
              const displayName = isCoreSkill ? FIXED_MILESTONES[skillKey].name : skill.name;
              const displayDesc = isCoreSkill ? FIXED_MILESTONES[skillKey].description : (skill.description || "Custom discipline.");
              
              const currentLevel = skill.current_level || 1;
              const currentExp = skill.current_exp || 0;

              const expNeeded = Math.floor(150 * Math.pow(currentLevel, 2.15));
              const expPercentage = Math.min((currentExp / expNeeded) * 100, 100);
              const totalProgressPercentage = (currentLevel / 5) * 100;

              const currentDescription = isCoreSkill 
                ? FIXED_MILESTONES[skillKey].milestones[currentLevel]
                : getCustomMilestone(displayName, currentLevel);

              return (
                <div key={skill.id || skillKey} className="skill-card">
                  <div className="skill-header">
                    <h3>{displayName}</h3>
                    <span className="skill-badge">LVL {currentLevel}/5</span>
                  </div>
                  
                  <p className="skill-desc-taste">{displayDesc}</p>
                  
                  <div className="progress-bar-container skill-bg">
                    <div className="progress-fill skill-fill" style={{ width: `${totalProgressPercentage}%` }}></div>
                  </div>

                  {currentLevel < 5 ? (
                    <div className="skill-exp-section">
                      <div className="skill-exp-meta">
                        <span>Progress to Level up</span>
                        <span className="exp-numbers-tracker">{currentExp} / {expNeeded} XP</span>
                      </div>
                      <div className="progress-bar-container skill-exp-track-bg">
                        <div 
                          className="progress-fill skill-exp-fill-purple" 
                          style={{ width: `${expPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="skill-exp-section maxed-out-tag">
                      ✨ Skill Mastery Maximum Reached ✨
                    </div>
                  )}

                  <div className="milestone-box">
                    <strong>Current Status:</strong> "{currentDescription}"
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>  
  );
}

export default SkillList;