type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassArray;

type ClassDictionary = Record<string, ClassPrimitive>;
type ClassPrimitive = boolean | string | number | null | undefined;
type ClassArray = ClassValue[];

function collectClassNames(value: ClassValue, bucket: string[]): void {
  if (!value && value !== 0) {
    return;
  }

  if (typeof value === "string" || typeof value === "number") {
    bucket.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectClassNames(entry, bucket);
    }
    return;
  }

  if (typeof value === "object") {
    for (const [key, condition] of Object.entries(value)) {
      if (condition) {
        bucket.push(key);
      }
    }
  }
}

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    collectClassNames(input, classes);
  }

  return classes.join(" ");
}
