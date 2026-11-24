(function () {
  // Polyfill aman untuk CanvasRenderingContext2D.roundRect jika dibutuhkan
  if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      const radius = Math.min(r || 0, Math.abs(w) / 2, Math.abs(h) / 2);
      this.beginPath();
      this.moveTo(x + radius, y);
      this.arcTo(x + w, y, x + w, y + h, radius);
      this.arcTo(x + w, y + h, x, y + h, radius);
      this.arcTo(x, y + h, x, y, radius);
      this.arcTo(x, y, x + w, y, radius);
      this.closePath();
      return this;
    };
  }

  const Sim = window.ChemTycoon.Sim;
  const UI = window.ChemTycoon.UI;
  const BlueprintMenu = window.ChemTycoon.BlueprintMenu;
  const WorldMap = window.ChemTycoon.WorldMap;
  const PIDCanvas = window.ChemTycoon.PIDCanvas;

  let lastFrameTime = performance.now();
  let hudAccum = 0;

  function tick(now) {
    const dtSec = Math.min(0.1, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    // Render animasi looping GIF Blueprint di Main Menu jika aktif
    if (Sim.state.inMainMenu) {
      BlueprintMenu.render(dtSec);
    } else {
      // Simulasi ekonomi, waktu & aliran proses
      Sim.step(dtSec);

      // Render kanvas fase aktif
      const phase = UI.getCurrentPhase();
      if (phase === "world") {
        WorldMap.render(dtSec);
      } else if (phase === "pid") {
        PIDCanvas.render(dtSec);
      }
    }

    // Pembaruan HUD pada 10 Hz agar efisien dan stabil untuk interaksi tombol
    hudAccum += dtSec;
    if (hudAccum >= 0.1) {
      hudAccum = 0;
      UI.updateDynamicHUD();
    }

    requestAnimationFrame(tick);
  }

  document.addEventListener("DOMContentLoaded", () => {
    UI.init();
    lastFrameTime = performance.now();
    requestAnimationFrame(tick);
  });
})();
