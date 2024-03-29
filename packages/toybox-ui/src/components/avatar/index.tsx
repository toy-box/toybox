import React, { useMemo } from 'react'
import { Avatar as AntAvatar, Tooltip } from 'antd'
import classNames from 'classnames'
import AvatarGroup from './components/AvatarGroup'
import './styles'

export interface AvatarProps {
  name: string
  className?: string
  style?: any
  colorSets?: string[]
  img?: string
  onClick?: (...args: any) => void
}

export type AvatarSize = 'xs' | 'small' | 'medium' | 'large' | 'xl'

export interface ImageAvatarProps {
  name: string
  img?: string
  className?: string
  style?: any
  size?: AvatarSize
  colorSets?: string[]
  tooltip?: boolean
}

const DEFAULT_COLOR_SETS = [
  '#BC61CF',
  '#F26666',
  '#F29A52',
  '#F4C329',
  '#CBD057',
  '#289ED3',
  '#29B3F0',
]
const DEFAULT_SIZE = 'medium'

function AvatarWithName({
  name,
  className,
  style,
  img,
  colorSets = DEFAULT_COLOR_SETS,
}: AvatarProps) {
  return (
    <div
      className={classNames('tbox-avatar-withname', className)}
      style={style}
    >
      <AvatarPro name={name} img={img} size="xs" colorSets={colorSets} />
      <span className="tbox-avatar-name">{name}</span>
    </div>
  )
}

function AvatarPro({
  name,
  img,
  className,
  style,
  size = DEFAULT_SIZE,
  colorSets = DEFAULT_COLOR_SETS,
  tooltip,
}: ImageAvatarProps) {
  const background = useMemo(() => {
    return colorSets[Math.floor(Math.random() * 100) % colorSets.length]
  }, [colorSets])

  const showSize = useMemo(() => {
    switch (size) {
      case 'xs':
        return 24
      case 'small':
        return 28
      case 'medium':
        return 36
      case 'large':
        return 48
      case 'xl':
        return 64
      default:
        return 36
    }
  }, [size])

  const showName = useMemo(() => {
    const cnReg = new RegExp('[\u4E00-\u9FA5]+')
    // 汉字则返回后2位字符
    if (cnReg.test(name)) {
      if (name.length < 2) {
        return name
      }
      return name.substr(name.length - 2, 2)
    }
    const spacePos = name.indexOf('_')
    if (spacePos > 0) {
      return name[0] + name[spacePos]
    }
    return name.substr(0, 2)
  }, [name])

  return tooltip ? (
    <Tooltip title={name}>
      <AntAvatar
        className="tbox-avatar"
        size={showSize}
        src={img}
        style={{ background, ...style }}
      >
        {showName}
      </AntAvatar>
    </Tooltip>
  ) : (
    <AntAvatar
      className="tbox-avatar"
      size={showSize}
      src={img}
      style={{ background, ...style }}
    >
      {showName}
    </AntAvatar>
  )
}

AvatarPro.AvatarWithName = AvatarWithName
AvatarPro.AvatarGroup = AvatarGroup

export const Avatar = AvatarPro
