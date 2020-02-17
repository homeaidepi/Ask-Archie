
const path = require('path');
const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');
const {
    TurnContext,
    MessageFactory,
    TeamsInfo,
    TeamsActivityHandler,
    CardFactory,
    ActionTypes
} = require('botbuilder');

const { TeamsConversationBot } = require('./bots/teamsConversationBot');
const { call } = require('./bots/calluser');

// Read botFilePath and botFileSecret from .env file.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Create the bot that will handle incoming messages.
const bot = new TeamsConversationBot();

const conversationReferences = {};
const callbot = new call(conversationReferences);

// Create HTTP server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
});

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // MicrosoftAppCredentials.trustServiceUrl("http://127.0.0.1:3978/api/messages")
        await callbot.run(context);
    });
});


server.post('/call/:name/:botid/:mail', async (req, res) => {
    var name = req.params.name;
    var botid = req.params.botid;
    var mail = req.params.mail;
    console.log(name);
    for (const conversationReference of Object.values(conversationReferences)) {
        await adapter.createConversation(conversationReference, async turnContext => {
            // MicrosoftAppCredentials.TrustServiceUrl(turnContext.Activity.ServiceUrl); 

            var members1 = [
                {
                    "id":botid,
                    "name":name,
                    "objectId":"",
                    "givenName":"",
                    "surname":"",
                    "email":mail,
                    "userPrincipalName":mail,
                    "tenantId":"",
                    "aadObjectId":""
                }];
            console.log(members1)

            //send messages to teams user 
            console.log(members1)
            const teamMember = members1[0];
            const message = MessageFactory.text(`Hello ${ teamMember.name } . I'm a Teams conversation bot.`);
    
                var ref = TurnContext.getConversationReference(turnContext.activity);
                ref.user = teamMember;
    
                await turnContext.adapter.createConversation(ref,
                    async (t1) => {
                        const ref2 = TurnContext.getConversationReference(t1.activity);
                        await t1.adapter.continueConversation(ref2, async (t2) => {
                            await t2.sendActivity('proactive hello');
                            await t2.sendActivity(message);
                            // await t2.sendActivity(members1[0].id);
                        });
                    });
        });
    }

    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.write('<html><body><h1>Proactive messages have been sent.</h1></body></html>');
    res.end();
});







