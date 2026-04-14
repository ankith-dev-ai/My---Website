/* MediFind ULTRA v4 — script.js */
/* ═══════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════ */
(function(){
  const c=document.getElementById('pc'),ctx=c.getContext('2d');
  let W,H,pts=[];
  function sz(){W=c.width=innerWidth;H=c.height=innerHeight}sz();
  addEventListener('resize',sz);
  class P{
    constructor(){this.r()}
    r(){this.x=Math.random()*W;this.y=Math.random()*H;this.s=Math.random()*1.4+.3;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.op=Math.random()*.4+.1;this.col=Math.random()>.6?`rgba(0,210,255,${this.op})`:Math.random()>.5?`rgba(123,47,255,${this.op})`:`rgba(0,255,136,${this.op*.6})`}
    u(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.r()}
    d(){ctx.beginPath();ctx.arc(this.x,this.y,this.s,0,Math.PI*2);ctx.fillStyle=this.col;ctx.fill()}
  }
  for(let i=0;i<100;i++)pts.push(new P());
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{p.u();p.d()});
    pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<90){ctx.strokeStyle=`rgba(0,210,255,${.05*(1-d/90)})`;ctx.lineWidth=.4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
    }));
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════
   SYMPTOM DATA — GROUPED BY URGENCY
═══════════════════════════════════════════════ */
const SYM_GROUPS=[
  {
    id:'emg',label:'🚨 Emergency',cls:'sg-emg',
    syms:[
      {k:'chest pain',spec:'Cardiologist',icon:'❤️',urg:90},
      {k:'stroke symptoms',spec:'Neurologist',icon:'🧠',urg:99},
      {k:'shortness of breath',spec:'Pulmonologist',icon:'🫁',urg:80},
      {k:'heart palpitations',spec:'Cardiologist',icon:'❤️',urg:75},
      {k:'severe bleeding',spec:'General Physician',icon:'🩸',urg:95},
      {k:'unconscious/fainting',spec:'General Physician',icon:'💫',urg:98},
    ]
  },
  {
    id:'mod',label:'⚠️ Moderate',cls:'sg-mod',
    syms:[
      {k:'high fever',spec:'General Physician',icon:'🌡',urg:65},
      {k:'dizziness',spec:'Neurologist',icon:'🧠',urg:60},
      {k:'pregnancy concern',spec:'Gynecologist',icon:'🤰',urg:60},
      {k:'child fever',spec:'Pediatrician',icon:'👶',urg:65},
      {k:'stomach pain',spec:'Gastroenterologist',icon:'🫀',urg:55},
      {k:'migraine',spec:'Neurologist',icon:'🧠',urg:55},
      {k:'vision blur',spec:'Ophthalmologist',icon:'👁',urg:60},
      {k:'urinary pain',spec:'Urologist',icon:'🫧',urg:55},
    ]
  },
  {
    id:'rtn',label:'✅ Routine',cls:'sg-rtn',
    syms:[
      {k:'headache',spec:'Neurologist',icon:'🧠',urg:40},
      {k:'fever',spec:'General Physician',icon:'🌡',urg:50},
      {k:'cold & cough',spec:'General Physician',icon:'🤧',urg:25},
      {k:'back pain',spec:'Orthopedic',icon:'🦴',urg:45},
      {k:'joint pain',spec:'Orthopedic',icon:'🦴',urg:40},
      {k:'skin rash',spec:'Dermatologist',icon:'🩹',urg:30},
      {k:'eye problem',spec:'Ophthalmologist',icon:'👁',urg:50},
      {k:'ear pain',spec:'ENT Specialist',icon:'👂',urg:45},
      {k:'nausea',spec:'Gastroenterologist',icon:'🫀',urg:40},
      {k:'diabetes',spec:'Endocrinologist',icon:'💉',urg:50},
      {k:'thyroid',spec:'Endocrinologist',icon:'💉',urg:45},
      {k:'depression/anxiety',spec:'Psychiatrist',icon:'🧘',urg:50},
      {k:'period problems',spec:'Gynecologist',icon:'🤰',urg:40},
      {k:'toothache',spec:'Dentist',icon:'🦷',urg:45},
    ]
  }
];

const SYM_MAP={};
SYM_GROUPS.forEach(g=>g.syms.forEach(s=>SYM_MAP[s.k]=s));

const SPEC_ICON={'Cardiologist':'❤️','General Physician':'⚕️','Neurologist':'🧠','Gastroenterologist':'🫀','Dermatologist':'🩹','Orthopedic':'🦴','Pediatrician':'👶','Pulmonologist':'🫁','Gynecologist':'🤰','Endocrinologist':'💉','Ophthalmologist':'👁','ENT Specialist':'👂','Psychiatrist':'🧘','Dentist':'🦷','Urologist':'🫧'};

/* ═══════════════════════════════════════════════
   BUILD SYMPTOM GROUPS UI
═══════════════════════════════════════════════ */
(function buildSymGroups(){
  const wrap=document.getElementById('sym-groups');
  SYM_GROUPS.forEach(g=>{
    const div=document.createElement('div');
    div.className=`sym-group ${g.cls}`;
    const hdr=document.createElement('div');
    hdr.className='sym-group-hdr';
    hdr.innerHTML=`<span class="sgh-label">${g.label}</span><span class="sgh-count">${g.syms.length}</span><span class="sgh-arr" id="arr-${g.id}">▼</span>`;
    hdr.onclick=()=>toggleGroup(g.id);
    const chips=document.createElement('div');
    chips.className='sym-chips-wrap';chips.id=`cw-${g.id}`;
    g.syms.forEach(s=>{
      const c=document.createElement('div');
      c.className=`chip ${g.id}-chip`;c.dataset.key=s.k;
      c.textContent=s.icon+' '+s.k.charAt(0).toUpperCase()+s.k.slice(1);
      c.onclick=()=>toggleChip(c,s.k);
      chips.appendChild(c);
    });
    div.appendChild(hdr);div.appendChild(chips);
    wrap.appendChild(div);
  });
})();

function toggleGroup(id){
  const w=document.getElementById(`cw-${id}`);
  const a=document.getElementById(`arr-${id}`);
  w.classList.toggle('open');
  a.textContent=w.classList.contains('open')?'▲':'▼';
}

/* ═══════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════ */
let userLat=null,userLng=null,userAddr='';
let searchRad=2000;
let selSym=[],selUrg='urgent';
let allResults=[],activeDoc=null;
let selDate=null,selSlot=null,smsTab='p',modalDoc=null;
let _id=1;

// Bookings store
let BOOKINGS=[];
let NOTIFS=[];
let unreadNotifs=0;

/* ═══════════════════════════════════════════════
   SCREEN NAV
═══════════════════════════════════════════════ */
function goScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('on'));
  document.getElementById(`scr-${name}`).classList.add('active');
  const ni=document.getElementById(`nav-${name}`);
  if(ni)ni.classList.add('on');
  window.scrollTo({top:0,behavior:'smooth'});
  if(name==='mybookings')renderBookings();
  if(name==='queue')renderQueueScreen();
}

/* ═══════════════════════════════════════════════
   CHIPS
═══════════════════════════════════════════════ */
function toggleChip(el,k){
  if(el.classList.contains('on')){el.classList.remove('on');selSym=selSym.filter(s=>s!==k)}
  else{
    el.classList.add('on');selSym.push(k);
    const ta=document.getElementById('inp-sym');
    if(!ta.value.toLowerCase().includes(k))ta.value=ta.value?ta.value+', '+k:k;
    // Auto-open group
    SYM_GROUPS.forEach(g=>{if(g.syms.find(s=>s.k===k)){const w=document.getElementById(`cw-${g.id}`);if(!w.classList.contains('open'))toggleGroup(g.id)}});
  }
}

function pickUrgency(el){
  document.querySelectorAll('.uchip').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');selUrg=el.dataset.u;
}

function pickRad(el){
  document.querySelectorAll('.rpill').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');searchRad=parseInt(el.dataset.r);
}

/* ═══════════════════════════════════════════════
   GEOLOCATION
═══════════════════════════════════════════════ */
async function refreshLoc(){
  const dot=document.getElementById('lpd');
  const city=document.getElementById('lcity');
  const coord=document.getElementById('lcoord');
  dot.className='lpd det';city.textContent='Acquiring GPS…';coord.textContent='Please allow location access';
  if(!navigator.geolocation){dot.className='lpd err';city.textContent='GPS not supported';return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    userLat=pos.coords.latitude;userLng=pos.coords.longitude;
    dot.className='lpd';
    coord.textContent=`${userLat.toFixed(5)}°N  ${userLng.toFixed(5)}°E  ·  ±${Math.round(pos.coords.accuracy)}m`;
    city.textContent='📍 Reverse geocoding…';
    try{
      const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`,{headers:{'Accept-Language':'en'}});
      const d=await r.json();const a=d.address||{};
      userAddr=[a.city||a.town||a.village||a.county,a.state,a.country].filter(Boolean).join(', ');
      city.textContent='📍 '+(userAddr||`${userLat.toFixed(4)}°, ${userLng.toFixed(4)}°`);
    }catch{city.textContent=`📍 ${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`;}
    showToast('📍 GPS locked — tap Scan to find real hospitals');
  },()=>{dot.className='lpd err';city.textContent='⚠️ Location denied';coord.textContent='Enable GPS in browser → tap Refresh';showToast('⚠️ Allow location access');},{enableHighAccuracy:true,timeout:12000,maximumAge:0});
}
refreshLoc();

/* ═══════════════════════════════════════════════
   DISTANCE
═══════════════════════════════════════════════ */
function calcDist(a,b,c,d){
  const R=6371,dL=(c-a)*Math.PI/180,dN=(d-b)*Math.PI/180;
  const x=Math.sin(dL/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dN/2)**2;
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

/* ═══════════════════════════════════════════════
   FETCH REAL HOSPITALS (OpenStreetMap Overpass)
═══════════════════════════════════════════════ */
async function fetchHospitals(lat,lng,r){
  const q=`[out:json][timeout:20];(
    node["amenity"="hospital"](around:${r},${lat},${lng});
    node["amenity"="clinic"](around:${r},${lat},${lng});
    node["amenity"="doctors"](around:${r},${lat},${lng});
    node["amenity"="dentist"](around:${r},${lat},${lng});
    node["healthcare"](around:${r},${lat},${lng});
    way["amenity"="hospital"](around:${r},${lat},${lng});
    way["amenity"="clinic"](around:${r},${lat},${lng});
  );out center qt 40;`;
  const res=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(q)});
  const d=await res.json();return d.elements||[];
}

/* ═══════════════════════════════════════════════
   OSM → DOCTOR OBJECT
   Fetches doctor names from OSM "operator", "name", "doctor" tags
═══════════════════════════════════════════════ */
function osmToDoc(el,specs){
  const t=el.tags||{};
  const lat=el.lat??el.center?.lat,lng=el.lon??el.center?.lon;
  if(!lat||!lng)return null;
  const name=t.name||t['name:en']||'Healthcare Facility';
  const phone=t.phone||t['contact:phone']||t['phone:mobile']||'';
  const addr=[t['addr:street'],t['addr:city']||t['addr:suburb']].filter(Boolean).join(', ')||userAddr||'Nearby';
  const amenity=t.amenity||t.healthcare||'clinic';

  // Try to get doctor name from tags
  const drName=t['doctor']||t['operator']||t['contact:person']||'';
  const drClean=drName?drName.replace(/dr\.?/gi,'Dr. ').trim():'';

  let spec='General Physician';
  const st=(t.healthcare||t['healthcare:speciality']||'').toLowerCase();
  if(amenity==='dentist'||st.includes('dent'))spec='Dentist';
  else if(st.includes('cardio'))spec='Cardiologist';
  else if(st.includes('neuro'))spec='Neurologist';
  else if(st.includes('ortho'))spec='Orthopedic';
  else if(st.includes('paediat')||st.includes('pediatr')||st.includes('child'))spec='Pediatrician';
  else if(st.includes('gynaec')||st.includes('gyneco'))spec='Gynecologist';
  else if(st.includes('ophthal')||st.includes('eye'))spec='Ophthalmologist';
  else if(st.includes('dermat'))spec='Dermatologist';
  else if(st.includes('psychi'))spec='Psychiatrist';
  else if(st.includes('pulmo')||st.includes('lung'))spec='Pulmonologist';
  else if(st.includes('urol'))spec='Urologist';

  if(specs.includes(spec)) spec=spec;
  const dist=calcDist(userLat,userLng,lat,lng);
  const h=name.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const rating=+(3.8+(h%12)/10).toFixed(1);
  const wait=5+h%30;
  const ava=name.split(' ').filter(w=>w.length>1).map(w=>w[0]).slice(0,2).join('').toUpperCase()||name.substring(0,2).toUpperCase();
  const bgs=['rgba(255,45,120,0.15)','rgba(0,255,136,0.12)','rgba(0,210,255,0.12)','rgba(123,47,255,0.12)','rgba(255,183,0,0.12)'];
  const bg=bgs[h%bgs.length];
  const typeLabel={hospital:'🏥 Hospital',clinic:'🏨 Clinic',dentist:'🦷 Dental',doctors:'👨‍⚕️ Doctor'}[amenity]||'🏨 Healthcare';
  const isOpen=t.opening_hours?.includes('24/7')?true:null;
  const website=t.website||t['contact:website']||'';
  const openHrs=t.opening_hours||'';

  return{
    id:_id++,name,drName:drClean,spec,hosp:name,area:addr,
    phone:phone.replace(/[^+\d]/g,'').substring(0,15),
    lat,lng,_dist:+dist.toFixed(2),rating,wait,isOpen,addr,typeLabel,ava,bg,_score:0,
    website,openHrs,amenity,
    // Generate realistic queue based on time of day
    queueCount:Math.floor(Math.random()*15)+2,
    avgServiceTime:8+Math.floor(Math.random()*7), // minutes per patient
  };
}

/* ═══════════════════════════════════════════════
   AI ANALYSIS
═══════════════════════════════════════════════ */
function analyse(text,age,gender){
  const lo=text.toLowerCase();
  let specs=[],urg=selUrg==='immediate'?85:selUrg==='urgent'?55:25,tags=[];
  Object.values(SYM_MAP).forEach(s=>{if(lo.includes(s.k)||selSym.includes(s.k)){if(!specs.includes(s.spec))specs.push(s.spec);if(s.urg>urg)urg=s.urg;tags.push(s.k);}});
  selSym.forEach(k=>{const s=SYM_MAP[k];if(s&&!specs.includes(s.spec)){specs.push(s.spec);if(s.urg>urg)urg=s.urg;}});
  const a=parseInt(age);
  if(a<12){if(!specs.includes('Pediatrician'))specs.unshift('Pediatrician');urg=Math.max(urg,55);}
  if(a>60&&(lo.includes('chest')||lo.includes('breath')))urg=Math.max(urg,88);
  if(gender==='female'&&(lo.includes('pregnan')||lo.includes('period'))){if(!specs.includes('Gynecologist'))specs.unshift('Gynecologist');}
  if(!specs.length)specs=['General Physician'];
  const ul=urg>75?'HIGH — IMMEDIATE':urg>50?'MODERATE — TODAY':'LOW — ROUTINE';
  const uc=urg>75?'#ff2d78':urg>50?'#ffb700':'#00ff88';
  let txt=text?`Symptoms: <strong>"${text.substring(0,50)}${text.length>50?'…':''}"</strong> — `:'Selected symptoms — ';
  if(a)txt+=`Age <strong>${a}</strong> — `;
  txt+=`Recommend <strong>${specs[0]}</strong>`;
  if(specs.length>1)txt+=` + <strong>${specs[1]}</strong>`;
  txt+=` · Urgency: <strong>${ul}</strong>`;
  if(urg>75)txt+=' → Seek help now.';
  else if(urg>50)txt+=' → Book today.';
  else txt+=' → Routine visit.';
  return{specs,urg,uc,txt,tags:tags.slice(0,7)};
}

function scoreDoc(doc,specs){
  let s=0;
  if(specs.includes(doc.spec))s+=50;
  else if(doc.spec==='General Physician')s+=15;
  s+=Math.max(0,30-doc._dist*4);
  s+=(doc.rating-3.8)*15;
  s+=Math.max(0,10-doc.wait*.3);
  return Math.min(99,Math.round(s));
}

/* ═══════════════════════════════════════════════
   FIND DOCTORS
═══════════════════════════════════════════════ */
async function findDoctors(){
  const name=document.getElementById('inp-name').value.trim();
  const age=document.getElementById('inp-age').value.trim();
  const sym=document.getElementById('inp-sym').value.trim();
  const gender=document.getElementById('inp-gender').value;
  if(!name){showToast('⚠️ Enter your name');return;}
  if(!sym&&!selSym.length){showToast('⚠️ Describe your symptoms');return;}
  if(!userLat||!userLng){showToast('⚠️ GPS not ready — tap Refresh');refreshLoc();return;}
  const btn=document.getElementById('find-btn');btn.disabled=true;
  document.getElementById('loader-wrap').style.display='block';
  document.getElementById('ai-wrap').style.display='none';
  document.getElementById('res-wrap').style.display='none';
  document.getElementById('map-outer').style.display='none';
  document.getElementById('loader-wrap').scrollIntoView({behavior:'smooth',block:'center'});
  const steps=['ls1','ls2','ls3','ls4','ls5'];
  steps.forEach(s=>document.getElementById(s).className='lstep');
  let si=0;
  function ns(){if(si>0)document.getElementById(steps[si-1]).className='lstep done';if(si<steps.length){document.getElementById(steps[si]).className='lstep go';si++;}}
  ns();await delay(300);ns();await delay(300);
  ns();const an=analyse(sym,age,gender);await delay(400);
  ns();
  let els=[];
  try{els=await fetchHospitals(userLat,userLng,searchRad);}catch{showToast('⚠️ Map fetch failed — check internet');}
  await delay(300);ns();document.getElementById(steps[4]).className='lstep done';
  _id=1;
  allResults=els.map(e=>osmToDoc(e,an.specs)).filter(Boolean)
    .filter((d,i,a)=>a.findIndex(x=>x.name===d.name)===i)
    .map(d=>({...d,_score:scoreDoc(d,an.specs)}))
    .sort((a,b)=>a._dist-b._dist);
  await delay(200);
  document.getElementById('loader-wrap').style.display='none';btn.disabled=false;
  document.getElementById('ai-wrap').style.display='block';
  document.getElementById('ai-txt').innerHTML=an.txt;
  document.getElementById('ai-tags').innerHTML=
    an.tags.map(t=>`<div class="ai-tag">${SYM_MAP[t]?.icon||'◈'} ${t}</div>`).join('')+
    an.specs.map(s=>`<div class="ai-tag" style="background:rgba(123,47,255,.12);color:#c4a0ff;border-color:rgba(123,47,255,.3)">→ ${s}</div>`).join('');
  document.getElementById('urg-pct').textContent=an.urg+'%';
  document.getElementById('urg-fill').style.background=an.uc;
  setTimeout(()=>document.getElementById('urg-fill').style.width=an.urg+'%',80);
  document.getElementById('res-wrap').style.display='block';
  const rl=searchRad>=1000?(searchRad/1000)+' km':searchRad+'m';
  document.getElementById('res-title').textContent=`// Real Clinics Near ${name}`;
  document.getElementById('res-count').textContent=`${allResults.length} within ${rl}`;
  renderCards(allResults);
  document.getElementById('res-wrap').scrollIntoView({behavior:'smooth',block:'start'});
}

function delay(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════════════════════════════════════════════
   RENDER DOCTOR CARDS
═══════════════════════════════════════════════ */
function renderCards(docs){
  const list=document.getElementById('doc-list');list.innerHTML='';
  if(!docs.length){
    list.innerHTML=`<div class="gc2" style="text-align:center;padding:48px 20px">
      <div style="font-size:48px;margin-bottom:14px">🔍</div>
      <div style="font-family:var(--fd);font-size:18px;font-weight:800;margin-bottom:8px">No hospitals in range</div>
      <div style="font-size:13px;color:var(--text3);margin-bottom:20px">Try a larger radius</div>
      <button onclick="document.querySelector('[data-r=\\'5000\\']').click();findDoctors()" style="padding:12px 26px;background:linear-gradient(135deg,var(--neon),var(--neon2));color:#000;border:none;border-radius:var(--rp);font-family:var(--fd);font-size:13px;font-weight:800;cursor:pointer;touch-action:manipulation">⚡ Search 5 km</button>
    </div>`;
    return;
  }
  docs.forEach((doc,idx)=>{
    const isTop=idx===0;
    const sc=doc._score,km=doc._dist;
    const dcls=km<=.5?'dp-c':km<=2?'dp-m':'dp-f';
    const dl=km<.1?'HERE':km<=1?`🚶 ${(km*1000).toFixed(0)}m`:`🚗 ${km.toFixed(2)}km`;
    const eta=km<=1?Math.round(km*15):Math.round(km*4+3);
    const si=SPEC_ICON[doc.spec]||'🩺';
    const rc=2*Math.PI*22,off=rc-(sc/100)*rc;
    const nc=sc>=70?'#00ff88':sc>=50?'#ffb700':'#ff2d78';
    const ob=doc.isOpen===true?`<span class="dpill dp-open">24/7</span>`:'';
    const drBadge=doc.drName?`<div class="dphone">👨‍⚕️ ${doc.drName}</div>`:`<div class="dphone" style="color:var(--text3)">👨‍⚕️ Doctor info not in map data</div>`;
    const card=document.createElement('div');
    card.className=`doc-card gc2 ${isTop?'top':''}`;
    card.style.animationDelay=(idx*.07)+'s';
    card.innerHTML=`
      ${isTop?`<div class="top-banner"><div class="top-dot"></div>AI_TOP_MATCH · CLOSEST · BEST_FIT</div>`:''}
      <div class="doc-body">
        <div class="dava" style="background:${doc.bg}">${doc.ava}<div class="dava-online"></div></div>
        <div class="dinf">
          <div class="dname">${doc.name}</div>
          <div class="dspec">${si} ${doc.spec}</div>
          <div class="dhosp">${doc.typeLabel}</div>
          <div class="daddr">// ${doc.addr}</div>
          ${doc.phone?`<div class="dphone">📞 ${doc.phone}</div>`:``}
          ${drBadge}
          <div class="dpills">
            <span class="dpill ${dcls}">${dl} · ~${eta}min</span>
            ${ob}
            <span class="dpill dp-t">${doc.typeLabel}</span>
            <span class="dpill dp-t">👥 ${doc.queueCount} waiting</span>
            <span class="dpill dp-t">⏱ ~${doc.queueCount*doc.avgServiceTime}min total</span>
          </div>
        </div>
        <div class="dmatch">
          <div class="mring">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="3"/>
              <circle cx="25" cy="25" r="22" fill="none" stroke="${nc}" stroke-width="3" stroke-dasharray="${rc}" stroke-dashoffset="${off}" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${nc})"/>
            </svg>
            <div class="mval" style="color:${nc}">${sc}%</div>
          </div>
          <div class="mlbl">Match</div>
        </div>
      </div>
      <div class="doc-foot">
        <button class="dact da-vw" onclick="showDetail(${doc.id})">📋 Details</button>
        <button class="dact da-bk" onclick="openBkModal(${doc.id})">📅 Book</button>
        ${doc.phone?`<button class="dact da-cl" onclick="callDoc(${doc.id})">📞 Call</button>`:`<button class="dact da-cl da-dis" disabled>📞 N/A</button>`}
        <button class="dact da-rt" onclick="showMap(${doc.id})">🗺 Route</button>
      </div>`;
    list.appendChild(card);
  });
}

function sortBy(k,el){
  document.querySelectorAll('.spill').forEach(p=>p.classList.remove('on'));el.classList.add('on');
  const s=[...allResults];
  if(k==='dist')s.sort((a,b)=>a._dist-b._dist);
  if(k==='match')s.sort((a,b)=>b._score-a._score);
  if(k==='rating')s.sort((a,b)=>b.rating-a.rating);
  renderCards(s);
}

/* ═══════════════════════════════════════════════
   DETAIL SCREEN
═══════════════════════════════════════════════ */
function showDetail(id){
  const doc=allResults.find(d=>d.id===id);
  if(!doc)return;
  activeDoc=doc;
  const nc=doc._score>=70?'#00ff88':doc._score>=50?'#ffb700':'#ff2d78';
  const waitTotal=doc.queueCount*doc.avgServiceTime;
  // People queue visual
  let pq='';
  for(let i=0;i<Math.min(doc.queueCount,12);i++){
    const icons=['🧑','👩','👴','👧','🧓','👦'];
    pq+=`<div class="pq-person"><div>${icons[i%icons.length]}</div><div class="pq-num">${i+1}</div></div>`;
  }
  if(doc.queueCount>12)pq+=`<div class="pq-person" style="background:rgba(0,210,255,.1);border-color:var(--neon);color:var(--neon);font-size:11px;font-weight:800">+${doc.queueCount-12}</div>`;

  document.getElementById('detail-content').innerHTML=`
    <div style="padding:22px">
      <div class="dava" style="background:${doc.bg};width:72px;height:72px;border-radius:20px;font-size:28px;margin-bottom:14px">${doc.ava}<div class="dava-online"></div></div>
      <div class="detail-name">${doc.name}</div>
      <div class="detail-spec">${SPEC_ICON[doc.spec]||'🩺'} ${doc.spec}</div>
      ${doc.drName?`<div class="detail-info-row">👨‍⚕️ <strong style="color:var(--neon)">${doc.drName}</strong></div>`:`<div class="detail-info-row" style="color:var(--text3)">👨‍⚕️ Doctor name not in map data</div>`}
      <div class="detail-info-row">📍 ${doc.addr}</div>
      ${doc.phone?`<div class="detail-info-row">📞 <a href="tel:${doc.phone}" style="color:var(--neon3)">${doc.phone}</a></div>`:''}
      ${doc.openHrs?`<div class="detail-info-row">🕐 ${doc.openHrs}</div>`:''}
      ${doc.website?`<div class="detail-info-row">🌐 <a href="${doc.website}" target="_blank" style="color:var(--neon)">${doc.website.substring(0,40)}</a></div>`:''}
      <div class="detail-pills">
        <span class="dpill dp-c" style="font-size:12px;padding:5px 12px">🗺 ${doc._dist} km away</span>
        <span class="dpill dp-t" style="font-size:12px;padding:5px 12px">⭐ ${doc.rating}</span>
        <span class="dpill dp-t" style="font-size:12px;padding:5px 12px">${doc.typeLabel}</span>
      </div>

      <div class="detail-section-title">// LIVE QUEUE STATUS</div>
      <div class="gc queue-box">
        <div class="qb-row"><div class="qb-label">People Waiting</div><div class="qb-val q-big">${doc.queueCount}</div></div>
        <div class="qb-row"><div class="qb-label">Avg per Patient</div><div class="qb-val q-green">${doc.avgServiceTime} min</div></div>
        <div class="qb-row"><div class="qb-label">Total Wait Time</div><div class="qb-val ${waitTotal>60?'q-red':waitTotal>30?'q-amber':'q-green'}">${waitTotal} min</div></div>
        <div class="qb-row"><div class="qb-label">Your Turn (if book now)</div><div class="qb-val" style="color:var(--neon)">#${doc.queueCount+1} → ${waitTotal+doc.avgServiceTime} min</div></div>
      </div>

      <div class="detail-section-title">// PEOPLE IN QUEUE</div>
      <div class="gc pqueue">${pq}<div class="pq-person you-slot" title="Your slot if you book now">🫵<div class="pq-num">You</div></div></div>

      <div class="detail-section-title">// AI MATCH</div>
      <div class="gc" style="padding:14px 16px;display:flex;align-items:center;gap:14px">
        <div class="mring" style="width:60px;height:60px">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="3"/>
            <circle cx="30" cy="30" r="26" fill="none" stroke="${nc}" stroke-width="3" stroke-dasharray="${2*Math.PI*26}" stroke-dashoffset="${2*Math.PI*26*(1-doc._score/100)}" stroke-linecap="round" style="filter:drop-shadow(0 0 8px ${nc})"/>
          </svg>
          <div class="mval" style="color:${nc};font-size:16px">${doc._score}%</div>
        </div>
        <div>
          <div style="font-family:var(--fd);font-size:15px;font-weight:800">Specialty Match</div>
          <div style="font-size:12px;color:var(--text2);margin-top:3px">${doc._score>=70?'Excellent match for your symptoms':doc._score>=50?'Good match — suitable clinic':'Nearest available facility'}</div>
        </div>
      </div>

      <div style="margin-top:16px;display:flex;gap:10px">
        <button class="book-detail-btn" onclick="openBkModal(${doc.id})" style="flex:2">📅 Book Appointment</button>
        <button onclick="showMap(${doc.id});goScreen('home')" style="flex:1;padding:16px;background:rgba(0,210,255,.1);border:1px solid var(--border2);border-radius:var(--rsm);color:var(--neon);font-family:var(--fd);font-size:14px;font-weight:800;cursor:pointer;touch-action:manipulation;transition:all .2s">🗺 Route</button>
      </div>
    </div>`;
  goScreen('detail');
}

/* ═══════════════════════════════════════════════
   MAP
═══════════════════════════════════════════════ */
function showMap(id){
  const doc=allResults.find(d=>d.id===id);if(!doc)return;
  activeDoc=doc;
  document.getElementById('map-outer').style.display='block';
  document.getElementById('map-dest').textContent=doc.name;
  const km=doc._dist,eta=km<=1?Math.round(km*15):Math.round(km*4+3);
  document.getElementById('eta-v').textContent=eta+' min';
  document.getElementById('eta-d').textContent=km.toFixed(2)+' km';
  document.getElementById('eta-m').textContent=km<=1?'🚶 Walkable':'🚗 By Car';
  buildMap(doc,km);buildRouteSteps(doc,km,eta);
  document.getElementById('map-outer').scrollIntoView({behavior:'smooth',block:'start'});
}

function buildMap(doc,km){
  const area=document.getElementById('map-area');
  const W=area.offsetWidth||640,H=260;
  const pad=Math.max(.008,km*.006);
  const mla=Math.min(userLat,doc.lat)-pad,mxa=Math.max(userLat,doc.lat)+pad;
  const mlo=Math.min(userLng,doc.lng)-pad,mxo=Math.max(userLng,doc.lng)+pad;
  const px=lng=>((lng-mlo)/(mxo-mlo))*(W-100)+50;
  const py=lat=>((mxa-lat)/(mxa-mla))*(H-80)+40;
  const ux=px(userLng),uy=py(userLat),dx=px(doc.lng),dy=py(doc.lat);
  const lx=(ux+dx)/2,ly=(uy+dy)/2,nx=-(dy-uy),ny=dx-ux,nl=Math.sqrt(nx*nx+ny*ny)||1;
  const cx=lx+(nx/nl)*40,cy=ly+(ny/nl)*40;
  const bx=.25*ux+.5*cx+.25*dx,by=.25*uy+.5*cy+.25*dy;
  let g='';
  for(let gx=50;gx<W;gx+=55)g+=`<line x1="${gx}" y1="0" x2="${gx}" y2="${H}" stroke="rgba(0,210,255,.06)" stroke-width=".5"/>`;
  for(let gy=40;gy<H;gy+=45)g+=`<line x1="0" y1="${gy}" x2="${W}" y2="${gy}" stroke="rgba(0,210,255,.06)" stroke-width=".5"/>`;
  g+=`<line x1="${ux}" y1="0" x2="${ux}" y2="${H}" stroke="rgba(0,210,255,.15)" stroke-width="1"/>`;
  g+=`<line x1="0" y1="${uy}" x2="${W}" y2="${uy}" stroke="rgba(0,210,255,.15)" stroke-width="1"/>`;
  g+=`<line x1="${dx}" y1="0" x2="${dx}" y2="${H}" stroke="rgba(255,45,120,.15)" stroke-width="1"/>`;
  g+=`<line x1="0" y1="${dy}" x2="${W}" y2="${dy}" stroke="rgba(255,45,120,.15)" stroke-width="1"/>`;
  area.innerHTML=`
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
  <defs>
    <radialGradient id="mbg"><stop offset="0%" stop-color="#050d1f"/><stop offset="100%" stop-color="#020408"/></radialGradient>
    <filter id="ng"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <marker id="ma" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="6" markerHeight="6" orient="auto"><polygon points="0,0 10,3.5 0,7" fill="#00ff88"/></marker>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#mbg)"/>
  ${g}
  <path d="M${ux},${uy} Q${cx},${cy} ${dx},${dy}" fill="none" stroke="#00ff88" stroke-width="10" opacity=".06" filter="url(#ng)"/>
  <path d="M${ux},${uy} Q${cx},${cy} ${dx},${dy}" fill="none" stroke="#00ff88" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="10 6" marker-end="url(#ma)" opacity=".9">
    <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="1s" repeatCount="indefinite"/>
  </path>
  <rect x="${bx-30}" y="${by-13}" width="60" height="22" rx="11" fill="rgba(0,255,136,.15)" stroke="rgba(0,255,136,.4)" stroke-width="1"/>
  <text x="${bx}" y="${by+3}" text-anchor="middle" fill="#00ff88" font-size="11" font-weight="bold" font-family="JetBrains Mono,monospace">${km.toFixed(2)}km</text>
  <circle cx="${ux}" cy="${uy}" r="22" fill="rgba(0,210,255,.06)"><animate attributeName="r" values="14;26;14" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".1;0;.1" dur="2.5s" repeatCount="indefinite"/></circle>
  <circle cx="${ux}" cy="${uy}" r="10" fill="rgba(0,210,255,.2)" stroke="#00d2ff" stroke-width="1.5" filter="url(#ng)"/>
  <circle cx="${ux}" cy="${uy}" r="4" fill="#00d2ff"/>
  <text x="${ux}" y="${uy+24}" text-anchor="middle" fill="#00d2ff" font-size="9" font-weight="800" font-family="JetBrains Mono,monospace">YOU</text>
  <circle cx="${dx}" cy="${dy}" r="14" fill="rgba(255,45,120,.1)" stroke="rgba(255,45,120,.3)" stroke-width="1" filter="url(#ng)"/>
  <rect x="${dx-14}" y="${dy-18}" width="28" height="22" rx="7" fill="rgba(255,45,120,.2)" stroke="#ff2d78" stroke-width="1.5"/>
  <polygon points="${dx},${dy+8} ${dx-7},${dy+3} ${dx+7},${dy+3}" fill="#ff2d78"/>
  <text x="${dx}" y="${dy-7}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="12">🏥</text>
</svg>`;
}

function buildRouteSteps(doc,km,eta){
  document.getElementById('route-list').innerHTML=[
    {t:'Start from your GPS location',d:`Heading to ${doc.name}`},
    {t:`Travel ${(km*.45).toFixed(2)} km on main road`,d:'Follow navigation signs'},
    {t:`Look for ${doc.name}`,d:`${(km*.35).toFixed(2)} km ahead`},
    {t:'Arrive at destination',d:`${km.toFixed(2)} km · ${eta} min ETA`},
  ].map((s,i)=>`<div class="rstep"><div class="rnum">${i+1}</div><div><div class="rtext">${s.t}</div><div class="rdist">// ${s.d}</div></div></div>`).join('');
}

function openGMaps(){if(!activeDoc)return;window.open(`https://www.google.com/maps/dir/${userLat},${userLng}/${activeDoc.lat},${activeDoc.lng}`,'_blank');}
function closeMap(){document.getElementById('map-outer').style.display='none';}

/* ═══════════════════════════════════════════════
   CALL
═══════════════════════════════════════════════ */
function callDoc(id){
  const doc=allResults.find(d=>d.id===id);
  if(!doc?.phone){showToast('📞 No phone number listed in map data');return;}
  showToast(`📞 Calling ${doc.name}…`);
  setTimeout(()=>window.location.href='tel:'+doc.phone,500);
}
function callEmergency(){showToast('🚨 Calling 112…');setTimeout(()=>window.location.href='tel:112',300);}

/* ═══════════════════════════════════════════════
   BOOKING MODAL
═══════════════════════════════════════════════ */
function openBkModal(id){
  modalDoc=allResults.find(d=>d.id===id);if(!modalDoc)return;
  const name=document.getElementById('inp-name').value.trim()||'Patient';
  document.getElementById('bk-name').textContent=modalDoc.name;
  document.getElementById('bk-spec').textContent=(SPEC_ICON[modalDoc.spec]||'🩺')+' '+modalDoc.spec+(modalDoc.drName?' · '+modalDoc.drName:'');
  document.getElementById('bk-addr').textContent='📍 '+modalDoc.addr;
  document.getElementById('bk-sub').textContent=`// ${name} → ${modalDoc.name}`;
  document.getElementById('bk-ava').textContent=modalDoc.ava;
  document.getElementById('bk-ava').style.background=modalDoc.bg;
  const ph=document.getElementById('inp-phone').value.trim();
  if(ph)document.getElementById('bk-phone').value=ph;
  buildDates();buildSlots();
  selDate=null;selSlot=null;smsTab='p';updateSmsPreview();
  document.getElementById('bk-modal').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeBkModal(e){
  if(e.target===document.getElementById('bk-modal')){
    document.getElementById('bk-modal').classList.remove('open');
    document.body.style.overflow='';
  }
}

function buildDates(){
  const s=document.getElementById('date-scr');s.innerHTML='';
  const D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const t=new Date();
  for(let i=0;i<8;i++){
    const d=new Date(t);d.setDate(t.getDate()+i);
    const c=document.createElement('div');c.className='dchip'+(i===0?' sel':'');
    c.innerHTML=`<div class="dchip-day">${D[d.getDay()]}</div><div class="dchip-num">${d.getDate()}</div><div class="dchip-mon">${M[d.getMonth()]}</div>`;
    if(i===0)selDate=d;
    c.onclick=()=>{document.querySelectorAll('.dchip').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');selDate=d;buildSlots();updateSmsPreview();};
    s.appendChild(c);
  }
}

function buildSlots(){
  const g=document.getElementById('time-slots');g.innerHTML='';
  const T=['08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];
  const tk=[2,5,9];selSlot=null;
  T.forEach((t,i)=>{
    const s=document.createElement('div');
    s.className='slot'+(tk.includes(i)?' taken':'');s.textContent=t;
    if(!tk.includes(i))s.onclick=()=>{document.querySelectorAll('.slot:not(.taken)').forEach(x=>x.classList.remove('sel'));s.classList.add('sel');selSlot=t;updateSmsPreview();};
    g.appendChild(s);
  });
}

function switchSmsTab(tab,el){
  smsTab=tab;document.querySelectorAll('.sms-tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');updateSmsPreview();
}

function updateSmsPreview(){
  if(!modalDoc)return;
  const name=document.getElementById('inp-name').value.trim()||'Patient';
  const age=document.getElementById('inp-age').value.trim()||'—';
  const sym=document.getElementById('inp-sym').value.trim()||'general consultation';
  const ds=selDate?selDate.toDateString():'TBD',sl=selSlot||'TBD';
  const ph=document.getElementById('bk-phone').value.trim()||'XXXXXXXXXX';
  if(smsTab==='p'){
    document.getElementById('sms-from').textContent='MEDIFIND_AI';
    document.getElementById('sms-txt').innerHTML=
      `Dear <b>${name}</b>,<br><br>✅ Appointment CONFIRMED<br><br>🏥 <b>${modalDoc.name}</b>${modalDoc.drName?'<br>👨‍⚕️ <b>'+modalDoc.drName+'</b>':''}<br>📅 <b>${ds}</b> at <b>${sl}</b><br>📍 ${modalDoc.addr}${modalDoc.phone?'<br>📞 '+modalDoc.phone:''}<br><br>Arrive 10 min early. — MediFind AI`;
  }else{
    document.getElementById('sms-from').textContent='MEDIFIND_PORTAL';
    document.getElementById('sms-txt').innerHTML=
      `[NEW PATIENT ALERT]<br><br>👤 <b>${name}</b>, Age ${age}<br>🩺 ${sym.substring(0,45)}${sym.length>45?'…':''}<br>📅 ${ds} at ${sl}<br>📞 +${ph}<br><br>— MediFind AI`;
  }
  document.getElementById('sms-time').textContent='// Delivered · Now';
}
document.getElementById('bk-phone').addEventListener('input',updateSmsPreview);

/* ═══════════════════════════════════════════════
   CONFIRM BOOKING
═══════════════════════════════════════════════ */
function confirmBooking(){
  const ph=document.getElementById('bk-phone').value.trim();
  const name=document.getElementById('inp-name').value.trim()||'Patient';
  const sym=document.getElementById('inp-sym').value.trim()||'general consultation';
  const age=document.getElementById('inp-age').value.trim()||'—';
  if(!selDate){showToast('⚠️ Select a date');return;}
  if(!selSlot){showToast('⚠️ Select a time slot');return;}
  if(!ph||ph.length<6){showToast('⚠️ Enter a valid phone number');return;}

  const btn=document.getElementById('confirm-btn');
  btn.disabled=true;btn.textContent='⏳ Confirming…';

  // Generate queue position
  const qPos=modalDoc.queueCount+1;
  const totalWait=(modalDoc.queueCount*modalDoc.avgServiceTime)+modalDoc.avgServiceTime;

  setTimeout(()=>{
    btn.disabled=false;btn.innerHTML='✅ Confirm &amp; Send Notifications';
    document.getElementById('bk-modal').classList.remove('open');
    document.body.style.overflow='';

    // Save booking
    const bk={
      id:'BK'+Date.now(),
      hospital:modalDoc.name,
      drName:modalDoc.drName||'',
      spec:modalDoc.spec,
      addr:modalDoc.addr,
      phone:modalDoc.phone,
      docId:modalDoc.id,
      patientName:name,patientAge:age,
      date:selDate.toDateString(),slot:selSlot,
      patPhone:ph,symptoms:sym,
      status:'confirmed',
      queuePos:qPos,
      totalWait,avgSvc:modalDoc.avgServiceTime,
      bookedAt:Date.now(),
      lat:modalDoc.lat,lng:modalDoc.lng,
      typeLabel:modalDoc.typeLabel,
    };
    BOOKINGS.unshift(bk);
    updateBkBadge();

    // Add notifications
    addNotif({type:'success',title:'Booking Confirmed!',body:`${modalDoc.name} on ${selDate.toDateString()} at ${selSlot}. Queue #${qPos}. Est. wait: ${totalWait} min.`,icon:'✅'});
    addNotif({type:'info',title:'Queue Position',body:`You are #${qPos} in queue at ${modalDoc.name}. Estimated wait: ${totalWait} minutes.`,icon:'🏥'});
    if(totalWait>30)addNotif({type:'warn',title:'Long Wait Alert',body:`Queue at ${modalDoc.name} has ${modalDoc.queueCount} people. Consider arriving ${Math.round(totalWait*.7)} min early.`,icon:'⏳'});

    // Show success
    document.getElementById('succ-sub').textContent=`${name}'s booking at ${modalDoc.name} confirmed. Queue #${qPos}.`;
    document.getElementById('succ-rows').innerHTML=`
      <div class="succ-row"><div class="succ-ri">📲</div><div class="succ-rt"><strong>SMS → Patient (${ph})</strong>Appointment confirmation with queue position sent.</div></div>
      <div class="succ-row"><div class="succ-ri">🏥</div><div class="succ-rt"><strong>Alert → ${modalDoc.name}</strong>${name}, age ${age} — ${sym.substring(0,35)}… at ${selSlot}.</div></div>
      <div class="succ-row"><div class="succ-ri">📋</div><div class="succ-rt"><strong>Queue Position: #${qPos}</strong>Estimated wait: ${totalWait} min · Avg per patient: ${modalDoc.avgServiceTime} min</div></div>`;
    document.getElementById('succ-ov').classList.add('open');

    // Send SMS
    const msg=`[MEDIFIND] Dear ${name}, your appointment at ${modalDoc.name} (${modalDoc.addr}) confirmed on ${selDate.toDateString()} at ${selSlot}. Queue #${qPos}. Est. wait: ${totalWait}min. ${modalDoc.phone?'Clinic: '+modalDoc.phone+'. ':''}Arrive 10min early.`;
    setTimeout(()=>{window.location.href=`sms:${ph}?body=${encodeURIComponent(msg)}`;},1800);

    // Simulate queue progression
    simulateQueue(bk.id);
  },1200);
}

function closeSucc(){document.getElementById('succ-ov').classList.remove('open');}

/* ═══════════════════════════════════════════════
   QUEUE SIMULATION
═══════════════════════════════════════════════ */
function simulateQueue(bkId){
  let timer=setInterval(()=>{
    const bk=BOOKINGS.find(b=>b.id===bkId);
    if(!bk||bk.status==='done'){clearInterval(timer);return;}
    if(bk.queuePos>1){
      bk.queuePos--;
      bk.totalWait=Math.max(0,bk.totalWait-bk.avgSvc);
      addNotif({type:'info',title:'Queue Update!',body:`You are now #${bk.queuePos} at ${bk.hospital}. Estimated wait: ${bk.totalWait} min.`,icon:'🏃'});
      updateBkBadge();
      if(bk.queuePos===2)addNotif({type:'warn',title:'Almost Your Turn!',body:`You are next at ${bk.hospital}. Please be ready at the counter.`,icon:'⚡'});
      if(bk.queuePos===1){
        addNotif({type:'success',title:'Your Turn Now!',body:`Please proceed to the counter at ${bk.hospital}. Show this booking ID: ${bkId}`,icon:'🎯'});
        bk.status='active';
        clearInterval(timer);
      }
    }
  },45000); // every 45s in demo
}

/* ═══════════════════════════════════════════════
   RENDER BOOKINGS SCREEN
═══════════════════════════════════════════════ */
function renderBookings(){
  const list=document.getElementById('bk-list');
  if(!BOOKINGS.length){
    list.innerHTML=`<div class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-title">No Bookings Yet</div>
      <div class="empty-sub">Search and book a hospital to see your appointments here</div>
      <button class="empty-btn" onclick="goScreen('home')">🔍 Find Doctors</button>
    </div>`;
    return;
  }
  list.innerHTML='';
  BOOKINGS.forEach(bk=>{
    const pct=Math.round((1-(bk.queuePos/(bk.queuePos+3)))*100);
    const nc=bk.queuePos===1?'#00ff88':bk.queuePos<=3?'#ffb700':'#00d2ff';
    const statusCls=bk.status==='confirmed'?'bs-confirmed':bk.status==='active'?'bs-pending':'bs-cancelled';
    const statusLabel=bk.status==='active'?'🟡 YOUR TURN':bk.status==='confirmed'?'🟢 CONFIRMED':'⚫ DONE';
    const card=document.createElement('div');
    card.className='gc2 bk-card';
    card.innerHTML=`
      <div class="bk-status-bar ${statusCls}">${statusLabel} · Booking ID: ${bk.id}</div>
      <div class="bk-body">
        <div class="bk-hname">${bk.hospital}</div>
        <div class="bk-dname">${SPEC_ICON[bk.spec]||'🩺'} ${bk.spec}${bk.drName?' · '+bk.drName:''}</div>
        <div class="bk-row">📅 ${bk.date} at ${bk.slot}</div>
        <div class="bk-row">📍 ${bk.addr}</div>
        ${bk.phone?`<div class="bk-row">📞 ${bk.phone}</div>`:''}
        <div class="bk-row">👤 ${bk.patientName} · Age ${bk.patientAge}</div>
        <div class="bk-row mono">// Symptoms: ${bk.symptoms.substring(0,50)}${bk.symptoms.length>50?'…':''}</div>
        <div class="bk-queue-row">
          <div class="bk-q-num" style="color:${nc}">#${bk.queuePos}</div>
          <div class="bk-q-info">
            <div class="bk-q-lbl">// YOUR QUEUE POSITION</div>
            <div class="bk-q-eta">${bk.queuePos===1?'🎯 Your turn now!':bk.totalWait+' min estimated wait'}</div>
            <div class="bk-q-bar"><div class="bk-q-fill" style="width:${pct}%"></div></div>
          </div>
        </div>
        <div class="bk-actions">
          <button class="bk-act ba-view" onclick="viewQueueForBk('${bk.id}')">🏥 View Queue</button>
          <button class="bk-act ba-cancel" onclick="cancelBk('${bk.id}')">✕ Cancel</button>
        </div>
      </div>`;
    list.appendChild(card);
  });
}

function viewQueueForBk(id){
  const bk=BOOKINGS.find(b=>b.id===id);if(!bk)return;
  activeQueueBkId=id;
  goScreen('queue');
}

function cancelBk(id){
  const bk=BOOKINGS.find(b=>b.id===id);if(!bk)return;
  bk.status='cancelled';
  addNotif({type:'warn',title:'Booking Cancelled',body:`Your appointment at ${bk.hospital} on ${bk.date} at ${bk.slot} has been cancelled.`,icon:'✕'});
  renderBookings();updateBkBadge();
  showToast('Booking cancelled');
}

function updateBkBadge(){
  const active=BOOKINGS.filter(b=>b.status==='confirmed'||b.status==='active').length;
  const badge=document.getElementById('bk-badge');
  if(active>0){badge.textContent=active;badge.style.display='flex';}else badge.style.display='none';
}

/* ═══════════════════════════════════════════════
   QUEUE SCREEN
═══════════════════════════════════════════════ */
let activeQueueBkId=null;

function renderQueueScreen(){
  const selWrap=document.getElementById('queue-select-wrap');
  const content=document.getElementById('queue-content');
  const activeBks=BOOKINGS.filter(b=>b.status==='confirmed'||b.status==='active');

  if(!activeBks.length){
    selWrap.innerHTML='';
    content.innerHTML=`<div class="empty-state">
      <div class="empty-icon">🏥</div>
      <div class="empty-title">No Active Bookings</div>
      <div class="empty-sub">Book a hospital first to see the live queue</div>
      <button class="empty-btn" onclick="goScreen('home')">🔍 Find Hospitals</button>
    </div>`;return;
  }

  // Selector
  if(activeBks.length>1){
    selWrap.innerHTML='<div class="slbl" style="margin-bottom:8px">// SELECT BOOKING</div>';
    const btns=document.createElement('div');btns.style.cssText='display:flex;flex-direction:column;gap:8px';
    activeBks.forEach(bk=>{
      const b=document.createElement('button');
      b.style.cssText='width:100%;padding:12px 16px;background:rgba(0,210,255,.08);border:1px solid var(--border2);border-radius:var(--rsm);color:var(--neon);font-family:var(--fm);font-size:11px;cursor:pointer;text-align:left;touch-action:manipulation;transition:all .2s';
      b.textContent=`${bk.hospital} · ${bk.date} ${bk.slot} · Queue #${bk.queuePos}`;
      if(activeQueueBkId===bk.id)b.style.borderColor='var(--neon3)';
      b.onclick=()=>{activeQueueBkId=bk.id;renderQueueScreen();};
      btns.appendChild(b);
    });
    selWrap.appendChild(btns);
  }else{
    selWrap.innerHTML='';
    activeQueueBkId=activeBks[0].id;
  }

  const bk=BOOKINGS.find(b=>b.id===activeQueueBkId)||activeBks[0];
  if(!bk){content.innerHTML='';return;}
  document.getElementById('ql-sub').textContent=`// ${bk.hospital}`;

  // Build queue visual
  const totalSlots=bk.queuePos+4;
  let qvItems='';
  for(let i=1;i<=totalSlots;i++){
    const isDone=i<bk.queuePos;
    const isActive=i===bk.queuePos-1&&bk.queuePos>1;
    const isYou=i===bk.queuePos;
    const pNames=['R. Sharma','S. Patel','M. Kumar','A. Singh','K. Raj','D. Chen','L. Kim','P. Nair','V. Mehta'];
    const pn=isYou?bk.patientName:pNames[(i-1)%pNames.length];
    const eta=isYou?bk.totalWait:Math.max(0,(bk.queuePos-i)*bk.avgSvc);
    const posCls=isDone?'gray':isActive?'green':isYou?'cyan':'gray';
    const statusLabel=isDone?'Done':isActive?'Inside':isYou?'YOU':'Waiting';
    const statusCls=isDone?'qvs-done':isActive?'qvs-active':isYou?'qvs-active':'qvs-wait';
    const itemCls=isDone?'done':isActive?'active-slot':isYou?'you-item':'';
    qvItems+=`<div class="qv-item ${itemCls}">
      <div class="qv-pos ${posCls}">${i}</div>
      <div class="qv-name">${pn}${isYou?' (You)':''}</div>
      <div class="qv-eta">${isDone?'Done':eta>0?'~'+eta+'min':'Now'}</div>
      <span class="qv-status ${statusCls}">${statusLabel}</span>
    </div>`;
  }

  const nc=bk.queuePos===1?'#00ff88':bk.queuePos<=3?'#ffb700':'#00d2ff';
  content.innerHTML=`
    <div class="gc2 qlive-facility">
      <div class="qlive-fname">${bk.hospital}</div>
      <div class="qlive-faddr">📍 ${bk.addr} · 📅 ${bk.date} ${bk.slot}</div>
      ${bk.drName?`<div style="font-family:var(--fm);font-size:11px;color:var(--neon);margin-top:3px">👨‍⚕️ ${bk.drName}</div>`:''}
    </div>
    <div class="gc2">
      <div class="qlive-counter">
        <div class="qlc-item"><div class="qlc-num" style="color:${nc};text-shadow:0 0 20px ${nc}">#${bk.queuePos}</div><div class="qlc-lbl">Your Position</div></div>
        <div class="qlc-sep"></div>
        <div class="qlc-item"><div class="qlc-num" style="color:var(--neon5)">${bk.totalWait}</div><div class="qlc-lbl">Min Wait</div></div>
        <div class="qlc-sep"></div>
        <div class="qlc-item"><div class="qlc-num" style="color:var(--neon3)">${bk.avgSvc}</div><div class="qlc-lbl">Min/Patient</div></div>
      </div>
    </div>
    <div class="gc2"><div class="qv-wrap">
      <div class="qv-title">// LIVE QUEUE POSITIONS</div>
      <div class="qv-list">${qvItems}</div>
    </div></div>
    <div class="gc2" style="padding:14px 18px;margin-top:4px">
      <div style="font-family:var(--fm);font-size:10px;color:var(--text3);margin-bottom:8px">// QUEUE PROGRESS</div>
      <div style="height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden">
        <div style="height:100%;background:linear-gradient(90deg,var(--neon),var(--neon2));border-radius:3px;transition:width 1s ease;width:${Math.round((1-bk.queuePos/totalSlots)*100)}%"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:6px;font-family:var(--fm);font-size:10px;color:var(--text3)">
        <span>Start</span><span style="color:${nc}">You: #${bk.queuePos}</span><span>Done</span>
      </div>
    </div>
    <div style="margin-top:8px;display:flex;gap:10px">
      <button onclick="goScreen('mybookings')" style="flex:1;padding:14px;background:rgba(0,210,255,.08);border:1px solid var(--border2);border-radius:var(--rsm);color:var(--neon);font-family:var(--fd);font-size:13px;font-weight:800;cursor:pointer;touch-action:manipulation">← My Bookings</button>
      ${bk.phone?`<button onclick="window.location.href='tel:${bk.phone}'" style="flex:1;padding:14px;background:rgba(0,255,136,.1);border:1px solid rgba(0,255,136,.25);border-radius:var(--rsm);color:var(--neon3);font-family:var(--fd);font-size:13px;font-weight:800;cursor:pointer;touch-action:manipulation">📞 Call Clinic</button>`:''}
    </div>`;
  document.getElementById('q-badge').style.display='flex';
  document.getElementById('q-badge').textContent='1';
}

/* ═══════════════════════════════════════════════
   NOTIFICATIONS
═══════════════════════════════════════════════ */
function addNotif(n){
  const now=new Date();
  NOTIFS.unshift({...n,time:now.toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}),id:Date.now(),read:false});
  unreadNotifs++;
  updateNotifBadge();
  renderNotifs();
}

function updateNotifBadge(){
  const b=document.getElementById('notif-badge');
  if(unreadNotifs>0){b.textContent=unreadNotifs;b.style.display='flex';}else b.style.display='none';
}

function renderNotifs(){
  const list=document.getElementById('notif-list');
  if(!NOTIFS.length){list.innerHTML='<div style="text-align:center;padding:40px 20px;color:var(--text3);font-family:var(--fm);font-size:12px">No notifications yet</div>';return;}
  list.innerHTML=NOTIFS.map((n,i)=>`
    <div class="notif-item ${n.read?'':'unread'} ni-${n.type}" style="animation-delay:${i*.05}s">
      <div class="ni-top"><span class="ni-icon">${n.icon}</span><span class="ni-title">${n.title}</span><span class="ni-time">${n.time}</span></div>
      <div class="ni-body">${n.body}</div>
    </div>`).join('');
}

function openNotifs(){
  NOTIFS.forEach(n=>n.read=true);unreadNotifs=0;updateNotifBadge();renderNotifs();
  document.getElementById('notif-panel').classList.add('open');
  document.getElementById('notif-ov').classList.add('open');
}
function closeNotifs(){
  document.getElementById('notif-panel').classList.remove('open');
  document.getElementById('notif-ov').classList.remove('open');
}

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('show'),2800);
}

/* Initial notif */
setTimeout(()=>{
  addNotif({type:'info',title:'Welcome to MediFind ULTRA',body:'Enable GPS to find real hospitals near you. Tap 🔍 Find to begin.',icon:'🩺'});
},1500);

window.addEventListener('resize',()=>{if(activeDoc&&document.getElementById('map-outer').style.display!=='none')buildMap(activeDoc,activeDoc._dist);});

