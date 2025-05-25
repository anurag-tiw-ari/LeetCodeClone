import mongoose from "mongoose";

async function main()
{
    await mongoose.connect(process.env.DB_CONNECT_URL)
}

export default main;