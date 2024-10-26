export interface User {
  username: string;
  password: string;
  email: string;
  role: "admin" | "user"; // Define possible roles
}
