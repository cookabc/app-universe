import { apiError, apiSuccess, validateFundCode } from "@/lib/api-utils";
import { ValidationError } from "@/lib/error-handling";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const validationError = validateFundCode(code);
  if (validationError) {
    return apiError(new ValidationError(validationError), 400);
  }

  try {
    const res = await fetch(
      `https://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}`,
      {
        headers: { Referer: "https://fundf10.eastmoney.com" },
        next: { revalidate: 60 },
      },
    );
    const text = await res.text();
    const match = text.match(/jsonpgz\((\{[\s\S]+?\})\)/);
    if (match && match[1]) {
      const json = JSON.parse(match[1]);
      return apiSuccess(json);
    }
    return apiError(new Error("Failed to parse fund estimate data"), 502);
  } catch (error) {
    console.error("[fund-estimate] Error:", error);
    return apiError(error, 502);
  }
}
