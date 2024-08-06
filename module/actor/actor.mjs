import {
  PE_STATUS_PER_TURN_FIGHTER,
  PE_STATUS_PER_TURN_OCCULTIST,
  PE_STATUS_PER_TURN_SPECIALIST,
  PV_STATUS_PER_TURN_FIGHTER,
  PV_STATUS_PER_TURN_OCCULTIST,
  PV_STATUS_PER_TURN_SPECIALIST,
  SAN_STATUS_PER_TURN_FIGHTER,
  SAN_STATUS_PER_TURN_OCCULTIST,
  SAN_STATUS_PER_TURN_SPECIALIST,
} from "./actor-type.mjs";

export default class OrdemActor extends Actor {
  prepareData() {
    super.prepareData();
  }

  prepareBaseData() {
    const actorData = this;
    const systemData = actorData.system;

    if (actorData.type == "agent") {
      this._updateClass(actorData._id, systemData.class);
      this._updateAttributes(systemData);
      this._updateNEX(systemData.NEX.value);
      this._prepareRituals(actorData);
    }
  }

  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    if (actorData.type == "agent") {
      this._prepareBaseSkills(systemData);
      this._prepareSkills(systemData);
      this._prepareItemsDerivedData(actorData, systemData);
      this._prepareDefense(systemData);
      this._prepareActorSpaces(actorData);
    }
  }

  _updateAttributes(system) {
    if (system.NEX.value <= 0) {
      system.PV.max = system.PV.max || 0;
      system.PE.max = system.PE.max || 0;
      system.SAN.max = system.SAN.max || 0;
      return;
    }
    // TODO: tem adicionar um logica para não ganhar sanidade se trancender
    const { maxPV, maxSAN, maxPE } = _calculateAttributeValues({
      actorClass: system.class,
      VIG: system.attributes.vit.value,
      PRE: system.attributes.pre.value,
      isUpdateSan: true,
    });

    system.PV.max = maxPV;
    system.PE.max = maxSAN;
    system.SAN.max = maxPE;
  }

  _calculateAttributeValues({ actorClass, VIG, PRE, isUpdateSan }) {
    const AttributesCalcBase = {
      fighter: {
        PV: 20 + VIG + (PV_STATUS_PER_TURN_FIGHTER + VIG),
        PE: 2 + PRE + (PE_STATUS_PER_TURN_FIGHTER + PRE),
        SAN: 12 + (isUpdateSan ? SAN_STATUS_PER_TURN_FIGHTER : 0),
      },
      specialist: {
        PV: 16 + VIG + (SAN_STATUS_PER_TURN_SPECIALIST + VIG),
        PE: 3 + PRE + (PV_STATUS_PER_TURN_SPECIALIST + PRE),
        SAN: 16 + (isUpdateSan ? PE_STATUS_PER_TURN_SPECIALIST : 0),
      },
      occultist: {
        PV: 12 + VIG + (SAN_STATUS_PER_TURN_OCCULTIST + VIG),
        PE: 4 + PRE + (PV_STATUS_PER_TURN_OCCULTIST + PRE),
        SAN: 20 + (isUpdateSan ? PE_STATUS_PER_TURN_OCCULTIST : 0),
      },
    };
    const { PV, PE, SAN } = AttributesCalcBase[actorClass];
    return {
      maxPV: PV,
      maxSAN: PE,
      maxPE: SAN,
    };
  }

  _updateNEX(nexValue) {
    const calcNEX = nexValue < 99 ? Math.floor(nexValue / 5) : 20;
    system.PE.perRound = calcNEX;
  }

  _prepareDefense(system) {
    const REFLEXES = system.skills.reflexes;
    const AGI = system.attributes.dex.value;
    system.defense.value += AGI;
    system.defense.dodge =
      system.defense.value +
      system.skills.reflexes.value +
      (system.skills.reflexes.mod || 0);
  }

  _prepareSkills(system) {
    for (const [keySkill, skillsName] of Object.entries(system.skills)) {
      const overLoad = skillsName.conditions.load;
      const needTraining = skillsName.conditions.trained;

      if (skillsName.degree.label == "trained") skillsName.value = 5;
      else if (skillsName.degree.label == "veteran") skillsName.value = 10;
      else if (skillsName.degree.label == "expert") skillsName.value = 15;
      else skillsName.value = 0;

      skillsName.label =
        game.i18n.localize(CONFIG.ordemparanormal.skills[keySkill]) +
          (overLoad ? "+" : needTraining ? "*" : "") ?? k;

      const beforeD20Formula = skillsName.attr[1] ? skillsName.attr[1] : 2;

      const afterD20Formula =
        (skillsName.attr[1] != 0 ? "kh" : "kl") +
        (skillsName.value != 0 ? "+" + skillsName.value : "") +
        (skillsName.mod ? "+" + skillsName.mod : "");

      skillsName.formula = beforeD20Formula + "d20" + afterD20Formula;
    }
  }

  async _prepareBaseSkills(system) {
    for (const [keySkill, skillsName] of Object.entries(system.skills)) {
      for (const [keyAttr, attribute] of Object.entries(system.attributes)) {
        if (skillsName.attr[0] == keyAttr)
          system.skills[keySkill].attr[1] = attribute.value;
      }
    }
  }

  _prepareActorSpaces(ActorData) {
    const system = ActorData.system;
    const spaces = (system.spaces ??= {});
    const FOR = system.attributes.str.value || 0;
    spaces.over, (spaces.pctMax = 0);

    const physicalItems = ["armament", "generalEquipment", "protection"];
    const weight = ActorData.items.reduce((weight, i) => {
      if (!physicalItems.includes(i.type)) return weight;
      const q = i.system.quantity || 0;
      const w = i.system.weight || 0;
      return weight + q * w;
    }, 0);

    spaces.value = weight.toNearest(0.1);
    spaces.max = FOR !== 0 ? FOR * 5 : 2;

    spaces.value += spaces.bonus.value;
    spaces.max += spaces.bonus.max;

    if (game.version >= 12)
      spaces.pct = Math.clamp((spaces.value * 100) / spaces.max, 0, 100);
    else spaces.pct = Math.clamped((spaces.value * 100) / spaces.max, 0, 100);

    if (spaces.value > spaces.max) {
      spaces.over = spaces.value - spaces.max;
      system.desloc.value += -3;
      system.defense.value += -5;

      if (game.version >= 12)
        spaces.pctMax = Math.clamp((spaces.over * 100) / spaces.max, 0, 100);
      else
        spaces.pctMax = Math.clamped((spaces.over * 100) / spaces.max, 0, 100);
    }
    if (spaces.value > spaces.max * 2)
      ui.notifications.warn(game.i18n.localize("WARN.overWeight"));
  }

  _prepareRituals(ActorData) {
    const system = ActorData.system;
    const ritual = (system.ritual ??= {});
    const calcNEX =
      system.NEX.value < 99 ? Math.floor(system.NEX.value / 5) : 20;
    ritual.DT = 10 + calcNEX + system.attributes.pre.value;
  }

  _prepareItemsDerivedData(actorData, system) {
    const protections = actorData.items.filter(
      (item) => item.type === "protection"
    );
    for (const p of protections) {
      if (typeof p.system.defense == "number" && p.system.using.state == true) {
        system.defense.value += p.system.defense;
      }
    }
  }

  async _updateClass(actorId, newClass) {
    const newClass = ClassTypes[newClass];
    if (newClass) {
      await Actor.updateDocuments([
        { _id: actorId, system: { class: newClass } },
      ]);
    }
  }

  applyActiveEffects() {
    if (this.system?.prepareEmbeddedData instanceof Function)
      this.system.prepareEmbeddedData();
    return super.applyActiveEffects();
  }

  getRollData() {
    const actorData = this;
    const system = super.getRollData();

    this._getAgentRollData(actorData, system);

    return system;
  }

  async _getAgentRollData(actorData, system) {
    if (actorData.type !== "agent") return;
    let skillUpper;

    if (system.skills) {
      for (const [k, v] of Object.entries(system.skills)) {
        system[k] = foundry.utils.deepClone(v);

        skillUpper = k.charAt(0).toUpperCase() + k.slice(1);
        system[game.i18n.localize("ordemparanormal.skill." + k).toLowerCase()] =
          foundry.utils.deepClone(v);
      }
    }

    if (system.attributes) {
      for (const [k, v] of Object.entries(system.attributes)) {
        system[k] = foundry.utils.deepClone(v);
      }
    }
    if (system.attributes && system.skills) {
      const mainDice = (this.system.dex.value || 2) + "d20";
      const rollMode = this.system.dex.value ? "kh" : "kl";
      const formula = [];
      formula.push(mainDice + rollMode);
      if (system.skills.initiative.value != 0)
        formula.push(system.skills.initiative.value);
      if (system.skills.initiative.mod)
        formula.push(system.skills.initiative.mod);
      system.rollInitiative = formula.join("+");
    }

    if (system.NEX) {
      system.nex = system.NEX.value ?? 0;
    }
  }
}
