'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface UseSwipeDownSheetOptions {
  onClose: () => void;
  threshold?: number;
  isOpen?: boolean;
}

export function useSwipeDownSheet({
  onClose,
  threshold = 85,
  isOpen = true,
}: UseSwipeDownSheetOptions) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const startY = useRef(0);
  const startTime = useRef(0);
  const isEligibleForDrag = useRef(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Reset when open state changes
  useEffect(() => {
    if (isOpen) {
      setDragY(0);
      setIsDragging(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      startY.current = clientY;
      startTime.current = Date.now();

      // Check if user is scrolling from top of modal body or dragging handle/header
      const scrollContainer = scrollRef.current;
      const isScrollAtTop = !scrollContainer || scrollContainer.scrollTop <= 0;

      isEligibleForDrag.current = isScrollAtTop;
      setIsDragging(true);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging || !isEligibleForDrag.current) return;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const diffY = clientY - startY.current;

      if (diffY > 0) {
        setDragY(diffY);
      } else {
        // Slight resistance when dragging up
        setDragY(diffY * 0.1);
      }
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const diffY = dragY;
    const elapsed = Date.now() - startTime.current;
    const velocity = diffY / (elapsed || 1); // px per ms

    // Threshold reached or fast downward swipe gesture
    if (diffY > threshold || (diffY > 35 && velocity > 0.35)) {
      setIsClosing(true);
      setDragY(typeof window !== 'undefined' ? window.innerHeight : 600);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
        setDragY(0);
      }, 200);
    } else {
      // Spring back to origin
      setDragY(0);
    }
  }, [dragY, isDragging, onClose, threshold]);

  const sheetStyle: React.CSSProperties = {
    transform: `translate3d(0, ${Math.max(0, dragY)}px, 0)`,
    transition: isDragging
      ? 'none'
      : 'transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-out',
    opacity: isClosing ? 0 : 1,
    willChange: 'transform',
  };

  const backdropStyle: React.CSSProperties = {
    opacity: isClosing ? 0 : Math.max(0.2, 1 - dragY / 350),
    transition: isDragging ? 'none' : 'opacity 0.2s ease-out',
  };

  return {
    sheetStyle,
    backdropStyle,
    dragProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleTouchStart,
      onMouseMove: handleTouchMove,
      onMouseUp: handleTouchEnd,
    },
    scrollRef,
    isDragging,
  };
}
