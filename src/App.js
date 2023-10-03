import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Routes
import Home from "./Routes/Home";
import Navbar from "./Routes/Navbar";
import { Grid } from "@mui/material";
import Login from "./Routes/Login";
const App = () => {
  return (
    <>
       <Suspense fallback={"Loading..."}>   {/*if translation is pending...., shows loading  */}
        <Grid container>
          <Grid item xs={12}>
            <Navbar />
          </Grid>
        </Grid>
        <Grid container sx={{ mt: 5, mb: 5 }}>
          <Grid item xs={12}>
            <Routes>
              <Route path="/Home" element={<Home />} />
              <Route path="/Login" element={<Login />} />
            </Routes>
          </Grid>
        </Grid>
      </Suspense>
    </>
  );
};

export default App;
