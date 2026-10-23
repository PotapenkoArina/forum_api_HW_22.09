import "dotenv/config"
import argon2 from "argon2"

function getPepper(): Buffer {
    const pepperHex = process.env.PASSWORD_PEPPER
    if (!pepperHex || !/^(?:[0-9a-fA-F]{2}){32,}$/.test(pepperHex)) {
        throw new Error("PASSWORD_PEPPER must contain at least 32 bytes in hexadecimal")
    }
    return Buffer.from(pepperHex, "hex")
}

export function hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
        secret: getPepper()
    })
}

export function verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password, { secret: getPepper() })
}
