import { WebComponent } from 'web-component';

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
}
