import { StockGrid } from "./grid";
import { GridFrame } from "./grid-frame";

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <GridFrame>
        <StockGrid />
      </GridFrame>
    </div>
  );
}

export default App;
