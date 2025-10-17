// Basic encryption helpers using Web Crypto API
// Exports: encryptString(password, plainText) -> Promise<string> (JSON with base64 parts)
//          decryptString(password, payloadString) -> Promise<string>

function toBase64(buf){
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function fromBase64(str){
  const bin = atob(str)
  const len = bin.length
  const bytes = new Uint8Array(len)
  for(let i=0;i<len;i++) bytes[i]=bin.charCodeAt(i)
  return bytes.buffer
}

async function deriveKey(password, salt, keyAlgo='AES-GCM', keyLen=256){
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey'])
  return crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations: 250000, hash: 'SHA-256'}, keyMaterial, {name:keyAlgo, length: keyLen}, false, ['encrypt','decrypt'])
}

export async function encryptString(password, plain){
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt.buffer)
  const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(plain))
  const payload = { salt: toBase64(salt.buffer), iv: toBase64(iv.buffer), data: toBase64(ct) }
  return JSON.stringify(payload)
}

export async function decryptString(password, payloadStr){
  const payload = JSON.parse(payloadStr)
  const salt = fromBase64(payload.salt)
  const iv = fromBase64(payload.iv)
  const ct = fromBase64(payload.data)
  const key = await deriveKey(password, salt)
  const plainBuf = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct)
  const dec = new TextDecoder()
  return dec.decode(plainBuf)
}
