import "url-polyfill";
import {PolymerElement, html} from "@polymer/polymer";
import {LoggerMixin} from "./logger-mixin";

export default class RiseSlides extends LoggerMixin(PolymerElement) {

  static get template() {
    return html`
      <object
        data="[[url]]"
        width="100%"
        height="100%"
        frameborder="0"
        allowTransparency="true"
        allowfullscreen="true"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        on-load="_onObjectLoad"
        sandbox="allow-forms allow-same-origin allow-scripts allow-presentation">
      </object>
    `;
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

  // Event name constants
  static get EVENT_CONFIGURED() {
    return "configured";
  }

  static get EVENT_START() {
    return "start";
  }

  constructor() {
    super();
    this._started = false;
    this._loadTimerMillis = 10000;
  }

  ready() {
    super.ready();

    if (RisePlayerConfiguration.isConfigured()) {
      this._init();
    } else {
      window.addEventListener( "rise-components-ready", () => this._init(), {once: true});
    }
  }

  _shouldPropertyChange(property, value, old) {
    if (property === "src") {
      return true;
    }

    return super._shouldPropertyChange(property, value, old);
  }

  _init() {
    this.addEventListener(RiseSlides.EVENT_START, this._handleStart, {once: true});
    this._sendEvent(RiseSlides.EVENT_CONFIGURED);
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
    clearTimeout(this._loadTimer);
    this._loadTimer = setTimeout(() => this._logLoadingErrorAndRetry(), this._loadTimerMillis);
  }

  _handleStart() {
    this._started = true;
  }

  _sendEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      bubbles: true, composed: true, detail
    });

    this.dispatchEvent(event);
  }

  _onObjectLoad() {
    clearTimeout(this._loadTimer);
    this._loadTimerMillis = 10000;
  }

  _logLoadingErrorAndRetry() {
    if (!RisePlayerConfiguration.isPreview()) {
      this.log("error", "loading slides timeout", this.url);
    }

    const oneHour = 1000 * 60 * 60;

    this._loadTimerMillis = Math.min(this._loadTimerMillis * 2, oneHour);
    this.src = this.src; // Trigger _computeUrl and retry loading
  }
}

customElements.define("rise-slides", RiseSlides);
