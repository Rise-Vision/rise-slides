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
        computed: "_computeUrl(src, duration, _started)"
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
    this._loadTimer = setTimeout(() => this._logLoadingError(), 10000);
  }

  _computeUrl(src, duration, _started) {

    if (!_started || !src) {
      return "";
    }

    const url = new URL(src);

    url.searchParams.set("rm", "minimal");
    url.searchParams.set("loop", "true");
    url.searchParams.set("start", "true");
    url.searchParams.set("delayms", duration * 1000);
    url.pathname = url.pathname.replace("/pub", "/embed");

    return url.href;
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
  }

  _logLoadingError() {
    if (!RisePlayerConfiguration.isPreview()) {
      this.log("error", "loading slides timeout")
    }
  }
}

customElements.define("rise-slides", RiseSlides);
