import * as Dice from "./module/dice/_module.mjs";
import * as ActorOrdem from "./module/actor/_module.mjs";
import * as character from "./module/character/_module.mjs";
import { OrdemActorSheet } from "./module/actor/actor-sheet.mjs";

globalThis.ordemfoundry = {
  Dice,
};

Hooks.once("init", async function () {
  CONFIG.debug.hooks = true;
  game.ordemfoundry = {
    ActorOrdem,
  };

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ordemfoundry", OrdemActorSheet, {
    types: ["agent"],
    makeDefault: true,
  });
});
