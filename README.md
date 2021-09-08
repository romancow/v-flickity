# v-flickity
A Vue component wrapper around the [Flickity carousel](https://flickity.metafizzy.co/).

## Peer Dependenices
- [vue](https://www.npmjs.com/package/vue)

```
npm install vue
```

## Installation

Add a scope mapping for the GitHub npm package manager by adding a `.npmrc` file with the line:
```
@romancow:registry=https://npm.pkg.github.com/
```

Then install the package:
```
npm install @romancow/v-flickity
```
or
```
yarn add @romancow/v-flickity
```

More info on using the GitHub npm package registry [here](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry#installing-a-package).

## Usage

### Basic Example

```javascript
import VFlickity from '@romancow/v-flickity'

new Vue({
	components: { VFlickity },
	el: '#app',
	data: {
		cells: ["one", "two", "three", "four"]
	}
})
```

```html
<div id="app">
	<v-flickity wrap-around auto-play no-page-dots>
		<template>
			<div v-for="cell in cells">{{ cell }}</div>
		<template>
	</v-flickity>
</div>
```

### Options / Props

All [Flickity Options](https://flickity.metafizzy.co/options.html) correspond to [Vue component props](https://vuejs.org/v2/guide/components-props.html).

In addition, `boolean` Flickity options with a default value of `true` (i.e. `pauseAutoPlayOnHover`, `accessibility`, `setGallerySize`, `resize`, `prevNextButtons`, and `pageDots`) also have corresponding `no` props (`noPauseAutoPlayOnHover`, `noAccessibility`, `noSetGallerySize`, `noResize`, `noPrevNextButtons`, and `noPageDots`). This is because, since they are true by default, it's likely to only be specifying them to set them to false:

```html
<v-flickity no-set-gallery-size no-page-dots no-prev-next-buttons>
```

`<v-flickity :page-dots="false">` will still work as well, if you prefer that form.

### API / Methods

The [Flickity API methods](https://flickity.metafizzy.co/api.html) correspond to [Vue component methods](https://vuejs.org/v2/api/#methods). There are a couple of ways you can access them.

First, via a Vue ref:

```javascript
new Vue({
	components: { VFlickity },
	el: '#app',
	data: {
		cells: ["one", "two", "three", "four"]
	},
	methods: {
		randomize: function() {
			const index = Math.floor(Math.random() * this.cells.length)
			this.$refs.carousel.select(index)
		}
	}
})
```

```html
<div id="app">
	<v-flickity ref="carousel">
		<template>
			<div v-for="cell in cells">{{ cell }}</div>
		<template>
	</v-flickity>
	<button @click="randomize">Random</button>
</div>
```

Or via slot data:

```html
<div id="app">
	<v-flickity>
		<template v-slot="carousel">
			<div v-for="cell in cells" @click="carousel.stopPlayer()">{{ cell }}</div>
		<template>
	</v-flickity>
</div>
```

Some Flickity methods that provide direct DOM access (`prepend`, `append`, `insert`, `remove`, `destroy`, `getCellElements`) are not mapped as component methods to discourage direct DOM manipulation. But if you really want to use them, you still can by accessing them on the Flickity instance directly (`this.$refs.flickity.instance.getCellElements()`).

**NOTE**: The Flickity's `resize` method has been renamed as `resizeCarousel` on the VFlickity component so it does not clash with the `resize` option/property.

### Events

[Flickity events](https://flickity.metafizzy.co/events.html) are mapped as [Vue component events](https://vuejs.org/v2/guide/events.html).

```javascript
new Vue({
	components: { VFlickity },
	el: '#app',
	data: {
		cells: ["one", "two", "three", "four"]
	},
	methods: {
		cellSelected: function(index) {
			const cell = this.cells[index]
			console.log(cell, "- selected")
		}
	}
})
```

```html
<div id="app">
	<v-flickity @select='cellSelected'>
		<template>
			<div v-for="cell in cells">{{ cell }}</div>
		<template>
	</v-flickity>
</div>
```
