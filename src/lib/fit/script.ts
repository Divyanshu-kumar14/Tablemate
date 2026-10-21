import type { Needs } from "@/types/domain";

/**
 * The script is deliberately templated. It asks about what the data cannot
 * establish. It never asserts that a venue meets a requirement.
 */
export function buildBeforeYouGo(needs: Needs): string[] {
  const questions: string[] = [];

  if (needs.texture === "very-soft") {
    questions.push(
      "Do you offer texture-modified or puréed options, and can you describe how they are prepared?",
    );
  } else if (needs.texture === "soft") {
    questions.push("Can the kitchen make dishes soft enough to cut with a fork?");
  }

  if (needs.mobility.includes("wheelchair")) {
    questions.push("Is the entrance and restroom wheelchair accessible?");
  }
  if (needs.mobility.includes("step-free")) {
    questions.push("Is the entrance step-free?");
  }

  if (needs.sodium === "lower") {
    questions.push("Can sauces and seasoning be prepared with less salt?");
  }

  if (needs.diet.includes("diabetic-friendly")) {
    questions.push(
      "Do you have diabetic-friendly options, and can you tell me about added sugar and portion size?",
    );
  }
  if (needs.diet.includes("renal-friendly")) {
    questions.push(
      "Do you have nutrition information for kidney-friendly diets, including sodium, potassium, and phosphorus?",
    );
  }
  if (needs.diet.includes("gluten-free")) {
    questions.push("Do you have gluten-free options, and how do you avoid cross-contact?");
  }

  if (needs.noise === "quiet") {
    questions.push("Is there a quieter area or time of day?");
  }

  if (needs.mobility.includes("hearing-friendly")) {
    questions.push("Is there a quieter table where conversation is easier?");
  }
  if (needs.mobility.includes("low-vision-friendly")) {
    questions.push("Can you provide a large-print menu or read options over the phone?");
  }

  const general = [
    "Can you tell me about the menu and how dishes are prepared?",
    "Is there anything I should know before we visit?",
    "What is the best time to call and confirm?",
  ];
  for (const question of general) {
    if (questions.length >= 3) break;
    questions.push(question);
  }

  return [...new Set(questions)].slice(0, 4);
}
