/// <reference lib="dom" />
import {
	dehydrated_post_meta_a1_,
	type dehydrated_post_meta_T,
	post_path__new,
} from '@rappstack/domain--any--blog/post'
import { blog_card__li_ } from '@rappstack/ui--any--blog/card'
import { class_ } from 'ctx-core/html'
import Fuse, { type FuseResult } from 'fuse.js'
import { memo_, type relement_env_T, sig_, type wide_ctx_T } from 'relementjs'
import { div_, input_, label_, span_, ul_ } from 'relementjs/html'
import { item_list_ } from 'relementjs/isomorphic'
import { path_, svg_ } from 'relementjs/svg'
type blog_search__div_props_T = { ctx:wide_ctx_T }
export function blog_search__div_<env_T extends relement_env_T>($p:blog_search__div_props_T) {
	const { ctx } = $p
	const search__input$ = sig_<HTMLInputElement|undefined>(undefined)
	const input__value$ = sig_('')
	const highlight__idx$ = sig_(0)
	const fuse$ = sig_(
		new Fuse(dehydrated_post_meta_a1_(ctx), {
			keys: ['title', 'description'],
			includeMatches: true,
			minMatchCharLength: 2,
			threshold: 0.5,
		}))
	const search_result_a$ = memo_<
		FuseResult<dehydrated_post_meta_T>[]
	>(()=>[], [
		search_result_a$=>
			memo_(()=>{
				// Add search result only if
				// input value is more than one character
				const search_result_a =
					input__value$().length > 1
						? fuse$().search(input__value$())
						: []
				search_result_a$.set(search_result_a)
				// Update search string in URL
				if (input__value$().length > 0) {
					const searchParams = new URLSearchParams(window.location.search)
					searchParams.set('q', input__value$())
					const newRelativePathQuery =
						window.location.pathname + '?' + searchParams.toString()
					history.replaceState(history.state, '', newRelativePathQuery)
				} else {
					history.replaceState(history.state, '', window.location.pathname)
				}
			})
	])
	const search_result_a__length$ = memo_(()=>
		search_result_a$().length)
	input__init()
	return (
		div_<env_T>({
			class: 'blog_search__div'
		}, [
			search__input_label_(),
			search_results_found__div$_(),
			search_results__ul_({ ctx })
		]))
	function input__init() {
		// if URL has search query,
		// insert that search query in input field
		const search_url = new URLSearchParams(window.location.search)
		const search_str = search_url.get('q')
		if (search_str) input__value$.set(search_str)
		// put focus cursor at the end of the string
		setTimeout(()=>{
			search__input$()!.selectionStart = search__input$()!.selectionEnd =
				search_str?.length || 0
		}, 50)
	}
	function search__input_label_() {
		return (
			label_({
				class: class_(
					'search__input_label',
					'relative',
					'block')
			}, [
				span_({
					class: class_(
						'absolute',
						'left-0',
						'flex',
						'inset-y-0',
						'h-full',
						'w-full',
						'pl-2',
						'items-center',
						'opacity-75')
				}, [
					svg_({
						xmlns: 'http://www.w3.org/2000/svg',
						'aria-hidden': true,
						class: class_('h-4', 'w-4', 'fill-skin-base')
					}, [
						path_({
							d: 'M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z'
						})
					])
				]),
				search__input_()
			])
		)
	}
	function search_results_found__div$_() {
		const show$ = memo_(()=>
			input__value$().length > 1)
		return memo_(()=>
			show$()
				? div_({
					class: 'mt-8'
				}, [
					`Found `,
					search_result_a__length$,
					` result`,
					()=>search_result_a__length$() === 1 ? '' : 's',
					` for `,
					input__value$
				])
				: null
		)
	}
	function search_results__ul_({ ctx }:{ ctx:wide_ctx_T }) {
		return item_list_(
			ul_(),
			()=>
				search_result_a$().map(search_result=>
					search_result.item),
			(dehydrated_post_meta, idx$)=>{
				return blog_card__li_({
					ctx,
					href: post_path__new(ctx, dehydrated_post_meta),
					class: ()=>
						class_(
							idx$() === highlight__idx$()
								? 'shadow-highlight'
								: ''),
					dehydrated_post_meta,
				})
			})
	}
	function search__input_() {
		const input =
			input_<'browser'>({
				class: class_(
					'block',
					'w-full',
					'py-3',
					'pl-10',
					'pr-3',
					'rounded',
					'border',
					'border-skin-fill',
					'focus:outline-none',
					'focus:border-skin-accent',
					'border-opacity-40',
					'bg-skin-fill',
					'placeholder:italic',
					'placeholder:text-opacity-75'),
				placeholder: 'Search through posts…',
				type: 'text',
				name: 'search',
				value: input__value$,
				onkeydown: input__onkeydown,
				oninput: input__oninput,
				autocomplete: 'off',
				autofocus: true,
			})
		search__input$.set(input)
		return input
	}
	function input__onkeydown(e:KeyboardEvent&{
		currentTarget:HTMLInputElement
	}) {
		switch (true) {
			case e.key === 'ArrowDown':
				e.preventDefault()
				highlight__idx$.set((highlight__idx$() + 1) % search_result_a$().length)
				break
			case e.key === 'ArrowUp':
				e.preventDefault()
				highlight__idx$.set((highlight__idx$() + search_result_a$().length - 1) % search_result_a$().length)
				break
			case e.key === 'Enter':
				e.preventDefault()
				window.location.href = post_path__new(ctx, search_result_a$()[highlight__idx$()].item)
				break
		}
	}
	function input__oninput(e:KeyboardEvent&{
		target:HTMLInputElement
	}) {
		input__value$.set(e.target.value)
	}
}
