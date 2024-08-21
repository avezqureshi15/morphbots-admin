export const formatTimeStamp = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };

    return new Intl.DateTimeFormat('en-GB', options).format(date);
};