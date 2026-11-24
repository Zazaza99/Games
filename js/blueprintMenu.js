window.ChemTycoon = window.ChemTycoon || {};

window.ChemTycoon.BlueprintMenu = (function () {
  let canvas = null;
  let ctx = null;
  let animTime = 0;
  let active = true;

  function resize() {
    if (!canvas || !ctx) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init(canvasEl) {
    canvas = canvasEl;
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function setActive(flag) {
    active = Boolean(flag);
    if (active) setTimeout(resize, 20);
  }

  function render(dtSec) {
    if (!active || !canvas || !ctx) return;
    animTime += dtSec;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return;

    // 10-second seamless repeating GIF loop
    const loopDuration = 10.0;
    const t = (animTime % loopDuration) / loopDuration; // 0..1

    // Virtual coordinate system 720 x 540
    const VW = 720;
    const VH = 540;
    const scale = Math.min(w / VW, h / VH) * 0.95;
    const ox = (w - VW * scale) * 0.5;
    const oy = (h - VH * scale) * 0.5;

    // Dark drafting table background
    ctx.fillStyle = "#060d18";
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);

    // Drafting board wood/carbon frame
    ctx.fillStyle = "#0d1829";
    ctx.strokeStyle = "#223b5e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(12, 12, VW - 24, VH - 24, 14);
    ctx.fill();
    ctx.stroke();

    // Blueprint Paper Sheet (Center)
    const bx = 78;
    const by = 56;
    const bw = 540;
    const bh = 396;

    const bpGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
    bpGrad.addColorStop(0, "#0b2e59");
    bpGrad.addColorStop(1, "#072042");
    ctx.fillStyle = bpGrad;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 4);
    ctx.fill();

    // Blueprint white double border
    ctx.strokeStyle = "rgba(224, 242, 254, 0.85)";
    ctx.lineWidth = 2;
    ctx.strokeRect(bx + 10, by + 10, bw - 20, bh - 20);
    ctx.lineWidth = 0.8;
    ctx.strokeRect(bx + 15, by + 15, bw - 30, bh - 30);

    // Millimeter blueprint grid
    ctx.strokeStyle = "rgba(125, 211, 252, 0.14)";
    ctx.lineWidth = 0.7;
    for (let gx = bx + 20; gx < bx + bw - 15; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, by + 15);
      ctx.lineTo(gx, by + bh - 15);
      ctx.stroke();
    }
    for (let gy = by + 20; gy < by + bh - 15; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(bx + 15, gy);
      ctx.lineTo(bx + bw - 15, gy);
      ctx.stroke();
    }

    // Corner Metal Clips holding the blueprint
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(bx - 4, by + 18, 12, 28);
    ctx.fillRect(bx + bw - 8, by + 18, 12, 28);
    ctx.fillRect(bx - 4, by + bh - 46, 12, 28);

    // Blueprint Title Block (bottom-right of sheet)
    const tbX = bx + bw - 195;
    const tbY = by + bh - 68;
    ctx.strokeStyle = "rgba(224, 242, 254, 0.8)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(tbX, tbY, 180, 53);
    ctx.beginPath();
    ctx.moveTo(tbX, tbY + 18);
    ctx.lineTo(tbX + 180, tbY + 18);
    ctx.moveTo(tbX, tbY + 35);
    ctx.lineTo(tbX + 180, tbY + 35);
    ctx.stroke();

    ctx.fillStyle = "#e0f2fe";
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.fillText("CHEMICAL ENGINEERING TYCOON", tbX + 6, tbY + 12);
    ctx.fillText("DWG: P&ID-300-CHEM // VER 1.4", tbX + 6, tbY + 29);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`REV: LOOP-GIF [${Math.floor(t * 100)}%]`, tbX + 6, tbY + 46);

    // Progressive Sketch Progress (draws smoothly from t=0..0.82, holds 0.82..0.95, fades 0.95..1.0)
    const drawProg = Math.min(1, t / 0.78);
    const alphaFade = t > 0.93 ? Math.max(0.15, 1 - (t - 0.93) / 0.07) : 1;

    ctx.save();
    ctx.globalAlpha = alphaFade;
    ctx.strokeStyle = "#f0f9ff";
    ctx.fillStyle = "rgba(56, 189, 248, 0.14)";
    ctx.lineWidth = 1.8;

    // 1) Feed Tank & Centrifugal Pump (drawn during 0.0 - 0.25)
    const p1 = Math.min(1, drawProg / 0.25);
    if (p1 > 0) {
      ctx.save();
      ctx.setLineDash([400 * p1, 400]);
      // Storage Tank
      ctx.beginPath();
      ctx.roundRect(bx + 36, by + 185, 68, 92, 6);
      ctx.fill();
      ctx.stroke();
      // Roof dome
      ctx.beginPath();
      ctx.moveTo(bx + 36, by + 200);
      ctx.quadraticCurveTo(bx + 70, by + 170, bx + 104, by + 200);
      ctx.stroke();
      // Pump P-101
      ctx.beginPath();
      ctx.arc(bx + 150, by + 252, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + 138, by + 268);
      ctx.lineTo(bx + 162, by + 268);
      ctx.lineTo(bx + 155, by + 258);
      ctx.lineTo(bx + 145, by + 258);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#bae6fd";
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.fillText("TK-100 FEED", bx + 40, by + 292);
      ctx.fillText("P-101", bx + 136, by + 286);
    }

    // 2) Tall Fractional Distillation Column T-102 (drawn during 0.20 - 0.55)
    const p2 = Math.max(0, Math.min(1, (drawProg - 0.18) / 0.34));
    if (p2 > 0) {
      ctx.save();
      ctx.strokeStyle = "#ffffff";
      ctx.setLineDash([650 * p2, 650]);
      ctx.beginPath();
      ctx.roundRect(bx + 210, by + 84, 64, 200, 28);
      ctx.fill();
      ctx.stroke();

      // Internal bubble trays
      for (let ty = by + 118; ty <= by + 250; ty += 22) {
        ctx.beginPath();
        ctx.moveTo(bx + 216, ty);
        ctx.lineTo(bx + 268, ty);
        ctx.stroke();
      }
      ctx.restore();

      // Dimension arrows alongside tower
      ctx.strokeStyle = "rgba(125, 211, 252, 0.7)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + 196, by + 84);
      ctx.lineTo(bx + 196, by + 284);
      ctx.stroke();
      ctx.fillStyle = "#7dd3fc";
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.fillText("H=42.0m", bx + 152, by + 185);
      ctx.fillStyle = "#ffffff";
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.fillText("T-102 DISTILASI", bx + 200, by + 302);
    }

    // 3) Jacketed Polymerization Reactor R-203 & Heat Exchanger (drawn during 0.48 - 0.85)
    const p3 = Math.max(0, Math.min(1, (drawProg - 0.45) / 0.35));
    if (p3 > 0) {
      ctx.save();
      ctx.strokeStyle = "#38bdf8";
      ctx.setLineDash([600 * p3, 600]);
      // Reactor vessel
      ctx.beginPath();
      ctx.roundRect(bx + 340, by + 125, 78, 145, 22);
      ctx.fill();
      ctx.stroke();
      // Agitator shaft
      ctx.beginPath();
      ctx.moveTo(bx + 379, by + 102);
      ctx.lineTo(bx + 379, by + 240);
      ctx.moveTo(bx + 358, by + 185);
      ctx.lineTo(bx + 400, by + 185);
      ctx.moveTo(bx + 362, by + 220);
      ctx.lineTo(bx + 396, by + 220);
      ctx.stroke();

      // Overhead Condenser drum
      ctx.beginPath();
      ctx.arc(bx + 475, by + 165, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "#e0f2fe";
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.fillText("R-203 REAKTOR", bx + 340, by + 288);
      ctx.fillStyle = "#38bdf8";
      ctx.font = '700 9.5px "JetBrains Mono", monospace';
      ctx.fillText("n(C₂H₄) → ─(CH₂─CH₂)ₙ─", bx + 335, by + 76);
      ctx.fillText("ΔH = -108 kJ/mol • 25 BAR", bx + 335, by + 92);
    }

    // 4) Interconnecting P&ID Process Lines & Valves
    ctx.strokeStyle = "#bae6fd";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.lineDashOffset = -animTime * 35;
    ctx.beginPath();
    ctx.moveTo(bx + 104, by + 252);
    ctx.lineTo(bx + 134, by + 252);
    ctx.moveTo(bx + 166, by + 252);
    ctx.lineTo(bx + 210, by + 252);
    if (p2 > 0.5) {
      ctx.moveTo(bx + 242, by + 84);
      ctx.lineTo(bx + 242, by + 64);
      ctx.lineTo(bx + 379, by + 64);
      ctx.lineTo(bx + 379, by + 125);
    }
    if (p3 > 0.5) {
      ctx.moveTo(bx + 418, by + 165);
      ctx.lineTo(bx + 451, by + 165);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // =========================================================================
    // PERALATAN MENULIS & GAMBAR TEKNIK DI SEKITAR BLUEPRINT (ANIMATED TOOLS)
    // =========================================================================

    // Alat 1: Penggaris-T (T-Square) & Segitiga Skala di Sisi Kiri & Bawah
    const rulerSlide = Math.sin(animTime * 1.4) * 28;
    ctx.save();
    ctx.translate(32, by + 95 + rulerSlide);
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    // Kepala Penggaris-T
    ctx.fillRect(0, -28, 22, 96);
    ctx.strokeRect(0, -28, 22, 96);
    // Bilah Penggaris Transparan memanjang ke atas kertas blueprint
    ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
    ctx.fillRect(22, 6, 175, 24);
    ctx.strokeRect(22, 6, 175, 24);
    // Garis skala milimeter pada penggaris
    ctx.strokeStyle = "#e0f2fe";
    ctx.lineWidth = 1;
    for (let rx = 30; rx < 190; rx += 8) {
      const tickH = rx % 24 === 0 ? 10 : 5;
      ctx.beginPath();
      ctx.moveTo(rx, 6);
      ctx.lineTo(rx, 6 + tickH);
      ctx.stroke();
    }
    ctx.fillStyle = "#93c5fd";
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillText("PENGGARIS-T SKALA MM", 32, 25);
    ctx.restore();

    // Alat 2: Mistar Segitiga (Set Square 45°) di Kiri Bawah
    ctx.save();
    ctx.translate(45, by + bh - 62);
    ctx.fillStyle = "rgba(14, 165, 233, 0.18)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 88);
    ctx.lineTo(115, 88);
    ctx.lineTo(0, -25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Lubang dalam segitiga
    ctx.fillStyle = "#0b274b";
    ctx.beginPath();
    ctx.moveTo(16, 72);
    ctx.lineTo(68, 72);
    ctx.lineTo(16, 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Alat 3: Jangka Teknis (Drafting Compass) di Kanan Atas
    const compassAngle = Math.sin(animTime * 2.2) * 0.18;
    ctx.save();
    ctx.translate(bx + bw + 44, by + 95);
    ctx.rotate(compassAngle);
    ctx.strokeStyle = "#cbd5e1";
    ctx.fillStyle = "#475569";
    ctx.lineWidth = 3;
    // Pegangan atas jangka
    ctx.fillRect(-5, -52, 10, 18);
    // Engsel kepala jangka
    ctx.beginPath();
    ctx.arc(0, -30, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Kaki kiri (jarum pusat)
    ctx.beginPath();
    ctx.moveTo(-4, -22);
    ctx.lineTo(-26, 48);
    ctx.stroke();
    // Kaki kanan (grafit pensil)
    ctx.beginPath();
    ctx.moveTo(4, -22);
    ctx.lineTo(24, 48);
    ctx.stroke();
    // Busur putar jangka
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(-26, 48, 50, -0.4, 0.55);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#94a3b8";
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText("JANGKA TEKNIS", 0, 72);
    ctx.restore();

    // Alat 4: Busur Derajat (Protractor) & Penghapus di Kanan Bawah
    ctx.save();
    ctx.translate(bx + bw + 45, by + 275);
    ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
    ctx.strokeStyle = "#7dd3fc";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 42, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText("BUSUR 180°", 6, 56);

    // Penghapus Teknik & Pensil Mekanik Cadangan di Bawah Kertas
    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#38bdf8";
    ctx.fillRect(-190, 192, 52, 22);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(-190, 192, 32, 22);
    ctx.strokeRect(-190, 192, 52, 22);
    ctx.fillStyle = "#e0f2fe";
    ctx.font = '700 7.5px "JetBrains Mono", monospace';
    ctx.fillText("ERASER", -174, 206);
    ctx.restore();

    // Alat 5: Pena Gambar Teknis Rapidograph yang Bergerak Menggambar di Atas Blueprint!
    let penX = bx + 85;
    let penY = by + 225;
    if (drawProg < 0.25) {
      const k = drawProg / 0.25;
      penX = bx + 55 + k * 95;
      penY = by + 210 + Math.sin(k * Math.PI * 4) * 32;
    } else if (drawProg < 0.55) {
      const k = (drawProg - 0.25) / 0.30;
      penX = bx + 220 + Math.cos(k * Math.PI * 6) * 26;
      penY = by + 95 + k * 175;
    } else {
      const k = (drawProg - 0.55) / 0.45;
      penX = bx + 345 + k * 125;
      penY = by + 135 + Math.sin(k * Math.PI * 5) * 45;
    }

    ctx.save();
    ctx.translate(penX, penY);
    // Spark cahaya pada ujung pena rapidograph
    const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 18);
    glow.addColorStop(0, "rgba(0, 229, 255, 0.95)");
    glow.addColorStop(1, "rgba(0, 229, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    // Batang Pena Teknis Rapidograph miring 40 derajat
    ctx.rotate(-0.65);
    // Ujung jarum logam (nib)
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(-1.5, -10, 3, 10);
    // Kerucut pena
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(-6, -24);
    ctx.lineTo(6, -24);
    ctx.lineTo(2, -10);
    ctx.lineTo(-2, -10);
    ctx.closePath();
    ctx.fill();
    // Bodi pena
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-7, -115, 14, 91, 4);
    ctx.fill();
    ctx.stroke();
    // Cincin kode ketebalan ISO (0.35mm)
    ctx.fillStyle = "#ffb300";
    ctx.fillRect(-7, -42, 14, 7);

    ctx.restore();

    // Top-left Badge "ANIMATED BLUEPRINT GIF LOOP"
    ctx.fillStyle = "rgba(8, 20, 38, 0.9)";
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(bx, 18, 290, 26, 6);
    ctx.fill();
    ctx.stroke();

    const blink = Math.sin(animTime * 5) > 0;
    ctx.fillStyle = blink ? "#00e676" : "#00e5ff";
    ctx.beginPath();
    ctx.arc(bx + 14, 31, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e0f2fe";
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.fillText("BLUEPRINT PABRIK & ALAT TULIS [LOOP GIF]", bx + 26, 35);

    ctx.restore();
  }

  return {
    init,
    resize,
    render,
    setActive
  };
})();
