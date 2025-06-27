import React from "react";

const EmptyState = ({
  message = "No results found.",
  icon = "🔍",
  style = {},
}) => (
  <div
    style={{
      textAlign: "center",
      color: "#888",
      fontSize: 20,
      padding: "48px 0",
      ...style,
    }}
  >
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <div>{message}</div>
  </div>
);

export default EmptyState;