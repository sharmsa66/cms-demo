const { Text, Relationship } = require("@keystonejs/fields");

module.exports = {
    fields:{
        errorModalTitle: {type: Text},
        errorModalButtonOk: {type: Text},
        errorModalButtonCancel: {type: Text},
        errorMdalBody:  {type: Text},
        lang: { type: Relationship, ref: 'Language' },
      }
     
};