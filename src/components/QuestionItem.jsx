import React from "react";

const QuestionItem = ({ q, index, answer, handleAnswer, showResults }) => {
    const isCorrect = answer === q.correct;

    return (
      <div className="question-card">
        <p className="question-text">{index + 1}. {q.question}</p>
        
        <div className="options-list">
          {q.options.map((opt, idx) => (
            <label key={idx} className="option-label">
              <input
                type="radio"
                name={`q-${index}`}
                checked={answer === opt}
                onChange={() => handleAnswer(index, opt)}
                disabled={showResults} // Блокуємо зміну після перевірки
              />
              {opt}
            </label>
          ))}
        </div>

        {showResults && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect
              ? "✅ Правильно!"
              : `❌ Неправильно. Правильна відповідь: ${q.correct}`}
          </div>
        )}
      </div>
    )
}

export default QuestionItem;