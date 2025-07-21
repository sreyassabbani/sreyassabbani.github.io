open Lucide

@react.component
let make = () => {
  <>
    <SEO title="Loading..." />
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader.loader className="animate-spin h-16 w-16 text-primary" />
    </div>
  </>
}
