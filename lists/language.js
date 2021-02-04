const { Text,  Checkbox } = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: { type: Text, label: "Language" },
    isoName: { type: Text, label: "isoName" },
    isActive: { type: Checkbox , label: 'isActive'},
  }


};
