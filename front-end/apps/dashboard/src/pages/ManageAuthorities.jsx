import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  TextField,
} from "@mui/material";
import { getUserRole } from "@ring/shared";
import { useEffect, useState } from "react";
import {
  useGetPrivilegesQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
} from "../features/roles/rolesApiSlice";

const UserRole = getUserRole();

const ManageAuthorities = () => {
  const [selectedRole, setSelectedRole] = useState(Object.keys(UserRole)[0]);
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [pending, setPending] = useState(false);
  const { data: role, isLoading: loadRole } = useGetRoleQuery(selectedRole);
  const { data: privileges, isLoading: loadPrivileges } =
    useGetPrivilegesQuery();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();

  useEffect(() => {
    if (role && !loadRole) {
      const newSelected = role?.privileges?.map(
        (privilege) => privilege.privilegeType
      );
      setSelectedPrivileges(newSelected);
    }
  }, [role]);

  const handleChangePrivileges = (e) => {
    const selectedIndex = selectedPrivileges.indexOf(e.target.value);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedPrivileges, e.target.value);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedPrivileges.slice(1));
    } else if (selectedIndex === selectedPrivileges.length - 1) {
      newSelected = newSelected.concat(selectedPrivileges.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedPrivileges.slice(0, selectedIndex),
        selectedPrivileges.slice(selectedIndex + 1)
      );
    }

    setSelectedPrivileges(newSelected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating || pending) return;
    setPending(true);

    const { enqueueSnackbar } = await import("notistack");

    updateRole({
      name: selectedRole,
      privileges: selectedPrivileges,
    })
      .unwrap()
      .then((data) => {
        enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
        setPending(false);
      })
      .catch((err) => {
        enqueueSnackbar("Cập nhật thất bại!", { variant: "error" });
        console.error(err);
        setErr(err);
        if (!err?.status) {
          setErrMsg("Server không phản hồi!");
        } else if (err?.status === 409) {
          setErrMsg(err?.data?.message);
        } else if (err?.status === 403) {
          setErrMsg("Lỗi xác thực!");
        } else if (err?.status === 400) {
          setErrMsg("Sai định dạng thông tin!");
        } else {
          setErrMsg("Cập nhật thất bại!");
        }
        setPending(false);
      });
  };

  const isSelected = (privilege) =>
    selectedPrivileges.indexOf(privilege) !== -1;

  let privilegesContent;

  if (loadPrivileges) {
  } else {
    const { ids, entities } = privileges;

    privilegesContent = ids?.length ? (
      ids?.map((id, index) => {
        const group = entities[id];

        return (
          <div key={`group-${id}-${index}`}>
            <p>{group?.groupName}</p>
            <div>
              {group?.groupPrivileges?.map((privilege, pIndex) => {
                const isItemSelected = isSelected(privilege?.privilegeType);

                return (
                  <FormControlLabel
                    key={`privilege-${privilege?.id}-${pIndex}`}
                    control={
                      <Checkbox
                        value={privilege?.privilegeType}
                        checked={isItemSelected}
                        onChange={handleChangePrivileges}
                        disableRipple
                        name={privilege?.label}
                        color="primary"
                        size="small"
                      />
                    }
                    sx={{ fontSize: "14px", width: "100%", marginRight: 0 }}
                    label={<p>{privilege?.label}</p>}
                  />
                );
              })}
            </div>
          </div>
        );
      })
    ) : (
      <p>AAAAAA</p>
    );
  }

  return (
    <div>
      <p>ManageAuthorities</p>
      <form onSubmit={handleSubmit}>
        <button onClick={handleSubmit}>cập nhật</button>
        <TextField
          label="Chức vụ"
          id="role"
          select
          fullWidth
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {Object.values(UserRole).map((option, index) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <div>
          <FormGroup sx={{ padding: 0, width: "100%" }}>
            {privilegesContent}
          </FormGroup>
        </div>
      </form>
    </div>
  );
};

export default ManageAuthorities;
