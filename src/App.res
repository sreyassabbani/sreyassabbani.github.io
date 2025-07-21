type pageProps

module PageComponent = {
  type t = React.component<pageProps>
}

type props = {
  @as("Component")
  component: PageComponent.t,
  pageProps: pageProps,
  loading: bool,
}

let default = (props: props): React.element => {
  // destructure props
  let {component, pageProps, loading} = props

  let router = Next.Router.useRouter()
  let content = React.createElement(component, pageProps)

  if loading {
    <Spinner />
  } else {
    switch router["route"] {
    | "/404" => content
    | _ => <MainLayout> {content} </MainLayout>
    }
  }
}
