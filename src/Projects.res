module ProjectCard = {
  @react.component
  let make = (~title, ~description, ~technologies, ~githubUrl=?, ~liveUrl=?, ~imageUrl=?) => {
    <div
      className="bg-card rounded-[var(--radius)] shadow p-6 border border-border transition-shadow hover:shadow-md">
      {switch imageUrl {
      | Some(url) =>
        <img src=url alt=title className="w-full h-48 object-cover rounded-[var(--radius)] mb-4" />
      | None => React.null
      }}
      <h3 className="text-xl font-bold mb-3 text-card-foreground font-sans">
        {React.string(title)}
      </h3>
      <p className="text-muted-foreground mb-4 leading-relaxed font-sans">
        {React.string(description)}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies
        ->Belt.Array.map(tech =>
          <span
            key=tech
            className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm font-medium font-mono">
            {React.string(tech)}
          </span>
        )
        ->React.array}
      </div>
      <div className="flex gap-3">
        {switch githubUrl {
        | Some(url) =>
          <a
            href=url
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-border text-foreground rounded-[var(--radius-sm)] hover:bg-secondary/20 transition-colors font-semibold text-sm">
            {React.string("View Source")}
          </a>
        | None => React.null
        }}
        {switch liveUrl {
        | Some(url) =>
          <a
            href=url
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-sm)] hover:bg-primary/80 transition-colors font-semibold text-sm">
            {React.string("Live Demo")}
          </a>
        | None => React.null
        }}
      </div>
    </div>
  }
}

let default = () => {
  // Sample projects - you can replace these with your actual projects
  let projects = [
    {
      "title": "Personal Website",
      "description": "A modern personal website built with Next.js and ReScript, featuring a blog system and responsive design. Showcases my projects and technical writing.",
      "technologies": ["Next.js", "ReScript", "Tailwind CSS", "MDX"],
      "githubUrl": Some("https://github.com/sreyassabbani/my-website"),
      "liveUrl": None, // This site itself
      "imageUrl": None,
    },
    {
      "title": "Sample Project 1",
      "description": "A description of your first project. This could be a web application, mobile app, or any other software project you've worked on.",
      "technologies": ["React", "Node.js", "PostgreSQL"],
      "githubUrl": Some("https://github.com/sreyassabbani"),
      "liveUrl": Some("https://example.com"),
      "imageUrl": None,
    },
    {
      "title": "Sample Project 2",
      "description": "Another project description. Feel free to add more details about the challenges you solved, the impact it had, or what you learned building it.",
      "technologies": ["Python", "Django", "Redis"],
      "githubUrl": Some("https://github.com/sreyassabbani"),
      "liveUrl": None,
      "imageUrl": None,
    },
  ]

  <div className="max-w-6xl mx-auto px-4 py-8">
    <header className="mb-12 text-center">
      <h1 className="text-5xl font-bold mb-4 text-primary"> {React.string("Projects")} </h1>
      <p className="text-xl text-foreground max-w-2xl mx-auto">
        {React.string(
          "A collection of projects I've built, ranging from web applications to experiments with new technologies.",
        )}
      </p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects
      ->Belt.Array.mapWithIndex((index, project) => {
        <ProjectCard
          key={Belt.Int.toString(index)}
          title={project["title"]}
          description={project["description"]}
          technologies={project["technologies"]}
          githubUrl=?{project["githubUrl"]}
          liveUrl=?{project["liveUrl"]}
          imageUrl=?{project["imageUrl"]}
        />
      })
      ->React.array}
    </div>
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        {React.string("Want to collaborate?")}
      </h2>
      <p className="text-foreground mb-6">
        {React.string("I'm always interested in working on new projects and learning from others.")}
      </p>
      <a
        href="https://github.com/sreyassabbani"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors font-semibold">
        {React.string("Check out my GitHub")}
      </a>
    </div>
  </div>
}
