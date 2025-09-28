export default function Drive({ user }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome {user.name}</h1>
      <p>This is your online drive.</p>
    </div>
  );
}
