import { MongoClient } from "mongodb";
import { auth } from "../lib/auth.js";
const USERS = [
  {
    name: "FixMate Admin",
    email: "admin@fixmate.com",
    password: "Admin123",
    role: "admin",
    phone: "+880 1700-000001",
    area: "Dhanmondi, Dhaka",
    bio: "Platform administrator.",
  },
  {
    name: "Rahim Uddin",
    email: "rahim@fixmate.com",
    password: "Tech1234",
    role: "technician",
    phone: "+880 1711-100200",
    area: "Mirpur, Dhaka",
    bio: "8 years of experience in smartphone, laptop, TV and electrical repair. Genuine parts and clear pricing.",
  },
  {
    name: "Sumaiya Khatun",
    email: "sumaiya@fixmate.com",
    password: "Tech1234",
    role: "technician",
    phone: "+880 1722-300400",
    area: "Dhanmondi, Dhaka",
    bio: "Certified technician for AC, refrigerator and washing machine servicing with 6 years of home-visit experience.",
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@fixmate.com",
    password: "Customer123",
    role: "customer",
    phone: "+880 1733-500600",
    area: "Mirpur, Dhaka",
    bio: "",
  },
  {
    name: "Tanvir Ahmed",
    email: "tanvir@fixmate.com",
    password: "Customer123",
    role: "customer",
    phone: "+880 1744-700800",
    area: "Uttara, Dhaka",
    bio: "",
  },
];
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const users = client.db(process.env.DB_NAME).collection("user");
  for (const u of USERS) {
    const existing = await users.findOne({
      email: u.email,
    });
    if (!existing) {
      try {
        await auth.api.signUpEmail({
          body: {
            name: u.name,
            email: u.email,
            password: u.password,
          },
        });
        console.log(`Created  ${u.email}`);
      } catch (err) {
        console.error(`Failed   ${u.email}: ${err?.message || err}`);
        continue;
      }
    } else {
      console.log(`Exists   ${u.email}`);
    }
    await users.updateOne(
      {
        email: u.email,
      },
      {
        $set: {
          role: u.role,
          phone: u.phone,
          area: u.area,
          bio: u.bio,
        },
      },
    );
  }
  console.log("User seed finished.");
} finally {
  await client.close();
  process.exit(0);
}
