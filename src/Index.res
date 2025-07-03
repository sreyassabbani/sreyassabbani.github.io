module P = {
  @react.component
  let make = (~children, ~className=?) => {
    let className_ = switch className {
    | Some(c) => c ++ " mb-2"
    | None => "mb-2"
    }
    <p className=className_> children </p>
  }
}

let default = () =>
  <main className="pt-10">
    <section className="flex flex-col md:flex-row mb-20">
      <figure className="w-full md:w-1/4 flex flex-col justify-center items-center">
        <img
          src={App.url ++ "/static/profile-pic.png"}
          alt="Photo of me"
          className="rounded-full w-32 h-32 object-cover"
        />
        <figcaption className="mt-2 text-center"> {React.string("me")} </figcaption>
      </figure>
      <div className="w-full md:w-3/4">
        <h1 className="text-xl font-bold mb-2"> {React.string("hi there!")} </h1>
        <P className="mb-6">
          {React.string(
            "I'm a math, physics, and CS enthusiast. I've also recently been into poetry and music.",
          )}
        </P>
        <P>
          {React.string(
            "I enjoy learning and tinkering with things. Along the way, I've realized the importance of ",
          )}
          <s>
            <i> {React.string("Being Earnest")} </i>
          </s>
          {React.string(
            " being able to share what I've learned!! — especially when it's a profound connection that could change someone else's perspective. I thus dedicate part of this website to highlight my daily struggles, occasional insights, and even some jokes I find funny 😄",
          )}
        </P>
      </div>
    </section>
    <section>
      <P>
        {React.string(
          "Feel free to check out my projects or connect with me if you want to chat about science, tech, art, or anything else!",
        )}
      </P>
    </section>
  </main>
