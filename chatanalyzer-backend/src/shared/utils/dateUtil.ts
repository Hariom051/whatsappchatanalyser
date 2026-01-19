export class DateUtil {
  public static normalizeDate(d: string): string {
    const [m, day, y] = d.split("/");
    return `20${y}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
}
