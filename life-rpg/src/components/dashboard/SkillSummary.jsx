import React from "react";
import "./SkillsSummary.css";

const SKILL_NAMES = {
  sleep: "Sleep",
  food: "Food & Diet",
  cooking: "Cooking",
  fitness: "Fitness",
  house_chores: "House Chores"
};

function SkillsSummary({ userSkills }) {
  if (!userSkills || !Array.isArray(userSkills)) {
    return (
      <div className="skills-summary-card empty-state">
        <span className="loading-text">Loading stats...</span>
      </div>
    );
  }

  return (
    <div className="skills-summary-card">
      <h3 className="summary-title">📜 Skills Overview</h3>
      <div className="summary-divider"></div>
      
      <div className="summary-rows-container">
        {Object.keys(SKILL_NAMES).map((skillKey) => {
          // 🔍 Find the matching skill object in your new backend array
          const skillData = userSkills.find(s => s.skill_key === skillKey);
          
          // Grab the level if it exists, otherwise default to 1
          const currentLevel = skillData ? skillData.current_level : 1;
          
          // Each level milestone adds an exact 20% chunk to the bar width
          const progressPercentage = (currentLevel / 5) * 100;

          return (
            <div key={skillKey} className="summary-skill-row">
              <div className="summary-skill-meta">
                <span className="summary-skill-name">{SKILL_NAMES[skillKey]}</span>
                <span className="summary-skill-level">Lv. {currentLevel}/5</span>
              </div>
              
              <div className="progress-bar-container skill-track-bg">
                <div 
                  className="progress-fill skill-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsSummary;