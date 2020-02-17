// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    TurnContext,
    MessageFactory,
    TeamsInfo,
    TeamsActivityHandler,
    CardFactory,
    ActionTypes
} = require('botbuilder');
const TextEncoder = require('util').TextEncoder;
const request = require('request');

class TeamsConversationBot extends TeamsActivityHandler {
    constructor() {
        super();

        // Sends welcome messages to conversation members when they join the conversation.
        // Messages are only sent to conversation members who aren't the bot.
        this.onMembersAdded(async (context, next) => {
            // Iterate over all new members added to the conversation
            const user = await TeamsInfo.getMembers(context);
            for (const idx in context.activity.membersAdded) {
                // Greet anyone that was not the target (recipient) of this message.
                // Since the bot is the recipient for events from the channel,
                // context.activity.membersAdded === context.activity.recipient.Id indicates the
                // bot was added to the conversation, and the opposite indicates this is a user.
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    
                    var option = {
                        uri: "https://prod-80.westus.logic.azure.com:443/workflows/e6e84bb1f9e44c7e883068fdd922c3a1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=snSGwlZiWX9QnYtaPyLgrWamp77valTMiVundaszF4Q",
                        qs: {
                            "mail": user[0].mail,
                            "botid": user[0].id,
                            "name" : user[0].givenName
                        }
                      };
                    request.post({ //update to company excel with phone_number & address
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
                    // await context.sendActivity("You are seeing this message because the bot received at least one 'ConversationUpdate' " +
                    //     'event, indicating you (and possibly others) joined the conversation. If you are using the emulator, ' +
                    //     'pressing the \'Start Over\' button to trigger this event again. The specifics of the \'ConversationUpdate\' ' +
                    //     'event depends on the channel. You can read more information at https://aka.ms/about-botframework-welcome-user');
                    // await context.sendActivity('It is a good pattern to use this event to send general greeting to user, explaining what your bot can do. ' +
                    //     'In this example, the bot handles \'hello\', \'hi\', \'help\' and \'intro\'. ' +
                    //     'Try it now, type \'hi\'');
                    
                    await context.sendActivity(JSON.stringify(user[0].id));   
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        
        this.onMessage(async (context, next) => {
            TurnContext.removeRecipientMention(context.activity);
            switch (context.activity.text.trim()) {
            case 'MentionMe':
                await this.mentionActivityAsync(context);
                break;
            case 'UpdateCardAction':
                await this.updateCardActivityAsync(context);
                break;
            case 'Delete':
                await this.deleteCardActivityAsync(context);
                break;
            case 'MessageAllMembers':
                await this.messageAllMembersAsync(context);
                break;
            default:
                const value = { count: 0 };
                const card = CardFactory.heroCard(
                    'Welcome Card',
                    null,
                    [
                        {
                            type: ActionTypes.MessageBack,
                            title: 'Update Card',
                            value: value,
                            text: 'UpdateCardAction'
                        },
                        {
                            type: ActionTypes.MessageBack,
                            title: 'Message all members',
                            value: null,
                            text: 'MessageAllMembers'
                        }]);
                await context.sendActivity({ attachments: [card] });
                break;
            }
            await next();
        });

        this.onMembersAddedActivity(async (context, next) => {
            context.activity.membersAdded.forEach(async (teamMember) => {
                if (teamMember.id !== context.activity.recipient.id) {
                    await context.sendActivity(`Welcome to the team ${ teamMember.givenName } ${ teamMember.surname }`);
                }
            });
            await next();
        });
    }

    async mentionActivityAsync(context) {
        const mention = {
            mentioned: context.activity.from,
            text: `<at>${ new TextEncoder().encode(context.activity.from.name) }</at>`,
            type: 'mention'
        };

        const replyActivity = MessageFactory.text(`Hi ${ mention.text }`);
        replyActivity.entities = [mention];
        await context.sendActivity(replyActivity);
    }

    async updateCardActivityAsync(context) {
        const data = context.activity.value;
        data.count += 1;

        const card = CardFactory.heroCard(
            'Welcome Card',
            `Updated count - ${ data.count }`,
            null,
            [
                {
                    type: ActionTypes.MessageBack,
                    title: 'Update Card',
                    value: data,
                    text: 'UpdateCardAction'
                },
                {
                    type: ActionTypes.MessageBack,
                    title: 'Message all members',
                    value: null,
                    text: 'MessageAllMembers'
                },
                {
                    type: ActionTypes.MessageBack,
                    title: 'Delete card',
                    value: null,
                    text: 'Delete'
                }
            ]);

        card.id = context.activity.replyToId;
        await context.updateActivity({ attachments: [card], id: context.activity.replyToId, type: 'message' });
    }

    async deleteCardActivityAsync(context) {
        await context.deleteActivity(context.activity.replyToId);
    }

    // If you encounter permission-related errors when sending this message, see
    // https://aka.ms/BotTrustServiceUrl
    async messageAllMembersAsync(context) {
        //const members1 = await TeamsInfo.getMembers(context);

       

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

        // var teamConversationData = turnContext.Activity.GetChannelData();
        // var connectorClient = new ConnectorClient(new Uri(activity.ServiceUrl), _credentialProvider.AppId, _credentialProvider.Password);

        // var userId = "<UserIdToSendTo>";
        // var tenantId = teamConversationData.Tenant.Id;
        // var parameters = new ConversationParameters
        // {
        //     Members = new[] { new ChannelAccount(userId) },
        //     ChannelData = new TeamsChannelData
        //     {
        //         Tenant = new TenantInfo(tenantId),
        //     },
        // };

        // var conversationResource = await connectorClient.Conversations.CreateConversationAsync(parameters);
        // var message = Activity.CreateMessageActivity();
        // message.Text = "This is a proactive message.";
        // await connectorClient.Conversations.SendToConversationAsync(conversationResource.Id, (Activity)message);

        // await context.sendActivity(MessageFactory.text('All messages have been sent.'+JSON.stringify(TeamsInfo)));
        console.log(members1)
        // await context.sendActivity('All messages have been sent.');
        await context.sendActivity(members1[0].id);
    }
}

module.exports.TeamsConversationBot = TeamsConversationBot;
