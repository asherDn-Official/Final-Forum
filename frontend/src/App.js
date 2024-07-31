//import { useEffect } from "react";
import axios from "axios";
import Router from "./Router";

import { AuthContextProvider } from "./Components/context/authcontext";
//import Popup from "./Components/Popup";
//import Example from "./Components/Popup";

axios.defaults.withCredentials = true;
function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>
      {/* <Popup /> */}
      {/* <Example /> */}
    </div>
  );
}

export default App;
