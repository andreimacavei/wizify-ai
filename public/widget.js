let BASE_URL="https://app.wizify.ai/api/enhance",CLIENT_KEY=extractClientId(document.currentScript.getAttribute("src"))||"";function extractClientId(e){const o=/client_key=([^&]*)/,t=e.match(o);return t?t[1]:null}function emToPixels(e,o){o=o||document.documentElement;var t=getComputedStyle(o).fontSize;t||(t=getComputedStyle(document.documentElement).fontSize);var a=parseFloat(t),n=e*a;return n}function copyStyles(e,o){const t=window.getComputedStyle(e);for(let a=0;a<t.length;a++){const n=t[a];n=="width"&&(o.style[n]=t.getPropertyValue(n))}o.style.width=e.offsetWidth+"px",o.style.height=e.offsetHeight+"px"}function createToolbar(){const e=`<svg fill="#000000" height="16px" width="16px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 367.136 367.136" xml:space="preserve"><path d="M336.554,86.871c-11.975-18.584-27.145-34.707-44.706-47.731L330.801,0H217.436v113.91L270.4,60.691
   c40.142,28.131,65.042,74.724,65.042,124.571c0,83.744-68.131,151.874-151.874,151.874S31.694,269.005,31.694,185.262
   c0-20.479,4.002-40.34,11.895-59.03l-27.637-11.671c-9.461,22.403-14.258,46.19-14.258,70.701
   c0,100.286,81.588,181.874,181.874,181.874s181.874-81.588,181.874-181.874C365.442,150.223,355.453,116.201,336.554,86.871z"/></svg>`,o=`<svg fill="#000000" height="16px" width="16px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 423.642 423.642" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
    <path d="M407.517,123.262l-27.717,11.48c18.585,44.869,18.585,94.29,0,139.159c-18.585,44.869-53.531,79.815-98.4,98.4 c-92.627,38.368-199.194-5.776-237.559-98.4C8.46,188.486,43.246,91.212,121.514,46.501v74.992h30V7.498H37.519v30h43.755 c-73,57.164-102.323,158.139-65.15,247.885c33.754,81.49,112.806,130.768,195.972,130.762c26.96-0.002,54.367-5.184,80.784-16.125 C400.788,355.322,452.213,231.169,407.517,123.262z"></path> 
    </g></svg>`,t=document.createElement("button");t.innerHTML=e,t.className="toolbar-undo-button",t.type="button";const a=document.createElement("button");a.innerHTML=o,a.className="toolbar-redo-button",a.type="button";const n=document.createElement("div");return n.id="undo-redo-toolbar",n.className="undo-redo-toolbar",n.appendChild(t),n.appendChild(a),t.addEventListener("click",function(){previousValue===""||previousValue===focusedInput.value||(nextValue=focusedInput.value,focusedInput.value=previousValue)}),a.addEventListener("click",function(){nextValue===""||nextValue===focusedInput.value||(previousValue=focusedInput.value,focusedInput.value=nextValue)}),n}function loadStyle(){var e=document.createElement("style");e.innerHTML=`
    .micro-ai-button {
        position: absolute;
        right: 3px;
        z-index: 10;
        outline: none;
        border: 1px solid;
        background: rgb(249, 244, 255);
        border-color: rgb(134, 79, 207);
        color: rgb(85, 39, 144);
        border-radius: 0.5rem;
        padding: 1px 6px 0px 6px;
    }
    .micro-ai-button:hover {
        background-color: #f1e7fc;
        border-color: #6f37ba;
    }
    .micro-ai-button svg {
        width: 1em;
        height: 1em;
    }
    .micro-ai-wrapper {
        position: relative;
        display: inline-block;
    }
    .micro-ai-menu {
        display: none;
        position: absolute;
        right: 10px;
        bottom: 40px;
        width: 190px;
        border: 1px solid #ddd;
        border-radius: 0.5em;
        background: #2d2c2d;
        color: #dddddd;
        padding: 3px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 20;
    }
    .micro-ai-submenu {
        display: none;
    }
    .micro-ai-menu-item:hover .micro-ai-submenu {
        position: absolute;
        display: block;
        left: calc(100% - 5px);
        bottom: 40px;
        width: 190px;
        border: 1px solid #ddd;
        border-radius: 0.5em;
        background: #3d3d3d;
        color: #2b2c2c;
        padding: 3px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 20;
        height: fit-content;
        top: 0;
    }
    .micro-ai-menu.show {
        display: flex;
        flex-direction:column;
        align-items: flex-start;
    }
    .micro-ai-menu-item {
        cursor: pointer;
        width: max-content;
        margin: 2px;
        border-radius: 0.5em;
        padding: 0.3em;
        color: #d7d7d7;
        line-height: 1;
        position: relative;
    }
    .micro-ai-menu-item span.icon {
        width: 22px;
        display: inline-block;
    }
    .micro-ai-menu-item span.icon svg {
        fill: #8e5eaa;
        width: 1em;
        height: 1em;
    }
    .micro-ai-menu-item:hover {
        background: gray;
    }
    .micro-ai-menu-item.group::after {
        content: '>';
        width: 1em;
        height: 1em;
        display: inline-block;
        right: 0.5em;
        position: revert;
        font-family: monospace;
    }
    .undo-redo-toolbar {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      
        /* background: var(--toolbar-background); */
        // background: #2d2c2d;
        background: rgb(249, 244, 255);
        border-color: rgb(134, 79, 207);
        color: #dddddd;
        border-radius: 0.25rem;
        color: #fff;
        padding: 0.25rem 0.5rem;
        z-index: 1;
      
        align-items: center;
        display: flex;
        justify-content: center;
      }

    .undo-redo-toolbar:hover {
      background-color: #f1e7fc;
      border-color: #6f37ba;
    }

    .undo-redo-toolbar::after {
        content: '';
        position: absolute;
        border-style: solid;
        height: 0;
        width: 0;
      }
      
    .toolbar-undo-button {
        padding: 0 0.25rem;
        color: #d7d7d7;
    }
    .toolbar-undo-button svg {
        fill: #8e5eaa;
    }
    .toolbar-redo-button {
        padding: 0 0.25rem;
        color: #d7d7d7;
    }
    .toolbar-redo-button svg {
        fill: #8e5eaa;
    }
    `,document.head.appendChild(e)}loadStyle();var previousValue="",nextValue="",focusedInput=null;function setFocusedInput(e){focusedInput!=e&&(previousValue="",nextValue=""),focusedInput=e}function getSelectionRect(){const e=window.getSelection();return e.rangeCount===0?void 0:e.getRangeAt(0).getBoundingClientRect()}window.onload=function(){console.log("window.onload event fired"),document.querySelectorAll('input[type="text"], textarea').forEach(function(o){enhanceInputElement(o),new ResizeObserver(function(){o.parentNode.style.width=o.offsetWidth+"px",o.parentNode.style.height=o.offsetHeight+"px"}).observe(o)})};function hideMenu(e){let o=e.className.split(" ");const t=o.findIndex(a=>a=="show");t>=0&&o.splice(t,1),e.className=o.join(" ")}function enhanceInputElement(e){if(e.parentNode.className.includes("micro-ai-wrapper"))return;let o=3;const t=document.createElement("button");t.innerHTML='<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.18 5.324c.454 0 .85.306.965.746.516 1.976 1.087 3.215 1.957 4.14.873.927 2.142 1.638 4.263 2.353a.997.997 0 0 1 0 1.89c-2.12.715-3.39 1.427-4.263 2.354-.87.925-1.441 2.164-1.957 4.14a.998.998 0 0 1-1.93 0c-.516-1.976-1.087-3.215-1.957-4.14-.873-.927-2.142-1.639-4.263-2.353a.997.997 0 0 1 0-1.891c2.12-.715 3.39-1.426 4.263-2.354.87-.924 1.441-2.163 1.957-4.14a.997.997 0 0 1 .965-.745Zm-4.19 8.184c1.094.535 1.987 1.153 2.72 1.932.607.644 1.08 1.373 1.47 2.205.39-.832.863-1.561 1.47-2.205.733-.78 1.626-1.397 2.72-1.932-1.094-.534-1.987-1.152-2.72-1.931-.607-.644-1.08-1.373-1.47-2.206-.39.833-.863 1.562-1.47 2.205-.733.78-1.626 1.398-2.72 1.932ZM17.587 1.67c.454 0 .85.305.965.744.284 1.082.582 1.695.999 2.136.42.445 1.057.816 2.227 1.209a.998.998 0 0 1 0 1.891c-1.17.393-1.807.764-2.227 1.21-.417.44-.715 1.053-.999 2.135a.997.997 0 0 1-1.93 0c-.283-1.082-.581-1.695-.998-2.136-.42-.445-1.057-.816-2.227-1.209a.997.997 0 0 1 0-1.891c1.17-.393 1.806-.764 2.227-1.209.417-.44.715-1.054.998-2.136a.997.997 0 0 1 .965-.745Zm0 3.601c-.151.23-.32.446-.513.65-.283.298-.6.556-.955.784.355.228.672.485.955.784.192.204.362.42.513.649.152-.23.322-.445.514-.649.282-.299.6-.556.955-.784a5.062 5.062 0 0 1-.955-.785 4.775 4.775 0 0 1-.514-.649ZM18.914 14.694c.451 0 .847.303.963.74.205.763.41 1.154.671 1.425.268.277.692.53 1.544.81a.998.998 0 0 1 0 1.896c-.852.28-1.276.533-1.544.81-.261.27-.466.662-.67 1.426a.998.998 0 0 1-1.928 0c-.204-.764-.41-1.155-.67-1.426-.268-.277-.692-.53-1.545-.81a.998.998 0 0 1 0-1.896c.853-.28 1.277-.533 1.544-.81.262-.27.467-.662.671-1.426a.998.998 0 0 1 .964-.74Zm0 3.327a3.683 3.683 0 0 1-.616.596 3.822 3.822 0 0 1 .616.596 3.68 3.68 0 0 1 .616-.596 3.793 3.793 0 0 1-.616-.596Z" fill="currentColor"></path></svg>',t.className="micro-ai-button",t.type="button",t.style.height=e.offsetHeight-o*2+"px";let a=e.style.marginBottom,n=emToPixels(1.5,t);const s=document.createElement("div");e.tagName=="TEXTAREA"?n<parseFloat(t.style.height)&&(t.style.height="1.5em"):(n>=parseFloat(t.style.height)&&(o=0,e.style.paddingTop=0,e.style.paddingBottom=0,s.style.lineHeight=0),t.style.height=e.offsetHeight-o*2+"px");let f=emToPixels(2,t);(e.style.paddingRight||0<f)&&(e.style.paddingRight=f+"px"),t.style.bottom=o+a+"px",s.className="micro-ai-wrapper",copyStyles(e,s),e.style.width="100%",e.style.height="100%",e.style.boxSizing="border-box",e.parentNode.insertBefore(s,e),s.appendChild(e),s.appendChild(t);const u=document.createElement("div");u.className="micro-ai-menu";const b=createToolbar();s.appendChild(b);const x=[{html:'<span class="icon"><svg class="use-chat-gpt-ai--MuiSvgIcon-root use-chat-gpt-ai--MuiSvgIcon-fontSizeMedium use-chat-gpt-ai-context-menu-e8cpb9" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="TranslateOutlinedIcon"><path d="m12.87 15.07-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7 1.62-4.33L19.12 17h-3.24z"></path></svg></span>Translate',type:"group",children:[{html:"To English",type:"translate",lang:"en"},{html:"To Chinese",type:"translate",lang:"zh"},{html:"To Dutch",type:"translate",lang:"nl"},{html:"To German",type:"translate",lang:"de"}]},{html:'<span class="icon"><svg class="use-chat-gpt-ai--MuiSvgIcon-root use-chat-gpt-ai--MuiSvgIcon-fontSizeMedium use-chat-gpt-ai-context-menu-e8cpb9" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardVoiceOutlinedIcon"><path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm-1.2-9.1c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2l-.01 6.2c0 .66-.53 1.2-1.19 1.2s-1.2-.54-1.2-1.2V5.9zm6.5 6.1c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></svg></span>Change tone',type:"group",children:[{html:"Professional",type:"change_tone",tone:"professional"},{html:"Friendly",type:"change_tone",tone:"friendly"},{html:"Straightforward",type:"change_tone",tone:"straightforward"},{html:"Confident",type:"change_tone",tone:"confident"},{html:"Casual",type:"change_tone",tone:"casual"}]},{html:'<span class="icon"><svg class="use-chat-gpt-ai--MuiSvgIcon-root use-chat-gpt-ai--MuiSvgIcon-fontSizeMedium use-chat-gpt-ai-context-menu-e8cpb9" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ShortTextIcon"><path d="M4 9h16v2H4V9zm0 4h10v2H4v-2z"></path></svg></span>Make shorter',type:"shorter"},{html:'<span class="icon"><svg class="use-chat-gpt-ai--MuiSvgIcon-root use-chat-gpt-ai--MuiSvgIcon-fontSizeMedium use-chat-gpt-ai-context-menu-e8cpb9" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SubjectIcon"><path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"></path></svg></span>Make longer',type:"longer"},{html:'<span class="icon"><svg class="use-chat-gpt-ai--MuiSvgIcon-root use-chat-gpt-ai--MuiSvgIcon-fontSizeMedium use-chat-gpt-ai-context-menu-e8cpb9" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DoneIcon"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg></span>Fix spelling & grammar',type:"spelling"},{html:'<span class="icon"><svg class="use-chat-gpt-ai--MuiSvgIcon-root use-chat-gpt-ai--MuiSvgIcon-fontSizeMedium use-chat-gpt-ai-context-menu-e8cpb9" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AutoFixHighOutlinedIcon"><path d="m20 7 .94-2.06L23 4l-2.06-.94L20 1l-.94 2.06L17 4l2.06.94zM8.5 7l.94-2.06L11.5 4l-2.06-.94L8.5 1l-.94 2.06L5.5 4l2.06.94zM20 12.5l-.94 2.06-2.06.94 2.06.94.94 2.06.94-2.06L23 15.5l-2.06-.94zm-2.29-3.38-2.83-2.83c-.2-.19-.45-.29-.71-.29-.26 0-.51.1-.71.29L2.29 17.46c-.39.39-.39 1.02 0 1.41l2.83 2.83c.2.2.45.3.71.3s.51-.1.71-.29l11.17-11.17c.39-.39.39-1.03 0-1.42zm-3.54-.7 1.41 1.41L14.41 11 13 9.59l1.17-1.17zM5.83 19.59l-1.41-1.41L11.59 11 13 12.41l-7.17 7.18z"></path></svg></span>Check tonality',type:"check_tone"},{html:'<span class="icon"><svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 42.262 42.262" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M41.159,10.363c-1.031-0.57-2.328-0.194-2.898,0.838l-0.688,1.247C35.214,5.231,28.428,0,20.434,0 C10.489,0,2.399,8.09,2.399,18.035c0,1.178,0.953,2.134,2.133,2.134c1.178,0,2.133-0.956,2.133-2.134 c0-7.593,6.178-13.769,13.77-13.769c6.02,0,11.137,3.89,13.003,9.284l-1.166-0.643c-1.028-0.57-2.328-0.195-2.897,0.837 c-0.568,1.032-0.193,2.329,0.838,2.898l4.215,2.326c0.348,0.707,1.068,1.199,1.91,1.199c0.211,0,0.414-0.041,0.606-0.099 c0.011,0,0.021,0.004,0.031,0.004c0.754,0,1.482-0.397,1.871-1.103l3.15-5.71C42.564,12.229,42.191,10.932,41.159,10.363z"></path> <path d="M37.732,22.091c-1.18,0-2.135,0.955-2.135,2.133c0,7.593-6.176,13.771-13.768,13.771c-6.021,0-11.139-3.892-13.006-9.284 l1.166,0.643c0.326,0.181,0.68,0.267,1.029,0.267c0.752,0,1.48-0.397,1.869-1.104c0.568-1.03,0.195-2.328-0.838-2.897 l-4.215-2.326c-0.348-0.707-1.066-1.198-1.908-1.198c-0.219,0-0.426,0.042-0.623,0.103c-0.758-0.006-1.496,0.385-1.887,1.096 L0.265,29c-0.568,1.031-0.193,2.328,0.838,2.898c0.326,0.18,0.68,0.266,1.029,0.266c0.752,0,1.48-0.397,1.869-1.104l0.689-1.246 c2.357,7.215,9.145,12.447,17.139,12.447c9.942,0,18.035-8.09,18.035-18.036C39.866,23.046,38.911,22.091,37.732,22.091z"></path> </g> </g> </g></svg></span>Actions',type:"group",children:[{html:"Undo",type:"undo"},{html:"Redo",type:"redo"}]}];function v(d,m){m.forEach(function(c){const p=document.createElement("div");if(p.innerHTML=c.html,p.className="micro-ai-menu-item",c.type=="group"&&(p.className+=" group"),p.addEventListener("click",async function(){hideMenu(u);const r=e.value;if(!r)return alert("Please enter some text to enhance");const w=c.lang,y=c.tone;let l;switch(c.type){case"translate":l=`${BASE_URL}?action=translate&lang=${w}&content=${encodeURIComponent(r)}`;break;case"change_tone":l=`${BASE_URL}?action=change_tone&tone=${y}&content=${encodeURIComponent(r)}`;break;case"shorter":l=`${BASE_URL}?action=make_shorter&content=${encodeURIComponent(r)}`;break;case"longer":l=`${BASE_URL}?action=make_longer&content=${encodeURIComponent(r)}`;break;case"spelling":l=`${BASE_URL}?action=fix_spelling&content=${encodeURIComponent(r)}`;break;case"check_tone":l=`${BASE_URL}?action=check_tone&content=${encodeURIComponent(r)}`;break;case"undo":if(setFocusedInput(e),previousValue===""||previousValue===e.value)return;nextValue=e.value,e.value=previousValue,e.focus(),e.select();break;case"redo":if(setFocusedInput(e),nextValue===""||nextValue===e.value)return;previousValue=e.value,e.value=nextValue,e.focus(),e.select();break;default:break}if(l)try{l+="&userkey="+encodeURIComponent(CLIENT_KEY);const i=await fetch(l);if(i.status===400||i.status===401||i.status===403||i.status===404||i.status===429){let h;try{h=await i.json()}catch(k){alert("An error occurred",k);return}alert(h.error),console.error("Error: ",h.error);return}const g=await i.text();if(i.ok)if(c.type=="check_tone")switch(g.toLowerCase()){case"aggressive":alert("Detected aggressive tone. You can change it to a more neutral tone.");break;case"threatening":alert("Detected threatening tone. You should change it to a more friendly tone.");break;case"unprofessional":alert("Detected unprofessional tone. You should change it to a more professional tone.");break;case"ironic":alert("Detected ironic or sarcastic tone. Are you sure you want to send it as it is?");break;default:alert("Detected tone: "+g.toLowerCase())}else{setFocusedInput(e),previousValue=e.value,e.value=g;let h;e.tagName=="TEXTAREA"?h=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,"value").set:h=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set,h.call(e,g),e.dispatchEvent(new Event("input",{bubbles:!0})),e.dispatchEvent(new Event("change",{bubbles:!0})),e.focus(),e.select()}else console.error("Error fethcing data: ",g)}catch(i){console.error("Network error: ",i)}}),d.appendChild(p),c.type=="group"){const r=document.createElement("div");r.className="micro-ai-submenu",p.appendChild(r),v(r,c.children)}})}v(u,x),s.appendChild(u),t.addEventListener("click",function(){let d=u.className.split(" ");const m=d.findIndex(c=>c=="show");m>=0?d.splice(m,1):d.push("show"),u.className=d.join(" ")}),document.addEventListener("click",function(d){s.contains(d.target)||hideMenu(u)})}
