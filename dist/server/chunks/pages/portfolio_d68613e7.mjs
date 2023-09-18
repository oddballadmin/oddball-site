import { c as createAstro, b as createComponent, r as renderTemplate, i as defineScriptVars, m as maybeRenderHead, f as renderComponent } from '../astro_715b1273.mjs';
import 'clsx';
import { b as $$SectionHeader, c as $$Header, d as $$HeadContainer } from './contact_91d3ce50.mjs';
/* empty css                               */import 'html-escaper';
import '@astrojs/internal-helpers/path';
/* empty css                             *//* empty css                           *//* empty css                             */
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro();
const $$Repo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Repo;
  const { name, desc, link } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", '<div class="repo" data-astro-cid-5otgwdb2><h2 data-astro-cid-5otgwdb2>', "</h2><p data-astro-cid-5otgwdb2>", '</p><button class="git-link" data-astro-cid-5otgwdb2>View Project</button></div><script>(function(){', "\n    const gitLinks = document.querySelectorAll('.git-link');\n    gitLinks.forEach(gitLink => {\n        gitLink.addEventListener('click', () => {\n            window.open(link, '_blank');\n        });\n    });\n})();<\/script>"])), maybeRenderHead(), name, desc, defineScriptVars({ link }));
}, "H:/Projects/oddsite/src/layouts/utils/Repo.astro", void 0);

const $$Astro$1 = createAstro();
const $$GitRepositories = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$GitRepositories;
  return renderTemplate`${maybeRenderHead()}<section class="container page-sect" data-astro-cid-xgtknxnp>${renderComponent($$result, "SectionHeader", $$SectionHeader, { "header": "Some examples of my previous Work", "subHead": "Websites / Applications", "data-astro-cid-xgtknxnp": true })}<div class="git-portfolio" data-astro-cid-xgtknxnp>${renderComponent($$result, "Repo", $$Repo, { "class": "repo", "name": "Donation Tracker", "desc": "An app to track the fictional dontations that a user has made and charts the overall donations with chart.js", "link": "https://github.com/oddballadmin/donationtracker", "data-astro-cid-xgtknxnp": true })}${renderComponent($$result, "Repo", $$Repo, { "class": "repo", "name": "Living Hope Acres", "desc": "A website concept originally designed for my parents, work stopped on it as they no longer had the need for a website", "link": "https://oddballadmin.github.io/", "data-astro-cid-xgtknxnp": true })}${renderComponent($$result, "Repo", $$Repo, { "class": "repo", "name": "Weather Widget", "desc": "A small lightweight Javascript applet that functions as a chrome extension, tracks the weather according to a customers address", "link": "https://github.com/oddballadmin/weather-widget", "data-astro-cid-xgtknxnp": true })}</div></section>`;
}, "H:/Projects/oddsite/src/layouts/GitRepositories.astro", void 0);

const $$Astro = createAstro();
const $$Portfolio = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Portfolio;
  return renderTemplate`${renderComponent($$result, "HeadContainer", $$HeadContainer, { "title": "Home" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="wrapper">${renderComponent($$result2, "Header", $$Header, {})}${renderComponent($$result2, "GitRepositories", $$GitRepositories, {})}</div>` })}`;
}, "H:/Projects/oddsite/src/pages/portfolio.astro", void 0);

const $$file = "H:/Projects/oddsite/src/pages/portfolio.astro";
const $$url = "/portfolio";

export { $$Portfolio as default, $$file as file, $$url as url };
