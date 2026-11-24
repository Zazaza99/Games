window.ChemTycoon = window.ChemTycoon || {};

window.ChemTycoon.UI = (function () {
  const Data = window.ChemTycoon.Data;
  const Catalog = window.ChemTycoon.Catalog200;
  const Sim = window.ChemTycoon.Sim;
  const Audio = window.ChemTycoon.Audio;
  const BlueprintMenu = window.ChemTycoon.BlueprintMenu;
  const WorldMap = window.ChemTycoon.WorldMap;
  const PIDCanvas = window.ChemTycoon.PIDCanvas;

  let currentPhase = "world";
  let catalogFilter = "ALL";
  let catalogSearch = "";
  let initialBuildProductId = "CHEM-001";
  let newsTabEdition = "today"; // "today" | "yesterday" | "archive300"
  let archive300Index = 1; // 1..300
  let activeInterviewEmpId = null;
  let activeDialogueKey = "q_emergency";

  const marketForm = {
    sellProductId: "CHEM-001",
    sellQty: 25,
    sellDestId: "DEST-TOKYO",
    sellModeId: "SEA",
    sellIncotermId: "CIF",

    buySupplierId: "SUP-PERTAMINA",
    buyFeedstockId: "RAW-CRUDE",
    buyQty: 40,
    buyModeId: "SEA",
    buyIncotermId: "FOB"
  };

  const dom = {};

  function fmtUSD(num) {
    const abs = Math.abs(num || 0);
    const sign = num < 0 ? "-" : "";
    return sign + "$" + Math.round(abs).toLocaleString("id-ID");
  }

  function fmtRate(num) {
    const sign = num > 0 ? "+" : num < 0 ? "-" : "";
    return sign + "$" + Math.abs(num || 0).toFixed(1).replace(".", ",") + "/dtk";
  }

  function fmtNum(num, dec) {
    return Number(num || 0).toFixed(dec === undefined ? 1 : dec).replace(".", ",");
  }

  function formatChemHTML(text) {
    return String(text || "")
      .replace(/₀/g, "<sub>0</sub>")
      .replace(/₁/g, "<sub>1</sub>")
      .replace(/₂/g, "<sub>2</sub>")
      .replace(/₃/g, "<sub>3</sub>")
      .replace(/₄/g, "<sub>4</sub>")
      .replace(/₅/g, "<sub>5</sub>")
      .replace(/₆/g, "<sub>6</sub>")
      .replace(/₇/g, "<sub>7</sub>")
      .replace(/₈/g, "<sub>8</sub>")
      .replace(/₉/g, "<sub>9</sub>")
      .replace(/ₙ/g, "<sub>n</sub>")
      .replace(/₊/g, "<sub>+</sub>");
  }

  function showToast(msg, type) {
    const container = dom.toastContainer;
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast " + (type || "info");
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 3800);
  }

  function cacheDOM() {
    dom.mainMenuOverlay = document.getElementById("main-menu-overlay");
    dom.blueprintCanvas = document.getElementById("blueprint-gif-canvas");
    dom.btnMenuPlay = document.getElementById("btn-menu-play");
    dom.menuPlayLabel = document.getElementById("menu-play-label");
    dom.btnMenuSaveLoad = document.getElementById("btn-menu-saveload");
    dom.btnMenuCatalog = document.getElementById("btn-menu-catalog");
    dom.btnMenuNews = document.getElementById("btn-menu-news");
    dom.btnMenuAudio = document.getElementById("btn-menu-audio");
    dom.btnOpenMainMenu = document.getElementById("btn-open-mainmenu");
    dom.btnOpenSaveLoad = document.getElementById("btn-open-saveload");

    dom.btnPhaseWorld = document.getElementById("btn-phase-world");
    dom.btnPhasePid = document.getElementById("btn-phase-pid");
    dom.btnPhaseMarket = document.getElementById("btn-phase-market");
    dom.btnPhaseHr = document.getElementById("btn-phase-hr");
    dom.btnPhaseBank = document.getElementById("btn-phase-bank");

    dom.phaseWorld = document.getElementById("phase-world");
    dom.phasePid = document.getElementById("phase-pid");
    dom.phaseMarket = document.getElementById("phase-market");
    dom.phaseHr = document.getElementById("phase-hr");
    dom.phaseBank = document.getElementById("phase-bank");

    dom.hudCash = document.getElementById("hud-cash");
    dom.hudNetRate = document.getElementById("hud-net-rate");
    dom.hudStability = document.getElementById("hud-stability");
    dom.hudFactories = document.getElementById("hud-factories");
    dom.btnAudio = document.getElementById("btn-audio-toggle");
    dom.audioIcon = document.getElementById("audio-icon");
    dom.audioLabel = document.getElementById("audio-label");

    dom.hudCalendarDate = document.getElementById("hud-calendar-date");
    dom.hudPauseBadge = document.getElementById("hud-pause-badge");
    dom.btnTimePause = document.getElementById("btn-time-pause");
    dom.btnTime1x = document.getElementById("btn-time-1x");
    dom.btnTime2x = document.getElementById("btn-time-2x");
    dom.btnTime5x = document.getElementById("btn-time-5x");
    dom.btnSkip1d = document.getElementById("btn-skip-1d");
    dom.btnSkip30d = document.getElementById("btn-skip-30d");
    dom.btnSkip365d = document.getElementById("btn-skip-365d");
    dom.btnOpenCatalogModal = document.getElementById("btn-open-catalog-modal");
    dom.btnQuickNewspaper = document.getElementById("btn-quick-newspaper");

    dom.worldCanvas = document.getElementById("world-canvas");
    dom.btnZoomIn = document.getElementById("btn-zoom-in");
    dom.btnZoomOut = document.getElementById("btn-zoom-out");
    dom.btnZoomReset = document.getElementById("btn-zoom-reset");
    dom.regionQuickbar = document.getElementById("region-quickbar");
    dom.geoRegionName = document.getElementById("geo-region-name");
    dom.geoRegionSub = document.getElementById("geo-region-sub");
    dom.geoBody = document.getElementById("geo-body");

    dom.pidCanvas = document.getElementById("pid-canvas");
    dom.selectFactory = document.getElementById("select-active-factory");
    dom.btnChangeProduct = document.getElementById("btn-change-product");
    dom.pidRegionBadges = document.getElementById("pid-region-badges");
    dom.pidTierStatus = document.getElementById("pid-tier-status");
    dom.btnExpandLand = document.getElementById("btn-expand-land");
    dom.pidQuickNodes = document.getElementById("pid-quick-nodes");
    dom.chipFlowRate = document.getElementById("chip-flow-rate");
    dom.chipWarehouseRate = document.getElementById("chip-warehouse-rate");
    dom.chipCo2Rate = document.getElementById("chip-co2-rate");
    dom.chipBottleneckWrap = document.getElementById("chip-bottleneck-wrap");
    dom.chipBottleneck = document.getElementById("chip-bottleneck");
    dom.bottleneckDetails = document.getElementById("bottleneck-details");
    dom.tierLiveMetrics = document.getElementById("tier-live-metrics");

    dom.encEyebrow = document.getElementById("enc-eyebrow");
    dom.encTitle = document.getElementById("enc-title");
    dom.encSubtitle = document.getElementById("enc-subtitle");
    dom.encBody = document.getElementById("enc-body");

    dom.marketDashboard = document.getElementById("market-dashboard");
    dom.hrDashboard = document.getElementById("hr-dashboard");
    dom.bankDashboard = document.getElementById("bank-dashboard");

    dom.catalogModal = document.getElementById("catalog-modal");
    dom.btnCloseCatalog = document.getElementById("btn-close-catalog");
    dom.catalogSearchInput = document.getElementById("catalog-search-input");
    dom.catalogFilterTabs = document.getElementById("catalog-filter-tabs");
    dom.catalogGridBody = document.getElementById("catalog-grid-body");

    dom.saveloadModal = document.getElementById("saveload-modal");
    dom.btnCloseSaveLoad = document.getElementById("btn-close-saveload");
    dom.saveloadModalBody = document.getElementById("saveload-modal-body");

    dom.interviewModal = document.getElementById("interview-modal");
    dom.interviewModalTitle = document.getElementById("interview-modal-title");
    dom.btnCloseInterview = document.getElementById("btn-close-interview");
    dom.interviewModalBody = document.getElementById("interview-modal-body");

    dom.explosionModal = document.getElementById("explosion-modal");
    dom.explosionModalBody = document.getElementById("explosion-modal-body");
    dom.btnAckExplosion = document.getElementById("btn-ack-explosion");

    dom.toastContainer = document.getElementById("toast-container");
  }

  function closeMainMenu() {
    Sim.state.inMainMenu = false;
    Sim.state.isPaused = false;
    BlueprintMenu.setActive(false);
    dom.mainMenuOverlay.classList.add("hidden");
    dom.menuPlayLabel.textContent = "LANJUTKAN OPERASI (RESUME)";
    updateTimeControlButtons();
    setTimeout(() => {
      WorldMap.resize();
      PIDCanvas.resize();
    }, 20);
  }

  function openMainMenu() {
    Sim.state.inMainMenu = true;
    Sim.state.isPaused = true;
    BlueprintMenu.setActive(true);
    dom.mainMenuOverlay.classList.remove("hidden");
    Audio.setHumActive(false);
    updateTimeControlButtons();
  }

  function switchPhase(phase) {
    if (phase === "pid" && Object.keys(Sim.state.factories).length === 0) {
      const targetRegion = Sim.state.selectedRegionId || "batam";
      const res = Sim.purchaseRegion(targetRegion, initialBuildProductId);
      if (res.ok) {
        Audio.playCoin();
        showToast(`Kilang pertama dibangun di ${Sim.getRegion(targetRegion).shortName}!`, "good");
      } else {
        showToast("Pilih titik lokasi di Peta Dunia dan bangun kilang pertama Anda!", "warn");
        phase = "world";
      }
    }

    currentPhase = phase;
    dom.btnPhaseWorld.classList.toggle("active", phase === "world");
    dom.btnPhasePid.classList.toggle("active", phase === "pid");
    dom.btnPhaseMarket.classList.toggle("active", phase === "market");
    dom.btnPhaseHr.classList.toggle("active", phase === "hr");
    dom.btnPhaseBank.classList.toggle("active", phase === "bank");

    dom.phaseWorld.classList.toggle("active", phase === "world");
    dom.phasePid.classList.toggle("active", phase === "pid");
    dom.phaseMarket.classList.toggle("active", phase === "market");
    dom.phaseHr.classList.toggle("active", phase === "hr");
    dom.phaseBank.classList.toggle("active", phase === "bank");

    Audio.setHumActive(phase === "pid" && !Sim.state.isPaused && !Sim.state.inMainMenu);

    if (phase === "world") {
      setTimeout(() => WorldMap.resize(), 15);
      renderRegionQuickbar();
      renderWorldInspector();
    } else if (phase === "pid") {
      if (!Sim.state.activeFactoryId) {
        Sim.state.activeFactoryId = Object.keys(Sim.state.factories)[0];
      }
      setTimeout(() => PIDCanvas.resize(), 15);
      renderFactorySelector();
      renderPidQuickbar();
      renderEncyclopedia();
    } else if (phase === "market") {
      renderMarketDashboard();
    } else if (phase === "hr") {
      renderHrDashboard();
    } else if (phase === "bank") {
      renderBankDashboard();
    }
  }

  // ================= MODAL SAVE & LOAD =================
  function openSaveLoadModal() {
    dom.saveloadModal.classList.remove("hidden");
    renderSaveLoadModal();
  }

  function closeSaveLoadModal() {
    dom.saveloadModal.classList.add("hidden");
  }

  function renderSaveLoadModal() {
    const slots = Sim.getSaveSlotsMeta();
    const slotsHtml = slots.map((s) => {
      const title = s.id === "AUTO" ? "SLOT AUTO-SAVE (Otomatis Tiap Hari)" : `SLOT PENYIMPANAN #${s.id}`;
      return `
        <div class="info-card" style="flex-direction:row; justify-content:space-between; align-items:center; gap:12px;">
          <div>
            <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${title}</strong>
            ${s.empty
              ? `<div class="muted">Slot Kosong — Belum ada data tersimpan.</div>`
              : `<div style="font-size:12px; margin-top:2px;">
                   Disimpan: <strong>${s.savedAt}</strong> • Hari #${s.dayCount} • Kas: <strong style="color:var(--accent-emerald)">${fmtUSD(s.cash)}</strong> • Kilang: <strong>${s.factoryCount}</strong>
                 </div>`
            }
          </div>
          <div style="display:flex; gap:6px; flex-shrink:0;">
            <button data-save-slot="${s.id}" class="action-btn compact-btn btn-do-save" type="button">💾 Simpan</button>
            <button data-load-slot="${s.id}" class="action-btn accent-emerald compact-btn btn-do-load" type="button" ${s.empty ? "disabled" : ""}>📂 Muat</button>
            ${!s.empty ? `<button data-del-slot="${s.id}" class="action-btn accent-crimson compact-btn btn-do-del" type="button">🗑️</button>` : ""}
          </div>
        </div>
      `;
    }).join("");

    dom.saveloadModalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${slotsHtml}
      </div>
      <div class="info-card" style="margin-top:8px;">
        <div class="card-title"><span>EKSPOR / IMPOR KODE SAVE JSON (CADANGAN MANUAL)</span><span>PORTABEL</span></div>
        <textarea id="save-json-textarea" class="scada-input" rows="3" style="width:100%; font-family:var(--font-mono); font-size:11px;" placeholder="Klik Ekspor untuk menyalin kode Save, atau tempel kode Save di sini lalu klik Impor..."></textarea>
        <div style="display:flex; gap:8px;">
          <button id="btn-export-json" class="action-btn compact-btn" type="button">📋 Ekspor Kode Save Saat Ini</button>
          <button id="btn-import-json" class="action-btn accent-amber compact-btn" type="button">📥 Impor &amp; Muat dari Kode JSON</button>
        </div>
      </div>
    `;

    dom.saveloadModalBody.querySelectorAll(".btn-do-save").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-save-slot");
        const res = Sim.saveToSlot(sid);
        if (res.ok) {
          Audio.playCoin();
          showToast(`Permainan berhasil disimpan ke Slot ${sid}!`, "good");
          renderSaveLoadModal();
        } else {
          Audio.playError();
          showToast(res.reason, "error");
        }
      });
    });

    dom.saveloadModalBody.querySelectorAll(".btn-do-load").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-load-slot");
        const res = Sim.loadFromSlot(sid);
        if (res.ok) {
          Audio.playUpgrade();
          showToast(`Data permainan dari Slot ${sid} berhasil dimuat!`, "good");
          closeSaveLoadModal();
          closeMainMenu();
          switchPhase(Object.keys(Sim.state.factories).length > 0 ? "pid" : "world");
          updateDynamicHUD();
        } else {
          Audio.playError();
          showToast(res.reason, "error");
        }
      });
    });

    dom.saveloadModalBody.querySelectorAll(".btn-do-del").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-del-slot");
        Sim.deleteSaveSlot(sid);
        Audio.playClick();
        showToast(`Slot ${sid} dihapus.`, "info");
        renderSaveLoadModal();
      });
    });

    const btnExp = document.getElementById("btn-export-json");
    if (btnExp) {
      btnExp.addEventListener("click", () => {
        const ta = document.getElementById("save-json-textarea");
        ta.value = Sim.exportSaveJSON();
        ta.select();
        Audio.playClick();
        showToast("Kode JSON Save ditampilkan. Silakan salin (Ctrl+C).", "info");
      });
    }

    const btnImp = document.getElementById("btn-import-json");
    if (btnImp) {
      btnImp.addEventListener("click", () => {
        const ta = document.getElementById("save-json-textarea");
        const res = Sim.importSaveJSON(ta.value);
        if (res.ok) {
          Audio.playUpgrade();
          showToast("Kode Save JSON berhasil diimpor!", "good");
          closeSaveLoadModal();
          closeMainMenu();
          switchPhase(Object.keys(Sim.state.factories).length > 0 ? "pid" : "world");
          updateDynamicHUD();
        } else {
          Audio.playError();
          showToast(res.reason, "error");
        }
      });
    }
  }

  // ================= TAB 1: PETA DUNIA & GEOLOGIST OPSIONAL =================
  function renderRegionQuickbar() {
    dom.regionQuickbar.innerHTML = "";
    const ids = Object.keys(Sim.state.customSites);
    ids.forEach((id) => {
      const r = Sim.state.customSites[id];
      const isPreset = Data.REGIONS.some((pr) => pr.id === id);
      const owned = Sim.isOwned(id);
      const surveyed = Sim.isSurveyed(id);
      const selected = Sim.state.selectedRegionId === id;
      if (!isPreset && !owned && !surveyed && !selected) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "region-chip" + (selected ? " selected" : "") + (owned ? " owned" : "");
      const statusText = owned ? "AKTIF" : surveyed ? "SURVEI OK" : "SIAP";
      btn.innerHTML = `<span>${r.shortName}</span><span class="chip-tag">${statusText}</span>`;
      btn.addEventListener("click", () => {
        Audio.playClick();
        Sim.state.selectedRegionId = r.id;
        WorldMap.focusRegion(r.id);
        renderRegionQuickbar();
        renderWorldInspector();
      });
      dom.regionQuickbar.appendChild(btn);
    });
  }

  function renderWorldInspector() {
    const regionId = Sim.state.selectedRegionId;
    if (!regionId) return;
    const r = Sim.getRegion(regionId);
    const surveyed = Sim.isSurveyed(regionId);
    const owned = Sim.isOwned(regionId);
    const acqCost = Sim.getAcquisitionCost(regionId);
    const foundModPct = Math.round(r.foundationMod * 100);
    const foundModLabel = foundModPct > 0 ? `+${foundModPct}%` : foundModPct < 0 ? `${foundModPct}%` : "Normal (0%)";
    const initProd = Catalog.getProductById(initialBuildProductId);
    const initRoute = Catalog.getRouteForProduct(initProd);

    dom.geoRegionName.textContent = r.name;
    dom.geoRegionSub.textContent = `Negara/Yurisdiksi: ${r.country} • Koordinat: ${r.coordLabel || ""}`;

    const productPickerCard = !owned ? `
      <div class="info-card">
        <div class="card-title"><span>1. PILIH TARGET PRODUK KIMIA AWAL (300 PRODUK)</span><span>TIER ${initProd.tier}</span></div>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <div>
            <strong style="color:var(--accent-cyan)">${initProd.id}: ${initProd.name}</strong>
            <div class="muted" style="font-size:11px;">Rute Alat: <strong>${initRoute.name}</strong> • Harga: ${fmtUSD(initProd.basePrice)}/u</div>
          </div>
          <button id="btn-world-pick-prod" class="action-btn compact-btn" type="button">Ganti Produk</button>
        </div>
        <div class="reaction-box" style="font-size:11px; padding:6px;">${formatChemHTML(initProd.reaction)}</div>
      </div>
    ` : "";

    const buildOrManageCard = owned
      ? (() => {
          const metrics = Sim.computeFactoryMetrics(regionId);
          return `
            <div class="info-card owned-card">
              <div class="card-title"><span>STATUS KILANG BEROPERASI</span><span>STABILITAS ${metrics.stability}%</span></div>
              <div class="kv-grid">
                <div class="kv-box"><span class="kv-k">PRODUK AKTIF</span><span class="kv-v">${metrics.activeChem.id}</span></div>
                <div class="kv-box"><span class="kv-k">ARUS KAS KILANG</span><span class="kv-v" style="color:var(--accent-emerald)">${fmtRate(metrics.netProfitPerSec)}</span></div>
              </div>
              <button id="btn-enter-factory" class="action-btn accent-emerald" type="button">
                🏭 Masuk ke Interior Pabrik P&amp;ID →
              </button>
              ${!surveyed ? `
                <button id="btn-hire-survey" class="action-btn" type="button" ${Sim.state.cash < Data.SURVEY_COST ? "disabled" : ""}>
                  🧭 [Opsional] Sewa Geologist Susulan ($${Data.SURVEY_COST})
                </button>
              ` : ""}
            </div>
          `;
        })()
      : `
        <div class="info-card">
          <div class="card-title"><span>2. KEPUTUSAN KONSTRUKSI &amp; SURVEI (OPSIONAL)</span><span>${r.isOffshore ? "LEPAS PANTAI" : "DARATAN"}</span></div>
          <div class="kv-grid">
            <div class="kv-box"><span class="kv-k">ESTIMASI LAHAN</span><span class="kv-v">${fmtUSD(r.landBasePrice)}</span></div>
            <div class="kv-box"><span class="kv-k">MODIFIER PONDASI</span><span class="kv-v">${surveyed ? foundModLabel : "??? (Belum Survei)"}</span></div>
          </div>
          <button id="btn-build-factory" class="action-btn accent-emerald" type="button" ${Sim.state.cash < acqCost ? "disabled" : ""}>
            🏗️ Bangun Kilang Sekarang (${surveyed ? fmtUSD(acqCost) : "~" + fmtUSD(acqCost) + " Tanpa Survei"})
          </button>
          ${!surveyed ? `
            <button id="btn-hire-survey" class="action-btn" type="button" ${Sim.state.cash < Data.SURVEY_COST ? "disabled" : ""}>
              🧭 [Opsional] Sewa Geologist &amp; Survei Lahan ($${Data.SURVEY_COST})
            </button>
          ` : ""}
        </div>
      `;

    const geoReportCard = surveyed
      ? `
        <div class="info-card">
          <div class="card-title"><span>LAPORAN GEOLOGIST &amp; RISIKO GEOGRAFIS</span><span>TERBUKA</span></div>
          <div class="report-block">
            <span class="report-label">1. Kondisi Tanah &amp; Topografi (${foundModLabel})</span>
            <p class="report-text">${r.surveyReport.soil}</p>
          </div>
          <div class="report-block">
            <span class="report-label">2. Akses Sumber Daya Alam &amp; Logistik</span>
            <p class="report-text">${r.surveyReport.resources}</p>
          </div>
          <div class="report-block">
            <span class="report-label">3. Risiko Seismik &amp; Bencana (${r.seismicCategory})</span>
            <p class="report-text">${r.surveyReport.risk}</p>
          </div>
          <div class="report-block">
            <span class="report-label">4. Rekomendasi Ahli</span>
            <p class="report-text">${r.surveyReport.recommendation}</p>
          </div>
        </div>
      `
      : `
        <div class="info-card locked-card">
          <div class="lock-banner">
            <span>⚠️</span>
            <span>Data Geoteknik Detail Belum Disurvei (Geologist Opsional)</span>
          </div>
          <div class="kv-grid">
            <div class="kv-box"><span class="kv-k">NEGARA TERDETEKSI</span><span class="kv-v">${r.country}</span></div>
            <div class="kv-box"><span class="kv-k">ZONA SEISMIK</span><span class="kv-v">${r.seismicHazardPct >= 25 ? "Sabuk Cincin Api" : "Kontinental"}</span></div>
          </div>
        </div>
      `;

    const taxCard = `
      <div class="info-card">
        <div class="card-title"><span>PROFIL PAJAK &amp; REGULASI (${r.country.toUpperCase()})</span><span>EKONOMI</span></div>
        <div class="kv-grid">
          <div class="kv-box">
            <span class="kv-k">PAJAK KORPORASI</span>
            <span class="kv-v">${Math.round(r.corporateTaxRate * 100)}% Laba</span>
          </div>
          <div class="kv-box">
            <span class="kv-k">PAJAK KARBON</span>
            <span class="kv-v">$${fmtNum(r.carbonTaxPerTon, 1)} / tCO<sub>2</sub></span>
          </div>
          <div class="kv-box">
            <span class="kv-k">BIAYA LOGISTIK</span>
            <span class="kv-v">$${r.logisticsCostPerSec}/dtk</span>
          </div>
          <div class="kv-box">
            <span class="kv-k">IZIN EKSPANSI TIER</span>
            <span class="kv-v">${fmtUSD(Sim.getExpansionLevy(r.id, 1))}</span>
          </div>
        </div>
      </div>
    `;

    dom.geoBody.innerHTML = productPickerCard + buildOrManageCard + geoReportCard + taxCard;

    const btnPickProd = document.getElementById("btn-world-pick-prod");
    if (btnPickProd) btnPickProd.addEventListener("click", () => { Audio.playClick(); openCatalogModal(); });

    const btnSurvey = document.getElementById("btn-hire-survey");
    if (btnSurvey) {
      btnSurvey.addEventListener("click", () => {
        const res = Sim.surveyRegion(regionId);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playSurvey();
        showToast(`Geologist selesai menyurvei ${r.shortName}!`, "good");
        renderRegionQuickbar();
        renderWorldInspector();
        updateDynamicHUD();
      });
    }

    const btnBuild = document.getElementById("btn-build-factory");
    if (btnBuild) {
      btnBuild.addEventListener("click", () => {
        const res = Sim.purchaseRegion(regionId, initialBuildProductId);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playCoin();
        showToast(`Kilang di ${r.country} resmi beroperasi dengan rute ${initRoute.name}!`, "good");
        renderRegionQuickbar();
        renderWorldInspector();
        updateDynamicHUD();
        switchPhase("pid");
      });
    }

    const btnEnter = document.getElementById("btn-enter-factory");
    if (btnEnter) {
      btnEnter.addEventListener("click", () => {
        Audio.playClick();
        Sim.state.activeFactoryId = regionId;
        switchPhase("pid");
      });
    }
  }

  // ================= TAB 2: KANVAS P&ID & FITUR GANTI ALAT SPESIFIK =================
  function renderFactorySelector() {
    const ownedIds = Object.keys(Sim.state.factories);
    dom.selectFactory.innerHTML = "";
    ownedIds.forEach((id) => {
      const r = Sim.getRegion(id);
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = `${r.name}`;
      if (id === Sim.state.activeFactoryId) opt.selected = true;
      dom.selectFactory.appendChild(opt);
    });

    const activeId = Sim.state.activeFactoryId;
    const metrics = activeId ? Sim.computeFactoryMetrics(activeId) : null;
    if (!metrics) return;

    const r = metrics.region;
    const trendMult = Sim.state.market.trendingMap[metrics.activeChem.id];
    dom.pidRegionBadges.innerHTML = `
      <span class="mini-badge">${r.country} • Pajak: ${Math.round(r.corporateTaxRate * 100)}%</span>
      <span class="mini-badge good">Rute: ${metrics.route.name}</span>
      ${trendMult ? `<span class="mini-badge warn">🔥 TRENDING +${Math.round((trendMult - 1) * 100)}%</span>` : ""}
    `;

    dom.pidTierStatus.textContent = `${metrics.activeChem.id}: ${metrics.activeChem.name} (Rangkaian: ${metrics.installedStageCount}/12 Tahap Alat)`;
    if (!metrics.nextStageInfo) {
      dom.btnExpandLand.textContent = "✓ Rangkaian Alat Maksimal (12/12 Tahap Aktif)";
      dom.btnExpandLand.disabled = true;
    } else {
      const ns = metrics.nextStageInfo;
      dom.btnExpandLand.textContent = `➕ Perpanjang Alat → Tahap #${ns.stageNum}/12: ${ns.unit.tag} (${fmtUSD(ns.cost)})`;
      dom.btnExpandLand.disabled = Sim.state.cash < ns.cost;
    }
  }

  function renderPidQuickbar() {
    const activeId = Sim.state.activeFactoryId;
    const metrics = activeId ? Sim.computeFactoryMetrics(activeId) : null;
    if (!metrics) return;

    dom.pidQuickNodes.innerHTML = "";
    const inspect = Sim.state.activeInspect;
    const stageCount = metrics.installedStageCount || 3;

    Data.EQUIPMENT.forEach((u) => {
      if (u.stageOrder > stageCount + 1) return; // Hanya tampilkan alat terpasang + 1 tahap ekspansi berikutnya
      const stat = metrics.unitStats[u.id];
      const isNextSlot = u.stageOrder === stageCount + 1;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "qnode-btn" +
        (inspect && inspect.id === u.id ? " active" : "") +
        (!stat.active ? " locked-node" : "");
      btn.textContent = stat.active
        ? `${u.tag} (Gen.${stat.genNum})`
        : isNextSlot
          ? `➕ #${u.stageOrder} ${u.tag}`
          : `➕ ${u.tag}`;
      btn.title = `${stat.roleName}: ${stat.genName}`;
      btn.addEventListener("click", () => {
        Audio.playClick();
        Sim.state.activeInspect = { type: "equipment", id: u.id };
        renderPidQuickbar();
        renderEncyclopedia();
      });
      dom.pidQuickNodes.appendChild(btn);
    });

    const prodNodes = ["FEED-01", "PROD-OUT"];
    const prodShortLabels = {
      "FEED-01": "📥 UMPAN",
      "PROD-OUT": "📦 OUTPUT GUDANG"
    };

    prodNodes.forEach((pid) => {
      const pStat = metrics.productStats[pid];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "qnode-btn prod" +
        (inspect && inspect.id === pid ? " active" : "") +
        (!pStat || !pStat.active ? " locked-node" : "");
      btn.textContent = prodShortLabels[pid];
      btn.addEventListener("click", () => {
        Audio.playClick();
        Sim.state.activeInspect = { type: "product", id: pid };
        renderPidQuickbar();
        renderEncyclopedia();
      });
      dom.pidQuickNodes.appendChild(btn);
    });
  }

  function renderEncyclopedia() {
    const activeId = Sim.state.activeFactoryId;
    const metrics = activeId ? Sim.computeFactoryMetrics(activeId) : null;
    const inspect = Sim.state.activeInspect;
    if (!metrics || !inspect) return;

    if (inspect.type === "equipment") {
      const u = Sim.getUnitDef(inspect.id);
      const stat = metrics.unitStats[u.id];
      const spec = Sim.getUnitRouteSpec(activeId, u.id);
      if (!u || !stat || !spec) return;

      const stageBadge = u.stageOrder >= 1 ? `TAHAP #${u.stageOrder}/12` : "UNIT PENDUKUNG";
      dom.encEyebrow.textContent = `${spec.routeName.toUpperCase()} • ${stageBadge} (${u.tag})`;
      dom.encTitle.textContent = `${stat.genName} (Generasi ${stat.genNum}/4)`;
      dom.encSubtitle.textContent = `Fungsi Slot: ${spec.role} • ${stat.active ? "Kalibrasi Level " + stat.level : "Belum Terpasang"}`;

      if (!stat.active) {
        const isNextSeqStage = u.stageOrder === (metrics.installedStageCount || 3) + 1;
        const isOptionalS502 = u.id === "S-502";
        const installCost = isNextSeqStage && metrics.nextStageInfo
          ? metrics.nextStageInfo.cost
          : Math.round((u.installCost || 520) * (Sim.state.market.equipmentPriceMult || 1.0));

        dom.encBody.innerHTML = `
          <div class="info-card" style="border-color:var(--accent-emerald); background:linear-gradient(180deg, rgba(0,230,118,0.10), var(--bg-card));">
            <div class="card-title">
              <span>${isNextSeqStage ? `➕ PERPANJANG RANGKAIAN ALAT KE TAHAP #${u.stageOrder}/12` : isOptionalS502 ? "➕ PASANG UNIT DAUR ULANG S-502" : `🔒 TAHAP #${u.stageOrder}/12 BELUM TERBUKA`}</span>
              <span>${u.tag}</span>
            </div>
            <div style="font-size:13px; font-weight:700; color:#fff;">
              Alat: <span style="color:var(--accent-emerald)">${spec.curGen.name}</span>
            </div>
            <p style="font-size:11.8px; color:#d1fae5;">${spec.curGen.desc}</p>
            ${isNextSeqStage ? `
              <div class="kv-grid">
                <div class="kv-box"><span class="kv-k">BONUS PANJANG RANGKAIAN</span><span class="kv-v" style="color:var(--accent-emerald)">+18% Yield Produksi</span></div>
                <div class="kv-box"><span class="kv-k">BONUS KEMURNIAN</span><span class="kv-v" style="color:var(--accent-cyan)">+1,75% Purity Dasar</span></div>
              </div>
              <button id="btn-install-stage-unit" class="action-btn accent-emerald" type="button" ${Sim.state.cash < installCost ? "disabled" : ""}>
                ➕ Pasang Tahap #${u.stageOrder}/12: ${spec.curGen.name} (${fmtUSD(installCost)})
              </button>
            ` : isOptionalS502 ? `
              <div class="kv-grid">
                <div class="kv-box"><span class="kv-k">HEMAT BAHAN BAKU</span><span class="kv-v" style="color:var(--accent-emerald)">-${Math.round((spec.curGen.feedSaving || 0.1) * 100)}% Konsumsi</span></div>
                <div class="kv-box"><span class="kv-k">REDUKSI EMISI TAMBAHAN</span><span class="kv-v" style="color:var(--accent-cyan)">-12% Emisi Gas Buang</span></div>
              </div>
              <button id="btn-install-stage-unit" class="action-btn accent-emerald" type="button" ${Sim.state.cash < installCost ? "disabled" : ""}>
                ➕ Pasang ${spec.curGen.name} (${fmtUSD(installCost)})
              </button>
            ` : `
              <p class="muted">Pasang peralatan tahap sebelumnya terlebih dahulu secara berurutan (Saat ini baru ${metrics.installedStageCount}/12 Tahap terpasang).</p>
            `}
          </div>
          <div class="info-card">
            <div class="card-title"><span>4 GENERASI ALAT SPESIFIK PADA SLOT ${u.tag}</span></div>
            ${spec.allGens.map((g) => `
              <div style="padding:6px; border-left:3px solid var(--accent-cyan); background:rgba(0,0,0,0.25); font-size:11.5px;">
                <strong>Gen ${g.gen}: ${g.name}</strong>
                <div class="muted">${g.desc}</div>
              </div>
            `).join("")}
          </div>
        `;

        const btnInst = document.getElementById("btn-install-stage-unit");
        if (btnInst) {
          btnInst.addEventListener("click", () => {
            const res = Sim.installOptionalUnit(activeId, u.id);
            if (!res.ok) {
              Audio.playError();
              showToast(res.reason, "error");
              return;
            }
            Audio.playUpgrade();
            showToast(`${u.tag} (${spec.curGen.name}) berhasil dipasang ke rangkaian pabrik!`, "good");
            renderFactorySelector();
            renderPidQuickbar();
            renderEncyclopedia();
            updateDynamicHUD();
          });
        }
        return;
      }

      // Kartu Fitur Utama: GANTI ALAT KE GENERASI LEBIH CANGGIH!
      const replaceBlockHtml = spec.nextGen
        ? `
          <div class="info-card" style="border-color:var(--accent-emerald); background:linear-gradient(180deg, rgba(0,230,118,0.10), var(--bg-card));">
            <div class="card-title">
              <span>🔄 GANTI ALAT KE TEKNOLOGI LEBIH CANGGIH</span>
              <span>GEN ${stat.genNum} → GEN ${spec.nextGen.gen}</span>
            </div>
            <div style="font-size:13px; font-weight:700; color:#fff;">
              Model Baru: <span style="color:var(--accent-emerald)">${spec.nextGen.name}</span>
            </div>
            <p style="font-size:11.8px; color:#d1fae5;">${spec.nextGen.desc}</p>
            ${u.id === "S-501" ? `
              <div class="kv-box"><span class="kv-k">DAYA TANGKAP EMISI CO2</span><span class="kv-v" style="color:var(--accent-emerald)">Naik ke ${Math.round(spec.nextGen.captureBase * 100)}%+</span></div>
            ` : u.id === "S-502" ? `
              <div class="kv-box"><span class="kv-k">PENGHEMATAN BAHAN BAKU</span><span class="kv-v" style="color:var(--accent-emerald)">Hemat ${Math.round(spec.nextGen.feedSaving * 100)}%+ Umpan</span></div>
            ` : `
              <div class="kv-grid">
                <div class="kv-box"><span class="kv-k">LONJAKAN KAPASITAS</span><span class="kv-v" style="color:var(--accent-emerald)">${spec.curGen.capMult}x → ${spec.nextGen.capMult}x</span></div>
                <div class="kv-box"><span class="kv-k">BATAS KEMURNIAN MAKS</span><span class="kv-v" style="color:var(--accent-cyan)">Maks ${spec.nextGen.maxPurityCap}% (${spec.nextGen.maxPurityCap > 92 ? "Grade A" : "Grade B"})</span></div>
              </div>
            `}
            <button id="btn-replace-equip" class="action-btn accent-emerald" type="button" ${Sim.state.cash < stat.replaceCost ? "disabled" : ""}>
              🔄 Ganti Alat ke ${spec.nextGen.name} (${fmtUSD(stat.replaceCost)})
            </button>
          </div>
        `
        : `
          <div class="info-card owned-card">
            <div class="card-title"><span>STATUS TEKNOLOGI ALAT</span><span>GENERASI 4 (MAKSIMAL)</span></div>
            <p class="muted">Alat pada slot ini sudah menggunakan teknologi paling canggih (State-of-the-Art Gen 4) untuk rute <strong>${spec.routeName}</strong>!</p>
          </div>
        `;

      const allGensRoadmapHtml = spec.allGens.map((g) => {
        const isCurrent = g.gen === stat.genNum;
        const isPassed = g.gen < stat.genNum;
        return `
          <div style="padding:6px 8px; border-left:3px solid ${isCurrent ? "var(--accent-cyan)" : isPassed ? "var(--accent-emerald)" : "var(--border-dim)"}; background:${isCurrent ? "rgba(0,229,255,0.1)" : "rgba(0,0,0,0.2)"}; font-size:11px;">
            <strong style="color:${isCurrent ? "#fff" : isPassed ? "var(--accent-emerald)" : "var(--text-secondary)"}">
              ${isCurrent ? "▶ [TERPASANG] " : isPassed ? "✓ " : "○ "}Generasi ${g.gen}: ${g.name}
            </strong>
            <div class="muted" style="font-size:10.5px;">${g.desc}</div>
          </div>
        `;
      }).join("");

      const nextNote = u.upgradeNotes[(stat.level - 1) % u.upgradeNotes.length];
      const nextStageBanner = metrics.nextStageInfo
        ? `
          <div class="info-card" style="border-color:var(--accent-cyan);">
            <div class="card-title">
              <span>➕ PERPANJANG RANGKAIAN ALAT (${metrics.installedStageCount}/12 TAHAP)</span>
              <span>TAHAP #${metrics.nextStageInfo.stageNum}</span>
            </div>
            <div style="font-size:12px;">
              Tahap Berikutnya: <strong style="color:var(--accent-cyan)">${metrics.nextStageInfo.unit.tag} — ${metrics.nextStageInfo.routeSpec.curGen.name}</strong>
            </div>
            <button id="btn-enc-extend-chain" class="action-btn" type="button" ${Sim.state.cash < metrics.nextStageInfo.cost ? "disabled" : ""}>
              ➕ Pasang Tahap #${metrics.nextStageInfo.stageNum}/12 (${fmtUSD(metrics.nextStageInfo.cost)})
            </button>
          </div>
        `
        : "";

      dom.encBody.innerHTML = `
        ${replaceBlockHtml}
        ${nextStageBanner}

        <div class="info-card">
          <div class="card-title"><span>TELEMETRI ALAT TERPASANG</span><span>GEN.${stat.genNum} • LV.${stat.level}</span></div>
          <p class="muted" style="font-size:11.5px;">${stat.genDesc}</p>
          <div class="kv-grid">
            <div class="kv-box">
              <span class="kv-k">SUHU &amp; TEKANAN</span>
              <span class="kv-v">${Math.round(stat.temp)}°C • ${fmtNum(stat.pressure, 1)} bar</span>
            </div>
            <div class="kv-box">
              <span class="kv-k">${u.id === "S-501" ? "SERAPAN EMISI" : u.id === "S-502" ? "HEMAT BAHAN BAKU" : "KAPASITAS ALIRAN"}</span>
              <span class="kv-v">${u.id === "S-501" ? Math.round(metrics.captureRatio * 100) + "% CO2" : u.id === "S-502" ? Math.round((metrics.feedSavingRatio || 0) * 100) + "% Umpan" : fmtNum(stat.capacity, 1) + " t/jam"}</span>
            </div>
          </div>
          <div class="upgrade-preview">
            <strong>Kalibrasi Level ${stat.level + 1}:</strong> ${nextNote}
          </div>
          <button id="btn-upgrade-unit" class="action-btn accent-purple" type="button" ${Sim.state.cash < stat.nextCost ? "disabled" : ""}>
            ⚙️ Kalibrasi &amp; Tingkatkan Level ${stat.level + 1} (${fmtUSD(stat.nextCost)})
          </button>
        </div>

        <div class="info-card">
          <div class="card-title"><span>PERSAMAAN REAKSI PRODUK (${metrics.activeChem.id})</span></div>
          <div class="reaction-box">${formatChemHTML(metrics.activeChem.reaction)}</div>
        </div>

        <div class="info-card">
          <div class="card-title"><span>DAFTAR 4 GENERASI ALAT PADA SLOT ${u.tag}</span></div>
          <div style="display:flex; flex-direction:column; gap:5px;">${allGensRoadmapHtml}</div>
        </div>
      `;

      const btnExtChain = document.getElementById("btn-enc-extend-chain");
      if (btnExtChain) {
        btnExtChain.addEventListener("click", () => {
          const res = Sim.extendProcessChain(activeId);
          if (!res.ok) {
            Audio.playError();
            showToast(res.reason, "error");
            return;
          }
          Audio.playUpgrade();
          showToast(`Rangkaian alat diperpanjang ke Tahap #${res.stageNum}/12: ${res.unit.tag} (${res.routeSpec.curGen.name})!`, "good");
          renderFactorySelector();
          renderPidQuickbar();
          renderEncyclopedia();
          updateDynamicHUD();
        });
      }

      const btnRep = document.getElementById("btn-replace-equip");
      if (btnRep) {
        btnRep.addEventListener("click", () => {
          const res = Sim.replaceUnitEquipment(activeId, u.id);
          if (!res.ok) {
            Audio.playError();
            showToast(res.reason, "error");
            return;
          }
          Audio.playUpgrade();
          showToast(`Slot ${u.tag} diganti ke Generasi ${res.newGen.gen}: ${res.newGen.name}!`, "good");
          renderFactorySelector();
          renderPidQuickbar();
          renderEncyclopedia();
          updateDynamicHUD();
        });
      }

      const btnUp = document.getElementById("btn-upgrade-unit");
      if (btnUp) {
        btnUp.addEventListener("click", () => {
          const res = Sim.upgradeUnit(activeId, u.id);
          if (!res.ok) {
            Audio.playError();
            showToast(res.reason, "error");
            return;
          }
          Audio.playUpgrade();
          showToast(`${stat.genName} dikalibrasi ke Level ${res.newLevel}!`, "good");
          renderFactorySelector();
          renderPidQuickbar();
          renderEncyclopedia();
          updateDynamicHUD();
        });
      }
      return;
    }

    // JIKA PRODUK / BAHAN BAKU DIKLIK
    const prod = Sim.getProductDef(inspect.id);
    const pStat = metrics.productStats[inspect.id];
    if (!prod || !pStat) return;

    const whStock = prod.chemId && Sim.state.warehouse.products[prod.chemId]
      ? Sim.state.warehouse.products[prod.chemId].qty
      : 0;

    dom.encEyebrow.textContent = `ENSIKLOPEDIA PRODUK & GUDANG • ${prod.tag}`;
    dom.encTitle.textContent = prod.name;
    dom.encSubtitle.textContent = prod.isFeedstock ? "Bahan Baku Umpan Hulu" : Data.TIER_NAMES[prod.tier];

    if (!pStat.active) {
      const targetRegionalGross = prod.basePrice * (prod.tier >= 3 ? metrics.region.bonuses.tier34PriceMult : 1);
      const targetRegionalNet = targetRegionalGross * (1 - metrics.region.corporateTaxRate);
      dom.encBody.innerHTML = `
        <div class="info-card locked-card">
          <div class="lock-banner"><span>🔒</span><span>Jalur Tier ${prod.tier} Belum Aktif</span></div>
          <p class="muted">Perluas lahan pabrik ke Tier ${prod.tier} atau pilih produk dari Katalog 300 Produk Kimia.</p>
          <div class="kv-grid">
            <div class="kv-box"><span class="kv-k">HARGA TARGET GRADE A</span><span class="kv-v">${fmtUSD(targetRegionalGross)}/unit</span></div>
            <div class="kv-box"><span class="kv-k">EST. BERSIH SETELAH PAJAK</span><span class="kv-v" style="color:var(--accent-emerald)">${fmtUSD(targetRegionalNet)}/unit</span></div>
          </div>
        </div>
        <div class="info-card">
          <div class="card-title"><span>RUMUS &amp; REAKSI KIMIA</span></div>
          <div class="formula-box">${formatChemHTML(prod.formula)}</div>
          ${prod.reaction ? `<div class="reaction-box">${formatChemHTML(prod.reaction)}</div>` : ""}
        </div>
        <div class="info-card">
          <div class="card-title"><span>APLIKASI DI INDUSTRI DUNIA NYATA</span></div>
          <div class="realworld-box">${prod.realWorldApp}</div>
        </div>
      `;
      return;
    }

    const taxPct = Math.round(metrics.region.corporateTaxRate * 100);
    dom.encBody.innerHTML = `
      <div class="info-card">
        <div class="card-title"><span>RUMUS &amp; REAKSI KIMIA</span><span>${prod.tag}</span></div>
        <div class="formula-box">${formatChemHTML(prod.formula)}</div>
        ${prod.reaction ? `<div class="reaction-box">${formatChemHTML(prod.reaction)}</div>` : ""}
      </div>

      <div class="info-card">
        <div class="card-title"><span>KEMURNIAN (GRADE) &amp; STOK GUDANG</span><span>${fmtNum(pStat.purity, 1)}%</span></div>
        <div>
          <span class="grade-badge ${pStat.gradeInfo.cssClass}">${pStat.gradeInfo.label}</span>
        </div>
        <div class="kv-grid">
          <div class="kv-box">
            <span class="kv-k">HARGA PASAR KOTOR</span>
            <span class="kv-v">${prod.isFeedstock ? fmtUSD(prod.basePrice) + "/t" : fmtUSD(pStat.unitMarketPriceGross) + "/unit"}</span>
          </div>
          <div class="kv-box">
            <span class="kv-k">HARGA BERSIH (-${taxPct}% PAJAK)</span>
            <span class="kv-v" style="color:var(--accent-emerald)">${prod.isFeedstock ? "Umpan Proses" : fmtUSD(pStat.unitMarketPriceNet) + "/unit"}</span>
          </div>
          <div class="kv-box">
            <span class="kv-k">LAJU MASUK GUDANG</span>
            <span class="kv-v">${prod.isFeedstock ? fmtNum(metrics.rawStock.qty, 1) + " ton" : fmtNum(pStat.warehouseRatePerSec || 0, 2) + " u/dtk"}</span>
          </div>
          <div class="kv-box">
            <span class="kv-k">TERSEDIA DI GUDANG</span>
            <span class="kv-v" style="color:var(--accent-cyan)">${prod.isFeedstock ? fmtNum(metrics.rawStock.qty, 1) + " ton" : fmtNum(whStock, 1) + " unit"}</span>
          </div>
        </div>
        ${!prod.isFeedstock ? `
          <button id="btn-goto-market-sell" class="action-btn accent-emerald" type="button">
            🚢 Jual Berapapun di Market Global (Incoterms) →
          </button>
        ` : `
          <button id="btn-goto-market-buy" class="action-btn" type="button">
            📦 Beli Bahan Baku dari Produsen Global →
          </button>
        `}
      </div>

      <div class="info-card">
        <div class="card-title"><span>APLIKASI DI INDUSTRI DUNIA NYATA</span><span>NILAI TAMBAH</span></div>
        <div class="realworld-box">${prod.realWorldApp}</div>
      </div>
    `;

    const btnSell = document.getElementById("btn-goto-market-sell");
    if (btnSell) {
      btnSell.addEventListener("click", () => {
        Audio.playClick();
        if (prod.chemId) marketForm.sellProductId = prod.chemId;
        switchPhase("market");
      });
    }
    const btnBuy = document.getElementById("btn-goto-market-buy");
    if (btnBuy) {
      btnBuy.addEventListener("click", () => {
        Audio.playClick();
        switchPhase("market");
      });
    }
  }

  // ================= TAB 3: GUDANG & MARKET GLOBAL (JUAL BERAPAPUN!) =================
  function renderMarketDashboard() {
    const activeRegion = Sim.getRegion(Sim.state.activeFactoryId || Sim.state.selectedRegionId);

    const trendingHtml = Sim.state.market.trendingList.map((t) => {
      const pct = Math.round((t.mult - 1) * 100);
      return `
        <div class="trend-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:var(--accent-amber); font-family:var(--font-mono); font-size:11px;">🔥 ${t.product.id} (Tier ${t.product.tier})</strong>
            <span class="mini-badge warn">+${pct}% HARGA</span>
          </div>
          <strong style="font-size:12.5px;">${t.product.name}</strong>
          <span class="muted" style="font-size:11px;">Harga Booming: <strong>${fmtUSD(t.product.basePrice * t.mult)}/u</strong></span>
          <button data-prod="${t.product.id}" class="action-btn compact-btn btn-trend-produce" type="button" style="margin-top:4px;">
            🎯 Produksi Ini di Pabrik
          </button>
        </div>
      `;
    }).join("");

    // Tampilkan semua produk yang ada stoknya + produk aktif + produk trending agar bebas pilih jual apa saja & berapapun!
    const activeFactory = Sim.state.factories[Sim.state.activeFactoryId];
    const activeProdId = activeFactory ? activeFactory.activeProductId : "CHEM-001";
    const candidateProds = Catalog.PRODUCTS.filter((p) => {
      const st = Sim.state.warehouse.products[p.id];
      return (st && st.qty > 0) || p.id === marketForm.sellProductId || p.id === activeProdId || Sim.state.market.trendingMap[p.id];
    });

    const whProductsListHtml = candidateProds.map((p) => {
      const st = Sim.state.warehouse.products[p.id] || { qty: 0, purity: 80 };
      const tMult = Sim.state.market.trendingMap[p.id];
      return `<option value="${p.id}" ${p.id === marketForm.sellProductId ? "selected" : ""}>
        ${p.id} ${p.name} — Stok Gudang: ${fmtNum(st.qty, 1)} unit (Kemurnian ${fmtNum(st.purity, 1)}%)${tMult ? " 🔥TRENDING" : ""}
      </option>`;
    }).join("");

    const curProdStock = Sim.state.warehouse.products[marketForm.sellProductId] || { qty: 0, purity: 76 };
    const availStockQty = Number(curProdStock.qty) || 0;
    const isStockEmpty = availStockQty <= 0.0001;
    const sellQtyVal = isStockEmpty
      ? 0
      : Math.min(availStockQty, Math.max(0.01, Number(marketForm.sellQty) || availStockQty));

    const gradeInfo = curProdStock.purity < 80
      ? { grade: "Grade C", multiplier: 0.50 }
      : curProdStock.purity <= 92
        ? { grade: "Grade B", multiplier: 0.80 }
        : { grade: "Grade A", multiplier: 1.00 };

    const exportQuote = Data.calculateExportQuote(
      marketForm.sellProductId,
      isStockEmpty ? 1 : sellQtyVal,
      curProdStock.purity,
      gradeInfo,
      marketForm.sellDestId,
      marketForm.sellModeId,
      marketForm.sellIncotermId,
      activeRegion.lat,
      activeRegion.lon,
      Sim.state.market.trendingMap[marketForm.sellProductId] || 1.0,
      activeRegion.corporateTaxRate
    );

    const netReceived = isStockEmpty ? 0 : Math.round(exportQuote.netRevenue);

    const buyQuote = Data.calculateProcurementQuote(
      marketForm.buySupplierId,
      marketForm.buyFeedstockId,
      marketForm.buyQty,
      marketForm.buyModeId,
      marketForm.buyIncotermId,
      activeRegion.lat,
      activeRegion.lon
    );

    const rawStockBadges = Catalog.RAW_FEEDSTOCKS.map((f) => {
      const st = Sim.state.warehouse.rawMaterials[f.id] || { qty: 0, purity: 80 };
      return `
        <div class="kv-box">
          <span class="kv-k">${f.name.toUpperCase()}</span>
          <span class="kv-v" style="color:${st.qty < 10 ? "var(--accent-crimson)" : "var(--accent-cyan)"}">
            ${fmtNum(st.qty, 1)} ton (${fmtNum(st.purity, 0)}%)
          </span>
        </div>
      `;
    }).join("");

    const logsHtml = Sim.state.warehouse.shipmentLogs.length === 0
      ? `<p class="muted">Belum ada riwayat pengiriman kargo Incoterms.</p>`
      : Sim.state.warehouse.shipmentLogs.map((l) => `
          <div style="font-size:11.5px; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
            <strong style="color:${l.type === "JUAL" ? "var(--accent-emerald)" : "var(--accent-cyan)"}">[Hari #${l.day} • ${l.type}]</strong> ${l.text}
          </div>
        `).join("");

    dom.marketDashboard.innerHTML = `
      <div class="dash-panel">
        <div class="dash-panel-header">
          <div>
            <span class="eyebrow">BURSA KOMODITAS KIMIA GLOBAL (300 KOMODITAS)</span>
            <h3>🔥 Radar Produk Kimia Sedang Trending Hari Ini</h3>
          </div>
          <button id="btn-market-open-catalog" class="action-btn compact-btn" type="button">
            🧪 Jelajahi Semua 300 Produk Kimia
          </button>
        </div>
        <div class="trending-strip">${trendingHtml}</div>
      </div>

      <div class="dash-grid-2">
        <!-- PANEL KIRI: JUAL PRODUK SESUAI STOK RIIL DI GUDANG -->
        <div class="dash-panel">
          <div class="dash-panel-header">
            <div>
              <span class="eyebrow">GUDANG PRODUK JADI &amp; EKSPOR INCOTERMS</span>
              <h3>🚢 Jual Stok Produk Gudang ke Negara Tujuan (Incoterms 2020)</h3>
            </div>
            <span class="mini-badge ${isStockEmpty ? "danger" : "good"}">Stok: ${fmtNum(availStockQty, 2)} Unit</span>
          </div>

          <div class="form-row">
            <label>1. PILIH PRODUK DI GUDANG YANG AKAN DIJUAL:</label>
            <select id="mkt-sell-prod" class="scada-select">${whProductsListHtml}</select>
          </div>

          <div class="form-row">
            <label>2. JUMLAH UNIT PENJUALAN (MAKSIMAL SESUAI STOK GUDANG: ${fmtNum(availStockQty, 2)} UNIT):</label>
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
              <input id="mkt-sell-qty" class="scada-input" type="number" step="any" min="0" max="${availStockQty.toFixed(2)}" value="${sellQtyVal.toFixed(2)}" style="flex:1; min-width:110px;" ${isStockEmpty ? "disabled" : ""} />
              <button data-qset="ALL" class="ctrl-btn btn-qty-preset" type="button" ${isStockEmpty ? "disabled" : ""} title="Jual 100% Stok Gudang">100% Stok (${fmtNum(availStockQty, 2)}u)</button>
              <button data-qset="HALF" class="ctrl-btn btn-qty-preset" type="button" ${isStockEmpty ? "disabled" : ""}>50% Stok</button>
              <button data-qset="QUARTER" class="ctrl-btn btn-qty-preset" type="button" ${isStockEmpty ? "disabled" : ""}>25% Stok</button>
              <button data-qset="1" class="ctrl-btn btn-qty-preset" type="button" ${availStockQty < 1 ? "disabled" : ""}>1u</button>
              <button data-qset="10" class="ctrl-btn btn-qty-preset" type="button" ${availStockQty < 10 ? "disabled" : ""}>10u</button>
            </div>
            ${isStockEmpty ? `<div style="font-size:11px; color:var(--accent-crimson); font-weight:600; margin-top:4px;">⚠️ Stok produk ini di Gudang masih 0 unit! Jalankan produksi di Pabrik P&amp;ID terlebih dahulu sebelum menjual.</div>` : ""}
          </div>

          <div class="kv-grid">
            <div class="form-row">
              <label>3. NEGARA TUJUAN PEMBELI:</label>
              <select id="mkt-sell-dest" class="scada-select">
                ${Data.EXPORT_DESTINATIONS.map((d) => `
                  <option value="${d.id}" ${d.id === marketForm.sellDestId ? "selected" : ""}>
                    ${d.country} — ${d.name} (Bea ${Math.round(d.customsDuty * 100)}%, +${Math.round((d.priceBonus - 1) * 100)}%)
                  </option>
                `).join("")}
              </select>
            </div>
            <div class="form-row">
              <label>4. MODA TRANSPORTASI:</label>
              <select id="mkt-sell-mode" class="scada-select">
                ${Data.TRANSPORT_MODES.map((m) => `
                  <option value="${m.id}" ${m.id === marketForm.sellModeId ? "selected" : ""}>${m.name}</option>
                `).join("")}
              </select>
            </div>
          </div>

          <div class="form-row">
            <label>5. PILIH ATURAN INCOTERMS 2020:</label>
            <select id="mkt-sell-inco" class="scada-select">
              ${Data.INCOTERMS.map((i) => `
                <option value="${i.id}" ${i.id === marketForm.sellIncotermId ? "selected" : ""}>${i.name}</option>
              `).join("")}
            </select>
          </div>

          <div class="quote-summary-box">
            <div class="card-title">
              <span>SIMULASI KONTRAK EKSPOR (${exportQuote.incoterm.code} • ${fmtNum(sellQtyVal, 2)} UNIT)</span>
              <span>JARAK: ${exportQuote.distKm.toLocaleString("id-ID")} KM</span>
            </div>
            <div class="kv-grid">
              <div class="kv-box"><span class="kv-k">STOK TERSEDIA DI GUDANG</span><span class="kv-v" style="color:${isStockEmpty ? "var(--accent-crimson)" : "var(--accent-cyan)"}">${fmtNum(availStockQty, 2)} unit</span></div>
              <div class="kv-box"><span class="kv-k">NILAI KONTRAK KOTOR</span><span class="kv-v">${isStockEmpty ? "$0" : fmtUSD(exportQuote.grossContractRevenue)}</span></div>
              <div class="kv-box"><span class="kv-k">ONGKOS ANGKUT &amp; CUKAI KITA</span><span class="kv-v" style="color:var(--accent-amber)">${isStockEmpty ? "$0" : "-" + fmtUSD(exportQuote.sellerFreightCost + exportQuote.sellerInsuranceCost + exportQuote.sellerCustomsCost + exportQuote.modeMismatchPenalty)}</span></div>
              <div class="kv-box"><span class="kv-k">KAS BERSIH DITERIMA</span><span class="kv-v" style="color:${isStockEmpty ? "var(--text-muted)" : "var(--accent-emerald)"}">+${fmtUSD(netReceived)}</span></div>
            </div>
            <div style="font-size:11px; color:#bae6fd; padding-top:3px;">${exportQuote.advice}</div>
          </div>

          <button id="btn-exec-export" class="action-btn accent-emerald" type="button" ${isStockEmpty ? "disabled" : ""}>
            ${isStockEmpty
              ? "🚫 Stok Gudang Kosong (0 Unit) — Tidak Dapat Menjual"
              : `🚢 Eksekusi Kontrak Jual ${fmtNum(sellQtyVal, 2)} Unit via ${exportQuote.incoterm.code} (+${fmtUSD(netReceived)})`}
          </button>
        </div>

        <!-- PANEL KANAN: BELI BAHAN BAKU DARI PRODUSEN GLOBAL -->
        <div class="dash-panel">
          <div class="dash-panel-header">
            <div>
              <span class="eyebrow">GUDANG BAHAN BAKU &amp; PROCUREMENT</span>
              <h3>📦 Beli Bahan Baku dari Produsen Global (Grade &amp; Incoterms)</h3>
            </div>
          </div>

          <div class="kv-grid">${rawStockBadges}</div>

          <div class="form-row">
            <label>1. PILIH PRODUSEN / SUPPLIER GLOBAL (BEDA GRADE &amp; HARGA):</label>
            <select id="mkt-buy-sup" class="scada-select">
              ${Data.SUPPLIERS.map((s) => `
                <option value="${s.id}" ${s.id === marketForm.buySupplierId ? "selected" : ""}>
                  ${s.name} (${s.country}) — ${s.grade} (Kemurnian ${s.purity}%, Harga ${Math.round(s.priceMult * 100)}%)
                </option>
              `).join("")}
            </select>
          </div>

          <div class="kv-grid">
            <div class="form-row">
              <label>2. JENIS BAHAN BAKU:</label>
              <select id="mkt-buy-feed" class="scada-select">
                ${Catalog.RAW_FEEDSTOCKS.map((f) => `
                  <option value="${f.id}" ${f.id === marketForm.buyFeedstockId ? "selected" : ""}>${f.name} ($${f.baseCost}/t)</option>
                `).join("")}
              </select>
            </div>
            <div class="form-row">
              <label>3. VOLUME PEMBELIAN (TON):</label>
              <select id="mkt-buy-qty" class="scada-select">
                ${[25, 40, 80, 150, 300, 600].map((q) => `
                  <option value="${q}" ${q === Number(marketForm.buyQty) ? "selected" : ""}>${q} Ton</option>
                `).join("")}
              </select>
            </div>
          </div>

          <div class="kv-grid">
            <div class="form-row">
              <label>4. MODA PENGIRIMAN KE PABRIK:</label>
              <select id="mkt-buy-mode" class="scada-select">
                ${Data.TRANSPORT_MODES.map((m) => `
                  <option value="${m.id}" ${m.id === marketForm.buyModeId ? "selected" : ""}>${m.name}</option>
                `).join("")}
              </select>
            </div>
            <div class="form-row">
              <label>5. INCOTERMS PEMBELIAN:</label>
              <select id="mkt-buy-inco" class="scada-select">
                ${Data.INCOTERMS.map((i) => `
                  <option value="${i.id}" ${i.id === marketForm.buyIncotermId ? "selected" : ""}>${i.name}</option>
                `).join("")}
              </select>
            </div>
          </div>

          <div class="quote-summary-box">
            <div class="card-title">
              <span>RINCIAN BIAYA IMPOR BAHAN BAKU (${buyQuote.supplier.grade})</span>
              <span>JARAK: ${buyQuote.distKm.toLocaleString("id-ID")} KM</span>
            </div>
            <div class="kv-grid">
              <div class="kv-box"><span class="kv-k">HARGA BARANG SUPPLIER</span><span class="kv-v">${fmtUSD(buyQuote.goodsCost)}</span></div>
              <div class="kv-box"><span class="kv-k">ONGKOS ANGKUT KITA</span><span class="kv-v">${fmtUSD(buyQuote.buyerFreightCost)}</span></div>
              <div class="kv-box"><span class="kv-k">ASURANSI &amp; BEA MASUK</span><span class="kv-v">${fmtUSD(buyQuote.buyerInsuranceCost + buyQuote.customsDutyCost)}</span></div>
              <div class="kv-box"><span class="kv-k">TOTAL TAGIHAN (${fmtUSD(buyQuote.costPerTon)}/t)</span><span class="kv-v" style="color:var(--accent-amber)">${fmtUSD(buyQuote.totalCost)}</span></div>
            </div>
          </div>

          <button id="btn-exec-procure" class="action-btn" type="button" ${Sim.state.cash < buyQuote.totalCost ? "disabled" : ""}>
            📦 Pesan &amp; Kirim ${buyQuote.qtyTons} Ton ke Gudang Pabrik (-${fmtUSD(buyQuote.totalCost)})
          </button>
        </div>
      </div>

      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3>📋 Buku Besar Logistik &amp; Riwayat Pengapalan Incoterms</h3>
        </div>
        <div>${logsHtml}</div>
      </div>
    `;

    const btnOpenCat = document.getElementById("btn-market-open-catalog");
    if (btnOpenCat) btnOpenCat.addEventListener("click", openCatalogModal);

    dom.marketDashboard.querySelectorAll(".btn-trend-produce").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectProductForActiveFactory(btn.getAttribute("data-prod"));
      });
    });

    dom.marketDashboard.querySelectorAll(".btn-qty-preset").forEach((btn) => {
      btn.addEventListener("click", () => {
        Audio.playClick();
        const qset = btn.getAttribute("data-qset");
        if (availStockQty <= 0.0001) {
          marketForm.sellQty = 0;
        } else if (qset === "ALL") {
          marketForm.sellQty = Number(availStockQty.toFixed(2));
        } else if (qset === "HALF") {
          marketForm.sellQty = Number(Math.max(0.01, availStockQty * 0.5).toFixed(2));
        } else if (qset === "QUARTER") {
          marketForm.sellQty = Number(Math.max(0.01, availStockQty * 0.25).toFixed(2));
        } else {
          marketForm.sellQty = Number(Math.min(availStockQty, Number(qset)).toFixed(2));
        }
        renderMarketDashboard();
      });
    });

    ["mkt-sell-prod", "mkt-sell-qty", "mkt-sell-dest", "mkt-sell-mode", "mkt-sell-inco"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", () => {
        const chosenProdId = document.getElementById("mkt-sell-prod").value;
        const prodChanged = chosenProdId !== marketForm.sellProductId;
        marketForm.sellProductId = chosenProdId;
        const newStock = Sim.state.warehouse.products[chosenProdId] || { qty: 0, purity: 76 };
        const maxAvail = Number(newStock.qty) || 0;
        if (maxAvail <= 0.0001) {
          marketForm.sellQty = 0;
        } else if (prodChanged) {
          marketForm.sellQty = Number(maxAvail.toFixed(2));
        } else {
          const rawVal = Number(document.getElementById("mkt-sell-qty").value) || 0;
          marketForm.sellQty = Number(Math.min(maxAvail, Math.max(0.01, rawVal)).toFixed(2));
        }
        marketForm.sellDestId = document.getElementById("mkt-sell-dest").value;
        marketForm.sellModeId = document.getElementById("mkt-sell-mode").value;
        marketForm.sellIncotermId = document.getElementById("mkt-sell-inco").value;
        renderMarketDashboard();
      });
    });

    ["mkt-buy-sup", "mkt-buy-feed", "mkt-buy-qty", "mkt-buy-mode", "mkt-buy-inco"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", () => {
        marketForm.buySupplierId = document.getElementById("mkt-buy-sup").value;
        marketForm.buyFeedstockId = document.getElementById("mkt-buy-feed").value;
        marketForm.buyQty = Number(document.getElementById("mkt-buy-qty").value) || 40;
        marketForm.buyModeId = document.getElementById("mkt-buy-mode").value;
        marketForm.buyIncotermId = document.getElementById("mkt-buy-inco").value;
        renderMarketDashboard();
      });
    });

    const btnExport = document.getElementById("btn-exec-export");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        const currentInputQty = Number(document.getElementById("mkt-sell-qty").value) || 0;
        marketForm.sellQty = currentInputQty;
        const res = Sim.sellWarehouseProduct(
          marketForm.sellProductId,
          currentInputQty,
          marketForm.sellDestId,
          marketForm.sellModeId,
          marketForm.sellIncotermId
        );
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playShipHorn();
        Audio.playCoin();
        showToast(`Kontrak ${res.quote.incoterm.code} (${fmtNum(res.quote.soldQty, 2)} unit) ke ${res.quote.destination.country} selesai! Kas +${fmtUSD(res.quote.netRevenue)}`, "good");
        const remainingStock = Sim.state.warehouse.products[marketForm.sellProductId];
        marketForm.sellQty = remainingStock && remainingStock.qty > 0 ? Number(remainingStock.qty.toFixed(2)) : 0;
        renderMarketDashboard();
        updateDynamicHUD();
      });
    }

    const btnProcure = document.getElementById("btn-exec-procure");
    if (btnProcure) {
      btnProcure.addEventListener("click", () => {
        const res = Sim.procureRawMaterial(
          marketForm.buySupplierId,
          marketForm.buyFeedstockId,
          marketForm.buyQty,
          marketForm.buyModeId,
          marketForm.buyIncotermId
        );
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playShipHorn();
        if (res.transitIncident) {
          showToast(res.transitIncident, "warn");
        } else {
          showToast(`${res.deliveredTons} ton ${res.quote.feedstock.name} (${res.quote.supplier.grade}) tiba di gudang!`, "good");
        }
        renderMarketDashboard();
        updateDynamicHUD();
      });
    }
  }

  // ================= MODAL CV LENGKAP & WAWANCARA DIALOG INTERAKTIF =================
  function openInterviewModal(empId) {
    const cand = Sim.state.hrPool.find((c) => c.id === empId) || Sim.state.staffRoster.find((c) => c.id === empId);
    if (!cand) return;
    activeInterviewEmpId = empId;
    activeDialogueKey = "q_emergency";
    dom.interviewModalTitle.textContent = `Dokumen CV Lengkap & Wawancara: ${cand.name} (${cand.role})`;
    dom.interviewModal.classList.remove("hidden");
    renderInterviewModal();
  }

  function closeInterviewModal() {
    dom.interviewModal.classList.add("hidden");
  }

  function renderInterviewModal() {
    const inPool = Sim.state.hrPool.some((c) => c.id === activeInterviewEmpId);
    const cand = Sim.state.hrPool.find((c) => c.id === activeInterviewEmpId) || Sim.state.staffRoster.find((c) => c.id === activeInterviewEmpId);
    if (!cand) return;

    if (!cand.interviewedTopics) cand.interviewedTopics = {};
    cand.interviewedTopics[activeDialogueKey] = true;

    const fcv = cand.fullCV || {
      personalInfo: `Usia: ${cand.age || 28} Tahun`,
      executiveSummary: cand.bio || "-",
      educationDetail: { degree: cand.education, school: "-", year: "2021", gpa: "3.20", thesis: "-" },
      workHistory: [],
      certifications: []
    };

    const dlgMap = cand.dialogues || {};
    const curDlg = dlgMap[activeDialogueKey] || {
      question: "Pertanyaan Wawancara",
      answer: "\"Saya siap bekerja sesuai arahan perusahaan Pak.\""
    };

    const workHistoryHtml = (fcv.workHistory || []).map((w) => `
      <div style="margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed #cbd5e1;">
        <div style="display:flex; justify-content:space-between; font-weight:700; color:#0f172a;">
          <span>${w.title} — ${w.company}</span>
          <span>${w.period}</span>
        </div>
        <div style="font-size:12px; color:#334155; margin-top:2px;"><strong>Uraian Pekerjaan:</strong> ${w.duties}</div>
        <div style="font-size:11.5px; color:#475569; margin-top:2px;"><strong>Alasan Berhenti:</strong> ${w.leaveReason}</div>
      </div>
    `).join("");

    const dialogueTopics = [
      { key: "q_emergency", label: "1. Tanya Prosedur Darurat Reaktor (Uji K3 & Teknis)" },
      { key: "q_history", label: "2. Tanya Detail Pengalaman & Rekam Jejak Pabrik Lama" },
      { key: "q_pid", label: "3. Uji Praktik Baca Diagram P&ID & Operasi Alat" },
      { key: "q_salary", label: "4. Tanya Justifikasi Gaji & Komitmen Kerja" }
    ];

    dom.interviewModalBody.innerHTML = `
      <div class="dash-grid-2">
        <!-- KIRI: DOKUMEN CV LENGKAP TANPA RINGKASAN -->
        <div class="cv-full-doc">
          <h3>CURRICULUM VITAE — ${cand.name.toUpperCase()}</h3>
          <div style="font-size:11.5px; color:#475569; font-weight:600;">
            Posisi Dilamar: <strong>${cand.role}</strong> • Permintaan Gaji: <strong>${fmtUSD(cand.salaryPerDay)} / hari</strong><br/>
            ${fcv.personalInfo}
          </div>

          <div class="cv-doc-section">
            <h4>I. Pernyataan Profil Pribadi (Ditulis Pelamar)</h4>
            <p style="font-size:12.2px; color:#1e293b;">"${fcv.executiveSummary}"</p>
          </div>

          <div class="cv-doc-section">
            <h4>II. Riwayat Pendidikan Akademik Lengkap</h4>
            <div style="font-size:12px; color:#0f172a;">
              <div><strong>Gelar &amp; Jurusan:</strong> ${fcv.educationDetail.degree}</div>
              <div><strong>Institusi / Kampus:</strong> ${fcv.educationDetail.school} (Lulus ${fcv.educationDetail.year})</div>
              <div><strong>Indeks Prestasi Kumulatif (IPK):</strong> ${fcv.educationDetail.gpa}</div>
              <div><strong>Judul Skripsi / Tugas Akhir:</strong> <em>"${fcv.educationDetail.thesis}"</em></div>
            </div>
          </div>

          <div class="cv-doc-section">
            <h4>III. Riwayat Pengalaman Kerja Lengkap</h4>
            ${workHistoryHtml}
          </div>

          <div class="cv-doc-section">
            <h4>IV. Daftar Sertifikasi &amp; Klaim Keahlian</h4>
            <ul style="padding-left:18px; font-size:12px; color:#1e293b;">
              ${(fcv.certifications || []).map((cert) => `<li>${cert}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- KANAN: RUANG WAWANCARA DIALOG INTERAKTIF -->
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div class="dialogue-box">
            <div class="card-title">
              <span>💬 RUANG WAWANCARA INTERAKTIF</span>
              <span>PILIH PERTANYAAN DIALOG</span>
            </div>
            <p class="muted" style="font-size:11.5px;">
              Klik salah satu pertanyaan di bawah untuk mewawancarai <strong>${cand.name}</strong> dan menilai langsung apakah ucapannya berbobot teknis atau sekadar membual:
            </p>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${dialogueTopics.map((t) => `
                <button data-dlg-key="${t.key}" class="dialogue-q-btn ${activeDialogueKey === t.key ? "asked" : ""}" type="button">
                  ${cand.interviewedTopics[t.key] ? "✓ " : "💬 "}${t.label}
                </button>
              `).join("")}
            </div>

            <div style="margin-top:6px;">
              <div style="font-size:11px; color:var(--accent-amber); font-weight:700; margin-bottom:4px;">
                Pertanyaan Anda: "${curDlg.question}"
              </div>
              <div class="dialogue-answer-bubble">
                <strong style="color:var(--accent-cyan); display:block; margin-bottom:4px;">Jawaban ${cand.name}:</strong>
                ${curDlg.answer}
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="card-title"><span>HASIL UJI PRAKTIK LAB &amp; KEPUTUSAN HRD</span></div>
            <div class="kv-grid">
              <div class="kv-box">
                <span class="kv-k">SKILL TEKNIS RIIL</span>
                <span class="kv-v" style="font-size:11.5px;">
                  ${cand.tested
                    ? `<span style="color:${cand.realSkill < 35 ? "var(--accent-crimson)" : "var(--accent-emerald)"}">${cand.realSkill}/100 (${cand.realSkill < 35 ? "SKILL KOPONG!" : "KOMPETEN"})</span>`
                    : `<span style="color:var(--accent-amber)">Belum Diuji Lab (Nilai dari Wawancara &amp; CV)</span>`}
                </span>
              </div>
              <div class="kv-box">
                <span class="kv-k">DAMPAK KESELAMATAN</span>
                <span class="kv-v" style="font-size:11.5px;">
                  ${cand.tested
                    ? `<span style="color:${cand.hazardMod > 0 ? "var(--accent-crimson)" : "var(--accent-emerald)"}">${cand.hazardMod > 0 ? "+" + cand.hazardMod + "% Risiko Meledak" : cand.hazardMod + "% Mengamankan"}</span>`
                    : `<span style="color:var(--text-secondary)">Terbuka lewat Tes Lab ($60)</span>`}
                </span>
              </div>
            </div>
            ${inPool ? `
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:4px;">
                <button id="btn-modal-test-cv" class="action-btn" type="button" ${cand.tested || Sim.state.cash < 60 ? "disabled" : ""}>
                  🔬 ${cand.tested ? "Sudah Tes Lab" : "Tes Praktik Lab ($60)"}
                </button>
                <button id="btn-modal-hire-cv" class="action-btn accent-emerald" type="button" ${Sim.state.cash < cand.salaryPerDay ? "disabled" : ""}>
                  ✅ Rekrut Kandidat (${fmtUSD(cand.salaryPerDay)}/hari)
                </button>
              </div>
            ` : `
              <div class="muted">Kandidat ini sudah berstatus Karyawan Aktif di pabrik Anda.</div>
            `}
          </div>
        </div>
      </div>
    `;

    dom.interviewModalBody.querySelectorAll(".dialogue-q-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        Audio.playClick();
        activeDialogueKey = btn.getAttribute("data-dlg-key");
        renderInterviewModal();
      });
    });

    const btnModalTest = document.getElementById("btn-modal-test-cv");
    if (btnModalTest) {
      btnModalTest.addEventListener("click", () => {
        const res = Sim.testCandidateCV(cand.id);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playSurvey();
        renderInterviewModal();
        renderHrDashboard();
        updateDynamicHUD();
      });
    }

    const btnModalHire = document.getElementById("btn-modal-hire-cv");
    if (btnModalHire) {
      btnModalHire.addEventListener("click", () => {
        const res = Sim.hireCandidate(cand.id);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playStamp();
        const h = res.hired;
        if (h.realSkill < 35) {
          showToast(`⚠️ Anda merekrut ${h.name}! Ternyata SKILL KOPONG (${h.realSkill}/100) & berisiko meledakkan pabrik!`, "error");
        } else {
          showToast(`${h.name} resmi direkrut sebagai ${h.role} (Skill ${h.realSkill}/100).`, "good");
        }
        closeInterviewModal();
        renderHrDashboard();
        updateDynamicHUD();
      });
    }
  }

  // ================= TAB 4: UTILITAS & WAWANCARA CV LENGKAP SDM =================
  function renderHrDashboard() {
    const activeId = Sim.state.activeFactoryId || Object.keys(Sim.state.factories)[0];
    const metrics = activeId ? Sim.computeFactoryMetrics(activeId) : null;
    const staff = Sim.computeStaffMetrics();

    const utilCardsHtml = Data.UTILITIES.map((u) => {
      const lv = metrics ? (metrics.utilities[u.id === "UTIL-PWR" ? "pwrLv" : u.id === "UTIL-WTR" ? "wtrLv" : "fltLv"]) : 1;
      const supply = u.baseCap + (lv - 1) * u.capPerLevel;
      const demand = metrics
        ? (u.id === "UTIL-PWR" ? metrics.utilities.pwrDemand : u.id === "UTIL-WTR" ? metrics.utilities.wtrDemand : metrics.utilities.fltDemand)
        : 0;
      const cost = Math.round(u.baseCost * Math.pow(1.22, lv));
      const deficit = demand > supply;

      return `
        <div class="info-card ${deficit ? "locked-card" : ""}">
          <div class="card-title"><span>${u.name}</span><span>LEVEL ${lv}</span></div>
          <p class="muted" style="font-size:11px;">${u.desc}</p>
          <div class="kv-grid">
            <div class="kv-box"><span class="kv-k">KAPASITAS SUPLAI</span><span class="kv-v" style="color:var(--accent-emerald)">${supply} ${u.unit}</span></div>
            <div class="kv-box"><span class="kv-k">BEBAN PABRIK</span><span class="kv-v" style="color:${deficit ? "var(--accent-crimson)" : "var(--text-primary)"}">${demand} ${u.unit}</span></div>
          </div>
          <button data-util="${u.id}" class="action-btn btn-upgrade-util" type="button" ${!activeId || Sim.state.cash < cost ? "disabled" : ""}>
            ⚡ Upgrade ${u.name.split(" ")[0]} ke Lv.${lv + 1} (${fmtUSD(cost)})
          </button>
        </div>
      `;
    }).join("");

    // Kartu CV Kandidat Tanpa Ringkasan Spoiler — Pemain Membuka CV Lengkap & Wawancara Dialog Sendiri!
    const cvPoolHtml = Sim.state.hrPool.map((c) => {
      const fcv = c.fullCV || {};
      const edu = fcv.educationDetail || {};
      const work0 = (fcv.workHistory && fcv.workHistory[0]) || { company: "-", title: "-", period: "-", duties: "-" };

      const skillText = c.tested
        ? `<strong style="color:${c.realSkill < 35 ? "var(--accent-crimson)" : "var(--accent-emerald)"}">${c.realSkill}/100 (${c.realSkill < 35 ? "SKILL KOPONG!" : "KOMPETEN"})</strong>`
        : `<span style="color:var(--accent-amber)">Buka Wawancara / Tes Lab</span>`;

      return `
        <div class="cv-card">
          <div class="cv-header">
            <div>
              <span class="eyebrow">DOKUMEN CV PELAMAR • ${c.id} (Usia ${c.age || 27} Thn)</span>
              <h4 style="font-size:14.5px; color:#fff;">${c.name}</h4>
              <span class="muted" style="font-size:11.5px;">Melamar: <strong>${c.role}</strong></span>
            </div>
            <div class="cv-salary">Minta Gaji: ${fmtUSD(c.salaryPerDay)}/hari</div>
          </div>

          <div style="font-size:11.5px; background:rgba(0,0,0,0.25); padding:8px; border-radius:6px; display:flex; flex-direction:column; gap:4px;">
            <div><strong>Pendidikan:</strong> ${edu.degree || c.education} — ${edu.school || ""} (IPK: ${edu.gpa || "-"})</div>
            <div><strong>Skripsi/TA:</strong> <em>"${edu.thesis || "-"}"</em></div>
            <div><strong>Pengalaman Terakhir:</strong> ${work0.title} di ${work0.company} (${work0.period}) — ${work0.duties}</div>
            <div><strong>Pernyataan CV:</strong> "${fcv.executiveSummary || ""}"</div>
          </div>

          <div class="kv-grid">
            <div class="kv-box"><span class="kv-k">HASIL EVALUASI TEKNIS</span><span class="kv-v" style="font-size:11px;">${skillText}</span></div>
            <div class="kv-box"><span class="kv-k">SERTIFIKASI TERTULIS</span><span class="kv-v" style="font-size:10.5px;">${(fcv.certifications && fcv.certifications[0]) || "-"}</span></div>
          </div>

          <div style="display:grid; grid-template-columns:1.25fr 0.85fr 0.9fr; gap:6px;">
            <button data-interview="${c.id}" class="action-btn accent-purple btn-open-interview" type="button">
              📄 CV Lengkap &amp; 💬 Wawancara
            </button>
            <button data-emp="${c.id}" class="action-btn btn-test-cv" type="button" ${c.tested || Sim.state.cash < 60 ? "disabled" : ""}>
              🔬 ${c.tested ? "Teruji" : "Tes Lab ($60)"}
            </button>
            <button data-emp="${c.id}" class="action-btn accent-emerald btn-hire-cv" type="button" ${Sim.state.cash < c.salaryPerDay ? "disabled" : ""}>
              ✅ Rekrut
            </button>
          </div>
        </div>
      `;
    }).join("");

    const rosterHtml = Sim.state.staffRoster.map((emp) => {
      const isBad = emp.realSkill < 35 || emp.hazardMod > 10;
      return `
        <div class="info-card ${isBad ? "locked-card" : ""}" style="flex-direction:row; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:#fff;">${emp.name}</strong> — <span class="muted">${emp.role}</span>
            <div style="font-size:11px; margin-top:2px;">
              Gaji: <strong>${fmtUSD(emp.salaryPerDay)}/hari</strong> •
              Skill Asli: <strong style="color:${isBad ? "var(--accent-crimson)" : "var(--accent-emerald)"}">${emp.realSkill}/100 ${isBad ? "(SKILL KOPONG / CEROBOH!)" : "(ANDAL)"}</strong> •
              Dampak Keselamatan: <strong style="color:${emp.hazardMod > 0 ? "var(--accent-crimson)" : "var(--accent-emerald)"}">${emp.hazardMod > 0 ? "+" + emp.hazardMod + "% Bahaya" : emp.hazardMod + "% Aman"}</strong>
            </div>
          </div>
          <div style="display:flex; gap:6px;">
            <button data-interview="${emp.id}" class="action-btn compact-btn btn-open-interview" type="button">📄 Lihat CV</button>
            <button data-fire="${emp.id}" class="action-btn accent-crimson compact-btn btn-fire-emp" type="button" ${Sim.state.staffRoster.length <= 1 ? "disabled" : ""}>
              🚪 Pecat
            </button>
          </div>
        </div>
      `;
    }).join("");

    const stab = metrics ? metrics.stability : 100;

    dom.hrDashboard.innerHTML = `
      <div class="dash-panel">
        <div class="dash-panel-header">
          <div>
            <span class="eyebrow">INFRASTRUKTUR PENDUKUNG KILANG</span>
            <h3>⚡ Utilitas Pabrik: Listrik, Air Pendingin &amp; Armada Kendaraan</h3>
          </div>
          <span class="mini-badge ${stab < 65 ? "warn" : "good"}">Stabilitas Pabrik: ${stab}%</span>
        </div>
        <div class="dash-grid-3">${utilCardsHtml}</div>
      </div>

      <div class="dash-panel">
        <div class="dash-panel-header">
          <div>
            <span class="eyebrow">REKRUTMEN SDM, DOKUMEN CV LENGKAP &amp; WAWANCARA DIALOG</span>
            <h3>📄 Seleksi CV Pelamar &amp; Wawancara Tatap Muka (Buka CV Lengkap &amp; Tanya Kandidat!)</h3>
          </div>
          <button id="btn-roll-cv" class="action-btn accent-amber" type="button" ${Sim.state.cash < 40 ? "disabled" : ""}>
            🎲 Gacha 4 Berkas CV Pelamar Baru ($40)
          </button>
        </div>
        <div class="cv-grid">${cvPoolHtml}</div>
      </div>

      <div class="dash-panel">
        <div class="dash-panel-header">
          <div>
            <span class="eyebrow">MANAJEMEN KESELAMATAN &amp; SDM AKTIF</span>
            <h3>👷 Karyawan Aktif di Kilang (${staff.count} Orang • Total Gaji ${fmtUSD(staff.totalSalaryPerDay)}/hari)</h3>
          </div>
          <span class="mini-badge ${staff.kopongCount > 0 ? "warn" : "good"}">
            Rata-Rata Skill: ${Math.round(staff.avgSkill)}/100 • Karyawan Bermasalah: ${staff.kopongCount}
          </span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">${rosterHtml}</div>
      </div>
    `;

    dom.hrDashboard.querySelectorAll(".btn-upgrade-util").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!activeId) return;
        const utilId = btn.getAttribute("data-util");
        const res = Sim.upgradeUtility(activeId, utilId);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playUpgrade();
        showToast(`Utilitas berhasil ditingkatkan ke Level ${res.newLevel}!`, "good");
        renderHrDashboard();
        updateDynamicHUD();
      });
    });

    const btnRoll = document.getElementById("btn-roll-cv");
    if (btnRoll) {
      btnRoll.addEventListener("click", () => {
        const res = Sim.rollCandidateCVs(false);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playPaperRustle();
        showToast("4 berkas CV lengkap pelamar baru telah tiba di meja wawancara!", "info");
        renderHrDashboard();
        updateDynamicHUD();
      });
    }

    dom.hrDashboard.querySelectorAll(".btn-open-interview").forEach((btn) => {
      btn.addEventListener("click", () => {
        Audio.playPaperRustle();
        openInterviewModal(btn.getAttribute("data-interview"));
      });
    });

    dom.hrDashboard.querySelectorAll(".btn-test-cv").forEach((btn) => {
      btn.addEventListener("click", () => {
        const empId = btn.getAttribute("data-emp");
        const res = Sim.testCandidateCV(empId);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playSurvey();
        const c = res.candidate;
        showToast(`Hasil Tes Lab ${c.name}: Skill ${c.realSkill}/100.`, c.realSkill < 35 ? "warn" : "good");
        renderHrDashboard();
        updateDynamicHUD();
      });
    });

    dom.hrDashboard.querySelectorAll(".btn-hire-cv").forEach((btn) => {
      btn.addEventListener("click", () => {
        const empId = btn.getAttribute("data-emp");
        const res = Sim.hireCandidate(empId);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playStamp();
        const h = res.hired;
        if (h.realSkill < 35) {
          showToast(`⚠️ Anda merekrut ${h.name}! Ternyata SKILL KOPONG (${h.realSkill}/100) & rawan meledakkan pabrik!`, "error");
        } else {
          showToast(`${h.name} resmi bergabung sebagai ${h.role} (Skill ${h.realSkill}/100).`, "good");
        }
        renderHrDashboard();
        updateDynamicHUD();
      });
    });

    dom.hrDashboard.querySelectorAll(".btn-fire-emp").forEach((btn) => {
      btn.addEventListener("click", () => {
        const empId = btn.getAttribute("data-fire");
        const res = Sim.fireEmployee(empId);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playStamp();
        showToast(`${res.fired.name} diberhentikan (Pesangon -$${res.severance}).`, "info");
        renderHrDashboard();
        updateDynamicHUD();
      });
    });
  }

  // ================= TAB 5: PINJAMAN BANK & 300 EDISI KORAN HARIAN =================
  function renderBankDashboard() {
    const boughtToday = Sim.state.market.newspaperBoughtDay === Sim.state.dayCount;
    const archive300 = Data.get300NewsArchive();

    let activeEdition = Sim.state.market.newsToday;
    if (newsTabEdition === "yesterday") {
      activeEdition = Sim.state.market.newsYesterday;
    } else if (newsTabEdition === "archive300") {
      const entry = archive300[Math.max(0, Math.min(299, archive300Index - 1))];
      activeEdition = {
        dateStr: `Arsip Perpustakaan Pers Industri — Edisi #${entry.editionNum} / 300 (${entry.tag})`,
        headline: entry.headline,
        marketStory: entry.marketStory,
        bankStory: entry.bankStory,
        equipStory: entry.equipStory,
        techSpotlight: entry.techSpotlight,
        trendingSnapshot: [`Komoditas Utama: ${entry.featuredProductId} (+${entry.boomPct}%)`, `Komoditas Sekunder: ${entry.secondaryProductId}`]
      };
    }

    const archiveControlsHtml = newsTabEdition === "archive300" ? `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:var(--bg-card); padding:8px 12px; border-radius:7px; border:1px solid var(--border-bright);">
        <div style="display:flex; align-items:center; gap:8px;">
          <button id="btn-arch-prev" class="ctrl-btn" type="button">◀ Sebelumnya</button>
          <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan);">EDISI #${archive300Index} DARI 300</span>
          <button id="btn-arch-next" class="ctrl-btn" type="button">Berikutnya ▶</button>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="font-size:11px; color:var(--text-secondary);">Lompat ke Edisi (1–300):</label>
          <input id="inp-arch-num" class="scada-input" type="number" min="1" max="300" value="${archive300Index}" style="width:85px;" />
        </div>
      </div>
    ` : "";

    const newspaperContentHtml = (!boughtToday && newsTabEdition === "today")
      ? `
        <div class="info-card locked-card" style="text-align:center; padding:24px;">
          <div style="font-size:32px;">📰</div>
          <h3>Edisi Koran Hari Ini (#${Sim.state.dayCount}) Belum Dibeli (Opsional)</h3>
          <p class="muted" style="max-width:560px; margin:0 auto;">
            Membeli koran harian bersifat <strong>opsional</strong> ($${Data.NEWSPAPER_COST}). Anda juga dapat membaca <strong>300 Edisi Katalog Berita Koran</strong> untuk memantau produk trending, suku bunga bank, serta indeks harga peralatan pabrik.
          </p>
          <div style="display:flex; justify-content:center; gap:10px; margin-top:10px; flex-wrap:wrap;">
            <button id="btn-buy-newspaper" class="action-btn accent-amber" type="button" ${Sim.state.cash < Data.NEWSPAPER_COST ? "disabled" : ""}>
              📰 Beli Koran Hari Ini ($${Data.NEWSPAPER_COST})
            </button>
            <button id="btn-view-yesterday" class="action-btn compact-btn" type="button">
              📂 Lihat Koran Kemarin (Gratis)
            </button>
            <button id="btn-view-300" class="action-btn compact-btn" type="button">
              📚 Buka Katalog 300 Isi Koran
            </button>
          </div>
        </div>
      `
      : `
        ${archiveControlsHtml}
        <div class="newspaper-sheet">
          <div class="newspaper-masthead">
            <h2>WARTA KIMIA &amp; INDUSTRI GLOBAL (300 EDISI)</h2>
            <div class="newspaper-meta">
              ${activeEdition.dateStr} • INDEKS SUKU BUNGA: ${Math.round(Sim.state.market.interestRateMult * 100)}% • INDEKS HARGA ALAT: ${Math.round(Sim.state.market.equipmentPriceMult * 100)}%
            </div>
          </div>
          <div class="news-headline">${activeEdition.headline}</div>
          <div class="news-columns">
            <div class="news-article">
              <h4>📈 Laporan Bursa &amp; Komoditas Trending</h4>
              <p>${activeEdition.marketStory}</p>
              <div style="margin-top:6px; font-weight:700; font-size:11.5px;">
                Sorotan Pasar: ${activeEdition.trendingSnapshot.join(" • ")}
              </div>
            </div>
            <div class="news-article">
              <h4>🏦 Suku Bunga Pinjaman &amp; Pasar Peralatan</h4>
              <p><strong>Perbankan:</strong> ${activeEdition.bankStory}</p>
              <p style="margin-top:6px;"><strong>Harga Peralatan P&amp;ID:</strong> ${activeEdition.equipStory}</p>
            </div>
          </div>
          <div class="news-article" style="margin-top:12px;">
            <h4>🔬 Sorotan Teknologi &amp; Rekayasa Proses</h4>
            <p>${formatChemHTML(activeEdition.techSpotlight)}</p>
          </div>
        </div>
      `;

    const loansCatalogHtml = Data.BANK_LOANS.map((l) => {
      const effDaily = l.baseDailyInterestRate * Sim.state.market.interestRateMult;
      const dailyInterestUSD = Math.round(l.principal * effDaily);
      return `
        <div class="info-card">
          <div class="card-title"><span>${l.bankName}</span><span>PLAFON ${fmtUSD(l.principal)}</span></div>
          <strong style="font-size:13.5px; color:#fff;">${l.title}</strong>
          <p class="muted" style="font-size:11px;">${l.desc}</p>
          <div class="kv-grid">
            <div class="kv-box"><span class="kv-k">BUNGA HARIAN EFEKTIF</span><span class="kv-v" style="color:var(--accent-amber)">${(effDaily * 100).toFixed(2).replace(".", ",")}% / hari</span></div>
            <div class="kv-box"><span class="kv-k">BEBAN BUNGA</span><span class="kv-v">${fmtUSD(dailyInterestUSD)} / hari</span></div>
          </div>
          <div class="muted" style="font-size:10.5px;">Syarat: ${l.collateral}</div>
          <button data-loan="${l.id}" class="action-btn accent-emerald btn-take-loan" type="button" ${Sim.state.activeLoans.length >= 4 ? "disabled" : ""}>
            💳 Cairkan Pinjaman +${fmtUSD(l.principal)}
          </button>
        </div>
      `;
    }).join("");

    const activeLoansHtml = Sim.state.activeLoans.length === 0
      ? `<p class="muted">Perusahaan Anda saat ini bebas utang bank (0 kontrak pinjaman aktif).</p>`
      : Sim.state.activeLoans.map((ln) => {
          const dailyCost = Math.round(ln.principalRemaining * ln.dailyInterestRate);
          return `
            <div class="info-card" style="flex-direction:row; justify-content:space-between; align-items:center;">
              <div>
                <strong style="color:#fff;">[${ln.uid}] ${ln.title} (${ln.bankName})</strong>
                <div class="muted" style="font-size:11.5px;">
                  Pokok Pinjaman: <strong>${fmtUSD(ln.principalRemaining)}</strong> •
                  Bunga: <strong style="color:var(--accent-amber)">${(ln.dailyInterestRate * 100).toFixed(2)}% (${fmtUSD(dailyCost)}/hari)</strong> •
                  Diambil pada Hari #${ln.takenDay}
                </div>
              </div>
              <button data-repay="${ln.uid}" class="action-btn compact-btn btn-repay-loan" type="button" ${Sim.state.cash < ln.principalRemaining ? "disabled" : ""}>
                💸 Lunasi Pokok (${fmtUSD(ln.principalRemaining)})
              </button>
            </div>
          `;
        }).join("");

    dom.bankDashboard.innerHTML = `
      <div class="dash-panel">
        <div class="dash-panel-header">
          <div>
            <span class="eyebrow">INTELIJEN PASAR &amp; PERPUSTAKAAN 300 EDISI KORAN</span>
            <h3>📰 Surat Kabar Harian: "Warta Kimia &amp; Industri Global" (300 Edisi)</h3>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button id="btn-tab-news-today" class="filter-tab ${newsTabEdition === "today" ? "active" : ""}" type="button">
              Edisi Hari Ini (#${Sim.state.dayCount})
            </button>
            <button id="btn-tab-news-yest" class="filter-tab ${newsTabEdition === "yesterday" ? "active" : ""}" type="button">
              Edisi Kemarin
            </button>
            <button id="btn-tab-news-300" class="filter-tab ${newsTabEdition === "archive300" ? "active" : ""}" type="button">
              📚 Arsip Lengkap 300 Isi Koran
            </button>
          </div>
        </div>
        ${newspaperContentHtml}
      </div>

      <div class="dash-panel">
        <div class="dash-panel-header">
          <div>
            <span class="eyebrow">PENDANAAN EKSPANSI &amp; LIKUIDITAS</span>
            <h3>🏦 Fasilitas Pinjaman Bank Multi-Rate</h3>
          </div>
          <span class="mini-badge">Indeks Bunga Hari Ini: ${Math.round(Sim.state.market.interestRateMult * 100)}%</span>
        </div>
        <div class="dash-grid-2">${loansCatalogHtml}</div>
      </div>

      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3>📑 Kewajiban Pinjaman Bank Aktif (${Sim.state.activeLoans.length}/4)</h3>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">${activeLoansHtml}</div>
      </div>
    `;

    const btnBuyNews = document.getElementById("btn-buy-newspaper");
    if (btnBuyNews) {
      btnBuyNews.addEventListener("click", () => {
        const res = Sim.buyNewspaper();
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playPaperRustle();
        showToast("Koran edisi hari ini terbuka!", "good");
        renderBankDashboard();
        updateDynamicHUD();
      });
    }

    const btnViewYest = document.getElementById("btn-view-yesterday");
    if (btnViewYest) btnViewYest.addEventListener("click", () => { Audio.playPaperRustle(); newsTabEdition = "yesterday"; renderBankDashboard(); });

    const btnView300 = document.getElementById("btn-view-300");
    if (btnView300) btnView300.addEventListener("click", () => { Audio.playPaperRustle(); newsTabEdition = "archive300"; renderBankDashboard(); });

    const tabToday = document.getElementById("btn-tab-news-today");
    if (tabToday) tabToday.addEventListener("click", () => { Audio.playPaperRustle(); newsTabEdition = "today"; renderBankDashboard(); });

    const tabYest = document.getElementById("btn-tab-news-yest");
    if (tabYest) tabYest.addEventListener("click", () => { Audio.playPaperRustle(); newsTabEdition = "yesterday"; renderBankDashboard(); });

    const tab300 = document.getElementById("btn-tab-news-300");
    if (tab300) tab300.addEventListener("click", () => { Audio.playPaperRustle(); newsTabEdition = "archive300"; renderBankDashboard(); });

    const btnPrev = document.getElementById("btn-arch-prev");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        Audio.playPaperRustle();
        archive300Index = archive300Index <= 1 ? 300 : archive300Index - 1;
        renderBankDashboard();
      });
    }
    const btnNext = document.getElementById("btn-arch-next");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        Audio.playPaperRustle();
        archive300Index = archive300Index >= 300 ? 1 : archive300Index + 1;
        renderBankDashboard();
      });
    }
    const inpArch = document.getElementById("inp-arch-num");
    if (inpArch) {
      inpArch.addEventListener("change", () => {
        archive300Index = Math.max(1, Math.min(300, Number(inpArch.value) || 1));
        renderBankDashboard();
      });
    }

    dom.bankDashboard.querySelectorAll(".btn-take-loan").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lid = btn.getAttribute("data-loan");
        const res = Sim.takeBankLoan(lid);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playCoin();
        showToast(`Pinjaman ${res.loan.title} cair! Kas +${fmtUSD(res.loan.originalPrincipal)}.`, "good");
        renderBankDashboard();
        updateDynamicHUD();
      });
    });

    dom.bankDashboard.querySelectorAll(".btn-repay-loan").forEach((btn) => {
      btn.addEventListener("click", () => {
        const uid = btn.getAttribute("data-repay");
        const res = Sim.repayBankLoan(uid);
        if (!res.ok) {
          Audio.playError();
          showToast(res.reason, "error");
          return;
        }
        Audio.playCoin();
        showToast(`Pinjaman ${res.repaid.uid} telah dilunasi sepenuhnya!`, "good");
        renderBankDashboard();
        updateDynamicHUD();
      });
    });
  }

  // ================= MODAL KATALOG 300 PRODUK KIMIA =================
  function openCatalogModal() {
    if (Sim.state.inMainMenu) {
      closeMainMenu();
    }
    dom.catalogModal.classList.remove("hidden");
    renderCatalogGrid();
  }

  function closeCatalogModal() {
    dom.catalogModal.classList.add("hidden");
  }

  function selectProductForActiveFactory(productId) {
    initialBuildProductId = productId;
    const prod = Catalog.getProductById(productId);
    const route = Catalog.getRouteForProduct(prod);
    const activeId = Sim.state.activeFactoryId;

    if (!activeId) {
      showToast(`${prod.id} (${prod.name}) dipilih! Rute alat: ${route.name}. Klik Bangun Kilang di Peta Dunia.`, "good");
      closeCatalogModal();
      switchPhase("world");
      return;
    }

    const res = Sim.setFactoryTargetProduct(activeId, productId);
    if (!res.ok) {
      Audio.playError();
      showToast(res.reason, "warn");
      return;
    }
    Audio.playUpgrade();
    showToast(`Pabrik dikonfigurasi ulang ke ${prod.id}: ${prod.name} (${route.name})!`, "good");
    closeCatalogModal();
    switchPhase("pid");
  }

  function renderCatalogGrid() {
    const q = (catalogSearch || "").trim().toLowerCase();
    const list = Catalog.PRODUCTS.filter((p) => {
      if (catalogFilter === "TREND" && !Sim.state.market.trendingMap[p.id]) return false;
      if (["1", "2", "3", "4"].includes(catalogFilter) && String(p.tier) !== catalogFilter) return false;
      if (!q) return true;
      const route = Catalog.getRouteForProduct(p);
      return (
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.formula.toLowerCase().includes(q) ||
        p.reaction.toLowerCase().includes(q) ||
        p.realWorldApp.toLowerCase().includes(q) ||
        route.name.toLowerCase().includes(q)
      );
    });

    dom.catalogGridBody.innerHTML = list.map((p) => {
      const tMult = Sim.state.market.trendingMap[p.id];
      const feed = Catalog.getFeedstockById(p.feedstockId);
      const route = Catalog.getRouteForProduct(p);
      return `
        <div class="chem-card ${tMult ? "trending" : ""}">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span class="mini-badge">${p.id} • TIER ${p.tier}</span>
              ${tMult ? `<span class="mini-badge warn">🔥 TRENDING +${Math.round((tMult - 1) * 100)}%</span>` : `<span class="mini-badge">${fmtUSD(p.basePrice)}/u</span>`}
            </div>
            <strong style="font-size:13.5px; color:#fff; display:block;">${p.name}</strong>
            <div style="font-size:10.5px; color:var(--accent-emerald); font-family:var(--font-mono); margin-top:2px;">⚙️ ${route.name}</div>
            <div class="formula-box" style="margin:6px 0; font-size:11px; padding:4px 6px;">${formatChemHTML(p.formula)}</div>
            <div class="reaction-box" style="margin-bottom:6px; font-size:10.5px; padding:5px 6px;">${formatChemHTML(p.reaction)}</div>
            <div class="muted" style="font-size:11px;">
              <strong>Bahan Baku:</strong> ${feed.name} (${p.feedstockPerUnit}t) •
              <strong>Listrik:</strong> ${p.powerKwh} kWh • <strong>Air:</strong> ${p.waterM3} m³
            </div>
            <div class="muted" style="font-size:11px; margin-top:4px;">${p.realWorldApp}</div>
          </div>
          <button data-select-chem="${p.id}" class="action-btn accent-emerald btn-pick-chem" type="button">
            🎯 Produksi ${p.id} (${tMult ? fmtUSD(p.basePrice * tMult) : fmtUSD(p.basePrice)}/u)
          </button>
        </div>
      `;
    }).join("");

    dom.catalogGridBody.querySelectorAll(".btn-pick-chem").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectProductForActiveFactory(btn.getAttribute("data-select-chem"));
      });
    });
  }

  // ================= MODAL INSIDEN LEDAKAN PABRIK (BOOM!) =================
  function checkAndShowExplosionModal() {
    const rep = Sim.state.pendingExplosionModal;
    if (!rep) return;
    Sim.state.pendingExplosionModal = null;
    Sim.state.isPaused = true;
    updateTimeControlButtons();
    Audio.playExplosion();

    dom.explosionModalBody.innerHTML = `
      <div class="lock-banner" style="background:rgba(220,38,38,0.2); border-color:#ef4444; color:#fecaca;">
        <span>🚨</span>
        <span><strong>${rep.factoryName}</strong> mengalami ledakan proses hebat pada <strong>${rep.dateStr}</strong>!</span>
      </div>
      <div class="info-card">
        <div class="card-title"><span>INVESTIGASI PENYEBAB INSIDEN</span><span>HAZOP REPORT</span></div>
        <p style="color:#fca5a5; font-weight:600;">"${rep.reason}"</p>
      </div>
      <div class="info-card">
        <div class="card-title"><span>KERUSAKAN FASILITAS &amp; DENDA KESELAMATAN</span></div>
        <ul style="padding-left:18px; font-size:12px; color:var(--text-primary);">
          <li>Biaya Pemadaman Darurat &amp; Kompensasi: <strong style="color:var(--accent-crimson)">-${fmtUSD(rep.fine)}</strong></li>
          <li>50% Stok Produk di Gudang Hangus Terbakar</li>
          ${rep.damagedUnits.map((d) => `<li>Kerusakan Alat: <strong>${d}</strong></li>`).join("")}
        </ul>
      </div>
      <p class="muted" style="font-size:11.5px;">
        <strong>Saran Pencegahan:</strong> Wawancarai pelamar dan pecat karyawan <em>Skill Kopong / Ceroboh</em>, ganti alat ke Generasi 3–4 yang lebih aman, dan jaga kecukupan Air Pendingin!
      </p>
    `;
    dom.explosionModal.classList.remove("hidden");
  }

  function updateTimeControlButtons() {
    const paused = Sim.state.isPaused;
    const spd = Sim.state.timeSpeed;
    dom.hudPauseBadge.classList.toggle("hidden", !paused);
    dom.btnTimePause.classList.toggle("active", paused);
    dom.btnTime1x.classList.toggle("active", !paused && spd === 1);
    dom.btnTime2x.classList.toggle("active", !paused && spd === 2);
    dom.btnTime5x.classList.toggle("active", !paused && spd === 5);
    Audio.setHumActive(currentPhase === "pid" && !paused && !Sim.state.inMainMenu);
  }

  function handleSkipTime(days, label) {
    Audio.playClick();
    const res = Sim.skipTime(days);
    updateDynamicHUD();

    if (currentPhase === "world") renderWorldInspector();
    else if (currentPhase === "pid") {
      renderFactorySelector();
      renderPidQuickbar();
      renderEncyclopedia();
    } else if (currentPhase === "market") renderMarketDashboard();
    else if (currentPhase === "hr") renderHrDashboard();
    else if (currentPhase === "bank") renderBankDashboard();

    if (res.explosion || Sim.state.pendingExplosionModal) {
      checkAndShowExplosionModal();
    } else {
      showToast(`Waktu dilompati +${label}! Sekarang ${Sim.formatCalendarDate(Sim.state.dayCount)}.`, "info");
    }
  }

  function updateDynamicHUD() {
    if (Sim.state.pendingExplosionModal) {
      checkAndShowExplosionModal();
    }

    const gr = Sim.state.globalRates;
    dom.hudCash.textContent = fmtUSD(Sim.state.cash);
    dom.hudNetRate.textContent = fmtRate(gr.netPerSec);
    dom.hudNetRate.className = "hud-value " + (gr.netPerSec > 0 ? "positive" : gr.netPerSec < 0 ? "negative" : "");

    const stab = gr.avgStability;
    dom.hudStability.textContent = `${stab}% ${stab >= 75 ? "AMAN" : stab >= 50 ? "WASPADA" : "KRITIS!"}`;
    dom.hudStability.className = "hud-value " + (stab >= 75 ? "positive" : stab >= 50 ? "warn" : "negative");

    dom.hudFactories.textContent = `${gr.activeCount} Aktif`;
    dom.hudCalendarDate.textContent = Sim.formatCalendarDate(Sim.state.dayCount);

    const boughtToday = Sim.state.market.newspaperBoughtDay === Sim.state.dayCount;
    dom.btnQuickNewspaper.textContent = boughtToday ? "📰 Baca Koran Hari Ini" : `📰 Koran Hari Ini ($${Data.NEWSPAPER_COST})`;

    if (currentPhase === "world") {
      const btnSurvey = document.getElementById("btn-hire-survey");
      if (btnSurvey) btnSurvey.disabled = Sim.state.cash < Data.SURVEY_COST;
      const btnBuild = document.getElementById("btn-build-factory");
      if (btnBuild && Sim.state.selectedRegionId) {
        btnBuild.disabled = Sim.state.cash < Sim.getAcquisitionCost(Sim.state.selectedRegionId);
      }
      return;
    }

    if (currentPhase !== "pid") return;

    const activeId = Sim.state.activeFactoryId;
    const metrics = activeId ? Sim.computeFactoryMetrics(activeId) : null;
    if (!metrics) return;

    dom.chipFlowRate.textContent = fmtNum(metrics.upstreamFlowTonHr, 1) + " t/jam";
    dom.chipWarehouseRate.textContent = "+" + fmtNum(metrics.warehouseUnitsPerSec, 2) + " u/dtk";
    dom.chipCo2Rate.innerHTML = fmtNum(metrics.netCo2, 2) + " tCO<sub>2</sub>/dtk";

    if (metrics.bottlenecks.length > 0) {
      dom.chipBottleneckWrap.classList.add("alert");
      dom.chipBottleneck.textContent = `PERINGATAN (${metrics.bottlenecks.length})`;
      dom.bottleneckDetails.innerHTML = metrics.bottlenecks
        .slice(0, 2)
        .map((b) => `<div style="color:#ff8a80;">⚠ ${b.message}</div>`)
        .join("");
    } else {
      dom.chipBottleneckWrap.classList.remove("alert");
      dom.chipBottleneck.textContent = "SEIMBANG (OPTIMAL)";
      dom.bottleneckDetails.innerHTML = `<span style="color:var(--accent-emerald);">✓ Rute [${metrics.route.name}] berjalan optimal (${Math.round(metrics.overallBalance * 100)}% efisiensi, bahan baku ${fmtNum(metrics.rawStock.qty, 1)}t).</span>`;
    }

    if (metrics.nextStageInfo) {
      dom.btnExpandLand.disabled = Sim.state.cash < metrics.nextStageInfo.cost;
    }

    const btnExtChain = document.getElementById("btn-enc-extend-chain");
    if (btnExtChain && metrics.nextStageInfo) {
      btnExtChain.disabled = Sim.state.cash < metrics.nextStageInfo.cost;
    }

    const btnRep = document.getElementById("btn-replace-equip");
    if (btnRep && Sim.state.activeInspect && Sim.state.activeInspect.type === "equipment") {
      const stat = metrics.unitStats[Sim.state.activeInspect.id];
      if (stat && stat.active && stat.nextGen) {
        btnRep.disabled = Sim.state.cash < stat.replaceCost;
      }
    }

    const btnUp = document.getElementById("btn-upgrade-unit");
    if (btnUp && Sim.state.activeInspect && Sim.state.activeInspect.type === "equipment") {
      const stat = metrics.unitStats[Sim.state.activeInspect.id];
      if (stat && stat.active) {
        btnUp.disabled = Sim.state.cash < stat.nextCost;
      }
    }

    const activeWhQty = (Sim.state.warehouse.products[metrics.activeChem.id] || { qty: 0 }).qty;
    const ps = metrics.productStats["PROD-OUT"];
    const yieldBoostPct = Math.round((metrics.installedStageCount - 3) * 18);
    dom.tierLiveMetrics.innerHTML = `
      <div class="tier-pill" style="border-color:var(--accent-cyan);">
        <div class="tp-head"><span>🎯 ${metrics.activeChem.id}</span><span>${ps.gradeInfo.grade} (${fmtNum(ps.purity, 1)}%)</span></div>
        <div class="tp-val">${fmtUSD(ps.unitMarketPriceNet)}/u</div>
      </div>
      <div class="tier-pill" style="border-color:var(--accent-emerald);">
        <div class="tp-head"><span>📦 STOK GUDANG</span><span>+${fmtNum(metrics.warehouseUnitsPerSec, 2)} u/dtk</span></div>
        <div class="tp-val" style="color:var(--accent-emerald);">${fmtNum(activeWhQty, 2)} Unit</div>
      </div>
      <div class="tier-pill">
        <div class="tp-head"><span>⛓️ PANJANG ALAT</span><span>${metrics.installedStageCount}/12 TAHAP</span></div>
        <div class="tp-val">Yield +${yieldBoostPct}%</div>
      </div>
      <div class="tier-pill">
        <div class="tp-head"><span>♻️ DAUR ULANG S-502</span><span>${metrics.unitStats["S-502"].active ? "AKTIF" : "OPSIONAL"}</span></div>
        <div class="tp-val">${metrics.unitStats["S-502"].active ? "Hemat " + Math.round(metrics.feedSavingRatio * 100) + "% Umpan" : "Klik S-502"}</div>
      </div>
    `;
  }

  function bindEvents() {
    dom.btnMenuPlay.addEventListener("click", () => {
      Audio.playClick();
      closeMainMenu();
    });
    dom.btnOpenMainMenu.addEventListener("click", () => {
      Audio.playClick();
      openMainMenu();
    });
    dom.btnMenuSaveLoad.addEventListener("click", () => {
      Audio.playClick();
      openSaveLoadModal();
    });
    dom.btnOpenSaveLoad.addEventListener("click", () => {
      Audio.playClick();
      openSaveLoadModal();
    });
    dom.btnCloseSaveLoad.addEventListener("click", () => {
      Audio.playClick();
      closeSaveLoadModal();
    });
    dom.btnCloseInterview.addEventListener("click", () => {
      Audio.playClick();
      closeInterviewModal();
    });
    dom.btnMenuCatalog.addEventListener("click", () => {
      Audio.playClick();
      openCatalogModal();
    });
    dom.btnMenuNews.addEventListener("click", () => {
      Audio.playPaperRustle();
      closeMainMenu();
      newsTabEdition = "archive300";
      switchPhase("bank");
    });
    dom.btnMenuAudio.addEventListener("click", () => {
      const isMuted = Audio.toggleMute();
      dom.btnMenuAudio.textContent = isMuted ? "🔇 Suara: Nonaktif" : "🔊 Suara: Aktif";
      dom.audioIcon.textContent = isMuted ? "🔇" : "🔊";
    });

    dom.btnPhaseWorld.addEventListener("click", () => { Audio.playClick(); switchPhase("world"); });
    dom.btnPhasePid.addEventListener("click", () => { Audio.playClick(); switchPhase("pid"); });
    dom.btnPhaseMarket.addEventListener("click", () => { Audio.playClick(); switchPhase("market"); });
    dom.btnPhaseHr.addEventListener("click", () => { Audio.playClick(); switchPhase("hr"); });
    dom.btnPhaseBank.addEventListener("click", () => { Audio.playClick(); switchPhase("bank"); });

    dom.btnAudio.addEventListener("click", () => {
      const isMuted = Audio.toggleMute();
      dom.btnAudio.classList.toggle("muted", isMuted);
      dom.audioIcon.textContent = isMuted ? "🔇" : "🔊";
      dom.btnMenuAudio.textContent = isMuted ? "🔇 Suara: Nonaktif" : "🔊 Suara: Aktif";
    });

    dom.btnTimePause.addEventListener("click", () => {
      Audio.playClick();
      Sim.state.isPaused = !Sim.state.isPaused;
      updateTimeControlButtons();
    });
    dom.btnTime1x.addEventListener("click", () => {
      Audio.playClick();
      Sim.state.isPaused = false;
      Sim.state.timeSpeed = 1;
      updateTimeControlButtons();
    });
    dom.btnTime2x.addEventListener("click", () => {
      Audio.playClick();
      Sim.state.isPaused = false;
      Sim.state.timeSpeed = 2;
      updateTimeControlButtons();
    });
    dom.btnTime5x.addEventListener("click", () => {
      Audio.playClick();
      Sim.state.isPaused = false;
      Sim.state.timeSpeed = 5;
      updateTimeControlButtons();
    });

    dom.btnSkip1d.addEventListener("click", () => handleSkipTime(1, "1 Hari"));
    dom.btnSkip30d.addEventListener("click", () => handleSkipTime(30, "1 Bulan (30 Hari)"));
    dom.btnSkip365d.addEventListener("click", () => handleSkipTime(365, "1 Tahun (365 Hari)"));

    dom.btnOpenCatalogModal.addEventListener("click", () => {
      Audio.playClick();
      openCatalogModal();
    });
    dom.btnChangeProduct.addEventListener("click", () => {
      Audio.playClick();
      openCatalogModal();
    });
    dom.btnQuickNewspaper.addEventListener("click", () => {
      Audio.playPaperRustle();
      switchPhase("bank");
    });

    dom.btnCloseCatalog.addEventListener("click", () => {
      Audio.playClick();
      closeCatalogModal();
    });
    dom.catalogSearchInput.addEventListener("input", (e) => {
      catalogSearch = e.target.value;
      renderCatalogGrid();
    });
    dom.catalogFilterTabs.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        Audio.playClick();
        dom.catalogFilterTabs.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        catalogFilter = tab.getAttribute("data-filter");
        renderCatalogGrid();
      });
    });

    dom.btnAckExplosion.addEventListener("click", () => {
      Audio.playClick();
      dom.explosionModal.classList.add("hidden");
      Sim.state.isPaused = false;
      updateTimeControlButtons();
      if (currentPhase === "pid") {
        renderFactorySelector();
        renderPidQuickbar();
        renderEncyclopedia();
      }
    });

    dom.btnZoomIn.addEventListener("click", () => { Audio.playClick(); WorldMap.zoomAt(1.25); });
    dom.btnZoomOut.addEventListener("click", () => { Audio.playClick(); WorldMap.zoomAt(0.80); });
    dom.btnZoomReset.addEventListener("click", () => { Audio.playClick(); WorldMap.fitCamera(); });

    dom.selectFactory.addEventListener("change", (e) => {
      Audio.playClick();
      Sim.state.activeFactoryId = e.target.value;
      renderFactorySelector();
      renderPidQuickbar();
      renderEncyclopedia();
      updateDynamicHUD();
    });

    dom.btnExpandLand.addEventListener("click", () => {
      const activeId = Sim.state.activeFactoryId;
      if (!activeId) return;
      const res = Sim.extendProcessChain(activeId);
      if (!res.ok) {
        Audio.playError();
        showToast(res.reason, "error");
        return;
      }
      Audio.playUpgrade();
      showToast(`Rangkaian alat diperpanjang ke Tahap #${res.stageNum}/12: ${res.unit.tag} — ${res.routeSpec.curGen.name} (-${fmtUSD(res.cost)})!`, "good");
      renderFactorySelector();
      renderPidQuickbar();
      renderEncyclopedia();
      updateDynamicHUD();
    });
  }

  function init() {
    cacheDOM();
    bindEvents();

    BlueprintMenu.init(dom.blueprintCanvas);

    WorldMap.init(dom.worldCanvas, (siteId) => {
      Audio.playClick();
      Sim.state.selectedRegionId = siteId;
      renderRegionQuickbar();
      renderWorldInspector();
    });

    PIDCanvas.init(dom.pidCanvas, (target) => {
      Audio.playClick();
      Sim.state.activeInspect = target;
      renderPidQuickbar();
      renderEncyclopedia();
    });

    renderRegionQuickbar();
    renderWorldInspector();
    updateDynamicHUD();
    updateTimeControlButtons();
  }

  function getCurrentPhase() {
    return currentPhase;
  }

  return {
    init,
    updateDynamicHUD,
    getCurrentPhase
  };
})();
