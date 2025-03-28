import { useSignOutMutation } from "@ring/redux";
import { useNavigate } from "react-router";

const useLogout = () => {
  const navigate = useNavigate();
  const [logout] = useSignOutMutation();

  const signOut = async (message) => {
    try {
      await logout().unwrap();

      //Queue snack + goes to home
      const { enqueueSnackbar } = await import("notistack");
      enqueueSnackbar(message || "Đã đăng xuất!", { variant: "error" });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return signOut;
};

export default useLogout;
