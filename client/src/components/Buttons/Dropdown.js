export default function Dropdown({ options = [] }) {
  return (
    <select className="border rounded px-3 py-2">
      {options.map(o => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
