import { ComponentProps, useState } from "react"

import { AnimatedButton } from "../AnimatedButton"

type Props = ComponentProps<typeof AnimatedButton> & {
  defaultValue: boolean
  onChange: (val: boolean) => void
}

export default function ToggleButton({
  defaultValue,
  onChange,
  ...props
}: Props) {
  const [isActive, setIsActive] = useState(defaultValue)

  return (
    <AnimatedButton
      {...props}
      onPress={() => {
        onChange(!isActive)
        setIsActive(!isActive)
      }}
    />
  )
}
