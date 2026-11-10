// Voidling Bound — Element Matchup & Status Effect Reference (GCT-044)
// Data re-fetched and transcribed directly from the two named sources this
// session (not reused from the orchestrator's charter paraphrase):
//   - Destructoid type-matchup table: curl-fetched live, HTTP 200.
//   - allthings.how status-effect breakdown: live fetch returned a Cloudflare
//     JS challenge (HTTP 403, "Just a moment..."), so this was read from the
//     Wayback Machine's 2026-07-18 snapshot of the same URL instead, cross-
//     checked against a second independent re-read of the live page content.
//     Both reads agree verbatim on every number and description below.
(function () {
  "use strict";

  var root = (typeof window !== "undefined") ? window : (typeof global !== "undefined" ? global : {});

  // Enemy factions named across both the matchup table and the charter.
  var FACTIONS = ["Lesion-spawns", "Ancients", "Crystallines", "GenBots"];

  // Type matchup table — 6 elements x Effective/Weak against the 4 factions.
  // "weak: null" means the source states no weakness exists (not an omission;
  // Destructoid's table explicitly says so for both Neutral and Plasma).
  var ELEMENTS = [
    {
      name: "Neutral",
      effective: "They do the same damage against all factions.",
      weak: null,
      weakNote: "The source states Neutral has no weakness against any faction.",
      statusEffects: ["Bleed"]
    },
    {
      name: "Organic",
      effective: "Highly effective against Lesion-spawns and Ancients.",
      weak: "Weak against Crystallines and GenBots.",
      weakNote: null,
      statusEffects: ["Poison", "Slow"]
    },
    {
      name: "Pyro",
      effective: "Highly effective against Lesion-spawns and Crystallines.",
      weak: "Weak against GenBots and Ancients.",
      weakNote: null,
      statusEffects: ["Burn", "Fear"]
    },
    {
      name: "Cryo",
      effective: "Highly effective against GenBots and Ancients.",
      weak: "Weak against Lesion-spawns and Crystallines.",
      weakNote: null,
      statusEffects: ["Frostbite", "Frostbite Stun"]
    },
    {
      name: "Cyber",
      effective: "Highly effective against GenBots and Crystallines.",
      weak: "Weak against Lesion-spawns.",
      weakNote: null,
      statusEffects: ["Static", "Lure"]
    },
    {
      name: "Plasma",
      effective: "Effective against all factions.",
      weak: null,
      weakNote: "The source lists no weakness for Plasma (\"N/A\" in the table) — not stated as an omission to guess at.",
      statusEffects: ["Disintegrate", "Float"]
    }
  ];

  // Control / misc status effects — no element attached.
  var STATUS_CONTROL = [
    {
      name: "Sleep",
      description: "Immobilizes the target until it takes any damage. The first hit wakes it."
    },
    {
      name: "Stun",
      description: "Prevents the enemy from acting for its duration. Lasts shorter than Sleep and doesn't break when the enemy takes damage. Bosses are slowed instead of stunned."
    },
    {
      name: "Marked",
      description: "Marked enemies trigger bonus effects when specific marked perks hit them."
    },
    {
      name: "Invisibility",
      description: "Makes your voidling invisible so enemies stop targeting it, though attacks already in motion can still hit."
    },
    {
      name: "Armor Reduction",
      description: "Lowers the enemy's armor so it takes more damage from your hits."
    }
  ];

  // Elemental damage-over-time effects, with stack caps and cap behavior.
  var STATUS_ELEMENTAL = [
    {
      name: "Bleed", element: "Neutral", maxStacks: 5,
      behavior: "Neutral damage over time with the fastest tick rate of any effect."
    },
    {
      name: "Poison", element: "Organic", maxStacks: 15,
      behavior: "Low damage per tick, but lasts longer than the other effects."
    },
    {
      name: "Burn", element: "Pyro", maxStacks: 5,
      behavior: "High damage over time that expires faster than the others."
    },
    {
      name: "Frostbite", element: "Cryo", maxStacks: 5,
      behavior: "Cryo damage over time. At 5 stacks, every stack is removed and the target is stunned (see the separate \"Frostbite Stun\" movement-effect entry below — the source discloses this as both a DoT and a stun, not merged into one line).",
      isDualEffect: true
    },
    {
      name: "Static", element: "Cyber", maxStacks: 5,
      behavior: "Deals no damage while building stacks. At 5 stacks, all stacks are consumed for a large Cyber burst."
    },
    {
      name: "Disintegrate", element: "Plasma", maxStacks: 5,
      behavior: "Deals no damage over time on its own. Every stack beyond 5 triggers a Plasma overflow that deals massive damage."
    }
  ];

  // Movement effects tied to an element.
  var STATUS_MOVEMENT = [
    {
      name: "Slow", element: "Organic",
      description: "Reduces the enemy's attack and movement speed, scaling with the number of stacks. Bosses that would be stunned are slowed instead."
    },
    {
      name: "Fear", element: "Pyro",
      description: "Feared enemies run away from your voidling for the duration."
    },
    {
      name: "Frostbite Stun", element: "Cryo",
      description: "Stops the enemy from moving and attacking. Listed by the source alongside, and distinct from, the Frostbite damage-over-time effect above.",
      isDualEffect: true
    },
    {
      name: "Lure", element: "Cyber",
      description: null,
      undisclosedNote: "The source describes Lure only as \"a Cyber-associated movement effect\" and gives no further mechanics. Shipped honestly as mechanics not described in the source, not guessed at."
    },
    {
      name: "Float", element: "Plasma",
      description: "Enemies hit by Float hover in the air for a few seconds before dropping back to the ground to take damage."
    }
  ];

  var SOURCES = [
    {
      name: "Destructoid — All Voidling Bound Elements: Affinities, weaknesses, and more",
      url: "https://www.destructoid.com/all-voidling-bound-elements-affinities-weaknesses-and-more/"
    },
    {
      name: "All Things How — Voidling Bound Status Effects, Explained for Every Element",
      url: "https://allthings.how/voidling-bound-status-effects-explained-for-every-element/"
    }
  ];

  var EXCLUDED_SOURCE_NOTE =
    "hkytufydtdtdt.pages.dev was explicitly excluded from this build — a disposable-looking " +
    "domain whose level-50 cap claim contradicts Steam Deck HQ's review (level 20). It is named " +
    "here only to disclose the exclusion, never cited as a data source.";

  var FETCHED = "2026-11-10";

  root.VOIDLING_DATA = {
    FACTIONS: FACTIONS,
    ELEMENTS: ELEMENTS,
    STATUS_CONTROL: STATUS_CONTROL,
    STATUS_ELEMENTAL: STATUS_ELEMENTAL,
    STATUS_MOVEMENT: STATUS_MOVEMENT,
    SOURCES: SOURCES,
    EXCLUDED_SOURCE_NOTE: EXCLUDED_SOURCE_NOTE,
    FETCHED: FETCHED
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.VOIDLING_DATA;
  }
})();
