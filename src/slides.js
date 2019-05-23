import "url-polyfill";

export default class Slides {
  constructor(shadowRoot, src, duration) {
    this.shadowRoot = shadowRoot;
    this.url = new URL(src);
    this.frame = null;
    this._normalizeUrl(duration);
  }

  play() {
    this._loadFrame();
  }

  stop() {
    this._unloadFrame();
  }

  _normalizeUrl(duration) {
    this.url.searchParams.set("rm", "minimal");
    this.url.searchParams.set("loop", "true");
    this.url.searchParams.set("start", "true");
    this.url.searchParams.set("delayms", duration);
    this.url.pathname = this.url.pathname.replace("/pub", "/embed");
  }

  _unloadFrame() {
    if (this.frame) {
      this.shadowRoot.querySelector(".slides-component-template").removeChild(this.frame);
      this.frame = null;
    }
  }

  _loadFrame() {
    this.frame = this._getFrameElement();

    this.shadowRoot.querySelector(".slides-component-template").appendChild(this.frame);
  }

  _getFrameElement() {
    var frame = document.createElement("iframe");

    frame.className = "webpage-frame";
    frame.style.visibility = "hidden";
    frame.style.position = "absolute";
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("allowTransparency", "true");
    frame.setAttribute("allowfullscreen", "true");
    frame.setAttribute("mozallowfullscreen", "true");
    frame.setAttribute("webkitallowfullscreen", "true");

    frame.setAttribute("width", "100%");
    frame.setAttribute("height", "100%");
    frame.setAttribute("sandbox", "allow-forms allow-same-origin allow-scripts allow-presentation");

    frame.onload = function () {
      this.onload = null;
      this.style.visibility = "visible";
    }

    frame.setAttribute("src", this.url.href);

    return frame;
  }
}
