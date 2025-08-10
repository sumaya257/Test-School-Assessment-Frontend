
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import {
  setExam,
  setTimer,
  setAnswer,
  clearExam,
  setStep,
} from './examSlice';
import { useStartExamMutation, useSubmitExamMutation } from './examApi';

import { jsPDF } from "jspdf";

interface Props {
  step: number;
  onFinish: (certifiedLevel: string) => void;
}

const ExamStart: React.FC<Props> = ({ step, onFinish }) => {
  const dispatch = useDispatch();
  const { examId, timer, answers, step: currentStep, questions } = useSelector(
    (state: RootState) => state.exam
  );
  // console.log(questions)

  const [startExam, { isLoading }] = useStartExamMutation();
  const [submitExam, { isLoading: submitting }] = useSubmitExamMutation();

  useEffect(() => {
    if (!examId || currentStep !== step || questions.length === 0) {
      startExam({ step })
        .unwrap()
        .then((res) => {
          dispatch(
            setExam({
              examId: res.examId,
              step,
              timer: res.durationSeconds,
              answers: res.questions.map((q) => ({ questionId: q.id, optionId: null })),
              questions: res.questions,
            })
          );
        })
        .catch(() => alert('Failed to start exam'));
    }
  }, [step, startExam, dispatch, examId, currentStep, questions.length]);

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

  // Certificate PDF তৈরি ও ডাউনলোড ফাংশন
  const generateCertificatePDF = (certifiedLevel: string) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Certificate of Achievement", 105, 40, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("This certificate is proudly presented to", 105, 60, { align: "center" });

    // এখানে তোমার ইউজারের নাম বা id দিতে পারো, এখন 'Student' রাখা হয়েছে
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Student", 105, 75, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(
      `For successfully completing the examination`,
      105,
      90,
      { align: "center" }
    );

    doc.setFontSize(16);
    doc.text(`Certified Level: ${certifiedLevel}`, 105, 110, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 130, { align: "center" });

    doc.save("certificate.pdf");
  };

  const handleSubmit = useCallback(() => {
    if (!examId) return;

    const filteredAnswers = answers.filter(
      (a): a is { questionId: string; optionId: number } => a.optionId !== null
    );

    submitExam({ examId, answers: filteredAnswers })
      .unwrap()
      .then((res) => {
        alert(`Result: ${res.result}\nCertified Level: ${res.certifiedLevel}`);

        const perc = res.percentage;
        let nextStep = step;
        const certifiedLevel = res.certifiedLevel;

        if (step === 1) {
          if (perc >= 75) nextStep = 2;
        } else if (step === 2) {
          if (perc >= 75) nextStep = 3;
        } else if (step === 3) {
          nextStep = 3;
        }

        dispatch(setStep(nextStep));
        dispatch(clearExam());
        onFinish(certifiedLevel);

        // সার্টিফিকেট PDF ডাউনলোড শুরু করো
        generateCertificatePDF(certifiedLevel);
      })
      .catch(() => alert('Submit failed'));
  }, [answers, examId, step, submitExam, dispatch, onFinish]);

  const handleOptionSelect = (questionId: string, optionId: number) => {
    dispatch(setAnswer({ questionId, optionId }));
  };

  if (isLoading || questions.length === 0) return <p>Loading questions...</p>;

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
        {questions.map((q, idx) => (
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
                    checked={
                      answers.find((a) => a.questionId === q.id)?.optionId ===
                      opt.id
                    }
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
