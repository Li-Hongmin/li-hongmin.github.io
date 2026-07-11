export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    const acceptsHtml = request.headers.get("Accept")?.includes("text/html");
    if (request.method !== "GET" || !acceptsHtml) {
      return response;
    }

    return env.ASSETS.fetch(
      new Request(new URL("/index.html", request.url), {
        method: "GET",
        headers: request.headers,
      }),
    );
  },
};
