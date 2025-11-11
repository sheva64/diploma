import React from "react";
import QuestionItem from "./QuestionItem";

const QuestionsList = ({ topic, questions, answers, handleAnswer, showResults, checkAnswers }) => {
    return (
      <div>
        <h2>Тест по темі: {topic}</h2>
        {questions.map((q, index) => (
          <QuestionItem
            key={index}
            q={q}
            index={index}
            answer={answers[index]}
            handleAnswer={handleAnswer}
            showResults={showResults}
          />
        ))}

        {!showResults && (
          <button onClick={checkAnswers}>Перевірити відповіді</button>
        )}
    </div>
    )
}

export default QuestionsList