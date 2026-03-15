const H = (o) => o !== null && typeof o == "object" && !Array.isArray(o);
function A(o = {}, t = {}) {
  const s = H(t) ? t : {}, e = H(o) ? o : {}, r = {};
  for (const n of Object.keys(e))
    Object.prototype.hasOwnProperty.call(s, n) && s[n] !== null && s[n] !== void 0 ? r[n] = s[n] : r[n] = e[n];
  return r;
}
function b(o = {}, t) {
  const s = A(
    {
      entrySeparator: "&",
      pairSeparator: "=",
      filterEmpty: !0,
      prefix: "",
      suffix: ""
    },
    t
  ), e = Object.entries(o).filter(([, r]) => !s.filterEmpty || r != null && r !== "").map(([r, n]) => `${r}${s.pairSeparator}${n}`);
  return e.length ? `${s.prefix}${e.join(s.entrySeparator)}${s.suffix}` : "";
}
class R {
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
  static generate(t, s) {
    const e = t.title ? `${a.PLAYLIST}:${t.title}` : void 0, r = this.getCustomDataDirective(t.customData), n = t.medias.map((c) => this.getMedia(c, s)).join(`
`), i = this.getAttributes(t.attributes);
    return [a.EXTM3U + i, e, r, "#", n].filter((c) => c).join(`
`);
  }
  /**
   * Get generated media part string from m3u playlist media object
   * @param media - media object
   * @returns media part string with info, group and location each on separated line
   * @private
   */
  static getMedia(t, s) {
    t.extraHttpHeaders = t.extraHttpHeaders ? Object.fromEntries(Object.entries(t.extraHttpHeaders).map(([p, f]) => [p.toLowerCase(), f])) : {};
    const e = this.getAttributes(t.attributes), r = this.shouldAddInfoDirective(t, e) ? `${a.EXTINF}:${t.duration ?? g}${e},${t.name}` : null, n = t.group ? `${a.EXTGRP}:${t.group}` : null, i = t.bytes ? `${a.EXTBYT}:${t.bytes}` : null, c = t.image ? `${a.EXTIMG}:${t.image}` : null, u = t.album ? `${a.EXTALB}:${t.album}` : null, l = t.artist ? `${a.EXTART}:${t.artist}` : null, O = t.genre ? `${a.EXTGENRE}:${t.genre}` : null, x = t.extraAttributesFromUrl ? `${a.EXTATTRFROMURL}:${t.extraAttributesFromUrl}` : null, y = Object.keys(t.extraHttpHeaders).length ? `${a.EXTHTTP}:${JSON.stringify(t.extraHttpHeaders)}` : null, $ = Object.keys(t.extraHttpHeaders).length ? Object.entries(t.extraHttpHeaders).map(([p, f]) => `${a.EXTVLCOPT}:http-${p}=${f}`) : null, P = t.kodiProps ? Object.entries(t.kodiProps).map(([p, f]) => `${a.KODIPROP}:${p}=${f}`).join(`
`) : null, d = this.getCustomDataDirective(t.customData);
    let T = "";
    return s && (s.toLowerCase().includes("tivimate") ? T = b(t.extraHttpHeaders, { prefix: " | ", entrySeparator: " | " }) : s.toLowerCase().includes("sparkletv") ? T = b(t.extraHttpHeaders, { prefix: "|", entrySeparator: " | " }) : T = b(t.extraHttpHeaders, { prefix: "|", entrySeparator: "&" })), [
      r,
      n,
      i,
      c,
      u,
      l,
      O,
      x,
      y,
      $,
      P,
      d,
      t.location + T,
      "#"
    ].flat(2).filter((p) => p).join(`
`);
  }
  /**
   * Get generated string of custom directives for both, playlist and media
   * @param customData - custom data object, that represents unknown directives
   * @private
   */
  static getCustomDataDirective(t) {
    return t ? t.map((s) => `${s.directive}:${s.value}`).join(`
`) : "";
  }
  /**
   * Get generated attributes media part string from m3u attributes object
   * @param attributes - attributes object
   * @returns attributes generated string (attributeName="attributeValue" ...)
   * @private
   */
  static getAttributes(t) {
    if (!t) return "";
    const s = Object.keys(t);
    return s.length ? " " + s.map((e) => `${e}="${t[e]}"`).join(" ") : "";
  }
  /**
   * Method to determine if we need to add info directive or not based on media object and attributes string.
   * At least media duration, media name or some attributes must be present to return true
   * @param media - m3u media object
   * @param attributesString - m3u attributes string
   * @returns boolean if we should add info directive into final media
   * @private
   */
  static shouldAddInfoDirective(t, s) {
    return t.duration !== g || s !== "" || t.name !== void 0;
  }
}
const L = "#", g = -1;
var a = /* @__PURE__ */ ((o) => (o.EXTM3U = "#EXTM3U", o.EXTINF = "#EXTINF", o.PLAYLIST = "#PLAYLIST", o.EXTGRP = "#EXTGRP", o.EXTBYT = "#EXTBYT", o.EXTIMG = "#EXTIMG", o.EXTALB = "#EXTALB", o.EXTART = "#EXTART", o.EXTGENRE = "#EXTGENRE", o.EXTATTRFROMURL = "#EXTATTRFROMURL", o.EXTHTTP = "#EXTHTTP", o.EXTVLCOPT = "#EXTVLCOPT", o.KODIPROP = "#KODIPROP", o))(a || {});
class j {
  constructor() {
    this.title = "", this.attributes = new E(), this.medias = [], this.customData = [];
  }
  /**
   * Get url-tvg url
   * @returns url-tvg url
   * @deprecated The method should not be used, use playlist.attributes['url-tvg'] instead
   */
  get urlTvg() {
    return this.attributes["url-tvg"];
  }
  /**
   * Set url-tvg url
   * @param urlTvg - url-tvg url
   * @deprecated The method should not be used, use playlist.attributes['url-tvg'] instead
   */
  set urlTvg(t) {
    this.attributes = { ...this.attributes, "url-tvg": t };
  }
  /**
   * Get m3u string method to get m3u playlist string of current playlist object
   * @returns m3u playlist string
   */
  getM3uString() {
    return R.generate(this);
  }
}
class X {
  /**
   * Constructor
   * @param location - location of stream
   */
  constructor(t) {
    this.location = t, this.duration = g, this.attributes = new E(), this.extraAttributesFromUrl = void 0, this.extraHttpHeaders = {}, this.bytes = void 0, this.image = void 0, this.album = void 0, this.artist = void 0, this.genre = void 0, this.customData = [];
  }
}
class E {
}
class h {
  /**
   * Constructor of class
   * @param config - to configure parser behaviour
   */
  constructor(t) {
    this.config = t;
  }
  /**
   * Get m3u attributes object from attributes string
   * @param attributesString e.g. 'tvg-id="" group-title=""'
   * @returns attributes object e.g. {"tvg-id": "", "group-title": ""}
   * @private
   */
  getAttributes(t) {
    const s = new E();
    return t && (t.match(/[^ ]*?=".*?"/g) ?? []).forEach((r) => {
      const [n, i] = r.split('="');
      s[n] = i.replace('"', "");
    }), s;
  }
  parseJsonHeaders(t, s) {
    try {
      const e = JSON.parse(t);
      s.extraHttpHeaders = Object.fromEntries(Object.entries(e).map(([r, n]) => [r.toLowerCase(), n]));
    } catch {
    }
  }
  parseHeadersHelper(t, s) {
    if (s = s ?? {}, !t) return s;
    try {
      if (typeof t == "object" && t !== null) {
        const [e, r] = Array.isArray(t) ? t : Object.keys(t).length > 0 ? Object.entries(t)[0] : [void 0, void 0];
        if (e) {
          const n = e.toLowerCase().replace(/^http-/, "").trim();
          s[n] = String(r ?? "").trim();
        }
        return s;
      }
      if (typeof t == "string") {
        const e = t.split(/[|&]/).reduce(
          (r, n) => {
            if (!n) return r;
            const [i, ...c] = n.split("=");
            if (!i) return r;
            const u = i.trim().toLowerCase(), l = c.join("=").trim();
            return u && (r[u] = l), r;
          },
          {}
        );
        Object.assign(s, e);
      }
      return s;
    } catch {
      return s;
    }
  }
  /**
   * Process media method parse trackInformation and fill media with parsed info
   * @param trackInformation - media substring of m3u string line e.g. '-1 tvg-id="" group-title="",Tv Name'
   * @param media - actual m3u media object
   * @private
   */
  processMedia(t, s) {
    const e = t.indexOf(" ");
    s.duration = parseFloat(e === -1 ? t : t.slice(0, e));
    const r = t.lastIndexOf('"'), n = t.indexOf(",", r);
    s.name = t.slice(n === -1 ? e + 1 : n + 1).trim();
    const i = n === -1 ? "" : t.slice(e + 1, n).trim();
    s.attributes = this.getAttributes(i);
  }
  /**
   * Process directive method detects directive on line and call proper method to another processing
   * @param item - actual line of m3u playlist string e.g. '#EXTINF:-1 tvg-id="" group-title="",Tv Name'
   * @param playlist - m3u playlist object processed until now
   * @param media - actual m3u media object
   * @private
   */
  processDirective(t, s, e) {
    const r = t.indexOf(":"), n = t.substring(0, r), i = t.substring(r + 1);
    switch (n) {
      case a.EXTINF: {
        this.processMedia(i, e);
        break;
      }
      case a.EXTGRP: {
        e.group = i;
        break;
      }
      case a.EXTBYT: {
        e.bytes = Number(i);
        break;
      }
      case a.EXTIMG: {
        e.image = i;
        break;
      }
      case a.EXTALB: {
        e.album = i;
        break;
      }
      case a.EXTART: {
        e.artist = i;
        break;
      }
      case a.EXTGENRE: {
        e.genre = i;
        break;
      }
      case a.PLAYLIST: {
        s.title = i;
        break;
      }
      case a.EXTATTRFROMURL: {
        e.extraAttributesFromUrl = i;
        break;
      }
      case a.EXTHTTP: {
        this.parseJsonHeaders(i, e);
        break;
      }
      case a.EXTVLCOPT: {
        const c = i.indexOf("="), u = i.substring(0, c).trim(), l = i.substring(c + 1).trim();
        e.extraHttpHeaders = this.parseHeadersHelper({ [u]: l }, e.extraHttpHeaders);
        break;
      }
      case a.KODIPROP: {
        const [c, ...u] = i.split("="), l = u.join("=");
        e.kodiProps || (e.kodiProps = {}), e.kodiProps[c] = l;
        break;
      }
      default:
        this.processCustomData(s, e, i, n);
    }
  }
  /**
   * Process custom unknown directive and add it into playlist or media object, based on mapping configuration
   * @param playlist - m3u playlist object processed until now
   * @param media - actual m3u media object
   * @param trackInformation - track information, whole part of string after directive and semicolon
   * @param directive - unknown directive e.g. #EXT-CUSTOM
   * @private
   */
  processCustomData(t, s, e, r) {
    var n, i, c, u;
    (i = (n = this.config) == null ? void 0 : n.customDataMapping) != null && i.media && this.config.customDataMapping.media.includes(r) ? s.customData.push({ directive: r, value: e }) : (u = (c = this.config) == null ? void 0 : c.customDataMapping) != null && u.playlist && this.config.customDataMapping.playlist.includes(r) && t.customData.push({ directive: r, value: e });
  }
  /**
   * Process attributes in #EXTM3U line
   * @param item - first line of m3u playlist string e.g. '#EXTM3U url-tvg="http://example.com/tvg.xml"'
   * @param playlist - m3u playlist object processed until now
   * @private
   */
  processExtM3uAttributes(t, s) {
    if (t.startsWith(a.EXTM3U)) {
      const e = t.indexOf(" ");
      if (e > 0) {
        const r = t.substring(e + 1);
        s.attributes = this.getAttributes(r);
      }
    }
  }
  processUrlData(t, s) {
    const e = t.indexOf("|"), r = e > 0 ? e : t.length, n = t.substring(0, r).trim(), i = t.substring(r + 1).trim();
    s.location = n, s.extraHttpHeaders = this.parseHeadersHelper(i, s.extraHttpHeaders);
  }
  /**
   * Get playlist returns m3u playlist object parsed from m3u string lines
   * @param lines - m3u string lines
   * @returns parsed m3u playlist object
   * @private
   */
  getPlaylist(t) {
    const s = new j();
    let e = new X("");
    return this.processExtM3uAttributes(t[0], s), t.forEach((r) => {
      this.isDirective(r) ? this.processDirective(r, s, e) : (this.processUrlData(r, e), s.medias.push(e), e = new X(""));
    }), s;
  }
  /**
   * Is directive method detect if line contains m3u directive
   * @param item - string line of playlist
   * @returns true if it is line with directive, otherwise false
   * @private
   */
  isDirective(t) {
    return t[0] === L;
  }
  /**
   * Is valid m3u method detect if first line of playlist contains #EXTM3U directive
   * @param firstLine - first line of m3u playlist string
   * @returns true if line starts with #EXTM3U, false otherwise
   * @private
   */
  isValidM3u(t) {
    return t[0].startsWith(a.EXTM3U);
  }
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
  parse(t) {
    var e, r;
    if (!((e = this.config) != null && e.ignoreErrors) && !t)
      throw new Error("m3uString can't be null!");
    const s = t.split(`
`).map((n) => n.trim()).filter((n) => n != "");
    if (!((r = this.config) != null && r.ignoreErrors) && !this.isValidM3u(s))
      throw new Error(`Missing ${a.EXTM3U} directive!`);
    return this.getPlaylist(s);
  }
  static parseStr(t, s = {}) {
    return new h(s).parse(t);
  }
  static parseMedias(t, s = {}) {
    const e = h.parseStr(t, s);
    return !(e != null && e.medias) || !Array.isArray(e.medias) || e.medias.length === 0 ? [] : e.medias;
  }
}
export {
  E as M3uAttributes,
  R as M3uGenerator,
  X as M3uMedia,
  h as M3uParser,
  j as M3uPlaylist
};
