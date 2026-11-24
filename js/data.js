window.ChemTycoon = window.ChemTycoon || {};

window.ChemTycoon.Data = (function () {
  const INITIAL_CASH = 5000;
  const SURVEY_COST = 250;
  const NEWSPAPER_COST = 25;

  const TIER_NAMES = {
    1: "Tier 1: Hulu (Petrokimia Dasar & Gas)",
    2: "Tier 2: Midstream (Polimer & Intermediet)",
    3: "Tier 3: Khusus (Material Rekayasa & Farmasi)",
    4: "Tier 4: Produk Akhir (Komponen Presisi Tinggi)"
  };

  // ===========================================================================
  // POLIGON DARATAN & KEPULAUAN DUNIA NYATA AKURAT [Longitude, Latitude]
  // ===========================================================================
  const WORLD_LAND_POLYGONS = [
    // Amerika Utara & Tengah (kontur detail Alaska, Kanada, Teluk Hudson, Florida, Baja, Panama)
    {
      name: "Amerika Utara & Tengah",
      pts: [
        [-168, 65], [-162, 70], [-140, 70], [-125, 71], [-105, 73], [-92, 71], [-82, 70],
        [-78, 63], [-88, 57], [-79, 54], [-77, 62], [-65, 60], [-56, 52], [-64, 46],
        [-70, 43], [-74, 40], [-76, 35], [-81, 31], [-80, 25], [-82, 26], [-83, 30],
        [-89, 30], [-95, 29], [-97, 26], [-96, 19], [-90, 21], [-87, 21], [-88, 16],
        [-83, 14], [-84, 10], [-79, 9], [-77, 8], [-80, 7], [-85, 10], [-92, 14],
        [-98, 16], [-105, 20], [-109, 25], [-113, 31], [-115, 28], [-110, 23], [-112, 25],
        [-117, 33], [-122, 37], [-124, 43], [-124, 48], [-130, 54], [-138, 59], [-148, 61],
        [-156, 57], [-163, 55], [-166, 60]
      ]
    },
    // Kepulauan Artik Kanada (Baffin & Victoria)
    {
      name: "Kepulauan Artik Kanada",
      pts: [
        [-85, 73], [-68, 74], [-62, 66], [-72, 64], [-82, 68]
      ]
    },
    // Greenland
    {
      name: "Greenland",
      pts: [
        [-52, 60], [-43, 60], [-32, 68], [-20, 74], [-18, 81], [-38, 83], [-56, 80], [-55, 70]
      ]
    },
    // Kuba & Karibia
    {
      name: "Kuba",
      pts: [
        [-84.5, 22], [-79, 22.8], [-74.2, 20.2], [-78, 19.8], [-83, 21.5]
      ]
    },
    {
      name: "Hispaniola",
      pts: [
        [-74, 19.5], [-68.5, 19], [-69, 17.8], [-73.5, 18.2]
      ]
    },
    // Amerika Selatan (Kolombia, Venezuela, Brasil, Andes, Patagonia)
    {
      name: "Amerika Selatan",
      pts: [
        [-77, 8], [-75, 11], [-71, 12], [-62, 10.5], [-52, 4.5], [-48, -1], [-41, -3],
        [-35, -5.5], [-35, -9], [-39, -15], [-40, -21], [-44, -23], [-48, -26], [-53, -33],
        [-58, -36], [-62, -40], [-65, -44], [-67, -50], [-67, -55], [-73, -53], [-75, -47],
        [-73, -39], [-71.5, -33], [-70.5, -24], [-71, -18], [-76, -14], [-81, -5], [-80, 1], [-78, 5]
      ]
    },
    // Eropa Daratan (Iberia, Prancis, Jerman, Italia sepatu bot, Balkan, Skandinavia)
    {
      name: "Eropa",
      pts: [
        [-9.2, 38.7], [-9, 43], [-1.8, 43.4], [-4.5, 48.4], [1.8, 51], [4.5, 52.5], [8.5, 54],
        [10.5, 57.5], [12, 56], [10.5, 54.2], [14.5, 54], [19, 54.6], [21, 56], [24, 60],
        [21, 64], [25, 65.5], [20, 60], [18, 59], [14, 55.5], [12, 57.5], [10.5, 59.8],
        [5, 60.5], [6, 63], [14, 68], [20, 70], [28, 71], [31, 69.5], [40, 67],
        [36, 64], [30, 60], [30, 52], [30, 46], [28, 42], [26, 40.5], [23.5, 38],
        [21, 37], [19.5, 40.5], [18.5, 40.2], [16, 38], [15.5, 38.2], [14, 40.8],
        [12, 42], [10, 44], [7.5, 43.8], [5, 43.3], [3.2, 42.4], [-0.5, 38], [-5.4, 36]
      ]
    },
    // Inggris Raya (Great Britain)
    {
      name: "Inggris Raya",
      pts: [
        [-5.5, 50.1], [-1.2, 50.7], [1.4, 51.3], [1.7, 52.7], [0, 53.8], [-1.5, 55.5],
        [-3, 56.5], [-2, 57.7], [-5, 58.6], [-5.8, 56.5], [-4.8, 54.8], [-3.2, 53.4],
        [-4.5, 52.8], [-5.2, 51.8], [-3.2, 51.4]
      ]
    },
    // Irlandia
    {
      name: "Irlandia",
      pts: [
        [-10.2, 51.6], [-6.2, 52.2], [-6, 54.5], [-7.5, 55.3], [-10, 53.8]
      ]
    },
    // Islandia
    {
      name: "Islandia",
      pts: [
        [-24, 64.5], [-14, 64.2], [-14, 66.2], [-22.5, 66.4]
      ]
    },
    // Afrika
    {
      name: "Afrika",
      pts: [
        [-5.8, 35.8], [3, 36.8], [10.5, 37.2], [11.5, 33], [20, 32.5], [32.5, 31.2],
        [34, 27.5], [38, 21], [43.2, 12.5], [51.3, 11.8], [49, 5], [41, -1.5],
        [39.5, -7], [40.5, -11], [35, -18], [35.5, -24], [31, -30], [25, -34],
        [18.5, -34.5], [17.5, -29], [14.5, -22], [12, -16], [13, -9], [12, -5],
        [9, 0.5], [9.5, 4], [5.5, 4.5], [1, 6], [-4, 5], [-8, 4.8], [-13.5, 8.5],
        [-17.5, 14.7], [-16.5, 21], [-13, 27.5], [-9.5, 31]
      ]
    },
    // Madagaskar
    {
      name: "Madagaskar",
      pts: [
        [44, -25], [47, -25.2], [50.4, -15.5], [49.2, -12.2], [46, -15.5], [43.5, -21]
      ]
    },
    // Timur Tengah (Anatolia/Turki, Suriah, Jazirah Arab, Teluk Persia, Iran)
    {
      name: "Timur Tengah",
      pts: [
        [26.2, 40], [36, 41.8], [41.5, 41.5], [49, 40], [54, 37.5], [61.5, 36.5],
        [61.5, 25.2], [56.5, 26.8], [50.5, 30], [48, 29.8], [50, 26.5], [51.5, 24.5],
        [56.2, 26], [59.8, 22.5], [55, 17], [45, 12.8], [43.5, 13], [41.5, 17],
        [38.5, 22], [35, 28.5], [34.5, 31.5], [35.8, 36], [32, 36.5], [27.5, 37]
      ]
    },
    // Asia Daratan (Rusia, India, Indocina, Tiongkok, Korea, Kamchatka)
    {
      name: "Asia Daratan & Semenanjung",
      pts: [
        [30, 60], [40, 67], [58, 69], [72, 73], [90, 75], [105, 77], [128, 73],
        [150, 71], [178, 66], [170, 60], [163, 59], [161, 52], [156, 51], [158, 56],
        [142, 54], [140, 48], [135, 43], [131, 42.5],
        // Semenanjung Korea akurat!
        [129.5, 38], [129.4, 35.1], [126.5, 34.5], [126.2, 37.5], [124.5, 39.8],
        // Teluk Bohai, Shandong & Pesisir Tiongkok
        [121.5, 39], [118.5, 38.5], [122.5, 37], [120.5, 34.5], [121.8, 31.2],
        [121, 28], [118, 24.5], [114, 22.2], [109.8, 20.5], [108, 21.5],
        // Vietnam, Kamboja, Thailand & Semenanjung Malaya
        [106, 19], [109.2, 13], [106.8, 10.2], [104.5, 10.5], [101, 13.5], [100.2, 13.2],
        [99.5, 9], [102.5, 6], [104.2, 1.3], [103.5, 1.3], [101, 3], [100, 6.5],
        [98.5, 9.5], [98, 15.5], [96.5, 16.5], [94, 18], [91.5, 22.2],
        // Semenanjung India
        [88.5, 21.8], [85, 19.5], [80.3, 15.8], [80.2, 13], [77.5, 8.1],
        [75, 12], [72.8, 19], [70, 21], [69, 22.5], [67, 24.8], [61.5, 25.2],
        [61.5, 36.5], [49, 40], [38, 45], [32, 47], [30, 52]
      ]
    },
    // Sakhalin
    {
      name: "Sakhalin",
      pts: [
        [142.2, 54], [143.5, 53.5], [143.2, 46.5], [141.9, 47]
      ]
    },
    // JEPANG (4 Pulau Utama Akurat: Hokkaido, Honshu Melengkung, Shikoku, Kyushu)
    {
      name: "Jepang (Hokkaido)",
      pts: [
        [140.0, 41.5], [141.2, 42.0], [143.3, 42.0], [145.6, 43.3], [145.2, 44.2],
        [141.9, 45.5], [141.4, 44.0], [140.3, 42.5]
      ]
    },
    {
      name: "Jepang (Honshu & Shikoku)",
      pts: [
        [140.8, 41.4], [142.0, 39.8], [141.0, 38.2], [140.8, 36.5], [140.8, 35.7],
        [139.8, 35.3], [138.9, 34.7], [136.9, 34.4], [135.8, 33.5], [134.5, 33.8],
        [133.0, 33.0], [131.0, 33.9], [131.8, 34.8], [133.2, 35.5], [135.5, 35.7],
        [136.8, 37.3], [138.5, 37.8], [139.8, 39.2], [140.2, 41.1]
      ]
    },
    {
      name: "Jepang (Kyushu)",
      pts: [
        [130.8, 33.8], [131.8, 33.2], [131.4, 31.4], [130.3, 31.2], [129.6, 32.8], [130.2, 33.6]
      ]
    },
    // Taiwan
    {
      name: "Taiwan",
      pts: [
        [120.2, 22.8], [120.9, 21.9], [121.6, 23.8], [121.9, 25.1], [121.0, 24.8]
      ]
    },
    // Sri Lanka
    {
      name: "Sri Lanka",
      pts: [
        [79.8, 9.5], [81.8, 7.5], [81.0, 6.0], [79.8, 6.8]
      ]
    },
    // INDONESIA & NUSANTARA (Sumatera, Jawa, Bali-NTB-NTT, Kalimantan, Sulawesi bentuk K, Maluku, Papua)
    {
      name: "Indonesia (Sumatera)",
      pts: [
        [95.3, 5.6], [97.6, 5.2], [99.8, 3.2], [103.5, 0.8], [104.8, -1.8],
        [105.9, -4.5], [105.7, -5.9], [104.2, -5.6], [102.2, -3.8], [100.3, -1.0],
        [98.6, 1.5], [96.0, 4.0]
      ]
    },
    {
      name: "Indonesia (Jawa)",
      pts: [
        [105.3, -6.7], [106.0, -5.9], [108.5, -6.4], [110.5, -6.5], [112.7, -7.1],
        [114.4, -7.8], [114.3, -8.6], [111.5, -8.3], [108.8, -7.7], [106.4, -7.4]
      ]
    },
    {
      name: "Indonesia (Bali & Nusa Tenggara)",
      pts: [
        [114.6, -8.1], [117.5, -8.3], [121.5, -8.3], [125.0, -8.8], [124.2, -10.2],
        [119.5, -9.8], [115.2, -8.8]
      ]
    },
    {
      name: "Indonesia (Kalimantan / Borneo)",
      pts: [
        [109.0, 0.8], [110.5, 1.6], [113.5, 3.2], [115.5, 5.2], [117.6, 6.8],
        [119.1, 5.1], [117.8, 3.5], [118.9, 1.0], [117.5, -1.2], [116.2, -3.8],
        [114.5, -4.1], [111.8, -3.5], [110.0, -2.5], [109.2, -0.5]
      ]
    },
    {
      name: "Indonesia (Sulawesi)",
      pts: [
        [119.4, -5.5], [118.9, -3.2], [119.8, -0.5], [120.5, 1.1], [125.1, 1.6],
        [124.8, 0.6], [121.2, 0.4], [120.6, -1.4], [123.3, -1.0], [123.2, -2.0],
        [121.5, -2.2], [122.8, -4.0], [122.2, -5.4], [120.8, -3.5], [120.3, -5.5]
      ]
    },
    {
      name: "Indonesia (Maluku & Halmahera)",
      pts: [
        [127.4, 2.0], [128.7, 1.5], [128.4, -0.8], [127.3, -0.6],
        [128.0, -3.0], [130.6, -3.2], [130.5, -3.8], [127.9, -3.6]
      ]
    },
    {
      name: "Indonesia (Papua & PNG)",
      pts: [
        [130.8, -0.9], [134.2, -0.8], [136.0, -1.8], [141.0, -2.6], [145.8, -4.2],
        [148.0, -6.5], [150.6, -10.2], [147.2, -9.8], [143.5, -8.2], [141.0, -9.1],
        [137.8, -8.3], [138.6, -5.5], [135.0, -4.2], [132.2, -2.8], [131.2, -1.8]
      ]
    },
    // Filipina (Luzon & Mindanao)
    {
      name: "Filipina (Luzon)",
      pts: [
        [120.2, 18.4], [122.3, 18.3], [122.4, 15.0], [124.0, 13.0], [122.5, 13.2],
        [120.8, 14.2], [119.9, 16.2]
      ]
    },
    {
      name: "Filipina (Visayas & Mindanao)",
      pts: [
        [122.2, 11.5], [125.6, 11.8], [126.5, 8.2], [125.5, 5.8], [122.0, 6.9], [123.0, 9.8]
      ]
    },
    // Australia & Tasmania
    {
      name: "Australia",
      pts: [
        [113.5, -22.2], [114.5, -21.8], [122.2, -17.5], [126.5, -14.0], [130.8, -12.2],
        [136.5, -12.0], [136.2, -15.5], [139.5, -17.5], [141.5, -15.0], [142.5, -10.8],
        [145.5, -15.5], [149.2, -21.0], [153.5, -26.5], [153.2, -31.5], [150.2, -37.2],
        [146.5, -38.8], [141.0, -38.2], [137.5, -35.0], [135.5, -34.8], [131.5, -31.5],
        [124.0, -33.8], [118.0, -35.0], [115.0, -34.2], [114.2, -28.0]
      ]
    },
    {
      name: "Tasmania",
      pts: [
        [144.8, -40.8], [148.2, -41.0], [147.5, -43.4], [145.5, -43.2]
      ]
    },
    // Selandia Baru (Pulau Utara & Pulau Selatan)
    {
      name: "Selandia Baru (Utara)",
      pts: [
        [173.0, -34.8], [175.8, -36.8], [178.4, -37.7], [175.5, -41.4], [174.0, -39.2]
      ]
    },
    {
      name: "Selandia Baru (Selatan)",
      pts: [
        [172.8, -40.8], [174.2, -41.6], [170.8, -45.8], [167.2, -46.2], [168.5, -44.0]
      ]
    }
  ];

  // Sabuk Seismik Dunia Nyata (Cincin Api Pasifik & Sabuk Alpide)
  const SEISMIC_BELTS = [
    [[94, 8], [100, 0], [106, -7], [118, -9], [128, -5], [126, 12], [138, 34], [145, 44], [162, 55]],
    [[-150, 61], [-124, 46], [-118, 34], [-104, 18], [-85, 10], [-77, -12], [-72, -33], [-74, -46]],
    [[14, 38], [29, 39], [48, 36], [68, 35], [86, 28], [97, 22]]
  ];

  // ===========================================================================
  // DATABASE 65+ NEGARA DUNIA NYATA (DETEKSI AKURAT SAAT KLIK KOORDINAT)
  // ===========================================================================
  // Diurutkan dari negara kepulauan/spesifik ke negara luas agar tidak pernah salah nama negara!
  const COUNTRY_BOUNDARIES = [
    // Asia Timur & Kepulauan
    { country: "Jepang", zone: "Sabuk Industri Pasifik (Honshu / Hokkaido / Kyushu)", latMin: 30.5, latMax: 45.8, lonMin: 129.3, lonMax: 146.0, tax: 0.23, carbon: 6.5, log: 11, price: 4200, fMod: 0.15, soil: "Tanah Vulkanik Kepulauan & Reklamasi Teluk Tahan Gempa (+15% pondasi).", res: "Pelabuhan laut dalam, jaringan listrik stabil, dan klaster OEM otomotif/semikonduktor.", rec: "Sangat unggul untuk kimia elektronik, serat karbon, dan komponen presisi Tier 3–4 (+18% harga).", bonus: { throughputMult: 1.14, purityBonus: 5.5, tier34PriceMult: 1.18 } },
    { country: "Korea Selatan", zone: "Klaster Petrokimia Ulsan & Yeosu", latMin: 33.8, latMax: 38.6, lonMin: 125.8, lonMax: 130.0, tax: 0.22, carbon: 5.5, log: 10, price: 3800, fMod: 0.08, soil: "Granit Semenanjung & Dermaga Industri Pesisir (+8% pondasi).", res: "Hub galangan kapal, pabrik baterai EV, dan layar OLED/semikonduktor.", rec: "Ideal untuk memproduksi katoda baterai, polimer ABS/PC, dan bahan kimia elektronik.", bonus: { throughputMult: 1.15, purityBonus: 4.5, tier34PriceMult: 1.15 } },
    { country: "Korea Utara", zone: "Zona Mineral & Batubara Pyongyang-Hamhung", latMin: 38.6, latMax: 43.0, lonMin: 124.2, lonMax: 130.7, tax: 0.15, carbon: 0.5, log: 16, price: 1200, fMod: 0.05, soil: "Pegunungan Batuan Metamorf & Antrasit.", res: "Kaya mineral magnesit, batubara, dan bijih logam.", rec: "Biaya lahan murah untuk pengolahan mineral dasar.", bonus: { throughputMult: 1.0, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "Taiwan", zone: "Koridor Semikonduktor Hsinchu & Kaohsiung", latMin: 21.8, latMax: 25.4, lonMin: 119.8, lonMax: 122.2, tax: 0.20, carbon: 4.8, log: 10, price: 3900, fMod: 0.14, soil: "Dataran Pesisir Barat & Sabuk Seismik Aktif (+14% pondasi).", res: "Pusat pengecoran wafer microchip terpadat di dunia.", rec: "Lokasi terbaik untuk memproduksi bahan kimia semikonduktor 11N dan wafer silikon.", bonus: { throughputMult: 1.12, purityBonus: 6.0, tier34PriceMult: 1.16 } },

    // Asia Tenggara (ASEAN)
    { country: "Singapura", zone: "Pulau Jurong Petrochemical Hub", latMin: 1.15, latMax: 1.48, lonMin: 103.6, lonMax: 104.1, tax: 0.17, carbon: 5.0, log: 6, price: 4500, fMod: 0.10, soil: "Lahan Reklamasi Terintegrasi Pipa Pulau Jurong.", res: "Persimpangan pelayaran minyak dunia Selat Malaka.", rec: "Logistik maritim tercepat di Asia dengan efisiensi ekspor tinggi.", bonus: { throughputMult: 1.16, purityBonus: 4.0, tier34PriceMult: 1.10 } },
    { country: "Malaysia", zone: "Kawasan Industri Pengerang, Gebeng & Bintulu", latMin: 1.48, latMax: 7.2, lonMin: 99.6, lonMax: 119.2, tax: 0.15, carbon: 2.0, log: 7, price: 1550, fMod: 0.12, soil: "Lempung Tropis Stabil & Pesisir Selat Malaka/Laut Cina Selatan.", res: "Kaya gas alam LNG Petronas, minyak bumi, dan oleokimia sawit.", rec: "Sangat strategis untuk pabrik petrokimia hulu, metanol, dan oleokimia.", bonus: { throughputMult: 1.10, purityBonus: 1.5, tier34PriceMult: 1.04 } },
    { country: "Indonesia", zone: "Kawasan Industri Nusantara (Jawa / Sumatera / Kalimantan / Sulawesi / Papua)", latMin: -11.2, latMax: 6.0, lonMin: 95.0, lonMax: 141.2, tax: 0.12, carbon: 1.5, log: 8, price: 1050, fMod: 0.20, soil: "Tanah Aluvial Pesisir & Vulkanik Cincin Api (+20% biaya pondasi tiang pancang).", res: "Melimpah gas alam, minyak, batubara, biomassa sawit, serta bijih nikel & bauksit.", rec: "Sangat direkomendasikan untuk kilang awal maupun smelter baterai EV dengan pajak KEK rendah (12%).", bonus: { throughputMult: 1.08, purityBonus: 1.0, tier34PriceMult: 1.02 } },
    { country: "Papua Nugini", zone: "Cekungan Gas & Mineral Port Moresby", latMin: -11.0, latMax: -1.5, lonMin: 141.2, lonMax: 156.0, tax: 0.16, carbon: 1.2, log: 13, price: 1150, fMod: 0.22, soil: "Pegunungan Tropis & Rawa Pesisir.", res: "Cadangan LNG dan tambang tembaga-emas.", rec: "Cocok untuk ekstraksi gas dan mineral dasar.", bonus: { throughputMult: 1.05, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "Filipina", zone: "Kawasan Industri Batangas & Bataan", latMin: 5.5, latMax: 18.8, lonMin: 119.5, lonMax: 126.8, tax: 0.16, carbon: 2.2, log: 10, price: 1300, fMod: 0.18, soil: "Kepulauan Vulkanik & Pesisir Laut Filipina (+18% pondasi).", res: "Akses pelabuhan laut dalam dan mineral nikel/tembaga.", rec: "Biaya tenaga kerja dan lahan kompetitif untuk manufaktur polimer.", bonus: { throughputMult: 1.06, purityBonus: 1.0, tier34PriceMult: 1.02 } },
    { country: "Vietnam", zone: "Zona Ekonomi Nghi Son, Dung Quat & Haiphong", latMin: 8.5, latMax: 23.3, lonMin: 105.2, lonMax: 109.6, tax: 0.14, carbon: 1.8, log: 8, price: 1250, fMod: 0.15, soil: "Delta Sungai Mekong & Sungai Merah.", res: "Pertumbuhan manufaktur elektronik dan tekstil tercepat di ASEAN.", rec: "Pajak ringan dan dekat dengan pasar ekspor Asia Timur.", bonus: { throughputMult: 1.09, purityBonus: 1.0, tier34PriceMult: 1.03 } },
    { country: "Thailand", zone: "Koridor Ekonomi Timur Map Ta Phut (Rayong)", latMin: 6.5, latMax: 20.4, lonMin: 97.5, lonMax: 105.5, tax: 0.15, carbon: 2.0, log: 8, price: 1450, fMod: 0.12, soil: "Dataran Pesisir Teluk Thailand.", res: "Pusat perakitan otomotif ASEAN, karet alam, dan bio-plastik singkong/tebu.", rec: "Sangat cocok untuk karet sintetis, polimer otomotif, dan bio-kimia PLA.", bonus: { throughputMult: 1.09, purityBonus: 1.5, tier34PriceMult: 1.05 } },
    { country: "Myanmar", zone: "Cekungan Gas Lepas Pantai & Yangon", latMin: 9.8, latMax: 28.0, lonMin: 92.2, lonMax: 101.0, tax: 0.14, carbon: 1.0, log: 12, price: 1000, fMod: 0.16, soil: "Lembah Sungai Irrawaddy.", res: "Pipa gas alam menuju Tiongkok dan mineral timah/logam tanah jarang.", rec: "Lahan sangat murah untuk ekstraksi hulu.", bonus: { throughputMult: 1.04, purityBonus: 0, tier34PriceMult: 1.0 } },

    // Asia Selatan & Timur
    { country: "Sri Lanka", zone: "Pelabuhan Colombo & Hambantota", latMin: 5.8, latMax: 9.9, lonMin: 79.5, lonMax: 82.0, tax: 0.15, carbon: 1.5, log: 9, price: 1200, fMod: 0.10, soil: "Batuan Kristalin Pulau Tropis.", res: "Posisi strategis jalur tanker Samudra Hindia dan karet alam.", rec: "Titik transit ekspor maritim ke Eropa dan Asia.", bonus: { throughputMult: 1.05, purityBonus: 0.5, tier34PriceMult: 1.0 } },
    { country: "Bangladesh", zone: "Zona Industri Chittagong & Dhaka", latMin: 21.5, latMax: 26.6, lonMin: 88.0, lonMax: 92.5, tax: 0.15, carbon: 1.2, log: 10, price: 1050, fMod: 0.25, soil: "Delta Sungai Gangga-Brahmaputra Sangat Lunak (+25% pondasi).", res: "Permintaan pupuk urea, pewarna tekstil, dan serat poliester masif.", rec: "Pasar lokal besar untuk bahan kimia tekstil dan pupuk.", bonus: { throughputMult: 1.06, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "India", zone: "Koridor Petrokimia & Farmasi Gujarat (Jamnagar / Dahej) & Mumbai", latMin: 8.0, latMax: 35.0, lonMin: 68.2, lonMax: 90.0, tax: 0.18, carbon: 2.5, log: 9, price: 1650, fMod: 0.08, soil: "Plato Deccan Basal & Dataran Pesisir Gujarat (+8% pondasi).", res: "Kompleks kilang minyak raksasa dan ibu kota produksi bahan aktif farmasi (API) dunia.", rec: "Sangat menguntungkan untuk produksi skala besar Tier 1–3, agrokimia, dan obat-obatan.", bonus: { throughputMult: 1.12, purityBonus: 2.0, tier34PriceMult: 1.06 } },
    { country: "Pakistan", zone: "Kawasan Industri Karachi & Gwadar", latMin: 23.8, latMax: 36.8, lonMin: 61.0, lonMax: 75.0, tax: 0.16, carbon: 1.5, log: 11, price: 1200, fMod: 0.10, soil: "Lembah Sungai Indus & Pesisir Laut Arab.", res: "Tambang garam batu Khewra (soda ash) dan gas alam.", rec: "Cocok untuk produksi soda ash, pupuk, dan kimia dasar.", bonus: { throughputMult: 1.06, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "Tiongkok", zone: "Klaster Mega-Kimia Yangtze (Shanghai / Ningbo) & Guangdong", latMin: 18.2, latMax: 50.0, lonMin: 75.0, lonMax: 134.5, tax: 0.19, carbon: 3.5, log: 8, price: 2400, fMod: 0.10, soil: "Dataran Aluvial Sungai Yangtze & Kuning (+10% pondasi).", res: "Produsen terbesar batubara-ke-kimia, polisilikon surya, baterai LFP, dan tanah jarang.", rec: "Kapasitas produksi raksasa (+16% throughput) untuk seluruh 300 produk kimia.", bonus: { throughputMult: 1.16, purityBonus: 3.0, tier34PriceMult: 1.10 } },
    { country: "Mongolia", zone: "Cekungan Tambang Gobi (Oyu Tolgoi)", latMin: 41.6, latMax: 52.0, lonMin: 87.8, lonMax: 119.8, tax: 0.14, carbon: 1.0, log: 18, price: 1100, fMod: 0.0, soil: "Stepa & Batuan Kontinental Kering.", res: "Tembaga, batubara kokas, dan fluorit (CaF₂) melimpah.", rec: "Sumber mineral fluorokimia darat, namun jauh dari pelabuhan laut.", bonus: { throughputMult: 1.05, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "Kazakhstan", zone: "Cekungan Minyak Tengiz & Mineral Steppe", latMin: 40.6, latMax: 55.4, lonMin: 46.5, lonMax: 87.3, tax: 0.15, carbon: 1.5, log: 14, price: 1350, fMod: 0.0, soil: "Dataran Stepa Kontinental Stabil.", res: "Kaya minyak mentah Kaspia, sulfur, kromium, dan uranium.", rec: "Pasokan minyak dan sulfur melimpah dengan biaya lahan murah.", bonus: { throughputMult: 1.10, purityBonus: 0.5, tier34PriceMult: 1.0 } },

    // Timur Tengah
    { country: "Uni Emirat Arab", zone: "Kompleks Kilang & Polimer Ruwais (Abu Dhabi / Jebel Ali)", latMin: 22.6, latMax: 26.2, lonMin: 51.5, lonMax: 56.4, tax: 0.09, carbon: 1.0, log: 4, price: 1800, fMod: 0.05, soil: "Pasir Pesisir Teluk & Pelabuhan Bebas Bea.", res: "Minyak & gas murah, pelabuhan kontainer Jebel Ali, dan modal investasi melimpah.", rec: "Pajak korporasi terendah (9%) dan logistik ekspor super cepat.", bonus: { throughputMult: 1.16, purityBonus: 2.0, tier34PriceMult: 1.05 } },
    { country: "Qatar", zone: "Kota Industri Ras Laffan & Mesaieed LNG/GTL", latMin: 24.5, latMax: 26.3, lonMin: 50.7, lonMax: 51.7, tax: 0.10, carbon: 0.9, log: 4, price: 1750, fMod: 0.0, soil: "Semenanjung Kapur Padat Teluk Persia.", res: "Ladang gas alam North Field terbesar di dunia.", rec: "Lokasi nomor satu untuk memproduksi amonia, metanol, helium, dan polietilena berbasis gas.", bonus: { throughputMult: 1.20, purityBonus: 1.5, tier34PriceMult: 1.02 } },
    { country: "Oman", zone: "Pelabuhan Industri Sohar & Duqm", latMin: 16.6, latMax: 24.5, lonMin: 52.0, lonMax: 59.9, tax: 0.12, carbon: 1.0, log: 5, price: 1450, fMod: 0.0, soil: "Batuan Ofiolit & Pesisir Laut Arab.", res: "Langsung menghadap Samudra Hindia tanpa harus melewati Selat Hormuz.", rec: "Akses kapal tanker bebas hambatan untuk ekspor ke Asia dan Afrika.", bonus: { throughputMult: 1.12, purityBonus: 0.5, tier34PriceMult: 1.0 } },
    { country: "Arab Saudi", zone: "Kota Industri Jubail & Yanbu", latMin: 16.5, latMax: 32.0, lonMin: 34.5, lonMax: 55.5, tax: 0.10, carbon: 0.8, log: 4, price: 1500, fMod: 0.0, soil: "Dataran Sabkha & Pasir Kapur Padat Stabil (+0% pondasi).", res: "Pipa minyak mentah & gas etana terhubung langsung dengan biaya logistik termurah di bumi ($4/dtk).", rec: "Surga bagi petrokimia Hulu & Midstream bervolume masif dengan pajak 10%.", bonus: { throughputMult: 1.18, purityBonus: 0.5, tier34PriceMult: 1.0 } },
    { country: "Irak", zone: "Ladang Minyak Basra & Khor Al-Zubair", latMin: 29.0, latMax: 37.3, lonMin: 38.8, lonMax: 48.6, tax: 0.13, carbon: 0.8, log: 7, price: 1200, fMod: 0.12, soil: "Dataran Aluvial Mesopotamia (Tigris-Efrat).", res: "Cadangan minyak mentah raksasa dan gas ikutan (associated gas) murah.", rec: "Bahan baku minyak sangat melimpah untuk kilang distilasi.", bonus: { throughputMult: 1.14, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "Iran", zone: "Zona Ekonomi Energi Pars Selatan (Assaluyeh & Bandar Imam)", latMin: 25.0, latMax: 39.8, lonMin: 44.0, lonMax: 63.3, tax: 0.13, carbon: 0.8, log: 6, price: 1300, fMod: 0.10, soil: "Lipatan Pegunungan Zagros & Pesisir Teluk (+10% pondasi, rawan gempa).", res: "Cadangan gas alam & kondensat terbesar kedua di dunia.", rec: "Produksi metanol, urea, dan etilena berbiaya bahan baku sangat rendah.", bonus: { throughputMult: 1.15, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "Turki", zone: "Klaster Industri Marmara (Izmit / Aliaga) & Ceyhan", latMin: 36.0, latMax: 42.1, lonMin: 26.0, lonMax: 44.8, tax: 0.18, carbon: 3.5, log: 9, price: 2100, fMod: 0.15, soil: "Patahan Anatolia Aktif & Selat Bosphorus (+15% pondasi tahan gempa).", res: "Jembatan pipa energi antara Timur Tengah/Kaspia menuju pasar Uni Eropa.", rec: "Lokasi strategis untuk mengekspor plastik dan serat sintetis ke Eropa maupun Timur Tengah.", bonus: { throughputMult: 1.10, purityBonus: 2.0, tier34PriceMult: 1.06 } },

    // Eropa
    { country: "Belanda & Belgia", zone: "Klaster Petrokimia Pelabuhan Rotterdam & Antwerpen (ARA Hub)", latMin: 50.5, latMax: 53.5, lonMin: 2.5, lonMax: 7.2, tax: 0.25, carbon: 11.0, log: 8, price: 5200, fMod: 0.12, soil: "Tanah Polder Pesisir Laut Utara (+12% pondasi tiang dalam).", res: "Terminal impor minyak/kimia terbesar di Eropa dengan jaringan pipa ARG ke Jerman dan Prancis.", rec: "Gerbang distribusi kimia nomor satu di Eropa; pasang Scrubber CCUS untuk menekan pajak karbon.", bonus: { throughputMult: 1.16, purityBonus: 5.5, tier34PriceMult: 1.20 } },
    { country: "Jerman", zone: "Lembah Kimia Ruhr, Ludwigshafen & Leuna", latMin: 47.3, latMax: 55.0, lonMin: 6.0, lonMax: 15.0, tax: 0.28, carbon: 12.0, log: 18, price: 5800, fMod: -0.10, soil: "Batuan Dasar Kontinental Stabil & Infrastruktur Chempark Siap Pakai (-10% pondasi).", res: "Koridor Sungai Rhein dan pusat rekayasa kimia & otomotif V8 presisi tertinggi di dunia.", rec: "Kemurnian +7% dan premi harga Tier 3–4 +25%, wajib memakai Scrubber Generasi 3–4!", bonus: { throughputMult: 1.12, purityBonus: 7.0, tier34PriceMult: 1.25 } },
    { country: "Inggris Raya", zone: "Klaster Industri Teesside, Grangemouth & Aberdeen", latMin: 50.0, latMax: 59.0, lonMin: -6.0, lonMax: 2.0, tax: 0.24, carbon: 9.5, log: 13, price: 4600, fMod: 0.0, soil: "Batuan Sedimen Kepulauan Stabil.", res: "Akses langsung minyak Brent & gas Laut Utara serta pusat riset farmasi.", rec: "Kuat untuk sintesis bahan aktif farmasi (API), katalis, dan komposit dirgantara.", bonus: { throughputMult: 1.10, purityBonus: 5.0, tier34PriceMult: 1.18 } },
    { country: "Irlandia", zone: "Klaster Bio-Farmasi Cork & Dublin", latMin: 51.4, latMax: 55.4, lonMin: -10.5, lonMax: -5.9, tax: 0.125, carbon: 8.5, log: 14, price: 4100, fMod: 0.0, soil: "Batu Kapur Karbon Pulau Hijau.", res: "Pajak korporasi paling rendah di Eropa Barat (12,5%) untuk industri farmasi & teknologi.", rec: "Surga pajak resmi Eropa untuk memproduksi obat-obatan API dan alat kesehatan Tier 3–4.", bonus: { throughputMult: 1.08, purityBonus: 5.5, tier34PriceMult: 1.16 } },
    { country: "Prancis", zone: "Koridor Kimia Lyon, Le Havre & Marseille-Fos", latMin: 42.3, latMax: 51.0, lonMin: -4.8, lonMax: 7.6, tax: 0.26, carbon: 10.5, log: 15, price: 4900, fMod: -0.05, soil: "Cekungan Paris & Lembah Rhone Stabil (-5% pondasi).", res: "Listrik tenaga nuklir bersih melimpah dan industri dirgantara Airbus Toulouse.", rec: "Ideal untuk komposit sayap pesawat, ban radial, dan kosmetik/kimia khusus.", bonus: { throughputMult: 1.11, purityBonus: 5.5, tier34PriceMult: 1.20 } },
    { country: "Spanyol & Portugal", zone: "Kompleks Petrokimia Tarragona, Huelva & Sines", latMin: 36.0, latMax: 43.8, lonMin: -9.5, lonMax: 3.3, tax: 0.22, carbon: 8.0, log: 12, price: 3700, fMod: 0.0, soil: "Meseta Iberia & Pelabuhan Mediterania-Atlantik.", res: "Terminal regasifikasi LNG terbesar di Eropa dan energi surya murah.", rec: "Biaya operasional lebih hemat dibanding Eropa Utara dengan akses dua samudra.", bonus: { throughputMult: 1.09, purityBonus: 3.5, tier34PriceMult: 1.12 } },
    { country: "Italia", zone: "Segitiga Industri Lembah Po (Milan / Porto Marghera) & Brindisi", latMin: 36.6, latMax: 47.0, lonMin: 6.6, lonMax: 18.5, tax: 0.24, carbon: 9.0, log: 14, price: 4300, fMod: 0.08, soil: "Dataran Lembah Po & Semenanjung Apennini (+8% pondasi).", res: "Pelopor teknologi proses polimer Spheripol dan supercar karbon-keramik.", rec: "Unggul untuk produksi polipropilena, mesin balap, dan rem karbon-keramik.", bonus: { throughputMult: 1.10, purityBonus: 4.5, tier34PriceMult: 1.18 } },
    { country: "Swiss & Austria", zone: "Klaster Life-Science Basel & Linz", latMin: 45.8, latMax: 49.0, lonMin: 5.9, lonMax: 17.2, tax: 0.19, carbon: 10.0, log: 19, price: 5400, fMod: -0.05, soil: "Batuan Granit Alpen Stabil.", res: "Tenaga kerja ilmuwan kimia farmasi terbaik di dunia.", rec: "Kemurnian tertinggi (+8%) untuk produk farmasi dan instrumen presisi.", bonus: { throughputMult: 1.06, purityBonus: 8.0, tier34PriceMult: 1.24 } },
    { country: "Norwegia", zone: "Hub Energi & Hidrogen Hijau Stavanger & Mongstad", latMin: 58.0, latMax: 71.2, lonMin: 4.5, lonMax: 31.0, tax: 0.22, carbon: 11.0, log: 13, price: 4800, fMod: -0.05, soil: "Perisai Batuan Granit Fjord Sangat Keras (-5% pondasi).", res: "Gas Laut Utara melimpah dan 98% listrik tenaga air (hydropower) murah.", rec: "Sangat efisien untuk proses elektrolisis, silikon, aluminium, dan amonia hijau.", bonus: { throughputMult: 1.14, purityBonus: 5.0, tier34PriceMult: 1.15 } },
    { country: "Swedia & Finlandia", zone: "Sabuk Bio-Refinery & Baja Hijau Gothenburg-Helsinki", latMin: 55.3, latMax: 70.0, lonMin: 11.0, lonMax: 31.5, tax: 0.20, carbon: 10.5, log: 14, price: 4400, fMod: -0.05, soil: "Perisai Baltik Prekambrium Stabil.", res: "Hutan selulosa melimpah, bijih besi murni, dan teknologi baterai hijau.", rec: "Terbaik untuk selulosa, bio-kimia, dan metalurgi khusus.", bonus: { throughputMult: 1.10, purityBonus: 5.0, tier34PriceMult: 1.16 } },
    { country: "Polandia & Eropa Tengah", zone: "Kawasan Industri Plock, Gdansk & Silesia", latMin: 49.0, latMax: 54.8, lonMin: 14.1, lonMax: 24.2, tax: 0.19, carbon: 7.5, log: 11, price: 2900, fMod: 0.0, soil: "Dataran Eropa Tengah Stabil.", res: "Biaya konstruksi dan pajak paling kompetitif di dalam pasar tunggal Uni Eropa.", rec: "Basis manufaktur kimia dan pupuk berbiaya efisien di jantung Eropa.", bonus: { throughputMult: 1.10, purityBonus: 3.0, tier34PriceMult: 1.10 } },
    { country: "Yunani & Balkan", zone: "Pelabuhan Piraeus, Thessaloniki & Ploiesti", latMin: 35.0, latMax: 48.0, lonMin: 19.0, lonMax: 29.5, tax: 0.18, carbon: 5.5, log: 11, price: 2400, fMod: 0.10, soil: "Pesisir Laut Aegea & Cekungan Danube.", res: "Hub perkapalan tanker Mediterania Timur dan bauksit alumina.", rec: "Titik distribusi maritim strategis antara Eropa, Afrika Utara, dan Laut Hitam.", bonus: { throughputMult: 1.07, purityBonus: 2.0, tier34PriceMult: 1.05 } },
    { country: "Ukraina", zone: "Cekungan Industri Dnieper & Odessa", latMin: 44.4, latMax: 52.4, lonMin: 22.1, lonMax: 40.2, tax: 0.16, carbon: 2.0, log: 12, price: 1500, fMod: 0.0, soil: "Tanah Hitam Chernozem & Perisai Kristalin.", res: "Kaya bijih besi, titanium, gas neon semikonduktor, dan amonia pertanian.", rec: "Sumber bahan baku pupuk dan gas mulia neon untuk laser litografi.", bonus: { throughputMult: 1.08, purityBonus: 1.0, tier34PriceMult: 1.02 } },
    { country: "Rusia", zone: "Cekungan Migas Siberia Barat, Tatarstan & Tobolsk", latMin: 42.0, latMax: 78.0, lonMin: 28.0, lonMax: 180.0, tax: 0.15, carbon: 1.0, log: 12, price: 1450, fMod: 0.15, soil: "Daratan Taiga & Zona Permafrost Siberia (+15% pondasi termal).", res: "Cadangan gas alam, minyak mentah, nikel, paladium, dan titanium raksasa.", rec: "Bahan baku gas, karet sintetis, dan logam katalis sangat murah.", bonus: { throughputMult: 1.14, purityBonus: 0.5, tier34PriceMult: 1.02 } },

    // Afrika
    { country: "Mesir", zone: "Zona Ekonomi Terusan Suez (Ain Sokhna) & Alexandria", latMin: 22.0, latMax: 31.6, lonMin: 25.0, lonMax: 35.0, tax: 0.15, carbon: 1.5, log: 6, price: 1400, fMod: 0.08, soil: "Delta Sungai Nil & Gurun Kapur Suez.", res: "Ladang gas Zohr Mediterania dan jalur langsung kapal kontainer Terusan Suez.", rec: "Lokasi emas untuk pabrik pupuk urea/amonia dan ekspor bebas hambatan ke Eropa & Asia.", bonus: { throughputMult: 1.11, purityBonus: 1.0, tier34PriceMult: 1.02 } },
    { country: "Maroko & Aljazair", zone: "Kompleks Fosfat Jorf Lasfar & Skikda LNG", latMin: 20.0, latMax: 37.1, lonMin: -13.0, lonMax: 11.5, tax: 0.15, carbon: 1.5, log: 8, price: 1350, fMod: 0.05, soil: "Dataran Pesisir Atlantik & Pegunungan Atlas.", res: "Menguasai 70% cadangan batuan fosfat dunia (bahan baku asam fosfat & baterai LFP) plus gas alam.", rec: "Lokasi terbaik di dunia untuk memproduksi Asam Fosfat, Pupuk DAP/NPK, dan Katoda LFP!", bonus: { throughputMult: 1.13, purityBonus: 1.5, tier34PriceMult: 1.04 } },
    { country: "Nigeria", zone: "Zona Bebas Lekki (Lagos) & Delta Niger", latMin: 4.2, latMax: 13.9, lonMin: 2.7, lonMax: 14.7, tax: 0.14, carbon: 0.9, log: 9, price: 1150, fMod: 0.18, soil: "Rawa Bakau Delta Niger & Pesisir Teluk Guinea (+18% pondasi).", res: "Minyak mentah Bonny Light rendah sulfur dan gas alam melimpah.", rec: "Modal lahan awal sangat terjangkau untuk kilang distilasi dan pupuk Afrika Barat.", bonus: { throughputMult: 1.10, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "Afrika Selatan", zone: "Kompleks Sintesis Sasolburg, Secunda & Durban", latMin: -35.0, latMax: -22.1, lonMin: 16.4, lonMax: 33.0, tax: 0.18, carbon: 3.0, log: 11, price: 1750, fMod: 0.0, soil: "Kraton Kaapvaal Sangat Tua & Stabil (+0% pondasi).", res: "Produsen terbesar logam grup platina (Pt, Pd, Rh) dunia dan pelopor teknologi Fischer-Tropsch.", rec: "Sangat unggul untuk memproduksi katalis logam mulia, bahan bakar sintetis, dan sel bahan bakar.", bonus: { throughputMult: 1.10, purityBonus: 3.0, tier34PriceMult: 1.10 } },
    { country: "Kenya & Tanzania", zone: "Koridor Pelabuhan Mombasa & Dar es Salaam", latMin: -11.7, latMax: 4.6, lonMin: 29.5, lonMax: 41.9, tax: 0.15, carbon: 1.0, log: 10, price: 1100, fMod: 0.08, soil: "Lembah Celah Besar (Rift Valley) & Pesisir Samudra Hindia.", res: "Energi panas bumi (geothermal) murah, soda ash Danau Magadi, dan grafit.", rec: "Listrik hijau murah untuk industri kimia Afrika Timur.", bonus: { throughputMult: 1.06, purityBonus: 0.5, tier34PriceMult: 1.0 } },

    // Amerika Utara & Tengah
    { country: "Kanada", zone: "Cekungan Oil Sands Alberta (Edmonton) & Sarnia Ontario", latMin: 49.0, latMax: 75.0, lonMin: -140.0, lonMax: -52.5, tax: 0.20, carbon: 6.5, log: 11, price: 2900, fMod: 0.05, soil: "Perisai Kanada (Canadian Shield) & Cekungan Sedimen Barat.", res: "Cadangan minyak berat, gas etana murah, kalium (potash), nikel, dan listrik hidro.", rec: "Sangat kuat untuk petrokimia berbasis etana, pupuk kalium, dan pemurnian logam baterai.", bonus: { throughputMult: 1.14, purityBonus: 3.5, tier34PriceMult: 1.10 } },
    { country: "Amerika Serikat", zone: "Pesisir Teluk Texas/Louisiana (Houston) & Koridor Industri AS", latMin: 24.5, latMax: 49.0, lonMin: -125.0, lonMax: -66.9, tax: 0.21, carbon: 4.5, log: 11, price: 3200, fMod: 0.05, soil: "Dataran Pesisir Teluk & Kontinental Stabil (+5% pondasi).", res: "Jaringan pipa shale gas Permian raksasa, hub dirgantara NASA/Boeing, dan pasar teknologi terbesar.", rec: "Throughput +18% dan harga jual tinggi untuk seluruh produk Tier 2 hingga Tier 4 (Roket & Mesin V8).", bonus: { throughputMult: 1.18, purityBonus: 3.0, tier34PriceMult: 1.12 } },
    { country: "Meksiko", zone: "Koridor Petrokimia Coatzacoalcos (Veracruz) & Monterrey", latMin: 14.5, latMax: 32.5, lonMin: -117.1, lonMax: -86.7, tax: 0.17, carbon: 2.2, log: 9, price: 1650, fMod: 0.10, soil: "Teluk Campeche & Dataran Tinggi Meksiko.", res: "Minyak mentah Maya, perak, fluorit terbesar dunia, dan rantai pasok otomotif USMCA.", rec: "Biaya produksi hemat dengan akses langsung bebas tarif ke pasar Amerika Utara.", bonus: { throughputMult: 1.10, purityBonus: 1.5, tier34PriceMult: 1.05 } },
    { country: "Panama & Kosta Rika", zone: "Zona Logistik Terusan Panama & Colon", latMin: 7.2, latMax: 11.2, lonMin: -85.9, lonMax: -77.2, tax: 0.12, carbon: 1.5, log: 6, price: 1600, fMod: 0.14, soil: "Tanah Genting Vulkanik Tropis.", res: "Titik temu pelayaran Samudra Pasifik dan Samudra Atlantik.", rec: "Ongkos pengapalan FOB/CIF sangat murah ke pantai timur maupun barat dunia.", bonus: { throughputMult: 1.08, purityBonus: 1.5, tier34PriceMult: 1.04 } },

    // Amerika Selatan
    { country: "Venezuela & Kolombia", zone: "Cekungan Minyak Maracaibo, Orinoco & Cartagena", latMin: -2.0, latMax: 12.5, lonMin: -79.0, lonMax: -59.8, tax: 0.15, carbon: 1.2, log: 9, price: 1200, fMod: 0.12, soil: "Pesisir Karibia & Cekungan Lembah Orinoco.", res: "Cadangan minyak bumi terbukti terbesar di belahan bumi barat.", rec: "Bahan baku minyak mentah dan nafta berlimpah dengan harga dasar sangat murah.", bonus: { throughputMult: 1.12, purityBonus: 0, tier34PriceMult: 1.0 } },
    { country: "Cile", zone: "Gurun Atacama (Antofagasta) & Concepcion", latMin: -55.0, latMax: -17.5, lonMin: -75.6, lonMax: -67.0, tax: 0.18, carbon: 3.0, log: 12, price: 1850, fMod: 0.16, soil: "Salares Gurun Kering & Patahan Subduksi Andes (+16% pondasi tahan gempa).", res: "Cadangan garam Litium, Tembaga, Iodin, dan Kalium Nitrat terkaya di planet bumi!", rec: "Lokasi wajib jika Anda ingin mendominasi produksi Litium Hidroksida dan Baterai EV!", bonus: { throughputMult: 1.12, purityBonus: 2.5, tier34PriceMult: 1.08 } },
    { country: "Peru", zone: "Pelabuhan Callao & Tambang Mineral Andes", latMin: -18.3, latMax: -3.4, lonMin: -81.3, lonMax: -68.7, tax: 0.16, carbon: 1.8, log: 11, price: 1350, fMod: 0.16, soil: "Pesisir Pasifik Kering & Pegunungan Andes.", res: "Kaya seng, tembaga, perak, batuan fosfat Bayovar, dan gas Camisea.", rec: "Cocok untuk pengolahan asam sulfat smelter dan pupuk fosfat.", bonus: { throughputMult: 1.08, purityBonus: 1.0, tier34PriceMult: 1.02 } },
    { country: "Brasil", zone: "Kompleks Petrokimia Camacari, Cubatao (Santos) & Triunfo", latMin: -33.7, latMax: 5.2, lonMin: -73.9, lonMax: -34.8, tax: 0.19, carbon: 2.5, log: 10, price: 1700, fMod: 0.08, soil: "Perisai Brasilia & Pesisir Atlantik (+8% pondasi).", res: "Minyak laut dalam Pre-Salt, raksasa bio-etanol tebu (polietilena hijau), dan bijih besi/niobium.", rec: "Raja bio-kimia hijau dan pasar agribisnis terbesar di Amerika Selatan.", bonus: { throughputMult: 1.11, purityBonus: 1.5, tier34PriceMult: 1.05 } },
    { country: "Argentina", zone: "Klaster Bahia Blanca & Cekungan Shale Vaca Muerta", latMin: -55.0, latMax: -21.8, lonMin: -73.5, lonMax: -53.6, tax: 0.17, carbon: 1.8, log: 11, price: 1400, fMod: 0.05, soil: "Dataran Pampas & Patagonia Stabil.", res: "Cadangan shale gas Vaca Muerta raksasa dan litium Puna.", rec: "Umpan gas etana dan litium melimpah dengan lahan luas.", bonus: { throughputMult: 1.09, purityBonus: 1.0, tier34PriceMult: 1.02 } },

    // Oseania
    { country: "Australia", zone: "Kompleks Mineral & LNG Pilbara / Kwinana & Gladstone", latMin: -43.7, latMax: -10.5, lonMin: 112.9, lonMax: 153.7, tax: 0.25, carbon: 7.5, log: 14, price: 4200, fMod: 0.0, soil: "Kraton Batuan Besi Purba Sangat Keras & Stabil (+0% pondasi, bebas gempa).", res: "Eksportir terbesar bijih litium spodumene, besi, bauksit, zirkon, titanium rutil, dan LNG.", rec: "Terbaik untuk metalurgi presisi Tier 4 (+15% harga jual), titanium, dan prekursor baterai.", bonus: { throughputMult: 1.10, purityBonus: 3.5, tier34PriceMult: 1.15 } },
    { country: "Selandia Baru", zone: "Taranaki Gas-Methanol & Geothermal Hub", latMin: -47.3, latMax: -34.0, lonMin: 166.4, lonMax: 178.6, tax: 0.22, carbon: 6.5, log: 15, price: 3400, fMod: 0.14, soil: "Pegunungan Vulkanik Pasifik (+14% pondasi).", res: "Listrik hidro & panas bumi bersih serta pabrik metanol ramah lingkungan.", rec: "Kemurnian air dan udara tinggi untuk produk bioteknologi dan metanol hijau.", bonus: { throughputMult: 1.07, purityBonus: 4.0, tier34PriceMult: 1.08 } }
  ];

  // 5 Lokasi Benchmark Pintasan Cepat
  const PRESET_REGIONS = [
    {
      id: "batam",
      name: "Kawasan Industri Pesisir Jawa / Batam",
      country: "Indonesia",
      shortName: "Indonesia (Jawa/Batam)",
      lat: -6.2,
      lon: 106.8,
      landBasePrice: 1000,
      foundationMod: 0.20,
      corporateTaxRate: 0.12,
      carbonTaxPerTon: 1.5,
      logisticsCostPerSec: 8,
      expansionLevyBase: 650,
      expansionLevyGrowth: 2.2,
      bonuses: { throughputMult: 1.08, purityBonus: 1.0, tier34PriceMult: 1.02 },
      summaryTag: "Indonesia • Modal Awal Rendah • Pajak 12%"
    },
    {
      id: "jubail",
      name: "Kota Industri Jubail (Teluk Persia)",
      country: "Arab Saudi",
      shortName: "Arab Saudi (Jubail)",
      lat: 27.0,
      lon: 49.6,
      landBasePrice: 1500,
      foundationMod: 0.0,
      corporateTaxRate: 0.10,
      carbonTaxPerTon: 0.8,
      logisticsCostPerSec: 4,
      expansionLevyBase: 800,
      expansionLevyGrowth: 2.2,
      bonuses: { throughputMult: 1.18, purityBonus: 0.5, tier34PriceMult: 1.0 },
      summaryTag: "Arab Saudi • Logistik Termurah • Pajak 10%"
    },
    {
      id: "tokyo",
      name: "Sabuk Industri Teluk Tokyo & Chiba",
      country: "Jepang",
      shortName: "Jepang (Tokyo-Chiba)",
      lat: 35.6,
      lon: 139.9,
      landBasePrice: 4200,
      foundationMod: 0.15,
      corporateTaxRate: 0.23,
      carbonTaxPerTon: 6.5,
      logisticsCostPerSec: 11,
      expansionLevyBase: 1600,
      expansionLevyGrowth: 2.2,
      bonuses: { throughputMult: 1.14, purityBonus: 5.5, tier34PriceMult: 1.18 },
      summaryTag: "Jepang • Semikonduktor & Serat Karbon • +18% Harga"
    },
    {
      id: "texas",
      name: "Pesisir Teluk Texas AS (Houston)",
      country: "Amerika Serikat",
      shortName: "AS (Texas Gulf)",
      lat: 29.7,
      lon: -95.0,
      landBasePrice: 3200,
      foundationMod: 0.05,
      corporateTaxRate: 0.21,
      carbonTaxPerTon: 4.5,
      logisticsCostPerSec: 11,
      expansionLevyBase: 1400,
      expansionLevyGrowth: 2.2,
      bonuses: { throughputMult: 1.18, purityBonus: 3.0, tier34PriceMult: 1.12 },
      summaryTag: "Amerika Serikat • Hub Petrokimia & Roket • +18% Flow"
    },
    {
      id: "ruhr",
      name: "Lembah Kimia Ruhr & Rhine",
      country: "Jerman",
      shortName: "Jerman (Ruhr)",
      lat: 51.4,
      lon: 6.8,
      landBasePrice: 5800,
      foundationMod: -0.10,
      corporateTaxRate: 0.28,
      carbonTaxPerTon: 12.0,
      logisticsCostPerSec: 18,
      expansionLevyBase: 2200,
      expansionLevyGrowth: 2.3,
      bonuses: { throughputMult: 1.12, purityBonus: 7.0, tier34PriceMult: 1.25 },
      summaryTag: "Jerman • Kemurnian +7% • Premi OEM +25%"
    }
  ];

  function pointInPoly(lon, lat, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i][0], yi = pts[i][1];
      const xj = pts[j][0], yj = pts[j][1];
      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / ((yj - yi) || 1e-7) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function getMinFaultDistDeg(lat, lon) {
    let minD = 999;
    SEISMIC_BELTS.forEach((chain) => {
      chain.forEach((pt) => {
        const d = Math.hypot(lon - pt[0], lat - pt[1]);
        if (d < minD) minD = d;
      });
    });
    return minD;
  }

  // Evaluasi Geografi & Deteksi Negara Akurat untuk Titik Manapun di Dunia
  function evaluateWorldCoordinate(lat, lon, customId) {
    const clampedLat = Math.max(-78, Math.min(82, Number(lat.toFixed(2))));
    const clampedLon = Math.max(-179.9, Math.min(179.9, Number(lon.toFixed(2))));

    let matchedPoly = null;
    for (let i = 0; i < WORLD_LAND_POLYGONS.length; i++) {
      if (pointInPoly(clampedLon, clampedLat, WORLD_LAND_POLYGONS[i].pts)) {
        matchedPoly = WORLD_LAND_POLYGONS[i];
        break;
      }
    }

    // Cek di tabel 55+ Negara Spesifik
    let matchedCountry = null;
    for (let i = 0; i < COUNTRY_BOUNDARIES.length; i++) {
      const cb = COUNTRY_BOUNDARIES[i];
      if (clampedLat >= cb.latMin && clampedLat <= cb.latMax && clampedLon >= cb.lonMin && clampedLon <= cb.lonMax) {
        matchedCountry = cb;
        break;
      }
    }

    // Jika poligon daratan cocok pada pulau kepulauan (misal Jepang, Indonesia, Inggris, Selandia Baru, Taiwan, Filipina), prioritaskan daratan meskipun klik tipis di tepi pantai!
    const isIslandCountry = matchedCountry && ["Jepang", "Indonesia", "Taiwan", "Filipina", "Singapura", "Inggris Raya", "Irlandia", "Selandia Baru", "Sri Lanka"].includes(matchedCountry.country);
    const isOffshore = !matchedPoly && !isIslandCountry;

    const latStr = Math.abs(clampedLat).toFixed(2).replace(".", ",") + (clampedLat >= 0 ? "°LU" : "°LS");
    const lonStr = Math.abs(clampedLon).toFixed(2).replace(".", ",") + (clampedLon >= 0 ? "°BT" : "°BB");
    const coordLabel = `${latStr}, ${lonStr}`;

    const faultDist = getMinFaultDistDeg(clampedLat, clampedLon);
    let seismicCategory = "RENDAH (Kraton Stabil)";
    let seismicHazardPct = 5;
    if (faultDist < 7) {
      seismicCategory = "EKSTREM (Zona Megathrust / Cincin Api)";
      seismicHazardPct = 42;
    } else if (faultDist < 15) {
      seismicCategory = "TINGGI (Sabuk Seismik Aktif)";
      seismicHazardPct = 26;
    } else if (faultDist < 26) {
      seismicCategory = "SEDANG (Tremor Regional)";
      seismicHazardPct = 14;
    }

    let countryName = "Wilayah Kontinental";
    let zoneTitle = "Kawasan Industri Daratan";
    let landBasePrice = 1500;
    let foundationMod = 0.10;
    let corporateTaxRate = 0.16;
    let carbonTaxPerTon = 2.2;
    let logisticsCostPerSec = 9;
    let soilDesc = "Lempung Aluvial & Batuan Sedimen Daratan.";
    let resourceDesc = "Akses jaringan pipa regional dan air pendingin sungai.";
    let recDesc = "Cocok untuk pabrik kimia terintegrasi Hulu hingga Midstream.";
    let bonuses = { throughputMult: 1.06, purityBonus: 1.0, tier34PriceMult: 1.02 };

    if (isOffshore) {
      const seaName =
        (clampedLon >= 95 && clampedLon <= 142 && clampedLat >= -12 && clampedLat <= 15) ? "Laut Natuna & Perairan Indonesia" :
        (clampedLon >= 128 && clampedLon <= 148 && clampedLat >= 28 && clampedLat <= 46) ? "Perairan Lepas Pantai Jepang" :
        (clampedLon >= 47 && clampedLon <= 60 && clampedLat >= 22 && clampedLat <= 31) ? "Lepas Pantai Teluk Persia" :
        (clampedLon >= -98 && clampedLon <= -82 && clampedLat >= 18 && clampedLat <= 30) ? "Lepas Pantai Teluk Meksiko AS" :
        (clampedLon >= -5 && clampedLon <= 12 && clampedLat >= 51 && clampedLat <= 65) ? "Lepas Pantai Laut Utara Eropa" :
        (clampedLat > 65) ? "Samudra Arktik" :
        (clampedLon >= 20 && clampedLon <= 120 && clampedLat < 25) ? "Samudra Hindia" :
        (clampedLon >= -70 && clampedLon <= 20) ? "Samudra Atlantik" : "Samudra Pasifik";

      countryName = `ZEE / Lepas Pantai (${seaName})`;
      zoneTitle = `Anjungan Kilang Lepas Pantai FPSO — ${seaName}`;
      landBasePrice = 1700;
      foundationMod = 0.35;
      corporateTaxRate = 0.11;
      carbonTaxPerTon = 1.2;
      logisticsCostPerSec = 6;
      soilDesc = "Anjungan Lepas Pantai (Seabed Mooring & Jacket Platform). Biaya konstruksi struktur laut +35%.";
      resourceDesc = "Air pendingin laut tak terbatas (0 km) & sumur migas bawah laut langsung di bawah platform.";
      recDesc = "Bebas pajak tanah darat dan pasokan hidrokarbon hulu kencang (+16% flow), waspadai badai gelombang laut.";
      bonuses = { throughputMult: 1.16, purityBonus: 0.5, tier34PriceMult: 1.0 };
    } else if (matchedCountry) {
      countryName = matchedCountry.country;
      zoneTitle = `${matchedCountry.country} — ${matchedCountry.zone}`;
      landBasePrice = matchedCountry.price;
      foundationMod = matchedCountry.fMod;
      corporateTaxRate = matchedCountry.tax;
      carbonTaxPerTon = matchedCountry.carbon;
      logisticsCostPerSec = matchedCountry.log;
      soilDesc = matchedCountry.soil;
      resourceDesc = matchedCountry.res;
      recDesc = matchedCountry.rec;
      bonuses = matchedCountry.bonus;
    } else if (matchedPoly) {
      countryName = matchedPoly.name;
      zoneTitle = `Kawasan Industri ${matchedPoly.name}`;
    }

    const hash = Math.abs(Math.sin(clampedLat * 12.9898 + clampedLon * 78.233) * 43758.5453);
    const microFrac = hash - Math.floor(hash);
    const finalLandPrice = Math.round(landBasePrice * (0.92 + microFrac * 0.18));
    const finalFoundMod = Number((foundationMod + (microFrac - 0.5) * 0.06).toFixed(2));
    const id = customId || `coord_${clampedLat.toFixed(1)}_${clampedLon.toFixed(1)}`.replace(/[^a-zA-Z0-9_-]/g, "_");

    return {
      id: id,
      name: `${zoneTitle} (${coordLabel})`,
      shortName: `${countryName} (${latStr})`,
      country: countryName,
      lat: clampedLat,
      lon: clampedLon,
      coordLabel: coordLabel,
      isOffshore: isOffshore,
      seismicCategory: seismicCategory,
      seismicHazardPct: seismicHazardPct,
      landBasePrice: finalLandPrice,
      foundationMod: finalFoundMod,
      corporateTaxRate: corporateTaxRate,
      carbonTaxPerTon: carbonTaxPerTon,
      logisticsCostPerSec: logisticsCostPerSec,
      expansionLevyBase: Math.round(finalLandPrice * 0.55),
      expansionLevyGrowth: 2.15,
      bonuses: bonuses,
      summaryTag: `${countryName} • Pajak ${Math.round(corporateTaxRate * 100)}% • Seismik: ${seismicHazardPct}%`,
      surveyReport: {
        soil: soilDesc,
        resources: resourceDesc,
        risk: `Risiko Geoteknik & Seismik: ${seismicCategory} (Indeks Kerawanan ${seismicHazardPct}%). ${
          isOffshore ? "Waspadai badai laut dan korosi garam." : "Perhatikan kestabilan pondasi reaktor."
        }`,
        recommendation: recDesc
      }
    };
  }

  // PEMASOK BAHAN BAKU GLOBAL
  const SUPPLIERS = [
    {
      id: "SUP-ARAMCO",
      name: "Aramco Ras Tanura Hydrocarbon",
      country: "Arab Saudi",
      lat: 26.6,
      lon: 50.1,
      feedstockIds: ["RAW-CRUDE", "RAW-GAS"],
      grade: "Grade A",
      purity: 96,
      priceMult: 1.15,
      reliability: 0.98,
      desc: "Minyak mentah Arabian Light & gas etana kemurnian ultra-tinggi rendah sulfur."
    },
    {
      id: "SUP-PERTAMINA",
      name: "Nusantara Petro-Mineral Hub (Balikpapan/Gresik)",
      country: "Indonesia",
      lat: -1.2,
      lon: 116.8,
      feedstockIds: ["RAW-CRUDE", "RAW-GAS", "RAW-BIO", "RAW-MINERAL"],
      grade: "Grade B",
      purity: 86,
      priceMult: 0.92,
      reliability: 0.93,
      desc: "Pemasok regional minyak, gas LNG, oleokimia sawit, dan mineral dengan jarak dekat ke Asia Tenggara."
    },
    {
      id: "SUP-URAL",
      name: "Novorossiysk Bulk Discount Trader",
      country: "Rusia",
      lat: 44.7,
      lon: 37.7,
      feedstockIds: ["RAW-CRUDE", "RAW-GAS", "RAW-MINERAL"],
      grade: "Grade C",
      purity: 73,
      priceMult: 0.65,
      reliability: 0.82,
      desc: "Bahan baku diskon sangat murah, tetapi Grade C (kadar pengotor & sulfur tinggi, butuh alat canggih)."
    },
    {
      id: "SUP-TEXAS",
      name: "Permian Gulf Shale & Chemical Corp",
      country: "Amerika Serikat",
      lat: 29.3,
      lon: -94.8,
      feedstockIds: ["RAW-GAS", "RAW-CRUDE", "RAW-BIO"],
      grade: "Grade A",
      purity: 95,
      priceMult: 1.12,
      reliability: 0.97,
      desc: "Umpan gas etana/propana murni dan kondensat shale standar kilang Amerika Utara."
    },
    {
      id: "SUP-PILBARA",
      name: "Pilbara & Kwinana Strategic Metals",
      country: "Australia",
      lat: -20.3,
      lon: 118.6,
      feedstockIds: ["RAW-METAL", "RAW-MINERAL"],
      grade: "Grade A",
      purity: 97,
      priceMult: 1.20,
      reliability: 0.98,
      desc: "Bijih litium spodumene, titanium rutil, nikel, dan logam murni kelas dirgantara & baterai."
    },
    {
      id: "SUP-ATACAMA",
      name: "Atacama Brine & Andean Minerals",
      country: "Cile",
      lat: -23.6,
      lon: -70.4,
      feedstockIds: ["RAW-METAL", "RAW-MINERAL"],
      grade: "Grade B",
      purity: 88,
      priceMult: 0.95,
      reliability: 0.91,
      desc: "Garam litium karbonat, tembaga, nitrat, dan iodin dari gurun Atacama."
    },
    {
      id: "SUP-RHINE",
      name: "Rhine-Antwerp Specialty Feedstocks",
      country: "Jerman",
      lat: 51.2,
      lon: 4.4,
      feedstockIds: ["RAW-MINERAL", "RAW-BIO", "RAW-METAL"],
      grade: "Grade A",
      purity: 98,
      priceMult: 1.28,
      reliability: 0.99,
      desc: "Prekursor kimia farmasi, fluorit murni, dan logam katalis Pt/Pd bersertifikat ISO Eropa."
    },
    {
      id: "SUP-LAGOS",
      name: "West Africa Delta Crude & Phosphate",
      country: "Nigeria / Maroko",
      lat: 6.4,
      lon: 3.4,
      feedstockIds: ["RAW-CRUDE", "RAW-MINERAL", "RAW-BIO"],
      grade: "Grade C",
      purity: 76,
      priceMult: 0.72,
      reliability: 0.85,
      desc: "Minyak mentah Bonny Light dan batuan fosfat mentah harga hemat."
    }
  ];

  // NEGARA TUJUAN EKSPOR
  const EXPORT_DESTINATIONS = [
    { id: "DEST-TOKYO", name: "Tokyo & Yokohama High-Tech OEM", country: "Jepang", lat: 35.4, lon: 139.6, customsDuty: 0.06, priceBonus: 1.18, preferredTier: 3, desc: "Permintaan tinggi untuk polimer elektronik, wafer semikonduktor, dan baterai EV." },
    { id: "DEST-HAMBURG", name: "Hamburg & Stuttgart Automotive Hub", country: "Jerman", lat: 53.5, lon: 9.9, customsDuty: 0.14, priceBonus: 1.26, preferredTier: 4, desc: "Membayar harga premium tertinggi untuk komponen mesin V8, serat karbon, dan katalis." },
    { id: "DEST-SHANGHAI", name: "Shanghai & Ningbo Mega-Manufacturing", country: "Tiongkok", lat: 31.2, lon: 121.5, customsDuty: 0.10, priceBonus: 1.12, preferredTier: 2, desc: "Pasar raksasa penyerap ribuan ton monomer hulu, pelet plastik, dan bahan baku baterai." },
    { id: "DEST-HOUSTON", name: "Houston & Cape Canaveral Aerospace", country: "Amerika Serikat", lat: 29.7, lon: -95.3, customsDuty: 0.09, priceBonus: 1.22, preferredTier: 4, desc: "Kontraktor dirgantara & pertahanan pembayar mahal untuk selubung termal roket, PEEK, dan propelan." },
    { id: "DEST-SURABAYA", name: "Pelabuhan Tanjung Perak & Kawasan Industri Jawa", country: "Indonesia", lat: -7.2, lon: 112.7, customsDuty: 0.03, priceBonus: 1.04, preferredTier: 1, desc: "Pasar domestik/ASEAN dengan bea cukai sangat rendah dan ongkos kirim dekat untuk pabrik di Nusantara." },
    { id: "DEST-MUMBAI", name: "Nhava Sheva & Gujarat Pharma-Agri Corridor", country: "India", lat: 18.9, lon: 72.9, customsDuty: 0.16, priceBonus: 1.15, preferredTier: 3, desc: "Pusat industri tekstil, pupuk NPK, agrokimia, dan bahan aktif obat generik (API)." },
    { id: "DEST-SANTOS", name: "Pelabuhan Santos & Sao Paulo Industrial", country: "Brasil", lat: -23.9, lon: -46.3, customsDuty: 0.18, priceBonus: 1.17, preferredTier: 2, desc: "Pusat agribisnis dan otomotif Amerika Selatan; hindari DDP jika bea masuk sedang tinggi!" },
    { id: "DEST-BUSAN", name: "Pelabuhan Busan & Ulsan Shipyard", country: "Korea Selatan", lat: 35.1, lon: 129.0, customsDuty: 0.07, priceBonus: 1.16, preferredTier: 3, desc: "Pusat galangan kapal LNG, semikonduktor memori, dan baterai kendaraan listrik." }
  ];

  // INCOTERMS 2020
  const INCOTERMS = [
    { id: "EXW", code: "EXW", name: "EXW (Ex Works — Di Gudang Penjual)", sellerFreightShare: 0.0, sellerInsuranceShare: 0.0, sellerPayCustoms: false, buyerPriceFactor: 0.88, procureMarkup: 0.88, riskFactor: 0.14, desc: "Penjual hanya menyiapkan barang di gudang pabriknya. Pembeli menanggung seluruh biaya angkut, kapal, asuransi, bea cukai, dan risiko kerusakan." },
    { id: "FOB", code: "FOB", name: "FOB (Free On Board — Pelabuhan Muat)", sellerFreightShare: 0.18, sellerInsuranceShare: 0.0, sellerPayCustoms: false, buyerPriceFactor: 0.96, procureMarkup: 0.95, riskFactor: 0.08, desc: "Penjual menanggung biaya sampai barang naik ke kapal di pelabuhan asal. Pembeli membayar ongkos kapal utama & asuransi laut." },
    { id: "CFR", code: "CFR", name: "CFR (Cost and Freight — Pelabuhan Tujuan)", sellerFreightShare: 1.0, sellerInsuranceShare: 0.0, sellerPayCustoms: false, buyerPriceFactor: 1.04, procureMarkup: 1.03, riskFactor: 0.06, desc: "Penjual membayar ongkos angkut sampai pelabuhan tujuan, tetapi risiko selama di laut dan asuransi ditanggung pembeli." },
    { id: "CIF", code: "CIF", name: "CIF (Cost, Insurance & Freight)", sellerFreightShare: 1.0, sellerInsuranceShare: 1.0, sellerPayCustoms: false, buyerPriceFactor: 1.08, procureMarkup: 1.06, riskFactor: 0.02, desc: "Standar emas perdagangan kimia maritim: Penjual membayar ongkos kapal + asuransi kargo sampai pelabuhan tujuan." },
    { id: "DAP", code: "DAP", name: "DAP (Delivered at Place — Terminal Tujuan)", sellerFreightShare: 1.15, sellerInsuranceShare: 1.0, sellerPayCustoms: false, buyerPriceFactor: 1.11, procureMarkup: 1.10, riskFactor: 0.02, desc: "Penjual mengantar sampai gerbang gudang tujuan siap bongkar, namun bea masuk impor tetap dibayar oleh pembeli." },
    { id: "DDP", code: "DDP", name: "DDP (Delivered Duty Paid — Terima Beres)", sellerFreightShare: 1.20, sellerInsuranceShare: 1.0, sellerPayCustoms: true, buyerPriceFactor: 1.19, procureMarkup: 1.22, riskFactor: 0.0, desc: "Penjual menanggung 100% ongkos kirim, asuransi, hingga Pajak/Bea Masuk di negara tujuan!" }
  ];

  const TRANSPORT_MODES = [
    { id: "SEA", name: "🚢 Kapal Tanker Kimia / Kontainer Laut", costPerKmTon: 0.0032, fixedHandlingPerTon: 6, insuranceRate: 0.015, speedLabel: "Ekonomis (Lintas Samudra)", bestIncoterms: ["FOB", "CFR", "CIF"] },
    { id: "LAND", name: "🚂 Kereta Api Tangki & Truk ISO-Tank", costPerKmTon: 0.0075, fixedHandlingPerTon: 4, insuranceRate: 0.010, speedLabel: "Menengah (Jalur Kontinental)", bestIncoterms: ["EXW", "DAP", "DDP"] },
    { id: "AIR", name: "✈️ Pesawat Kargo Berat (Air Freight)", costPerKmTon: 0.038, fixedHandlingPerTon: 25, insuranceRate: 0.008, speedLabel: "Ekspres (Khusus Produk Bernilai Tinggi T3-T4)", bestIncoterms: ["CIF", "DAP", "DDP"] }
  ];

  const UTILITIES = [
    { id: "UTIL-PWR", name: "Gardu Listrik & Turbin Kogenerasi Gas", unit: "MW", baseCap: 150, capPerLevel: 140, baseCost: 350, upkeepPerSec: 3.5, desc: "Menyuplai daya listrik tegangan menengah untuk motor pompa, kompresor, tungku busur, dan instrumen SCADA." },
    { id: "UTIL-WTR", name: "Instalasi Air Pendingin & Cooling Tower", unit: "m³/jam", baseCap: 25, capPerLevel: 22, baseCost: 280, upkeepPerSec: 2.2, desc: "Memasok air demineralisasi boiler dan air sirkulasi kondensor. Jika defisit, reaktor mengalami overheating dan berisiko meledak!" },
    { id: "UTIL-FLT", name: "Armada Truk Tangki ADR & Forklift Gudang", unit: "Armada", baseCap: 40, capPerLevel: 35, baseCost: 400, upkeepPerSec: 3.0, desc: "Menangani bongkar-muat bahan baku ke gudang dan pengiriman produk jadi ke pelabuhan/bandara." }
  ];

  // 12 Slot Alat Proses Berurutan (Mulai dari 3 alat awal, lalu diperpanjang bertahap hingga 12 alat!) + 2 Unit Utilitas Atas (S-501 & S-502)
  const EQUIPMENT = [
    { id: "P-101", tag: "P-101", stageOrder: 1, installCost: 0, name: "Tahap 1: Unit Preparasi & Umpan", shortName: "Preparasi #1", tier: 1, category: "Tahap #1/12: Preparasi & Pemurnian Umpan (Terpasang Awal)", baseCost: 180, baseCapacity: 12.0, capGrowth: 1.18, basePurityBonus: 0, purityPerLevel: 1.5, baseCo2: 0.35, tempBase: 135, tempPerLevel: 2, pressureBase: 12.0, pressurePerLevel: 0.6, reaction: "Umpan Mentah → Umpan Murni Siap Reaksi", functionDesc: "Alat pertama (#1/12) yang mempersiapkan, memompa, dan memurnikan bahan baku dari pengotor sebelum masuk ke proses inti.", upgradeNotes: ["Kalibrasi laju aliran pompa & sensor tekanan.", "Optimasi filter pemisah pengotor tahap awal.", "Peningkatan segel mekanis anti-bocor.", "Integrasi kontrol aliran otomatis loop tertutup."] },
    { id: "T-102", tag: "T-102", stageOrder: 2, installCost: 0, name: "Tahap 2: Unit Konversi / Fraksinasi Primer", shortName: "Proses Primer #2", tier: 1, category: "Tahap #2/12: Pemisahan / Konversi Primer (Terpasang Awal)", baseCost: 260, baseCapacity: 11.8, capGrowth: 1.18, basePurityBonus: 71.0, purityPerLevel: 2.2, baseCo2: 0.95, tempBase: 350, tempPerLevel: 4, pressureBase: 4.5, pressurePerLevel: 0.15, reaction: "Umpan + Energi → Produk Kasar / Intermediet Primer", functionDesc: "Alat kedua (#2/12) yang melakukan pemisahan termal, elektrolisis, atau konversi primer bahan baku.", upgradeNotes: ["Penyetelan rasio refluks & distribusi aliran.", "Peningkatan efisiensi kontak uap-cair internal.", "Isolasi termal dinding bejana untuk menekan kehilangan kalor.", "Otomasi sensor komposisi produk keluaran."] },
    { id: "E-201", tag: "E-201", stageOrder: 3, installCost: 0, name: "Tahap 3: Unit Termal & Penukar Panas", shortName: "Termal/Panas #3", tier: 1, category: "Tahap #3/12: Pengondisian Termal & Pemisah Dasar (Terpasang Awal)", baseCost: 340, baseCapacity: 11.6, capGrowth: 1.18, basePurityBonus: 1.5, purityPerLevel: 1.5, baseCo2: 0.85, tempBase: 620, tempPerLevel: 8, pressureBase: 15.0, pressurePerLevel: 0.5, reaction: "Pertukaran Kalor ΔH & Perengkahan Termal", functionDesc: "Alat ketiga (#3/12) pada rangkaian awal yang mengatur suhu reaksi serta memulihkan panas buang.", upgradeNotes: ["Pembersihan kerak fouling tabung penukar panas.", "Penambahan baffle pengarah aliran turbulen.", "Integrasi pemulihan panas regeneratif.", "Kontrol temperatur PID presisi tinggi."] },
    { id: "C-202", tag: "C-202", stageOrder: 4, installCost: 380, name: "Tahap 4: Unit Kompresi & Booster Tekanan", shortName: "Kompresor #4", tier: 1, category: "Tahap #4/12: Ekspansi Perpanjangan Alat — Kompresi & Vakum (+16% Output)", baseCost: 460, baseCapacity: 12.2, capGrowth: 1.19, basePurityBonus: 2.0, purityPerLevel: 1.3, baseCo2: 0.60, tempBase: 145, tempPerLevel: 3, pressureBase: 35.0, pressurePerLevel: 2.2, reaction: "Pengondisian Tekanan Tinggi & Atmosfer Proses", functionDesc: "Perpanjangan alat ke-4 (#4/12): Memampatkan gas reaktan atau menjaga kondisi vakum/atmosfer inert untuk mempercepat laju reaksi.", upgradeNotes: ["Penyeimbangan dinamis rotor berkecepatan tinggi.", "Pendinginan intercooler antar-tahap.", "Sistem pencegah lonjakan arus balik (anti-surge).", "Segel gas kering bebas kontaminasi."] },
    { id: "R-203", tag: "R-203", stageOrder: 5, installCost: 560, name: "Tahap 5: Reaktor Sintesis & Polimerisasi Inti", shortName: "Reaktor Inti #5", tier: 2, category: "Tahap #5/12: Ekspansi Perpanjangan Alat — Reaktor Utama (+20% Output)", baseCost: 680, baseCapacity: 12.0, capGrowth: 1.19, basePurityBonus: 3.0, purityPerLevel: 2.0, baseCo2: 1.05, tempBase: 210, tempPerLevel: 4, pressureBase: 28.0, pressurePerLevel: 0.8, reaction: "Reaktan + Katalis → Molekul Target Utama", functionDesc: "Perpanjangan alat ke-5 (#5/12): Reaktor konversi utama tempat rantai molekul dirangkai dengan bantuan katalis.", upgradeNotes: ["Optimasi pengadukan dan waktu tinggal (residence time).", "Peningkatan jaket pendingin pengendali eksotermis.", "Dosing katalis otomatis proporsional.", "Pemantauan konversi reaksi spektroskopi."] },
    { id: "Q-204", tag: "Q-204", stageOrder: 6, installCost: 780, name: "Tahap 6: Quench Cooler & Kondensor Refluks", shortName: "Quench Cooler #6", tier: 2, category: "Tahap #6/12: Ekspansi Perpanjangan Alat — Pendingin Kejut (+18% Output & +Stabilitas)", baseCost: 840, baseCapacity: 12.4, capGrowth: 1.19, basePurityBonus: 2.5, purityPerLevel: 1.4, baseCo2: 0.40, tempBase: 65, tempPerLevel: -1, pressureBase: 10.0, pressurePerLevel: 0.3, reaction: "Pendinginan Kejut Aliran Eksotermis → Cegah Produk Samping", functionDesc: "Perpanjangan alat ke-6 (#6/12): Mendinginkan produk keluar reaktor secara cepat agar tidak terdegradasi kembali menjadi produk samping.", upgradeNotes: ["Tingkatkan debit sirkulasi fluida pendingin.", "Pasang tabung penukar kalor sub-cooling.", "Optimasi pemisahan kondensat refluks.", "Integrasi katup pengaman suhu darurat."] },
    { id: "F-301", tag: "F-301", stageOrder: 7, installCost: 1100, name: "Tahap 7: Separator Siklon & Filtrasi Fasa", shortName: "Separator #7", tier: 2, category: "Tahap #7/12: Ekspansi Perpanjangan Alat — Pemisahan Fasa (+18% Output)", baseCost: 1150, baseCapacity: 12.2, capGrowth: 1.19, basePurityBonus: 3.0, purityPerLevel: 1.6, baseCo2: 0.50, tempBase: 95, tempPerLevel: 2, pressureBase: 14.0, pressurePerLevel: 0.4, reaction: "Campuran Multi-Fasa → Produk Terpisah + Residu Daur Ulang", functionDesc: "Perpanjangan alat ke-7 (#7/12): Memisahkan fasa padat, cair, dan gas menggunakan gaya sentrifugal siklon atau membran mikro.", upgradeNotes: ["Kalibrasi kecepatan putar siklon/sentrifugasi.", "Pembersihan balik (back-pulse) elemen filter otomatis.", "Peningkatan efisiensi penangkapan partikel halus.", "Sensor kekeruhan (turbidity) keluaran real-time."] },
    { id: "R-301", tag: "R-301", stageOrder: 8, installCost: 1550, name: "Tahap 8: Reaktor Sekunder & Pemurnian Lanjut", shortName: "Reaktor Sekunder #8", tier: 3, category: "Tahap #8/12: Ekspansi Perpanjangan Alat — Konversi Tahap Kedua (+22% Output)", baseCost: 1600, baseCapacity: 12.0, capGrowth: 1.20, basePurityBonus: 3.5, purityPerLevel: 2.0, baseCo2: 1.20, tempBase: 285, tempPerLevel: 9, pressureBase: 42.0, pressurePerLevel: 1.5, reaction: "Sisa Reaktan + Pemurnian Selektif → Konversi >98%", functionDesc: "Perpanjangan alat ke-8 (#8/12): Reaktor kaskade kedua dan kolom pemurnian untuk menuntaskan konversi sisa bahan baku menuju Grade A.", upgradeNotes: ["Kalibrasi selektivitas katalis tahap kedua.", "Penghilangan jejak isomer pengotor.", "Sistem kontrol kualitas spektrometri inline.", "Siklus pemurnian tekanan tinggi."] },
    { id: "D-303", tag: "D-303", stageOrder: 9, installCost: 2150, name: "Tahap 9: Devolatilisasi Vakum & Kristalisator", shortName: "Devolatilisasi #9", tier: 3, category: "Tahap #9/12: Ekspansi Perpanjangan Alat — Stripping & Kristalisasi (+20% Output)", baseCost: 2200, baseCapacity: 12.2, capGrowth: 1.20, basePurityBonus: 3.5, purityPerLevel: 1.8, baseCo2: 0.75, tempBase: 160, tempPerLevel: 3, pressureBase: 0.2, pressurePerLevel: 0.05, reaction: "Stripping Vakum Tinggi → Bebas Residu Pelarut & Monomer (<1 ppm)", functionDesc: "Perpanjangan alat ke-9 (#9/12): Melucuti sisa gas monomer terlarut, kelembapan, dan mengkristalkan produk dalam kondisi vakum.", upgradeNotes: ["Tingkatkan kedalaman vakum ejektor/pompa.", "Kontrol laju pertumbuhan inti kristal seragam.", "Pemulihan uap pelarut ke kondensor.", "Pemanas jaket distribusi merata."] },
    { id: "K-401", tag: "K-401", stageOrder: 10, installCost: 2950, name: "Tahap 10: Pengeringan, Kalsinasi & Konsolidasi", shortName: "Kalsinasi/Dryer #10", tier: 3, category: "Tahap #10/12: Ekspansi Perpanjangan Alat — Pengeringan & Sintering (+22% Output)", baseCost: 3100, baseCapacity: 12.0, capGrowth: 1.20, basePurityBonus: 4.0,PurityPerLevel: 2.0, purityPerLevel: 2.0, baseCo2: 1.35, tempBase: 540, tempPerLevel: 12, pressureBase: 8.0, pressurePerLevel: 0.5, reaction: "Perlakuan Termal Terkendali → Struktur Material Stabil & Kering", functionDesc: "Perpanjangan alat ke-10 (#10/12): Mengeringkan hingga bebas kadar air atau melakukan kalsinasi/debulking termal presisi.", upgradeNotes: ["Sirkulasi gas nitrogen kering tertutup.", "Profil pemanasan multi-zona presisi.", "Sistem pencegahan aglomerasi partikel.", "Pemulihan panas gas buang dryer."] },
    { id: "M-401", tag: "M-401", stageOrder: 11, installCost: 3900, name: "Tahap 11: Unit Ekstrusi, Permesinan & Fabrikasi", shortName: "Fabrikasi/CNC #11", tier: 4, category: "Tahap #11/12: Ekspansi Perpanjangan Alat — Pembentukan Presisi (+25% Output)", baseCost: 4400, baseCapacity: 12.0, capGrowth: 1.21, basePurityBonus: 4.5, purityPerLevel: 2.2, baseCo2: 1.50, tempBase: 980, tempPerLevel: 15, pressureBase: 60.0, pressurePerLevel: 2.5, reaction: "Material Murni → Pelet Seragam / Wafer / Komponen Presisi", functionDesc: "Perpanjangan alat ke-11 (#11/12): Mengekstrusi pelet, mencetak komposit, atau melakukan permesinan CNC/pelapisan TBC.", upgradeNotes: ["Peningkatan torsi ekstruder / kecepatan spindle CNC.", "Kalibrasi die-head dan pemotong bawah air.", "Pendinginan oli & pelumasan mikro.", "Toleransi dimensi sub-mikron."] },
    { id: "PK-403", tag: "PK-403", stageOrder: 12, installCost: 5200, name: "Tahap 12: Sortasi Laser Optik & Kemasan Hermetik", shortName: "Sortasi & Kemas #12", tier: 4, category: "Tahap #12/12: Ekspansi Puncak — Inspeksi Laser & Pengemasan (+28% Output & Grade A+)", baseCost: 5600, baseCapacity: 12.5, capGrowth: 1.21, basePurityBonus: 5.0, purityPerLevel: 2.4, baseCo2: 0.45, tempBase: 25, tempPerLevel: 0, pressureBase: 1.2, pressurePerLevel: 0.1, reaction: "Sortasi Optik 100% + Pengemasan Inert → Produk Grade A+ Siap Ekspor", functionDesc: "Alat puncak ke-12 (#12/12): Kamera laser dan X-Ray memisahkan setiap cacat mikro lalu mengemas produk di bawah gas inert langsung ke Gudang.", upgradeNotes: ["Kalibrasi sensor optik & spektrometer laser.", "Injeksi gas pelindung argon/nitrogen kemasan.", "Konveyor robotik kecepatan tinggi ke gudang.", "Sertifikasi mutu ISO otomatis tiap batch."] },
    // 2 Unit Utilitas Lingkungan & Daur Ulang di Jalur Atas
    { id: "S-501", tag: "S-501", stageOrder: 0, installCost: 0, name: "Unit Amine Scrubber & Carbon Capture (CCUS)", shortName: "Scrubber CO2", tier: 1, category: "Utilitas Lingkungan #1: Mitigasi Emisi & Pajak Karbon", baseCost: 300, baseCapacity: 999, capGrowth: 1.0, basePurityBonus: 0, purityPerLevel: 0, baseCo2: 0, tempBase: 55, tempPerLevel: -1, pressureBase: 3.0, pressurePerLevel: 0.2, reaction: "CO₂(gas buang) + 2 RNH₂ + H₂O ⇌ RNH₃⁺ + RNHCOO⁻", functionDesc: "Menangkap emisi CO₂ dan gas asam dari seluruh rangkaian alat proses untuk memangkas Pajak Karbon.", upgradeNotes: ["Tingkatkan laju sirkulasi pompa larutan absorben.", "Optimasi suhu kolom regenerator stripper.", "Penambahan demister penahan kabut pelarut.", "Kompresi CO₂ tangkapan untuk penyimpanan aman."] },
    { id: "S-502", tag: "S-502", stageOrder: 0, installCost: 520, name: "Unit Daur Ulang Pelarut & Gas Buang (Recycler)", shortName: "Recycler Umpan", tier: 1, category: "Utilitas Daur Ulang #2: Menghemat Konsumsi Bahan Baku Gudang (-10% s/d -42%)", baseCost: 420, baseCapacity: 999, capGrowth: 1.0, basePurityBonus: 1.5, purityPerLevel: 0.6, baseCo2: 0, tempBase: -15, tempPerLevel: -2, pressureBase: 8.0, pressurePerLevel: 0.4, reaction: "Uap Pelarut & Gas Sisa Reaktor → Kondensasi & Injeksi Balik ke Umpan P-101", functionDesc: "Menangkap uap bahan baku dan monomer yang tidak habis bereaksi lalu memompanya kembali ke P-101, menghemat pemakaian bahan baku gudang hingga 42%!", upgradeNotes: ["Tingkatkan efisiensi kondensor dingin daur ulang.", "Regenerasi karbon aktif penyerap uap pelarut.", "Kompresor booster pengembalian gas reaktan.", "Integrasi membran pemisah hidrogen/monomer."] }
  ];

  // ===========================================================================
  // SISTEM CV LENGKAP TANPA RINGKASAN & DIALOG WAWANCARA INTERAKTIF
  // ===========================================================================
  const FIRST_NAMES = [
    "Budi", "Hendra", "Rizky", "Dimas", "Arif", "Siti", "Ratna", "Kevin", "Lord", "Bambang",
    "Fajar", "Nadia", "Taufik", "Gilang", "Chandra", "Putri", "Wahyu", "Reza", "Doni", "Mega",
    "Agus", "Lestari", "Yudha", "Kartika", "Bayu", "Rama", "Dewi", "Surya", "Indra", "Anita"
  ];
  const LAST_NAMES = [
    "Pratama", "Kusuma", "Wijaya", "Santoso", "Hidayat", "Syahputra", "Nugroho", "Siregar",
    "Hartono", "Saputra", "Wibowo", "Permana", "Halim", "Gunawan", "Lesmana", "Mahendra",
    "Pangestu", "Setiawan", "Firmansyah", "Ramadhan"
  ];

  const CV_PROFILES = [
    {
      type: "KOPONG_MAHAL",
      roles: ["Chief Synergy Process Evangelist", "Senior Executive Chemical Visionary", "Head of Holistic Reactor Disruption"],
      universities: [
        { degree: "MBA & Honorary Doctorate in Disruptive Alchemy", school: "Global Online Executive Academy (Kursus 14 Hari)", year: "2023", gpa: "4.00 / 4.00 (Klaim Sendiri)", thesis: "Transformasi Mindset Holistik untuk Meningkatkan Vibrasi Positif Molekul Polimer tanpa Katalis" },
        { degree: "Sarjana Komunikasi & Influencer Marketing", school: " Institut Media Sosial Metropolis", year: "2021", gpa: "2.45 / 4.00", thesis: "Strategi Personal Branding di LinkedIn agar Terlihat seperti Ahli Teknik Kimia Senior" }
      ],
      summaries: [
        "Pemimpin visioner berorientasi sinergi eksponensial yang siap mendisrupsi paradigma kilang kimia tradisional. Saya tidak mengotori tangan dengan hal-hal mikro seperti rumus stoikiometri, katup tekanan, atau termodinamika karena fokus saya adalah membangun narasi makro perusahaan di ruang rapat ber-AC.",
        "Thought-Leader industri 6.0 dengan 50.000 pengikut media sosial. Ahli dalam memberikan semangat motivasi kepada reaktor yang sedang tidak stabil melalui pendekatan komunikasi interpersonal."
      ],
      workHistories: [
        [
          { company: "PT Crypto-Petrochemical Metaverse Tbk", title: "VP of Visionary Alignment", period: "2023 – 2025", duties: "Membuat 400 slide presentasi warna-warni tentang masa depan bensin virtual dan mengadakan rapat kopi pagi 4 jam sehari.", leaveReason: "Perusahaan bubar karena ternyata belum pernah membangun pabrik fisik satu pun." },
          { company: "CV Sukses Makmur Abadi", title: "Senior Consultant (Magang)", period: "2022 – 2023", duties: "Mengatur jadwal golf direktur dan memesan katering ruang rapat.", leaveReason: "Merasa kurang dihargai karena tidak diberi mobil dinas mewah." }
        ]
      ],
      certifications: ["Sertifikat Seminar Motivasi 'Kaya Raya dalam 7 Hari'", "Juara 2 Lomba Debat Kampus", "Master of PowerPoint Animation"],
      dialogues: {
        q_emergency: {
          question: "Jika suhu reaktor polimerisasi melonjak ke 300°C dan alarm tekanan berbunyi merah, langkah teknis apa yang Anda ambil?",
          answer: "\"Wah, pertanyaan bagus! Sebagai pemimpin strategis, langkah pertama saya adalah menggelar sesi brainstorming Zoom darurat untuk menyelaraskan KPI tim, lalu menyemangati reaktor tersebut agar tetap berpikir positif! Kalau soal putar-putar keran pipa, nanti tinggal suruh satpam saja Pak.\""
        },
        q_history: {
          question: "Di CV tertulis Anda pernah memimpin 10 proyek kilang besar, bisa jelaskan satu reaksi kimia yang Anda tangani di sana?",
          answer: "\"Begini Pak, di level eksekutif seperti saya, reaksi kimia paling penting itu adalah 'chemistry' antar-manusia di tempat nongkrong! Kalau soal huruf C, H, O yang ada angka kecil-kecilnya itu, jujur saya agak alergi lihat angka sejak SMA.\""
        },
        q_pid: {
          question: "Coba lihat cetak biru P&ID di meja ini. Apa fungsi katup pelepas tekanan (PSV) dan scrubber S-501?",
          answer: "\"Hmm... gambar garis-garis kotak ini artistik sekali ya Pak! Kalau menurut fengshui industri, kotak S-501 itu pasti simbol keberuntungan finansial, sedangkan gambar segitiga katup itu tanda panah menuju kesuksesan kuartal depan!\""
        },
        q_salary: {
          question: "Anda meminta gaji sangat tinggi ($450–$650/hari). Apa jaminan pabrik tidak akan meledak di tangan Anda?",
          answer: "\"Gaji besar itu investasi wibawa perusahaan Pak! Kalau nanti pabriknya meledak, tenang saja, saya sudah siapkan draf siaran pers permintaan maaf yang sangat estetik dan viral!\""
        }
      },
      salaryRange: [420, 680],
      skillRange: [8, 20],
      hazardRange: [20, 35]
    },
    {
      type: "CEROBOH",
      roles: ["Operator Reaktor Tekanan Tinggi", "Teknisi Katup & Boiler Uap", "Supervisor Pencampuran Bahan Eksotermis"],
      universities: [
        { degree: "D3 Teknik Kimia Industri (Lulus 6,5 Tahun)", school: "Politeknik Harapan Bangsa", year: "2020", gpa: "2.18 / 4.00", thesis: "Eksperimen Mempercepat Pemanasan Ketel Distilasi dengan Mematikan Sensor Pembatas Suhu (Catatan: Laboratorium Kampus Sempat Terbakar)" },
        { degree: "S1 Teknik Mesin Fluida", school: "Universitas Teknik Raya", year: "2019", gpa: "2.30 / 4.00", thesis: "Modifikasi Katup Pengaman Boiler Menggunakan Kawat Bendrat agar Tidak Sering Bocor" }
      ],
      summaries: [
        "Praktisi lapangan pemberani yang tidak suka diatur-atur oleh buku manual SOP yang tebal dan membosankan. Saya percaya insting dan jalan pintas jauh lebih cepat daripada prosedur keselamatan K3 yang bertele-tele.",
        "Operator berpengalaman yang terbiasa bekerja santai di bawah tekanan tinggi. Moto kerja saya adalah: selama reaktor belum terbang ke atap, berarti masih aman untuk ditinggal tidur siang."
      ],
      workHistories: [
        [
          { company: "PT Kilang Kimia Merapi Jaya", title: "Operator Shift Malam Reaktor", period: "2022 – 2024", duties: "Menjaga panel suhu reaktor nitrasi dan mencampur asam sulfat pekat dengan pelarut organik.", leaveReason: "Pabrik tiba-tiba rata dengan tanah akibat ledakan misterius saat saya sedang asyik main game sambil mencabut kabel sirene alarm yang berisik." },
          { company: "PT Polimer Cepat Jadi", title: "Teknisi Perawatan Pipa", period: "2020 – 2022", duties: "Mengelas pipa gas hidrogen aktif tanpa mematikan aliran gas demi menghemat waktu.", leaveReason: "Diberhentikan secara tidak hormat oleh manajer K3 karena merokok di samping tangki metanol." }
        ]
      ],
      certifications: ["Surat Peringatan Ketiga (SP-3) Dinas Keselamatan Kerja", "Kursus Mengelas Otodidak tanpa Kacamata Pelindung"],
      dialogues: {
        q_emergency: {
          question: "Jika suhu reaktor polimerisasi melonjak ke 300°C dan alarm tekanan berbunyi merah, langkah teknis apa yang Anda ambil?",
          answer: "\"Gampang Pak! Pertama, cabut dulu sekring speaker alarmnya supaya telinga nggak pengang. Kedua, ikat tuas katup pelepas tekanan pakai kawat supaya gasnya nggak bocor keluar. Biasanya sih 50:50 Pak, kalau nggak sembuh sendiri ya paling bunyi DUAR sedikit!\""
        },
        q_history: {
          question: "Mengapa Anda berhenti dari PT Kilang Kimia Merapi Jaya? Kabarnya terjadi insiden besar di sana?",
          answer: "\"Ah, itu cuma salah paham kecil Pak! Waktu itu saya cuma pengen tahu apa jadinya kalau air keran disiram langsung ke tangki asam sulfat mendidih sambil ngerokok. Eh, atap gudangnya langsung pindah ke kelurahan sebelah.\""
        },
        q_pid: {
          question: "Coba lihat cetak biru P&ID di meja ini. Bagaimana prosedur menjalankan unit Steam Cracker E-201?",
          answer: "\"Kalau menurut saya, buku petunjuk pabrik itu terlalu penakut Pak. Di tertulis batas maksimal 820°C dan 18 bar, tapi kalau saya yang jaga, langsung saya gas mentok ke 1.500°C tanpa air pendingin biar cepat matang!\""
        },
        q_salary: {
          question: "Apakah Anda bersedia mematuhi seluruh SOP keselamatan dan tidak tidur saat shift jaga?",
          answer: "\"Yah Bapak kaku amat... Kalau malam-malam kan mesinnya jalan sendiri Pak, masa saya nggak boleh rebahan 3 jam sambil matiin monitor SCADA?\""
        }
      },
      salaryRange: [160, 290],
      skillRange: [25, 42],
      hazardRange: [18, 30]
    },
    {
      type: "VETERAN",
      roles: ["Principal Process & Safety Engineer (HAZOP)", "Kepala Operasi Kilang & Distilasi Senior", "Spesialis Reaktor Katalitik & Kontrol DCS"],
      universities: [
        { degree: "S2 Teknik Kimia & Rekayasa Proses", school: "Institut Teknologi Bandung (ITB) / TU Delft", year: "2014", gpa: "3.88 / 4.00 (Cum Laude)", thesis: "Optimasi Model Predictive Control (MPC) dan Mitigasi Thermal Runaway pada Reaktor Polimerisasi Fluidized-Bed Eksotermis" },
        { degree: "S1 Teknik Kimia", school: "Universitas Gadjah Mada (UGM)", year: "2012", gpa: "3.82 / 4.00", thesis: "Simulasi Kesetimbangan Uap-Cair dan Efisiensi Energi Kolom Distilasi Structured Packing" }
      ],
      summaries: [
        "Insinyur proses kimia bersertifikat internasional dengan pengalaman 12 tahun memimpin operasional kilang petrokimia, sintesis gas tekanan tinggi, dan pabrik polimer rekayasa. Memiliki rekor 10.000+ jam kerja aman tanpa kecelakaan (Zero LTI) serta keahlian menaikkan kemurnian produk menuju Grade A (>95%).",
        "Ahli operasi lapangan dan keselamatan proses (HAZOP/SIL-3) yang menguasai pembacaan P&ID, penyeimbangan neraca massa-energi, serta penanganan darurat reaktor tanpa panik."
      ],
      workHistories: [
        [
          { company: "kompleks Petrokimia Terpadu Cilegon / Jurong", title: "Lead Operations & Process Safety Engineer", period: "2018 – 2025", duties: "Memimpin 45 operator ruang kontrol DCS, mengoptimalkan rasio refluks menara distilasi (hemat energi 18%), dan merancang sistem interlock pendingin darurat reaktor.", leaveReason: "Kontrak proyek ekspansi selesai dengan sukses; mencari tantangan memimpin pabrik baru." },
          { company: "Aramco-Sumitomo Refining Corp", title: "Senior Process Control Engineer", period: "2014 – 2018", duties: "Mengawasi komisioning unit Steam Cracker, kompresor gas 200 bar, dan unit Amine Scrubber CCUS.", leaveReason: "Promosi kembali ke tanah air setelah menyelesaikan transfer teknologi." }
        ]
      ],
      certifications: ["Certified Functional Safety Expert (CFSE / HAZOP Leader)", "Lisensi Operator Ruang Kontrol DCS/SCADA Tingkat Utama", "Six Sigma Black Belt — Chemical Yield Optimization"],
      dialogues: {
        q_emergency: {
          question: "Jika suhu reaktor polimerisasi melonjak ke 300°C dan alarm tekanan berbunyi merah, langkah teknis apa yang Anda ambil?",
          answer: "\"Saya akan segera mengaktifkan prosedur Emergency Shutdown (ESD): memutus katup umpan monomer dan katalis, menginjeksi gas racun katalis (kill-gas CO/N₂) untuk menghentikan reaksi rantai seketika, membuka penuh katup air pendingin darurat jaket reaktor, dan menyalurkan tekanan berlebih melalui PSV menuju sistem flare/scrubber.\""
        },
        q_history: {
          question: "Apa pencapaian teknis terbesar Anda di pabrik petrokimia sebelumnya?",
          answer: "\"Di pabrik sebelumnya, saya menemukan penyebab bottleneck dan pengotor pada kolom fraksinasi akibat channelling pada tray. Setelah mengkalibrasi ulang rasio refluks dan memasang molekuler sieve pada umpan, kemurnian produk melonjak dari 81% (Grade B) menjadi 96,4% (Grade A) sekaligus memangkas risiko panas berlebih.\""
        },
        q_pid: {
          question: "Coba lihat cetak biru P&ID di meja ini. Bagaimana cara menyeimbangkan aliran dari unit hulu ke reaktor?",
          answer: "\"Kita harus menjaga kapasitas laju alir massa (t/jam) antara unit preparasi P-101, kolom T-102, hingga reaktor R-203 berada dalam toleransi ±15%. Selain itu, kapasitas Cooling Tower (Air Pendingin) tidak boleh pernah defisit di bawah beban MW termal reaktor agar tidak memicu thermal runaway.\""
        },
        q_salary: {
          question: "Dengan pengalaman 12 tahun, permintaan gaji Anda ($160–$240/hari) sangat wajar. Mengapa tidak meminta $600 seperti pelamar lain?",
          answer: "\"Insinyur sejati menilai kompensasi dari keberlanjutan dan keselamatan pabrik Pak. Gaji yang sehat dan terukur membuat arus kas perusahaan kuat untuk membeli peralatan Generasi 3–4 yang canggih, sehingga kita semua bisa tumbuh jangka panjang tanpa bangkrut atau meledak.\""
        }
      },
      salaryRange: [155, 240],
      skillRange: [85, 98],
      hazardRange: [-20, -12]
    },
    {
      type: "KOMPETEN",
      roles: ["Insinyur Proses Kimia & QC", "Operator Ruang Kontrol SCADA/DCS", "Teknisi Pemeliharaan Reaktor & Instrumen"],
      universities: [
        { degree: "S1 Teknik Kimia", school: "Institut Teknologi Sepuluh Nopember (ITS) / UNDIP", year: "2020", gpa: "3.54 / 4.00", thesis: "Analisis Kinetika Reaksi dan Pemurnian Produk menggunakan Membran dan Absorber Amina" },
        { degree: "D4 Teknologi Kimia Industri", school: "Politeknik Negeri Bandung (POLBAN)", year: "2021", gpa: "3.60 / 4.00", thesis: "Perawatan Preventif Kompresor Gas Sentrifugal dan Kalibrasi Katup Kontrol Pneumatik" }
      ],
      summaries: [
        "Insinyur proses dan operator SCADA yang teliti, disiplin mematuhi SOP keselamatan kerja, serta terbiasa bekerja dalam tim shift 24 jam. Mampu menjaga parameter suhu, tekanan, dan kemurnian produk tetap stabil setiap hari.",
        "Lulusan teknik kimia dengan pengalaman lapangan 4 tahun di pabrik polimer dan gas industri. Memiliki pemahaman kuat atas stoikiometri reaksi, pengujian laboratorium QC, dan pencegahan kebocoran pipa."
      ],
      workHistories: [
        [
          { company: "PT Sintesis Polimer Nusantara", title: "Process & Quality Control Engineer", period: "2021 – 2025", duties: "Memantau layar telemetri SCADA, mengambil sampel kemurnian produk setiap 2 jam, dan memastikan suplai air cooling tower selalu di atas batas aman.", leaveReason: "Ingin mengembangkan karier di perusahaan kimia global yang memiliki variasi produk lebih luas." }
        ]
      ],
      certifications: ["Sertifikat Ahli K3 Kimia Kemnaker", "Pelatihan Operasional P&ID & Kalibrasi Katup PID", "Sertifikat Analisis Kromatografi Gas (GC-MS)"],
      dialogues: {
        q_emergency: {
          question: "Jika suhu reaktor polimerisasi melonjak ke 300°C dan alarm tekanan berbunyi merah, langkah teknis apa yang Anda ambil?",
          answer: "\"Sesuai SOP darurat, saya langsung menurunkan bukaan katup uap pemanas/umpan reaktan ke 0%, membuka sirkulasi air pendingin cadangan, dan melapor ke supervisor K3 sambil memantau penurunan tekanan pada indikator P&ID.\""
        },
        q_history: {
          question: "Bagaimana pengalaman kerja Anda selama 4 tahun di pabrik sebelumnya?",
          answer: "\"Saya bertugas menjaga kestabilan kolom distilasi dan menguji kemurnian batch produk sebelum masuk ke gudang. Selama 4 tahun bekerja, shift saya selalu memenuhi target kemurnian tanpa pernah mengalami insiden kebocoran maupun kebakaran.\""
        },
        q_pid: {
          question: "Coba lihat cetak biru P&ID di meja ini. Apa yang terjadi jika unit Scrubber S-501 tidak dirawat?",
          answer: "\"Jika absorber S-501 jenuh atau tidak di-upgrade, gas buang CO₂ dari tungku dan reaktor akan lepas langsung ke atmosfer sehingga perusahaan terkena denda Pajak Karbon tinggi, terutama di negara dengan regulasi lingkungan ketat.\""
        },
        q_salary: {
          question: "Gaji yang Anda ajukan cukup hemat ($90–$145/hari). Kapan Anda siap mulai bekerja di ruang kontrol?",
          answer: "\"Saya siap mulai bertugas hari ini juga Pak. Saya lebih mengutamakan lingkungan kerja yang profesional dan peralatan yang terawat baik.\""
        }
      },
      salaryRange: [85, 145],
      skillRange: [70, 84],
      hazardRange: [-11, -6]
    }
  ];

  let cvCounter = 1;
  function generateCandidateCV() {
    const roll = Math.random();
    const prof =
      roll < 0.28 ? CV_PROFILES[0] :
      roll < 0.46 ? CV_PROFILES[1] :
      roll < 0.74 ? CV_PROFILES[3] : CV_PROFILES[2];

    const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const role = prof.roles[Math.floor(Math.random() * prof.roles.length)];
    const uni = prof.universities[Math.floor(Math.random() * prof.universities.length)];
    const summary = prof.summaries[Math.floor(Math.random() * prof.summaries.length)];
    const workList = prof.workHistories[Math.floor(Math.random() * prof.workHistories.length)];
    const age = prof.type === "VETERAN" ? (34 + Math.floor(Math.random() * 10)) : (23 + Math.floor(Math.random() * 9));

    const sal = Math.round(prof.salaryRange[0] + Math.random() * (prof.salaryRange[1] - prof.salaryRange[0]));
    const skill = Math.round(prof.skillRange[0] + Math.random() * (prof.skillRange[1] - prof.skillRange[0]));
    const hazard = Math.round(prof.hazardRange[0] + Math.random() * (prof.hazardRange[1] - prof.hazardRange[0]));

    return {
      id: "EMP-" + (cvCounter++),
      name: `${fn} ${ln}`,
      age: age,
      archetype: prof.type,
      role: role,
      education: `${uni.degree} — ${uni.school}`,
      fullCV: {
        personalInfo: `Usia: ${age} Tahun • Domisili: Kawasan Industri • Email: ${fn.toLowerCase()}.${ln.toLowerCase()}@chemmail.id`,
        executiveSummary: summary,
        educationDetail: uni,
        workHistory: workList,
        certifications: prof.certifications
      },
      dialogues: prof.dialogues,
      interviewedTopics: {},
      salaryPerDay: sal,
      realSkill: skill,
      hazardMod: hazard,
      tested: false
    };
  }

  // ===========================================================================
  // GENERATOR & ARSIP 300 EDISI BERITA KORAN INDUSTRI ("WARTA KIMIA GLOBAL")
  // ===========================================================================
  const NEWS_EVENTS_TEMPLATES = [
    { tag: "KRISIS PASOKAN", titlePrefix: "GANGGUAN RANTAI PASOK GLOBAL:", storyTpl: "Penutupan mendadak fasilitas kompetitor di luar negeri memicu kelangkaan stok gudang internasional. Pembeli di Jepang, Jerman, dan Amerika Serikat berebut kontrak pengiriman CIF dan FOB dengan premi harga tinggi." },
    { tag: "BOOMING TEKNOLOGI", titlePrefix: "LONJAKAN PERMINTAAN INDUSTRI MAJU:", storyTpl: "Ekspansi pabrik kendaraan listrik, dirgantara, dan pusat data AI mendorong pesanan komoditas kimia ini menembus rekor tertinggi sepanjang tahun." },
    { tag: "KONTRAK INFRASTRUKTUR", titlePrefix: "PROYEK MEGA-INFRASTRUKTUR DUNIA:", storyTpl: "Konsorsium konstruksi dan energi lintas benua menandatangani kontrak pengadaan ribuan ton material kimia dengan insentif ekspor khusus." },
    { tag: "REGULASI & TRANSISI HIJAU", titlePrefix: "MANDAT STANDAR KEMURNIAN BARU:", storyTpl: "Badan standar industri internasional memperketat spesifikasi produk ke Grade A (>92%), memberikan keuntungan besar bagi pabrik yang telah mengganti alat ke Generasi 3 dan 4." },
    { tag: "GEOPOLITIK MARITIM", titlePrefix: "PERGESERAN RUTE PELAYARAN TANKER:", storyTpl: "Perubahan tarif asuransi kargo laut membuat pemilihan Incoterms CIF dan FOB menjadi kunci utama penentu margin laba bersih eksportir." },
    { tag: "TEROBOSAN KATALIS", titlePrefix: "INOVASI PROSES REKAYASA KIMIA:", storyTpl: "Konferensi Teknik Kimia Dunia melaporkan bahwa modernisasi reaktor dan kolom pemurnian mampu memangkas konsumsi listrik per unit sekaligus mendongkrak rendemen stoikiometri." }
  ];

  const BANK_MACRO_STORIES = [
    "Bank Sentral menahan suku bunga acuan guna menjaga stabilitas likuiditas sektor manufaktur berat.",
    "Likuiditas perbankan global melimpah; suku bunga Kredit Modal Kerja dan Ekspansi Reaktor berada di level sangat kompetitif.",
    "Kekhawatiran inflasi energi membuat sindikasi bank menaikkan tipis premi risiko pada fasilitas pinjaman jangka pendek.",
    "Dana Infrastruktur Eropa-Pasifik membuka kuota obligasi manufaktur bagi kilang yang memproduksi material bernilai tambah tinggi.",
    "Analis keuangan menyarankan perusahaan melunasi pinjaman berbunga tinggi (Venture Debt) sebelum melakukan lompatan waktu (Skip Time)."
  ];

  const EQUIP_MARKET_STORIES = [
    "Surplus produksi baja tahan karat austenitik SS316L dan paduan titanium membuat biaya Ganti Alat ke generasi canggih sedang sangat ekonomis!",
    "Antrean panjang di pabrik fabrikasi bejana tekan global mendorong kenaikan indeks harga peralatan P&ID minggu ini.",
    "Subsidi modernisasi industri hijau menurunkan harga paket instalasi Amine Scrubber CCUS dan reaktor hemat energi.",
    "Harga komponen kompresor sentrifugal dan instrumen kontrol SCADA stabil di tengah tingginya pembangunan kilang baru.",
    "Produsen mesin CNC 5-sumbu dan autoklaf komposit menawarkan diskon kontrak bagi pabrik yang berekspansi ke Tier 3 dan Tier 4."
  ];

  function build300NewsArchive() {
    const Catalog = window.ChemTycoon.Catalog200;
    const prods = (Catalog && Catalog.PRODUCTS) ? Catalog.PRODUCTS : [];
    const archive = [];

    for (let i = 1; i <= 300; i++) {
      const p1 = prods[(i - 1) % Math.max(1, prods.length)] || { id: "CHEM-001", name: "Etilena Murni", tier: 1, formula: "C₂H₄", reaction: "C₂H₆ → C₂H₄ + H₂", basePrice: 160 };
      const p2 = prods[(i * 7 + 13) % Math.max(1, prods.length)] || p1;
      const tpl = NEWS_EVENTS_TEMPLATES[(i - 1) % NEWS_EVENTS_TEMPLATES.length];
      const boomPct = 42 + ((i * 11) % 48);
      const rateIdx = 78 + ((i * 9) % 45);
      const equipIdx = 80 + ((i * 7) % 42);

      archive.push({
        editionNum: i,
        tag: tpl.tag,
        featuredProductId: p1.id,
        secondaryProductId: p2.id,
        boomPct: boomPct,
        interestIndexPct: rateIdx,
        equipIndexPct: equipIdx,
        headline: `[EDISI #${i}] ${tpl.titlePrefix} ${p1.name.toUpperCase()} (${p1.id}) MELONJAK +${boomPct}%!`,
        marketStory: `${tpl.storyTpl} Permintaan untuk ${p1.name} (${p1.id}, Tier ${p1.tier}) dan ${p2.name} (${p2.id}) meningkat tajam di pasar ekspor.`,
        bankStory: `${BANK_MACRO_STORIES[i % BANK_MACRO_STORIES.length]} (Indeks Bunga Pasar: ${rateIdx}%).`,
        equipStory: `${EQUIP_MARKET_STORIES[i % EQUIP_MARKET_STORIES.length]} (Indeks Harga Alat: ${equipIdx}%).`,
        techSpotlight: `Sorotan Proses #${i}: Produksi ${p1.name} (${p1.formula}) melalui reaksi [${p1.reaction}] membutuhkan pemilihan generasi alat yang tepat agar mencapai Grade A (>92%).`
      });
    }
    return archive;
  }

  let cached300News = null;
  function get300NewsArchive() {
    if (!cached300News) {
      cached300News = build300NewsArchive();
    }
    return cached300News;
  }

  // PINJAMAN BANK
  const BANK_LOANS = [
    { id: "LOAN-MICRO", bankName: "Bank Pembangunan Industri Nasional", title: "Kredit Modal Kerja & Bahan Baku", principal: 3000, baseDailyInterestRate: 0.004, termDays: 30, collateral: "Tanpa Agunan Lahan (Khusus UMKM & Pabrik Awal)", desc: "Pinjaman cepat untuk membeli bahan baku awal, membayar gaji karyawan, atau mengganti alat Tier 1." },
    { id: "LOAN-CORP", bankName: "Global Petrochemical Syndicated Bank", title: "Kredit Investasi Modernisasi Alat", principal: 12000, baseDailyInterestRate: 0.0065, termDays: 60, collateral: "Agunan Peralatan Pabrik P&ID", desc: "Fasilitas kredit skala menengah untuk mengganti peralatan pabrik ke Generasi 2–3 dan membuka izin lahan." },
    { id: "LOAN-MEGA", bankName: "Euro-Pacific Sovereign Infrastructure Fund", title: "Obligasi Korporasi Manufaktur Presisi", principal: 45000, baseDailyInterestRate: 0.0085, termDays: 90, collateral: "Jaminan Korporat Multinasional", desc: "Pendanaan besar untuk membangun komplek Tier 4, memasang alat Generasi 4, atau mengakuisisi pabrik baru." },
    { id: "LOAN-VENTURE", bankName: "Apex High-Risk Venture Debt", title: "Pinjaman Darurat Cair Instan (Bunga Tinggi)", principal: 8000, baseDailyInterestRate: 0.015, termDays: 20, collateral: "Tanpa Syarat Pemeriksaan Kredit", desc: "Dana talangan darurat saat kas kritis. Waspada: bunga harian tinggi jika lupa dilunasi saat Skip Time!" }
  ];

  function calculateProcurementQuote(supplierId, feedstockId, qtyTons, modeId, incotermId, factoryLat, factoryLon) {
    const Catalog = window.ChemTycoon.Catalog200;
    const sup = SUPPLIERS.find((s) => s.id === supplierId) || SUPPLIERS[0];
    const feed = Catalog.getFeedstockById(feedstockId);
    const mode = TRANSPORT_MODES.find((m) => m.id === modeId) || TRANSPORT_MODES[0];
    const inco = INCOTERMS.find((i) => i.id === incotermId) || INCOTERMS[0];

    const distKm = Math.max(120, haversineKm(sup.lat, sup.lon, factoryLat || -6.1, factoryLon || 106.8));
    const unitBase = feed.baseCost * sup.priceMult * inco.procureMarkup;
    const goodsCost = unitBase * qtyTons;

    const buyerFreightShare = Math.max(0, 1.15 - inco.sellerFreightShare);
    const rawFreight = (distKm * mode.costPerKmTon + mode.fixedHandlingPerTon) * qtyTons;
    const buyerFreightCost = rawFreight * buyerFreightShare;

    const buyerInsShare = 1 - inco.sellerInsuranceShare;
    const buyerInsuranceCost = goodsCost * mode.insuranceRate * buyerInsShare;

    const customsDutyCost = inco.sellerPayCustoms ? 0 : goodsCost * 0.07;
    const totalCost = Math.round(goodsCost + buyerFreightCost + buyerInsuranceCost + customsDutyCost);

    return {
      supplier: sup,
      feedstock: feed,
      qtyTons: qtyTons,
      distKm: distKm,
      mode: mode,
      incoterm: inco,
      goodsCost: Math.round(goodsCost),
      buyerFreightCost: Math.round(buyerFreightCost),
      buyerInsuranceCost: Math.round(buyerInsuranceCost),
      customsDutyCost: Math.round(customsDutyCost),
      totalCost: totalCost,
      costPerTon: Math.round(totalCost / Math.max(1, qtyTons)),
      lossRiskPct: Math.round(inco.riskFactor * 100)
    };
  }

  function calculateExportQuote(productId, qtyUnits, purity, gradeInfo, destId, modeId, incotermId, factoryLat, factoryLon, trendingMult, corpTaxRate) {
    const Catalog = window.ChemTycoon.Catalog200;
    const prod = Catalog.getProductById(productId);
    const dest = EXPORT_DESTINATIONS.find((d) => d.id === destId) || EXPORT_DESTINATIONS[0];
    const mode = TRANSPORT_MODES.find((m) => m.id === modeId) || TRANSPORT_MODES[0];
    const inco = INCOTERMS.find((i) => i.id === incotermId) || INCOTERMS[0];

    const safeQty = Math.max(0.1, Number(qtyUnits) || 1);
    const distKm = Math.max(120, haversineKm(factoryLat || -6.1, factoryLon || 106.8, dest.lat, dest.lon));
    const tierMatchBonus = dest.preferredTier === prod.tier ? 1.12 : 1.0;

    const unitContractPrice =
      prod.basePrice *
      (gradeInfo ? gradeInfo.multiplier : 0.8) *
      (trendingMult || 1.0) *
      dest.priceBonus *
      tierMatchBonus *
      inco.buyerPriceFactor;

    const grossContractRevenue = unitContractPrice * safeQty;

    const weightEquivalent = safeQty * Math.max(0.5, prod.feedstockPerUnit * 0.8);
    const fullFreight = (distKm * mode.costPerKmTon + mode.fixedHandlingPerTon) * weightEquivalent;
    const sellerFreightCost = fullFreight * inco.sellerFreightShare;

    const sellerInsuranceCost = grossContractRevenue * mode.insuranceRate * inco.sellerInsuranceShare;
    const sellerCustomsCost = inco.sellerPayCustoms ? grossContractRevenue * dest.customsDuty : 0;

    const isMaritimeInco = ["FOB", "CFR", "CIF"].includes(inco.id);
    const modeMismatchPenalty = (isMaritimeInco && mode.id !== "SEA") ? grossContractRevenue * 0.06 : 0;

    const profitBeforeTax = grossContractRevenue - sellerFreightCost - sellerInsuranceCost - sellerCustomsCost - modeMismatchPenalty;
    const corpTax = Math.max(0, profitBeforeTax) * (corpTaxRate || 0.12);
    const netRevenue = Math.round(profitBeforeTax - corpTax);

    let advice = "Pilihan Incoterm & transportasi sudah efisien.";
    if (isMaritimeInco && mode.id !== "SEA") {
      advice = `⚠️ ${inco.code} adalah aturan khusus angkutan laut, kurang tepat dipasangkan dengan ${mode.name} (penalti 6%). Gunakan Kapal Laut atau ganti ke DAP/FCA!`;
    } else if (inco.id === "DDP" && dest.customsDuty >= 0.14) {
      advice = `⚠️ Bea masuk di ${dest.country} cukup tinggi (${Math.round(dest.customsDuty * 100)}%). Menjual dengan DDP membuat Anda menanggung pajak impor tersebut! Pertimbangkan CIF atau FOB.`;
    } else if (inco.id === "EXW") {
      advice = `ℹ️ Dengan EXW Anda bebas biaya kirim, tetapi pembeli di ${dest.country} meminta diskon -12%. Gunakan CIF/FOB via Kapal Laut untuk margin lebih tinggi.`;
    } else if (mode.id === "AIR" && prod.tier <= 2) {
      advice = `⚠️ Mengirim produk komoditas Tier ${prod.tier} dengan Pesawat Kargo memakan ongkos angkut terlalu mahal dibanding nilai barangnya! Gunakan Kapal Laut.`;
    }

    return {
      product: prod,
      destination: dest,
      mode: mode,
      incoterm: inco,
      distKm: distKm,
      qtyUnits: safeQty,
      unitContractPrice: Math.round(unitContractPrice),
      grossContractRevenue: Math.round(grossContractRevenue),
      sellerFreightCost: Math.round(sellerFreightCost),
      sellerInsuranceCost: Math.round(sellerInsuranceCost),
      sellerCustomsCost: Math.round(sellerCustomsCost),
      modeMismatchPenalty: Math.round(modeMismatchPenalty),
      corpTax: Math.round(corpTax),
      netRevenue: netRevenue,
      advice: advice
    };
  }

  return {
    INITIAL_CASH,
    SURVEY_COST,
    NEWSPAPER_COST,
    TIER_NAMES,
    WORLD_LAND_POLYGONS,
    SEISMIC_BELTS,
    COUNTRY_BOUNDARIES,
    REGIONS: PRESET_REGIONS,
    SUPPLIERS,
    EXPORT_DESTINATIONS,
    INCOTERMS,
    TRANSPORT_MODES,
    UTILITIES,
    EQUIPMENT,
    BANK_LOANS,
    haversineKm,
    evaluateWorldCoordinate,
    generateCandidateCV,
    get300NewsArchive,
    calculateProcurementQuote,
    calculateExportQuote
  };
})();
