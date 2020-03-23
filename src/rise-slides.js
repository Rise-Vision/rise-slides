import "url-polyfill";
import { html } from "@polymer/polymer";
import { RiseElement } from "rise-common-component/src/rise-element.js";
import { version } from "./rise-slides-version.js";

export default class RiseSlides extends RiseElement {

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
        computed: "_computeUrl(src, duration, _started, _playing)",
        observer: "_urlChanged"
      }
    }
  }

  constructor() {
    super();

    this._setVersion( version );

    this._started = false;
    this._playing = false;
    this._loadTimerMillis = 10000;
  }

  ready() {
    super.ready();

    this.addEventListener( "rise-presentation-play", () => {
      this._playing = true;
    });
    this.addEventListener( "rise-presentation-stop", () => {
      this._playing = false;
    });
  }

  _shouldPropertyChange(property, value, old) {
    if (property === "src") {
      return true;
    }

    return super._shouldPropertyChange(property, value, old);
  }

  _computeUrl(src, duration, _started, _playing) {

    if (!_started || !_playing || !src) {
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
    super._handleStart();

    this._started = true;
  }

  _onObjectLoad() {
    clearTimeout(this._loadTimer);
    super._setUptimeError(false);
    this._loadTimerMillis = 10000;
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
    this.src = this.src; // Trigger _computeUrl and force loading
  }
}

customElements.define("rise-slides", RiseSlides);
