export function formatDate(dateStr) {
  if (!dateStr) return "\u00A0"; 
  if (typeof dateStr === "string" && dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-");
    return `${parseInt(day)}. ${parseInt(month)}. ${year}`;
  }
  return dateStr;
}