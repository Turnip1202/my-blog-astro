import{o as B,I as l,i as M}from"./Icon.CpxeL1d4.js";import{d as F,p as J,t as k,e as A,a as N,b as Q,c as V,s as X,f as D,g as P,h as s,i as a,j as o,r as n,k as L}from"./render.DXsOrPE0.js";import{t as r}from"./class.Bvena8yX.js";import{L as y,D as x,A as u,g as Y,s as Z,a as ee}from"./setting-utils.De4sCiaH.js";import{I as S}from"./zh_TW.IltuBUYr.js";var te=(a,e)=>e(y),ae=(a,e)=>e(x),ne=(a,e)=>e(u),se=V('<div class="relative z-50" role="menu" tabindex="-1"><button aria-label="Light/Dark Mode" role="menuitem" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="scheme-switch"><div class="absolute"><!></div> <div class="absolute"><!></div> <div class="absolute"><!></div></button> <div id="light-dark-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5"><div class="card-base float-panel p-2"><button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"><!> </button> <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"><!> </button> <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"><!> </button></div></div></div>');function me(e,t){J(t,!0);const i=[y,x,u];let c=X(D(u));function d(a){P(c,D(a)),Z(a)}B((()=>{P(c,D(Y()));const a=window.matchMedia("(prefers-color-scheme: dark)"),e=a=>{ee(s(c))};return a.addEventListener("change",e),()=>{a.removeEventListener("change",e)}}));var m=se(),v=a(m);v.__click=function(){let a=0;for(;a<i.length&&i[a]!==s(c);(a+=1)-1);d(i[(a+1)%i.length])};var p=a(v),b=a(p);l(b,{icon:"material-symbols:wb-sunny-outline-rounded",class:"text-[1.25rem]"}),n(p);var f=o(p,2),h=a(f);l(h,{icon:"material-symbols:dark-mode-outline-rounded",class:"text-[1.25rem]"}),n(f);var g=o(f,2),w=a(g);l(w,{icon:"material-symbols:radio-button-partial-outline",class:"text-[1.25rem]"}),n(g),n(v);var j=o(v,2),_=a(j),I=a(_);I.__click=[te,d];var E=a(I);l(E,{icon:"material-symbols:wb-sunny-outline-rounded",class:"text-[1.25rem] mr-3"});var $=o(E);k((()=>L($,` ${M(S.lightMode)??""}`))),n(I);var q=o(I,2);q.__click=[ae,d];var z=a(q);l(z,{icon:"material-symbols:dark-mode-outline-rounded",class:"text-[1.25rem] mr-3"});var C=o(z);k((()=>L(C,` ${M(S.darkMode)??""}`))),n(q);var F=o(q,2);F.__click=[ne,d];var V=a(F);l(V,{icon:"material-symbols:radio-button-partial-outline",class:"text-[1.25rem] mr-3"});var H=o(V);k((()=>L(H,` ${M(S.systemMode)??""}`))),n(F),n(_),n(j),n(m),k((()=>{r(p,"opacity-0",s(c)!==y),r(f,"opacity-0",s(c)!==x),r(g,"opacity-0",s(c)!==u),r(I,"current-theme-btn",s(c)===y),r(q,"current-theme-btn",s(c)===x),r(F,"current-theme-btn",s(c)===u)})),A("mouseleave",m,(function(){document.querySelector("#light-dark-panel").classList.add("float-panel-closed")})),A("mouseenter",v,(function(){document.querySelector("#light-dark-panel").classList.remove("float-panel-closed")})),N(e,m),Q()}F(["click"]);export{me as default};