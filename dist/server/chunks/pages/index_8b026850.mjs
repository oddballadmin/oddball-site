import { c as createAstro, b as createComponent, r as renderTemplate, m as maybeRenderHead, s as spreadAttributes, e as addAttribute, u as unescapeHTML, f as renderComponent, F as Fragment, g as renderSlot } from '../astro_715b1273.mjs';
import 'clsx';
import { $ as $$Image, b as $$SectionHeader, c as $$Header, d as $$HeadContainer } from './contact_91d3ce50.mjs';
import '@astrojs/internal-helpers/path';
import { optimize } from 'svgo';
/* empty css                           */import 'html-escaper';
/* empty css                             *//* empty css                           *//* empty css                             */
const devImg = {"src":"/_astro/developer.799763ab.svg","width":234,"height":233,"format":"svg"};

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = /* #__PURE__ */ Object.assign({

});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name, inputProps);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$7 = createAstro();
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "H:/Projects/oddsite/node_modules/astro-icon/lib/Icon.astro", void 0);

const sprites = /* @__PURE__ */ new WeakMap();
function trackSprite(request, name) {
  let currentSet = sprites.get(request);
  if (!currentSet) {
    currentSet = /* @__PURE__ */ new Set([name]);
  } else {
    currentSet.add(name);
  }
  sprites.set(request, currentSet);
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(request) {
  const currentSet = sprites.get(request);
  if (currentSet) {
    return Array.from(currentSet);
  }
  if (!warned.has(request)) {
    const { pathname } = new URL(request.url);
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(request);
  }
  return [];
}

const $$Astro$6 = createAstro();
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites(Astro2.request);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(`position: absolute; width: 0; height: 0; overflow: hidden; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}</svg>`;
}, "H:/Projects/oddsite/node_modules/astro-icon/lib/Spritesheet.astro", void 0);

const $$Astro$5 = createAstro();
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(content)}` })}${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}`;
}, "H:/Projects/oddsite/node_modules/astro-icon/lib/SpriteProvider.astro", void 0);

const $$Astro$4 = createAstro();
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite(Astro2.request, name);
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>${title ? renderTemplate`<title>${title}</title>` : ""}<use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use></svg>`;
}, "H:/Projects/oddsite/node_modules/astro-icon/lib/Sprite.astro", void 0);

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$3 = createAstro();
const $$SkillItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$SkillItem;
  const { skill, desc, iconName } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="skill-element" data-astro-cid-gb5c5wyx>${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "class": "icon", "data-astro-cid-gb5c5wyx": true })}<div class="skill-title" data-astro-cid-gb5c5wyx>${skill}</div></div>`;
}, "H:/Projects/oddsite/src/layouts/utils/SkillItem.astro", void 0);

const $$Astro$2 = createAstro();
const $$SkillList = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SkillList;
  return renderTemplate`${maybeRenderHead()}<section class="skill-list" data-astro-cid-s6lzh2ku>${renderSlot($$result, $$slots["default"])}</section>`;
}, "H:/Projects/oddsite/src/layouts/utils/SkillList.astro", void 0);

const $$Astro$1 = createAstro();
const $$Bio = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Bio;
  return renderTemplate`${maybeRenderHead()}<section class="intro" data-astro-cid-jh3bnriy>${renderComponent($$result, "Image", $$Image, { "src": devImg, "alt": "dev at work", "class": "dev-bg", "data-astro-cid-jh3bnriy": true })}<div class="info" data-astro-cid-jh3bnriy><span class="decorator left" data-astro-cid-jh3bnriy></span><h1 data-astro-cid-jh3bnriy>George Goldsmith</h1><span class="decorator right" data-astro-cid-jh3bnriy></span></div><div class="info" data-astro-cid-jh3bnriy><span class="decorator left" data-astro-cid-jh3bnriy></span><p data-astro-cid-jh3bnriy>Web / Software developer (Fullstack)
<br data-astro-cid-jh3bnriy>BAS Information Systems Technology
</p><span class="decorator right" data-astro-cid-jh3bnriy></span></div><small class="git-link" data-astro-cid-jh3bnriy><a href="https://www.github.com" target="_blank" data-astro-cid-jh3bnriy>View My Github Repo</a></small></section><div class="container page-sect" data-astro-cid-jh3bnriy>${renderComponent($$result, "SectionHeader", $$SectionHeader, { "header": "A Little About Me", "subHead": "My skills and hobbies", "data-astro-cid-jh3bnriy": true })}<div class="excerpt" data-astro-cid-jh3bnriy><p data-astro-cid-jh3bnriy>Hello! My name is George Goldsmith, I am a current student / employee with Liberty University
<br data-astro-cid-jh3bnriy>I have been with Liberty University for over a year now with the LUO Admissions team as
            an admissions evaluator and <strong data-astro-cid-jh3bnriy>LOVE IT</strong>.<br data-astro-cid-jh3bnriy>
I Currently hold an Associates In Applied Science(Information Systems Technology) and am on track to finish my
            bachelors by early 2024.
<br data-astro-cid-jh3bnriy>I am in love with web development and just technology in general, and believe that God has called me to do this.
<br data-astro-cid-jh3bnriy>Some positive soft skills I have acquired throughout my years of work are....
</p><ul data-astro-cid-jh3bnriy><li data-astro-cid-jh3bnriy>Positive attitude</li><li data-astro-cid-jh3bnriy>Willing to learn</li><li data-astro-cid-jh3bnriy>3+ Years of Customer Service experience</li><li data-astro-cid-jh3bnriy>Hard working and dedicated</li><li data-astro-cid-jh3bnriy>Quick learner</li></ul></div>${renderComponent($$result, "SectionHeader", $$SectionHeader, { "header": "Some Skills I Have Gathered Throughout My Studies", "subHead": "Software / Web Development", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result, "SkillList", $$SkillList, { "data-astro-cid-jh3bnriy": true }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "HTML", "iconName": "vscode-icons:file-type-html", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "JS", "iconName": "vscode-icons:file-type-light-js", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "CSS", "iconName": "vscode-icons:file-type-css", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "Astro", "iconName": "vscode-icons:file-type-astro", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "Wordpress", "iconName": "brandico:wordpress", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "Java", "iconName": "logos:java", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "MySQL", "iconName": "logos:mysql", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "NodeJS", "iconName": "logos:nodejs", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "PHP", "iconName": "logos:php", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "API Integration", "iconName": "logos:postman-icon", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "SCSS/SASS", "iconName": "vscode-icons:file-type-scss2", "data-astro-cid-jh3bnriy": true })}${renderComponent($$result2, "SkillItem", $$SkillItem, { "skill": "Markdown", "iconName": "ion:logo-markdown", "data-astro-cid-jh3bnriy": true })}` })}</div>`;
}, "H:/Projects/oddsite/src/layouts/Bio.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "HeadContainer", $$HeadContainer, { "title": "Home" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="wrapper">${renderComponent($$result2, "Header", $$Header, {})}${renderComponent($$result2, "Bio", $$Bio, {})}</div>` })}`;
}, "H:/Projects/oddsite/src/pages/index.astro", void 0);

const $$file = "H:/Projects/oddsite/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
