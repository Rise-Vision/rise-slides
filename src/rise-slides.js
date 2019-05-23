import Slides from "./slides";
import {PolymerElement, html} from "@polymer/polymer";

export default class RiseSlides extends PolymerElement {

  static get template() {
    return html`
    <style>
    :host {
      display: flex;
    }
    </style>
    <div class="slides-component-template"></div>`;
  }

  static get properties() {
    return {
      src: {
        type: String
      },
      duration: {
        type: Number
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
    this.slides = new Slides(this.shadowRoot, this.getAttribute("src"), this.getAttribute("duration"));
    this.slides.play();
    this._sendEvent(RiseSlides.EVENT_CONFIGURED);
  }

  _sendEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      bubbles: true, composed: true, detail
    });

    this.dispatchEvent(event);
  }
}

customElements.define("rise-slides", RiseSlides);

