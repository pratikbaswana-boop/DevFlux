import type { Express, Request, Response } from "express";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || process.env.key_secret || "default-download-secret";
const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface TokenPayload {
  payment_id: string;
  timestamp: number;
  expires: number;
}

export function generateDownloadToken(paymentId: string): { token: string; expires: number } {
  const timestamp = Date.now();
  const expires = timestamp + TOKEN_EXPIRY_MS;

  const payload: TokenPayload = {
    payment_id: paymentId,
    timestamp,
    expires,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", DOWNLOAD_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  const token = `${payloadBase64}.${signature}`;

  return { token, expires };
}

function verifyDownloadToken(token: string): TokenPayload | null {
  try {
    const [payloadBase64, signature] = token.split(".");

    if (!payloadBase64 || !signature) {
      return null;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", DOWNLOAD_SECRET)
      .update(payloadBase64)
      .digest("base64url");

    if (signature !== expectedSignature) {
      console.error("Download token signature mismatch");
      return null;
    }

    // Decode payload
    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf-8")
    );

    // Check expiry
    if (Date.now() > payload.expires) {
      console.error("Download token expired");
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Download token verification error:", error);
    return null;
  }
}

export function registerDownloadRoutes(app: Express) {
  // Secure download endpoint
  app.get("/api/download/:token", (req: Request, res: Response) => {
    const { token } = req.params;

    // Validate token
    const payload = verifyDownloadToken(token);

    if (!payload) {
      return res.status(403).json({
        success: false,
        error: "Invalid or expired download token",
      });
    }

    // Determine file path
    const protectedDir = path.resolve(__dirname, "protected");
    const fileName = "devflux-package.zip";
    const filePath = path.join(protectedDir, fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Download file not found: ${filePath}`);
      return res.status(404).json({
        success: false,
        error: "Download file not found",
      });
    }

    // Log successful download
    console.log(`Download initiated for payment: ${payload.payment_id}`);

    // Set headers for file download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: "Error streaming file",
        });
      }
    });
  });
}
