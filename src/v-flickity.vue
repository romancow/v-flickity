<script lang="ts">
import { PropOptions, CreateElement, VNodeChildren } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Flickity, { FlickityEvents } from 'flickity'

function FlickityOptionProp<K extends keyof VFlickity>(propOptions?: PropOptions<VFlickity[K]>): (target: VFlickity, propKey: K) => void
function FlickityOptionProp<K extends keyof VFlickity>(optionName: string, propOptions?: PropOptions<VFlickity[K]>): (target: VFlickity, propKey: K) => void
function FlickityOptionProp<K extends keyof VFlickity>(optionName?: string | PropOptions<VFlickity[K]>, propOptions?: PropOptions<VFlickity[K]>) {
	const [name, options] = (typeof optionName === 'string') ? [optionName, propOptions] : [undefined, optionName]
	const propDecorator = Prop(options)
	return function(target: VFlickity, propKey: K) {
		const constructor = target.constructor as typeof VFlickity
		constructor.optionProperties[propKey] = name || propKey
		propDecorator(target, propKey)
	}
}

type EventBindings = Record<string, (...args: any[]) => VFlickity>

@Component
export default class VFlickity extends Vue {

	static readonly optionProperties: { [prop in keyof VFlickity]?: string } = {}
	static readonly events: FlickityEvents[] = []

	@FlickityOptionProp({ default: null, type: Boolean })
	draggable!: boolean | null

	@FlickityOptionProp({ default: null, type: Boolean })
	freeScroll!: boolean | null

	@FlickityOptionProp({ default: null, type: Boolean })
	wrapAround!: boolean | null

	@FlickityOptionProp({ default: null, type: [Boolean, Number, String] })
	groupCells!: boolean | number | string | null

	@FlickityOptionProp({ default: null, type: [Boolean, Number] })
	autoPlay!: boolean | number | null

	@FlickityOptionProp('!pauseAutoPlayOnHover', { default: null, type: Boolean })
	noPauseAutoPlayOnHover!: boolean | null

	// requires the flickity-fullscreen package (https://github.com/metafizzy/flickity-fullscreen)
	@FlickityOptionProp({ default: null, type: Boolean })
	fullscreen!: boolean | null

	// requires the flickity-fade package (https://github.com/metafizzy/flickity-fade)
	@FlickityOptionProp({ default: null , type: Boolean})
	fade!: boolean | null

	@FlickityOptionProp({ default: null, type: Boolean })
	adaptiveHeight!: boolean | null

	@FlickityOptionProp({ default: null, type: Boolean })
	watchCss!: boolean | null

	// requires the flickity-as-nav-for package (https://github.com/metafizzy/flickity-as-nav-for)
	@FlickityOptionProp({ default: null, type: [String, Element] })
	asNavFor!: string | Element | null

	// requires the flickity-hash package (https://github.com/metafizzy/flickity-hash)
	@FlickityOptionProp({ default: null, type: Boolean })
	hash!: boolean | null

	@FlickityOptionProp({ default: null, type: Number })
	dragThreshold!: number | null

	@FlickityOptionProp({ default: null, type: Number })
	selectedAttraction!: number | null

	@FlickityOptionProp({ default: null, type: Number })
	friction!: number | null

	@FlickityOptionProp({ default: null, type: Number })
	freeScrollFriction!: number | null

	// requires the flickity-imagesloaded package (https://github.com/metafizzy/flickity-imagesloaded)
	@FlickityOptionProp({ default: null, type: Boolean })
	imagesLoaded!: boolean | null

	@FlickityOptionProp({ default: null, type: [Boolean, Number] })
	lazyLoad!: boolean | number | null

	// requires the flickity-bg-lazyload package (https://github.com/metafizzy/flickity-bg-lazyload)
	@FlickityOptionProp({ default: null, type: [Boolean, Number] })
	bgLazyLoad!: boolean | number | null

	@FlickityOptionProp({ default: null, type: String })
	cellSelector!: string | null

	@FlickityOptionProp({ default: null, type: [Number, String] })
	initialIndex!: number | string | null

	@FlickityOptionProp('!accessibility', { default: null, type: Boolean })
	noAccessibility!: boolean | null

	@FlickityOptionProp('!setGallerySize', { default: null, type: Boolean })
	noSetGallerySize!: boolean | null

	@FlickityOptionProp('!resize', { default: null, type: Boolean })
	noResize!: boolean | null

	@FlickityOptionProp({ default: null, type: String })
	cellAlign!: 'left' | 'center' | 'right' | null

	@FlickityOptionProp({ default: null, type: Boolean })
	contain!: boolean | null

	@FlickityOptionProp({ default: null, type: Boolean })
	percentPosition!: boolean | null

	@FlickityOptionProp({ default: null, type: Boolean })
	rightToLeft!: boolean | null

	// @FlickityOptionProp('!prevNextButtons', { default: null, type: Boolean })
	// noPrevNextButtons!: boolean | null

	@FlickityOptionProp({ default: null, type: Boolean })
	prevNextButtons!: boolean | null

	// @FlickityOptionProp('!pageDots', { default: null, type: Boolean })
	// noPageDots!: boolean | null

	@FlickityOptionProp({ default: null, type: Boolean })
	pageDots!: boolean | null

	@FlickityOptionProp({ default: null, type: [String, Object] })
	arrowShape!: string | Object | null

	@Prop({ default: false, type: Boolean })
	noReloadCellsOnRender! : boolean

	protected $flickity!: Flickity | null

	get eventBindings() {
		const { $listeners } = this
		return Object.keys($listeners)
			.map(event => [event, (...args: any[]) => this.$emit(event, ...args)] as const)
			.reduce((bindings, [name, fn]) => (bindings[name] = fn, bindings), {} as EventBindings)
	}
	
	get options() {
		const { optionProperties } = VFlickity
		const { eventBindings: on } = this
		const options: { [prop: string]: any } = { on }
		Object.keys(optionProperties).forEach(prop => {
			const value = this[prop]
			if (value != null) {
				const option = optionProperties[prop] ?? ""
				const negate = option.startsWith('!')
				const optionKey = negate ? option.substring(1) : option
				options[optionKey] = negate ? !value : value
			}
		})
		return options
	}

	resize() {
		this.$flickity?.resize()
	}

	reposition() {
		this.$flickity?.reposition()
	}

	render(h: CreateElement) {
		const { $scopedSlots, $slots, $flickity, $nextTick, noReloadCellsOnRender} = this
		const cells = ($scopedSlots.default?.(this) ?? $slots.default ?? h()) as VNodeChildren
		if (($flickity != null) && !noReloadCellsOnRender) $nextTick(() => {
			$flickity.reloadCells()
			;($flickity as any).positionSlider()
		})
		return h('div', cells)
	}

	async mounted() {
		await this.$nextTick()
		this.resetFlickity()
	}

	beforeDestroy() {
		this.$flickity!.destroy()
		this.$flickity = null
	}

	protected resetFlickity() {
		const { $flickity, $el, options } = this
		if ($flickity != null) $flickity.destroy()
		this.$flickity = new Flickity($el, options)
	}
}
</script>

<style lang="sass" scoped>
	@import '~flickity/dist/flickity.css'
</style>