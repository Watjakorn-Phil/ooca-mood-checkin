'use strict';
const QUESTIONS=[
{title:'ตอนนี้เรื่องไหนดึงพลังใจคุณไปมากที่สุด?',answers:['งานหลายอย่างเข้ามาพร้อมกัน','การคุยหรือตอบข้อความเรื่องงาน','บรรยากาศหรือความสัมพันธ์กับคนในที่ทำงาน'],caption:'เริ่มจากเรื่องที่อยู่ในใจ<br>ไม่ต้องรีบหาคำตอบก็ได้'},
{title:'ถ้าตอนนี้เลือกสิ่งหนึ่งให้ตัวเองได้ คุณอยากได้อะไร?',answers:['พักเงียบ ๆ สักครู่','ช่วยจัดลำดับว่าจะเริ่มจากตรงไหน','คุยกับคนที่ไว้ใจ'],caption:'ลองให้พื้นที่กับสิ่ง<br>ที่ใจต้องการในวันนี้'},
{title:'ก้าวเล็ก ๆ แบบไหนที่พอทำได้ในวันนี้?',answers:['หยุดพักและหายใจสักสองนาที','เลือกจัดการงานทีละอย่าง','ทักคนที่ไว้ใจให้รับฟัง'],caption:'ไม่ต้องเปลี่ยนทุกอย่าง<br>แค่ก้าวเล็ก ๆ ก็มีความหมาย'}];
const RESULTS={
A:{title:'โหมดขอพัก',description:'วันนี้คุณอาจอยากมีเวลาสงบ ๆ ให้ตัวเองได้พักจากสิ่งที่รุมอยู่',tip:'พักจากหน้าจอสัก 5 นาที',lines:['วางงานลงสักครู่ แล้วหายใจช้า ๆ','การพักก็เป็นก้าวหนึ่งของการดูแลตัวเอง'],color:'#e0f8f6'},
B:{title:'โหมดขอความชัดเจน',description:'วันนี้คุณอาจอยากจัดสิ่งที่อยู่ในหัวให้เป็นขั้นตอน แล้วเริ่มจากเรื่องเล็ก ๆ หนึ่งอย่าง',tip:'เขียนสิ่งที่จะเริ่มทำหนึ่งข้อ',lines:['เลือกแค่เรื่องเล็ก ๆ ที่พอทำไหว','ไม่จำเป็นต้องจัดการทุกอย่างในวันนี้'],color:'#e4effb'},
C:{title:'โหมดอยากมีคนฟัง',description:'วันนี้การได้คุยกับคนที่ไว้ใจอาจช่วยให้คุณรู้สึกเบาขึ้น',tip:'ส่งข้อความหาคนที่ไว้ใจ',lines:['ลองเริ่มว่า “วันนี้ขอเล่าอะไรให้ฟังหน่อยได้ไหม”','คุณไม่จำเป็นต้องเก็บทุกอย่างไว้คนเดียว'],color:'#fcf4e0'},
D:{title:'ยังไม่ต้องรู้คำตอบก็ได้',description:'วันนี้อาจยังหาคำที่ตรงกับใจไม่เจอ ไม่เป็นไรเลย เราค่อย ๆ ลองใหม่เมื่อพร้อมได้',tip:'ให้เวลาตัวเองอีกนิด',lines:['คำตอบยังไม่พอให้สรุปโหมดในวันนี้','ไม่ต้องรีบ และไม่มีคำตอบไหนผิด'],color:'#e4effb'}};
function getOutcome(answers){const answered=answers.filter(v=>['A','B','C'].includes(v));if(answered.length<2)return 'D';const counts={A:0,B:0,C:0};for(const v of answered)counts[v]++;const max=Math.max(...Object.values(counts));return [...answered].reverse().find(v=>counts[v]===max);}
if(typeof module!=='undefined')module.exports={getOutcome};
if(typeof document!=='undefined'){
const app=document.querySelector('#app'),status=document.querySelector('#status');let answers=[null,null,null],step=0,busy=false,timer=null,currentResult=null,shareBlob=null,shareUrl=null;
const img=(name,cls='mascot',alt='')=>name==='curious'
  ? '<span class="'+cls+' curious-frame"><img src="assets/mooca-curious.png" width="211.5" height="224" alt="'+alt+'"></span>'
  : '<img class="'+cls+'" src="assets/mooca-'+name+'.svg?v=20261107-figma-sync1" width="278" height="278" alt="'+alt+'">';
// Prototype: 520ms dissolve into teal, 500ms hold, 500ms dissolve to Q1.
function beginCheckin(){
  if(busy)return;
  busy=true;
  const wash=document.createElement('section');
  wash.className='teal-wash';
  wash.setAttribute('role','status');
  wash.innerHTML='<div class="wash-copy"><picture class="wash-logo"><source media="(max-width:700px)" srcset="assets/ooca-wash-mobile.svg"><img src="assets/ooca-wash-desktop.svg" alt="ooca"></picture><p class="wash-tagline">ค่อย ๆ ฟังใจไปด้วยกัน</p></div>';
  document.body.append(wash);
  document.querySelector('#begin').disabled=true;
  timer=setTimeout(()=>{
    question();
    wash.classList.add('wash-leaving');
    timer=setTimeout(()=>wash.remove(),500);
  },1020);
}
const loadingArtwork=new Image();loadingArtwork.src='assets/mooca-loading.svg?v=20261107-figma-sync1';
const bgNames=['EllipseTl','EllipseBr','EllipseCenter','EllipseWarm','Star1','Star2','Star3','Star4'];
const mobileQuestionBackground=document.createElement('div');
mobileQuestionBackground.className='mobile-question-bg';
mobileQuestionBackground.setAttribute('aria-hidden','true');
mobileQuestionBackground.innerHTML=['BlobTopLeft','BlobBottomRight','BlobMidLeft','WaveBottom','Star1','Star2','Star3','Star4'].map(name=>'<img class="mobile-bg-'+name+'" src="assets/mobile-imgBg'+name+'.svg?v=20261107-figma-sync1" alt="">').join('');

document.querySelector('.background').innerHTML=bgNames.map((n,i)=>'<img class="'+['bg-ellipse-tl','bg-ellipse-br','bg-ellipse-center','bg-ellipse-warm','bg-star-1','bg-star-2','bg-star-3','bg-star-4'][i]+'" src="assets/imgBg'+n+'.svg" alt="">').join('');
document.querySelector('.background').append(mobileQuestionBackground);
function focusHeading(){const h=app.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
function show(html,first=false){app.innerHTML=html;app.firstElementChild.classList.add(first?'entry':'page-enter');if(!first){window.scrollTo({top:0,behavior:'instant'});focusHeading();}}
function start(first=false){clearTimeout(timer);answers=[null,null,null];currentResult=null;busy=false;show('<section class="welcome"><div class="story"><p class="eyebrow">พักเรื่องงานไว้ แล้วหันมาฟังใจ</p><h1>วันนี้ใจเรา<br>อยู่โหมดไหน?</h1><p class="body-copy">วันที่งานดึงพลังไป <span class="mobile-welcome-break"><br></span>ลองแวะมาฟังใจตัวเองผ่านคำถามสั้น ๆ ให้ mooca อยู่เป็นเพื่อนคุณสักครู่</p><div class="details"><span>3 คำถาม</span><span>ประมาณ 1 นาที</span><span>ข้ามได้</span></div><button class="primary" id="begin"><img src="assets/imgIconCursorRegular.svg" alt="">เริ่มฟังใจตัวเอง</button><p class="small">ไม่มีถูกหรือผิด เลือกตามที่รู้สึกในวันนี้ได้เลย</p></div><div class="welcome-art">'+img('curious','mascot motion-curious','mooca อยู่เป็นเพื่อนคุณ')+'<div class="greeting"><p>วันนี้ ไม่ต้องไหวทุกเรื่องก็ได้</p><span>a little check-in with mooca</span></div></div></section>',first);document.querySelector('#begin').onclick=()=>{step=0;beginCheckin();};}
function question(){busy=false;const q=QUESTIONS[step];show('<section class="quiz-shell"><button class="back" id="back"><img src="assets/mobile-imgIconArrowSmallBack.svg" alt=""> <span>ย้อนกลับ</span></button><div class="quiz-card"><aside class="question-art">'+img('q'+(step+1),'mascot motion-q'+(step+1))+'<p>'+q.caption+'</p></aside><div class="question-content"><div><div class="progress-label"><span>ค่อย ๆ ฟังใจไปด้วยกัน</span><b>0'+(step+1)+' / 03</b></div><div class="progress" aria-label="คำถามที่ '+(step+1)+' จาก 3">'+[0,1,2].map(i=>'<span class="'+(i<=step?'done':'')+'"></span>').join('')+'</div></div><div class="question-title"><h1 id="question-title">'+(step===2?q.title.replace(' ๆ ',' ๆ <br class="mobile-question-break">'):q.title)+'</h1><p class="small" id="answer-help">เลือก 1 ข้อที่ใกล้กับความรู้สึกตอนนี้ที่สุด</p></div><fieldset class="answers" aria-labelledby="question-title" aria-describedby="answer-help">'+q.answers.map((a,i)=>{const v='ABC'[i];return '<label class="answer"><input type="radio" name="mood" value="'+v+'" '+(answers[step]===v?'checked':'')+'><span class="letter">'+v+'</span><span class="answer-text">'+a+'</span><span class="radio" aria-hidden="true"></span></label>';}).join('')+'</fieldset><div class="question-actions"><button class="primary" id="next" '+(!answers[step]?'disabled':'')+'>'+(step===2?'ดูโหมดของใจวันนี้':'ไปข้อต่อไป')+'</button><button class="text-button" id="skip">ข้ามข้อนี้</button></div></div></div></section>');
app.querySelectorAll('input').forEach(input=>input.onchange=()=>{answers[step]=input.value;document.querySelector('#next').disabled=false;});document.querySelector('#back').onclick=()=>{if(step===0)start();else{step--;question();}};document.querySelector('#next').onclick=()=>advance(false);document.querySelector('#skip').onclick=()=>advance(true);}
function advance(skip){if(busy)return;if(!skip&&!answers[step])return;busy=true;if(skip)answers[step]=null;if(step<2){step++;question();}else loading();}
function loading(){currentResult=getOutcome(answers);answers=[null,null,null];show('<section class="loading-state" role="status"><span class="logo loading-logo"><picture><source media="(max-width:700px)" srcset="assets/ooca-logo-mobile.svg"><img src="assets/ooca-logo-desktop.svg" alt="ooca"></picture></span><div class="loading-orbit">'+img('loading','mascot motion-loading')+'<img class="spinner motion-spinner" src="assets/loading-spinner.svg" alt="" aria-hidden="true"></div><h1>กำลังอ่านคำตอบของคุณ</h1><p>มูก้ากำลังเตรียมเรื่องราวของใจวันนี้...</p></section>');timer=setTimeout(result,2000);}
function result(){
  busy=false;
  const key=currentResult,r=RESULTS[key];
  const shareButton='<button class="'+(key==='D'?'text-button secondary-share':'primary')+'" id="share"><span class="share-icon" aria-hidden="true"><img src="assets/icon-share-regular.svg" width="22.5" height="21" alt=""></span>แชร์การ์ด</button>';
  const privacy='<p class="privacy">แชร์เฉพาะคาแรกเตอร์และข้อความ ไม่แสดงคำตอบส่วนตัว</p>';
  const actions=key==='D'
    ? '<button class="primary" id="retry">ลองตอบใหม่</button><button class="text-button" id="restart">กลับไปเริ่มใหม่</button>'+shareButton+privacy
    : shareButton+privacy+'<button class="text-button" id="restart">กลับไปเริ่มใหม่</button>';
  show('<section class="result" data-mode="'+key+'" style="--result-color:'+r.color+'"><div class="result-art">'+img(key,'mascot motion-'+key,'mooca · '+r.title)+'</div><div class="result-content"><p class="small">'+(key==='D'?'วันนี้ยังไม่พร้อมตอบ ก็ไม่เป็นไร':'จากคำตอบของคุณ วันนี้อาจเป็น…')+'</p><div class="result-title"><p class="mooca-word">mooca</p><h1>'+r.title+'</h1></div><p class="body-copy">'+r.description+'</p><div class="tip"><h2>'+r.tip+'</h2><p>'+r.lines.join('<br>')+'</p></div><a class="consult" href="https://ooca.co/" target="_blank" rel="noopener noreferrer">ดูทางเลือกการปรึกษากับ OOCA →</a>'+actions+'</div></section>');
  document.querySelector('#restart').onclick=()=>start();
  document.querySelector('#share').onclick=share;
  if(key==='D')document.querySelector('#retry').onclick=()=>{answers=[null,null,null];step=0;currentResult=null;question();};
}
async function share(){const button=document.querySelector('#share');button.disabled=true;try{await document.fonts.ready;const r=RESULTS[currentResult],canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1080;const ctx=canvas.getContext('2d');ctx.fillStyle=r.color;ctx.fillRect(0,0,1080,1080);ctx.fillStyle='#00a28b';ctx.font='bold 64px Prompt';ctx.textAlign='left';ctx.fillText('ooca',70,100);const character=new Image();character.src='assets/mooca-'+currentResult+'.svg?v=20261107-figma-sync1';await character.decode();ctx.drawImage(character,280,140,520,520);ctx.textAlign='center';ctx.fillStyle='#686868';ctx.font='28px Prompt';ctx.fillText('เช็กอินใจในวันนี้กับ mooca',540,710);ctx.fillStyle='#272727';ctx.font='bold 50px Prompt';ctx.fillText(r.title,540,800);ctx.font='30px Prompt';ctx.fillText(r.tip,540,875);ctx.fillStyle='#686868';ctx.font='22px Prompt';ctx.fillText('สะท้อนความรู้สึกในวันนี้ ไม่ใช่การวินิจฉัย',540,1005);shareBlob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!shareBlob)throw new Error('image');if(shareUrl)URL.revokeObjectURL(shareUrl);shareUrl=URL.createObjectURL(shareBlob);document.querySelector('#share-preview').src=shareUrl;document.querySelector('#download-card').href=shareUrl;document.querySelector('#share-dialog').showModal();}catch(e){status.textContent='ไม่สามารถสร้างการ์ดได้ กรุณาลองอีกครั้ง';button.textContent='ลองสร้างการ์ดอีกครั้ง';}finally{button.disabled=false;}}
document.querySelector('#native-share').onclick=async()=>{try{const file=new File([shareBlob],'mooca-today.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'OOCA · Mood Check-in'});}else{document.querySelector('#download-card').click();status.textContent='บันทึกการ์ดแล้ว สามารถนำไปแชร์ได้';}}catch(e){if(e.name!=='AbortError')status.textContent='แชร์ไม่ได้ในเบราว์เซอร์นี้ กรุณาเลือกบันทึกการ์ด';}};
start(true);
}

