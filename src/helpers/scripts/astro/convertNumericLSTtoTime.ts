export const convertNumericLSTtoTime = (lst: number): string => {
    // Extract the hours from the LST
    const hours = Math.floor(lst);

    // Calculate the remaining fraction after extracting hours
    const fractionalHours = lst - hours;

    // Convert the fractional hours to minutes
    const minutesDecimal = fractionalHours * 60;
    const minutes = Math.floor(minutesDecimal);

    // Calculate the remaining fraction after extracting minutes
    const fractionalMinutes = minutesDecimal - minutes;

    // Convert the fractional minutes to seconds
    const seconds = Math.round(fractionalMinutes * 60);

    // Format the hours, minutes, and seconds to ensure two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // Construct the time string in HH:mm:ss format
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}