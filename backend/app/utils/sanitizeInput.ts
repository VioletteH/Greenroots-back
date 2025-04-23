import sanitizer from 'sanitizer';

export const sanitizeInput = (obj: any): any => {
    if (typeof obj === 'string') {
        return sanitizer.escape(obj); 
    } else if (typeof obj === 'object' && obj !== null) {
        const sanitized: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = sanitizeInput(obj[key]);
            }
        }
        return sanitized;
    }
    return obj; 
};