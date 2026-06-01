export const starterPayload = `{
  user: {
    id: 42,
    email: "dev@example.com",
    profile: {
      displayName: "Ada Lovelace",
      contact: { mail: "ada@company.dev" },
    },
  },
  orders: [
    { id: "ord_1", price: 129.5, status: "paid" },
    { id: "ord_2", price: 74, status: "pending" },
  ],
  tags: ["admin", "developer"],
}`;
