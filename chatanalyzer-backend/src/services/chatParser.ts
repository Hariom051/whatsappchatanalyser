import fs from "fs";
import { DateUtil } from "../shared/utils/dateUtil";

export interface MessageEvent {
  date: string;
  user: string;
}

export interface JoinEvent {
  date: string;
  user: string;
}

export class WhatsAppChatParser {
  private readonly JOIN_VIA_LINK_REGEX =
    /^(\d{1,2}\/\d{1,2}\/\d{2}),\s\d{1,2}:\d{2}\s(?:AM|PM)\s-\s(.+?)\sjoined using this group's invite link$/;

  private readonly MESSAGE_IN_GROUP_REGEX =
    /^(\d{1,2}\/\d{1,2}\/\d{2}),\s\d{1,2}:\d{2}\s(?:AM|PM)\s-\s([^:]+):\s(.*)$/;

  public parse(filePath: string): {
    messagedInGroup: MessageEvent[];
    joinedGroup: JoinEvent[];
  } {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    const messagedInGroup: MessageEvent[] = [];
    const joinedGroup: JoinEvent[] = [];

    for (const line of lines) {
      let match = line.match(this.JOIN_VIA_LINK_REGEX);
      if (match) {
        joinedGroup.push({
          date: DateUtil.normalizeDate(match[1]),
          user: match[2].trim(),
        });
        continue;
      }

      match = line.match(this.MESSAGE_IN_GROUP_REGEX);
      if (match) {
        messagedInGroup.push({
          date: DateUtil.normalizeDate(match[1]),
          user: match[2].trim(),
        });
        continue;
      }
    }

    return { messagedInGroup, joinedGroup };
  }
}
