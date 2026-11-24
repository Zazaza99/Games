window.ChemTycoon = window.ChemTycoon || {};

window.ChemTycoon.WorldMap = (function () {
  const Data = window.ChemTycoon.Data;
  const Sim = window.ChemTycoon.Sim;

  const WORLD_W = 1440;
  const WORLD_H = 720;

  let canvas = null;
  let ctx = null;
  let cam = { x: 0, y: 0, zoom: 1 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let camStart = { x: 0, y: 0 };
  let movedDist = 0;
  let hoveredSiteId = null;
  let hoverLatLon = { lat: -6.1, lon: 106.8 };
  let onSelectCallback = null;
  let animTime = 0;
  let initialized = false;

  // Konversi Geografis (Lon -180..180, Lat -85..85) <-> Kanvas Dunia (0..WORLD_W, 0..WORLD_H)
  function lonToX(lon) {
    return ((lon + 180) / 360) * WORLD_W;
  }

  function latToY(lat) {
    return ((85 - lat) / 165) * WORLD_H;
  }

  function xToLon(wx) {
    return (wx / WORLD_W) * 360 - 180;
  }

  function yToLat(wy) {
    return 85 - (wy / WORLD_H) * 165;
  }

  function fitCamera() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const scaleX = rect.width / WORLD_W;
    const scaleY = rect.height / WORLD_H;
    cam.zoom = Math.max(0.55, Math.min(scaleX, scaleY) * 0.96);
    cam.x = (rect.width - WORLD_W * cam.zoom) * 0.5;
    cam.y = (rect.height - WORLD_H * cam.zoom) * 0.5;
  }

  function resize() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!initialized) {
      fitCamera();
      initialized = true;
    }
  }

  function screenToWorld(sx, sy) {
    return {
      x: (sx - cam.x) / cam.zoom,
      y: (sy - cam.y) / cam.zoom
    };
  }

  function zoomAt(factor, centerX, centerY) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = centerX !== undefined ? centerX : rect.width * 0.5;
    const cy = centerY !== undefined ? centerY : rect.height * 0.5;
    const prevZoom = cam.zoom;
    const nextZoom = Math.max(0.5, Math.min(4.0, prevZoom * factor));
    const wx = (cx - cam.x) / prevZoom;
    const wy = (cy - cam.y) / prevZoom;
    cam.zoom = nextZoom;
    cam.x = cx - wx * nextZoom;
    cam.y = cy - wy * nextZoom;
  }

  function focusRegion(regionId) {
    const r = Sim.getRegion(regionId);
    if (!r || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const wx = lonToX(r.lon);
    const wy = latToY(r.lat);
    cam.zoom = Math.max(cam.zoom, 1.15);
    cam.x = rect.width * 0.5 - wx * cam.zoom;
    cam.y = rect.height * 0.5 - wy * cam.zoom;
  }

  function findExistingSiteAtScreen(sx, sy) {
    const w = screenToWorld(sx, sy);
    let best = null;
    let bestDist = 22 / Math.max(0.7, cam.zoom);
    Object.keys(Sim.state.customSites).forEach((id) => {
      const r = Sim.state.customSites[id];
      const rx = lonToX(r.lon);
      const ry = latToY(r.lat);
      const d = Math.hypot(w.x - rx, w.y - ry);
      if (d < bestDist) {
        bestDist = d;
        best = r.id;
      }
    });
    return best;
  }

  function handleMapClickAtScreen(sx, sy) {
    const hitId = findExistingSiteAtScreen(sx, sy);
    if (hitId) {
      if (onSelectCallback) onSelectCallback(hitId);
      return;
    }
    // Klik bebas di koordinat manapun di seluruh dunia!
    const w = screenToWorld(sx, sy);
    const lon = Math.max(-179.5, Math.min(179.5, xToLon(w.x)));
    const lat = Math.max(-76, Math.min(81, yToLat(w.y)));
    const site = Sim.selectArbitraryCoordinate(lat, lon);
    if (onSelectCallback && site) {
      onSelectCallback(site.id);
    }
  }

  function init(canvasEl, onSelect) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    onSelectCallback = onSelect;
    resize();

    let lastMouseUpSelectAt = 0;

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      movedDist = 0;
      dragStart = { x: e.clientX, y: e.clientY };
      camStart = { x: cam.x, y: cam.y };
    });

    window.addEventListener("mousemove", (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        movedDist = Math.hypot(dx, dy);
        cam.x = camStart.x + dx;
        cam.y = camStart.y + dy;
      } else if (sx >= 0 && sy >= 0 && sx <= rect.width && sy <= rect.height) {
        const w = screenToWorld(sx, sy);
        hoverLatLon = {
          lat: Math.max(-78, Math.min(82, yToLat(w.y))),
          lon: Math.max(-180, Math.min(180, xToLon(w.x)))
        };
        hoveredSiteId = findExistingSiteAtScreen(sx, sy);
        canvas.style.cursor = "crosshair";
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (movedDist < 6 && canvas) {
        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        if (sx >= 0 && sy >= 0 && sx <= rect.width && sy <= rect.height) {
          lastMouseUpSelectAt = performance.now();
          handleMapClickAtScreen(sx, sy);
        }
      }
    });

    canvas.addEventListener("click", (e) => {
      if (movedDist >= 6) return;
      if (performance.now() - lastMouseUpSelectAt < 130) return;
      const rect = canvas.getBoundingClientRect();
      handleMapClickAtScreen(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      zoomAt(factor, sx, sy);
    }, { passive: false });

    window.addEventListener("resize", resize);
  }

  function render(dtSec) {
    if (!canvas || !ctx) return;
    animTime += dtSec;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return;

    // Deep Bathymetry Ocean Background
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 40, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    bgGrad.addColorStop(0, "#09192f");
    bgGrad.addColorStop(1, "#040914");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cam.x, cam.y);
    ctx.scale(cam.zoom, cam.zoom);

    const fScale = 1 / Math.sqrt(cam.zoom);

    // 1. Graticule Latitude & Longitude Grid
    ctx.lineWidth = 1 / cam.zoom;
    ctx.strokeStyle = "rgba(42, 78, 122, 0.26)";
    ctx.fillStyle = "rgba(120, 160, 210, 0.45)";
    ctx.font = `600 ${9 * fScale}px "JetBrains Mono", monospace`;

    for (let lon = -150; lon <= 150; lon += 30) {
      const gx = lonToX(lon);
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, WORLD_H);
      ctx.stroke();
      const lbl = lon === 0 ? "0° GMT" : Math.abs(lon) + (lon > 0 ? "°BT" : "°BB");
      ctx.fillText(lbl, gx + 4, 14);
    }

    for (let lat = -60; lat <= 60; lat += 30) {
      const gy = latToY(lat);
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(WORLD_W, gy);
      ctx.stroke();
      const lbl = lat === 0 ? "0° KHATULISTIWA" : Math.abs(lat) + (lat > 0 ? "°LU" : "°LS");
      ctx.fillText(lbl, 8, gy - 4);
    }

    // Highlight Equator
    ctx.strokeStyle = "rgba(0, 229, 255, 0.22)";
    ctx.setLineDash([7 / cam.zoom, 5 / cam.zoom]);
    ctx.beginPath();
    ctx.moveTo(0, latToY(0));
    ctx.lineTo(WORLD_W, latToY(0));
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Real World Land Polygons
    Data.WORLD_LAND_POLYGONS.forEach((poly) => {
      ctx.beginPath();
      poly.pts.forEach((pt, idx) => {
        const px = lonToX(pt[0]);
        const py = latToY(pt[1]);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      ctx.fillStyle = "#11263f";
      ctx.fill();
      ctx.lineWidth = 1.5 / cam.zoom;
      ctx.strokeStyle = "#2e5c8f";
      ctx.stroke();
    });

    // 3. Sabuk Seismik / Patahan Gempa Dunia (Ring of Fire)
    ctx.save();
    ctx.strokeStyle = "rgba(255, 82, 82, 0.35)";
    ctx.lineWidth = 2.2 / cam.zoom;
    ctx.setLineDash([5 / cam.zoom, 5 / cam.zoom]);
    Data.SEISMIC_BELTS.forEach((belt) => {
      ctx.beginPath();
      belt.forEach((pt, idx) => {
        const px = lonToX(pt[0]);
        const py = latToY(pt[1]);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    });
    ctx.restore();

    // 4. Pelabuhan Supplier Bahan Baku & Negara Tujuan Ekspor (Titik Kecil)
    Data.SUPPLIERS.forEach((sup) => {
      const sx = lonToX(sup.lat !== undefined ? sup.lon : 0);
      const sy = latToY(sup.lat || 0);
      ctx.fillStyle = "rgba(251, 191, 36, 0.65)";
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5 * fScale, 0, Math.PI * 2);
      ctx.fill();
    });

    Data.EXPORT_DESTINATIONS.forEach((dest) => {
      const dx = lonToX(dest.lon);
      const dy = latToY(dest.lat);
      ctx.strokeStyle = "rgba(179, 136, 255, 0.7)";
      ctx.lineWidth = 1.3 / cam.zoom;
      ctx.strokeRect(dx - 3.5 * fScale, dy - 3.5 * fScale, 7 * fScale, 7 * fScale);
    });

    // 5. Garis Rute Logistik dari Kilang Aktif ke Pelabuhan Supplier/Ekspor
    Object.keys(Sim.state.factories).forEach((fid) => {
      const fSite = Sim.getRegion(fid);
      if (!fSite) return;
      const fx = lonToX(fSite.lon);
      const fy = latToY(fSite.lat);

      Data.EXPORT_DESTINATIONS.slice(0, 3).forEach((dest) => {
        const dx = lonToX(dest.lon);
        const dy = latToY(dest.lat);
        ctx.save();
        ctx.strokeStyle = "rgba(0, 230, 118, 0.25)";
        ctx.lineWidth = 1.4 / cam.zoom;
        ctx.setLineDash([6 / cam.zoom, 6 / cam.zoom]);
        ctx.lineDashOffset = -animTime * 24;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo((fx + dx) * 0.5, Math.min(fy, dy) - 35, dx, dy);
        ctx.stroke();
        ctx.restore();
      });
    });

    // 6. Gambar Semua Lokasi (5 Benchmark + Semua Titik Koordinat Kustom yang Diklik / Dibangun)
    Object.keys(Sim.state.customSites).forEach((id) => {
      const r = Sim.state.customSites[id];
      const px = lonToX(r.lon);
      const py = latToY(r.lat);
      const owned = Sim.isOwned(r.id);
      const surveyed = Sim.isSurveyed(r.id);
      const isSelected = Sim.state.selectedRegionId === r.id;
      const isHovered = hoveredSiteId === r.id;

      // Jangan gambar titik kustom lama yang tidak dipilih dan tidak dibangun agar peta tetap bersih
      const isPreset = Data.REGIONS.some((pr) => pr.id === r.id);
      if (!isPreset && !owned && !surveyed && !isSelected) return;

      let pinColor = "#ffb300";
      let statusTag = "SIAP BANGUN / SURVEI";
      if (owned) {
        pinColor = "#00e676";
        statusTag = "KILANG AKTIF";
      } else if (surveyed) {
        pinColor = "#00e5ff";
        statusTag = "GEOLOGIST OK";
      }

      // Radar pulse ring
      const pulse = (animTime * 0.9 + (r.lon + 180) / 360) % 1;
      const ringRadius = (10 + pulse * 20) * fScale;
      ctx.beginPath();
      ctx.arc(px, py, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = owned
        ? `rgba(0, 230, 118, ${1 - pulse})`
        : isSelected
          ? `rgba(0, 229, 255, ${1 - pulse})`
          : `rgba(255, 179, 0, ${(1 - pulse) * 0.6})`;
      ctx.lineWidth = 1.6 / cam.zoom;
      ctx.stroke();

      // Crosshair target jika sedang dipilih
      if (isSelected || isHovered) {
        const chR = 16 * fScale;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.6 / cam.zoom;
        ctx.beginPath();
        ctx.arc(px, py, chR, 0, Math.PI * 2);
        ctx.moveTo(px - chR * 1.4, py);
        ctx.lineTo(px + chR * 1.4, py);
        ctx.moveTo(px, py - chR * 1.4);
        ctx.lineTo(px, py + chR * 1.4);
        ctx.stroke();
      }

      // Pin Inti
      const coreR = 7.5 * fScale;
      ctx.beginPath();
      ctx.arc(px, py, coreR, 0, Math.PI * 2);
      ctx.fillStyle = "#08101c";
      ctx.fill();
      ctx.lineWidth = 2.6 / cam.zoom;
      ctx.strokeStyle = pinColor;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(px, py, coreR * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = pinColor;
      ctx.fill();

      // Kartu Label Lokasi
      const labelTitle = r.shortName || r.coordLabel;
      ctx.font = `700 ${11 * fScale}px "Inter", sans-serif`;
      const textW = ctx.measureText(labelTitle).width;
      ctx.font = `700 ${8.5 * fScale}px "JetBrains Mono", monospace`;
      const tagW = ctx.measureText(statusTag).width;
      const boxW = Math.max(textW, tagW) + 14 * fScale;
      const boxH = 31 * fScale;
      const bx = px + 12 * fScale;
      const by = py - boxH * 0.5;

      ctx.fillStyle = isSelected ? "rgba(13, 27, 46, 0.96)" : "rgba(8, 14, 24, 0.86)";
      ctx.strokeStyle = isSelected ? "#ffffff" : pinColor;
      ctx.lineWidth = (isSelected ? 1.8 : 1.0) / cam.zoom;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 4 * fScale);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#f1f5f9";
      ctx.font = `700 ${10.5 * fScale}px "Inter", sans-serif`;
      ctx.fillText(labelTitle, bx + 7 * fScale, by + 13 * fScale);

      ctx.fillStyle = pinColor;
      ctx.font = `700 ${8.5 * fScale}px "JetBrains Mono", monospace`;
      ctx.fillText(statusTag, bx + 7 * fScale, by + 25 * fScale);
    });

    ctx.restore();

    // 7. Overlay GPS Cursor Telemetry di Pojok Kiri Atas Kanvas Peta
    const latS = Math.abs(hoverLatLon.lat).toFixed(2).replace(".", ",") + (hoverLatLon.lat >= 0 ? "°LU" : "°LS");
    const lonS = Math.abs(hoverLatLon.lon).toFixed(2).replace(".", ",") + (hoverLatLon.lon >= 0 ? "°BT" : "°BB");
    ctx.fillStyle = "rgba(8, 15, 28, 0.9)";
    ctx.strokeStyle = "#1d314d";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(12, 12, 345, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#00e5ff";
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.fillText(`🎯 GPS KURSOR: ${latS}, ${lonS} (KLIK DI MANAPUN)`, 22, 30);
  }

  return {
    init,
    resize,
    render,
    zoomAt,
    fitCamera,
    focusRegion
  };
})();
