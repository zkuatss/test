// ==UserScript==
// @name        Vape
// @description Hack
// @namespace   none
// @match       https://bloxd.io/
// @version     4
// @grant       none
// @license MIT
// @icon        https://www.vape.gg/img/vape_hero_sword_illustration_final%201.png
// @author      GamingBloxdProYT
// @downloadURL https://update.greasyfork.org/scripts/546141/Vape.user.js
// @updateURL https://update.greasyfork.org/scripts/546141/Vape.meta.js
// ==/UserScript==
//__START__SETTINGS______________________________________________
const defaultColor = "#ac72db" //-------------------ACCENT COLOR
const defaultBackGroundColor = "#000000" //---------Bacground color
const ICON_URL = "https://www.vape.gg/img/vape_hero_sword_illustration_final%201.png"
const defaultBackGroundTransparency = 1 //--------Background transparency
const defaultBackGroundBlur = 1 //------------------Background blur
let   openKey = "Backquote"; //--------------------DEFAULT OPEN CLOSE KEYBIND 💗
const TITLE = "Vape V4" //-----------------------Title
const defaultGradient = `linear-gradient(to right, ${defaultColor}, #E7C586, #FFF7A4)`;
//--------------------------------------------------Three color gradient
// ... [rest of the file unchanged, except for the GUI resizer and keybind toggle code below] ...

// --- Add GUI Resizer ---
const style = document.createElement("style");
style.textContent += `
#rndAsciiResizeHandle {
  position: absolute;
  right: 0; bottom: 0;
  width: 22px; height: 22px;
  cursor: nwse-resize;
  z-index: 20;
  background: linear-gradient(135deg, #ac72db 0%, #FFF7A4 100%);
  border-radius: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
#rndAsciiResizeHandle:after {
  content: "";
  display: block;
  width: 13px; height: 13px;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
  border-radius: 0 0 5px 0;
  opacity: 0.7;
  margin-right: 2px;
  margin-bottom: 2px;
}`;
document.head.appendChild(style);
const gui = document.getElementById("rndAsciiGUI");
const resizeHandle = document.createElement("div");
resizeHandle.id = "rndAsciiResizeHandle";
gui.appendChild(resizeHandle);
let resizing = false, startX, startY, startWidth, startHeight;
resizeHandle.addEventListener('mousedown', function(e) {
  resizing = true;
  gui.classList.add('resizing');
  startX = e.clientX;
  startY = e.clientY;
  startWidth = gui.offsetWidth;
  startHeight = gui.offsetHeight;
  document.body.style.userSelect = "none";
});
window.addEventListener('mousemove', function(e) {
  if (!resizing) return;
  let newWidth = Math.max(370, Math.min(window.innerWidth * 0.95, startWidth + (e.clientX - startX)));
  let newHeight = Math.max(350, Math.min(window.innerHeight * 0.85, startHeight + (e.clientY - startY)));
  gui.style.width = newWidth + "px";
  gui.style.height = newHeight + "px";
});
window.addEventListener('mouseup', function(e) {
  if (resizing) {
    resizing = false;
    gui.classList.remove('resizing');
    document.body.style.userSelect = "";
  }
});

// --- Keybind for GUI toggle (` or ~) ---
document.addEventListener("keydown", (e) => {
  if (e.code === openKey) {
    if (isGuiVisible) {
      gui.style.display = "none";
      isGuiVisible = false;
      showMinimizedIcon();
    } else {
      gui.style.display = "block";
      isGuiVisible = true;
      if (minimizedIcon) minimizedIcon.remove();
    }
    updateArrayList();
  }
});

// --- Injection Fix ---
function tryInjection() {
  try {
    findNoaAndKey();
    if (shideFuxny.NIGHT && shideFuxny.entities && shideFuxny.Lion && shideFuxny.camera) {
      injectedBool = true;
      injectButton.textContent = "Injected!";
      applyTheme();
      showTemporaryNotification("Injection successful!", 2200);
    } else {
      injectedBool = false;
      injectButton.textContent = "Injection failed";
      showTemporaryNotification("Injection failed: Could not find game objects.", 3000);
    }
  } catch (err) {
    injectedBool = false;
    injectButton.textContent = "Error";
    showTemporaryNotification("Injection error: See console", 3000);
    console.error("Error running findNoaAndKey:", err);
  }
}
function ensureInjected() {
  if (!injectedBool) {
    showTemporaryNotification("Trying to re-inject...");
    tryInjection();
  }
}
function featureGuard() {
  if (!injectedBool) {
    ensureInjected();
    if (!injectedBool) {
      showTemporaryNotification('You need to inject first habibi!');
      return false;
    }
  }
  return true;
}
// ... [rest of the file unchanged] ...
