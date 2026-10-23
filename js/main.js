/* GeoHawk Aerials website script: menu, logo marquee, filters, enquiry form, 3D globe (three.js) */
(function(){
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// menu
const mb=document.getElementById('menuBtn'),menu=document.getElementById('menu');
mb.addEventListener('click',()=>{const o=menu.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');mb.setAttribute('aria-expanded','false')}));
// marquee: duplicate logos for a seamless right-to-left loop
const tr=document.getElementById('track');tr.innerHTML+=tr.innerHTML;
tr.querySelectorAll('.lg').forEach((el,i,all)=>{if(i>=all.length/2){el.setAttribute('aria-hidden','true');el.querySelector('img').alt='';}});
// mobile: GIS show-more + floating buttons after hero
const gwrap=document.querySelector('.gis'),gmoreBtn=document.getElementById('gmore');
gmoreBtn.addEventListener('click',()=>gwrap.classList.add('open'));
const fl=document.querySelector('.float'),hero=document.getElementById('home');
const onS=()=>fl.classList.toggle('show',scrollY>hero.offsetHeight*0.8);addEventListener('scroll',onS,{passive:true});onS();
// GIS project filter
const gb=document.querySelectorAll('.gfilters button'),gc=document.querySelectorAll('.gp');
gb.forEach(b=>b.addEventListener('click',()=>{const g=b.dataset.g;gb.forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));gc.forEach(c=>{c.hidden=!(g==='all'||c.dataset.g===g)});if(g!=='all')gwrap.classList.add('open');}));
// enquiry links preselect service
const svc=document.getElementById('f-svc');
document.querySelectorAll('[data-s]').forEach(a=>a.addEventListener('click',()=>{const v=a.dataset.s;
  if(![...svc.options].some(o=>o.value===v)){const o=document.createElement('option');o.textContent=v;svc.appendChild(o);}svc.value=v;update();}));
// form -> WhatsApp / email
const F=id=>document.getElementById(id).value.trim();
function msg(){return 'Enquiry for GeoHawk Aerials\nName: '+F('f-name')+'\nOrganisation: '+F('f-org')+'\nPhone: '+F('f-phone')+'\nEmail: '+F('f-email')+'\nService: '+svc.value+'\nDetails: '+F('f-msg');}
function update(){const m=msg();document.getElementById('sendWa').href='https://wa.me/917028478109?text='+encodeURIComponent(m);
  document.getElementById('sendMail').href='mailto:geohawkaerials@gmail.com?subject='+encodeURIComponent('Enquiry: '+svc.value)+'&body='+encodeURIComponent(m);}
document.getElementById('enq').addEventListener('input',update);document.getElementById('enq').addEventListener('submit',e=>e.preventDefault());update();
// copy
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.copy,done=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1600)};
  try{navigator.clipboard.writeText(v).then(done,()=>sel(b))}catch(e){sel(b)}}));
function sel(b){const s=b.parentElement.querySelector('.v');const r=document.createRange();r.selectNodeContents(s);const g=getSelection();g.removeAllRanges();g.addRange(r);b.textContent='Selected';}

// globe
const SITES=[[18.52,73.86],[19.20,73.88],[19.55,73.72],[19.21,72.91],[16.70,74.24],[15.44,74.10],[20.33,75.08],[20.24,75.48],[21.00,75.56],[19.98,78.43],[19.75,77.70],[20.98,78.71],[20.27,79.40],[19.25,79.95],[18.84,79.96],[19.42,80.60],[22.73,79.92],[22.33,87.32],[26.91,75.79],[24.58,73.71],[26.24,73.02],[17.39,78.49],[17.97,79.59],[19.67,78.53],[17.25,80.15],[30.90,75.85],[31.63,74.87],[30.21,74.95],[12.97,77.59],[12.30,76.64],[15.46,75.01],[13.93,75.57],[15.49,73.83],[15.28,73.96],[23.26,77.41],[23.18,79.99],[22.72,75.86],[22.57,88.36],[23.23,87.07]];
const canvas=document.getElementById('globe'),stage=document.getElementById('stage');
let ok=false;try{ok=!!window.THREE&&!!(canvas.getContext('webgl')||canvas.getContext('experimental-webgl'))}catch(e){}
if(location.protocol==='file:')ok=false; // browsers block WebGL textures from local files; the hosted site uses the 3D globe
if(!ok){canvas.hidden=true;document.getElementById('cssGlobe').hidden=false;return;}
const T=THREE,renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,200);camera.position.set(0,0,6.3);
const R=1.6,ld=new T.TextureLoader(),day=ld.load("images/earth/earth-day.jpg"),night=ld.load("images/earth/earth-night.jpg"),sun=new T.Vector3(-.8,.35,.85).normalize();
const tilt=new T.Group();tilt.rotation.x=.36;tilt.rotation.z=-.1;scene.add(tilt);const spin=new T.Group();tilt.add(spin);
spin.add(new T.Mesh(new T.SphereGeometry(R,96,96),new T.ShaderMaterial({uniforms:{d:{value:day},n:{value:night},s:{value:sun}},
 vertexShader:`varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`uniform sampler2D d;uniform sampler2D n;uniform vec3 s;varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){float k=dot(normalize(vN),s);float m=smoothstep(-.18,.28,k);
 vec3 dc=texture2D(d,vUv).rgb;vec3 nc=texture2D(n,vUv).rgb*vec3(1.6,1.35,.9)+vec3(.015,.04,.09);vec3 c=mix(nc,dc*(.3+.95*max(k,0.)),m);
 float r=pow(1.-max(dot(normalize(vN),vV),0.),3.);c+=vec3(.3,.62,.95)*r*.45;gl_FragColor=vec4(c,1.);}`})));
scene.add(new T.Mesh(new T.SphereGeometry(R*1.045,64,64),new T.ShaderMaterial({side:T.BackSide,blending:T.AdditiveBlending,transparent:true,depthWrite:false,
 vertexShader:`varying vec3 vN;varying vec3 vV;void main(){vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`,
 fragmentShader:`varying vec3 vN;varying vec3 vV;void main(){float i=pow(max(.62-dot(vN,vV),0.),2.4);gl_FragColor=vec4(.36,.7,1.,1.)*i*1.1;}`})));
function ll(la,lo,r){const p=(lo+180)*Math.PI/180,t=(90-la)*Math.PI/180;return new T.Vector3(-r*Math.cos(p)*Math.sin(t),r*Math.cos(t),r*Math.sin(p)*Math.sin(t));}
const gm=new T.LineBasicMaterial({color:0x6EE0A3,transparent:true,opacity:.10});
for(let a=-60;a<=60;a+=30){const p=[];for(let o=-180;o<=180;o+=4)p.push(ll(a,o,R*1.002));spin.add(new T.Line(new T.BufferGeometry().setFromPoints(p),gm));}
for(let o=-180;o<180;o+=30){const p=[];for(let a=-90;a<=90;a+=4)p.push(ll(a,o,R*1.002));spin.add(new T.Line(new T.BufferGeometry().setFromPoints(p),gm));}
const mk=[],dg=new T.SphereGeometry(.014,12,12),dm=new T.MeshBasicMaterial({color:0xF2D27F}),rg=new T.RingGeometry(.022,.03,32);
SITES.forEach((s,i)=>{const p=ll(s[0],s[1],R*1.004);const d=new T.Mesh(dg,dm);d.position.copy(p);spin.add(d);const m=new T.MeshBasicMaterial({color:0x6EE0A3,transparent:true,side:T.DoubleSide,depthWrite:false});const r=new T.Mesh(rg,m);r.position.copy(p);r.lookAt(p.clone().multiplyScalar(2));spin.add(r);mk.push({r,m,ph:i*.37});});
function sat(){const g=new T.Group(),gold=new T.MeshBasicMaterial({color:0xC9A24C}),pn=new T.MeshBasicMaterial({color:0x2F6DB0,side:T.DoubleSide});g.add(new T.Mesh(new T.BoxGeometry(.06,.045,.045),gold));const pg=new T.PlaneGeometry(.12,.04);
 [.1,-.1].forEach(x=>{const p=new T.Mesh(pg,pn);p.position.x=x;g.add(p);const e=new T.LineSegments(new T.EdgesGeometry(pg),new T.LineBasicMaterial({color:0x9BC8EE}));e.position.x=x;g.add(e);});return g;}
const orb=[];[[2.2,.95,.3,.0016,0x6EE0A3],[2.55,-.55,1.2,.0011,0xC9A24C],[2.85,.25,2.4,.0008,0x7FB8E8]].forEach((o,i)=>{const g=new T.Group();g.rotation.x=o[1];g.rotation.y=o[2];scene.add(g);
 const p=[];for(let a=0;a<=128;a++){const t=a/128*Math.PI*2;p.push(new T.Vector3(Math.cos(t)*o[0],0,Math.sin(t)*o[0]));}const ln=new T.LineLoop(new T.BufferGeometry().setFromPoints(p),new T.LineDashedMaterial({color:o[4],transparent:true,opacity:.4,dashSize:.06,gapSize:.05}));ln.computeLineDistances();g.add(ln);
 const s=sat();g.add(s);const bg=new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]);const bl=new T.Line(bg,new T.LineBasicMaterial({color:o[4],transparent:true,opacity:.5}));scene.add(bl);
 const fp=new T.Mesh(new T.RingGeometry(.05,.075,40),new T.MeshBasicMaterial({color:o[4],transparent:true,opacity:.55,side:T.DoubleSide,depthWrite:false}));scene.add(fp);orb.push({s,r:o[0],v:o[3],a:i*2.1,bg,bl,fp});});
function yaw(la,lo){const p=ll(la,lo,1);return -Math.atan2(p.x,p.z);}const HOME=yaw(21,79);spin.rotation.y=HOME;tilt.rotation.x=.34;
let drag=null,idle=0;
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ry:spin.rotation.y,rx:tilt.rotation.x};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;spin.rotation.y=drag.ry+(e.clientX-drag.x)*.006;tilt.rotation.x=Math.max(-.4,Math.min(1,drag.rx+(e.clientY-drag.y)*.004));idle=0});
const end=()=>{drag=null};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
function rs(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}rs();addEventListener('resize',rs);
let vis=true;if('IntersectionObserver'in window)new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(stage);
const wp=new T.Vector3(),clk=new T.Clock();
(function f(){requestAnimationFrame(f);if(!vis)return;const dt=Math.min(clk.getDelta(),.05),t=clk.elapsedTime;idle+=dt;
 if(!drag&&idle>1.5){const goal=HOME+(reduce?0:Math.sin(t*.45)*.28);spin.rotation.y+=(goal-spin.rotation.y)*Math.min(1,dt*1.6);tilt.rotation.x+=(.34-tilt.rotation.x)*Math.min(1,dt*1.6);}
 mk.forEach(m=>{const k=reduce?.5:((t*.9+m.ph)%1),s=1+k*2.2;m.r.scale.set(s,s,s);m.m.opacity=.8*(1-k);});
 orb.forEach(o=>{if(!reduce)o.a+=o.v*110*dt;o.s.position.set(Math.cos(o.a)*o.r,0,Math.sin(o.a)*o.r);o.s.rotation.y=-o.a;o.s.getWorldPosition(wp);const g=wp.clone().normalize().multiplyScalar(R*1.01);
  const ps=o.bg.attributes.position;ps.setXYZ(0,wp.x,wp.y,wp.z);ps.setXYZ(1,g.x,g.y,g.z);ps.needsUpdate=true;o.fp.position.copy(g);o.fp.lookAt(g.clone().multiplyScalar(2));const v=wp.z>-.2;o.bl.visible=v;o.fp.visible=v;});
 renderer.render(scene,camera);})();
})();
