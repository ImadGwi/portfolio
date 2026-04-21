import crypto from "crypto";

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return Response.json(
      { error: "ImageKit keys not configured in environment" }, 
      { status: 500 }
    );
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return Response.json({
    token,
    expire,
    signature,
    publicKey,
  });
}
