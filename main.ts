const db = await Deno.openKv();

Deno.serve(async (_request: Request) => {
  const users = [];

  const usersCursor = await db.list({ prefix: ["users"] });
  for await (const user of usersCursor) {
    users.push(user);
  }

  const envs = [
    ["FOO", Deno.env.get("FOO")],
    ["BAR", Deno.env.get("BAR")],
    ["DENO_REGION", Deno.env.get("DENO_REGION")],
    ["DENO_DEPLOYMENT_ID", Deno.env.get("DENO_DEPLOYMENT_ID")],
  ];

  const html = `
    <html>
      <head>
        <title>Hello, world!</title>
      </head>
      <body>
        <h1>Hello, world!</h1>
        <h2>Environment variables:</h2>
        <ul>
          ${
    envs.map(([name, value]) => `<li>${name}: ${value}</li>`).join("\n")
  }
        </ul>

        <h2>Users:</h2>
        <ul>
          ${
    users.map((user) => `<li>${user.key}: ${JSON.stringify(user.value)}</li>`)
      .join("\n")
  }
        </ul>

      </body>
    </html>
`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
});
