const BASE_URL = 'http://localhost:5000/api';

export const fetchSkills = async (userId) => {
  const res = await fetch(`${BASE_URL}/user/${userId}/skills`);
  if (!res.ok) throw new Error("Failed to fetch skills.");
  return res.json();
};

export const createCustomSkill = async (userId, skillData) => {
  const response = await fetch(`${BASE_URL}/user/${userId}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skillData)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to add skill");
  return data;
};

export const deleteCustomSkill = async (skillId) => {
  const response = await fetch(`${BASE_URL}/skills/${skillId}`, {
    method: 'DELETE'
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to delete skill");
  return data;
};