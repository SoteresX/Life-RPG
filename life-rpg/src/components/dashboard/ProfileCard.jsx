import React, {useRef, useState} from "react";

function ProfileCard({ user, notify }){
    const [avatarUrl, setAvatarUrl] = useState(() => {
        if(!user.avatar_url) return null;
        return user.avatar_url.startsWith('http')
        ? user.avatar_url
        : `http://localhost:5000${user.avatar_url}`;
    });

    const fileInputRef = useRef(null);

    const nextLevelExp = user.level * 100;
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
        {/* Clickable Avatar Container */}
        <div className="pixel-avatar clickable-avatar" onClick={handleAvatarClick} title="Click to upload avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User Avatar" className="avatar-img" />
          ) : (
            <span>🧙‍♂️</span>
          )}
          <div className="avatar-overlay">✏️</div>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: "none" }} 
        />

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
  );
}

export default ProfileCard;