import type { CSSProperties, FunctionalComponent } from 'vue'

type FooterRendererProps = {
  class?: JSX.IntrinsicAttributes['class']
  style: CSSProperties
  total?: number
  updateTime?: string
}

const FooterDefault: FunctionalComponent<FooterRendererProps> = (props) => {
  return (
    <div class={['footer-default', props.class]} style={props.style}>
      <div class="count">{props.total} items</div>
      {props.updateTime && (
        <div class="time">Last Updated {props.updateTime ?? ''}</div>
      )}
    </div>
  )
}

FooterDefault.displayName = 'ElTableV2FooterDefault'

export default FooterDefault
