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
Subject = tslib_1.__decorate([
    typescript_json_serializer_1.Serializable(),
    tslib_1.__param(0, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(1, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(2, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(3, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(4, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(5, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(6, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(7, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(8, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String])
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
Event = tslib_1.__decorate([
    typescript_json_serializer_1.Serializable(),
    tslib_1.__param(0, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(1, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(2, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(3, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(4, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(5, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(6, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__param(7, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__metadata("design:paramtypes", [Array, Number, Number, String, String, String, String, String])
], Event);
exports.Event = Event;
let Message = class Message {
    constructor(context) {
        this.apiVersion = "v2";
        this.id = uuid_1.v4();
        this.context = context;
    }
};
tslib_1.__decorate([
    typescript_json_serializer_1.JsonProperty(),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "apiVersion", void 0);
tslib_1.__decorate([
    typescript_json_serializer_1.JsonProperty(),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "id", void 0);
tslib_1.__decorate([
    typescript_json_serializer_1.JsonProperty(),
    tslib_1.__metadata("design:type", String)
], Message.prototype, "context", void 0);
Message = tslib_1.__decorate([
    typescript_json_serializer_1.Serializable(),
    tslib_1.__metadata("design:paramtypes", [String])
], Message);
let InsertEventsRequestData = class InsertEventsRequestData {
    constructor(events) {
        this.events = events;
    }
};
InsertEventsRequestData = tslib_1.__decorate([
    typescript_json_serializer_1.Serializable(),
    tslib_1.__param(0, typescript_json_serializer_1.JsonProperty()),
    tslib_1.__metadata("design:paramtypes", [Array])
], InsertEventsRequestData);
let InsertEventsRequest = class InsertEventsRequest extends Message {
    constructor(events) {
        super();
        this.data = new InsertEventsRequestData(events);
    }
};
tslib_1.__decorate([
    typescript_json_serializer_1.JsonProperty(),
    tslib_1.__metadata("design:type", InsertEventsRequestData)
], InsertEventsRequest.prototype, "data", void 0);
InsertEventsRequest = tslib_1.__decorate([
    typescript_json_serializer_1.Serializable(),
    tslib_1.__metadata("design:paramtypes", [Array])
], InsertEventsRequest);
exports.InsertEventsRequest = InsertEventsRequest;
