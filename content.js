(() => {
  const MIN_INTERVAL_MS = 60_000;
  const MAX_INTERVAL_MS = 300_000;
  const OVERLAY_ID = 'cat-break-overlay-root';

  function getRandomInterval() {
    return Math.floor(
      Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS + 1) + MIN_INTERVAL_MS
    );
  }

  function showCatBreak() {
    if (document.getElementById(OVERLAY_ID)) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      background: 'rgba(0, 0, 0, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    });

    const video = document.createElement('video');
    video.src = chrome.runtime.getURL('cat_break.mp4');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    Object.assign(video.style, {
      width: 'min(80vw, 960px)',
      maxHeight: '80vh',
      borderRadius: '12px',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.55)'
    });

    const cleanup = () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };

    video.addEventListener('ended', cleanup, { once: true });
    video.addEventListener('error', cleanup, { once: true });

    overlay.appendChild(video);
    document.documentElement.appendChild(overlay);

    video.play().catch(() => {
      cleanup();
    });

    setTimeout(cleanup, 15_000);
  }

  function scheduleNextCatBreak() {
    const nextInterval = getRandomInterval();

    setTimeout(() => {
      showCatBreak();
      scheduleNextCatBreak();
    }, nextInterval);
  }

  scheduleNextCatBreak();
})();
