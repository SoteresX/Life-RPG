import React, {useRef, useState} from "react";
import './ProfileCard.css';

function ProfileCard({ user, notify }){
    const [avatarUrl, setAvatarUrl] = useState(() => {
        if(!user.avatar_url) return null;
        return user.avatar_url.startsWith('http')
        ? user.avatar_url
        : `http://localhost:5000${user.avatar_url}`;
    });

    const fileInputRef = useRef(null);

    const nextLevelExp = user.level * 100;
    const maxHP = 100;
    const expPercentage = Math.min((user.exp / nextLevelExp) * 100, 100);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("userId", user.id);

        try{
            const response = await fetch("http://localhost:5000/api/user/upload-avatar", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok){
                setAvatarUrl(`http://localhost:5000${data.avatarPath}`);
                notify("Avatar uploaded successfully");
            } else{
                notify(data.error || "Upload failed");
            }
        } catch (error){
            console.error("Error uploading avatar:", error);
            notify("Error uploading avatar file.");
        };
    };

    return (
    <div className="profile-card">
      <div className="avatar-container">
        <div className="pixel-avatar clickable-avatar" onClick={handleAvatarClick} title="Click to upload avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User Avatar" className="avatar-img" />
          ) : (
            <span>🧙‍♂️</span>
          )}
          <div className="avatar-overlay">✏️</div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: "none" }} 
        />
        <div className="userTitles">
          <h2 className="player-name">{user.user_name}</h2>
          <span className="player-title">Adventurer</span>
          <span className="player-title">Lvl. {user.level}</span>
        </div>
      </div>
      <div className="stat-bars-container">
        <div className="stat-row">
          <div className="stat-labels">
            <span>EXP ({user.exp} / {nextLevelExp})</span>
          </div>
          <div className="progress-bar-container exp-bg">
            <div className="progress-fill exp-fill" style={{ width: `${expPercentage}%` }}></div>
          </div>
        </div>
      </div>
      <div className="stat-bars-container">
        <div className="stat-row">
          <div className="stat-labels">
            <span>HP ({user.hp} / {maxHP})</span>
          </div>
          <div className="progress-bar-container hp-bg">
            <div className="progress-fill hp-fill" style={{ width: `${user.hp}%` }}></div>
          </div>
        </div>
      </div>
      <div className="stat-bars-container">
        <div className="stat-row">
          <div className="stat-labels">
            <span>ENERGY ({user.energy}%)</span>
          </div>
          <div className="progress-bar-container energy-bg">
            <div className="progress-fill energy-fill" style={{ width: `${user.energy}%` }}></div>
          </div>
        </div>
      </div>
    </div>

    
  );
}

export default ProfileCard;