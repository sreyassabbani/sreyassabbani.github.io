module Link = Next.Link

let default = () =>
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">
        {React.string("404")}
      </h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">
        {React.string("Page Not Found")}
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        {React.string("Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.")}
      </p>
      <div className="space-x-4">
        <Link 
          href="/" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          {React.string("Go Home")}
        </Link>
        <Link 
          href="/blog" 
          className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
          {React.string("Browse Blog")}
        </Link>
      </div>
    </div>
  </div>
