export default class Settings {
  constructor(url, componentId, width, height, displayId) {
    this.url = url;
    this.id = componentId;
    this.width = width;
    this.height = height;
    this.isPreview = displayId === 'preview';
    this.loop = !this.isPreview;
  }
}
