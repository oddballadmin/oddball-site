import { serialize, parse } from 'cookie';
import { bold } from 'kleur/colors';
import 'string-width';
import '@astrojs/internal-helpers/path';
import { A as AstroError, x as ResponseSentError, B as MiddlewareNoDataOrNextCalled, D as MiddlewareNotAResponse, H as ASTRO_VERSION, C as ClientAddressNotAvailable, S as StaticClientAddressNotAvailable, J as renderEndpoint, q as LocalsNotAnObject } from './chunks/astro_715b1273.mjs';
import 'clsx';
import mime from 'mime';
import { compile } from 'path-to-regexp';
import 'html-escaper';

const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = Symbol.for("astro.responseSent");
class AstroCookie {
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false")
      return false;
    if (this.value === "0")
      return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const serializeOptions = {
      expires: DELETED_EXPIRATION
    };
    if (options?.domain) {
      serializeOptions.domain = options.domain;
    }
    if (options?.path) {
      serializeOptions.path = options.path;
    }
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      serialize(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      return new AstroCookie(value);
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @returns
   */
  has(key) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed();
    return !!values[key];
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      serialize(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null)
      return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  #ensureParsed() {
    if (!this.#requestValues) {
      this.#parse();
    }
    if (!this.#requestValues) {
      this.#requestValues = {};
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = parse(raw);
  }
}

const astroCookiesSymbol = Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of cookies.headers()) {
    yield headerValue;
  }
  return [];
}

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message
  };
  if (levels[logLevel] > levels[level]) {
    return;
  }
  dest.write(event);
}
function info(opts, label, message) {
  return log(opts, "info", label, message);
}
function warn(opts, label, message) {
  return log(opts, "warn", label, message);
}
function error(opts, label, message) {
  return log(opts, "error", label, message);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message) {
    info(this.options, label, message);
  }
  warn(label, message) {
    warn(this.options, label, message);
  }
  error(label, message) {
    error(this.options, label, message);
  }
  debug(label, message, ...args) {
    debug(this.options, label, message, args);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.options, this.label, message);
  }
}

async function callMiddleware(logger, onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async () => {
    nextCalled = true;
    responseFunctionPromise = responseFunction();
    return responseFunctionPromise;
  };
  let middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (isEndpointOutput(value)) {
      logger.warn(
        "middleware",
        `Using simple endpoints can cause unexpected issues in the chain of middleware functions.
It's strongly suggested to use full ${bold("Response")} objects.`
      );
    }
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
function isEndpointOutput(endpointResult) {
  return !(endpointResult instanceof Response) && typeof endpointResult === "object" && typeof endpointResult.body === "string";
}

const encoder = new TextEncoder();
const clientAddressSymbol = Symbol.for("astro.clientAddress");
const clientLocalsSymbol = Symbol.for("astro.locals");
function createAPIContext({
  request,
  params,
  site,
  props,
  adapterName
}) {
  initResponseWithEncoding();
  const context = {
    cookies: new AstroCookies(request),
    request,
    params,
    site: site ? new URL(site) : void 0,
    generator: `Astro v${ASTRO_VERSION}`,
    props,
    redirect(path, status) {
      return new Response(null, {
        status: status || 302,
        headers: {
          Location: path
        }
      });
    },
    ResponseWithEncoding,
    url: new URL(request.url),
    get clientAddress() {
      if (!(clientAddressSymbol in request)) {
        if (adapterName) {
          throw new AstroError({
            ...ClientAddressNotAvailable,
            message: ClientAddressNotAvailable.message(adapterName)
          });
        } else {
          throw new AstroError(StaticClientAddressNotAvailable);
        }
      }
      return Reflect.get(request, clientAddressSymbol);
    }
  };
  Object.defineProperty(context, "locals", {
    enumerable: true,
    get() {
      return Reflect.get(request, clientLocalsSymbol);
    },
    set(val) {
      if (typeof val !== "object") {
        throw new AstroError(LocalsNotAnObject);
      } else {
        Reflect.set(request, clientLocalsSymbol, val);
      }
    }
  });
  return context;
}
let ResponseWithEncoding;
let initResponseWithEncoding = () => {
  class LocalResponseWithEncoding extends Response {
    constructor(body, init, encoding) {
      if (typeof body === "string") {
        if (typeof Buffer !== "undefined" && Buffer.from) {
          body = Buffer.from(body, encoding);
        } else if (encoding == null || encoding === "utf8" || encoding === "utf-8") {
          body = encoder.encode(body);
        }
      }
      super(body, init);
      if (encoding) {
        this.headers.set("X-Astro-Encoding", encoding);
      }
    }
  }
  ResponseWithEncoding = LocalResponseWithEncoding;
  initResponseWithEncoding = () => {
  };
  return LocalResponseWithEncoding;
};
async function callEndpoint(mod, env, ctx, onRequest) {
  const context = createAPIContext({
    request: ctx.request,
    params: ctx.params,
    props: ctx.props,
    site: env.site,
    adapterName: env.adapterName
  });
  let response;
  if (onRequest) {
    response = await callMiddleware(
      env.logger,
      onRequest,
      context,
      async () => {
        return await renderEndpoint(mod, context, env.ssr, env.logger);
      }
    );
  } else {
    response = await renderEndpoint(mod, context, env.ssr, env.logger);
  }
  const isEndpointSSR = env.ssr && !ctx.route?.prerender;
  if (response instanceof Response) {
    if (isEndpointSSR && response.headers.get("X-Astro-Encoding")) {
      env.logger.warn(
        "ssr",
        "`ResponseWithEncoding` is ignored in SSR. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
    attachCookiesToResponse(response, context.cookies);
    return response;
  }
  env.logger.warn(
    "astro",
    `${ctx.route.component} returns a simple object which is deprecated. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information.`
  );
  if (isEndpointSSR) {
    if (response.hasOwnProperty("headers")) {
      env.logger.warn(
        "ssr",
        "Setting headers is not supported when returning an object. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
    if (response.encoding) {
      env.logger.warn(
        "ssr",
        "`encoding` is ignored in SSR. To return a charset other than UTF-8, please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
  }
  let body;
  const headers = new Headers();
  const pathname = ctx.route ? (
    // Try the static route `pathname`
    ctx.route.pathname ?? // Dynamic routes don't include `pathname`, so synthesize a path for these (e.g. 'src/pages/[slug].svg')
    ctx.route.segments.map((s) => s.map((p) => p.content).join("")).join("/")
  ) : (
    // Fallback to pathname of the request
    ctx.pathname
  );
  const mimeType = mime.getType(pathname) || "text/plain";
  headers.set("Content-Type", `${mimeType};charset=utf-8`);
  if (response.encoding) {
    headers.set("X-Astro-Encoding", response.encoding);
  }
  if (response.body instanceof Uint8Array) {
    body = response.body;
    headers.set("Content-Length", body.byteLength.toString());
  } else if (typeof Buffer !== "undefined" && Buffer.from) {
    body = Buffer.from(response.body, response.encoding);
    headers.set("Content-Length", body.byteLength.toString());
  } else if (response.encoding == null || response.encoding === "utf8" || response.encoding === "utf-8") {
    body = encoder.encode(response.body);
    headers.set("Content-Length", body.byteLength.toString());
  } else {
    body = response.body;
  }
  response = new Response(body, {
    status: 200,
    headers
  });
  attachCookiesToResponse(response, context.cookies);
  return response;
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/image-endpoint.js","pathname":"/_image","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/contact.21c2df50.css"},{"type":"inline","content":".skill-element[data-astro-cid-gb5c5wyx]{display:flex;flex:1;align-items:center;flex-flow:column nowrap;align-self:baseline;text-align:center;gap:.5rem;position:relative;padding:1.5rem}.skill-title[data-astro-cid-gb5c5wyx]{width:100%;position:absolute;top:100%;text-align:center;visibility:hidden}.icon[data-astro-cid-gb5c5wyx]{height:clamp(4rem,8vh,6rem);margin:auto;width:auto}.skill-list[data-astro-cid-s6lzh2ku]{display:flex;flex-flow:row wrap;gap:5rem;height:auto}.about-me[data-astro-cid-jh3bnriy]{margin-top:1rem}ul[data-astro-cid-jh3bnriy]{font-size:clamp(1.2rem,2vh,2rem);width:auto;border:#17388a .25em solid;padding:1em 2em}li[data-astro-cid-jh3bnriy]{padding:.5rem}.intro[data-astro-cid-jh3bnriy]{display:flex;flex-flow:column nowrap;align-items:center;justify-content:center;min-height:85vh;width:100%;position:relative}.intro[data-astro-cid-jh3bnriy] .dev-bg[data-astro-cid-jh3bnriy]{position:absolute;display:block;align-self:center;z-index:-1;opacity:.2;width:85%;height:85%}.info[data-astro-cid-jh3bnriy]{display:grid;grid-template-columns:2fr 1fr 2fr;justify-content:center;text-align:center;gap:10rem}.info[data-astro-cid-jh3bnriy] h1[data-astro-cid-jh3bnriy]{align-self:center;justify-content:center;font-size:clamp(3rem,4.75vw,4.75rem);font-family:var(--font-family-secondary-font-med);white-space:nowrap;letter-spacing:.5rem;font-weight:700}.info[data-astro-cid-jh3bnriy] p[data-astro-cid-jh3bnriy]{align-self:center;justify-content:center;line-height:1.5;font-size:clamp(1.75rem,3.5vw,3.5rem);font-family:var(--font-family-primary-font-extended);font-weight:400;white-space:nowrap;margin:0 15rem}.decorator[data-astro-cid-jh3bnriy]{height:2rem;background-color:#17388a;align-self:center;border-radius:50vh}.left[data-astro-cid-jh3bnriy]{border-bottom-left-radius:0;border-top-left-radius:0}.right[data-astro-cid-jh3bnriy]{border-bottom-right-radius:0;border-top-right-radius:0}.git-link[data-astro-cid-jh3bnriy]{margin:1rem;padding:1rem 1.5rem;border-radius:1rem;box-shadow:15px 20px 35px 17px #0000001a;background-color:#17388a;height:auto;font-size:clamp(1rem,1.75vw,1.75rem)}.git-link[data-astro-cid-jh3bnriy]:focus{box-shadow:0 0 #0000001a}a[data-astro-cid-jh3bnriy]{color:hsl(var(--color-accent-color));text-decoration:none}a[data-astro-cid-jh3bnriy]:visited{color:hsl(var(--color-accent-color))}@media only screen and (max-width: 600px){.intro[data-astro-cid-jh3bnriy]{min-height:75vh}}\n.sect-heading[data-astro-cid-gvcn5fmk]{display:flex;flex-flow:column nowrap;line-height:2.5;margin:0;padding:1.5rem 0;font-family:var(--font-family-primary-font-extended);letter-spacing:.2rem}h2[data-astro-cid-gvcn5fmk]{line-height:1.25em;font-size:clamp(3.5rem,4.75vw,4.75rem);padding:0;margin:0}.sub-head[data-astro-cid-gvcn5fmk]{font-size:clamp(2.5rem,3.75vw,3.75rem);font-family:var(--font-family-secondary-font);font-weight:200;line-height:1.25}\n"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/contact.21c2df50.css"},{"type":"inline","content":".repo[data-astro-cid-5otgwdb2]{display:flex;flex-direction:column;border:2.5px solid #000;align-items:center;text-align:center;min-height:30rem;position:relative;min-width:30rem}h2[data-astro-cid-5otgwdb2]{background-color:hsl(var(--color-primary-color));color:#fff;width:100%}p[data-astro-cid-5otgwdb2]{padding:1rem}button[data-astro-cid-5otgwdb2]{background-color:hsl(var(--color-primary-color));color:#fff;border:none;padding:1rem;cursor:pointer;position:absolute;justify-content:center;top:90%;margin:auto}.git-portfolio[data-astro-cid-xgtknxnp]{display:flex;flex-direction:row;min-width:100%;height:auto;gap:2rem}@media only screen and (max-width: 600px){.git-portfolio[data-astro-cid-xgtknxnp]{flex-direction:column;align-items:center}}\n.sect-heading[data-astro-cid-gvcn5fmk]{display:flex;flex-flow:column nowrap;line-height:2.5;margin:0;padding:1.5rem 0;font-family:var(--font-family-primary-font-extended);letter-spacing:.2rem}h2[data-astro-cid-gvcn5fmk]{line-height:1.25em;font-size:clamp(3.5rem,4.75vw,4.75rem);padding:0;margin:0}.sub-head[data-astro-cid-gvcn5fmk]{font-size:clamp(2.5rem,3.75vw,3.75rem);font-family:var(--font-family-secondary-font);font-weight:200;line-height:1.25}\n"}],"routeData":{"route":"/portfolio","type":"page","pattern":"^\\/portfolio\\/?$","segments":[[{"content":"portfolio","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/portfolio.astro","pathname":"/portfolio","prerender":false,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const c=document.querySelector(\".contact-form\");c.addEventListener(\"submit\",async o=>{o.preventDefault();const r=document.querySelector(\"#project-type\").value,s=document.querySelector(\".email-in\").value,n=document.querySelector(\".desc-area\").value;try{const e=await fetch(\"http://localhost:3000/send-email\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:s,project:r,message:n})}),t=await e.json();e.status===200?console.log(\"Email sent successfully:\",t):console.error(\"Error sending email:\",t)}catch(e){console.error(\"There was an error:\",e)}});\n"}],"styles":[{"type":"external","src":"/_astro/contact.21c2df50.css"},{"type":"inline","content":".sect-heading[data-astro-cid-gvcn5fmk]{display:flex;flex-flow:column nowrap;line-height:2.5;margin:0;padding:1.5rem 0;font-family:var(--font-family-primary-font-extended);letter-spacing:.2rem}h2[data-astro-cid-gvcn5fmk]{line-height:1.25em;font-size:clamp(3.5rem,4.75vw,4.75rem);padding:0;margin:0}.sub-head[data-astro-cid-gvcn5fmk]{font-size:clamp(2.5rem,3.75vw,3.75rem);font-family:var(--font-family-secondary-font);font-weight:200;line-height:1.25}\n.page-sect[data-astro-cid-a5f5zqqm]{margin-top:2rem}\n"}],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"_meta":{"trailingSlash":"ignore"}}}],"base":"/","compressHTML":true,"componentMetadata":[["H:/Projects/oddsite/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["H:/Projects/oddsite/src/pages/index.astro",{"propagation":"none","containsHead":true}],["H:/Projects/oddsite/src/pages/portfolio.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,n)=>{let s=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),s();break}});for(let e of n.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/node_modules/astro/dist/assets/image-endpoint.js":"chunks/pages/image-endpoint_1a48c0a0.mjs","/src/pages/index.astro":"chunks/pages/index_8b026850.mjs","/src/pages/portfolio.astro":"chunks/pages/portfolio_d68613e7.mjs","\u0000@astrojs-manifest":"manifest_5795ae94.mjs","\u0000@astro-page:node_modules/astro/dist/assets/image-endpoint@_@js":"chunks/image-endpoint_944be461.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_0fdbd923.mjs","\u0000@astro-page:src/pages/portfolio@_@astro":"chunks/portfolio_97f78578.mjs","\u0000@astro-page:src/pages/contact@_@astro":"chunks/contact_f48a83b4.mjs","H:/Projects/oddsite/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_2ef2586f.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.d002c6be.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/oi-logo.6f9c5dce.webp","/_astro/developer.799763ab.svg","/_astro/family.d1c8326b.png","/_astro/contact.21c2df50.css","/background.jpg","/developer.svg","/donation.jpg","/family.png","/favicon.svg","/lu.gif","/oi-logo.webp"]});

export { AstroCookies as A, Logger as L, attachCookiesToResponse as a, callEndpoint as b, createAPIContext as c, dateTimeFormat as d, callMiddleware as e, AstroIntegrationLogger as f, getSetCookiesFromResponse as g, levels as l, manifest };
