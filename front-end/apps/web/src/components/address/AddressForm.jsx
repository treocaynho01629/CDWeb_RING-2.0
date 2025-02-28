import { useEffect, useState } from "react";
import {
  LocationOn as LocationOnIcon,
  Check,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  Delete,
  Apartment,
} from "@mui/icons-material";
import {
  Checkbox,
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid2 as Grid,
  MenuItem,
  TextField,
  DialogTitle,
  TextareaAutosize,
} from "@mui/material";
import { Instruction } from "@ring/ui/Components";
import { PHONE_REGEX, addressItems, location } from "@ring/shared";
import { PatternFormat } from "react-number-format";

const splitAddress = (addressInfo) => {
  let city = "";
  let ward = "";
  let address = "";

  if (addressInfo?.address) {
    //Split address
    address = addressInfo?.address;
    let addressSplit = addressInfo?.city?.split(", ");
    ward = addressSplit[addressSplit.length - 1];
    if (addressSplit.length > 1) city = addressSplit[0];
  }

  return {
    id: addressInfo?.id || "",
    name: addressInfo?.name || "",
    companyName: addressInfo?.companyName || "",
    type: addressInfo?.type || null,
    phone: addressInfo?.phone || "",
    city,
    ward,
    address,
  };
};

const AddressForm = ({
  handleClose,
  addressInfo,
  err,
  errMsg,
  setErrMsg,
  selectedValue,
  handleConvertAddress,
  pending,
  handleSetDefault,
  handleCreateAddress,
  handleClickRemove,
  handleUpdateAddress,
}) => {
  const [validPhone, setValidPhone] = useState(
    PHONE_REGEX.test(addressInfo?.phone) || true
  );
  const [currAddress, setCurrAddress] = useState(splitAddress(addressInfo));
  const [selectDefault, setSelectDefault] = useState(false);
  const [selectTemp, setSelectTemp] = useState(
    addressInfo && addressInfo?.isDefault == null
  );

  //Error message reset when reinput stuff
  useEffect(() => {
    setErrMsg("");
  }, [currAddress]);

  useEffect(() => {
    //Check phone number
    const result = PHONE_REGEX.test(currAddress.phone);
    setValidPhone(result);
  }, [currAddress.phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;

    //Validation
    const isNotValid =
      !currAddress?.name ||
      !currAddress?.phone ||
      !currAddress?.address ||
      !currAddress?.city ||
      !currAddress?.ward ||
      !validPhone;
    if (isNotValid) {
      setErrMsg("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newAddress = {
      id: currAddress.id,
      name: currAddress.name,
      companyName: currAddress.companyName,
      phone: currAddress.phone,
      city: currAddress.city + ", " + currAddress.ward,
      address: currAddress.address,
      type: currAddress.type,
      isDefault: addressInfo?.isDefault,
    };

    if (!addressInfo) {
      //Create
      handleCreateAddress(newAddress, selectDefault, selectTemp);
    } else {
      //Update
      if (addressInfo.isDefault != null) {
        //Saved address
        selectTemp
          ? handleConvertAddress(newAddress, selectTemp)
          : handleUpdateAddress(newAddress, selectDefault);
      } else {
        //Stored address
        selectDefault
          ? handleSetDefault(newAddress)
          : selectTemp
            ? handleUpdateAddress(newAddress)
            : handleConvertAddress(newAddress, selectTemp);
      }
    }
  };

  const selectedCity = location.filter((city) => {
    return city.name == currAddress?.city;
  });

  let selectWards;

  if (!selectedCity) {
    selectWards = (
      <TextField
        label="Phường/Xã"
        select
        error={(errMsg != "" || addressInfo) && !currAddress?.ward}
        defaultValue=""
        fullWidth
        size="small"
        slotProps={{
          select: {
            MenuProps: {
              slotProps: {
                paper: {
                  style: {
                    maxHeight: 250,
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem disabled value="">
          <em>--Phường/Xã--</em>
        </MenuItem>
      </TextField>
    );
  } else {
    selectWards = (
      <TextField
        label="Phường/Xã"
        required
        value={currAddress?.ward || ""}
        onChange={(e) =>
          setCurrAddress({ ...currAddress, ward: e.target.value })
        }
        select
        error={(errMsg != "" || addressInfo) && !currAddress?.ward}
        defaultValue=""
        fullWidth
        size="small"
        slotProps={{
          select: {
            MenuProps: {
              slotProps: {
                paper: {
                  style: {
                    maxHeight: 250,
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem disabled value="">
          <em>--Phường/Xã--</em>
        </MenuItem>
        {selectedCity[0]?.wards?.map((ward) => (
          <MenuItem key={ward} value={ward}>
            {ward}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  const isSelected = selectedValue != null && selectedValue == addressInfo?.id;

  return (
    <>
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <LocationOnIcon />
        &nbsp;Địa chỉ người nhận
      </DialogTitle>
      <DialogContent>
        <form style={{ paddingTop: 10 }} onSubmit={handleSubmit}>
          <Instruction
            display={errMsg ? "block" : "none"}
            aria-live="assertive"
          >
            {errMsg}
          </Instruction>
          <Grid container size="grow" spacing={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Họ và tên"
                type="text"
                id="fullName"
                required
                onChange={(e) =>
                  setCurrAddress({ ...currAddress, name: e.target.value })
                }
                value={currAddress?.name}
                error={
                  ((errMsg != "" || addressInfo) && !currAddress?.name) ||
                  err?.data?.errors?.name
                }
                helperText={err?.data?.errors?.name}
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: <PersonIcon style={{ color: "gray" }} />,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <PatternFormat
                label="Số điện thoại"
                id="phone"
                required
                onValueChange={(values) =>
                  setCurrAddress({ ...currAddress, phone: values.value })
                }
                value={currAddress?.phone}
                error={
                  ((errMsg != "" || addressInfo) && !currAddress?.phone) ||
                  (currAddress.phone && !validPhone) ||
                  err?.data?.errors?.phone
                }
                helperText={
                  currAddress.phone && !validPhone
                    ? "Sai định dạng số điện thoại!"
                    : err?.data?.errors?.phone
                }
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    endAdornment: <PhoneIcon style={{ color: "gray" }} />,
                  },
                }}
                format="(+84) ### ### ###"
                allowEmptyFormatting
                customInput={TextField}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Tên công ty"
                type="text"
                id="company"
                onChange={(e) =>
                  setCurrAddress({
                    ...currAddress,
                    companyName: e.target.value,
                  })
                }
                value={currAddress?.companyName}
                error={err?.data?.errors?.companyName}
                helperText={err?.data?.errors?.companyName}
                size="small"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: <Apartment style={{ color: "gray" }} />,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Loại địa chỉ"
                onChange={(e) =>
                  setCurrAddress({ ...currAddress, type: e.target.value })
                }
                select
                value={currAddress?.type || ""}
                error={err?.data?.errors?.type}
                helperText={err?.data?.errors?.type}
                fullWidth
                size="small"
              >
                <MenuItem value={null}>
                  <em>--Không--</em>
                </MenuItem>
                {addressItems.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Tỉnh/Thành phố"
                required
                value={currAddress?.city || ""}
                onChange={(e) =>
                  setCurrAddress({
                    ...currAddress,
                    city: e.target.value,
                    ward: "",
                  })
                }
                select
                defaultValue=""
                error={(errMsg != "" || addressInfo) && !currAddress?.city}
                fullWidth
                size="small"
                slotProps={{
                  select: {
                    MenuProps: {
                      slotProps: {
                        paper: {
                          style: {
                            maxHeight: 250,
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem disabled value="">
                  <em>--Tỉnh/Thành phố--</em>
                </MenuItem>
                {location.map((city) => (
                  <MenuItem key={city.name} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>{selectWards}</Grid>
            <Grid size={12}>
              <TextField
                placeholder="Địa chỉ nhận hàng"
                type="text"
                autoComplete="on"
                required
                onChange={(e) =>
                  setCurrAddress({ ...currAddress, address: e.target.value })
                }
                value={currAddress?.address}
                error={
                  ((errMsg != "" || addressInfo) && !currAddress?.address) ||
                  err?.data?.errors?.address
                }
                helperText={err?.data?.errors?.address}
                fullWidth
                size="small"
                multiline
                minRows={2}
                slotProps={{
                  inputComponent: TextareaAutosize,
                  inputProps: {
                    minRows: 2,
                    style: { resize: "auto" },
                  },
                  input: {
                    endAdornment: <HomeIcon style={{ color: "gray" }} />,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    disableRipple
                    disableFocusRipple
                    disabled={
                      selectTemp || addressInfo?.isDefault || isSelected
                    }
                    checked={selectDefault}
                    color="primary"
                    inputProps={{ "aria-label": "select" }}
                    onChange={() => setSelectDefault((prev) => !prev)}
                  />
                }
                label="Chọn làm địa chỉ mặc định"
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{
                justifyContent: { xs: "flex-start", sm: "flex-end" },
                display: "flex",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    disableRipple
                    disableFocusRipple
                    disabled={selectDefault}
                    checked={selectTemp}
                    color="primary"
                    inputProps={{ "aria-label": "select" }}
                    onChange={() => setSelectTemp((prev) => !prev)}
                  />
                }
                label={
                  addressInfo != null && addressInfo?.isDefault != null
                    ? "Chuyển về địa chỉ tạm thời"
                    : "Lưu địa chỉ tạm thời"
                }
              />
            </Grid>
            {addressInfo && !addressInfo?.isDefault && !isSelected && (
              <Grid size={{ xs: 12, sm: 5 }}>
                <Button
                  disabled={addressInfo?.isDefault || isSelected}
                  variant="contained"
                  color="error"
                  size="large"
                  fullWidth
                  onClick={() => handleClickRemove(addressInfo)}
                >
                  Xoá địa chỉ&nbsp;
                  <Delete />
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          size="large"
          sx={{ marginY: "10px" }}
          onClick={handleClose}
          startIcon={<CloseIcon />}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginY: "10px" }}
          onClick={handleSubmit}
          startIcon={<Check />}
        >
          Áp dụng
        </Button>
      </DialogActions>
    </>
  );
};

export default AddressForm;
