import { Stocks } from "./stocks";
import "lytenyte-pro/grid-full.css";
import "lytenyte-pro/pill-manager.css";
import "lytenyte-pro/components.css";
import "./grid.css";

function App() {
  return (
    <div className="flex justify-center flex-1">
      <Stocks></Stocks>
    </div>
  );
}

export default App;
