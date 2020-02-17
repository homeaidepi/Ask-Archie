const {
    TurnContext,
    MessageFactory,
    TeamsInfo,
    TeamsActivityHandler,
    CardFactory,
    ActionTypes
} = require('botbuilder');
const request = require('request');
const automate_url = "https://prod-80.westus.logic.azure.com:443/workflows/e6e84bb1f9e44c7e883068fdd922c3a1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=snSGwlZiWX9QnYtaPyLgrWamp77valTMiVundaszF4Q";

class call extends TeamsActivityHandler {
    constructor(conversationReferences) {
        super();

        this.conversationReferences = conversationReferences;

        this.onConversationUpdate(async (context, next) => {
            this.addConversationReference(context.activity);

            await next();
        });

        //When User first use this bot
        this.onMembersAdded(async (context, next) => {

            const user = await TeamsInfo.getMembers(context);
            for (const idx in context.activity.membersAdded) {
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    
                    var option = {
                        uri: automate_url,
                        qs: {
                            "mail": user[0].mail,
                            "botid": user[0].id,
                            "name" : user[0].givenName
                        }
                        // qs: {
                        //     "mail": "user[0].mail",
                        //     "botid": "user[0].id",
                        //     "name" : "user[0].givenName"
                        // }
                      };
                    request.post({ //update user id in bot to CDS
                        headers: {
                            'content-type': 'application/json'
                        },
                        url: option.uri,
                        body: option.qs,
                        json: true
                    }, function (err, res, body) {
                        console.log(body)
                    })
                    await context.sendActivity('Welcome to the \'Welcome User\' Bot. This bot will introduce you to welcoming and greeting users.');
                    await context.sendActivity('insert your bot id in CDS ');
                    await context.sendActivity(JSON.stringify(user[0].givenName));   
                    await context.sendActivity(JSON.stringify(user[0].mail));   
                    await context.sendActivity(JSON.stringify(user[0].id));   
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {

            
            this.addConversationReference(context.activity);
            const members1 = await TeamsInfo.getMembers(context);

            await context.sendActivity("Hi," + members1[0].name + " I am IT bot");
            console.log(members1);
            // TurnContext.removeRecipientMention(context.activity);
            // await this.messageAllMembersAsync(context);
            
        });

    }

    async messageAllMembersAsync(context) {
        var members1 = [
            {
                "id":"29:1HNLPvemCsFL99qYSRopKC1pdDHxQYKSYDFniMi0eGMeqAE-O3UZHjkph7hd1gzpChwVqdHbULufOpB1IICQDAw",
                "name":"dennis lee",
                "objectId":"d22605da-53e5-44d6-bc96-adf79c20853a",
                "givenName":"lee",
                "surname":"dennis",
                "email":"dennis.lee@sftwo.onmicrosoft.com",
                "userPrincipalName":"dennis.lee@sftwo.onmicrosoft.com",
                "tenantId":"6185a5f1-1b6d-4634-851d-001f1446f259",
                "aadObjectId":"d22605da-53e5-44d6-bc96-adf79c20853a"
            }];
        
        members1.forEach(async (teamMember) => {
            const message = MessageFactory.text(`Hello ${ teamMember.givenName } ${ teamMember.surname }. I'm a Teams conversation bot.`);

            var ref = TurnContext.getConversationReference(context.activity);
            ref.user = teamMember;

            await context.adapter.createConversation(ref,
                async (t1) => {
                    const ref2 = TurnContext.getConversationReference(t1.activity);
                    await t1.adapter.continueConversation(ref2, async (t2) => {
                        await t2.sendActivity(message);
                    });
                });
        });
        await context.sendActivity(members1[0].id);
    }

    addConversationReference(activity) {
        const conversationReference = TurnContext.getConversationReference(activity);
        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }
}

module.exports.call = call;