import "./App.css";
import { WeatherApp } from "./Components/WeatherApp/WeatherApp";

function App() {
  return (
    <div className="App">
      <WeatherApp />
      <iframe
        title="panel"
        src="http://localhost:3000/d-solo/8jXBdLfIk/flespi-dashboard?orgId=1&refresh=5s&from=1715030967116&to=1715117367117&var-Vehicle=TOUAREG%20%235619757&panelId=4"
        width="450"
        height="200"
        frameborder="0"
      ></iframe>
    </div>
  );
}

export default App;
