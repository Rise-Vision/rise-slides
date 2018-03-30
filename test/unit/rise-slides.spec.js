import RiseSlides from "../../src/rise-slides";
import Slides from "../../src/slides";
import Settings from "../../src/config/settings";
import {EventHandler} from "common-component";

let component = null;
let risePlaylistItem = null;
let eventHandler = null;
describe("Rise Slides - Unit", () => {
  describe("Test event listeners", () => {
    beforeAll(() => {
      top.RiseVision = {};
      top.RiseVision.Viewer = {};
      top.RiseVision.Viewer.LocalMessaging = {
        write: (message) => {},
        receiveMessages: (handler) => {},
        canConnect: () => {return true;}
      };

      eventHandler = new EventHandler();
      eventHandler.emitReady = jest.genMockFn();
      eventHandler.emitDone = jest.genMockFn();

      risePlaylistItem = document.createElement("rise-playlist-item");
      risePlaylistItem.callReady = jest.genMockFn();
      risePlaylistItem.callDone = jest.genMockFn();
      risePlaylistItem.callRSParamGet = jest.genMockFn();

      document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
      component = new RiseSlides();
      risePlaylistItem.appendChild(component);
      component.eventHandler = eventHandler;
      component.shadowRoot = {};
      component.shadowRoot.appendChild = jest.genMockFn();
      component.connectedCallback();

      component._play = jest.genMockFn();
      component._playInPreview = jest.genMockFn();
      component._pause = jest.genMockFn();
      component._stop = jest.genMockFn();
    });

    beforeEach(() => {
      const detail = {
        url: "test",
        displayId: "xxxxx"
      }
      component.settings = new Settings(detail);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should have component defined", () => {
      expect(RiseSlides).toBeDefined();
      expect(component).toBeDefined();
    });

    it("should call configure listener when configure event is dispached", (done) => {
      jest.useFakeTimers();

      const event = new CustomEvent("configure", {
        detail: {
          url: "http://test.com",
          displayId: "xxxxx"
        }
      });

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component.settings.url).toEqual("http://test.com");
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call playPreview listener when play event is dispached when in preview", (done) => {
      jest.useFakeTimers();
      component.settings.isPreview = true;
      const event = new CustomEvent("play");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._playInPreview).toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call play listener when play event is dispached when not in preview", (done) => {
      jest.useFakeTimers();
      component.settings.isPreview = false;
      const event = new CustomEvent("play");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._play).toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call pause listener when pause event is dispached", (done) => {
      jest.useFakeTimers();

      const event = new CustomEvent("pause");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._pause).toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

    it("should call stop listener when stop event is dispached", (done) => {
      jest.useFakeTimers();

      const event = new CustomEvent("stop");

      risePlaylistItem.dispatchEvent(event);

      setTimeout(()=>{
        expect(component._stop).toHaveBeenCalled();
        done();
      }, 1000);

      jest.runAllTimers();
    });

  })

  describe("Test play", () => {

    beforeAll(() => {
      risePlaylistItem = document.createElement("rise-playlist-item");
      document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
      component = new RiseSlides();
      component.shadowRoot = {};
      component.shadowRoot.appendChild = jest.genMockFn();
      component.connectedCallback();
      component.isPreview = false;
      component._play = jest.genMockFn();
      component._playInPreview = jest.genMockFn();
    })

    beforeEach(() => {
      const detail = {
        url: "test",
        displayId: "xxxxx"
      }
      component.settings = new Settings(detail);
    });
    
    it("should call _play when not on preview", () => {
      component.settings.isPreview = false;

      component._handlePlay();

      expect(component._play).toHaveBeenCalled();

    });

    it("should call _playInPreview when on preview", () => {
      component.settings.isPreview = true;

      component._handlePlay();

      expect(component._playInPreview).toHaveBeenCalled();

    });
  });

  describe("Test stop", () => {
    beforeAll(() => {
      risePlaylistItem = document.createElement("rise-playlist-item");
      document.getElementsByTagName("body")[0].appendChild(risePlaylistItem);
      component = new RiseSlides();
      component.shadowRoot = {};
      component.shadowRoot.appendChild = jest.genMockFn();
      component.connectedCallback();
      component.isPreview = false;
      component._pause = jest.genMockFn();
    })

    it("should call pause when stop is called", () => {
      component._stop();

      expect(component._pause).toHaveBeenCalled();
    });
  });
});
