import { name } from "./const";

export const cleanLinkedInUrl = (url: string): string => {
  return url.replace(/https:\/\/www\.linkedin\.com\/in\/[^\s]*/, `${name}`);
};
