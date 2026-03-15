import { beforeEach, describe, expect, it } from "vitest";
import { M3uAttributes, M3uMedia, M3uParser, M3uPlaylist, M3uGenerator } from "../src";

const payload = [
  {
    name: "TNT1",
    image: "https://api.dicebear.com/9.x/initials/svg?seed=TNT1",
    location: "https://qw.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/cllekigzzn/out/v1/bd3b0c314fff4bb1ab4693358f3cd2d3/cenc.mpd",
    attributes: {
      "tvg-id": "68747470",
      "tvg-name": "TNT1",
      "tvg-logo": "https://api.dicebear.com/9.x/initials/svg?seed=TNT1",
      "tvg-language": "",
      "group-title": "stumpedtv",
    },
    kodiProps: {
      "inputstream.adaptive.manifest_type": "mpd",
      "inputstream.adaptive.license_type": "clearkey",
      "inputstream.adaptive.license_key": "https://pitv.apii.in/lic/294b5761cefc22d0c6312939e13d8278-52148f1042d238849f0a7813f1da8a7b",
    },
    extraHttpHeaders: {},
  },
  {
    name: "TNT2",
    image: "https://api.dicebear.com/9.x/initials/svg?seed=TNT2",
    location: "https://qw.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/fb6jy4pxts/out/v1/f8fa17f087564f51aa4d5c700be43ec4/cenc.mpd",
    attributes: {
      "tvg-id": "68747470",
      "tvg-name": "TNT2",
      "tvg-logo": "https://api.dicebear.com/9.x/initials/svg?seed=TNT2",
      "tvg-language": "",
      "group-title": "stumpedtv",
    },
    kodiProps: {
      "inputstream.adaptive.manifest_type": "mpd",
      "inputstream.adaptive.license_type": "clearkey",
      "inputstream.adaptive.license_key": "https://pitv.apii.in/lic/f288380ca4cef9ad3f27a92a08e9bb8b-9f18d26291d9230833501f7f822f6875",
    },
    extraHttpHeaders: {},
  },
];

const m3uContent = `#EXTM3U
#PLAYLIST:123
#
#EXTINF:-1 tvg-id="68747470" tvg-name="TNT1" tvg-logo="https://api.dicebear.com/9.x/initials/svg?seed=TNT1" tvg-language="" group-title="stumpedtv",TNT1
#EXTIMG:https://api.dicebear.com/9.x/initials/svg?seed=TNT1
#KODIPROP:inputstream.adaptive.manifest_type=mpd
#KODIPROP:inputstream.adaptive.license_type=clearkey
#KODIPROP:inputstream.adaptive.license_key=https://pitv.apii.in/lic/294b5761cefc22d0c6312939e13d8278-52148f1042d238849f0a7813f1da8a7b
https://qw.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/cllekigzzn/out/v1/bd3b0c314fff4bb1ab4693358f3cd2d3/cenc.mpd
#
#EXTINF:-1 tvg-id="68747470" tvg-name="TNT2" tvg-logo="https://api.dicebear.com/9.x/initials/svg?seed=TNT2" tvg-language="" group-title="stumpedtv",TNT2
#EXTIMG:https://api.dicebear.com/9.x/initials/svg?seed=TNT2
#KODIPROP:inputstream.adaptive.manifest_type=mpd
#KODIPROP:inputstream.adaptive.license_type=clearkey
#KODIPROP:inputstream.adaptive.license_key=https://pitv.apii.in/lic/f288380ca4cef9ad3f27a92a08e9bb8b-9f18d26291d9230833501f7f822f6875
https://qw.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/fb6jy4pxts/out/v1/f8fa17f087564f51aa4d5c700be43ec4/cenc.mpd
#`;

describe("generate payload", () => {
  // it('should be same as original after parse and generate', () => {
  //     expect(M3uParser.parse(complex).getM3uString()).toEqual(complex);
  //     expect(M3uParser.parse(commaNames).getM3uString()).toEqual(commaNames);
  //     expect(M3uParser.parse(emptyAttributes).getM3uString()).toEqual(emptyAttributes);
  // });
  it("should be same as original after parse and generate", () => {
    expect(M3uGenerator.generate({ title: "123", medias: payload })).toEqual(m3uContent);
  });
});
