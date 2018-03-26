const chai = require('chai');
global.expect = chai.expect;
chai.Should();
const commonConfig = require('common-display-module');
const simple = require("simple-mock");
const mock = simple.mock;
const ipc = require("node-ipc");
let localMessagingModule = require('local-messaging-module');
let testTweets = null;

describe('Slides Component - Integration', () => {
  before(()=>{
    return localMessagingModule.start(ipc, "ls-test-did", "ls-test-mid");
  });

  beforeEach(()=>{
    // TODO: licensing is not implemented yet
    // const sendLicensing = () => {
    //   commonConfig.broadcastMessage({
    //     from: 'slides-module',
    //     topic: 'licensing-update',
    //     through: 'ws',
    //     data: {
    //       'is_authorized': true,
    //       'user_friendly_status': 'authorized'
    //     }
    //   });
    // }

    mock(console, "log");
    mock(commonConfig, "getDisplaySettingsSync").returnWith({
      displayid: "ls-test-id", displayId: "ls-test-id"
    });
  });

  after(() => {
    localMessagingModule.stop();
    simple.restore();
  });

  afterEach(() => {
    commonConfig.disconnect();
  });

  it('should load component', () => {
    browser.url('/');

    const strSurrogateFrameSelector = 'rise-slides .slides-component-template .webpage-frame';
    browser.frame();  
    browser.waitForExist(strSurrogateFrameSelector, 15000);
    browser.frame($(strSurrogateFrameSelector).value, function(err, result) {
      if (err) console.log(err);
      expect(err).to.be.a('null');
    });
  });
});
