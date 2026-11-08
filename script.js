/* Galleria Umberto — counter status + the one load moment. Boston time, always. */
(function(){
  "use strict";
  var TZ="America/New_York";
  function bostonNow(){
    var f=new Intl.DateTimeFormat("en-US",{timeZone:TZ,weekday:"short",hour:"numeric",minute:"numeric",hour12:false});
    var p={};f.formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
    var days={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
    return {day:days[p.weekday],h:parseInt(p.hour,10)%24,m:parseInt(p.minute,10)};
  }
  function fmt(h,m){var ap=h>=12?"PM":"AM";var hh=h%12;if(hh===0)hh=12;return hh+(m?":"+String(m).padStart(2,"0"):"")+" "+ap;}
  var OPEN_H=10,OPEN_M=45,CLOSE_H=14,CLOSE_M=30;
  function nextOpen(d){
    // returns {label} for the next opening
    var t=OPEN_H*60+OPEN_M, now=d.h*60+d.m;
    if(d.day>=1&&d.day<=6&&now<t) return "Opens today at "+fmt(OPEN_H,OPEN_M);
    var day=d.day;
    do{day=(day+1)%7;}while(day===0);
    var names=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return "Opens "+names[day]+" at "+fmt(OPEN_H,OPEN_M);
  }
  function paint(){
    var word=document.getElementById("status-word"), next=document.getElementById("status-next");
    var chip=document.getElementById("status-chip"), next2=document.getElementById("status-next2");
    if(!word) return;
    var d=bostonNow(), t=d.h*60+d.m;
    var open=d.day>=1&&d.day<=6&&t>=OPEN_H*60+OPEN_M&&t<CLOSE_H*60+CLOSE_M;
    var msg,label;
    if(open){
      var left=(CLOSE_H*60+CLOSE_M)-t;
      label="We're open";
      msg=left<=30?"Counter closes at "+fmt(CLOSE_H,CLOSE_M)+" — come now.":"Trays are out until "+fmt(CLOSE_H,CLOSE_M)+".";
      if(chip){chip.textContent="Open now until "+fmt(CLOSE_H,CLOSE_M);chip.classList.add("is-open");}
    }else{
      label="Closed for today";
      msg="They stop when the trays are empty. Cash only, no exceptions.";
      if(chip){chip.textContent=nextOpen(d);}
      if(next2){next2.textContent=nextOpen(d);}
    }
    word.textContent=label;
    word.classList.toggle("sold",!open);
    next.textContent=msg;
  }
  function reveal(){
    var hero=document.querySelector(".hero"), board=document.querySelector(".board");
    if(hero) hero.classList.add("loaded");
    if(board){
      if("IntersectionObserver" in window){
        board.classList.add("pre");
        var shown=false;
        function show(){if(shown)return;shown=true;board.classList.remove("pre");board.classList.add("up");}
        new IntersectionObserver(function(es,ob){es.forEach(function(e){
          if(e.isIntersecting){show();ob.disconnect();}
        });},{threshold:.2}).observe(board);
        setTimeout(show,1600);
      }else{board.classList.add("up");}
    }
  }
  if(document.readyState!=="loading"){paint();reveal();}
  else document.addEventListener("DOMContentLoaded",function(){paint();reveal();});
  setInterval(paint,30000);
})();
