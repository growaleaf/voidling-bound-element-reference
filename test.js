// Headless structural tests. Run: node test.js
var data = require("./data.js");
var fs = require("fs");

var failures = 0;

function assert(cond, label) {
  if (!cond) {
    failures++;
    console.log("FAIL " + label);
  } else {
    console.log("PASS " + label);
  }
}

// ───────────────────────────────── type matchup table

assert(data.ELEMENTS.length === 6, "exactly 6 elements (got " + data.ELEMENTS.length + ")");
assert(data.FACTIONS.length === 4, "exactly 4 named factions (got " + data.FACTIONS.length + ")");

var elementNames = data.ELEMENTS.map(function (e) { return e.name; });
["Neutral", "Organic", "Pyro", "Cryo", "Cyber", "Plasma"].forEach(function (n) {
  assert(elementNames.indexOf(n) !== -1, "element \"" + n + "\" is present");
});

data.ELEMENTS.forEach(function (e) {
  assert(typeof e.effective === "string" && e.effective.length > 0, e.name + " has non-empty effective text");
  assert(Array.isArray(e.statusEffects) && e.statusEffects.length > 0, e.name + " lists at least one status effect");
});

// known-answer: Neutral and Plasma have no listed weakness (source says so explicitly)
var neutral = data.ELEMENTS.filter(function (e) { return e.name === "Neutral"; })[0];
assert(neutral.weak === null && typeof neutral.weakNote === "string",
  "Neutral has weak=null with a disclosed weakNote (known case)");
var plasma = data.ELEMENTS.filter(function (e) { return e.name === "Plasma"; })[0];
assert(plasma.weak === null && typeof plasma.weakNote === "string",
  "Plasma has weak=null with a disclosed weakNote (known case)");

// known-answer: Organic is effective vs Lesion-spawns/Ancients, weak vs Crystallines/GenBots
var organic = data.ELEMENTS.filter(function (e) { return e.name === "Organic"; })[0];
assert(organic.effective.indexOf("Lesion-spawns") !== -1 && organic.effective.indexOf("Ancients") !== -1,
  "Organic effective text names Lesion-spawns and Ancients (known case)");
assert(organic.weak.indexOf("Crystallines") !== -1 && organic.weak.indexOf("GenBots") !== -1,
  "Organic weak text names Crystallines and GenBots (known case)");

// Plasma carries both Disintegrate and Float per Destructoid's table
assert(plasma.statusEffects.indexOf("Disintegrate") !== -1 && plasma.statusEffects.indexOf("Float") !== -1,
  "Plasma lists both Disintegrate and Float (known case, two effects in one table cell)");

// ───────────────────────────────── status effects

assert(data.STATUS_CONTROL.length === 5, "exactly 5 control effects (got " + data.STATUS_CONTROL.length + ")");
assert(data.STATUS_ELEMENTAL.length === 6, "exactly 6 elemental DoT effects (got " + data.STATUS_ELEMENTAL.length + ")");
assert(data.STATUS_MOVEMENT.length === 5, "exactly 5 movement effects (got " + data.STATUS_MOVEMENT.length + ")");

var totalEffects = data.STATUS_CONTROL.length + data.STATUS_ELEMENTAL.length + data.STATUS_MOVEMENT.length;
assert(totalEffects === 16, "16 total named status-effect entries (got " + totalEffects + ")");

data.STATUS_ELEMENTAL.forEach(function (s) {
  assert(typeof s.maxStacks === "number" && s.maxStacks > 0, s.name + " has a numeric maxStacks");
  assert(typeof s.behavior === "string" && s.behavior.length > 0, s.name + " has non-empty behavior text");
});

// known-answer: Poison caps at 15, all other elemental DoTs cap at 5
var poison = data.STATUS_ELEMENTAL.filter(function (s) { return s.name === "Poison"; })[0];
assert(poison.maxStacks === 15, "Poison maxStacks is 15 (known case, the outlier)");
data.STATUS_ELEMENTAL.filter(function (s) { return s.name !== "Poison"; }).forEach(function (s) {
  assert(s.maxStacks === 5, s.name + " maxStacks is 5");
});

// known-answer: Frostbite is disclosed as both a DoT and a separate movement stun, not merged
var frostbiteDot = data.STATUS_ELEMENTAL.filter(function (s) { return s.name === "Frostbite"; })[0];
var frostbiteStun = data.STATUS_MOVEMENT.filter(function (s) { return s.name === "Frostbite Stun"; })[0];
assert(!!frostbiteDot && !!frostbiteStun, "Frostbite appears as both a DoT entry and a \"Frostbite Stun\" movement entry");
assert(frostbiteDot.isDualEffect === true && frostbiteStun.isDualEffect === true,
  "both Frostbite entries are flagged isDualEffect (disclosed, not silently duplicated)");

// known-answer: Lure's mechanics are honestly undisclosed, not invented
var lure = data.STATUS_MOVEMENT.filter(function (s) { return s.name === "Lure"; })[0];
assert(lure.description === null, "Lure has no fabricated description (known case)");
assert(typeof lure.undisclosedNote === "string" && lure.undisclosedNote.toLowerCase().indexOf("not described") !== -1,
  "Lure carries an honest \"mechanics not described\" disclosure note");

// every other movement/control effect must have real description text (no silent gaps)
data.STATUS_MOVEMENT.filter(function (s) { return s.name !== "Lure"; }).forEach(function (s) {
  assert(typeof s.description === "string" && s.description.length > 0, s.name + " has non-empty description");
});
data.STATUS_CONTROL.forEach(function (s) {
  assert(typeof s.description === "string" && s.description.length > 0, s.name + " has non-empty description");
});

// ───────────────────────────────── DOM-surface checks

var html = fs.readFileSync(__dirname + "/index.html", "utf8");
assert(html.indexOf("data.js") !== -1, "index.html references data.js");
assert(html.indexOf("elementFilter") !== -1, "index.html has an element filter control");
assert(html.indexOf("excludedNotice") !== -1, "index.html renders the excluded-source disclosure callout");
assert(html.indexOf("matchupBody") !== -1, "index.html has a matchup table body target");

console.log("");
console.log(failures === 0 ? "ALL PASS" : failures + " FAILURE(S)");
process.exit(failures === 0 ? 0 : 1);
