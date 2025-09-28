import FileItem from "./FileItem";

export default function FileList({ files }) {
  return (
    <div style={{ marginTop: "20px" }}>
      {files.map((f) => (
        <FileItem key={f.id} file={f} />
      ))}
    </div>
  );
}
