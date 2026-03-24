export default function Checkbox({ label }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" />
      {label}
    </label>
  );
}
