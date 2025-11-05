import { useState } from "react";
import { StockGrid } from "./grid";

function App() {
  const [resetKey, setResetKey] = useState(1);
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <StockGrid
        key={resetKey}
        onReset={() => setResetKey((prev) => prev + 1)}
      />
    </div>
  );
}

export default App;
