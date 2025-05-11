export function getDateRange(period: "daily" | "weekly" | "monthly" | "yearly" | "all") {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "daily":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "weekly":
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
      startDate.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "all":
      startDate = new Date(0); 
      break;
    default:
      startDate = new Date(0); 
  }

  return { startDate, endDate: new Date() };
}