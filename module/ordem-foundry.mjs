import { CharacterActor } from "./documents/actor.mjs";
import { ORDEM_FOUNDRY } from "./helpers/config.mjs";
// import * as Dice from "./module/dice/_module.mjs";
import { ActorDataSheet } from "./sheets/actor-sheet.mjs";
import * as models from "./data/_module.mjs";
// globalThis.ordemfoundry = {
//   Dice,
// };

// Hooks.once("init", async function () {
//   CONFIG.debug.hooks = true;
//   game.ordemfoundry = {
//     ActorOrdem,
//   };

//   Actors.unregisterSheet("core", ActorSheet);
//   Actors.registerSheet("ordemfoundry", OrdemActorSheet, {
//     types: ["agent"],
//     makeDefault: true,
//   });
// });

Hooks.once("init", function () {
  game.boilerplate = {
    CharacterActor,
  };
  // rollItemMacro,
  // BoilerplateItem,

  CONFIG.ORDEM_FOUNDRY = ORDEM_FOUNDRY;

  // CONFIG.Combat.initiative = {
  //   formula: "1d20 + @abilities.dex.mod",
  //   decimals: 2,
  // };

  CONFIG.Actor.documentClass = CharacterActor;
  // CONFIG.Item.documentClass = BoilerplateItem;
  // CONFIG.ActiveEffect.legacyTransferral = false;

  // console.log(models);
  CONFIG.Actor.dataModels = {
    agent: models.ActorCharacter,
  };
  // npc: models.BoilerplateNPC

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ordemfoundry", ActorDataSheet, {
    makeDefault: true,
    label: "ORDEM_FOUNDRY.SheetLabels.Actor",
  });
  console.log(ORDEM_FOUNDRY);

  // Items.unregisterSheet("core", ItemSheet);
  // Items.registerSheet("boilerplate", BoilerplateItemSheet, {
  //   makeDefault: true,
  //   label: "BOILERPLATE.SheetLabels.Item",
  // });

  // return preloadHandlebarsTemplates();
});
