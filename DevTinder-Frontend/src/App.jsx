import { BrowserRouter,Routes,Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Body from "./components/Body"
import Login from "./components/Login"
import Profile from "./components/Profile"
import { Provider} from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./components/Feed"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import Premium from "./components/Premium"
import PremiumRazorpay from "./components/PremiumRazorpay"
import Chat from "./components/Chat"

function App() {
  

  return (
    <>
<Provider store={appStore}>
<BrowserRouter basename="/">
    <Routes>
        <Route path="/" element={<Body  />}>
          <Route path="/" element={<Feed  />} />
          <Route path="/login" element={<Login  />} />
          <Route path="/profile" element={<Profile  />} />
          <Route path="/connections" element={<Connections  />} />
          <Route path="/requests" element={< Requests />} />
          {/* <Route path="/premium" element={< Premium />} /> */}
          <Route path="/premium" element={< PremiumRazorpay />} />
          <Route path="/chat/:targetUserId" element={< Chat />} />
        </Route>
    
    </Routes>
</BrowserRouter>
</Provider>
    </>
  )
}

export default App
