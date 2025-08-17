import { DemoContracts } from "./_components/DebugContracts"; 
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Demo Contracts",
  description: "Demo contracts for the VibeFlow app",
});

const demo: NextPage = () => {
  return (
    <>
      <DemoContracts />  {/* Changed from <demoContracts /> to <DemoContracts /> */}
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Demo Contracts</h1>  {/* Also fixed the title casing */}
        <p className="text-neutral">
          You can demo & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / app / demo / page.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default demo;