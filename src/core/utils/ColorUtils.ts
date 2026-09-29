export const ColorUtils = {
  /** Converts a hex (`#rrggbb`) and an opacity from 0 to 1 into `rgba(...)`. */
  toRgba(hex: string, opacity: number): string {
    const value = hex.replace("#", "");
    const r = parseInt(value.slice(0, 2), 16) || 0;
    const g = parseInt(value.slice(2, 4), 16) || 0;
    const b = parseInt(value.slice(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  /**
   * Hex without `#` that PrimeVue's `ColorPicker` accepts with a defined hue.
   * For grays (black, white...) it has no hue and returns black when picked in the panel,
   * so one channel is adjusted by 1 (imperceptible difference) to make the hue red.
   */
  toPickerHex(hex: string): string {
    const value = hex.replace("#", "");
    const isGray = value.slice(0, 2) === value.slice(2, 4) && value.slice(2, 4) === value.slice(4, 6);
    if (!isGray) return value;

    const channel = parseInt(value.slice(0, 2), 16);
    if (channel === 255) return "fffefe";
    return (channel + 1).toString(16).padStart(2, "0") + value.slice(2);
  },
};
