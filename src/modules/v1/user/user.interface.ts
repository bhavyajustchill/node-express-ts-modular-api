export interface User {
  username: string;
  password: string;
  role: "admin" | "user"; // Define possible roles
}
