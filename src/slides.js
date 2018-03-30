import 'url-polyfill';

export default class Slides {
  constructor(shadowRoot, settings) {
    this.shadowRoot = shadowRoot;
    this.url = new URL(settings.url);
    this.width = settings.width + 'px';
    this.height = settings.height + 'px';
    this.loop = settings.loop;
    this.frame = null;
    this._normalizeUrl();
  }

  play() {
    this._loadFrame();
  }

  stop() {
    this._unloadFrame();
  }

  _normalizeUrl() {
    this.url.searchParams.set('rm', 'minimal');
    this.url.searchParams.set('loop', this.loop.toString());
    this.url.searchParams.set('start', 'true');
  }

  _unloadFrame() {
    if (this.frame) {
      this.shadowRoot.querySelector('.slides-component-template').removeChild(this.frame);
      this.frame = null;
    }
  }

  _loadFrame() {
    this.frame = this._getFrameElement();

    this.shadowRoot.querySelector('.slides-component-template').appendChild(this.frame);
  }

  _getFrameElement() {
    var frame = document.createElement('iframe');

    frame.className = 'webpage-frame';
    frame.style.visibility = 'hidden';
    frame.setAttribute('frameborder', '0');
    frame.setAttribute('allowTransparency', 'true');
    frame.setAttribute('allowfullscreen', 'true');
    frame.setAttribute('mozallowfullscreen', 'true');
    frame.setAttribute('webkitallowfullscreen', 'true');

    frame.setAttribute('width', this.width);
    frame.setAttribute('height', this.height);
    frame.setAttribute('sandbox', 'allow-forms allow-same-origin allow-scripts allow-presentation');

    frame.onload = function () {
      this.onload = null;
      this.style.visibility = 'visible';
    }

    frame.setAttribute('src', this.url.href);

    return frame;
  }
}
