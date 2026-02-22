import { memo, type SVGProps } from 'react'

const ChevronDown = memo((props: SVGProps<SVGSVGElement>) => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <polyline points='6 9 12 15 18 9' />
  </svg>
))

ChevronDown.displayName = 'ChevronDown'

export default ChevronDown
