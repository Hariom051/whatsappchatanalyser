import { Last7DaysAnalyzer } from "./analyze";
import { WhatsAppChatParser } from "./chatParser";

const whatsAppChatParserService = new WhatsAppChatParser();

const anaylzeService = new Last7DaysAnalyzer();

export { anaylzeService, whatsAppChatParserService };
