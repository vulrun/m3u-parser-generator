export declare const M3U_COMMENT = "#";
export declare const DEFAULT_MEDIA_DURATION = -1;
export declare enum M3uDirectives {
    EXTM3U = "#EXTM3U",
    EXTINF = "#EXTINF",
    PLAYLIST = "#PLAYLIST",
    EXTGRP = "#EXTGRP",
    EXTBYT = "#EXTBYT",
    EXTIMG = "#EXTIMG",
    EXTALB = "#EXTALB",
    EXTART = "#EXTART",
    EXTGENRE = "#EXTGENRE",
    EXTATTRFROMURL = "#EXTATTRFROMURL",
    EXTHTTP = "#EXTHTTP",
    EXTVLCOPT = "#EXTVLCOPT",
    KODIPROP = "#KODIPROP"
}
/**
 * Custom data, that represents unknown directives, that can be parsed also, when mapping is presented
 */
export interface M3uCustomData {
    /**
     * Directive name with '#' symbol at the start
     * e.g. #EXT-CUSTOM
     */
    directive: string;
    /**
     * Value or parameters of directive
     * in case of #EXT-CUSTOM:Something , the 'Something' string is the value
     */
    value: string;
}
/**
 * M3u playlist object
 */
export declare class M3uPlaylist {
    /**
     * Title of playlist
     * @example code
     * ```ts
     * const playlist = new M3uPlaylist();
     * playlist.title = 'Test playlist';
     * ```
     * @example example output in final m3u string
     * ```
     * #PLAYLIST:Test TV
     * ```
     */
    title: string;
    /**
     * Get url-tvg url
     * @returns url-tvg url
     * @deprecated The method should not be used, use playlist.attributes['url-tvg'] instead
     */
    get urlTvg(): string | undefined;
    /**
     * Set url-tvg url
     * @param urlTvg - url-tvg url
     * @deprecated The method should not be used, use playlist.attributes['url-tvg'] instead
     */
    set urlTvg(urlTvg: string | undefined);
    /**
     * Attributes of of the EXTM3U tag. Default value is empty attributes object.
     */
    attributes: M3uAttributes;
    /**
     * M3u media objects
     * @example
     * ```ts
     * const playlist = new M3uPlaylist();
     * const media1 = new M3uMedia('http://my-stream-ulr.com/playlist.m3u8');
     * playlist.medias.push(media1);
     * ```
     */
    medias: M3uMedia[];
    /**
     * Unknown directives, that belong to the whole playlist
     */
    customData: M3uCustomData[];
    /**
     * Get m3u string method to get m3u playlist string of current playlist object
     * @returns m3u playlist string
     */
    getM3uString(): string;
}
/**
 * M3u media object
 * @example code example
 * ```ts
 * const media1 = new M3uMedia('http://my-stream-ulr.com/playlist.m3u8');
 * ```
 * @example example output in final m3u string
 * ```
 * #EXTINF:-1 tvg-id="Test tv 1" tvg-country="CZ" tvg-language="CS" tvg-logo="logo1.png" group-title="Test1" unknown="0",Test tv 1 [CZ]
 * #EXTGRP:Test TV group 1
 * http://iptv.test1.com/playlist.m3u8
 * ```
 */
export declare class M3uMedia {
    location: string;
    /**
     * Name of media
     */
    name?: string;
    /**
     * Group of media
     */
    group?: string;
    /**
     * Duration of media. Default value is -1 (infinity).
     */
    duration: number;
    /**
     * Attributes of media. Default value is empty attributes object.
     */
    attributes: M3uAttributes;
    /**
     * Extra attributes from url
     */
    extraAttributesFromUrl?: string;
    /**
     * Extra HTTP headers
     */
    extraHttpHeaders?: Record<string, string>;
    /**
     * Kodi props
     */
    kodiProps?: Record<string, string>;
    /**
     * Size of media in bytes.
     */
    bytes?: number;
    /**
     * image (e.g. cover) URL
     */
    image?: string;
    /**
     * album
     */
    album?: string;
    /**
     * artist
     */
    artist?: string;
    /**
     * genre
     */
    genre?: string;
    /**
     * Unknown directives, that belong to the specific media
     */
    customData: M3uCustomData[];
    /**
     * Constructor
     * @param location - location of stream
     */
    constructor(location: string);
}
/**
 * M3u media attributes. Can contains know attributes, or unknown custom user defined.
 * @example
 * ```ts
 * const media1 = new M3uMedia('http://my-stream-ulr.com/playlist.m3u8');
 * media1.attributes = {'tvg-id': '5', 'tvg-language': 'EN', 'unknown': 'my custom attribute'};
 * ```
 */
export declare class M3uAttributes {
    /**
     * url-tvg attribute, widely used for EPG
     */
    'url-tvg'?: string;
    /**
     * tvg-id attribute, widely used
     */
    'tvg-id'?: string;
    /**
     * tvg-chno attribute, widely used
     */
    'tvg-chno'?: string;
    /**
     * tvg-language attribute, widely used
     */
    'tvg-language'?: string;
    /**
     * tvg-country attribute, widely used
     */
    'tvg-country'?: string;
    /**
     * tvg-logo attribute, widely used
     */
    'tvg-logo'?: string;
    /**
     * group-title attribute, widely used
     */
    'group-title'?: string;
    /**
     * unknown user defined attribute
     */
    [key: string]: string | undefined;
}
