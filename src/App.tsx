import { useState } from 'react';
import { Heart, ChevronRight, ChevronLeft } from 'lucide-react';

interface QuizAnswers {
  age: string;
  size: string;
  activity: string;
  allergy: string;
  foodPreference: string;
}

interface DogType {
  type: string;
  description: string;
  emoji: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    age: '',
    size: '',
    activity: '',
    allergy: '',
    foodPreference: ''
  });
  const [result, setResult] = useState<DogType | null>(null);

  const questions = [
    {
      id: 'age',
      question: '愛犬の年齢は？',
      options: [
        { value: 'puppy', label: '子犬（0-1歳）' },
        { value: 'young', label: '若犬（1-3歳）' },
        { value: 'adult', label: '成犬（3-7歳）' },
        { value: 'senior', label: 'シニア（7歳以上）' }
      ]
    },
    {
      id: 'size',
      question: '愛犬のサイズは？',
      options: [
        { value: 'small', label: '小型犬（～10kg）' },
        { value: 'medium', label: '中型犬（10-25kg）' },
        { value: 'large', label: '大型犬（25kg～）' }
      ]
    },
    {
      id: 'activity',
      question: '愛犬の活動量は？',
      options: [
        { value: 'very-high', label: 'とても高い（常に動き回る）' },
        { value: 'high', label: '高い（活発に動く）' },
        { value: 'moderate', label: '普通（適度に動く）' },
        { value: 'low', label: '低い（おとなしい）' }
      ]
    },
    {
      id: 'allergy',
      question: 'アレルギーはありますか？',
      options: [
        { value: 'yes', label: 'ある' },
        { value: 'no', label: 'ない' },
        { value: 'unknown', label: 'わからない' }
      ]
    },
    {
      id: 'foodPreference',
      question: '食の好みは？',
      options: [
        { value: 'picky', label: '好き嫌いが多い' },
        { value: 'normal', label: '普通' },
        { value: 'anything', label: '何でも食べる' }
      ]
    }
  ];

  const calculateDogType = (answers: QuizAnswers): DogType => {
    if (answers.age === 'senior' && answers.activity === 'low') {
      return {
        type: '穏やかシニアタイプ',
        description: '落ち着いた性格で、ゆったりとした時間を好む愛犬です。栄養バランスの取れた消化に優しい食事がおすすめです。',
        emoji: '🌸'
      };
    }

    if ((answers.age === 'puppy' || answers.age === 'young') && (answers.activity === 'very-high' || answers.activity === 'high')) {
      return {
        type: '元気旺盛タイプ',
        description: 'エネルギーに満ち溢れ、遊ぶことが大好きな活発な愛犬です。高タンパク質で栄養豊富な食事が必要です。',
        emoji: '⚡'
      };
    }

    if (answers.size === 'small' && answers.activity === 'high') {
      return {
        type: '小柄で活発タイプ',
        description: '小さな体で元気いっぱい！好奇心旺盛で、いつも動き回っています。小粒で栄養価の高いフードがぴったりです。',
        emoji: '🎾'
      };
    }

    if (answers.size === 'large' && (answers.activity === 'low' || answers.activity === 'moderate')) {
      return {
        type: '大型のんびりタイプ',
        description: '大きな体でゆったりとした性格。穏やかで優しい愛犬です。関節ケアを考慮した食事がおすすめです。',
        emoji: '🐻'
      };
    }

    if (answers.allergy === 'yes') {
      return {
        type: '健康志向タイプ',
        description: 'アレルギーがあるため、食事に配慮が必要です。低アレルゲンで安心安全な原材料を使った食事を選びましょう。',
        emoji: '💚'
      };
    }

    if (answers.foodPreference === 'picky') {
      return {
        type: 'グルメタイプ',
        description: '食べ物の好みがはっきりしている美食家。嗜好性が高く、美味しいと感じるフードを選ぶことが大切です。',
        emoji: '👑'
      };
    }

    if (answers.activity === 'moderate' && answers.foodPreference === 'anything') {
      return {
        type: 'バランス優等生タイプ',
        description: '活動量も食欲もバランスが良く、健康的な愛犬です。バランスの取れた総合栄養食がおすすめです。',
        emoji: '⭐'
      };
    }

    return {
      type: '健やかライフタイプ',
      description: '毎日を楽しく元気に過ごす愛犬です。愛犬の個性に合わせた、栄養バランスの良い食事を続けましょう。',
      emoji: '🌟'
    };
  };

  const handleAnswer = (value: string) => {
    const question = questions[currentStep];
    setAnswers({ ...answers, [question.id]: value });

    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      const newAnswers = { ...answers, [question.id]: value };
      const dogType = calculateDogType(newAnswers);
      setTimeout(() => {
        setResult(dogType);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({
      age: '',
      size: '',
      activity: '',
      allergy: '',
      foodPreference: ''
    });
    setResult(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform animate-fadeIn">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">{result.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                診断結果
              </h2>
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white py-4 px-6 rounded-2xl inline-block mb-6">
                <p className="text-2xl md:text-3xl font-bold">{result.type}</p>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {result.description}
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                もう一度診断する
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {currentStep === 0 && (
          <div className="text-center mb-8 animate-fadeIn">
            <Heart className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              愛犬タイプ診断
            </h1>
            <p className="text-gray-600 text-lg">
              5つの質問に答えて、あなたの愛犬のタイプを診断しましょう
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-8">
              <p className="text-sm text-orange-500 font-semibold mb-2">
                質問 {currentStep + 1} / {questions.length}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all transform hover:scale-[1.02] hover:shadow-md group"
                  >
                    <span className="text-lg text-gray-700 group-hover:text-orange-600 font-medium">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {currentStep > 0 && (
              <div className="flex justify-start mt-6">
                <button
                  onClick={handlePrevious}
                  className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  前の質問に戻る
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
