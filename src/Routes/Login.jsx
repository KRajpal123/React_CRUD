import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useTranslation } from "react-i18next";
import axios from "axios";



const userApi = "https://shy-teal-goshawk-belt.cyclic.cloud/api/v1/movies";

const Login = () => {
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [openDeleteDialogBox, setOpenDeleteDialogBox] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [data, setData] = useState([]); // copy || storing more users data.
  const [gridAPi, setGridApi] = useState(null); // downloading grid-data
  const [seletedRowData, setSelectedRowData] = useState(null);
  const [apiData, setApiData] = useState([]);

  // language translations

  const { t } = useTranslation(["common", "login"]);
  const columDef = [
    { hearderName: t("Name"), field: "name", checkboxSelection: true },
    { hearderName: t("Email"), field: "duration" },
    {
      hearderName: t("price"),
      field: "price",
    },
  ];

  const defaultColmn = {
    filter: true,
    sortable: true,
    floatingFilter: true,
    flex: 1,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const exportData = () => {
    if (gridAPi) {
      gridAPi.exportDataAsCsv();
    } else {
      alert("error");
    }
  };

  const onBtnClick = (e) => {
    e.preventDefault();
    setOpenDialogBox(true);
  };

  const onBtnClose = (e) => {
    e.preventDefault();
    setOpenDialogBox(false);
    setOpenDeleteDialogBox(false)
  };

  const onChangeEventHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onBtnSave = (e) => {
    e.preventDefault();
    // Add formData to the data array
    setData((prevData) => [...prevData, formData]);

    // Clear the form fields
    setFormData({
      name: "",
      email: "",
      password: "",
    })
    setOpenDialogBox(false);
  };

  const handleSelection = () => {
    if (gridAPi) {
      const selected = gridAPi.getSelectedRows();
      setSelectedRowData(selected);
    }
  };

  // get data from api 
  useEffect(() => {
    axios
      .get(userApi)
      .then((response) => {
        const resp = response.data.data;
        setApiData(resp.movies)
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // confirmation delete fn;

  const onBtnDelete = (e) => {
    e.preventDefault();
    setOpenDeleteDialogBox(true)
  }


  return (
    <>
      <Container>
        <Grid container>
          <Grid item xs={3}>
            <Button variant="contained" onClick={onBtnClick}>
              {t("login:Add")}
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="error"
              disabled={!(seletedRowData && seletedRowData.length >= 1)}
              onClick={onBtnDelete}
            >
              {t("login:Delete")}
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="success"
              disabled={!(seletedRowData && seletedRowData.length >= 1)}
            >
              {t("login:Edit")}
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="secondary" onClick={exportData}>
              Download
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/*=========== add items dailog box ==============  */}
      <Dialog open={openDialogBox}>
        <form action="" onSubmit={onBtnSave}>
          <DialogTitle>{t("Create an Account")}</DialogTitle>
          <DialogContent style={{ padding: "4rem" }}>
            <Grid container>
              <Grid item xs={12}>
                <Input
                  placeholder={t("Name")}
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  value={formData.name}
                  name="name"
                  onChange={onChangeEventHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  placeholder={t("Email")}
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  value={formData.email}
                  name="email"
                  onChange={onChangeEventHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  placeholder={"Password"}
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  value={formData.password}
                  name="password"
                  onChange={onChangeEventHandler}
                  type="password"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onBtnClose}>Cancel</Button>
            <Button type="submit">{t("common:submit")}</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/*=============== delete confirmation Dialog box ========== */}
      <Dialog open={openDeleteDialogBox}>
        <DialogContent>Are you sure, do you want delete</DialogContent>
        <DialogActions>
          <Button onClick={onBtnClose}>Cancel</Button>
          <Button onClick={onBtnDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Grid container mt={5}>
        <Grid item xs={2}></Grid>
        <Grid
          item
          className="ag-theme-alpine"
          style={{ width: 500, height: 500 }}
          xs={8}
        >
          <AgGridReact
            rowData={apiData}
            columnDefs={columDef}
            defaultColDef={defaultColmn}
            onGridReady={onGridReady}
            onSelectionChanged={handleSelection}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </>
  );
};

export default Login;
