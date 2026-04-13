const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');`;

const CSS = `
${FONTS}
*{box-sizing:border-box;margin:0;padding:0;}
:root{
--gold:#c9a84c;--gold2:#8a6d2f;--gold3:#f0d080;--gold4:#3a2a10;
--crim:#8b1a1a;--crim2:#c0392b;--crim3:#e85c5c;--crim4:#1a0505;
--dark:#07050a;--dark2:#0f0b14;--dark3:#17121e;--dark4:#211a28;
--text:#ede0cc;--dim:#7a6a58;--dim2:#3a2e24;
--border:rgba(201,168,76,0.18);--crim-border:rgba(139,26,26,0.45);
--host-border:rgba(201,168,76,0.35);
--shadow:0 12px 48px rgba(0,0,0,0.7);
--glow:0 0 40px rgba(201,168,76,0.2);
}
html,body{background:var(--dark);min-height:100vh;}

/* APP SHELL */
.app{min-height:100vh;background:
radial-gradient(ellipse at 15% 5%,rgba(30,8,45,0.9) 0%,transparent 50%),
radial-gradient(ellipse at 85% 95%,rgba(60,8,8,0.6) 0%,transparent 50%),
#07050a;
font-family:'Crimson Text',serif;color:var(--text);overflow-x:clip;}
.noise{position:fixed;inset:0;opacity:.03;pointer-events:none;z-index:0;
background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
background-size:200px;}
.z1{position:relative;z-index:1;}

/* HEADER */
.hdr{text-align:center;padding:28px 16px 28px;border-bottom:1px solid var(--border);
background:linear-gradient(to bottom,rgba(139,26,26,.08),transparent);overflow:visible;}
.logo{font-family:'Cinzel Decorative',cursive;font-size:clamp(1.6rem,5vw,3rem);font-weight:900;
color:var(--gold);
text-shadow:
0 0 0 2px rgba(0,0,0,.9),
1px 1px 0 #3a2000,
2px 2px 0 #2a1500,
3px 3px 0 #1a0d00,
3px 3px 12px rgba(0,0,0,.8),
0 0 60px rgba(201,168,76,.5),
0 0 120px rgba(201,168,76,.2);
-webkit-text-stroke:1.5px rgba(100,50,0,.8);
letter-spacing:.06em;overflow:visible;line-height:1.1;
filter:drop-shadow(0 4px 16px rgba(0,0,0,.9)) drop-shadow(0 0 40px rgba(201,168,76,.3));}
.logo-sub{font-style:italic;color:var(--dim);font-size:.95rem;margin-top:5px;letter-spacing:.08em;}

/* PHASE STRIP */
.phase-strip{display:flex;overflow-x:auto;border-bottom:1px solid var(--border);scrollbar-width:none;background:rgba(0,0,0,.3);}
.phase-strip::-webkit-scrollbar{display:none;}
.ps-item{flex:1;min-width:72px;padding:8px 6px;text-align:center;font-family:'Cinzel',serif;
font-size:.52rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dim2);
border-bottom:2px solid transparent;transition:.25s;cursor:default;white-space:nowrap;}
.ps-item.active{color:var(--gold);border-bottom-color:var(--gold);background:rgba(201,168,76,.04);}
.ps-item.done{color:var(--dim2);border-bottom-color:rgba(201,168,76,.1);}

/* LAYOUT */
.main{max-width:880px;margin:0 auto;padding:24px 14px 80px;}
.dual{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
@media(max-width:640px){.dual{grid-template-columns:1fr;}}

/* CARDS */
.card{background:var(--dark2);border:1px solid var(--border);border-radius:5px;
padding:22px;margin-bottom:16px;box-shadow:var(--shadow),inset 0 1px 0 rgba(201,168,76,.06);
position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
background:linear-gradient(to right,transparent,var(--gold2),transparent);}
.card.crim{border-color:var(--crim-border);}
.card.crim::before{background:linear-gradient(to right,transparent,var(--crim2),transparent);}
.card.host{border:1px solid var(--host-border);background:rgba(201,168,76,.03);}
.card.host::before{background:linear-gradient(to right,transparent,var(--gold),transparent);}
.card.night{border-color:rgba(60,0,80,.6);background:rgba(20,5,30,.8);}
.card.night::before{background:linear-gradient(to right,transparent,rgba(140,60,200,.5),transparent);}
.ctitle{font-family:'Cinzel',serif;font-size:.78rem;color:var(--gold);
letter-spacing:.18em;text-transform:uppercase;margin-bottom:16px;font-weight:700;}
.ctitle.red{color:var(--crim3);}
.ctitle.purple{color:#c090ff;}

/* TYPOGRAPHY */
.display{font-family:'Cinzel Decorative',cursive;font-size:clamp(1.3rem,3.5vw,2rem);font-weight:900;}
.serif-lg{font-family:'Crimson Text',serif;font-size:1.2rem;letter-spacing:.05em;}
.body{font-size:1rem;line-height:1.75;color:var(--text);}
.italic{font-style:italic;color:var(--dim);}
.label{font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin-bottom:8px;display:block;}
.gold{color:var(--gold);}
.red{color:var(--crim3);}
.dim{color:var(--dim);}
.purple{color:#c090ff;}

/* INPUTS */
input[type=text],input[type=number],select,textarea{
background:var(--dark3);border:1px solid var(--border);border-radius:3px;
padding:11px 15px;color:var(--text);font-family:'Crimson Text',serif;
font-size:1rem;outline:none;transition:border-color .2s,box-shadow .2s;}
input[type=text]:focus,select:focus,textarea:focus{
border-color:var(--gold2);box-shadow:0 0 0 3px rgba(201,168,76,.07);}
input[type=text]::placeholder,textarea::placeholder{color:var(--dim);}
input[type=number]{width:72px;text-align:center;}
select option{background:var(--dark3);}
textarea{resize:vertical;min-height:72px;width:100%;}
.w100{width:100%;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;
padding:12px 22px;border-radius:3px;font-family:'Cinzel',serif;font-size:.67rem;
font-weight:700;letter-spacing:.13em;cursor:pointer;border:none;
transition:all .2s;text-transform:uppercase;white-space:normal;word-break:break-word;text-align:center;box-sizing:border-box;}
.btn-gold{background:linear-gradient(135deg,#c9a84c,#7a5d28);color:#07050a;box-shadow:0 4px 20px rgba(201,168,76,.3);}
.btn-gold:hover{filter:brightness(1.12);transform:translateY(-1px);box-shadow:0 6px 28px rgba(201,168,76,.35);}
.btn-crim{background:linear-gradient(135deg,#8b1a1a,#5a0e0e);color:var(--text);box-shadow:0 4px 20px rgba(139,26,26,.4);}
.btn-crim:hover{filter:brightness(1.18);transform:translateY(-1px);}
.btn-night{background:linear-gradient(135deg,#2a0840,#180328);color:#d0a8ff;border:1px solid rgba(120,40,180,.4);box-shadow:0 4px 20px rgba(80,0,120,.3);}
.btn-night:hover{filter:brightness(1.15);transform:translateY(-1px);}
.btn-outline{background:transparent;border:1px solid var(--border);color:var(--dim);}
.btn-outline:hover{border-color:var(--gold2);color:var(--gold);}
.btn-ghost{background:transparent;border:1px solid var(--crim-border);color:var(--dim);}
.btn-ghost:hover{border-color:var(--crim3);color:var(--crim3);}
.btn-sm{padding:8px 14px;font-size:.59rem;}
.btn-lg{padding:17px 34px;font-size:.77rem;}
.btn-xl{padding:22px 42px;font-size:.85rem;letter-spacing:.18em;}
.btn:disabled{opacity:.3;cursor:not-allowed;transform:none!important;filter:none!important;}

/* PLAYER GRID */
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:9px;}
.pcard{background:var(--dark3);border:1px solid var(--border);border-radius:3px;
padding:13px 10px;text-align:center;cursor:default;transition:all .2s;position:relative;}
.pcard.click{cursor:pointer;}
.pcard.click:hover{border-color:var(--gold2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.5);}
.pcard.sel{border-color:var(--gold);background:rgba(201,168,76,.08);box-shadow:0 0 18px rgba(201,168,76,.2);}
.pcard.dead{opacity:.3;pointer-events:none;}
.pavatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--dark),var(--dark4));
border:2px solid var(--border);margin:0 auto 7px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;}
.pname{font-family:'Cinzel',serif;font-size:.78rem;font-weight:600;color:var(--text);}
.prole{display:inline-block;margin-top:4px;padding:2px 7px;border-radius:2px;
font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;}
.role-t{background:rgba(139,26,26,.4);color:#f08080;border:1px solid rgba(139,26,26,.5);}
.role-f{background:rgba(201,168,76,.12);color:var(--gold);border:1px solid rgba(201,168,76,.25);}
.role-s{background:rgba(80,0,80,.4);color:#d88ef0;border:1px solid rgba(120,0,120,.5);}
.vpip{position:absolute;top:5px;right:5px;background:var(--crim);color:#fff;
border-radius:50%;width:19px;height:19px;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;}
.ppip{position:absolute;top:5px;left:5px;font-size:.8rem;}

/* POWER BADGES */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:2px;
font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;}
.b-shield{background:rgba(30,60,180,.3);color:#88aaff;border:1px solid rgba(60,100,220,.35);}
.b-dagger{background:rgba(139,26,26,.35);color:#ff9999;border:1px solid rgba(139,26,26,.5);}
.b-seer{background:rgba(100,0,140,.35);color:#dd88ff;border:1px solid rgba(140,0,180,.4);}

/* TIMER */
.timer-wrap{margin:10px 0 16px;}
.timer-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
.timer-label{font-family:'Cinzel',serif;font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;color:var(--dim);}
.timer-num{font-family:'Cinzel Decorative',cursive;font-size:1.4rem;font-weight:700;color:var(--gold);}
.timer-bar{height:4px;background:var(--dark4);border-radius:2px;overflow:hidden;}
.timer-fill{height:100%;background:linear-gradient(to right,var(--gold2),var(--gold));transition:width 1s linear;border-radius:2px;}
.timer-fill.warn{background:linear-gradient(to right,#a05020,var(--crim2));}
.timer-fill.urgent{background:linear-gradient(to right,var(--crim),var(--crim3));animation:urgentPulse 0.5s infinite;}
@keyframes urgentPulse{0%,100%{opacity:1;}50%{opacity:.6;}}
@keyframes logoFlicker{
0%,100%{filter:drop-shadow(0 4px 16px rgba(0,0,0,.9)) drop-shadow(0 0 40px rgba(201,168,76,.3));}
45%{filter:drop-shadow(0 4px 16px rgba(0,0,0,.9)) drop-shadow(0 0 70px rgba(201,168,76,.6)) drop-shadow(0 0 120px rgba(201,168,76,.2));}
50%{filter:drop-shadow(0 4px 16px rgba(0,0,0,.9)) drop-shadow(0 0 20px rgba(201,168,76,.2));}
55%{filter:drop-shadow(0 4px 16px rgba(0,0,0,.9)) drop-shadow(0 0 60px rgba(201,168,76,.5));}
}
@keyframes candleFlicker{
0%,100%{transform:scaleY(1) scaleX(1) rotate(-1deg);opacity:.9;}
25%{transform:scaleY(1.08) scaleX(.94) rotate(1deg);opacity:1;}
50%{transform:scaleY(.96) scaleX(1.04) rotate(-2deg);opacity:.85;}
75%{transform:scaleY(1.05) scaleX(.97) rotate(.5deg);opacity:.95;}
}
@keyframes candleGlow{
0%,100%{box-shadow:0 0 12px 4px rgba(255,160,50,.3),0 0 4px rgba(255,200,80,.5);}
50%{box-shadow:0 0 20px 8px rgba(255,140,30,.25),0 0 8px rgba(255,180,60,.4);}
}
.logo-lobby{animation:logoFlicker 4s ease-in-out infinite;}
.logo-title{animation:logoFlicker 4s ease-in-out infinite;filter:drop-shadow(0 4px 16px rgba(0,0,0,.9)) drop-shadow(0 0 40px rgba(201,168,76,.3));text-shadow:0 0 0 2px rgba(0,0,0,.9),1px 1px 0 #3a2000,2px 2px 0 #2a1500,3px 3px 0 #1a0d00,3px 3px 12px rgba(0,0,0,.8),0 0 60px rgba(201,168,76,.5),0 0 120px rgba(201,168,76,.2);-webkit-text-stroke:1.5px rgba(100,50,0,.8);}

/* QUIP BOX */
.quip{background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.14);
border-radius:3px;padding:14px 18px;font-style:italic;font-size:.95rem;
color:var(--dim);line-height:1.65;position:relative;}
.quip::before{content:'"';font-family:'Cinzel Decorative',cursive;font-size:2.5rem;
color:var(--gold2);position:absolute;top:-8px;left:10px;line-height:1;}

/* INSTRUCTION LIST */
.inst-list{list-style:none;display:flex;flex-direction:column;gap:8px;}
.inst-item{display:flex;gap:12px;padding:10px 14px;background:var(--dark3);
border-radius:3px;border-left:2px solid var(--gold2);font-size:.92rem;line-height:1.5;}
.inst-num{font-family:'Cinzel Decorative',cursive;font-size:.85rem;color:var(--gold2);
min-width:20px;padding-top:2px;}

/* HOST PANEL */
.host-panel{background:rgba(201,168,76,.03);border:1px solid var(--host-border);border-radius:4px;padding:18px;}
.host-label{font-family:'Cinzel Decorative',cursive;font-size:.65rem;color:var(--gold);
letter-spacing:.16em;text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:8px;}

/* NIGHT */
.night-bg{background:rgba(10,2,18,.95);border:1px solid rgba(80,20,120,.4);border-radius:5px;padding:28px;text-align:center;}
.night-icon{font-size:3.5rem;display:block;margin-bottom:14px;}

/* CHAT */
.chat-wrap{background:rgba(10,2,18,.8);border:1px solid rgba(80,20,120,.3);border-radius:4px;overflow:hidden;}
.chat-msgs{max-height:240px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;}
.chat-msgs::-webkit-scrollbar{width:3px;}
.chat-msgs::-webkit-scrollbar-thumb{background:rgba(120,40,180,.4);border-radius:2px;}
.chat-msg{padding:8px 12px;border-radius:3px;font-size:.9rem;line-height:1.5;animation:fadeUp .25s ease;}
.chat-msg.mine{background:rgba(80,20,120,.35);border-right:2px solid rgba(140,60,200,.6);text-align:right;}
.chat-msg.other{background:rgba(139,26,26,.2);border-left:2px solid rgba(139,26,26,.5);}
.chat-name{font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px;}
.chat-name.mine{color:#c090ff;}
.chat-name.other{color:var(--crim3);}
.chat-input-row{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(80,20,120,.3);background:rgba(5,0,10,.6);}
.chat-input{flex:1;background:rgba(20,5,35,.8);border:1px solid rgba(80,20,120,.3);
border-radius:3px;padding:9px 12px;color:var(--text);font-family:'Crimson Text',serif;
font-size:.95rem;outline:none;}
.chat-input::placeholder{color:rgba(140,100,180,.5);}
.chat-input:focus{border-color:rgba(140,60,200,.5);}

/* SHORTLIST */
.shortlist-card{background:rgba(15,3,25,.9);border:1px solid rgba(80,20,120,.5);border-radius:4px;padding:16px;}

/* BANISHMENT REVEAL */
.ban-reveal{text-align:center;padding:40px 20px;}
.ban-name{font-family:'Cinzel Decorative',cursive;font-size:clamp(2.2rem,8vw,4.8rem);
font-weight:900;letter-spacing:.04em;line-height:1;animation:nameBlast .7s cubic-bezier(.2,.8,.3,1.3) forwards;}
@keyframes nameBlast{from{opacity:0;transform:scale(.4)translateY(20px);}to{opacity:1;transform:none;}}
.ban-verdict{font-family:'Cinzel',serif;font-size:1rem;letter-spacing:.22em;text-transform:uppercase;margin-top:14px;}

/* BREAKFAST */
.breakfast-group{background:rgba(15,8,5,.8);border:1px solid rgba(120,80,30,.3);
border-radius:4px;padding:14px;margin-bottom:10px;}
.bg-label{font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:.15em;
text-transform:uppercase;color:var(--gold2);margin-bottom:8px;}

/* MESSAGES */
.msglog{max-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:7px;}
.msglog::-webkit-scrollbar{width:3px;}
.msglog::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}
.msg{padding:9px 13px;border-radius:3px;border-left:3px solid;font-size:.88rem;line-height:1.5;animation:fadeUp .3s ease;}
.msg-system{background:rgba(201,168,76,.04);border-color:var(--gold2);color:var(--dim);}
.msg-death{background:rgba(139,26,26,.15);border-color:var(--crim);color:#e8b0b0;font-weight:600;}
.msg-ban{background:rgba(139,26,26,.1);border-color:var(--crim2);color:#f0c0c0;}
.msg-win{background:rgba(201,168,76,.1);border-color:var(--gold);color:var(--gold);font-weight:600;}
.msg-power{background:rgba(80,0,140,.1);border-color:#9055cc;color:#d0a0ff;}

/* MISC */
.divider{border:none;border-top:1px solid var(--border);margin:16px 0;}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.col{display:flex;flex-direction:column;gap:11px;}
.center{text-align:center;}
.info-box{background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.14);
border-radius:3px;padding:13px 16px;font-size:.9rem;color:var(--dim);line-height:1.65;}
.info-box.red{background:rgba(139,26,26,.07);border-color:var(--crim-border);color:#d4a4a4;}
.info-box.purple{background:rgba(80,0,120,.08);border-color:rgba(120,40,180,.3);color:#c0a0e0;}
.game-id-box{background:var(--dark3);border:1px dashed var(--border);border-radius:3px;
padding:9px 16px;font-family:monospace;font-size:1.15rem;color:var(--gold);
letter-spacing:.22em;text-align:center;cursor:pointer;user-select:all;}
.copy-hint{font-size:.78rem;color:var(--dim);text-align:center;margin-top:4px;font-style:italic;}
.tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:18px;}
.tab{flex:1;padding:10px;text-align:center;cursor:pointer;font-family:'Cinzel',serif;
font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);
border-bottom:2px solid transparent;transition:.2s;}
.tab.active{color:var(--gold);border-bottom-color:var(--gold);}
.stats{display:flex;gap:14px;flex-wrap:wrap;padding:14px;background:var(--dark3);
border-radius:3px;border:1px solid var(--border);}
.stat{text-align:center;flex:1;min-width:50px;}
.stat-n{font-family:'Cinzel Decorative',cursive;font-size:1.4rem;font-weight:900;color:var(--gold);}
.stat-l{font-size:.56rem;letter-spacing:.15em;text-transform:uppercase;color:var(--dim);
margin-top:1px;font-family:'Cinzel',serif;}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);
display:flex;align-items:center;justify-content:center;z-index:200;
backdrop-filter:blur(8px);padding:16px;}
.modal{background:var(--dark2);border:1px solid var(--border);border-radius:5px;
padding:28px;max-width:420px;width:100%;text-align:center;box-shadow:0 0 80px rgba(0,0,0,.9);
position:relative;overflow:hidden;max-height:90vh;overflow-y:auto;}
.modal::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
background:linear-gradient(to right,transparent,var(--gold),transparent);}
.modal.crim{border-color:var(--crim-border);}
.modal.crim::before{background:linear-gradient(to right,transparent,var(--crim2),transparent);}
.modal.night-modal{border-color:rgba(80,20,120,.5);background:rgba(12,3,22,.97);}
.modal.night-modal::before{background:linear-gradient(to right,transparent,rgba(140,60,200,.6),transparent);}

/* BLINDFOLD SCREEN */
.blindfold{background:rgba(4,1,8,.98);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;text-align:center;}
.bf-icon{font-size:5rem;margin-bottom:20px;display:block;}
.bf-title{font-family:'Cinzel Decorative',cursive;font-size:1.8rem;font-weight:900;color:rgba(80,40,120,.6);letter-spacing:.06em;margin-bottom:12px;}
.bf-sub{font-style:italic;color:rgba(80,60,100,.5);font-size:1rem;}

/* ROLE REVEAL SCREEN */
.role-screen{text-align:center;padding:28px 16px;}
.role-icon{font-size:4rem;display:block;margin-bottom:12px;}
.role-title{font-family:'Cinzel Decorative',cursive;font-size:1.7rem;font-weight:900;margin-bottom:10px;}
.role-title.t{color:var(--crim2);text-shadow:0 0 30px rgba(192,57,43,.5);}
.role-title.st{color:#d060ff;text-shadow:0 0 30px rgba(180,60,240,.5);}
.role-title.f{color:var(--gold);text-shadow:0 0 30px rgba(201,168,76,.4);}
.role-title.sv{color:#88aaff;text-shadow:0 0 25px rgba(88,140,255,.4);}
.allies-box{margin-top:16px;padding:13px;background:rgba(139,26,26,.15);border:1px solid var(--crim-border);border-radius:3px;}

/* ANIMATIONS */
.flicker{animation:flicker 4s infinite;}
@keyframes flicker{0%,100%{opacity:1;}91%{opacity:1;}92%{opacity:.6;}94%{opacity:1;}97%{opacity:.8;}99%{opacity:1;}}
.pulse{animation:pulse 2.2s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.55;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}

/* ROOMS */
.rooms-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
@media(max-width:400px){.rooms-grid{grid-template-columns:repeat(2,1fr);}}
.room-card{background:var(--dark3);border:1px solid var(--border);border-radius:3px;
padding:11px 8px;text-align:center;cursor:pointer;transition:all .2s;}
.room-card:hover{border-color:var(--gold2);}
.room-card.mine{border-color:var(--gold);background:rgba(201,168,76,.07);}
.room-icon{font-size:1.35rem;margin-bottom:4px;}
.room-name{font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);}
.room-pips{font-size:.78rem;margin-top:3px;min-height:16px;}

/* BREAKFAST TABLE */
.bk-group{background:rgba(20,12,4,.8);border:1px solid rgba(140,100,40,.25);
border-radius:4px;padding:13px 16px;margin-bottom:10px;transition:all .3s;}
.bk-group.current{border-color:rgba(201,168,76,.4);background:rgba(30,18,4,.9);}
.bk-group.waiting{opacity:.5;}
.bk-group-label{font-family:'Cinzel',serif;font-size:.6rem;color:var(--gold2);letter-spacing:.15em;text-transform:uppercase;margin-bottom:6px;}

/* NEXT PHASE CTA */
.next-phase-btn{width:100%;padding:16px 16px;font-size:.75rem;letter-spacing:.12em;margin-top:20px;border-radius:4px;}

/* MISSION GRID */
.mission-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));gap:9px;max-height:360px;overflow-y:auto;padding-right:4px;}
.mission-grid::-webkit-scrollbar{width:3px;}
.mission-grid::-webkit-scrollbar-thumb{background:var(--border);}
.mc{background:var(--dark3);border:1px solid var(--border);border-radius:3px;padding:14px;cursor:pointer;transition:all .2s;}
.mc:hover{border-color:var(--gold2);transform:translateY(-2px);}
.mc.sel{border-color:var(--gold);background:rgba(201,168,76,.06);}
.mc-icon{font-size:1.7rem;margin-bottom:8px;}
.mc-name{font-family:'Cinzel',serif;font-size:.8rem;font-weight:700;color:var(--gold);margin-bottom:4px;}
.mc-type{font-family:'Cinzel',serif;font-size:.56rem;letter-spacing:.15em;text-transform:uppercase;color:var(--dim);margin-bottom:6px;}
.mc-shield{font-size:.75rem;color:var(--dim);margin-bottom:6px;}
.mc-desc{font-size:.82rem;color:var(--dim);line-height:1.5;font-style:italic;}

/* TYPE FILTER */
.type-filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
.tf{padding:6px 12px;border-radius:20px;font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:1px solid var(--border);color:var(--dim);background:transparent;transition:.2s;}
.tf.active{background:rgba(201,168,76,.12);border-color:var(--gold2);color:var(--gold);}

/* SEER UI */
.seer-result-modal{background:rgba(12,3,24,.97);border:1px solid rgba(120,40,200,.4);}

/* ENDGAME */
.endgame-choices{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px;}

/* ── PHASE TRANSITIONS ── */
.phase-enter{animation:phaseEnter .45s cubic-bezier(.22,1,.36,1) both;}
.phase-enter-fast{animation:phaseEnter .25s cubic-bezier(.22,1,.36,1) both;}
.slide-up{animation:slideUp .4s cubic-bezier(.22,1,.36,1) both;}
.fade-in{animation:fadeInEl .35s ease both;}
.scale-in{animation:scaleIn .4s cubic-bezier(.34,1.56,.64,1) both;}
.dramatic-enter{animation:dramaticEnter .6s cubic-bezier(.22,1,.36,1) both;}
@keyframes phaseEnter{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeInEl{from{opacity:0;}to{opacity:1;}}
@keyframes scaleIn{from{opacity:0;transform:scale(.92);}to{opacity:1;transform:scale(1);}}
@keyframes dramaticEnter{from{opacity:0;transform:scale(.88) translateY(30px);}to{opacity:1;transform:scale(1) translateY(0);}}
.transition-overlay{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;background:rgba(4,1,8,.96);backdrop-filter:blur(8px);animation:fadeInEl .3s ease;}
.transition-inner{max-width:400px;width:90%;text-align:center;padding:40px 28px;animation:dramaticEnter .5s .1s cubic-bezier(.22,1,.36,1) both;}
.death-letter{background:linear-gradient(160deg,#1a1008,#0d0905,#1a0f06);border:2px solid rgba(139,26,26,.6);border-radius:4px;padding:32px 28px;position:relative;box-shadow:0 0 60px rgba(139,26,26,.3),inset 0 0 40px rgba(0,0,0,.4);font-family:'Crimson Text',serif;}
.death-letter::before{content:'';position:absolute;inset:8px;border:1px solid rgba(139,26,26,.2);border-radius:2px;pointer-events:none;}
.wax-seal{width:72px;height:72px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#c0392b,#8b0000,#5a0000);display:flex;align-items:center;justify-content:center;font-size:1.8rem;box-shadow:0 4px 20px rgba(139,26,26,.6),inset 0 2px 4px rgba(255,100,100,.15);margin:0 auto 20px;position:relative;}

/* ── PHASE ATMOSPHERE ANIMATIONS ── */
@keyframes floatUp { 0%{transform:translateY(0) rotate(0deg);opacity:.7;} 100%{transform:translateY(-120px) rotate(15deg);opacity:0;} }
@keyframes emberFloat { 0%{transform:translateY(0) translateX(0) scale(1);opacity:.9;} 50%{opacity:.6;} 100%{transform:translateY(-80px) translateX(20px) scale(.3);opacity:0;} }
@keyframes moonPulse { 0%,100%{filter:drop-shadow(0 0 12px rgba(160,120,255,.5));transform:scale(1);} 50%{filter:drop-shadow(0 0 28px rgba(180,140,255,.8));transform:scale(1.04);} }
@keyframes starTwinkle { 0%,100%{opacity:.2;transform:scale(.8);} 50%{opacity:1;transform:scale(1.2);} }
@keyframes knifeDrift { 0%,100%{transform:rotate(-8deg) translateY(0);} 50%{transform:rotate(8deg) translateY(-6px);} }
@keyframes bloodDrip { 0%{height:0;opacity:1;} 80%{opacity:1;} 100%{height:18px;opacity:0;} }
@keyframes flameWaver { 0%,100%{transform:scaleX(1) scaleY(1) rotate(-2deg);} 33%{transform:scaleX(.92) scaleY(1.08) rotate(2deg);} 66%{transform:scaleX(1.06) scaleY(.96) rotate(-1deg);} }
@keyframes smokeDrift { 0%{transform:translateY(0) translateX(0) scaleX(1);opacity:.5;} 100%{transform:translateY(-60px) translateX(12px) scaleX(1.8);opacity:0;} }
@keyframes swordShimmer { 0%,100%{filter:drop-shadow(0 0 4px rgba(201,168,76,.3));} 50%{filter:drop-shadow(0 0 14px rgba(201,168,76,.8));} }
@keyframes tableGlow { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,.1),inset 0 0 30px rgba(201,168,76,.03);} 50%{box-shadow:0 0 40px rgba(201,168,76,.2),inset 0 0 50px rgba(201,168,76,.07);} }
@keyframes banishFlare { 0%{opacity:0;transform:scale(.6);} 60%{opacity:1;transform:scale(1.08);} 100%{transform:scale(1);} }
@keyframes torchFlicker { 0%,100%{opacity:.9;transform:scaleY(1);} 25%{opacity:.7;transform:scaleY(.92);} 75%{opacity:1;transform:scaleY(1.06);} }
@keyframes roamDrift { 0%,100%{transform:translateX(0);} 50%{transform:translateX(6px);} }
@keyframes breakfastRise { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
@keyframes fireBreath { 0%,100%{transform:scaleY(1) scaleX(1);filter:brightness(1);} 40%{transform:scaleY(1.12) scaleX(.94);filter:brightness(1.3);} 70%{transform:scaleY(.94) scaleX(1.05);filter:brightness(.9);} }
@keyframes orbPulse { 0%,100%{transform:scale(1);opacity:.6;} 50%{transform:scale(1.15);opacity:1;} }
@keyframes torchGlow { 0%,100%{box-shadow:0 0 18px rgba(255,140,30,.3);} 50%{box-shadow:0 0 40px rgba(255,160,50,.6);} }
@keyframes windowGlow { 0%,100%{opacity:.55;} 50%{opacity:1;} }
@keyframes crystalPulse { 0%,100%{opacity:.7;filter:drop-shadow(0 0 8px rgba(160,100,255,.3));} 50%{opacity:1;filter:drop-shadow(0 0 20px rgba(180,120,255,.6));} }
@keyframes crystalSwirl { 0%,100%{transform:translate(0,0) scale(1);opacity:.18;} 33%{transform:translate(4px,-3px) scale(1.1);opacity:.28;} 66%{transform:translate(-3px,2px) scale(.94);opacity:.14;} }
@keyframes gobletGlow { 0%,100%{filter:drop-shadow(0 0 6px rgba(201,168,76,.3));} 50%{filter:drop-shadow(0 0 16px rgba(201,168,76,.7));} }
@keyframes moonRise { 0%,100%{filter:drop-shadow(0 0 14px rgba(255,255,220,.4));transform:scale(1);} 50%{filter:drop-shadow(0 0 32px rgba(255,255,200,.7));transform:scale(1.04);} }
@keyframes gavelSwing { 0%,20%{transform:rotate(20deg);} 42%,58%{transform:rotate(-85deg);} 100%{transform:rotate(20deg);} }
@keyframes gavelImpact { 0%,33%,67%,100%{opacity:0;transform:scaleY(0);} 45%,55%{opacity:1;transform:scaleY(1);} }
@keyframes pathStep { 0%,100%{opacity:.25;transform:translateY(-50%) scale(.65);} 50%{opacity:1;transform:translateY(-50%) scale(1.3);} }
`;

export { FONTS, CSS };
