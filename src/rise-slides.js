import { WebComponent } from 'web-component';
import {LocalMessaging, Config, Logger, EventHandler} from 'common-component';
import Slides from './slides';
import Settings from './config/settings';

@WebComponent('rise-slides', {
  template: require('./rise-slides.html'),
  styles: require('./static/css/main.scss'),
  shadowDOM: true
})

export default class RiseSlides extends HTMLElement {
  constructor() {
    super();
    console.log('RiseSlides');
  }

  getSlides() {
    return this.slides;
  }

  connectedCallback() {
    console.log('RiseSlides', this.shadowRoot);
    if (this.parentElement && this.parentElement.tagName === 'RISE-PLAYLIST-ITEM') {
      this.playlistItem = this.parentElement;
    }

    this.config = new Config('rise-slides', 'rise_slides_events', 'rise-slides-failed.log');
    this.eventHandler = new EventHandler(null, this.playlistItem);
    this.licensingAttempts = 0;

    // is standalone
    if (this.hasAttribute('url')) {
      this._configureStandalone();
      this._initializeSlides({configureObject: {url: this.getAttribute('url')}});
      this._handlePlay();
    }

    this._createListenersForRisePlaylistItemEvents();
  }

  _configureStandalone() {
    var url = this.getAttribute('url');
    // TODO: component id & display id
    this.settings = new Settings(url, 'componentId', '100%', '100%', 'standalone');
  }

  _createListenersForRisePlaylistItemEvents() {
    console.log('_createListenersForRisePlaylistItemEvents', this.playlistItem);
    if (this.playlistItem) {
      console.log('_createListenersForRisePlaylistItemEvents - addEventListener');
      this.playlistItem.addEventListener('configure', event => {
        this._handleConfigure(event);
      });

      this.playlistItem.addEventListener('play', () => {
        this._handlePlay();
      });

      this.playlistItem.addEventListener('pause', () => {
        this._pause();
      });

      this.playlistItem.addEventListener('stop', () => {
        this._stop();
      });

      this.eventHandler.emitReadyForEvents();
    }
  }

  _handleConfigure(event) {
    this.config.setDisplayId(event.detail.displayId);
    this.config.setCompanyId(event.detail.companyId);
    console.log('_handleConfigure', event);

    if (event.detail) {
      this.settings = new Settings(event.detail.url, event.detail.componentId,
        event.detail.width + 'px', event.detail.height + 'px', event.detail.displayId);

      this._initializeSlides({configureObject: JSON.stringify(event.detail)});
    } else {
      console.log('Error: configuration is missing');
      this.eventHandler.emitDone();
    }
  }

  _initializeSlides(configureObject) {
    if (!this.settings.isPreview) {
      this.config.setComponentId(this.settings.id);

      this.localMessaging = new LocalMessaging();
      console.log('this.localMessaging connected');
      this.logger = new Logger(this.config, this.localMessaging);
      this.eventHandler = new EventHandler(this.logger, this.playlistItem);
      this._validadeConfiguration();

      this.slides = new Slides(this.shadowRoot, this.settings);
      this.eventHandler.emitReady();
      this.logger.playlistEvent('Configure Event', configureObject);
    } else {
      this.slides = new Slides(this.shadowRoot, this.settings);
      this.eventHandler.emitReady();
    }
  }

  _validadeConfiguration() {
    if (!this.settings.id) {
      this.logger.error('Error: componentId is missing');
      this.eventHandler.emitDone();
    }

    if (!this.settings.url) {
      this.logger.error('Error: url is missing');
      this.eventHandler.emitDone();
    }
  }

  _handlePlay() {
    if (this.settings.isPreview) {
      this._playInPreview();
    } else {
      this._play();
    }
  }

  _playInPreview() {
    console.log('_play in Preview');
    this.slides.play();
  }

  _play() {
    console.log('_play IsAuthorized');
    console.log(this.slides);
    this.slides.play();

    // TODO: authorization & licensing
  }

  _pause() {
    console.log('_pause');
    this.slides.stop();
  }

  _stop() {
    console.log('_stop');
    if (this.logger) { this.logger.playlistEvent('Stop Event'); };
    this._pause();
  }
}
