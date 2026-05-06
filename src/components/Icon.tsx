import type { SVGProps } from 'react'

import LogoIcon from '../assets/icons/logo.svg?react'
import UserIcon from '../assets/icons/user.svg?react'
import LockIcon from '../assets/icons/lock.svg?react'
import XIcon from '../assets/icons/x.svg?react'
import EyeIcon from '../assets/icons/eye.svg?react'
import EyeOffIcon from '../assets/icons/eye-off.svg?react'
import SearchIcon from '../assets/icons/search.svg?react'
import RefreshIcon from '../assets/icons/refresh.svg?react'
import PlusCircleIcon from '../assets/icons/plus-circle.svg?react'
import PlusIcon from '../assets/icons/plus.svg?react'
import MoreHorizontalIcon from '../assets/icons/more-horizontal.svg?react'
import ChevronLeftIcon from '../assets/icons/chevron-left.svg?react'
import ChevronRightIcon from '../assets/icons/chevron-right.svg?react'
import ChevronUpIcon from '../assets/icons/chevron-up.svg?react'
import ChevronDownIcon from '../assets/icons/chevron-down.svg?react'

const iconMap = {
  logo: LogoIcon,
  user: UserIcon,
  lock: LockIcon,
  x: XIcon,
  eye: EyeIcon,
  'eye-off': EyeOffIcon,
  search: SearchIcon,
  refresh: RefreshIcon,
  'plus-circle': PlusCircleIcon,
  plus: PlusIcon,
  'more-horizontal': MoreHorizontalIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-down': ChevronDownIcon,
} as const

export type IconName = keyof typeof iconMap

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export default function Icon({ name, size = 24, width, height, ...rest }: IconProps) {
  const SvgIcon = iconMap[name]
  return <SvgIcon width={width ?? size} height={height ?? size} {...rest} />
}
