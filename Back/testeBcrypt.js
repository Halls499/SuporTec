import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

console.log(jwt);

const senha = "123456";

async function CriarHash() {

    const hash = await bcrypt.hash(senha, 10);

    console.log(hash);

}

CriarHash();