import React from "react";

const TopicInput = ({ topic, setTopic, generateTest, loading }) => {
    return (
        <div className="topic-input-container">
            <p>Введіть тему для тестування:</p>
            <div className="input-group">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Наприклад: React або Алгоритми сортування"
                    onKeyDown={(e) => e.key === 'Enter' && generateTest()}
                />
                <button onClick={generateTest} disabled={loading || !topic.trim()}>
                    {loading ? "Генерація..." : "Згенерувати тест"}
                </button>
            </div>
        </div>
    )
}

export default TopicInput;