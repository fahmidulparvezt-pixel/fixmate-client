// Next.js server start howar shomoy ekbar chole.
// ISP er DNS e mongodb+srv lookup fail korle Google/Cloudflare DNS use hobe.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dnsModule = await import("node:dns");
    const dns = dnsModule.default || dnsModule;
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    console.log("[dns] using public DNS servers for MongoDB lookup");
  }
}