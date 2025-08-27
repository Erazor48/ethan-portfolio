import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollState {
  isAtBottom: boolean;
  autoScrollEnabled: boolean;
}

interface UseAutoScrollOptions {
  offset?: number;
  smooth?: boolean;
  content?: React.ReactNode;
  // When this key changes, auto-scroll is re-enabled and we jump to bottom
  resetKey?: unknown;
  // Keep following bottom while content height grows (e.g., typewriter)
  followWhileGrowing?: boolean;
  // Element containing the growing content to observe size changes
  contentRef?: React.RefObject<HTMLElement>;
}

export function useAutoScroll(options: UseAutoScrollOptions = {}) {
  const {
    offset = 20,
    smooth = false,
    content,
    resetKey,
    followWhileGrowing = true,
    contentRef,
  } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastContentHeight = useRef(0);
  const userHasScrolled = useRef(false);

  const [scrollState, setScrollState] = useState<ScrollState>({
    isAtBottom: true,
    autoScrollEnabled: true,
  });

  const checkIsAtBottom = useCallback(
    (element: HTMLElement) => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const distanceToBottom = Math.abs(
        scrollHeight - scrollTop - clientHeight
      );
      return distanceToBottom <= offset;
    },
    [offset]
  );

  const scrollToBottom = useCallback(
    (instant?: boolean) => {
      if (!scrollRef.current) return;

      const targetScrollTop =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;

      if (instant) {
        scrollRef.current.scrollTop = targetScrollTop;
      } else {
        scrollRef.current.scrollTo({
          top: targetScrollTop,
          behavior: smooth ? "smooth" : "auto",
        });
      }

      setScrollState({
        isAtBottom: true,
        autoScrollEnabled: true,
      });
      userHasScrolled.current = false;
    },
    [smooth]
  );

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const atBottom = checkIsAtBottom(scrollRef.current);

    setScrollState((prev) => ({
      isAtBottom: atBottom,
      // Re-enable auto-scroll if at the bottom
      autoScrollEnabled: atBottom ? true : prev.autoScrollEnabled,
    }));
  }, [checkIsAtBottom]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const currentHeight = scrollElement.scrollHeight;
    const hasNewContent = currentHeight !== lastContentHeight.current;

    if (hasNewContent) {
      if (scrollState.autoScrollEnabled && followWhileGrowing) {
        requestAnimationFrame(() => {
          scrollToBottom(lastContentHeight.current === 0);
        });
      }
      lastContentHeight.current = currentHeight;
    }
  }, [content, scrollState.autoScrollEnabled, scrollToBottom, followWhileGrowing]);

  // Observe content container size changes (works even if parent does not re-render)
  useEffect(() => {
    if (!contentRef?.current) return;
    const target = contentRef.current;
    let previousHeight = target.scrollHeight;

    const resizeObserver = new ResizeObserver(() => {
      const newHeight = target.scrollHeight;
      const grew = newHeight > previousHeight;
      previousHeight = newHeight;
      if (grew && scrollState.autoScrollEnabled && followWhileGrowing) {
        // smooth or auto depending on hook option
        scrollToBottom(false);
      }
    });

    resizeObserver.observe(target);
    return () => resizeObserver.disconnect();
  }, [contentRef, scrollState.autoScrollEnabled, followWhileGrowing, scrollToBottom]);

  // Re-enable auto-scroll when resetKey changes (e.g., new message sent)
  useEffect(() => {
    if (!scrollRef.current) return;
    setScrollState({ isAtBottom: true, autoScrollEnabled: true });
    // Jump to bottom instantly on reset to avoid visible jump
    scrollToBottom(true);
  }, [resetKey, scrollToBottom]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      if (scrollState.autoScrollEnabled) {
        scrollToBottom(true);
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [scrollState.autoScrollEnabled, scrollToBottom]);

  const disableAutoScroll = useCallback(() => {
    const atBottom = scrollRef.current
      ? checkIsAtBottom(scrollRef.current)
      : false;

    // Only disable if not at bottom
    if (!atBottom) {
      userHasScrolled.current = true;
      setScrollState((prev) => ({
        ...prev,
        autoScrollEnabled: false,
      }));
    }
  }, [checkIsAtBottom]);

  return {
    scrollRef,
    isAtBottom: scrollState.isAtBottom,
    autoScrollEnabled: scrollState.autoScrollEnabled,
    scrollToBottom: () => scrollToBottom(false),
    disableAutoScroll,
  };
} 