import { useSignOutMutation } from "@ring/redux";
import { useNavigate } from "react-router";

const useLogout = () => {
  const navigate = useNavigate();
  const [logout] = useSignOutMutation();

  const signOut = async (message) => {
    try {
      navigate("/");
      await logout().unwrap();

      //Queue snack
      const { enqueueSnackbar } = await import("notistack");
      enqueueSnackbar(message || "Đã đăng xuất!", { variant: "error" });
    } catch (err) {
      console.error(err);
    }
  };

  return signOut;
};

export default useLogout;
