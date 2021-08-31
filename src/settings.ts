import type { PropOptions } from 'vue'
import type { Options, EventBindings } from 'flickity'

declare module 'flickity' {
	export interface Options {
		fullscreen?: boolean | undefined
		fade?: boolean | undefined
	}
}

export namespace options {
	export const props: { [opt in keyof Options]: PropOptions } = {
		draggable: { default: null, type: Boolean },
	
		freeScroll: { default: null, type: Boolean },
	
		wrapAround: { default: null, type: Boolean },
	
		groupCells: { default: null, type: [Boolean, Number, String] },
	
		autoPlay: { default: null, type: [Boolean, Number] },
	
		pauseAutoPlayOnHover: { default: null, type: Boolean },
	
		// requires the flickity-fullscreen package (https://github.com/metafizzy/flickity-fullscreen)
		fullscreen: { default: null, type: Boolean },
	
		// requires the flickity-fade package (https://github.com/metafizzy/flickity-fade)
		fade: { default: null , type: Boolean},
	
		adaptiveHeight: { default: null, type: Boolean },
	
		watchCSS: { default: null, type: Boolean },
	
		// requires the flickity-as-nav-for package (https://github.com/metafizzy/flickity-as-nav-for)
		asNavFor: { default: null, type: [String, Element] },
	
		// requires the flickity-hash package (https://github.com/metafizzy/flickity-hash)
		hash: { default: null, type: Boolean },
	
		dragThreshold: { default: null, type: Number },
	
		selectedAttraction: { default: null, type: Number },
	
		friction: { default: null, type: Number },
	
		freeScrollFriction: { default: null, type: Number },
	
		// requires the flickity-imagesloaded package (https://github.com/metafizzy/flickity-imagesloaded)
		imagesLoaded: { default: null, type: Boolean },
	
		lazyLoad: { default: null, type: [Boolean, Number] },
	
		// requires the flickity-bg-lazyload package (https://github.com/metafizzy/flickity-bg-lazyload)
		bgLazyLoad: { default: null, type: [Boolean, Number] },
	
		cellSelector: { default: null, type: String },
	
		initialIndex: { default: null, type: [Number, String] },
	
		accessibility: { default: null, type: Boolean },
	
		setGallerySize: { default: null, type: Boolean },
	
		resize: { default: null, type: Boolean },
	
		cellAlign: { default: null, type: String },
	
		contain: { default: null, type: Boolean },
	
		percentPosition: { default: null, type: Boolean },
	
		rightToLeft: { default: null, type: Boolean },
	
		prevNextButtons: { default: null, type: Boolean },
	
		pageDots: { default: null, type: Boolean },
	
		arrowShape: { default: null, type: [String, Object] },
	}

	export function keys() {
		return Object.keys(props) as (keyof Options)[] 
	}
}

export namespace negateOptions {
	export const keys: (keyof Options)[] = [
		"pauseAutoPlayOnHover",
		"accessibility",
		"setGallerySize",
		"resize",
		"prevNextButtons",
		"pageDots"
	]

	export function includes(key: keyof Options) {
		return keys.some(k => k === key)
	}

	export function toKey(key: keyof Options) {
		return  key && `no${ key[0].toUpperCase() }${ key.slice(1) }`
	}

	export function toProps() {
		return keys.reduce(
			(props, key) => (props[toKey(key)] = options.props[key]!, props),
			{} as { [key: string]: PropOptions }
		)
	}

	export function forEach(fn: (prop: keyof Options, negated: string) => void) {
		keys.forEach(key => fn(key, toKey(key)))
	}
}

export namespace methods {
	export const keys = [
		"select",
		"previous",
		"next",
		"selectCell",
		"resize",
		"reposition",
		// "prepend",
		// "append",
		// "insert",
		// "remove",
		"playPlayer",
		"stopPlayer",
		"pausePlayer",
		"unpausePlayer",
		"viewFullscreen",
		"exitFullscreen",
		"toggleFullscreen",
		// "destroy",
		// "getCellElements",
		"reloadCells"
	]

	export function map() {
		return keys.reduce(
			(methods, key) => {
				methods[key] = function(this: any, ...args) { return this.flickity?.[key](...args) }
				return methods
			},
			{} as { [key: string]: (...args: any[]) => any }
		)
	}
}

export namespace events {
	export const names: (keyof EventBindings)[] = [
		"ready",
		"change",
		"select",
		"cellSelect",
		"settle",
		"scroll",
		"dragStart",
		"dragMove",
		"dragEnd",
		"pointerDown",
		"pointerMove",
		"pointerUp",
		"staticClick",
		"lazyLoad",
		"bgLazyLoad",
		"fullscreenChange"
	]

	export function includes(event: string) {
		return names.some(name => name === event)
	}

	export function filter(events: string[]) {
		return events.filter(event => includes(event)) as (keyof EventBindings)[]
	}
}
