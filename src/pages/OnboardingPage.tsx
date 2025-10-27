// Onboarding画面
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const completeOnboarding = useStore(state => state.completeOnboarding);

  const slides = [
    {
      emoji: '👋',
      title: 'ようこそ！',
      description: 'ほめみがき Liteは、あなたの歯みがき習慣をサポートするアプリです。',
    },
    {
      emoji: '👩‍⚕️',
      title: 'スーパー衛生士がサポート',
      description: '毎回の歯みがきを記録すると、専属の衛生士アバターがほめて、アドバイスします。',
    },
    {
      emoji: '📊',
      title: '続けることが大切',
      description: '完璧でなくても大丈夫。少しずつ、あなたのペースで続けていきましょう！',
    },
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center">
          <div className="text-6xl mb-6">{slides[step].emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {slides[step].title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {slides[step].description}
          </p>

          {/* インジケーター */}
          <div className="flex justify-center space-x-2 mb-8">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          >
            {step < slides.length - 1 ? '次へ' : 'はじめる'}
          </button>
        </div>
      </div>
    </div>
  );
};
