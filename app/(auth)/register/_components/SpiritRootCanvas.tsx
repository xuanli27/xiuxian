import React, { useRef, useState } from 'react';
import { SpiritRootType } from '@/types';
import { Zap, Eraser, Palette, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

// 灵根对应的宗门分配
const SPIRIT_ROOT_ASSIGNMENTS = {
  [SpiritRootType.HEAVEN]: {
    name: '天灵根',
    color: 'text-purple-400',
    assignment: '天机峰',
    description: '资质卓绝,万中无一。你将被分配至天机峰修行,由掌门亲自指导。'
  },
  [SpiritRootType.EARTH]: {
    name: '地灵根',
    color: 'text-yellow-400',
    assignment: '玄武院',
    description: '根基扎实,潜力不俗。你将进入玄武院修行,专攻防御与炼体之道。'
  },
  [SpiritRootType.HUMAN]: {
    name: '人灵根',
    color: 'text-blue-400',
    assignment: '青云峰',
    description: '资质平平,但贵在坚持。你将在青云峰修行,与众多同门共同进步。'
  },
  [SpiritRootType.WASTE]: {
    name: '废灵根',
    color: 'text-gray-400',
    assignment: '杂役院',
    description: '灵根孱弱,修行艰难。你将先在杂役院历练,或许能觅得奇遇。'
  }
};

const BRUSH_COLORS = [
  { name: '灵气青', color: '#10B981' },
  { name: '仙气紫', color: '#A855F7' },
  { name: '道韵金', color: '#F59E0B' },
  { name: '神魂蓝', color: '#3B82F6' },
  { name: '血气红', color: '#EF4444' },
];

export const SpiritRootCanvas: React.FC<{ onNext: (root: SpiritRootType, avatar: string, password: string) => void }> = ({ onNext }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [detectedRoot, setDetectedRoot] = useState<SpiritRootType>(SpiritRootType.WASTE);
  const [avatarData, setAvatarData] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0].color);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e as React.MouseEvent;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e as React.MouseEvent;
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const analyzeSpirit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setAnalyzing(true);

    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let coloredPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i+3] > 0) coloredPixels++;
    }
    
    const coverage = (coloredPixels / (canvas.width * canvas.height)) * 100;
    let rootType = SpiritRootType.WASTE;
    let chaosScore = 50;

    if (coverage < 2) {
      rootType = SpiritRootType.WASTE;
      chaosScore = 10;
    } else if (coverage < 10) {
      rootType = SpiritRootType.HUMAN;
      chaosScore = 40;
    } else if (coverage < 25) {
      rootType = SpiritRootType.EARTH;
      chaosScore = 70;
    } else {
      rootType = SpiritRootType.HEAVEN;
      chaosScore = 90;
    }

    try {
      const response = await fetch('/api/ai/spirit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chaosScore }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }
      
      const { feedback: aiFeedback } = await response.json();
      setFeedback(aiFeedback);
    } catch (error) {
      console.error('AI feedback error:', error);
      setFeedback('资质平平，适合做个螺丝钉。');
    }
    setAnalyzing(false);
    setDetectedRoot(rootType);

    // 保存 canvas 数据
    const avatarUrl = canvas.toDataURL();
    setAvatarData(avatarUrl);

    // 显示结果页面
    setTimeout(() => {
      setShowResult(true);
    }, 2500);
  };

  const handlePasswordSubmit = async () => {
    console.log('handlePasswordSubmit called');
    console.log('password:', password);
    console.log('confirmPassword:', confirmPassword);
    
    if (!password || password.length < 6) {
      alert('神魂印记至少需要6个字符');
      return;
    }
    if (password !== confirmPassword) {
      alert('两次神魂印记不一致');
      return;
    }
    
    if (!avatarData) {
      alert('灵根数据丢失,请重新绘制');
      setShowPasswordInput(false);
      return;
    }
    
    setIsSubmitting(true);
    console.log('Starting registration...');
    
    try {
      console.log('Calling onNext with:', { detectedRoot, avatarUrl: avatarData.substring(0, 50), password: '***' });
      await onNext(detectedRoot, avatarData, password);
    } catch (error) {
      console.error('Error in handlePasswordSubmit:', error);
      alert(`提交失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 p-4 text-content-100 relative overflow-hidden">
      {/* 仙气背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-surface-950 to-surface-950" />
      
      <div className="text-center mb-6 animate-in slide-in-from-top-4 duration-700 z-10">
        <div className="w-16 h-16 bg-surface-800 rounded-2xl mx-auto mb-4 flex items-center justify-center text-primary-400 shadow-lg border border-border-base">
            <Palette size={32} />
        </div>
        <h1 className="font-xianxia text-4xl text-transparent bg-clip-text bg-gradient-to-b from-primary-300 to-primary-600 mb-2">测灵根</h1>
        <p className="text-content-400 text-sm font-serif">随心绘制,感知天地灵气</p>
      </div>
      
      {!showResult ? (
        <>
          {/* 绘制界面 */}
          {/* 颜色选择 */}
          <div className="flex justify-center gap-3 mb-6 z-10">
            {BRUSH_COLORS.map((c) => (
              <button
                key={c.color}
                onClick={() => setBrushColor(c.color)}
                className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                  brushColor === c.color ? 'border-white scale-110 shadow-lg' : 'border-surface-600'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            ))}
          </div>

          <div className="relative border-4 border-surface-700 rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10 bg-surface-900 mb-6 group z-10">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="cursor-crosshair touch-none bg-surface-900"
        />
        
        {/* Instructions Overlay */}
        {!isDrawing && !analyzing && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 group-hover:opacity-0 transition-opacity">
                 <span className="text-content-400 text-xs border border-dashed border-content-400/30 px-4 py-2 rounded-full">在此区域绘制</span>
             </div>
        )}

        {analyzing && (
          <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
             <Zap size={48} className="text-primary-400 animate-bounce mb-4" />
             <div className="text-primary-400 font-bold font-xianxia text-2xl animate-pulse">鉴定中...</div>
          </div>
            )}
          </div>

          <div className="flex gap-4 z-10">
            <Button
              variant="ghost"
              onClick={() => {
                 const canvas = canvasRef.current;
                 if(canvas) canvas.getContext('2d')?.clearRect(0,0, canvas.width, canvas.height);
              }}
              icon={<Eraser size={18} />}
            >
              重绘
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={analyzeSpirit}
              disabled={analyzing}
              icon={<Zap size={18} />}
            >
              开始鉴定
            </Button>
          </div>

          {feedback && (
            <div className="mt-6 p-6 bg-surface-800/90 border border-primary-500/30 rounded-2xl max-w-lg animate-in zoom-in duration-500 shadow-xl z-10">
              <p className="text-primary-400 italic text-center text-xl font-serif leading-relaxed mb-4">&ldquo;{feedback}&rdquo;</p>
              {detectedRoot && (
                <div className="text-center pt-4 border-t border-surface-700">
                  <p className="text-content-300 text-sm mb-2">检测到灵根:</p>
                  <p className={`text-2xl font-xianxia ${SPIRIT_ROOT_ASSIGNMENTS[detectedRoot].color}`}>
                    {SPIRIT_ROOT_ASSIGNMENTS[detectedRoot].name}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      ) : !showPasswordInput ? (
        /* 结果展示页面 */
        <div className="w-full max-w-lg space-y-6 animate-in fade-in zoom-in duration-700 z-10">
          <div className="bg-surface-800/90 backdrop-blur-md p-8 rounded-2xl border border-primary-500/20 shadow-2xl space-y-6">
            {/* 灵根结果 */}
            <div className="text-center">
              <div className="inline-block p-4 bg-surface-900 rounded-full border border-primary-500/30 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
                <Sparkles size={48} className="text-primary-400" />
              </div>
              
              <h2 className="text-4xl font-xianxia mb-4">
                <span className={SPIRIT_ROOT_ASSIGNMENTS[detectedRoot].color}>
                  {SPIRIT_ROOT_ASSIGNMENTS[detectedRoot].name}
                </span>
              </h2>

              <div className="bg-surface-900/50 rounded-xl p-6 mb-6">
                <p className="text-content-200 text-lg leading-relaxed font-serif">
                  {SPIRIT_ROOT_ASSIGNMENTS[detectedRoot].description}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-surface-900/30 rounded-xl border border-primary-500/20">
                <span className="text-content-300 font-serif">分配至:</span>
                <span className="text-2xl font-xianxia text-primary-400">
                  {SPIRIT_ROOT_ASSIGNMENTS[detectedRoot].assignment}
                </span>
              </div>

              {feedback && (
                <div className="p-4 bg-surface-900/50 border border-primary-500/20 rounded-xl">
                  <p className="text-primary-400 italic text-center font-serif leading-relaxed">
                    &ldquo;{feedback}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* 继续按钮 */}
            <button
              onClick={() => setShowPasswordInput(true)}
              className="w-full group relative px-6 py-4 bg-transparent overflow-hidden rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-primary-600 transition-all group-hover:brightness-110" />
              <span className="relative flex items-center justify-center gap-2 font-xianxia text-xl font-bold text-white tracking-widest">
                接受分配,继续修仙之路
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* 密码设置页面 */
        <div className="w-full max-w-lg space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
          <div className="bg-surface-800/90 backdrop-blur-md p-8 rounded-2xl border border-primary-500/20 shadow-2xl space-y-6">
            {/* 密码设置标题 */}
            <div className="text-center pb-6 border-b border-surface-700">
              <div className="inline-block p-3 bg-surface-900 rounded-full border border-primary-500/30 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Lock size={32} className="text-primary-400" />
              </div>
              <h2 className="text-2xl font-xianxia text-primary-400 mb-2">铭刻神魂印记</h2>
              <p className="text-content-300 text-sm font-serif">设定你的神魂印记,永久保护这份仙缘</p>
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <label className="text-sm font-serif text-content-300 flex items-center gap-2">
                <Lock size={16} className="text-primary-400" />
                神魂印记
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="凝聚你的神魂气息(至少6字)"
                  className="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-xl text-content-100 placeholder-content-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-400 hover:text-content-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 确认密码 */}
            <div className="space-y-2">
              <label className="text-sm font-serif text-content-300 flex items-center gap-2">
                <Lock size={16} className="text-primary-400" />
                巩固印记
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次凝聚神魂气息"
                className="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-xl text-content-100 placeholder-content-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            <button
              onClick={handlePasswordSubmit}
              disabled={isSubmitting}
              className="w-full group relative px-6 py-4 bg-transparent overflow-hidden rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-primary-600 transition-all group-hover:brightness-110" />
              <span className="relative flex items-center justify-center gap-2 font-xianxia text-xl font-bold text-white tracking-widest">
                {isSubmitting ? '铭刻中...' : '铭刻神魂'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};