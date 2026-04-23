import React from "react";

const TopicInput = ({ topic, setTopic, file, setFile, generateTest, loading }) => {
    return (
        <div className="topic-input-container">
            <p>Введіть тему АБО завантажте PDF-файл з матеріалом:</p>
            
            <div className="input-group" style={{ flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      if (e.target.value) setFile(null); // Скидаємо файл, якщо вводять тему
                    }}
                    placeholder="Наприклад: Основи React"
                    onKeyDown={(e) => e.key === 'Enter' && generateTest()}
                    disabled={!!file} // Блокуємо ввід теми, якщо обрано файл
                />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        setFile(selectedFile);
                        if (selectedFile) setTopic(""); // Скидаємо тему, якщо обрано файл
                      }}
                  />
                  {file && (
                    <button 
                      style={{ background: '#e74c3c', padding: '8px 12px' }} 
                      onClick={() => setFile(null)}
                    >
                      Відкріпити файл
                    </button>
                  )}
                </div>

                <button 
                  onClick={generateTest} 
                  disabled={loading || (!topic.trim() && !file)}
                  style={{ marginTop: '10px' }}
                >
                    {loading ? "Аналізуємо матеріал та генеруємо..." : "Згенерувати тест"}
                </button>
            </div>
        </div>
    )
}

export default TopicInput;