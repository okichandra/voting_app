import { Client, Databases } from "appwrite";

const client = new Client()
const db_id = "67c313e00032487f770d"
const colection_id = "67c3140000249e248ec0"

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67c3136f001d110a004d")

export const databases = new Databases(client)

export { client, db_id, colection_id}