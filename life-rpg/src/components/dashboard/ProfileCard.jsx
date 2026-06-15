import React from "react";

function ProfileCard({ user }){
    const nextLevelExp = user.level * 100;
    const expPercentage = Math.min((user.exp / nextLevelExp) * 100, 100);

    return (
        <div className="profile-card">
            <div className="avatar-container">
                {/* Using a placeholder pixel art style avatar */}
                <div className="pixel-avatar">🧙‍♂️</div>
                <h2>{user.user_name}</h2>
                <span className="player-title">Level {user.level} Adventurer</span>
            </div>

            <div className="stat-bars-container">
                {/* Main Character EXP Bar */}
                <div className="stat-row">
                    <div className="stat-labels">
                        <span>EXP ({user.exp} / {nextLevelExp})</span>
                    </div>
                    <div className="progress-bar-container exp-bg">
                        <div className="progress-fill exp-fill" style={{ width: `${expPercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard;