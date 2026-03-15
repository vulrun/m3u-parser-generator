export declare const isObject: (val: unknown) => val is Record<string, unknown>;
/**
 * Convert a string to its hexadecimal representation
 * Works in Node.js and browsers without relying on TextEncoder
 */
export declare function textToHex(str: string): string;
export declare function extendOptions(defaultOptions?: unknown, userOptions?: unknown): Record<string, unknown>;
export interface LiveHeadersOptions {
    entrySeparator?: string;
    pairSeparator?: string;
    filterEmpty?: boolean;
    prefix?: string;
    suffix?: string;
}
export declare function buildLiveHeaders(headers?: Record<string, unknown>, options?: unknown): string;
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
    streamUrl: string;
    streamName?: string;
    streamLogo?: string;
    httpHeaders?: Record<string, string>;
    kodiProps?: Record<string, string>;
};
export declare const prepareM3uPayload: ({ provider, category, language, streamUrl, streamName, streamLogo, httpHeaders, kodiProps, }: PrepareM3uPayloadParams) => M3uPayload;
export {};
