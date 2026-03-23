import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw, ChevronLeft, Star, BarChart2 } from 'lucide-react';
import { CATEGORIES, QUESTIONS, getRandomQuestions, Question } from '@/data/questions';
import { toArabicNumeral } from '@/lib/quran-api';

const QUESTIONS_PER_SESSION = 10;

// إحصائيات محفوظة
interface Stats {
  totalCorrect: number;
  totalWrong: number;
  totalPlayed: number;
  byCategory: Record<string, { correct: number; wrong: number }>;
  streak: number;
  lastPlayedDate: string;
}

function loadStats(): Stats {
  try {
    const s = localStorage.getItem('tagweed-quiz-stats');
    return s ? JSON.parse(s) : {
      totalCorrect: 0, totalWrong: 0, totalPlayed: 0,
      byCategory: {}, streak: 0, lastPlayedDate: ''
    };
  } catch { return { totalCorrect: 0, totalWrong: 0, totalPlayed: 0, byCategory: {}, streak: 0, lastPlayedDate: '' }; }
}

function saveStats(stats: Stats) {
  localStorage.setItem('tagweed-quiz-stats', JSON.stringify(stats));
}

type Phase = 'home' | 'quiz' | 'result';

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Stats>(loadStats);

  const startQuiz = (categoryId: string | null) => {
    const qs = categoryId
      ? getRandomQuestions(categoryId, QUESTIONS_PER_SESSION)
      : [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SESSION);

    setQuestions(qs);
    setSelectedCategory(categoryId);
    setCurrentIndex(0);
    setChosen(null);
    setCorrect(0);
    setWrong(0);
    setPhase('quiz');
  };

  const handleAnswer = (answer: string) => {
    if (chosen) return;
    setChosen(answer);
    const isCorrect = answer === questions[currentIndex].correct;
    if (isCorrect) setCorrect(c => c + 1);
    else setWrong(w => w + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // احفظ الإحصائيات
      const today = new Date().toDateString();
      const newStats = { ...stats };
      newStats.totalCorrect += correct + (chosen === questions[currentIndex].correct ? 1 : 0);
      newStats.totalWrong += wrong + (chosen !== questions[currentIndex].correct ? 1 : 0);
      newStats.totalPlayed += questions.length;
      if (newStats.lastPlayedDate !== today) {
        newStats.streak = newStats.lastPlayedDate === new Date(Date.now() - 86400000).toDateString()
          ? newStats.streak + 1 : 1;
        newStats.lastPlayedDate = today;
      }
      saveStats(newStats);
      setStats(newStats);
      setPhase('result');
    } else {
      setCurrentIndex(i => i + 1);
      setChosen(null);
    }
  };

  const q = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex) / questions.length) * 100 : 0;
  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  // ---- شاشة الإحصائيات ----
  if (showStats) {
    const accuracy = stats.totalPlayed > 0
      ? Math.round((stats.totalCorrect / stats.totalPlayed) * 100) : 0;

    return (
      <div className="min-h-screen pb-20" dir="rtl">
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-card/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
            <button onClick={() => setShowStats(false)} className="text-primary">
              <ArrowRight className="h-5 w-5" />
            </button>
            <h1 className="font-ui text-lg font-bold">إحصائياتي</h1>
          </div>
        </header>
        <div className="mx-auto max-w-md px-4 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'إجمالي الأسئلة', value: stats.totalPlayed, color: 'text-primary' },
              { label: 'إجابات صحيحة', value: stats.totalCorrect, color: 'text-green-500' },
              { label: 'إجابات خاطئة', value: stats.totalWrong, color: 'text-red-500' },
              { label: 'نسبة الدقة', value: `${toArabicNumeral(accuracy)}%`, color: 'text-primary' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-primary/15 bg-card p-4 text-center">
                <p className={`font-ui text-2xl font-bold ${item.color}`}>{typeof item.value === 'number' ? toArabicNumeral(item.value) : item.value}</p>
                <p className="font-ui text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-primary/15 bg-card p-4 text-center">
            <p className="font-ui text-3xl font-bold text-amber-500">🔥 {toArabicNumeral(stats.streak)}</p>
            <p className="font-ui text-sm text-muted-foreground">أيام متتالية</p>
          </div>
          <button onClick={() => { saveStats({ totalCorrect: 0, totalWrong: 0, totalPlayed: 0, byCategory: {}, streak: 0, lastPlayedDate: '' }); setStats(loadStats()); }}
            className="w-full rounded-xl border border-destructive/20 py-2 font-ui text-sm text-destructive hover:bg-destructive/10 transition-colors">
            إعادة تعيين الإحصائيات
          </button>
        </div>
      </div>
    );
  }

  // ---- الشاشة الرئيسية ----
  if (phase === 'home') {
    return (
      <div className="min-h-screen pb-20" dir="rtl">
        <header className="sticky top-0 z-50 border-b border-primary/20 bg-card/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-primary hover:scale-105 transition-transform">
                <ArrowRight className="h-5 w-5" />
              </Link>
              <h1 className="font-ui text-lg font-bold">الأسئلة الدينية</h1>
            </div>
            <button onClick={() => setShowStats(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-ui text-xs text-primary hover:bg-primary/10 transition-colors">
              <BarChart2 className="h-4 w-4" />
              إحصائياتي
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
          {/* زر الكل */}
          <button onClick={() => startQuiz(null)}
            className="w-full rounded-2xl bg-primary p-5 text-primary-foreground flex items-center justify-between hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md">
            <div className="text-right">
              <p className="font-ui text-lg font-bold">جميع الفئات</p>
              <p className="font-ui text-sm opacity-80">{toArabicNumeral(QUESTIONS.length)} سؤال</p>
            </div>
            <div className="text-3xl">🌟</div>
          </button>

          {/* الفئات */}
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const count = QUESTIONS.filter(q => q.category === cat.id).length;
              return (
                <button key={cat.id} onClick={() => startQuiz(cat.id)}
                  className="rounded-2xl border border-primary/15 bg-card p-4 text-right hover:border-primary/30 hover:bg-primary/5 active:scale-[0.97] transition-all">
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <p className="font-ui text-sm font-bold">{cat.name}</p>
                  <p className="font-ui text-xs text-muted-foreground">{toArabicNumeral(count)} سؤال</p>
                </button>
              );
            })}
          </div>

          {/* الإحصائيات السريعة */}
          {stats.totalPlayed > 0 && (
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 flex items-center justify-between">
              <div>
                <p className="font-ui text-sm font-bold text-primary">أداؤك حتى الآن</p>
                <p className="font-ui text-xs text-muted-foreground">
                  {toArabicNumeral(stats.totalCorrect)} صح من {toArabicNumeral(stats.totalPlayed)} سؤال
                </p>
              </div>
              <div className="text-right">
                <p className="font-ui text-2xl font-bold text-primary">
                  {toArabicNumeral(Math.round((stats.totalCorrect / stats.totalPlayed) * 100))}%
                </p>
                {stats.streak > 0 && (
                  <p className="font-ui text-xs text-amber-500">🔥 {toArabicNumeral(stats.streak)} يوم</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- شاشة الاختبار ----
  if (phase === 'quiz' && q) {
    const catName = CATEGORIES.find(c => c.id === q.category)?.name ?? '';
    const isCorrect = chosen === q.correct;

    return (
      <div className="min-h-screen flex flex-col pb-6" dir="rtl">
        <header className="flex-shrink-0 border-b border-primary/20 bg-card/95 backdrop-blur-sm px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setPhase('home')} className="text-primary">
                <ArrowRight className="h-5 w-5" />
              </button>
              <span className="font-ui text-xs text-muted-foreground">{catName}</span>
              <div className="flex items-center gap-2 font-ui text-xs">
                <span className="text-green-500 font-bold">{toArabicNumeral(correct)}✓</span>
                <span className="text-red-500 font-bold">{toArabicNumeral(wrong)}✗</span>
                <span className="text-muted-foreground">{toArabicNumeral(currentIndex + 1)}/{toArabicNumeral(questions.length)}</span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        <div className="flex-1 mx-auto w-full max-w-2xl px-4 py-5 flex flex-col gap-4">
          {/* السؤال */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-5">
            <p className="font-ui text-base font-bold text-foreground leading-relaxed text-right">
              {q.question}
            </p>
          </div>

          {/* الخيارات */}
          <div className="space-y-2.5">
            {q.options?.map((option) => {
              const isChosen = chosen === option;
              const isCorrectOpt = option === q.correct;
              let style = 'border-primary/15 bg-card hover:bg-primary/5 cursor-pointer';
              if (chosen) {
                if (isCorrectOpt) style = 'border-green-500 bg-green-500/10 cursor-default';
                else if (isChosen) style = 'border-red-500 bg-red-500/10 cursor-default';
                else style = 'border-primary/10 bg-card opacity-40 cursor-default';
              }

              return (
                <button key={option} onClick={() => handleAnswer(option)} disabled={!!chosen}
                  className={`w-full rounded-xl border-2 px-4 py-3.5 text-right transition-all active:scale-[0.98] ${style}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-ui text-sm leading-relaxed flex-1">{option}</p>
                    {chosen && isCorrectOpt && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />}
                    {chosen && isChosen && !isCorrectOpt && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* التفسير والتالي */}
          {chosen && (
            <div className="space-y-3">
              <div className={`rounded-xl px-4 py-3 font-ui text-sm ${isCorrect ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                <p className="font-bold mb-1">{isCorrect ? '✓ إجابة صحيحة!' : '✗ إجابة خاطئة'}</p>
                <p className="text-xs leading-relaxed opacity-90">{q.explanation}</p>
              </div>
              <button onClick={handleNext}
                className="w-full rounded-xl bg-primary py-3.5 font-ui text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all">
                {currentIndex + 1 >= questions.length ? 'عرض النتيجة' : 'السؤال التالي ←'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- شاشة النتيجة ----
  if (phase === 'result') {
    const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
    const msg = score >= 90 ? 'ممتاز! 🎉' : score >= 70 ? 'جيد جداً 👍' : score >= 50 ? 'جيد، استمر 💪' : 'تحتاج مراجعة 📖';

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 gap-5 pb-10" dir="rtl">
        <Trophy className="h-16 w-16 text-primary" />
        <div className="text-center space-y-1">
          <h2 className="font-ui text-2xl font-bold">{msg}</h2>
          <div className="flex justify-center gap-1">
            {[1,2,3].map(i => (
              <Star key={i} className={`h-6 w-6 ${i <= stars ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
            ))}
          </div>
        </div>

        <div className="flex gap-5 w-full max-w-xs justify-center">
          <div className="text-center">
            <p className="font-ui text-3xl font-bold text-green-500">{toArabicNumeral(correct)}</p>
            <p className="font-ui text-xs text-muted-foreground">صحيح</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="font-ui text-3xl font-bold text-red-500">{toArabicNumeral(wrong)}</p>
            <p className="font-ui text-xs text-muted-foreground">خطأ</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center">
            <p className="font-ui text-3xl font-bold text-primary">{toArabicNumeral(score)}%</p>
            <p className="font-ui text-xs text-muted-foreground">النسبة</p>
          </div>
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => startQuiz(selectedCategory)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-ui text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-95">
            <RotateCcw className="h-4 w-4" />
            مرة أخرى
          </button>
          <button onClick={() => setPhase('home')}
            className="flex-1 rounded-xl border border-primary/20 py-3 font-ui text-sm font-semibold hover:bg-primary/5 active:scale-95">
            الفئات
          </button>
        </div>
      </div>
    );
  }

  return null;
}
