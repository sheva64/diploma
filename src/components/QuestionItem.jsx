import React from "react";

const QuestionItem = ({ q, index, answer, handleAnswer, showResults }) => {
    return (
      <div>
        <p>{q.question}</p>
        {q.options.map((opt, idx) => (
          <label key={idx}>
            <input
              type="radio"
              name={`q-${index}`}
              checked={answer === opt}
              onChange={() => handleAnswer(index, opt)}
            />
            {opt}
          </label>
        ))}
        {showResults && (
          <p>
            {answer === q.correct
              ? "✅ Правильно!"
              : `❌ Неправильно. Правильна відповідь: ${q.correct}`}
          </p>
        )}
        <hr />
    </div>
    )
}

export default QuestionItem