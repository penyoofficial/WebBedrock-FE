export interface Neko {
  id?: number;
  name: string;
  gender: "MALE" | "FEMALE";
  age: number;
  skinColor: string;

  fatherId?: number;
  motherId?: number;
}
