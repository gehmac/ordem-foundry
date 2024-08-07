import BaseModel from "./base-model.mjs";

export default class ActorBaseModel extends BaseModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: false, nullable: false, integer: true };

    const schema = {};
    schema.PV = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 1,
      }),
      max: new fields.NumberField({
        ...requiredInteger,
        initial: 1,
      }),
    });
    schema.SAN = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 1,
      }),
      max: new fields.NumberField({
        ...requiredInteger,
        initial: 1,
      }),
    });
    schema.PE = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 1,
      }),
      max: new fields.NumberField({
        ...requiredInteger,
        initial: 1,
      }),
    });
    schema.NEX = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
    });
    schema.XP = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
    });
    schema.dodge = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
      bonus: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
    });
    schema.defense = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
      bonus: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
    });
    schema.desloc = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
      bonus: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
    });
    schema.spaces = new fields.SchemaField({
      value: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
      bonus: new fields.NumberField({
        ...requiredInteger,
        initial: 0,
      }),
    });

    (schema.biography = new fields.StringField({
      ...requiredInteger,
      initial: "",
    })),
      console.log(schema, "schema\n\n\n");

    return schema;
  }
}
