import * as React from 'react';
import axios from 'axios';
import { AuthContext } from "../App";


// Next we make an 'instance' of it
const instance = axios.create({
  // .. where we make our configurations
  baseURL: 'https://0a93865f.ap.ngrok.io'
  // baseURL: 'https://backend.harvestgen.org'
});

export default instance