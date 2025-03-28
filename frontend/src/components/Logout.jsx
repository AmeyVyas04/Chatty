import { useNavigate } from "react-router-dom";
import { useauthstore } from "../store/authStore";

function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useauthstore(); // ✅ Fetch logout function from store

  return (
    <button
      onClick={async () => {
        await logout(); // ✅ Ensure it's properly called
        navigate("/login"); // ✅ Redirect after logout
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
