import React, { useEffect, useState } from 'react';
import { useStartExamMutation, useSubmitExamMutation } from './examApi';

interface Answer {
  questionId: string;
  optionId: number | null;
}

interface Props {
  step: number; // 1 or 2 or 3
  onFinish: (certifiedLevel: string) => void;
}

const ExamStart: React.FC<Props> = ({ step, onFinish }) => {
  const [startExam, { data, isLoading }] = useStartExamMutation();
  const [submitExam, { isLoading: submitting }] = useSubmitExamMutation();

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timer, setTimer] = useState(0);
  const [examId, setExamId] = useState<string | null>(null);

  useEffect(() => {
    startExam({ step })
      .unwrap()
      .then((res) => {
        setExamId(res.examId);
        setTimer(res.durationSeconds);
        // initialize answers array
        const initialAnswers = res.questions.map((q) => ({ questionId: q.id, optionId: null }));
        setAnswers(initialAnswers);
      })
      .catch(() => alert('Failed to start exam'));
  }, [startExam, step]);

  // countdown timer
  useEffect(() => {
    if (timer <= 0) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOptionSelect = (questionId: string, optionId: number) => {
    setAnswers((prev) =>
      prev.map((a) => (a.questionId === questionId ? { ...a, optionId } : a))
    );
  };

  const handleSubmit = () => {
    if (!examId) return;
    submitExam({ examId, answers })
      .unwrap()
      .then((res) => {
        alert(`Result: ${res.result}\nCertified Level: ${res.certifiedLevel}`);
        onFinish(res.certifiedLevel);
      })
      .catch(() => alert('Submit failed'));
  };

  if (isLoading || !data) return <p>Loading questions...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Step {step} Exam - Time left: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {data.questions.map((q, idx) => (
          <div key={q.id} className="mb-6 border-b pb-4">
            <p>
              <strong>
                Q{idx + 1} [{q.level} - {q.competencyCode}]:
              </strong>{' '}
              {q.stem}
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt.id}
                    checked={answers.find((a) => a.questionId === q.id)?.optionId === opt.id}
                    onChange={() => handleOptionSelect(q.id, opt.id)}
                    required
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          {submitting ? 'Submitting...' : 'Submit Exam'}
        </button>
      </form>
    </div>
  );
};

export default ExamStart;
