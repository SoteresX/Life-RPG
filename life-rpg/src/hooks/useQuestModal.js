import { useState } from "react";

export function useQuestModal() {
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('Favor');
    const [skillTarget, setSkillTarget] = useState('sleep');
    const [modalStatus, setModalStatus] = useState('closed');
    const [editingQuest, setEditingQuest] = useState(null);

    const manageModal = (action, quest = null) => {
        if (action === 'open'){
            setEditingQuest(null);
            setTitle('');
            setDifficulty('Favor');
            setSkillTarget('sleep');
            setModalStatus('open');
        } else if (action === 'edit' && quest){
            setEditingQuest(quest);
            setTitle(quest.title);
            setDifficulty(quest.difficulty);
            setSkillTarget(quest.skill_target);
            setModalStatus('open');
        } else if (action === 'close'){
            setModalStatus('exiting');
            setTimeout(() => {
                setModalStatus('closed');
                setEditingQuest(null);
            }, 200);
        }
    };

    // --- API HANDLERS ---

    const handleFormSubmit = (e, { user, setQuests, notify }) => {
        e.preventDefault();
        if (!title.trim()) return;

        const isEditing = !!editingQuest;
        const url = isEditing 
            ? `http://localhost:5000/api/quests/${editingQuest.id}` 
            : `http://localhost:5000/api/user/${user.id}/quests`;
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
            if (isEditing) {
                setQuests(prev => prev.map(q => q.id === editingQuest.id ? data.quest : q));
                if (notify) notify("📝 Quest contract modified successfully!", "success");
            } else {
                setQuests(prev => [data.quest, ...prev]); 
                if (notify) notify("⚔️ New Quest posted to the bulletin board!", "success");
            }
            manageModal('close');
        })
        .catch(err => {
            console.error(err);
            if (notify) notify("❌ Failed to register quest on the guild board.", "error");
        });
    };

    const handleDeleteQuest = ({ setQuests, notify }) => {
        if (!editingQuest) return;
        fetch(`http://localhost:5000/api/quests/${editingQuest.id}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (!res.ok) throw new Error();
            setQuests(prev => prev.filter(q => q.id !== editingQuest.id));
            manageModal('close');
            if (notify) notify("🗑️ Quest contract shredded and removed.", "success");
        })
        .catch(err => {
            console.error(err);
            if (notify) notify("❌ Failed to delete quest assignment.", "error");
        });
    };

    const handleCompleteQuest = ({ setQuests, notify, onStatsUpdate }, targetQuest = null) => {
        const activeQuest = targetQuest || editingQuest;
        if(!activeQuest) return;

        fetch(`http://localhost:5000/api/quests/${activeQuest.id}/complete`, {
            method: 'POST'
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed completion registration execution.");
            return res.json();
        })
        .then(data => {
            setQuests(prev => prev.filter(q => q.id !== activeQuest.id));
            if(editingQuest && editingQuest.id === activeQuest.id){
                manageModal('close');
            }
            

            if (notify) {
                notify(`✨ Quest Complete! Gained +${data.gained.userXp} Player XP, +${data.gained.skillXp} ${activeQuest.skill_target.toUpperCase()} XP, and +${data.gained.coins} Coins!`, "success");
            }

            if (onStatsUpdate && data.user) {
                onStatsUpdate(data.user);
            }
        })
        .catch(err => {
            console.error(err);
            if (notify) notify("❌ Error claiming guild contract verification tokens.", "error");
        });
    };

    return {
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
    };
}