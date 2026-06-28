import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Monitor,
  Smartphone,
  Tablet,
  RotateCcw,
  Move,
  MousePointer,
  Eye,
} from 'lucide-react';
import { Card } from '@components/ui';
import { cn } from '@/utils/cn';
import AdminDashboard from './Dashboard';

type DevicePreset = 'desktop' | 'tablet' | 'mobile';

const DEVICE_SIZES: Record<DevicePreset, { w: number; h: number; label: string }> = {
  desktop: { w: 1440, h: 900, label: '1440 × 900' },
  tablet: { w: 768, h: 1024, label: '768 × 1024' },
  mobile: { w: 375, h: 812, label: '375 × 812' },
};

const ZOOM_STEPS = [0.15, 0.25, 0.33, 0.5, 0.67, 0.75, 1];

export default function DashboardPreview(): JSX.Element {
  const [device, setDevice] = useState<DevicePreset>('desktop');
  const [zoom, setZoom] = useState(0.5);
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const { w, h, label } = DEVICE_SIZES[device];

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      const next = ZOOM_STEPS.find((s) => s > z + 0.001);
      return next ?? z;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const prev = [...ZOOM_STEPS].reverse().find((s) => s < z - 0.001);
      return prev ?? z;
    });
  }, []);

  const resetView = useCallback(() => {
    setZoom(0.5);
    setPan({ x: 0, y: 0 });
  }, []);

  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = (rect.width - 80) / w;
    const scaleY = (rect.height - 80) / h;
    const fit = Math.min(scaleX, scaleY, 1);
    const clamped = ZOOM_STEPS.reduce((prev, curr) =>
      Math.abs(curr - fit) < Math.abs(prev - fit) ? curr : prev
    );
    setZoom(clamped);
    setPan({ x: 0, y: 0 });
  }, [w, h]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [isPanning, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({ x: dragStartRef.current.panX + dx, y: dragStartRef.current.panY + dy });
  }, []);

  const handleMouseUp = useCallback(() => {
    dragStartRef.current = null;
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] page-fade">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex-shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <h1 className="text-body font-bold">معاينة لوحة التحكم</h1>
        </div>

        {/* Device presets */}
        <div className="flex items-center gap-1">
          {([
            { key: 'desktop', Icon: Monitor },
            { key: 'tablet', Icon: Tablet },
            { key: 'mobile', Icon: Smartphone },
          ] as const).map(({ key, Icon }) => (
            <button
              key={key}
              onClick={() => { setDevice(key); setPan({ x: 0, y: 0 }); }}
              title={key}
              className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center transition-colors',
                device === key
                  ? 'bg-primary text-white'
                  : 'text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark'
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPanning(!isPanning)}
            title={isPanning ? 'وضع المؤشر' : 'وضع السحب'}
            className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center transition-colors',
              isPanning
                ? 'bg-primary text-white'
                : 'text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark'
            )}
          >
            {isPanning ? <Move className="h-4 w-4" /> : <MousePointer className="h-4 w-4" />}
          </button>

          <div className="h-5 w-px bg-border-light dark:bg-border-dark mx-1" />

          <button onClick={zoomOut} title="تصغير" className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-small font-mono font-semibold w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} title="تكبير" className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
            <ZoomIn className="h-4 w-4" />
          </button>

          <div className="h-5 w-px bg-border-light dark:bg-border-dark mx-1" />

          <button onClick={fitToScreen} title="ملائمة" className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
            <Maximize2 className="h-4 w-4" />
          </button>
          <button onClick={resetView} title="إعادة تعيين" className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-light dark:text-muted-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className={cn(
          'flex-1 overflow-hidden bg-[#f0f0f0] dark:bg-[#1a1a1a] relative',
          isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        )}
        style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ x: pan.x, y: pan.y }}
            transition={{ type: 'tween', duration: 0.1 }}
          >
            {/* Device frame */}
            <div
              className="relative overflow-hidden"
              style={{
                width: w * zoom,
                height: h * zoom,
              }}
            >
              {/* Frame chrome */}
              <div className="absolute -inset-[2px] rounded-xl border-2 border-border-light dark:border-border-dark/60 shadow-2xl pointer-events-none z-10" />

              {/* Dimension label */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-light dark:text-muted-dark bg-white/80 dark:bg-black/50 px-2 py-0.5 rounded whitespace-nowrap z-10">
                {label} · {Math.round(zoom * 100)}%
              </div>

              {/* Scaled dashboard content */}
              <div
                className="origin-top-left bg-white dark:bg-[#0f172a] rounded-lg overflow-hidden absolute top-0 left-0"
                style={{
                  width: w,
                  height: h,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                }}
              >
                <div className="w-full h-full overflow-auto" dir="rtl">
                  <AdminDashboard />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-[10px] text-muted-light dark:text-muted-dark flex-shrink-0">
        <span>لوحة الإدارة · {device === 'desktop' ? 'سطح المكتب' : device === 'tablet' ? 'جهاز لوحي' : 'هاتف'}</span>
        <span>معاينة مباشرة</span>
      </div>
    </div>
  );
}
