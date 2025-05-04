import sanitizeHtml from 'sanitize-html';

export const sanitizeObject = (input: any): any => {
  if (typeof input === 'string') {
    return sanitizeHtml(input);
  } else if (Array.isArray(input)) {
    return input.map(sanitizeObject);
  } else if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      sanitized[key] = sanitizeObject(input[key]);
    }
    return sanitized;
  } else {
    return input;
  }
};
