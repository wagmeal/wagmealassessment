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
  concerns: string;
  detail: string;
  solution: string;
  solutionTag: string;
  wagmealTip: string;
  deepLinkParams: string;
  themeColor?: string;
  image?: string;
  screenshots?: string[];
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
    concerns: '涙やけがなかなか治らない／体をかく・舐める／\n毛並みがパサつく',
    detail: '愛犬の涙やけ、皮膚のカサつきやカイカイ、どうしたらいいかずっと悩んでいませんか？病院へ行くほどではないけれど、いつもどこか気にかかるサインが「皮膚や被毛」に出やすいタイプです。毛並みがパサつきがちで、お気に入りの洋服も、肌への刺激が気になって選ぶのが難しい…。そんな繊細な個性を持っています。',
    solution: '愛犬が体をカキカキしていたり、涙やけが気になったりするのは、毎日の食事の成分が肌の負担になっている「デリケートな体質」のサインかもしれません。例えば、小麦やトウモロコシなどの一部の穀物や、合成着色料・人工保存料といった添加物は、消化の負担になりやすく避けた方が良いとされています。まずはこうした成分を控え、皮膚や被毛の健康をサポートする成分（オメガ3脂肪酸など）が含まれた良質なフードを選んで、体の内側からケアしてあげることが健やかな肌への第一歩です。\nまた、「牛肉や鶏肉、乳製品などの特定の原材料が入ったフードを食べた後に痒みがひどくなる」といったサインが見られる場合は、食物アレルギーの可能性も考えられます。気になる症状がある場合は獣医師に相談しつつ、愛犬の体に合わない食材を避ける工夫を取り入れてみましょう。',
    solutionTag: '体の内側から守る「クリーン」な食生活',
    wagmealTip: 'WAGMEALのフィルター機能を活用して、まずは愛犬の負担になりやすい「小麦」や「トウモロコシ」などの原材料を【含まない】設定にして探してみましょう。もし「特定のお肉が合わないかも？」と心当たりがある場合も、その食材（牛肉や鶏肉など）をピンポイントで除外して絞り込むことが可能です。\n気になるフードが見つかったら、詳細をチェックして「オメガ3脂肪酸」などの皮膚の健康をサポートする成分が入っているか確認してみるのもおすすめです。WAGMEALのデータを使って、愛犬の肌に一番優しいドッグフードをじっくり探してみてくださいね！',
    deepLinkParams: '?exclude=wheat,beef',
    themeColor: '#C4788A',
    image: '/type-delicate.png',
    screenshots: ['/ss-delicate-1.png', '/ss-delicate-2.png'],
  },
  stomach: {
    type: 'お腹よわよわタイプ',
    emoji: '🥺',
    concerns: '💩がゆるい／すぐお腹を壊す／フードを変えると不安定になる',
    detail: '「今日の💩、どうかな…」と、毎朝トイレを覗き込むのが日課になっていませんか？フードをほんの少し変えただけ、お散歩のコースが違っただけ、そんな些細な変化で、すぐに💩がゆるくなったりしてしまうガラスの胃腸の持ち主です。お腹が「ギュルギュル」鳴っていると、心配で目が離せなくなりますよね。',
    solution: 'お腹がゆるくなりやすい原因は、急なフードの切り替え、些細な環境の変化（ストレス）、特定の食材が体に合っていないなど様々です。中でも「脂質」は消化に時間がかかり、胃腸や膵臓に負担をかけやすいため、まずは「適度な低脂質」で消化吸収に優れたフードを選んであげることが、💩の安定への第一歩です。あわせて、腸内環境を整える乳酸菌やオリゴ糖などの成分を取り入れることもおすすめします。ただし、急に新しいフードに変えるのではなく、少しずつ切り替えてあげましょう。',
    solutionTag: '消化への負担を減らす「低脂質」と「腸内ケア」',
    wagmealTip: 'WAGMEALの成分値フィルターで、まずは【(粗)脂質】を10.0%〜12.0%程度に設定してドッグフードを探してみましょう。脂質は犬にとって欠かせない栄養素でもあるため、極端に減らしすぎると毛ヅヤの悪化などに繋がることがあります。そのため、自己判断でのケアとしては、この「マイルドな低脂質」から始めるのが安全で効果的です。WAGMEALなら、この微妙な数値をパーセンテージで正確に指定して、消化に配慮されたフードをリストアップできます。さらに、気になるフードが見つかったら、詳細を開いて「乳酸菌」や「オリゴ糖」などのお腹をサポートする成分が入っているかどうかもチェックしてみてください。愛犬のガラスの胃腸に優しい一皿をデータで見つけ、毎朝の不安を解消しましょう！\n💡 獣医師からの指示がある場合\nもしすでに動物病院で「脂質10%以下のものを」と指示を受けている場合も、WAGMEALの数値フィルターを使えば、条件にぴったりのフードを迷わず見つけることができます。',
    deepLinkParams: '?lipid_max=12.0',
    themeColor: '#C9A84C',
    image: '/type-stomach.png',
  },
  chubby: {
    type: 'ぽっちゃり注意タイプ',
    emoji: '🐷',
    concerns: '太りやすい／食欲旺盛／体重が増えてきた',
    detail: '抱っこした瞬間の「重み」に、つい「…また少し大きくなった？」と苦笑いしていませんか？ごはんもおやつも、お皿を置いた瞬間にダイブするほど大好き！気づけばくびれが迷子になり、上から見るとツチノコのようなフォルムに。お散歩中も、少し歩くとすぐに座り込んでしまう、愛すべき食いしん坊さんです。',
    solution: '太ってしまう原因はシンプルで、摂取カロリーが消費カロリーを上回っているからです。特に脂質はカロリー（1gあたり9kcal）が高いため、脂質の量をシビアにコントロールすることが減量への一番の近道です。\nしかし、カロリーを減らすために単にごはんの量を減らすだけでは、愛犬が常に空腹を感じてストレスになってしまいます。カロリーや脂質を抑えつつも、食物繊維などでしっかりと「満腹感」を得られるフードを選ぶことが、無理のない健康的なダイエットを長続きさせる秘訣です。',
    solutionTag: 'データ管理で叶える「低脂質」と「満腹感」の両立',
    wagmealTip: '「ダイエット用」という言葉を鵜呑みにするのではなく、WAGMEALでしっかり数値を指定して検索しましょう。\nまずはベースとして【代謝エネルギー】を330kcal/100g以下、【(粗)脂質】を8%前後に設定します。さらに、愛犬の腹持ちを良くするために【(粗)繊維】を少し高め（例：5.0%〜8.0%程度）に指定して絞り込むのもおすすめです。愛犬がひもじい思いをしない、本当に低カロリーで満足できるごはんをデータで特定し、ストレスのない体重管理を目指しましょう！',
    deepLinkParams: '?energy_max=330&lipid_max=8.0',
    themeColor: '#C47A3A',
    image: '/type-chubby.png',
  },
  gourmet: {
    type: 'グルメ王子タイプ',
    emoji: '👑',
    concerns: 'すぐ飽きる／食べムラがある／トッピング必須',
    detail: '「トッピングがないと食べない」そんな小さなわがままに、毎日降参していませんか？味や匂いに非常に敏感で、自分の好みがはっきりしている小さな貴族です。昨日は食べたのに今日は急にプイッ…。愛犬がごはんを残すたび、「何か病気？」と心配になり、結局また別のトッピングを探してしまう…。そんな飼い主さんを悩ませるタイプです。',
    solution: '犬は本来、毎日同じものを食べ続けるよりも、様々な匂いや味を楽しむことを好む傾向があります。特にこのタイプの愛犬は同じフードが続くと飽きてしまいがちなため、2〜3種類の異なるフードを定期的に切り替える「フードローテーション」が食欲維持の鍵となります。例えば、「鶏肉メイン」→「お魚メイン」→「鹿肉メイン」のように、ベースとなるタンパク源を計画的に変えていくことで、「今日は何かな？」という新鮮な喜びを与え続けながら、栄養の偏りも防ぐことができます。',
    solutionTag: '「フードローテーション」で叶える、飽きない食卓',
    wagmealTip: 'WAGMEALは、愛犬専用のローテーションメニューを作るのに最適なツールです。まずは原材料フィルターで、「魚」や「ラム肉」「鹿肉」など、普段食べていないタンパク源を【含む】設定にして、新しいお気に入り候補を探してみましょう。\nさらに、WAGMEALの「食べた記録」機能を活用すれば、「前はどのお肉の時に食いつきが良かったっけ？」と振り返るのも簡単です。愛犬の好みの傾向をデータでしっかり把握し、毎日のごはんタイムが待ち遠しくなる最強のローテーションを組み立てましょう！',
    deepLinkParams: '?exclude=chicken,beef&include=venison,fish',
    themeColor: '#8B1A2A',
    image: '/type-gourmet.png',
  },
  athlete: {
    type: 'わんぱくスポーツ犬タイプ',
    emoji: '🏃',
    concerns: '運動量が多く栄養が足りているか不安／痩せ気味',
    detail: 'お散歩から帰ってきたのに、まだおもちゃを加えて待っている…。そのスタミナ、分けて欲しくないですか？とにかく元気いっぱいで、エネルギー消費が激しいタイプ。家の中で家具を噛んだりしてエネルギーを爆発させてしまうことも。しっかり食べているのに、太らずに引き締まった体を維持している、まさにアスリートです。',
    solution: '活発に動くアスリート犬にとって、筋肉はエネルギー源であり、体を守る鎧です。筋肉を維持・増強するためには、植物性タンパク質ではなく、アミノ酸スコアの高い肉や魚由来の良質なタンパク質が不可欠です。運動量に見合う、高タンパク・高栄養なごはんが必要です。',
    solutionTag: '筋肉を維持する「良質なタンパク質」を厳選',
    wagmealTip: 'WAGMEALの成分フィルターで、【(粗)タンパク質】の下限を25%以上に設定。さらに原材料表示を確認することで、肉・魚主体の質の高いタンパク源を含むフードをデータで厳選し、健康的な体作りをサポートできます。',
    deepLinkParams: '?protein_min=28.0',
    themeColor: '#6AABBB',
    image: '/type-athlete.png',
  },
  balanced: {
    type: 'バランス優等生タイプ',
    emoji: '🌿',
    concerns: '特に問題はなく健康。でも、より愛犬が好むドッグフードを見つけたい。',
    detail: '病気知らずで💩も完璧。フードの好き嫌いも少なく、獣医さんからも「言うことなし！」とお墨付きをもらう、完璧な健康優良児です。あまりに手がかからなすぎて、逆に「今のフードが本当にベスト？もっと上を目指せるのでは？」と、密かに「完全上位互換」を探し続けてしまう…。そんな飼い主さんの「贅沢な悩み」を象徴するタイプです。',
    solution: '現状、体調が良いのであれば、今食べているフードの栄養バランスがその子にとっての「黄金比」です。無理にゴロっと変える必要はありませんが、長年まったく同じフードを食べ続けると、食物アレルギー蓄積のリスクや、万が一いつも買っているフードが欠品・リニューアルした際に「次何をあげればいいか分からない…」とパニックになってしまうことも。\n今の完璧な栄養バランス（数値）をキープしたまま、お腹を壊さずにローテーションできる「第2・第3のフード」を見つけておくことが、真の健康長寿とリスクヘッジに繋がります。',
    solutionTag: '「今の正解」をベースに、食事の選択肢（バックアップ）を広げておく',
    wagmealTip: '今の健康な状態を作っているフードこそが「大正解」のデータです！WAGMEALを使って、その正解をベースに「最強のストック」を探してみましょう。\nまずは、今食べているフードの【(粗)タンパク質】と【(粗)脂質】の数値をWAGMEALのフィルターに入力します。これが愛犬専用の「黄金比フィルター」です。\nその数値をキープしたまま、原材料フィルターでメインの食材を「鶏肉」から「魚」などに変えて検索してみてください。「今のフードが欠品しても安心な乗り換え先」や、「お腹の調子を崩さずに味変できる上質なフード」を、データに基づき確信を持って見つけることができます。',
    deepLinkParams: '?ash_max=8.0&fiber_min=3.0&fiber_max=5.0',
    themeColor: '#6A9A72',
    image: '/type-balanced.png',
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
      ReactGA.event({ category: '診断', action: dogType.type, label: '結果表示' });
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6">
        {/* ロゴ */}
        <div className="w-full flex flex-col items-center pt-16">
          <img src="/wagmeal-logo.png" alt="WAGMEAL" className="w-24" />
          <p className="text-xs font-bold text-wag tracking-widest uppercase mt-2">WAGMEAL 連動企画</p>
        </div>

        {/* メインコピー */}
        <div className="w-full max-w-sm px-4">

          {/* 女の子 ＋ 吹き出し（合成画像） */}
          <div className="flex justify-center">
            <img src="/girl-bubble.png" alt="考える女の子" className="w-full max-w-xs" />
          </div>

          {/* 診断紹介 */}
          <div className="text-center mt-2">
            <p className="text-lg font-bold text-stone-800 leading-snug mb-1">5問で愛犬のごはんタイプを診断。</p>
            <p className="text-stone-500 text-sm font-medium">あなたの愛犬にぴったりのごはんを知ろう！</p>
          </div>
        </div>

        {/* ボタン */}
        <div className="w-full max-w-sm pb-8">
          <button
            onClick={() => setScreen('quiz')}
            className="w-full bg-wag text-white py-5 rounded-2xl font-bold text-lg hover:bg-wag-dark transition-all shadow-lg flex items-center justify-center gap-2"
          >
            無料で診断スタート
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // LOADING SCREEN
  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-7xl animate-bounce">🐾</div>
        <div className="text-center">
          <p className="text-2xl font-bold text-stone-800 mb-1">
            愛犬のデータを分析中{loadingDots}
          </p>
          <p className="text-stone-400 text-sm">最適なごはんを探しています</p>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-wag rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-wag rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-wag rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (screen === 'result' && result) {
    const themeColor = result.themeColor ?? '#B8A490';
    const themeRgba = `${themeColor}22`;

    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto">
          <div className="rounded-3xl shadow-xl overflow-hidden">

            {/* ── テーマカラーヘッダー ── */}
            <div className="pt-8 pb-6 px-6 text-center" style={{ backgroundColor: themeColor }}>
              <p className="text-xs font-bold text-white/60 tracking-widest uppercase mb-1">診断結果</p>
              <p className="text-white/80 text-sm">あなたの愛犬のタイプは…</p>
            </div>

            {/* ── 白背景コンテンツ ── */}
            <div className="bg-white px-6 pb-8 pt-6">

              {/* タイプ名 */}
              <div className="text-center mb-4">
                <p className="text-xl font-bold text-stone-800">
                  {result.emoji} {result.type}
                </p>
                <div className="mt-2 h-0.5 w-10 mx-auto rounded-full" style={{ backgroundColor: themeColor }} />
              </div>

              {/* 画像 */}
              {result.image ? (
                <img src={result.image} alt={result.type} className="w-44 h-44 object-contain mx-auto mb-5" />
              ) : (
                <div className="text-7xl text-center mb-5">{result.emoji}</div>
              )}

              {/* よくある悩み */}
              <div className="mb-4">
                <p className="text-xs font-bold text-stone-400 mb-1">■ よくある悩み</p>
                <p className="text-stone-600 text-sm whitespace-pre-line">{result.concerns}</p>
              </div>

              {/* 詳細 */}
              <div className="mb-4">
                <p className="text-xs font-bold text-stone-400 mb-1">■ 詳細</p>
                <p className="text-stone-600 text-sm leading-relaxed">{result.detail}</p>
              </div>

              {/* 解決方法 */}
              <div className="mb-5">
                <p className="text-xs font-bold text-stone-400 mb-1">■ 解決方法</p>
                <p className="text-sm font-bold mb-2" style={{ color: themeColor }}>{result.solutionTag}</p>
                <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">{result.solution}</p>
              </div>

              {/* WAGMEALとは */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-4">
                <p className="text-sm font-bold text-wag mb-2">うちの子に本当に合うフードが<br />見つかる無料アプリ「WAGMEAL」</p>
                <p className="text-stone-600 text-sm leading-relaxed mb-3">800種類以上のドッグフードを成分値・原材料で絞り込めるアプリです。フードの評価や食べた記録をつけてあとから振り返ったり、みんなが高く評価したフードをランキング形式で確認でき、あなたの愛犬に最適なドッグフード選びが可能になります。</p>
                <p className="text-xs font-semibold text-stone-500">愛犬のタイプが分かった今、WAGMEALで最適なフードをデータで探してみましょう👇</p>
              </div>

              {/* WAGMEAL活用術 */}
              <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: `${themeColor}15` }}>
                <p className="text-xs font-bold mb-2" style={{ color: themeColor }}>🔍 {result.type}の活用術</p>
                <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">{result.wagmealTip}</p>
              </div>

              {/* アプリスクリーンショット */}
              {result.screenshots && result.screenshots.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {result.screenshots.map((src, i) => (
                    <img key={i} src={src} alt={`アプリ画面 ${i + 1}`} className="w-full rounded-xl shadow-sm border border-stone-100" />
                  ))}
                </div>
              )}

              {/* アプリ起動ボタン */}
              <a
                href="https://apps.apple.com/jp/app/wagmeal/id6756182934"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-white py-4 rounded-2xl font-bold text-base transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2 mb-3"
                style={{ backgroundColor: themeColor }}
              >
                WAGMEALで今すぐ検索
                <ChevronRight className="w-5 h-5" />
              </a>

              <button
                onClick={handleReset}
                className="w-full text-stone-400 hover:text-stone-600 py-2 font-medium transition-colors text-sm"
              >
                もう一度診断する
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ヘッダー：進捗 */}
      <div className="px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-stone-400 text-sm font-semibold">Q{currentStep + 1} / {QUESTIONS.length}</p>
          {currentStep > 0 && (
            <button
              onClick={() => { setCurrentStep(currentStep - 1); setSelectedAnswer(''); }}
              className="text-stone-400 hover:text-stone-600 flex items-center gap-1 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              もどる
            </button>
          )}
        </div>
        {/* プログレスバー */}
        <div className="h-1.5 bg-stone-200 rounded-full">
          <div
            className="h-full bg-wag rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 質問カード */}
      <div className="flex-1 px-4 pb-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-full flex flex-col">
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-stone-800 mb-6 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 flex-1">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all group ${
                      isSelected
                        ? 'border-wag bg-wag-subtle shadow-md'
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
              className="w-full mt-6 bg-wag text-white py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-wag-dark shadow-md"
            >
              次へ
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
