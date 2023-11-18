import { useStateContext } from "../contexts/ContextProvider";

const Toast = () => {
  // debugger;
  const { toast, setToast } = useStateContext();
  // console.log(toast);
  return (
    <>
      {toast.show && (
        <div className="w-[300px] py-2 px-3 text-white rounded bg-emerald-500 fixed right-4 bottom-4 z-50">
          {toast.message}
        </div>
      )}
    </>
  );
};

export default Toast;
