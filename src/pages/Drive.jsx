import { mockDrive } from "../data/mockData";
import FileList from "../components/FileList";

export default function Drive({ user }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Xin chào, {user?.name} 👋</h2>
      <p>Đây là Drive mock data </p>

      <FileList files={mockDrive} />
    </div>
  );
}
