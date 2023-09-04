import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  return (
    <>
      <div>Main</div>
      <Button onClick={() => navigate("/")}>랜딩 페이지로 이동</Button>
    </>
  );
}

export default Main;
