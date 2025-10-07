import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6500/";

export default function Agnes() {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch(`${API_URL}api/mainCharacters/3`); // Agnes’s ID
        const data = await res.json();
        setCharacter(data);
      } catch (err) {
        console.error("Error loading Agnes data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, []);

  if (loading) {
    return <div className="character-loading">Loading Agnes’s profile...</div>;
  }

  if (!character) {
    return <div className="character-error">Character data unavailable.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">{character.name}</h1>
        <p className="profile-subtitle">The Healer of Broken Worlds</p>
      </div>

      <div className="profile-content">
        {character.photo_url && (
          <img
            src={character.photo_url}
            alt={character.name}
            className="profile-photo"
          />
        )}

        <div className="profile-section">
          <h2>Personal Details</h2>
          <p>{character.personal_details}</p>
        </div>

        <div className="profile-section">
          <h2>Background</h2>
          <p>{character.background}</p>
        </div>

        {character.notable_quotes && character.notable_quotes.length > 0 && (
          <div className="profile-section">
            <h2>Notable Quotes</h2>
            <ul className="quote-list">
              {character.notable_quotes.map((q, idx) => (
                <li key={idx} className="quote-item">
                  “{q}”
                </li>
              ))}
            </ul>
          </div>
        )}

        {character.notable_moments && character.notable_moments.length > 0 && (
          <div className="profile-section">
            <h2>Notable Moments</h2>
            <ul className="moment-list">
              {character.notable_moments.map((m, idx) => (
                <li key={idx} className="moment-item">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
