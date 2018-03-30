export default class Settings {
  constructor(settings) {
    this.url = settings.url;
    this.id = settings.componentId;
    this.width = settings.width;
    this.height = settings.height;
    this.isPreview = settings.displayId === 'preview';
    this.loop = !this.isPreview;
  }
}
