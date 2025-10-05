export type Question = {
  id: number;
  text: string;
  answers: string[];
  type: "radio" | "text";
  image: string;
};
