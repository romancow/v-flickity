import 'flickity/dist/flickity.css'
import Vue, { VueConstructor, CreateElement, VNodeChildren } from 'vue'
import Flickity, { EventBindings } from 'flickity'
import * as flickity from './settings'

type VFlickity = Vue & {
	instance: null | (Flickity & { positionSlider?(): void })
	readonly eventBindings: EventBindings
	readonly options: { [prop: string]: any }
	readonly noReloadCellsOnRender: boolean
	reset(): void
}

export default (Vue as VueConstructor<VFlickity>).extend({
	data() {
		return { instance: null }
	},

	props: {
		...flickity.options.props,
		...flickity.negateOptions.toProps(),

		noReloadCellsOnRender: { default: false, type: Boolean }
	},

	computed: {

		eventBindings() {
			const { $listeners, $emit } = this
			return flickity.events.filter(Object.keys($listeners))
				.reduce((bindings, event) => {
					bindings[event] = (...args: any[]) => $emit(event, ...args)
					return bindings
				}, {} as EventBindings)
		},

		options() {
			const { eventBindings: on } = this
			const options: { [prop: string]: any } = { on }
			flickity.options.keys().forEach(prop => {
				const value = this[prop]
				if (value != null)
					options[prop] = value
			})
			flickity.negateOptions.forEach((prop, negated) => {
				const value = this[negated]
				if (value != null)
					options[prop] = !value
			})
			return options
		}
	},

	methods: {
		...flickity.methods.map(),

		resizeCarousel() {
			this.instance?.resize()
		},

		reset() {
			const { instance, $el, options } = this
			instance?.destroy()
			this.instance = new Flickity($el, options)
		}
	},

	render(this: VFlickity, h: CreateElement) {
		const { $scopedSlots, $slots, instance, $nextTick, noReloadCellsOnRender} = this
		const cells = ($scopedSlots.default?.(this) ?? $slots.default ?? h()) as VNodeChildren
		if ((instance != null) && !noReloadCellsOnRender) $nextTick(() => {
			instance.reloadCells()
			instance.positionSlider?.()
		})
		return h('div', cells)
	},

	mounted(this: VFlickity) {
		this.$nextTick(() => { this.reset() })
	},

	beforeDestroy(this: VFlickity) {
		this.instance?.destroy()
		this.instance = null
	}
})
