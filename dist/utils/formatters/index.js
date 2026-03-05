"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminTextMessageType = exports.formatDeltaReadReceipt = exports.formatDeltaEvent = exports.formatDeltaMessage = exports._formatAttachment = exports.formatAttachment = exports.formatCookie = exports.formatDate = exports.formatID = void 0;
exports.isReadableStream = isReadableStream;
exports.decodeClientPayload = decodeClientPayload;
exports.formatMessage = formatMessage;
exports.formatEvent = formatEvent;
exports.formatHistoryMessage = formatHistoryMessage;
exports.formatTyp = formatTyp;
exports.formatReadReceipt = formatReadReceipt;
exports.formatRead = formatRead;
exports.formatThread = formatThread;
exports.formatPresence = formatPresence;
exports.formatProxyPresence = formatProxyPresence;
const stream = __importStar(require("stream"));
const formatID_1 = __importDefault(require("./value/formatID"));
exports.formatID = formatID_1.default;
const formatDate_1 = __importDefault(require("./value/formatDate"));
exports.formatDate = formatDate_1.default;
const formatCookie_1 = __importDefault(require("./value/formatCookie"));
exports.formatCookie = formatCookie_1.default;
const formatAttachment_1 = require("./data/formatAttachment");
Object.defineProperty(exports, "_formatAttachment", { enumerable: true, get: function () { return formatAttachment_1._formatAttachment; } });
Object.defineProperty(exports, "formatAttachment", { enumerable: true, get: function () { return formatAttachment_1.formatAttachment; } });
const formatDelta_1 = require("./data/formatDelta");
Object.defineProperty(exports, "formatDeltaMessage", { enumerable: true, get: function () { return formatDelta_1.formatDeltaMessage; } });
Object.defineProperty(exports, "formatDeltaEvent", { enumerable: true, get: function () { return formatDelta_1.formatDeltaEvent; } });
Object.defineProperty(exports, "formatDeltaReadReceipt", { enumerable: true, get: function () { return formatDelta_1.formatDeltaReadReceipt; } });
Object.defineProperty(exports, "getAdminTextMessageType", { enumerable: true, get: function () { return formatDelta_1.getAdminTextMessageType; } });
function isReadableStream(obj) {
    return obj instanceof stream.Stream && typeof obj._read === "function" && typeof obj._readableState === "object";
}
function decodeClientPayload(payload) {
    return JSON.parse(String.fromCharCode.apply(null, payload));
}
function formatMessage(m) {
    const originalMessage = m.message ? m.message : m;
    const obj = {
        type: "message",
        senderName: originalMessage.sender_name,
        senderID: (0, formatID_1.default)(originalMessage.sender_fbid.toString()),
        participantNames: originalMessage.group_thread_info?.participant_names || [originalMessage.sender_name.split(" ")[0]],
        participantIDs: originalMessage.group_thread_info?.participant_ids.map((v) => (0, formatID_1.default)(v.toString())) || [(0, formatID_1.default)(originalMessage.sender_fbid)],
        body: originalMessage.body || "",
        threadID: (0, formatID_1.default)((originalMessage.thread_fbid || originalMessage.other_user_fbid).toString()),
        threadName: originalMessage.group_thread_info?.name || originalMessage.sender_name,
        location: originalMessage.coordinates || null,
        messageID: originalMessage.mid?.toString() || originalMessage.message_id,
        attachments: (0, formatAttachment_1.formatAttachment)(originalMessage.attachments, originalMessage.attachmentIds, originalMessage.attachment_map, originalMessage.share_map),
        timestamp: originalMessage.timestamp,
        tags: originalMessage.tags,
        reactions: originalMessage.reactions || [],
        isUnread: originalMessage.is_unread
    };
    if (m.type === "pages_messaging")
        obj.pageID = m.realtime_viewer_fbid.toString();
    obj.isGroup = obj.participantIDs.length > 2;
    return obj;
}
function formatEvent(m) {
    const originalMessage = m.message ? m.message : m;
    let logMessageType = originalMessage.log_message_type;
    let logMessageData;
    if (logMessageType === "log:generic-admin-text") {
        logMessageData = originalMessage.log_message_data.untypedData;
        logMessageType = (0, formatDelta_1.getAdminTextMessageType)(originalMessage.log_message_data.message_type);
    }
    else {
        logMessageData = originalMessage.log_message_data;
    }
    return { ...formatMessage(originalMessage), type: "event", logMessageType, logMessageData, logMessageBody: originalMessage.log_message_body };
}
function formatHistoryMessage(m) {
    return m.action_type === "ma-type:log-message" ? formatEvent(m) : formatMessage(m);
}
function formatTyp(event) {
    return { isTyping: !!event.st, from: event.from.toString(), threadID: (0, formatID_1.default)((event.to || event.thread_fbid || event.from).toString()), fromMobile: event.hasOwnProperty("from_mobile") ? event.from_mobile : true, userID: (event.realtime_viewer_fbid || event.from).toString(), type: "typ" };
}
function formatReadReceipt(event) {
    return { reader: event.reader.toString(), time: event.time, threadID: (0, formatID_1.default)((event.thread_fbid || event.reader).toString()), type: "read_receipt" };
}
function formatRead(event) {
    return { threadID: (0, formatID_1.default)(((event.chat_ids && event.chat_ids[0]) || (event.thread_fbids && event.thread_fbids[0])).toString()), time: event.timestamp, type: "read" };
}
function formatThread(data) {
    return { threadID: (0, formatID_1.default)(data.thread_fbid.toString()), participants: data.participants.map((p) => (0, formatID_1.default)(p)), participantIDs: data.participants.map((p) => (0, formatID_1.default)(p)), name: data.name, nicknames: data.custom_nickname, snippet: data.snippet, snippetSender: (0, formatID_1.default)((data.snippet_sender || "").toString()), unreadCount: data.unread_count, messageCount: data.message_count, imageSrc: data.image_src, timestamp: data.timestamp, muteUntil: data.mute_until, isGroup: data.thread_type === 2, isArchived: data.is_archived, canReply: data.can_reply, lastMessageTimestamp: data.last_message_timestamp, lastReadTimestamp: data.last_read_timestamp, emoji: data.custom_like_icon, color: data.custom_color, adminIDs: data.admin_ids, threadType: data.thread_type };
}
function formatPresence(presence, userID) {
    return { type: "presence", timestamp: presence.la * 1000, userID, statuses: presence.a };
}
function formatProxyPresence(presence, userID) {
    if (presence.lat === undefined || presence.p === undefined)
        return null;
    return { type: "presence", timestamp: presence.lat * 1000, userID, statuses: presence.p };
}
//# sourceMappingURL=index.js.map