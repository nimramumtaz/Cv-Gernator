// CV Generator – CSC336 Web Technologies Lab Assignment 1

/* ── STATE ── */
let tpl=0, eduId=0, expId=0, skills=[], photoURL=null, mapLoc='', mapTimer=null;

/* ── TEMPLATE ── */
function setTpl(n,el){
  tpl=n;
  document.querySelectorAll('.tpl-card').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  liveUpdate();
}

/* ── PHOTO ── */
function handlePhoto(e){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{
    photoURL=ev.target.result;
    const img=document.getElementById('photoPreview');
    img.src=photoURL; img.style.display='block';
    document.getElementById('uploadHint').style.display='none';
    liveUpdate();
  };
  r.readAsDataURL(f);
}

/* ── EDUCATION ── */
function addEdu(){
  const id=++eduId;
  const d=document.createElement('div'); d.className='entry-card'; d.id='edu_'+id;
  d.innerHTML=`<button class="btn-rm" onclick="rm('edu_${id}')">✕</button>
    <div class="mb-1"><input type="text" class="form-control form-control-sm" id="edu_deg_${id}" placeholder="Degree (e.g. BS Computer Science)" oninput="liveUpdate()"/></div>
    <div class="mb-1"><input type="text" class="form-control form-control-sm" id="edu_uni_${id}" placeholder="University / Institution" oninput="liveUpdate()"/></div>
    <div class="row g-1">
      <div class="col-7"><input type="text" class="form-control form-control-sm" id="edu_yr_${id}" placeholder="Year (e.g. 2020–2024)" oninput="liveUpdate()"/></div>
      <div class="col-5"><input type="text" class="form-control form-control-sm" id="edu_cgpa_${id}" placeholder="CGPA" oninput="liveUpdate()"/></div>
    </div>`;
  document.getElementById('eduList').appendChild(d);
  updateStats();
}

/* ── EXPERIENCE ── */
function addExp(){
  const id=++expId;
  const d=document.createElement('div'); d.className='entry-card'; d.id='exp_'+id;
  d.innerHTML=`<button class="btn-rm" onclick="rm('exp_${id}')">✕</button>
    <div class="mb-1"><input type="text" class="form-control form-control-sm" id="exp_ttl_${id}" placeholder="Job Title" oninput="liveUpdate()"/></div>
    <div class="mb-1"><input type="text" class="form-control form-control-sm" id="exp_cmp_${id}" placeholder="Company Name" oninput="liveUpdate()"/></div>
    <div class="row g-1 mb-1">
      <div class="col-6"><input type="text" class="form-control form-control-sm" id="exp_loc_${id}" placeholder="Location" oninput="liveUpdate()"/></div>
      <div class="col-6"><input type="text" class="form-control form-control-sm" id="exp_dur_${id}" placeholder="Duration" oninput="liveUpdate()"/></div>
    </div>
    <textarea class="form-control form-control-sm" id="exp_dsc_${id}" rows="2" placeholder="Key responsibilities (one per line)" oninput="liveUpdate()"></textarea>`;
  document.getElementById('expList').appendChild(d);
  updateStats();
}

function rm(id){ const el=document.getElementById(id); if(el){el.remove();updateStats();liveUpdate();} }

/* ── SKILLS ── */
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('skillInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addSkill();}});
});
const SCLS=['stag stag-b','stag stag-g','stag stag-s','stag stag-v'];
function addSkill(){
  const inp=document.getElementById('skillInput'), v=inp.value.trim();
  if(!v||skills.includes(v)){inp.value='';return;}
  skills.push(v); inp.value='';
  renderSkills(); liveUpdate();
}
function removeSkill(s){ skills=skills.filter(x=>x!==s); renderSkills(); liveUpdate(); }
function renderSkills(){
  document.getElementById('skillWrap').innerHTML=skills.map((s,i)=>
    `<span class="${SCLS[i%4]}">${s}<span class="rm" onclick="removeSkill('${s.replace(/'/g,"\\'")}')">&nbsp;✕</span></span>`
  ).join('');
  updateStats();
}

/* ── MAP ── */
function scheduleMap(){ clearTimeout(mapTimer); mapTimer=setTimeout(updateMap,800); }
function updateMap(){
  const loc=document.getElementById('location').value.trim();
  if(!loc||loc===mapLoc) return; mapLoc=loc;
  const enc=encodeURIComponent(loc);
  document.getElementById('mapFrame').src=`https://maps.google.com/maps?q=${enc}&output=embed&z=13`;
  document.getElementById('mapPh').style.display='none';
  document.getElementById('mapEmbed').style.display='block';
  document.getElementById('btnMaps').style.display='flex';
  document.getElementById('locMsg').innerHTML=`<div class="loc-ok"><i class="fas fa-check-circle"></i> Showing map for: ${loc}</div>`;
}
function openMaps(){
  const loc=document.getElementById('location').value.trim();
  if(loc) window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(loc),'_blank');
}
function locateMe(){
  if(!navigator.geolocation){alert('Geolocation not supported.');return;}
  navigator.geolocation.getCurrentPosition(p=>{
    const {latitude:lat,longitude:lng}=p.coords;
    document.getElementById('mapFrame').src=`https://maps.google.com/maps?q=${lat},${lng}&output=embed&z=14`;
    document.getElementById('mapPh').style.display='none';
    document.getElementById('mapEmbed').style.display='block';
    document.getElementById('btnMaps').style.display='flex';
    document.getElementById('locMsg').innerHTML='<div class="loc-ok"><i class="fas fa-check-circle"></i> Using your GPS location</div>';
    const l=document.getElementById('location'); if(!l.value) l.value=`${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    liveUpdate();
  },()=>{document.getElementById('locMsg').innerHTML='<div class="loc-err"><i class="fas fa-times-circle"></i> Location access denied</div>';});
}

/* ── COLLECT ── */
function g(id){const e=document.getElementById(id);return e?e.value.trim():'';}
function collectData(){
  const d={name:g('fullName'),title:g('jobTitle'),email:g('email'),phone:g('phone'),dob:g('dob'),gender:g('gender'),location:g('location'),summary:g('summary'),skills:[...skills],photo:photoURL,edu:[],exp:[]};
  for(let i=1;i<=eduId;i++) if(document.getElementById('edu_'+i)) d.edu.push({deg:g(`edu_deg_${i}`),uni:g(`edu_uni_${i}`),yr:g(`edu_yr_${i}`),cgpa:g(`edu_cgpa_${i}`)});
  for(let i=1;i<=expId;i++) if(document.getElementById('exp_'+i)) d.exp.push({ttl:g(`exp_ttl_${i}`),cmp:g(`exp_cmp_${i}`),loc:g(`exp_loc_${i}`),dur:g(`exp_dur_${i}`),dsc:g(`exp_dsc_${i}`)});
  return d;
}

/* ── BUILD CV ── */
const SBCLS=['csb0','csb1','csb2','csb3'];
function buildCV(d){
  const photoEl=d.photo
    ?`<img src="${d.photo}" class="cv-photo ${tpl===2?'cv-photo-d':''}" alt="Profile"/>`
    :`<div class="cv-avatar ${tpl===2?'cv-av-light':'cv-av-colored'}"><i class="fas fa-user"></i></div>`;

  const contacts=[
    d.email?`<span class="cv-contact-item"><i class="fas fa-envelope"></i>${d.email}</span>`:'',
    d.phone?`<span class="cv-contact-item"><i class="fas fa-phone"></i>${d.phone}</span>`:'',
    d.location?`<span class="cv-contact-item"><i class="fas fa-map-marker-alt"></i>${d.location}</span>`:''
  ].filter(Boolean).join('');

  const titleCls=`cv-sec-title cv-sec-t${tpl}`;
  const eduHTML=d.edu.filter(e=>e.deg||e.uni).map(e=>`
    <div class="cv-entry">
      <div class="cv-et">${e.deg}</div>
      <div class="cv-es"><b>${e.uni}</b>${e.yr?' &mdash; '+e.yr:''}</div>
      ${e.cgpa?`<ul class="cv-ed mb-0"><li>CGPA: ${e.cgpa}</li></ul>`:''}
    </div>`).join('');

  const expHTML=d.exp.filter(e=>e.ttl||e.cmp).map(e=>`
    <div class="cv-entry">
      <div class="cv-et">${e.ttl}</div>
      <div class="cv-es"><b>${e.cmp}</b>${e.loc?', '+e.loc:''}${e.dur?' &mdash; '+e.dur:''}</div>
      ${e.dsc?`<ul class="cv-ed mb-0">${e.dsc.split('\n').filter(Boolean).map(l=>`<li>${l}</li>`).join('')}</ul>`:''}
    </div>`).join('');

  const skillsHTML=d.skills.map((s,i)=>`<span class="cv-skill-badge ${SBCLS[i%4]}">${s}</span>`).join('');

  const body=`
    ${d.summary?`<div class="cv-sec"><div class="${titleCls}">Summary</div><p style="font-size:.86rem;color:#4a5568;line-height:1.6;">${d.summary}</p></div>`:''}
    ${expHTML?`<div class="cv-sec"><div class="${titleCls}">Experience</div>${expHTML}</div>`:''}
    ${eduHTML?`<div class="cv-sec"><div class="${titleCls}">Education</div>${eduHTML}</div>`:''}
    ${skillsHTML?`<div class="cv-sec"><div class="${titleCls}">Skills</div><div style="margin-top:3px;">${skillsHTML}</div></div>`:''}`;

  if(tpl===2){
    return `<div class="cv-t2">
      <div class="cv-head">${photoEl}<div><div class="cv-head-name" style="color:#1e3a5f;">${d.name||'Your Name'}</div><div class="cv-head-sub cv-head-sub-dark">${d.title||''}</div><div class="cv-contacts" style="color:#4a5568;">${contacts}</div></div></div>
      <div class="cv-body">${body}</div></div>`;
  }
  return `<div class="cv-t${tpl}">
    <div class="cv-head">${photoEl}<div><div class="cv-head-name">${d.name||'Your Name'}</div><div class="cv-head-sub">${d.title||''}</div><div class="cv-contacts">${contacts}</div></div></div>
    <div class="cv-body">${body}</div></div>`;
}

/* ── LIVE UPDATE ── */
function liveUpdate(){
  const d=collectData();
  const has=d.name||d.title||d.edu.length||d.exp.length||d.skills.length;
  if(!has){ document.getElementById('emptyState').style.display='flex'; document.getElementById('cvOutput').style.display='none'; return; }
  document.getElementById('emptyState').style.display='none';
  document.getElementById('cvOutput').style.display='block';
  document.getElementById('cvOutput').innerHTML=buildCV(d);
  updateStats();
}

/* ── STATS ── */
function updateStats(){
  const ec=document.querySelectorAll('[id^="edu_"]').length;
  const xc=document.querySelectorAll('[id^="exp_"]').length;
  document.getElementById('statEdu').textContent=ec+' entr'+(ec===1?'y':'ies');
  document.getElementById('statExp').textContent=xc+' entr'+(xc===1?'y':'ies');
  document.getElementById('statSkills').textContent=skills.length+' skill'+(skills.length===1?'':'s');
}

/* ── EXPORT ── */
function exportCV(){ liveUpdate(); setTimeout(()=>window.print(),400); }

/* ── RESET ── */
function resetAll(){
  if(!confirm('Reset all data?')) return;
  ['fullName','jobTitle','email','phone','dob','location','summary'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  document.getElementById('gender').value='';
  document.getElementById('eduList').innerHTML='';
  document.getElementById('expList').innerHTML='';
  skills=[]; renderSkills();
  photoURL=null;
  document.getElementById('photoPreview').style.display='none';
  document.getElementById('uploadHint').style.display='block';
  document.getElementById('mapPh').style.display='flex';
  document.getElementById('mapEmbed').style.display='none';
  document.getElementById('btnMaps').style.display='none';
  document.getElementById('locMsg').innerHTML='';
  document.getElementById('cvOutput').style.display='none';
  document.getElementById('emptyState').style.display='flex';
  eduId=0; expId=0; mapLoc='';
  updateStats();
}

/* ── INIT ── */
addEdu(); addExp();