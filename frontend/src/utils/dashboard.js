/**
 * Shared utility functions for dashboard screens.
 */

/**
 * Generates a random integer between minimum and maximum (inclusive).
 */
export const generateRandomData = (minimum = 0, maximum = 100) => {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

/**
 * Generates a random decimal number between min and max.
 */
export const generateRandomDecimal = (min = 0, max = 10) => {
    return Math.random() * (max - min) + min;
};

/**
 * Generates a random date between Jan 1st 2020 and today.
 */
export const randomDate = () => {
    const start = new Date(2020, 0, 1).getTime();
    const end = new Date().getTime();
    return new Date(start + Math.random() * (end - start));
};

/**
 * Formats a number with an optional symbol and sign.
 */
export const formatNumber = (number, symbol = "", showSign = true) => {
    if (number === undefined || number === null) return "-";

    let formattedNumber = (number > 0 && showSign) ? "+" : "";
    formattedNumber += number;
    formattedNumber += symbol;

    return formattedNumber;
};
