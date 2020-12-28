/*
 * Copyright (c) 2020 Payson Wallach
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { v4 as uuidv4 } from "uuid"
import { JsonProperty, Serializable } from "typescript-json-serializer"

@Serializable()
export class Subject {
    constructor(
        @JsonProperty()
        public readonly currentOrigin?: string,
        @JsonProperty()
        public readonly currentUri?: string,
        @JsonProperty()
        public readonly interpretation?: string,
        @JsonProperty()
        public readonly manifestation?: string,
        @JsonProperty()
        public readonly mimetype?: string,
        @JsonProperty()
        public readonly origin?: string,
        @JsonProperty()
        public readonly storage?: string,
        @JsonProperty()
        public readonly text?: string,
        @JsonProperty()
        public readonly uri?: string
    ) {}
}

@Serializable()
export class Event {
    constructor(
        @JsonProperty()
        public readonly subjects: Subject[],
        @JsonProperty()
        public readonly timestamp: number,
        @JsonProperty()
        public readonly id?: number,
        @JsonProperty()
        public readonly actor?: string,
        @JsonProperty()
        public readonly interpretation?: string,
        @JsonProperty()
        public readonly manifestation?: string,
        @JsonProperty()
        public readonly origin?: string,
        @JsonProperty()
        public readonly payload?: BinaryType
    ) {
        if (id === undefined) this.id = 0
    }
}

@Serializable()
class Message {
    @JsonProperty()
    public readonly apiVersion: string = "v2"

    @JsonProperty()
    public readonly id: string = uuidv4()

    @JsonProperty()
    public readonly context?: string

    constructor(context?: string) {
        this.context = context
    }
}

@Serializable()
class InsertEventsRequestData {
    constructor(
        @JsonProperty()
        public readonly events: Event[]
    ) {}
}

@Serializable()
export class InsertEventsRequest extends Message {
    @JsonProperty()
    public readonly data: InsertEventsRequestData

    constructor(events: Event[]) {
        super()

        this.data = new InsertEventsRequestData(events)
    }
}
