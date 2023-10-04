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
  const [openEditDailogBox, setOpenEditDailogBox] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
  });
  const [gridAPi, setGridApi] = useState(null); // downloading grid-data
  const [seletedRowData, setSelectedRowData] = useState(null);
  const [apiData, setApiData] = useState([]);


  // language translations

  const { t } = useTranslation(["common", "login"]);
  const columDef = [
    { field: "name", checkboxSelection: true },
    { field: "duration" },
    {
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

  // add dailog open
  const onBtnClick = (e) => {
    e.preventDefault();
    setOpenDialogBox(true);
  };

  // add dailog close
  const onBtnClose = (e) => {
    e.preventDefault();
    setOpenDialogBox(false);
    setOpenDeleteDialogBox(false);
    setSelectedRowData(null);
    setOpenEditDailogBox(false);
  };

  const onChangeEventHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // post user inputs
  const onBtnSave = (e) => {
    e.preventDefault();
    axios.post(userApi,
      formData
    ).then((resp) => {
      console.log(resp, 'succ');
      getData();
      // Clear the form fields
      setFormData({
        name: "",
        duration: "",
        price: "",
      })
      setOpenDialogBox(false);

    }).catch((err) => {
      console.log(err);
    });
  };

  const handleSelection = () => {
    if (gridAPi) {
      const selected = gridAPi.getSelectedRows();
      setSelectedRowData(selected);
    }
  };
  console.log(seletedRowData);

  // get data from api 
  const getData = () => {
    console.log('get data called')
    axios
      .get(userApi)
      .then((response) => {
        const resp = response.data.data;
        setApiData(resp.movies)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getData();
  }, []);


  // confirmation delete fn;
  const onBtnDelete = (e) => {
    e.preventDefault();
    setOpenDeleteDialogBox(true)
  }

  // deleted item fn
  const confirmDelete = () => {
    const userSelectedRowId = seletedRowData[0]._id;
    axios.delete(`${userApi}/${userSelectedRowId}`)
      .then((resp) => {
        console.log(resp, 'succ');
        setOpenDeleteDialogBox(false);
        setSelectedRowData(null);
        getData();
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  // on edit fn dailog

  const onEditDailogBox = () => {
    if (seletedRowData && seletedRowData.length === 1) {
      setOpenEditDailogBox(true)
    }
    else {
      console.log("select the one row data to edit / view")
    }
  }

  // onEdit save fn
  const onEditSave = (e) => {
    e.preventDefault();
    const editRowData = seletedRowData[0]._id;
    console.log('FORM DTA', editRowData)
    axios.patch(`${userApi}/${editRowData}`, formData)
      .then((res) => {
        console.log("success", res.data, res.status);
        if(res.status === 200){
          getData();
        }
       
      })
      .catch((err) => {
        console.log(err);
      })

    setOpenEditDailogBox(false);
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
              onClick={onEditDailogBox}
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

      {/*=========== add inputs dailog box ==============  */}
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
                  placeholder={t("Duration")}
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  value={formData.duration}
                  name="duration"
                  onChange={onChangeEventHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  placeholder={"Price"}
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  value={formData.price}
                  name="price"
                  onChange={onChangeEventHandler}
                  type="number"
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
          <Button onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/*=========== edit inputs dailog box ==============  */}
      <Dialog open={openEditDailogBox}>
        <form action="" onSubmit={onEditSave}>
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
                  defaultValue={
                    seletedRowData
                      && seletedRowData.length === 1
                      && seletedRowData[0].name ?
                      seletedRowData[0].name : "N/A"
                  }
                  name="name"
                  onChange={onChangeEventHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  placeholder={t("Duration")}
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  defaultValue={
                    seletedRowData
                      && seletedRowData.length === 1
                      && seletedRowData[0].duration ?
                      seletedRowData[0].duration : "N/A"
                  }
                  name="duration"
                  onChange={onChangeEventHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  placeholder={"Price"}
                  sx={{
                    backgroundColor: "white",
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  defaultValue={
                    seletedRowData
                      && seletedRowData.length === 1
                      && seletedRowData[0].price ?
                      seletedRowData[0].price : "N/A"
                  }
                  name="price"
                  onChange={onChangeEventHandler}
                  type="number"
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
