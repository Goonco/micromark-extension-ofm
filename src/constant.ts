import type { Code } from "micromark-util-types";

const ILLEGAL_INLINE_CODES: Record<string, Code> = {
	CR: -5,
	LF: -4,
	CRLF: -3,
	EOF: null,
};
const illegalValues = Object.values(ILLEGAL_INLINE_CODES);
export function isIllegalEnding(code: Code) {
	return illegalValues.includes(code);
}

/*
  Customs  
*/

/*

ToDo - https://help.obsidian.md/embeds

<embed>
  <embedMarker> ![[ </embedMarker>
  <embedData>
    <embedImgPath> foo/bar/example.png </embedPath>
    
    <embedImgSizeMarker> | </embedImgSizeMarker>

    <embedImgWidth> 100 </embedImgWidth>
    <embedImgHeightMarker> x </embedImgHeightMarker>
    <embedImgHeight 145 </embedImgHeight>

  </embedData>
  <embedMarker> ]] </embedMarker>
</embed>

*/

export const MARKER = {
	embedStart: "![[",
	embedEnd: "]]",
	embedImgSize: "|",
	embedImgHeight: "x",
};
export type Marker = (typeof MARKER)[keyof typeof MARKER];

export const TOKEN = {
	embed: "embed",
	embedMarker: "embedMarker",
	embedData: "embedData",
	embedImgPath: "embedImgPath",
};
export type CustomToken = (typeof TOKEN)[keyof typeof TOKEN];
