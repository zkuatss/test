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
let   openKey = "r"; //--------------------DEFAULT OPEN CLOSE KEYBIND 💗
const TITLE = "Vape V4" //-----------------------Title
const defaultGradient = `linear-gradient(to right, ${defaultColor}, #E7C586, #FFF7A4)`;
//--------------------------------------------------Three color gradient
let passiveFeaturesEnabled = true; //---------------Enable passive features?
const changeHealthBar = true // --------------------Change health bar color to gradient color
const spoofRanksEnabled = true; // -----------------Gives you all ranks (YT, Super, Developer)
const ATTACK_INTERVAL_MS = 20; // -------------------How fast to hit players with triggerbot/killAura    LOW = BAN
let desiredPotionSlot = 1 //------------------------What slot should potions go to? Numbers start at zero! 0-9
let spikeSlot = 8 //--------------------------------What slot do spikes automatically go in? 0-9
let webSlot = 9 //----------------------------------What slot do webs / nets automatically go in? 0-9
const STORAGE_KEY = "customKeybinds_v1";
// NoLag settings
let noLagEnabled = false;
const NO_LAG_RENDER_DISTANCE = 50; // Reduced render distance
const NO_LAG_PARTICLE_LIMIT = 10; // Limit particle effects
const NO_LAG_FPS_TARGET = 60; // Target FPS
// AntiBan settings
let antiBanEnabled = false;
const ANTI_BAN_ATTACK_DELAY_MIN = 100; // Minimum delay between attacks in ms
const ANTI_BAN_ATTACK_DELAY_MAX = 300; // Maximum delay between attacks in ms
const ANTI_BAN_ROTATION_SMOOTHNESS = 0.1; // How smooth rotations should be (lower = smoother)
const ANTI_BAN_MAX_ATTACKS_PER_SECOND = 5; // Maximum attacks per second
// Melon Hub Aimbot settings
let aimbotAutoTrigger = false; // Auto trigger when aiming at target
// Variables to store original settings for NoLag
let originalSettings = {
    cameraMaxZ: null,
    cameraMinZ: null,
    hardwareScalingLevel: null,
    particleCapacity: [],
    shadowSettings: [],
    textureModes: []
};
// Default keybinds with actions
let defaultKeybindActions = [
    { name: "Spawn teleport", type: "mouse", code: 4, action: clickTeleportButton },
    { name: "SpikeWeb a player", type: "keyboard", code: "KeyF", action: autoSW },
    { name: "PickupReach", type: "keyboard", code: null, action: togglePickupReach },
    { name: "KillAura", type: "keyboard", code: null, action: toggleKillAura },
    { name: "Blink", type: "keyboard", code: null, action: toggleBlinkWrapper },
    { name: "Scaffold", type: "keyboard", code: null, action: toggleScaffold },
    { name: "HitBoxes", type: "keyboard", code: null, action: toggleHitBoxes },
    { name: "Wireframe", type: "keyboard", code: null, action: toggleWireframe },
    { name: "ESP", type: "keyboard", code: null, action: toggleESP },
    { name: "BHOP", type: "keyboard", code: null, action: toggleBHOP },
    { name: "ChestESP", type: "keyboard", code: null, action: toggleChestESP },
    { name: "OreESP", type: "keyboard", code: null, action: toggleOreESP },
    { name: "triggerBot", type: "keyboard", code: null, action: toggleTriggerBot },
    { name: "NameTags", type: "keyboard", code: null, action: toggleNameTags },
    { name: "Skybox", type: "keyboard", code: null, action: toggleSkybox },
    { name: "WallJump", type: "keyboard", code: null, action: toggleWallJumpScript },
    { name: "WaterJump", type: "keyboard", code: null, action: toggleLockPlayerWaterState },
    { name: "Aimbot", type: "keyboard", code: null, action: toggleAimbot },
    { name: "No Lag", type: "keyboard", code: null, action: toggleNoLag },
    { name: "AntiBan", type: "keyboard", code: null, action: toggleAntiBan },
    { name: "Auto Sprint", type: "keyboard", code: null, action: toggleAutoSprint },
    { name: "Auto Break", type: "keyboard", code: null, action: toggleAutoBreak },
    { name: "Auto Place", type: "keyboard", code: null, action: toggleAutoPlace },
    { name: "Auto Clicker", type: "keyboard", code: null, action: toggleAutoClicker },
    { name: "Crouch Speed", type: "keyboard", code: null, action: toggleCrouchSpeed },
    { name: "Speed 2x", type: "keyboard", code: null, action: toggleSpeed },
    { name: "Reach", type: "keyboard", code: null, action: toggleReach },
];
// Load from localStorage
const storedKeybinds = localStorage.getItem(STORAGE_KEY);
if (storedKeybinds) {
    try {
        const parsed = JSON.parse(storedKeybinds);
        // Inject saved key codes into default actions
        defaultKeybindActions = defaultKeybindActions.map((bind) => {
            const saved = parsed.find((s) => s.name === bind.name);
            return saved ? { ...bind, code: saved.code } : bind;
        });
    } catch (e) {
        console.warn("Failed to parse saved keybinds:", e);
    }
}
// Your working keybinds
const keybindActions = defaultKeybindActions;
//__END__SETTINGS______________________________________________

// Add auto sprint variables
let autoSprintEnabled = false;
let autoSprintInterval = null;

// Add auto break, auto place, and auto clicker variables
let autoBreakEnabled = false;
let autoBreakInterval = null;
let autoPlaceEnabled = false;
let autoPlaceInterval = null;
let autoClickerEnabled = false;
let autoClickerInterval = null;

// Add crouch speed variables
let crouchSpeedEnabled = false;

// Add speed variables
let speedEnabled = false;
let originalSpeedDescriptor = null;

// Add reach variables
let reachEnabled = false;
let originalReachDistance = null;

// Credits to wang for the blinksState
// Thanks for helping me with a lot of stuff.
// (It is broken because of me not him)
let version = "0.3.8"
let alreadyConnected = null;
let colyRoom = null;
let sendBytesName = null;
let injectedBool = false;
let myId = 1
let isInitializing = true;
let clientOptions = null;
let shideFuxny = {};
let noaParent = null;
let noaKeyInParent = null;
let usingAltInjection = false;
let blinkState = {
    enabled: false,
    originalSendBytes: null,
    queued: [],
    interval: 0,
    noPacket: false
};
let wallJumpInterval = null;
let wallJumpRunning = false;
let lockPlayerWaterStateInterval = null;
let waterJumpingEnabled = false
let wireFramesBool = false;
let espEnabled = false;
let isSkyboxHidden = false;
let triggerBotEnabled = false;
let toggleTriggerBotInterval = null;
const possibleNames = [
    //"LegLeftMesh",
    //"LegRightMesh",
    //"TorsoNode",
    //"ArmLeftMesh",
    //"ArmRightMesh",
    "BodyMesh",
    'Body|Armour',
    //"HeadMesh"
]; // Potential detection: If the player has leg armour there is no way leftLegMesh could have been hit.
let killAuraEnabled = false
let killAuraIntervalId = null
let lastClosestId = null
let newBox = null;
let newBoxId = null;
let __nullKey = null; //Entity enabled key
let __stringKey = null; //Entity ID key "Then why didn't you just label them that?"
let animationFrameId = null;
let hitBoxEnabled = false;
const hitboxes = {};
let cachedNameTagParent = null;
let cachedBHOPParent = null;
let autoPotionEnabled = false;
let autoPotionInterval = null;
let nameTagsEnabled = false;
let nameTagsIntervalId = null;
let nameTagParent = null;
let bhopEnabled = false;
let bhopIntervalId = null;
let  scaffoldEnabled = false;
let scaffoldIntervalId = null;
let enemyHealthGuiEnabled = false;
let healthWatcherInterval = null;
let lastPercent = null;
let lastChangeTime = Date.now();
let resetTimeout = null;
let eIdKey = null;
let targetEntity = null;
let targetEntityDistance = null;
let pickupReachEnabled = false; //Credits to wang!!!!
let originalGetEntitiesInAABB = null;
const RANGE_MULTIPLIER = 5;
let ghMethodKey = null;
let proto = null;
let bhopKnifeEnabled = false;
let spaceVid;
let fadeVolumeInterval;
let spaceHeld = false;
let bigHeadsEnabled = false;
// Aimbot variables
let aimbotEnabled = false;
let aimbotIntervalId = null;
let aimbotSmoothness = 0.15; // Lower values = smoother but slower aiming
let aimbotFOV = 90; // Field of view in degrees
let aimbotDistance = 20; // Maximum distance to target players
let aimbotVisibleOnly = true; // Only target visible players
const scannedChunks = new Set();
let chunkDataField = null;
// ETC
let playerKey = null;
let moveState = null;
let physState = null;
let humanoidMeshlist = null;
let slowHitEnabled = null;
let everEnabled = {}
// AntiBan variables
let lastAttackTime = 0;
let attacksInLastSecond = 0;
let attackTimes = [];

////////////////////////////////////////////////////////////////////////////////////////Main Functions
var r = { //WANG
    keys(e) {
        var t = [],
            o = 0;
        for (var s in e) e != null && (t[o] = s, o++);
        return t
    },
    values(e) {
        for (var t = this.keys(e), o = [], s = 0, i = 0; s < t.length;) {
            var l = t[s],
                d = e[l];
            o[i] = d, i++, s++
        }
        return o
    },
    assign(e, ...t) {
        let o = Object(e);
        for (let s = 0; s < t.length; s++) {
            let i = t[s];
            if (i != null)
                for (let l in i) o[l] = i[l]
        }
        return o
    }
};

function fadeVolume(from, to, duration) {
  const steps = 30;
  const stepTime = duration / steps;
  let current = 0;
  if (fadeVolumeInterval) clearInterval(fadeVolumeInterval);
  fadeVolumeInterval = setInterval(() => {
    current++;
    const progress = current / steps;
    spaceVid.volume = from + (to - from) * progress;
    if (current >= steps) {
      clearInterval(fadeVolumeInterval);
      fadeVolumeInterval = null;
    }
  }, stepTime * 1000);
}

function onKeyDown(e) {
  if (e.code === 'Space' && !spaceHeld) {
    spaceHeld = true;
    spaceVid.style.opacity = '1';
    spaceVid.play();
    fadeVolume(spaceVid.volume, 0.1, 2.5); // fade in to 0.8 over 2 seconds
  }
}

function onKeyUp(e) {
  if (e.code === 'Space') {
    spaceHeld = false;
    spaceVid.style.opacity = '0';
    fadeVolume(spaceVid.volume, 0.1, 2.5); //
    setTimeout(() => {
      if (!spaceHeld) spaceVid.pause();
    }, 500);
  }
}

function toggleBhopKnife() {
        if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
  if (!bhopKnifeEnabled) {
        everEnabled.bhopKnifeEnabled = true;
    bhopKnifeEnabled = true;
    spaceVid = document.createElement('video');
    spaceVid.src = 'https://files.catbox.moe/6tm4e7.webm';
    spaceVid.preload = 'auto';
    spaceVid.loop = true;
    spaceVid.muted = false;
    spaceVid.volume = 0;
    spaceVid.playbackRate = 1;
    spaceVid.playsInline = true;
    Object.assign(spaceVid.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      transform: 'translate(-50%, -50%) scaleX(1.4)', // Stretch only width
      zIndex: 21,
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 2.5s ease',
    });
    document.body.appendChild(spaceVid);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  } else {
    // Disable
    bhopKnifeEnabled = false;
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    if (spaceVid) {
      spaceVid.pause();
      if (spaceVid.parentNode) spaceVid.parentNode.removeChild(spaceVid);
      spaceVid = null;
    }
    spaceHeld = false;
    if (fadeVolumeInterval) clearInterval(fadeVolumeInterval);
  }
  updateKnifeButton();
}

function toggleSlowHit() {
    slowHitEnabled = !slowHitEnabled; // Toggle the boolean
    playerEntity.heldItemState.swingDuration = slowHitEnabled ? 1500 : 200;
    updateSlowHit(); // Call your update function
}

function matchesAllPatterns(fn) {
    const patterns = ["this.names.position", ".base[0]"].map(p => p.replace(/\s+/g, ''));
    try {
        const src = fn.toString().replace(/\s+/g, '');
        return patterns.every(p => src.includes(p));
    } catch {
        return false;
    }
}

function findClassConstructor(obj) {
    let current = obj;
    while (current) {
        for (const key of Reflect.ownKeys(current)) {
            let val;
            try {
                const desc = Object.getOwnPropertyDescriptor(current, key);
                val = desc?.value ?? current[key];
            } catch {
                continue;
            }
            if (typeof val === "function" && matchesAllPatterns(val)) {
                return val;
            }
        }
        current = Object.getPrototypeOf(current);
    }
    return null;
}

function findGhMethod(clsConstructor) {
    const protoLocal = clsConstructor?.prototype;
    if (!protoLocal) return null;
    for (const key of Reflect.ownKeys(protoLocal)) {
        if (key === "constructor") continue;
        const fn = protoLocal[key];
        if (typeof fn === "function" && matchesAllPatterns(fn)) {
            return {
                fn,
                key
            };
        }
    }
    return null;
}

function toggleScaffold() {
    scaffoldEnabled = !scaffoldEnabled;
    everEnabled.scaffoldEnabled = true;
    if (scaffoldEnabled) {
        scaffoldIntervalId = setInterval(() => {
            const pos = shideFuxny.entities.getState(1, 'position').position;
            if (!pos || playerEntity.heldItemState.heldType !== "CubeBlock") return;
            const exactX = pos[0];
            const exactZ = pos[2];
            const blockX = Math.floor(exactX);
            const blockY = Math.floor(pos[1]);
            const blockZ = Math.floor(exactZ);
            const checkPlace = (x, y, z) => {
                return (
                    playerEntity.checkTargetedBlockCanBePlacedOver([x, y, z]) ||
                    r.values(shideFuxny.world)[47].call(shideFuxny.world, x, y, z) === 0
                );
            };
            // Step 1: try block directly below
            if (checkPlace(blockX, blockY - 1, blockZ)) {
                wangPlace([blockX, blockY - 1, blockZ]);
                return;
            }
            // Step 2: check lean direction (just 4 directions)
            const dx = exactX - blockX;
            const dz = exactZ - blockZ;
            const offsets = [];
            if (dx < 0.3) offsets.push([-1, 0]); // leaning west
            if (dx > 0.7) offsets.push([1, 0]);  // leaning east
            if (dz < 0.3) offsets.push([0, -1]); // leaning north
            if (dz > 0.7) offsets.push([0, 1]);  // leaning south
            for (const [ox, oz] of offsets) {
                const nx = blockX + ox;
                const nz = blockZ + oz;
                if (checkPlace(nx, blockY - 1, nz)) {
                    wangPlace([nx, blockY - 1, nz]);
                    return;
                }
            }
        }, 50);
    } else {
        clearInterval(scaffoldIntervalId);
        scaffoldIntervalId = null;
    }
    updateScaffoldButton();
}

function togglePickupReach() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    if (!proto || !originalGetEntitiesInAABB) {
        const cls = findClassConstructor(shideFuxny.NIGHT.entities);
        if (!cls) {
            console.warn("[pickupReach] Could not find class constructor");
            return;
        }
        const ghMethod = findGhMethod(cls);
        if (!ghMethod) {
            console.warn("[pickupReach] Could not find getEntitiesInAABB method");
            return;
        }
        proto = cls.prototype;
        originalGetEntitiesInAABB = ghMethod.fn;
        ghMethodKey = ghMethod.key;
    }
    if (pickupReachEnabled) {
        // Disable patch
        proto[ghMethodKey] = originalGetEntitiesInAABB;
        pickupReachEnabled = false;
        console.log("[pickupReach] Patch disabled");
    } else {
        everEnabled.pickupReachEnabled = true;
        // Enable patch
        proto[ghMethodKey] = function(box, name) {
            const center = [
                (box.base[0] + box.max[0]) / 2,
                (box.base[1] + box.max[1]) / 2,
                (box.base[2] + box.max[2]) / 2,
            ];
            const halfSize = [
                (box.max[0] - box.base[0]) / 2,
                (box.max[1] - box.base[1]) / 2,
                (box.max[2] - box.base[2]) / 2,
            ];
            const enlarged = {
                base: center.map((c, i) => c - halfSize[i] * RANGE_MULTIPLIER),
                max: center.map((c, i) => c + halfSize[i] * RANGE_MULTIPLIER)
            };
            return originalGetEntitiesInAABB.call(this, enlarged, name);
        };
        pickupReachEnabled = true;
        console.log("[pickupReach] Patch enabled");
    }
    updatePickupReachButton()
}

function passiveFeatures() {
if (passiveFeaturesEnabled) {
        everEnabled.passiveFeaturesEnabled = true;
        if (changeHealthBar) {
        (function() { // FROM ENTITY
            'use strict';
            const healthBar = document.getElementsByClassName("BottomScreenStatBar")[0];
            if (healthBar) {
                // Clear all conflicting styles
                healthBar.style.background = defaultGradient;
                healthBar.style.backgroundColor = 'transparent';
                healthBar.style.boxShadow = 'none';
                healthBar.style.border = 'none';
                healthBar.style.backgroundRepeat = 'no-repeat';
                healthBar.style.backgroundSize = '100% 100%';
                healthBar.style.outline = 'none';
                // Also fix child elements (some bars use internal fill divs)
                for (const child of healthBar.children) {
                    child.style.background = 'transparent';
                    child.style.backgroundColor = 'transparent';
                    child.style.boxShadow = 'none';
                    child.style.border = 'none';
                }
                // Force override with CSS injection if still persists
                const style = document.createElement('style');
                style.textContent = `
            .BottomScreenStatBar {
                background: ${defaultGradient} !important;
                background-size: 100% 100% !important;
                background-repeat: no-repeat !important;
                box-shadow: none !important;
                border: none !important;
            }
            .BottomScreenStatBar * {
                background: transparent !important;
                background-color: transparent !important;
                box-shadow: none !important;
                border: none !important;
            }
        `;
                document.head.appendChild(style);
                console.log("✅ Applied clean default gradient to health bar");
            } else {
                console.warn("❌ Could not find health bar element");
            }
        })();
    }
    ////////Anti-cobweb
    Object.defineProperty(shideFuxny.entities[shideFuxny.impKey].moveState.list[0].speedMultiplier.multipliers, "inCobweb", {
        configurable: true,
        enumerable: true,
        get() {
            return 1; // always return 1
        },
        set(value) {
            // ignore all attempts to change it
        }
    });
    if (spoofRanksEnabled) {
        shideFuxny.entityList[1][1].ranks[0] = "developer";
        shideFuxny.entityList[1][1].ranks[1] = "youtuber";
        shideFuxny.entityList[1][1].ranks[2] = "super";
    } else {
    }
}
}

// AntiBan safe attack function
function safeAttack() {
    const now = Date.now();
    // Clean up old attack times (older than 1 second)
    attackTimes = attackTimes.filter(time => now - time < 1000);
    // Check if we've exceeded the maximum attacks per second
    if (attackTimes.length >= ANTI_BAN_MAX_ATTACKS_PER_SECOND) {
        return false; // Don't attack if we've exceeded the limit
    }
    // Check if enough time has passed since the last attack
    if (now - lastAttackTime < ANTI_BAN_ATTACK_DELAY_MIN) {
        return false; // Don't attack if not enough time has passed
    }
    // If we're here, it's safe to attack
    lastAttackTime = now;
    attackTimes.push(now);
    return true;
}

function emitSafePrimaryFire() {
    // Check if AntiBan is enabled and if it's safe to attack
    if (antiBanEnabled && !safeAttack()) {
        return; // Don't attack if AntiBan says it's not safe
    }
    const fakeEvent = {
      timeStamp: performance.now(),
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0, // left click
      buttons: 1, // left button pressed
      clientX: innerWidth / 2 + Math.floor(Math.random() * 4 - 2),
      clientY: innerHeight / 2 + Math.floor(Math.random() * 4 - 2),
      screenX: screen.width / 2,
      screenY: screen.height / 2
    };
    shideFuxny.NIGHT.inputs.down.emit("primary-fire", fakeEvent);
}

function inMenu() {
    const requests = shideFuxny.Props.pointerLockWrapper.pointerUnlockRequests;
    return requests.includes("SettingsMenuComponent") || requests.includes("InGameMenu");
}

function movePotionToSlot() {
    if (!playerInventoryParent || !playerInventoryParent.playerInventory?.items) {
        console.warn("❌ playerInventoryParent is not set. Run findAndSavePlayerInventoryParent() first.");
        return false;
    }
    const items = playerInventoryParent.playerInventory.items;
    let potionSlot = null;
    for (let i = desiredPotionSlot; i < items.length; i++) {
        const item = items[i];
        if (!item || typeof item.name !== 'string') continue;
        const name = item.name.toLowerCase();
        if (
            name.includes("potion") &&
            name.includes("splash") &&
            (name.includes("healing") || name.includes("shield"))
        ) {
            potionSlot = i;
            break;
        }
    }
    if (potionSlot === null) {
        return false;
    }
    console.log(`🔁 Swapping potion from slot ${potionSlot} with slot ${desiredPotionSlot}`);
    playerInventoryParent.swapPosClient(potionSlot, desiredPotionSlot, null);
    return true;
}

function makeHitboxes() {
    if (!injectedBool) {
        console.log("NOT INJECTED NO TARGET");
        return;
    }
    const rendering = r.values(shideFuxny.rendering)[18];
    const objectData = rendering?.objectData;
    if (!objectData || !eIdKey) return;
    const activeEIds = new Set();
    // First, build a set of currently valid entity IDs
    for (const key in objectData) {
        if (key === "1") continue;
        const obj = objectData[key];
        const eId = obj[eIdKey];
        if (
            eId == null ||
            eId === myId ||
            obj.pickable === false ||
            obj.type !== "Player" ||
            !shideFuxny.entities.getState(eId, "genericLifeformState")
        ) continue;
        activeEIds.add(eId);
        // If hitbox already exists, skip
        if (hitboxes[eId]) continue;
        // Create the hitbox
        let newBox_00 = shideFuxny.Lion.Mesh.CreateBox("mesh", 1, false, 1, shideFuxny.Lion.scene);
        newBox_00.renderingGroupId = 2;
        newBox_00.material = new shideFuxny.Lion.StandardMaterial("mat", shideFuxny.Lion.scene);
        newBox_00.material.diffuseColor = new shideFuxny.Lion.Color3(1, 1, 1);
        newBox_00.material.emissiveColor = new shideFuxny.Lion.Color3(1, 1, 1);
        newBox_00.name = '_';
        newBox_00.id = '__' + eId;
        let defaultPosition = new newBox_00.position.constructor(0, 0.32, 0);
        newBox_00.position = defaultPosition.clone();
        newBox_00._scaling._y = 2.2;
        newBox_00.material.alpha = 0.5;
        newBox_00.isVisible = hitBoxEnabled;
        rendering.attachTransformNode(newBox_00, key, 13);
        r.values(shideFuxny.rendering)[27].call(shideFuxny.rendering, newBox_00);
        Object.defineProperty(newBox_00._nodeDataStorage, '_isEnabled', {
            get: () => true,
            set: (v) => {},
            configurable: false
        });
        hitboxes[eId] = newBox_00;
    }
    // Cleanup hitboxes of players no longer present
    for (const eId in hitboxes) {
        if (!activeEIds.has(eId)) {
            hitboxes[eId]?.dispose();
            delete hitboxes[eId];
        }
    }
    // Visibility toggle based on node[0].enabled and hitBoxEnabled
    for (const key in objectData) {
        const obj = objectData[key];
        const eId = obj?.[eIdKey];
        if (!eId || !hitboxes[eId]) continue;
        const baseNode = obj.nodes?.[0];
        if (!baseNode) continue;
        hitboxes[eId].isVisible = baseNode.enabled && hitBoxEnabled;
    }
}

(() => {
    // Remove if already present
    const old = document.getElementById("vertical-health-bar");
    if (old) old.remove();
    // Create bar container
    const container = document.createElement("div");
    container.id = "vertical-health-bar";
    Object.assign(container.style, {
        position: "fixed",
        left: "calc(50% - 200px)", // 100px left of center
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "200px",
        background: "#000",
        border: "2px solid black",
        zIndex: 120,
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden"
    });
    // Create fill element
    const fill = document.createElement("div");
    Object.assign(fill.style, {
        width: "100%",
        height: "100%",
        background: "limegreen",
        transform: "scaleY(1)",
        transformOrigin: "bottom",
        transition: "transform 0.2s ease, background 0.2s ease", // <-- add comma here,
    });
    container.appendChild(fill);
    document.body.appendChild(container);
    // Function to compute smooth gradient color from green → red
    function getHealthColor(health) {
        const ratio = health / 100;
        if (ratio > 0.5) {
            // Bright green → orange
            const t = (ratio - 0.5) * 2;
            const r = Math.round(255 * (1 - t));
            const g = 255;
            return `rgb(${r}, ${g}, 0)`; // green to yellow to orange
        } else {
            // Orange → red
            const t = ratio * 2;
            const r = 255;
            const g = Math.round(255 * t);
            return `rgb(${r}, ${g}, 0)`; // orange to red
        }
    }
    // Global health setter and show/hide toggle
    setHealthBar = function(health, show = true) {
        const clamped = Math.max(0, Math.min(health, 100));
        fill.style.transform = `scaleY(${clamped / 100})`;
        fill.style.background = getHealthColor(clamped);
        container.style.display = show ? "flex" : "none";
    };
})();

setHealthBar(100, false)

function toggleEnemyHealthGui() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    enemyHealthGuiEnabled = !enemyHealthGuiEnabled;
    if (enemyHealthGuiEnabled) {
        startHealthWatcher();
    } else {
        // Toggle off: clean up everything
        if (healthWatcherInterval) clearInterval(healthWatcherInterval);
        if (resetTimeout) clearTimeout(resetTimeout);
        setHealthBar(100, false); // hide bar
        lastPercent = null;
    }
    updateEnemyHealthGuiButton();
}

function startHealthWatcher() {
    everEnabled.enemyHealthGuiEnabled = true;
    if (healthWatcherInterval) clearInterval(healthWatcherInterval);
    healthWatcherInterval = setInterval(() => {
        const list = shideFuxny.entities[shideFuxny.impKey].entityName.list;
        let percent = null;
        let foundTarget = false;
        for (let i = 0; i < list.length; i++) {
            const targetEntity = list[i];
            if (r.values(targetEntity)[0] === lastClosestId) {
                percent = r.values(targetEntity)[7];
                foundTarget = true;
                break;
            }
        }
        // Hide health bar if not found, or at full/near full
        if (!foundTarget || percent === 0 || percent >= 1) { // ) {
            if (resetTimeout) {
                clearTimeout(resetTimeout)
            };
            setHealthBar(100, false);
            lastPercent = null;
            return;
        }
        // Update bar only if changed
        if (percent !== null) {
            lastPercent = percent;
            lastChangeTime = Date.now();
            setHealthBar(percent * 100, true);
            if (resetTimeout) clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
                setHealthBar(100, false);
                lastPercent = null;
            }, 10000);
        }
    }, 300);
}

/*
    function emitSafePrimaryFire() {
        const realEvent = new MouseEvent("mousedown");
        const fakeEvent = {
            timeStamp: performance.now(),
            altKey: false,
            ctrlKey: realEvent.ctrlKey,
            shiftKey: realEvent.shiftKey,
            metaKey: realEvent.metaKey,
            button: realEvent.button,
            buttons: realEvent.buttons,
            clientX: realEvent.clientX,
            clientY: realEvent.clientY,
            screenX: realEvent.screenX,
            screenY: realEvent.screenY
        };
        shideFuxny.NIGHT.inputs.down.emit("primary-fire", fakeEvent);
    }*/

function checkAndClick() {
    const hit = playerEntity.tryHitEntity();
    if (hit?.hitEId != null) {
        if (
            //!playerEntity.breaking &&
            //!inMenu() &&
            shideFuxny.entities.getState(1, "genericLifeformState").isAlive &&
            shideFuxny.entities.getState(hit.hitEId, "genericLifeformState") &&
            shideFuxny.entities.getState(hit.hitEId, "genericLifeformState").isAlive &&
            r.values(shideFuxny.entityList)?.[1]?.[hit.hitEId].canAttack
        ) {
            emitSafePrimaryFire();
            //['mousedown','mouseup','click'].forEach(t => document.querySelector('canvas')?.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:window,clientX:innerWidth/2,clientY:innerHeight/2,buttons:1})));
            lastClosestId = hit.hitEId
        }
    }
}

function toggleTriggerBot() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.triggerBotEnabled = true;
    if (triggerBotEnabled) {
        clearTimeout(toggleTriggerBotInterval);
        triggerBotEnabled = false;
        console.log("⛔ Auto-attack stopped");
    } else {
        triggerBotEnabled = true;
        function autoAttackLoop() {
            if (!triggerBotEnabled) return;
            checkAndClick();
            const nextDelay = ATTACK_INTERVAL_MS + (Math.random() * 40 - 20); // ±20ms
            toggleTriggerBotInterval = setTimeout(autoAttackLoop, nextDelay);
        }
        autoAttackLoop();
        console.log("▶️ Auto-attack started");
    }
    updateTriggerBotButton();
}

function toggleLockPlayerWaterState() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.waterJumpingEnabled = true;
    const movementList = shideFuxny.entities[shideFuxny.impKey]?.movement?.list;
    if (!Array.isArray(movementList) || movementList.length === 0) return;
    const c = movementList[0];
    if (waterJumpingEnabled) {
        // Restore defaults (optional: redefine properties as writable again)
        waterJumpingEnabled = false;
        console.log("🔓 Player water state unlocked");
        updateWaterJumpButton();
        return;
    }
    try {
        Object.defineProperty(c, "inAirFromWater", {
            get: () => false,
            set: () => {},
            configurable: true
        });
        Object.defineProperty(c, "_jumpCount", {
            get: () => 0,
            set: () => {},
            configurable: true
        });
        Object.defineProperty(c, "_ticksOutOfWater", {
            get: () => 346,
            set: () => {},
            configurable: true
        });
        // Add this too if you want to lock ice status:
        Object.defineProperty(c, "isOnIce", {
            get: () => true,
            set: () => {},
            configurable: true
        });
        waterJumpingEnabled = true;
        console.log("🔒 Player water state locked");
        updateWaterJumpButton();
    } catch (e) {
        console.error("Error locking player water state:", e);
    }
}

let bigHeadsInterval = null;
function toggleBigHeads() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }
    everEnabled.bigHeadsEnabled = true;
    const objectData = r.values(shideFuxny.rendering)[18].objectData;
    if (!bigHeadsEnabled) {
        // Initial scale-up
        for (let key in objectData) {
            let obj = objectData[key];
            if (obj?.type === "Player" && obj.nodes?.[16] && obj !== objectData[1]) {
                let node = obj.nodes[16];
                node.scale._x = 6;
                node.scale._y = 6;
                node.scale._z = 6;
                node.position._y = -1;
            }
        }
        // Start periodic check every 10 seconds
        bigHeadsInterval = setInterval(() => {
            for (let key in objectData) {
                let obj = objectData[key];
                if (obj?.type === "Player" && obj.nodes?.[16] && obj !== objectData[1]) {
                    let node = obj.nodes[16];
                    // Only update if scale hasn't already been changed
                    if (node.scale._x === 1 && node.scale._y === 1 && node.scale._z === 1) {
                        node.scale._x = 6;
                        node.scale._y = 6;
                        node.scale._z = 6;
                        node.position._y = -1;
                    }
                }
            }
        }, 10000); // 10 seconds
    } else {
        // Restore original size
        for (let key in objectData) {
            let obj = objectData[key];
            if (obj?.type === "Player" && obj.nodes?.[16] && obj !== objectData[1]) {
                let node = obj.nodes[16];
                node.scale._x = 1;
                node.scale._y = 1;
                node.scale._z = 1;
                node.position._y = 0.7199999690055847;
            }
        }
        // Clear the interval
        clearInterval(bigHeadsInterval);
        bigHeadsInterval = null;
    }
    bigHeadsEnabled = !bigHeadsEnabled;
    updateBigHeadButton();
}

function toggleWallJumpScript() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.wallJumpRunning = true;
    const client = shideFuxny?.clientOptions;
    const body = shideFuxny?.physics?.bodies?.[0];
    if (!client || !body) return;
    if (wallJumpRunning) {
        // Unlock airJumpCount (optional reset)
        Object.defineProperty(client, "airJumpCount", {
            value: 0,
            writable: true,
            configurable: true
        });
        wallJumpRunning = false;
        console.log("🧱 Wall jump script disabled");
        updateWallJumpButton();
        return;
    }
    // Lock airJumpCount based on body.resting direction
    Object.defineProperty(client, "airJumpCount", {
        get() {
            if (!body.resting) return 0;
            const [rx, , rz] = body.resting;
            return (rx === 1 || rx === -1 || rz === 1 || rz === -1) ? 999 : 0;
        },
        set(_) {}, // Prevent assignment
        configurable: true
    });
    wallJumpRunning = true;
    console.log("🧱 Wall jump script enabled");
    updateWallJumpButton();
}

function wangPlace(position) {
    let heldBlock = r.values(shideFuxny.NIGHT.entities[shideFuxny.impKey])[22].list[0]._blockItem;
    let worldInstanceKey = Object.keys(heldBlock)[0];
    let worldInstance = Object.values(heldBlock)[0];
    let targetedBlockKey = Object.keys(worldInstance)[25];
    let targetedBlock = worldInstance[targetedBlockKey];
    function spoofTargetedBlock(position) {
        return new Proxy({}, {
            get(target, prop, receiver) {
                if (prop === worldInstanceKey) {
                    return new Proxy(worldInstance, {
                        get(inner, key) {
                            if (key === targetedBlockKey) {
                                let spoofedTargetedBlock = structuredClone(targetedBlock) || {};
                                spoofedTargetedBlock.position = position;
                                return spoofedTargetedBlock;
                            }
                            return worldInstance[key];
                        },
                    });
                }
                if (prop == "checkTargetedBlockCanBePlacedOver") {
                    return () => true;
                }
                if (typeof heldBlock[prop] == "function") {
                    return heldBlock[prop].bind(heldBlock);
                } else {
                    return heldBlock[prop];
                }
            },
        });
    }
    heldBlock.placeBlock.call(spoofTargetedBlock(position));
}

function placeToPlayer(position) {
    // Convert to block coordinates by flooring each component
    const blockX = Math.floor(position[0]);
    const blockY = Math.floor(position[1]);
    const blockZ = Math.floor(position[2]);
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY - 3, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY - 3, blockZ) === 0) {
        wangPlace([blockX, blockY - 3, blockZ])
    }
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY - 2, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY - 2, blockZ) === 0) {
        wangPlace([blockX, blockY - 2, blockZ])
    }
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY - 1, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY - 1, blockZ) === 0) {
        wangPlace([blockX, blockY - 1, blockZ])
    }
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY, blockZ) === 0) {
        wangPlace([blockX, blockY, blockZ])
    }
}

function placeSpike(position) {
    // Convert to block coordinates by flooring each component
    const blockX = Math.floor(position[0]);
    const blockY = Math.floor(position[1]);
    const blockZ = Math.floor(position[2]);
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY + 1, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY + 1, blockZ) === 0) {
        wangPlace([blockX, blockY + 1, blockZ])
    }
}

function moveItem(itemName, desiredSlot) {
    if (!playerInventoryParent || !playerInventoryParent.playerInventory?.items) {
        console.warn("❌ playerInventoryParent is not set. Run findAndSavePlayerInventoryParent() first.");
        return false;
    }
    const items = playerInventoryParent.playerInventory.items;
    let oldSlot = null;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item || typeof item.name !== 'string') continue;
        const name = item.name.toLowerCase();
        if (name.includes(itemName)) {
            oldSlot = i;
            break;
        }
    }
    if (oldSlot === null) {
        console.warn(`❌ No ${itemName} found in slot 10 or higher.`);
        return false;
    }
    console.log(`🔁 Swapping ${itemName} from slot ${oldSlot} with slot ${desiredSlot}`);
    playerInventoryParent.swapPosClient(oldSlot, desiredSlot, null);
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function autoSW() {
    if (lastClosestId && targetEntityDistance <= 36) { // place web then spikes
        if (moveItem("net", webSlot) || moveItem("web", webSlot)) {
            let enemyPos = shideFuxny.entities.getState(lastClosestId, 'position').position;
            shideFuxny.NIGHT.inputs.down['_events'][`HotBarSlot${webSlot + 1}`]();
            placeToPlayer(enemyPos);
            await sleep(50); // delay before switching to spikes
            if (moveItem("spikes", spikeSlot)) {
                shideFuxny.NIGHT.inputs.down['_events'][`HotBarSlot${spikeSlot + 1}`]();
                placeSpike(enemyPos);
            }
        } else { // just place spikes
            if (moveItem("spikes", spikeSlot)) {
                shideFuxny.NIGHT.inputs.down['_events'][`HotBarSlot${spikeSlot + 1}`]();
                await sleep(50);
                let enemyPos = shideFuxny.entities.getState(lastClosestId, 'position').position;
                placeToPlayer(enemyPos);
            } else {
                console.log("no spikes or webs!");
            }
        }
        shideFuxny.NIGHT.inputs.down['_events'].HotBarSlot1();
    } else {
        console.log("No target or too far");
    }
    if (!everEnabled.autoSWUsed) {verEnabled.autoSWUsed = true};
}

function startTargetFinder() {
    let armourNodeNum = r.values(shideFuxny.rendering)[18].getNamedNode(1, "Body|Armour")
    let closestObj = null;
    targetFinderId = setInterval(() => {
        if (!injectedBool) {
            console.log("NOT INJECTED NO TARGET")
        }
        if (!shideFuxny.entities.getState(1, "genericLifeformState").isAlive) return;
        const myPos = shideFuxny.entities.getState?.(myId, 'position')?.position;
        if (!myPos) return;
        const rendering = r.values(shideFuxny.rendering)[18];
        const objectData = rendering?.objectData;
        if (!objectData) return;
        if (!eIdKey) return;
        let closestId = null;
        let minDist = 100;
        for (const key in objectData) {
            const obj = objectData[key];
            const eId = obj[eIdKey];
            if (
                eId == null ||
                obj.type !== "Player" ||
                obj.pickable === false ||
                eId === myId ||
                !shideFuxny.entities.getState(eId, "genericLifeformState") ||
                !shideFuxny.entities.getState(eId, "genericLifeformState").isAlive
            ) continue;
            if (!eId || eId === myId || obj.pickable === false || obj.type !== "Player") continue;
            const state = shideFuxny.entities.getState(eId, "genericLifeformState");
            if (!state || !state.isAlive) continue;
            const ent = r.values(shideFuxny.entityList)?.[1]?.[eId];
            if (!ent || ent.canAttack !== true) continue;
            const pos = shideFuxny.entities.getState(eId, 'position')?.position;
            if (!pos) continue;
            const dx = pos[0] - myPos[0];
            const dy = pos[1] - myPos[1];
            const dz = pos[2] - myPos[2];
            //if (Math.abs(dy) > 3) continue; // optional Y-axis restriction
            const dist = dx * dx + dy * dy + dz * dz;
            if (dist < minDist) {
                minDist = dist;
                closestId = eId;
                closestObj = obj;
            }
        }
        const armourNode = closestObj?.nodes?.[armourNodeNum];
        if (armourNode?.actuallyEnabled) {
            newBox.name = possibleNames[1];
            newBox.id = possibleNames[1];
        } else {
            newBox.name = possibleNames[0];
            newBox.id = possibleNames[0];
        }
        if (closestId != null) {
            newBox.metadata.eId = closestId;
            //console.log(newBox.id,"  ",closestId)
            if (closestId !== lastClosestId) {
                if (hitboxes[closestId]) {
                    hitboxes[closestId].material.diffuseColor = new shideFuxny.Lion.Color3(1, 0, 0);
                    hitboxes[closestId].material.emissiveColor = new shideFuxny.Lion.Color3(1, 0, 0);
                    for (const id in hitboxes) {
                        if (id !== closestId && hitboxes[id]) {
                            hitboxes[id].material.diffuseColor = new shideFuxny.Lion.Color3(1, 1, 1);
                            hitboxes[id].material.emissiveColor = new shideFuxny.Lion.Color3(1, 1, 1);
                        }
                    }
                }
                lastClosestId = closestId;
            }
        } else {
            //newBox.metadata.eId = null;
            lastClosestId = null;
        }
        // Final visibility and distance logic
        if (killAuraEnabled && closestId != null && minDist < 64) { //16 for now
            newBox[__nullKey] = true;
            targetEntityDistance = Math.floor(Math.sqrt(minDist));
        } else {
            newBox[__nullKey] = false;
            targetEntityDistance = null;
        }
    }, 100);
}

function toggleKillAura() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }
    everEnabled.killAuraEnabled = true;
    if (killAuraEnabled) {
        console.log("⛔ Kill aura disabled");
    } else {
        newBox[__nullKey] = false;
    }
    killAuraEnabled = !killAuraEnabled;
    updateKillAuraButton();
}

function toggleHitBoxes() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
        return;
    }
    everEnabled.hitBoxEnabled = true;
    hitBoxEnabled = !hitBoxEnabled;
    // Toggle visibility on all hitboxes
    for (const eId in hitboxes) {
        const box = hitboxes[eId];
        if (box && box.isVisible !== hitBoxEnabled) {
            box.isVisible = hitBoxEnabled;
        }
    }
    updateHitboxButton();
}

function toggleSkybox() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.skyBoxEnabled = true;
    (function saveSkyboxEntity() {
        for (let i = 0; i < 10000; i++) {
            const meshState = shideFuxny.entities.getState(i, "mesh");
            if (meshState?.mesh?.id === "skyBox") {
                console.log(`✔ Found skyBox entity: ${i}`);
                skyboxEntity = i; // Save globally
                skyboxMesh = meshState.mesh; // Optional: save mesh reference too
                break;
            }
        }
    })();
    if (!skyboxMesh) {
        console.warn("❌ skyboxMesh is not defined.");
        return;
    }
    isSkyboxHidden = !isSkyboxHidden;
    skyboxMesh.isVisible = isSkyboxHidden ? false : true;
    console.log(`🌌 Skybox is now ${isSkyboxHidden ? "hidden" : "visible"}`);
    updateSkyboxButton()
}

/*
 function rainbowSky() {
     rainbowSkyEnabled = !rainbowSkyEnabled
     if (!rainbowSkyEnabled) {
    }
 }*/

function toggleWireframe() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.wireFramesBool = true;
    wireFramesBool = !wireFramesBool;
    const renderings = r.values(shideFuxny.rendering);
    for (const rendering of renderings) {
        const thinMeshes = r.values(shideFuxny.rendering)[18].thinMeshes;
        if (!Array.isArray(thinMeshes)) continue;
        for (const thinMesh of thinMeshes) {
            const mesh = thinMesh?.mesh;
            const material = mesh?.material;
            const name = mesh?.name;
            if (
                material &&
                typeof material.wireframe === "boolean" &&
                !(typeof name === "string" && name.includes("Armour"))
            ) {
                material.wireframe = wireFramesBool;
            }
        }
    }
    updateWireframeButton();
}

let chestESPEnabled = false;
let oreESPEnabled = false;
let chestOreInterval = null;
let chestBoxes = {};

function clearESPBoxes() {
    for (const key in chestBoxes) {
        for (const {
                mesh,
                id
            }
            of chestBoxes[key]) {
            mesh.dispose();
            shideFuxny.entities.deleteEntity(id);
        }
    }
    scannedChunks.set();
    chestBoxes = {};
}

function reverseIndex(i, stride) {
    const x = Math.floor(i / stride[0]);
    const remX = i % stride[0];
    const y = Math.floor(remX / stride[1]);
    const z = remX % stride[1];
    return [x, y, z];
}

function getChunkKey(chunk) {
    const [wx, wy, wz] = chunk.pos || [0, 0, 0];
    const cx = Math.floor(wx / 32);
    const cy = Math.floor(wy / 32);
    const cz = Math.floor(wz / 32);
    return `${cx}|${cy}|${cz}|overworld`;
}

function scanChunk(chunk, blockIDs) {
    const blockData = chunk[chunkDataField];
    if (!blockData) return;
    const {
        data,
        stride
    } = blockData;
    const pos = chunk.pos || [0, 0, 0];
    if (!data || !stride) return;
    const chunkKey = getChunkKey(chunk);
    for (let i = 0; i < data.length; i++) {
        const blockID = data[i];
        if (!blockIDs.includes(blockID)) continue;
        const [x, y, z] = reverseIndex(i, stride);
        const worldX = pos[0] + x + 0.5;
        const worldY = pos[1] + y + 0.5;
        const worldZ = pos[2] + z + 0.5;
        const mesh = shideFuxny.Lion.Mesh.CreateBox("espbox", 0.5, false, 1, shideFuxny.Lion.scene);
        mesh.position.set(worldX, worldY, worldZ);
        mesh.renderingGroupId = 1;
        mesh.material = new shideFuxny.Lion.StandardMaterial("mat", shideFuxny.Lion.scene)
        const id = shideFuxny.entities.add([worldX, worldY, worldZ], null, null, mesh);
        if (!chestBoxes[chunkKey]) chestBoxes[chunkKey] = [];
        chestBoxes[chunkKey].push({
            mesh,
            id
        });
        if ([204, 205, 206, 207].includes(blockID)) {
            console.log("FOUNDCHEST")
            mesh.material.diffuseColor = new shideFuxny.Lion.Color3(1, 0.5, 0); // orange
            mesh.material.emissiveColor = new shideFuxny.Lion.Color3(1, 0.5, 0); // makes it glow orange
        }
        if (blockID === 45) {
            mesh.material.diffuseColor = new shideFuxny.Lion.Color3(0, 0, 1); // blue
            mesh.material.emissiveColor = new shideFuxny.Lion.Color3(0, 0, 1); // makes it glow blue
        }
        if (blockID === 465) {
            mesh.material.diffuseColor = new shideFuxny.Lion.Color3(0.7, 0.5, 1); // pale purple
            mesh.material.emissiveColor = new shideFuxny.Lion.Color3(0.7, 0.5, 1); // makes it glow pale purple
        }
    }
}

function scanAllChunks() {
    if (!shideFuxny?.world || !shideFuxny?.world?.[shideFuxny.impKey]?.hash) return;
    const chunkHash = shideFuxny.world[shideFuxny.impKey].hash;
    // Step 1: Remove boxes for chunks no longer loaded
    for (const scannedKey of scannedChunks) {
        if (!(scannedKey in chestBoxes)) continue;
        if (!Object.values(chunkHash).some(chunk => getChunkKey(chunk) === scannedKey)) {
            // Delete all meshes for this chunk
            for (const {
                    mesh,
                    id
                }
                of chestBoxes[scannedKey]) {
                mesh.dispose(); // remove from scene
                shideFuxny.entities.deleteEntity(id); // remove from entity system if needed
            }
            delete chestBoxes[scannedKey];
            scannedChunks.delete(scannedKey);
        }
    }
    // Step 2: Scan newly loaded chunks
    for (const chunkKey in chunkHash) {
        const chunk = chunkHash[chunkKey];
        if (!chunkDataField) {
            autoDetectChunkDataField(chunk);
            if (!chunkDataField) continue; // Skip if still not found
        }
        const blockData = chunk[chunkDataField];
        if (!blockData?.data || !blockData.stride || !chunk.pos) continue;
        const key = getChunkKey(chunk);
        if (scannedChunks.has(key)) continue;
        scannedChunks.add(key);
        if (chestESPEnabled) scanChunk(chunk, [204, 205, 206, 207]);
        if (oreESPEnabled) scanChunk(chunk, [44, 45, 465, 50]);
    }
}

function toggleChestESP() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.chestESPEnabled = true;
    chestESPEnabled = !chestESPEnabled;
    if (chestESPEnabled || oreESPEnabled) {
        scanAllChunks();
        chestOreInterval = setInterval(scanAllChunks, 5000);
    } else {
        clearInterval(chestOreInterval);
        chestOreInterval = null;
        clearESPBoxes();
        scannedChunks.clear(); // Allow rescan next time
    }
    updateChestESPButton();
}

function toggleOreESP() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.oreESPEnabled = true;
    oreESPEnabled = !oreESPEnabled;
    if (chestESPEnabled || oreESPEnabled) {
        scanAllChunks();
        chestOreInterval = setInterval(scanAllChunks, 5000);
    } else {
        clearInterval(chestOreInterval);
        chestOreInterval = null;
        clearESPBoxes();
        scannedChunks.clear(); // Allow rescan next time
    }
    updateOreESPButton();
}

function toggleESP() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.espEnabled = true;
    if (!shideFuxny.impKey) return;
    espEnabled = !espEnabled;
    const groupId = espEnabled ? 2 : 0;
    if (Array.isArray(r.values(shideFuxny.rendering)[18].thinMeshes)) {
        for (const thinMesh of r.values(shideFuxny.rendering)[18].thinMeshes) {
            if (thinMesh?.mesh && typeof thinMesh.mesh.renderingGroupId === "number") {
                thinMesh.mesh.renderingGroupId = groupId;
            }
        }
        console.log(`✅ Thin meshes render group set to ${groupId}`);
    } else {
        console.error("❌ thinMeshes array not found.");
    }
    updateESPButton?.();
}

// Melon Hub Aimbot implementation
function aimbotUpdate() {
    if (!aimbotEnabled || !shideFuxny.entities.getState(1, "genericLifeformState").isAlive) return;

    const myPos = shideFuxny.entities.getState(1, 'position')?.position;
    if (!myPos) return;

    // Find the nearest player
    let closestTarget = null;
    let minDist = Infinity;

    const rendering = r.values(shideFuxny.rendering)[18];
    const objectData = rendering?.objectData;
    if (!objectData || !eIdKey) return;

    for (const key in objectData) {
        const obj = objectData[key];
        const eId = obj[eIdKey];
        if (
            eId == null ||
            obj.type !== "Player" ||
            obj.pickable === false ||
            eId === myId ||
            !shideFuxny.entities.getState(eId, "genericLifeformState") ||
            !shideFuxny.entities.getState(eId, "genericLifeformState").isAlive
        ) continue;

        const ent = r.values(shideFuxny.entityList)?.[1]?.[eId];
        if (!ent || ent.canAttack !== true) continue;

        const targetPos = shideFuxny.entities.getState(eId, 'position')?.position;
        if (!targetPos) continue;

        // Calculate distance to target
        const dx = targetPos[0] - myPos[0];
        const dy = targetPos[1] - myPos[1];
        const dz = targetPos[2] - myPos[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Skip if target is too far
        if (distance > aimbotDistance) continue;

        // If this is the closest target so far, save it
        if (distance < minDist) {
            minDist = distance;
            closestTarget = {
                position: targetPos,
                entityId: eId
            };
        }
    }

    // If we found a target, aim at it
    if (closestTarget) {
        const targetPos = closestTarget.position;

        // Calculate the direction vector
        const dx = targetPos[0] - myPos[0];
        const dy = targetPos[1] - myPos[1] - 0.5; // Adjust for head height
        const dz = targetPos[2] - myPos[2];

        // Normalize the direction vector
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const dirX = dx / length;
        const dirY = dy / length;
        const dirZ = dz / length;

        // Calculate heading and pitch (Melon Hub method)
        const heading = Math.atan2(dirX, dirZ);
        const pitch = Math.asin(-dirY);

        // Apply AntiBan rotation smoothing if enabled
        const smoothness = antiBanEnabled ? ANTI_BAN_ROTATION_SMOOTHNESS : aimbotSmoothness;

        // Get current camera rotation
        const camera = shideFuxny.camera;
        const currentYaw = camera.yaw || 0;
        const currentPitch = camera.pitch || 0;

        // Smoothly adjust camera rotation
        const newYaw = currentYaw + (heading - currentYaw) * smoothness;
        const newPitch = currentPitch + (pitch - currentPitch) * smoothness;

        // Apply new rotation
        camera.yaw = newYaw;
        camera.pitch = newPitch;

        // Update camera direction
        if (camera._direction) {
            camera._direction[0] = Math.sin(newYaw) * Math.cos(newPitch);
            camera._direction[1] = Math.sin(newPitch);
            camera._direction[2] = Math.cos(newYaw) * Math.cos(newPitch);
        }

        // Auto trigger if enabled
        if (aimbotAutoTrigger) {
            emitSafePrimaryFire();
        }
    }
}

function toggleAimbot() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }
    everEnabled.aimbotEnabled = true;
    if (aimbotEnabled) {
        clearInterval(aimbotIntervalId);
        aimbotEnabled = false;
        console.log("⛔ Aimbot disabled");
    } else {
        aimbotEnabled = true;
        aimbotIntervalId = setInterval(aimbotUpdate, 10); // Update aimbot every 10ms
        console.log("▶️ Aimbot enabled");
    }
    updateAimbotButton();
}

function updateAimbotButton() {
    updateButtonUnderline(aimbotBtn, aimbotEnabled);
    if (!isInitializing) showTemporaryNotification('Aimbot toggled: ' + aimbotEnabled);
}

// NoLag function
function toggleNoLag() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first!');
        return;
    }
    noLagEnabled = !noLagEnabled;
    everEnabled.noLagEnabled = true;
    if (noLagEnabled) {
        // Store current settings
        if (shideFuxny.camera) {
            originalSettings.cameraMaxZ = shideFuxny.camera.maxZ;
            originalSettings.cameraMinZ = shideFuxny.camera.minZ;
        }
        if (shideFuxny.Lion && shideFuxny.Lion.engine) {
            originalSettings.hardwareScalingLevel = shideFuxny.Lion.engine.getHardwareScalingLevel();
        }
        // Store particle settings
        if (shideFuxny.Lion && shideFuxny.Lion.scene && shideFuxny.Lion.scene.particleSystems) {
            shideFuxny.Lion.scene.particleSystems.forEach(system => {
                originalSettings.particleCapacity.push({
                    system: system,
                    capacity: system.capacity
                });
            });
        }
        // Store shadow settings
        if (shideFuxny.Lion && shideFuxny.Lion.scene && shideFuxny.Lion.scene.lights) {
            shideFuxny.Lion.scene.lights.forEach(light => {
                if (light.shadowGenerator) {
                    originalSettings.shadowSettings.push({
                        light: light,
                        useBlur: light.shadowGenerator.useBlurExponentialShadowMap,
                        usePCF: light.shadowGenerator.usePercentageCloserFiltering
                    });
                }
            });
        }
        // Store texture settings
        if (shideFuxny.Lion && shideFuxny.Lion.scene && shideFuxny.Lion.scene.textures) {
            shideFuxny.Lion.scene.textures.forEach(texture => {
                if (texture.updateSamplingMode) {
                    originalSettings.textureModes.push({
                        texture: texture,
                        mode: texture.samplingMode
                    });
                }
            });
        }
        // Apply NoLag settings
        applyNoLagSettings();
        showTemporaryNotification('No Lag enabled - Performance optimized');
    } else {
        // Restore original settings
        restoreOriginalSettings();
        showTemporaryNotification('No Lag disabled - Default settings restored');
    }
    updateNoLagButton();
}

function applyNoLagSettings() {
    // Reduce render distance
    if (shideFuxny.camera) {
        shideFuxny.camera.maxZ = NO_LAG_RENDER_DISTANCE;
        shideFuxny.camera.minZ = 0.1;
    }
    // Limit particle effects
    if (shideFuxny.Lion && shideFuxny.Lion.scene && shideFuxny.Lion.scene.particleSystems) {
        shideFuxny.Lion.scene.particleSystems.forEach(system => {
            system.capacity = NO_LAG_PARTICLE_LIMIT;
            if (system.minEmitBox && system.maxEmitBox) {
                system.minEmitBox = new shideFuxny.Lion.Vector3(0, 0, 0);
                system.maxEmitBox = new shideFuxny.Lion.Vector3(0, 0, 0);
            }
        });
    }
    // Optimize shadow settings
    if (shideFuxny.Lion && shideFuxny.Lion.scene && shideFuxny.Lion.scene.lights) {
        shideFuxny.Lion.scene.lights.forEach(light => {
            if (light.shadowGenerator) {
                light.shadowGenerator.useBlurExponentialShadowMap = false;
                light.shadowGenerator.usePercentageCloserFiltering = false;
            }
        });
    }
    // Reduce texture quality
    if (shideFuxny.Lion && shideFuxny.Lion.scene && shideFuxny.Lion.scene.textures) {
        shideFuxny.Lion.scene.textures.forEach(texture => {
            if (texture.updateSamplingMode) {
                texture.updateSamplingMode(shideFuxny.Lion.Texture.NEAREST_SAMPLINGMODE);
            }
        });
    }
    // Limit FPS
    if (shideFuxny.Lion && shideFuxny.Lion.engine) {
        shideFuxny.Lion.engine.setHardwareScalingLevel(1.5);
    }
}

function restoreOriginalSettings() {
    // Restore camera settings
    if (shideFuxny.camera && originalSettings.cameraMaxZ !== null) {
        shideFuxny.camera.maxZ = originalSettings.cameraMaxZ;
        shideFuxny.camera.minZ = originalSettings.cameraMinZ;
    }
    // Restore hardware scaling
    if (shideFuxny.Lion && shideFuxny.Lion.engine && originalSettings.hardwareScalingLevel !== null) {
        shideFuxny.Lion.engine.setHardwareScalingLevel(originalSettings.hardwareScalingLevel);
    }
    // Restore particle settings
    originalSettings.particleCapacity.forEach(item => {
        if (item.system) {
            item.system.capacity = item.capacity;
        }
    });
    originalSettings.particleCapacity = [];
    // Restore shadow settings
    originalSettings.shadowSettings.forEach(item => {
        if (item.light && item.light.shadowGenerator) {
            item.light.shadowGenerator.useBlurExponentialShadowMap = item.useBlur;
            item.light.shadowGenerator.usePercentageCloserFiltering = item.usePCF;
        }
    });
    originalSettings.shadowSettings = [];
    // Restore texture settings
    originalSettings.textureModes.forEach(item => {
        if (item.texture && item.texture.updateSamplingMode) {
            item.texture.updateSamplingMode(item.mode);
        }
    });
    originalSettings.textureModes = [];
}

// AntiBan function
function toggleAntiBan() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first!');
        return;
    }
    antiBanEnabled = !antiBanEnabled;
    everEnabled.antiBanEnabled = true;
    if (antiBanEnabled) {
        showTemporaryNotification('AntiBan enabled - Attack patterns randomized');
    } else {
        showTemporaryNotification('AntiBan disabled');
    }
    updateAntiBanButton();
}

function updateAntiBanButton() {
    updateButtonUnderline(antiBanBtn, antiBanEnabled);
    if (!isInitializing) showTemporaryNotification('AntiBan toggled: ' + antiBanEnabled);
}

// Auto Sprint functions
function toggleAutoSprint() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }
    everEnabled.autoSprintEnabled = true;
    autoSprintEnabled = !autoSprintEnabled;
    if (autoSprintEnabled) {
        autoSprintInterval = setInterval(() => {
            if (shideFuxny.entities.getState(1, "genericLifeformState").isAlive &&
                physState && physState.isOnGround()) {
                // Simulate holding Shift key
                const shiftEvent = new KeyboardEvent('keydown', {
                    code: 'ShiftLeft',
                    key: 'Shift',
                    shiftKey: true,
                    bubbles: true
                });
                document.dispatchEvent(shiftEvent);
            }
        }, 100);
        showTemporaryNotification('Auto Sprint enabled');
    } else {
        clearInterval(autoSprintInterval);
        autoSprintInterval = null;
        // Release Shift key
        const shiftEvent = new KeyboardEvent('keyup', {
            code: 'ShiftLeft',
            key: 'Shift',
            shiftKey: false,
            bubbles: true
        });
        document.dispatchEvent(shiftEvent);
        showTemporaryNotification('Auto Sprint disabled');
    }
    updateAutoSprintButton();
}

function updateAutoSprintButton() {
    updateButtonUnderline(autoSprintBtn, autoSprintEnabled);
}

// Auto Break functions
function toggleAutoBreak() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }
    everEnabled.autoBreakEnabled = true;
    autoBreakEnabled = !autoBreakEnabled;
    if (autoBreakEnabled) {
        // Simulate holding J key
        autoBreakInterval = setInterval(() => {
            const jEvent = new KeyboardEvent('keydown', {
                code: 'KeyJ',
                key: 'j',
                bubbles: true
            });
            document.dispatchEvent(jEvent);
        }, 50); // Refresh every 50ms to simulate holding
        showTemporaryNotification('Auto Break enabled');
    } else {
        clearInterval(autoBreakInterval);
        autoBreakInterval = null;
        // Release J key
        const jEvent = new KeyboardEvent('keyup', {
            code: 'KeyJ',
            key: 'j',
            bubbles: true
        });
        document.dispatchEvent(jEvent);
        showTemporaryNotification('Auto Break disabled');
    }
    updateAutoBreakButton();
}

function updateAutoBreakButton() {
    updateButtonUnderline(autoBreakBtn, autoBreakEnabled);
}

// Auto Place functions
function toggleAutoPlace() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }
    everEnabled.autoPlaceEnabled = true;
    autoPlaceEnabled = !autoPlaceEnabled;
    if (autoPlaceEnabled) {
        // Spam E key every 1ms
        autoPlaceInterval = setInterval(() => {
            const eDownEvent = new KeyboardEvent('keydown', {
                code: 'KeyE',
                key: 'e',
                bubbles: true
            });
            document.dispatchEvent(eDownEvent);
            const eUpEvent = new KeyboardEvent('keyup', {
                code: 'KeyE',
                key: 'e',
                bubbles: true
            });
            document.dispatchEvent(eUpEvent);
        }, 1); // 1 millisecond
        showTemporaryNotification('Auto Place enabled');
    } else {
        clearInterval(autoPlaceInterval);
        autoPlaceInterval = null;
        showTemporaryNotification('Auto Place disabled');
    }
    updateAutoPlaceButton();
}

function updateAutoPlaceButton() {
    updateButtonUnderline(autoPlaceBtn, autoPlaceEnabled);
}

// Auto Clicker functions
function toggleAutoClicker() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }
    everEnabled.autoClickerEnabled = true;
    autoClickerEnabled = !autoClickerEnabled;
    if (autoClickerEnabled) {
        // Spam J key every 12ms
        autoClickerInterval = setInterval(() => {
            const jDownEvent = new KeyboardEvent('keydown', {
                code: 'KeyJ',
                key: 'j',
                bubbles: true
            });
            document.dispatchEvent(jDownEvent);
            const jUpEvent = new KeyboardEvent('keyup', {
                code: 'KeyJ',
                key: 'j',
                bubbles: true
            });
            document.dispatchEvent(jUpEvent);
        }, 12); // 12 milliseconds
        showTemporaryNotification('Auto Clicker enabled');
    } else {
        clearInterval(autoClickerInterval);
        autoClickerInterval = null;
        showTemporaryNotification('Auto Clicker disabled');
    }
    updateAutoClickerButton();
}

function updateAutoClickerButton() {
    updateButtonUnderline(autoClickerBtn, autoClickerEnabled);
}

// Crouch Speed functions
function toggleCrouchSpeed() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.crouchSpeedEnabled = true;
    crouchSpeedEnabled = !crouchSpeedEnabled;
    if (crouchSpeedEnabled) {
        // Modify the crouch speed multiplier to match run speed
        const moveStateList = shideFuxny.entities[shideFuxny.impKey]?.moveState?.list;
        if (moveStateList && moveStateList[0] && moveStateList[0].speedMultiplier && moveStateList[0].speedMultiplier.multipliers) {
            Object.defineProperty(moveStateList[0].speedMultiplier.multipliers, "crouching", {
                configurable: true,
                enumerable: true,
                get() {
                    return 1; // Return normal speed (1.0) instead of reduced crouch speed
                },
                set(value) {
                    // Ignore attempts to change it
                }
            });
            showTemporaryNotification('Crouch Speed enabled');
        } else {
            showTemporaryNotification('Could not find crouch speed multiplier');
            crouchSpeedEnabled = false;
        }
    } else {
        // Restore default behavior by removing our override
        const moveStateList = shideFuxny.entities[shideFuxny.impKey]?.moveState?.list;
        if (moveStateList && moveStateList[0] && moveStateList[0].speedMultiplier && moveStateList[0].speedMultiplier.multipliers) {
            delete moveStateList[0].speedMultiplier.multipliers.crouching;
            showTemporaryNotification('Crouch Speed disabled');
        }
    }
    updateCrouchSpeedButton();
}

function updateCrouchSpeedButton() {
    updateButtonUnderline(crouchSpeedBtn, crouchSpeedEnabled);
    if (!isInitializing) showTemporaryNotification('Crouch Speed toggled: ' + crouchSpeedEnabled);
}

// Speed functions
function toggleSpeed() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.speedEnabled = true;
    if (!moveState) {
        showTemporaryNotification('MoveState not found!');
        return;
    }
    if (speedEnabled) {
        // Disable: restore original speed
        if (originalSpeedDescriptor) {
            Object.defineProperty(moveState, 'speed', originalSpeedDescriptor);
        } else {
            // Fallback if we don't have the original descriptor
            delete moveState.speed;
            moveState.speed = 1; // Default speed
        }
        speedEnabled = false;
        showTemporaryNotification('Speed restored to normal');
    } else {
        // Enable: set speed to 2
        originalSpeedDescriptor = Object.getOwnPropertyDescriptor(moveState, 'speed');
        Object.defineProperty(moveState, 'speed', {
            get: function() { return 2; },
            set: function(value) { /* ignore changes */ },
            configurable: true
        });
        speedEnabled = true;
        showTemporaryNotification('Speed set to 2x');
    }
    updateSpeedButton();
}

function updateSpeedButton() {
    updateButtonUnderline(speedBtn, speedEnabled);
    if (!isInitializing) showTemporaryNotification('Speed toggled: ' + speedEnabled);
}

// Reach functions
function toggleReach() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
    }
    everEnabled.reachEnabled = true;
    if (!playerEntity) {
        showTemporaryNotification('Player entity not found!');
        return;
    }
    if (reachEnabled) {
        // Disable: restore original reach
        if (originalReachDistance !== null) {
            playerEntity.reachDistance = originalReachDistance;
        }
        reachEnabled = false;
        showTemporaryNotification('Reach restored to normal');
    } else {
        // Enable: increase reach distance
        originalReachDistance = playerEntity.reachDistance;
        playerEntity.reachDistance = 8; // Increased reach distance (default is usually around 4-5)
        reachEnabled = true;
        showTemporaryNotification('Reach increased');
    }
    updateReachButton();
}

function updateReachButton() {
    updateButtonUnderline(reachBtn, reachEnabled);
    if (!isInitializing) showTemporaryNotification('Reach toggled: ' + reachEnabled);
}

// Utility Functions
function findNoaAndKey() {
        let winDescriptors = Object.getOwnPropertyDescriptors(window);
        let wpName = Object.keys(winDescriptors).find(key => winDescriptors[key]?.set?.toString().includes("++"));
        let wpInstance = null;
        if (wpName) {wpInstance = window[wpName] = window[wpName]}
    if (wpInstance) {
        wpInstance.push([
            [Math.floor(Math.random() * 90000) + 10000], {},
            function(wpRequire) {
                shideFuxny.findModule = (code) => wpRequire(Object.keys(wpRequire.m)[Object.values(wpRequire.m).findIndex(m => m.toString().includes(code))]);
                shideFuxny.Props = Object.values(shideFuxny.findModule("nonBlocksClient:")).find(prop => typeof prop == "object");
                shideFuxny.NIGHT = Object.values(shideFuxny.Props).find(prop => prop?.entities);
                //Credits to, you guessed it wang!
            }
        ]);
    }
    if (!shideFuxny.NIGHT) {
        usingAltInjection = true;
        console.warn("❌ Could not find noa, using backup.");
            function findObjectsWithEntitiesAndCamera(obj) {
              const matches = [];
              const visited = new WeakSet();
              function recurse(current, path = '') {
                if (typeof current !== 'object' || current === null) return;
                if (visited.has(current)) return;
                visited.add(current);
                const keys = Object.keys(current);
                if (keys.includes('entities') && keys.includes('camera')) {
                  matches.push({
                    path: path.join('.'),
                    object: current
                  });
                }
                for (const key of keys) {
                  const value = current[key];
                  if (typeof value === 'object' && value !== null) {
                    recurse(value, [...path, key]);
                  }
                }
              }
              recurse(obj);
              return matches;
            }
            const result = findObjectsWithEntitiesAndCamera(window);
            shideFuxny.NIGHT = result[0].object
    };
    const targetValue = r.values(shideFuxny.NIGHT.entities)[2];
    const entityEntries = Object.entries(shideFuxny.NIGHT.entities);
    shideFuxny.impKey = entityEntries.find(([_, val]) => val === targetValue)?.[0];
    shideFuxny.registry = r.values(shideFuxny.NIGHT)[17]
    shideFuxny.rendering = r.values(shideFuxny.NIGHT)[12]
    shideFuxny.entities = shideFuxny.NIGHT.entities;
    if (shideFuxny.impKey) {
        console.log("importantList identified:", shideFuxny.impKey);
        // Attempt to find BHOP references
        const key = shideFuxny.impKey;
        if (key) {
            const entity = shideFuxny.NIGHT.entities?.[key];
            if (entity?.moveState?.list?.[0] && entity?.movement?.list?.[0]) {
                playerKey = key;
                moveState = entity.moveState.list[0];
                physState = entity.movement.list[0];
                cachedBHOPParent = entity;
                console.log("✅ Cached BHOP entity data");
            } else {
                console.warn("⚠️ Found key but missing BHOP components");
            }
        } else {
            console.warn("❌ BHOP player key not found");
        }
    }
    (function findECS() {
        const noaObj = shideFuxny.NIGHT;
        if (!noaObj) {
            console.error("❌ noa object not found");
            return;
        }
        for (const [key, val] of Object.entries(noaObj)) {
            if (key === "entities") continue; // skip known non-ECS
            if (typeof val === "object" && typeof val.getState === "function") {
                console.log(`✅ Found ECS at noa.${key}`);
                shideFuxny.ECS = val;
                break;
            }
        }
    })();
    function findeIdKey() {
        const rendering = r.values(shideFuxny.rendering)[18];
        const objectData = rendering?.objectData;
        if (!objectData) return;
        const sample = objectData[1];
        for (const key in sample) {
            if (sample[key] === 1) {
                eIdKey = key;
                break;
            }
        }
    }
    findeIdKey();
    function findAddComponentFunction(obj) {
        const exclude = ['overwriteComponent', 'deleteComponent', 'removeComponent', 'getState'];
        for (const key in obj) {
            if (exclude.includes(key)) continue;
            const fn = obj[key];
            if (typeof fn !== 'function') continue;
            try {
                fn(999999, "__FAKE_COMPONENT__", {});
            } catch (err) {
                const msg = (err?.message || "").toLowerCase();
                if (
                    msg.includes("unknown component") ||
                    msg.includes("already has component") ||
                    (msg.includes("component") && msg.includes("missing"))
                ) {
                    console.log(`🧩 Candidate: ${key} → likely addComponent()`);
                    return key;
                }
            }
        }
        console.warn("❌ Could not identify an addComponent-like function.");
        return null;
    }
    let mesh = r.values(shideFuxny.rendering)[7].meshes[0];
    let scene = r.values(shideFuxny.rendering)[7];
    let engine = scene.getEngine();
    let StandardMaterial = mesh.material.constructor;
    let Color3 = mesh.material.diffuseColor.constructor;
    const addKey = findAddComponentFunction(shideFuxny.NIGHT.entities);
    const addComponent = shideFuxny.NIGHT.entities[addKey];
    shideFuxny.world = r.values(shideFuxny.NIGHT)[11]
    shideFuxny.physics = shideFuxny.NIGHT.physics
    shideFuxny.camera = shideFuxny.NIGHT.camera
    shideFuxny.bloxd = shideFuxny.NIGHT.bloxd
    shideFuxny.clientOptions = r.values(shideFuxny.NIGHT)[29]
    shideFuxny.Lion = {
        scene,
        engine,
        InstancedMesh: mesh.constructor,
        Mesh: mesh.constructor,
        Scene: scene.constructor,
        Engine: engine.constructor,
        Color3,
        StandardMaterial,
        addComponent,
        addKey
    };
    playerInventoryParent = shideFuxny.entities[shideFuxny.impKey].inventory.list[0].opWrapper
    function autoDetectChunkDataField(chunk) {
        for (const key of Object.keys(chunk)) {
            const val = chunk[key];
            if (!val) continue;
            if (
                typeof val === "object" &&
                Array.isArray(val.stride) &&
                val.stride.length === 3 &&
                (
                    Array.isArray(val.data) ||
                    ArrayBuffer.isView(val.data) // covers Uint16Array etc.
                )
            ) {
                console.log("✅ Detected chunk data field:", key);
                chunkDataField = key;
                return key;
            }
        }
        console.warn("❌ Failed to auto-detect chunk data field");
        return null;
    }
    autoDetectChunkDataField(Object.values(shideFuxny.world[shideFuxny.impKey].hash)[0]);
    const maybeEntity = r.values(r.values(shideFuxny.entities[shideFuxny.impKey])[22].list[0])[1];
    const hasDoAttackDirect = typeof maybeEntity?.doAttack === 'function';
    const hasDoAttackBreakingItem = typeof maybeEntity?.breakingItem?.doAttack === 'function';
    if (hasDoAttackDirect) {
        console.log("maybeEntity has doAttack");
        playerEntity = maybeEntity;
    } else if (hasDoAttackBreakingItem) {
        console.log("maybeEntity.breakingItem has doAttack");
        playerEntity = maybeEntity.breakingItem;
    } else {
        console.warn("Neither maybeEntity nor its breakingItem has doAttack");
        playerEntity = null;
    }
    mesh = null;
    scene = null;
    engine = null;
    StandardMaterial = null;
    Color3 = null;
    /*
            (function findRenderingModule() {
                const scene = shideFuxny?.Lion?.scene;
                if (!scene) {
                    console.error("❌ shideFuxny.Lion.scene not set");
                    return;
                }
                for (const [key, val] of Object.entries(shideFuxny.NIGHT)) {
                    if (typeof val === "object" && val !== null) {
                        for (const nestedVal of Object.values(val)) {
                            if (nestedVal === scene) {
                                console.log(`✅ Found scene in noa["${key}"]`);
                                shideFuxny.rendering = val;
                                return;
                            }
                        }
                    }
                }
            })();
    */
function findOnlysendBytes(obj) {
  if (!obj) {
    console.warn("❌ Provided object is null or undefined.");
    return null;
  }
  const proto = Object.getPrototypeOf(obj);
  const props = Object.getOwnPropertyNames(proto);
  for (const key of props) {
    if (key === 'constructor') continue;
    const val = proto[key];
    if (typeof val === 'function') {
      const str = val.toString();
      // Looser but effective pattern detection
      const looksLikesendBytes =
        val.length === 2 &&
        /Protocol\.ROOM_DATA_BYTES/i.test(str) &&
        str.includes('Uint8Array') &&
        /typeof/.test(str) && // just check any typeof usage
        str.includes('.encode') &&
        (str.includes('.byteLength') || str.includes('.length')) &&
        str.includes('.set');
      if (looksLikesendBytes) {
        console.log(`✅ Real sendBytes found: ${key}`);
        return key;
      }
    }
  }
  console.warn("❌ sendBytes function not found.");
  return null;
}
// Usage
colyRoom = r.values(shideFuxny.bloxd.client.msgHandler)[0];
sendBytesName = findOnlysendBytes(colyRoom);
  if (!colyRoom || typeof colyRoom[sendBytesName] !== "function") {
    console.warn("[Blink] colyRoom or sendBytes not ready.");
  }
blinkState = {
    enabled: false,
    originalSendBytes: colyRoom[sendBytesName],
    queued: [],
    interval: 0,
    noPacket: false
  };
    startTargetFinder()
function setupKillAuraBox() {
    newBox = shideFuxny.Lion.Mesh.CreateBox("mesh", .5, false, 1, shideFuxny.Lion.scene);
    newBox.renderingGroupId = 1;
    newBoxId = shideFuxny.entities.add([0, 10, 0], null, null, newBox);
    //newBox.Da = true;
    newBox.material = new shideFuxny.Lion.StandardMaterial("mat", shideFuxny.Lion.scene);
    newBox.material.diffuseColor = new shideFuxny.Lion.Color3(1, 1, 1);
    newBox.material.emissiveColor = new shideFuxny.Lion.Color3(1, 1, 1);
    newBox.name = 'BodyMesh';
    newBox.id = 'BodyMesh';
    newBox.isVisible = false;
    if (!newBox.metadata) newBox.metadata = {};
    // Find null key
    __nullKey = null;
    for (const key in newBox) {
        if (key.length === 2 && newBox[key] === null) {
            __nullKey = key;
            break;
        }
    }
    if (__nullKey) {
        newBox[__nullKey] = false;
    }
    shideFuxny.entityList = r.values(shideFuxny.NIGHT)[30]
    humanoidMeshlist = shideFuxny.entities[shideFuxny.impKey]?.humanoidMesh?.list;
    __stringKey = null;
    if (Array.isArray(humanoidMeshlist)) {
        outerLoop: for (const obj of humanoidMeshlist) {
            for (const key in obj) {
                if (typeof obj[key] === "string") {
                    __stringKey = key;
                    break outerLoop;
                }
            }
        }
    }
    else {
        console.error("❌ Invalid humanoidMeshlist path.");
    }
    // Follow loop
    function followHeadLoop() {
        if (newBox) {
            const playerId = 1;
            const playerPosState = shideFuxny.entities.getState(playerId, "position");
            if (playerPosState && Array.isArray(playerPosState.position)) {
                const [x, y, z] = playerPosState.position;
                const newPos = [x, y + 1.5, z];
                shideFuxny.entities.setPosition(newBoxId, newPos);
            } else {
                console.error("Player position not found or invalid");
            }
        }
        animationFrameId = requestAnimationFrame(followHeadLoop);
    }
    // Start the loop
    animationFrameId = requestAnimationFrame(followHeadLoop);
}
setupKillAuraBox();
    passiveFeatures();
    document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "g") {
        for (const key in shideFuxny.bloxd.entityNames) {
            if (key === "1") continue;
            const nameObj = shideFuxny.bloxd.entityNames[key];
            const state = shideFuxny.entities.getState(key, 'position');
            if (!state || !state.position) continue;
            const pos = state.position;
            const x = Math.round(pos[0]);
            const y = Math.round(pos[1]);
            const z = Math.round(pos[2]);
            // Remove existing position suffix if any (like "Name (x, y, z)")
            const baseName = nameObj.entityName.replace(/\s*\(\-?\d+,\s*\-?\d+,\s*\-?\d+\)$/, "");
            // Update with new position
            nameObj.entityName = `${baseName} (${x}, ${y}, ${z})`;
        }
    }
});
    const visitedTags = new WeakSet();
    function findParentOfNameTag(obj, path = '') {
        if (typeof obj !== 'object' || obj === null || visitedTags.has(obj)) return null;
        visitedTags.add(obj);
        for (const key in obj) {
            if (!Object.hasOwn(obj, key)) continue;
            try {
                const value = obj[key];
                const currentPath = path + (Array.isArray(obj) ? `[${key}]` : (path ? '.' : '') + key);
                if (value && typeof value === 'object' && value.id === '1NameTag') {
                    console.log("✅ Path to NameTag parent:", currentPath);
                    return obj;
                }
                const result = findParentOfNameTag(value, currentPath);
                if (result) return result;
            } catch {}
        }
        return null;
    }
    cachedNameTagParent = shideFuxny.Lion.scene //findParentOfNameTag(shideFuxny.world[shideFuxny.impKey].hash)     Все ебать.
    // Run the function every 15 seconds
    setInterval(makeHitboxes, 1000);
}

function findElementByText(text) {
    const all = document.querySelectorAll('div, span, button, a');
    for (const el of all)
        if (el.textContent.trim() === text) return el;
    return null;
}

function clickTeleportButton() {
    const teleportButtonText = findElementByText('Teleport To Lobby Spawn');
    if (teleportButtonText) {
        let clickable = teleportButtonText;
        while (clickable && !clickable.onclick && clickable.tagName !== 'BUTTON') clickable = clickable.parentElement;
        if (clickable) {
            console.log('Clicking teleport button:', clickable);
            clickable.click();
        } else {
            console.warn('No clickable parent found, trying to click text element itself');
            teleportButtonText.click();
        }
    } else console.warn('Teleport button text not found in DOM');
}

function toggleAutoPot() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    autoPotionEnabled = !autoPotionEnabled;
    if (autoPotionEnabled) {
        autoPotionInterval = setInterval(movePotionToSlot, 1000);
        console.log("AutoPotion enabled");
    } else {
        clearInterval(autoPotionInterval);
        autoPotionInterval = null;
        console.log("AutoPotion disabled");
    }
    updateAutoPotButton();
}

function toggleNameTags() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.nameTagsEnabled = true;
    nameTagsEnabled = !nameTagsEnabled;
    if (nameTagsEnabled) {
        if (!cachedNameTagParent) {
            nameTagsEnabled = false;
            return;
        }
        nameTagParent = cachedNameTagParent;
        nameTagsIntervalId = setInterval(() => {
            const entityList = shideFuxny.entityList;
            if (!entityList || typeof entityList !== 'object') return;
            for (const subGroup of Object.values(entityList)) {
                if (!subGroup || typeof subGroup !== 'object') continue;
                for (const obj of Object.values(subGroup)) {
                    if (obj?.lobbyLeaderboardValues) {
                        try {
                            const descTag = Object.getOwnPropertyDescriptor(obj, 'hasPriorityNametag');
                            if (!descTag || descTag.configurable) {
                                Object.defineProperty(obj, 'hasPriorityNametag', {
                                    get() {
                                        return true;
                                    },
                                    set(val) {
                                        if (val !== true) {}
                                    },
                                    configurable: true
                                });
                            }
                            const descSee = Object.getOwnPropertyDescriptor(obj, 'canSee');
                            if (!descSee || descSee.configurable) {
                                Object.defineProperty(obj, 'canSee', {
                                    get() {
                                        return true;
                                    },
                                    set(val) {
                                        if (val !== true) {}
                                    },
                                    configurable: true
                                });
                            }
                        } catch (e) {}
                    }
                }
            }
            for (const key in nameTagParent) {
                const tag = nameTagParent;
                if (tag && typeof tag === 'object' && typeof tag.id === 'string' && tag.id.includes('NameTag')) {
                    try {
                        const descVisible = Object.getOwnPropertyDescriptor(tag, '_isVisible');
                        if (!descVisible || descVisible.configurable) {
                            Object.defineProperty(tag, '_isVisible', {
                                get() {
                                    return true;
                                },
                                set(val) {
                                    if (val !== true) {}
                                },
                                configurable: true
                            });
                        }
                        const descRenderGroup = Object.getOwnPropertyDescriptor(tag, 'renderingGroupId');
                        if (!descRenderGroup || descRenderGroup.configurable) {
                            Object.defineProperty(tag, 'renderingGroupId', {
                                get() {
                                    return 3;
                                },
                                set(val) {
                                    if (val !== 3) {}
                                },
                                configurable: true
                            });
                        }
                    } catch (e) {}
                }
            }
        }, 15000);
        console.log("✅ NameTag visibility lock: ON");
    } else {
        clearInterval(nameTagsIntervalId);
        nameTagsIntervalId = null;
        if (nameTagParent) {
            for (const key in nameTagParent) {
                const tag = nameTagParent[key];
                if (tag && typeof tag === 'object' && typeof tag.id === 'string' && tag.id.includes('NameTag')) {
                    try {
                        const current = tag._isVisible;
                        delete tag._isVisible;
                        tag._isVisible = current;
                    } catch (e) {
                        console.warn("Failed to unlock _isVisible on", tag);
                    }
                }
            }
        }
        nameTagParent = null;
        console.log("🟡 NameTag visibility lock: OFF");
    }
    updateNameTagsButton();
}

function toggleBHOP() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.bhopEnabled = true;
    bhopEnabled = !bhopEnabled;
    if (bhopEnabled) {
        if (!moveState || !physState) {
            console.warn("❌ BHOP references not initialized. Did you inject?");
            bhopEnabled = false;
            return;
        }
        bhopIntervalId = setInterval(bunnyHop, 10); //was 60
        console.log("BHOP: ON");
    } else {
        clearInterval(bhopIntervalId);
        bhopIntervalId = null;
        console.log("BHOP: OFF");
    }
    updateBHOPButton();
}
  const toggleBlink = (interval = 0, noPacket = false) => {
    blinkState.enabled = !blinkState.enabled;
    blinkState.interval = interval;
    blinkState.noPacket = noPacket;
    if (blinkState.enabled) {
      console.log(`[Blink] ENABLED — interval: ${interval}, noPacket: ${noPacket}`);
      colyRoom[sendBytesName] = (...args) => {
        const [J, T] = args;
        const send = () => blinkState.originalSendBytes.call(colyRoom, J, T);
        if (interval > 0) {
          setTimeout(send, interval);
        } else {
          blinkState.queued.push([J, T]);
        }
      };
    } else {
      console.log(`[Blink] DISABLED — sending ${blinkState.queued.length} packets.`);
      for (const [J, T] of blinkState.queued) {
        blinkState.originalSendBytes.call(colyRoom, J, T);
      }
      colyRoom[sendBytesName] = blinkState.originalSendBytes;
      blinkState.queued = [];
    }
  };
function toggleBlinkWrapper() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    everEnabled.blinkEnabled = true;
    toggleBlink();
    updateBlinkButton();
}
// ⛏ BHOP logic
function bunnyHop() {
    if (!bhopEnabled || !physState.isOnGround?.() || moveState.crouching || moveState.speed < 0.05) return;
    moveState.jumping = true;
    physState._hadJumpInputPrevTick = false;
    setTimeout(() => {
        moveState.jumping = false;
    }, 20);
}

//////////////////////////////////////////////////////////////////////////////////////GUI
document.getElementById("rndAsciiGUI")?.remove();
document.getElementById("rndAsciiGUI_minimized")?.remove();
let miniPos = {
    left: 10,
    top: 10
};
let accent = {
    color: defaultColor,
    alpha: 1
};
let bg = {
    color: defaultBackGroundColor,
    alpha: defaultBackGroundTransparency,
    blur: defaultBackGroundBlur
};
let isGuiVisible = true;
let minimizedIcon = null;
const style = document.createElement("style");
style.textContent = `
  :root {
    --accent-color: ${defaultColor};
    --accent-gradient: ${defaultGradient};
    --accent-hover-color: ${defaultColor};
  }
  .gradient-indicator {
    background: var(--accent-gradient);
  }
  #rndAsciiGUI {
    position: fixed;
    top: 10vh;
    left: 10vw;
    width: 70vw; /* Changed to 70vw for horizontal layout */
    height: auto;
    z-index: 999999;
    border-radius: 8px;
    overflow: hidden;
    font-family: sans-serif;
    pointer-events: none;
  }
  #rndAsciiTopBar {
    height: 40px;
    background: var(--accent-gradient);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    cursor: move;
    pointer-events: auto;
  }
  #rndAsciiTopBar img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border-radius: 4px;
  }
  #rndAsciiTopBarTitle {
    display: flex;
    align-items: center;
    pointer-events: auto;
  }
  #rndAsciiMinBtn {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0 10px;
    pointer-events: auto;
  }
  #rndAsciiContent {
    display: flex;
    flex-direction: column; /* Changed to column for horizontal layout */
    height: auto;
    pointer-events: auto;
  }
  #rndAsciiPageButtons {
    display: flex;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    padding: 5px;
    border-bottom: 1px solid var(--accent-color);
  }
.rndAsciiPageBtn {
    box-sizing: border-box;
    padding: 8px 15px;
    color: rgba(255, 255, 255, 0.8);
    background: none;
    text-align: center;
    position: relative;
    cursor: pointer;
    outline: none;
    border: none;
    box-shadow: none;
    transition: all 0.2s;
    pointer-events: auto;
    font-size: 14px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: 0 3px;
  }
  .rndAsciiPageBtn.active {
    font-weight: bold;
    background: rgba(255, 255, 255, 0.1);
  }
  .rndAsciiPageBtn:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  .rndAsciiPageBtn.indicatorLine {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px
    width: 0%;
    background: var(--accent-gradient);
    transition: width 0.3s;
    border-radius: 2px;
}
  #rndAsciiPage {
    flex: 1;
    padding: 20px;
    color: white;
    overflow-y: auto;
    pointer-events: auto;
    max-height: 60vh; /* Limit height for content area */
  }
  #rndAsciiGUI_minimized {
    position: fixed;
    width: 32px;
    height: 32px;
    background: var(--accent-gradient);
    border-radius: 4px;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    user-select: none;
    pointer-events: auto;
  }
  #rndAsciiGUI_minimized img {
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
  .rndAsciiGroup {
    margin-bottom: 20px;
  }
  .rndAsciiGroup label {
    display: block;
    margin-bottom: 4px;
    font-weight: bold;
  }
  input[type="range"] {
    width: 100%;
    accent-color: var(--accent-color, ${defaultColor});
    pointer-events: auto;
  }
  input[type="color"] {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    outline: none;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    pointer-events: auto;
  }
  input[type="text"] {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    outline: none;
    height: 30px;
    border-radius: 4px;
    color: white;
    padding: 0 10px;
    pointer-events: auto;
  }
.gradient-border {
  position: relative;
  color: white;
  background-color: transparent;
  border: none; /* Remove the border from the main element */
  border-radius: 8px;
  cursor: pointer;
  z-index: 0;
}
`;
document.head.appendChild(style);
const gui = document.createElement("div");
gui.id = "rndAsciiGUI";
document.body.appendChild(gui);
const topHTML = `
  <style>
    #rndAsciiTopBarTitle span {
  text-shadow:
    0 0 5px rgba(255, 255, 255, 0.9),
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 15px rgba(255, 255, 255, 0.7);
}
  </style>
  <div id="rndAsciiTopBar">
    <div id="rndAsciiTopBarTitle">
      <img src="${ICON_URL}" alt="icon">
      <span>${TITLE}</span>
    </div>
    <button id="rndAsciiMinBtn">_</button>
  </div>
`;
const contentHTML = `
          <div id="rndAsciiContent">
            <div id="rndAsciiPageButtons"></div>
            <div id="rndAsciiPage"></div>
          </div>
        `;
gui.innerHTML = topHTML + contentHTML;
const pageButtons = gui.querySelector("#rndAsciiPageButtons");
const page = gui.querySelector("#rndAsciiPage");
const waterJumpBtn = createButton("Water Jump")
const hitboxBtn = createButton("Hitbox");
const wireframeBtn = createButton("Wireframes");
const espBtn = createButton("ESP");
const bhopBtn = createButton("BHOP");
const enemyHealthGuiBtn = createButton("Enemy Healh Bar")
const blinkBtn = createButton("Blink");
const chestESPBtn = createButton("Chest ESP");
const oreESPBtn = createButton("Ore ESP");
const nameTagBtn = createButton("Nametags")
const killAuraBtn = createButton("Kill Aura")
const skyBoxBtn = createButton("Night")
const wallJumpBtn = createButton("Wall Jump")
const triggerBotBtn = createButton("TriggerBot")
const pickupReachBtn = createButton("Pickup Reach")
const autoPotBtn = createButton("Auto Potion")
const knifeBtn = createButton("BHOP Knife")
const bigHeadsBtn = createButton("BIGHEADS")
const scaffoldBtn = createButton("Scaffold")
const slowHitBtn = createButton("Slow Hit")
const aimbotBtn = createButton("Aimbot")
const noLagBtn = createButton("No Lag")
const antiBanBtn = createButton("AntiBan")
const autoSprintBtn = createButton("Auto Sprint")
const autoBreakBtn = createButton("Auto Break")
const autoPlaceBtn = createButton("Auto Place")
const autoClickerBtn = createButton("Auto Clicker")
const crouchSpeedBtn = createButton("Crouch Speed")
const speedBtn = createButton("Speed 2x")
const reachBtn = createButton("Reach")
const pageNames = [
    "Inject & Enumerate",
    "Combat",
    "Movement",
    "Visual",
    "World",
    "Settings"
];
const customizationElements = [];
const pageBtns = [];
const pageContents = [
    [],
    [hitboxBtn, killAuraBtn, triggerBotBtn, enemyHealthGuiBtn, autoPotBtn, bigHeadsBtn, slowHitBtn, aimbotBtn, antiBanBtn, autoBreakBtn, autoPlaceBtn, autoClickerBtn, reachBtn],
    [bhopBtn, knifeBtn, blinkBtn, waterJumpBtn, wallJumpBtn, autoSprintBtn, crouchSpeedBtn, speedBtn],
    [chestESPBtn, oreESPBtn, wireframeBtn, espBtn, nameTagBtn],
    [pickupReachBtn, skyBoxBtn, scaffoldBtn, noLagBtn],
    customizationElements
];
function createButton(label) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'rndAsciiBtn';
    btn.style.width = 'calc(100% - 10px)';
    btn.style.padding = '12px 10px';
    btn.style.position = 'relative';
    btn.style.margin = '3px 5px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    btn.style.color = 'rgba(255, 255, 255, 0.8)';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.textAlign = 'left';
    btn.style.height = '50px';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.transition = 'all 0.2s';
    const indicatorLine = document.createElement('div');
    indicatorLine.className = 'indicatorLine gradient-indicator';
    indicatorLine.style.position = 'absolute';
    indicatorLine.style.bottom = '0';
    indicatorLine.style.left = '0';
    indicatorLine.style.width = '0%';
    indicatorLine.style.setProperty('height', '4px', 'important');
    indicatorLine.style.transition = 'width 0.3s';
    btn.appendChild(indicatorLine);
    btn.indicatorLine = indicatorLine;
    btn.onmouseenter = function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    };
    btn.onmouseleave = function() {
        if (!this.classList.contains('active')) {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
    };
    return btn;
}
function createPageButton(label) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'rndAsciiPageBtn';
    btn.style.position = 'relative';
    btn.style.margin = '0 5px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    btn.style.color = 'rgba(255, 255, 255, 0.8)';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.textAlign = 'center';
    btn.style.height = 'auto';
    btn.style.padding = '8px 15px';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.transition = 'all 0.2s';
    const indicatorLine = document.createElement('div');
    indicatorLine.className = 'indicatorLine gradient-indicator';
    indicatorLine.style.position = 'absolute';
    indicatorLine.style.bottom = '0';
    indicatorLine.style.left = '0';
    indicatorLine.style.width = '0%';
    indicatorLine.style.height = '3px';
    indicatorLine.style.transition = 'width 0.3s';
    btn.appendChild(indicatorLine);
    btn.indicatorLine = indicatorLine;
    btn.onmouseenter = function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    };
    btn.onmouseleave = function() {
        if (!this.classList.contains('active')) {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
    };
    return btn;
}
for (let i = 0; i < pageNames.length; i++) {
    const btn = createPageButton(pageNames[i]);
    btn.indicatorLine.style.display = i === 0 ? "block" : "none";
    btn.onclick = () => {
        // Clear existing active styles
        pageBtns.forEach((b) => {
            b.classList.remove("active");
            b.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            b.style.fontWeight = "normal";
            b.indicatorLine.style.width = "0%";
        });
        // Apply active styles to current button
        btn.classList.add("active");
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
        btn.style.fontWeight = "bold";
        btn.indicatorLine.style.width = "100%";
        // Clear current page content
        page.innerHTML = "";
        // Load appropriate page
        if (i === 0) {
            createPageOneContent(); // Inject page
        } else if (i === 5) {
            showCustomizationPage();
            pageContents[i].forEach(el => page.appendChild(el));
        } else {
            pageContents[i].forEach(el => page.appendChild(el));
        }
    };
    if (i === 0) btn.classList.add("active");
    pageButtons.appendChild(btn);
    pageBtns.push(btn);
}
pageContents[0].forEach(el => page.appendChild(el));
function showCustomizationPage() {
    customizationElements.length = 0;
    const keybindGroup = document.createElement("div");
    keybindGroup.className = "rndAsciiGroup";
    keybindActions.forEach((bind) => {
        const bindLabel = document.createElement("label");
        bindLabel.textContent = `${bind.name} Keybind`;
        const bindInput = document.createElement("input");
        bindInput.type = "text";
        bindInput.value = bind.code;
        bindInput.dataset.name = bind.name;
        bindInput.style.outline = "none"; // Remove default focus outline
        bindInput.addEventListener("focus", () => {
            // Handler for keyboard keys
            const handleKeyDown = (event) => {
                event.preventDefault();
                const newKey = event.code;  // Keyboard key code like "KeyA", "ArrowUp"
                setNewKeybind(newKey);
            };
            // Handler for mouse buttons
            const handleMouseDown = (event) => {
                event.preventDefault();
                let newKey = null;
                switch(event.button) {
                    case 0: newKey = "MouseLeft"; break;
                    case 1: newKey = "MouseMiddle"; break;
                    case 2: newKey = "MouseRight"; break;
                    default: newKey = `MouseButton${event.button}`;
                }
                setNewKeybind(newKey);
            };
            // Common function to update keybind and cleanup listeners
            function setNewKeybind(newKey) {
                bindInput.value = newKey;
                const actionIndex = keybindActions.findIndex((action) => action.name === bind.name);
                if (actionIndex !== -1) {
                    keybindActions[actionIndex].code = newKey;
                    localStorage.setItem("customKeybinds_v1", JSON.stringify(
                        keybindActions.map(({ name, code }) => ({ name, code }))
                    ));
                }
                document.removeEventListener("keydown", handleKeyDown);
                document.removeEventListener("mousedown", handleMouseDown);
                bindInput.blur();
            }
            // Listen for either keyboard or mouse input once
            document.addEventListener("keydown", handleKeyDown, { once: true });
            document.addEventListener("mousedown", handleMouseDown, { once: true });
        });
        keybindGroup.appendChild(bindLabel);
        keybindGroup.appendChild(bindInput);
    });
    // Aimbot settings
    const aimbotGroup = document.createElement("div");
    aimbotGroup.className = "rndAsciiGroup";
    aimbotGroup.innerHTML = "<h3>Aimbot Settings</h3>";
    // Smoothness setting
    const smoothnessLabel = document.createElement("label");
    smoothnessLabel.textContent = "Aimbot Smoothness";
    const smoothnessInput = document.createElement("input");
    smoothnessInput.type = "range";
    smoothnessInput.min = "0.05";
    smoothnessInput.max = "0.5";
    smoothnessInput.step = "0.05";
    smoothnessInput.value = aimbotSmoothness;
    smoothnessInput.addEventListener("input", function() {
        aimbotSmoothness = parseFloat(this.value);
    });
    aimbotGroup.appendChild(smoothnessLabel);
    aimbotGroup.appendChild(smoothnessInput);
    // FOV setting
    const fovLabel = document.createElement("label");
    fovLabel.textContent = "Aimbot FOV";
    const fovInput = document.createElement("input");
    fovInput.type = "range";
    fovInput.min = "30";
    fovInput.max = "180";
    fovInput.step = "10";
    fovInput.value = aimbotFOV;
    fovInput.addEventListener("input", function() {
        aimbotFOV = parseInt(this.value);
    });
    aimbotGroup.appendChild(fovLabel);
    aimbotGroup.appendChild(fovInput);
    // Distance setting
    const distanceLabel = document.createElement("label");
    distanceLabel.textContent = "Aimbot Distance";
    const distanceInput = document.createElement("input");
    distanceInput.type = "range";
    distanceInput.min = "5";
    distanceInput.max = "50";
    distanceInput.step = "5";
    distanceInput.value = aimbotDistance;
    distanceInput.addEventListener("input", function() {
        aimbotDistance = parseInt(this.value);
    });
    aimbotGroup.appendChild(distanceLabel);
    aimbotGroup.appendChild(distanceInput);
    // Visible only setting
    const visibleLabel = document.createElement("label");
    visibleLabel.textContent = "Target Visible Only";
    const visibleInput = document.createElement("input");
    visibleInput.type = "checkbox";
    visibleInput.checked = aimbotVisibleOnly;
    visibleInput.addEventListener("change", function() {
        aimbotVisibleOnly = this.checked;
    });
    aimbotGroup.appendChild(visibleLabel);
    aimbotGroup.appendChild(visibleInput);
    // Auto Trigger setting (Melon Hub feature)
    const autoTriggerLabel = document.createElement("label");
    autoTriggerLabel.textContent = "Auto Trigger";
    const autoTriggerInput = document.createElement("input");
    autoTriggerInput.type = "checkbox";
    autoTriggerInput.checked = aimbotAutoTrigger;
    autoTriggerInput.addEventListener("change", function() {
        aimbotAutoTrigger = this.checked;
    });
    aimbotGroup.appendChild(autoTriggerLabel);
    aimbotGroup.appendChild(autoTriggerInput);
    // AntiBan settings
    const antiBanGroup = document.createElement("div");
    antiBanGroup.className = "rndAsciiGroup";
    antiBanGroup.innerHTML = "<h3>AntiBan Settings</h3>";
    // Attack delay min setting
    const delayMinLabel = document.createElement("label");
    delayMinLabel.textContent = "Min Attack Delay (ms)";
    const delayMinInput = document.createElement("input");
    delayMinInput.type = "range";
    delayMinInput.min = "50";
    delayMinInput.max = "500";
    delayMinInput.step = "10";
    delayMinInput.value = ANTI_BAN_ATTACK_DELAY_MIN;
    delayMinInput.addEventListener("input", function() {
        ANTI_BAN_ATTACK_DELAY_MIN = parseInt(this.value);
    });
    antiBanGroup.appendChild(delayMinLabel);
    antiBanGroup.appendChild(delayMinInput);
    // Attack delay max setting
    const delayMaxLabel = document.createElement("label");
    delayMaxLabel.textContent = "Max Attack Delay (ms)";
    const delayMaxInput = document.createElement("input");
    delayMaxInput.type = "range";
    delayMaxInput.min = "100";
    delayMaxInput.max = "1000";
    delayMaxInput.step = "10";
    delayMaxInput.value = ANTI_BAN_ATTACK_DELAY_MAX;
    delayMaxInput.addEventListener("input", function() {
        ANTI_BAN_ATTACK_DELAY_MAX = parseInt(this.value);
    });
    antiBanGroup.appendChild(delayMaxLabel);
    antiBanGroup.appendChild(delayMaxInput);
    // Max attacks per second setting
    const maxAttacksLabel = document.createElement("label");
    maxAttacksLabel.textContent = "Max Attacks Per Second";
    const maxAttacksInput = document.createElement("input");
    maxAttacksInput.type = "range";
    maxAttacksInput.min = "1";
    maxAttacksInput.max = "10";
    maxAttacksInput.step = "1";
    maxAttacksInput.value = ANTI_BAN_MAX_ATTACKS_PER_SECOND;
    maxAttacksInput.addEventListener("input", function() {
        ANTI_BAN_MAX_ATTACKS_PER_SECOND = parseInt(this.value);
    });
    antiBanGroup.appendChild(maxAttacksLabel);
    antiBanGroup.appendChild(maxAttacksInput);
    // Scrollable wrapper container to fix vertical overflow
    const wrapper = document.createElement("div");
    wrapper.style.maxHeight = "70vh";       // Limit height to 70% of viewport height
    wrapper.style.overflowY = "auto";       // Enable vertical scrolling when needed
    wrapper.style.padding = "10px";
    wrapper.style.margin = "10px 0";
    wrapper.style.border = "1px solid #ccc"; // Optional border for clarity
    wrapper.appendChild(keybindGroup);
    wrapper.appendChild(aimbotGroup);
    wrapper.appendChild(antiBanGroup);
    customizationElements.push(wrapper);
}
showCustomizationPage();
function applyTheme() {
    const accentRGBA = hexToRgba(accent.color, accent.alpha);
    const bgRGBA = hexToRgba(bg.color, bg.alpha);
    gui.style.setProperty("--accent-color", accent.color);
    gui.style.setProperty("--accent-gradient", defaultGradient);
    gui.style.background = bgRGBA;
    gui.style.backdropFilter = `blur(${bg.blur}px)`;
    // Apply the gradient to the minimized icon
    const minimizedIcon = document.getElementById("rndAsciiGUI_minimized");
    if (minimizedIcon) {
        minimizedIcon.style.background = `var(--accent-gradient)`;
    }
    // Apply the gradient to the indicator lines
    const indicatorLines = document.querySelectorAll(".indicatorLine");
    indicatorLines.forEach(line => {
        line.style.background = `var(--accent-gradient)`;
    });
    // Apply the gradient to all buttons
    // const buttons = document.querySelectorAll(".rndAsciiBtn");
    //  buttons.forEach(button => {
    //   button.style.background = `var(--accent-gradient)`;
    // });
    // I DIDNT WANT GRADIENT HERE
    const draggableAreas = document.querySelectorAll(".draggable-area");
    draggableAreas.forEach(area => {
        area.style.background = `var(--accent-gradient)`;
    });
}
// Helper function to get a complementary color
function getComplementaryColor(hex) {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Calculate complementary color
    const compR = (255 - r).toString(16).padStart(2, '0');
    const compG = (255 - g).toString(16).padStart(2, '0');
    const compB = (255 - b).toString(16).padStart(2, '0');
    return `#${compR}${compG}${compB}`;
}
function hexToRgba(hex, alpha = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
applyTheme();
const topBar = gui.querySelector("#rndAsciiTopBar");
let dragging = false,
    offsetX = 0,
    offsetY = 0;
topBar.addEventListener("mousedown", (e) => {
    if (e.target.id === "rndAsciiMinBtn") return;
    dragging = true;
    const rect = gui.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.stopPropagation();
});
document.addEventListener("mousemove", (e) => {
    if (dragging) {
        gui.style.left = `${e.clientX - offsetX}px`;
        gui.style.top = `${e.clientY - offsetY}px`;
    }
});
document.addEventListener("mouseup", () => {
    dragging = false;
});
gui.querySelector("#rndAsciiMinBtn").onclick = () => {
    gui.style.display = "none";
    isGuiVisible = false;
    showMinimizedIcon();
};
function showMinimizedIcon() {
    minimizedIcon = document.createElement("div");
    minimizedIcon.id = "rndAsciiGUI_minimized";
    minimizedIcon.className = "minimized-icon";
    minimizedIcon.style.left = `${miniPos.left}px`;
    minimizedIcon.style.top = `${miniPos.top}px`;
    minimizedIcon.style.position = "fixed";
    minimizedIcon.style.width = "32px";
    minimizedIcon.style.height = "32px";
    minimizedIcon.style.background = accent.color; // Set the background color here
    minimizedIcon.style.borderRadius = "4px";
    minimizedIcon.style.zIndex = "130";
    minimizedIcon.style.display = "flex";
    minimizedIcon.style.alignItems = "center";
    minimizedIcon.style.justifyContent = "center";
    minimizedIcon.style.cursor = "move";
    minimizedIcon.style.userSelect = "none";
    minimizedIcon.style.pointerEvents = "auto";
    // Create a separate draggable area
    const draggableArea = document.createElement("div");
    draggableArea.className = "draggable-area";
    draggableArea.style.width = "100%";
    draggableArea.style.height = "100%";
    draggableArea.style.position = "absolute";
    draggableArea.style.cursor = "move";
    draggableArea.style.borderRadius = "4px";
    // Create the image element
    const img = document.createElement("img");
    img.src = ICON_URL;
    img.alt = "icon";
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.borderRadius = "4px";
    img.style.pointerEvents = "none";
    minimizedIcon.appendChild(draggableArea);
    minimizedIcon.appendChild(img);
    document.body.appendChild(minimizedIcon);
    let draggingMini = false;
    let clickStart = 0;
    let offsetX = 0;
    let offsetY = 0;
    draggableArea.addEventListener("mousedown", (e) => {
        draggingMini = true;
        const rect = minimizedIcon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        clickStart = Date.now();
        e.stopPropagation();
    });
    document.addEventListener("mousemove", (e) => {
        if (draggingMini) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            minimizedIcon.style.left = `${x}px`;
            minimizedIcon.style.top = `${y}px`;
            miniPos = {
                left: x,
                top: y
            };
        }
    });
    document.addEventListener("mouseup", (e) => {
        if (!draggingMini) return;
        draggingMini = false;
        const moved = Math.abs(e.clientX - (miniPos.left + offsetX)) > 4 ||
            Math.abs(e.clientY - (miniPos.top + offsetY)) > 4;
        const shortClick = (Date.now() - clickStart) < 200;
        if (!moved && shortClick) {
            gui.style.display = "block";
            isGuiVisible = true;
            minimizedIcon.remove();
        }
    });
}
// Dynamic Color-Changing Watermark and ArrayList
const watermark = document.createElement("div");
watermark.id = "vape-watermark";
watermark.style.position = "fixed";
watermark.style.top = "10px";
watermark.style.right = "10px";
watermark.style.zIndex = "999998";
watermark.style.fontFamily = "monospace";
watermark.style.fontSize = "14px";
watermark.style.pointerEvents = "none";
watermark.style.userSelect = "none";
watermark.style.display = "flex";
watermark.style.flexDirection = "column";
watermark.style.alignItems = "flex-end";
// Create the main Vape text
const vapeText = document.createElement("div");
vapeText.textContent = "Vape v4";
vapeText.style.fontWeight = "bold";
vapeText.style.fontSize = "16px";
vapeText.style.marginBottom = "5px";
watermark.appendChild(vapeText);
// Create the arraylist container
const arraylist = document.createElement("div");
arraylist.id = "vape-arraylist";
arraylist.style.display = "flex";
arraylist.style.flexDirection = "column";
arraylist.style.alignItems = "flex-end";
watermark.appendChild(arraylist);
document.body.appendChild(watermark);
// Color changing functionality - Updated to 5ms interval
let hue = 0;
const colorChangeInterval = setInterval(() => {
    hue = (hue + 1) % 360;
    const color = `hsl(${hue}, 100%, 50%)`;
    // Update Vape text color
    vapeText.style.color = color;
    vapeText.style.textShadow = `0 0 5px ${color}`;
    // Update arraylist items color
    const items = arraylist.children;
    for (let i = 0; i < items.length; i++) {
        items[i].style.color = color;
        items[i].style.textShadow = `0 0 5px ${color}`;
    }
}, 5); // Changed from 40ms to 5ms
// Function to update the arraylist content
function updateArrayList() {
    arraylist.innerHTML = ""; // Clear current list
    const features = [
        { enabled: antiBanEnabled, name: "AntiBan" },
        { enabled: aimbotEnabled, name: "Aimbot" },
        { enabled: killAuraEnabled, name: "KillAura" },
        { enabled: triggerBotEnabled, name: "TriggerBot" },
        { enabled: espEnabled, name: "ESP" },
        { enabled: wireFramesBool, name: "Wireframe" },
        { enabled: bhopEnabled, name: "BHOP" },
        { enabled: scaffoldEnabled, name: "Scaffold" },
        { enabled: noLagEnabled, name: "NoLag" },
        { enabled: autoSprintEnabled, name: "AutoSprint" },
        { enabled: autoBreakEnabled, name: "AutoBreak" },
        { enabled: autoPlaceEnabled, name: "AutoPlace" },
        { enabled: autoClickerEnabled, name: "AutoClicker" },
        { enabled: nameTagsEnabled, name: "NameTags" },
        { enabled: chestESPEnabled, name: "ChestESP" },
        { enabled: oreESPEnabled, name: "OreESP" },
        { enabled: waterJumpingEnabled, name: "WaterJump" },
        { enabled: wallJumpRunning, name: "WallJump" },
        { enabled: blinkState.enabled, name: "Blink" },
        { enabled: bigHeadsEnabled, name: "BigHeads" },
        { enabled: pickupReachEnabled, name: "PickupReach" },
        { enabled: enemyHealthGuiEnabled, name: "EnemyHealth" },
        { enabled: autoPotionEnabled, name: "AutoPotion" },
        { enabled: bhopKnifeEnabled, name: "BhopKnife" },
        { enabled: slowHitEnabled, name: "SlowHit" },
        { enabled: isSkyboxHidden, name: "Skybox" },
        { enabled: crouchSpeedEnabled, name: "CrouchSpeed" },
        { enabled: speedEnabled, name: "Speed" },
        { enabled: reachEnabled, name: "Reach" }
    ];
    // Add enabled features to the arraylist
    features.forEach(feature => {
        if (feature.enabled) {
            const featureElement = document.createElement("div");
            featureElement.textContent = feature.name;
            featureElement.style.marginTop = "2px";
            arraylist.appendChild(featureElement);
        }
    });
    // If no features are enabled, show a placeholder
    if (arraylist.children.length === 0) {
        const placeholder = document.createElement("div");
        placeholder.textContent = "Arraylist";
        placeholder.style.marginTop = "2px";
        placeholder.style.opacity = "0.5";
        arraylist.appendChild(placeholder);
    }
}
// Update the arraylist every second
setInterval(updateArrayList, 1000);
document.addEventListener("keydown", (e) => {
    if (e.key === openKey) {
        if (isGuiVisible) {
            gui.style.display = "none";
            isGuiVisible = false;
            showMinimizedIcon();
            if (shideFuxny.Props.pointerLockWrapper) {
                shideFuxny.Props.pointerLockWrapper.removePointerUnlockRequest("Menu")
            }
        } else {
            gui.style.display = "block";
            isGuiVisible = true;
            if (minimizedIcon) minimizedIcon.remove();
            if (shideFuxny.Props.pointerLockWrapper) {
                shideFuxny.Props.pointerLockWrapper.requestPointerUnlock("Menu")
            }
        }
        updateArrayList(); // Update when toggling GUI
    }
});
document.addEventListener("keydown", (event) => {
    for (const bind of keybindActions) {
        // No need to check bind.type — just compare code strings
        if (event.code === bind.code) {
            event.preventDefault();
            console.log(`Triggered: ${bind.name} via key ${event.code}`);
            bind.action?.();
        }
    }
});
document.addEventListener("mousedown", (event) => {
    let buttonName;
    switch (event.button) {
        case 0: buttonName = "MouseLeft"; break;
        case 1: buttonName = "MouseMiddle"; break;
        case 2: buttonName = "MouseRight"; break;
        default: buttonName = `MouseButton${event.button}`;
    }
    for (const bind of keybindActions) {
        if (buttonName === bind.code) {
            event.preventDefault();
            console.log(`Triggered: ${bind.name} via ${buttonName}`);
            bind.action?.();
        }
    }
});
let injectButton = null;
function createPageOneContent() {
    const page = document.getElementById("rndAsciiPage");
    page.innerHTML = "";
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.height = "100%";
    // Inject Button
    injectButton = document.createElement("button");
    injectButton.textContent = injectedBool ? "Injected!" : "Waiting for game...";
    injectButton.className = "rndAsciiBtn gradient-border";
    injectButton.disabled = true;
    Object.assign(injectButton.style, {
        backgroundImage: defaultGradient,
        color: "#fff",
        border: "none",
        padding: "2px 12px",
        fontSize: "14px",
        textShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
        marginBottom: "8px",
        cursor: "pointer",
        width: "150px",
        height: "30px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    });
    injectButton.style.textShadow = `
        0 0 5px #fff,
        0 0 10px ${defaultColor},
        0 0 20px ${defaultColor},
        0 0 30px ${defaultColor}
    `;
    injectButton.onmouseenter = () => {
        injectButton.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
    };
    injectButton.onmouseleave = () => {
        injectButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    };
    injectButton.onmousedown = () => {
        injectButton.style.transform = "scale(0.98)";
    };
    injectButton.onmouseup = () => {
        injectButton.style.transform = "scale(1)";
    };
    injectButton.onclick = () => {
        try {
            findNoaAndKey();
            if (!shideFuxny.NIGHT) {
                console.warn("❌ Could not find noa");
                injectButton.textContent = "Failed";
                return;
            }
            console.log("Injection completed!");
            injectButton.textContent = "Injected!";
            injectedBool = true;
            applyTheme();
        } catch (err) {
            console.error("Error running findNoaAndKey:", err);
            injectButton.textContent = "Error";
            alert("Error running function. See console.");
        }
    };
    // Shared button style
    const buttonStyle = {
        backgroundColor: "#5865F2",
        color: "#fff",
        border: "none",
        padding: "2px 10px",
        fontSize: "12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        textShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
        height: "25px",
        boxSizing: "border-box",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: "6px"
    };
    const addHoverHandlers = (btn) => {
        btn.onmouseenter = () => {
            btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        };
        btn.onmouseleave = () => {
            btn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        };
        btn.onmousedown = () => {
            btn.style.transform = "scale(0.97)";
        };
        btn.onmouseup = () => {
            btn.style.transform = "scale(1)";
        };
    };
    // Discord Button
    const discordButton = document.createElement("button");
    discordButton.textContent = "Discord";
    discordButton.className = "rndAsciiBtn";
    Object.assign(discordButton.style, buttonStyle);
    discordButton.style.textShadow = `
        0 0 5px #fff,
        0 0 10px #5865F2,
        0 0 20px #5865F2,
        0 0 30px #5865F2
    `;
    discordButton.onclick = () => {
        window.open("https://discord.gg/G6ksFfQdaW", "_blank");
    };
    addHoverHandlers(discordButton);
    // Clear Cookies Button
    const clearCookiesButton = document.createElement("button");
    clearCookiesButton.textContent = "New Account";
    clearCookiesButton.className = "rndAsciiBtn";
    Object.assign(clearCookiesButton.style, {
        backgroundColor: "#e74c3c", // Red color you liked
        color: "#fff",
        border: "none",
        padding: "2px 10px",
        fontSize: "12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        textShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
        height: "25px",
        boxSizing: "border-box",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: "6px"
    });
    clearCookiesButton.style.textShadow = `
    0 0 5px #fff,
    0 0 10px #e74c3c,
    0 0 20px #e74c3c,
    0 0 30px #e74c3c
`;
clearCookiesButton.onclick = () => {
    window.onbeforeunload = null; // Disable unload warning
    const deleteCookie = (name, path = "/", domain = "") => {
        let cookieStr = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};`;
        if (domain) cookieStr += `domain=${domain};`;
        document.cookie = cookieStr;
    };
    const cookies = document.cookie.split(";");
    cookies.forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
        // Try to delete with several likely paths
        deleteCookie(name, "/");
        deleteCookie(name, "/path"); // if your site uses a subpath
        // Optional: attempt with domain if you're on a subdomain
        const hostname = location.hostname;
        const domainParts = hostname.split(".");
        if (domainParts.length > 2) {
            // Try to delete with base domain
            const baseDomain = domainParts.slice(-2).join(".");
            deleteCookie(name, "/", baseDomain);
        }
    });
    setTimeout(() => location.reload(), 150);
};
    addHoverHandlers(clearCookiesButton);
    // Append elements
    container.appendChild(injectButton);
    container.appendChild(discordButton);
    container.appendChild(clearCookiesButton);
    page.appendChild(container);
        let winDescriptors = Object.getOwnPropertyDescriptors(window);
        let wpName = Object.keys(winDescriptors).find(key => winDescriptors[key]?.set?.toString().includes("++"));
        let wpInstance = null;
        if (wpName) {wpInstance = window[wpName] = window[wpName]}
    if (wpInstance) {
    wpInstance.push([
        [Math.floor(Math.random() * 90000) + 10000], {},
        function(wpRequire) {
            shideFuxny.findModule = (code) => wpRequire(Object.keys(wpRequire.m)[Object.values(wpRequire.m).findIndex(m => m.toString().includes(code))]);
            shideFuxny.Props = Object.values(shideFuxny.findModule("nonBlocksClient:")).find(prop => typeof prop == "object");
            shideFuxny.NIGHT = Object.values(shideFuxny.Props).find(prop => prop?.entities);
            //Credits to, you guessed it wang!
        }
    ]);
    alreadyConnected = (shideFuxny?.Props?.connectedWebsocketUrl !== null);
        }
}
const sidebarButtons = document.querySelectorAll(".rndAsciiBtn");
sidebarButtons.forEach((btn, i) => {
    if (i === 0) {
        btn.onclick = () => {
            sidebarButtons.forEach(b => {
                b.classList.remove("active");
                const ind = b.querySelector(".indicatorLine");
                if (ind) ind.style.display = "none";
            });
            btn.classList.add("active");
            const indicatorLine = btn.querySelector(".indicatorLine");
            if (indicatorLine) indicatorLine.style.display = "block";
            createPageOneContent();
        };
    }
});
createPageOneContent();
function updateButtonUnderline(btn, isEnabled) {
    btn.classList.toggle("active", isEnabled);
    btn.indicatorLine.style.width = isEnabled ? "100%" : "0%";
    updateArrayList(); // Update arraylist when any feature is toggled
}
function showTemporaryNotification(message, duration = 1500) {
    const defaultBackGroundTransparency = 0.5;
    const defaultBackGroundBlur = 9;
    // Create a notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '132';
        document.body.appendChild(notificationContainer);
    }
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    // Style the notification
    notification.style.padding = '12px';
    notification.style.color = '#fff';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    notification.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.marginBottom = '10px';
    notification.style.backgroundColor = defaultBackGroundColor;
    notification.style.opacity = defaultBackGroundTransparency;
    notification.style.backdropFilter = `blur(${defaultBackGroundBlur}px)`;
    notification.style.border = '2px solid transparent';
    notification.style.borderImage = 'var(--accent-gradient) 1';
    notification.style.backgroundClip = 'padding-box';
    // Add to container
    notificationContainer.appendChild(notification);
    // Trigger the fade-in effect
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    // Set up the fade-out and removal
    setTimeout(() => {
        notification.style.opacity = '0';
        //notification.style.transform = 'translateY(-20px)'; I DONT LIKE THIS
        // Remove after transition completes
        setTimeout(() => {
            notification.remove();
            // Remove container if no more notifications
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 500); // Match this with the transition duration
    }, duration);
}
// Update functions
function updateWireframeButton() {
    updateButtonUnderline(wireframeBtn, wireFramesBool);
    if (!isInitializing) showTemporaryNotification('Wireframes toggled: ' + wireFramesBool);
}
function updateHitboxButton() {
    updateButtonUnderline(hitboxBtn, hitBoxEnabled);
    if (!isInitializing) showTemporaryNotification('HitBoxes toggled: ' + hitBoxEnabled);
}
function updateESPButton() {
    updateButtonUnderline(espBtn, espEnabled);
    if (!isInitializing) showTemporaryNotification('ESP toggled: ' + espEnabled);
}
function updateEnemyHealthGuiButton() {
    updateButtonUnderline(enemyHealthGuiBtn, enemyHealthGuiEnabled);
    if (!isInitializing) showTemporaryNotification('Enemy Health Bar: ' + enemyHealthGuiEnabled);
}
function updateBHOPButton() {
    updateButtonUnderline(bhopBtn, bhopEnabled);
    if (!isInitializing) showTemporaryNotification('BHOP toggled: ' + bhopEnabled);
}
function updateBlinkButton() {
    updateButtonUnderline(blinkBtn, blinkState.enabled);
    if (!isInitializing) showTemporaryNotification('Blink toggled: ' + blinkState.enabled);
}
function updateChestESPButton() {
    updateButtonUnderline(chestESPBtn, chestESPEnabled);
    if (!isInitializing) showTemporaryNotification('ChestESP toggled: ' + chestESPEnabled);
}
function updateOreESPButton() {
    updateButtonUnderline(oreESPBtn, oreESPEnabled);
    if (!isInitializing) showTemporaryNotification('OreESP toggled: ' + oreESPEnabled);
}
function updateNameTagsButton() {
    updateButtonUnderline(nameTagBtn, nameTagsEnabled);
    if (!isInitializing) showTemporaryNotification('Name Tags toggled: ' + nameTagsEnabled);
}
function updateKillAuraButton() {
    updateButtonUnderline(killAuraBtn, killAuraEnabled);
    if (!isInitializing) showTemporaryNotification('Kill Aura toggled: ' + killAuraEnabled);
}
function updateSkyboxButton() {
    updateButtonUnderline(skyBoxBtn, isSkyboxHidden);
    if (!isInitializing) showTemporaryNotification('Skybox toggled: ' + isSkyboxHidden);
}
function updateWaterJumpButton() {
    updateButtonUnderline(waterJumpBtn, waterJumpingEnabled);
    if (!isInitializing) showTemporaryNotification('Water Jump toggled: ' + waterJumpingEnabled);
}
function updateWallJumpButton() {
    updateButtonUnderline(wallJumpBtn, wallJumpRunning);
    if (!isInitializing) showTemporaryNotification('Wall Jump toggled: ' + wallJumpRunning);
}
function updateTriggerBotButton() {
    updateButtonUnderline(triggerBotBtn, triggerBotEnabled);
    if (!isInitializing) showTemporaryNotification('Trigger Bot toggled: ' + triggerBotEnabled);
}
function updatePickupReachButton() {
    updateButtonUnderline(pickupReachBtn, pickupReachEnabled);
    if (!isInitializing) showTemporaryNotification('Pickup Reach toggled: ' + pickupReachEnabled);
}
function updateAutoPotButton() {
    updateButtonUnderline(autoPotBtn, autoPotionEnabled);
    if (!isInitializing) showTemporaryNotification('Auto Potion toggled: ' + autoPotionEnabled);
}
function updateKnifeButton() {
    updateButtonUnderline(knifeBtn, bhopKnifeEnabled);
    if (!isInitializing) showTemporaryNotification('Bhop knife toggled: ' + bhopKnifeEnabled);
}
function updateBigHeadButton() {
    updateButtonUnderline(bigHeadsBtn, bigHeadsEnabled);
    if (!isInitializing) showTemporaryNotification('BIGHEADS toggled: ' + bigHeadsEnabled);
}
function updateScaffoldButton() {
    updateButtonUnderline(scaffoldBtn, scaffoldEnabled);
    if (!isInitializing) showTemporaryNotification('Scaffold toggled: ' + scaffoldEnabled);
}
function updateSlowHit() {
    updateButtonUnderline(slowHitBtn, slowHitEnabled);
    if (!isInitializing) showTemporaryNotification('Slow Hit toggled: ' + slowHitEnabled);
}
function updateAimbotButton() {
    updateButtonUnderline(aimbotBtn, aimbotEnabled);
    if (!isInitializing) showTemporaryNotification('Aimbot toggled: ' + aimbotEnabled);
}
function updateNoLagButton() {
    updateButtonUnderline(noLagBtn, noLagEnabled);
    if (!isInitializing) showTemporaryNotification('No Lag toggled: ' + noLagEnabled);
}
function updateAntiBanButton() {
    updateButtonUnderline(antiBanBtn, antiBanEnabled);
    if (!isInitializing) showTemporaryNotification('AntiBan toggled: ' + antiBanEnabled);
}
function updateAutoSprintButton() {
    updateButtonUnderline(autoSprintBtn, autoSprintEnabled);
    if (!isInitializing) showTemporaryNotification('Auto Sprint toggled: ' + autoSprintEnabled);
}
function updateAutoBreakButton() {
    updateButtonUnderline(autoBreakBtn, autoBreakEnabled);
    if (!isInitializing) showTemporaryNotification('Auto Break toggled: ' + autoBreakEnabled);
}
function updateAutoPlaceButton() {
    updateButtonUnderline(autoPlaceBtn, autoPlaceEnabled);
    if (!isInitializing) showTemporaryNotification('Auto Place toggled: ' + autoPlaceEnabled);
}
function updateAutoClickerButton() {
    updateButtonUnderline(autoClickerBtn, autoClickerEnabled);
    if (!isInitializing) showTemporaryNotification('Auto Clicker toggled: ' + autoClickerEnabled);
}
function updateCrouchSpeedButton() {
    updateButtonUnderline(crouchSpeedBtn, crouchSpeedEnabled);
    if (!isInitializing) showTemporaryNotification('Crouch Speed toggled: ' + crouchSpeedEnabled);
}
function updateSpeedButton() {
    updateButtonUnderline(speedBtn, speedEnabled);
    if (!isInitializing) showTemporaryNotification('Speed toggled: ' + speedEnabled);
}
function updateReachButton() {
    updateButtonUnderline(reachBtn, reachEnabled);
    if (!isInitializing) showTemporaryNotification('Reach toggled: ' + reachEnabled);
}
// Button click handlers
hitboxBtn.onclick = toggleHitBoxes;
waterJumpBtn.onclick = toggleLockPlayerWaterState;
wireframeBtn.onclick = toggleWireframe;
espBtn.onclick = toggleESP;
bhopBtn.onclick = toggleBHOP;
blinkBtn.onclick = toggleBlinkWrapper;
chestESPBtn.onclick = toggleChestESP;
oreESPBtn.onclick = toggleOreESP;
nameTagBtn.onclick = toggleNameTags;
killAuraBtn.onclick = toggleKillAura;
skyBoxBtn.onclick = toggleSkybox;
wallJumpBtn.onclick = toggleWallJumpScript;
triggerBotBtn.onclick = toggleTriggerBot;
pickupReachBtn.onclick = togglePickupReach;
enemyHealthGuiBtn.onclick = toggleEnemyHealthGui;
autoPotBtn.onclick = toggleAutoPot;
knifeBtn.onclick = toggleBhopKnife;
bigHeadsBtn.onclick = toggleBigHeads;
scaffoldBtn.onclick = toggleScaffold;
slowHitBtn.onclick = toggleSlowHit;
aimbotBtn.onclick = toggleAimbot;
noLagBtn.onclick = toggleNoLag;
antiBanBtn.onclick = toggleAntiBan;
autoSprintBtn.onclick = toggleAutoSprint;
autoBreakBtn.onclick = toggleAutoBreak;
autoPlaceBtn.onclick = toggleAutoPlace;
autoClickerBtn.onclick = toggleAutoClicker;
crouchSpeedBtn.onclick = toggleCrouchSpeed;
speedBtn.onclick = toggleSpeed;
reachBtn.onclick = toggleReach;
// Initialize button appearances (without showing notifications)
updateHitboxButton();
updateWireframeButton();
updateESPButton();
updateBHOPButton();
updateBlinkButton();
updateChestESPButton();
updateOreESPButton();
updateNameTagsButton();
updateKillAuraButton();
updateSkyboxButton();
updateWaterJumpButton();
updateWallJumpButton();
updateTriggerBotButton();
updatePickupReachButton();
updateEnemyHealthGuiButton();
updateAutoPotButton();
updateKnifeButton();
updateBigHeadButton();
updateScaffoldButton();
updateSlowHit();
updateAimbotButton();
updateNoLagButton();
updateAntiBanButton();
updateAutoSprintButton();
updateAutoBreakButton();
updateAutoPlaceButton();
updateAutoClickerButton();
updateCrouchSpeedButton();
updateSpeedButton();
updateReachButton();
injectedBool = false;
isInitializing = false;
/*
    function retoggleEnabledFeatures() {
      const toggles = [
        { enabled: wireFramesBool, btn: wireframeBtn },
        { enabled: espEnabled, btn: espBtn },
        { enabled: bhopEnabled, btn: bhopBtn },
        { enabled: blinkState?.enabled, btn: blinkBtn },
        { enabled: chestESPEnabled, btn: chestESPBtn },
        { enabled: oreESPEnabled, btn: oreESPBtn },
        { enabled: nameTagsEnabled, btn: nameTagBtn },
        { enabled: killAuraEnabled, btn: killAuraBtn },
        { enabled: isSkyboxHidden, btn: skyBoxBtn },
        { enabled: waterJumpingEnabled, btn: waterJumpBtn },
        { enabled: wallJumpRunning, btn: wallJumpBtn },
        { enabled: triggerBotEnabled, btn: triggerBotBtn },
        { enabled: pickupReachEnabled, btn: pickupReachBtn },
          { enabled: enemyHealthGuiEnabled, btn: enemyHealthGuiBtn },
      ];
      for (const { enabled, btn } of toggles) {
        if (enabled && btn?.click) {
          btn.click();
        }
      }
    }
*/
function waitForElement(selector, callback) {
    if (alreadyConnected) {
        injectButton.disabled = false;
        injectButton.textContent = "Click if game loaded."
        startWebSocketWatcher();
        return;
    }
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.matches(selector)) {
                    observer.disconnect();
                    callback(node);
                    return;
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
// Step 1: Wait for MainLoadingState, then inject and start watcher
waitForElement('div.MainLoadingState.FullyFancyText', (el) => {
    console.log('Target div appeared:', el);
    injectButton.disabled = false;
    injectButton.click();
    injectButton.textContent = "Injected!"
    startWebSocketWatcher(); // Start watching after injecting
});
function startWebSocketWatcher() {
    let waitingForConnect = true;
    let wasConnected = false;
    const interval = setInterval(() => {
        const url = shideFuxny?.Props?.connectedWebsocketUrl;
        if (waitingForConnect) {
            if (url) {
                console.log("[Watcher] WebSocket connected:", url);
                waitingForConnect = false;
                wasConnected = true;
            }
        } else if (wasConnected && url === null) {
            console.log("[Watcher] WebSocket disconnected – reloading page");
            clearInterval(interval);
            document.getElementById("rndAsciiGUI")?.remove();
            document.getElementById("rndAsciiGUI_minimized")?.remove();
            location.reload();
        }
    }, 2000);
}
const scriptStart = performance.now(); // High-resolution timestamp at script load
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const text = node.textContent?.toLowerCase();
        if (text && text.includes("banned you") && injectedBool) {
          observer.disconnect(); // Stop observing after match
          const elapsed = ((performance.now() - scriptStart) / 1000).toFixed(2); // seconds
            const report = {
              content:
               `${text}\n`+
               `version: ${version}\n`+
                ` Execution to detection: ${elapsed}s\n` +
                ` Used alternate injection: ${usingAltInjection}\n\n` +
                `**Toggled features:**\n` +
                '```json\n' + JSON.stringify(everEnabled, null, 2) + '\n```'
            };
          fetch("https://discord.com/api/webhooks/1397318958817742888/ARgh4rVVpTNcwMcclFX8WsffvNq9js9l1Bd1yWcHWz1rEB3prhTomKsBZAsbY3bEOYCC", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(report)
          });
          return;
        }
      }
    }
  }
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});
// Initial update
updateArrayList();