import "url-polyfill";
import {PolymerElement, html} from "@polymer/polymer";

export default class RiseSlides extends PolymerElement {

  static get template() {
    return html`
      <iframe
        src="[[url]]"
        width="100%"
        height="100%"
        frameborder="0"
        allowTransparency="true"
        allowfullscreen="true"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        sandbox="allow-forms allow-same-origin allow-scripts allow-presentation">
      </iframe>
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
        computed: "_computeUrl(src, duration)"
      }
    }
  }

  // Event name constants
  static get EVENT_CONFIGURED() {
    return "configured";
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();

    if (RisePlayerConfiguration.isConfigured()) {
      this._init();
    } else {
      window.addEventListener( "rise-components-ready", () => this._init(), { once: true });
    }
  }

  _init() {
    this._sendEvent(RiseSlides.EVENT_CONFIGURED);
  }

  _computeUrl(src, duration) {

    if (!src) {
      return undefined;
    }

    const url = new URL(src);

    url.searchParams.set("rm", "minimal");
    url.searchParams.set("loop", "true");
    url.searchParams.set("start", "true");
    url.searchParams.set("delayms", duration * 1000);
    url.pathname = url.pathname.replace("/pub", "/embed");

    return url.href;
  }

  _sendEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      bubbles: true, composed: true, detail
    });

    this.dispatchEvent(event);
  }
}

customElements.define("rise-slides", RiseSlides);

