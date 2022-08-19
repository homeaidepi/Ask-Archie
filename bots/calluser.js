import { TurnContext, MessageFactory, TeamsInfo, TeamsActivityHandler } from 'botbuilder';
import { memberVandy } from '../src/const';
import { CardFactory } from 'botbuilder';

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
            var user = await TeamsInfo.getMembers(context);
            for (const idx in context.activity.membersAdded) {
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                   let heroCard = CardFactory.heroCard(
                        'Ask Archie the Architect',
                        CardFactory.images(['https://user-images.githubusercontent.com/100984270/185701461-3f123b63-79ed-4aff-9a54-3ffd978bdd02.png']),
                        CardFactory.actions([
                            {
                                type: 'openUrl',
                                title: 'Getting started',
                                value: 'https://github.com/homeaidepi/Ask-Archie/blob/main/README.md#teams-conversation-bot-with-power-automate'
                            }
                        ])
                    );
                    await context.sendActivity({ attachments: [heroCard] });
                    await context.sendActivity(`Welcome ${context.activity.membersAdded[idx].name} to Ask Archie!`);   
                    await context.sendActivity(`Please type your message below to Ask Archie a question.`);   
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            this.addConversationReference(context.activity);
            var members = await TeamsInfo.getMembers(context);

            await context.sendActivity("Hi," + members[0].name + " I am Archie the Architect bot? ");
            console.log(members);
            // TurnContext.removeRecipientMention(context.activity);
            // await this.messageAllMembersAsync(context);
        });

    }

    async messageAllMembersAsync(context) {
        var members = [memberVandy];
        
        members.forEach(async (teamMember) => {
            var message = MessageFactory.text(`Hello ${ teamMember.givenName } ${ teamMember.surname }. I'm Archie the Architect bot.`);
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
        await context.sendActivity(members[0].id);
    }

    addConversationReference(activity) {
        var conversationReference = TurnContext.getConversationReference(activity);
        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }
}

const _call = call;
export { _call as call };