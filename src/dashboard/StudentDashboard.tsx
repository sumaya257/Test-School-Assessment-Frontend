import React, { useState } from 'react';
import ExamStart from '../features/exams/ExamStart';


type CertificationLevel = 'None' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

const StudentDashboard = () => {
  // বর্তমান ধাপ ও highest certified level state রাখা হবে
  const [step, setStep] = useState(1);
  const [certLevel, setCertLevel] = useState<CertificationLevel>('None');
  const [failedStep1, setFailedStep1] = useState(false);

  // এই ফাংশনে exam result এর উপর condition অনুযায়ী update করবে
  const handleFinish = (scorePercentage: number) => {
    if (step === 1) {
      if (scorePercentage < 25) {
        setFailedStep1(true);
        alert('Step 1 Fail - Retake not allowed');
        return;
      }
      if (scorePercentage < 50) setCertLevel('A1');
      else if (scorePercentage < 75) setCertLevel('A2');
      else {
        setCertLevel('A2');
        setStep(2); // Step 2 তে যাওয়া যাবে
      }
    } else if (step === 2) {
      if (scorePercentage < 25) {
        // Remain at A2
      } else if (scorePercentage < 50) setCertLevel('B1');
      else if (scorePercentage < 75) setCertLevel('B2');
      else {
        setCertLevel('B2');
        setStep(3); // Step 3 তে যাওয়া যাবে
      }
    } else if (step === 3) {
      if (scorePercentage < 25) {
        // Remain at B2
      } else if (scorePercentage < 50) setCertLevel('C1');
      else setCertLevel('C2');
    }
  };

  if (failedStep1) {
    return <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">You failed Step 1. Retake is not allowed.</h2>
    </div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl mb-6 font-semibold text-center">Student Dashboard</h1>
      <p className="mb-4 text-center">
        Your current certification level: <strong>{certLevel}</strong>
      </p>
      <p className="mb-6 text-center">
        Step {step} Test: {step === 1 ? 'Levels A1 & A2' : step === 2 ? 'Levels B1 & B2' : 'Levels C1 & C2'}
      </p>

      <ExamStart
        step={step}
        onFinish={(certifiedLevel: string) => {
          // API থেকে আসা result structure একটু ভিন্ন হলে adjust করতে হবে
          // এখানে certifiedLevel না, আমরা score percentage expect করছি
          // তাই handleFinish এ score দিলে হবে
          // উদাহরণ: const scorePercentage = 60;
          const scorePercentage = parseFloat(certifiedLevel); // ধরছি certifiedLevel হিসেবে % আসছে
          handleFinish(scorePercentage);
        }}
      />
    </div>
  );
};

export default StudentDashboard;
