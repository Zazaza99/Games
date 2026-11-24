window.ChemTycoon = window.ChemTycoon || {};

window.ChemTycoon.Sim = (function () {
  const Data = window.ChemTycoon.Data;
  const Catalog = window.ChemTycoon.Catalog200;

  const DAY_DURATION_SEC = 5.0; // 5 detik waktu nyata (pada 1x) = 1 Hari kalender
  const SAVE_KEY_PREFIX = "CET_V13_SLOT_";

  const INDONESIAN_DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const INDONESIAN_MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const state = {
    version: "1.4",
    inMainMenu: true,
    isPaused: false,
    timeSpeed: 1,
    dayCount: 1,
    dayProgressSec: 0,
    startDateEpochMs: Date.UTC(2026, 0, 1),

    cash: Data.INITIAL_CASH,
    totalRevenueEarned: 0,
    selectedRegionId: "batam",
    activeFactoryId: null,
    activeInspect: { type: "equipment", id: "T-102" },

    customSites: {},
    surveyedRegions: {},
    factories: {}, // regionId -> { unlockedTier, activeProductId, levels, equipGens, utilities, unSurveyedPenalty, explosionCount }

    warehouse: {
      rawMaterials: {},
      products: {},
      shipmentLogs: []
    },

    hrPool: [],
    staffRoster: [],

    activeLoans: [],
    loanUidCounter: 1,

    market: {
      trendingMap: {},
      trendingList: [],
      interestRateMult: 1.0,
      equipmentPriceMult: 1.0,
      newspaperBoughtDay: 0,
      newsToday: null,
      newsYesterday: null
    },

    pendingExplosionModal: null,

    globalRates: {
      grossPerSec: 0,
      netPerSec: 0,
      taxAndCarbonPerSec: 0,
      logisticsPerSec: 0,
      utilitiesAndStaffPerSec: 0,
      loanInterestPerSec: 0,
      activeCount: 0,
      avgStability: 100
    }
  };

  function initDefaults() {
    Catalog.RAW_FEEDSTOCKS.forEach((f) => {
      state.warehouse.rawMaterials[f.id] = {
        qty: 80,
        purity: 85
      };
    });

    // v1.4: Stok produk jadi di gudang dimulai dari 0 unit (harus diproduksi pabrik terlebih dahulu sebelum bisa dijual)
    state.warehouse.products = {};

    Data.REGIONS.forEach((r) => {
      const evaluated = Data.evaluateWorldCoordinate(r.lat, r.lon, r.id);
      evaluated.name = r.name;
      evaluated.shortName = r.shortName;
      evaluated.country = r.country;
      evaluated.landBasePrice = r.landBasePrice;
      evaluated.foundationMod = r.foundationMod;
      evaluated.corporateTaxRate = r.corporateTaxRate;
      evaluated.carbonTaxPerTon = r.carbonTaxPerTon;
      evaluated.logisticsCostPerSec = r.logisticsCostPerSec;
      evaluated.expansionLevyBase = r.expansionLevyBase;
      evaluated.bonuses = r.bonuses;
      evaluated.summaryTag = r.summaryTag;
      state.customSites[r.id] = evaluated;
    });

    state.staffRoster = [
      {
        id: "EMP-INIT-1",
        name: "Ir. Hendra Wijaya",
        age: 36,
        archetype: "KOMPETEN",
        role: "Supervisor Proses Senior",
        education: "S1 Teknik Kimia — Institut Teknologi Bandung (ITB)",
        fullCV: {
          personalInfo: "Usia: 36 Tahun • Domisili: Kawasan Industri • Email: hendra.wijaya@chemmail.id",
          executiveSummary: "Insinyur proses senior pendiri tim operasional awal pabrik. Berpengalaman menjaga keseimbangan kolom fraksinasi dan keselamatan reaktor.",
          educationDetail: {
            degree: "S1 Teknik Kimia",
            school: "Institut Teknologi Bandung (ITB)",
            year: "2013",
            gpa: "3.68 / 4.00",
            thesis: "Pengendalian Loop Tertutup dan Mitigasi Tekanan pada Reaktor Kontinu"
          },
          workHistory: [
            {
              company: "PT Petrokimia Nusantara",
              title: "Senior Process Supervisor",
              period: "2015 – 2025",
              duties: "Mengawasi operasional harian unit proses hulu dan utilitas air pendingin.",
              leaveReason: "Bergabung mendirikan Chemical Engineering Tycoon."
            }
          ],
          certifications: ["Sertifikat Ahli K3 Kimia", "Operator DCS/SCADA Senior"]
        },
        dialogues: {
          q_emergency: {
            question: "Jika suhu reaktor melonjak ke 300°C, apa tindakan Anda?",
            answer: "\"Saya segera mengaktifkan pendinginan jaket darurat, menutup umpan reaktan, dan membuka jalur depressurizing ke scrubber.\""
          },
          q_history: {
            question: "Bagaimana rekam jejak keselamatan Anda?",
            answer: "\"10 tahun memimpin shift operasional tanpa kecelakaan kerja maupun ledakan reaktor.\""
          },
          q_pid: {
            question: "Apa saran Anda untuk meningkatkan kualitas produk ke Grade A?",
            answer: "\"Ganti peralatan proses dari Generasi 1 ke Generasi 3 atau 4 yang sesuai dengan rute produk aslinya Pak!\""
          },
          q_salary: {
            question: "Apakah kompensasi Anda saat ini sudah sesuai?",
            answer: "\"Sudah sangat sesuai Pak, saya siap mengawal pabrik tetap aman.\""
          }
        },
        interviewedTopics: {},
        salaryPerDay: 95,
        realSkill: 80,
        hazardMod: -10,
        tested: true
      }
    ];

    rollCandidateCVs(true);
    rollDailyMarketAndNews(true);
  }

  function formatCalendarDate(dayNum) {
    const d = new Date(state.startDateEpochMs + (dayNum - 1) * 86400000);
    const dayName = INDONESIAN_DAYS[d.getUTCDay()];
    const dateNum = d.getUTCDate();
    const monthName = INDONESIAN_MONTHS[d.getUTCMonth()];
    const yearNum = d.getUTCFullYear();
    return `${dayName}, ${dateNum} ${monthName} ${yearNum} (Hari #${dayNum})`;
  }

  // Ambil berita harian dari 300 Arsip Koran
  function rollDailyMarketAndNews(isInit) {
    if (state.market.newsToday) {
      state.market.newsYesterday = state.market.newsToday;
    }

    const archive300 = Data.get300NewsArchive();
    const editionEntry = archive300[(state.dayCount - 1) % archive300.length];

    const trendingMap = {};
    const trendingList = [];
    const reasons = [
      "Lonjakan pesanan industri semikonduktor & baterai EV Asia Timur",
      "Gangguan pasokan pabrik pesaing akibat pemadaman listrik regional",
      "Kontrak pengadaan darurat konsorsium dirgantara & otomotif global",
      "Booming konstruksi infrastruktur energi hijau dan desalinasi air",
      "Kelangkaan stok gudang pelabuhan utama Eropa & Amerika Utara"
    ];

    [1, 2, 3, 4].forEach((tier) => {
      const tierProds = Catalog.PRODUCTS.filter((p) => p.tier === tier);
      for (let k = 0; k < 2; k++) {
        const pick = tierProds[(state.dayCount * 7 + k * 23 + tier * 13) % tierProds.length];
        const mult = Number((1.42 + ((state.dayCount * 13 + k * 7 + tier * 5) % 48) / 100).toFixed(2));
        trendingMap[pick.id] = mult;
        trendingList.push({
          productId: pick.id,
          product: pick,
          mult: mult,
          reason: reasons[(state.dayCount + k + tier) % reasons.length]
        });
      }
    });

    // Pastikan produk utama dari edisi koran #i juga masuk daftar trending!
    const featProd = Catalog.getProductById(editionEntry.featuredProductId);
    if (featProd && !trendingMap[featProd.id]) {
      const fMult = Number((1 + editionEntry.boomPct / 100).toFixed(2));
      trendingMap[featProd.id] = fMult;
      trendingList[0] = {
        productId: featProd.id,
        product: featProd,
        mult: fMult,
        reason: editionEntry.marketStory
      };
    }

    state.market.trendingMap = trendingMap;
    state.market.trendingList = trendingList;
    state.market.interestRateMult = Number((editionEntry.interestIndexPct / 100).toFixed(2));
    state.market.equipmentPriceMult = Number((editionEntry.equipIndexPct / 100).toFixed(2));

    state.market.newsToday = {
      day: state.dayCount,
      editionNum: editionEntry.editionNum,
      tag: editionEntry.tag,
      dateStr: formatCalendarDate(state.dayCount),
      headline: editionEntry.headline,
      marketStory: editionEntry.marketStory,
      bankStory: editionEntry.bankStory,
      equipStory: editionEntry.equipStory,
      techSpotlight: editionEntry.techSpotlight,
      trendingSnapshot: trendingList.map((t) => `${t.product.id} ${t.product.name} (+${Math.round((t.mult - 1) * 100)}%)`)
    };

    if (isInit && !state.market.newsYesterday) {
      const edYest = archive300[299];
      state.market.newsYesterday = {
        day: 0,
        editionNum: 300,
        tag: edYest.tag,
        dateStr: "Rabu, 31 Desember 2025 (Edisi Kemarin)",
        headline: edYest.headline,
        marketStory: edYest.marketStory,
        bankStory: edYest.bankStory,
        equipStory: edYest.equipStory,
        techSpotlight: edYest.techSpotlight,
        trendingSnapshot: ["CHEM-001 Etilena Murni (+45%)", "CHEM-076 LDPE (+52%)", "CHEM-153 Serat Karbon (+60%)"]
      };
    }
  }

  function buyNewspaper() {
    if (state.market.newspaperBoughtDay === state.dayCount) {
      return { ok: true, alreadyBought: true };
    }
    if (state.cash < Data.NEWSPAPER_COST) {
      return { ok: false, reason: `Kas tidak cukup untuk membeli koran ($${Data.NEWSPAPER_COST}).` };
    }
    state.cash -= Data.NEWSPAPER_COST;
    state.market.newspaperBoughtDay = state.dayCount;
    return { ok: true, alreadyBought: false };
  }

  // ===========================================================================
  // FITUR SAVE & LOAD (LOCALSTORAGE MULTI-SLOT + JSON EXPORT/IMPORT)
  // ===========================================================================
  function serializeState() {
    return JSON.stringify({
      savedAt: new Date().toLocaleString("id-ID"),
      version: "1.4",
      dayCount: state.dayCount,
      dayProgressSec: state.dayProgressSec,
      cash: state.cash,
      totalRevenueEarned: state.totalRevenueEarned,
      selectedRegionId: state.selectedRegionId,
      activeFactoryId: state.activeFactoryId,
      activeInspect: state.activeInspect,
      customSites: state.customSites,
      surveyedRegions: state.surveyedRegions,
      factories: state.factories,
      warehouse: state.warehouse,
      hrPool: state.hrPool,
      staffRoster: state.staffRoster,
      activeLoans: state.activeLoans,
      loanUidCounter: state.loanUidCounter,
      newspaperBoughtDay: state.market.newspaperBoughtDay
    });
  }

  function applyLoadedPayload(data) {
    if (!data || typeof data.cash !== "number") {
      return { ok: false, reason: "Format data Save tidak valid." };
    }
    state.dayCount = data.dayCount || 1;
    state.dayProgressSec = data.dayProgressSec || 0;
    state.cash = data.cash;
    state.totalRevenueEarned = data.totalRevenueEarned || 0;
    state.selectedRegionId = data.selectedRegionId || "batam";
    state.activeFactoryId = data.activeFactoryId || null;
    state.activeInspect = data.activeInspect || { type: "equipment", id: "T-102" };
    if (data.customSites) state.customSites = data.customSites;
    if (data.surveyedRegions) state.surveyedRegions = data.surveyedRegions;
    if (data.factories) {
      // Pastikan kompatibilitas equipGens & installedStageCount (3..12 tahap) pada setiap pabrik
      Object.keys(data.factories).forEach((fid) => {
        const f = data.factories[fid];
        if (!f.installedStageCount) {
          f.installedStageCount = 3;
        }
        if (!f.levels) f.levels = {};
        if (!f.equipGens) f.equipGens = {};
        Data.EQUIPMENT.forEach((u) => {
          if (!f.equipGens[u.id]) f.equipGens[u.id] = 1;
          if (u.stageOrder >= 1 && u.stageOrder <= f.installedStageCount) {
            if (!f.levels[u.id] || f.levels[u.id] < 1) f.levels[u.id] = 1;
          } else if (u.id === "S-501") {
            if (!f.levels[u.id] || f.levels[u.id] < 1) f.levels[u.id] = 1;
          } else if (typeof f.levels[u.id] !== "number") {
            f.levels[u.id] = 0;
          }
        });
        f.unlockedTier = Math.min(4, Math.ceil(f.installedStageCount / 3));
      });
      state.factories = data.factories;
    }
    if (data.warehouse) state.warehouse = data.warehouse;
    if (data.hrPool) state.hrPool = data.hrPool;
    if (data.staffRoster) state.staffRoster = data.staffRoster;
    if (data.activeLoans) state.activeLoans = data.activeLoans;
    state.loanUidCounter = data.loanUidCounter || 1;
    rollDailyMarketAndNews(false);
    if (data.newspaperBoughtDay) state.market.newspaperBoughtDay = data.newspaperBoughtDay;
    return { ok: true };
  }

  function saveToSlot(slotId) {
    try {
      const raw = serializeState();
      localStorage.setItem(SAVE_KEY_PREFIX + slotId, raw);
      return { ok: true, slotId: slotId };
    } catch (err) {
      return { ok: false, reason: "Gagal menyimpan ke localStorage browser." };
    }
  }

  function loadFromSlot(slotId) {
    try {
      const raw = localStorage.getItem(SAVE_KEY_PREFIX + slotId);
      if (!raw) return { ok: false, reason: `Slot ${slotId} masih kosong.` };
      const parsed = JSON.parse(raw);
      return applyLoadedPayload(parsed);
    } catch (err) {
      return { ok: false, reason: "Data Save pada slot ini rusak." };
    }
  }

  function deleteSaveSlot(slotId) {
    try {
      localStorage.removeItem(SAVE_KEY_PREFIX + slotId);
      return { ok: true };
    } catch (e) {
      return { ok: false };
    }
  }

  function getSaveSlotsMeta() {
    const slots = ["1", "2", "3", "AUTO"];
    return slots.map((id) => {
      try {
        const raw = localStorage.getItem(SAVE_KEY_PREFIX + id);
        if (!raw) return { id: id, empty: true };
        const d = JSON.parse(raw);
        return {
          id: id,
          empty: false,
          savedAt: d.savedAt || "-",
          dayCount: d.dayCount || 1,
          cash: d.cash || 0,
          factoryCount: d.factories ? Object.keys(d.factories).length : 0
        };
      } catch (e) {
        return { id: id, empty: true };
      }
    });
  }

  function exportSaveJSON() {
    return serializeState();
  }

  function importSaveJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      return applyLoadedPayload(parsed);
    } catch (e) {
      return { ok: false, reason: "Kode JSON Save tidak valid." };
    }
  }

  // ===========================================================================
  // GEOGRAFI, PABRIK, RUTE PROSES & FITUR GANTI ALAT (4 GENERASI)
  // ===========================================================================
  function getRegion(regionId) {
    if (state.customSites[regionId]) return state.customSites[regionId];
    return Data.REGIONS.find((r) => r.id === regionId) || state.customSites["batam"];
  }

  function selectArbitraryCoordinate(lat, lon) {
    const existingIds = Object.keys(state.customSites);
    for (let i = 0; i < existingIds.length; i++) {
      const site = state.customSites[existingIds[i]];
      if (Math.hypot(site.lat - lat, site.lon - lon) < 1.6) {
        state.selectedRegionId = site.id;
        return site;
      }
    }
    const newSite = Data.evaluateWorldCoordinate(lat, lon);
    state.customSites[newSite.id] = newSite;
    state.selectedRegionId = newSite.id;
    return newSite;
  }

  function getUnitDef(unitId) {
    return Data.EQUIPMENT.find((u) => u.id === unitId);
  }

  // Mendapatkan spesifikasi alat spesifik sesuai produk yang sedang diproduksi pabrik!
  function getUnitRouteSpec(regionId, unitId) {
    const f = state.factories[regionId || state.activeFactoryId];
    const activeChem = Catalog.getProductById(f ? f.activeProductId : "CHEM-001");
    const route = Catalog.getRouteForProduct(activeChem);
    const curGenNum = (f && f.equipGens && f.equipGens[unitId]) ? f.equipGens[unitId] : 1;

    if (unitId === "S-501") {
      const gens = Catalog.SCRUBBER_GENS;
      const curGen = gens.find((g) => g.gen === curGenNum) || gens[0];
      const nextGen = gens.find((g) => g.gen === curGenNum + 1) || null;
      return {
        routeId: route.id,
        routeName: route.name,
        role: "Pengendali Emisi & Scrubber CCUS",
        shape: "scrubber",
        curGenNum: curGen.gen,
        curGen: curGen,
        nextGen: nextGen,
        allGens: gens
      };
    }

    if (unitId === "S-502") {
      const gens = Catalog.RECOVERY_GENS;
      const curGen = gens.find((g) => g.gen === curGenNum) || gens[0];
      const nextGen = gens.find((g) => g.gen === curGenNum + 1) || null;
      return {
        routeId: route.id,
        routeName: route.name,
        role: "Unit Daur Ulang Pelarut & Gas Buang (Recycler)",
        shape: "absorber",
        curGenNum: curGen.gen,
        curGen: curGen,
        nextGen: nextGen,
        allGens: gens
      };
    }

    const uSpec = (route.units && route.units[unitId]) || Catalog.PROCESS_ROUTES["ROUTE-DISTILASI"].units[unitId];
    const gens = uSpec.gens;
    const curGen = gens.find((g) => g.gen === curGenNum) || gens[0];
    const nextGen = gens.find((g) => g.gen === curGenNum + 1) || null;

    return {
      routeId: route.id,
      routeName: route.name,
      role: uSpec.role,
      shape: uSpec.shape,
      curGenNum: curGen.gen,
      curGen: curGen,
      nextGen: nextGen,
      allGens: gens
    };
  }

  function getSequentialUnits() {
    return Data.EQUIPMENT
      .filter((u) => u.stageOrder >= 1)
      .sort((a, b) => a.stageOrder - b.stageOrder);
  }

  function getLastInstalledUnitId(regionId) {
    const f = state.factories[regionId || state.activeFactoryId];
    const stageCount = f ? (f.installedStageCount || 3) : 3;
    const seq = getSequentialUnits().filter((u) => u.stageOrder <= stageCount);
    return seq.length > 0 ? seq[seq.length - 1].id : "E-201";
  }

  function getProductDef(prodId) {
    if (prodId === "FEED-01") {
      const activeFactory = state.factories[state.activeFactoryId];
      const activeChem = Catalog.getProductById(activeFactory ? activeFactory.activeProductId : "CHEM-001");
      const feed = Catalog.getFeedstockById(activeChem.feedstockId);
      return {
        id: "FEED-01",
        tag: "FEED-01",
        name: `Umpan: ${feed.name}`,
        tier: 0,
        formula: feed.formula,
        basePrice: feed.baseCost,
        isFeedstock: true,
        puritySourceUnit: "P-101",
        realWorldApp: feed.desc
      };
    }
    if (prodId === "PROD-OUT" || (prodId && prodId.startsWith("PROD-T"))) {
      const activeFactory = state.factories[state.activeFactoryId];
      const activeChem = Catalog.getProductById(activeFactory ? activeFactory.activeProductId : "CHEM-001");
      const lastUnitId = getLastInstalledUnitId(state.activeFactoryId);
      return {
        id: prodId,
        tag: activeChem.id,
        chemId: activeChem.id,
        name: `${activeChem.name} (${activeChem.id})`,
        tier: activeChem.tier,
        formula: activeChem.formula,
        reaction: activeChem.reaction,
        basePrice: activeChem.basePrice,
        puritySourceUnit: lastUnitId,
        realWorldApp: activeChem.realWorldApp
      };
    }
    return Catalog.getProductById(prodId);
  }

  function isSurveyed(regionId) {
    return Boolean(state.surveyedRegions[regionId]);
  }

  function isOwned(regionId) {
    return Boolean(state.factories[regionId]);
  }

  function getAcquisitionCost(regionId) {
    const r = getRegion(regionId);
    return Math.round(r.landBasePrice * (1 + r.foundationMod));
  }

  function getExpansionLevy(regionId, currentTier) {
    const info = getNextStageInfo(regionId);
    if (!info) return Infinity;
    return info.cost;
  }

  function getUpgradeCost(unitId, currentLevel) {
    const unit = getUnitDef(unitId);
    if (!unit) return Infinity;
    const marketMod = state.market.equipmentPriceMult || 1.0;
    return Math.round(unit.baseCost * Math.pow(1.13, currentLevel) * marketMod);
  }

  function getReplaceEquipmentCost(regionId, unitId) {
    const spec = getUnitRouteSpec(regionId, unitId);
    if (!spec || !spec.nextGen) return Infinity;
    const marketMod = state.market.equipmentPriceMult || 1.0;
    return Math.round(spec.nextGen.cost * marketMod);
  }

  function getNextStageInfo(regionId) {
    const f = state.factories[regionId];
    if (!f) return null;
    const curStages = f.installedStageCount || 3;
    if (curStages >= 12) return null;
    const nextStageNum = curStages + 1;
    const nextUnit = Data.EQUIPMENT.find((u) => u.stageOrder === nextStageNum);
    if (!nextUnit) return null;
    const r = getRegion(regionId);
    const marketMod = state.market.equipmentPriceMult || 1.0;
    const cost = Math.round((nextUnit.installCost || 400) * marketMod * (1 + r.foundationMod * 0.25));
    const routeSpec = getUnitRouteSpec(regionId, nextUnit.id);
    return {
      stageNum: nextStageNum,
      totalStages: 12,
      unit: nextUnit,
      routeSpec: routeSpec,
      cost: cost
    };
  }

  function surveyRegion(regionId) {
    if (isSurveyed(regionId)) {
      return { ok: false, reason: "Koordinat wilayah ini sudah disurvei oleh Geologist." };
    }
    if (state.cash < Data.SURVEY_COST) {
      return { ok: false, reason: "Kas tidak cukup untuk menyewa Geologist ($" + Data.SURVEY_COST + ")." };
    }
    state.cash -= Data.SURVEY_COST;
    state.surveyedRegions[regionId] = true;
    if (state.factories[regionId]) {
      state.factories[regionId].unSurveyedPenalty = 0;
    }
    return { ok: true };
  }

  function purchaseRegion(regionId, initialProductId) {
    if (isOwned(regionId)) {
      return { ok: false, reason: "Kilang sudah beroperasi di titik koordinat ini." };
    }
    const r = getRegion(regionId);
    const surveyed = isSurveyed(regionId);
    const surpriseCost = (!surveyed && r.foundationMod > 0.15) ? Math.round(r.landBasePrice * 0.12) : 0;
    const cost = getAcquisitionCost(regionId) + surpriseCost;

    if (state.cash < cost) {
      return { ok: false, reason: `Kas tidak mencukupi untuk biaya konstruksi & lahan ($${cost}).` };
    }
    state.cash -= cost;

    const chosenProd = Catalog.getProductById(initialProductId || "CHEM-001");

    // v1.4: Setiap kilang baru SELALU dimulai dari peralatan sedikit (3 tahap proses awal: P-101, T-102, E-201 + Scrubber S-501)
    // Kemudian pemain dapat memperpanjang rangkaian alat proses bertahap hingga 12 tahap!
    const initialStages = 3;
    const levels = {};
    const equipGens = {};
    Data.EQUIPMENT.forEach((u) => {
      if ((u.stageOrder >= 1 && u.stageOrder <= initialStages) || u.id === "S-501") {
        levels[u.id] = 1;
      } else {
        levels[u.id] = 0;
      }
      equipGens[u.id] = 1; // Dimulai dari alat Generasi 1 (paling dasar)
    });

    state.factories[regionId] = {
      installedStageCount: initialStages,
      unlockedTier: 1,
      activeProductId: chosenProd.id,
      levels: levels,
      equipGens: equipGens,
      utilities: {
        "UTIL-PWR": 1,
        "UTIL-WTR": 1,
        "UTIL-FLT": 1
      },
      unSurveyedPenalty: surveyed ? 0 : 12 + Math.round(r.seismicHazardPct * 0.35),
      explosionCount: 0
    };

    // v1.4: Stok produk awal di gudang dimulai dari 0 unit (tidak ada lagi stok gratis di awal)
    if (!state.warehouse.products[chosenProd.id]) {
      state.warehouse.products[chosenProd.id] = { qty: 0, purity: 76 };
    }

    state.activeFactoryId = regionId;
    return {
      ok: true,
      cost: cost,
      surpriseCost: surpriseCost,
      surveyed: surveyed
    };
  }

  function setFactoryTargetProduct(regionId, productId) {
    const f = state.factories[regionId];
    if (!f) return { ok: false, reason: "Kilang belum aktif." };
    const prod = Catalog.getProductById(productId);
    if (!prod) return { ok: false, reason: "Produk tidak ditemukan di katalog." };

    if (!f.equipGens) f.equipGens = {};
    Data.EQUIPMENT.forEach((u) => {
      if (!f.equipGens[u.id]) f.equipGens[u.id] = 1;
    });

    f.activeProductId = prod.id;
    // v1.4: Jangan tambahkan stok gratis saat ganti produk; mulai dari 0 unit jika belum pernah diproduksi
    if (!state.warehouse.products[prod.id]) {
      state.warehouse.products[prod.id] = { qty: 0, purity: 76 };
    }
    return { ok: true, product: prod };
  }

  // PERPANJANG RANGKAIAN ALAT PROSES (Dari 3 Tahap awal -> bertahap hingga 12 Tahap!)
  function extendProcessChain(regionId) {
    const f = state.factories[regionId];
    if (!f) return { ok: false, reason: "Kilang tidak ditemukan." };
    const info = getNextStageInfo(regionId);
    if (!info) {
      return { ok: false, reason: "Seluruh 12 Tahap Peralatan Proses Utama sudah terpasang lengkap!" };
    }
    if (state.cash < info.cost) {
      return {
        ok: false,
        reason: `Kas kurang untuk memasang alat Tahap #${info.stageNum}/12: ${info.unit.tag} ${info.routeSpec.curGen.name} ($${info.cost}).`
      };
    }

    state.cash -= info.cost;
    f.installedStageCount = info.stageNum;
    f.levels[info.unit.id] = 1;
    if (!f.equipGens) f.equipGens = {};
    f.equipGens[info.unit.id] = 1;
    f.unlockedTier = Math.min(4, Math.ceil(f.installedStageCount / 3));
    state.activeInspect = { type: "equipment", id: info.unit.id };

    return {
      ok: true,
      stageNum: info.stageNum,
      totalStages: info.totalStages,
      unit: info.unit,
      routeSpec: info.routeSpec,
      cost: info.cost,
      newTier: f.unlockedTier,
      levy: info.cost
    };
  }

  function expandFactoryLand(regionId) {
    return extendProcessChain(regionId);
  }

  function installOptionalUnit(regionId, unitId) {
    const f = state.factories[regionId];
    const u = getUnitDef(unitId);
    if (!f || !u) return { ok: false, reason: "Unit tidak ditemukan." };
    if (f.levels[unitId] && f.levels[unitId] >= 1) {
      return { ok: false, reason: "Unit ini sudah terpasang di pabrik." };
    }
    if (u.stageOrder >= 1) {
      const nextStage = (f.installedStageCount || 3) + 1;
      if (u.stageOrder !== nextStage) {
        return { ok: false, reason: `Pasang tahap proses secara berurutan (Tahap #${nextStage} terlebih dahulu).` };
      }
      return extendProcessChain(regionId);
    }
    const marketMod = state.market.equipmentPriceMult || 1.0;
    const cost = Math.round((u.installCost || 520) * marketMod);
    if (state.cash < cost) {
      return { ok: false, reason: `Kas tidak cukup untuk memasang ${u.tag} ${u.name} ($${cost}).` };
    }
    state.cash -= cost;
    f.levels[unitId] = 1;
    if (!f.equipGens) f.equipGens = {};
    f.equipGens[unitId] = 1;
    return { ok: true, unit: u, cost: cost };
  }

  function isUnitActiveInFactory(f, u) {
    if (!f || !u) return false;
    const lv = f.levels[u.id] || 0;
    if (lv <= 0) return false;
    if (u.stageOrder >= 1) {
      return u.stageOrder <= (f.installedStageCount || 3);
    }
    return true;
  }

  // GANTI ALAT KE GENERASI TEKNOLOGI LEBIH CANGGIH (Gen 1 -> Gen 2 -> Gen 3 -> Gen 4)
  function replaceUnitEquipment(regionId, unitId) {
    const f = state.factories[regionId];
    const u = getUnitDef(unitId);
    if (!f || !u) return { ok: false, reason: "Unit atau kilang tidak valid." };
    if (!isUnitActiveInFactory(f, u)) {
      return { ok: false, reason: `Pasang unit ${u.tag} terlebih dahulu sebelum mengganti generasinya.` };
    }
    if (!f.equipGens) f.equipGens = {};
    const spec = getUnitRouteSpec(regionId, unitId);
    if (!spec.nextGen) {
      return { ok: false, reason: "Alat pada slot ini sudah berada pada Generasi 4 (Paling Canggih)!" };
    }
    const cost = getReplaceEquipmentCost(regionId, unitId);
    if (state.cash < cost) {
      return { ok: false, reason: `Kas tidak cukup untuk mengganti alat ke ${spec.nextGen.name} ($${cost}).` };
    }
    state.cash -= cost;
    f.equipGens[unitId] = spec.nextGen.gen;
    return {
      ok: true,
      newGen: spec.nextGen,
      cost: cost
    };
  }

  function upgradeUnit(regionId, unitId) {
    const f = state.factories[regionId];
    const u = getUnitDef(unitId);
    if (!f || !u) return { ok: false, reason: "Unit atau kilang tidak valid." };
    if (!isUnitActiveInFactory(f, u)) {
      return { ok: false, reason: `Pasang unit ${u.tag} terlebih dahulu pada rangkaian proses.` };
    }
    const curLevel = f.levels[unitId] || 1;
    const cost = getUpgradeCost(unitId, curLevel);
    if (state.cash < cost) {
      return { ok: false, reason: "Kas tidak cukup untuk kalibrasi/upgrade " + u.tag + " ($" + cost + ")." };
    }
    state.cash -= cost;
    f.levels[unitId] = curLevel + 1;
    return { ok: true, newLevel: curLevel + 1, cost: cost };
  }

  function upgradeUtility(regionId, utilId) {
    const f = state.factories[regionId];
    const uDef = Data.UTILITIES.find((u) => u.id === utilId);
    if (!f || !uDef) return { ok: false, reason: "Utilitas tidak valid." };
    const curLv = f.utilities[utilId] || 1;
    const cost = Math.round(uDef.baseCost * Math.pow(1.22, curLv));
    if (state.cash < cost) {
      return { ok: false, reason: `Kas kurang untuk upgrade ${uDef.name} ($${cost}).` };
    }
    state.cash -= cost;
    f.utilities[utilId] = curLv + 1;
    return { ok: true, newLevel: curLv + 1, cost: cost };
  }

  function procureRawMaterial(supplierId, feedstockId, qtyTons, modeId, incotermId) {
    const activeRegion = getRegion(state.activeFactoryId || state.selectedRegionId);
    const quote = Data.calculateProcurementQuote(
      supplierId, feedstockId, qtyTons, modeId, incotermId, activeRegion.lat, activeRegion.lon
    );
    if (state.cash < quote.totalCost) {
      return { ok: false, reason: `Kas tidak cukup untuk kontrak pembelian ${quote.incoterm.code} ($${quote.totalCost}).` };
    }
    state.cash -= quote.totalCost;

    let deliveredTons = qtyTons;
    let transitIncident = null;
    if (quote.incoterm.riskFactor > 0.05 && Math.random() < quote.incoterm.riskFactor) {
      const lost = Math.max(1, Math.round(qtyTons * 0.15));
      deliveredTons -= lost;
      transitIncident = `Kargo ${quote.incoterm.code} tidak diasuransikan penuh: ${lost} ton menyusut selama perjalanan!`;
    }

    const cur = state.warehouse.rawMaterials[feedstockId] || { qty: 0, purity: 80 };
    const totalQty = cur.qty + deliveredTons;
    const blendedPurity = totalQty > 0
      ? (cur.qty * cur.purity + deliveredTons * quote.supplier.purity) / totalQty
      : quote.supplier.purity;

    state.warehouse.rawMaterials[feedstockId] = {
      qty: Number(totalQty.toFixed(1)),
      purity: Number(blendedPurity.toFixed(1))
    };

    state.warehouse.shipmentLogs.unshift({
      day: state.dayCount,
      type: "BELI",
      text: `Beli ${deliveredTons}t ${quote.feedstock.name} (${quote.supplier.grade}) dari ${quote.supplier.name} [${quote.incoterm.code} • ${quote.mode.id}] senilai -$${quote.totalCost.toLocaleString("id-ID")}.`
    });
    if (state.warehouse.shipmentLogs.length > 15) state.warehouse.shipmentLogs.pop();

    return { ok: true, quote: quote, deliveredTons: deliveredTons, transitIncident: transitIncident };
  }

  // v1.4 FIX BUG JUAL STOK KOSONG:
  // Hanya dapat menjual sesuai stok riil yang tersedia di Gudang! Jika stok 0, penjualan ditolak dan tidak mendapat uang!
  function sellWarehouseProduct(productId, qtyUnits, destId, modeId, incotermId) {
    if (!state.warehouse.products[productId]) {
      state.warehouse.products[productId] = { qty: 0, purity: 76 };
    }
    const stock = state.warehouse.products[productId];
    const availableQty = Number(stock.qty) || 0;

    if (availableQty <= 0.0001) {
      return {
        ok: false,
        reason: "Stok produk ini di Gudang kosong (0 unit)! Produksi barang di pabrik terlebih dahulu sebelum menjual."
      };
    }

    const requestedQty = Number(qtyUnits);
    if (!requestedQty || requestedQty <= 0) {
      return { ok: false, reason: "Masukkan jumlah unit penjualan lebih dari 0." };
    }

    if (requestedQty > availableQty + 0.0001) {
      return {
        ok: false,
        reason: `Stok di Gudang tidak mencukupi! Stok tersedia hanya ${availableQty.toFixed(2)} unit (Anda mencoba menjual ${requestedQty.toFixed(2)} unit).`
      };
    }

    const sellQty = Number(Math.min(availableQty, requestedQty).toFixed(2));
    if (sellQty <= 0) {
      return {
        ok: false,
        reason: "Stok produk di Gudang kosong (0 unit)! Tidak dapat melakukan penjualan."
      };
    }

    const activeRegion = getRegion(state.activeFactoryId || state.selectedRegionId);
    const gradeInfo = classifyGrade(stock.purity || 76);
    const trendMult = state.market.trendingMap[productId] || 1.0;

    const quote = Data.calculateExportQuote(
      productId, sellQty, stock.purity || 76, gradeInfo, destId, modeId, incotermId,
      activeRegion.lat, activeRegion.lon, trendMult, activeRegion.corporateTaxRate
    );

    const finalNetCash = Math.round(quote.netRevenue);

    stock.qty = Number(Math.max(0, availableQty - sellQty).toFixed(2));
    state.cash = Math.max(0, state.cash + finalNetCash);
    if (finalNetCash > 0) state.totalRevenueEarned += finalNetCash;

    state.warehouse.shipmentLogs.unshift({
      day: state.dayCount,
      type: "JUAL",
      text: `Ekspor ${sellQty.toFixed(2)}u ${quote.product.name} (${gradeInfo.grade}) ke ${quote.destination.country} [${quote.incoterm.code} • ${quote.mode.id}] bersih +$${finalNetCash.toLocaleString("id-ID")}.`
    });
    if (state.warehouse.shipmentLogs.length > 15) state.warehouse.shipmentLogs.pop();

    quote.netRevenue = finalNetCash;
    quote.soldQty = sellQty;
    return { ok: true, quote: quote };
  }

  function rollCandidateCVs(isFree) {
    const fee = isFree ? 0 : 40;
    if (state.cash < fee) {
      return { ok: false, reason: "Kas kurang untuk membuka berkas lamaran CV baru ($40)." };
    }
    state.cash -= fee;
    state.hrPool = [
      Data.generateCandidateCV(),
      Data.generateCandidateCV(),
      Data.generateCandidateCV(),
      Data.generateCandidateCV()
    ];
    return { ok: true };
  }

  function testCandidateCV(empId) {
    const cand = state.hrPool.find((c) => c.id === empId);
    if (!cand) return { ok: false, reason: "Kandidat tidak ditemukan." };
    if (cand.tested) return { ok: false, reason: "Kandidat sudah diuji." };
    const testFee = 60;
    if (state.cash < testFee) {
      return { ok: false, reason: "Kas kurang untuk biaya Tes Praktik Laboratorium ($60)." };
    }
    state.cash -= testFee;
    cand.tested = true;
    return { ok: true, candidate: cand };
  }

  function hireCandidate(empId) {
    const idx = state.hrPool.findIndex((c) => c.id === empId);
    if (idx === -1) return { ok: false, reason: "Kandidat tidak ditemukan." };
    const cand = state.hrPool[idx];
    if (state.cash < cand.salaryPerDay) {
      return { ok: false, reason: "Kas tidak cukup untuk membayar gaji hari pertama kandidat." };
    }
    state.cash -= cand.salaryPerDay;
    state.staffRoster.push(cand);
    state.hrPool.splice(idx, 1);
    return { ok: true, hired: cand };
  }

  function fireEmployee(empId) {
    if (state.staffRoster.length <= 1) {
      return { ok: false, reason: "Minimal harus ada 1 karyawan di pabrik!" };
    }
    const idx = state.staffRoster.findIndex((c) => c.id === empId);
    if (idx === -1) return { ok: false, reason: "Karyawan tidak ditemukan." };
    const emp = state.staffRoster[idx];
    const severance = Math.round(emp.salaryPerDay * 1.5);
    state.cash = Math.max(0, state.cash - severance);
    state.staffRoster.splice(idx, 1);
    return { ok: true, fired: emp, severance: severance };
  }

  function takeBankLoan(loanId) {
    const def = Data.BANK_LOANS.find((l) => l.id === loanId);
    if (!def) return { ok: false, reason: "Fasilitas pinjaman tidak ditemukan." };
    if (state.activeLoans.length >= 4) {
      return { ok: false, reason: "Maksimal 4 kontrak pinjaman aktif bersamaan. Lunasi pinjaman lama dahulu." };
    }
    const effectiveDailyRate = Number((def.baseDailyInterestRate * state.market.interestRateMult).toFixed(5));
    const loanRecord = {
      uid: "LN-" + (state.loanUidCounter++),
      loanId: def.id,
      bankName: def.bankName,
      title: def.title,
      principalRemaining: def.principal,
      originalPrincipal: def.principal,
      dailyInterestRate: effectiveDailyRate,
      takenDay: state.dayCount
    };
    state.activeLoans.push(loanRecord);
    state.cash += def.principal;
    return { ok: true, loan: loanRecord };
  }

  function repayBankLoan(uid) {
    const idx = state.activeLoans.findIndex((l) => l.uid === uid);
    if (idx === -1) return { ok: false, reason: "Kontrak pinjaman tidak ditemukan." };
    const loan = state.activeLoans[idx];
    if (state.cash < loan.principalRemaining) {
      return { ok: false, reason: `Kas belum cukup untuk melunasi pokok pinjaman ($${loan.principalRemaining.toLocaleString("id-ID")}).` };
    }
    state.cash -= loan.principalRemaining;
    state.activeLoans.splice(idx, 1);
    return { ok: true, repaid: loan };
  }

  function classifyGrade(purity) {
    if (purity < 80) {
      return {
        grade: "Grade C",
        cssClass: "grade-c",
        multiplier: 0.50,
        label: "Grade C (<80% • Diskon -50%)"
      };
    }
    if (purity <= 92) {
      return {
        grade: "Grade B",
        cssClass: "grade-b",
        multiplier: 0.80,
        label: "Grade B (80–92% • Standar Industri)"
      };
    }
    return {
      grade: "Grade A",
      cssClass: "grade-a",
      multiplier: 1.00,
      label: "Grade A (>92% • Kemurnian Penuh 100%)"
    };
  }

  function computeStaffMetrics() {
    let totalSalaryPerDay = 0;
    let totalSkill = 0;
    let totalHazardMod = 0;
    let kopongCount = 0;
    const culpritNames = [];

    state.staffRoster.forEach((emp) => {
      totalSalaryPerDay += emp.salaryPerDay;
      totalSkill += emp.realSkill;
      totalHazardMod += emp.hazardMod;
      if (emp.realSkill < 35 || emp.hazardMod > 10) {
        kopongCount += 1;
        culpritNames.push(`${emp.name} (${emp.role}, Skill ${emp.realSkill}/100)`);
      }
    });

    const count = Math.max(1, state.staffRoster.length);
    const avgSkill = totalSkill / count;
    const purityBonusFromStaff = (avgSkill - 60) * 0.12;
    const throughputMultFromStaff = Math.max(0.65, 0.85 + (avgSkill / 100) * 0.35);

    return {
      count,
      totalSalaryPerDay,
      totalSalaryPerSec: totalSalaryPerDay / DAY_DURATION_SEC,
      avgSkill,
      totalHazardMod,
      kopongCount,
      culpritNames,
      purityBonusFromStaff,
      throughputMultFromStaff
    };
  }

  function computeFactoryMetrics(regionId) {
    const region = getRegion(regionId);
    const f = state.factories[regionId];
    if (!f) return null;
    if (!f.installedStageCount) f.installedStageCount = 3;
    if (!f.equipGens) {
      f.equipGens = {};
      Data.EQUIPMENT.forEach((u) => { f.equipGens[u.id] = 1; });
    }
    f.unlockedTier = Math.min(4, Math.ceil(f.installedStageCount / 3));

    const activeChem = Catalog.getProductById(f.activeProductId || "CHEM-001");
    const route = Catalog.getRouteForProduct(activeChem);
    const rawStock = state.warehouse.rawMaterials[activeChem.feedstockId] || { qty: 0, purity: 78 };
    const hasWarehouseFeed = rawStock.qty > 0.05;
    const feedPurityMod = ((hasWarehouseFeed ? rawStock.purity : 72) - 82) * 0.25;

    const staff = computeStaffMetrics();

    const pwrLv = (f.utilities && f.utilities["UTIL-PWR"]) || 1;
    const wtrLv = (f.utilities && f.utilities["UTIL-WTR"]) || 1;
    const fltLv = (f.utilities && f.utilities["UTIL-FLT"]) || 1;

    const pwrSupply = Data.UTILITIES[0].baseCap + (pwrLv - 1) * Data.UTILITIES[0].capPerLevel;
    const wtrSupply = Data.UTILITIES[1].baseCap + (wtrLv - 1) * Data.UTILITIES[1].capPerLevel;
    const fltSupply = Data.UTILITIES[2].baseCap + (fltLv - 1) * Data.UTILITIES[2].capPerLevel;

    const unitStats = {};
    let grossCo2 = 0;
    let totalActiveLevels = 0;
    let equipHazardSum = 0;
    let equipPowerModAvg = 0;
    let activeEquipCount = 0;

    Data.EQUIPMENT.forEach((u) => {
      const lv = f.levels[u.id] || 0;
      const active = isUnitActiveInFactory(f, u);
      const spec = getUnitRouteSpec(regionId, u.id);
      const genObj = spec.curGen;

      if (active) {
        totalActiveLevels += lv;
        if (u.id !== "S-501" && u.id !== "S-502") {
          equipHazardSum += (genObj.hazardMod || 0);
          equipPowerModAvg += (genObj.powerMod || 1.0);
          activeEquipCount += 1;
        }
      }

      const genCapMult = genObj.capMult || 1.0;
      const capacity = active
        ? u.baseCapacity * genCapMult * Math.pow(u.capGrowth, lv - 1) * region.bonuses.throughputMult * staff.throughputMultFromStaff
        : 0;
      const temp = active ? u.tempBase + (lv - 1) * u.tempPerLevel + (spec.curGenNum - 1) * 12 : 25;
      const pressure = active ? u.pressureBase + (lv - 1) * u.pressurePerLevel + (spec.curGenNum - 1) * 3 : 1.0;
      const co2 = active ? u.baseCo2 * (1 + 0.07 * (lv - 1)) * (genObj.powerMod || 1.0) : 0;
      grossCo2 += co2;

      unitStats[u.id] = {
        id: u.id,
        stageOrder: u.stageOrder || 0,
        level: lv,
        genNum: spec.curGenNum,
        genName: genObj.name,
        roleName: spec.role,
        shape: spec.shape,
        genDesc: genObj.desc,
        nextGen: spec.nextGen,
        replaceCost: active && spec.nextGen ? getReplaceEquipmentCost(regionId, u.id) : 0,
        maxPurityCap: genObj.maxPurityCap || 99.9,
        genPurityBonus: genObj.purityBonus || 0,
        active: active,
        capacity: capacity,
        temp: temp,
        pressure: pressure,
        co2: co2,
        nextCost: active ? getUpgradeCost(u.id, lv) : 0
      };
    });

    const pwrMod = activeEquipCount > 0 ? (equipPowerModAvg / activeEquipCount) : 1.0;
    const pwrDemand = Math.round(activeChem.powerKwh * (1 + totalActiveLevels * 0.09) * pwrMod);
    const wtrDemand = Number((activeChem.waterM3 * (1 + totalActiveLevels * 0.085)).toFixed(1));
    const fltDemand = Math.round(12 + totalActiveLevels * 1.8);

    const pwrRatio = Math.min(1, pwrSupply / Math.max(1, pwrDemand));
    const wtrRatio = Math.min(1, wtrSupply / Math.max(1, wtrDemand));
    const fltRatio = Math.min(1, fltSupply / Math.max(1, fltDemand));
    const utilityThrottle = Math.min(pwrRatio, wtrRatio, fltRatio) * (hasWarehouseFeed ? 1.0 : 0.45);

    const coolingDeficitDanger = wtrRatio < 0.85 ? Math.round((0.85 - wtrRatio) * 85) : 0;

    const rawHazard =
      Math.max(0, staff.totalHazardMod + equipHazardSum) +
      coolingDeficitDanger +
      (f.unSurveyedPenalty || 0) +
      Math.round(region.seismicHazardPct * 0.18);
    const stability = Math.max(5, Math.min(100, Math.round(100 - rawHazard)));

    // Scrubber CCUS efficiency (dipengaruhi Generasi Alat S-501 + Level Kalibrasi)
    const scrubSpec = getUnitRouteSpec(regionId, "S-501");
    const scrubberLvl = unitStats["S-501"].level || 1;
    const captureRatio = Math.min(0.96, (scrubSpec.curGen.captureBase || 0.20) + (scrubberLvl - 1) * 0.08);

    // Recycler S-502 efficiency (menghemat bahan baku & menurunkan emisi)
    const recyclerActive = unitStats["S-502"] && unitStats["S-502"].active;
    const recyclerSpec = getUnitRouteSpec(regionId, "S-502");
    const recyclerLvl = recyclerActive ? (unitStats["S-502"].level || 1) : 0;
    const feedSavingRatio = recyclerActive
      ? Math.min(0.55, (recyclerSpec.curGen.feedSaving || 0.10) + (recyclerLvl - 1) * 0.025)
      : 0;

    const netCo2 = grossCo2 * (1 - captureRatio) * (recyclerActive ? 0.88 : 1.0);
    const carbonTaxPerSec = netCo2 * region.carbonTaxPerTon;

    // Rangkaian proses aktif berurutan dari Tahap #1 sampai Tahap #installedStageCount (mulai dari 3 alat hingga 12 alat!)
    const chainIds = getSequentialUnits()
      .filter((u) => u.stageOrder <= f.installedStageCount && unitStats[u.id] && unitStats[u.id].active)
      .map((u) => u.id);

    const bottlenecks = [];
    const pipeHealth = {};
    const stageFlows = {};
    let runningMinFlow = Infinity;

    for (let i = 0; i < chainIds.length; i++) {
      const id = chainIds[i];
      const cap = unitStats[id].capacity * utilityThrottle;
      runningMinFlow = Math.min(runningMinFlow, cap);
      stageFlows[id] = runningMinFlow;

      if (i > 0) {
        const prevId = chainIds[i - 1];
        const prevCap = unitStats[prevId].capacity * utilityThrottle;
        const maxPair = Math.max(prevCap, cap);
        const minPair = Math.min(prevCap, cap);
        const ratio = maxPair > 0 ? minPair / maxPair : 1;
        const isBottleneck = ratio < 0.80;
        let limitingId = null;
        if (isBottleneck) {
          limitingId = cap < prevCap ? id : prevId;
          const prevName = unitStats[prevId].genName;
          const curName = unitStats[id].genName;
          if (cap < prevCap) {
            bottlenecks.push({
              pipe: prevId + "->" + id,
              limitingId: id,
              ratio: ratio,
              message: `${id} (${curName}: ${cap.toFixed(1)} t/jam) kewalahan menerima aliran dari ${prevId} (${prevCap.toFixed(1)} t/jam). Ganti Alat atau Upgrade ${id}!`
            });
          } else {
            bottlenecks.push({
              pipe: prevId + "->" + id,
              limitingId: prevId,
              ratio: ratio,
              message: `${prevId} (${prevName}: ${prevCap.toFixed(1)} t/jam) kurang suplai untuk ${id} (${cap.toFixed(1)} t/jam). Ganti Alat atau Upgrade ${prevId}!`
            });
          }
        }
        pipeHealth[prevId + "->" + id] = {
          ratio: ratio,
          bottlenecked: isBottleneck,
          limitingId: limitingId,
          flowRate: runningMinFlow
        };
      }
    }

    if (!hasWarehouseFeed) {
      bottlenecks.unshift({
        pipe: "FEED",
        limitingId: "FEED-01",
        ratio: 0.45,
        message: `Gudang bahan baku [${Catalog.getFeedstockById(activeChem.feedstockId).name}] kosong! Beli bahan baku di menu Gudang & Market!`
      });
    }
    if (wtrRatio < 0.95) {
      bottlenecks.unshift({
        pipe: "UTIL-WTR",
        limitingId: "UTIL-WTR",
        ratio: wtrRatio,
        message: `Air pendingin defisit (${wtrDemand} vs ${wtrSupply} m³/jam)! Reaktor panas & risiko meledak naik!`
      });
    }

    const extraPurity = region.bonuses.purityBonus + feedPurityMod + staff.purityBonusFromStaff;

    // Kemurnian dihitung kumulatif sepanjang rangkaian alat yang sudah dipasang (3 s/d 12 tahap)
    let accumPurity = 71.0 + extraPurity + (f.installedStageCount - 3) * 1.75;
    let avgCeiling = 0;
    chainIds.forEach((uid, idx) => {
      const st = unitStats[uid];
      const weight = idx === chainIds.length - 1 ? 1.4 : 0.55 / Math.max(1, chainIds.length - 1);
      accumPurity += ((st.level - 1) * 1.4 + st.genPurityBonus) * weight;
      avgCeiling += st.maxPurityCap;
    });
    const chainCeiling = chainIds.length > 0
      ? Math.min(99.9, (avgCeiling / chainIds.length) + (f.installedStageCount - 3) * 1.2)
      : 82.0;
    const computedChainPurity = Math.max(60, Math.min(chainCeiling, accumPurity));

    const purities = {
      1: computedChainPurity,
      2: computedChainPurity,
      3: computedChainPurity,
      4: computedChainPurity
    };

    const maxCapActive = chainIds.reduce((m, id) => Math.max(m, unitStats[id].capacity * utilityThrottle), 0);
    const overallBalance = maxCapActive > 0 ? runningMinFlow / maxCapActive : 1;

    const activeTier = activeChem.tier;
    const endUnitId = chainIds.length > 0 ? chainIds[chainIds.length - 1] : "E-201";
    const activeFlowTon = stageFlows[endUnitId] || 0;
    const activePurity = computedChainPurity;
    const activeGrade = classifyGrade(activePurity);
    const trendMult = state.market.trendingMap[activeChem.id] || 1.0;
    const regionalMult = activeTier >= 3 ? region.bonuses.tier34PriceMult : 1.0;

    // Semakin panjang rangkaian alat proses (dari 3 alat hingga 12 alat), konversi yield produksi makin tinggi!
    const chainLengthMult = 1 + (f.installedStageCount - 3) * 0.18;
    const scaleByTier = activeTier === 1 ? 0.14 : activeTier === 2 ? 0.085 : activeTier === 3 ? 0.032 : 0.012;
    const producedUnitsPerSec = activeFlowTon * scaleByTier * chainLengthMult;
    const unitGrossPrice = activeChem.basePrice * activeGrade.multiplier * trendMult * regionalMult;
    const unitNetPrice = unitGrossPrice * (1 - region.corporateTaxRate);

    const spotCashRevenuePerSec = producedUnitsPerSec * unitGrossPrice * 0.35;
    const warehouseUnitsPerSec = producedUnitsPerSec * 0.65;
    const feedConsumedTonPerSec = producedUnitsPerSec * activeChem.feedstockPerUnit * 0.08 * (1 - feedSavingRatio);

    const productStats = {
      "FEED-01": {
        id: "FEED-01",
        active: true,
        purity: hasWarehouseFeed ? rawStock.purity : 72,
        gradeInfo: classifyGrade(hasWarehouseFeed ? rawStock.purity : 72),
        flowTonPerHr: activeFlowTon,
        unitsPerSec: feedConsumedTonPerSec,
        unitMarketPriceGross: Catalog.getFeedstockById(activeChem.feedstockId).baseCost,
        unitMarketPriceNet: Catalog.getFeedstockById(activeChem.feedstockId).baseCost,
        revenuePerSec: 0
      },
      "PROD-OUT": {
        id: "PROD-OUT",
        chemId: activeChem.id,
        active: true,
        isTargetTier: true,
        purity: activePurity,
        gradeInfo: activeGrade,
        flowTonPerHr: activeFlowTon,
        unitsPerSec: producedUnitsPerSec,
        warehouseRatePerSec: warehouseUnitsPerSec,
        unitMarketPriceGross: unitGrossPrice,
        unitMarketPriceNet: unitNetPrice,
        revenuePerSec: producedUnitsPerSec * unitGrossPrice
      }
    };

    [1, 2, 3, 4].forEach((t) => {
      const nodeKey = "PROD-T" + t;
      productStats[nodeKey] = {
        id: nodeKey,
        chemId: activeChem.id,
        active: true,
        isTargetTier: true,
        purity: activePurity,
        gradeInfo: activeGrade,
        flowTonPerHr: activeFlowTon,
        unitsPerSec: producedUnitsPerSec,
        warehouseRatePerSec: warehouseUnitsPerSec,
        unitMarketPriceGross: unitGrossPrice,
        unitMarketPriceNet: unitNetPrice,
        revenuePerSec: producedUnitsPerSec * unitGrossPrice
      };
    });

    const utilityUpkeepPerSec =
      pwrLv * Data.UTILITIES[0].upkeepPerSec +
      wtrLv * Data.UTILITIES[1].upkeepPerSec +
      fltLv * Data.UTILITIES[2].upkeepPerSec +
      (hasWarehouseFeed ? 0 : 10);

    const logisticsPerSec = region.logisticsCostPerSec * (1 + (f.installedStageCount - 3) * 0.08);
    const operatingProfit = spotCashRevenuePerSec - logisticsPerSec - carbonTaxPerSec - utilityUpkeepPerSec;
    const corporateTaxPerSec = Math.max(0, operatingProfit) * region.corporateTaxRate;
    const netProfitPerSec = operatingProfit - corporateTaxPerSec;

    return {
      regionId,
      region,
      installedStageCount: f.installedStageCount,
      totalMaxStages: 12,
      chainIds,
      endUnitId,
      nextStageInfo: getNextStageInfo(regionId),
      unlockedTier: f.unlockedTier,
      activeChem,
      route,
      activePurity,
      activeGrade,
      producedUnitsPerSec,
      warehouseUnitsPerSec,
      feedConsumedTonPerSec,
      feedSavingRatio,
      hasWarehouseFeed,
      rawStock,
      unitStats,
      productStats,
      utilities: {
        pwrLv, pwrSupply, pwrDemand, pwrRatio,
        wtrLv, wtrSupply, wtrDemand, wtrRatio,
        fltLv, fltSupply, fltDemand, fltRatio,
        utilityUpkeepPerSec
      },
      staff,
      stability,
      pipeHealth,
      bottlenecks,
      overallBalance,
      upstreamFlowTonHr: stageFlows[endUnitId] || 0,
      grossCo2,
      captureRatio,
      netCo2,
      grossRevenuePerSec: spotCashRevenuePerSec,
      logisticsPerSec,
      carbonTaxPerSec,
      corporateTaxPerSec,
      netProfitPerSec
    };
  }

  function triggerFactoryExplosion(regionId, reasonText) {
    const f = state.factories[regionId];
    const r = getRegion(regionId);
    if (!f) return null;

    f.explosionCount = (f.explosionCount || 0) + 1;

    const damagedUnits = [];
    Data.EQUIPMENT.forEach((u) => {
      if (f.levels[u.id] > 1) {
        f.levels[u.id] = Math.max(1, f.levels[u.id] - 1);
        damagedUnits.push(`${u.tag} turun ke Lv.${f.levels[u.id]}`);
      }
    });

    const emergencyFine = Math.min(Math.round(state.cash * 0.35), 2800);
    state.cash = Math.max(150, state.cash - emergencyFine);

    Object.keys(state.warehouse.products).forEach((pid) => {
      state.warehouse.products[pid].qty = Number((state.warehouse.products[pid].qty * 0.5).toFixed(1));
    });

    const report = {
      day: state.dayCount,
      dateStr: formatCalendarDate(state.dayCount),
      factoryName: r.name,
      reason: reasonText,
      fine: emergencyFine,
      damagedUnits: damagedUnits.length > 0 ? damagedUnits : ["Pipa manifold utama & segel katup reaktor rusak berat"]
    };

    state.pendingExplosionModal = report;
    return report;
  }

  function skipTime(daysToSkip) {
    const ownedIds = Object.keys(state.factories);
    let explodedReport = null;

    for (let d = 0; d < daysToSkip; d++) {
      advanceSingleDayInternal(DAY_DURATION_SEC);

      ownedIds.forEach((rid) => {
        if (explodedReport) return;
        const m = computeFactoryMetrics(rid);
        if (!m) return;

        const instabilityGap = Math.max(0, 82 - m.stability);
        const neglectPenalty = daysToSkip >= 365 ? 0.045 : daysToSkip >= 30 ? 0.022 : 0.008;
        const dailyBoomProb = (instabilityGap / 100) * 0.18 + (m.staff.kopongCount * 0.04) + neglectPenalty;

        if (Math.random() < dailyBoomProb) {
          let cause = `Anda mengabaikan pengawasan kilang selama Skip Time (${daysToSkip} Hari) sehingga tekanan uap reaktor melampaui batas kritis!`;
          if (m.staff.culpritNames.length > 0) {
            cause = `Karyawan tidak kompeten [${m.staff.culpritNames[0]}] salah menutup katup pelepas tekanan reaktor saat Anda mengabaikan pabrik (Skip Time ${daysToSkip} Hari)!`;
          } else if (m.utilities.wtrRatio < 0.9) {
            cause = `Defisit air pendingin Cooling Tower memicu Thermal Runaway pada reaktor selama Skip Time (${daysToSkip} Hari)!`;
          }
          explodedReport = triggerFactoryExplosion(rid, cause);
        }
      });

      if (explodedReport) break;
    }

    return {
      ok: true,
      daysSkipped: daysToSkip,
      explosion: explodedReport
    };
  }

  function advanceSingleDayInternal(dtSec) {
    let totalGross = 0;
    let totalNet = 0;
    let totalTaxAndCarbon = 0;
    let totalLogistics = 0;
    let totalUtilStaff = 0;
    let activeCount = 0;
    let stabilitySum = 0;

    const staff = computeStaffMetrics();

    let totalDailyLoanInterest = 0;
    state.activeLoans.forEach((ln) => {
      totalDailyLoanInterest += ln.principalRemaining * ln.dailyInterestRate;
    });
    const loanInterestPerSec = totalDailyLoanInterest / DAY_DURATION_SEC;

    Object.keys(state.factories).forEach((regionId) => {
      const m = computeFactoryMetrics(regionId);
      if (!m) return;
      activeCount += 1;
      stabilitySum += m.stability;
      totalGross += m.grossRevenuePerSec;
      totalNet += m.netProfitPerSec;
      totalTaxAndCarbon += m.corporateTaxPerSec + m.carbonTaxPerSec;
      totalLogistics += m.logisticsPerSec;
      totalUtilStaff += m.utilities.utilityUpkeepPerSec;

      if (m.hasWarehouseFeed) {
        const curRaw = state.warehouse.rawMaterials[m.activeChem.feedstockId];
        if (curRaw) {
          curRaw.qty = Math.max(0, Number((curRaw.qty - m.feedConsumedTonPerSec * dtSec).toFixed(3)));
        }
      }

      const prodId = m.activeChem.id;
      const curProd = state.warehouse.products[prodId] || { qty: 0, purity: m.activePurity };
      const addedQty = m.warehouseUnitsPerSec * dtSec;
      const newQty = curProd.qty + addedQty;
      const blendedPur = newQty > 0 ? (curProd.qty * curProd.purity + addedQty * m.activePurity) / newQty : m.activePurity;
      state.warehouse.products[prodId] = {
        qty: Number(newQty.toFixed(2)),
        purity: Number(blendedPur.toFixed(1))
      };
    });

    const staffCostPerSec = activeCount > 0 ? staff.totalSalaryPerSec : 0;
    const finalNetPerSec = totalNet - staffCostPerSec - loanInterestPerSec;

    state.cash = Math.max(0, state.cash + finalNetPerSec * dtSec);
    if (finalNetPerSec > 0) {
      state.totalRevenueEarned += finalNetPerSec * dtSec;
    }

    state.dayProgressSec += dtSec;
    while (state.dayProgressSec >= DAY_DURATION_SEC) {
      state.dayProgressSec -= DAY_DURATION_SEC;
      state.dayCount += 1;
      rollDailyMarketAndNews(false);
      // Auto-Save setiap pergantian hari
      saveToSlot("AUTO");

      Object.keys(state.factories).forEach((rid) => {
        const m = computeFactoryMetrics(rid);
        if (m && m.stability < 48 && Math.random() < (55 - m.stability) * 0.015) {
          const cause = m.staff.culpritNames.length > 0
            ? `Karyawan skill kopong [${m.staff.culpritNames[0]}] memicu kegagalan katup bertekanan tinggi!`
            : `Stabilitas pabrik anjlok (${m.stability}%) akibat defisit pendinginan & risiko geoteknik!`;
          triggerFactoryExplosion(rid, cause);
        }
      });
    }

    state.globalRates = {
      grossPerSec: totalGross,
      netPerSec: finalNetPerSec,
      taxAndCarbonPerSec: totalTaxAndCarbon,
      logisticsPerSec: totalLogistics,
      utilitiesAndStaffPerSec: totalUtilStaff + staffCostPerSec,
      loanInterestPerSec: loanInterestPerSec,
      activeCount: activeCount,
      avgStability: activeCount > 0 ? Math.round(stabilitySum / activeCount) : 100
    };
  }

  function step(realDtSec) {
    if (state.inMainMenu || state.isPaused) return;
    const simDt = realDtSec * (state.timeSpeed || 1);
    advanceSingleDayInternal(simDt);
  }

  initDefaults();

  return {
    state,
    formatCalendarDate,
    saveToSlot,
    loadFromSlot,
    deleteSaveSlot,
    getSaveSlotsMeta,
    exportSaveJSON,
    importSaveJSON,
    getRegion,
    selectArbitraryCoordinate,
    getUnitDef,
    getUnitRouteSpec,
    getSequentialUnits,
    getNextStageInfo,
    getProductDef,
    isSurveyed,
    isOwned,
    getAcquisitionCost,
    getExpansionLevy,
    getUpgradeCost,
    getReplaceEquipmentCost,
    surveyRegion,
    purchaseRegion,
    setFactoryTargetProduct,
    extendProcessChain,
    expandFactoryLand,
    installOptionalUnit,
    replaceUnitEquipment,
    upgradeUnit,
    upgradeUtility,
    procureRawMaterial,
    sellWarehouseProduct,
    rollCandidateCVs,
    testCandidateCV,
    hireCandidate,
    fireEmployee,
    takeBankLoan,
    repayBankLoan,
    buyNewspaper,
    computeStaffMetrics,
    computeFactoryMetrics,
    triggerFactoryExplosion,
    skipTime,
    step
  };
})();
