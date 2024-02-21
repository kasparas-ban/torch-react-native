import React from "react"
import { View } from "react-native"
import Svg, { Path, SvgXml } from "react-native-svg"

type SvgProps = {
  stroke?: string
  strokeWidth?: string
}

const svg = `<svg viewBox="0 0 24 24" fill="none">
<path
  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
  stroke="black"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
<path
  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
  stroke="black"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
</svg>`

const SvgComponent = (props: SvgProps) => (
  <View style={{ width: 24, height: 24 }}>
    {/* <Svg viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        stroke={props.stroke || "black"}
        stroke-width={props.strokeWidth || "2"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
        stroke={props.stroke || "black"}
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg> */}
    <SvgXml xml={svg} strokeWidth={2} />
  </View>
)

export default SvgComponent
