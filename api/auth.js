export const config = { runtime: "edge" };

export default async function handler(req) {
  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(":");

      if (user === "OGX-WB" && pass === "WB26") {
        // Determine which page to serve
        const url = new URL(req.url);
        const path = url.pathname;

        let target = "/_static/index.html";
        if (path.startsWith("/keyword-reference")) target = "/_static/keyword-reference.html";
        else if (path.startsWith("/brand-playbook")) target = "/_static/brand-playbook.html";
        else if (path.startsWith("/freelancer-playbook")) target = "/_static/freelancer-playbook.html";

        const res = await fetch(new URL(target, req.url));
        return new Response(res.body, {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="WhichBingo Brand Playbooks"',
    },
  });
}
