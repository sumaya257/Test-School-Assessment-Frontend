import React, { useState } from 'react';
import ExamStart from '../features/exams/ExamStart';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';


interface StepInfo {
  title: string;
  description: string;
}

const stepsInfo: Record<number, StepInfo> = {
  1: { title: 'Step 1 - Levels A1 & A2', description: 'Test your foundational skills.' },
  2: { title: 'Step 2 - Levels B1 & B2', description: 'Intermediate skill assessment.' },
  3: { title: 'Step 3 - Levels C1 & C2', description: 'Advanced skill assessment.' },
};

type StudentDashboardProps = object

const StudentDashboard: React.FC<StudentDashboardProps> = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [certifiedLevel, setCertifiedLevel] = useState<string | null>(null);

  const handleFinish = (level: string) => {
    setCertifiedLevel(level);

    if (currentStep === 1 && (level === 'A2' || level === 'A2+')) {
      setCurrentStep(2);
    } else if (currentStep === 2 && (level === 'B2' || level === 'B2+')) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      alert(`Congratulations! Your certification level: ${level}`);
    } else {
      if (level === 'none' || level.toLowerCase() === 'failed') {
        alert('You did not pass this step. Retake not allowed.');
      } else {
        alert(`Your current certification level: ${level}`);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar on top */}
      <Navbar />

      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 border-r border-gray-300">
          <h2 className="text-2xl font-semibold mb-6">Student Dashboard</h2>
          <nav>
            {Object.entries(stepsInfo).map(([stepNum, info]) => (
              <button
                key={stepNum}
                onClick={() => setCurrentStep(Number(stepNum))}
                disabled={Number(stepNum) > currentStep}
                className={`block w-full text-left px-4 py-2 mb-2 rounded ${
                  Number(stepNum) === currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-indigo-200 text-gray-700'
                } ${Number(stepNum) > currentStep ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {info.title}
              </button>
            ))}
          </nav>
          {certifiedLevel && (
            <div className="mt-10 p-4 bg-green-100 text-green-800 rounded">
              <p>
                Certified Level: <strong>{certifiedLevel}</strong>
              </p>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">{stepsInfo[currentStep].title}</h1>
          <p className="mb-6">{stepsInfo[currentStep].description}</p>

          {/* Assuming ExamStart props */}
          <ExamStart step={currentStep} onFinish={handleFinish} />
        </main>
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default StudentDashboard;
