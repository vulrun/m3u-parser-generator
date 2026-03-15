import { buildLiveHeaders } from "./utils";
import {
  M3uCustomData,
  M3uDirectives,
  M3uMedia,
  M3uPlaylist,
  M3uAttributes,
  DEFAULT_MEDIA_DURATION
} from "./m3u-playlist";

/**
 * M3u generator class to generate m3u playlist string from playlist object
 */
export class M3uGenerator {

  /**
   * Generate is static method to generate m3u playlist string from playlist object
   * @param playlist - playlist object to generate m3u playlist string
   * @returns final m3u playlist string
   * @example
   * ```ts
   * const playlist = new M3uPlaylist();
   * playlist.title = 'Test playlist';
   * M3uGenerator.generate(playlist);
   * ```
   */
  static generate(playlist: M3uPlaylist, httpUserAgent?: string): string {
    const pls = playlist.title ? `${M3uDirectives.PLAYLIST}:${playlist.title}` : undefined;
    const customData = this.getCustomDataDirective(playlist.customData);
    const medias = playlist.medias.map(item => this.getMedia(item, httpUserAgent)).join('\n');
    const attributesString = this.getAttributes(playlist.attributes);
    return [M3uDirectives.EXTM3U + attributesString, pls, customData, "#", medias].filter(item => item).join('\n');
  }

  /**
   * Get generated media part string from m3u playlist media object
   * @param media - media object
   * @returns media part string with info, group and location each on separated line
   * @private
   */
  private static getMedia(media: M3uMedia, httpUserAgent?: string): string {
    media.extraHttpHeaders = media.extraHttpHeaders ? Object.fromEntries(Object.entries(media.extraHttpHeaders).map(([key, value]) => [key.toLowerCase(), value])) : {};
    const attributesString = this.getAttributes(media.attributes);
    const info = this.shouldAddInfoDirective(media, attributesString) ? `${M3uDirectives.EXTINF}:${media.duration ?? DEFAULT_MEDIA_DURATION}${attributesString},${media.name}` : null;
    const group = media.group ? `${M3uDirectives.EXTGRP}:${media.group}` : null;
    const bytes = media.bytes ? `${M3uDirectives.EXTBYT}:${media.bytes}` : null;
    const image = media.image ? `${M3uDirectives.EXTIMG}:${media.image}` : null;
    const album = media.album ? `${M3uDirectives.EXTALB}:${media.album}` : null;
    const artist = media.artist ? `${M3uDirectives.EXTART}:${media.artist}` : null;
    const genre = media.genre ? `${M3uDirectives.EXTGENRE}:${media.genre}` : null;
    const extraAttributesFromUrl = media.extraAttributesFromUrl ? `${M3uDirectives.EXTATTRFROMURL}:${media.extraAttributesFromUrl}` : null;
    const extraHttpHeaders1 = Object.keys(media.extraHttpHeaders).length ? `${M3uDirectives.EXTHTTP}:${JSON.stringify(media.extraHttpHeaders)}` : null;
    const extraHttpHeaders2 = Object.keys(media.extraHttpHeaders).length ? Object.entries(media.extraHttpHeaders).map(([key, value]) => `${M3uDirectives.EXTVLCOPT}:http-${key}=${value}`) : null;
    const kodiProps = media.kodiProps ? Object.entries(media.kodiProps).map(([key, value]) => `${M3uDirectives.KODIPROP}:${key}=${value}`).join('\n') : null;
    const customData = this.getCustomDataDirective(media.customData);

    let liveHeaderStr = "";
    if (httpUserAgent) {
      if (httpUserAgent.toLowerCase().includes("tivimate")) {
        liveHeaderStr = buildLiveHeaders(media.extraHttpHeaders as Record<string, string>, { prefix: " | ", entrySeparator: " | " });
      } else if (httpUserAgent.toLowerCase().includes("sparkletv")) {
        liveHeaderStr = buildLiveHeaders(media.extraHttpHeaders as Record<string, string>, { prefix: "|", entrySeparator: " | " });
      } else {
        liveHeaderStr = buildLiveHeaders(media.extraHttpHeaders as Record<string, string>, { prefix: "|", entrySeparator: "&" });
      }
    }

    return [
      info,
      group, 
      bytes,
      image,
      album,
      artist,
      genre,
      extraAttributesFromUrl,
      extraHttpHeaders1,
      extraHttpHeaders2,
      kodiProps,
      customData,
      media.location + liveHeaderStr,
      "#",
    ].flat(2).filter((item) => item).join('\n');
  }

  /**
   * Get generated string of custom directives for both, playlist and media
   * @param customData - custom data object, that represents unknown directives
   * @private
   */
  private static getCustomDataDirective(customData?: M3uCustomData[]): string {
    if (!customData) return "";
    return customData.map(data => `${data.directive}:${data.value}`).join('\n');
  }

  /**
   * Get generated attributes media part string from m3u attributes object
   * @param attributes - attributes object
   * @returns attributes generated string (attributeName="attributeValue" ...)
   * @private
   */
  private static getAttributes(attributes?: M3uAttributes): string {
    if (!attributes) return "";
    const keys = Object.keys(attributes);
    return keys.length ? ' ' + keys.map(key => `${key}="${attributes[key]}"`).join(' ') : '';
  }

  /**
   * Method to determine if we need to add info directive or not based on media object and attributes string.
   * At least media duration, media name or some attributes must be present to return true
   * @param media - m3u media object
   * @param attributesString - m3u attributes string
   * @returns boolean if we should add info directive into final media
   * @private
   */
  private static shouldAddInfoDirective(media: M3uMedia, attributesString?: string): boolean {
    return media.duration !== DEFAULT_MEDIA_DURATION || attributesString !== '' || media.name !== undefined;
  }
}
