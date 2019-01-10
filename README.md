[![Build Status](https://travis-ci.org/mralexandernickel/ngx-picture.svg?branch=master)](https://travis-ci.org/mralexandernickel/ngx-picture)
[![Coverage Status](https://coveralls.io/repos/github/mralexandernickel/ngx-picture/badge.svg?branch=master)](https://coveralls.io/github/mralexandernickel/ngx-picture?branch=master)
[![npm version](https://badge.fury.io/js/%40mralexandernickel%2Fngx-picture.svg)](https://www.npmjs.com/@mralexandernickel/ngx-picture)

# Ngx Picture

## What is this?

Since in almost every project I am working on, there are the same
requirements/wishes for showing Images, I decided to develop exactly that and
pack as a angular-component.

These requirements are:

### Lazyloading

Load the images only if they are needed. In fact nothing new here, but almost
any solution I came across is using one IntersectionObserver per Image.
I want to use One IntersectionObserver for ALL Images

### Preloading

The Images should be preloaded before injecting them into the DOM.

### Decoding

In Browsers that support `new Image().decode()` it should be used, as this is
massively reducing the load on the main-thread.

### Src-Sets

I want to be able to switch Images depending on the current screensize.
Of coursethe first thought is to use the shiny `<picture>` element, but because
its not possible to get notified about changes of `currentSrc` BEFORE the image
is injected into the DOM (and therefore it's not possible to preload or decode)
this dies not meet the requirements.
Because my layouts are responsive anyways, and in every project I make use of
FlexLayoutModule, the points to switch Images should match the breakpoints
in FlexLayoutMoule.

### ChangeDetectionStrategy

For performance reasons I want to use `ChangeDetectionStrategy.OnPush`

## How to install?

You can install with yarn, npm or ng

```bash
yarn add @mralexandernickel/ngx-picture
```

```bash
npm install @mralexandernickel/ngx-picture
```

```bash
ng add @mralexandernickel/ngx-picture
```

## How to use?

```html
<lib-ngx-picture
  [images]="item"
  [fallbackImage]="fallbackImage"
></lib-ngx-picture>
```

The Images property/input has to be of type `INgxPictureSet | string`.

(..to be continued...)

## Demo

Here you can find a simple [Demo Application](https://mralexandernickel.github.io/ngx-picture/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
