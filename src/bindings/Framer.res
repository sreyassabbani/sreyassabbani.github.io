module Motion = {
  type animate = {opacity: float, y: float}
  type initial = {opacity: float, y: float}
  type exit = {opacity: float, y: float}
  type transition = {duration: float}
  @module("framer-motion") @scope("motion") @react.component
  external div: (~children: React.element,
    ~key: string=?,
    ~initial: initial=?,
    ~animate: animate=?,
    ~exit: exit=?,
    ~transition: transition=?,
    ~layout: bool=?,
    ~className: string=?) => React.element = "div"
}

module AnimatePresence = {
  @react.component @module("framer-motion")
  external make: (~children: React.element, ~mode: string=?) => React.element = "AnimatePresence"
}
