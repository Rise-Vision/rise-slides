import "url-polyfill";
import { html } from "@polymer/polymer";
import { RiseElement } from "rise-common-component/src/rise-element.js";
import { version } from "./rise-slides-version.js";

export default class RiseSlides extends RiseElement {

  static get template() {
    return html``;
  }

  static get properties() {
    return {
      src: {
        type: String
      },
      duration: {
        type: Number,
        value: 10
      },
      url: {
        type: String,
        computed: "_computeUrl(src, duration, _started)",
        observer: "_urlChanged"
      }
    }
  }

  constructor() {
    super();

    this._setVersion( version );

    this._started = false;
    this._loadTimerMillis = 10000;
  }

  ready() {
    super.ready();

    this.addEventListener( "rise-presentation-play", () => this._refresh());
  }

  _shouldPropertyChange(property, value, old) {
    if (property === "src") {
      return true;
    }

    return super._shouldPropertyChange(property, value, old);
  }

  _computeUrl(src, duration, _started) {

    if (!_started || !src) {
      return "about:blank";
    }

    const url = new URL(src);

    url.searchParams.set("rm", "minimal");
    url.searchParams.set("loop", "true");
    url.searchParams.set("start", "true");
    url.searchParams.set("delayms", duration * 1000);
    url.searchParams.set("ts", new Date().getTime());
    url.pathname = url.pathname.replace("/pub", "/embed");

    return url.href;
  }

  _urlChanged() {
    this._refresh();

    clearTimeout(this._loadTimer);
    this._loadTimer = setTimeout(() => this._logLoadingErrorAndRetry(), this._loadTimerMillis);
  }

  _handleStart() {
    super._handleStart();

    this._started = true;
  }

  _onObjectLoad() {
    clearTimeout(this._loadTimer);
    super._setUptimeError(false);
    this._loadTimerMillis = 10000;
  }

  _hideCursor(tag) {
    const slidesHTML = tag && tag.contentDocument && tag.contentDocument.querySelector("html");

    if (!slidesHTML) {return;}
    slidesHTML.style.cursor = "none";
  }

  _logLoadingErrorAndRetry() {
    if (!RisePlayerConfiguration.isPreview()) {
      super._setUptimeError(true);
      const level = this._loadTimerMillis > 20000 ? "error" : "warning";

      super.log(level, "loading slides timeout", this.url);
    }

    const oneHour = 1000 * 60 * 60;

    this._loadTimerMillis = Math.min(this._loadTimerMillis * 2, oneHour);
    this._refresh();
  }

  _refresh() {
    this.shadowRoot.textContent = "";

    // object tag is dynamically created each time to prevent network error issue - https://github.com/Rise-Vision/html-template-library/issues/1043
    const tag = document.createElement("object");

    tag.setAttribute("data", this.url);
    tag.setAttribute("width", "100%");
    tag.setAttribute("height", "100%");
    tag.setAttribute("frameborder", "0");
    tag.setAttribute("allowTransparency", "true");
    tag.setAttribute("allowfullscreen", "true");
    tag.setAttribute("mozallowfullscreen", "true");
    tag.setAttribute("webkitallowfullscreen", "true");
    tag.setAttribute("sandbox", "allow-forms allow-same-origin allow-scripts allow-presentation");

    tag.onload = () => {this._onObjectLoad(); this._hideCursor(tag);}

    this.shadowRoot.appendChild(tag);
  }

}

customElements.define("rise-slides", RiseSlides);
