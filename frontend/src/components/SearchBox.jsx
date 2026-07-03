import { useState } from "react";
import { Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="search-form">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search..."
        className="search-input"
      ></Form.Control>
      <button type="submit" className="search-btn">
        <FaSearch />
      </button>
    </Form>
  );
};

export default SearchBox;
