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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
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
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-[calc(100vh-56px)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-card flex-shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <h1 className="text-body font-bold">معاينة لوحة التحكم</h1>
          </div>

          {/* Device presets */}
          <div className="flex items-center gap-1">
            {([
              { key: 'desktop', Icon: Monitor, tooltip: 'سطح المكتب' },
              { key: 'tablet', Icon: Tablet, tooltip: 'جهاز لوحي' },
              { key: 'mobile', Icon: Smartphone, tooltip: 'هاتف' },
            ] as const).map(({ key, Icon, tooltip }) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <Button
                    variant={device === key ? 'default' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => { setDevice(key); setPan({ x: 0, y: 0 }); }}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isPanning ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsPanning(!isPanning)}
                >
                  {isPanning ? <Move className="h-4 w-4" /> : <MousePointer className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isPanning ? 'وضع المؤشر' : 'وضع السحب'}</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تصغير</TooltipContent>
            </Tooltip>

            <span className="text-small font-mono font-semibold w-12 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تكبير</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-5" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fitToScreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>ملائمة</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetView}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>إعادة تعيين</TooltipContent>
            </Tooltip>
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
                <div className="absolute -inset-[2px] rounded-xl border-2 border-border shadow-2xl pointer-events-none z-10" />

                {/* Dimension label */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="secondary" className="text-[10px] font-mono whitespace-nowrap">
                    {label} · {Math.round(zoom * 100)}%
                  </Badge>
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
        <div className="flex items-center justify-between px-4 py-1.5 border-t bg-card text-[10px] text-muted-foreground flex-shrink-0">
          <span>لوحة الإدارة · {device === 'desktop' ? 'سطح المكتب' : device === 'tablet' ? 'جهاز لوحي' : 'هاتف'}</span>
          <span>معاينة مباشرة</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
