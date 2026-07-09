import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** OpenAPI 3 spec — powers the Swagger UI at /swagger.html. */
const SPEC = {
  openapi: "3.0.3",
  info: {
    title: "ABM Whaiduzzaman — Site API",
    version: "0.1.0",
    description:
      "APIs powering the public site. Built incrementally, page by page. Images are stored in Postgres and served from /api/media.",
  },
  paths: {
    "/api/settings": {
      get: {
        tags: ["Settings"],
        summary: "Get site settings",
        responses: {
          "200": {
            description: "Current site settings (defaults if never saved).",
            content: { "application/json": { schema: { $ref: "#/components/schemas/SiteSettings" } } },
          },
        },
      },
      put: {
        tags: ["Settings"],
        summary: "Save site settings",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/SiteSettings" } } },
        },
        responses: {
          "200": { description: "Saved settings.", content: { "application/json": { schema: { $ref: "#/components/schemas/SiteSettings" } } } },
          "400": { description: "Invalid body." },
        },
      },
    },
    "/api/media": {
      post: {
        tags: ["Media"],
        summary: "Upload an image (raw bytes, stored in Postgres)",
        description: "Send the raw image bytes as the body with an image/* Content-Type.",
        requestBody: {
          required: true,
          content: {
            "image/png": { schema: { type: "string", format: "binary" } },
            "image/jpeg": { schema: { type: "string", format: "binary" } },
            "image/webp": { schema: { type: "string", format: "binary" } },
          },
        },
        responses: {
          "200": {
            description: "Uploaded.",
            content: {
              "application/json": {
                schema: { type: "object", properties: { id: { type: "string" }, url: { type: "string", example: "/api/media/abc123" } } },
              },
            },
          },
          "400": { description: "No file." },
          "413": { description: "Too large (max 8 MB)." },
          "415": { description: "Not an image." },
        },
      },
    },
    "/api/media/{id}": {
      get: {
        tags: ["Media"],
        summary: "Serve a stored image",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "The image bytes.", content: { "image/*": { schema: { type: "string", format: "binary" } } } },
          "404": { description: "Not found." },
        },
      },
    },
  },
  components: {
    schemas: {
      SiteSettings: {
        type: "object",
        properties: {
          home: {
            type: "object",
            properties: {
              bannerType: { type: "string", enum: ["image", "video"] },
              bannerImage: { type: "string" },
              bannerVideo: { type: "string" },
              eyebrow: { type: "string" },
              headline: { type: "string" },
              subtitle: { type: "string" },
              cta1Label: { type: "string" },
              cta1Link: { type: "string" },
              cta2Label: { type: "string" },
              cta2Link: { type: "string" },
            },
          },
          contact: {
            type: "object",
            properties: { phone: { type: "string" }, email: { type: "string" }, address: { type: "string" } },
          },
          social: { type: "object", additionalProperties: { type: "string" } },
          newsletter: { type: "object", properties: { heading: { type: "string" }, provider: { type: "string" } } },
          topBanner: { type: "object", properties: { enabled: { type: "boolean" }, text: { type: "string" }, link: { type: "string" } } },
          seo: { type: "object", properties: { title: { type: "string" }, description: { type: "string" } } },
          footer: { type: "object", properties: { copyright: { type: "string" } } },
        },
      },
    },
  },
} as const;

export async function GET() {
  return NextResponse.json(SPEC);
}
