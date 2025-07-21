let nodeEnv = %raw(`typeof process !== "undefined" && process.env && process.env.NODE_ENV ? process.env.NODE_ENV : "development"`)

let url = switch nodeEnv {
| "production" => "https://sreyassabbani.github.io"
| _ => "http://localhost:3000"
}
