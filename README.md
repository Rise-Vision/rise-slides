# rise-slides [![CircleCI](https://circleci.com/gh/Rise-Vision/rise-slides.svg?style=svg)](https://circleci.com/gh/Rise-Vision/rise-slides) [![Coverage Status](https://coveralls.io/repos/github/Rise-Vision/rise-slides/badge.svg?branch=master)](https://coveralls.io/github/Rise-Vision/rise-slides?branch=master)

`rise-slides` is a Polymer 3 Web Component that renders a Google Slides presentation

## Usage For Designers

The below illustrates simple usage of the component.
A complete setup of the component can be found [here](https://github.com/Rise-Vision/html-template-library/tree/master/example-slides-component).

### Integration in a Template
#### HTML
Add a reference to the component in the `<head>` section of **template.html**.
```
<script src="https://widgets.risevision.com/beta/components/rise-slides/1/rise-slides.js"></script>
```

Add an instance of the component to `<body>` section of **template.html**.
```
  <rise-slides
    id="presentation"
    src="https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed" duration="3000">
  </rise-slides>
```
#### JS
To test the template in a browser outside Player/Apps, add the following lines (replacing with the appropriate element id to **main.js**. Note: Comment before committing.

```
function configureComponents {
const slides = document.getElementById( "slides" );

//Uncomment when testing in browser
RisePlayerConfiguration.Helpers.sendStartEvent( slides );
}

window.addEventListener( "rise-components-ready", configureComponents );
```
#### JSON
For npm to install dependencies neccesssary add refrences to component repo in **package.json**.
```
 "dependencies": {
    "@polymer/polymer": "3.1.0",
    "@webcomponents/webcomponentsjs": "^2.1.1"
  },
```

#### Build and Test Locally in Browswer 
Execute the following commands in Terminal and preview template.html in browser using a simple server.  example: http://localhost:8081/build/prod/src/template.html:

```
npm install
npm install -g polymer-cli@1.9.7
npm run build
python -m SimpleHTTPServer 8081
```
For more specifics please see: HTML Template - Build and Test Locally in Browser Documentation. 
https://docs.google.com/document/d/1_xgKe790ZuweDVg-Abj3032an6we7YLH_lQPpe-M88M/edit#bookmark=id.21c68d5f8a7c

### Labels

The component may define a 'label' attribute that defines the text that will appear for this instance in the template editor.

This attribute holds a literal value, for example:

```
  <rise-slides
    id="slides"
    label="Slides"
    src="https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed" duration="3000">
  </rise-slides>
```

If it's not set, the label for the component defaults to "Slides", which is applied via the [generate_blueprint.js](https://github.com/Rise-Vision/html-template-library/blob/master/generate_blueprint.js) file for a HTML Template build/deployment.

### Attributes

This component receives the following list of attributes:

- **id**: ( string / required ): Unique HTMLElement id.
- **src**: ( string / required ): Google Slides source. Published URL of my Google Slides or Embed link provided by Google Slides
- **duration** (number / optional): Duration of a slide in seconds. Default is 10 seconds.
- **label**: ( string / optional ): An optional label key for the text that will appear in the template editor. See 'Labels' section above.
- **non-editable**: ( empty / optional ): If present, it indicates this component is not available for customization in the template editor.

### Events

The component sends the following events:
- **_configured_**: The component has initialized what it requires to and is ready to handle a _start_ event.


## Development
### Built With
- [Polymer 3](https://www.polymer-project.org/)
- [Polymer CLI](https://github.com/Polymer/tools/tree/master/packages/cli)
- [WebComponents Polyfill](https://www.webcomponents.org/polyfills/)
- [npm](https://www.npmjs.org)

### Local Development Build
Clone this repo and change into this project directory.

Execute the following commands in Terminal:

```
npm install
npm install -g polymer-cli@1.9.7
npm run build
```

**Note**: If EPERM errors occur then install polymer-cli using the `--unsafe-perm` flag ( `npm install -g polymer-cli --unsafe-perm` ) and/or using sudo.

### Testing
You can run the suite of tests either by command terminal or interactive via Chrome browser.

#### Command Terminal
Execute the following command in Terminal to run tests:

```
npm run test
```

In case `polymer-cli` was installed globally, the `wct-istanbul` package will also need to be installed globally:

```
npm install -g wct-istanbul
```

#### Local Server
Run the following command in Terminal: `polymer serve`.

Now in your browser, navigate to:

```
http://127.0.0.1:8081/components/rise-slides/demo/src/rise-slides-dev.html
```

### Demo project

A demo project showing how to implement a simple slides component can be found in the `demo` folder.

Another option is using `example-slides-component` as the scaffolding for a new template. This project can be found in https://github.com/Rise-Vision/html-template-library

### Integration in a Template

After creating the Template's structure in `html-template-library`, add a reference to the component in the `<head>` section of `template.html`:

```
<script src="https://widgets.risevision.com/stable/components/rise-slides/1/rise-slides.js"></script>
```

Add an instance of the component, as shown in the example:

```
  <rise-slides
      id="rise-slides-01" label="Slides" duration="3"
      src="https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/embed">
  </rise-slides>
```

To test the template in a browser outside Player/Apps, add the following lines (replacing with the appropriate element id):

```
const riseSlides01 = document.querySelector('#rise-slides-01');

RisePlayerConfiguration.Helpers.sendStartEvent( riseSlides01 );
```

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues, please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas, please post your thoughts to our [community](https://help.risevision.com/hc/en-us/community/topics), otherwise submit a pull request and we will do our best to incorporate it. Please be sure to submit corresponding E2E and unit tests where appropriate.

### Languages
If you would like to translate the user interface for this product to another language, please refer to the [common-i18n](https://github.com/Rise-Vision/common-i18n) repository.

## Resources
If you have any questions or problems, please don't hesitate to join our lively and responsive community at https://help.risevision.com/hc/en-us/community/topics.
