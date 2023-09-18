import { joinPaths, isRemotePath } from '@astrojs/internal-helpers/path';
import { A as AstroError, E as ExpectedImage, L as LocalImageUsedWrongly, M as MissingImageDimension, U as UnsupportedImageFormat, I as InvalidImageService, a as ExpectedImageOptions, c as createAstro, b as createComponent, d as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, e as addAttribute, s as spreadAttributes, f as renderComponent, g as renderSlot, h as renderHead } from '../astro_715b1273.mjs';
import 'clsx';
/* empty css                             *//* empty css                           *//* empty css                             */
const VALID_SUPPORTED_FORMATS = [
  "jpeg",
  "jpg",
  "png",
  "tiff",
  "webp",
  "gif",
  "svg"
];

function isLocalService(service) {
  if (!service) {
    return false;
  }
  return "transform" in service;
}
function parseQuality(quality) {
  let result = parseInt(quality);
  if (Number.isNaN(result)) {
    return quality;
  }
  return result;
}
const baseService = {
  validateOptions(options) {
    if (!options.src || typeof options.src !== "string" && typeof options.src !== "object") {
      throw new AstroError({
        ...ExpectedImage,
        message: ExpectedImage.message(JSON.stringify(options.src))
      });
    }
    if (!isESMImportedImage(options.src)) {
      if (options.src.startsWith("/@fs/")) {
        throw new AstroError({
          ...LocalImageUsedWrongly,
          message: LocalImageUsedWrongly.message(options.src)
        });
      }
      let missingDimension;
      if (!options.width && !options.height) {
        missingDimension = "both";
      } else if (!options.width && options.height) {
        missingDimension = "width";
      } else if (options.width && !options.height) {
        missingDimension = "height";
      }
      if (missingDimension) {
        throw new AstroError({
          ...MissingImageDimension,
          message: MissingImageDimension.message(missingDimension, options.src)
        });
      }
    } else {
      if (!VALID_SUPPORTED_FORMATS.includes(options.src.format)) {
        throw new AstroError({
          ...UnsupportedImageFormat,
          message: UnsupportedImageFormat.message(
            options.src.format,
            options.src.src,
            VALID_SUPPORTED_FORMATS
          )
        });
      }
      if (options.src.format === "svg") {
        options.format = "svg";
      }
    }
    if (!options.format) {
      options.format = "webp";
    }
    return options;
  },
  getHTMLAttributes(options) {
    let targetWidth = options.width;
    let targetHeight = options.height;
    if (isESMImportedImage(options.src)) {
      const aspectRatio = options.src.width / options.src.height;
      if (targetHeight && !targetWidth) {
        targetWidth = Math.round(targetHeight * aspectRatio);
      } else if (targetWidth && !targetHeight) {
        targetHeight = Math.round(targetWidth / aspectRatio);
      } else if (!targetWidth && !targetHeight) {
        targetWidth = options.src.width;
        targetHeight = options.src.height;
      }
    }
    const { src, width, height, format, quality, ...attributes } = options;
    return {
      ...attributes,
      width: targetWidth,
      height: targetHeight,
      loading: attributes.loading ?? "lazy",
      decoding: attributes.decoding ?? "async"
    };
  },
  getURL(options, imageConfig) {
    const searchParams = new URLSearchParams();
    if (isESMImportedImage(options.src)) {
      searchParams.append("href", options.src.src);
    } else if (isRemoteAllowed(options.src, imageConfig)) {
      searchParams.append("href", options.src);
    } else {
      return options.src;
    }
    const params = {
      w: "width",
      h: "height",
      q: "quality",
      f: "format"
    };
    Object.entries(params).forEach(([param, key]) => {
      options[key] && searchParams.append(param, options[key].toString());
    });
    const imageEndpoint = joinPaths("/", "/_image");
    return `${imageEndpoint}?${searchParams}`;
  },
  parseURL(url) {
    const params = url.searchParams;
    if (!params.has("href")) {
      return void 0;
    }
    const transform = {
      src: params.get("href"),
      width: params.has("w") ? parseInt(params.get("w")) : void 0,
      height: params.has("h") ? parseInt(params.get("h")) : void 0,
      format: params.get("f"),
      quality: params.get("q")
    };
    return transform;
  }
};

function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    const additionalSubdomains = url.hostname.replace(slicedHostname, "").split(".").filter(Boolean);
    return additionalSubdomains.length === 1;
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    const additionalPathChunks = url.pathname.replace(slicedPathname, "").split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}

function isESMImportedImage(src) {
  return typeof src === "object";
}
function isRemoteImage(src) {
  return typeof src === "string";
}
function isRemoteAllowed(src, {
  domains = [],
  remotePatterns = []
}) {
  if (!isRemotePath(src))
    return false;
  const url = new URL(src);
  return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../sharp_2ef2586f.mjs'
    ).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset)
      globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: typeof options.src === "object" && "then" in options.src ? (await options.src).default : options.src
  };
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && // If `getURL` returned the same URL as the user provided, it means the service doesn't need to do anything
  !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    imageURL = globalThis.astroAsset.addStaticImage(validatedOptions);
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    attributes: service.getHTMLAttributes !== void 0 ? service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$7 = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(image.attributes)}>`;
}, "H:/Projects/oddsite/node_modules/astro/components/Image.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					const getImage = async (options) => await getImage$1(options, imageConfig);

const $$Astro$6 = createAstro();
const $$TopNavigation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$TopNavigation;
  return renderTemplate`${maybeRenderHead()}<nav data-astro-cid-wowgrm2d><ul data-astro-cid-wowgrm2d><li class="nav-item" data-astro-cid-wowgrm2d><a class="nav-link" href="/" data-astro-cid-wowgrm2d>Home</a></li><li class="nav-item" data-astro-cid-wowgrm2d><a class="nav-link" href="/portfolio" data-astro-cid-wowgrm2d>Portfolio</a></li><li class="nav-item" data-astro-cid-wowgrm2d><a class="nav-link" href="/contact" data-astro-cid-wowgrm2d>Contact Me</a></li></ul></nav>`;
}, "H:/Projects/oddsite/src/layouts/Top-Navigation.astro", void 0);

const brandImg = {"src":"/_astro/oi-logo.6f9c5dce.webp","width":194,"height":191,"format":"webp"};

const $$Astro$5 = createAstro();
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-xbstl6g3><div class="brand" data-astro-cid-xbstl6g3>${renderComponent($$result, "Image", $$Image, { "src": brandImg, "alt": "Brand Logo", "data-astro-cid-xbstl6g3": true })}</div>${renderComponent($$result, "TopNavigation", $$TopNavigation, { "data-astro-cid-xbstl6g3": true })}</header>`;
}, "H:/Projects/oddsite/src/layouts/Header.astro", void 0);

const $$Astro$4 = createAstro();
const $$SectionHeader = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$SectionHeader;
  const { header, subHead } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="sect-heading" data-astro-cid-gvcn5fmk><h2 data-astro-cid-gvcn5fmk>${header}</h2><p class="sub-head" data-astro-cid-gvcn5fmk>${subHead}</p></div>`;
}, "H:/Projects/oddsite/src/layouts/utils/SectionHeader.astro", void 0);

const $$Astro$3 = createAstro();
const $$Meta = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Meta;
  const { title } = Astro2.props;
  return renderTemplate`<meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderSlot($$result, $$slots["default"])}`;
}, "H:/Projects/oddsite/src/layouts/utils/Meta.astro", void 0);

const $$Astro$2 = createAstro();
const $$HeadContainer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$HeadContainer;
  return renderTemplate`<html lang="en"><head>${renderComponent($$result, "Meta", $$Meta, {})}${renderHead()}</head>${renderSlot($$result, $$slots["default"])}</html>`;
}, "H:/Projects/oddsite/src/layouts/utils/Head-Container.astro", void 0);

const family = {"src":"/_astro/family.d1c8326b.png","width":1855,"height":1920,"format":"png"};

const $$Astro$1 = createAstro();
const $$ContactUs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ContactUs;
  return renderTemplate`${maybeRenderHead()}<div class="container page-sect" data-astro-cid-a5f5zqqm>${renderComponent($$result, "SectionHeader", $$SectionHeader, { "header": "Want To Hire Me?!", "subHead": "Contact me using the form below", "data-astro-cid-a5f5zqqm": true })}<section class="contact-us" data-astro-cid-a5f5zqqm><form class="contact-form" data-astro-cid-a5f5zqqm><select id="project-type" name="project-type" class="p-picker" data-astro-cid-a5f5zqqm><option value="Web Design" data-astro-cid-a5f5zqqm>Web Design</option><option value="SEO" data-astro-cid-a5f5zqqm>Web Design</option><option value="Contract Work" data-astro-cid-a5f5zqqm>Contract Work</option><option value="App Development" data-astro-cid-a5f5zqqm>App Development</option></select><input class="email-in" type="email" placeholder="Email Address" data-astro-cid-a5f5zqqm><textarea class="desc-area" placeholder="Breif description of project" data-astro-cid-a5f5zqqm></textarea><div class="btn-group" data-astro-cid-a5f5zqqm><button type="reset" data-astro-cid-a5f5zqqm>Reset</button><button type="submit" data-astro-cid-a5f5zqqm>Submit</button></div></form><div class="img-side" data-astro-cid-a5f5zqqm>${renderComponent($$result, "Image", $$Image, { "src": family, "alt": "Family", "data-astro-cid-a5f5zqqm": true })}</div></section></div>`;
}, "H:/Projects/oddsite/src/layouts/ContactUs.astro", void 0);

const $$Astro = createAstro();
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Contact;
  return renderTemplate`${renderComponent($$result, "HeadContainer", $$HeadContainer, { "title": "Home" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="wrapper">${renderComponent($$result2, "Header", $$Header, {})}${renderComponent($$result2, "ContactUs", $$ContactUs, {})}</div>` })}`;
}, "H:/Projects/oddsite/src/pages/contact.astro", void 0);

const $$file = "H:/Projects/oddsite/src/pages/contact.astro";
const $$url = "/contact";

const contact = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Image as $, isRemoteAllowed as a, $$SectionHeader as b, $$Header as c, $$HeadContainer as d, baseService as e, contact as f, getConfiguredImageService as g, imageConfig as i, parseQuality as p };
