export const isObject = (val: unknown): val is Record<string, unknown> => val !== null && typeof val === "object" && !Array.isArray(val);

/**
 * Convert a string to its hexadecimal representation
 * Works in Node.js and browsers without relying on TextEncoder
 */
export function textToHex(str: string): string {
  const bytes: number[] = [];

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);

    if (code < 0x80) {
      // 1-byte UTF-8
      bytes.push(code);
    } else if (code < 0x800) {
      // 2-byte UTF-8
      bytes.push(0xc0 | (code >> 6));
      bytes.push(0x80 | (code & 0x3f));
    } else if (code < 0xd800 || code >= 0xe000) {
      // 3-byte UTF-8
      bytes.push(0xe0 | (code >> 12));
      bytes.push(0x80 | ((code >> 6) & 0x3f));
      bytes.push(0x80 | (code & 0x3f));
    } else {
      // surrogate pair (4-byte UTF-8)
      i++;
      const code2 = str.charCodeAt(i);
      const codePoint = ((code & 0x3ff) << 10) | (code2 & 0x3ff) + 0x10000;
      bytes.push(0xf0 | (codePoint >> 18));
      bytes.push(0x80 | ((codePoint >> 12) & 0x3f));
      bytes.push(0x80 | ((codePoint >> 6) & 0x3f));
      bytes.push(0x80 | (codePoint & 0x3f));
    }
  }

  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function extendOptions(defaultOptions: unknown = {}, userOptions: unknown = {}): Record<string, unknown> {
  const safeUser: Record<string, unknown> = isObject(userOptions) ? userOptions : {};
  const safeDefaults: Record<string, unknown> = isObject(defaultOptions) ? defaultOptions : {};

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(safeDefaults)) {
    if (Object.prototype.hasOwnProperty.call(safeUser, key) && safeUser[key] !== null && safeUser[key] !== undefined) {
      result[key] = safeUser[key];
    } else {
      result[key] = safeDefaults[key];
    }
  }

  return result;
}

export interface LiveHeadersOptions {
  entrySeparator?: string;
  pairSeparator?: string;
  filterEmpty?: boolean;
  prefix?: string;
  suffix?: string;
}

export function buildLiveHeaders(headers: Record<string, unknown> = {}, options?: unknown): string {
  const safeOptions = extendOptions(
    {
      entrySeparator: "&",
      pairSeparator: "=",
      filterEmpty: true,
      prefix: "",
      suffix: "",
    },
    options,
  ) as LiveHeadersOptions;

  const entries = Object.entries(headers)
    .filter(([, v]) => !safeOptions.filterEmpty || (v !== undefined && v !== null && v !== ""))
    .map(([k, v]) => `${k}${safeOptions.pairSeparator}${v}`);

  if (!entries.length) return "";

  return `${safeOptions.prefix}${entries.join(safeOptions.entrySeparator)}${safeOptions.suffix}`;
}

type M3uPayload = {
  name: string;
  image?: string;
  location: string;
  attributes: Record<string, string | undefined>;
  kodiProps: Record<string, string>;
  extraHttpHeaders: Record<string, string>;
};

type PrepareM3uPayloadParams = {
  provider?: string;
  category?: string;
  language?: string;
  // streamId?: string;
  streamUrl: string;
  streamName?: string;
  streamLogo?: string;
  httpHeaders?: Record<string, string>;
  kodiProps?: Record<string, string>;
};

export const prepareM3uPayload = ({
  provider,
  category,
  language,
  // streamId,
  streamUrl,
  streamName,
  streamLogo,
  httpHeaders,
  kodiProps,
}: PrepareM3uPayloadParams): M3uPayload => {
  const streamId = textToHex(streamUrl.trim());
  streamName = `${streamName || streamId}`.trim().replace(/,/g, "\u201a");
  // streamLogo = streamLogo ? streamLogo : `https://www.dummyimg.in/placeholder?text=${streamName}&text_color=%23050505&font_size=50&font_style=comicy`;
  streamLogo = streamLogo ? streamLogo : `https://api.dicebear.com/9.x/initials/svg?seed=${streamName}`;

  const payload: M3uPayload= {
    name: streamName,
    image: `${streamLogo ?? ""}`.trim(),
    location: streamUrl.trim(),
    attributes: {},
    kodiProps: kodiProps ?? {},
    extraHttpHeaders: httpHeaders ?? {},
  };

  let categoryName = "" as string | undefined;
  if (provider) {
    const categories = category === provider ? [] : `${category || ""}`.trim().split(";").filter(Boolean);
    categoryName = categories.length ? categories.map((c) => `[${provider}] ${c}`).join(";") : `[${provider}]`;
  } else {
    categoryName = category;
  }

  payload.attributes["tvg-id"] = [provider, streamId].filter(Boolean).join("-").toLowerCase().substring(0, 16);
  payload.attributes["tvg-name"] = payload?.name;
  payload.attributes["tvg-logo"] = payload?.image;
  payload.attributes["tvg-language"] = `${language ?? ""}`.trim();
  payload.attributes["group-title"] = categoryName;

  return payload;
};
