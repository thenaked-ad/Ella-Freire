/* Ella Freire — Destination Globe & Route Map
   Requires: d3-geo.min.js, globe-land.js (window.ELLA_LAND)
   Products are read from a JSON script tag (#globe-data). Cities are
   detected from product titles/handles via the table below; products can
   override with metafields custom.latitude / custom.longitude / custom.airport_code. */
(function () {
  'use strict';

  /* ---- City table: name → [code, lat, lng, country] ---- */
  var CITIES = {
    london:['LON',51.5,-0.13,'United Kingdom'],'new york':['NYC',40.71,-74.0,'USA'],nyc:['NYC',40.71,-74.0,'USA'],jfk:['JFK',40.64,-73.78,'USA'],
    paris:['PAR',48.85,2.35,'France'],'san francisco':['SFO',37.62,-122.38,'USA'],'los angeles':['LAX',33.94,-118.4,'USA'],miami:['MIA',25.79,-80.29,'USA'],
    chicago:['CHI',41.88,-87.63,'USA'],"o'hare":['ORD',41.97,-87.9,'USA'],boston:['BOS',42.36,-71.06,'USA'],washington:['WAS',38.9,-77.04,'USA'],
    'hong kong':['HKG',22.31,113.91,'Hong Kong'],tokyo:['TYO',35.68,139.69,'Japan'],sydney:['SYD',-33.87,151.21,'Australia'],melbourne:['MEL',-37.81,144.96,'Australia'],
    rome:['ROM',41.9,12.5,'Italy'],milan:['MIL',45.46,9.19,'Italy'],venice:['VCE',45.44,12.32,'Italy'],madrid:['MAD',40.42,-3.7,'Spain'],barcelona:['BCN',41.39,2.17,'Spain'],
    lisbon:['LIS',38.72,-9.14,'Portugal'],amsterdam:['AMS',52.37,4.9,'Netherlands'],berlin:['BER',52.52,13.4,'Germany'],frankfurt:['FRA',50.11,8.68,'Germany'],munich:['MUC',48.14,11.58,'Germany'],
    zurich:['ZRH',47.38,8.54,'Switzerland'],geneva:['GVA',46.2,6.15,'Switzerland'],vienna:['VIE',48.21,16.37,'Austria'],copenhagen:['CPH',55.68,12.57,'Denmark'],stockholm:['STO',59.33,18.07,'Sweden'],
    oslo:['OSL',59.91,10.75,'Norway'],helsinki:['HEL',60.17,24.94,'Finland'],dublin:['DUB',53.35,-6.26,'Ireland'],edinburgh:['EDI',55.95,-3.19,'UK'],manchester:['MAN',53.48,-2.24,'UK'],
    gatwick:['LGW',51.15,-0.18,'UK'],heathrow:['LHR',51.47,-0.46,'UK'],athens:['ATH',37.98,23.73,'Greece'],istanbul:['IST',41.01,28.98,'Turkey'],
    'rio de janeiro':['RIO',-22.91,-43.17,'Brazil'],rio:['RIO',-22.91,-43.17,'Brazil'],'sao paulo':['SAO',-23.55,-46.63,'Brazil'],'são paulo':['SAO',-23.55,-46.63,'Brazil'],
    'buenos aires':['BUE',-34.6,-58.38,'Argentina'],lima:['LIM',-12.05,-77.04,'Peru'],santiago:['SCL',-33.45,-70.67,'Chile'],bogota:['BOG',4.71,-74.07,'Colombia'],caracas:['CCS',10.48,-66.9,'Venezuela'],
    'mexico city':['MEX',19.43,-99.13,'Mexico'],acapulco:['ACA',16.86,-99.88,'Mexico'],havana:['HAV',23.11,-82.37,'Cuba'],nassau:['NAS',25.05,-77.35,'Bahamas'],
    bermuda:['BDA',32.3,-64.78,'Bermuda'],'san juan':['SJU',18.47,-66.11,'Puerto Rico'],kingston:['KIN',17.97,-76.79,'Jamaica'],antigua:['ANU',17.13,-61.85,'Antigua'],barbados:['BGI',13.1,-59.61,'Barbados'],
    honolulu:['HNL',21.31,-157.86,'Hawaii'],hawaii:['HNL',21.31,-157.86,'Hawaii'],seattle:['SEA',47.61,-122.33,'USA'],denver:['DEN',39.74,-104.99,'USA'],dallas:['DFW',32.78,-96.8,'USA'],
    houston:['HOU',29.76,-95.37,'USA'],'new orleans':['MSY',29.95,-90.07,'USA'],atlanta:['ATL',33.75,-84.39,'USA'],detroit:['DTT',42.33,-83.05,'USA'],'las vegas':['LAS',36.17,-115.14,'USA'],
    philadelphia:['PHL',39.95,-75.17,'USA'],austin:['AUS',30.27,-97.74,'USA'],anchorage:['ANC',61.22,-149.9,'Alaska'],toronto:['YYZ',43.65,-79.38,'Canada'],montreal:['YUL',45.5,-73.57,'Canada'],vancouver:['YVR',49.28,-123.12,'Canada'],
    delhi:['DEL',28.61,77.21,'India'],bombay:['BOM',19.08,72.88,'India'],mumbai:['BOM',19.08,72.88,'India'],calcutta:['CCU',22.57,88.36,'India'],karachi:['KHI',24.86,67.0,'Pakistan'],
    bangkok:['BKK',13.76,100.5,'Thailand'],singapore:['SIN',1.35,103.82,'Singapore'],manila:['MNL',14.6,120.98,'Philippines'],jakarta:['JKT',-6.21,106.85,'Indonesia'],bali:['DPS',-8.65,115.22,'Bali'],
    saigon:['SGN',10.82,106.63,'Vietnam'],'kuala lumpur':['KUL',3.14,101.69,'Malaysia'],seoul:['SEL',37.57,126.98,'Korea'],taipei:['TPE',25.03,121.57,'Taiwan'],beijing:['PEK',39.9,116.4,'China'],shanghai:['SHA',31.23,121.47,'China'],
    tehran:['THR',35.69,51.39,'Iran'],beirut:['BEY',33.89,35.5,'Lebanon'],cairo:['CAI',30.04,31.24,'Egypt'],'tel aviv':['TLV',32.08,34.78,'Israel'],dubai:['DXB',25.2,55.27,'UAE'],
    nairobi:['NBO',-1.29,36.82,'Kenya'],johannesburg:['JNB',-26.2,28.05,'South Africa'],'cape town':['CPT',-33.92,18.42,'South Africa'],casablanca:['CAS',33.57,-7.59,'Morocco'],dakar:['DKR',14.72,-17.47,'Senegal'],
    lagos:['LOS',6.52,3.38,'Nigeria'],accra:['ACC',5.6,-0.19,'Ghana'],auckland:['AKL',-36.85,174.76,'New Zealand'],fiji:['NAN',-17.75,177.44,'Fiji'],tahiti:['PPT',-17.55,-149.56,'Tahiti'],guam:['GUM',13.44,144.79,'Guam'],
    reykjavik:['REK',64.15,-21.94,'Iceland'],moscow:['MOW',55.76,37.62,'Russia'],warsaw:['WAW',52.23,21.01,'Poland'],prague:['PRG',50.08,14.44,'Czechia'],budapest:['BUD',47.5,19.04,'Hungary'],nice:['NCE',43.7,7.27,'France'],
    brussels:['BRU',50.85,4.35,'Belgium'],glasgow:['GLA',55.86,-4.25,'UK'],shannon:['SNN',52.7,-8.92,'Ireland'],panama:['PTY',8.98,-79.52,'Panama'],guatemala:['GUA',14.63,-90.51,'Guatemala'],
    'st. louis':['STL',38.63,-90.2,'USA'],'st louis':['STL',38.63,-90.2,'USA'],'kansas city':['MKC',39.1,-94.58,'USA'],minneapolis:['MSP',44.98,-93.27,'USA'],'san diego':['SAN',32.72,-117.16,'USA'],portland:['PDX',45.52,-122.68,'USA'],
    baltimore:['BAL',39.29,-76.61,'USA'],pittsburgh:['PIT',40.44,-79.99,'USA'],cleveland:['CLE',41.5,-81.69,'USA'],memphis:['MEM',35.15,-90.05,'USA'],nashville:['BNA',36.16,-86.78,'USA'],'salt lake':['SLC',40.76,-111.89,'USA'],
    tampa:['TPA',27.95,-82.46,'USA'],orlando:['MCO',28.54,-81.38,'USA'],'palm beach':['PBI',26.71,-80.05,'USA'],omaha:['OMA',41.26,-95.94,'USA'],'oklahoma city':['OKC',35.47,-97.52,'USA'],tulsa:['TUL',36.15,-95.99,'USA'],
    brasilia:['BSB',-15.79,-47.88,'Brazil'],montevideo:['MVD',-34.9,-56.16,'Uruguay'],quito:['UIO',-0.18,-78.47,'Ecuador'],'la paz':['LPB',-16.5,-68.15,'Bolivia'],asuncion:['ASU',-25.26,-57.58,'Paraguay']
  };
  var KEYS = Object.keys(CITIES).sort(function (a, b) { return b.length - a.length; });

  function detectCity(p) {
    if (p.lat !== null && p.lng !== null && p.lat !== undefined && !isNaN(p.lat)) {
      return { code: p.code || (p.title.slice(0, 3).toUpperCase()), lat: +p.lat, lng: +p.lng, country: p.country || '' };
    }
    var hay = (p.title + ' ' + p.handle.replace(/-/g, ' ')).toLowerCase();
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i];
      if (hay.indexOf(k) !== -1) { var c = CITIES[k]; return { code: p.code || c[0], lat: c[1], lng: c[2], country: c[3] }; }
    }
    return null;
  }

  function cityName(p) {
    var m = p.title.match(/[‘'"]([^’'"]+)[’'"]/);
    var CODES = {JFK:1,LAX:1,SFO:1,NYC:1,ORD:1,LGW:1,LHR:1,DFW:1,CDG:1,AMS:1,MIA:1,BOS:1,LON:1,PAR:1,ROM:1,HKG:1,TYO:1,RIO:1,SYD:1,DUB:1};
    if (m) return m[1].split(/\s+/).map(function (w) { return CODES[w.toUpperCase()] && w.length === 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join(' ');
    return p.title.replace(/luggage tag|limited edition prints?|\bprint\b|\btag\b|\//gi, '').replace(/\s+/g, ' ').trim();
  }

  function airline(p) {
    var t = (p.title + ' ' + p.type + ' ' + p.tags).toLowerCase();
    if (t.indexOf('braniff') !== -1) return 'Braniff';
    if (t.indexOf('twa') !== -1) return 'TWA';
    if (t.indexOf('pan am') !== -1 || t.indexOf('panam') !== -1 || t.indexOf('pan-am') !== -1) return 'Pan Am';
    if (t.indexOf('bus') !== -1 || t.indexOf('train') !== -1 || t.indexOf('ticket') !== -1) return 'Bus & Train';
    return p.type || '';
  }

  function status(p) {
    if (!p.available) return { t: 'Departed', c: 'board__status--departed' };
    if (p.inventory !== null && p.inventory !== undefined && p.inventory <= 5 && p.inventory > 0) return { t: 'Final Call', c: 'board__status--final' };
    return { t: 'Now Boarding', c: '' };
  }

  function loadDestinations(id) {
    var el = document.getElementById(id);
    if (!el) return [];
    var raw = [];
    try { raw = JSON.parse(el.textContent); } catch (e) { return []; }
    var seen = {};
    return raw.map(function (p) {
      var c = detectCity(p); if (!c) return null;
      return { code: c.code, lat: c.lat, lng: c.lng, country: c.country, name: cityName(p), airline: airline(p),
        price: p.price, image: p.image, url: p.url, available: p.available, inventory: p.inventory, status: status(p) };
    }).filter(function (d) { if (!d || seen[d.code]) return false; seen[d.code] = 1; return true; });
  }

  /* ================= GLOBE ================= */
  function initGlobe() {
    var canvas = document.getElementById('globe-canvas'); if (!canvas || !window.d3 || !window.ELLA_LAND) return;
    var stage = canvas.parentNode, ctx = canvas.getContext('2d');
    var destinations = loadDestinations('globe-data');
    var loading = stage.querySelector('.globe__loading'); if (loading) loading.remove();
    if (!destinations.length) { stage.style.display = 'none'; return; }

    var DPR = Math.min(window.devicePixelRatio || 1, 2), SIZE = 640, baseR = 268;
    var projection = d3.geoOrthographic().clipAngle(90).precision(0.5);
    var path = d3.geoPath(projection, ctx), graticule = d3.geoGraticule10(), sphere = { type: 'Sphere' };
    var rot = [-destinations[0].lng, -destinations[0].lat], targetRot = [rot[0], rot[1] + 5];
    var scale = 1, targetScale = 1, active = 0, auto = false, idleT, dash = 0;

    function size() {
      var w = Math.min(stage.clientWidth, 640); SIZE = w; baseR = w * 0.42;
      canvas.width = w * DPR; canvas.height = w * DPR; canvas.style.width = w + 'px'; canvas.style.height = w + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); projection.translate([w / 2, w / 2]);
    }
    function idle() { clearTimeout(idleT); auto = false; idleT = setTimeout(function () { auto = true; }, 5000); }
    function shortest(a, b) { var d = (b - a) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return a + d; }
    function routes() { var a = destinations[active]; return destinations.filter(function (d, i) { return i !== active; }).map(function (d) { return { type: 'LineString', coordinates: [[a.lng, a.lat], [d.lng, d.lat]] }; }); }
    function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

    function draw() {
      projection.rotate(rot).scale(baseR * scale);
      ctx.clearRect(0, 0, SIZE, SIZE);
      var cx = SIZE / 2, cy = SIZE / 2, R = baseR * scale;
      var glow = ctx.createRadialGradient(cx, cy, R * .92, cx, cy, R * 1.13);
      glow.addColorStop(0, 'rgba(15,38,71,0)'); glow.addColorStop(.55, 'rgba(15,38,71,.16)'); glow.addColorStop(1, 'rgba(15,38,71,0)');
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.13, 0, 7); ctx.fillStyle = glow; ctx.fill();
      var ocean = ctx.createRadialGradient(cx - R * .32, cy - R * .38, R * .08, cx, cy, R);
      ocean.addColorStop(0, '#1E4074'); ocean.addColorStop(.55, '#0F2647'); ocean.addColorStop(1, '#050F22');
      ctx.beginPath(); path(sphere); ctx.fillStyle = ocean; ctx.fill();
      ctx.beginPath(); path(graticule); ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); path(window.ELLA_LAND);
      var land = ctx.createRadialGradient(cx - R * .3, cy - R * .35, R * .1, cx, cy, R);
      land.addColorStop(0, 'rgba(255,255,255,.30)'); land.addColorStop(1, 'rgba(255,255,255,.14)');
      ctx.fillStyle = land; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.42)'; ctx.lineWidth = .7; ctx.stroke();
      ctx.save(); ctx.beginPath(); routes().forEach(function (r) { path(r); }); ctx.setLineDash([3, 7]); ctx.lineDashOffset = -dash; ctx.strokeStyle = 'rgba(227,178,60,.6)'; ctx.lineWidth = 1.3; ctx.stroke(); ctx.restore();
      var shade = ctx.createRadialGradient(cx - R * .45, cy - R * .5, R * .2, cx, cy, R);
      shade.addColorStop(0, 'rgba(0,0,0,0)'); shade.addColorStop(.82, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(5,12,28,.38)');
      ctx.beginPath(); path(sphere); ctx.fillStyle = shade; ctx.fill();
      ctx.beginPath(); path(sphere); ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.6; ctx.stroke();
      var center = [-rot[0], -rot[1]];
      destinations.forEach(function (d, i) {
        d._s = null;
        if (d3.geoDistance([d.lng, d.lat], center) >= Math.PI / 2 - .02) return;
        var p = projection([d.lng, d.lat]); if (!p) return; d._s = p;
        var on = i === active;
        ctx.beginPath(); ctx.arc(p[0], p[1], on ? 11 : 7.5, 0, 7); ctx.fillStyle = on ? 'rgba(227,178,60,.28)' : 'rgba(232,80,58,.22)'; ctx.fill();
        ctx.beginPath(); ctx.arc(p[0], p[1], on ? 6 : 4.2, 0, 7); ctx.fillStyle = d.available ? (on ? '#E3B23C' : '#E8503A') : 'rgba(255,255,255,.55)'; ctx.fill();
        ctx.lineWidth = 1.6; ctx.strokeStyle = '#fff'; ctx.stroke();
        if (on) {
          ctx.font = '500 15px SI, Outfit, sans-serif'; ctx.textBaseline = 'middle';
          var tw = ctx.measureText(d.code).width, lx = p[0] + 14, ly = p[1];
          ctx.fillStyle = 'rgba(12,29,62,.78)'; rr(ctx, lx - 5, ly - 11, tw + 12, 22, 3); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.fillText(d.code, lx + 1, ly + .5);
        }
      });
    }
    function tick() {
      if (auto) targetRot[0] += .045;
      targetRot[1] = Math.max(-80, Math.min(80, targetRot[1]));
      rot[0] += (shortest(rot[0], targetRot[0]) - rot[0]) * .085;
      rot[1] += (targetRot[1] - rot[1]) * .085;
      scale += (targetScale - scale) * .09; dash += .16;
      draw(); requestAnimationFrame(tick);
    }

    /* Card */
    var card = document.getElementById('globe-card');
    function showCard(d) {
      var img = document.getElementById('gc-img');
      img.innerHTML = d.image ? '<img src="' + d.image + '" alt="' + d.name + '" loading="lazy">' : '<div class="tag">' + d.code + '</div>';
      document.getElementById('gc-code').textContent = d.code + (d.country ? ' · ' + d.country : '');
      document.getElementById('gc-name').textContent = d.name;
      document.getElementById('gc-meta').innerHTML = d.airline + ' · Edition of 25 · <b>' + d.price + '</b>';
      var a = document.getElementById('gc-link'); a.href = d.url; a.textContent = d.available ? 'View this piece →' : 'Sold out · View →';
      card.classList.add('is-visible');
    }
    /* Rotates to a destination without changing zoom. Zoom stays entirely
       under the visitor's control (buttons, pinch, Cmd/Ctrl + scroll). */
    function flyTo(i) {
      active = i; var d = destinations[i];
      targetRot[0] = shortest(rot[0], -d.lng); targetRot[1] = -d.lat;
      auto = false; idle(); showCard(d);
      rows.forEach(function (r, j) { r.classList.toggle('is-active', j === i); });
    }

    /* Board */
    var rowsEl = document.getElementById('board-rows'), rows = [];
    if (rowsEl) {
      var limit = +(rowsEl.getAttribute('data-limit') || 8);
      destinations.slice(0, limit).forEach(function (d, i) {
        var b = document.createElement('a'); b.className = 'board__row'; b.href = d.url;
        b.innerHTML = '<span class="board__code">' + d.code + '</span><span class="board__city">' + d.name + '<small>' + d.airline + (d.country ? ' · ' + d.country : '') + '</small></span>' +
          '<span class="board__status ' + d.status.c + '">' + d.status.t + '</span><span class="board__price">' + d.price + '</span>';
        b.addEventListener('mouseenter', function () { flyTo(i); });
        b.addEventListener('focus', function () { flyTo(i); });
        rowsEl.appendChild(b); rows.push(b);
      });
    }

    /* Pointer: drag, tap, pinch */
    var dragging = false, lx, ly, moved, pinchD = 0;
    function down(x, y) { dragging = true; moved = false; lx = x; ly = y; canvas.classList.add('is-dragging'); auto = false; }
    function move(x, y) { if (!dragging) return; var k = .22 / scale * (640 / SIZE) * 1.6; targetRot[0] += (x - lx) * k; targetRot[1] -= (y - ly) * k; if (Math.abs(x - lx) + Math.abs(y - ly) > 3) moved = true; lx = x; ly = y; }
    function up() { if (dragging) { dragging = false; canvas.classList.remove('is-dragging'); idle(); } }
    canvas.addEventListener('mousedown', function (e) { down(e.clientX, e.clientY); });
    window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    window.addEventListener('mouseup', up);
    canvas.addEventListener('touchstart', function (e) { if (e.touches.length === 2) { pinchD = dist(e.touches); dragging = false; return; } var t = e.touches[0]; down(t.clientX, t.clientY); }, { passive: true });
    canvas.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2) { var d = dist(e.touches); if (pinchD) setZoom(targetScale * (d / pinchD)); pinchD = d; e.preventDefault(); return; }
      var t = e.touches[0]; move(t.clientX, t.clientY); if (moved) e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', function (e) { if (e.touches.length < 2) pinchD = 0; up(); });
    function dist(t) { var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY; return Math.sqrt(dx * dx + dy * dy); }

    canvas.addEventListener('click', function (e) {
      if (moved) return;
      var r = canvas.getBoundingClientRect(), mx = (e.clientX - r.left) * (SIZE / r.width), my = (e.clientY - r.top) * (SIZE / r.height), hit = -1, best = 26;
      destinations.forEach(function (d, i) { if (!d._s) return; var dx = mx - d._s[0], dy = my - d._s[1], dd = Math.sqrt(dx * dx + dy * dy); if (dd < best) { best = dd; hit = i; } });
      if (hit >= 0) { if (hit === active) window.location.href = destinations[hit].url; else flyTo(hit); }
    });
    function setZoom(s) { targetScale = Math.max(1, Math.min(2.6, s)); idle(); }

    /* Wheel zoom requires Cmd (Mac) or Ctrl, so scrolling past the globe never
       hijacks the page. A brief prompt appears if the modifier isn't held. */
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    var modLabel = isMac ? '\u2318' : 'Ctrl';
    var prompt = document.createElement('div');
    prompt.className = 'globe__modal';
    prompt.innerHTML = '<span>Hold <b>' + modLabel + '</b> and scroll to zoom</span>';
    stage.appendChild(prompt);
    var promptT;
    function flashPrompt() {
      prompt.classList.add('is-shown');
      clearTimeout(promptT);
      promptT = setTimeout(function () { prompt.classList.remove('is-shown'); }, 1400);
    }
    canvas.addEventListener('wheel', function (e) {
      if (!(e.metaKey || e.ctrlKey)) { flashPrompt(); return; }   /* let the page scroll */
      e.preventDefault();
      setZoom(targetScale * (e.deltaY < 0 ? 1.12 : .89));
    }, { passive: false });
    var zi = document.getElementById('zoom-in'), zo = document.getElementById('zoom-out');
    if (zi) zi.addEventListener('click', function () { setZoom(targetScale * 1.3); });
    if (zo) zo.addEventListener('click', function () { setZoom(targetScale / 1.3); });

    window.addEventListener('resize', size);
    size(); flyTo(0); idle(); tick();
  }

  /* ================= FLAT ROUTE MAP (collection page) ================= */
  function initRouteMap() {
    var host = document.getElementById('routemap'); if (!host || !window.ELLA_LAND) return;
    var destinations = loadDestinations('routemap-data'); if (!destinations.length) { host.style.display = 'none'; return; }
    /* Latitude window trimmed to the inhabited band so the panel stays shallow
       and the map fills it edge to edge with no letterboxing. */
    var LAT_TOP = 63, LAT_BOT = -44, W = 1200;
    var H = Math.round(W * (LAT_TOP - LAT_BOT) / 360);   /* 357 -> aspect 3.36 */
    function xy(lng, lat) { return [(lng + 180) / 360 * W, (LAT_TOP - lat) / (LAT_TOP - LAT_BOT) * H]; }
    var svg = ['<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map of destinations">'];
    svg.push('<rect width="' + W + '" height="' + H + '" fill="#0A1C38"/>');
    for (var lat = -60; lat <= 60; lat += 30) { var y = xy(0, lat)[1]; svg.push('<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '" stroke="rgba(255,255,255,.05)"/>'); }
    for (var lng = -150; lng <= 150; lng += 30) { var x = xy(lng, 0)[0]; svg.push('<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="rgba(255,255,255,.05)"/>'); }
    var d = '';
    window.ELLA_LAND.features.forEach(function (f) {
      var polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      polys.forEach(function (poly) { poly.forEach(function (ring) { ring.forEach(function (c, i) { var p = xy(c[0], c[1]); d += (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }); d += 'Z'; }); });
    });
    svg.push('<path d="' + d + '" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.35)" stroke-width=".8"/>');
    destinations.forEach(function (dd) {
      var p = xy(dd.lng, dd.lat);
      svg.push('<a class="routemap__dot" href="' + dd.url + '" data-code="' + dd.code + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" fill="rgba(232,80,58,.2)"/><circle class="main" cx="' + p[0] + '" cy="' + p[1] + '" r="4.5" fill="' + (dd.available ? '#E8503A' : 'rgba(255,255,255,.5)') + '" stroke="#fff" stroke-width="1.4"/><text class="routemap__label" x="' + (p[0] + 12) + '" y="' + (p[1] + 3.5) + '">' + dd.code + ' · ' + dd.name.toUpperCase() + '</text></a>');
    });
    svg.push('</svg>');
    host.innerHTML = '<span class="routemap__hud">Route map · ' + destinations.length + ' destinations</span>' + svg.join('');
    /* link map dots to cards */
    var dots = host.querySelectorAll('.routemap__dot');
    dots.forEach(function (dot) {
      dot.addEventListener('mouseenter', function () {
        var code = dot.getAttribute('data-code');
        document.querySelectorAll('.tag-card[data-code]').forEach(function (c) { c.style.opacity = c.getAttribute('data-code') === code ? '1' : '.35'; });
      });
      dot.addEventListener('mouseleave', function () { document.querySelectorAll('.tag-card[data-code]').forEach(function (c) { c.style.opacity = ''; }); });
    });
  }

  /* Tag product cards with their detected codes (for map ↔ grid linking) */
  function tagCards() {
    document.querySelectorAll('.tag-card').forEach(function (c) {
      var c2 = detectCity({ title: c.getAttribute('data-title') || '', handle: c.getAttribute('data-handle') || '', lat: null, lng: null });
      if (c2) { c.setAttribute('data-code', c2.code); var codeEl = c.querySelector('.tag-card__code[data-auto]'); if (codeEl && !codeEl.textContent.trim()) codeEl.textContent = c2.code; }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { tagCards(); initGlobe(); initRouteMap(); });
  else { tagCards(); initGlobe(); initRouteMap(); }
})();
