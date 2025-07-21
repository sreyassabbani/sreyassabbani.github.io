module Tags = {
  @module("lucide-react") @react.component
  external tags: (~color: string=?, ~size: int=?, ~className: string=?) => React.element = "Tags"
}

module Loader = {
  @module("lucide-react") @react.component
  external loader: (~color: string=?, ~size: int=?, ~className: string=?) => React.element =
    "Loader"
}
