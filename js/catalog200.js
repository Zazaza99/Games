window.ChemTycoon = window.ChemTycoon || {};

window.ChemTycoon.Catalog200 = (function () {
  // 5 Kategori Bahan Baku Utama di Gudang Bahan Baku
  const RAW_FEEDSTOCKS = [
    {
      id: "RAW-CRUDE",
      name: "Minyak Mentah & Kondensat",
      unit: "ton",
      baseCost: 55,
      formula: "CₙH₂ₙ₊₂ (Campuran Hidrokarbon)",
      desc: "Umpan minyak bumi ringan hingga berat untuk distilasi nafta, aromatik BTX, dan bahan bakar."
    },
    {
      id: "RAW-GAS",
      name: "Gas Alam, Etana & LPG",
      unit: "ton",
      baseCost: 42,
      formula: "CH₄ + C₂H₆ + C₃H₈",
      desc: "Umpan gas hidrokarbon untuk steam cracking olefin, sintesis metanol, amonia, dan hidrogen."
    },
    {
      id: "RAW-MINERAL",
      name: "Mineral Industri, Garam & Sulfur",
      unit: "ton",
      baseCost: 48,
      formula: "NaCl + S₈ + CaF₂ + SiO₂ + Batuan Fosfat",
      desc: "Bahan galian anorganik untuk klor-alkali, asam sulfat/fosfat, fluorokimia (PTFE), dan silikon."
    },
    {
      id: "RAW-BIO",
      name: "Biomassa, Selulosa & Aromatik Ter",
      unit: "ton",
      baseCost: 50,
      formula: "(C₆H₁₀O₅)ₙ + Trigliserida + Fenol Kasar",
      desc: "Bahan baku kimia hijau, oleokimia, surfaktan, bio-polimer, dan prekursor farmasi."
    },
    {
      id: "RAW-METAL",
      name: "Logam Murni & Bijih Litium/Titanium",
      unit: "ton",
      baseCost: 115,
      formula: "Al + Ti + Li₂CO₃ + Ni + Co + Pt",
      desc: "Prekursor metalurgi presisi, katoda baterai EV, katalis logam mulia, dan komposit dirgantara."
    }
  ];

  // ===========================================================================
  // 8 RUTE PROSES TEKNIK KIMIA & 4 GENERASI GANTI ALAT (EQUIPMENT TECH TIERS)
  // ===========================================================================
  // Setiap produk kimia menyesuaikan alat di kanvas P&ID dengan proses aslinya!
  // Pemain bisa MENGGANTI ALAT dari Gen 1 (Konvensional) -> Gen 2 -> Gen 3 -> Gen 4 (Canggih)
  const PROCESS_ROUTES = {
    "ROUTE-DISTILASI": {
      id: "ROUTE-DISTILASI",
      name: "Rute Fraksinasi Hidrokarbon & Aromatik BTX",
      desc: "Rangkaian pemisahan termal minyak bumi, reforming katalitik, dan ekstraksi pelarut aromatik.",
      units: {
        "P-101": {
          role: "Preparasi & Desalting Umpan",
          shape: "pump",
          gens: [
            { gen: 1, name: "Pompa Roda Gigi & Bak Pengendap Garam", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 6, desc: "Memompa minyak mentah dan mengendapkan air garam secara gravitasi lambat (mentok Grade C)." },
            { gen: 2, name: "Pompa Sentrifugal & Desalter Elektrostatik AC", cost: 420, capMult: 1.35, purityBonus: 4.5, maxPurityCap: 89, powerMod: 1.0, hazardMod: 2, desc: "Medan listrik AC memecah emulsi air-minyak sehingga membuka kualitas Grade B." },
            { gen: 3, name: "Dual-Grid High-Voltage Desalter 30 kV", cost: 1150, capMult: 1.80, purityBonus: 9.0, maxPurityCap: 96, powerMod: 0.90, hazardMod: -3, desc: "Membuang 99% garam NaCl dan logam berat, membuka kemurnian Grade A." },
            { gen: 4, name: "Ultrasonic Smart Desalter & Mag-Drive Pump", cost: 2800, capMult: 2.45, purityBonus: 14.0, maxPurityCap: 99.8, powerMod: 0.78, hazardMod: -8, desc: "Kavitasi ultrasonik frekuensi tinggi tanpa bagian berputar yang bocor." }
          ]
        },
        "T-102": {
          role: "Menara Distilasi Utama",
          shape: "tower",
          gens: [
            { gen: 1, name: "Ketel Distilasi Batch Sederhana", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.20, hazardMod: 5, desc: "Menara distilasi tanpa kontrol refluks otomatis; pemisahan titik didih kasar." },
            { gen: 2, name: "Kolom Tray Bubble-Cap Atmosferik", cost: 580, capMult: 1.40, purityBonus: 5.5, maxPurityCap: 90, powerMod: 1.0, hazardMod: 1, desc: "32 tray kontak uap-cair kontinu dengan kondensor refluks standar." },
            { gen: 3, name: "Kolom Structured Packing Sulzer Vakum", cost: 1550, capMult: 1.90, purityBonus: 11.0, maxPurityCap: 97, powerMod: 0.88, hazardMod: -4, desc: "Anyaman kawat bergelombang efisiensi tinggi dengan kehilangan tekanan sangat rendah." },
            { gen: 4, name: "Dividing-Wall Column (DWC) Digital Twin", cost: 3600, capMult: 2.60, purityBonus: 16.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -9, desc: "Memisahkan 3 fraksi murni sekaligus dalam satu menara terintegrasi hemat energi 35%." }
          ]
        },
        "E-201": {
          role: "Tungku Pemanas & Reformer",
          shape: "exchanger",
          gens: [
            { gen: 1, name: "Tungku Pipa Api Bata Tahan Api", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 82, powerMod: 1.25, hazardMod: 8, desc: "Pemanas langsung berbahan bakar minyak dengan risiko titik panas (hotspot) tinggi." },
            { gen: 2, name: "Shell & Tube Exchanger + Fired Heater", cost: 850, capMult: 1.38, purityBonus: 4.5, maxPurityCap: 91, powerMod: 1.0, hazardMod: 2, desc: "Memulihkan panas aliran keluar untuk memanaskan umpan masuk secara stabil." },
            { gen: 3, name: "Platformer Katalitik Platina-Rhenium", cost: 2100, capMult: 1.85, purityBonus: 10.0, maxPurityCap: 98, powerMod: 0.86, hazardMod: -4, desc: "Mengubah nafta parafin menjadi cincin aromatik BTX bernilai tinggi." },
            { gen: 4, name: "Continuous Catalyst Regeneration (CCR) Unit", cost: 4800, capMult: 2.50, purityBonus: 15.0, maxPurityCap: 99.9, powerMod: 0.75, hazardMod: -8, desc: "Regenerasi katalis platina otomatis tanpa pernah menghentikan operasi pabrik." }
          ]
        },
        "C-202": {
          role: "Kompresor Gas Daur Ulang",
          shape: "compressor",
          gens: [
            { gen: 1, name: "Kompresor Torak Piston Tunggal", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 84, powerMod: 1.15, hazardMod: 5, desc: "Kompresor resiprokal bising dengan getaran tinggi dan segel oli biasa." },
            { gen: 2, name: "Kompresor Sekrup Putar Intercooled", cost: 980, capMult: 1.35, purityBonus: 4.0, maxPurityCap: 92, powerMod: 1.0, hazardMod: 1, desc: "Aliran gas hidrogen/hidrokarbon stabil dengan pendingin antar-tahap." },
            { gen: 3, name: "Kompresor Sentrifugal Multi-Stage Dry-Seal", cost: 2300, capMult: 1.85, purityBonus: 8.5, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Segel gas kering tandem mencegah kontaminasi oli pelumas ke produk." },
            { gen: 4, name: "Turbokompresor Levitasi Magnetik Aktif", cost: 5200, capMult: 2.55, purityBonus: 13.0, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Poros melayang dengan medan magnet tanpa gesekan mekanis sama sekali." }
          ]
        },
        "R-203": {
          role: "Reaktor Hydrotreating & Ekstraksi",
          shape: "reactor",
          gens: [
            { gen: 1, name: "Tangki Pencuci Asam-Basa Manual", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 6, desc: "Membuang senyawa belerang dengan pencucian soda kaustik konvensional." },
            { gen: 2, name: "Reaktor Hydrodesulfurisasi (HDS) Co-Mo", cost: 1200, capMult: 1.42, purityBonus: 6.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Mengubah sulfur menjadi gas H₂S menggunakan hidrogen dan katalis Kobalt-Molibdenum." },
            { gen: 3, name: "Unit Ekstraksi Aromatik Sulfolane", cost: 2700, capMult: 1.92, purityBonus: 11.5, maxPurityCap: 98, powerMod: 0.88, hazardMod: -5, desc: "Memisahkan benzena, toluena, dan xilena murni dari non-aromatik." },
            { gen: 4, name: "Adsorber Molekuler Zeolit Parex Superkritis", cost: 5900, capMult: 2.65, purityBonus: 17.0, maxPurityCap: 99.9, powerMod: 0.76, hazardMod: -9, desc: "Menyaring isomer para-xilena dan aromatik dengan selektivitas tingkat molekul." }
          ]
        },
        "R-301": {
          role: "Unit Isomerisasi & Pemurnian Lanjut",
          shape: "reactor_adv",
          gens: [
            { gen: 1, name: "Kolom Lempung Pemutih (Clay Treater)", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 82, powerMod: 1.1, hazardMod: 4, desc: "Menyerap pengotor warna olefin menggunakan lempung aktif yang cepat jenuh." },
            { gen: 2, name: "Reaktor Transalkilasi & Disproporsionasi", cost: 2800, capMult: 1.45, purityBonus: 6.5, maxPurityCap: 93, powerMod: 0.98, hazardMod: 0, desc: "Mengonversi toluena berlebih menjadi benzena dan xilena bernilai tinggi." },
            { gen: 3, name: "Reaktor Isomerisasi Zeolit ZSM-5 Pt", cost: 5400, capMult: 1.95, purityBonus: 12.0, maxPurityCap: 99, powerMod: 0.85, hazardMod: -5, desc: "Mengubah orto/meta-xilena menjadi para-xilena kemurnian >99,7%." },
            { gen: 4, name: "Unit Membran Pervaporasi Nano-Hibrida", cost: 9800, capMult: 2.70, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Pemisahan isomer tanpa panas berlebih menggunakan membran graphena-zeolit." }
          ]
        },
        "M-401": {
          role: "Blending & Terminal Pengemasan",
          shape: "mfg",
          gens: [
            { gen: 1, name: "Stasiun Pengisian Drum & Tangki Manual", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 85, powerMod: 1.05, hazardMod: 4, desc: "Pengisian produk cair ke drum baja dengan penimbangan manual." },
            { gen: 2, name: "In-Line Digital Blending Manifold", cost: 6500, capMult: 1.45, purityBonus: 5.5, maxPurityCap: 94, powerMod: 0.95, hazardMod: -1, desc: "Pencampuran aditif dan stabilisator otomatis dengan flowmeter Coriolis." },
            { gen: 3, name: "Terminal ISO-Tank Inert Nitrogen Blanket", cost: 12500, capMult: 2.00, purityBonus: 11.0, maxPurityCap: 99, powerMod: 0.85, hazardMod: -6, desc: "Pengisian kontainer tangki di bawah selimut gas nitrogen bebas oksigen/uap air." },
            { gen: 4, name: "Smart Pipeline Custody & Automated Terminal", cost: 24000, capMult: 2.80, purityBonus: 17.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -11, desc: "Terminal logistik otonom dengan analitik GC online real-time." }
          ]
        }
      }
    },

    "ROUTE-GAS-SYNTH": {
      id: "ROUTE-GAS-SYNTH",
      name: "Rute Sintesis Gas Tekanan Tinggi & Kriogenik",
      desc: "Steam reforming, kompresi ratusan bar, sintesis katalitik (Haber-Bosch/Lurgi), dan likuifaksi gas.",
      units: {
        "P-101": {
          role: "Desulfurisasi & Pemurnian Gas Umpan",
          shape: "pump",
          gens: [
            { gen: 1, name: "Filter Karbon Aktif & Blower Gas", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 6, desc: "Menyaring debu dan sebagian H₂S dari gas alam mentah." },
            { gen: 2, name: "Bejana Absorber Seng Oksida (ZnO) 400°C", cost: 450, capMult: 1.38, purityBonus: 5.0, maxPurityCap: 90, powerMod: 1.0, hazardMod: 1, desc: "Menangkap racun sulfur hingga <0,1 ppm agar katalis reformer tidak mati." },
            { gen: 3, name: "Hydro-Desulfurizer & Adiabatic Pre-Reformer", cost: 1200, capMult: 1.85, purityBonus: 10.0, maxPurityCap: 97, powerMod: 0.88, hazardMod: -4, desc: "Merombak hidrokarbon berat menjadi metana murni sebelum masuk reformer utama." },
            { gen: 4, name: "Plasma-Catalytic Ultra-Gas Purifier", cost: 2900, capMult: 2.50, purityBonus: 15.0, maxPurityCap: 99.9, powerMod: 0.76, hazardMod: -9, desc: "Pemurnian gas umpan tingkat ppb dengan efisiensi termal maksimum." }
          ]
        },
        "T-102": {
          role: "Unit Steam Reformer / Pemisah Udara (ASU)",
          shape: "tower",
          gens: [
            { gen: 1, name: "Generator Gas Uap Konvensional", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.25, hazardMod: 7, desc: "Reformer tabung baja biasa dengan konversi metana rendah." },
            { gen: 2, name: "Primary Tubular Steam Reformer (Ni) 850°C", cost: 620, capMult: 1.42, purityBonus: 5.5, maxPurityCap: 90, powerMod: 1.0, hazardMod: 2, desc: "Ratusan tabung paduan sentrifugal berisi katalis nikel menghasilkan syngas." },
            { gen: 3, name: "Autothermal Reformer (ATR) + Cryo ASU", cost: 1650, capMult: 1.92, purityBonus: 11.0, maxPurityCap: 97, powerMod: 0.86, hazardMod: -4, desc: "Menggabungkan pembakaran parsial oksigen murni dan steam reforming skala masif." },
            { gen: 4, name: "Ion-Transport Ceramic Membrane (ITM) Reformer", cost: 3800, capMult: 2.65, purityBonus: 16.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -9, desc: "Membran keramik penghantar ion oksigen tanpa butuh pabrik pemisah udara terpisah." }
          ]
        },
        "E-201": {
          role: "Water-Gas Shift & Pemulihan Panas Uap",
          shape: "exchanger",
          gens: [
            { gen: 1, name: "Pendingin Quench Semprotan Air", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.2, hazardMod: 5, desc: "Mendinginkan gas panas secara mendadak tanpa memanen energi uap." },
            { gen: 2, name: "Waste Heat Boiler & High-Temp Shift (Fe-Cr)", cost: 890, capMult: 1.40, purityBonus: 5.0, maxPurityCap: 91, powerMod: 0.95, hazardMod: 1, desc: "Mengubah CO + H₂O menjadi tambahan gas H₂ sekaligus membangkitkan uap turbin." },
            { gen: 3, name: "Dual HTS/LTS (Cu-Zn) Shift & Methanator", cost: 2200, capMult: 1.88, purityBonus: 10.5, maxPurityCap: 98, powerMod: 0.82, hazardMod: -4, desc: "Menurunkan sisa CO hingga di bawah 10 ppm untuk melindungi katalis sintesis." },
            { gen: 4, name: "Printed-Circuit Supercritical Heat Exchanger", cost: 4950, capMult: 2.55, purityBonus: 15.5, maxPurityCap: 99.9, powerMod: 0.68, hazardMod: -9, desc: "Penukar panas kanal mikro difusi-las dengan efisiensi perpindahan kalor 98%." }
          ]
        },
        "C-202": {
          role: "Kompresor Synloop Tekanan Tinggi",
          shape: "compressor",
          gens: [
            { gen: 1, name: "Kompresor Torak Multi-Silinder 100 Bar", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 82, powerMod: 1.25, hazardMod: 8, desc: "Kompresor piston tekanan tinggi yang rawan bocor pada packing batang torak." },
            { gen: 2, name: "Kompresor Sentrifugal 3-Casing 160 Bar", cost: 1100, capMult: 1.42, purityBonus: 4.5, maxPurityCap: 92, powerMod: 1.0, hazardMod: 2, desc: "Kompresor turbin uap standar pabrik amonia dan metanol." },
            { gen: 3, name: "Vertical-Split Barrel Synloop Compressor 250 Bar", cost: 2500, capMult: 1.92, purityBonus: 9.5, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Casing tempa utuh tahan tekanan 250 bar tanpa flensa sambungan membujur." },
            { gen: 4, name: "Hermetic Magnetic-Bearing Syn-Compressor 320 Bar", cost: 5500, capMult: 2.65, purityBonus: 14.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Kompresor superkritis tertutup rapat dengan motor kecepatan tinggi terintegrasi." }
          ]
        },
        "R-203": {
          role: "Reaktor Konverter Sintesis Tekanan Tinggi",
          shape: "reactor",
          gens: [
            { gen: 1, name: "Reaktor Tabung Katalis Magnetit (Fe₃O₄) Kasar", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.2, hazardMod: 7, desc: "Konversi sekali lewat rendah (10%) dengan suhu dan tekanan ekstrem." },
            { gen: 2, name: "Multi-Bed Quench Converter (Haber-Bosch / ICI)", cost: 1350, capMult: 1.45, purityBonus: 6.5, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "3 unggun katalis dengan injeksi gas dingin di antara tiap tahap." },
            { gen: 3, name: "Radial-Flow Casale Internal-Cooled Converter", cost: 2950, capMult: 1.95, purityBonus: 12.0, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Aliran radial menekan penurunan tekanan dan melipatgandakan konversi per lintasan." },
            { gen: 4, name: "Ruthenium-Graphite Nano-Catalyst Syn-Reactor", cost: 6400, capMult: 2.75, purityBonus: 17.5, maxPurityCap: 99.9, powerMod: 0.74, hazardMod: -10, desc: "Katalis logam mulia Ruthenium 10x lebih aktif pada tekanan operasi lebih aman." }
          ]
        },
        "R-301": {
          role: "Separator Kondensasi & Pemurnian PSA",
          shape: "reactor_adv",
          gens: [
            { gen: 1, name: "Tangki Flash Pemisah Cair-Gas", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.1, hazardMod: 4, desc: "Memisahkan produk cair dari gas sisa hanya dengan penurunan tekanan tunggal." },
            { gen: 2, name: "Chiller Amonia & High-Pressure Separator", cost: 2900, capMult: 1.45, purityBonus: 6.0, maxPurityCap: 92, powerMod: 0.96, hazardMod: 0, desc: "Mendinginkan gas hingga -25°C untuk mengembunkan produk dengan kemurnian tinggi." },
            { gen: 3, name: "12-Bed Pressure Swing Adsorption (PSA) 5N", cost: 5600, capMult: 1.98, purityBonus: 12.0, maxPurityCap: 99, powerMod: 0.84, hazardMod: -5, desc: "Menghasilkan gas hidrogen/CO/metanol dengan kemurnian 99,999%." },
            { gen: 4, name: "Cryogenic Cold-Box & Hollow-Fiber Membrane", cost: 10200, capMult: 2.75, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Pemisahan kriogenik -190°C memulihkan 99,8% reaktan tanpa terbuang ke flare." }
          ]
        },
        "M-401": {
          role: "Menara Prilling, Granulasi & Tangki Kriogenik",
          shape: "mfg",
          gens: [
            { gen: 1, name: "Tangki Tekan Bola & Drum Pengemas", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 84, powerMod: 1.05, hazardMod: 4, desc: "Penyimpanan gas cair bertekanan standar." },
            { gen: 2, name: "Menara Prilling 60-Meter / Cryo-Liquefier", cost: 6800, capMult: 1.48, purityBonus: 6.0, maxPurityCap: 94, powerMod: 0.95, hazardMod: -1, desc: "Membentuk butiran prill seragam atau mencairkan gas untuk pengiriman kapal." },
            { gen: 3, name: "Fluidized-Bed Granulator & Double-Wall Tank", cost: 13200, capMult: 2.05, purityBonus: 11.5, maxPurityCap: 99, powerMod: 0.84, hazardMod: -6, desc: "Butiran keras anti-menggumpal dan penyimpanan kriogenik berinsulasi perlit." },
            { gen: 4, name: "Zero-Boil-Off Cryo-Terminal & Auto-Bagger", cost: 25000, capMult: 2.85, purityBonus: 17.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -11, desc: "Terminal ekspor kriogenik dengan relikuifaksi uap otomatis 100%." }
          ]
        }
      }
    },

    "ROUTE-ELEKTRO-MINERAL": {
      id: "ROUTE-ELEKTRO-MINERAL",
      name: "Rute Elektrolisis Klor-Alkali, Asam & Mineral",
      desc: "Pelarutan bijih/garam, sel elektrolisis membran, konverter kontak asam, dan fluorinasi.",
      units: {
        "P-101": {
          role: "Crusher & Pemurnian Larutan Brine/Mineral",
          shape: "pump",
          gens: [
            { gen: 1, name: "Bak Pelarut Garam & Saringan Pasir", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 5, desc: "Melarutkan garam/mineral kasar; masih banyak pengotor kalsium dan magnesium." },
            { gen: 2, name: "Clarifier Presipitasi Na₂CO₃ & Filter Press", cost: 430, capMult: 1.38, purityBonus: 5.0, maxPurityCap: 90, powerMod: 1.0, hazardMod: 1, desc: "Mengendapkan lumpur pengotor logam alkali tanah dari larutan umpan." },
            { gen: 3, name: "Chelating Ion-Exchange Brine Polisher", cost: 1180, capMult: 1.85, purityBonus: 10.0, maxPurityCap: 97, powerMod: 0.88, hazardMod: -4, desc: "Menurunkan kesadahan Ca/Mg hingga <20 ppb untuk melindungi membran elektrolisis." },
            { gen: 4, name: "Ultrasonic Leaching & Nanofiltration Purifier", cost: 2850, capMult: 2.50, purityBonus: 15.0, maxPurityCap: 99.9, powerMod: 0.75, hazardMod: -9, desc: "Ekstraksi mineral murni berkecepatan tinggi dengan pemisahan membran keramik." }
          ]
        },
        "T-102": {
          role: "Sel Elektrolisis / Tungku Pembakar Mineral",
          shape: "tower",
          gens: [
            { gen: 1, name: "Sel Diafragma Konvensional / Tungku Sulfur Tua", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.30, hazardMod: 8, desc: "Konsumsi listrik sangat boros dan produk kaustik masih tercampur garam." },
            { gen: 2, name: "Sel Elektrolisis Bipolar / Rotary Kiln", cost: 640, capMult: 1.42, purityBonus: 6.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 2, desc: "Elektroda titanium berlapis rutenium oksida (DSA) dengan tegangan sel lebih rendah." },
            { gen: 3, name: "Zero-Gap Nafion Ion-Exchange Membrane Cell", cost: 1700, capMult: 1.95, purityBonus: 11.5, maxPurityCap: 98, powerMod: 0.80, hazardMod: -5, desc: "Membran fluoropolimer selektif menghasilkan produk Grade A bebas merkuri/asbes." },
            { gen: 4, name: "Oxygen-Depolarized Cathode (ODC) Electro-Cell", cost: 3900, capMult: 2.70, purityBonus: 17.0, maxPurityCap: 99.9, powerMod: 0.64, hazardMod: -10, desc: "Menghemat konsumsi listrik elektrolisis hingga 30% dengan katoda difusi gas." }
          ]
        },
        "E-201": {
          role: "Penukar Panas Tahan Asam & Korosi",
          shape: "exchanger",
          gens: [
            { gen: 1, name: "Koil Pendingin Timbal & Besi Silikon", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.15, hazardMod: 6, desc: "Berat, perpindahan panas lambat, dan rentan retak termal." },
            { gen: 2, name: "Penukar Panas Blok Grafit Impregnasi", cost: 860, capMult: 1.38, purityBonus: 4.5, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Tahan asam klorida dan asam fosfat panas dengan konduktivitas baik." },
            { gen: 3, name: "Titanium Grade-1 Plate Heat Exchanger", cost: 2150, capMult: 1.88, purityBonus: 10.0, maxPurityCap: 98, powerMod: 0.85, hazardMod: -4, desc: "100% tahan korosi gas klorin basah dan air garam pada suhu tinggi." },
            { gen: 4, name: "Sintered Silicon Carbide (SiC) Ceramic Exchanger", cost: 4900, capMult: 2.55, purityBonus: 15.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -9, desc: "Tahan asam fluorida (HF), asam sulfat 98% mendidih, dan bromin tanpa korosi sedikitpun." }
          ]
        },
        "C-202": {
          role: "Kompresor Gas Klorin & Gas Asam",
          shape: "compressor",
          gens: [
            { gen: 1, name: "Liquid-Ring Pump Berpelumas H₂SO₄", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 82, powerMod: 1.2, hazardMod: 6, desc: "Mengompresi gas klorin menggunakan cincin cairan asam sulfat pekat." },
            { gen: 2, name: "Kompresor Sentrifugal Lapis Ebonit/Halalar", cost: 1020, capMult: 1.38, purityBonus: 4.5, maxPurityCap: 92, powerMod: 1.0, hazardMod: 2, desc: "Kapasitas aliran gas korosif menengah dengan pelapis polimer." },
            { gen: 3, name: "Hastelloy C-276 Dry-Gas-Seal Compressor", cost: 2400, capMult: 1.88, purityBonus: 9.5, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Impeller superalloy nikel-molibdenum tahan gas asam kering maupun lembap." },
            { gen: 4, name: "Hermetic PFA-Lined Mag-Lev Gas Compressor", cost: 5300, capMult: 2.60, purityBonus: 14.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Nol risiko kebocoran gas beracun Cl₂/HF/SO₃ dengan kemurnian ultra-tinggi." }
          ]
        },
        "R-203": {
          role: "Menara Absorpsi & Reaktor Konversi Asam",
          shape: "reactor",
          gens: [
            { gen: 1, name: "Menara Absorpsi Cincin Keramik Raschig", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 6, desc: "Penyerapan gas SO₃/HCl tunggal dengan kabut asam tinggi." },
            { gen: 2, name: "Konverter Kontak Vanadium (V₂O₅) 4-Tahap", cost: 1280, capMult: 1.44, purityBonus: 6.0, maxPurityCap: 91, powerMod: 0.98, hazardMod: 1, desc: "Mengoksidasi 98% SO₂ menjadi SO₃ dengan penukar panas antar-unggun." },
            { gen: 3, name: "Double-Contact Double-Absorption (DCDA) Reactor", cost: 2850, capMult: 1.94, purityBonus: 12.0, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Konversi mencapai 99,8% dengan penghilang kabut asam (Brink Mist Eliminator)." },
            { gen: 4, name: "Cesium-Promoted Catalyst & Heat-Recovery Tower", cost: 6100, capMult: 2.70, purityBonus: 17.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Memanen panas reaksi eksotermis asam menjadi uap bertekanan tinggi." }
          ]
        },
        "R-301": {
          role: "Evaporator Konsentrator & Kalsinator",
          shape: "reactor_adv",
          gens: [
            { gen: 1, name: "Ketel Penguapan Besi Cor Terbuka", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.25, hazardMod: 5, desc: "Menguapkan air dari larutan NaOH/asam dengan konsumsi uap boros." },
            { gen: 2, name: "Triple-Effect Falling-Film Nickel Evaporator", cost: 2750, capMult: 1.45, purityBonus: 6.0, maxPurityCap: 92, powerMod: 0.92, hazardMod: 0, desc: "3 tabung evaporator nikel murni berurutan menghemat uap hingga 65%." },
            { gen: 3, name: "Mechanical Vapor Recompression (MVR) Concentrator", cost: 5500, capMult: 1.96, purityBonus: 12.0, maxPurityCap: 99, powerMod: 0.78, hazardMod: -5, desc: "Mendaur ulang panas laten uap air menggunakan kompresor uap." },
            { gen: 4, name: "Plasma Chloride Oxidation & Vacuum Crystallizer", cost: 9900, capMult: 2.72, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.68, hazardMod: -10, desc: "Menghasilkan kristal anhidrat dan pigmen rutil dengan ukuran partikel sub-mikron." }
          ]
        },
        "M-401": {
          role: "Unit Flaker, Likuifaksi & Penyimpanan Asam",
          shape: "mfg",
          gens: [
            { gen: 1, name: "Tangki Penyimpanan Baja Lapis Karet", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 84, powerMod: 1.05, hazardMod: 4, desc: "Penyimpanan asam dan pengantongan serpihan kaustik manual." },
            { gen: 2, name: "Drum Flaker Pendingin & Chlorine Liquefier", cost: 6400, capMult: 1.45, purityBonus: 5.5, maxPurityCap: 94, powerMod: 0.95, hazardMod: -1, desc: "Membekukan lelehan NaOH menjadi flake tipis dan mencairkan Cl₂." },
            { gen: 3, name: "PVDF-Lined Tank Farm & Automated Drum Filler", cost: 12800, capMult: 2.00, purityBonus: 11.0, maxPurityCap: 99, powerMod: 0.84, hazardMod: -6, desc: "Tangki berlapis fluoropolimer anti-kontaminasi logam." },
            { gen: 4, name: "Robotic Hermetic ISO-Container Loading Bay", cost: 24500, capMult: 2.82, purityBonus: 17.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -11, desc: "Pengisian otomatis tertutup penuh dengan scrubber darurat terintegrasi." }
          ]
        }
      }
    },

    "ROUTE-POLIMER": {
      id: "ROUTE-POLIMER",
      name: "Rute Polimerisasi Plastik, Resin & Elastomer",
      desc: "Pemurnian monomer, injeksi katalis Ziegler-Natta/Metallocene, reaktor polimerisasi, dan ekstrusi pelet.",
      units: {
        "P-101": {
          role: "Penghilang Inhibitor & Pengering Monomer",
          shape: "pump",
          gens: [
            { gen: 1, name: "Kolom Caustic Wash & Pompa Umpan", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 5, desc: "Mencuci inhibitor TBC dari monomer tetapi masih menyisakan jejak uap air." },
            { gen: 2, name: "Alumina Guard Bed & High-Pressure Metering Pump", cost: 440, capMult: 1.38, purityBonus: 5.0, maxPurityCap: 90, powerMod: 1.0, hazardMod: 1, desc: "Menyerap oksigen dan air terlarut agar katalis polimerisasi tidak rusak." },
            { gen: 3, name: "Molecular Sieve 3A Dehydrator (<0,5 ppm H₂O)", cost: 1220, capMult: 1.86, purityBonus: 10.5, maxPurityCap: 97, powerMod: 0.88, hazardMod: -4, desc: "Pengeringan molekuler ganda menjamin aktivitas katalis maksimum." },
            { gen: 4, name: "Nanofiltration & Catalytic Oxygen Scavenger", cost: 2950, capMult: 2.52, purityBonus: 15.5, maxPurityCap: 99.9, powerMod: 0.76, hazardMod: -9, desc: "Pemurnian monomer tingkat polimerisasi optik dan medis." }
          ]
        },
        "T-102": {
          role: "Sistem Preparasi & Injeksi Katalis",
          shape: "tower",
          gens: [
            { gen: 1, name: "Tangki Inisiator Peroksida Manual", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 7, desc: "Dosing radikal bebas manual; rantai polimer bercabang acak (Grade C)." },
            { gen: 2, name: "Slurry Dosing Katalis Ziegler-Natta (TiCl₄)", cost: 610, capMult: 1.42, purityBonus: 6.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Katalis Titanium-Magnesium membentuk rantai polimer linear kuat (Grade B)." },
            { gen: 3, name: "Unit Injeksi Katalis Single-Site Metallocene", cost: 1620, capMult: 1.92, purityBonus: 11.5, maxPurityCap: 98, powerMod: 0.86, hazardMod: -4, desc: "Menghasilkan distribusi berat molekul sangat sempit dan jernih (Grade A)." },
            { gen: 4, name: "Dual-Catalyst Bimodal AI Dosing Station", cost: 3750, capMult: 2.65, purityBonus: 17.0, maxPurityCap: 99.9, powerMod: 0.74, hazardMod: -9, desc: "Mengontrol arsitektur rantai pendek dan panjang secara simultan." }
          ]
        },
        "E-201": {
          role: "Pendingin Reaksi Eksotermis Polimerisasi",
          shape: "exchanger",
          gens: [
            { gen: 1, name: "Jaket Pendingin Air Reaktor Tunggal", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.2, hazardMod: 8, desc: "Pembuangan panas lambat; berisiko lelehan plastik menggumpal di reaktor." },
            { gen: 2, name: "External Loop Shell-and-Tube Cycle Cooler", cost: 880, capMult: 1.40, purityBonus: 5.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 2, desc: "Mendinginkan sirkulasi monomer di luar bejana reaktor secara efektif." },
            { gen: 3, name: "Condensing-Mode Evaporative Reflux Cooler", cost: 2180, capMult: 1.90, purityBonus: 10.5, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Memanfaatkan panas laten penguapan monomer cair untuk menyerap panas eksotermis 2x lipat." },
            { gen: 4, name: "Supercritical Monomer Heat-Pump Exchanger", cost: 4850, capMult: 2.58, purityBonus: 15.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Kontrol suhu isotermal ±0,1°C mencegah pembentukan gel atau oligomer." }
          ]
        },
        "C-202": {
          role: "Kompresor Monomer & Sirkulasi Gas",
          shape: "compressor",
          gens: [
            { gen: 1, name: "Blower Sirkulasi Sabuk V-Belt", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 82, powerMod: 1.15, hazardMod: 5, desc: "Aliran gas fluidisasi kurang merata di dasar reaktor." },
            { gen: 2, name: "Centrifugal Cycle-Gas Blower Anti-Fouling", cost: 1050, capMult: 1.40, purityBonus: 4.5, maxPurityCap: 92, powerMod: 1.0, hazardMod: 1, desc: "Impeller terbuka tahan serbuk polimer halus (fines) pada tekanan 30 bar." },
            { gen: 3, name: "Hyper-Compressor Plunger 2000 Bar / High-Flow", cost: 2450, capMult: 1.90, purityBonus: 9.5, maxPurityCap: 98, powerMod: 0.86, hazardMod: -5, desc: "Silinder tungsten karbida mampu memampatkan etilena hingga kondisi superkritis." },
            { gen: 4, name: "Magnetic-Drive Supercritical Monomer Turbine", cost: 5400, capMult: 2.62, purityBonus: 14.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Sirkulasi berkecepatan tinggi bebas getaran dan bebas kontaminasi pelumas." }
          ]
        },
        "R-203": {
          role: "Reaktor Polimerisasi Utama",
          shape: "reactor",
          gens: [
            { gen: 1, name: "Autoklaf Polimerisasi Batch Manual", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.25, hazardMod: 8, desc: "Harus dibuka dan dibersihkan dari kerak plastik setiap selesai 1 batch." },
            { gen: 2, name: "Reaktor Slurry Loop Pipa Kontinu", cost: 1320, capMult: 1.45, purityBonus: 6.5, maxPurityCap: 91, powerMod: 0.98, hazardMod: 1, desc: "Aliran suspensi polimer cepat dengan perpindahan panas dinding pipa tinggi." },
            { gen: 3, name: "Reaktor Fluidized-Bed Fase Gas (Unipol / Spheripol)", cost: 2900, capMult: 1.98, purityBonus: 12.5, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Partikel polimer melayang di atas aliran gas monomer tanpa butuh pelarut cair." },
            { gen: 4, name: "Multi-Zone Circulating Reactor (MZCR) Bimodal", cost: 6300, capMult: 2.75, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Reaktor generasi terbaru penghasil resin kekuatan mekanis ekstrem dan kemurnian sempurna." }
          ]
        },
        "R-301": {
          role: "Degasser & Pemulihan Monomer Sisa",
          shape: "reactor_adv",
          gens: [
            { gen: 1, name: "Silo Angin Terbuka (Venting Atmosfer)", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.1, hazardMod: 6, desc: "Masih menyisakan bau monomer mudah terbakar di dalam butiran resin." },
            { gen: 2, name: "Purge Bin Nitrogen Counter-Current", cost: 2850, capMult: 1.45, purityBonus: 6.0, maxPurityCap: 92, powerMod: 0.95, hazardMod: 0, desc: "Mengalirkan nitrogen hangat untuk melucuti sisa gas hidrokarbon." },
            { gen: 3, name: "Vacuum Devolatilizer & Monomer Recovery Loop", cost: 5550, capMult: 1.96, purityBonus: 12.0, maxPurityCap: 99, powerMod: 0.82, hazardMod: -6, desc: "Memulihkan 99,5% monomer tak bereaksi kembali ke reaktor (bebas bau Food-Grade)." },
            { gen: 4, name: "Supercritical CO₂ Extraction Degasser (<0,1 ppm)", cost: 10000, capMult: 2.75, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Menghasilkan resin polimer kelas implan medis dan semikonduktor bebas VOC." }
          ]
        },
        "M-401": {
          role: "Ekstruder Compounding & Pelletizer",
          shape: "mfg",
          gens: [
            { gen: 1, name: "Strand Cutter (Pemotong Pita Plastik) Manual", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 83, powerMod: 1.1, hazardMod: 4, desc: "Ukuran pelet tidak rata dan sering menghasilkan debu plastik." },
            { gen: 2, name: "Single-Screw Extruder & Water-Ring Pelletizer", cost: 6600, capMult: 1.46, purityBonus: 5.5, maxPurityCap: 94, powerMod: 0.95, hazardMod: -1, desc: "Melelehkan serbuk resin dengan antioksidan menjadi pelet silinder." },
            { gen: 3, name: "Twin-Screw Co-Rotating Extruder & Underwater Pelletizer", cost: 13000, capMult: 2.02, purityBonus: 11.5, maxPurityCap: 99, powerMod: 0.84, hazardMod: -6, desc: "Pemotongan di dalam air bertekanan menghasilkan pelet bulat seragam sempurna." },
            { gen: 4, name: "Gearless High-Torque Extruder & Laser Optical Sorter", cost: 24800, capMult: 2.85, purityBonus: 17.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -11, desc: "Kamera laser otomatis membuang setiap 1 butir pelet yang memiliki bintik hitam." }
          ]
        }
      }
    },

    "ROUTE-BIO-PHARMA": {
      id: "ROUTE-BIO-PHARMA",
      name: "Rute Bioproses, Fermentasi, Oleokimia & Farmasi API",
      desc: "Sterilisasi media, bioreaktor/sintesis organik cGMP, filtrasi membran, kristalisasi, dan liofilisasi.",
      units: {
        "P-101": {
          role: "Sterilisasi Media & Preparasi Substrat",
          shape: "pump",
          gens: [
            { gen: 1, name: "Ketel Perebusan Batch & Pompa Ulir", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.2, hazardMod: 5, desc: "Pemanasan lama merusak sebagian nutrisi/substrat dan rawan kontaminasi bakteri liar." },
            { gen: 2, name: "Continuous Plate Heat Sterilizer (HTST 140°C)", cost: 450, capMult: 1.38, purityBonus: 5.0, maxPurityCap: 90, powerMod: 1.0, hazardMod: 1, desc: "Sterilisasi kejut 4 detik membunuh spora tanpa merusak gugus aktif bahan." },
            { gen: 3, name: "Enzymatic Hydrolyzer & Sterile Membrane Filter", cost: 1240, capMult: 1.86, purityBonus: 10.5, maxPurityCap: 97, powerMod: 0.86, hazardMod: -4, desc: "Pemecahan enzimatik selektif dengan pompa higienis sanitasi uap (SIP)." },
            { gen: 4, name: "Automated Cold-Sterile Microfluidic Dosing Skid", cost: 2980, capMult: 2.52, purityBonus: 15.5, maxPurityCap: 99.9, powerMod: 0.74, hazardMod: -9, desc: "Preparasi reagen cGMP tertutup rapat dengan sterilitas 10⁻⁶ SAL." }
          ]
        },
        "T-102": {
          role: "Bioreaktor Fermentasi / Reaktor Sintesis API",
          shape: "tower",
          gens: [
            { gen: 1, name: "Tangki Fermentasi Baja Karbon Cat Epoksi", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 6, desc: "Permukaan kasar sulit disterilkan; hasil sintesis banyak produk samping." },
            { gen: 2, name: "Bioreaktor SS316L Electropolished Berjaket", cost: 650, capMult: 1.42, purityBonus: 6.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Dinding cermin halus dengan kontrol pH dan pengaduk Rushton." },
            { gen: 3, name: "Reaktor Glass-Lined (Pfaudler) & Hastelloy cGMP", cost: 1680, capMult: 1.94, purityBonus: 11.5, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Lapisan kaca borosilikat tahan asam/pelarut farmasi tanpa jejak ion logam." },
            { gen: 4, name: "Continuous-Flow Microreactor & Perfusion Bioreactor", cost: 3850, capMult: 2.68, purityBonus: 17.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Sintesis aliran kontinu dengan rendemen reaksi >99% dan waktu tinggal detik." }
          ]
        },
        "E-201": {
          role: "Pengendali Suhu Kriogenik & Termal Presisi",
          shape: "exchanger",
          gens: [
            { gen: 1, name: "Pendingin Air Menara & Koil Uap Biasa", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.15, hazardMod: 5, desc: "Fluktuasi suhu ±5°C menurunkan aktivitas enzim dan kemurnian isomer." },
            { gen: 2, name: "Chiller Brine Glikol (-20°C s/d +120°C)", cost: 870, capMult: 1.38, purityBonus: 4.5, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Menjaga suhu reaksi eksotermis sensitif tetap di zona aman." },
            { gen: 3, name: "Silicone Thermal-Fluid TCU (-70°C s/d +220°C)", cost: 2180, capMult: 1.88, purityBonus: 10.0, maxPurityCap: 98, powerMod: 0.85, hazardMod: -4, desc: "Unit kontrol suhu fluida tunggal untuk sintesis asimetris suhu rendah." },
            { gen: 4, name: "Liquid-Nitrogen Cryo-Loop & Plate Micro-Exchanger", cost: 4880, capMult: 2.55, purityBonus: 15.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -9, desc: "Pendinginan instan milidetik menghentikan reaksi samping secara total." }
          ]
        },
        "C-202": {
          role: "Sistem Aerasi Steril & Gas Proses",
          shape: "compressor",
          gens: [
            { gen: 1, name: "Kompresor Udara Piston Filter Kain", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 82, powerMod: 1.15, hazardMod: 5, desc: "Kabut oli kompresor berisiko mencemari kultur bioproses." },
            { gen: 2, name: "Oil-Free Screw Compressor + HEPA Filter", cost: 1020, capMult: 1.38, purityBonus: 4.5, maxPurityCap: 92, powerMod: 1.0, hazardMod: 1, desc: "Udara bebas oli 100% kelas ISO 8573-1 Kelas 0." },
            { gen: 3, name: "Hydrophobic PTFE 0,1 µm Sterile Oxygen Sparger", cost: 2420, capMult: 1.88, purityBonus: 9.5, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Injeksi gelembung mikro oksigen murni meningkatkan laju pertumbuhan sel 2x." },
            { gen: 4, name: "Hollow-Fiber Bubble-Free Membrane Oxygenator", cost: 5350, capMult: 2.60, purityBonus: 14.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Transfer gas tanpa buih (zero-foaming) dan tanpa tegangan geser sel." }
          ]
        },
        "R-203": {
          role: "Sentrifugasi, Ekstraksi & Kromatografi",
          shape: "reactor",
          gens: [
            { gen: 1, name: "Filter Press Kain & Tangki Dekantasi", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 5, desc: "Pemisahan biomassa lambat dengan kehilangan produk aktif tinggi." },
            { gen: 2, name: "Hermetic Disk-Stack High-Speed Centrifuge", cost: 1300, capMult: 1.44, purityBonus: 6.5, maxPurityCap: 91, powerMod: 0.98, hazardMod: 1, desc: "Gaya sentrifugal 12.000 G memisahkan sel dan emulsi organik dalam hitungan detik." },
            { gen: 3, name: "Tangential-Flow Ultrafiltration & Centrifugal Extractor", cost: 2880, capMult: 1.95, purityBonus: 12.0, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Memisahkan molekul target berdasarkan berat molekul Dalton tanpa panas." },
            { gen: 4, name: "Simulated Moving Bed (SMB) Preparative Chromatography", cost: 6250, capMult: 2.72, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Memisahkan enansiomer obat kiral hingga kemurnian farmakope >99,9%." }
          ]
        },
        "R-301": {
          role: "Kristalisator & Pengering Vakum / Liofilisasi",
          shape: "reactor_adv",
          gens: [
            { gen: 1, name: "Panci Kristalisasi & Oven Udara Panas", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.2, hazardMod: 5, desc: "Kristal menggumpal dan sebagian teroksidasi karena panas oven." },
            { gen: 2, name: "Vacuum Cooling Crystallizer & Filter Dryer", cost: 2820, capMult: 1.45, purityBonus: 6.0, maxPurityCap: 92, powerMod: 0.95, hazardMod: 0, desc: "Filtrasi, pencucian, dan pengeringan vakum dalam satu bejana tertutup (ANFD)." },
            { gen: 3, name: "Aseptic Spray Dryer & Fluid-Bed Granulator", cost: 5500, capMult: 1.96, purityBonus: 12.0, maxPurityCap: 99, powerMod: 0.82, hazardMod: -5, desc: "Menghasilkan kristal polimorfik seragam yang mudah larut." },
            { gen: 4, name: "Automated Freeze-Dryer (Lyophilizer) Isolator", cost: 9950, capMult: 2.75, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Sublimasi es vakum suhu -50°C menjaga potensi biologis 100% utuh." }
          ]
        },
        "M-401": {
          role: "Mikronisasi & Pengemasan Ruang Bersih",
          shape: "mfg",
          gens: [
            { gen: 1, name: "Penggilingan Pin-Mill & Timbangan Manual", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 84, powerMod: 1.05, hazardMod: 4, desc: "Debu serbuk berterbangan dan ukuran partikel belum homogen." },
            { gen: 2, name: "Spiral Jet-Mill Micronizer Stainless 316L", cost: 6500, capMult: 1.45, purityBonus: 5.5, maxPurityCap: 94, powerMod: 0.95, hazardMod: -1, desc: "Tumbukan jet nitrogen menghasilkan serbuk halus D90 < 10 mikron." },
            { gen: 3, name: "Cleanroom ISO-5 Containment & Laser Particle Sizer", cost: 12900, capMult: 2.02, purityBonus: 11.5, maxPurityCap: 99, powerMod: 0.84, hazardMod: -6, desc: "Pengemasan di bawah aliran udara laminar bebas kontaminasi silang." },
            { gen: 4, name: "Robotic Isolator Barrier Aseptic Filling Line", cost: 24600, capMult: 2.84, purityBonus: 17.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -11, desc: "Lini robotik tanpa sentuhan manusia sedikitpun sesuai standar FDA/EMA." }
          ]
        }
      }
    },

    "ROUTE-HIGH-TEMP": {
      id: "ROUTE-HIGH-TEMP",
      name: "Rute Tungku Suhu Ekstrem, Material Baterai & Serat Karbon",
      desc: "Penggilingan nano, pemintalan/kopresipitasi, oksidasi, dan kalsinasi/karbonisasi 1.400°C–2.500°C.",
      units: {
        "P-101": {
          role: "Dispersi Prekursor & Nano-Ball Milling",
          shape: "pump",
          gens: [
            { gen: 1, name: "Ball Mill Keramik Alumina Konvensional", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.2, hazardMod: 5, desc: "Pencampuran serbuk lambat dan terkontaminasi kikisan bola alumina." },
            { gen: 2, name: "Planetary Agitator Bead Mill Berlapis PU", cost: 480, capMult: 1.38, purityBonus: 5.0, maxPurityCap: 90, powerMod: 1.0, hazardMod: 1, desc: "Menghaluskan prekursor litium/karbon hingga skala sub-mikron." },
            { gen: 3, name: "Yttria-Stabilized Zirconia (YSZ) Nano-Mill", cost: 1300, capMult: 1.88, purityBonus: 10.5, maxPurityCap: 97, powerMod: 0.86, hazardMod: -4, desc: "Dispersi slurry homogen D50 < 200 nm tanpa kontaminasi besi." },
            { gen: 4, name: "Ultrasonic Cavitation & Spray-Pyrolysis Mixer", cost: 3100, capMult: 2.55, purityBonus: 15.5, maxPurityCap: 99.9, powerMod: 0.74, hazardMod: -9, desc: "Pencampuran tingkat atomik dalam fase aerosol berkecepatan tinggi." }
          ]
        },
        "T-102": {
          role: "Pemintalan Prekursor / Reaktor Kopresipitasi",
          shape: "tower",
          gens: [
            { gen: 1, name: "Bak Koagulasi / Presipitasi Batch", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 5, desc: "Bentuk kristal/serat tidak seragam dan mudah putus saat ditarik." },
            { gen: 2, name: "Multi-Spindle Wet-Spinning / Taylor Flow Reactor", cost: 680, capMult: 1.42, purityBonus: 6.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Aliran vortex Couette-Taylor membentuk partikel bulat padat atau filamen rata." },
            { gen: 3, name: "Dry-Jet Wet-Spinning & Continuous Co-Precipitator", cost: 1750, capMult: 1.94, purityBonus: 11.5, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Orientasi rantai molekul kristal sangat sejajar tanpa rongga mikro." },
            { gen: 4, name: "High-Speed Air-Gap Spinner & Microfluidic Reactor", cost: 4000, capMult: 2.70, purityBonus: 17.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Menghasilkan prekursor serat T1000 dan kristal tunggal katoda sempurna." }
          ]
        },
        "E-201": {
          role: "Oven Oksidasi Stabilisasi & Pengeringan",
          shape: "exchanger",
          gens: [
            { gen: 1, name: "Oven Pemanas Udara Konveksi Biasa", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.25, hazardMod: 7, desc: "Gradien suhu tidak rata; rawan reaksi eksotermis membakar serat/serbuk." },
            { gen: 2, name: "4-Zone Air-To-Air Stabilization Oven 270°C", cost: 920, capMult: 1.40, purityBonus: 5.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 2, desc: "Siklisasi rantai molekul terkendali dengan kontrol tegangan rol." },
            { gen: 3, name: "Precision Center-To-End Airflow Oxidation Furnace", cost: 2280, capMult: 1.90, purityBonus: 10.5, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Keseragaman suhu ±0,5°C di seluruh lebar zona pemanasan." },
            { gen: 4, name: "Plasma-Assisted Rapid Thermal Stabilization Unit", cost: 5050, capMult: 2.60, purityBonus: 15.5, maxPurityCap: 99.9, powerMod: 0.68, hazardMod: -10, desc: "Memangkas waktu oksidasi hingga 60% dengan struktur ikat-silang sempurna." }
          ]
        },
        "C-202": {
          role: "Sistem Atmosfer Inert Argon / Hidrogen",
          shape: "compressor",
          gens: [
            { gen: 1, name: "Manifold Tabung Gas Nitrogen Teknis", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.15, hazardMod: 6, desc: "Jejak oksigen 500 ppm menyebabkan pengapuran dan cacat permukaan." },
            { gen: 2, name: "PSA Nitrogen & Oxygen Generator On-Site", cost: 1080, capMult: 1.40, purityBonus: 4.5, maxPurityCap: 92, powerMod: 1.0, hazardMod: 1, desc: "Suplai gas pelindung 99,95% kontinu untuk tungku suhu tinggi." },
            { gen: 3, name: "Cryogenic Argon/Hydrogen Purifier 6N (99,9999%)", cost: 2520, capMult: 1.90, purityBonus: 10.0, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Atmosfer bebas oksigen dan uap air (<1 ppm) selama karbonisasi." },
            { gen: 4, name: "Closed-Loop Argon Recovery & Plasma Scavenger", cost: 5550, capMult: 2.65, purityBonus: 14.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Mendaur ulang 98% gas argon mulia dengan pemurni getter zirkonium." }
          ]
        },
        "R-203": {
          role: "Tungku Kalsinasi, Karbonisasi & CVD Suhu Tinggi",
          shape: "reactor",
          gens: [
            { gen: 1, name: "Tungku Muffle Elemen Kawat Nikrom 950°C", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.30, hazardMod: 7, desc: "Suhu maksimum terbatas; kristalisasi dan karbonisasi belum tuntas." },
            { gen: 2, name: "Roller-Hearth Kiln / Bell-Jar CVD 1.250°C", cost: 1420, capMult: 1.46, purityBonus: 6.5, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Tungku kontinu beralas rol keramik untuk sintering katoda dan silikon." },
            { gen: 3, name: "Graphite Induction Furnace 1.800°C–2.400°C", cost: 3100, capMult: 1.98, purityBonus: 12.5, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Pemanas induksi grafit membentuk struktur kristal turbomorfik modulus tinggi." },
            { gen: 4, name: "Fluidized-Bed CVD & Spark Plasma Sintering 2.800°C", cost: 6600, capMult: 2.78, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Sintering arus pulsa berkecepatan tinggi dengan konsumsi energi separuh tungku biasa." }
          ]
        },
        "R-301": {
          role: "Perlakuan Permukaan & Pelapisan Nano-Karbon",
          shape: "reactor_adv",
          gens: [
            { gen: 1, name: "Bak Pencucian Asam & Pengeringan", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.1, hazardMod: 4, desc: "Daya rekat serat ke matriks resin atau konduktivitas katoda masih rendah." },
            { gen: 2, name: "Anodic Electrolytic Etching & Sizing Bath", cost: 2950, capMult: 1.46, purityBonus: 6.0, maxPurityCap: 92, powerMod: 0.95, hazardMod: 0, desc: "Menambahkan gugus fungsional aktif pada permukaan serat/partikel." },
            { gen: 3, name: "CVD Carbon-Coating & Pitch Impregnation Unit", cost: 5700, capMult: 1.98, purityBonus: 12.0, maxPurityCap: 99, powerMod: 0.82, hazardMod: -5, desc: "Melapisi partikel katoda LFP/NMC dengan selubung karbon konduktif 2 nm." },
            { gen: 4, name: "Atomic Layer Deposition (ALD) Oxide Passivator", cost: 10400, capMult: 2.78, purityBonus: 18.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Deposisi lapisan tunggal atomik Al₂O₃ mencegah degradasi elektrolit baterai." }
          ]
        },
        "M-401": {
          role: "De-Ironing Magnetik, Klasifikasi & Pengemasan",
          shape: "mfg",
          gens: [
            { gen: 1, name: "Pengayak Mekanis & Penggulung Manual", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 84, powerMod: 1.05, hazardMod: 3, desc: "Masih ada partikel besi mikro yang bisa memicu korsleting baterai." },
            { gen: 2, name: "Supersonic Jet Classifier & Precision Winder", cost: 6800, capMult: 1.46, purityBonus: 6.0, maxPurityCap: 94, powerMod: 0.95, hazardMod: -1, desc: "Memisahkan distribusi ukuran partikel secara aerodinamis." },
            { gen: 3, name: "20.000-Gauss Electromagnetic De-Ironing (<20 ppb)", cost: 13400, capMult: 2.04, purityBonus: 11.5, maxPurityCap: 99, powerMod: 0.84, hazardMod: -6, desc: "Magnet superkuat menarik seluruh kontaminan logam magnetik mikroskopis." },
            { gen: 4, name: "Dry-Room (-60°C Dew Point) Robotic Vacuum Packager", cost: 25500, capMult: 2.86, purityBonus: 17.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -11, desc: "Pengemasan ruang ultra-kering bebas kelembapan untuk standar OEM dirgantara & EV." }
          ]
        }
      }
    },

    "ROUTE-SEMI-CLEAN": {
      id: "ROUTE-SEMI-CLEAN",
      name: "Rute Kimia Elektronik Sub-ppt & Semikonduktor Cleanroom",
      desc: "Dekontaminasi ion logam sub-ppt, distilasi kuarsa/PFA, sintesis cleanroom ISO-1, dan filtrasi 1 nm.",
      units: {
        "P-101": {
          role: "Dekontaminasi Ion Logam & Pre-Filtrasi",
          shape: "pump",
          gens: [
            { gen: 1, name: "Filter Polipropilena & Pompa Stainless", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 5, desc: "Dinding pompa stainless meluruhkan ion Fe/Ni/Cr (hanya cocok untuk kelas teknis)." },
            { gen: 2, name: "PFA-Lined Mag-Pump & Mixed-Bed Ion Exchanger", cost: 520, capMult: 1.40, purityBonus: 5.5, maxPurityCap: 90, powerMod: 1.0, hazardMod: 1, desc: "Seluruh jalur fluida dilapisi fluoropolimer murni bebas kontak logam." },
            { gen: 3, name: "Chelating Resin Metal-Trap (<100 ppt Logam)", cost: 1380, capMult: 1.90, purityBonus: 11.0, maxPurityCap: 98, powerMod: 0.86, hazardMod: -4, desc: "Menangkap ion Na, K, Fe, dan Cu hingga tingkat bagian-per-triliun (ppt)." },
            { gen: 4, name: "Electrodeionization (EDI) & Molecular Chelation Skid", cost: 3250, capMult: 2.60, purityBonus: 16.5, maxPurityCap: 99.9, powerMod: 0.74, hazardMod: -9, desc: "Pemurnian awal standar fabrikasi semikonduktor node 2-nanometer." }
          ]
        },
        "T-102": {
          role: "Kolom Distilasi Kuarsa & PFA Ultra-Murni",
          shape: "tower",
          gens: [
            { gen: 1, name: "Kolom Distilasi Kaca Borosilikat", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.2, hazardMod: 5, desc: "Kaca borosilikat masih melepaskan jejak boron dan natrium ke reagen." },
            { gen: 2, name: "Kolom Fraksinasi Berlapis PTFE Murni", cost: 720, capMult: 1.42, purityBonus: 6.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Bebas pelepasan ion boron dan silika untuk bahan kimia etsa standar." },
            { gen: 3, name: "Synthetic Fused-Quartz & PFA Sub-Boiling Still", cost: 1850, capMult: 1.95, purityBonus: 12.0, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Penguapan tanpa gelembung mendidih mencegah terbawanya droplet pengotor." },
            { gen: 4, name: "Multi-Stage Cryogenic & PFA 11N Rectifier", cost: 4200, capMult: 2.72, purityBonus: 17.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Menghasilkan gas dan cairan elektronik kemurnian 99,999999999% (11N)." }
          ]
        },
        "E-201": {
          role: "Penukar Panas Fluoropolimer & Megasonik",
          shape: "exchanger",
          gens: [
            { gen: 1, name: "Penukar Panas Koil Teflon Sederhana", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.15, hazardMod: 4, desc: "Perpindahan panas lambat karena dinding polimer tebal." },
            { gen: 2, name: "Thin-Wall PFA Capillary Tube Heat Exchanger", cost: 950, capMult: 1.40, purityBonus: 5.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Ratusan kapiler PFA memberikan luas kontak panas tinggi tanpa kontaminasi." },
            { gen: 3, name: "High-Purity Sapphire/SiC Isothermal Exchanger", cost: 2350, capMult: 1.90, purityBonus: 10.5, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Konduktivitas termal setara tembaga dengan kemurnian permukaan kristal safir." },
            { gen: 4, name: "Laser-Stabilized Isothermal (±0,005°C) Thermal Loop", cost: 5200, capMult: 2.62, purityBonus: 15.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Kestabilan termal mutlak untuk sintesis fotoresis litografi EUV." }
          ]
        },
        "C-202": {
          role: "Pompa Vakum Kering & Kompresor Diafragma",
          shape: "compressor",
          gens: [
            { gen: 1, name: "Pompa Vakum Rotary Berpelumas", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 82, powerMod: 1.15, hazardMod: 5, desc: "Uap balik hidrokarbon oli mencemari ruang vakum." },
            { gen: 2, name: "Dry Claw & Scroll Cleanroom Vacuum Pump", cost: 1120, capMult: 1.40, purityBonus: 4.5, maxPurityCap: 92, powerMod: 1.0, hazardMod: 1, desc: "Ruang pompa kering sepenuhnya tanpa pelumas." },
            { gen: 3, name: "Triple-Diaphragm Hastelloy/PTFE Gas Compressor", cost: 2600, capMult: 1.92, purityBonus: 10.0, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Memampatkan gas silana dan NF₃ dengan detektor kebocoran diafragma lapis tiga." },
            { gen: 4, name: "Magnetic-Levitation Turbomolecular Ultra-High Vacuum", cost: 5700, capMult: 2.68, purityBonus: 14.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Menciptakan kondisi vakum 10⁻¹⁰ mbar bebas partikel." }
          ]
        },
        "R-203": {
          role: "Reaktor Cleanroom & Czochralski Ingot Puller",
          shape: "reactor",
          gens: [
            { gen: 1, name: "Bejana Reaksi Ruang Bersih Kelas 10.000", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.2, hazardMod: 6, desc: "Masih terdapat ratusan partikel debu mikro per kaki kubik udara." },
            { gen: 2, name: "ISO Class-1000 PFA Reactor / Czochralski Puller", cost: 1480, capMult: 1.46, purityBonus: 6.5, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Penarikan kristal silikon atau sintesis polimer fotoresis di bawah filter ULPA." },
            { gen: 3, name: "Magnetic-Field Czochralski (MCZ) & ISO-10 Reactor", cost: 3200, capMult: 1.98, purityBonus: 12.5, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Medan magnet meredam arus konveksi lelehan silikon sehingga bebas cacat kristal." },
            { gen: 4, name: "ISO Class-1 Vacuum Cluster & EUV Polymer Reactor", cost: 6800, capMult: 2.80, purityBonus: 18.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Fasilitas fabrikasi tingkat tertinggi di dunia dengan kontrol kontaminasi atomik." }
          ]
        },
        "R-301": {
          role: "Nanofiltrasi Membran & Pemolesan CMP/Epi",
          shape: "reactor_adv",
          gens: [
            { gen: 1, name: "Filter Membran PTFE 0,1 Mikron", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.1, hazardMod: 3, desc: "Menyaring partikel halus namun partikel nano <50 nm masih lolos." },
            { gen: 2, name: "Cascade PTFE Hollow-Fiber 10-nm Filter", cost: 3050, capMult: 1.46, purityBonus: 6.0, maxPurityCap: 92, powerMod: 0.95, hazardMod: 0, desc: "Filtrasi bertingkat ganda disertai degasser membran vakum." },
            { gen: 3, name: "2-Nanometer Asymmetric Fluoropolymer Filter + CMP", cost: 5850, capMult: 2.00, purityBonus: 12.5, maxPurityCap: 99, powerMod: 0.82, hazardMod: -5, desc: "Menahan partikel seukuran molekul protein dengan kerataan permukaan sub-Angstrom." },
            { gen: 4, name: "1-nm Molecular Sieve & Inline ICP-MS Auto-Reject", cost: 10600, capMult: 2.80, purityBonus: 18.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Spektrometer massa plasma memantau kemurnian setiap tetes secara real-time (<0,1 ppt)." }
          ]
        },
        "M-401": {
          role: "Pengemasan FOUP & Silinder Elektropolis",
          shape: "mfg",
          gens: [
            { gen: 1, name: "Pengisian Jerigen HDPE High-Purity", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 84, powerMod: 1.05, hazardMod: 3, desc: "Kemasan plastik standar untuk pengiriman bahan elektronik." },
            { gen: 2, name: "PFA-Lined Drum & Megasonic Bottle Washer", cost: 7000, capMult: 1.48, purityBonus: 6.0, maxPurityCap: 94, powerMod: 0.95, hazardMod: -1, desc: "Wadah dicuci gelombang megasonik air UPW 18,2 MΩ·cm sebelum diisi." },
            { gen: 3, name: "Electropolished 316L Cylinder & Nitrogen FOUP Pod", cost: 13800, capMult: 2.05, purityBonus: 12.0, maxPurityCap: 99, powerMod: 0.84, hazardMod: -6, desc: "Silinder baja dengan kekasaran permukaan Ra < 0,1 µm mencegah adsorpsi kelembapan." },
            { gen: 4, name: "Robotic ISO-1 FOUP & Direct-Fab Pipeline Coupler", cost: 26000, capMult: 2.88, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -11, desc: "Kapsul wafer/reagen bersegel vakum siap masuk langsung ke mesin litografi EUV." }
          ]
        }
      }
    },

    "ROUTE-METAL-COMP": {
      id: "ROUTE-METAL-COMP",
      name: "Rute Metalurgi Presisi, Komposit Dirgantara & Manufaktur Akhir",
      desc: "Peleburan induksi vakum / layup komposit, autoklaf / HIP 1.000 bar, CNC 5-sumbu, dan pelapisan plasma TBC.",
      units: {
        "P-101": {
          role: "Peleburan Induksi Vakum / Prepreg Layup",
          shape: "pump",
          gens: [
            { gen: 1, name: "Tungku Peleburan Gas & Meja Potong Manual", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.2, hazardMod: 6, desc: "Logam cair menyerap gas hidrogen dari udara (porositas tinggi, Grade C)." },
            { gen: 2, name: "Induction Melting Furnace & CNC Ultrasonic Cutter", cost: 550, capMult: 1.40, purityBonus: 5.5, maxPurityCap: 90, powerMod: 1.0, hazardMod: 1, desc: "Peleburan elektromagnetik bersih dan pemotongan serat karbon terkomputerisasi." },
            { gen: 3, name: "Vacuum Induction Melting (VIM) & Automated Tape Layup", cost: 1450, capMult: 1.92, purityBonus: 11.0, maxPurityCap: 98, powerMod: 0.86, hazardMod: -4, desc: "Peleburan superalloy di dalam ruang vakum bebas oksida dan inklusi terak." },
            { gen: 4, name: "Electron-Beam Cold-Hearth & 8-Axis Robotic Fiber Placement", cost: 3400, capMult: 2.65, purityBonus: 16.5, maxPurityCap: 99.9, powerMod: 0.74, hazardMod: -9, desc: "Robot laser meletakkan pita serat karbon T1000 dan mencairkan titanium dengan berkas elektron." }
          ]
        },
        "T-102": {
          role: "Pengecoran Presisi / Preform Weaving 3D",
          shape: "tower",
          gens: [
            { gen: 1, name: "Cetakan Pasir (Sand Casting) & Hand Layup", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.15, hazardMod: 5, desc: "Toleransi dimensi kasar dan kekuatan struktural belum seragam." },
            { gen: 2, name: "High-Pressure Die-Casting & Vacuum Resin Infusion", cost: 750, capMult: 1.42, purityBonus: 6.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Injeksi logam/resin bertekanan menghasilkan komponen padat bebas kantong udara." },
            { gen: 3, name: "Bridgman Single-Crystal Caster & 3D Jacquard Loom", cost: 1920, capMult: 1.95, purityBonus: 12.0, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Menumbuhkan bilah turbin kristal tunggal tanpa batas butir dan tenunan karbon 3 dimensi." },
            { gen: 4, name: "Multi-Laser SLM 3D Metal/Ceramic Additive Printer", cost: 4400, capMult: 2.72, purityBonus: 17.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Mencetak geometri saluran pendingin internal rumit yang mustahil dibuat mesin cor biasa." }
          ]
        },
        "E-201": {
          role: "Tungku Perlakuan Panas & Penempaan Isotermal",
          shape: "exchanger",
          gens: [
            { gen: 1, name: "Tungku Annealing Udara & Palu Tempa", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.2, hazardMod: 6, desc: "Permukaan logam berkerak oksida dan tegangan sisa internal masih tinggi." },
            { gen: 2, name: "Solution Heat-Treatment & Polymer Curing Oven", cost: 980, capMult: 1.40, purityBonus: 5.0, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Perlakuan panas T6 presisi untuk mengeraskan paduan aluminium-silikon." },
            { gen: 3, name: "Vacuum Carburizing & Cryogenic Sub-Zero Quench", cost: 2420, capMult: 1.92, purityBonus: 10.5, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Pendinginan nitrogen cair -196°C mengubah sisa austenit menjadi struktur martensit ultra-kuat." },
            { gen: 4, name: "10.000-Ton Isothermal Vacuum Forging Press", cost: 5350, capMult: 2.65, purityBonus: 15.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Menempa billet superalloy dan titanium pada kondisi superplastis dengan cetakan molibdenum panas." }
          ]
        },
        "C-202": {
          role: "Intensifier Tekanan Gas Argon & Hidrolik",
          shape: "compressor",
          gens: [
            { gen: 1, name: "Pompa Hidrolik Tekanan Menengah 100 Bar", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 82, powerMod: 1.15, hazardMod: 5, desc: "Tekanan kempa belum cukup untuk menutup pori mikroskopis di dalam logam cor." },
            { gen: 2, name: "Booster Kompresor Nitrogen Autoklaf 200 Bar", cost: 1150, capMult: 1.40, purityBonus: 4.5, maxPurityCap: 92, powerMod: 1.0, hazardMod: 1, desc: "Memberikan tekanan konsolidasi komposit bebas void." },
            { gen: 3, name: "High-Purity Argon Gas Intensifier 1.000 Bar", cost: 2680, capMult: 1.92, purityBonus: 10.0, maxPurityCap: 98, powerMod: 0.85, hazardMod: -5, desc: "Memampatkan gas argon murni hingga 1.000 atmosfer untuk proses HIP." },
            { gen: 4, name: "Electro-Hydraulic 2.000-Bar Isostatic Intensifier", cost: 5850, capMult: 2.68, purityBonus: 14.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: "Tekanan isostatik ekstrem menyatukan keramik dan logam hingga densitas teoritis 100%." }
          ]
        },
        "R-203": {
          role: "Autoklaf Dirgantara & Hot Isostatic Press (HIP)",
          shape: "reactor",
          gens: [
            { gen: 1, name: "Press Plat Panas Hidrolik", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 79, powerMod: 1.2, hazardMod: 6, desc: "Hanya menekan dari dua arah; sudut komponen komposit rawan delaminasi." },
            { gen: 2, name: "Aerospace Composite Autoclave (18 Bar, 260°C)", cost: 1520, capMult: 1.46, purityBonus: 6.5, maxPurityCap: 91, powerMod: 1.0, hazardMod: 1, desc: "Mematangkan panel sayap serat karbon di bawah kantong vakum dan gas bertekanan." },
            { gen: 3, name: "Hot Isostatic Pressing (HIP) Furnace (1.250°C, 1.000 Bar)", cost: 3300, capMult: 2.00, purityBonus: 12.5, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: "Menghilangkan seluruh rongga mikro pada blok mesin V8 dan implan titanium." },
            { gen: 4, name: "Chemical Vapor Infiltration (CVI) & Sinter-HIP 2.200°C", cost: 6950, capMult: 2.82, purityBonus: 18.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Menumbuhkan matriks keramik SiC di sela-sela serat karbon untuk selubung roket hipersonik." }
          ]
        },
        "R-301": {
          role: "Pusat Permesinan CNC 5-Sumbu & Laser/EDM",
          shape: "reactor_adv",
          gens: [
            { gen: 1, name: "Mesin Bubut & Milling Konvensional", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.1, hazardMod: 4, desc: "Toleransi ±0,1 mm; kurang presisi untuk komponen putaran tinggi." },
            { gen: 2, name: "CNC 3-Axis Machining & Cylinder Honing Center", cost: 3100, capMult: 1.46, purityBonus: 6.0, maxPurityCap: 92, powerMod: 0.95, hazardMod: 0, desc: "Menghaluskan lubang silinder mesin dan dudukan katup dengan presisi ±10 mikron." },
            { gen: 3, name: "Simultaneous 5-Axis CNC & Wire-EDM (±2 Mikron)", cost: 5950, capMult: 2.00, purityBonus: 12.5, maxPurityCap: 99, powerMod: 0.82, hazardMod: -5, desc: "Memotong superalloy Inconel dan komposit keras menggunakan kawat pelepasan listrik." },
            { gen: 4, name: "Ultrasonic-Laser Hybrid 5-Axis Nanomachining Center", cost: 10800, capMult: 2.82, purityBonus: 18.5, maxPurityCap: 99.9, powerMod: 0.70, hazardMod: -10, desc: "Permesinan berbantuan getaran ultrasonik dan laser femtodetik dengan akurasi sub-mikron." }
          ]
        },
        "M-401": {
          role: "Pelapisan Termal Plasma (TBC) & Uji Sinar-X CT",
          shape: "mfg",
          gens: [
            { gen: 1, name: "Semprotan Pelapis Anti-Karat & Uji Kaliper", cost: 0, capMult: 1.0, purityBonus: 0, maxPurityCap: 84, powerMod: 1.05, hazardMod: 3, desc: "Inspeksi dimensi luar saja tanpa bisa melihat retakan di dalam komponen." },
            { gen: 2, name: "Atmospheric Plasma Spray (APS) & Ultrasonic NDT", cost: 7200, capMult: 1.48, purityBonus: 6.0, maxPurityCap: 94, powerMod: 0.95, hazardMod: -1, desc: "Menyemprotkan bubuk keramik zirkonia dengan obor plasma 10.000°C." },
            { gen: 3, name: "Electron-Beam PVD Thermal Barrier Coat & X-Ray CT", cost: 14200, capMult: 2.06, purityBonus: 12.0, maxPurityCap: 99, powerMod: 0.84, hazardMod: -6, desc: "Pelapisan kristal kolumnar tahan kejut termal 1.650°C disertai pemindaian CT 3D." },
            { gen: 4, name: "Laser Interferometry & Aerospace Qualification Cell", cost: 26500, capMult: 2.90, purityBonus: 18.0, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -11, desc: "Sertifikasi penerbangan & antariksa otomatis dengan nilai jual maksimum." }
          ]
        }
      }
    }
  };

  // 4 Generasi Ganti Alat untuk Unit Pengendali Emisi S-501 (berlaku di semua rute)
  const SCRUBBER_GENS = [
    { gen: 1, name: "Venturi Water-Spray Scrubber Dasar", cost: 0, captureBase: 0.20, desc: "Menyemprotkan kabut air ke gas buang; menyerap debu kasar dan ~20% CO₂." },
    { gen: 2, name: "Packed-Bed MEA Amine Absorber Column", cost: 680, captureBase: 0.48, desc: "Larutan Monoetanolamina menyerap hampir separuh emisi CO₂ dan SO₂ pabrik." },
    { gen: 3, name: "Regenerative Activated-Amine & Membrane CCUS", cost: 1850, captureBase: 0.76, desc: "Kombinasi pelarut amina generasi lanjut dan membran polimer memangkas 76% pajak karbon." },
    { gen: 4, name: "Cryogenic Direct Carbon Liquefaction & Mineralizer", cost: 4200, captureBase: 0.95, desc: "Menangkap 95% CO₂ menjadi karbon cair murni bebas denda regulasi hijau Eropa!" }
  ];

  // 4 Generasi Ganti Alat untuk Unit Daur Ulang Pelarut & Gas S-502 (menghemat bahan baku & menaikkan yield)
  const RECOVERY_GENS = [
    { gen: 1, name: "Kondensor Uap Pelarut & Knock-Out Drum", cost: 0, feedSaveRatio: 0.10, purityBonus: 1.5, desc: "Mengembunkan sebagian uap bahan baku yang terbuang (hemat bahan baku 10%)." },
    { gen: 2, name: "Activated Carbon Solvent Recovery Bed", cost: 920, feedSaveRatio: 0.20, purityBonus: 3.0, desc: "Menyerap dan mendaur ulang pelarut organik & gas reaktan kembali ke tangki umpan (hemat 20%)." },
    { gen: 3, name: "Cryogenic Flare-Gas & Monomer Recycler", cost: 2250, feedSaveRatio: 0.30, purityBonus: 5.0, desc: "Mencairkan gas buang reaktor untuk disuntikkan kembali ke lini proses (hemat 30%)." },
    { gen: 4, name: "Zero-Loss Molecular Membrane Closed-Loop Recycler", cost: 4900, feedSaveRatio: 0.42, purityBonus: 7.5, desc: "Siklus tertutup penuh yang memulihkan 42% bahan baku tak bereaksi dengan kemurnian ultra-tinggi." }
  ];

  // Ekstensi Tahap #6 (Q-204), #7 (F-301), #9 (D-303), #10 (K-401), #12 (PK-403) untuk Memperpanjang Rangkaian Alat Proses hingga 12 Tahap!
  const EXTENDED_STAGE_SPECS = {
    "ROUTE-DISTILASI": {
      "Q-204": ["Kondensor Overhead & Reflux Drum", "Air-Fin Fan Condenser", "Subcooled Shell-and-Tube Reflux Cooler", "Cryogenic Overhead Vapor Recovery", "Smart Plate-Fin Condenser AI"],
      "F-301": ["Separator Fasa Minyak-Air-Gas", "Three-Phase Gravity Separator", "High-Speed Coalescer Separator", "Electrostatic Phase Splitter", "Cyclonic Supersonic Inline Separator"],
      "D-303": ["Kolom Stabilizer & Stripper Fraksi Ringan", "Steam Stripper Column", "Reboiled Naphtha Stabilizer", "Vacuum De-Pentanizer Packing Tower", "Supercritical Fraction Stripper"],
      "K-401": ["Unit Dehidrasi & Pemanas Akhir", "Salt-Bed Dryer Tower", "Molecular Sieve Hydrocarbon Dryer", "Vacuum Flash Dehydrator", "Membrane Pervaporation Dryer"],
      "PK-403": ["Terminal Tangki Produk & Custody Metering", "Pompa Muat Tangki Manual", "Skid Metering Turbin Otomatis", "Coriolis Mass-Flow & Inert Blanket Terminal", "Robotic Automated Pipeline & ISO-Tank Station"]
    },
    "ROUTE-GAS-SYNTH": {
      "Q-204": ["Quench Cooler Gas Sintesis", "Direct Water Quench Ring", "High-Pressure Steam Quench Exchanger", "Bayonet-Tube Syn-Gas Cooler", "Supercritical Helium/Water Quench Unit"],
      "F-301": ["Separator Kondensat Tekanan Tinggi", "Cold Catchpot Drum", "Vane-Pack Mist Separator 180 Bar", "Cyclonic High-Pressure Gas-Liquid Separator", "Magnetic Cryo-Phase Separator"],
      "D-303": ["Kolom Stripper CO₂ & Degasser", "Packed CO₂ Stripper Tower", "Two-Stage Benfield Carbonate Stripper", "aMDEA Activated Flash Stripper", "Cryogenic CO₂/NH₃ Rectification Tower"],
      "K-401": ["Unit Pengering Gas Molekuler", "Silica-Gel Gas Dryer", "Dual-Bed Zeolite 4A Gas Dehydrator", "Zero-Purge Regeneration Gas Dryer", "Plasma-Regenerated Ultra-Dry Gas Skid"],
      "PK-403": ["Stasiun Kompresi & Pengisian Silinder/Kriogenik", "Manifold Isi Silinder 150 Bar", "Skid Pengisian Tube-Trailer Otomatis", "Cryogenic Liquid Hydrogen/Ammonia Loading Arm", "Robotic Autonomous Cryo-ISO Filling Bay"]
    },
    "ROUTE-ELEKTRO-MINERAL": {
      "Q-204": ["Pendingin Gas Klorin & Kondensor Asam", "Water-Spray Gas Cooler", "Titanium Direct Contact Cooler", "Tantalum/PTFE Acid Mist Cooler", "Silicon-Carbide Sub-Zero Gas Chiller"],
      "F-301": ["Pemisah Kabut Asam & Filter Garam", "Wire-Mesh Demister Box", "Candle Fiber-Bed Mist Eliminator", "High-Velocity Brink Acid Demister", "Electrostatic Wet Acid Precipitator"],
      "D-303": ["Menara Pengering Klorin & De-Klorinator", "Sulfuric Acid Drying Tower", "3-Stage Counter-Current H₂SO₄ Dryer", "Vacuum De-Chlorination Brine Stripper", "Membrane Gas Dehydration & Purifier"],
      "K-401": ["Tungku Kalsinasi & Pengeringan Mineral", "Direct-Fired Rotary Dryer", "Fluidized-Bed Mineral Calciner 850°C", "Indirect-Heated High-Purity Kiln", "Microwave Plasma Mineral Calciner"],
      "PK-403": ["Silo Tahan Korosi & Pengemas Otomatis", "Pengisian Karung & Drum Manual", "Semi-Auto Acid Carboy & Bag Filler", "Hermetic PTFE-Lined Bulk Loader", "Robotic Zero-Exposure Hazardous Packager"]
    },
    "ROUTE-POLIMER": {
      "Q-204": ["Pendingin Lelehan & Kondensor Siklon", "Water-Bath Melt Cooler", "Reflux Monomer Condenser Drum", "High-Capacity Slurry Flash Cooler", "Cryogenic Polymer Quench Chamber"],
      "F-301": ["Separator Siklon Polimer-Monomer", "Low-Pressure Flash Baghouse", "High-Efficiency Cyclone Powder Separator", "Centrifugal Slurry Dewatering Unit", "Electrostatic Fines Recovery Separator"],
      "D-303": ["Kolom Stripper & Pencuci Residu Katalis", "Steam Stripping Vessel", "Counter-Current Catalyst Deactivator", "Two-Stage Vacuum Monomer Stripper", "Supercritical Solvent-Free Purifier"],
      "K-401": ["Pengering Resin Fluidized-Bed", "Hot-Air Hopper Dryer", "Closed-Loop Nitrogen Fluid-Bed Dryer", "Vacuum Rotary Paddle Resin Dryer", "Infrared Continuous Crystal Dryer"],
      "PK-403": ["Silo Homogenisasi & Pengemas Pelet", "Silo Penampung & Karung 25kg", "Gravity Blender Silo & Auto-Bagger", "Elutriator Deduster & Cleanroom Octabin Filler", "Robotic Laser-Inspected Pellet Packaging Line"]
    },
    "ROUTE-BIO-PHARMA": {
      "Q-204": ["Pendingin Kaldu Fermentasi & Penukar Kalor", "Tubular Broth Cooler", "Sanitary Plate Chiller +4°C", "Double-Tube-Sheet cGMP Sterile Cooler", "Instant Cryo-Arrest Heat Exchanger"],
      "F-301": ["Mikrofiltrasi Panen Sel & Klarifikasi", "Rotary Vacuum Drum Filter", "Hollow-Fiber Microfiltration Skid", "Ceramic Cross-Flow Sterile Clarifier", "Automated Single-Use Depth Filtration"],
      "D-303": ["Evaporator Pelarut Vakum Suhu Rendah", "Climbing-Film Evaporator", "Wiped-Film Short-Path Molecular Still", "Multi-Stage cGMP Falling-Film Concentrator", "Cryo-Vacuum Solvent Recovery Evaporator"],
      "K-401": ["Pengeringan Steril & Pelapisan Tablet/Granul", "Tray Vacuum Drying Oven", "Aseptic Fluid-Bed Granule Dryer", "Perforated-Pan Film Coater & Lyophilizer", "Continuous Freeze-Drying Sterile Tunnel"],
      "PK-403": ["Lini Blister, Vial & Pengemasan Farmasi", "Meja Kemas Botol Manual", "High-Speed Blister & Bottle Line", "Isolator RABS Aseptic Vial Filler", "100% Vision-AI Robotic Pharma Packaging"]
    },
    "ROUTE-HIGH-TEMP": {
      "Q-204": ["Ruang Pendingin Inert & Quench Gas", "Water-Jacketed Cooling Zone", "Nitrogen Convection Cooling Tunnel", "High-Purity Argon Rapid Quench Chamber", " Recuperative Radiative Heat-Recovery Cooler"],
      "F-301": ["Separator Siklon Bubuk Nano & Filter Keramik", "Sintered Metal Dust Collector", "Ceramic Candle Hot-Gas Filter 900°C", "Supersonic Cyclone Nanopowder Collector", "Electrostatic High-Temp Nanoparticle Trap"],
      "D-303": ["Tungku De-Binding & Pelepasan Volatil", "Thermal Burn-Off Oven 450°C", "Catalytic Acid-Vapor Debinding Furnace", "Vacuum Pyrolysis Tar-Removal Chamber", "Plasma-Assisted Rapid Debinding Reactor"],
      "K-401": ["Tungku Annealing & Sintering Sekunder", "Box Annealing Furnace", "Pusher-Plate Atmosphere Sintering Kiln", "High-Vacuum Graphitization & Annealing 2200°C", "Ultra-Fast Microwave & Laser Sintering Cell"],
      "PK-403": ["Penggulung Spool Serat & Kemasan Vakum Dry-Room", "Winder & Kemasan Plastik Dasar", "Multi-Axis Tension Controlled Spooler", "Argon-Glovebox Vacuum Foil Packager", "Robotic Dry-Room (-65°C) Hermetic Canister Line"]
    },
    "ROUTE-SEMI-CLEAN": {
      "Q-204": ["Chiller Fluoropolimer Sub-Zero", "PFA Coil Chiller", "Dual-Loop Ultra-Pure Thermal Exchanger", "Sapphire-Tube Cryo Condenser", "Peltier Solid-State Sub-mK Cooler"],
      "F-301": ["Pemisah Gelembung Mikro & Degasser Membran", "PTFE Vacuum Degasser", "Hollow-Fiber PFA Dissolved-Gas Stripper", "Megasonic Micro-Bubble Eliminator", "Zero-Particle Supercritical Phase Separator"],
      "D-303": ["Kolom Stripping Trace-Moisture (<10 ppt)", "Nitrogen Purge PFA Column", "Sub-Boiling Quartz Moisture Stripper", "Cryogenic Getter Impurity Trap", "Atomic-Sieve Sub-ppt Purifier Column"],
      "K-401": ["Oven Bake-Out Vakum & Pengeringan Marangoni", "Cleanroom Spin-Rinse Dryer", "IPA Vapor Marangoni Wafer Dryer", "Ultra-High Vacuum Thermal Bake-Out Chamber", "Laser-Assisted Rapid Molecular Desorption Unit"],
      "PK-403": ["Stasiun Pengisian Cleanroom ISO-1 & FOUP Pod", "Laminar-Flow Bottle Filling Hood", "Class-10 PFA Drum Double-Bag Station", "Nitrogen-Purged FOUP & Electropolished Cylinder Station", "Fully Autonomous Lights-Out Fab Packaging Cell"]
    },
    "ROUTE-METAL-COMP": {
      "Q-204": ["Ruang Pendingin Vakum & Gas-Quench Tekanan Tinggi", "Oil/Water Quench Tank", "6-Bar Nitrogen Gas Quench Chamber", "20-Bar Helium High-Velocity Jet Quench", "Cryogenic Liquid-Nitrogen Sub-Zero Treatment Cell"],
      "F-301": ["Pemisah Inklusi Keramik & Filter Logam Cair", "Ceramic Foam Molten Metal Filter", "Electromagnetic Slag & Inclusion Separator", "Centrifugal Vacuum Degassing & Filtering", "Acoustic-Levitation Inclusion Purifier"],
      "D-303": ["Ruang Degassing Hidrogen & Autoklaf Debulking", "Vacuum Bell Degasser", "Rotary Argon Impeller Molten Degasser", "Vacuum-Arc De-Oxidation & Debulking Station", "Electron-Beam Ultra-Vacuum Outgassing Unit"],
      "K-401": ["Mesin Bubut/Grinding Presisi & EDM Roughing", "Horizontal Milling & Grinding Machine", "CNC Creep-Feed Blade Grinder", "5-Axis Ultrasonic Composite Trimmer & EDM", "Laser-Ablation & Diamond-Turning Nano-Lathe"],
      "PK-403": ["Sel Uji Non-Destruktif (NDT) & Kemasan Dirgantara", "Meja Inspeksi Mikrometer Manual", "Coordinate Measuring Machine (CMM) & Dye-Penetrant", "3D Industrial X-Ray CT & Acoustic Emission Scanner", "Automated Orbital-Certified Shockproof Crating Bay"]
    }
  };

  Object.keys(PROCESS_ROUTES).forEach((rKey) => {
    const ext = EXTENDED_STAGE_SPECS[rKey] || EXTENDED_STAGE_SPECS["ROUTE-DISTILASI"];
    const uMap = PROCESS_ROUTES[rKey].units;

    const stageCosts = {
      "Q-204": [0, 1100, 2500, 5400],
      "F-301": [0, 1450, 3200, 6800],
      "D-303": [0, 2900, 5800, 10500],
      "K-401": [0, 3800, 7400, 14500],
      "PK-403": [0, 7500, 14800, 27500]
    };

    const stageShapes = {
      "Q-204": "exchanger",
      "F-301": "tower",
      "D-303": "reactor_adv",
      "K-401": "reactor",
      "PK-403": "mfg"
    };

    Object.keys(ext).forEach((sId) => {
      const arr = ext[sId];
      const costs = stageCosts[sId];
      uMap[sId] = {
        role: arr[0],
        shape: stageShapes[sId],
        gens: [
          { gen: 1, name: arr[1], cost: costs[0], capMult: 1.0, purityBonus: 0, maxPurityCap: 81, powerMod: 1.15, hazardMod: 4, desc: `Unit dasar untuk ${arr[0].toLowerCase()} (mentok Grade C/B awal).` },
          { gen: 2, name: arr[2], cost: costs[1], capMult: 1.42, purityBonus: 5.5, maxPurityCap: 91, powerMod: 0.98, hazardMod: 1, desc: `Meningkatkan efisiensi ${arr[0].toLowerCase()} ke standar kontinu Grade B.` },
          { gen: 3, name: arr[3], cost: costs[2], capMult: 1.95, purityBonus: 11.5, maxPurityCap: 98, powerMod: 0.84, hazardMod: -5, desc: `Teknologi presisi tinggi membuka kualitas Grade A (>92%) dan menekan risiko.` },
          { gen: 4, name: arr[4], cost: costs[3], capMult: 2.75, purityBonus: 17.5, maxPurityCap: 99.9, powerMod: 0.72, hazardMod: -10, desc: `Generasi ke-4 mutakhir dengan throughput dan kemurnian maksimum.` }
        ]
      };
    });
  });

  // ===========================================================================
  // KATALOG 300 PRODUK KIMIA LENGKAP (75 TIER 1, 75 TIER 2, 75 TIER 3, 75 TIER 4)
  // ===========================================================================
  const T1_HULU = [
    ["Etilena Murni", "C₂H₄", "C₂H₆ —(Steam 820°C)→ C₂H₄ + H₂", "RAW-GAS", 160, "Monomer utama plastik polietilena dan etilen oksida."],
    ["Propilena Industri", "C₃H₆", "2 C₃H₈ —(Cracking)→ C₃H₆ + C₂H₄ + CH₄ + H₂", "RAW-GAS", 175, "Bahan baku polipropilena, akrilonitril, dan propilen oksida."],
    ["Nafta Ringan", "C₅H₁₂–C₇H₁₆", "Minyak Mentah —(Distilasi 90°C)→ Fraksi Nafta Ringan", "RAW-CRUDE", 140, "Umpan utama unit steam cracker dan pelarut nonpolar."],
    ["Nafta Berat Reformer", "C₇H₁₆–C₁₂H₂₆", "Nafta —(Hydrotreating)→ Nafta Bebas Sulfur", "RAW-CRUDE", 155, "Umpan catalytic reforming untuk produksi aromatik BTX."],
    ["Benzena Petrokimia", "C₆H₆", "C₆H₁₂ —(Pt/Al₂O₃, 500°C)→ C₆H₆ + 3 H₂", "RAW-CRUDE", 210, "Cincin aromatik dasar untuk stirena, fenol, dan nilon."],
    ["Toluena Industri", "C₇H₈", "C₇H₁₄ —(Reforming Katalitik)→ C₇H₈ + 3 H₂", "RAW-CRUDE", 195, "Pelarut industri, prekursor poliuretan (TDI), dan bahan peledak."],
    ["Para-Xilena (p-Xylene)", "C₈H₁₀", "Campuran Xilena —(Adsorpsi Zeolit Parex)→ p-C₈H₁₀", "RAW-CRUDE", 230, "Bahan baku utama asam tereftalat (PTA) untuk botol dan serat PET."],
    ["Orto-Xilena (o-Xylene)", "C₈H₁₀", "C₈H₁₀(campuran) —(Fraksinasi Presisi)→ o-C₈H₁₀", "RAW-CRUDE", 215, "Prekursor ftalat anhidrida untuk pemlastis (plasticizer) PVC."],
    ["Metanol Sintetis", "CH₃OH", "CO + 2 H₂ —(Cu/ZnO/Al₂O₃, 250°C, 80 bar)→ CH₃OH", "RAW-GAS", 145, "Bahan baku formaldehida, asam asetat, biodiesel, dan MTO."],
    ["Amonia Anhidrat", "NH₃", "N₂ + 3 H₂ —(Katalis Fe, 450°C, 200 bar Haber-Bosch)→ 2 NH₃", "RAW-GAS", 180, "Fondasi industri pupuk nitrogen, asam nitrat, dan bahan kimia amina."],
    ["Gas Hidrogen Murni", "H₂", "CH₄ + 2 H₂O —(Steam Reforming Ni 850°C)→ CO₂ + 4 H₂", "RAW-GAS", 220, "Hidrogenasi kilang, sintesis amonia, dan bahan bakar sel tunam."],
    ["Gas Sintesis (Syngas)", "CO + H₂", "CH₄ + H₂O —(Reformer 800°C)→ CO + 3 H₂", "RAW-GAS", 125, "Gas perantara untuk sintesis Fischer-Tropsch dan oxo-alkohol."],
    ["1,3-Butadiena", "C₄H₆", "C₄H₈ —(Dehidrogenasi Oksidatif)→ CH₂=CH-CH=CH₂ + H₂", "RAW-CRUDE", 240, "Monomer utama karet sintetis ban kendaraan (SBR & PBR)."],
    ["Isobutilena", "C₄H₈", "(CH₃)₃CH —(Dehidrogenasi Katalitik)→ (CH₃)₂C=CH₂ + H₂", "RAW-GAS", 205, "Bahan baku karet butil kedap udara dan aditif bahan bakar."],
    ["1-Butena", "C₄H₈", "2 C₂H₄ —(Dimerisasi Katalis Ti)→ CH₃CH₂CH=CH₂", "RAW-GAS", 215, "Komononomer penting untuk plastik LLDPE fleksibel kekuatan tinggi."],
    ["Asam Sulfat Pekat 98%", "H₂SO₄", "2 SO₂ + O₂ —(V₂O₅)→ 2 SO₃ + H₂O → 2 H₂SO₄", "RAW-MINERAL", 130, "Bahan kimia industri paling vital untuk pupuk fosfat dan pemurnian logam."],
    ["Gas Klorin Cair", "Cl₂", "2 NaCl + 2 H₂O —(Elektrolisis Membran)→ Cl₂ + H₂ + 2 NaOH", "RAW-MINERAL", 165, "Klorinasi PVC, desinfektan air, dan sintesis epiklorohidrin."],
    ["Natrium Hidroksida (Soda Kaustik)", "NaOH", "2 NaCl + 2 H₂O —(Sel Membran)→ 2 NaOH + Cl₂ + H₂", "RAW-MINERAL", 170, "Netralisasi asam, pemurnian bauksit alumina, kertas, dan sabun."],
    ["Asam Klorida Teknis", "HCl", "H₂ + Cl₂ —(Pembakaran Kuarsa)→ 2 HCl(aq)", "RAW-MINERAL", 135, "Pengasaman sumur minyak, pembersihan kerak baja (pickling), dan klorida."],
    ["Asam Nitrat 68%", "HNO₃", "4 NH₃ + 5 O₂ —(Kasa Pt-Rh 900°C Ostwald)→ 4 NO → 4 HNO₃", "RAW-GAS", 190, "Bahan baku amonium nitrat, adipat nilon, dan nitrasi poliuretan."],
    ["Asam Fosfat Wet-Process", "H₃PO₄", "Ca₃(PO₄)₂ + 3 H₂SO₄ → 2 H₃PO₄ + 3 CaSO₄↓", "RAW-MINERAL", 200, "Bahan baku pupuk DAP/MAP dan garam fosfat pangan/baterai LFP."],
    ["Natrium Karbonat (Soda Ash)", "Na₂CO₃", "2 NaCl + CaCO₃ —(Proses Solvay NH₃)→ Na₂CO₃ + CaCl₂", "RAW-MINERAL", 150, "Fluks utama pembuatan kaca float, deterjen, dan pengolahan air."],
    ["Karbon Monoksida Murni", "CO", "CO₂ + C —(Boudouard / Cryogenic Split)→ 2 CO", "RAW-GAS", 160, "Karbonilasi Monsanto/Cativa untuk asam asetat dan polikarbonat."],
    ["Karbon Dioksida Cair Industri", "CO₂", "Gas Buang Amine Stripper —(Kompresi 20 bar)→ CO₂(l)", "RAW-GAS", 110, "Sintesis urea, ekstraksi superkritis, dan pendingin kriogenik."],
    ["Asetilena Industri", "C₂H₂", "2 CH₄ —(Pirolisis Busur Listrik 1500°C)→ C₂H₂ + 3 H₂", "RAW-GAS", 225, "Pengelasan suhu tinggi dan sintesis 1,4-butanadiol."],
    ["Etilen Oksida (EO)", "C₂H₄O", "2 C₂H₄ + O₂ —(Katalis Ag/Al₂O₃, 250°C)→ 2 C₂H₄O", "RAW-GAS", 250, "Prekursor etilen glikol, surfaktan non-ionik, dan sterilisasi medis."],
    ["Propilen Oksida (PO)", "C₃H₆O", "C₃H₆ + H₂O₂ —(Katalis TS-1 HPPO)→ C₃H₆O + H₂O", "RAW-GAS", 265, "Bahan baku utama poliol poliuretan untuk busa kasur dan insulasi."],
    ["Formaldehida (Formalin 37%)", "CH₂O", "2 CH₃OH + O₂ —(Katalis Fe-Mo Oksida 350°C)→ 2 CH₂O + 2 H₂O", "RAW-GAS", 155, "Resin kayu lapis urea-formaldehida, fenolik, dan plastik POM."],
    ["Asetaldehida", "CH₃CHO", "2 C₂H₄ + O₂ —(Proses Wacker PdCl₂/CuCl₂)→ 2 CH₃CHO", "RAW-GAS", 210, "Intermediet asam asetat, piridina, dan pentaeritritol."],
    ["Asam Asetat Glasial", "CH₃COOH", "CH₃OH + CO —(Katalis Rh/Ir Cativa 190°C)→ CH₃COOH", "RAW-GAS", 220, "Bahan baku vinil asetat (VAM), pelarut PTA, dan anhidrida asetat."],
    ["Stirena Monomer (SM)", "C₈H₈", "C₆H₆ + C₂H₄ → C₆H₅C₂H₅ —(Dehidrogenasi 620°C)→ C₆H₅CH=CH₂", "RAW-CRUDE", 260, "Monomer polistirena, ABS, karet SBR, dan resin fiberglass."],
    ["Kumena (Isopropilbenzena)", "C₉H₁₂", "C₆H₆ + C₃H₆ —(Zeolit MCM-22)→ C₆H₅CH(CH₃)₂", "RAW-CRUDE", 235, "Perantara utama produksi serentak fenol dan aseton dunia."],
    ["Fenol Kristal", "C₆H₅OH", "C₉H₁₂ + O₂ → Kumena Hidroperoksida —(H⁺)→ C₆H₅OH + (CH₃)₂CO", "RAW-CRUDE", 270, "Bahan baku Bisphenol-A (polikarbonat & epoksi) serta resin bakelit."],
    ["Aseton Murni", "(CH₃)₂CO", "C₆H₅C(CH₃)₂OOH —(Cleavage Asam)→ (CH₃)₂CO + C₆H₅OH", "RAW-CRUDE", 210, "Pelarut industri cepat kering dan bahan baku kaca akrilik (MMA)."],
    ["Sikloheksana", "C₆H₁₂", "C₆H₆ + 3 H₂ —(Katalis Raney Ni 200°C)→ C₆H₁₂", "RAW-CRUDE", 245, "Prekursor langsung kaprolaktam (Nilon-6) dan asam adipat (Nilon-6,6)."],
    ["Sikloheksanon", "C₆H₁₀O", "C₆H₁₂ + O₂ —(Oksidasi Katalis Co)→ C₆H₁₀O + H₂O", "RAW-CRUDE", 275, "Pelarut resin khusus dan umpan reaksi oksiimasi kaprolaktam."],
    ["Etilbenzena", "C₈H₁₀", "C₆H₆ + C₂H₄ —(Alkilasi Zeolit Fase Cair)→ C₆H₅C₂H₅", "RAW-CRUDE", 225, "Umpan langsung reaktor dehidrogenasi stirena monomer."],
    ["Vinil Klorida Monomer (VCM)", "C₂H₃Cl", "C₂H₄ + Cl₂ → C₂H₄Cl₂ —(Pirolisis 500°C)→ CH₂=CHCl + HCl", "RAW-MINERAL", 230, "Monomer tunggal untuk produksi massal pipa dan profil PVC."],
    ["Etilen Diklorida (EDC)", "C₂H₄Cl₂", "C₂H₄ + Cl₂ —(FeCl₃)→ ClCH₂-CH₂Cl", "RAW-MINERAL", 195, "Prekursor VCM dan pelarut ekstraksi klorinasi."],
    ["Metil Tert-Butil Eter (MTBE)", "C₅H₁₂O", "(CH₃)₂C=CH₂ + CH₃OH —(Resin Penukar Ion)→ CH₃OC(CH₃)₃", "RAW-GAS", 215, "Penambah angka oktan bensin (octane booster) dan sumber isobutilena murni."],
    ["Etanol Industri Anhidrat", "C₂H₅OH", "C₆H₁₂O₆ —(Fermentasi & Molecular Sieve)→ 2 C₂H₅OH + 2 CO₂", "RAW-BIO", 185, "Pelarut farmasi, bahan bakar bio-etanol E10, dan etil asetat."],
    ["Isopropil Alkohol (IPA)", "C₃H₈O", "C₃H₆ + H₂O —(Hidrasi Katalitik Asam)→ (CH₃)₂CHOH", "RAW-GAS", 230, "Pembersih elektronik, pelarut disinfektan medis, dan kosmetik."],
    ["n-Butanol", "C₄H₉OH", "C₃H₆ + CO + 2 H₂ —(Hidroformilasi Rh)→ CH₃(CH₂)₃OH", "RAW-GAS", 250, "Prekursor butil akrilat untuk cat berbasis air dan perekat."],
    ["2-Etilheksanol (2-EH)", "C₈H₁₈O", "2 C₃H₇CHO —(Kondensasi Aldol & Hidrogenasi)→ C₈H₁₇OH", "RAW-GAS", 280, "Alkohol utama pembuat plasticizer DOP/DOTP untuk kabel fleksibel."],
    ["Karbon Hitam (Carbon Black N330)", "C(amorf)", "Minyak Aromatik Berat —(Pembakaran Tak Sempurna 1400°C)→ C + Gas", "RAW-CRUDE", 190, "Penguat mekanis wajib pada ban karet kendaraan dan pigmen tinta."],
    ["Titanium Dioksida (Pigmen Rutil)", "TiO₂", "TiCl₄ + O₂ —(Oksidasi Plasma 1200°C)→ TiO₂ + 2 Cl₂", "RAW-MINERAL", 310, "Pigmen putih pemantul UV paling penting untuk cat, plastik, dan kertas."],
    ["Silikon Tetraklorida", "SiCl₄", "Si + 2 Cl₂ —(Fluidized Bed 450°C)→ SiCl₄", "RAW-MINERAL", 295, "Prekursor serat optik kuarsa murni dan silika berasap (fumed silica)."],
    ["Hidrogen Peroksida 50%", "H₂O₂", "H₂ + O₂ —(Siklus Antrakuinon Pd)→ H₂O₂", "RAW-GAS", 240, "Pemutih ramah lingkungan, oksidator kimia, dan sterilisasi aseptik."],
    ["Amonium Nitrat Porous", "NH₄NO₃", "NH₃ + HNO₃ —(Netralisasi & Prilling Tower)→ NH₄NO₃", "RAW-GAS", 205, "Pupuk nitrogen konsentrasi tinggi dan agen emulsi tambang ANFO."],
    ["Urea Prill & Granul", "CO(NH₂)₂", "2 NH₃ + CO₂ —(190°C, 150 bar)→ NH₂CONH₄ → CO(NH₂)₂ + H₂O", "RAW-GAS", 175, "Pupuk pertanian terpenting dunia dan bahan baku resin melamin."],
    // +25 PRODUK HULU BARU (51..75)
    ["1-Heksena Komonomer", "C₆H₁₂", "3 C₂H₄ —(Trimerisasi Katalis Cr)→ CH₂=CH(CH₂)₃CH₃", "RAW-GAS", 265, "Komonomer kunci penentu kekuatan sobek plastik pipa HDPE dan film LLDPE."],
    ["1-Oktena Linear", "C₈H₁₆", "4 C₂H₄ —(Tetramerisasi Selektif)→ CH₂=CH(CH₂)₅CH₃", "RAW-GAS", 290, "Alfa-olefin rantai panjang untuk elastomer poliolefin dan pelumas sintetis."],
    ["Isoprena Monomer", "C₅H₈", "Isobutilena + CH₂O → Prins —(Dehidrasi)→ CH₂=C(CH₃)CH=CH₂", "RAW-CRUDE", 275, "Monomer karet poliisoprena sintetis pengganti lateks karet alam untuk sarung tangan bedah."],
    ["Disiklopentadiena (DCPD)", "C₁₀H₁₂", "2 C₅H₆ (Fraksi C5 Cracker) —(Dimerisasi Termal)→ DCPD", "RAW-CRUDE", 255, "Monomer resin termoset tahan benturan ekstrem untuk bodi traktor dan tangki kimia."],
    ["Meta-Xilena (m-Xylene)", "C₈H₁₀", "Campuran C8 Aromatik —(Adsorpsi Selektif)→ m-C₈H₁₀", "RAW-CRUDE", 235, "Bahan baku asam isoftalat untuk resin botol PET tahan panas dan cat gelcoat kapal."],
    ["Asam Isoftalat (IPA-Acid)", "C₆H₄(COOH)₂", "m-C₈H₁₀ + 3 O₂ —(Oksidasi Co-Mn)→ m-C₆H₄(COOH)₂ + 2 H₂O", "RAW-CRUDE", 285, "Modifikator struktur kristal resin PET agar botol lebih jernih dan kedap gas CO₂."],
    ["Karbon Disulfida", "CS₂", "CH₄ + 4 S —(Katalis Silika Gel 600°C)→ CS₂ + 2 H₂S", "RAW-MINERAL", 195, "Reagen utama pembuatan serat rayon viskosa, selofan, dan vulkanisasi karet."],
    ["Belerang Dioksida Cair", "SO₂", "S + O₂ —(Pembakaran & Likuifaksi -10°C)→ SO₂(l)", "RAW-MINERAL", 145, "Pemutih pulp kertas, pengawet anggur, dan reduktor pengolahan limbah kromium."],
    ["Oleum (Asam Sulfat Berasap 20%)", "H₂SO₄·SO₃", "H₂SO₄ + SO₃ —(Menara Absorpsi Oleum)→ H₂S₂O₇", "RAW-MINERAL", 180, "Reagen sulfonasi deterjen, nitrasi bahan peledak, dan produksi kaprolaktam."],
    ["Kalium Hidroksida (Potash Kaustik)", "KOH", "2 KCl + 2 H₂O —(Elektrolisis Membran)→ 2 KOH + Cl₂ + H₂", "RAW-MINERAL", 240, "Elektrolit baterai alkaline, pembuatan sabun cair lembut, dan pupuk kalium cair."],
    ["Natrium Hipoklorit Pekat 15%", "NaOCl", "Cl₂ + 2 NaOH —(Reaktor Pendingin <25°C)→ NaOCl + NaCl + H₂O", "RAW-MINERAL", 140, "Disinfektan instalasi air minum PDAM, pemutih tekstil, dan sanitasi rumah sakit."],
    ["Natrium Klorat Kristal", "NaClO₃", "NaCl + 3 H₂O —(Elektrolisis Tanpa Diafragma 70°C)→ NaClO₃ + 3 H₂", "RAW-MINERAL", 215, "Bahan utama pembangkit klorin dioksida untuk pemutihan kertas ramah lingkungan (ECF)."],
    ["Kalsium Karbida (Karbit Industri)", "CaC₂", "CaO + 3 C —(Tungku Busur Listrik 2100°C)→ CaC₂ + CO", "RAW-MINERAL", 185, "Penghasil gas asetilena las, desulfurisasi besi kasar baja, dan pupuk kalsium sianamida."],
    ["Amonium Sulfat (Pupuk ZA)", "(NH₄)₂SO₄", "2 NH₃ + H₂SO₄ —(Kristalisator Vakum)→ (NH₄)₂SO₄", "RAW-MINERAL", 160, "Pupuk pemberi unsur nitrogen sekaligus belerang untuk tanah pertanian alkali."],
    ["Monoamonium Fosfat (Pupuk MAP)", "NH₄H₂PO₄", "NH₃ + H₃PO₄ —(Reaktor Pipa & Granulator)→ NH₄H₂PO₄", "RAW-MINERAL", 230, "Pupuk starter fosfor larut air cepat dan serbuk isi tabung pemadam kebakaran ABC."],
    ["Diamonium Fosfat (Pupuk DAP)", "(NH₄)₂HPO₄", "2 NH₃ + H₃PO₄ —(Ammoniasi & Granulasi)→ (NH₄)₂HPO₄", "RAW-MINERAL", 245, "Pupuk fosfat standar perdagangan pertanian global dengan kandungan nutrisi tertinggi."],
    ["Asam Format 85%", "HCOOH", "CO + CH₃OH → HCOOCH₃ —(Hidrolisis)→ HCOOH + CH₃OH", "RAW-GAS", 220, "Penggumpal lateks karet alam perkebunan, pengawet pakan ternak silase, dan penyamakan kulit."],
    ["Asam Propionat", "CH₃CH₂COOH", "C₂H₄ + CO + H₂O —(Karbonilasi Reppe Ni)→ C₂H₅COOH", "RAW-GAS", 245, "Pengawet anti-jamur roti dan biji-bijian serta intermediet herbisida."],
    ["Anhidrida Asetat", "(CH₃CO)₂O", "2 CH₃COOH —(Pirolisis Keten 700°C)→ (CH₃CO)₂O + H₂O", "RAW-GAS", 270, "Reagen asetilasi utama untuk pembuatan serat selulosa asetat, aspirin, dan parasetamol."],
    ["Etil Asetat Pelarut", "CH₃COOC₂H₅", "CH₃COOH + C₂H₅OH —(Esterifikasi Distilasi Reaktif)→ Etil Asetat + H₂O", "RAW-BIO", 225, "Pelarut ramah lingkungan untuk tinta cetak kemasan makanan, cat kuku, dan dekafeinasi kopi."],
    ["Butil Asetat", "CH₃COOC₄H₉", "CH₃COOH + C₄H₉OH —(Katalis Resin Asam)→ Butil Asetat + H₂O", "RAW-GAS", 240, "Pelarut utama cat duco otomotif, pernis kayu mebel, dan industri kulit sintetis."],
    ["Metil Etil Keton (MEK)", "CH₃COC₂H₅", "CH₃CH(OH)C₂H₅ —(Dehidrogenasi Katalis Zn/Cu)→ MEK + H₂", "RAW-CRUDE", 260, "Pelarut resin vinil, perekat sepatu, dewaxing oli pelumas, dan pita magnetik."],
    ["Metil Isobutil Keton (MIBK)", "(CH₃)₂CHCH₂COCH₃", "2 Aseton —(Kondensasi Aldol & Hidrogenasi Pd)→ MIBK + H₂O", "RAW-CRUDE", 285, "Pelarut ekstraksi logam tanah jarang, antibiotik, dan pelapis nitrocellulose."],
    ["Dietil Eter Teknis", "(C₂H₅)₂O", "2 C₂H₅OH —(Dehidrasi Alumina 220°C)→ (C₂H₅)₂O + H₂O", "RAW-BIO", 230, "Pelarut ekstraksi laboratorium, cairan starter mesin diesel musim dingin, dan propelan."],
    ["Dimetil Eter (DME Clean Fuel)", "CH₃OCH₃", "2 CH₃OH —(Dehidrasi Katalitik Zeolit)→ CH₃OCH₃ + H₂O", "RAW-GAS", 190, "Bahan bakar substitusi LPG bersih bebas jelaga dan propelan aerosol ramah ozon."]
  ];

  const T2_MIDSTREAM = [
    ["Polietilena Densitas Rendah (LDPE)", "─(CH₂─CH₂)ₙ─", "n C₂H₄ —(Radikal Bebas 220°C, 2000 bar)→ LDPE", "RAW-GAS", 420, "Plastik film kemasan lentur, pelapis karton susu, dan kantong cairan."],
    ["Polietilena Linear (LLDPE)", "─(CH₂─CH₂)ₙ─(C₄H₈)ₘ─", "n C₂H₄ + m C₄H₈ —(Ziegler-Natta Gas Phase)→ LLDPE", "RAW-GAS", 440, "Stretch film palet logistik, geomembran tambak, dan kemasan ulet."],
    ["Polietilena Densitas Tinggi (HDPE)", "─(CH₂─CH₂)ₙ─", "n C₂H₄ —(Katalis Phillips Cr/SiO₂, 105°C, 30 bar)→ HDPE", "RAW-GAS", 460, "Botol deterjen, jerigen kimia, pipa air bertekanan, dan helm proyek."],
    ["Polipropilena Homopolimer (PP)", "─[CH₂─CH(CH₃)]ₙ─", "n C₃H₆ —(Ziegler-Natta TiCl₄/MgCl₂)→ PP Isotaktik", "RAW-GAS", 475, "Karung tenun rafia, perabot rumah tangga, dan wadah makanan microwave."],
    ["Polipropilena Kopolimer Impak (PP-B)", "─(C₃H₆)ₙ─(C₂H₄)ₘ─", "C₃H₆ + C₂H₄ —(Reaktor Kaskade Spheripol)→ PP Block Copolymer", "RAW-GAS", 520, "Bumper mobil, kotak aki kendaraan, dan palet industri tahan banting."],
    ["Polivinil Klorida Suspensi (PVC)", "─(CH₂─CHCl)ₙ─", "n CH₂=CHCl —(Polimerisasi Suspensi Air 55°C)→ PVC Resin", "RAW-MINERAL", 435, "Pipa drainase bangunan, kusen jendela tahan cuaca, dan isolasi kabel."],
    ["Polistirena Umum (GPPS)", "─[CH₂─CH(C₆H₅)]ₙ─", "n C₈H₈ —(Polimerisasi Massa Kontinu 150°C)→ GPPS", "RAW-CRUDE", 465, "Kemasan bening kaku, cawan petri laboratorium, dan kotak optik."],
    ["Polistirena Tahan Benturan (HIPS)", "─(C₈H₈)ₙ─(C₄H₆)ₘ─", "Stirena + Polibutadiena —(Grafting Polymerization)→ HIPS", "RAW-CRUDE", 495, "Casing bagian dalam kulkas, elektronik konsumen, dan mainan."],
    ["Expanded Polystyrene (EPS Styrofoam)", "─[CH₂─CH(C₆H₅)]ₙ─(C₅H₁₂)", "Stirena + Pentana —(Suspensi Pearl)→ EPS Beads", "RAW-CRUDE", 480, "Insulasi termal gedung dingin, kotak pendingin ikan, dan pelindung benturan."],
    ["Polietilena Tereftalat (PET Bottle Grade)", "─(OC-C₆H₄-COO-CH₂CH₂O)ₙ─", "n PTA + n MEG —(Esterifikasi & SSP 280°C)→ PET + 2n H₂O", "RAW-CRUDE", 510, "Botol minuman berkarbonasi, galon jernih, dan serat tekstil poliester."],
    ["Monoetilen Glikol (MEG)", "HO-CH₂CH₂-OH", "C₂H₄O + H₂O —(Hidrasi Termal 190°C)→ C₂H₆O₂", "RAW-GAS", 380, "Bahan baku resin PET dan cairan radiator antibeku (antifreeze) mesin."],
    ["Dietilen Glikol (DEG)", "(HOCH₂CH₂)₂O", "C₂H₄O + HOCH₂CH₂OH → O(CH₂CH₂OH)₂", "RAW-GAS", 360, "Pelarut resin poliester tak jenuh dan plastisizer kertas."],
    ["Asam Tereftalat Murni (PTA)", "C₆H₄(COOH)₂", "p-C₈H₁₀ + 3 O₂ —(Katalis Co-Mn-Br Amoco 200°C)→ PTA + 2 H₂O", "RAW-CRUDE", 450, "Monomer asam dikarboksilat utama untuk industri serat dan botol poliester."],
    ["Akrilonitril (ACN)", "CH₂=CH-CN", "2 C₃H₆ + 2 NH₃ + 3 O₂ —(Ammoksidasi Sohio Bi-Mo)→ 2 C₃H₃N + 6 H₂O", "RAW-GAS", 560, "Prekursor utama serat karbon (PAN), plastik ABS, dan karet NBR."],
    ["Kaprolaktam Kristal", "C₆H₁₁NO", "C₆H₁₀O + NH₂OH → Oksim —(Penataan Ulang Beckmann H₂SO₄)→ Kaprolaktam", "RAW-CRUDE", 610, "Monomer cincin laktam untuk pemintalan benang Nilon-6."],
    ["Asam Adipat", "HOOC(CH₂)₄COOH", "C₆H₁₀O + HNO₃ —(Oksidasi Katalis Cu-V)→ C₆H₁₀O₄", "RAW-CRUDE", 590, "Monomer asam untuk Nilon-6,6 dan poliol sepatu poliuretan."],
    ["Heksametilen Diamina (HMDA)", "H₂N(CH₂)₆NH₂", "Adiponitril + 4 H₂ —(Hidrogenasi Tekanan Tinggi)→ HMDA", "RAW-GAS", 640, "Pasangan reaksi asam adipat untuk membentuk garam Nilon-6,6."],
    ["Bisphenol-A (BPA Polikarbonat Grade)", "(CH₃)₂C(C₆H₄OH)₂", "2 C₆H₅OH + (CH₃)₂CO —(Katalis Resin Asam)→ BPA + H₂O", "RAW-CRUDE", 620, "Blok pembangun utama plastik kaca polikarbonat dan resin epoksi."],
    ["Epiklorohidrin (ECH)", "C₃H₅ClO", "Gliserol + 2 HCl → Diklorohidrin —(NaOH)→ ECH + NaCl", "RAW-BIO", 580, "Bahan baku reaktif utama pembuatan resin epoksi pelapis dan komposit."],
    ["Resin Epoksi Cair (DGEBA)", "C₂₁H₂₄O₄", "BPA + 2 ECH —(Kondensasi NaOH)→ Diglisidil Eter BPA", "RAW-CRUDE", 740, "Perekat struktural industri, lantai pabrik epoksi, dan matriks komposit."],
    ["Toluena Diisosianat (TDI)", "CH₃C₆H₃(NCO)₂", "Toluena Diamina + 2 COCl₂ (Fosgen) → TDI + 4 HCl", "RAW-CRUDE", 710, "Komponen isosianat utama untuk busa poliuretan fleksibel furnitur & jok mobil."],
    ["Metilen Difenil Diisosianat (MDI)", "CH₂(C₆H₄NCO)₂", "MDA + 2 COCl₂ —(Fosgenasi)→ MDI + 4 HCl", "RAW-CRUDE", 730, "Bahan utama busa insulasi kaku kulkas, panel bangunan dingin, dan elastomer."],
    ["Poliol Polieter", "HO-(CH₂CH(CH₃)O)ₙ-H", "Gliserol + n Propilen Oksida —(Katalis KOH/DMC)→ Poliol", "RAW-GAS", 550, "Komponen pasangan TDI/MDI untuk menghasilkan busa poliuretan."],
    ["Metil Metakrilat (MMA)", "CH₂=C(CH₃)COOCH₃", "Aseton + HCN → ACH —(H₂SO₄ + CH₃OH)→ MMA", "RAW-CRUDE", 570, "Monomer kaca akrilik bening (PMMA) dan resin cat eksterior tahan cuaca."],
    ["Polimetil Metakrilat (PMMA / Akrilik)", "─[CH₂-C(CH₃)(COOCH₃)]ₙ─", "n MMA —(Polimerisasi Radikal Casting)→ PMMA Lembaran", "RAW-CRUDE", 690, "Pengganti kaca tahan pecah untuk akuarium besar, lampu mobil, dan papan reklame."],
    ["Akrilonitril Butadiena Stirena (ABS)", "(C₃H₃N)ₓ(C₄H₆)ᵧ(C₈H₈)₂", "ACN + Stirena + Polibutadiena —(Emulsi Grafting)→ ABS Pelet", "RAW-CRUDE", 660, "Plastik teknik mengkilap tahan banting untuk helm, lego, dashboard mobil, dan casing laptop."],
    ["Karet Sintetis Stirena-Butadiena (SBR)", "─(C₄H₆)ₓ─(C₈H₈)ᵧ─", "3 Butadiena + 1 Stirena —(Emulsi Dingin 5°C)→ Karet SBR", "RAW-CRUDE", 590, "Komponen elastomer utama tapak ban mobil penumpang dan sabuk konveyor."],
    ["Karet Polibutadiena (PBR)", "─(CH₂-CH=CH-CH₂)ₙ─", "n C₄H₆ —(Katalis Neodimium/Nikel)→ cis-1,4-Polibutadiena", "RAW-CRUDE", 615, "Karet ketahanan aus tinggi untuk dinding samping ban truk dan bola golf."],
    ["Karet Nitril (NBR Tahan Minyak)", "─(C₄H₆)ₓ─(C₃H₃N)ᵧ─", "Butadiena + Akrilonitril —(Kopolimerisasi Emulsi)→ NBR", "RAW-CRUDE", 680, "Seal hidrolik, selang bahan bakar, dan sarung tangan medis/industri tahan oli."],
    ["Vinil Asetat Monomer (VAM)", "CH₃COOCH=CH₂", "C₂H₄ + CH₃COOH + ½ O₂ —(Katalis Pd-Au)→ VAM + H₂O", "RAW-GAS", 470, "Bahan baku lem putih PVAc, kaca laminasi PVB, dan sol sepatu EVA."],
    ["Etilen Vinil Asetat (EVA Foam Resin)", "─(C₂H₄)ₓ─(C₄H₆O₂)ᵧ─", "C₂H₄ + VAM —(Autoklaf Tekanan Tinggi)→ EVA", "RAW-GAS", 540, "Enkapsulan sel panel surya, midsole sepatu lari empuk, dan perekat hot-melt."],
    ["Polivinil Alkohol (PVOH)", "─(CH₂-CHOH)ₙ─", "Polivinil Asetat + CH₃OH —(Alkoholisis NaOH)→ PVOH", "RAW-GAS", 610, "Pengemulsi polimerisasi, pelapis kertas, dan plastik larut air ramah lingkungan."],
    ["Asam Akrilat Glasial", "CH₂=CH-COOH", "C₃H₆ + 1,5 O₂ —(Oksidasi 2-Tahap Mo-V)→ CH₂=CHCOOH + H₂O", "RAW-GAS", 510, "Monomer utama polimer penyerap super (SAP) dan dispersi cat akrilik."],
    ["Butil Akrilat", "CH₂=CH-COOC₄H₉", "Asam Akrilat + n-Butanol —(Esterifikasi Asam)→ Butil Akrilat + H₂O", "RAW-GAS", 545, "Bahan utama lakban perekat (pressure-sensitive adhesive) dan cat dinding elastis."],
    ["Superabsorbent Polymer (SAP)", "─[CH₂-CH(COONa)]ₙ─", "Asam Akrilat + NaOH + Crosslinker —(Polimerisasi Gel)→ SAP", "RAW-GAS", 670, "Hidrogel mampu menyerap cairan 300x bobotnya untuk popok medis dan pertanian lahan kering."],
    ["Polikarbonat Optik (PC Resin)", "─[O-C₆H₄-C(CH₃)₂-C₆H₄-OCO]ₙ─", "BPA + Difenil Karbonat —(Transesterifikasi Leleh Vakum)→ PC", "RAW-CRUDE", 790, "Plastik rekayasa transparan ultra-kuat untuk tameng antihuru-hara, atap kanopi, dan lensa."],
    ["Polioksimetilena (POM / Asetal)", "─(CH₂─O)ₙ─", "3 CH₂O → Trioksan —(Polimerisasi Kationik BF₃)→ POM", "RAW-GAS", 720, "Plastik rekayasa gesekan rendah pengganti logam untuk roda gigi presisi dan ritsleting."],
    ["Polibutilena Tereftalat (PBT)", "─(OC-C₆H₄-COO-(CH₂)₄O)ₙ─", "PTA + 1,4-Butanadiol —(Polikondensasi Katalis Ti)→ PBT", "RAW-CRUDE", 710, "Konektor soket listrik otomotif, tombol keyboard mekanik, dan rumah relay tahan panas."],
    ["1,4-Butanadiol (BDO)", "HO-(CH₂)₄-OH", "C₂H₂ + 2 CH₂O —(Proses Reppe Cu)→ Butinediol —(H₂)→ BDO", "RAW-GAS", 560, "Prekursor serat elastis Spandex (PTMEG), plastik PBT, dan pelarut THF."],
    ["Tetrahidrofuran (THF)", "C₄H₈O", "HO(CH₂)₄OH —(Dehidrasi Katalis Asam)→ C₄H₈O + H₂O", "RAW-GAS", 590, "Pelarut pipa PVC dan bahan baku politetrametilen eter glikol (Spandex)."],
    ["Ftalat Anhidrida (PA)", "C₆H₄(CO)₂O", "o-C₈H₁₀ + 3 O₂ —(Katalis V₂O₅-TiO₂ 380°C)→ PA + 3 H₂O", "RAW-CRUDE", 490, "Bahan baku resin alkid cat kayu/besi, resin poliester kapal, dan plasticizer."],
    ["Maleat Anhidrida (MA)", "C₄H₂O₃", "C₄H₁₀ (n-Butana) + 3,5 O₂ —(Katalis VPO 400°C)→ C₄H₂O₃ + 4 H₂O", "RAW-GAS", 520, "Kopolimer resin fiberglass, aditif pelumas mesin, dan bahan kimia pertanian."],
    ["Resin Poliester Tak Jenuh (UPR)", "Poliester-Stirena", "Maleat Anhidrida + Propilen Glikol + Stirena → UPR", "RAW-CRUDE", 580, "Resin matriks fiberglass (FRP) untuk lambung kapal cepat, tangki kimia, dan kubah."],
    ["Melamin Kristal", "C₃H₆N₆", "6 CO(NH₂)₂ —(390°C, Katalis Alumina)→ C₃H₆N₆ + 6 NH₃ + 3 CO₂", "RAW-GAS", 530, "Peralatan makan tahan panas, laminasi HPL furnitur, dan penghambat nyala api."],
    ["Silika Berasap (Fumed Silica)", "SiO₂(nano)", "SiCl₄ + 2 H₂ + O₂ —(Hidrolisis Nyala 1100°C)→ SiO₂ + 4 HCl", "RAW-MINERAL", 650, "Pengental tiksotropik cat, penguat karet silikon, dan poles wafer semikonduktor."],
    ["Dimetilsiloksan Siklik (Silicone Monomer)", "[(CH₃)₂SiO]₄", "Si + 2 CH₃Cl —(Proses Rochow Cu)→ (CH₃)₂SiCl₂ —(H₂O)→ Siloksan", "RAW-MINERAL", 720, "Bahan dasar pembuatan minyak silikon, sealant kaca gedung, dan karet silikon medis."],
    ["Natrium Silikat (Waterglass)", "Na₂SiO₃", "SiO₂ (Pasir Kuarsa) + Na₂CO₃ —(Tungku Leleh 1300°C)→ Na₂SiO₃ + CO₂", "RAW-MINERAL", 290, "Prekursor silika ban hemat BBM (green tire), katalis zeolit, dan pengikat pengecoran."],
    ["Alkilbenzena Linear (LAB)", "C₆H₅-C₁₂H₂₅", "C₆H₆ + Parafin C₁₀–C₁₃ —(Dehidrogenasi Pacol & Detal)→ LAB", "RAW-CRUDE", 540, "Bahan baku utama surfaktan deterjen ramah lingkungan (LAS) seluruh dunia."],
    ["Gliserol Murni USP 99,7%", "C₃H₅(OH)₃", "Trigliserida Sawit + 3 CH₃OH —(Transesterifikasi)→ Biodiesel + Gliserol", "RAW-BIO", 410, "Humektan farmasi, kosmetik, pasta gigi, dan bahan baku epiklorohidrin hijau."],
    ["Asam Lemak Distilasi & Metil Ester (FAME)", "R-COOCH₃", "Minyak Nabati + CH₃OH —(Katalis NaOCH₃)→ FAME", "RAW-BIO", 390, "Bahan bakar biodiesel rendah emisi dan prekursor alkohol lemak surfaktan."],
    // +25 PRODUK MIDSTREAM BARU (51..75)
    ["Poliamida-6 (Nilon-6 Tekstil & Engineering)", "─[NH-(CH₂)₅-CO]ₙ─", "n Kaprolaktam + H₂O —(Polimerisasi Pembukaan Cincin 250°C)→ PA6", "RAW-CRUDE", 760, "Serat karpet, jaring ikan laut dalam, tali panjat, dan komponen mesin."],
    ["Polivinil Butiral (PVB Film Laminasi)", "─(C₈H₁₄O₂)ₙ─", "PVOH + Butiraldehida —(Kondensasi Asam)→ Resin PVB", "RAW-GAS", 810, "Lapisan tengah kaca depan mobil dan gedung pencakar langit agar tidak berhamburan saat pecah."],
    ["Politetrametilen Eter Glikol (PTMEG)", "HO─[(CH₂)₄O]ₙ─H", "n THF —(Polimerisasi Kationik Heteropoli)→ PTMEG", "RAW-GAS", 850, "Segmen lunak utama pembuat serat elastis Spandex/Lycra pakaian olahraga."],
    ["Stirena Akrilonitril (SAN Resin)", "─(C₈H₈)ₓ─(C₃H₃N)ᵧ─", "Stirena + Akrilonitril —(Kopolimerisasi Kontinu)→ SAN", "RAW-CRUDE", 610, "Plastik bening tahan gores dan tahan deterjen untuk gelas blender, pemantik api, dan filter air."],
    ["Karet Etilena Propilena Diena (EPDM)", "─(C₂H₄)ₓ─(C₃H₆)ᵧ─(ENB)₂─", "Etilena + Propilena + ENB —(Katalis Vanadium/Metallocene)→ EPDM", "RAW-GAS", 740, "Karet lis pintu mobil, membran atap bangunan tahan cuaca 30 tahun, dan selang radiator."],
    ["Karet Butil Terhalogenasi (BIIR / CIIR)", "─[CH₂-C(CH₃)₂]ₓ─(C₅H₇Br)ᵧ─", "Isobutilena + Isoprena + Br₂ → Bromobutyl Rubber", "RAW-GAS", 820, "Lapisan dalam (innerliner) ban tubeless kedap udara dan tutup botol vial suntik vaksin."],
    ["Karet Kloroprena (Neoprene CR)", "─(CH₂-CCl=CH-CH₂)ₙ─", "Butadiena + Cl₂ → Kloroprena —(Polimerisasi Emulsi)→ Neoprene", "RAW-MINERAL", 790, "Pakaian selam wetsuit, sabuk V-belt mesin, bantalan jembatan tahan ozon, dan lem kontak."],
    ["Poliuretan Termoplastik (TPU Elastomer)", "─(MDI-BDO)ₓ─(Poliol)ᵧ─", "MDI + Poliol + 1,4-BDO —(Ekstrusi Reaktif)→ TPU Pelet", "RAW-CRUDE", 840, "Casing pelindung ponsel lentur, roda skateboard, sol sepatu bola, dan selang pneumatik."],
    ["Resin Fenol-Formaldehida (Novolac / Resol)", "─(C₆H₃(OH)-CH₂)ₙ─", "Fenol + Formaldehida —(Kondensasi Asam/Basa)→ Resin Fenolik", "RAW-CRUDE", 560, "Pengikat kampas rem otomotif, papan sirkuit PCB, wol kaca insulasi, dan batu gerinda."],
    ["Resin Urea-Formaldehida (UF Perekat Kayu)", "─(NH-CO-NH-CH₂)ₙ─", "Urea + Formaldehida —(Polikondensasi pH Terkendali)→ Resin UF", "RAW-GAS", 430, "Perekat utama industri kayu lapis (plywood), papan partikel MDF, dan furnitur."],
    ["Resin Alkid Pelapis (Alkyd Paint Resin)", "Poliester Modifikasi Asam Lemak", "Ftalat Anhidrida + Gliserol + Minyak Nabati —(240°C)→ Resin Alkid", "RAW-BIO", 540, "Pengikat utama cat minyak besi dan kayu serta pelapis anti-karat struktural."],
    ["Dioktil Tereftalat (DOTP Non-Phthalate Plasticizer)", "C₆H₄(COOC₈H₁₇)₂", "PTA + 2 (2-Etilheksanol) —(Esterifikasi Katalis Ti)→ DOTP + 2 H₂O", "RAW-CRUDE", 650, "Pemlastis PVC ramah kesehatan bebas orto-ftalat untuk kabel, lantai vinil, dan mainan."],
    ["Monopropilen Glikol (MPG USP Grade)", "CH₃CH(OH)CH₂OH", "Propilen Oksida + H₂O —(Hidrasi Non-Katalitik 190°C)→ MPG", "RAW-GAS", 590, "Pelarut perisa makanan, cairan pelembap obat/kosmetik, dan antibeku ramah lingkungan."],
    ["Dipropilen Glikol (DPG Fragrance Grade)", "(C₃H₆OH)₂O", "Propilen Oksida + MPG → Campuran Isomer DPG", "RAW-GAS", 630, "Pelarut pembawa parfum mewah dan cairan mesin kabut panggung."],
    ["Etilen Diamina (EDA)", "H₂N-CH₂CH₂-NH₂", "EDC + 2 NH₃ —(Tekanan Tinggi)→ EDA + 2 HCl", "RAW-GAS", 660, "Bahan baku agen khelasi EDTA, pengeras resin epoksi, dan fungisida pertanian."],
    ["Monoetanolamina (MEA Carbon Capture Solvent)", "HO-CH₂CH₂-NH₂", "C₂H₄O + NH₃ —(Reaksi Fase Cair)→ MEA", "RAW-GAS", 580, "Pelarut penyerap gas asam CO₂ dan H₂S standar pada unit Scrubber kilang dan pembangkit."],
    ["Dietanolamina (DEA) & Trietanolamina (TEA)", "(HOCH₂CH₂)₂NH / (HOCH₂CH₂)₃N", "2/3 C₂H₄O + NH₃ → DEA & TEA", "RAW-GAS", 610, "Pengemulsi krim kosmetik, aditif penggilingan semen, dan inhibitor korosi logam."],
    ["Anilina Murni", "C₆H₅NH₂", "C₆H₆ + HNO₃ → C₆H₅NO₂ —(Hidrogenasi Cu 270°C)→ C₆H₅NH₂", "RAW-CRUDE", 640, "Prekursor utama MDI poliuretan, pewarna tekstil indigo jeans, dan akselerator karet."],
    ["Nitrobenzena", "C₆H₅NO₂", "C₆H₆ + HNO₃ —(H₂SO₄ Pekat Adiabatik)→ C₆H₅NO₂ + H₂O", "RAW-CRUDE", 510, "Intermediet langsung produksi anilina dan bahan kimia halus aromatik."],
    ["Klorobenzena & Diklorobenzena", "C₆H₅Cl / C₆H₄Cl₂", "C₆H₆ + Cl₂ —(Katalis FeCl₃)→ C₆H₅Cl + p-C₆H₄Cl₂", "RAW-MINERAL", 570, "Monomer polimer rekayasa PPS, pelarut reaksi diisocyanates, dan pigmen warna."],
    ["Pentaeritritol Kristal", "C(CH₂OH)₄", "CH₃CHO + 4 CH₂O + NaOH —(Reaksi Cannizzaro)→ C(CH₂OH)₄", "RAW-GAS", 690, "Poliol bercabang empat untuk pelapis alkid kilap tinggi, pelumas turbin jet, dan bahan peledak."],
    ["Trimetilolpropana (TMP)", "C₂H₅C(CH₂OH)₃", "Butiraldehida + 3 CH₂O + NaOH → TMP", "RAW-GAS", 710, "Pengikat silang cat poliuretan otomotif dan pelumas ester sintetis tahan panas."],
    ["Asam Sitrat Anhidrat & Natrium Sitrat", "Na₃C₆H₅O₇", "Asam Sitrat + 3 NaOH —(Netralisasi & Kristalisasi)→ Natrium Sitrat", "RAW-BIO", 530, "Pembangun deterjen bebas fosfat, antikoagulan kantong transfusi darah, dan penyangga pH."],
    ["Karboksimetil Selulosa (CMC Food/Oil Grade)", "Selulosa-OCH₂COONa", "Selulosa Kayu + NaOH + Asam Monokloroasetat → CMC", "RAW-BIO", 670, "Pengental lumpur pengeboran minyak bumi, penstabil es krim, dan pengikat pasta baterai."],
    ["Poliasam Laktat (PLA Bio-Plastik)", "─[O-CH(CH₃)-CO]ₙ─", "Asam Laktat → Laktida —(Polimerisasi Pembukaan Cincin Sn)→ PLA", "RAW-BIO", 780, "Plastik ramah lingkungan berbasis pati jagung/singkong untuk kemasan kompos dan filamen 3D print."]
  ];

  const T3_SPECIALTY = [
    ["Nilon-6,6 Rekayasa (PA66)", "─[NH(CH₂)₆NHCO(CH₂)₄CO]ₙ─", "n Asam Adipat + n HMDA —(Polikondensasi 275°C)→ PA66 + 2n H₂O", "RAW-CRUDE", 3200, "Polimer rekayasa tahan panas untuk intake manifold mesin mobil dan roda gigi beban berat."],
    ["Politetrafluoroetilena (PTFE / Teflon)", "─(CF₂─CF₂)ₙ─", "CHClF₂ —(Pirolisis 700°C)→ C₂F₄ —(Polimerisasi Radikal)→ PTFE", "RAW-MINERAL", 4600, "Material koefisien gesek terendah dan tahan asam paling ekstrem untuk katup reaktor & semikonduktor."],
    ["Serat Karbon (Carbon Fiber PAN T800)", "C(sp² Turbomorfik >95%)", "Serat PAN —(Oksidasi 250°C & Karbonisasi N₂ 1400°C)→ Carbon Fiber", "RAW-GAS", 5400, "Serat penguat komposit dengan kekuatan tarik 5x baja dan bobot ultra-ringan untuk pesawat & F1."],
    ["Serat Aramid (Para-Aramid / Kevlar)", "─(NH-C₆H₄-NH-CO-C₆H₄-CO)ₙ─", "p-Fenilendiamina + Tereftaloil Klorida —(Pelarut NMP/CaCl₂)→ Aramid", "RAW-CRUDE", 5800, "Serat penahan peluru berenergi kinetik tinggi, kabel optik bawah laut, dan pelindung panas."],
    ["Polieter Eter Keton (PEEK Dirgantara)", "─(O-C₆H₄-O-C₆H₄-CO-C₆H₄)ₙ─", "4,4'-Difluorobenzofenon + Hidrokuinon —(300°C)→ PEEK", "RAW-CRUDE", 6800, "Termoplastik kasta tertinggi tahan suhu 260°C dan radiasi untuk implan tulang & komponen jet."],
    ["Poliimida Tahan Suhu Ekstrem (Kapton)", "─(C₂₂H₁₀N₂O₅)ₙ─", "PMDA + ODA —(Polimerisasi Imidisasi Termal 350°C)→ Poliimida", "RAW-CRUDE", 6200, "Sirkuit cetak fleksibel (FPC) smartphone dan selimut isolasi termal keemasan satelit."],
    ["Polivinilidena Fluorida (PVDF Battery Binder)", "─(CH₂─CF₂)ₙ─", "n CH₂=CF₂ —(Polimerisasi Emulsi Tekanan Tinggi)→ PVDF", "RAW-MINERAL", 4900, "Pengikat elektroda baterai mobil listrik (EV) dan membran filtrasi air ultra-murni."],
    ["Serbuk Katoda Baterai LiFePO4 (LFP)", "LiFePO₄/C", "Li₂CO₃ + FePO₄ + Glukosa —(Kalsinasi Argon 750°C)→ LiFePO₄", "RAW-METAL", 4800, "Material katoda baterai kendaraan listrik dan penyimpanan energi grid berumur panjang."],
    ["Serbuk Katoda Baterai NMC-811", "LiNi₀,₈Mn₀,₁Co₀,₁O₂", "Ni₀,₈Mn₀,₁Co₀,₁(OH)₂ + LiOH —(Sintering O₂ 780°C)→ NMC-811", "RAW-METAL", 6500, "Katoda densitas energi tinggi untuk kendaraan listrik jarak jauh (>600 km)."],
    ["Elektrolit Baterai Litium Heksafluorofosfat", "LiPF₆ dalam EC/DMC", "LiF + PCl₅ + 5 HF —(Pelarut Anhidrat -20°C)→ LiPF₆ + 5 HCl", "RAW-METAL", 5200, "Garam elektrolit konduktivitas ionik tinggi untuk seluruh sel baterai lithium-ion."],
    ["Polisilikon Kemurnian Surya 9N", "Si (99,9999999%)", "SiHCl₃ + H₂ —(Reaktor CVD Siemens 1100°C)→ Si(9N) + 3 HCl", "RAW-MINERAL", 4400, "Bahan baku ingot silikon kristalin untuk sel fotovoltaik pembangkit listrik tenaga surya."],
    ["Polisilikon Semikonduktor 11N", "Si (99,999999999%)", "SiH₄ —(Pirolisis Czochralski Ultra-Clean)→ Monokristal Si(11N)", "RAW-MINERAL", 7800, "Kristal tunggal bebas cacat untuk pemotongan wafer mikroprosesor komputer."],
    ["Katalis Zeolit ZSM-5 / FCC", "NaₙAlₙSi₉₆₋ₙO₁₉₂·16H₂O", "Natrium Silikat + Alumina + TPABr —(Hidrotermal 180°C)→ Zeolit", "RAW-MINERAL", 3600, "Katalis pori molekuler untuk perengkahan minyak berat menjadi bensin oktan tinggi & olefin."],
    ["Katalis Platina-Paladium Alumina", "Pt-Pd / γ-Al₂O₃", "H₂PtCl₆ + PdCl₂ + Al₂O₃ —(Impregnasi & Reduksi H₂)→ Katalis Mulia", "RAW-METAL", 7400, "Inti reaktor reforming kilang dan konverter katalitik knalpot penekan emisi kendaraan."],
    ["Katalis Ziegler-Natta Generasi Ke-5", "TiCl₄ / MgCl₂ / Phthalate", "MgCl₂ + TiCl₄ + Donor Elektron Internal → Katalis Polimerisasi", "RAW-METAL", 5100, "Katalis stereospesifik aktivitas tinggi untuk produksi polipropilena dan HDPE modern."],
    ["Elastomer Fluorokarbon (Viton FKM)", "─(CF₂-CH₂)ₓ─(CF₂-CF(CF₃))ᵧ─", "VDF + HFP —(Kopolimerisasi Tekanan Tinggi)→ Fluoroelastomer", "RAW-MINERAL", 5600, "O-ring dan gasket mesin pesawat terbang yang tahan bahan bakar avtur pada suhu 250°C."],
    ["Karet Silikon Cair Medis (LSR)", "─[Si(CH₃)₂─O]ₙ─", "Siloksan Vinil + Crosslinker Si-H —(Katalis Platina)→ LSR", "RAW-MINERAL", 4100, "Kateter medis biokompatibel, segel pompa jantung, dan optik LED daya tinggi."],
    ["Aerogel Silika Isolator Nano", "SiO₂ (Porositas 99%)", "TEOS —(Sol-Gel & Pengeringan CO₂ Superkritis)→ Silica Aerogel", "RAW-MINERAL", 6100, "Padatan paling ringan dan isolator termal terbaik di dunia untuk pipa LNG dan pakaian antariksa."],
    ["Cairan Pendingin Dielektrik Fluorinert", "C₈F₁₈ (Perfluoroalkana)", "Oktana + CoF₃ —(Fluorinasi Elektrokimia Simons)→ C₈F₁₈", "RAW-MINERAL", 5900, "Cairan perendam server superkomputer AI (immersion cooling) yang tidak menghantarkan listrik."],
    ["Pelumas Sintetis Polialfaolefin (PAO-10)", "C₃₀H₆₂ (Trimer 1-Desena)", "3 C₁₀H₂₀ —(Oligomerisasi BF₃ & Hidrogenasi)→ PAO", "RAW-CRUDE", 3100, "Minyak dasar oli mesin full-synthetic performa tinggi dan gearbox turbin angin lepas pantai."],
    ["Surfaktan Alkohol Etoksilat (AEO-9)", "RO-(CH₂CH₂O)₉-H", "Alkohol Lemak C₁₂ + 9 Etilen Oksida —(Katalis KOH)→ AEO-9", "RAW-BIO", 2200, "Surfaktan non-ionik biodegradabel utama untuk cairan pembersih industri dan tekstil."],
    ["Pupuk Majemuk NPK Granul Controlled-Release", "N-P₂O₅-K₂O + Polymer Coat", "NH₃ + H₃PO₄ + KCl —(Granulator Drum & Coating)→ NPK", "RAW-MINERAL", 1800, "Pupuk presisi pelepasan lambat untuk meningkatkan hasil panen pangan hingga 40%."],
    ["Herbisida Isopropilamina Glifosat", "C₃H₈NO₅P·C₃H₉N", "IDA + CH₂O + PCl₃ → Glifosat —(IPA)→ Garam Glifosat", "RAW-MINERAL", 2600, "Agrokimia pengendali gulma sistemik berspektrum luas untuk perkebunan skala besar."],
    ["Insektisida Piretroid Sintetis (Deltametrin)", "C₂₂H₁₉Br₂NO₃", "Asam Krisantemat Dibromo + Siano-Fenoksibenzil Alkohol → Deltametrin", "RAW-BIO", 3900, "Perlindungan tanaman pangan dosis mikro terhadap hama penggerek dengan residu rendah."],
    ["Bahan Aktif Farmasi Parasetamol (API)", "CH₃CONHC₆H₄OH", "p-Aminofenol + (CH₃CO)₂O —(Asetilasi & Rekristalisasi)→ Parasetamol", "RAW-BIO", 3400, "Bahan baku obat analgesik dan antipiretik standar farmakope dunia."],
    ["Bahan Aktif Asam Asetilsalisilat (Aspirin API)", "C₉H₈O₄", "Asam Salisilat + Anhidrida Asetat —(H₃PO₄, 85°C)→ Aspirin + CH₃COOH", "RAW-BIO", 3300, "API farmasi untuk analgesik, anti-inflamasi, dan pengencer darah kardiovaskular."],
    ["Bahan Aktif Amoksisilin Trihidrat", "C₁₆H₁₉N₃O₅S·3H₂O", "6-APA + Hidroksifenilglisin —(Asilasi Enzimatik)→ Amoksisilin", "RAW-BIO", 5300, "Antibiotik beta-laktam spektrum luas esensial untuk fasilitas kesehatan global."],
    ["Penisilin-G Kalium Fermentasi", "C₁₆H₁₇KN₂O₄S", "Glukosa + Fenilasetat —(Bioreaktor Penicillium chrysogenum)→ Penisilin-G", "RAW-BIO", 4700, "Prekursor antibiotik hasil bio-proses fermentasi steril berskala industri."],
    ["Asam Askobat (Vitamin C Kristal USP)", "C₆H₈O₆", "D-Sorbitol —(Fermentasi 2-Tahap & Laktonisasi)→ L-Asam Askorbat", "RAW-BIO", 2900, "Antioksidan farmasi, suplemen imunitas, dan pengawet alami industri makanan."],
    ["Asam Sitrat Monohidrat Food-Grade", "C₆H₈O₇·H₂O", "Molase Tebu —(Fermentasi Aspergillus niger & Pertukaran Ion)→ Asam Sitrat", "RAW-BIO", 2100, "Pengatur keasaman minuman global, khelasi logam pembersih pipa, dan kosmetik."],
    ["Hidrogen Peroksida Grade Semikonduktor (UP-H2O2)", "H₂O₂ (Logam < 10 ppt)", "H₂O₂ —(Distilasi Vakum & Membran Sub-ppt)→ Ultra-Pure H₂O₂", "RAW-GAS", 4800, "Cairan etsa dan pembersih wafer silikon proses RCA di pabrik pembuatan microchip."],
    ["Asam Fluorida Elektronik (EL-HF)", "HF (99,999%)", "CaF₂ + H₂SO₄ → 2 HF —(Distilasi PFA)→ Ultra-Pure HF", "RAW-MINERAL", 5100, "Reagen kritis pengikisan lapisan silikon oksida pada fabrikasi chip nanometer."],
    ["Gas Silana Elektronik (SiH4)", "SiH₄ (6N Purity)", "4 SiHCl₃ —(Disproporsionasi Katalitik)→ SiH₄ + 3 SiCl₄", "RAW-MINERAL", 6300, "Gas deposisi uap kimia (PECVD) untuk menumbuhkan lapisan tipis silikon pada layar OLED & chip."],
    ["Gas Nitrogen Trifluorida (NF3)", "NF₃", "NH₃ + 3 F₂ —(Reaktor Leleh NH₄HF₂)→ NF₃ + 3 HF", "RAW-MINERAL", 6600, "Gas pembersih plasma ruang vakum fabrikasi semikonduktor dan panel LCD."],
    ["Fotoresis Litografi ArF (Photoresist Polymer)", "Polimer Akrilat-Adamantil + PAG", "Monomer Sikloolefin + Photoacid Generator —(Sintesis Cleanroom)→ Photoresist", "RAW-CRUDE", 8900, "Cairan peka cahaya UV dalam untuk mencetak pola transistor miliaran chip prosesor."],
    ["Resin Penukar Ion Kemurnian Nuklir", "Polistirena-DVB Sulfonat/Amina", "Stirena + Divinilbenzena —(Sulfonasi/Klorometilasi)→ Resin Ion", "RAW-CRUDE", 3800, "Pemurnian air umpan boiler pembangkit listrik dan dekontaminasi air pendingin reaktor nuklir."],
    ["Membran Poliamida Reverse Osmosis (TFC)", "Poliamida Aromatik Crosslinked", "MPD + TMC —(Polimerisasi Antarmuka pada Polisulfon)→ Membran TFC", "RAW-CRUDE", 5500, "Lembaran membran semipermeabel untuk menyaring garam air laut menjadi air tawar minum."],
    ["Serat Poliakrilonitril Prekursor (PAN Fiber)", "─(CH₂─CH(CN))ₙ─", "96% ACN + 4% Itakonat —(Wet Spinning DMSO)→ Prekursor PAN", "RAW-GAS", 3700, "Benang sintetis khusus berorientasi molekul tinggi sebagai bahan baku tunggal Serat Karbon."],
    ["Polisulfon Medis (PSU)", "─(C₆H₄-SO₂-C₆H₄-O-BPA)ₙ─", "BPA + Diklorodifenil Sulfon —(K₂CO₃/NMP 180°C)→ PSU", "RAW-CRUDE", 4950, "Polimer tahan sterilisasi uap berulang untuk membran mesin cuci darah (hemodialisis)."],
    ["Polieterimida (PEI / Ultem)", "─(C₃₇H₂₄O₆N₂)ₙ─", "BPA-Dianhidrida + m-Fenilendiamina —(Imidisasi Leleh)→ PEI", "RAW-CRUDE", 5700, "Plastik tahan api alami tanpa asap beracun untuk interior kabin pesawat penumpang komersial."],
    ["Polifenilen Sulfida (PPS)", "─(C₆H₄─S)ₙ─", "p-Diklorobenzena + Na₂S —(NMP 250°C, 15 bar)→ PPS + 2 NaCl", "RAW-MINERAL", 4750, "Polimer tahan korosi kimia dan panas untuk filter baghouse pembangkit batu bara & pompa EV."],
    ["Liquid Crystal Polymer (LCP 5G Grade)", "─(CO-C₆H₄-O)ₓ─(CO-C₁₀H₆-O)ᵧ─", "HBA + HNA —(Asetilasi & Polikondensasi Leleh)→ LCP", "RAW-CRUDE", 6900, "Polimer dielektrik kehilangan sinyal sangat rendah untuk antena gelombang milimeter 5G/6G."],
    ["Karbon Nanotube Multi-Dinding (MWCNT)", "C(sp² Silinder Nano)", "C₂H₄ —(CVD Katalitik Fe-Co-Al₂O₃ 700°C)→ Carbon Nanotube", "RAW-GAS", 8200, "Aditif konduktif nano untuk meningkatkan laju pengisian cepat elektroda baterai EV."],
    ["Grafena Oksida Tereduksi (rGO)", "C(sp² Lembaran Monolayer)", "Grafit —(Eksfoliasi Elektrokimia & Reduksi Termal)→ Graphene", "RAW-MINERAL", 8600, "Material dua dimensi konduktor panas/listrik superior untuk sensor, pelapis anti-korosi, dan superkapasitor."],
    ["Paduan Titanium Grade-5 (Ti-6Al-4V Ingot)", "Ti₉₀Al₆V₄", "Spons Ti + Al + V —(Vacuum Arc Remelting 1700°C)→ Ti-6Al-4V", "RAW-METAL", 6400, "Logam ringan kekuatan tinggi tahan korosi untuk rangka pesawat tempur dan implan medis."],
    ["Superalloy Berbasis Nikel (Inconel 718)", "Ni₅₃Cr₁₉Fe₁₈Nb₅Mo₃", "Ni + Cr + Nb + Mo —(Vacuum Induction Melting)→ Inconel 718", "RAW-METAL", 7600, "Logam tahan rangkak (creep) pada suhu merah membara 700°C+ untuk ruang bakar jet dan roket."],
    ["Keramik Silikon Karbida Sinter (SiC)", "SiC (α-Hexagonal)", "SiO₂ + 3 C —(Tungku Acheson 2200°C)→ SiC + 2 CO", "RAW-MINERAL", 4500, "Keramik ultra-keras untuk semikonduktor daya EV tegangan tinggi, pelindung balistik, dan rem."],
    ["Zirkonia Terstabilisasi Yttria (YSZ Thermal Coat)", "ZrO₂ · 8% Y₂O₃", "ZrOCl₂ + YCl₃ —(Kopresipitasi & Kalsinasi Plasma)→ Serbuk YSZ", "RAW-METAL", 5800, "Serbuk keramik Thermal Barrier Coating (TBC) pelindung logam turbin dari gas panas 1400°C."],
    ["Propelan Padat Amonium Perklorat (AP)", "NH₄ClO₄ (Mikronisasi Bola)", "NaClO₄ + NH₄Cl —(Kristalisasi Terkendali)→ NH₄ClO₄ + NaCl", "RAW-MINERAL", 5900, "Oksidator padat berenergi tinggi untuk pendorong roket peluncur satelit orbital."],
    ["Hidrazin Anhidrat (Bahan Bakar Satelit)", "N₂H₄", "2 NH₃ + NaOCl —(Proses Raschig / Ketazin)→ N₂H₄ + NaCl + H₂O", "RAW-GAS", 5300, "Propelan monopropelan hipergolik untuk pendorong koreksi orbit satelit dan wahana antariksa."],
    // +25 PRODUK KHUSUS BARU (51..75)
    ["Membran Pertukaran Proton Nafion (PFSA)", "Kopolimer TFE-Perfluorovinil Eter Sulfonat", "C₂F₄ + PSVE —(Kopolimerisasi & Hidrolisis Asam)→ Membran PFSA", "RAW-MINERAL", 7900, "Membran elektrolit padat inti sel bahan bakar hidrogen (Fuel Cell) dan elektroliser klor-alkali."],
    ["Polietilena Berat Molekul Ultra-Tinggi (UHMWPE / Dyneema)", "─(CH₂─CH₂)ₙ─ (Mw > 5×10⁶)", "n C₂H₄ —(Katalis Ziegler Gel-Spinning)→ Serat UHMWPE", "RAW-GAS", 5900, "Serat polimer terkuat di dunia (15x kekuatan baja) yang mengapung di air untuk rompi antipeluru & tambat kapal."],
    ["Perfluoroalkoksi Alkana (PFA Ultra-Pure Resin)", "─(CF₂-CF₂)ₓ─(CF₂-CF(OR_f))ᵧ─", "C₂F₄ + Perfluoropropil Vinil Eter —(Polimerisasi Air)→ PFA", "RAW-MINERAL", 6700, "Fluoropolimer yang dapat dicetak leleh untuk pipa dan bejana asam semikonduktor."],
    ["Serat Meta-Aramid Tahan Api (Nomex)", "─(NH-m-C₆H₄-NH-CO-m-C₆H₄-CO)ₙ─", "m-Fenilendiamina + Isoftaloil Klorida —(Dry Spinning)→ Nomex", "RAW-CRUDE", 5300, "Kain pakaian pemadam kebakaran, baju balap F1, dan honeycomb struktur pesawat."],
    ["Polibenzimidazol (PBI Extreme Heat Fiber)", "─(C₂₀H₁₂N₄)ₙ─", "Diaminobenzidina + Difenil Isoftalat —(Polikondensasi 400°C)→ PBI", "RAW-CRUDE", 8400, "Serat organik yang tidak terbakar bahkan pada suhu 600°C untuk sarung tangan astronot dan pemadam."],
    ["Grafit Sintetis Anoda Baterai (Spherical Graphite)", "C(Kristal Heksagonal 99,95%)", "Kokas Jarum —(Mikronisasi Bola & Grafitisasi Acheson 3000°C)→ Anoda Grafit", "RAW-CRUDE", 4200, "Material anoda standar penyimpan ion litium pada seluruh baterai kendaraan listrik."],
    ["Komposit Anoda Silikon-Karbon (Si-C Battery Anode)", "Nano-Si / Matriks Karbon Pori", "SiH₄ —(CVD pada Kerangka Karbon Berpori)→ Anoda Si-C", "RAW-MINERAL", 7100, "Anoda baterai generasi baru dengan kapasitas simpan muatan 3x lebih besar dari grafit murni."],
    ["Litium Hidroksida Monohidrat Battery-Grade", "LiOH·H₂O (99,95%)", "Spodumene / Li₂CO₃ + Ca(OH)₂ —(Kalsinasi & Kristalisasi Vakum)→ LiOH·H₂O", "RAW-METAL", 5400, "Sumber litium wajib untuk sintesis katoda nikel tinggi NMC-811 dan NCA."],
    ["Elektrolit Padat Sulfida (Argyrodite Li6PS5Cl)", "Li₆PS₅Cl", "3 Li₂S + P₂S₅ + LiCl —(Milling Energi Tinggi & Annealing Argon)→ Li₆PS₅Cl", "RAW-METAL", 8800, "Konduktor ion padat inti baterai Solid-State masa depan pengganti elektrolit cair mudah terbakar."],
    ["Katalis Kobalt-Molibdenum Hydrotreating", "CoO-MoO₃ / γ-Al₂O₃", "Garam Co + Amonium Heptamolibdat + Alumina —(Kalsinasi)→ Katalis HDS", "RAW-METAL", 4300, "Katalis wajib di seluruh kilang minyak dunia untuk memproduksi solar dan bensin rendah sulfur (Euro 6)."],
    ["Katalis Besi-Kalium Sintesis Amonia & Fischer-Tropsch", "Fe₃O₄-K₂O-Al₂O₃", "Magnetit Murni + Promotor Kalium —(Peleburan Busur 1600°C)→ Katalis Fe", "RAW-METAL", 3850, "Katalis industri berat pengubah gas sintesis menjadi amonia pupuk dan bahan bakar cair sintetis."],
    ["Bubur Poles Semikonduktor (CMP Slurry Nano-Ceria)", "CeO₂ / SiO₂ Koloid + Aditif", "Serium Nitrat —(Presipitasi Hidrotermal & Dispersi Nano)→ CMP Slurry", "RAW-METAL", 6800, "Fluida pemoles kimia-mekanis untuk meratakan lapisan sirkuit wafer chip hingga presisi atomik."],
    ["Tetrametilamonium Hidroksida Elektronik (TMAH Developer)", "(CH₃)₄NOH (Logam < 1 ppb)", "Trimetalimina + Metil Karbonat —(Elektrolisis Membran)→ TMAH", "RAW-GAS", 5600, "Cairan pengembang (developer) pencuci lapisan fotoresis setelah disinari laser litografi."],
    ["Gas Heksaklorodisilana (HCDS Prekursor Chip)", "Si₂Cl₆ (6N Purity)", "Si + SiCl₄ + Cl₂ —(Reaktor Kuarsa Suhu Terkendali)→ Si₂Cl₆", "RAW-MINERAL", 8500, "Prekursor Atomic Layer Deposition (ALD) untuk film silikon nitrida isolator memori 3D-NAND."],
    ["Trimetilgalium Metalorganik (TMGa MOCVD)", "Ga(CH₃)₃", "GaCl₃ + 3 Al(CH₃)₃ —(Distilasi Atmosfer Argon)→ Ga(CH₃)₃", "RAW-METAL", 9400, "Prekursor MOCVD untuk menumbuhkan kristal Galium Nitrida (GaN) pada LED biru dan radar daya tinggi."],
    ["Bahan Aktif Ibuprofen Kristal (API)", "C₁₃H₁₈O₂", "Isobutilbenzena + Asetil Klorida —(Karbonilasi Pd Boots-Hoechst)→ Ibuprofen", "RAW-CRUDE", 3900, "Bahan aktif obat anti-inflamasi non-steroid (NSAID) pereda nyeri dan demam global."],
    ["Bahan Aktif Metformin Hidroklorida (API)", "C₄H₁₁N₅·HCl", "Dimetilamina HCl + Disiandiamida —(Kondensasi Leleh 150°C)→ Metformin HCl", "RAW-GAS", 3750, "Bahan aktif obat terapi lini pertama diabetes tipe-2 paling banyak diresepkan di dunia."],
    ["Bahan Aktif Atorvastatin Kalsium (Statin API)", "(C₃₃H₃₄FN₂O₅)₂Ca", "Prekursor Pirrol + Rantai Samping Kiral —(Kondensasi Paal-Knorr)→ Atorvastatin", "RAW-BIO", 7600, "Bahan aktif obat penurun kolesterol darah bernilai tinggi dengan sintesis kiral multi-tahap."],
    ["Enzim Industri Amilase & Protease Rekombinan", "Protein Enzim Terenkapsulasi", "Glukosa + Bacillus licheniformis —(Fermentasi & Ultrafiltrasi)→ Enzim", "RAW-BIO", 4600, "Biokatalis penghilang noda membandel pada deterjen dingin dan pemecah pati industri sirup."],
    ["Kitosan Medis & Biopolimer Hemostatik", "Poli-(β-1,4-D-Glukosamina)", "Kitin Cangkang Krustasea + NaOH Pekat —(Deasetilasi 110°C)→ Kitosan", "RAW-BIO", 4250, "Biopolimer penghenti pendarahan luka darurat militer, benang jahit bedah, dan penjernih air."],
    ["Asam Hialuronat Bobot Molekul Tinggi (HA Derma)", "(C₁₄H₂₁NO₁₁)ₙ", "Streptococcus zooepidemicus —(Fermentasi Steril & Presipitasi Etanol)→ HA", "RAW-BIO", 8300, "Biopolimer pengikat air 1000x untuk cairan pelumas operasi mata, suntik sendi lutut, dan serum kulit."],
    ["Kristal Cair Nematik Tampilan Layar (LCD Mixture)", "Campuran Bifenil-Sikloheksana Fluorinasi", "Komponen Mesogenik —(Kopling Suzuki Pd & Pemurnian Zona)→ Kristal Cair", "RAW-CRUDE", 9100, "Fluida elektro-optik pengatur piksel cahaya pada ratusan juta layar monitor, TV, dan instrumen pesawat."],
    ["Bubuk Magnet Neodimium-Besi-Boron (NdFeB Sintered)", "Nd₂Fe₁₄B", "Nd + Fe + B + Dy —(Strip Casting, Jet Milling & Sintering Vakum)→ NdFeB", "RAW-METAL", 7200, "Magnet permanen terkuat di dunia untuk motor traksi mobil listrik dan generator turbin angin."],
    ["Bubuk Superalloy Kobalt-Kromium Medis (CoCrMo Powder)", "Co₆₄Cr₂₈Mo₆ (Spherical Powder)", "Ingot Co-Cr-Mo —(Atomisasi Gas Argon Supersonik)→ Serbuk 3D Print", "RAW-METAL", 6900, "Serbuk logam bulat sempurna untuk pencetakan 3D laser mahkota gigi, implan lutut, dan nosel bahan bakar."],
    ["Keramik Boron Nitrida Heksagonal (h-BN White Graphite)", "BN (sp² Hexagonal)", "B₂O₃ + 2 NH₃ —(Nitridasi Suhu Tinggi 1800°C)→ h-BN + 3 H₂O", "RAW-MINERAL", 6350, "Isolator listrik yang sekaligus penghantar panas luar biasa dan pelumas padat suhu 1.000°C."]
  ];

  const T4_END_PRODUCTS = [
    ["Blok Mesin V8 Komposit Al-Si-C", "Al-Si12-Cu-Mg + Liner SiC", "Infiltrasi Logam Cair Al-Si + Liner Keramik SiC —(HIP & CNC 5-Axis)→ Blok V8", "RAW-METAL", 45000, "Blok silinder mesin V8 performa tinggi berbobot ringan dengan dinding silinder tahan aus ekstrem."],
    ["Piston Tempa Paduan Khusus (Forged Racing Piston)", "Al-2618 + Lapisan MoS₂/PTFE", "Billet Al-Cu-Mg-Ni —(Penempaan Isothermal 450°C & Coating Skirt)→ Piston Set", "RAW-METAL", 28000, "Satu set piston mesin balap/industri yang tahan tekanan pembakaran turbocharger >200 bar."],
    ["Selubung Termal Roket Orbital (TPS Heat Shield)", "Matriks C/SiC + Aerogel + Fenolik", "Tenunan Serat Karbon + Infiltrasi Uap SiC (CVI 1200°C) → Perisai Termal", "RAW-METAL", 65000, "Perisai pelindung wahana antariksa saat menembus kembali atmosfer bumi pada suhu plasma 1.650°C."],
    ["Bilah Turbin Jet Kristal Tunggal (Single-Crystal Blade)", "Superalloy CMSX-4 + Lapisan YSZ", "Inconel/Rhenium —(Pengecoran Terarah Bridgman & EB-PVD TBC)→ Bilah Turbin", "RAW-METAL", 52000, "Bilah turbin tahap pertama mesin jet komersial yang berputar 12.000 RPM di dalam api pembakaran."],
    ["Panel Sayap Pesawat Komposit Carbon-Epoxy", "CFRP Prepreg Autoclave Cure", "Serat Karbon T800 + Epoksi Dirgantara —(Autoklaf 180°C, 7 bar)→ Spar Sayap", "RAW-CRUDE", 48000, "Struktur sayap pesawat berbadan lebar yang menghemat bobot pesawat hingga 20% dan tahan lelah logam."],
    ["Paket Sel Baterai EV Solid-State 100 kWh", "Li-Metal / Elektrolit Sulfida / NMC", "Anoda Li + Separator Keramik + Katoda NMC —(Perakitan Dry-Room)→ Battery Pack", "RAW-METAL", 42000, "Modul baterai mobil listrik generasi baru anti-terbakar dengan jarak tempuh 900 km sekali isi."],
    ["Wafer Semikonduktor Prosesor 300mm (EUV Ready)", "Si(11N) + SiO₂ + Photoresist", "Ingot Si 11N —(Pemotongan Berlian, CMP & Epilayer CVD)→ Wafer 300mm", "RAW-MINERAL", 38000, "Wafer silikon cermin sempurna siap cetak litografi untuk menghasilkan ratusan chip CPU/GPU."],
    ["Modul Panel Surya Tandem Perovskite-Silikon", "Si-HJT + CsFAPbI₃ + EVA + Kaca", "Sel Silikon + Lapisan Perovskite —(Enkapsulasi Vakum EVA)→ Modul Surya 700Wp", "RAW-MINERAL", 19500, "Panel surya efisiensi >28% yang memanen spektrum cahaya biru dan merah sekaligus."],
    ["Tangki Kriogenik Hidrogen Cair Komposit (LH2 Tank)", "Liner PA6 + Serat Karbon T1000", "Liner Poliamida + Filament Winding Carbon-Epoxy → Tangki Tekanan 700 bar", "RAW-GAS", 36000, "Tangki penyimpanan hidrogen cair -253°C bebas bocor untuk truk sel bahan bakar dan roket."],
    ["Rem Cakram Karbon-Keramik (CCM Brake Disc)", "C-Fiber + Silikon Cair → C/SiC", "Preform Serat Karbon + Infiltrasi Silikon Cair 1600°C → Cakram C/SiC", "RAW-MINERAL", 24000, "Cakram rem supercar dan pesawat terbang yang tidak memudar (fade-free) pada pengereman 1.000°C."],
    ["Nose Cone Rudal & Pesawat Hipersonik", "HfB₂-SiC Ultra-High Temp Ceramic", "Hafnium Diborida + SiC —(Spark Plasma Sintering 2100°C)→ Kerucut Hidung", "RAW-METAL", 68000, "Ujung aerodinamis tahan ablasi suhu >2.200°C pada kecepatan Mach 6 di atmosfer."],
    ["Membran Modul Desalinasi Air Laut Skala Kota", "Spiral-Wound TFC Polyamide 8-Inch", "Membran TFC + Spacer PP + Tabung FRP —(Penggulungan Presisi)→ Elemen RO", "RAW-CRUDE", 16500, "Unit modul desalinasi tekanan tinggi berkapasitas 50.000 liter air tawar per hari."],
    ["Katup Jantung Mekanis Buatan (PyroCarbon Valve)", "Karbon Pirolitik + Cincin Ti-6Al-4V", "CH₄ —(CVD Fluidized Bed 1300°C pada Substrat Grafit)→ Katup Jantung", "RAW-METAL", 34000, "Implan katup jantung penyelamat nyawa yang anti-pembekuan darah dan tahan berdetak 50 tahun."],
    ["Implan Sendi Pinggul & Tulang Belakang Ti-PEEK", "Ti-6Al-4V Porous + Bantalan PEEK", "Serbuk Titanium —(3D Laser Melting & Mesin PEEK Medis)→ Implan Ortopedi", "RAW-METAL", 29500, "Implan bedah tulang dengan modulus elastisitas menyerupai tulang manusia asli."],
    ["Kaca Antipeluru Laminasi Polikarbonat-PVB", "Kaca Tempered + PVB + Lembar PC", "Lapisan Kaca + Film PVB + Polikarbonat —(Autoklaf 140°C, 12 bar)→ Armor Glass", "RAW-CRUDE", 21000, "Kaca kendaraan kepresidenan dan ruang kontrol tahan tembakan kaliber senapan serbu."],
    ["Rompi & Helm Taktis Balistik Kevlar-UHMWPE", "Tenunan Aramid + Dyneema UHMWPE", "30 Lapisan Kevlar + Matriks Resin —(Press Hidrolik 160 bar)→ Pelat Level IV", "RAW-CRUDE", 18500, "Perlengkapan pelindung personel dengan daya henti peluru tinggi dan bobot sangat ringan."],
    ["Ban Radial Pesawat & Dump Truck Tambang Raksasa", "Karet SBR/PBR + Sabuk Baja/Kevlar", "Kompon Karet + Silika + Kord Kevlar —(Vulkanisasi Cetakan 170°C)→ Ban Heavy-Duty", "RAW-CRUDE", 26000, "Ban raksasa tahan beban 100 ton dan pendaratan pesawat berkecepatan 300 km/jam."],
    ["Pipa Transmisi Gas Bawah Laut Berlapis 3LPE", "Baja API-5L + Epoksi FBE + HDPE", "Pipa + Semprotan Bubuk Epoksi + Ekstrusi HDPE → Pipa Lepas Pantai", "RAW-GAS", 22500, "Segmen pipa gas bawah laut anti-korosi air garam dengan umur pakai 50 tahun."],
    ["Kabel Listrik Bawah Laut Tegangan Tinggi (HVDC XLPE)", "Tembaga + Isolasi XLPE Crosslinked", "Konduktor Cu + Polietilena Peroksida —(Vulkanisasi Kontinu Catenary)→ Kabel HVDC", "RAW-GAS", 31000, "Kabel transmisi listrik antar-pulau berisolasi polietilena ikat-silang tahan tegangan 500 kV."],
    ["Tumpukan Sel Bahan Bakar Hidrogen (PEM Fuel Cell Stack)", "Membran Nafion PFSA + Katalis Pt/C", "Membran Fluoropolimer + Elektroda Platina + Pelat Bipolar Grafit → PEM Stack", "RAW-METAL", 46000, "Pembangkit listrik hidrogen ramah lingkungan yang hanya mengeluarkan uap air murni."],
    ["Elektroliser Hidrogen Hijau Membran PEM", "Ti-Felt + Katalis IrO₂/Pt + Nafion", "Anoda Iridium + Membran Proton + Katoda Pt —(Perakitan Tekanan)→ Elektroliser", "RAW-METAL", 49000, "Unit pemecah air murni menggunakan listrik terbarukan menjadi gas hidrogen hijau bertekanan."],
    ["Reaktor Mikrofluida Farmasi Berlapis Hastelloy-PTFE", "Hastelloy C-276 + Lining PTFE Murni", "Billet Ni-Mo-Cr —(Diffusion Bonding & Sintering PTFE)→ Reaktor Kontinu", "RAW-METAL", 39000, "Unit sintesis obat otomatis tahan asam korosif tinggi dengan perpindahan panas presisi."],
    ["Segel Mekanis & Bantalan Reaktor Nuklir (Nuclear Seal)", "Karbon-Grafit + SiC + Kalrez FFKM", "Cincin SiC Sinter + Elastomer Perfluoro —(Lapping Laser 0,1 µm)→ Segel Nuklir", "RAW-MINERAL", 35000, "Segel pompa pendingin utama reaktor daya nuklir yang tahan radiasi gamma dan uap 320°C."],
    ["Bejana Tekan Reaktor Hidrogenasi Berdinding Tebal", "Baja Cr-Mo 2.25Cr-1Mo + Cladding SS316L", "Pelat Cr-Mo —(Pengelasan SAW & Weld Overlay Austenitik)→ Bejana Reaktor", "RAW-METAL", 54000, "Reaktor proses kilang hidrokraking yang beroperasi aman pada tekanan 180 bar dan suhu 450°C."],
    ["Kolom Distilasi Presisi Structured Packing", "Menara SS316L + Packing Gauze Sulzer", "Silinder Stainless + Anyaman Kawat Bergelombang —(Fabrikasi TIG)→ Kolom", "RAW-METAL", 41000, "Menara pemisahan isotop dan bahan kimia elektronik dengan efisiensi ratusan tahap teoritis."],
    ["Unit Penukar Panas Pelat Berlapis Titanium (Ti-PHE)", "Pelat Titanium Grade-1 + Gasket EPDM", "Lembaran Ti —(Stamping Hidrolik & Perakitan Rangka)→ Heat Exchanger", "RAW-METAL", 27500, "Penukar panas tahan korosi air laut 100% untuk pendinginan kilang pesisir dan kapal LNG."],
    ["Kompresor Sentrifugal Gas Proses Rotor Magnetik", "Impeller 17-4PH + Bantalan Magnet Aktif", "Billet Baja Presipitasi —(5-Axis Milling & Balancing 25.000 RPM)→ Kompresor", "RAW-METAL", 51000, "Kompresor gas etilena/hidrogen bebas pelumas oli dengan efisiensi isentropik tinggi."],
    ["Nosel Roket Pendorong Karbon-Karbon (C-C Nozzle)", "3D Woven Carbon-Carbon Composite", "Tenunan 3D Serat Karbon —(Densifikasi Pitch & Grafitisasi 2500°C)→ Nosel", "RAW-GAS", 58000, "Kerucut buang mesin roket yang semakin kuat secara mekanis saat dipanaskan di atas 2.000°C."],
    ["Motor Roket Padat Komposit HTPB-AP Siap Luncur", "HTPB Binder + Serbuk Al + AP", "Polibutadiena + Aluminium + Amonium Perklorat —(Vacuum Casting)→ Solid Booster", "RAW-MINERAL", 62000, "Tabung pendorong roket padat berdaya dorong tinggi untuk peluncuran kargo luar angkasa."],
    ["Kubah Radar Pesawat (Radome Komposit Kuarsa-Bismaleimida)", "Serat Kuarsa SiO₂ + Resin BMI", "Kain Kuarsa Murni + Resin BMI —(Cetakan Autoklaf Presisi)→ Radome", "RAW-MINERAL", 33000, "Pelindung hidung radar pesawat yang transparan terhadap gelombang elektromagnetik frekuensi tinggi."],
    ["Baling-Baling Kapal Selam Komposit Peredam Suara", "Serat Karbon-Kaca Hibrida + Epoksi", "Laminasi Multi-Aksial + Inti Busa —(Resin Transfer Molding)→ Propeller Senyap", "RAW-CRUDE", 44000, "Propeller maritim bebas kavitasi akustik yang tahan korosi air laut tanpa perawatan."],
    ["Sasis Monokok Mobil Balap & Supercar Carbon-Titanium", "Prepreg Carbon T1000 + Honeycomb Nomex", "Honeycomb Aramid + Kulit Carbon + Insert Ti —(Autoklaf)→ Monocoque", "RAW-METAL", 56000, "Kokpit keselamatan ultra-kaku dengan berat hanya 65 kg yang melindungi pengemudi pada tabrakan 300 km/jam."],
    ["Bilah Turbin Angin Lepas Pantai 100-Meter (Wind Blade)", "Glass-Carbon Hybrid + Epoksi Infusi", "Spar Serat Karbon + Kulit Fiberglass + Inti PET Foam —(VARTM)→ Bilah 15 MW", "RAW-CRUDE", 37000, "Bilah aerodinamis raksasa penangkap angin laut untuk pembangkit listrik hijau 15 Megawatt."],
    ["Kabel Superkonduktor Suhu Tinggi (REBCO HTS Tape)", "YBa₂Cu₃O₇₋ₓ pada Pita Hastelloy", "Substrat Ni-W + Lapisan Buffer + YBCO —(PLD Laser Deposition)→ Pita HTS", "RAW-METAL", 64000, "Kabel penghantar arus listrik ribuan Ampere tanpa hambatan (0 Ohm) untuk magnet reaktor fusi & MRI."],
    ["Magnet MRI Medis & Akselerator Partikel Kriogenik", "Kumparan NbTi/REBCO + Bejana Helium", "Kawat Superkonduktor + Isolasi Kapton + Cryostat Vakum → Magnet 7 Tesla", "RAW-METAL", 69000, "Inti mesin pencitraan medis rumah sakit beresolusi tinggi dengan medan magnet ekstrem."],
    ["Lensa & Cermin Teleskop Luar Angkasa Silikon Karbida", "CVD-SiC + Lapisan Reflektif Emas/Be", "Blank SiC Sinter —(Pemolesan Ion-Beam Presisi Nanometer)→ Cermin Optik", "RAW-MINERAL", 59000, "Cermin observatorium orbit yang tidak memuai atau menyusut pada perubahan suhu ekstrem antariksa."],
    ["Baju Antariksa EVA Multi-Lapis (Spacesuit Thermal Layer)", "Ortho-Fabric Gore-Tex + Kevlar + Mylar", "Tenunan PTFE + Penahan Mikrometeorit Kevlar + 7 Lapis Aluminized Mylar → EVA Suit", "RAW-CRUDE", 53000, "Pakaian bertekanan mandiri yang melindungi astronot dari vakum, radiasi, dan mikrometeorit."],
    ["Sistem Filtrasi Udara Kabin & Cleanroom ULPA Grade", "Micro-Glassborosilicate + Bingkai PTFE", "Serat Kaca Borosilikat Nano —(Pleating Presisi & Seal Poliuretan)→ Filter ULPA", "RAW-MINERAL", 14500, "Penyaring udara ruang bersih pabrik chip dan ruang operasi yang menangkap 99,9995% partikel 0,1 mikron."],
    ["Ginjal Buatan / Dialiser Serat Berongga (Hollow-Fiber)", "12.000 Serat Polisulfon + Rumah PC", "Pemintalan Serat Berongga PSU + Potting Poliuretan Medis → Dialiser Steril", "RAW-CRUDE", 15800, "Perangkat medis pencuci racun darah pasien gagal ginjal dengan luas permukaan membran mikroskopis."],
    ["Tabung Sinar-X & CT-Scan Anoda Putar Tungsten-Rhenium", "Paduan W-10Re + Grafit Brazed + Kaca", "Disk Tungsten-Rhenium —(Sintering Vakum 2600°C & Tabung Vakum Tinggi)→ X-Ray Tube", "RAW-METAL", 36500, "Sumber pancaran sinar-X diagnostik rumah sakit yang tahan bombardir elektron suhu ekstrem."],
    ["Baterai Nuklir Radioisotop Termoelektrik (RTG Casing)", "Komposit Carbon-Carbon + Termokopel SiGe", "Pelindung Grafit Aeroshell + Elemen Silikon-Germanium → Modul Daya Antariksa", "RAW-METAL", 67000, "Rumah konversi panas ke listrik untuk wahana penjelajah planet luar yang bekerja 30 tahun tanpa matahari."],
    ["Sensor Gas & Spektrometer Inframerah Industri (FTIR Cell)", "Jendela ZnSe / CaF₂ + Detektor MCT", "Kristal Seng Selenida Optik + Ruang Gas Berlapis Emas → Modul Analitik", "RAW-MINERAL", 25000, "Instrumen pendeteksi kebocoran gas beracun ppm dan pengukur kemurnian reaksi kimia real-time."],
    ["Katup Kontrol Tekanan Tinggi Kriogenik (LNG Control Valve)", "Badan SS316L + Trim Stellite + Stem PTFE", "Pengecoran Presisi + Hardfacing Cobalt-Cr + Aktuator Pneumatik → Katup LNG", "RAW-METAL", 23000, "Katup pengatur aliran gas alam cair pada suhu -162°C tanpa pembekuan segel."],
    ["Pompa Mag-Drive Kimia Tanpa Segel Berlapis PFA", "Casing Ductile Iron + Lining PFA + Magnet NdFeB", "Injeksi Molding PFA Murni + Kopling Magnet Neodimium → Pompa Bebas Bocor", "RAW-MINERAL", 19000, "Pompa transfer asam klorida, bromin, dan pelarut berbahaya dengan nol risiko kebocoran poros."],
    ["Pembangkit Uap & Penukar Panas Heliks Incoloy 800", "Berkas Tabung Incoloy 800H + Shell", "Tabung Ni-Fe-Cr —(Pembengkokan Heliks & Pengelasan Orbital)→ Steam Generator", "RAW-METAL", 43000, "Unit pemulihan panas reaksi eksotermis menjadi uap bertekanan tinggi penggerak turbin listrik."],
    ["Tangki Penyimpanan Asam Pekat Berlapis Karet & PVDF", "Baja Karbon + Lining Butyl/PVDF", "Pelat Baja + Ikatan Vakum Lembaran PVDF Tahan Asam → Tangki Kimia", "RAW-MINERAL", 20500, "Tangki penyimpanan H₂SO₄ dan HF skala besar dengan ketahanan korosi puluhan tahun."],
    ["Modul Penangkap Karbon Langsung dari Udara (DAC Contactor)", "Honeycomb Monolit + Sorbent Amina-Silika", "Keramik Kordierit + Impregnasi Polietilenimina (PEI) → Modul DAC", "RAW-MINERAL", 32000, "Kontaktor penyerap CO₂ atmosfer untuk menghasilkan kredit karbon negatif dan bahan bakar e-Fuel."],
    ["Reaktor Sintesis Fischer-Tropsch Bahan Bakar Jet Sintetis", "Microchannel Plate + Katalis Co-Ru/Al₂O₃", "Pelat Baja Mikro-Kanal + Pelapisan Katalis Kobalt → Reaktor e-SAF", "RAW-METAL", 47000, "Reaktor pengubah hidrogen hijau dan CO₂ tangkapan menjadi avtur penerbangan bebas fosil (SAF)."],
    ["Lapisan Siluman Penyerap Gelombang Radar (RAM Coating Kit)", "Poliuretan Fluor + Ferit Karbonil + CNT", "Dispersi Nano-Ferit + Carbon Nanotube dalam Matriks Fluoropolimer → Cat RAM", "RAW-METAL", 55000, "Komposit pelapis permukaan pesawat dan kapal yang mengubah gelombang radar pantul menjadi panas mikro."],
    ["Sistem Pendorong Ion Xenon Satelit (Hall-Effect Thruster)", "Ruang Keramik BN + Katoda LaB₆ + Magnet", "Boron Nitrida Sinter + Emiten Lantanum Heksaborida → Pendorong Plasma", "RAW-METAL", 61000, "Mesin propulsi elektrik efisiensi ultra-tinggi untuk manuver konstelasi satelit telekomunikasi."],
    // +25 PRODUK AKHIR BARU (51..75)
    ["Ruang Bakar Mesin Roket Cair Methalox (Regenerative Chamber)", "Paduan Cu-Cr-Zr + Jaket Inconel 718", "Cetakan Laser SLM Saluran Pendingin Mikro + Electroforming Nikel → Ruang Bakar", "RAW-METAL", 66000, "Ruang pembakaran roket pendorong metana-oksigen cair yang menahan fluks panas 100 MW/m²."],
    ["Turbopump Kriogenik Oksigen & Hidrogen Cair Roket", "Impeller Titanium + Rumah Monel K-500", "5-Axis Milling Impeller + Bantalan Kriogenik Keramik Si₃N₄ → Turbopump 40.000 RPM", "RAW-METAL", 59500, "Pompa turbo berdaya puluhan ribu tenaga kuda pengumpan propelan cair ke mesin roket orbital."],
    ["Kapsul Re-Entry Antariksa Komposit Ablatif (PICA-X Shield)", "Phenolic-Impregnated Carbon Ablator", "Preform Serat Karbon Rayon + Impregnasi Resin Fenolik Vakum → Aeroshell Kapsul", "RAW-CRUDE", 63000, "Perisai ablatif kapsul astronot yang mampu menahan pendaratan kembali dari Bulan dan Mars."],
    ["Roda Pendaratan Pesawat Tempur Baja Maraging-Titanium", "Ti-10V-2Fe-3Al + Baja Maraging 300M", "Penempaan Matriks Tertutup 30.000 Ton + Pelapisan HVOF Tungsten Karbida → Landing Gear", "RAW-METAL", 49500, "Struktur penopang hentakan pendaratan pesawat di atas dek kapal induk."],
    ["Kanopi Kokpit Jet Supersonik Polikarbonat Berlapis Emas-ITO", "PC Optik 30mm + Lapisan ITO/Au", "Thermoforming Vakum Presisi + Sputtering Magnetron Indium-Tin-Oxide → Kanopi Jet", "RAW-CRUDE", 44500, "Kaca kokpit tanpa sambungan yang tahan benturan burung pada kecepatan Mach 2 dan memantulkan radar."],
    ["Kursi Lontar Pilot Zero-Zero Komposit & Kartrid Propelan", "Rangka Carbon-Kevlar + Roket Pendorong", "Fabrikasi Rangka Komposit + Pengisian Propelan Padat Double-Base → Ejection Seat", "RAW-METAL", 38500, "Sistem penyelamat nyawa pilot yang mampu melontarkan kursi dari ketinggian 0 meter dalam 0,2 detik."],
    ["Sel Surya Satelit Luar Angkasa Triple-Junction GaAs", "GaInP / GaAs / Ge pada Substrat Ge", "Epitaksi MOCVD Multi-Lapis + Lapisan Kaca Pelindung Radiasi Cerium → Solar Array", "RAW-METAL", 57000, "Sayap panel surya satelit efisiensi 32% yang tahan badai radiasi proton sabuk Van Allen."],
    ["Giroskop Serat Optik Navigasi Inersia (FOG Aerospace)", "1.000m Serat Kuarsa PM + Chip LiNbO₃", "Penarikan Serat Optik Pemelihara Polarisasi + Modulator Litium Niobat → Unit INS", "RAW-MINERAL", 41500, "Kompas navigasi optik laser penentu posisi pesawat dan kapal selam tanpa sinyal satelit GPS."],
    ["Detektor Inframerah Termal Pendingin Stirling (MCT Sensor)", "Hg₁₋ₓCdₓTe pada Substrat CdZnTe", "Molecular Beam Epitaxy (MBE) + Mikropendingin Kriogenik 77K → Kamera Termal", "RAW-METAL", 52500, "Sensor penglihatan malam jarak jauh pendeteksi panas mesin dan kebocoran gas industri."],
    ["Baterai Aliran Redoks Vanadium Skala Gardu Induk (VRFB)", "Elektrolit V²⁺/V³⁺ & VO²⁺/VO₂⁺ + Membran", "Pelarutan V₂O₅ dalam H₂SO₄ + Tumpukan Sel Elektroda Felt Grafit → Kontainer VRFB", "RAW-METAL", 39500, "Penyimpan energi listrik jaringan surya/angin dengan umur siklus >20.000 kali tanpa risiko kebakaran."],
    ["Transformator Daya Tegangan Ekstra Tinggi Berpendingin Ester", "Baja Silikon Terorientasi + Ester Sintetis", "Laminasi Inti Fe-3%Si + Kumparan Tembaga + Pengisian Pentaeritritol Ester → Trafo 500kV", "RAW-METAL", 46500, "Trafo gardu induk ramah lingkungan dengan cairan isolator ester sintetis tahan api (titik nyala >300°C)."],
    ["Pemutus Sirkuit Tegangan Tinggi Bebas SF6 (Clean-Air GIS)", "Isolator Epoksi-Alumina + Kontak Cu-W", "Pengecoran Vakum Epoksi Sikloalifatik + Ruang Vakum Tembaga-Tungsten → Switchgear", "RAW-METAL", 33500, "Sakelar proteksi jaringan listrik tegangan tinggi bebas gas rumah kaca SF₆."],
    ["Motor Traksi Mobil Listrik Aksial-Fluks Magnet NdFeB", "Stator Tembaga Hairpin + Rotor NdFeB-Carbon", "Penggulungan Kawat Litz + Enkapsulasi Epoksi Termal + Selongsong Serat Karbon → Motor EV", "RAW-METAL", 29000, "Motor listrik ultra-ringan (24 kg) bertenaga 400 HP untuk supercar elektrik dan pesawat eVTOL."],
    ["Inverter Daya Mobil Listrik Berbasis Wafer Silikon Karbida", "Modul MOSFET 1200V SiC + Substrat AlN", "Sintering Perak Chip SiC pada Keramik Aluminium Nitrida → Inverter Traksi", "RAW-MINERAL", 26500, "Pengatur daya baterai ke motor EV efisiensi 99% yang tahan suhu tinggi dan mempercepat pengisian daya."],
    ["Sistem Pengereman Kereta Cepat Elektromagnetik & Sinter", "Paduan Cu-Fe-SiC Sinter + Kumparan Eddy", "Metalurgi Serbuk Tekanan Tinggi + Rakitan Kaliper Pneumatik → Modul Rem Shinkansen", "RAW-METAL", 31500, "Sistem pengereman kereta cepat 350 km/jam yang stabil di segala cuaca hujan maupun salju."],
    ["Roda Gigi Reduksi Robot Industri Presisi Cycloidal", "Baja Karburasi Vakum SCM415 + Pelumas MoS₂", "Penggerindaan Profil Gigi Mikron + Nitriding Plasma → Gearbox Robotik Zero-Backlash", "RAW-METAL", 22000, "Sendi penggerak lengan robot pabrik perakitan dengan akurasi posisi berulang 0,01 milimeter."],
    ["Meja Chuck Elektrostatik Litografi Wafer (ESC Ceramic Chuck)", "Al₂O₃-TiO₂ Kemurnian 99,9% + Elektroda W", "Hot-Pressing Keramik + Metallisasi Tungsten + Pemolesan Cermin → Electrostatic Chuck", "RAW-MINERAL", 47500, "Meja pemegang wafer silikon di dalam ruang vakum mesin pembuat chip tanpa penjepit mekanis."],
    ["Sumber Laser Eksimer ArF 193nm Litografi Semikonduktor", "Ruang Keramik Al₂O₃ + Campuran Gas Ar/F₂/Ne", "Brazing Keramik-Logam Tahan Fluorin + Optik Kalsium Fluorida (CaF₂) → Modul Laser", "RAW-MINERAL", 68500, "Jantung mesin pencetak microchip modern yang menembakkan 6.000 pulsa sinar UV dalam per detik."],
    ["Kabel Serat Optik Bawah Laut Trans-Samudra Berpenguat", "Serat Silika GeO₂-Doped + Tembaga + Kevlar", "Penarikan Preform VAD + Tabung Tembaga Hermetik + Lapisan HDPE/Baja → Kabel Samudra", "RAW-MINERAL", 37500, "Kabel tulang punggung internet antar-benua di dasar samudra kedalaman 8.000 meter."],
    ["Stent Jantung Koroner Paduan Kobalt-Kromium Berlapis Obat", "Jaring Laser Co-Cr L605 + Polimer Sirolimus", "Pemotongan Laser Femtodetik Tabung Mikro + Ultrasonic Spray Coating Obat → Stent Koroner", "RAW-METAL", 28500, "Cincin penyangga pembuluh darah jantung berdiameter 2,5 mm yang melepaskan obat pencegah penyumbatan."],
    ["Lensa Intraokular Mata Buatan Akrilik Hidrofobik", "Kopolimer Akrilat Indeks Bias Tinggi", "Polimerisasi Cetakan Presisi + Pembubutan Berlian Kriogenik → Lensa Katarak Lipat", "RAW-CRUDE", 17500, "Implan lensa mata pengganti katarak yang dapat dilipat melewati sayatan mikro 2 milimeter."],
    ["oksigenator Membran Ekstrakorporeal Jantung-Paru (ECMO)", "Serat Berongga Polimetilpentena (PMP)", "Pemintalan Membran PMP + Pelapisan Heparin Biokompatibel → Modul Paru Buatan", "RAW-CRUDE", 32500, "Perangkat penopang hidup ICU yang menggantikan fungsi paru-paru dan jantung pasien kritis."],
    ["Kontainer Penyimpan Limbah Bahan Bakar Nuklir (Dry Cask)", "Baja Austenitik + Timbal + Boron Karbida", "Fabrikasi Silinder Berlapis Perisai Neutron B₄C-Al + Pengelasan Laser → Cask Nuklir", "RAW-METAL", 56500, "Wadah penyimpanan bahan bakar nuklir bekas yang tahan gempa bumi, banjir, dan benturan pesawat."],
    ["Batang Kendali Reaktor Nuklir Perak-Indium-Kadmium", "Paduan Ag-15In-5Cd dalam Selongsong Zircaloy-4", "Peleburan Induksi Penyerap Neutron + Pengelasan Berkas Elektron Zirkonium → Control Rod", "RAW-METAL", 51500, "Pengendali laju reaksi fisi berantai di dalam teras reaktor pembangkit listrik tenaga nuklir."],
    ["Anjungan Separator Subsea Minyak & Gas Laut Dalam", "Baja Duplex 2205 + Inconel 625 Cladding", "Penempaan Dinding Tebal 250 Bar + Siklon Pemisah Pasir/Air/Gas → Subsea Tree", "RAW-METAL", 64500, "Instalasi pemisah migas otomatis yang bekerja di dasar laut gelap sedalam 3.000 meter."]
  ];

  // Tahapan Alat Standar (untuk referensi edukasi di samping fitur Ganti Alat 4 Generasi)
  const PROCESS_UPGRADE_STEPS = [
    {
      level: 1,
      title: "Generasi 1: Alat Batch / Konvensional Dasar",
      desc: "Peralatan awal berbiaya rendah dengan kontrol manual. Kapasitas terbatas dan kemurnian maksimal mentok di Grade C (<80%)."
    },
    {
      level: 2,
      title: "Generasi 2: Alat Kontinu Standar Industri",
      desc: "Ganti alat ke sistem aliran kontinu dengan pemulihan panas dan kontrol PID. Membuka kualitas Grade B (80–90%)."
    },
    {
      level: 3,
      title: "Generasi 3: Alat Rekayasa Presisi & Katalitik Maju",
      desc: "Ganti ke reaktor/kolom generasi ke-3 (Fluidized-Bed, Structured Packing, Membran Nafion, VIM) untuk menembus Grade A (>92%)."
    },
    {
      level: 4,
      title: "Generasi 4: Alat State-of-the-Art & Digital Twin AI",
      desc: "Teknologi puncak (Mikroreaktor Superkritis, Kompresor Levitasi Magnetik, ISO-1 Cleanroom) dengan throughput masif & kemurnian 99%+."
    }
  ];

  // Fungsi penentu Rute Proses spesifik untuk setiap produk dari 300 produk
  function determineProductRoute(tier, name, formula, reaction, feedstockId) {
    const text = (name + " " + formula + " " + reaction).toLowerCase();
    if (tier === 4) {
      if (text.includes("wafer") || text.includes("litografi") || text.includes("foup") || text.includes("ulpa") || text.includes("chuck") || text.includes("laser eksimer") || text.includes("ftir")) {
        return "ROUTE-SEMI-CLEAN";
      }
      if (text.includes("dialiser") || text.includes("ecmo") || text.includes("lensa intraokular") || text.includes("stent")) {
        return "ROUTE-BIO-PHARMA";
      }
      return "ROUTE-METAL-COMP";
    }
    if (text.includes("semikonduktor") || text.includes("elektronik") || text.includes("fotoresis") || text.includes("11n") || text.includes("6n") || text.includes("cmp") || text.includes("tmah") || text.includes("hcds") || text.includes("tmga") || text.includes("kristal cair")) {
      return "ROUTE-SEMI-CLEAN";
    }
    if (feedstockId === "RAW-BIO" || text.includes("fermentasi") || text.includes("parasetamol") || text.includes("aspirin") || text.includes("amoksisilin") || text.includes("penisilin") || text.includes("vitamin") || text.includes("ibuprofen") || text.includes("metformin") || text.includes("atorvastatin") || text.includes("enzim") || text.includes("kitosan") || text.includes("hialuronat")) {
      return "ROUTE-BIO-PHARMA";
    }
    if (text.includes("serat karbon") || text.includes("katoda") || text.includes("anoda") || text.includes("polisilikon") || text.includes("nanotube") || text.includes("grafena") || text.includes("katalis") || text.includes("sinter") || text.includes("aerogel") || text.includes("superalloy") || text.includes("titanium") || text.includes("ndfeb") || text.includes("boron nitrida") || text.includes("elektrolit padat")) {
      return "ROUTE-HIGH-TEMP";
    }
    if (tier === 2 || text.includes("polietilena") || text.includes("polipropilena") || text.includes("pvc") || text.includes("polistirena") || text.includes("pet") || text.includes("nilon") || text.includes("ptfe") || text.includes("aramid") || text.includes("peek") || text.includes("poliimida") || text.includes("pvdf") || text.includes("karet") || text.includes("resin") || text.includes("polimer") || text.includes("akrilik") || text.includes("abs") || text.includes("polikarbonat") || text.includes("uhmwpe") || text.includes("nafion") || text.includes("pfa") || text.includes("nomex") || text.includes("pbi")) {
      return "ROUTE-POLIMER";
    }
    if (feedstockId === "RAW-MINERAL" || text.includes("elektrolisis") || text.includes("asam sulfat") || text.includes("klorin") || text.includes("kaustik") || text.includes("soda") || text.includes("fosfat") || text.includes("hipoklorit") || text.includes("klorat") || text.includes("karbida") || text.includes("oleum") || text.includes("tio₂")) {
      return "ROUTE-ELEKTRO-MINERAL";
    }
    if (text.includes("amonia") || text.includes("metanol") || text.includes("hidrogen") || text.includes("syngas") || text.includes("urea") || text.includes("nitrat") || text.includes("etilen oksida") || text.includes("formaldehida") || text.includes("karbon monoksida") || text.includes("karbon dioksida") || text.includes("asetilena") || text.includes("dme")) {
      return "ROUTE-GAS-SYNTH";
    }
    return "ROUTE-DISTILASI";
  }

  const PRODUCTS = [];

  function registerGroup(list, tier, catLabel, powerBase, waterBase, feedAmountBase) {
    list.forEach((item) => {
      const idx = PRODUCTS.length + 1;
      const code = "CHEM-" + String(idx).padStart(3, "0");
      const price = item[4];
      const routeId = determineProductRoute(tier, item[0], item[1], item[2], item[3]);
      PRODUCTS.push({
        id: code,
        index: idx,
        name: item[0],
        tier: tier,
        category: catLabel,
        routeId: routeId,
        formula: item[1],
        reaction: item[2],
        feedstockId: item[3],
        feedstockPerUnit: Number((feedAmountBase * (1 + (idx % 5) * 0.08)).toFixed(2)),
        powerKwh: Math.round(powerBase * (1 + (idx % 7) * 0.12)),
        waterM3: Number((waterBase * (1 + (idx % 6) * 0.1)).toFixed(1)),
        basePrice: price,
        realWorldApp: item[5]
      });
    });
  }

  registerGroup(T1_HULU, 1, "Hulu (Petrokimia Dasar & Gas)", 18, 2.4, 1.2);
  registerGroup(T2_MIDSTREAM, 2, "Midstream (Polimer & Intermediet)", 35, 4.2, 1.5);
  registerGroup(T3_SPECIALTY, 3, "Khusus (Material Rekayasa & Farmasi)", 85, 8.5, 2.0);
  registerGroup(T4_END_PRODUCTS, 4, "Produk Akhir (Komponen Presisi Tinggi)", 220, 16.0, 3.2);

  function getProductById(id) {
    return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  }

  function getFeedstockById(id) {
    return RAW_FEEDSTOCKS.find((f) => f.id === id) || RAW_FEEDSTOCKS[0];
  }

  function getRouteForProduct(productOrId) {
    const prod = typeof productOrId === "string" ? getProductById(productOrId) : (productOrId || PRODUCTS[0]);
    return PROCESS_ROUTES[prod.routeId] || PROCESS_ROUTES["ROUTE-DISTILASI"];
  }

  return {
    RAW_FEEDSTOCKS,
    PROCESS_ROUTES,
    SCRUBBER_GENS,
    RECOVERY_GENS,
    PRODUCTS,
    PROCESS_UPGRADE_STEPS,
    getProductById,
    getFeedstockById,
    getRouteForProduct
  };
})();
