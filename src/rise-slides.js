import { WebComponent } from 'web-component';
import {LocalMessaging, Config, Logger, EventHandler} from 'common-component';
import Slides from './slides';

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
    this.playlistItem = this.parentElement;
    this.config = new Config('rise-slides', 'rise_slides_events', 'rise-slides-failed.log');
    this.eventHandler = new EventHandler(null, this.playlistItem);
    this.licensingAttempts = 0;

    this._createListenersForRisePlaylistItemEvents();
  }

  _createListenersForRisePlaylistItemEvents() {
    console.log('_createListenersForRisePlaylistItemEvents', this.playlistItem);
    if (this.playlistItem && this.playlistItem.tagName === 'RISE-PLAYLIST-ITEM') {
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
    } else {
      console.log('rise-playlist-item not found');
      this.eventHandler.emitDone();
    }
  }

  _handleConfigure(event) {
    this.config.setDisplayId(event.detail.displayId);
    this.config.setCompanyId(event.detail.companyId);
    console.log('_handleConfigure', event);
    if (event.detail && event.detail.displayId !== 'preview') {
      this.url = event.detail.url;
      this.id = event.detail.componentId;
      this.width = event.detail.width;
      this.height = event.detail.height;

      this.config.setComponentId(this.id);
      console.log('CONFIGURE - RiseSlides', this.config.componentId);

      this.localMessaging = new LocalMessaging();
      console.log('this.localMessaging connected');
      this.logger = new Logger(this.config, this.localMessaging);
      this.eventHandler = new EventHandler(this.logger, this.playlistItem);
      this._validadeConfiguration();

      this.slides = new Slides(this.shadowRoot, this.url, this.width, this.height);
      this.eventHandler.emitReady();
      this.logger.playlistEvent('Configure Event', {configureObject: JSON.stringify(event.detail)});
    } else {
      this.slides = new Slides(this.shadowRoot, this.url, this.width, this.height);
      this.isPreview = true;
      this.eventHandler.emitReady();
    }
  }

  _validadeConfiguration() {
    if (!this.id) {
      this.logger.error('Error: componentId is missing');
      this.eventHandler.emitDone();
    }

    if (!this.url) {
      this.logger.error('Error: url is missing');
      this.eventHandler.emitDone();
    }
  }

  _handlePlay() {
    if (this.isPreview) {
      this._playInPreview();
    } else {
      // TODO: authorization & licensing
      this._play();
    }
  }

  _playInPreview() {
    console.log('_play in Preview');
    this.slides.play();

    // TODO: filler slides?
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
