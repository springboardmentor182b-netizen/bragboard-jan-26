export default function FormInput({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">{label}</label>
      <input className="border rounded px-3 py-2" {...props} />
    </div>
  );
}
