import { modelFlashExp as model } from "@/lib/ai";
import { generateText } from "ai";

export async function GET() {
  try {
    const prompt = "generate a photo of a happy cat wearing a hat"; // Or get the prompt from the request

    const response = await generateText({
      model,
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
      prompt,
    });

    if (response && response.files && response.files.length > 0) {
      const imageFile = response.files[0];

      if (imageFile.mimeType.startsWith("image/")) {
        const base64Data = imageFile.base64;
        const mimeType = imageFile.mimeType;
        const filename = `generated-image-${Date.now()}.${
          mimeType.split("/")[1]
        }`;
        const buffer = Buffer.from(base64Data.split(",")[1], "base64");

        return new Response(buffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
        });
      } else {
        return new Response(
          JSON.stringify({ error: "No image data received from AI" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(JSON.stringify({ error: "Failed to generate image" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
