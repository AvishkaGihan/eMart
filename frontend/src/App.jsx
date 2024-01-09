import { Container } from "react-bootstrap";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <h1>Welcome to ProShop</h1>
        </Container>
      </main>
    </>
  );
}

export default App;
