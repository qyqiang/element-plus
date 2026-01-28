import {
  Transition,
  createApp,
  createVNode,
  defineComponent,
  h,
  reactive,
  ref,
  toRefs,
  vShow,
  withCtx,
  withDirectives,
} from 'vue'
import { removeClass } from '@element-plus/utils'
import { useGlobalComponentSettings } from '@element-plus/components/config-provider'

import type { AppContext, VNode } from 'vue'
import type { UseNamespaceReturn } from '@element-plus/hooks'
import type { LoadingOptionsResolved } from './types'

export function createLoadingComponent(
  options: LoadingOptionsResolved,
  appContext: AppContext | null
) {
  let afterLeaveTimer: ReturnType<typeof setTimeout>
  // IMPORTANT NOTE: this is only a hacking way to expose the injections on an
  // instance, DO NOT FOLLOW this pattern in your own code.
  const afterLeaveFlag = ref(false)
  const data = reactive({
    ...options,
    originalPosition: '',
    originalOverflow: '',
    visible: false,
  })

  function setText(text: string | VNode | VNode[]) {
    data.text = text
  }

  function destroySelf() {
    const target = data.parent
    const ns = (vm as any).ns as UseNamespaceReturn
    if (!target.vLoadingAddClassList) {
      let loadingNumber: number | string | null =
        target.getAttribute('loading-number')
      loadingNumber = Number.parseInt(loadingNumber as any) - 1
      if (!loadingNumber) {
        removeClass(target, ns.bm('parent', 'relative'))
        target.removeAttribute('loading-number')
      } else {
        target.setAttribute('loading-number', loadingNumber.toString())
      }
      removeClass(target, ns.bm('parent', 'hidden'))
    }
    removeElLoadingChild()
    loadingInstance.unmount()
  }
  function removeElLoadingChild(): void {
    vm.$el?.parentNode?.removeChild(vm.$el)
  }
  function close() {
    if (options.beforeClose && !options.beforeClose()) return

    afterLeaveFlag.value = true
    clearTimeout(afterLeaveTimer)

    afterLeaveTimer = setTimeout(handleAfterLeave, 400)
    data.visible = false

    options.closed?.()
  }

  function handleAfterLeave() {
    if (!afterLeaveFlag.value) return
    const target = data.parent
    afterLeaveFlag.value = false
    target.vLoadingAddClassList = undefined
    destroySelf()
  }

  const elLoadingComponent = defineComponent({
    name: 'ElLoading',
    setup(_, { expose }) {
      const { ns, zIndex } = useGlobalComponentSettings('loading')

      expose({
        ns,
        zIndex,
      })

      return () => {
        const svg =
          data.svg ||
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\n' +
            '  <path d="M12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12L2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2L12 5Z" fill="#7A909E" fill-opacity="0.38"/>\n' +
            '</svg>'
        const spinner = h(
          'svg',
          {
            class: 'circular',
            viewBox: data.svgViewBox ? data.svgViewBox : '0 0 24 24',
            ...(svg ? { innerHTML: svg } : {}),
          },
          [
            h('circle', {
              class: 'path',
              cx: '25',
              cy: '25',
              r: '20',
              fill: 'none',
            }),
          ]
        )

        const spinnerText = data.text
          ? h('p', { class: ns.b('text') }, [data.text])
          : undefined

        return h(
          Transition,
          {
            name: ns.b('fade'),
            onAfterLeave: handleAfterLeave,
          },
          {
            default: withCtx(() => [
              withDirectives(
                createVNode(
                  'div',
                  {
                    style: {
                      backgroundColor: data.background || '',
                    },
                    class: [
                      ns.b('mask'),
                      data.customClass,
                      ns.is('fullscreen', data.fullscreen),
                    ],
                  },
                  [
                    h(
                      'div',
                      {
                        class: ns.b('spinner'),
                      },
                      [spinner, spinnerText]
                    ),
                  ]
                ),
                [[vShow, data.visible]]
              ),
            ]),
          }
        )
      }
    },
  })

  const loadingInstance = createApp(elLoadingComponent)
  Object.assign(loadingInstance._context, appContext ?? {})
  const vm = loadingInstance.mount(document.createElement('div'))

  return {
    ...toRefs(data),
    setText,
    removeElLoadingChild,
    close,
    handleAfterLeave,
    vm,
    get $el(): HTMLElement {
      return vm.$el
    },
  }
}

export type LoadingInstance = ReturnType<typeof createLoadingComponent>
