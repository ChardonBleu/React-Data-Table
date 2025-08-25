export interface MockFontAwesomeIconProps {
  iconName: string
}

export const FontAwesomeIcon = ({ iconName, ...props }: MockFontAwesomeIconProps) => {
  return (
    <span
      data-testid='font-awesome-icon'
      data-icon={iconName}
      {...props}
    />
  )
}
