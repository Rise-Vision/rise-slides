import Slides from "../../src/slides";
import Settings from "../../src/config/settings";

let slides = null;
let testUrl = "http://test.com";
let testWidth = "800px";
let testHeight = "600px";
let displayId = "xxxxx";
let shadowRoot = null;
let shadowRootQuerySelector = null;

describe("Slides - Unit", () => {
  beforeEach(() => {
    shadowRoot = {};
    shadowRootQuerySelector = {};
    shadowRootQuerySelector.appendChild = jest.genMockFn();
    shadowRootQuerySelector.removeChild = jest.genMockFn();
    shadowRoot.querySelector = jest.fn(function() {
      return shadowRootQuerySelector;
    })

    const url = testUrl;
    const width = testWidth;
    const height = testHeight;
    const displayId = displayId;

    let settings = new Settings(url, null, width, height, displayId);

    slides = new Slides(shadowRoot, settings);
  });

  it("play should call loadFrame", () => {
    slides._loadFrame = jest.genMockFn();

    slides.play();

    expect(slides._loadFrame).toHaveBeenCalled();
  });

  it("loadFrame should append iframe", () => {
    slides._loadFrame();

    expect(shadowRootQuerySelector.appendChild).toBeCalled();
  })

  it("iframe should have correct width and height", () => {
    const frame = slides._getFrameElement();

    expect(frame.getAttribute("width")).toBe(testWidth);
    expect(frame.getAttribute("height")).toBe(testHeight);
  });

  it("iframe should have correct url", () => {
    const frame = slides._getFrameElement();

    expect(frame.getAttribute("src")).toContain(testUrl);
  });

  it("should remove iframe on stop", () => {
    slides.play();
    slides.stop();

    expect(shadowRootQuerySelector.removeChild).toBeCalled();
  });

  describe("URL - Unit", () => {
    it("should set rm settings", () => {
      slides._normalizeUrl();

      expect(slides.url.href).toContain("rm=minimal");
    });

    it("should override rm setting", () => {
      slides.url = new URL("http://test.com?rm=full");
      slides._normalizeUrl();
      
      expect(slides.url.href).toContain("rm=minimal");
      expect(slides.url.href).not.toContain("rm=full");
    });

    it("should loop on displays", () => {      
      expect(slides.url.href).not.toContain("loop=false");
      expect(slides.url.href).toContain("loop=true");
    });

    it("should not loop on preview", () => {
      const url = testUrl;
      const width = testWidth;
      const height = testHeight;
      const displayId = "preview";

      let settings = new Settings(url, null, width, height, displayId);
  
      slides = new Slides(shadowRoot, settings);
      
      expect(slides.url.href).toContain("loop=false");
      expect(slides.url.href).not.toContain("loop=true");
    });

    it("should use embed url", () => {
      const url = "https://docs.google.com/presentation/d/e/xxx/pub?start=false&loop=false&delayms=3000";
      const width = testWidth;
      const height = testHeight;
      const displayId = "preview";

      let settings = new Settings(url, null, width, height, displayId);

      slides = new Slides(shadowRoot, settings);
      expect(slides.url.href).toContain("/embed");
      expect(slides.url.href).not.toContain("/sub");
    });

    it("should keep embed url", () => {
      const url = "https://docs.google.com/presentation/d/e/xxx/embed?start=false&loop=false&delayms=3000";
      const width = testWidth;
      const height = testHeight;
      const displayId = "preview";

      let settings = new Settings(url, null, width, height, displayId);

      slides = new Slides(shadowRoot, settings);
      expect(slides.url.href).toContain("/embed");
      expect(slides.url.href).not.toContain("/sub");
    });
  });
});