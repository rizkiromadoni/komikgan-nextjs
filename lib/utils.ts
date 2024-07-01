import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

export function toBase64(file: File) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		
		fileReader.readAsDataURL(file);
		
		fileReader.onload = () => {
			resolve(fileReader.result);
		};
		
		fileReader.onerror = (error) => {
			reject(error);
		};
	});
}