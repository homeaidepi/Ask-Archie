"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.botName = exports.botId = exports.botEmail = exports.baseMember = exports.automate_uri1 = exports.automate_uri = void 0;
exports.memberUser = memberUser;
exports.memberVandy = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var automate_uri = "";
exports.automate_uri = automate_uri;
var automate_uri1 = "https://prod-80.westus.logic.azure.com:443/workflows/e6e84bb1f9e44c7e883068fdd922c3a1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=snSGwlZiWX9QnYtaPyLgrWamp77valTMiVundaszF4Q";
exports.automate_uri1 = automate_uri1;
var botId = "";
exports.botId = botId;
var botName = "Archie";
exports.botName = botName;
var botEmail = "matthew.vandergrift@ferguson.com";
exports.botEmail = botEmail;
var baseMember = {
  "id": botId,
  "name": botName,
  "objectId": "",
  "givenName": "",
  "surname": "",
  "mail": botEmail,
  "userPrincipalName": botEmail,
  "tenantId": "",
  "aadObjectId": ""
};
exports.baseMember = baseMember;

var memberVandy = _objectSpread(_objectSpread({}, baseMember), {}, {
  "businessPhones": [],
  "displayName": "Matthew Vandergrift",
  "givenName": "Matthew",
  "jobTitle": "Lead Solutions Architect",
  "mail": "matthew.vandergrift@ferguson.com",
  "mobilePhone": "",
  "officeLocation": "9133 - Virtual Office",
  "preferredLanguage": null,
  "surname": "Vandergrift",
  "userPrincipalName": "matthew.vandergrift@ferguson.com",
  "id": "fe71b616-54c1-47f6-9cc7-e02286fba9c9"
});

exports.memberVandy = memberVandy;

function memberUser(botId, botName, botEmail) {
  return _objectSpread(_objectSpread({}, baseMember), {}, {
    botId: botId,
    botName: botName,
    botEmail: botEmail
  });
}