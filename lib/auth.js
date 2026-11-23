import dns from "dns";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// ISP DNS e SRV lookup fail korle public DNS use hobe
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const globalForMongo = globalThis;
const client = globalForMongo._mongoClient || new MongoClient(process.env.MONGODB_URI);
if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;

const db = client.db(process.env.DB_NAME);

const baseURL = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/+$/, "");

const trustedOrigins = [
  baseURL,
  "http://localhost:3000",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  account: {
    // same email e age password diye account thakle Google diye login korle link hobe
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: true },
      area: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // admin kokhono sign up diye hobe na, Google user o "customer" pabe
        before: async (user) => {
          const role = user.role === "technician" ? "technician" : "customer";
          return { data: { ...user, role } };
        },
      },
      update: {
        // user nijer role change korte parbe na (admin API diye change hoy)
        before: async (user) => {
          const { role, ...rest } = user;
          return { data: rest };
        },
      },
    },
  },
  plugins: [jwt()],
});