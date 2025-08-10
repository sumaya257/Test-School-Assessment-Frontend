import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { setExam, setTimer, setAnswer, clearExam, setStep } from './examSlice';
import { useStartExamMutation, useSubmitExamMutation } from './examApi';

interface Props {
  step: number;
  onFinish: (certifiedLevel: string) => void;
}

const ExamStart: React.FC<Props> = ({ step, onFinish }) => {
  const dispatch = useDispatch();
  const { examId, timer, answers, step: currentStep } = useSelector((state: RootState) => state.exam);

  const [startExam, { data, isLoading }] = useStartExamMutation();
  const [submitExam, { isLoading: submitting }] = useSubmitExamMutation();

  // Start or restart exam if step changes or no examId
  useEffect(() => {
  console.log('ExamStart useEffect fired:', { examId, currentStep, step });
  if (!examId || currentStep !== step) {
    startExam({ step })
      .unwrap()
      .then((res) => {
        console.log('Exam started:', res);
        dispatch(
          setExam({
            examId: res.examId,
            step,
            timer: res.durationSeconds,
            answers: res.questions.map((q) => ({ questionId: q.id, optionId: null })),
          })
        );
      })
      .catch((err) => {
        console.error('Failed to start exam:', err);
        alert('Failed to start exam');
      });
  }
}, [step, startExam, dispatch, examId, currentStep]);


  // Timer countdown + auto-submit on expiry
  useEffect(() => {
    if (timer <= 0 && examId) {
      handleSubmit();
      return;
    }
    const interval = setInterval(() => {
      dispatch(setTimer(timer - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, examId, dispatch]);

  const handleOptionSelect = (questionId: string, optionId: number) => {
    dispatch(setAnswer({ questionId, optionId }));
  };

  const handleSubmit = () => {
    if (!examId) return;

    const filteredAnswers = answers.filter(
      (a): a is { questionId: string; optionId: number } => a.optionId !== null
    );

    submitExam({ examId, answers: filteredAnswers })
      .unwrap()
      .then((res) => {
        alert(`Result: ${res.result}\nCertified Level: ${res.certifiedLevel}`);

        // Handle 3 step progression logic:
        // Score ranges and level advancement per your spec
        const perc = res.percentage;
        let nextStep = step;
        const certifiedLevel = res.certifiedLevel;

        if (step === 1) {
          if (perc >= 75) {
            nextStep = 2;
          } // else stays at step 1 or fail (no retake)
        } else if (step === 2) {
          if (perc >= 75) {
            nextStep = 3;
          } // else stays at step 2 or fallback to A2 per your server logic
        } else if (step === 3) {
          // Final step - no next step
          nextStep = 3;
        }

        dispatch(setStep(nextStep));
        dispatch(clearExam());
        onFinish(certifiedLevel);
      })
      .catch(() => alert('Submit failed'));
  };

  if (isLoading || !data) return <p>Loading questions...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Step {step} Exam - Time left: {Math.floor(timer / 60)}:
        {(timer % 60).toString().padStart(2, '0')}
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
                <label key={opt.id} className="cursor-pointer flex items-center gap-2">
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
