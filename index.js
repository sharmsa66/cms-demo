const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password, Relationship } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');

const Language = require( './lists/language');
const Translation  = require( './lists/translations');

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'cms-mongo';
const adapterConfig = { mongoUri: 'mongodb+srv://sharmsa:qL4IOjbk0SIh4qSw@standup.lj4xb.mongodb.net/cms-demo?retryWrites=true&w=majority' };


const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

keystone.createList('User', {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
  },
  // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
});

keystone.createList('Language', Language );


keystone.createList('Translation', Translation);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: { protectIdentities: process.env.NODE_ENV === 'production' },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy,
    }),
  ],
};


// "error_modal_title": "Something went wrong",
// "error_modal_button_ok": "Try Again",
// "error_modal_button_cancel": "Cancel",
// "error_modal_body": "Our website is having trouble right now. Please try again.",
// "error_message_required": "This is a required field.",
// "error_message_province": "Please enter a valid state / province",
// "error_message_postal": "Please enter a valid zip/postal code",
// "error_message_phoneNumber": "Please enter a valid phone number",
// "error_message_number": "Please enter a valid number",
// "error_message_name": "Please enter a valid name",
// "error_message_minlength": "Minimum length {{ minLength }}",
// "error_message_max": "Invalid Value",
// "error_message_invalidZipCode": "Invalid Zip/Postal Code",
// "error_message_invalidPassword": "Invalid password. Password must be at least 6 characters long, and contain a number.",
// "error_message_email": "Please enter a valid email address",
// "error_message_city": "Please enter a valid city",
// "error_message_amount": "Please enter a valid amount",
// "error_message_address": "Please enter a valid address",
// "error_message_913_button": "Continue Payment",