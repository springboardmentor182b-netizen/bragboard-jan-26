const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "220px" }}>Sidebar</aside>
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
};

export default AdminLayout;
