import type {
	Construct,
	Extension,
	State,
	Tokenizer,
} from "micromark-util-types";
import type { CustomToken } from "./constant";
import { isIllegalEnding, MARKER, TOKEN } from "./constant";

const embedImgTokenizer: Tokenizer = function (this, effects, ok, nok) {
	let startMarkerCursor = 0;
	let endMarkerCursor = 0;

	const start: State = (code) => {
		if (code !== MARKER.embedStart.charCodeAt(startMarkerCursor)) nok(code);

		enter(TOKEN.embed);
		enter(TOKEN.embedMarker);

		return consumeStart(code);
	};

	const consumeStart: State = (code) => {
		if (startMarkerCursor === MARKER.embedStart.length) {
			exit(TOKEN.embedMarker);
			return consumeData(code);
		}
		if (code !== MARKER.embedStart.charCodeAt(startMarkerCursor)) nok(code);

		effects.consume(code);
		startMarkerCursor++;

		return consumeStart;
	};

	const consumeData: State = (code) => {
		enter(TOKEN.embedData);
		enter(TOKEN.embedImgPath);
		return consumeImgPath(code);
	};

	const consumeImgPath: State = (code) => {
		if (isIllegalEnding(code)) nok(code);

		if (code === MARKER.embedEnd.charCodeAt(endMarkerCursor)) {
			exit(TOKEN.embedImgPath);
			exit(TOKEN.embedData);
			enter(TOKEN.embedMarker);
			return consumeEnd(code);
		}

		effects.consume(code);
		return consumeImgPath;
	};

	const consumeEnd: State = (code) => {
		if (endMarkerCursor === MARKER.embedEnd.length) {
			exit(TOKEN.embedMarker);
			exit(TOKEN.embed);
			return ok(code);
		}
		if (code !== MARKER.embedEnd.charCodeAt(endMarkerCursor)) nok(code);

		effects.consume(code);
		endMarkerCursor++;

		return consumeEnd;
	};

	return start;

	function enter(token: CustomToken) {
		// @ts-expect-error custom token type
		effects.enter(token);
	}

	function exit(token: CustomToken) {
		// @ts-expect-error custom token type
		effects.exit(token);
	}
};

const triggerCode = MARKER.embedStart.charCodeAt(0);
const tmpConstruct: Construct = { tokenize: embedImgTokenizer };
const micromarkOFM: Extension = {
	text: { [triggerCode]: tmpConstruct },
};

export default micromarkOFM;
