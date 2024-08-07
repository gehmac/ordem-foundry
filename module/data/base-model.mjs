export default class BaseModel extends foundry.abstract.TypeDataModel {
  toPlainObject() {
    return { ...this };
  }
}
