function adjustTextLength(text, totalLength = 100) {
  if (text.length > totalLength) throw new Error("The text is too long...");
  return text + "\t".repeat(totalLength - text.length);
}

function dynamicToast(message = "", icon = "", background = "textures/ui/greyBorder") {
  return (
    "§N§O§T§I§F§I§C§A§T§I§O§N" +
    adjustTextLength(message, 500) +
    adjustTextLength(icon, 100) +
    adjustTextLength(background, 100)
  );
}

export { dynamicToast };
