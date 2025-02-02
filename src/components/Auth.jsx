import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Checkbox, Container, FormControlLabel, TextField, Typography, Box, Grid2 as Grid, Link, Paper } from "@mui/material";
import Icon from '../favicon.ico';
import API from '../config';

const AuthPage = ({ isSignUp }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userDetails = {
      username: data.get("username"),
      password: data.get("password"),
    };

    try {
      if(isSignUp) {
        await axios.post(API.BASE_URL(`/signup`), userDetails);
        navigate("/auth");
      } else {
        await axios.post(API.BASE_URL(`/login`), userDetails, { withCredentials: true });
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, mt: 8 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "whitesmoke" }}>
            <img src={Icon} width={25} height={30} alt="Icon" />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete={isSignUp ? "new-password" : "current-password"} />
            {!isSignUp && <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" />}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <Grid container justifyContent="space-between">
              {!isSignUp && (
                <Grid item>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              )}
            </Grid>
            <Grid container justifyContent="center" sx={{mt: 2}}>
              { !isSignUp ? "Don't have an account?" : "Already have an account?" }
              <Button onClick={() => { isSignUp ? navigate("/login") : navigate("/signup")}} fullWidth variant="text">
                { !isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
