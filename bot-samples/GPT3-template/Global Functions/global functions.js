// CB_Global_Functions: v.0.1
// Init Conversation function located at bottom of page

var region = 'sy';

var arrays = {
  yes: ['👍', 'yes', 'yse', 'yeah', 'yep', 'yup', 'sure', 'correct'],
  no: ['👎', 'no', 'nah', 'nope', 'not sure'],
  months_long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  months_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days_short: ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'],
  days_long: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
};

var aliases = {
  askMaven: function () { return botContext.askMaven(); },
  delay: function (a) { botContext.setMessageDelay(a); },
  event: function (user_message, event_name, event_details) { botContext.logCustomEvent(user_message, event_name, event_details); },
  getAllNamespaceProps: function (n) { return botContext.getContextDataForConversation(n); },
  getContextConv: function (n, p) { this.log("set context data for conversation scope: " + botContext.getContextDataForConversation(n, p)); },
  getEnvVar: function (e) { return botContext.getEnvVariable(e); },
  getNamespaceProp: function (n, p) { return botContext.getGlobalContextData(n, p); },
  getVar: function (a) { return botContext.getBotVariable(a); },
  ignoreMax: function () { botContext.setAllowMaxTextResponse(true); },
  jumpTo: function (interaction_name) { botContext.setTriggerNextMessage(interaction_name); },
  log: function (e) { botContext.printDebugMessage(e); },
  logVar: function (a, b) { botContext.printDebugMessage(a + ': ' + b); },
  msgs: function (val) { botContext.sendMessages(val); },
  QR: function (message, array) { botContext.sendMessageWithQuickReplies(message, array); },
  setContextConv: function (n, p, v) { this.log("set context data for conversation scope: " + botContext.setContextDataForConversation(n, p, v)); },
  setContextGlobal: function (n, p, v) { this.log("setContext GLOBAL: namespace: " + botContext.setGlobalContextData(n, p, v)); },
  setVar: function (a, b) { botContext.setBotVariable(a, b, true, false); },
  setVarDialog: function (arg, val) { botContext.setBotVariable(arg, val, true, false); },
  setVarPerm: function (arg, val) { botContext.setBotVariable(arg, val, true, true); },
  txt: function (arg) { botContext.sendMessage(arg); },
  userSaid: function () { return botContext.getCurrentUserMessage(); },
  wvvar: function (val) { return botContext.getWebViewVariable(val); }
};

var helpers = {
  countWords: function (s) { s = s.replace(/(^\s*)|(\s*$)/gi, ""); s = s.replace(/[ ]{2,}/gi, " "); s = s.replace(/\n /, "\n"); return s.split(' ').filter(function (str) { return str != ""; }).length; },
  previous: function () { var bc = this.getVar("breadcrumb") || this.getVar("firstInteraction"); if (!bc) { return; } this.log("previous(): interacation: " + bc); this.jumpTo(bc); },
  makeid: function (length) { var result = ''; var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; var charactersLength = characters.length; for (var i = 0; i < length; i++) { result += characters.charAt(Math.floor(Math.random() * charactersLength)); } return result; },
  start: function () { this.setVar('start', 'true'); },
  initConv: function (interaction_name) { this.setVar('breadcrumb', !interaction_name ? this.getVar('firstInteraction') : interaction_name); if (!this.tf(getVar('INIT'))) { this.setVar('INIT', 'true'); this.jumpTo(this.getVar('init_interaction')); } },
  logJ: function (a, b) { botContext.printDebugMessage(a + ': ' + JSON.stringify(b)); },
  returnCustomerInfo: function (customerInfo) { if (customerInfo) { log("customerId:" + customerInfo.customerId); return customerInfo.customerId; } else { return 'not available'; } },
  tf: function (e) { return (e == 'true' || e == true); },
  getTime: function (params) { var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; var MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; var tzOffset = Number(params.timezoneOffset * 3600000); var gmtOffset = Number(new Date().getTimezoneOffset() * 60000); var c = ':'; var d = '-'; var lt = new Date(params.time + tzOffset + gmtOffset); var u = { year: lt.getFullYear(), month: lt.getMonth(), date: lt.getDate(), day: lt.getDay(), hour: lt.getHours(), minute: lt.getMinutes(), second: lt.getSeconds(), ms: lt.getMilliseconds() }; u.full = days[u.day] + ', ' + u.date + d + MONTHS_LONG[u.month] + d + u.year + ',' + u.hour + c + u.minute + c + u.second + '.' + u.ms; var nowL = new Date(new Date().getTime() + params.timezoneOffset); var n = { year: nowL.getFullYear(), month: nowL.getMonth(), date: nowL.getDate(), day: nowL.getDay(), hour: nowL.getHours(), minute: nowL.getMinutes(), second: nowL.getSeconds(), ms: nowL.getMilliseconds() }; n.full = days[n.day] + ', ' + n.date + d + MONTHS_LONG[n.month] + d + n.year + ',' + n.hour + c + n.minute + c + n.second + '.' + n.ms; var timeHours = Number(String(u.hour) + String(u.minute)); var timeOfDay = 'morning'; if (timeHours > 1800) { timeOfDay = 'evening'; } else if (timeHours > 1300) { timeOfDay = 'afternoon'; } else if (timeHours > 1200) { timeOfDay = 'midday'; } var diffDaysHours = Math.ceil(Math.abs(lt - nowL) / (1000 * 60 * 60 * 24)); var diffDays = diffDaysHours; var diffHours = Math.ceil(Math.abs(lt - nowL) / (1000 * 60 * 60)); var adj = 'today'; var relativeTime; if (n.year === lt.year && n.month === lt.month && n.date === lt.date) { diffDays = 0; if (timeOfDay === 'evening' || timeOfDay === 'afternoon' || timeOfDay === 'morning') { adj = 'this'; relativeTime = adj + ' ' + timeOfDay; } } if (diffDays === 1) { adj = 'tomorrow'; relativeTime = adj + ' ' + timeOfDay; if (timeOfDay === 'midday') { relativeTime = 'midday tomorrow'; } } else if (diffDays > 1) { adj = days[u.day]; relativeTime = adj + ' ' + timeOfDay; if (u.day < n.day) { adj = 'next'; relativeTime = adj + ' ' + timeOfDay; } } var hour = u.hour < 12 ? '0' + u.hour : u.hour; var minute = u.minute < 10 ? '0' + u.minute : u.minute; var detail = { ampm: u.hour > 12 ? 'pm' : 'am', timeHours: timeHours, timeOfDay: timeOfDay, long: u.full = days[u.day] + ', ' + u.date + d + MONTHS_LONG[u.month] + d + u.year + ',' + u.hour + c + u.minute + c + u.second + '.' + u.ms, short: u.full = days[u.day] + ', ' + u.date + d + MONTHS_SHORT[u.month] + d + u.year + ',' + u.hour + c + u.minute + c + u.second + '.' + u.ms }; var relative = { hours: diffHours, diffDays: Math.ceil(Math.abs(lt - nowL) / (1000 * 60 * 60 * 24)), fromNow: relativeTime, fromNowLong: hour + ':' + minute + detail.ampm + ' ' + relativeTime }; var difference = { hours: diffHours, days: diffDays, diffDaysHours: diffDaysHours }; return { units: u, relative: relative, difference: difference, detail: detail, now: n }; }
};


// assign functions to 'cb'
var cb = {};
var aA = aliases;
var aB = helpers;
for (var a in Object.keys(aA)) { cb[Object.keys(aA)[a]] = aA[Object.keys(aA)[a]]; }
for (var a in Object.keys(aB)) { cb[Object.keys(aB)[a]] = aB[Object.keys(aB)[a]]; }
var regionCode = region === 'sy' ? 'z3' : region === 'lo' ? 'lo' : 'va';


// CONFIGURE BOT SETTINGS

var SETTINGS = {
  MAIN: {
    brandName: "Liveperson",
    region: region,
    regionCode: regionCode
  },
  BOT_SETTINGS: {
    botName: 'Test Bot 02',
    botId: botContext.chatBotId,
    namespaces: ['botDebugger', 'routing', 'reporting'],
  },
  CONVERSATION_SETTINGS: {
    errorThreshold: 2,
    errorCount: 0, // starting value, do not change
    UNMATCHED_PHRASE_01: "Sorry, I didn't quite get that",
    UNMATCHED_PHRASE_02: 'Please try rephrasing',
    UNMATCHED_PHRASE_03: "I'm stumped! Try asking a simple question (one at a time)",
    LONG_MESSAGE_LIMIT: 20,
    LONG_MESSAGE_RESPONSE: "That's a big question, please try rephrasing with a shorter question (I work best with short, concise questions)",
    KNOWLEDGE_BASE_ENABLED: false,
    ERROR_ESCALATION_MESSAGE: "This seems to be running off the rails a little!",
    init_interaction: "getMessagingHistoryByConsumerId",
    firstInteraction: 'WELCOME',
    transferMessage: 'BLANK_MESSAGE',
    escalationMessage: "It seem's I'm having some trouble, please bear with me a moment while I check if there's a human supervisor who can assist",
    testMode: false,
    INIT: false,
    convStart: false
  },
  API_SETTINGS: {
    asyncMessagingEnt: region + '.msg.liveperson.net',
    msgHist: region + '.msghist.liveperson.net',
    smt: region + '.msg.liveperson.net',
    leDataReporting: region + '.data.liveperson.net',
    askMaven: regionCode + '.askmaven.liveperson.net',
    agentTransfer: region + '.bc-bot.liveperson.net',
    acr: regionCode + '.acr.liveperson.net',
    MSGINT_AUTOCLOSE: true,
    MSGINT_HOURS_SINCE_AUTOCLOSE: 24,
    MSGINT_ROUTE_PREVIOUS_AGENT: false,
    minimumIntentScore: getEnvVar('minimumIntentScore'),
    modelVersionId: getEnvVar('modelVersionId'),
    organizationId: getEnvVar('organizationId'),
    CB_AUTH_TOKEN: getEnvVar('CB_AUTH_TOKEN'),
    INTENT_DOMAIN_ID: getEnvVar('INTENT_DOMAIN_ID'),
    entityDataSourceId: getEnvVar('entityDataSourceId'),
  },
  DEFAULTS: {
    tz: 11,
    defaultSkillId: "",
    defaultSkillName: "",
  },
  CONTEXT_SESSION_STORE: { // any attributes to be set in CSS on start of bot session
    namespace: 'routing',
    routing_channel: showChannel(),
    currentSkill: botContext.getLPEngagementAttribute("currentSkillId"),
    previousSkill: botContext.getLPEngagementAttribute("previousSkillId"),
    campaignId: botContext.getLPEngagementAttribute('campaignId'),
    engagementId: botContext.getLPEngagementAttribute("engagementId"),
    customerInfo: botContext.getLPCustomerInfo(),
    personalInfo: JSON.stringify(botContext.getLPUserPersonalInfo()),
    channel: botContext.getUserChannel(),
    customerId: returnCustomerInfo(botContext.getLPCustomerInfo()),
  },
  CONVERSATION_ATTRIBUTES: {
    currentSkill: botContext.getLPEngagementAttribute("currentSkillId"),
    previousSkill: botContext.getLPEngagementAttribute("previousSkillId"),
    campaignId: botContext.getLPEngagementAttribute('campaignId'),
    accountId: botContext.getLPAccountId(),
    rtSessionId: botContext.getLPEngagementAttribute("rtSessionId"),
    sharkSessionId: botContext.getLPEngagementAttribute("sharkSessionId"),
    sharkVisitorId: botContext.getLPEngagementAttribute("sharkVisitorId"),
    bearerToken: botContext.getLPEngagementAttribute("BearerToken"),
    AUTH_TOKEN: botContext.getLPEngagementAttribute("BearerToken"),
    chatSessionKey: botContext.getLPEngagementAttribute("chatSessionKey"),
    agentSessionId: botContext.getLPEngagementAttribute("agentSessionId"),
    engid: botContext.getLPEngagementAttribute("engagementId"),
    conversationId: botContext.getConversationId(),
    customerInfo: botContext.getLPCustomerInfo(),
    personalInfo: JSON.stringify(botContext.getLPUserPersonalInfo()),
    userId: botContext.getUserPlatformId(),
    userPlatformId: botContext.getUserPlatformId(),
    consumerParticipantId: botContext.getUserPlatformId(),
    channel: botContext.getUserChannel(),
    customerId: cb.returnCustomerInfo(botContext.getLPCustomerInfo()),
  }
};


// Initialise conversation
function __initConversation() {
  // do not alter below code
  if (botContext.isContextApiEnabled()) {
    for (var n in SETTINGS.BOT_SETTINGS.namespaces) { botContext.registerContextNamespace(SETTINGS.BOT_SETTINGS.namespaces[n]); } 
  }
  var s = {};
  for (var a in Object.keys(SETTINGS)) {
    var k = Object.keys(SETTINGS)[a];
    var v = SETTINGS[Object.keys(SETTINGS)[a]];
    if (!Array.isArray(v) && 'object' === typeof v) {
      for (var b in Object.keys(v)) {
        var k1 = Object.keys(v)[b]; var v1 = v[k1];
        s[k1] = v1; cb.setVar(k1, v1);
        if ('CONTEXT_SESSION_STORE' === k) { setContextConv(SETTINGS.contextSessionStore.namespace, k, v); }
      }
    }
  }
  // your code goes here...

}