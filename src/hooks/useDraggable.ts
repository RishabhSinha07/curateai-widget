import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

const STORAGE_KEY = 'curateai-bubble-position';
const DRAG_THRESHOLD = 5;

export interface DragPosition {
  left: number;
  top: number;
}

interface UseDraggableOptions {
  size: number;
  margin?: number;
  onClick: () => void;
}

interface UseDraggableResult {
  position: DragPosition | null;
  isDragging: boolean;
  onPointerDown: (e: PointerEvent) => void;
}

function loadPersisted(): DragPosition | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.left === 'number' && typeof parsed?.top === 'number') {
      return parsed;
    }
  } catch {}
  return null;
}

export function useDraggable({ size, margin = 8, onClick }: UseDraggableOptions): UseDraggableResult {
  const [position, setPosition] = useState<DragPosition | null>(loadPersisted);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originLeft: number;
    originTop: number;
    moved: boolean;
    target: HTMLElement;
  } | null>(null);

  const clamp = useCallback((left: number, top: number): DragPosition => {
    const maxLeft = Math.max(margin, window.innerWidth - size - margin);
    const maxTop = Math.max(margin, window.innerHeight - size - margin);
    return {
      left: Math.min(Math.max(margin, left), maxLeft),
      top: Math.min(Math.max(margin, top), maxTop),
    };
  }, [size, margin]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      drag.moved = true;
      setIsDragging(true);
    }
    if (drag.moved) {
      e.preventDefault();
      setPosition(clamp(drag.originLeft + dx, drag.originTop + dy));
    }
  }, [clamp]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    if (drag.target.hasPointerCapture(drag.pointerId)) {
      drag.target.releasePointerCapture(drag.pointerId);
    }
    drag.target.removeEventListener('pointermove', handlePointerMove);
    drag.target.removeEventListener('pointerup', handlePointerUp);
    drag.target.removeEventListener('pointercancel', handlePointerUp);

    if (drag.moved) {
      setIsDragging(false);
      setPosition(prev => {
        if (prev) {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prev)); } catch {}
        }
        return prev;
      });
    } else {
      onClick();
    }
    dragRef.current = null;
  }, [handlePointerMove, onClick]);

  const onPointerDown = useCallback((e: PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    target.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originLeft: rect.left,
      originTop: rect.top,
      moved: false,
      target,
    };
    target.addEventListener('pointermove', handlePointerMove);
    target.addEventListener('pointerup', handlePointerUp);
    target.addEventListener('pointercancel', handlePointerUp);
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    const onResize = () => {
      setPosition(prev => (prev ? clamp(prev.left, prev.top) : null));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clamp]);

  return { position, isDragging, onPointerDown };
}
