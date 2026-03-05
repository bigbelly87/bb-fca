/// <reference types="node" />
import { EventEmitter } from 'events';
import { ReadStream } from 'fs';

export type UserID = string;
export type ThreadID = string;
export type MessageID = string;
export type Callback<T = any> = (err: any, result?: T) => void;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Mention {
  tag: string;
  id: UserID;
  fromIndex?: number;
}

export interface Reaction {
  reaction: string;
  userID: UserID;
}

export interface StickerPackInfo {
  id: string;
  name: string;
  thumbnail?: string;
}

export interface StickerInfo {
  type: 'sticker';
  ID: string;
  url?: string;
  animatedUrl?: string;
  packID?: string;
  label: string;
  stickerID: string;
}

export interface AddedStickerPackInfo {
  id: string;
  name: string;
  in_sticker_tray: boolean;
  artist?: string;
  preview_image?: { uri: string };
  thumbnail_image?: { uri: string };
}

export interface CommentMessage {
  body: string;
  attachment?: ReadStream[];
  mentions?: Mention[];
  url?: string;
  sticker?: string;
}

export interface CommentResult {
  id: string;
  url: string;
  count: number;
}

export interface PostCommentAuthor {
  id: string | null;
  name: string;
  avatar: string | null;
}

export interface PostCommentReply {
  id: string;
  text: string;
  created_time: number;
  author: PostCommentAuthor;
}

export interface PostComment {
  id: string;
  graphql_id: string;
  text: string;
  author: PostCommentAuthor;
  created_time: number;
  reply_count: number;
  total_reply_count: number;
  depth: number;
  replies?: PostCommentReply[];
}

export interface GetPostCommentsOptions {
  story_fbid: string;
  id?: string;
}

export interface ShareResult {
  postID: string;
  url: string;
}

export interface CreatePostOptions {
  message?: string;
  privacy?: 'EVERYONE' | 'FRIENDS' | 'SELF';
  photos?: string[];
}

export interface CreatePostResult {
  success: boolean;
  postID: string | null;
  data: any;
  url?: string | null;
}

export interface DeletePostResult {
  success: boolean;
  postID: string;
  data: any;
}

export interface UploadPhotoResult {
  success: boolean;
  photoID: string | null;
  uploadID: string;
  data: any;
}

export interface Attachment {
  type:
    | 'photo'
    | 'animated_image'
    | 'video'
    | 'audio'
    | 'file'
    | 'sticker'
    | 'share'
    | 'location'
    | 'unknown';
  ID: string;
  filename: string;
  url?: string;
  name?: string;
}

export interface PhotoAttachment extends Attachment {
  type: 'photo';
  thumbnailUrl: string;
  previewUrl: string;
  previewWidth: number;
  previewHeight: number;
  largePreviewUrl: string;
  largePreviewWidth: number;
  largePreviewHeight: number;
  width: number;
  height: number;
}

export interface VideoAttachment extends Attachment {
  type: 'video';
  duration: number;
  width: number;
  height: number;
  previewUrl: string;
  previewWidth: number;
  previewHeight: number;
  videoType: 'file_attachment' | 'native_video' | 'unknown';
}

export interface AudioAttachment extends Attachment {
  type: 'audio';
  duration: number;
  audioType: string;
  isVoiceMail: boolean;
}

export interface FileAttachment extends Attachment {
  type: 'file';
  isMalicious: boolean;
  contentType: string;
}

export interface StickerAttachment extends Attachment {
  type: 'sticker';
  packID: string;
  spriteUrl?: string;
  spriteUrl2x?: string;
  width: number;
  height: number;
  caption: string;
  description: string;
  frameCount: number;
  frameRate: number;
  framesPerRow: number;
  framesPerCol: number;
}

export interface ShareAttachment extends Attachment {
  type: 'share';
  title: string;
  description?: string;
  source?: string;
  image?: string;
  width?: number;
  height?: number;
  playable?: boolean;
  subattachments?: any[];
  properties: Record<string, any>;
}

export type AnyAttachment =
  | PhotoAttachment
  | VideoAttachment
  | AudioAttachment
  | FileAttachment
  | StickerAttachment
  | ShareAttachment;

export interface MessageReply {
  messageID: MessageID;
  senderID: UserID;
  body: string;
  attachments: AnyAttachment[];
  timestamp: string;
  isReply: true;
}

export interface Message {
  type: 'message';
  senderID: UserID;
  body: string;
  threadID: ThreadID;
  messageID: MessageID;
  attachments: AnyAttachment[];
  mentions: Record<string, string>;
  timestamp: string;
  isGroup: boolean;
  participantIDs?: UserID[];
  messageReply?: MessageReply;
  isUnread?: boolean;
  reactions?: Reaction[];
}

export interface Event {
  type: 'event';
  threadID: ThreadID;
  logMessageType: string;
  logMessageData: any;
  logMessageBody: string;
  timestamp: string;
  author: UserID;
}

export interface TypingIndicator {
  type: 'typ';
  isTyping: boolean;
  from: UserID;
  threadID: ThreadID;
  fromMobile: boolean;
}

export interface PresenceEvent {
  type: 'presence';
  userID: UserID;
  timestamp: number;
  statuses: number;
}

export interface UnsendMessageEvent {
  threadID: ThreadID;
  messageID: MessageID;
  senderID: UserID;
  deletionTimestamp: string;
  timestamp: string;
}

export interface EmojiEvent {
  threadID: ThreadID;
  emoji: string;
}

export interface GroupNameEvent {
  threadID: ThreadID;
  name: string;
}

export interface NicknameEvent {
  threadID: ThreadID;
  participantID: UserID;
  nickname: string;
}

export interface GroupRuleEvent {
  threadID: ThreadID;
}

export type ListenEvent = Message | Event | TypingIndicator | PresenceEvent;

export interface UserInfo {
  id: UserID;
  name: string;
  firstName: string;
  lastName?: string;
  vanity: string;
  profileUrl: string;
  profilePicUrl: string;
  gender: string;
  type: 'user' | 'page';
  isFriend: boolean;
  isBirthday: boolean;
  bio?: string;
  live_city?: string;
  followers?: string;
  following?: string;
  coverPhoto?: string;
}

export interface ThreadInfo {
  threadID: ThreadID;
  threadName?: string;
  participantIDs: UserID[];
  userInfo: UserInfo[];
  unreadCount: number;
  messageCount: number;
  imageSrc?: string;
  timestamp: string;
  muteUntil: number;
  isGroup: boolean;
  isArchived: boolean;
  isSubscribed: boolean;
  folder: string;
  nicknames: Record<UserID, string>;
  adminIDs: UserID[];
  emoji?: string;
  color?: string;
  canReply: boolean;
  inviteLink: {
    enable: boolean;
    link: string | null;
  };
}

export interface MessageObject {
  body?: string;
  attachment?: ReadStream[];
  sticker?: string;
  emoji?: string;
  emojiSize?: 'small' | 'medium' | 'large';
  mentions?: Mention[];
  edit?: [string, number][];
}

export interface API {
  /** Set global options for the API. */
  setOptions(options: LoginOptions): void;

  /** Get the current appState (cookies) for saving/restoring sessions. */
  getAppState(): any[];

  /** Get the current logged-in user's ID. */
  getCurrentUserID(): UserID;

  /** Get a specific option value or all options. */
  getOptions(key?: string): any;

  // ── Listening ──────────────────────────────────────────────────

  /** Start listening for new messages and events via MQTT. */
  listenMqtt(callback: (err: any, event: ListenEvent) => void): EventEmitter;

  /** Start listening for new messages and events (speed variant). */
  listenSpeed(callback: (err: any, event: ListenEvent) => void): EventEmitter;

  /** Start listening for realtime events. */
  realtime(callback: (err: any, event: ListenEvent) => void): EventEmitter;

  // ── Messaging ──────────────────────────────────────────────────

  /** Send a message (plain text or object) to a thread via MQTT. */
  sendMessageMqtt(
    message: string | MessageObject,
    threadID: ThreadID,
    replyToMessage?: MessageID,
    callback?: Callback<Message>,
  ): void;

  /** Send a message (plain text or object) to a thread via HTTP. */
  sendMessage(
    message: string | MessageObject,
    threadID: ThreadID,
    replyToMessage?: MessageID,
    callback?: Callback<Message>,
  ): Promise<any>;

  /** Edit an existing message's text. */
  editMessage(text: string, messageID: MessageID, callback?: Callback): void;

  /** Unsend (delete) a message for everyone. */
  unsendMessage(
    messageID: MessageID,
    threadID: ThreadID,
    callback?: Callback<UnsendMessageEvent>,
  ): Promise<UnsendMessageEvent>;

  /** Set a reaction emoji on a message via MQTT. */
  setMessageReactionMqtt(
    reaction: string,
    messageID: MessageID,
    callback?: Callback,
  ): void;

  /** Set a reaction emoji on a message via HTTP. */
  setMessageReaction(
    reaction: string,
    messageID: MessageID,
    callback?: Callback,
  ): void;

  /** Send a typing indicator to a thread. */
  sendTypingIndicator(
    sendTyping: boolean,
    threadID: ThreadID,
    callback?: Callback,
  ): Promise<void>;

  // ── Read Receipts ──────────────────────────────────────────────

  /** Mark a thread as read. */
  markAsRead(
    threadID: ThreadID,
    read?: boolean,
    callback?: Callback,
  ): Promise<any>;

  /** Mark all threads as read. */
  markAsReadAll(callback?: Callback): Promise<void>;

  /** Mark messages as seen. */
  markAsSeen(timestamp?: number, callback?: Callback): Promise<void>;

  /** Mark a message as delivered. */
  markAsDelivered(
    threadID: ThreadID,
    messageID: MessageID,
    callback?: Callback,
  ): Promise<void>;

  // ── Thread Info ────────────────────────────────────────────────

  /** Get information about a thread. */
  getThreadInfo(
    threadID: ThreadID,
    callback?: Callback<ThreadInfo>,
  ): Promise<ThreadInfo>;
  getThreadInfo(
    threadID: ThreadID[],
    callback?: Callback<Record<ThreadID, ThreadInfo>>,
  ): Promise<Record<ThreadID, ThreadInfo>>;

  /** Get a list of threads. */
  getThreadList(
    limit: number,
    timestamp: number | null,
    tags: string[],
    callback?: Callback<ThreadInfo[]>,
  ): Promise<ThreadInfo[]>;

  /** Get message history for a thread. */
  getThreadHistory(
    threadID: ThreadID,
    amount: number,
    timestamp: number | null,
    callback?: Callback<Message[]>,
  ): Promise<Message[]>;

  // ── User Info ──────────────────────────────────────────────────

  /** Get information about one or more users. */
  getUserInfo(
    id: UserID,
    usePayload?: boolean,
    callback?: Callback<UserInfo>,
  ): Promise<UserInfo>;
  getUserInfo(
    id: UserID[],
    usePayload?: boolean,
    callback?: Callback<Record<UserID, UserInfo>>,
  ): Promise<Record<UserID, UserInfo>>;

  // ── Group Chat Management ─────────────────────────────────────

  /** Change the emoji for a thread. */
  emoji(
    emoji: string,
    threadID?: ThreadID,
    callback?: Callback<EmojiEvent>,
  ): Promise<EmojiEvent>;

  /** Change the group chat name. */
  gcname(
    newName: string,
    threadID?: ThreadID,
    callback?: Callback<GroupNameEvent>,
  ): Promise<GroupNameEvent>;

  /** Change a group chat member's nickname. */
  nickname(
    nickname: string,
    threadID: ThreadID,
    participantID: UserID,
    callback?: Callback<NicknameEvent>,
  ): Promise<NicknameEvent>;

  /** Change the group chat theme. */
  theme(
    themeID: string,
    threadID?: ThreadID,
    callback?: Callback,
  ): Promise<any>;

  /** Add or remove members from a group chat. */
  gcmember(
    action: 'add' | 'remove',
    threadID: ThreadID,
    memberIDs: UserID | UserID[],
    callback?: Callback,
  ): Promise<any>;

  /** Manage group chat rules. */
  gcrule(
    threadID: ThreadID,
    rules: any,
    callback?: Callback<GroupRuleEvent>,
  ): Promise<GroupRuleEvent>;

  /** Create, edit, or manage group notes. */
  notes(options: any, callback?: Callback): Promise<any>;

  /** Pin or unpin a message in a thread. */
  pinMessage(
    action: 'pin' | 'unpin',
    threadID: ThreadID,
    messageID: MessageID,
  ): Promise<any>;
  pinMessage(action: 'list', threadID: ThreadID): Promise<Message[]>;

  // ── Contact ────────────────────────────────────────────────────

  /** Share a contact card to a thread. */
  shareContact(
    text: string,
    senderID: UserID,
    threadID: ThreadID,
    callback?: Callback,
  ): void;
  shareContact(senderID: UserID, threadID: ThreadID, callback?: Callback): void;

  /** Resolve a photo's full URL from its ID. */
  resolvePhotoUrl(
    photoID: string,
    callback?: Callback<string>,
  ): Promise<string>;

  // ── Posting ────────────────────────────────────────────────────

  /** Post, comment, and manage Facebook posts. */
  post: {
    create(
      options: string | CreatePostOptions,
      callback?: Callback<CreatePostResult>,
    ): Promise<CreatePostResult>;
    delete(
      postID: string,
      callback?: Callback<DeletePostResult>,
    ): Promise<DeletePostResult>;
    getComments(
      postID: string | GetPostCommentsOptions,
      callback?: Callback<PostComment[]>,
    ): Promise<PostComment[]>;
    uploadPhoto(
      photoPath: string,
      callback?: Callback<UploadPhotoResult>,
    ): Promise<UploadPhotoResult>;
  };

  /** Comment on a Facebook post. */
  comment(
    msg: string | CommentMessage,
    postID: string,
    replyCommentID?: string,
    callback?: Callback<CommentResult>,
  ): Promise<CommentResult>;

  /** Share a Facebook post. */
  share(
    text: string,
    postID: string,
    callback?: Callback<ShareResult>,
  ): Promise<ShareResult>;
  share(postID: string, callback?: Callback<ShareResult>): Promise<ShareResult>;

  /** Post a story. */
  story(options: any, callback?: Callback): Promise<any>;

  // ── Social ─────────────────────────────────────────────────────

  /** Follow or unfollow a user. */
  follow(senderID: UserID, follow: boolean, callback?: Callback): void;

  /** Send or cancel a friend request. */
  friend(action: 'add' | 'cancel', userID: UserID, callback?: Callback): void;

  // ── Stickers ───────────────────────────────────────────────────

  /** Sticker-related API methods. */
  stickers: {
    search(query: string): Promise<StickerInfo[]>;
    listPacks(): Promise<StickerPackInfo[]>;
    getStorePacks(): Promise<StickerPackInfo[]>;
    listAllPacks(): Promise<StickerPackInfo[]>;
    addPack(packID: string): Promise<AddedStickerPackInfo>;
    getStickersInPack(packID: string): Promise<StickerInfo[]>;
    getAiStickers(options?: { limit?: number }): Promise<StickerInfo[]>;
  };

  // ── HTTP ───────────────────────────────────────────────────────

  /** Make an authenticated GET request. */
  httpGet(
    url: string,
    form?: any,
    customHeader?: any,
    callback?: Callback<string>,
    notAPI?: boolean,
  ): Promise<string>;

  /** Make an authenticated POST request. */
  httpPost(
    url: string,
    form?: any,
    customHeader?: any,
    callback?: Callback<string>,
    notAPI?: boolean,
  ): Promise<string>;

  /** Make an authenticated POST request with form data. */
  httpPostFormData(
    url: string,
    form?: any,
    customHeader?: any,
    callback?: Callback<string>,
    notAPI?: boolean,
  ): Promise<string>;

  // ── Session ────────────────────────────────────────────────────

  /** Log out and invalidate the current session. */
  logout(callback?: (err: any) => void): Promise<void>;

  /** Get bot info from the session. */
  GetBotInfo(callback?: Callback): Promise<any>;

  /** Get access token. */
  getAccess(authCode?: string, callback?: Callback<string>): Promise<string>;

  /** Add an external module to extend the API. */
  addExternalModule(moduleObj: Record<string, Function>): void;

  /** Allow accessing dynamically loaded methods. */
  [key: string]: any;
}

export interface LoginCredentials {
  appState?: any;
}

export interface LoginOptions {
  online?: boolean;
  selfListen?: boolean;
  listenEvents?: boolean;
  updatePresence?: boolean;
  forceLogin?: boolean;
  autoMarkDelivery?: boolean;
  autoMarkRead?: boolean;
  listenTyping?: boolean;
  proxy?: string;
  autoReconnect?: boolean;
  userAgent?: string;
  emitReady?: boolean;
  randomUserAgent?: boolean;
  bypassRegion?: string;
}

/** Log in to Facebook Messenger and receive an API instance. */
export function login(
  credentials: LoginCredentials,
  options: LoginOptions | Callback<API>,
  callback?: Callback<API>,
): void;
