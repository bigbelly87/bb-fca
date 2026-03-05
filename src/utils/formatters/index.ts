import * as stream from "stream";
import formatID from "./value/formatID";
import formatDate from "./value/formatDate";
import formatCookie from "./value/formatCookie";
import { _formatAttachment, formatAttachment } from "./data/formatAttachment";
import { formatDeltaMessage, formatDeltaEvent, formatDeltaReadReceipt, getAdminTextMessageType } from "./data/formatDelta";

export function isReadableStream(obj: any): boolean {
  return obj instanceof stream.Stream && typeof (obj as any)._read === "function" && typeof (obj as any)._readableState === "object";
}

export function decodeClientPayload(payload: number[]): any {
  return JSON.parse(String.fromCharCode.apply(null, payload as any));
}

export function formatMessage(m: any): any {
  const originalMessage = m.message ? m.message : m;
  const obj: any = {
    type: "message",
    senderName: originalMessage.sender_name,
    senderID: formatID(originalMessage.sender_fbid.toString()),
    participantNames: originalMessage.group_thread_info?.participant_names || [originalMessage.sender_name.split(" ")[0]],
    participantIDs: originalMessage.group_thread_info?.participant_ids.map((v: any) => formatID(v.toString())) || [formatID(originalMessage.sender_fbid)],
    body: originalMessage.body || "",
    threadID: formatID((originalMessage.thread_fbid || originalMessage.other_user_fbid).toString()),
    threadName: originalMessage.group_thread_info?.name || originalMessage.sender_name,
    location: originalMessage.coordinates || null,
    messageID: originalMessage.mid?.toString() || originalMessage.message_id,
    attachments: formatAttachment(originalMessage.attachments, originalMessage.attachmentIds, originalMessage.attachment_map, originalMessage.share_map),
    timestamp: originalMessage.timestamp,
    tags: originalMessage.tags,
    reactions: originalMessage.reactions || [],
    isUnread: originalMessage.is_unread
  };
  if (m.type === "pages_messaging") obj.pageID = m.realtime_viewer_fbid.toString();
  obj.isGroup = obj.participantIDs.length > 2;
  return obj;
}

export function formatEvent(m: any): any {
  const originalMessage = m.message ? m.message : m;
  let logMessageType = originalMessage.log_message_type;
  let logMessageData: any;
  if (logMessageType === "log:generic-admin-text") {
    logMessageData = originalMessage.log_message_data.untypedData;
    logMessageType = getAdminTextMessageType(originalMessage.log_message_data.message_type);
  } else {
    logMessageData = originalMessage.log_message_data;
  }
  return { ...formatMessage(originalMessage), type: "event", logMessageType, logMessageData, logMessageBody: originalMessage.log_message_body };
}

export function formatHistoryMessage(m: any): any {
  return m.action_type === "ma-type:log-message" ? formatEvent(m) : formatMessage(m);
}

export function formatTyp(event: any): any {
  return { isTyping: !!event.st, from: event.from.toString(), threadID: formatID((event.to || event.thread_fbid || event.from).toString()), fromMobile: event.hasOwnProperty("from_mobile") ? event.from_mobile : true, userID: (event.realtime_viewer_fbid || event.from).toString(), type: "typ" };
}

export function formatReadReceipt(event: any): any {
  return { reader: event.reader.toString(), time: event.time, threadID: formatID((event.thread_fbid || event.reader).toString()), type: "read_receipt" };
}

export function formatRead(event: any): any {
  return { threadID: formatID(((event.chat_ids && event.chat_ids[0]) || (event.thread_fbids && event.thread_fbids[0])).toString()), time: event.timestamp, type: "read" };
}

export function formatThread(data: any): any {
  return { threadID: formatID(data.thread_fbid.toString()), participants: data.participants.map((p: any) => formatID(p)), participantIDs: data.participants.map((p: any) => formatID(p)), name: data.name, nicknames: data.custom_nickname, snippet: data.snippet, snippetSender: formatID((data.snippet_sender || "").toString()), unreadCount: data.unread_count, messageCount: data.message_count, imageSrc: data.image_src, timestamp: data.timestamp, muteUntil: data.mute_until, isGroup: data.thread_type === 2, isArchived: data.is_archived, canReply: data.can_reply, lastMessageTimestamp: data.last_message_timestamp, lastReadTimestamp: data.last_read_timestamp, emoji: data.custom_like_icon, color: data.custom_color, adminIDs: data.admin_ids, threadType: data.thread_type };
}

export function formatPresence(presence: any, userID: string): any {
  return { type: "presence", timestamp: presence.la * 1000, userID, statuses: presence.a };
}

export function formatProxyPresence(presence: any, userID: string): any | null {
  if (presence.lat === undefined || presence.p === undefined) return null;
  return { type: "presence", timestamp: presence.lat * 1000, userID, statuses: presence.p };
}

export { formatID, formatDate, formatCookie, formatAttachment, _formatAttachment, formatDeltaMessage, formatDeltaEvent, formatDeltaReadReceipt, getAdminTextMessageType };
