import { useEffect, useRef } from 'react';

// Throttle function for performance
const throttle = <T extends (...args: any[]) => void>(func: T, limit: number): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

export const useDragScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isTouchDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events for desktop
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      const rect = container.getBoundingClientRect();
      startX.current = e.pageX - rect.left;
      startY.current = e.pageY - rect.top;
      scrollLeft.current = container.scrollLeft;
      scrollTop.current = container.scrollTop;
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
    };

    const updateScroll = (x: number, y: number) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        if (!container) return;
        const walkX = (x - startX.current) * 1.5;
        const walkY = (y - startY.current) * 1.5;
        container.scrollLeft = scrollLeft.current - walkX;
        container.scrollTop = scrollTop.current - walkY;
      });
    };

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const x = e.pageX - rect.left;
      const y = e.pageY - rect.top;
      updateScroll(x, y);
    }, 16); // ~60fps

    const handleMouseUp = () => {
      isDragging.current = false;
      if (container) {
        container.style.cursor = 'grab';
        container.style.userSelect = '';
      }
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      if (container) {
        container.style.cursor = 'grab';
        container.style.userSelect = '';
      }
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return; // Only handle single touch
      isTouchDragging.current = true;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      startX.current = touch.pageX - rect.left;
      startY.current = touch.pageY - rect.top;
      scrollLeft.current = container.scrollLeft;
      scrollTop.current = container.scrollTop;
      container.style.userSelect = 'none';
    };

    const handleTouchMove = throttle((e: TouchEvent) => {
      if (!isTouchDragging.current || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = touch.pageX - rect.left;
      const y = touch.pageY - rect.top;
      updateScroll(x, y);
    }, 16); // ~60fps

    const handleTouchEnd = () => {
      isTouchDragging.current = false;
      if (container) {
        container.style.userSelect = '';
      }
    };

    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    // Set initial cursor (desktop only)
    if (window.matchMedia('(pointer: fine)').matches) {
      container.style.cursor = 'grab';
    }

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
      
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return containerRef;
};

