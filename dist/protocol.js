"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertEventsRequest = exports.Event = exports.Subject = void 0;
const tslib_1 = require("tslib");
const uuid_1 = require("uuid");
const typescript_json_serializer_1 = require("typescript-json-serializer");
let Subject = class Subject {
    constructor(currentOrigin, currentUri, interpretation, manifestation, mimetype, origin, storage, text, uri) {
        this.currentOrigin = currentOrigin;
        this.currentUri = currentUri;
        this.interpretation = interpretation;
        this.manifestation = manifestation;
        this.mimetype = mimetype;
        this.origin = origin;
        this.storage = storage;
        this.text = text;
        this.uri = uri;
    }
};
Subject = (0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.Serializable)(),
    (0, tslib_1.__param)(0, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(1, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(2, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(3, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(4, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(5, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(6, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(7, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(8, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__metadata)("design:paramtypes", [String, String, String, String, String, String, String, String, String])
], Subject);
exports.Subject = Subject;
let Event = class Event {
    constructor(subjects, timestamp, id, actor, interpretation, manifestation, origin, payload) {
        this.subjects = subjects;
        this.timestamp = timestamp;
        this.id = id;
        this.actor = actor;
        this.interpretation = interpretation;
        this.manifestation = manifestation;
        this.origin = origin;
        this.payload = payload;
        if (id === undefined)
            this.id = 0;
    }
};
Event = (0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.Serializable)(),
    (0, tslib_1.__param)(0, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(1, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(2, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(3, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(4, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(5, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(6, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__param)(7, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__metadata)("design:paramtypes", [Array, Number, Number, String, String, String, String, String])
], Event);
exports.Event = Event;
let Message = class Message {
    constructor(context) {
        this.apiVersion = "v2";
        this.id = (0, uuid_1.v4)();
        this.context = context;
    }
};
(0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.JsonProperty)(),
    (0, tslib_1.__metadata)("design:type", String)
], Message.prototype, "apiVersion", void 0);
(0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.JsonProperty)(),
    (0, tslib_1.__metadata)("design:type", String)
], Message.prototype, "id", void 0);
(0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.JsonProperty)(),
    (0, tslib_1.__metadata)("design:type", String)
], Message.prototype, "context", void 0);
Message = (0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.Serializable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [String])
], Message);
let InsertEventsRequestData = class InsertEventsRequestData {
    constructor(events) {
        this.events = events;
    }
};
InsertEventsRequestData = (0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.Serializable)(),
    (0, tslib_1.__param)(0, (0, typescript_json_serializer_1.JsonProperty)()),
    (0, tslib_1.__metadata)("design:paramtypes", [Array])
], InsertEventsRequestData);
let InsertEventsRequest = class InsertEventsRequest extends Message {
    constructor(events) {
        super();
        this.data = new InsertEventsRequestData(events);
    }
};
(0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.JsonProperty)(),
    (0, tslib_1.__metadata)("design:type", InsertEventsRequestData)
], InsertEventsRequest.prototype, "data", void 0);
InsertEventsRequest = (0, tslib_1.__decorate)([
    (0, typescript_json_serializer_1.Serializable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [Array])
], InsertEventsRequest);
exports.InsertEventsRequest = InsertEventsRequest;
