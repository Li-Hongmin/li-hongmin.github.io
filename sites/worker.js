export default {
  async fetch(request, env) {
    const acceptsHtml = request.headers.get("Accept")?.includes("text/html");
    if (request.method === "GET" && acceptsHtml) {
      return env.ASSETS.fetch(
        new Request(new URL("/index.html", request.url), {
          method: "GET",
          headers: new Headers(request.headers),
        }),
      );
    }

    return new Response(null, { status: 404 });
  },
};
