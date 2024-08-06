export default class CharacterActor extends Actor {
  prepareData() {
    super.prepareData();
  }

  prepareBaseData() {
    const actorData = this;
    const systemData = actorData.system;

    console.log(actorData);

    if (actorData.type == "agent") {
      this._migrateData(actorData, systemData);
      this._prepareDataStatus(actorData, systemData);
      this._prepareRituals(actorData);
    }
  }

  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.ordemparanormal || {};
    if (actorData.type == "agent") {
    }
  }
}
