import React from "react";
import "./SkillsSummary.css";

const SKILL_NAMES = {
  sleep: "Sleep",
  food: "Food & Diet",
  cooking: "Cooking",
  fitness: "Gaming & Leisure"
};

function SkillsSummary({ userSkills }) {
  // Guard clause in case user data or skills array hasn't loaded yet
  if (!userSkills) {
    return (
      <div className="skills-summary-card empty-state">
        <span className="loading-text">Loading stats...</span>
      </div>
    );
  }

  const activeSkills = userSkills || { sleep: 1, food: 1, cooking: 1, gaming: 1, health: 1 };

  return (
    <div className="skills-summary-card">
      <h3 className="summary-title">📜 Skills Overview</h3>
      <div className="summary-divider"></div>
      
      <div className="summary-rows-container">
        {Object.keys(SKILL_NAMES).map((skillKey) => {
          const currentLevel = activeSkills[skillKey] || 1;
          
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