import React from 'react';
import "./SkillList.css";

const SKILL_MILESTONES = {
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
      1: "Clueless Squire: The trash is overflowing, the bed is a pile of sheets, and you're pretty sure that mug has been on your desk for three days. Every chore feels like an elite boss battle.",
      2: "Apprentice Caretaker: You've learned the layout of the land. The dishes are getting washed before they grow a civilization, and you actually know where the mop lives.",
      3: "Domestic Sentinel: Maintenance has become a habit. You reset your room every morning like a daily server refresh, and dust bunnies tremble at your approach.",
      4: "Sovereign of Self-Care: Your environment actively works for you, not against you. Your living space is organized for peak efficiency, and you execute chores with swift, satisfying precision.",
      5: "Master of the Sanctuary: Your home is an impeccable canvas of peace. Chaos cannot take root here; you manage your domain with effortless grace, turning mundane chores into a meditative art form."
    }
  }
};

function SkillList( {userSkills} ){
    const liveSkills = userSkills;

    return (
      <div className="skills-container">
        <h2>⚔️ Life Skill Masteries</h2>
        <p className="subtitle">Each skill caps at Level 5. Unlock higher tiers to upgrade your life description!</p>
        
        <div className="skills-grid">
          {Object.keys(SKILL_MILESTONES).map((skillKey) => {
            const skillDetails = SKILL_MILESTONES[skillKey];
            const currentLevel = liveSkills[skillKey] || 1;
            const currentDescription = skillDetails.milestones[currentLevel] || "Error";
            const progressPercentage = (currentLevel / 5) * 100;

            return (
              <div key={skillKey} className="skill-card">
                <div className="skill-header">
                  <h3>{skillDetails.name}</h3>
                  <span className="skill-badge">LVL {currentLevel}/5</span>
                </div>
                <p className="skill-desc-taste">{skillDetails.description}</p>
                
                <div className="progress-bar-container skill-bg">
                  <div className="progress-fill skill-fill" style={{ width: `${progressPercentage}%` }}></div>
                </div>

                <div className="milestone-box">
                  <strong>Current Status:</strong> "{currentDescription}"
                </div>
              </div>
              );
          })}
          </div>
        </div>  
    )
}

export default SkillList;