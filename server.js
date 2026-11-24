
import express from "express";
import Groq from "groq-sdk";
import "dotenv/config";

const app = express();

app.use(express.json({ limit: "20kb" }));

if (!process.env.GROQ_API_KEY) {
  console.error("Groq API key is missing!");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    name: "KET NAP VERITY",
    status: "online",
    language: "Persian"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 2000
    ) {
      return res.status(400).json({
        error: "پیام معتبر نیست"
      });
    }

    const result =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
تو VERITY هستی.
یک هوش مصنوعی زرد برای Minecraft Bedrock.

قوانین:
- فقط فارسی صحبت کن.
- دوستانه و باهوش باش.
- به سوالات ماینکرفت جواب بده.
- درباره حالت هیولا اطلاعات داشته باش.
- برای درخواست آیتم، دستور مناسب پیشنهاد بده.
- ادعا نکن که دستوری را در بازی اجرا کرده‌ای.
- پاسخ‌ها کوتاه و واضح باشند.
`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_completion_tokens: 500
      });

    res.json({
      name: "VERITY",
      reply:
        result.choices[0].message.content
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      error: "خطا در ارتباط با هوش مصنوعی"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("KET NAP VERITY is running!");
});
