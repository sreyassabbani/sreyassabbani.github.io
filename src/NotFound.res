module Link = Next.Link

let default = () =>
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">
        {React.string("404")}
      </h1>
      <h2 className="text-2xl font-semibold text-secondary-foreground mb-6">
        {React.string("Page Not Found")}
      </h2>
      <p className="text-foreground mb-8 max-w-md mx-auto">
        {React.string("Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.")}
      </p>
      <div className="space-x-4">
        <Link 
          href="/" 
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors font-semibold">
          {React.string("Go Home")}
        </Link>
        <Link 
          href="/blog" 
          className="inline-block border border-accent text-foreground px-6 py-3 rounded-lg hover:bg-secondary/50 transition-colors font-semibold">
          {React.string("Browse Blog")}
        </Link>
      </div>
    </div>
  </div>
