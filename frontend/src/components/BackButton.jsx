import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";


const BackButton = ({ onClick }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={onClick ?? (() => navigate(-1))}
      className="btn-nav"
    >
      <MdArrowBack size={16} /> Back
    </button>
  );
};

export default BackButton;
