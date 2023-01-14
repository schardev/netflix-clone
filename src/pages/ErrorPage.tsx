import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <>
      <div>
        Congratulations you have discovered a bug. Please report with the error
        message as below:
      </div>
      <div>{(error as any).status}</div>
      <div>{(error as any).statusText}</div>
      <div>{(error as any).message}</div>
    </>
  );
};

export default ErrorPage;
