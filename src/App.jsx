import { Button } from "@material-tailwind/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="font-primary bg-[#0E0E0E] text-white w-full h-full min-h-screen">
      <Suspense
        fallback={
          <div className="w-full h-full min-h-dvh grid place-content-center">
            <Button
              className="bg-transparent text-white font-primary normal-case text-sm"
              loading={true}
            >
              Loading...
            </Button>
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
};

export default App;
