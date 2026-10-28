import { useNavigate } from "react-router-dom";

// Back that really goes back: pops the history entry when there is one, otherwise (page
// opened directly / refreshed with no in-app history) replaces with `fallback`.
// React Router keeps its own index in history.state.idx (0 = first in-app entry).
const useGoBack = () => {
  const navigate = useNavigate();
  return (fallback = "/home") => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  };
};

export default useGoBack;
