import ActorBaseModel from "./base-actor.mjs";

export default class ActorCharacter extends ActorBaseModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    console.log("fields", fields);

    // schema.attributes = new fields.SchemaField({
    //   level: new fields.SchemaField({
    //     value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
    //   }),
    // });

    // schema.abilities = new fields.SchemaField(
    //   Object.keys(CONFIG.BOILERPLATE.abilities).reduce((obj, ability) => {
    //     obj[ability] = new fields.SchemaField({
    //       value: new fields.NumberField({
    //         ...requiredInteger,
    //         initial: 10,
    //         min: 0,
    //       }),
    //     });
    //     return obj;
    //   }, {})
    // );

    return schema;
  }

  prepareDerivedData() {
    // for (const key in this.abilities) {
    //   this.abilities[key].mod = Math.floor(
    //     (this.abilities[key].value - 10) / 2
    //   );
    //   this.abilities[key].label =
    //     game.i18n.localize(CONFIG.BOILERPLATE.abilities[key]) ?? key;
    // }
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    // if (this.abilities) {
    //   for (let [k, v] of Object.entries(this.abilities)) {
    //     data[k] = foundry.utils.deepClone(v);
    //   }
    // }

    // data.lvl = this.attributes.level.value;

    return data;
  }
}
