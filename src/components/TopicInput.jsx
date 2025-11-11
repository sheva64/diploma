import React from "react";

const TopicInput = ({ topic, setTopic, generateTest, loading }) => {
    return (
        <div>
            <p>Введи тему тесту:</p>
            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Наприклад: React або Алгоритми сортування"
            />
            <button onClick={generateTest} disabled={loading}>
                {loading ? "Генерується..." : "Згенерувати тест"}
            </button>
        </div>
    )
}

export default TopicInput