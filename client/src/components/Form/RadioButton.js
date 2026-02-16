export default function RadioButton({ label, name }) {
  return (
    <label className="flex items-center gap-2">
      <input type="radio" name={name} />
      {label}
    </label>
  );
}
