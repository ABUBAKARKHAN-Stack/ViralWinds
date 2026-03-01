import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getMongo() {
try {
    const client = await clientPromise;
    const db = client.db();
    return { client, db };
} catch (error) {
  console.log(error);
  const errMsg = error instanceof Error ? error.message : "Failed to connect to database";
  throw new Error(errMsg);
}
}
