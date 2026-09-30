import { Header } from "./components/Header";
import { Profile } from "./components/Profile";
import { Timeline } from "./components/Timeline";

function App() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-[#f6f4ef] px-8 text-[#2b2b2b]">
      <Header />
      <Profile />
      <Timeline />
    </main>
  );
}

export default App;
