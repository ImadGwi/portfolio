# ImageKit File Upload (Client + Secure Backend) — Implementation Guide

## 🧠 Overview

ImageKit allows **client-side uploads**, but requires **secure authentication generated from your backend**.

You CANNOT upload directly from the client using a private key.

Instead, the flow is:

1. Client requests auth parameters from backend
2. Backend generates:

   * `token`
   * `expire`
   * `signature`
3. Client uploads file directly to ImageKit API

---

## 🔐 Why this matters

* Prevents exposing your **private API key**
* Ensures uploads are **validated and secure**
* Prevents replay attacks (token must be unique)

---

## 🏗️ Architecture

```
Client (Next.js frontend)
        ↓
GET /api/imagekit-auth
        ↓
Backend (Next.js route)
        ↓
Generate token + signature
        ↓
Return auth params
        ↓
Client uploads file → ImageKit API
```

---

## ⚙️ Step 1 — Backend: Generate Auth Parameters

### 📄 `/app/api/imagekit-auth/route.ts`

```ts
import crypto from "crypto";

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY!;

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 60 * 10; // 10 min

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
```

---

## 📤 Step 2 — Client Upload Function

```ts
async function uploadToImageKit(file: File) {
  // 1. Get auth params
  const authRes = await fetch("/api/imagekit-auth");
  const { token, expire, signature, publicKey } = await authRes.json();

  // 2. Prepare form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", publicKey);
  formData.append("signature", signature);
  formData.append("expire", expire.toString());
  formData.append("token", token);

  // Optional fields
  formData.append("folder", "/uploads");
  formData.append("useUniqueFileName", "true");

  // 3. Upload
  const res = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data;
}
```

---

## 📦 Expected Response

```json
{
  "fileId": "6673f88237b244ef54d60180",
  "name": "image.jpg",
  "url": "https://ik.imagekit.io/your_id/image.jpg",
  "thumbnailUrl": "...",
  "height": 500,
  "width": 1000
}
```

---

## ⚠️ Critical Rules

### 1) Signature MUST be generated on backend

Never expose:

* private API key
* signature logic

---

### 2) Token must be unique

* Use `crypto.randomUUID()`
* Reusing token = request failure

---

### 3) Expire must be short-lived

* Max: < 1 hour
* Recommended: 5–15 minutes

---

### 4) File size limits

* Free plan: ~25MB images
* Larger limits require paid plan 

---

## 🧩 Optional Upload Parameters

You can extend uploads with:

```ts
formData.append("tags", JSON.stringify(["user-upload"]));
formData.append("isPrivateFile", "false");
formData.append("customMetadata", JSON.stringify({ userId: "123" }));
formData.append("folder", "/avatars");
```

---

## 🚫 Common Mistakes

❌ Using private key in frontend
❌ Hardcoding signature
❌ Reusing token
❌ Missing `fileName`
❌ Sending non-string values in FormData

---

## 🚀 Recommended Next.js Pattern

* Upload → get URL
* Save URL in DB (Drizzle + Neon)
* Serve via ImageKit CDN

---

## 🧠 Mental Model

* Backend = **auth generator**
* Client = **file sender**
* ImageKit = **storage + CDN**

---

## ✅ Minimal Checklist

* [ ] `.env` has keys
* [ ] API route returns auth params
* [ ] Client fetches auth before upload
* [ ] FormData correctly built
* [ ] File successfully uploaded

---

## 🔚 Summary

Use this pattern:

**Secure backend signing + direct client upload**

This gives:

* best performance (no server proxy)
* strong security
* scalable uploads

---

## 📚 Reference

Official API:
https://imagekit.io/docs/api-reference/upload-file/upload-file

---
