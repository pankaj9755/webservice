/**
 * code to generate keys for jwt
 */
const keypair = require("keypair");
const fs = require("fs");

// key size and directoy name
const keySize = 512;
const keyDirectory = 'keys';

// pair keys
const pair = keypair({
    bits: keySize
});

// log the keys to show in termninal
console.log(pair);

// check if key direcotry exist.
if (!fs.existsSync(keyDirectory)) {
    fs.mkdirSync(keyDirectory);
}

// @TODO do not overwrite previous keys, find a way to rotate them
fs.writeFileSync('keys/private.pem', pair.private);
fs.writeFileSync('keys/public.pem', pair.public);
