import { M3uPlaylist, M3uMedia } from './m3u-playlist';
/**
 * Custom data mapping, that defines parsing of unknown directives.
 * Directive can belong to whole playlist, or specific media.
 */
export interface M3uCustomDataMapping {
    media?: string[];
    playlist?: string[];
}
/**
 * Interface to configure m3u parser
 */
export interface M3uParserConfig {
    /**
     * Ignore errors in file and try to parse it with it
     */
    ignoreErrors?: boolean;
    /**
     * Custom mapping for unknown directives, that can be partially parsed too and added to parsed object
     */
    customDataMapping?: M3uCustomDataMapping;
}
export interface M3uParseResult {
    medias?: unknown[];
    [key: string]: unknown;
}
export interface M3uConfig {
    [key: string]: unknown;
}
/**
 * M3u parser class to parse m3u playlist string to playlist object
 */
export declare class M3uParser {
    private readonly config?;
    /**
     * Constructor of class
     * @param config - to configure parser behaviour
     */
    constructor(config?: M3uParserConfig | undefined);
    /**
     * Get m3u attributes object from attributes string
     * @param attributesString e.g. 'tvg-id="" group-title=""'
     * @returns attributes object e.g. {"tvg-id": "", "group-title": ""}
     * @private
     */
    private getAttributes;
    parseJsonHeaders(trackInformation: string, media: M3uMedia): void;
    parseHeadersHelper(headersAsStr: Record<string, string> | string, mediaExtraHeaders: Record<string, string>): Record<string, string>;
    /**
     * Process media method parse trackInformation and fill media with parsed info
     * @param trackInformation - media substring of m3u string line e.g. '-1 tvg-id="" group-title="",Tv Name'
     * @param media - actual m3u media object
     * @private
     */
    private processMedia;
    /**
     * Process directive method detects directive on line and call proper method to another processing
     * @param item - actual line of m3u playlist string e.g. '#EXTINF:-1 tvg-id="" group-title="",Tv Name'
     * @param playlist - m3u playlist object processed until now
     * @param media - actual m3u media object
     * @private
     */
    private processDirective;
    /**
     * Process custom unknown directive and add it into playlist or media object, based on mapping configuration
     * @param playlist - m3u playlist object processed until now
     * @param media - actual m3u media object
     * @param trackInformation - track information, whole part of string after directive and semicolon
     * @param directive - unknown directive e.g. #EXT-CUSTOM
     * @private
     */
    private processCustomData;
    /**
     * Process attributes in #EXTM3U line
     * @param item - first line of m3u playlist string e.g. '#EXTM3U url-tvg="http://example.com/tvg.xml"'
     * @param playlist - m3u playlist object processed until now
     * @private
     */
    private processExtM3uAttributes;
    private processUrlData;
    /**
     * Get playlist returns m3u playlist object parsed from m3u string lines
     * @param lines - m3u string lines
     * @returns parsed m3u playlist object
     * @private
     */
    private getPlaylist;
    /**
     * Is directive method detect if line contains m3u directive
     * @param item - string line of playlist
     * @returns true if it is line with directive, otherwise false
     * @private
     */
    private isDirective;
    /**
     * Is valid m3u method detect if first line of playlist contains #EXTM3U directive
     * @param firstLine - first line of m3u playlist string
     * @returns true if line starts with #EXTM3U, false otherwise
     * @private
     */
    private isValidM3u;
    /**
     * Parse is method to parse m3u playlist string into m3u playlist object.
     * Playlist need to contain #EXTM3U directive on first line.
     * All lines are trimmed and blank ones are removed.
     * @param m3uString - whole m3u playlist string
     * @returns parsed m3u playlist object
     * @example
     * ```ts
     * const playlist = M3uParser.parse(m3uString);
     * playlist.medias.forEach(media => media.location);
     * ```
     */
    parse(m3uString: string): M3uPlaylist;
    static parseStr(m3uString: string, config?: M3uConfig): M3uPlaylist;
    static parseMedias(m3uString: string, config?: M3uConfig): unknown[];
}
