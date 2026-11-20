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

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  trustedOrigins: [process.env.BETTER_AUTH_URL, "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
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
        // admin kokhono sign up diye hobe na, customer/technician chhara sob "customer"
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