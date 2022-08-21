import { TurnContext, MessageFactory, TeamsInfo, TeamsActivityHandler } from 'botbuilder';
import { memberVandy } from '../src/const';
import { CardFactory } from 'botbuilder';

let conversation = [];

class chat extends TeamsActivityHandler {
    constructor(conversationReferences) {
        super();

        this.conversationReferences = conversationReferences;

        this.onConversationUpdate(async (context, next) => {
            this.addConversationReference(context.activity);

            await next();
        });

        //When User first use this bot
        this.onMembersAdded(async (context, next) => {
            for (const idx in context.activity.membersAdded) {
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                   let heroCard = CardFactory.heroCard(
                        'Ask Archie the Architect',
                        CardFactory.images(['https://user-images.githubusercontent.com/100984270/185800062-2df9be85-dda9-40b0-b7a4-f640b5209020.png']),
                        CardFactory.actions([
                            {
                                type: 'openUrl',
                                title: 'Getting started',
                                value: 'https://github.com/homeaidepi/Ask-Archie/blob/main/README.md#teams-conversation-bot-with-power-automate'
                            }
                        ])
                    );
                    await context.sendActivity({ attachments: [heroCard] });
                    await context.sendActivity(`Hi ${context.activity.membersAdded[idx].name}, welcome to Ask Archie!`);   
                    await context.sendActivity(`I'm Archie the Architect, please type your message below to ask me a question.`);   
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            this.addConversationReference(context.activity);
            var members = await TeamsInfo.getMembers(context);
            
            let user = members.find(member => member.id === context.activity.from.id);
            let userInput = context.activity.text;
            let response = `OK, ${user.name}. I understood you would like to me to "${userInput}"... one moment while I see if I can help you.`;

            conversation.push(response);
            await giveStatus(MessageFactory.text(response));
        });
    }

    async attemptLift(user, userInput, context) {
        
    }

    async giveStatus(status, context) {
        return await context.sendActivity(MessageFactory.text(status));
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    addConversationReference(activity) {
        var conversationReference = TurnContext.getConversationReference(activity);
        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }
}

const _chat = chat;
export { _chat as chat };