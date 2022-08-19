export const automate_uri = "";
export const automate_uri1 = "https://prod-80.westus.logic.azure.com:443/workflows/e6e84bb1f9e44c7e883068fdd922c3a1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=snSGwlZiWX9QnYtaPyLgrWamp77valTMiVundaszF4Q"
export const botId = ""
export const botName = "Archie"
export const botEmail = "matthew.vandergrift@ferguson.com"
export const baseMember = {
    "id":botId,
    "name":botName,
    "objectId":"",
    "givenName":"",
    "surname":"",
    "mail":botEmail,
    "userPrincipalName":botEmail,
    "tenantId":"",
    "aadObjectId":""
}
export const memberVandy = {...baseMember,
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
}

export function memberUser (botId, botName, botEmail) {
    return {...baseMember, botId, botName, botEmail}
}
