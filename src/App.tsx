import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReactGA from 'react-ga4';

interface QuizAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

interface DogType {
  type: string;
  emoji: string;
  description: string;
  recipe: string;
  deepLinkParams: string;
}

type Screen = 'top' | 'quiz' | 'loading' | 'result';

const QUESTIONS = [
  {
    id: 'q1',
    question: 'お皿を置いた瞬間の「初速」は？',
    options: [
      { value: 'A', label: '🚀 ダイブ！', sub: '10秒で完食する掃除機スタイル' },
      { value: 'B', label: '🧐 クンクン…', sub: 'まずは検品。納得してから食べる派' },
      { value: 'C', label: '💨 スルー。', sub: '気が向かないと放置する自由人' },
    ],
  },
  {
    id: 'q2',
    question: 'ぶっちゃけ、毎朝の💩の「安定感」は？',
    options: [
      { value: 'A', label: '✨ 常にパーフェクト！', sub: '拾いやすい黄金の💩' },
      { value: 'B', label: '💧 フードが変わると揺らぐ。', sub: 'ちょっと繊細なタイプ' },
      { value: 'C', label: '🌀 正直、お腹が弱くて悩んでる。', sub: '飼い主も毎日ヒヤヒヤ' },
    ],
  },
  {
    id: 'q3',
    question: '目元や肌に「気になるサイン」はある？',
    options: [
      { value: 'A', label: '✨ ピカピカ！', sub: '特に悩みなし' },
      { value: 'B', label: '💧 涙やけ。', sub: 'こまめなケアが欠かせない' },
      { value: 'C', label: '🐾 カサカサ・カイカイ。', sub: '肌がデリケートなサイン' },
    ],
  },
  {
    id: 'q4',
    question: '最近、愛犬を抱っこした時の「重み」や「体型」ってどう？',
    options: [
      { value: 'A', label: '🍖 ムチッとしてきた…。', sub: 'そろそろダイエットが必要かも' },
      { value: 'B', label: '🪶 むしろ細身。', sub: 'もっとしっかり食べてお肉をつけてほしい' },
      { value: 'C', label: '⚖️ 理想的！', sub: 'くびれもバッチリ維持してる' },
    ],
  },
  {
    id: 'q5',
    question: '愛犬の今の「わんぱく度」を例えると？',
    options: [
      { value: 'A', label: '🌱 好奇心の塊！', sub: '1歳未満のパピー' },
      { value: 'B', label: '🏃 無尽蔵の体力！', sub: 'ドッグラン大好きなアスリート' },
      { value: 'C', label: '☕ お家が一番。', sub: 'まったり過ごすのが好きなおっとり派' },
    ],
  },
];

const DOG_TYPES: Record<string, DogType> = {
  delicate: {
    type: 'デリケート美肌タイプ',
    emoji: '✨',
    description: '見落としがちな隠れアレルギーかも？皮膚と被毛を内側から守るクリーンなごはんが必要です。',
    recipe:
      "見落としがちな隠れアレルギーかも？アレルゲンになりやすい『小麦』や『牛肉』などをすべて【含まない】に切り替えて、皮膚と被毛を内側から守るクリーンなごはんを探そう！",
    deepLinkParams: '?exclude=wheat,beef',
  },
  stomach: {
    type: 'お腹よわよわタイプ',
    emoji: '🥺',
    description: 'お腹の不調は脂質の高すぎが原因かも。消化に優しいフードを見つけてあげましょう。',
    recipe:
      'お腹の不調は脂質の高すぎが原因かも。消化に優しいフードを探すため、【(粗)脂質】の上限を10.0%〜12.0%など低めにセット！',
    deepLinkParams: '?lipid_max=12.0',
  },
  chubby: {
    type: 'ぽっちゃり注意タイプ',
    emoji: '🐷',
    description: '「ダイエット用」の言葉にごまかされないで！数値をシビアに設定して一発検索しましょう。',
    recipe:
      "『ダイエット用』の言葉にごまかされないで！【代謝エネルギー】を『330kcal以下』、【(粗)脂質】を『8%以下』など、シビアに数値を設定して一発検索！",
    deepLinkParams: '?energy_max=330&lipid_max=8.0',
  },
  gourmet: {
    type: 'グルメ王子タイプ',
    emoji: '👑',
    description: 'いつものお肉に飽きているのかも？新しい食材で新鮮なリアクションを引き出しましょう。',
    recipe:
      "いつものお肉に飽きているのかも？今のお肉を【含まない】に、食べたことのない『鹿肉』や『魚』を【含む】にして、新鮮なリアクションを引き出そう！",
    deepLinkParams: '?exclude=chicken,beef&include=venison,fish',
  },
  athlete: {
    type: 'スポーツ犬タイプ',
    emoji: '🏃',
    description: '引き締まった体には良質なお肉が必須！運動量に負けないフードが見つかります。',
    recipe:
      "引き締まった体には良質なお肉が必須！【(粗)タンパク質】の下限を『28.0%以上』に設定してみて！運動量に負けないフードが見つかります。",
    deepLinkParams: '?protein_min=28.0',
  },
  balanced: {
    type: 'バランス優等生タイプ',
    emoji: '🌿',
    description: '今のフードからさらに品質を上げるなら、完璧な💩を目指す完全上位互換探しに挑戦しましょう！',
    recipe:
      "今のフードからさらに品質を上げるなら！品質のバロメーターである【(粗)灰分】の上限を『8%以下』に絞ったり、【(粗)繊維】を『3〜5%』に設定して、完璧な💩を目指す完全上位互換探しに挑戦しよう！",
    deepLinkParams: '?ash_max=8.0&fiber_min=3.0&fiber_max=5.0',
  },
};

function calculateDogType(answers: QuizAnswers): DogType {
  // 1位: Q3でB or C → デリケート美肌
  if (answers.q3 === 'B' || answers.q3 === 'C') return DOG_TYPES.delicate;
  // 2位: Q2でB or C → お腹よわよわ
  if (answers.q2 === 'B' || answers.q2 === 'C') return DOG_TYPES.stomach;
  // 3位: Q4でA → ぽっちゃり注意
  if (answers.q4 === 'A') return DOG_TYPES.chubby;
  // 4位: Q1でB or C → グルメ王子
  if (answers.q1 === 'B' || answers.q1 === 'C') return DOG_TYPES.gourmet;
  // 5位: Q5でB → スポーツ犬
  if (answers.q5 === 'B') return DOG_TYPES.athlete;
  // 6位: デフォルト → バランス優等生
  return DOG_TYPES.balanced;
}

function App() {
  const [screen, setScreen] = useState<Screen>('top');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({ q1: '', q2: '', q3: '', q4: '', q5: '' });
  const [result, setResult] = useState<DogType | null>(null);
  const [loadingDots, setLoadingDots] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // GA4: 画面遷移トラッキング
  useEffect(() => {
    const pageTitles: Record<Screen, string> = {
      top: 'トップ',
      quiz: `質問 ${currentStep + 1}`,
      loading: 'ローディング',
      result: '診断結果',
    };
    ReactGA.send({
      hitType: 'pageview',
      page: screen === 'quiz' ? `/quiz/${currentStep + 1}` : `/${screen}`,
      title: pageTitles[screen],
    });
  }, [screen, currentStep]);

  useEffect(() => {
    if (screen !== 'loading') return;

    const dotInterval = setInterval(() => {
      setLoadingDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(dotInterval);
      const dogType = calculateDogType(answers);
      setResult(dogType);
      setScreen('result');
      ReactGA.event({ category: '診断', action: '結果表示', label: dogType.type });
    }, 2500);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };
  }, [screen, answers]);

  const handleSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;
    const questionId = QUESTIONS[currentStep].id as keyof QuizAnswers;
    const newAnswers = { ...answers, [questionId]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer('');

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setScreen('loading');
    }
  };

  const handleReset = () => {
    setScreen('top');
    setCurrentStep(0);
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '' });
    setResult(null);
    setLoadingDots('');
    setSelectedAnswer('');
  };

  // TOP SCREEN
  if (screen === 'top') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="max-w-xl w-full text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <img src="/wagmeal-logo.png" alt="WAGMEAL" className="w-40 mx-auto mb-6" />
            <p className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4">WAGMEAL 連動企画</p>
            <h1 className="text-xl md:text-2xl font-bold text-stone-800 mb-4 leading-snug">
              ランキング上位のあのフード。<br />
              <span className="text-stone-600">「うちの子に合う脂質とタンパク質の割合」</span>
              か、即答できますか？
            </h1>
            <p className="text-stone-400 text-sm md:text-base mb-8 leading-relaxed">
              みんなの高評価に、「うちの子のデータ」をプラスしよう。<br />
              5問でわかる愛犬のごはん性格診断🔍
            </p>
            <button
              onClick={() => setScreen('quiz')}
              className="w-full bg-wag text-white py-5 rounded-2xl font-bold text-lg hover:bg-wag-dark transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              無料で診断スタート
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOADING SCREEN
  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">🐾</div>
          <p className="text-2xl font-bold text-stone-700 mb-2">
            愛犬のデータを分析中{loadingDots}
          </p>
          <p className="text-stone-400 text-sm">最適なごはんを探しています</p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 bg-wag rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-wag rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-wag rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (screen === 'result' && result) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{result.emoji}</div>
              <p className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-3">診断結果</p>
              <div className="bg-wag text-white py-3 px-6 rounded-2xl inline-block mb-4">
                <p className="text-lg md:text-xl font-bold">うちの子は「{result.type}」</p>
              </div>
              <p className="text-stone-500 text-sm leading-relaxed">{result.description}</p>
            </div>

            {/* WAGMEAL検索レシピカード */}
            <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-5 mb-6">
              <p className="text-xs font-bold text-wag mb-2">🔍 WAGMEAL 検索レシピ</p>
              <p className="text-stone-600 text-sm leading-relaxed">{result.recipe}</p>
            </div>

            {/* アプリ起動ボタン */}
            <a
              href="https://apps.apple.com/jp/app/wagmeal/id6756182934"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-wag text-white py-5 rounded-2xl font-bold text-lg hover:bg-wag-dark transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mb-4"
            >
              WAGMEALで今すぐ検索
              <ChevronRight className="w-5 h-5" />
            </a>

            <button
              onClick={handleReset}
              className="w-full text-stone-400 hover:text-stone-600 py-3 font-medium transition-colors text-sm"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-2 bg-stone-100">
            <div
              className="h-full bg-wag transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            <p className="text-sm text-stone-400 font-semibold mb-2">
              Q{currentStep + 1} / {QUESTIONS.length}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all transform hover:scale-[1.02] hover:shadow-md group ${
                      isSelected
                        ? 'border-wag bg-wag-subtle scale-[1.02] shadow-md'
                        : 'border-stone-200 hover:border-wag-light hover:bg-wag-subtle'
                    }`}
                  >
                    <span className={`text-base font-semibold block ${isSelected ? 'text-wag-dark' : 'text-stone-800 group-hover:text-wag-dark'}`}>
                      {option.label}
                    </span>
                    <span className={`text-sm ${isSelected ? 'text-wag' : 'text-stone-400 group-hover:text-wag'}`}>
                      {option.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="w-full mt-6 bg-wag text-white py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-wag-dark enabled:hover:scale-105 shadow-lg"
            >
              次へ
              <ChevronRight className="w-5 h-5" />
            </button>

            {currentStep > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => { setCurrentStep(currentStep - 1); setSelectedAnswer(''); }}
                  className="text-stone-400 hover:text-stone-600 font-medium flex items-center gap-1 transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
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
