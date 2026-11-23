const MAX_SIZE = 5 * 1024 * 1024;
export function imageError(file) {
  if (!file) return "Please choose an image";
  if (!file.type.startsWith("image/")) return "Please choose an image file";
  if (file.size > MAX_SIZE) return "Image must be 5MB or smaller";
  return null;
}
export async function uploadImage(file) {
  const problem = imageError(file);
  if (problem) throw new Error(problem);
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("Image upload is not configured");
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.error?.message || "Image upload failed. Please try again.");
  }
  return json.data.display_url;
}
