window.ChemTycoon = window.ChemTycoon || {};

window.ChemTycoon.PIDCanvas = (function () {
  const Sim = window.ChemTycoon.Sim;

  const VW = 1260;
  const VH = 560;

  // 14 Unit Peralatan P&ID (12 Tahap Berurutan + 2 Unit Overhead Lingkungan/Daur Ulang) + Feedstock + Output Gudang
  const NODES = [
    // Feedstock & Output Gudang Produk Jadi
    { id: "FEED-01",  kind: "product",   stageOrder: 0,  x: 74,   y: 230, w: 102, h: 82 },
    { id: "PROD-OUT", kind: "product",   stageOrder: 99, x: 1146, y: 322, w: 156, h: 98 },

    // Overhead Environmental & Recovery Units
    { id: "S-501",    kind: "equipment", stageOrder: 0,  x: 310,  y: 66,  w: 176, h: 66 },
    { id: "S-502",    kind: "equipment", stageOrder: 0,  x: 525,  y: 66,  w: 184, h: 66 },

    // Baris 1: Tahap #1 s/d Tahap #6 (Kiri ke Kanan)
    { id: "P-101",    kind: "equipment", stageOrder: 1,  x: 212,  y: 230, w: 104, h: 88 },
    { id: "T-102",    kind: "equipment", stageOrder: 2,  x: 356,  y: 226, w: 100, h: 108 },
    { id: "E-201",    kind: "equipment", stageOrder: 3,  x: 500,  y: 230, w: 104, h: 88 },
    { id: "C-202",    kind: "equipment", stageOrder: 4,  x: 644,  y: 230, w: 104, h: 88 },
    { id: "R-203",    kind: "equipment", stageOrder: 5,  x: 788,  y: 226, w: 102, h: 106 },
    { id: "Q-204",    kind: "equipment", stageOrder: 6,  x: 932,  y: 230, w: 104, h: 90 },

    // Baris 2: Tahap #7 s/d Tahap #12 (Kiri ke Kanan, dihubungkan pipa manifold dari Tahap #6 ke Tahap #7)
    { id: "F-301",    kind: "equipment", stageOrder: 7,  x: 212,  y: 422, w: 104, h: 94 },
    { id: "R-301",    kind: "equipment", stageOrder: 8,  x: 356,  y: 418, w: 102, h: 106 },
    { id: "D-303",    kind: "equipment", stageOrder: 9,  x: 500,  y: 422, w: 104, h: 90 },
    { id: "K-401",    kind: "equipment", stageOrder: 10, x: 644,  y: 418, w: 102, h: 102 },
    { id: "M-401",    kind: "equipment", stageOrder: 11, x: 788,  y: 422, w: 108, h: 92 },
    { id: "PK-403",   kind: "equipment", stageOrder: 12, x: 932,  y: 422, w: 110, h: 92 }
  ];

  const SEQUENTIAL_IDS = [
    "P-101", "T-102", "E-201", "C-202", "R-203", "Q-204",
    "F-301", "R-301", "D-303", "K-401", "M-401", "PK-403"
  ];

  const PIPE_COLORS = [
    "#38bdf8", "#00e5ff", "#2dd4bf", "#fbbf24", "#f59e0b", "#fb923c",
    "#34d399", "#a855f7", "#c084fc", "#e879f9", "#f472b6", "#00e676"
  ];

  const ROUTE_THEMES = {
    "ROUTE-DISTILASI": { accent: "#38bdf8", badge: "FRAKSINASI & AROMATIK BTX" },
    "ROUTE-GAS-SYNTH": { accent: "#00e5ff", badge: "SINTESIS GAS TEKANAN TINGGI" },
    "ROUTE-ELEKTRO-MINERAL": { accent: "#fbbf24", badge: "ELEKTROLISIS & ASAM MINERAL" },
    "ROUTE-POLIMER": { accent: "#00e676", badge: "POLIMERISASI & EKSTRUSI RESIN" },
    "ROUTE-BIO-PHARMA": { accent: "#34d399", badge: "BIOPROSES, FERMENTASI & FARMASI cGMP" },
    "ROUTE-HIGH-TEMP": { accent: "#f97316", badge: "TUNGKU SUHU EKSTREM & MATERIAL BATERAI" },
    "ROUTE-SEMI-CLEAN": { accent: "#c084fc", badge: "CLEANROOM SEMIKONDUKTOR SUB-PPT" },
    "ROUTE-METAL-COMP": { accent: "#f43f5e", badge: "METALURGI PRESISI, HIP & KOMPOSIT" }
  };

  let canvas = null;
  let ctx = null;
  let viewTransform = { scale: 1, offsetX: 0, offsetY: 0 };
  let hoveredNodeId = null;
  let onSelectCallback = null;
  let animTime = 0;

  function getNode(id) {
    return NODES.find((n) => n.id === id);
  }

  // Hanya tampilkan alat yang sudah terpasang (stageOrder <= installedStageCount)
  // ditambah 1 slot tahap berikutnya (+ TAHAP #N+1) agar pabrik benar-benar dimulai dari peralatan sedikit (3 alat)
  // lalu bertambah panjang secara visual setiap kali pemain memperpanjang rangkaian alat!
  function isNodeVisible(node, installedStageCount) {
    if (node.kind === "product") return true;
    if (node.stageOrder === 0) return true; // S-501 & S-502 selalu tampil di header atas
    return node.stageOrder <= installedStageCount + 1;
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const padX = 14;
    const padY = 10;
    const scaleX = (rect.width - padX * 2) / VW;
    const scaleY = (rect.height - padY * 2) / VH;
    viewTransform.scale = Math.max(0.3, Math.min(scaleX, scaleY));
    viewTransform.offsetX = (rect.width - VW * viewTransform.scale) * 0.5;
    viewTransform.offsetY = (rect.height - VH * viewTransform.scale) * 0.5;
  }

  function screenToVirtual(sx, sy) {
    return {
      x: (sx - viewTransform.offsetX) / viewTransform.scale,
      y: (sy - viewTransform.offsetY) / viewTransform.scale
    };
  }

  function getCurrentInstalledStageCount() {
    const fid = Sim.state.activeFactoryId;
    const f = fid ? Sim.state.factories[fid] : null;
    return f ? (f.installedStageCount || 3) : 3;
  }

  function hitTest(sx, sy) {
    const p = screenToVirtual(sx, sy);
    const stageCount = getCurrentInstalledStageCount();
    for (let i = NODES.length - 1; i >= 0; i--) {
      const n = NODES[i];
      if (!isNodeVisible(n, stageCount)) continue;
      if (
        p.x >= n.x - n.w * 0.55 &&
        p.x <= n.x + n.w * 0.55 &&
        p.y >= n.y - n.h * 0.55 &&
        p.y <= n.y + n.h * 0.55
      ) {
        return n;
      }
    }
    return null;
  }

  function init(canvasEl, onSelect) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    onSelectCallback = onSelect;
    resize();

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
      hoveredNodeId = hit ? hit.id : null;
      canvas.style.cursor = hit ? "pointer" : "default";
    });

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top);
      if (hit && onSelectCallback) {
        onSelectCallback({ type: hit.kind, id: hit.id });
      }
    });

    window.addEventListener("resize", resize);
  }

  function drawGrid(w, h) {
    ctx.fillStyle = "#050911";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(25, 45, 74, 0.25)";
    ctx.lineWidth = 1;
    const step = 28;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  function drawRouteHeaderAndTrainProgress(metrics) {
    const routeId = metrics.route ? metrics.route.id : "ROUTE-DISTILASI";
    const rTheme = ROUTE_THEMES[routeId] || ROUTE_THEMES["ROUTE-DISTILASI"];
    const stageCount = metrics.installedStageCount || 3;

    // Route & Train Length Banner di Kanan Atas Kanvas Virtual
    ctx.save();
    ctx.fillStyle = "rgba(10, 19, 34, 0.94)";
    ctx.strokeStyle = rTheme.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(650, 22, 585, 62, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = rTheme.accent;
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.fillText(`RUTE P&ID: ${rTheme.badge}`, 664, 40);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = '700 11px "Inter", sans-serif';
    ctx.fillText(`Produk Aktif: ${metrics.activeChem.id} — ${metrics.activeChem.name}`, 664, 57);

    const yieldBoostPct = Math.round((stageCount - 3) * 18);
    const purityBoostPct = ((stageCount - 3) * 1.75).toFixed(1);
    ctx.fillStyle = "#00e676";
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillText(
      `PANJANG RANGKAIAN ALAT: ${stageCount} / 12 TAHAP TERPASANG (Bonus Yield +${yieldBoostPct}% • Purity +${purityBoostPct}%)`,
      664,
      74
    );

    // Progress bar 12 Tahap di sudut kanan banner
    const barX = 1105;
    const barY = 32;
    for (let s = 1; s <= 12; s++) {
      ctx.fillStyle = s <= stageCount ? "#00e676" : s === stageCount + 1 ? "#38bdf8" : "#1e293b";
      ctx.fillRect(barX + (s - 1) * 10, barY, 7, 14);
    }
    ctx.restore();

    // Zona Baris 1 (Tahap 1–6)
    ctx.save();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.fillStyle = "rgba(56, 189, 248, 0.03)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.roundRect(18, 134, 988, 182, 8);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#38bdf8";
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillText("JALUR PROSES HULU & KONVERSI PRIMER (TAHAP #1 S/D #6 — MULAI DARI 3 ALAT AWAL)", 30, 151);
    ctx.restore();

    // Zona Baris 2 (Tahap 7–12) — Tampil ketika sudah mendekati/memasuki Tahap 6+
    if (stageCount >= 5) {
      ctx.save();
      ctx.strokeStyle = stageCount >= 7 ? "rgba(192, 132, 252, 0.28)" : "rgba(100, 116, 139, 0.22)";
      ctx.fillStyle = stageCount >= 7 ? "rgba(192, 132, 252, 0.03)" : "rgba(15, 23, 42, 0.2)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.roundRect(150, 332, 856, 186, 8);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = stageCount >= 7 ? "#c084fc" : "#64748b";
      ctx.font = '700 9.5px "JetBrains Mono", monospace';
      ctx.fillText("JALUR EKSPANSI LANJUTAN: PEMISAHAN, PEMURNIAN ULTRA & FINISHING (TAHAP #7 S/D #12)", 164, 349);
      ctx.restore();
    }
  }

  function drawAnimatedPolyline(points, active, color, speed, bottlenecked) {
    if (!points || points.length < 2) return;
    ctx.save();
    ctx.strokeStyle = active ? (bottlenecked ? "#7f1d1d" : "#1e3a5f") : "#151e2e";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    ctx.strokeStyle = active ? (bottlenecked ? "#ef4444" : "#0b192c") : "#0c1320";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    if (active) {
      const pipeColor = bottlenecked ? "#ff5252" : color;
      ctx.strokeStyle = pipeColor;
      ctx.lineWidth = 3.5;
      ctx.setLineDash([10, 12]);
      ctx.lineDashOffset = -animTime * speed;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (active && bottlenecked) {
      const p0 = points[0];
      const p1 = points[points.length - 1];
      const mx = (p0.x + p1.x) * 0.5;
      const my = (p0.y + p1.y) * 0.5 - 22;
      const flash = 0.65 + 0.35 * Math.sin(animTime * 8);
      ctx.fillStyle = `rgba(220, 38, 38, ${flash})`;
      ctx.beginPath();
      ctx.roundRect(mx - 42, my - 10, 84, 18, 4);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText("⚠ BOTTLENECK", mx, my + 2);
    }
    ctx.restore();
  }

  function drawFlueGasHeader(metrics) {
    const stageCount = metrics.installedStageCount || 3;
    const row1Units = ["T-102", "E-201", "R-203", "Q-204"].filter((id) => {
      const n = getNode(id);
      return n && n.stageOrder <= stageCount && metrics.unitStats[id] && metrics.unitStats[id].active;
    });
    const scrubber = getNode("S-501");
    const recycler = getNode("S-502");
    const headerY = 116;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 179, 0, 0.42)";
    ctx.lineWidth = 2.2;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -animTime * 26;

    if (row1Units.length > 0) {
      const firstX = Math.min(scrubber.x, getNode(row1Units[0]).x);
      const lastX = Math.max(
        metrics.unitStats["S-502"] && metrics.unitStats["S-502"].active ? recycler.x : scrubber.x,
        getNode(row1Units[row1Units.length - 1]).x
      );
      ctx.beginPath();
      ctx.moveTo(firstX, headerY);
      ctx.lineTo(lastX, headerY);
      ctx.stroke();

      row1Units.forEach((id) => {
        const n = getNode(id);
        ctx.beginPath();
        ctx.moveTo(n.x, n.y - n.h * 0.48);
        ctx.lineTo(n.x, headerY);
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.moveTo(scrubber.x, headerY);
      ctx.lineTo(scrubber.x, scrubber.y + scrubber.h * 0.5);
      ctx.stroke();

      if (metrics.unitStats["S-502"] && metrics.unitStats["S-502"].active) {
        ctx.strokeStyle = "rgba(52, 211, 153, 0.55)";
        ctx.beginPath();
        ctx.moveTo(recycler.x, headerY);
        ctx.lineTo(recycler.x, recycler.y + recycler.h * 0.5);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function truncateText(str, maxLen) {
    const s = String(str || "");
    return s.length > maxLen ? s.slice(0, maxLen - 1) + "…" : s;
  }

  function drawEquipmentSymbol(node, unitDef, stat, routeId, stageCount, isSelected, isHovered) {
    const active = stat.active;
    const isNextExpandSlot = node.stageOrder === stageCount + 1;
    const isOptionalOverheadSlot = node.id === "S-502" && !active;
    const x = node.x;
    const y = node.y;
    const w = node.w;
    const h = node.h;
    const genNum = stat.genNum || 1;

    const genColors = {
      1: "#38bdf8",
      2: "#00e676",
      3: "#c084fc",
      4: "#fbbf24"
    };
    const activeColor = genColors[genNum] || "#00e5ff";

    ctx.save();
    ctx.globalAlpha = active ? 1.0 : (isNextExpandSlot || isOptionalOverheadSlot) ? 0.88 : 0.42;

    const pulseBorder = (isNextExpandSlot || isOptionalOverheadSlot)
      ? (0.55 + 0.45 * Math.sin(animTime * 4))
      : 1;

    ctx.fillStyle = isSelected
      ? "rgba(0, 229, 255, 0.17)"
      : isNextExpandSlot
        ? "rgba(0, 230, 118, 0.08)"
        : "rgba(11, 18, 30, 0.94)";

    ctx.strokeStyle = isSelected
      ? "#ffffff"
      : isHovered
        ? "#93c5fd"
        : active
          ? activeColor
          : isNextExpandSlot
            ? `rgba(0, 230, 118, ${pulseBorder})`
            : isOptionalOverheadSlot
              ? `rgba(56, 189, 248, ${pulseBorder})`
              : "#1e293b";

    ctx.lineWidth = isSelected ? 2.4 : (isNextExpandSlot || genNum >= 3) ? 2.0 : 1.4;
    if (!active) ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.roundRect(x - w * 0.5, y - h * 0.5, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = active ? activeColor : isNextExpandSlot ? "#00e676" : "#64748b";
    ctx.fillStyle = active ? "#0f2942" : "#0f172a";
    ctx.lineWidth = 1.8;

    // Gambar simbol teknik kimia P&ID untuk seluruh 14 unit
    if (node.id === "P-101") {
      if (routeId === "ROUTE-HIGH-TEMP" || routeId === "ROUTE-METAL-COMP") {
        ctx.beginPath();
        ctx.arc(x - 14, y - 8, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeRect(x + 6, y - 20, 25, 23);
      } else {
        ctx.beginPath();
        ctx.arc(x - 16, y - 8, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeRect(x + 4, y - 20, 26, 23);
        for (let i = 0; i < genNum; i++) {
          ctx.beginPath();
          ctx.moveTo(x + 8, y - 15 + i * 5);
          ctx.lineTo(x + 26, y - 15 + i * 5);
          ctx.stroke();
        }
      }
    } else if (node.id === "T-102" || node.id === "K-401") {
      if (routeId === "ROUTE-ELEKTRO-MINERAL" && node.id === "T-102") {
        ctx.strokeRect(x - 23, y - 32, 46, 52);
        for (let ex = -14; ex <= 14; ex += 9) {
          ctx.beginPath();
          ctx.moveTo(x + ex, y - 28);
          ctx.lineTo(x + ex, y + 14);
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.roundRect(x - 18, y - 34, 36, 54, 11);
        ctx.fill();
        ctx.stroke();
        const trayStep = genNum >= 3 ? 8 : 12;
        for (let ty = -20; ty <= 10; ty += trayStep) {
          ctx.beginPath();
          ctx.moveTo(x - 13, y + ty);
          ctx.lineTo(x + 13, y + ty);
          ctx.stroke();
        }
      }
    } else if (node.id === "E-201" || node.id === "Q-204") {
      ctx.beginPath();
      ctx.arc(x, y - 8, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 20, y - 8);
      ctx.lineTo(x - 8, y - 16);
      ctx.lineTo(x, y + 2);
      ctx.lineTo(x + 8, y - 16);
      ctx.lineTo(x + 20, y - 8);
      ctx.stroke();
    } else if (node.id === "C-202") {
      ctx.beginPath();
      ctx.moveTo(x - 22, y - 22);
      ctx.lineTo(x + 22, y - 12);
      ctx.lineTo(x + 22, y + 4);
      ctx.lineTo(x - 22, y + 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (node.id === "R-203" || node.id === "R-301") {
      ctx.beginPath();
      ctx.roundRect(x - 20, y - 32, 40, 52, 10);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - 36);
      ctx.lineTo(x, y + 10);
      ctx.moveTo(x - 12, y + 2);
      ctx.lineTo(x + 12, y + 2);
      ctx.moveTo(x - 9, y - 10);
      ctx.lineTo(x + 9, y - 10);
      ctx.stroke();
    } else if (node.id === "F-301") {
      // Siklon / Sentrifus / Membran Separator
      ctx.beginPath();
      ctx.moveTo(x - 18, y - 26);
      ctx.lineTo(x + 18, y - 26);
      ctx.lineTo(x + 18, y - 8);
      ctx.lineTo(x, y + 14);
      ctx.lineTo(x - 18, y - 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (node.id === "D-303") {
      // Rotary / Spray / Freeze Dryer Drum
      ctx.beginPath();
      ctx.roundRect(x - 24, y - 22, 48, 30, 8);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 16, y - 14);
      ctx.lineTo(x + 16, y + 2);
      ctx.moveTo(x - 16, y + 2);
      ctx.lineTo(x + 16, y - 14);
      ctx.stroke();
    } else if (node.id === "M-401" || node.id === "PK-403") {
      ctx.strokeRect(x - 26, y - 22, 52, 30);
      ctx.beginPath();
      ctx.moveTo(x - 20, y - 7);
      ctx.lineTo(x + 20, y - 7);
      ctx.moveTo(x - 10, y - 17);
      ctx.lineTo(x + 10, y + 3);
      ctx.stroke();
    } else if (node.id === "S-501" || node.id === "S-502") {
      ctx.beginPath();
      ctx.roundRect(x - 72, y - 20, 38, 34, 6);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 68, y - 16);
      ctx.lineTo(x - 38, y + 10);
      ctx.moveTo(x - 38, y - 16);
      ctx.lineTo(x - 68, y + 10);
      ctx.stroke();
    }

    const isHeaderUnit = node.id === "S-501" || node.id === "S-502";
    ctx.textAlign = isHeaderUnit ? "left" : "center";
    const textX = isHeaderUnit ? x - 24 : x;
    const tagY = isHeaderUnit ? y - 7 : y + h * 0.5 - 22;

    ctx.fillStyle = active ? "#ffffff" : isNextExpandSlot ? "#00e676" : "#94a3b8";
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    const labelText = active
      ? `${unitDef.tag} [Gen.${genNum}•Lv.${stat.level}]`
      : isNextExpandSlot
        ? `➕ TAHAP #${node.stageOrder} (${unitDef.tag})`
        : isOptionalOverheadSlot
          ? `➕ PASANG ${unitDef.tag}`
          : `${unitDef.tag} [TAHAP #${node.stageOrder}]`;
    ctx.fillText(labelText, textX, tagY);

    const displayEquipName = active
      ? truncateText(stat.genName, isHeaderUnit ? 20 : 15)
      : isNextExpandSlot
        ? "Klik untuk Perpanjang!"
        : isOptionalOverheadSlot
          ? "Klik untuk Pasang!"
          : truncateText(stat.roleName || unitDef.shortName, 15);

    ctx.fillStyle = active ? activeColor : isNextExpandSlot ? "#a7f3d0" : "#64748b";
    ctx.font = '600 8.8px "Inter", sans-serif';
    ctx.fillText(displayEquipName, textX, tagY + 12);

    // Pill telemetri atau nomor urut tahap di atas alat
    if (active) {
      const infoTxt = isHeaderUnit
        ? `Gen.${genNum} Aktif`
        : `#${node.stageOrder} • ${Math.round(stat.temp)}°C • ${stat.pressure.toFixed(0)}b`;
      ctx.fillStyle = "rgba(6, 10, 16, 0.92)";
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x - 44, y - h * 0.5 - 10, 88, 15, 4);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = activeColor;
      ctx.font = '700 8.2px "JetBrains Mono", monospace';
      ctx.fillText(infoTxt, x, y - h * 0.5 + 1);
    } else if (isNextExpandSlot && metricsNextStageCost) {
      ctx.fillStyle = "rgba(0, 230, 118, 0.18)";
      ctx.strokeStyle = "#00e676";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x - 45, y - h * 0.5 - 10, 90, 15, 4);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "#00e676";
      ctx.font = '700 8.2px "JetBrains Mono", monospace';
      ctx.fillText(`+PERPANJANG $${metricsNextStageCost}`, x, y - h * 0.5 + 1);
    }

    ctx.restore();
  }

  let metricsNextStageCost = 0;

  function drawProductNode(node, prodDef, pStat, stageCount, isSelected, isHovered) {
    const x = node.x;
    const y = node.y;
    const w = node.w;
    const h = node.h;

    ctx.save();
    const borderCol = isSelected
      ? "#ffffff"
      : isHovered
        ? "#93c5fd"
        : prodDef.isFeedstock
          ? "#64748b"
          : "#00e676";

    ctx.fillStyle = isSelected ? "rgba(0, 229, 255, 0.16)" : "rgba(10, 19, 34, 0.96)";
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = isSelected || !prodDef.isFeedstock ? 2.4 : 1.6;
    ctx.beginPath();
    ctx.roundRect(x - w * 0.5, y - h * 0.5, w, h, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = prodDef.isFeedstock ? "#94a3b8" : "#00e676";
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText(
      prodDef.isFeedstock ? "UMPAN BAHAN BAKU" : `📦 OUTPUT GUDANG (${stageCount}/12 TAHAP)`,
      x,
      y - h * 0.5 + 16
    );

    const rawTitle = (prodDef.name || "").replace(/\s*\(.*?\)\s*/g, "");
    const shortTitle = rawTitle.length > 19 ? rawTitle.slice(0, 18) + "…" : rawTitle;

    ctx.fillStyle = "#f1f5f9";
    ctx.font = '700 10.5px "Inter", sans-serif';
    ctx.fillText(shortTitle, x, y + 1);

    if (prodDef.isFeedstock) {
      ctx.fillStyle = "#38bdf8";
      ctx.font = '600 9.5px "JetBrains Mono", monospace';
      ctx.fillText(`${pStat.flowTonPerHr.toFixed(1)} t/jam`, x, y + 20);
    } else {
      const gradeColor =
        pStat.gradeInfo.grade === "Grade A" ? "#00e676" :
        pStat.gradeInfo.grade === "Grade B" ? "#ffb300" : "#ff5252";
      ctx.fillStyle = gradeColor;
      ctx.font = '700 9.8px "JetBrains Mono", monospace';
      ctx.fillText(
        `${pStat.gradeInfo.grade} (${pStat.purity.toFixed(1)}%) • $${Math.round(pStat.unitMarketPriceNet).toLocaleString("id-ID")}/u`,
        x,
        y + 18
      );

      const whStock = Sim.state.warehouse.products[prodDef.chemId];
      const whQty = whStock ? Number(whStock.qty) || 0 : 0;
      ctx.fillStyle = "#38bdf8";
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.fillText(
        `Stok Gudang: ${whQty.toFixed(2)} u (+${(pStat.warehouseRatePerSec || 0).toFixed(2)}/dtk)`,
        x,
        y + 34
      );
    }

    ctx.restore();
  }

  function render(dtSec) {
    if (!canvas || !ctx) return;
    animTime += dtSec;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return;

    drawGrid(w, h);

    const factoryId = Sim.state.activeFactoryId;
    if (!factoryId) return;
    const metrics = Sim.computeFactoryMetrics(factoryId);
    if (!metrics) return;

    const routeId = metrics.route ? metrics.route.id : "ROUTE-DISTILASI";
    const stageCount = metrics.installedStageCount || 3;
    metricsNextStageCost = metrics.nextStageInfo ? metrics.nextStageInfo.cost : 0;

    ctx.save();
    ctx.translate(viewTransform.offsetX, viewTransform.offsetY);
    ctx.scale(viewTransform.scale, viewTransform.scale);

    // 1. Header Rute Proses & Progres Panjang Rangkaian Alat (3 s/d 12 Tahap)
    drawRouteHeaderAndTrainProgress(metrics);

    // 2. Flue gas pipes into Scrubber S-501 & Recycler S-502
    drawFlueGasHeader(metrics);

    // 3. Pipa Umpan FEED-01 -> P-101
    const feedNode = getNode("FEED-01");
    const p101Node = getNode("P-101");
    const baseSpeed = Math.max(18, (metrics.unitStats["P-101"].capacity || 10) * 4.2);
    drawAnimatedPolyline(
      [
        { x: feedNode.x + feedNode.w * 0.5, y: feedNode.y },
        { x: p101Node.x - p101Node.w * 0.5, y: p101Node.y }
      ],
      true,
      "#94a3b8",
      baseSpeed,
      !metrics.hasWarehouseFeed
    );

    // 4. Pipa Rangkaian Proses Berurutan (Hanya sepanjang alat yang sudah dipasang: stage 1 .. stageCount)
    for (let i = 0; i < stageCount - 1 && i < SEQUENTIAL_IDS.length - 1; i++) {
      const fromId = SEQUENTIAL_IDS[i];
      const toId = SEQUENTIAL_IDS[i + 1];
      const nA = getNode(fromId);
      const nB = getNode(toId);
      const pipeKey = fromId + "->" + toId;
      const health = metrics.pipeHealth[pipeKey];
      const bottlenecked = Boolean(health && health.bottlenecked);
      const speed = Math.max(
        18,
        (health ? health.flowRate : metrics.unitStats["P-101"].capacity) * 4.5 * (bottlenecked ? 0.35 : 1)
      );
      const color = PIPE_COLORS[i % PIPE_COLORS.length];

      if (fromId === "Q-204" && toId === "F-301") {
        // Pipa penghubung antar-baris dari ujung Baris 1 (Tahap #6 Q-204) turun ke awal Baris 2 (Tahap #7 F-301)
        drawAnimatedPolyline(
          [
            { x: nA.x, y: nA.y + nA.h * 0.5 },
            { x: nA.x, y: 325 },
            { x: nB.x, y: 325 },
            { x: nB.x, y: nB.y - nB.h * 0.5 }
          ],
          true,
          color,
          speed,
          bottlenecked
        );
      } else {
        drawAnimatedPolyline(
          [
            { x: nA.x + nA.w * 0.5, y: nA.y },
            { x: nB.x - nB.w * 0.5, y: nB.y }
          ],
          true,
          color,
          speed,
          bottlenecked
        );
      }
    }

    // 5. Pipa Output Dinamis dari Alat Proses Terakhir yang Terpasang (endUnitId) menuju Tangki Gudang PROD-OUT!
    const lastStageId = SEQUENTIAL_IDS[Math.min(stageCount, SEQUENTIAL_IDS.length) - 1];
    const lastUnitNode = getNode(lastStageId);
    const outNode = getNode("PROD-OUT");
    if (lastUnitNode && outNode) {
      const outPoints = stageCount <= 6
        ? [
            { x: lastUnitNode.x, y: lastUnitNode.y + lastUnitNode.h * 0.5 },
            { x: lastUnitNode.x, y: 304 },
            { x: 1030, y: 304 },
            { x: 1030, y: outNode.y },
            { x: outNode.x - outNode.w * 0.5, y: outNode.y }
          ]
        : [
            { x: lastUnitNode.x, y: lastUnitNode.y + lastUnitNode.h * 0.5 },
            { x: lastUnitNode.x, y: 498 },
            { x: 1030, y: 498 },
            { x: 1030, y: outNode.y },
            { x: outNode.x - outNode.w * 0.5, y: outNode.y }
          ];
      drawAnimatedPolyline(outPoints, true, "#00e676", 46, false);
    }

    // 6. Gambar Node Peralatan yang Terpasang + 1 Slot Ekspansi Berikutnya
    const inspect = Sim.state.activeInspect;
    NODES.forEach((node) => {
      if (!isNodeVisible(node, stageCount)) return;
      const isSelected = inspect && inspect.id === node.id;
      const isHovered = hoveredNodeId === node.id;
      if (node.kind === "equipment") {
        const unitDef = Sim.getUnitDef(node.id);
        const stat = metrics.unitStats[node.id];
        if (unitDef && stat) {
          drawEquipmentSymbol(node, unitDef, stat, routeId, stageCount, isSelected, isHovered);
        }
      } else {
        const prodDef = Sim.getProductDef(node.id);
        const pStat = metrics.productStats[node.id];
        if (prodDef && pStat) {
          drawProductNode(node, prodDef, pStat, stageCount, isSelected, isHovered);
        }
      }
    });

    ctx.restore();
  }

  return {
    init,
    resize,
    render
  };
})();
