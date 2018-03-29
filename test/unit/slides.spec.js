import Slides from "../../src/slides";

let slides = null;
let testUrl = "http://test.com";
let testWidth = "800";
let testHeight = "600";
let shadowRootQuerySelector = null;

describe("Slides - Unit", () => {
  beforeEach(() => {
    const shadowRoot = {};
    shadowRootQuerySelector = {};
    shadowRootQuerySelector.appendChild = jest.genMockFn();
    shadowRootQuerySelector.removeChild = jest.genMockFn();
    shadowRoot.querySelector = jest.fn(function() {
      return shadowRootQuerySelector;
    })

    slides = new Slides(shadowRoot, testUrl, testWidth, testHeight);
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

    expect(frame.getAttribute("width")).toBe(testWidth + "px");
    expect(frame.getAttribute("height")).toBe(testHeight + "px");
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
  });
});